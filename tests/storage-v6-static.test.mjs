import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = p => fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('server-side storage routing keeps existing documents anchored to provider',()=>{
  const m=read('src/server/storageProviders.ts');
  assert.match(m,/storagePath: 'gdrive:' \+ uploaded\.id/);
  assert.match(m,/if \(!storagePath\.startsWith\('gdrive:'\)\)/);
});
test('administrative configuration requires admin session and persistent storage',()=>{
  const m=read('src/server/storageProviders.ts');
  assert.match(m,/auth\?\.user\.role !== 'admin'/);
  assert.match(m,/PERSISTENT_STORAGE_DIR doit être configuré/);
});
test('upload requires original binary and no synthetic PDF',()=>{
  const m=read('src/server/portalApi.ts');
  assert.match(m,/contenu réel du fichier est obligatoire/);
  assert.doesNotMatch(m,/Synthèse binaire d.un document PDF/);
});
test('UI permits provider selection with per-company override',()=>{
  const m=read('src/components/portal/StorageAdminView.tsx');
  assert.match(m,/Choix par défaut du cabinet/);
  assert.match(m,/Google Drive/);
  assert.match(m,/Créer un dossier/);
});
