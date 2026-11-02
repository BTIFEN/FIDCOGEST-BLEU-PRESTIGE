# FIDCOGEST – Expert-comptable & Conseiller fiscal certifié ITAA

Cabinet d'expertise comptable et de conseil fiscal certifié ITAA en Belgique (Bruxelles Louise & Mons). Thème officiel **Bleu Prestige** avec simulateurs fiscaux belges (ISOC/IPP), calculatrice TVA, calendrier des échéances 2026, prise de rendez-vous en ligne, coffre-fort documentaire et assistant fiscal IA.

---

## Architecture de Déploiement Hostinger (Node.js 22 + Express)

L'application est conçue pour fonctionner de manière autonome sur tout hébergement Node.js (Hostinger Cloud / VPS / Web Hosting Node.js).

### Configuration requise sur Hostinger

| Paramètre Hostinger | Valeur recommandée |
|---|---|
| **Version Node.js** | `22.x` (LTS) |
| **Fichier de démarrage (Entry Point)** | `server.js` |
| **Commande de build** | `npm run build` |
| **Commande de démarrage** | `npm start` |
| **Port** | Automatique via `process.env.PORT` |

---

## Commandes disponibles

```bash
# 1. Installation des dépendances
npm install

# 2. Compilation complète (Frontend React/Vite dans dist/ + Backend server.ts vers server.js)
npm run build

# 3. Lancement du serveur autonome en production
npm start

# 4. Mode développement local
npm run dev
```

---

## Variables d'Environnement (.env)

Copiez `.env.example` vers `.env` sur le serveur :

```ini
# Port d'écoute (défini automatiquement par Hostinger ou 3000 par défaut)
PORT=3000

# Mode d'exécution
NODE_ENV=production

# Clé API Google Gemini (optionnelle, server-side uniquement pour l'assistant fiscal et l'analyse de documents)
GEMINI_API_KEY=
```

> **Note :** Si `GEMINI_API_KEY` n'est pas configurée, l'assistant fiscal et l'OCR documentaire basculent automatiquement et instantanément sur la doctrine fiscale belge intégrée (sans erreur ni interruption de service).

---

## Structure des Fichiers Clés

- `server.ts` : Code source TypeScript du serveur Express (API fiscale, OCR et service statique).
- `server.js` : Point d'entrée CommonJS compatible avec LiteSpeed (`lsnode.js`) et `require()` sur Hostinger.
- `server.mjs` : Serveur applicatif ESM Node.js 22 (généré par `npm run build`).
- `dist/` : Fichiers statiques optimisés du frontend React/Vite (générés par `npm run build`).
- `src/styles/fidcogest-prestige.css` : Thème Bleu Prestige (#142B45, #B79661, #F7F8F6, #26343E).
