# FIDCOGEST V6 — Stockage Hostinger ou Google Drive

## Mise en place (préproduction exclusivement)

Le portail permet à un administrateur connecté de choisir un fournisseur par défaut ou par entreprise, et un dossier Google Drive parmi ceux auxquels l'application a accès.

### Configuration Hostinger
Configurer `PERSISTENT_STORAGE_DIR` sur un emplacement durable **hors du code déployé**, puis `PORTAL_ENCRYPTION_KEY` sur un secret aléatoire de 32 octets encodé en 64 caractères hexadécimaux. Ne pas stocker ces valeurs dans GitHub.

Le répertoire doit être absolu, accessible au processus Node et réservé à son propriétaire (0700), hors `hbuilds`, `public_html` et du répertoire courant de l'application, y compris après résolution des liens symboliques. Un chemin configuré mais invalide bloque le démarrage pour éviter d'écrire des métadonnées dans un emplacement public ou temporaire. Les nouveaux fichiers privés sont créés en 0600. Avant déploiement, contrôler le chemin existant ; ne pas changer la clé de chiffrement d'un coffre existant et ne pas déplacer ses données automatiquement.

La disponibilité d'un dossier hors déploiement n'est pas une preuve de persistance. Sur Hostinger, déposer un PDF fictif, relever son empreinte SHA-256, redémarrer puis redéployer, et récupérer le même fichier avec la même empreinte. Faire ce contrôle aussi pour les paramètres OAuth et les métadonnées. Aucun déplacement ou écrasement des données existantes n'est prévu par ce correctif.

### Configuration Google Cloud
1. Activer l'API Google Drive dans votre projet Google Cloud.
2. Créer un client OAuth 2.0 de type **application Web**.
3. Renseigner l'URL de retour exacte `https://VOTRE_DOMAINE/api/portal/storage/google/callback`.
4. Configurer `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` et `GOOGLE_OAUTH_REDIRECT_URI` dans Hostinger.
5. Se connecter en administrateur FIDCOGEST ; ouvrir **Administration > Stockage documentaire > Connecter Google Drive**.
6. Autoriser l'accès `drive.file` demandé par Google ; créer un dossier (p. ex. `FIDCOGEST-TEST`) ou choisir l'un des dossiers visibles et autorisés.
7. Enregistrer la destination. Le changement concerne **les nouveaux documents uniquement**. Aucun déplacement automatique n'a lieu.

La liste accessible via `drive.file` ne comprend pas forcément tous les anciens dossiers du compte. Le bouton **Parcourir mon Google Drive et choisir un dossier** utilise Google Picker pour autoriser un dossier préexistant. Ne pas élargir les permissions OAuth.

Activer aussi Google Picker API. Configurer `GOOGLE_PICKER_API_KEY` et `GOOGLE_CLOUD_PROJECT_NUMBER` (numéro numérique, pas identifiant textuel). Le client OAuth, la clé Picker et le numéro doivent appartenir au même projet, ici `neat-direction-390816`. Restreindre la clé à Google Picker API et aux référents `https://fidcogest.eu/*` et `https://docs.google.com/*` : Google indique que son iframe Picker utilise ce second domaine. Ajouter un autre domaine seulement si le portail y est effectivement utilisé. Source : https://developers.google.com/workspace/drive/picker/guides/web-picker

### Considérations de sécurité
- L'accès au panneau et aux routes de configuration est réservé au rôle **admin** par session serveur.
- Le jeton de renouvellement OAuth est chiffré avant persistance ; jamais envoyé dans le JSON public.
- Le retour OAuth exige un état à usage unique et un cookie HttpOnly SameSite=Lax du navigateur initiateur, et utilise PKCE S256. Un redémarrage pendant le consentement nécessite de recommencer la connexion. En production, le cookie exige HTTPS.
- Les réponses administrateur et OAuth ne sont pas mises en cache. Le jeton d'accès court nécessaire à Picker est transmis uniquement à la session administrateur ; le secret OAuth et le jeton de renouvellement ne le sont jamais.
- Les fichiers Google Drive sont chiffrés côté serveur (AES-256-GCM) avant envoi.
- Un document garde son fournisseur historique via la métadonnée `storagePath` : chemin privé Hostinger ou préfixe `gdrive:<fileId>`.
- Aucune bascule implicite vers un autre fournisseur en cas d'échec.
- Ne pas uploader de documents réels sans contrôle de persistance, antivirus indépendant, restauration et audit d'accès.
- Pour un projet OAuth **External en mode Testing**, les jetons de renouvellement peuvent expirer rapidement ; prévoir des reconnexions pendant les tests.
- Le sélecteur intégré est implémenté ; son fonctionnement réel et les restrictions de clé doivent être validés sur le compte cible.

### Limites
- Les connexions Google nécessitent l'autorisation explicite du propriétaire du compte.
- Aucun test réel de Google Drive ni test de persistance Hostinger ne peut être déclaré PASS sans configuration effective.
- Le stockage des métadonnées JSON devra évoluer vers une base transactionnelle durable avant ouverture aux vrais clients.
