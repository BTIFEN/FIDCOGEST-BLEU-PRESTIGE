# FIDCOGEST Bleu Prestige — Instruction d'exécution dans Google AI Studio

## Mission
Modifier directement l'application React existante **FIDCOGEST-BLEU-PRESTIGE**. Ne pas créer un autre projet, ne pas importer de ZIP, ne pas remplacer le site par une maquette. Préserver les routes, contenus, traductions, navigation, fonctionnalités, formulaires et intégrations existantes.

## 1. Nouvelle introduction de la page d'accueil
Dans `src/pages/HomePage.tsx`, insérer **immédiatement après le menu existant**, au début du contenu principal, un bandeau hero Bleu Prestige inspiré du site fidcogest.indusale.top, sans reproduire le bandeau de titre WordPress.

- Fond bleu nuit `#102B47` ; texte blanc `#FFFFFF` ; accent doré `#D1B47E`.
- Sur-titre : « CABINET D'EXPERTISE COMPTABLE · BELGIQUE ».
- Titre principal : « Vos chiffres éclairent vos décisions. »
- Deuxième ligne dorée : « Nous accompagnons vos ambitions. »
- Description : « Un accompagnement rigoureux et humain pour les entrepreneurs, indépendants et sociétés à Bruxelles et partout en Belgique. »
- Deux boutons visibles, contrastés, accessibles : « Prendre rendez-vous » (ouvre le parcours de rendez-vous existant) et « Découvrir nos services » (navigue vers la section ou route de services existante).
- Bandeau inférieur : Expertise · Proximité · Confiance.
- Mise en page responsive : typographie fluide, retours à la ligne propres, boutons empilés sur petits écrans, aucun débordement horizontal.
- Traduire les nouveaux textes en FR/NL/EN via le mécanisme de traduction déjà utilisé dans le projet, sans coder uniquement le français.
- Les sept pôles d'expertise doivent suivre cette introduction sur fond clair.

## 2. Corriger les libellés invisibles
Dans `src/pages/ServicesPage.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Tabs.tsx` et les styles concernés :
- Les onglets actifs doivent toujours afficher **icône ET texte** (Comptabilité, Fiscalité, Création, Conseil & Pilotage, Audit & Restructuration, Financement & Subsides, E-Compta & Dématérialisation).
- Les boutons bleu nuit doivent toujours présenter leur libellé blanc visible ; les boutons clairs doivent présenter leur libellé bleu nuit visible.
- Vérifier les classes conditionnelles, styles hérités, opacity, text-transparent, z-index, overflow, width et états hover/focus/active/disabled. Corriger la cause réelle dans le composant, pas par un simple cache-misère CSS.
- Éviter toute troncature silencieuse du texte sur tablette et mobile ; autoriser un retour à la ligne si nécessaire.
- Les actions et destinations existantes doivent continuer à fonctionner.

## 3. Menu mobile
Dans `src/components/Navbar.tsx`, conserver toutes les rubriques et les langues FR/NL/EN, mais compacter le menu ouvert : espacement cohérent, hiérarchie visible, boutons de contact lisibles, défilement vertical interne si nécessaire, fermeture opérationnelle.

## 4. Contraintes métier
- Ne pas présenter Basecone comme un outil de FIDCOGEST. Préférer « E-compta & Services numériques » quand le libellé convient.
- Ne pas inventer de nouvelles certifications, références, logiciels ou prestations.
- Ne pas supprimer les contenus ni les fonctions existantes.

## 5. Vérification avant livraison
1. Exécuter le contrôle TypeScript et la compilation disponibles dans le projet.
2. Vérifier visuellement les 7 onglets, les boutons de chaque pôle et le nouveau hero en desktop, tablette et mobile.
3. Vérifier les trois langues, les liens, le menu mobile et l'absence de débordement horizontal.
4. Corriger toute régression détectée avant de déclarer le travail terminé.
5. Présenter les fichiers réellement modifiés et les résultats des vérifications ; ne pas annoncer de succès pour un test non exécuté.

**Exécute les modifications directement dans les fichiers du projet ouvert. Ne réponds pas uniquement par un plan ou un exemple de code.**
