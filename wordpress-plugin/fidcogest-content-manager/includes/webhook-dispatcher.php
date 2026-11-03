<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Valide rigoureusement l'URL de destination du webhook pour prévenir les attaques SSRF.
 * Exigence 5 : Limiter les destinations de webhook aux URL HTTPS autorisées.
 *
 * @param string $url URL de l'application cliente
 * @return string|WP_Error URL validée et assainie ou WP_Error en cas d'URL non autorisée
 */
function fidcogest_validate_webhook_url($url) {
    if (empty($url) || !is_string($url)) {
        return new WP_Error('empty_url', 'L\'URL du webhook ne peut pas être vide.');
    }

    $url = trim($url);

    // Assainissement et vérification de la syntaxe
    $validated = wp_http_validate_url($url);
    if (!$validated) {
        return new WP_Error('invalid_url', 'L\'URL spécifiée n\'est pas une URL HTTP/HTTPS syntaxiquement valide.');
    }

    $parsed = wp_parse_url($validated);
    if (!$parsed || empty($parsed['scheme']) || empty($parsed['host'])) {
        return new WP_Error('parse_error', 'Impossible de parser l\'hôte ou le protocole de l\'URL.');
    }

    $scheme = strtolower($parsed['scheme']);
    $host   = strtolower($parsed['host']);

    // Autorisation conditionnelle de localhost / 127.0.0.1 UNIQUEMENT si WP_DEBUG est activé pour les environnements de test
    $is_local_dev = in_array($host, ['localhost', '127.0.0.1', '::1'], true) && defined('WP_DEBUG') && WP_DEBUG;

    if (!$is_local_dev) {
        // En production : le protocole chiffré HTTPS est strictement exigé
        if ($scheme !== 'https') {
            return new WP_Error(
                'insecure_protocol',
                'Pour garantir la sécurité et la confidentialité des échanges, les webhooks doivent impérativement utiliser le protocole chiffré HTTPS.'
            );
        }

        // Protection SSRF : interdiction stricte des plages d'adresses IP privées, de bouclage et de métadonnées cloud
        $resolved_ip = gethostbyname($host);
        if (filter_var($resolved_ip, FILTER_VALIDATE_IP)) {
            $flags = FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE;
            if (!filter_var($resolved_ip, FILTER_VALIDATE_IP, $flags)) {
                return new WP_Error(
                    'private_ip_blocked',
                    'Les requêtes vers des adresses réseau internes ou privées sont formellement bloquées (protection SSRF).'
                );
            }
        }
    }

    return rtrim($validated, '/');
}

/**
 * Déclenche le Webhook de purge du cache vers l'application Express/Node.js
 */
function fidcogest_trigger_flush_webhook() {
    $config = get_option('fidcogest_webhook_config', []);

    if (empty($config['auto_flush'])) {
        return false;
    }

    // Exigence 3 : Refuser les appels webhook lorsque le secret n'est pas configuré
    $secret = !empty($config['webhook_secret']) ? trim($config['webhook_secret']) : '';
    if (empty($secret) || strlen($secret) < 24) {
        update_option('fidcogest_last_webhook_trigger', [
            'timestamp' => current_time('mysql'),
            'target'    => 'Non envoyé',
            'status'    => 'refused_no_secret',
            'message'   => 'Échec : Le secret de webhook n\'est pas configuré ou est trop court (< 24 caractères).'
        ]);
        return false;
    }

    // Exigence 5 : Validation stricte HTTPS & protection SSRF
    $app_url = !empty($config['app_url']) ? trim($config['app_url']) : '';
    $validated_url = fidcogest_validate_webhook_url($app_url);
    if (is_wp_error($validated_url)) {
        update_option('fidcogest_last_webhook_trigger', [
            'timestamp' => current_time('mysql'),
            'target'    => esc_html($app_url),
            'status'    => 'refused_invalid_url',
            'message'   => $validated_url->get_error_message()
        ]);
        return false;
    }

    $webhook_endpoint = $validated_url . '/api/webhook/wp-flush';

    // Exigence 4 : Utiliser exclusivement l'en-tête HTTP x-fidcogest-secret (aucun paramètre dans l'URL)
    $args = [
        'method'      => 'POST',
        'timeout'     => 5,
        'redirection' => 0, // Interdire les redirections non contrôlées (prévention SSRF)
        'httpversion' => '1.1',
        'blocking'    => false, // Asynchrone pour ne pas pénaliser la réactivité du back-office
        'headers'     => [
            'Content-Type'        => 'application/json',
            'x-fidcogest-secret' => $secret,
            'User-Agent'          => 'FIDCOGEST-WordPress-Webhook/2.0'
        ],
        'body'        => wp_json_encode([
            'event'     => 'content_updated',
            'source'    => get_site_url(),
            'timestamp' => time()
        ])
    ];

    $response = wp_remote_post($webhook_endpoint, $args);

    update_option('fidcogest_last_webhook_trigger', [
        'timestamp' => current_time('mysql'),
        'target'    => $webhook_endpoint,
        'status'    => is_wp_error($response) ? 'error' : 'dispatched',
        'message'   => is_wp_error($response) ? $response->get_error_message() : 'Requête de purge transmise avec succès'
    ]);

    return true;
}

/**
 * Déclenchement automatique sécurisé lors de la mise à jour des options FIDCOGEST
 */
add_action('update_option_fidcogest_images', 'fidcogest_trigger_flush_webhook');
add_action('update_option_fidcogest_cabinet_identity', 'fidcogest_trigger_flush_webhook');
add_action('update_option_fidcogest_team', 'fidcogest_trigger_flush_webhook');
add_action('update_option_fidcogest_services', 'fidcogest_trigger_flush_webhook');
add_action('update_option_fidcogest_presentation', 'fidcogest_trigger_flush_webhook');
