import React, { useCallback, useEffect, useState } from 'react';
import { usePortal } from '../../context/PortalContext';

type Location = { provider: 'hostinger' | 'google_drive'; folderId?: string };
type Settings = {
  defaultStorage: Location;
  companyOverrides: Record<string, Location>;
  googleConnected: boolean;
  googleEmail: string | null;
  oauthConfigured: boolean;
  hostingerConfigured: boolean;
};
type Folder = {id:string;name:string};

export const StorageAdminView: React.FC = () => {
  const { sessionToken, companies } = usePortal();
  const [config, setConfig] = useState<Settings|null>(null);
  const [companyId, setCompanyId] = useState('');
  const [provider, setProvider] = useState<Location['provider']>('hostinger');
  const [folderId, setFolderId] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState('FIDCOGEST-TEST');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const call = useCallback(async (endpoint: string, init: RequestInit = {}) => {
    if (!sessionToken) throw new Error('Session administrateur requise.');
    const res = await fetch('/api/portal/admin/storage' + endpoint, {
      ...init,
      headers: { Authorization: 'Bearer ' + sessionToken, 'Content-Type': 'application/json', ...init.headers }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Opération impossible.');
    return data;
  }, [sessionToken]);

  const refresh = useCallback(async () => {
    try {
      const result:Settings = await call('');
      setConfig(result);
      setError('');
    } catch(e:any) {setError(e.message);}
  }, [call]);

  const refreshFolders = useCallback(async () => {
    try {
      const data = await call('/google/folders');
      setFolders(data.files || []);
      setError('');
    } catch(e:any) {setError(e.message);}
  }, [call]);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {if(config?.googleConnected) void refreshFolders();}, [config?.googleConnected,refreshFolders]);
  useEffect(() => {
    if (!config) return;
    const selected = companyId ? config.companyOverrides[companyId] || config.defaultStorage : config.defaultStorage;
    setProvider(selected.provider);
    setFolderId(selected.folderId || '');
  }, [companyId,config]);

  const save = async () => {
    setBusy(true);setError('');setMessage('');
    try {
      const data = await call('', {method:'PUT',body:JSON.stringify({ ...(companyId ? {companyId} : {}), provider, ...(provider === 'google_drive' ? {folderId} : {}) })});
      setConfig(data);
      setMessage('Destination enregistrée. Ce choix concerne uniquement les nouveaux documents.');
    } catch(e:any) {setError(e.message);} finally {setBusy(false);}
  };
  const connectGoogle = async () => {
    setBusy(true);setError('');
    try {
      const data = await call('/google/authorize');
      if (!data.url) throw new Error('Aucune autorisation disponible.');
      window.location.assign(data.url);
    } catch(e:any) {setError(e.message);setBusy(false);}
  };
  const chooseExistingDriveFolder = async () => {
    setBusy(true);setError('');
    try {
      const session = await call('/google/picker-session');
      const scriptId = 'fidcogest-google-picker-loader';
      if (!(window as any).gapi?.load) {
        await new Promise<void>((resolve,reject)=>{
          const old = document.getElementById(scriptId);
          if (old) {old.remove();}
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Impossible de charger Google Picker.'));
          document.head.appendChild(script);
        });
      }
      await new Promise<void>((resolve,reject)=>{
        const gapi = (window as any).gapi;
        if (!gapi?.load) return reject(new Error('Bibliothèque Google Picker indisponible.'));
        gapi.load('picker', {callback:resolve,onerror:()=>reject(new Error('Picker indisponible.'))});
      });
      const google = (window as any).google;
      const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setIncludeFolders(true)
        .setMimeTypes('application/vnd.google-apps.folder')
        .setSelectFolderEnabled(true)
        .setMode(google.picker.DocsViewMode.LIST);
      const picker = new google.picker.PickerBuilder()
        .setDeveloperKey(session.apiKey)
        .setAppId(session.appId)
        .setOAuthToken(session.accessToken)
        .setOrigin(window.location.origin)
        .setTitle('Choisir le dossier FIDCOGEST')
        .addView(view)
        .setCallback((data:any)=>{
          if(data.action === google.picker.Action.PICKED) {
            const doc = data.docs?.[0];
            if(doc?.id) {
              setFolderId(doc.id);
              setFolders(prev=>prev.some(f=>f.id===doc.id)?prev:[...prev,{id:doc.id,name:doc.name||'Dossier choisi'}]);
              setMessage('Dossier sélectionné. Cliquez sur Enregistrer pour confirmer.');
            }
          }
        })
        .build();
      picker.setVisible(true);
    } catch (e:any) {setError(e.message || 'Sélection Google impossible.');}
    finally {setBusy(false);}
  };
  const createFolder = async () => {
    setBusy(true);setError('');
    try {
      const data:Folder = await call('/google/folders', {method:'POST',body:JSON.stringify({name:folderName})});
      await refreshFolders();
      setFolderId(data.id);
      setMessage('Dossier créé. Cliquez sur Enregistrer pour l’utiliser.');
    } catch(e:any) {setError(e.message);} finally {setBusy(false);}
  };
  const resetOverride = async () => {
    if(!companyId) return;
    setBusy(true);setError('');
    try {
      const data = await call('/companies/' + encodeURIComponent(companyId), {method:'DELETE'});
      setConfig(data);setMessage('Cette entreprise utilise à nouveau le choix par défaut.');
    } catch(e:any) {setError(e.message);} finally {setBusy(false);}
  };

  return <section className="rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-[#E8E6DF] space-y-5 text-[#142B45]">
    <div>
      <h3 className="font-serif text-xl font-bold">Stockage documentaire</h3>
      <p className="text-sm text-[#4B5563]">Choisissez Hostinger ou Google Drive. Les clients ne voient pas ce paramètre.</p>
    </div>
    {error && <p role="alert" className="rounded-lg bg-red-50 text-red-800 p-3 text-sm">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-emerald-50 text-emerald-900 p-3 text-sm">{message}</p>}
    {!config ? <p>Chargement de la configuration…</p> : <>
      <div className="rounded-lg bg-[#F7F6F2] p-4 space-y-2 text-sm">
        <p><strong>Hostinger :</strong> {config.hostingerConfigured?'Répertoire configuré':'Répertoire privé non configuré'}</p>
        <p><strong>Google Drive :</strong> {config.googleConnected?('Connecté — '+(config.googleEmail || 'compte autorisé')):'Non connecté'}</p>
        <button type="button" onClick={connectGoogle} disabled={busy || !config.oauthConfigured || !config.hostingerConfigured} className="cabinet-btn-primary px-4 py-2 text-white">{config.googleConnected ? 'Reconnecter Google Drive' : 'Connecter Google Drive'}</button>
        {!config.oauthConfigured && <p className="text-amber-900">Configurez GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET et GOOGLE_OAUTH_REDIRECT_URI sur le serveur.</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="storage-company" className="block text-sm font-semibold">Périmètre</label>
        <select id="storage-company" className="cabinet-input w-full" value={companyId} onChange={e=>setCompanyId(e.target.value)}>
          <option value="">Choix par défaut du cabinet</option>
          {companies.map(c=><option key={c.id} value={c.id}>{c.legalName}</option>)}
        </select>
      </div>
      <fieldset className="space-y-2">
        <legend className="font-semibold text-sm">Fournisseur</legend>
        <label className="flex gap-2 items-center"><input type="radio" checked={provider==='hostinger'} onChange={()=>setProvider('hostinger')}/> Hostinger — coffre privé</label>
        <label className="flex gap-2 items-center"><input type="radio" checked={provider==='google_drive'} onChange={()=>setProvider('google_drive')}/> Google Drive</label>
      </fieldset>
      {provider==='google_drive' && <div className="rounded-lg border border-[#E8E6DF] p-4 space-y-3">
        <label htmlFor="storage-folder" className="block text-sm font-semibold">Dossier de destination Drive</label>
        <select id="storage-folder" value={folderId} onChange={e=>setFolderId(e.target.value)} className="cabinet-input w-full">
          <option value="">Sélectionner un dossier autorisé</option>
          {folderId && !folders.some(f=>f.id===folderId) && <option value={folderId}>Dossier précédemment sélectionné ({folderId})</option>}
          {folders.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <p className="text-xs text-[#4B5563]">Vous pouvez choisir un dossier existant dans Google Drive ou créer un nouveau dossier.</p>
        <button type="button" disabled={busy || !config.googleConnected} onClick={chooseExistingDriveFolder} className="cabinet-btn-secondary px-4 py-3 w-full">
          Parcourir mon Google Drive et choisir un dossier
        </button>
        <div className="flex flex-col sm:flex-row gap-2">
          <input aria-label="Nom du nouveau dossier" value={folderName} onChange={e=>setFolderName(e.target.value)} className="cabinet-input flex-1" maxLength={100}/>
          <button type="button" className="cabinet-btn-secondary px-3 py-2" onClick={createFolder} disabled={busy || !config.googleConnected}>Créer un dossier</button>
          <button type="button" className="cabinet-btn-secondary px-3 py-2" onClick={refreshFolders} disabled={busy || !config.googleConnected}>Actualiser</button>
        </div>
      </div>}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={save} disabled={busy || (provider==='google_drive' && (!config.googleConnected || !folderId))} className="cabinet-btn-primary px-5 py-3 text-white">{busy?'Traitement…':'Enregistrer la destination'}</button>
        {companyId && config.companyOverrides[companyId] && <button type="button" disabled={busy} onClick={resetOverride} className="cabinet-btn-secondary px-4 py-3">Utiliser le stockage par défaut</button>}
      </div>
      <p className="text-xs text-[#4B5563]">La modification du fournisseur ne déplace aucun document existant. Aucun basculement automatique en cas de panne.</p>
    </>}
  </section>;
};
