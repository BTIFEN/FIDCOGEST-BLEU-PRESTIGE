# FIDCOGEST V6 — Matrice de finalisation du 3 novembre 2026

**Ouverture clients : BLOQUÉE.** Le rapport précédent et son commit `6e8dcfbb6a921878eab6bfef554cf7d72cb2b150` sont conservés. Ce document complète les validations existantes ; il ne remplace pas les preuves de déploiement du rapport précédent.

Les corrections de cette intervention sont livrées sur une branche distincte, sans activation de l'amorçage en production. Aucun accès authentifié Hostinger ou portail n'a été établi pendant cette intervention. Aucun dossier Drive réel, aucun compte administrateur de production et aucun PDF de production n'ont été créés. Aucun DNS, secret ou paramètre de production n'a été modifié. Les tests utilisent uniquement des répertoires temporaires isolés et des clés éphémères.

## Matrice finale de cette intervention

PASS signifie uniquement le contrôle et l'environnement explicitement nommés. NON TESTÉ ne signifie pas que la fonction est défaillante.

| Contrôle | Statut | Preuve et limite |
| --- | --- | --- |
| Lecture du rapport actuel et reprise du commit validé | PASS | Rapport HTML lu intégralement ; main et clone correspondent au commit indiqué. Aucun travail fonctionnel existant reconstruit. |
| Accueil et portail accessibles | PASS | GET `/` et `/portail` : HTTP 200 pendant cette intervention. |
| Refus anonyme administration stockage et Picker | PASS | HTTP 403, `Cache-Control: no-store` sur les deux routes réelles. |
| Refus anonyme sauvegarde et restauration | PASS | GET `/api/portal/admin/backup` et POST `/api/portal/admin/restore` : HTTP 403. Ces refus ne prouvent pas une sauvegarde fonctionnelle. |
| Refus accès direct au coffre | PASS | GET `/data/vault_storage` : HTTP 403. |
| Amorçage sans SSH, sans route publique, sans mot de passe prédéfini | PASS — LOCAL | Nouveau mode explicite par fichiers privés ; désactivé par défaut. Ancien CLI avec sortie MFA retiré. |
| Usage unique, délais, altération, fichiers publics et liens symboliques | PASS — LOCAL | Tests d'intégration : marqueur durable, verrou, demandes expirées, mauvais identifiant, tag altéré, mauvais MFA et refus des fichiers non privés. |
| Confidentialité des nouveaux journaux d'amorçage | PASS — LOCAL | États génériques uniquement. Aucun secret MFA/mot de passe/clé ajouté au dépôt ou aux rapports. La saisie et l'affichage propriétaire sont réservés à son terminal privé. |
| Initialisation du premier administrateur sur Hostinger | NON TESTÉ | Correctif non activé ; gestion de l'hébergement non accessible depuis ce navigateur distant. |
| Configuration MFA par le propriétaire réel | NON TESTÉ | Le CLI exige une preuve TOTP avant création, validée avec identités isolées ; le propriétaire réel n'a pas encore exécuté cette étape. |
| Connexion et déconnexion administrateur réel | NON TESTÉ | Sur instance isolée : mot de passe seul insuffisant, MFA valide requis, session révoquée après déconnexion. Aucun login propriétaire réel. |
| Consentement OAuth du compte Google préparé | NON TESTÉ | Nécessite le compte administrateur réel et le consentement propriétaire depuis FIDCOGEST. Aucun autre connecteur Google ne peut prouver cette intégration. |
| Création réelle du dossier FIDCOGEST-TEST | NON TESTÉ | Aucun accès OAuth du portail disponible. |
| PDF fictif réel : dépôt, téléchargement, SHA-256 | NON TESTÉ | La régression locale existante est réussie, avec Drive simulé. Aucun aller-retour Drive réel effectué. |
| Lecture réelle après redéploiement | NON TESTÉ | Aucun nouveau redéploiement de production exécuté ou vérifié. |
| Refus entre deux clients réels / droits Drive réels | NON TESTÉ | Aucun compte client de test créé en production. Les tests locaux de refus client restent réussis. |
| Export JSON : checksum et restauration | PASS — LOCAL | Export via API sur instance isolée ; empreinte vérifiée ; restauration correcte acceptée et empreinte différente refusée. |
| Export JSON en tant que sauvegarde complète | FAIL | Il exclut les fichiers du coffre, `storage-settings.json`, les objets Drive et les secrets de configuration. Il ne permet pas à lui seul une reprise complète. |
| Copie complète du répertoire privé et restauration | PASS — LOCAL | Dans une instance temporaire, sauvegarde puis restauration des fichiers chiffrés et paramètres OAuth fictifs ; relecture et SHA-256 vérifiés dans un nouveau processus. Le chemin privé est conservé. |
| Sauvegardes Hostinger et restauration complète réelle | NON TESTÉ | Fréquence, rétention, copie indépendante, récupération de la clé et restauration isolée à vérifier sur l'hébergement réel et Drive. |
| Non-mise en cache des réponses privées du portail | PASS — LOCAL | `Cache-Control: no-store` ajouté au routeur du portail, dont l'export de sauvegarde ; correctif non déployé. |
| Compilation et régression | PASS — LOCAL | TypeScript, build client/serveur/CLI ; 10 résultats bootstrap/auth/restauration, 9 statiques, 7 stockage : tous réussis. Node local 24 ; CI ciblée Node 22. |

## Contraintes de recette conservées

Le flux documentaire standard requiert une entreprise et enregistre des métadonnées. Pour respecter l'interdiction de données fictives dans la base de production, ne pas créer d'entreprise de démonstration ni déposer le PDF fictif dans un dossier client réel. Il faut exécuter ce flux dans une instance isolée, ou prévoir un diagnostic administrateur qui appelle les mêmes fonctions de stockage sans écriture métier. Cette seconde voie n'est pas implémentée dans cette intervention.

La base JSON, la couverture des sauvegardes et l'antivirus indépendant restent des points à qualifier avant les clients réels, conformément au rapport précédent. Aucun PASS global de sécurité n'est accordé.

## Blocage opérationnel

Le navigateur distant indique que Hostinger n'autorise pas sa connexion automatisée. Aucun contournement, accès SSH, modification DNS ou réinitialisation de clé n'a été entrepris. La recherche d'une intégration d'hébergement n'a retourné que Hostinger Mail, qui ne gère pas les applications Node ni les fichiers privés. Les actions restantes sur l'hébergement ne sont donc pas réalisables par cette session. Aucune intervention utilisateur n'est demandée pour contourner cette restriction.

La procédure prête à exécuter figure dans [V6_BOOTSTRAP_SANS_SSH.md](V6_BOOTSTRAP_SANS_SSH.md). Les seules entrées privées nécessaires à l'amorçage sont définies par le propriétaire sur son terminal ; son autorisation Google sera demandée une fois la connexion administrateur réellement vérifiée.
