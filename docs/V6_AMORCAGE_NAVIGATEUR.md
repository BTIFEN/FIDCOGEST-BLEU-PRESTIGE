# FIDCOGEST V6 — Préparation dans le navigateur, sans installation

Le propriétaire n'a pas besoin de Node.js, npm, PowerShell ou d'un logiciel local. Le site reste hébergé sur Hostinger.

## Parcours

1. L'opérateur active le mode privé `file-v1` existant, uniquement si aucun utilisateur n'existe. Les journaux doivent indiquer `awaiting-owner`.
2. L'opérateur récupère `request.json` dans `PERSISTENT_STORAGE_DIR/admin-bootstrap` via le gestionnaire Hostinger authentifié. Ne pas copier les clés privées. La demande contient une clé publique et expire après 24 heures.
3. Le futur propriétaire ouvre `/preparer-administrateur` sur le site en HTTPS. Il sélectionne la demande authentique, choisit son adresse et son mot de passe, configure son propre Authenticator, confirme un vrai code et conserve les codes de récupération dans son coffre privé. Aucun secret ne doit être envoyé à l'opérateur, au chat ou dans une capture.
4. Le navigateur produit `enrollment.enc.json`, sans téléverser la demande ni les secrets. Le propriétaire télécharge ce fichier chiffré et le remet uniquement par un canal privé à l'opérateur autorisé. Ce téléchargement n'est pas une installation.
5. L'opérateur dépose l'enveloppe dans le même répertoire privé, avec les droits 0600, et redémarre l'application avant l'échéance affichée. Le serveur existant vérifie la preuve et consomme la demande à usage unique. Aucune nouvelle route de création de compte n'est ajoutée.
6. Après `created`, le propriétaire vérifie connexion MFA puis déconnexion. Retirer le mode d'amorçage, puis redémarrer. Le marqueur durable bloque déjà le rejeu. Les autres configurations et données sont conservées.

## Frontière de sécurité

La page de préparation est une ressource statique accessible par URL, non indexée ; ce n'est pas une zone administrative authentifiée. Elle ne donne aucun accès au serveur et ne crée aucun compte. L'amorçage privilégié reste non public : il exige l'écriture dans le répertoire privé via l'accès Hostinger authentifié. Un lien caché n'est pas utilisé comme contrôle de sécurité.

La page ne fait aucune requête applicative et n'utilise ni stockage navigateur ni script externe. Les en-têtes interdisent les connexions réseau, les soumissions de formulaire et l'intégration en iframe. Les informations ne vivent que dans la mémoire et les champs de cette page pendant la préparation. Leur effacement est demandé lors de la fermeture ou de la fin du parcours ; aucune garantie d'effacement physique de la mémoire du navigateur n'est formulée.

L'URL sans extension est volontaire : Hostinger peut servir les fichiers HTML directement, sans passer par les en-têtes Node. La page statique inclut aussi une CSP de secours et redirige vers l'URL canonique avant toute saisie de secret. L'ouverture en iframe est refusée dans le script en complément des en-têtes de l'URL canonique. Vérifier réellement ces en-têtes après déploiement.

Le chiffrement Web Crypto est compatible avec le protocole déjà déployé : PBKDF2 SHA-512 identique au serveur, TOTP SHA1 conforme au moteur existant, AES-256-GCM avec l'identifiant de demande comme AAD, clé AES enveloppée RSA-OAEP SHA-256. Source normative : https://www.w3.org/TR/webcrypto-1/ (AES-GCM et RSA-OAEP).

Ne pas accepter une demande obtenue d'une source tierce : la possession d'une clé publique ne prouve pas son origine. Les tests utilisent uniquement des clés et identités temporaires isolées ; la création du compte réel, les droits de dépôt et la connexion propriétaire restent à valider séparément. Aucune donnée fictive n'est ajoutée à la base de production.
