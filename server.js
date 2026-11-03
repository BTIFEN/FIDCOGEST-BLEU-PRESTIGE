/**
 * @file server.js
 * Point d'entrée de démarrage robuste pour Cloud Run et Hostinger.
 * Garantit l'existence de server.mjs et dist/ avant le démarrage de l'écoute réseau.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const serverMjsPath = path.join(__dirname, 'server.mjs');
const distIndexPath = path.join(__dirname, 'dist', 'index.html');

// Vérifier et générer les artefacts de build si nécessaires avant de démarrer
if (!fs.existsSync(serverMjsPath) || !fs.existsSync(distIndexPath)) {
  console.log('[Fidcogest Startup] Artefacts de production manquants. Lancement du build automatique...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('[Fidcogest Startup] Build automatique réussi.');
  } catch (buildErr) {
    console.error('[Fidcogest Startup] Avertissement lors du build automatique:', buildErr.message);
  }
}

// Tentative d'importation dynamique du serveur ESM compilé
import('./server.mjs').catch((err) => {
  console.error('[Fidcogest Startup] Échec du chargement de server.mjs:', err.message);
  console.log('[Fidcogest Startup] Bascule automatique sur tsx server.ts...');
  
  const child = spawn('npx', ['tsx', 'server.ts'], {
    stdio: 'inherit',
    env: process.env
  });

  child.on('error', (spawnErr) => {
    console.error('[Fidcogest Startup] Échec critique du fallback tsx:', spawnErr);
  });
});

module.exports = {};
