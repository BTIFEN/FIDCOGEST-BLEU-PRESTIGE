# FIDCOGEST V6 — Développement et configuration différée du propriétaire

Le développeur prépare et livre le site. Il n'a pas à définir les identifiants personnels, le MFA, le compte Google ou l'organisation interne du futur propriétaire.

## Affichage d'administration

L'écran `/admin` présente un message **Mode développement — Configuration finale réservée au propriétaire du cabinet**, visible avant la connexion. Après authentification, l'onglet **Mise en service par le propriétaire** ouvre le même dossier de transmission ; le rappel reste visible dans les autres onglets. Le panneau Administration et Sécurité du portail rappelle aussi cette phase.

Ce message est un état de préparation de la livraison, pas une modification de `NODE_ENV` ni un mode de contournement d'authentification. Il ne crée aucun compte, ne modifie aucune donnée métier et n'accorde aucun droit. Les réglages WordPress, du site et du stockage existants sont conservés. Aucune nouvelle installation sur le poste du développeur n'est requise.

## Configuration ultérieure par le comptable propriétaire

- Choisir son compte réel et son Authenticator, avec la préparation navigateur et le dépôt privé existants. Une préparation commencée par une autre personne doit être abandonnée ; le propriétaire crée sa propre clé MFA.
- Choisir sa destination documentaire parmi les fournisseurs disponibles dans l'administration du portail et les destinations par entreprise.
- Organiser les comptes et permissions de son équipe et des clients dans les fonctions existantes.
- Vérifier la connexion/déconnexion, les droits, le cycle documentaire réel et la reprise après sauvegarde avant les dossiers clients.

Les cartes affichées sont des responsabilités à reprendre ; elles ne sont pas des contrôles automatiquement réussis. La validation du portail reste différée. Le bandeau de préparation sera à réévaluer après la recette réelle, et ne fournit pas de bouton déclarant une plateforme validée sans preuve.
