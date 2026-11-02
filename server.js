/**
 * @file server.js
 * Point d'entrée CommonJS pour LiteSpeed (lsnode.js) sur Hostinger.
 * Compatible avec le chargeur require() de Node.js 22.
 * Charge de manière asynchrone le serveur applicatif ESM server.mjs via import().
 */

'use strict';

// Chargement asynchrone sécurisé du serveur applicatif ESM
import('./server.mjs').catch(function (err) {
  console.error('[Fidcogest Hostinger] Échec du démarrage du serveur applicatif (server.mjs) :', err);
  process.exit(1);
});

module.exports = {};
