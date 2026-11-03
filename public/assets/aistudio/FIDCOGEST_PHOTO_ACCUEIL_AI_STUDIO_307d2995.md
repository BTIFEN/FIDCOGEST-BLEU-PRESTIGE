# FIDCOGEST — Photo d’accueil Bleu Prestige (modification ciblée)

Modifier **le projet React existant**, sans recréer l’application, sans changer les autres pages ni la navigation.

## 1. `src/pages/HomePage.tsx`

Dans la première section de la page, ajouter la classe `fid-photo-hero`. Avant son contenu, ajouter :

```tsx
<div className="fid-photo-hero-image" role="img" aria-label="Réunion professionnelle FIDCOGEST" />
<div className="fid-photo-hero-fade" aria-hidden="true" />
```

Conserver les titres, les traductions FR/NL/EN et les deux boutons existants. Limiter la largeur du contenu à `max-w-3xl`. Les éléments photo et fondu doivent être placés derrière le texte.

## 2. Ajouter à `src/index.css`

```css
.fid-photo-hero { isolation:isolate; min-height:540px; }
.fid-photo-hero-image { position:absolute; inset:0 0 0 38%; z-index:-2; background-image:url("https://www.fidcogest.be/data/files/photos/1517048676732-d65bc937f952-bad9e8f1.jpg"); background-size:cover; background-position:center; }
.fid-photo-hero-fade { position:absolute; inset:0; z-index:-1; pointer-events:none; background:linear-gradient(90deg,#102B47 0%,#102B47 32%,rgba(16,43,71,.97) 42%,rgba(16,43,71,.72) 56%,rgba(16,43,71,.15) 78%,rgba(16,43,71,.02) 100%); }
.fid-photo-hero-image::after { content:"";position:absolute;inset:0;backdrop-filter:blur(0px);mask-image:linear-gradient(90deg,transparent 0%,black 12%,transparent 35%); }
@media(max-width:767px){.fid-photo-hero-image{inset:0;background-position:65% center;opacity:.48}.fid-photo-hero-fade{background:linear-gradient(90deg,rgba(16,43,71,.98),rgba(16,43,71,.82)),linear-gradient(0deg,#102B47,transparent)}.fid-photo-hero{min-height:auto}}
```

## 3. Contrôles obligatoires

- Vérifier que l’URL de la photo charge effectivement dans le navigateur. Si elle ne charge pas, récupérer la photo depuis fidcogest.be et la stocker dans `public/images/`, puis utiliser son chemin local. Ne pas remplacer par une photo fictive.
- À gauche, texte blanc/doré lisible sur bleu nuit. À droite, photo nette. Au milieu, fondu progressif avec flou discret.
- Les boutons « Prendre rendez-vous » et « Découvrir nos services » restent entièrement visibles et cliquables.
- Vérifier le rendu mobile, tablette et ordinateur ; exécuter la compilation et corriger toute erreur.
- Ne pas publier avant validation visuelle.
