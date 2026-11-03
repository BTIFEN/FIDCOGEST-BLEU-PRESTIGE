import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type express from 'express';
import { DATA_DIRECTORY } from './db';
import { encryptData, decryptData } from './security';
import { storeEncryptedFile, retrieveDecryptedFile, type StoredVaultFile } from './vault';
import { isPrivateStorageConfigured } from './privateStorage';

export type StorageProviderName = 'hostinger' | 'google_drive';
type LocationPreference = { provider: StorageProviderName; folderId?: string };
type StorageSettings = {
  defaultStorage: LocationPreference;
  companyOverrides: Record<string, LocationPreference>;
  google: { encryptedRefreshToken?: ReturnType<typeof encryptData>; email?: string };
};

const settingsFile = path.join(DATA_DIRECTORY, 'storage-settings.json');
const oauthStates = new Map<string, { expiresAt: number; verifier: string }>();
const oauthCookie = 'fidcogest_drive_oauth';
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV !== 'test', sameSite: 'lax' as const, path: '/api/portal/storage/google/callback' });
const scopes = 'https://www.googleapis.com/auth/drive.file';
const clientId = () => process.env.GOOGLE_OAUTH_CLIENT_ID || '';
const clientSecret = () => process.env.GOOGLE_OAUTH_CLIENT_SECRET || '';
const redirectUri = () => process.env.GOOGLE_OAUTH_REDIRECT_URI || '';
const googleReady = () => !!(clientId() && clientSecret() && redirectUri());
const validFolderId = (id: string) => /^[\w-]{10,180}$/.test(id);

function defaultSettings(): StorageSettings {
  return { defaultStorage: { provider: 'hostinger' }, companyOverrides: {}, google: {} };
}

function loadSettings(): StorageSettings {
  if (!fs.existsSync(settingsFile)) return defaultSettings();
  const parsed = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
  return {
    defaultStorage: parsed.defaultStorage || { provider: 'hostinger' },
    companyOverrides: parsed.companyOverrides || {},
    google: parsed.google || {}
  };
}

function saveSettings(settings: StorageSettings) {
  if (!isPrivateStorageConfigured()) throw new Error('PERSISTENT_STORAGE_DIR doit être configuré avant de modifier le stockage.');
  fs.mkdirSync(DATA_DIRECTORY, { recursive: true, mode: 0o700 });
  const tmp = settingsFile + '.' + crypto.randomBytes(8).toString('hex') + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(settings), { encoding: 'utf8', mode: 0o600, flag: 'wx' });
  fs.renameSync(tmp, settingsFile);
  fs.chmodSync(settingsFile, 0o600);
}

function publicSettings(settings: StorageSettings) {
  return {
    defaultStorage: settings.defaultStorage,
    companyOverrides: settings.companyOverrides,
    googleConnected: !!settings.google.encryptedRefreshToken,
    googleEmail: settings.google.email || null,
    oauthConfigured: googleReady(),
    hostingerConfigured: isPrivateStorageConfigured()
  };
}

async function googleToken(settings: StorageSettings): Promise<string> {
  if (!googleReady() || !settings.google.encryptedRefreshToken) throw new Error('Google Drive non connecté.');
  const refreshToken = decryptData(settings.google.encryptedRefreshToken).toString('utf8');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId(), client_secret: clientSecret(),
      refresh_token: refreshToken, grant_type: 'refresh_token'
    })
  });
  const json: any = await response.json();
  if (!response.ok || !json.access_token) throw new Error('Connexion Drive expirée ou révoquée.');
  return json.access_token;
}

async function driveRequest(token: string, url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: 'Bearer ' + token, ...init.headers }
  });
  if (!response.ok) {
    throw new Error('Google Drive a refusé l’opération (' + response.status + ').');
  }
  return response;
}

async function folderInfo(token: string, folderId: string): Promise<{id:string;name:string}> {
  if (!validFolderId(folderId)) throw new Error('Identifiant de dossier Drive invalide.');
  const params = '?fields=id,name,mimeType,trashed,capabilities(canAddChildren)';
  const res = await driveRequest(token, 'https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(folderId) + params);
  const file: any = await res.json();
  if (file.trashed || file.mimeType !== 'application/vnd.google-apps.folder' || !file.capabilities?.canAddChildren) {
    throw new Error('Dossier inaccessible ou sans autorisation d’écriture.');
  }
  return {id:file.id,name:file.name};
}

function selectedLocation(settings: StorageSettings, companyId: string): LocationPreference {
  return settings.companyOverrides[companyId] || settings.defaultStorage;
}

function mimeFromName(name: string) {
  return name.toLowerCase().endsWith('.pdf') ? 'application/pdf'
    : name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
}

export async function savePortalDocument(companyId: string, filename: string, buffer: Buffer): Promise<StoredVaultFile & {provider:StorageProviderName}> {
  if (!isPrivateStorageConfigured()) throw new Error('Stockage privé non configuré : dépôt désactivé.');
  const settings = loadSettings();
  const dest = selectedLocation(settings, companyId);
  if (dest.provider === 'hostinger') {
    if (!isPrivateStorageConfigured()) throw new Error('Stockage Hostinger non persistant : dépôt désactivé.');
    return { ...(storeEncryptedFile(companyId, filename, buffer)), provider: 'hostinger' };
  }
  if (!dest.folderId) throw new Error('Dossier de destination Google Drive non choisi.');
  const token = await googleToken(settings);
  await folderInfo(token, dest.folderId);
  const docId = 'doc-' + crypto.randomUUID();
  const sha256Checksum = crypto.createHash('sha256').update(buffer).digest('hex');
  const record = {
    docId, companyId, originalFilename: filename,
    sha256Checksum, fileSizeBytes: buffer.length,
    encryptedAt: new Date().toISOString(), payload: encryptData(buffer)
  };
  const binary = Buffer.from(JSON.stringify(record), 'utf8');
  const boundary = 'fidco' + crypto.randomBytes(12).toString('hex');
  const meta = { name: docId + '.enc', mimeType: 'application/octet-stream', parents: [dest.folderId], description: 'FIDCOGEST encrypted document' };
  const prefix = Buffer.from('--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(meta) + '\r\n--' + boundary + '\r\nContent-Type: application/octet-stream\r\n\r\n');
  const suffix = Buffer.from('\r\n--' + boundary + '--\r\n');
  const body = Buffer.concat([prefix,binary,suffix]);
  const res = await driveRequest(token, 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
    method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + boundary }, body
  });
  const uploaded: any = await res.json();
  if (!uploaded.id) throw new Error('Aucun identifiant reçu après l’envoi Drive.');
  return { docId, storagePath: 'gdrive:' + uploaded.id, sha256Checksum, fileSizeBytes: buffer.length, provider: 'google_drive' };
}

export async function readPortalDocument(storagePath: string) {
  if (!storagePath.startsWith('gdrive:')) return retrieveDecryptedFile(storagePath);
  const fileId = storagePath.slice('gdrive:'.length);
  if (!validFolderId(fileId)) throw new Error('Identifiant de fichier invalide.');
  const token = await googleToken(loadSettings());
  const res = await driveRequest(token, 'https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(fileId) + '?alt=media');
  const raw: any = JSON.parse(Buffer.from(await res.arrayBuffer()).toString('utf8'));
  const decrypted = decryptData(raw.payload);
  const checksum = crypto.createHash('sha256').update(decrypted).digest('hex');
  if (raw.sha256Checksum !== checksum) throw new Error('Intégrité du document incorrecte.');
  return { originalFilename: raw.originalFilename, buffer: decrypted, sha256Checksum: checksum };
}

export function registerStorageAdminRoutes(
  app: express.Express,
  authenticate: (req: express.Request) => { user: { id: string; role: string }} | null,
  getCompanyById: (id: string) => unknown
) {
  const router = app;
  const admin = (req: express.Request, res: express.Response): boolean => {
    res.setHeader('Cache-Control', 'no-store');
    const auth = authenticate(req);
    if (auth?.user.role !== 'admin') {
      res.status(403).json({error:'Accès réservé à l’administrateur du cabinet.'});
      return false;
    }
    return true;
  };
  router.get('/api/portal/admin/storage', (req,res) => {
    if (!admin(req,res)) return;
    try {res.json(publicSettings(loadSettings()));} catch {res.status(500).json({error:'Configuration de stockage indisponible.'});}
  });
  router.put('/api/portal/admin/storage', async (req,res) => {
    if (!admin(req,res)) return;
    const { companyId, provider, folderId } = req.body || {};
    if (provider !== 'hostinger' && provider !== 'google_drive') return res.status(400).json({error:'Fournisseur invalide.'});
    if (companyId !== undefined && (typeof companyId !== 'string' || !getCompanyById(companyId))) {
      return res.status(400).json({error:'Entreprise inconnue.'});
    }
    try {
      const settings = loadSettings();
      const location: LocationPreference = {provider};
      if (provider === 'google_drive') {
        if (typeof folderId !== 'string') return res.status(400).json({error:'Dossier Google Drive requis.'});
        const token = await googleToken(settings);
        await folderInfo(token, folderId);
        location.folderId = folderId;
      } else if (!isPrivateStorageConfigured()) {
        return res.status(503).json({error:'Stockage Hostinger privé persistant non configuré.'});
      }
      if (companyId) settings.companyOverrides[companyId] = location;
      else settings.defaultStorage = location;
      saveSettings(settings);
      res.json(publicSettings(settings));
    } catch (e:any) {res.status(503).json({error: e.message || 'Enregistrement impossible.'});}
  });
  router.delete('/api/portal/admin/storage/companies/:companyId', (req,res) => {
    if (!admin(req,res)) return;
    if (!getCompanyById(req.params.companyId)) return res.status(404).json({error:'Entreprise inconnue.'});
    try {
      const settings = loadSettings();
      delete settings.companyOverrides[req.params.companyId];
      saveSettings(settings);
      res.json(publicSettings(settings));
    } catch(e:any) {res.status(503).json({error:e.message});}
  });
  router.get('/api/portal/admin/storage/google/authorize', (req,res) => {
    if (!admin(req,res)) return;
    if (!googleReady() || !isPrivateStorageConfigured()) return res.status(503).json({error:'OAuth ou stockage persistant non configuré.'});
    const state = crypto.randomBytes(32).toString('hex');
    for (const [key, pending] of oauthStates) if (pending.expiresAt < Date.now()) oauthStates.delete(key);
    const verifier = crypto.randomBytes(32).toString('base64url');
    oauthStates.set(state, {expiresAt:Date.now()+5*60_000, verifier});
    res.cookie(oauthCookie, state, {...cookieOptions(), maxAge:5*60_000});
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.search = new URLSearchParams({client_id:clientId(), redirect_uri:redirectUri(), response_type:'code', scope:scopes, access_type:'offline', prompt:'consent', state, code_challenge:crypto.createHash('sha256').update(verifier).digest('base64url'), code_challenge_method:'S256'}).toString();
    res.json({url:url.toString()});
  });
  router.get('/api/portal/storage/google/callback', async(req,res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    const state = typeof req.query.state === 'string' ? req.query.state : '';
    const code = typeof req.query.code === 'string' ? req.query.code : '';
    const pending = oauthStates.get(state);
    const browserState = (req.headers.cookie || '').split(';').map(s=>s.trim()).find(s=>s.startsWith(oauthCookie+'='))?.slice(oauthCookie.length+1);
    if (!pending || pending.expiresAt < Date.now() || browserState !== state || !code || !googleReady() || !isPrivateStorageConfigured()) {
      return res.status(400).type('text/plain').send('Autorisation expirée ou invalide.');
    }
    oauthStates.delete(state);
    res.clearCookie(oauthCookie, cookieOptions());
    try {
      const result = await fetch('https://oauth2.googleapis.com/token', {
        method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({client_id:clientId(),client_secret:clientSecret(),redirect_uri:redirectUri(),grant_type:'authorization_code',code,code_verifier:pending.verifier})
      });
      const tokens:any = await result.json();
      if (!result.ok || !tokens.refresh_token) throw new Error('Aucun jeton de renouvellement reçu.');
      const settings = loadSettings();
      settings.google.encryptedRefreshToken = encryptData(tokens.refresh_token);
      const about = await driveRequest(tokens.access_token,'https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)');
      settings.google.email = (await about.json() as any)?.user?.emailAddress || undefined;
      saveSettings(settings);
      return res.type('text/html').send('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Drive connecté</title><body><h2>Google Drive connecté à FIDCOGEST.</h2><p>Retournez à l’administration FIDCOGEST et actualisez les paramètres de stockage.</p></body></html>');
    } catch {
      return res.status(503).type('text/plain').send('Connexion Google impossible. Vérifiez les autorisations OAuth.');
    }
  });
  router.get('/api/portal/admin/storage/google/picker-session', async(req,res) => {
    if (!admin(req,res)) return;
    const apiKey = process.env.GOOGLE_PICKER_API_KEY || '';
    const appId = process.env.GOOGLE_CLOUD_PROJECT_NUMBER || '';
    if (!apiKey || !/^\d+$/.test(appId)) return res.status(503).json({error:'Google Picker non configuré.'});
    try {
      const accessToken = await googleToken(loadSettings());
      res.setHeader('Cache-Control','no-store');
      res.json({accessToken,apiKey,appId});
    } catch (e:any) {res.status(503).json({error:e.message || 'Google Drive non connecté.'});}
  });
  router.get('/api/portal/admin/storage/google/folders', async(req,res) => {
    if (!admin(req,res)) return;
    try {
      const token = await googleToken(loadSettings());
      // drive.file lists folders the application created or that Google has explicitly authorized.
      const params = new URLSearchParams({q:"mimeType = 'application/vnd.google-apps.folder' and trashed = false",fields:'nextPageToken,files(id,name,parents)',page_size:'100'});
      params.delete('page_size');params.set('pageSize','100');
      const response = await driveRequest(token,'https://www.googleapis.com/drive/v3/files?'+params);
      res.json(await response.json());
    } catch(e:any) {res.status(503).json({error:e.message});}
  });
  router.post('/api/portal/admin/storage/google/folders', async(req,res) => {
    if (!admin(req,res)) return;
    const name = typeof req.body?.name==='string' ? req.body.name.trim() : '';
    if (!name || name.length > 100 || /[\\/]/.test(name)) return res.status(400).json({error:'Nom de dossier invalide.'});
    try {
      const token = await googleToken(loadSettings());
      const result = await driveRequest(token,'https://www.googleapis.com/drive/v3/files?fields=id,name', {
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,mimeType:'application/vnd.google-apps.folder'})
      });
      res.status(201).json(await result.json());
    }catch(e:any){res.status(503).json({error:e.message});}
  });
}
