# FIDCOGEST V6 — validation du 3 novembre 2026

## Conclusion

Correctifs validés localement. Validation Hostinger et Google Drive réelle en attente d'authentification. Aucun document client utilisé ; aucune suppression distante ni modification DNS. Aucun secret enregistré dans ce rapport.

## Référentiel

- Dépôt : BTIFEN/FIDCOGEST-BLEU-PRESTIGE, base main `5a2a6d6deb192c3e3016fe490638fce43d9a3bf7`.
- Site : https://fidcogest.eu ; cible Google Cloud : neat-direction-390816.
- Environnement local : build et TypeScript sous Node 24 ; les 7 tests stockage/routes passent également sous Node 22, cible Hostinger et CI.

## Anomalies corrigées

1. La validation du numéro de projet Picker recherchait un antislash littéral au lieu de chiffres : les numéros valides étaient refusés.
2. Le chemin persistant était seulement contrôlé comme absolu : les emplacements publics, de build ou dans le code sont désormais refusés, liens symboliques compris. Un chemin configuré invalide bloque le démarrage : vérifier Hostinger avant fusion et déploiement.
3. Les nouveaux dossiers et fichiers locaux privés utilisent respectivement 0700 et 0600 ; les données existantes ne sont ni déplacées ni supprimées.
4. Le retour OAuth est désormais lié au navigateur qui a lancé l'autorisation, avec état à usage unique et PKCE S256.
5. Les réponses administrateur sont marquées no-store, les erreurs Drive ne renvoient plus le corps brut de la réponse externe et le bouton de reconnexion est disponible.
6. Le lockfile npm manquait de dépendances optionnelles de plateforme, ce qui faisait échouer npm ci. Réparation sans changer les versions des dépendances déjà verrouillées.
7. La CI exécute les tests de routes V6 sur pull request et main.

## Résultats

| Vérification | Résultat | Limite |
| --- | --- | --- |
| Installation propre npm ci | PASS | Environnement local |
| TypeScript et build client/serveur/bootstrap | PASS | Environnement local |
| Tests sécurité statiques | 5 PASS | Contrôles de code |
| Tests stockage statiques | 4 PASS | Contrôles de code |
| Tests stockage et routes | 7 PASS | Drive simulé ; pas un test réel Google |
| Accès anonyme au panneau et routes sensibles | Refus 403 dans les tests | Admin et client non autorisé testés |
| AES-256-GCM et SHA-256 | PASS | Aller-retour local et Drive simulé, altération rejetée |
| Conservation du fournisseur historique | PASS | Fichier local encore lisible après bascule de destination de test |
| Site public actuel `/` | HTTP 200 | Ne prouve pas un nouveau déploiement |
| Site actuel `/api/portal/admin/storage` | HTTP 403 anonyme | Aucun accès à la configuration privée |
| Site actuel `/api/portal/admin/storage/google/picker-session` | HTTP 403 anonyme | Picker réel non lancé |
| Site actuel `/data/vault_storage` | HTTP 403 | Ne prouve pas la confidentialité de tous les chemins hôte |
| Site actuel retour OAuth sans état | HTTP 400 | Refus attendu |

## Opérations indispensables restantes

L'accès hPanel disponible dans cette session aboutit à la page de connexion Hostinger. Aucun accès authentifié à la configuration Hostinger n'a donc été constaté pendant cette vérification.

Après authentification :

1. Examiner les paramètres Node et les noms/présences des variables sans publier leurs valeurs. Vérifier le répertoire réel et ses droits, hors hbuilds et public_html. Contrôler la clé existante sans la remplacer.
2. Configurer uniquement les variables manquantes dans Hostinger. Vérifier l'API Picker, les restrictions de clé et la correspondance du projet GCP. Le secret OAuth reste exclusivement côté serveur.
3. Déployer les correctifs après contrôle du chemin persistant puis vérifier le build, le redémarrage et l'accès public.
4. Ouvrir le panneau stockage en session administrateur FIDCOGEST et faire autoriser drive.file par le propriétaire Google.
5. Créer FIDCOGEST-TEST depuis le portail lui-même. Une création par un autre connecteur Drive ne valide pas l'autorisation OAuth de cette application.
6. Vérifier Picker et les droits d'écriture du dossier sélectionné. Déposer puis récupérer un PDF fictif, comparer SHA-256 ; confirmer que le contenu distant est chiffré et que les utilisateurs hors périmètre ne peuvent pas le lire.
7. Vérifier la persistance du PDF, des métadonnées et de la connexion après redémarrage puis redéploiement. Ne pas basculer un vrai dossier client pour ce test.

Le dossier FIDCOGEST-TEST n'a pas été créé dans Google Drive pendant la validation locale. Aucune connexion OAuth réelle, récupération réelle Drive, persistance Hostinger ou configuration GCP n'est déclarée validée.
