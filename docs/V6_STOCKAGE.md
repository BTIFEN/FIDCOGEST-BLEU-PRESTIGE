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

La liste accessible via `drive.file` ne comprend pas forcément tous les anciens dossiers du compte. Le bouton Google Picker permet de sélectionner un dossier existant et de l’autoriser pour cette application. Configurer `GOOGLE_PICKER_API_KEY` et `GOOGLE_CLOUD_PROJECT_NUMBER` (numéro numérique, pas l’identifiant du projet). Le serveur vérifie ensuite qu’il s’agit d’un dossier non supprimé et accessible en écriture. Ne pas élargir le périmètre OAuth.

### Considérations de sécurité
- L'accès au panneau et aux routes de configuration est réservé au rôle **admin** par session serveur.
- Le jeton de renouvellement OAuth est chiffré avant persistance ; jamais envoyé dans le JSON public.
- Les fichiers Google Drive sont chiffrés côté serveur (AES-256-GCM) avant envoi.
- Un document garde son fournisseur historique via la métadonnée `storagePath` : chemin privé Hostinger ou préfixe `gdrive:<fileId>`.
- Aucune bascule implicite vers un autre fournisseur en cas d'échec.
- Ne pas uploader de documents réels sans contrôle de persistance, antivirus indépendant, restauration et audit d'accès.
- Pour un projet OAuth **External en mode Testing**, les jetons de renouvellement peuvent expirer rapidement ; prévoir des reconnexions pendant les tests.
- Le chargement et la sélection Google Picker doivent encore être testés dans le navigateur sur le déploiement cible.

### Limites
- Les connexions Google nécessitent l'autorisation explicite du propriétaire du compte.
- Aucun test réel de Google Drive ni test de persistance Hostinger ne peut être déclaré PASS sans configuration effective.
- Le stockage des métadonnées JSON devra évoluer vers une base transactionnelle durable avant ouverture aux vrais clients.

## Renforcement et validation technique du 3 novembre 2026

- Correction de la validation du numéro numérique de projet pour Google Picker.
- OAuth lié au navigateur initiateur par cookie HttpOnly, Secure en production, SameSite=Lax, état à usage unique (5 minutes) et PKCE S256. Un redémarrage pendant cette fenêtre impose de relancer la connexion.
- Réponses de configuration, Picker et callback sans mise en cache ; corps des erreurs Google non retransmis.
- Chemin privé absolu hors code, `hbuilds` et `public_html`, avec résolution des liens symboliques. Dossier existant réservé au propriétaire (0700) ; nouveaux dossiers 0700 et nouveaux fichiers sensibles 0600.
- Reconnexion Google proposée à l’administrateur pour renouveler un consentement expiré.
- Tests intégrés des droits administrateur, callback, Picker, dossiers et chiffrement Drive. Ces tests simulent Google et ne constituent pas une recette Drive réelle.

### Recette Hostinger restant à effectuer après authentification

1. Relever dans hPanel le chemin réellement accessible au processus Node ; ne pas inventer un chemin `/home/...`.
2. Confirmer auprès des capacités de l’hébergement que ce chemin survit à un redémarrage et à un redéploiement ; le contrôle logiciel de chemin ne prouve pas la durabilité.
3. Ne pas changer de clé de chiffrement existante et ne pas rediriger une base existante vers un dossier vide. Préserver la base, les sessions, les jetons et les fichiers ; toute migration exige une copie vérifiée et un retour arrière.
4. Vérifier les variables sans exporter leurs valeurs. Si une clé manque, la créer dans un canal privé, sans journal ni rapport.
5. Connecter le compte Google choisi par le propriétaire depuis le portail administrateur, puis créer `FIDCOGEST-TEST` via l’application.
6. Déposer un vrai PDF fictif, le récupérer et comparer SHA-256 ; vérifier les refus d’accès d’un autre client et d’un utilisateur anonyme.
7. Redémarrer puis redéployer et relire le même document et la connexion Google. Vérifier les permissions Drive sans activer de partage public.
8. Conserver les artefacts de test ; aucune suppression de données ni modification DNS n’est autorisée dans cette intervention.

La base JSON n’est pas une base transactionnelle et ses métadonnées ne sont pas intégralement chiffrées. Les contenus documentaires et le jeton de renouvellement sont chiffrés en AES-256-GCM. Cette validation n’est pas une certification de sécurité du portail complet.
