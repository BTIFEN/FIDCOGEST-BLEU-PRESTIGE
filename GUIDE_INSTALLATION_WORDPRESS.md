# GUIDE D'INSTALLATION & D'ADMINISTRATION WORDPRESS
## Extension Officielle : FIDCOGEST Content Manager (v2.0.0)

Ce guide s'adresse aux administrateurs du cabinet **FIDCOGEST SRL** (Expert-comptable et Conseil fiscal certifié ITAA). Il explique comment installer l'extension WordPress et administrer l'ensemble des contenus, images et coordonnées du site sans toucher au code ni redéployer l'application.

---

### 1. Présentation de l'Architecture

Le site FIDCOGEST repose sur une architecture moderne **Headless / Hybride** :
- **WordPress** (`https://fidcogestv2.indusale.top`) : Sert de console d'administration pour la gestion des textes, des 13 visuels officiels et des coordonnées via la Médiathèque native de WordPress.
- **Node.js / Express** : Passerelle d'API ultra-rapide avec cache mémoire (TTL 5 min) et purge instantanée par webhook.
- **React / Vite** : Application frontend haut de gamme avec le thème **Cabinet Premium** (Bleu Prestige #142B45, Or discret #B79661, Blanc cassé #F7F6F2) et les simulateurs fiscaux belges certifiés ITAA.

---

### 2. Téléversement et Activation de l'Extension sur WordPress

L'archive prête à l'emploi se nomme :  
`FIDCOGEST-Content-Manager.zip`

1. Connectez-vous à l'espace d'administration de WordPress :  
   `https://fidcogestv2.indusale.top/wp-login.php`
2. Dans le menu de gauche, rendez-vous sur **Extensions** > **Ajouter une extension**.
3. En haut de la page, cliquez sur le bouton **Téléverser une extension**.
4. Cliquez sur **Choisir un fichier**, sélectionnez l'archive `FIDCOGEST-Content-Manager.zip`.
5. Cliquez sur **Installer maintenant**.
6. Une fois le téléversement terminé, cliquez sur **Activer l'extension**.

> **Résultat :** Un nouveau menu nommé **FIDCOGEST** avec l'icône de calculatrice comptable apparaît immédiatement dans la barre latérale gauche de WordPress.

---

### 3. Gestion des 13 Visuels & Médias dans la Médiathèque

Pour remplacer une image sur le site React :
1. Dans WordPress, cliquez sur **FIDCOGEST** > **Visuels & Images**.
2. Vous accédez à la grille des 13 emplacements officiels :
   - **Emplacement 1 :** Image Principale Hero Cabinet (1200x800 px)
   - **Emplacement 2 :** Pôle 1 — Comptabilité Générale & Analytique (800x500 px)
   - **Emplacement 3 :** Pôle 2 — Fiscalité des Sociétés & IPP (800x500 px)
   - **Emplacement 4 :** Pôle 3 — Création d'Entreprises & Plan Financier (800x500 px)
   - **Emplacement 5 :** Pôle 4 — Conseil de Gestion & Tableaux de Bord (800x500 px)
   - **Emplacement 6 :** Pôle 5 — Audit Contractuel & Évaluation (800x500 px)
   - **Emplacement 7 :** Pôle 6 — Financements & Subsides Régionaux (800x500 px)
   - **Emplacement 8 :** Pôle 7 — E-Compta & Basecone / Peppol (800x500 px)
   - **Emplacement 9 :** Siège du Cabinet & Façade (Ganshoren) (800x500 px)
   - **Emplacement 10 :** Portrait de Paul Holl Mpeck, Gérant Fondateur ITAA (600x600 px)
   - **Emplacement 11 :** Logo Principal FIDCOGEST (Fond clair)
   - **Emplacement 12 :** Logo FIDCOGEST Inversé (Fond sombre pour pied de page)
   - **Emplacement 13 :** Favicon du Cabinet (64x64 px)
3. Cliquez sur **Médiathèque WP** en face de l'image souhaitée.
4. Téléversez votre image ou choisissez une photo existante dans la Médiathèque WordPress.
5. Cliquez sur **Utiliser ce visuel**. L'aperçu se met à jour en direct.
6. Cliquez sur le bouton bleu en bas : **Enregistrer tous les visuels et synchroniser**.

> **Note :** Si une image ne convient plus, vous pouvez cliquer à tout moment sur **Rétablir officiel** pour réactiver l'illustration vectorielle certifiée.

---

### 4. Configuration de la Passerelle Webhook Sécurisée

Pour que vos modifications s'affichent instantanément sur le site React sans attendre l'expiration du cache (5 minutes) :
1. Dans WordPress, allez dans **FIDCOGEST** > **Connexion & Webhook**.
2. Renseignez les paramètres de sécurité :
   - **URL de l'application :** Saisissez l'adresse HTTPS de votre application Node.js (ex: `https://votre-app.hostinger.app` ou `https://www.fidcogest.be`). Pour des raisons de sécurité (SSRF), le protocole `https://` est obligatoire.
   - **Secret de sécurité :** Cliquez sur **Générer un secret robuste (48 car.)**. Copiez immédiatement cette chaîne aléatoire et collez-la dans la variable `WP_WEBHOOK_SECRET` du fichier `.env` de votre serveur Hostinger.
   - Cochez la case **Purge automatique**.
3. Cliquez sur **Enregistrer la configuration**, puis sur **Tester l'envoi du webhook maintenant**.
4. Un bandeau vert confirme que le serveur Express a validé l'en-tête `x-fidcogest-secret` et purgé son cache avec succès.


---

### 5. Résilience et Haute Disponibilité

- **WordPress indisponible ou en maintenance ?**  
  Aucun problème : le serveur Node.js conserve en permanence une copie locale de secours dans `data/cabinet-content.json`. Les visiteurs ne voient aucune erreur ni page blanche.
- **Sécurité :**  
  Toutes les requêtes de purge du webhook sont protégées par le header secret `x-fidcogest-secret`. L'accès aux modifications sur WordPress nécessite le rôle Administrateur (`manage_options`).
