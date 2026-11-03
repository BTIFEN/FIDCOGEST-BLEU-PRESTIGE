<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Retourne la liste des champs médias gérés par le cabinet FIDCOGEST
 */
function fidcogest_get_media_fields_definition() {
    return [
        'heroCabinet' => [
            'label'       => '1. Image Principale Hero Cabinet',
            'description' => 'Aperçu vitrine affiché en haut de la page d\'accueil. Recommandé : 1200x800px (format paysage élégant).',
            'default'     => '/assets/images/hero_cabinet_fidcogest.svg',
            'recommended' => '1200 x 800 px (SVG, PNG ou WebP)'
        ],
        'serviceComptabilite' => [
            'label'       => '2. Pôle 1 — Comptabilité Générale & Analytique',
            'description' => 'Illustration du pôle de tenue de livres, bilans BNB et situations périodiques.',
            'default'     => '/assets/images/service_comptabilite.svg',
            'recommended' => '800 x 500 px'
        ],
        'serviceFiscalite' => [
            'label'       => '3. Pôle 2 — Fiscalité des Sociétés & IPP',
            'description' => 'Illustration du pôle déclarations TVA, ISOC 20%, dividendes VVPR-bis et assistance fiscale.',
            'default'     => '/assets/images/service_fiscalite.svg',
            'recommended' => '800 x 500 px'
        ],
        'serviceCreation' => [
            'label'       => '4. Pôle 3 — Création d\'Entreprises & Plan Financier',
            'description' => 'Illustration du pôle accompagnement des starters, statuts notariés et plan financier.',
            'default'     => '/assets/images/service_creation.svg',
            'recommended' => '800 x 500 px'
        ],
        'serviceConseil' => [
            'label'       => '5. Pôle 4 — Conseil de Gestion & Tableaux de Bord',
            'description' => 'Illustration du pilotage de trésorerie, ratios financiers et accompagnement du dirigeant.',
            'default'     => '/assets/images/service_conseil.svg',
            'recommended' => '800 x 500 px'
        ],
        'serviceAudit' => [
            'label'       => '6. Pôle 5 — Audit Contractuel & Évaluation',
            'description' => 'Illustration de l\'audit pré-acquisition, due diligence et valorisation de parts sociales.',
            'default'     => '/assets/images/service_audit.svg',
            'recommended' => '800 x 500 px'
        ],
        'serviceFinancement' => [
            'label'       => '7. Pôle 6 — Financements & Subsides Régionaux',
            'description' => 'Illustration de la recherche de crédits bancaires et primes régionales (Bruxelles/Wallonie).',
            'default'     => '/assets/images/service_financement.svg',
            'recommended' => '800 x 500 px'
        ],
        'serviceEcomptaBasecone' => [
            'label'       => '8. Pôle 7 — E-Compta & Basecone (Wolters Kluwer)',
            'description' => 'Illustration du portail numérique, de l\'OCR des factures et de la transition Peppol 2026.',
            'default'     => '/assets/images/service_ecompta_basecone.svg',
            'recommended' => '800 x 500 px'
        ],
        'cabinetGanshoren' => [
            'label'       => '9. Siège du Cabinet & Bureaux (Ganshoren)',
            'description' => 'Vue des locaux ou de la façade : Place de la Reine Paola 3, 1083 Ganshoren (Bruxelles).',
            'default'     => '/assets/images/cabinet_ganshoren.svg',
            'recommended' => '800 x 500 px'
        ],
        'portraitPaulHollMpeck' => [
            'label'       => '10. Portrait de Paul Holl Mpeck (Gérant Fondateur ITAA)',
            'description' => 'Portrait officiel de la direction pour la page Équipe et À Propos.',
            'default'     => '/assets/images/portrait_paul_holl_mpeck.svg',
            'recommended' => '600 x 600 px (Format carré)'
        ],
        'logo' => [
            'label'       => '11. Logo Principal FIDCOGEST (Fond clair)',
            'description' => 'Logo officiel avec sceau ITAA pour la barre de navigation et les en-têtes blancs.',
            'default'     => '/assets/images/logo_fidcogest.svg',
            'recommended' => '450 x 100 px (SVG ou PNG transparent)'
        ],
        'logoDark' => [
            'label'       => '12. Logo FIDCOGEST Inversé (Fond sombre)',
            'description' => 'Logo doré/blanc pour le pied de page (Bleu Nuit #142B45) et les bannières sombres.',
            'default'     => '/assets/images/logo_fidcogest_dark.svg',
            'recommended' => '450 x 100 px (SVG ou PNG transparent)'
        ],
        'favicon' => [
            'label'       => '13. Favicon & Icône d\'Onglet',
            'description' => 'Icône carrée affichée dans l\'onglet du navigateur et les favoris.',
            'default'     => '/assets/images/favicon.svg',
            'recommended' => '64 x 64 px'
        ],
    ];
}

/**
 * Récupère les URLs d'images actuelles avec fallbacks
 */
function fidcogest_get_current_images() {
    $fields = fidcogest_get_media_fields_definition();
    $saved  = get_option('fidcogest_images', []);

    $resolved = [];
    foreach ($fields as $key => $meta) {
        $resolved[$key] = !empty($saved[$key]) ? esc_url_raw($saved[$key]) : $meta['default'];
    }

    return $resolved;
}
