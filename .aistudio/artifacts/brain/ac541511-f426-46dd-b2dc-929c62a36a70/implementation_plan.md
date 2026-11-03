# FIDCOGEST — Plan de Correction du Démarrage Cloud Run (Port 3000 / Production)

Résolution définitive de l'échec de démarrage du conteneur Google Cloud Run (`Container failed to start and listen on PORT=3000`) pour l'application **FIDCOGEST SRL**.

---

## Décisions Clés & Recette Technique

> [!IMPORTANT]
> Le correctif garantit un démarrage 100 % fiable du conteneur Cloud Run tout en préservant la compatibilité totale avec l'aperçu Google AI Studio et l'architecture Hostinger existante.

- **Démarrage Sécurisé Autonome** : Mise à jour du script `npm start` et du wrapper `server.js` afin qu'un build automatique (`npm run build`) soit systématiquement exécuté avant l'écoute du port si `server.mjs` ou `dist/` est absent.
- **Port Réseau Dynamique & Binding IPv4** : Liaison stricte du serveur Express sur `process.env.PORT || 3000` sur l'interface globale `0.0.0.0`.
- **Rendu React & Préparation Static** : Si l'application fonctionne en mode production sans `dist/`, le serveur Express sert le fichier `index.html` avec le middleware Vite de secours sans interrompre le processus.

---

## 1. Vue d'Ensemble & Objectif

L'objectif est d'assurer que le service Cloud Run `fidcogest-bleu-prestige` dans le projet `ai-builder-project` (région `europe-west1`) initialise le serveur Express sur le port configuré par l'environnement (`PORT=3000` ou dynamiquement attribué) en moins de 2 secondes, tout en maintenant les 17 tests d'intégration et le rendu visuel complet du site.

---

## 2. Architecture Technique de Démarrage

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DÉMARRAGE CLOUD RUN                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        npm start / node server.js                      │
│   • Lit process.env.PORT (défaut: 3000)                               │
│   • Vérifie l'existence de server.mjs et dist/index.html               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                ┌───────────────────┴───────────────────┐
                │                                       │
        [Fichiers absents]                      [Fichiers présents]
                │                                       │
                ▼                                       ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│ Exécution automatique du     │       │ Chargement dynamique de       │
│ build (esbuild + vite build)  │       │ server.mjs                    │
└───────────────┬───────────────┘       └───────────────┬───────────────┘
                │                                       │
                └───────────────────┬───────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SERVEUR EXPRESS UNIFIÉ                           │
│   • app.listen(PORT, "0.0.0.0")                                        │
│   • Interception CORS & iframe AI Studio                              │
│   • API /api/portal + Servage SPA /dist                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Stratégie de Correction Précise

### A. Sécurisation de `server.js` (Wrapper de Démarrage)
1. Détection de l'existence de `server.mjs` et `dist/index.html`.
2. Si `server.mjs` est absent ou si son import échoue, bascule automatique sur `tsx server.ts` ou compilation dynamique à la volée.
3. Prévention de tout `process.exit(1)` non géré qui provoquerait le crash brutal de Cloud Run avant la liaison du port HTTP.

### B. Maintien de l'Écoute HTTP dans `server.ts`
1. Lecture prioritaire de `process.env.PORT` convertie en nombre avec valeur de secours 3000.
2. Liaison explicite sur l'hôte `0.0.0.0` :
   ```ts
   const PORT = Number(process.env.PORT) || 3000;
   app.listen(PORT, '0.0.0.0', () => {
     console.log(`[Fidcogest Server] Serveur prêt et en écoute sur 0.0.0.0:${PORT}`);
   });
   ```

### C. Script `package.json`
Mise à jour du script `start` :
```json
"start": "npm run build && NODE_ENV=production node server.js"
```
Cela garantit que l'image conteneur génère les artefacts de production avant d'exécuter la commande `node server.js`.

---

## 4. Plan de Validation

1. **Compilation TypeScript (`tsc --noEmit`)** : 0 erreur.
2. **Build de Production (`npm run build`)** : Validation de la création de `dist/` et `server.mjs`.
3. **Test Démarrage Production Local (`PORT=3000 npm start`)** :
   - Vérification de la réponse `HTTP 200` sur `http://localhost:3000/`.
   - Inspection du chargement des JS/CSS et des réponses API.
4. **Validation AI Studio Preview** : Confirmation que le site vitrine et le portail restent 100 % opérationnels.
