<?php
/**
 * Plugin Name: FIDCOGEST Content Manager
 * Plugin URI: https://www.fidcogest.be
 * Description: Extension officielle d'administration des contenus, coordonnées, services et visuels pour le cabinet FIDCOGEST SRL (Expert-Comptable et Conseil Fiscal Certifié ITAA). Connecte WordPress (fidcogestv2.indusale.top) à l'application React/Express via l'API REST et les Webhooks.
 * Version: 2.0.0
 * Author: FIDCOGEST SRL / ITAA
 * Author URI: https://www.fidcogest.be
 * License: Proprietary
 * Text Domain: fidcogest-cm
 */

if (!defined('ABSPATH')) {
    exit; // Protection contre les accès directs
}

define('FIDCOGEST_CM_VERSION', '2.0.0');
define('FIDCOGEST_CM_PATH', plugin_dir_path(__FILE__));
define('FIDCOGEST_CM_URL', plugin_dir_url(__FILE__));

// Chargement des modules du plugin
require_once FIDCOGEST_CM_PATH . 'includes/media-fields.php';
require_once FIDCOGEST_CM_PATH . 'includes/api-endpoints.php';
require_once FIDCOGEST_CM_PATH . 'includes/webhook-dispatcher.php';
require_once FIDCOGEST_CM_PATH . 'includes/settings-page.php';

/**
 * Initialisation lors de l'activation du plugin
 */
function fidcogest_cm_activate() {
    // Initialisation des options avec les valeurs par défaut officielles FIDCOGEST
    if (!get_option('fidcogest_cabinet_identity')) {
        update_option('fidcogest_cabinet_identity', [
            'name' => 'FIDCOGEST SRL',
            'legalForm' => 'SRL (Société à Responsabilité Limitée)',
            'foundingYear' => 2008,
            'foundingDate' => '17 juillet 2008',
            'bceNumber' => '0899.441.309',
            'vatNumber' => 'BE 0899.441.309',
            'peppolIdentifier' => '0208:0899441309',
            'headquarters' => [
                'address' => 'Place de la Reine Paola n°3',
                'postalCode' => '1083',
                'city' => 'Ganshoren (Bruxelles)',
                'country' => 'Belgique',
                'googleMapsUrl' => 'https://maps.google.com/?q=Place+de+la+Reine+Paola+3+1083+Ganshoren'
            ],
            'phone' => '+32 2 425 18 58',
            'mobile' => '+32 476 62 66 21',
            'email' => 'management@fidcogest.be',
            'secondaryEmail' => 'contact@fidcogest.be',
            'openingHours' => 'Lundi au Vendredi : 08h30 - 18h00 (sur rendez-vous)',
            'officialAccreditation' => 'ITAA (Institute for Tax Advisors and Accountants)',
            'accreditationStatus' => 'Cabinet agréé et certifié ITAA',
            'primaryTool' => 'Basecone (Wolters Kluwer)',
            'verificationNotice' => 'Informations vérifiées conformément à la Banque-Carrefour des Entreprises (BCE).'
        ]);
    }

    if (!get_option('fidcogest_images')) {
        update_option('fidcogest_images', [
            'heroCabinet' => '/assets/images/hero_cabinet_fidcogest.svg',
            'serviceComptabilite' => '/assets/images/service_comptabilite.svg',
            'serviceFiscalite' => '/assets/images/service_fiscalite.svg',
            'serviceCreation' => '/assets/images/service_creation.svg',
            'serviceConseil' => '/assets/images/service_conseil.svg',
            'serviceAudit' => '/assets/images/service_audit.svg',
            'serviceFinancement' => '/assets/images/service_financement.svg',
            'serviceEcomptaBasecone' => '/assets/images/service_ecompta_basecone.svg',
            'cabinetGanshoren' => '/assets/images/cabinet_ganshoren.svg',
            'portraitPaulHollMpeck' => '/assets/images/portrait_paul_holl_mpeck.svg',
            'logo' => '/assets/images/logo_fidcogest.svg',
            'logoDark' => '/assets/images/logo_fidcogest_dark.svg',
            'favicon' => '/assets/images/favicon.svg'
        ]);
    }

    if (!get_option('fidcogest_webhook_config')) {
        update_option('fidcogest_webhook_config', [
            'app_url' => '',
            'webhook_secret' => '',
            'auto_flush' => 0
        ]);
    }


    // Déclenchement de la réécriture des règles REST
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'fidcogest_cm_activate');

/**
 * Enregistrement des scripts et styles d'administration
 */
function fidcogest_cm_admin_scripts($hook) {
    if (strpos($hook, 'fidcogest') === false) {
        return;
    }

    wp_enqueue_media();
    wp_enqueue_style(
        'fidcogest-admin-css',
        FIDCOGEST_CM_URL . 'assets/css/admin.css',
        [],
        FIDCOGEST_CM_VERSION
    );

    wp_enqueue_script(
        'fidcogest-admin-media',
        FIDCOGEST_CM_URL . 'assets/js/admin-media.js',
        ['jquery'],
        FIDCOGEST_CM_VERSION,
        true
    );

    wp_localize_script('fidcogest-admin-media', 'fidcogest_vars', [
        'select_image' => __('Sélectionner un visuel dans la Médiathèque', 'fidcogest-cm'),
        'use_image'    => __('Utiliser cette image pour le Cabinet', 'fidcogest-cm'),
        'nonce'        => wp_create_nonce('fidcogest_media_nonce')
    ]);
}
add_action('admin_enqueue_scripts', 'fidcogest_cm_admin_scripts');
