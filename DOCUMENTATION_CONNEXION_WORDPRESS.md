# DOCUMENTATION TECHNIQUE : CONNEXION WORDPRESS & API REST
## Cabinet FIDCOGEST SRL (Bruxelles Ganshoren)

---

### 1. Spécifications Générales

| Composant | Technologie | Emplacement / Endpoint |
|---|---|---|
| **Console d'Administration Headless** | WordPress 6.x + Astra + PHP 8.3 | `https://fidcogestv2.indusale.top` |
| **Passerelle Applicative** | Node.js 22 + Express + TypeScript | Port `process.env.PORT` (défaut: 3000) |
| **Frontend Métier** | React 19 + Vite + Tailwind CSS | Servi statiquement via `dist/` |
| **API REST WordPress** | Endpoint Custom Namespace `fidcogest/v1` | `GET /wp-json/fidcogest/v1/content` |
| **Webhook d'invalidation** | HTTP POST sécurisé | `POST /api/webhook/wp-flush` |
| **Fallback Persistant** | Fichier JSON local | `data/cabinet-content.json` |

---

### 2. Variables d'Environnement (`.env`)

Dans l'environnement de production Hostinger ou local :

```env
# Port d'écoute du serveur Node.js (fourni automatiquement par Hostinger)
PORT=3000
NODE_ENV=production

# Mot de passe administrateur pour l'accès sécurisé à /admin sur React
ADMIN_PASSWORD=VotreMotDePasseTresSecurise2026!

# URL de l'instance WordPress Headless
WORDPRESS_URL=https://fidcogestv2.indusale.top

# Clé secrète cryptographique du Webhook (min 24 car., distincte de tout mot de passe)
# Générée depuis WordPress (menu FIDCOGEST > Connexion & Webhook)
WP_WEBHOOK_SECRET=7f8a9b2c3d4e5f60718293a4b5c6d7e8f90123456789abcd

# Optionnel : Clé API Gemini pour l'assistant fiscal interactif et l'OCR comptable
GEMINI_API_KEY=
```


---

### 3. Schéma de Données JSON (`CabinetConfig`)

L'API WordPress (`/wp-json/fidcogest/v1/content`) et l'API Express (`/api/cabinet-config`) retournent une structure rigoureusement typée :

```json
{
  "cabinet": {
    "name": "FIDCOGEST SRL",
    "legalForm": "SRL (Société à Responsabilité Limitée)",
    "foundingYear": 2008,
    "foundingDate": "17 juillet 2008",
    "bceNumber": "0899.441.309",
    "vatNumber": "BE 0899.441.309",
    "peppolIdentifier": "0208:0899441309",
    "headquarters": {
      "address": "Place de la Reine Paola n°3",
      "postalCode": "1083",
      "city": "Ganshoren (Bruxelles)",
      "country": "Belgique",
      "googleMapsUrl": "https://maps.google.com/?q=Place+de+la+Reine+Paola+3+1083+Ganshoren"
    },
    "phone": "+32 2 425 18 58",
    "mobile": "+32 476 62 66 21",
    "email": "management@fidcogest.be",
    "secondaryEmail": "contact@fidcogest.be",
    "openingHours": "Lundi au Vendredi : 08h30 - 18h00 (sur rendez-vous)",
    "officialAccreditation": "ITAA (Institute for Tax Advisors and Accountants)",
    "accreditationStatus": "Cabinet agréé et certifié ITAA",
    "primaryTool": "Basecone (Wolters Kluwer)"
  },
  "team": [ ... ],
  "services": [ ... ],
  "presentationCabinet": { ... },
  "images": {
    "heroCabinet": "URL ou /assets/images/hero_cabinet_fidcogest.svg",
    "serviceComptabilite": "URL ou /assets/images/service_comptabilite.svg",
    "serviceFiscalite": "URL ou /assets/images/service_fiscalite.svg",
    "serviceCreation": "URL ou /assets/images/service_creation.svg",
    "serviceConseil": "URL ou /assets/images/service_conseil.svg",
    "serviceAudit": "URL ou /assets/images/service_audit.svg",
    "serviceFinancement": "URL ou /assets/images/service_financement.svg",
    "serviceEcomptaBasecone": "URL ou /assets/images/service_ecompta_basecone.svg",
    "cabinetGanshoren": "URL ou /assets/images/cabinet_ganshoren.svg",
    "portraitPaulHollMpeck": "URL ou /assets/images/portrait_paul_holl_mpeck.svg",
    "logo": "URL ou /assets/images/logo_fidcogest.svg",
    "logoDark": "URL ou /assets/images/logo_fidcogest_dark.svg",
    "favicon": "URL ou /assets/images/favicon.svg"
  }
}
```

---

### 4. Cycle de Vie et Stratégie de Cache

```
[Visiteur React]
      │
      ▼
[Express : GET /api/cabinet-config]
      │
   ┌──┴─────────────────────────┐
   │ Cache mémoire valide ?    │
   ├──────────────┬─────────────┤
   │ OUI (TTL < 5m)   NON / Expiré
   │              │
   ▼              ▼
[Retourne]   [Interroge https://fidcogestv2.indusale.top/wp-json/fidcogest/v1/content]
                  │
          ┌───────┴────────────────────────┐
          │ Succès HTTP 200 ?             │
          ├──────────────┬─────────────────┤
          │ OUI          │ NON / Timeout (3.5s)
          ▼              ▼
     [Met en cache]  [Bascule immédiate sur data/cabinet-content.json]
     [Sauvegarde fallback]
          │
          ▼
     [Retourne données]
```

Lorsqu'un administrateur met à jour une image dans WordPress, WordPress émet une requête `POST /api/webhook/wp-flush` avec le header `x-fidcogest-secret`. Le cache mémoire d'Express est invalidé instantanément (0 ms de délai de propagation).

---

### 5. Sécurité Renforcée

- **Suppression des valeurs par défaut :** Aucun mot de passe en clair codé en dur dans le code source (`server.ts` ou React).
- **Protection contre le Brute-Force :** 5 tentatives infructueuses maximum par adresse IP, déclenchant un verrouillage temporaire de 15 minutes avec code HTTP 429.
- **Sessions Cryptographiques :** Utilisation de `crypto.randomBytes(32).toString('hex')` avec expiration automatique après 2 heures.
- **Filtrage des Fichiers Uploadés :** Vérification stricte des extensions (`.pdf`, `.png`, `.jpg`, `.jpeg`) et rejet des fichiers exécutables (`.php`, `.exe`, `.sh`).
