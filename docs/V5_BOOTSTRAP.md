# FIDCOGEST V5 — Amorçage administrateur (développement)

- Le portail démarre sans comptes clients, gestionnaires ou documents préchargés.
- Dans Hostinger, configurer un chemin privé et durable via `PERSISTENT_STORAGE_DIR`. Vérifier son existence et sa persistance après redéploiement.
- Configurer `PORTAL_ENCRYPTION_KEY` (32 octets aléatoires, encodés en 64 caractères hexadécimaux), en lieu sûr. Ne jamais modifier cette clé après avoir chiffré des documents sans procédure de rotation.
- Compiler avec `npm run build`, ce qui produit `bootstrap-admin.mjs`.
- Depuis un terminal privé **sur l'environnement disposant du répertoire persistant**, fournir temporairement `BOOTSTRAP_ADMIN_EMAIL` et `BOOTSTRAP_ADMIN_PASSWORD` (16+ caractères, chiffres, majuscules et minuscules), puis exécuter `npm run bootstrap:admin`.
- Ne jamais communiquer ces secrets dans GitHub, les journaux CI, le chat ni une URL. La commande affiche les codes TOTP/récupération ; les préserver hors ligne et éliminer toute copie dans des journaux.
- Retirer les deux variables `BOOTSTRAP_ADMIN_*` dès l'initialisation.
- Vérifier la connexion MFA et la déconnexion avant tout dépôt client. Ne pas utiliser de documents réels avant la validation du stockage, de l'antivirus et des autorisations.
- **Limite :** un contrôle statique/une compilation ne prouvent pas que l'environnement Hostinger dispose du stockage persistant requis.
