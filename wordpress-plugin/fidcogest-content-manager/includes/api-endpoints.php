<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enregistrement des routes REST de FIDCOGEST Content Manager
 */
function fidcogest_register_rest_routes() {
    $namespace = 'fidcogest/v1';

    // Route 1 : Configuration complète unifiée pour React / Express
    register_rest_route($namespace, '/content', [
        'methods'             => 'GET',
        'callback'            => 'fidcogest_rest_get_content',
        'permission_callback' => '__return_true', // Accès public pour le rendu du site
    ]);

    // Route 2 : Liste des images et médias uniquement
    register_rest_route($namespace, '/images', [
        'methods'             => 'GET',
        'callback'            => 'fidcogest_rest_get_images',
        'permission_callback' => '__return_true',
    ]);

    // Route 3 : Statut et diagnostic de santé
    register_rest_route($namespace, '/status', [
        'methods'             => 'GET',
        'callback'            => 'fidcogest_rest_get_status',
        'permission_callback' => '__return_true',
    ]);

    // Route 4 : Mise à jour sécurisée des contenus
    register_rest_route($namespace, '/update', [
        'methods'             => 'POST',
        'callback'            => 'fidcogest_rest_update_content',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ]);
}
add_action('rest_api_init', 'fidcogest_register_rest_routes');

/**
 * Retourne l'objet JSON complet attendu par React (CabinetConfig)
 */
function fidcogest_rest_get_content() {
    $identity     = get_option('fidcogest_cabinet_identity', []);
    $divergences  = get_option('fidcogest_divergence_audit', []);
    $team         = get_option('fidcogest_team', []);
    $services     = get_option('fidcogest_services', []);
    $presentation = get_option('fidcogest_presentation', []);
    $images       = fidcogest_get_current_images();

    // Fallbacks si non initialisés
    if (empty($identity)) {
        $identity = [
            'name'                  => 'FIDCOGEST SRL',
            'legalForm'             => 'SRL (Société à Responsabilité Limitée)',
            'foundingYear'          => 2008,
            'foundingDate'          => '17 juillet 2008',
            'bceNumber'             => '0899.441.309',
            'vatNumber'             => 'BE 0899.441.309',
            'peppolIdentifier'      => '0208:0899441309',
            'headquarters'          => [
                'address'       => 'Place de la Reine Paola n°3',
                'postalCode'    => '1083',
                'city'          => 'Ganshoren (Bruxelles)',
                'country'       => 'Belgique',
                'googleMapsUrl' => 'https://maps.google.com/?q=Place+de+la+Reine+Paola+3+1083+Ganshoren'
            ],
            'phone'                 => '+32 2 425 18 58',
            'mobile'                => '+32 476 62 66 21',
            'email'                 => 'management@fidcogest.be',
            'secondaryEmail'        => 'contact@fidcogest.be',
            'openingHours'          => 'Lundi au Vendredi : 08h30 - 18h00 (sur rendez-vous)',
            'officialAccreditation' => 'ITAA (Institute for Tax Advisors and Accountants)',
            'accreditationStatus'   => 'Cabinet agréé et certifié ITAA',
            'primaryTool'           => 'Basecone (Wolters Kluwer)',
            'verificationNotice'    => 'Informations vérifiées conformément à la Banque-Carrefour des Entreprises (BCE).'
        ];
    }

    if (empty($team)) {
        $team = [
            [
                'id'            => 'paul-holl-mpeck',
                'name'          => 'Paul Holl Mpeck',
                'role'          => 'Gérant Fondateur • Expert-comptable certifié & Conseil fiscal certifié ITAA',
                'title'         => 'Expert-Comptable & Conseil Fiscal Certifié',
                'bio'           => 'Fondateur et gérant de FIDCOGEST SRL depuis 2008. Plus de 20 ans d\'expertise dans le conseil aux entreprises, l\'accompagnement des indépendants, la fiscalité stratégique nationale et internationale ainsi que l\'assistance lors des contrôles fiscaux.',
                'specialties'   => [
                    'Comptabilité générale et analytique',
                    'Fiscalité des entreprises & des personnes physiques',
                    'Assistance aux contrôles & litiges fiscaux',
                    'Création de sociétés & Plans financiers',
                    'Audit comptable et diagnostic financier'
                ],
                'accreditation' => 'Membre certifié de l\'ITAA (Institute for Tax Advisors and Accountants)',
                'email'         => 'management@fidcogest.be',
                'location'      => 'Ganshoren (Bruxelles)'
            ]
        ];
    }

    if (empty($services)) {
        $services = [
            [
                'id'          => 'comptabilite',
                'title'       => 'Comptabilité générale et analytique',
                'shortTitle'  => 'Comptabilité',
                'tagline'     => 'Rigueur, traçabilité et conformité continue aux normes comptables belges',
                'description' => 'Tenue intégrale de vos journaux comptables, situations périodiques et bilans officiels BNB.',
                'subServices' => [
                    ['name' => 'Tenue et révision comptable complète', 'details' => 'Saisie et contrôle régulier de vos écritures.'],
                    ['name' => 'Clôture annuelle et comptes annuels BNB', 'details' => 'Dépôt officiel à la Banque Nationale de Belgique.']
                ]
            ],
            [
                'id'          => 'fiscalite',
                'title'       => 'Fiscalité des entreprises et des personnes physiques',
                'shortTitle'  => 'Fiscalité',
                'tagline'     => 'Optimisation de vos charges fiscales dans le strict cadre légal belge',
                'description' => 'Déclarations TVA, Impôt des Sociétés (ISOC 20%), IPP et dividendes VVPR-bis à 15%.',
                'subServices' => [
                    ['name' => 'Déclarations TVA périodiques', 'details' => 'Gestion mensuelle/trimestrielle et listings clients.'],
                    ['name' => 'Impôt des Sociétés (ISOC)', 'details' => 'Optimisation du taux réduit à 20% sur les premiers 100.000 €.']
                ]
            ],
            [
                'id'          => 'creation-entreprises',
                'title'       => 'Création d\'entreprises et plans financiers',
                'shortTitle'  => 'Création & Starters',
                'tagline'     => 'Transformez votre projet en une entreprise belge pérenne et structurée',
                'description' => 'Du plan financier notarié à l\'immatriculation BCE et l\'activation TVA.',
                'subServices' => [
                    ['name' => 'Plan financier notarié légal', 'details' => 'Élaboration du plan financier obligatoire pour la constitution d\'une SRL.'],
                    ['name' => 'Formalités de constitution & Guichet d\'entreprises', 'details' => 'Immatriculation BCE, demande de numéro de TVA.']
                ]
            ],
            [
                'id'          => 'conseil-gestion',
                'title'       => 'Conseil de gestion et tableaux de bord',
                'shortTitle'  => 'Conseil de Gestion',
                'tagline'     => 'Des indicateurs fiables pour piloter vos décisions et anticiper l\'avenir',
                'description' => 'Budgets prévisionnels, analyse des marges et tableaux de bord personnalisés.',
                'subServices' => [
                    ['name' => 'Tableaux de bord & KPIs', 'details' => 'Suivi de la rentabilité et de la trésorerie.']
                ]
            ],
            [
                'id'          => 'audit-evaluation',
                'title'       => 'Audit contractuel et évaluation d\'entreprises',
                'shortTitle'  => 'Audit & Évaluation',
                'tagline'     => 'Une analyse indépendante et rigoureuse pour sécuriser vos transactions',
                'description' => 'Due diligence comptable, évaluation de valorisation et diagnostic préventif.',
                'subServices' => [
                    ['name' => 'Audit contractuel', 'details' => 'Vérification de la sincérité des comptes.']
                ]
            ],
            [
                'id'          => 'financement-subsides',
                'title'       => 'Recherche de financements et subsides',
                'shortTitle'  => 'Financement & Primes',
                'tagline'     => 'Maximisez vos chances d\'obtenir crédits bancaires et aides régionales',
                'description' => 'Montage de dossiers de crédit professionnel et activation des aides publiques.',
                'subServices' => [
                    ['name' => 'Dossiers de crédit d\'investissement', 'details' => 'Constitution de dossiers bancaires complets.']
                ]
            ],
            [
                'id'          => 'e-compta',
                'title'       => 'E-compta et services digitaux (Basecone)',
                'shortTitle'  => 'E-Compta & Basecone',
                'tagline'     => 'Une collaboration 100% numérique, fluide et sécurisée avec votre expert',
                'description' => 'Dépôt dématérialisé, reconnaissance OCR et conformité Peppol 2026.',
                'subServices' => [
                    ['name' => 'Plateforme collaborative Basecone', 'details' => 'Archivage légal certifié 10 ans et OCR.']
                ]
            ]
        ];
    }

    if (empty($presentation)) {
        $presentation = [
            'title'           => 'Fidcogest — Expert-Comptable et Conseil Fiscal Certifié ITAA',
            'subtitle'        => 'Au service des entrepreneurs, PME et indépendants depuis 2008',
            'experienceYears' => 18,
            'piliers'         => [
                ['titre' => 'Proximité & Disponibilité', 'texte' => 'Un interlocuteur unique et dédié qui connaît votre dossier.'],
                ['titre' => 'Compétence & Rigueur ITAA', 'texte' => 'Des conseils certifiés fondés sur le strict respect du secret professionnel.'],
                ['titre' => 'Innovation Digitale (Basecone)', 'texte' => 'Zéro papier superflu : numérisation simplifiée et visibilité instantanée.'],
                ['titre' => 'Vision Stratégique & Économies d\'Impôt', 'texte' => 'Une optimisation proactive de vos revenus nets et de la charge fiscale.']
            ]
        ];
    }

    $response = [
        'cabinet'             => $identity,
        'divergenceAudit'     => $divergences,
        'team'                => $team,
        'services'            => $services,
        'presentationCabinet' => $presentation,
        'images'              => $images,
        '_server'             => [
            'generator'   => 'FIDCOGEST-Content-Manager-v2.0',
            'wordpress'   => get_bloginfo('wpurl'),
            'generatedAt' => current_time('mysql'),
            'timestamp'   => time()
        ]
    ];

    return rest_ensure_response($response);
}

/**
 * Retourne uniquement les images
 */
function fidcogest_rest_get_images() {
    return rest_ensure_response(fidcogest_get_current_images());
}

/**
 * Diagnostic de santé
 */
function fidcogest_rest_get_status() {
    return rest_ensure_response([
        'status'         => 'active',
        'plugin_version' => FIDCOGEST_CM_VERSION,
        'site_url'       => get_site_url(),
        'rest_url'       => rest_url('fidcogest/v1/content'),
        'timestamp'      => time()
    ]);
}

/**
 * Endpoint de mise à jour sécurisée des contenus et visuels
 */
function fidcogest_rest_update_content(WP_REST_Request $request) {
    if (!current_user_can('manage_options')) {
        return new WP_Error('rest_forbidden', 'Action réservée aux administrateurs autorisés.', ['status' => 403]);
    }

    $params = $request->get_json_params();
    $allowed_fields = fidcogest_get_media_fields_definition();

    if (!empty($params['images']) && is_array($params['images'])) {
        $current = get_option('fidcogest_images', []);
        foreach ($params['images'] as $k => $v) {
            // Rejeter toute clé non déclarée dans la définition officielle
            if (!isset($allowed_fields[$k])) {
                continue;
            }
            $raw_val = trim((string)$v);
            if (strpos($raw_val, '/assets/') === 0) {
                $current[$k] = sanitize_text_field($raw_val);
            } else {
                $current[$k] = esc_url_raw($raw_val);
            }
        }
        update_option('fidcogest_images', $current);
    }

    // Déclencher le webhook de purge vers l'application Express
    fidcogest_trigger_flush_webhook();

    return rest_ensure_response([
        'success' => true,
        'message' => 'Contenus et visuels FIDCOGEST mis à jour avec succès.',
        'images'  => fidcogest_get_current_images()
    ]);
}

