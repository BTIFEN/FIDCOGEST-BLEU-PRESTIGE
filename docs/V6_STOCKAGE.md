# FIDCOGEST V6 — Stockage Hostinger ou Google Drive

## Mise en place (préproduction exclusivement)

Le portail permet à un administrateur connecté de choisir un fournisseur par défaut ou par entreprise, et un dossier Google Drive parmi ceux auxquels l'application a accès.

### Configuration Hostinger
Configurer `PERSISTENT_STORAGE_DIR` sur un emplacement durable **hors du code déployé**, puis `PORTAL_ENCRYPTION_KEY` sur un secret aléatoire de 32 octets encodé en 64 caractères hexadécimaux. Ne pas stocker ces valeurs dans GitHub.

### Configuration Google Cloud
1. Activer l'API Google Drive dans votre projet Google Cloud.
2. Créer un client OAuth 2.0 de type **application Web**.
3. Renseigner l'URL de retour exacte `https://VOTRE_DOMAINE/api/portal/storage/google/callback`.
4. Configurer `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` et `GOOGLE_OAUTH_REDIRECT_URI` dans Hostinger.
5. Se connecter en administrateur FIDCOGEST ; ouvrir **Administration > Stockage documentaire > Connecter Google Drive**.
6. Autoriser l'accès `drive.file` demandé par Google ; créer un dossier (p. ex. `FIDCOGEST-TEST`) ou choisir l'un des dossiers visibles et autorisés.
7. Enregistrer la destination. Le changement concerne **les nouveaux documents uniquement**. Aucun déplacement automatique n'a lieu.

La liste accessible via `drive.file` ne comprend pas forcément tous les anciens dossiers du compte. Pour donner accès à un ancien dossier arbitraire, il peut être nécessaire de compléter cette version avec Google Picker. Ne pas élargir les permissions OAuth sans justification et validation de l'usage.

### Considérations de sécurité
- L'accès au panneau et aux routes de configuration est réservé au rôle **admin** par session serveur.
- Le jeton de renouvellement OAuth est chiffré avant persistance ; jamais envoyé dans le JSON public.
- Les fichiers Google Drive sont chiffrés côté serveur (AES-256-GCM) avant envoi.
- Un document garde son fournisseur historique via la métadonnée `storagePath` : chemin privé Hostinger ou préfixe `gdrive:<fileId>`.
- Aucune bascule implicite vers un autre fournisseur en cas d'échec.
- Ne pas uploader de documents réels sans contrôle de persistance, antivirus indépendant, restauration et audit d'accès.
- Pour un projet OAuth **External en mode Testing**, les jetons de renouvellement peuvent expirer rapidement ; prévoir des reconnexions pendant les tests.
- La liste des dossiers n'est pas un Google Picker officiel pour les dossiers préexistants : fonctionnalité à compléter.

### Limites
- Les connexions Google nécessitent l'autorisation explicite du propriétaire du compte.
- Aucun test réel de Google Drive ni test de persistance Hostinger ne peut être déclaré PASS sans configuration effective.
- Le stockage des métadonnées JSON devra évoluer vers une base transactionnelle durable avant ouverture aux vrais clients.
