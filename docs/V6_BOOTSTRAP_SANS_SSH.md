# FIDCOGEST V6 — Premier administrateur sans SSH

## Périmètre

Amorçage par fichiers privés uniquement : aucune route HTTP, aucun mot de passe prédéfini, aucune modification DNS. Désactivé par défaut. Le serveur ne prend pas de mot de passe depuis des variables d'environnement. L'ancien CLI qui affichait les secrets dans les journaux est désactivé.

Cette procédure nécessite un accès authentifié au gestionnaire de fichiers et aux paramètres de l'application Hostinger. Elle ne constitue pas une preuve d'exécution sur Hostinger. Ne pas placer les fichiers dans WordPress, `public_html`, `domains`, `hbuilds`, GitHub, le chat ou les journaux. Ne pas remplacer `PORTAL_ENCRYPTION_KEY` ni `PERSISTENT_STORAGE_DIR` déjà validés.

## Préparation par l'opérateur

1. Déployer le correctif validé par CI. Conserver les variables existantes.
2. Vérifier la base privée active : aucun utilisateur. Si un utilisateur existe, arrêter l'amorçage et employer le processus de récupération existant ; ne rien supprimer.
3. Ajouter temporairement `FIDCOGEST_BOOTSTRAP_MODE=file-v1` et redémarrer l'application.
4. Dans le répertoire privé existant, le serveur crée `admin-bootstrap` (0700), `request.json` et `key.enc.json` (0600). La clé privée est chiffrée avec la clé de chiffrement existante. Aucun secret n'est affiché dans les journaux.
5. Télécharger seulement `request.json` par le gestionnaire authentifié. La demande contient une clé publique, un identifiant aléatoire et une échéance de 24 heures. Son authenticité dépend de ce canal privé ; ne pas récupérer une demande d'une source tierce.

## Intervention privée du propriétaire

Le propriétaire exécute le code vérifié du dépôt sur son ordinateur (Node.js 22 ou supérieur), dans un terminal local privé sans capture, partage d'écran ni enregistrement. Le terminal doit rester privé même pendant l'affichage du MFA et des codes de récupération. Ne transmettre aucun de ces secrets à l'opérateur.

```sh
npm ci --no-audit --no-fund
npm run build:bootstrap
node enroll-admin.mjs /chemin/prive/request.json /chemin/prive/enrollment.enc.json
```

Le propriétaire choisit son adresse et son mot de passe (saisie masquée), configure la clé dans son application Authenticator et valide un vrai code TOTP. Il conserve les codes de récupération dans son coffre privé. Le programme refuse un terminal redirigé ou une exécution CI. Les mots de passe ne sont jamais écrits dans l'enveloppe : celle-ci contient uniquement leur empreinte salée, le secret MFA et les empreintes des codes de récupération, chiffrés avec une clé AES-GCM elle-même chiffrée RSA-OAEP SHA-256.

Remettre uniquement le fichier **chiffré** `enrollment.enc.json` par le gestionnaire authentifié dans `admin-bootstrap`. Vérifier ses droits 0600 puis redémarrer l'application sous 15 minutes après la saisie du code MFA. Le propriétaire peut réaliser ce dépôt directement ; aucun secret en clair n'est nécessaire à l'opérateur.

## Consommation et fermeture

Le serveur contrôle les permissions, refuse les liens symboliques, vérifie la demande, le chiffrement authentifié, le code MFA confirmé et les délais. Il verrouille l'opération, refuse tout compte existant et inscrit un marqueur privé avant de créer exactement un compte réel. Les fichiers de demande, clé et enveloppe sont ensuite supprimés ; le marqueur demeure pour refuser le rejeu, même si une restauration ultérieure vide la liste des utilisateurs.

Retirer `FIDCOGEST_BOOTSTRAP_MODE` puis redémarrer. Vérifier avec le propriétaire la connexion mot de passe + MFA, puis la déconnexion et le refus de l'ancienne session. Ne jamais inclure la session dans un rapport.

Un arrêt brutal, une écriture échouée, un verrou résiduel, une demande expirée ou un fichier refusé demande une inspection privée de la base et du marqueur. Aucun réarmement ni effacement automatique n'est effectué. Ne pas supprimer un marqueur pour contourner un refus ; contrôler d'abord si le compte a été créé. Pour renouveler une demande expirée avant toute consommation, fermer le mode, vérifier qu'il n'existe aucun compte ni marqueur, archiver l'ancienne demande privée puis recréer une demande sous contrôle opérateur.

## Recette restante

- Le propriétaire se connecte et autorise **depuis FIDCOGEST** le compte Google préparé, avec le périmètre `drive.file`. Une connexion via un autre outil ne valide pas ce client OAuth.
- Créer le dossier réel `FIDCOGEST-TEST` via la route administrateur existante et vérifier ses droits privés.
- La base de production ne doit recevoir ni entreprise de démonstration ni document fictif. Le dépôt via le flux client standard exige une entreprise et écrit des métadonnées : ce flux n'est donc pas compatible avec cette contrainte pour une entreprise fictive. Effectuer la recette de ce flux sur une instance isolée, ou préparer un diagnostic administrateur temporaire qui utilise les mêmes fonctions de stockage sans écriture métier. Ce diagnostic n'est pas ajouté par ce correctif.
- Comparer les octets et le SHA-256 du PDF fictif après téléchargement puis après un vrai redéploiement. Consigner seulement les empreintes et résultats, jamais les jetons.
- Tester les accès croisés entre clients sur l'instance isolée ; ne pas créer de comptes de test en production.
- Sauvegarder l'ensemble du répertoire privé et conserver séparément la clé de chiffrement et les secrets de configuration dans un coffre privé. Tester la restauration vers un répertoire isolé, application arrêtée. L'export JSON intégré ne couvre ni le coffre documentaire ni `storage-settings.json` et ne constitue pas une sauvegarde complète. Les objets Drive nécessitent leur propre protection et une vérification réelle.
- Toute validation réelle non effectuée reste **NON TESTÉ**. Aucune ouverture client avant la levée des contrôles critiques.
