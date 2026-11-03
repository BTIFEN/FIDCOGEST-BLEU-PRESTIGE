/** No HTTP interface: envelopes arrive only through the hosting private filesystem. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { StoredUser } from './db';
import { assertPrivateStorageDirectory } from './privateStorage';
import { encryptData, decryptData, generateTotpCode } from './security';

export interface BootstrapRequest { version: 1; id: string; expiresAt: number; publicKey: string }
export function sealEnrollment(request: BootstrapRequest, payload: object): string {
  const key = crypto.randomBytes(32), iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(request.id));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload)), cipher.final()]);
  return JSON.stringify({ version: 1, id: request.id,
    key: crypto.publicEncrypt({ key: request.publicKey, oaepHash: 'sha256' }, key).toString('base64'),
    iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ciphertext: ciphertext.toString('base64') });
}

function readPrivate(file: string): string {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 32768 || (stat.mode & 0o077)) throw new Error('Private file required');
  const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try { return fs.readFileSync(fd, 'utf8'); } finally { fs.closeSync(fd); }
}

export function runPrivateBootstrap(database: { getUsers(): StoredUser[]; saveUser(user: StoredUser): void }): string {
  if (process.env.FIDCOGEST_BOOTSTRAP_MODE !== 'file-v1') return 'disabled';
  assertPrivateStorageDirectory();
  const root = path.join(process.env.PERSISTENT_STORAGE_DIR!, 'admin-bootstrap');
  if (database.getUsers().length) return 'closed';
  fs.mkdirSync(root, { recursive: true, mode: 0o700 });
  const stat = fs.lstatSync(root);
  if (!stat.isDirectory() || stat.isSymbolicLink() || (stat.mode & 0o077)) throw new Error('Private directory required');
  const used = path.join(root, 'consumed.json');
  if (fs.existsSync(used)) return 'closed';
  // Single writer; an interrupted attempt requires private operator inspection, never automatic replay.
  const lock = path.join(root, 'lock');
  try { fs.mkdirSync(lock, { mode: 0o700 }); } catch { return 'locked'; }
  try {
    const requestFile = path.join(root, 'request.json');
    const keyFile = path.join(root, 'key.enc.json');
    const envelopeFile = path.join(root, 'enrollment.enc.json');
    if (!fs.existsSync(requestFile)) {
      if (fs.existsSync(keyFile) || fs.existsSync(envelopeFile)) throw new Error('Incomplete bootstrap state');
      const pair = crypto.generateKeyPairSync('rsa', { modulusLength: 3072,
        publicKeyEncoding: { type: 'spki', format: 'pem' }, privateKeyEncoding: { type: 'pkcs8', format: 'pem' } });
      const request: BootstrapRequest = { version: 1, id: crypto.randomBytes(32).toString('hex'),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, publicKey: pair.publicKey };
      fs.writeFileSync(keyFile, JSON.stringify(encryptData(pair.privateKey)), { flag: 'wx', mode: 0o600 });
      fs.writeFileSync(requestFile, JSON.stringify(request), { flag: 'wx', mode: 0o600 });
      return 'awaiting-owner';
    }
    const request: BootstrapRequest = JSON.parse(readPrivate(requestFile));
    if (request.version !== 1 || !/^[a-f0-9]{64}$/.test(request.id) || !Number.isFinite(request.expiresAt) || request.expiresAt <= Date.now()) return 'expired';
    if (!fs.existsSync(envelopeFile)) return 'awaiting-owner';
    const envelope = JSON.parse(readPrivate(envelopeFile));
    if (envelope.version !== 1 || envelope.id !== request.id) throw new Error('Wrong request');
    const privateKey = decryptData(JSON.parse(readPrivate(keyFile)));
    const key = crypto.privateDecrypt({ key: privateKey, oaepHash: 'sha256' }, Buffer.from(envelope.key, 'base64'));
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv, 'base64'));
    decipher.setAAD(Buffer.from(request.id));
    decipher.setAuthTag(Buffer.from(envelope.tag, 'base64'));
    const payload = JSON.parse(Buffer.concat([decipher.update(Buffer.from(envelope.ciphertext, 'base64')), decipher.final()]).toString('utf8'));
    const now = Date.now();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) || payload.email.length > 254 ||
        !/^[a-f0-9]{128}$/.test(payload.passwordHash) || !/^[a-f0-9]{32}$/.test(payload.passwordSalt) ||
        !/^[A-Z2-7]{32}$/.test(payload.mfaSecret) || !Number.isFinite(payload.enrolledAt) ||
        payload.enrolledAt > now + 30000 || now - payload.enrolledAt > 15 * 60 * 1000 ||
        !/^\d{6}$/.test(payload.proof) || generateTotpCode(payload.mfaSecret, payload.enrolledAt) !== payload.proof ||
        !Array.isArray(payload.recoveryCodesHashed) || payload.recoveryCodesHashed.length !== 10 || new Set(payload.recoveryCodesHashed).size !== 10 ||
        !payload.recoveryCodesHashed.every((value: unknown) => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value))) throw new Error('Invalid enrollment');
    if (database.getUsers().length) return 'closed';
    fs.writeFileSync(used, JSON.stringify({ consumedAt: new Date().toISOString() }), { flag: 'wx', mode: 0o600 });
    database.saveUser({ id: 'admin-' + crypto.randomUUID(), email: payload.email.trim().toLowerCase(),
      fullName: 'Administrateur FIDCOGEST', role: 'admin', assignedCompanyIds: [], status: 'actif',
      mfaEnabled: true, mfaSecretEncrypted: encryptData(payload.mfaSecret), recoveryCodesHashed: payload.recoveryCodesHashed,
      passwordHash: payload.passwordHash, passwordSalt: payload.passwordSalt, createdAt: new Date().toISOString() });
    for (const file of [keyFile, envelopeFile, requestFile]) fs.unlinkSync(file);
    return 'created';
  } finally { fs.rmdirSync(lock); }
}
