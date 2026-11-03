<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enregistrement des menus d'administration WordPress pour FIDCOGEST
 */
function fidcogest_cm_add_admin_menu() {
    add_menu_page(
        'FIDCOGEST',
        'FIDCOGEST',
        'manage_options',
        'fidcogest-dashboard',
        'fidcogest_render_dashboard_page',
        'dashicons-calculator',
        25
    );

    add_submenu_page(
        'fidcogest-dashboard',
        'Tableau de bord • FIDCOGEST',
        'Tableau de bord',
        'manage_options',
        'fidcogest-dashboard',
        'fidcogest_render_dashboard_page'
    );

    add_submenu_page(
        'fidcogest-dashboard',
        'Visuels & Images • FIDCOGEST',
        'Visuels & Images',
        'manage_options',
        'fidcogest-images',
        'fidcogest_render_images_page'
    );

    add_submenu_page(
        'fidcogest-dashboard',
        'Identité & Coordonnées • FIDCOGEST',
        'Coordonnées & Siège',
        'manage_options',
        'fidcogest-identity',
        'fidcogest_render_identity_page'
    );

    add_submenu_page(
        'fidcogest-dashboard',
        'Équipe & Direction • FIDCOGEST',
        'Équipe & Direction',
        'manage_options',
        'fidcogest-team',
        'fidcogest_render_team_page'
    );

    add_submenu_page(
        'fidcogest-dashboard',
        'Services & Pôles • FIDCOGEST',
        'Les 7 Pôles',
        'manage_options',
        'fidcogest-services',
        'fidcogest_render_services_page'
    );

    add_submenu_page(
        'fidcogest-dashboard',
        'Paramètres Webhook & Connexion • FIDCOGEST',
        'Connexion & Webhook',
        'manage_options',
        'fidcogest-webhook',
        'fidcogest_render_webhook_page'
    );
}
add_action('admin_menu', 'fidcogest_cm_add_admin_menu');

/**
 * Page 1 : Tableau de bord
 */
function fidcogest_render_dashboard_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('Accès non autorisé.', 'fidcogest-cm'));
    }

    $rest_endpoint = rest_url('fidcogest/v1/content');
    $webhook = get_option('fidcogest_webhook_config', []);
    $last_trigger = get_option('fidcogest_last_webhook_trigger', null);
    $has_secret = !empty($webhook['webhook_secret']) && strlen(trim($webhook['webhook_secret'])) >= 24;
    ?>
    <div class="wrap fidcogest-admin-wrap">
        <div class="fidcogest-header">
            <div class="fidcogest-badge">CABINET CERTIFIÉ ITAA</div>
            <h1>FIDCOGEST Content Manager</h1>
            <p>Administration centralisée des contenus, visuels et coordonnées pour l'application React/Express.</p>
        </div>

        <div class="fidcogest-grid">
            <div class="fidcogest-card">
                <h2>Statut de l'API REST Headless</h2>
                <p>L'endpoint ci-dessous fournit le flux JSON complet consommé en continu par l'application Express :</p>
                <div class="fidcogest-endpoint-box">
                    <code><?php echo esc_url($rest_endpoint); ?></code>
                    <a href="<?php echo esc_url($rest_endpoint); ?>" target="_blank" class="button button-secondary">Consulter le flux JSON &rarr;</a>
                </div>
            </div>

            <div class="fidcogest-card">
                <h2>Sécurité Webhook &amp; Synchronisation</h2>
                <p>La purge instantanée du cache Express est protégée par un secret d'en-tête HTTP et le protocole chiffré HTTPS.</p>
                <ul>
                    <li><strong>URL de destination :</strong> <?php echo !empty($webhook['app_url']) ? esc_html($webhook['app_url']) : '<em class="text-muted">Non configurée</em>'; ?></li>
                    <li><strong>Secret cryptographique :</strong> <?php echo $has_secret ? '<span class="status-badge status-ok">Configuré et sécurisé</span>' : '<span class="status-badge status-off">Non configuré</span>'; ?></li>
                    <li><strong>Purge automatique :</strong> <?php echo !empty($webhook['auto_flush']) ? '<span class="status-badge status-ok">Activée</span>' : '<span class="status-badge status-off">Désactivée</span>'; ?></li>
                    <li><strong>Dernier événement :</strong> <?php echo esc_html($last_trigger['timestamp'] ?? 'Aucun pour le moment'); ?></li>
                </ul>
                <a href="<?php echo admin_url('admin.php?page=fidcogest-webhook'); ?>" class="button button-primary">Gérer la passerelle Webhook</a>
            </div>
        </div>

        <div class="fidcogest-card" style="margin-top:20px;">
            <h2>Visuels &amp; Médias du Cabinet (13 Emplacements)</h2>
            <p>Remplacez en 1 clic l'illustration hero, les 7 pôles de compétences, le portrait de Paul Holl Mpeck ou le logo via la Médiathèque standard de WordPress.</p>
            <a href="<?php echo admin_url('admin.php?page=fidcogest-images'); ?>" class="button button-primary button-hero">Gérer les 13 Visuels dans la Médiathèque &rarr;</a>
        </div>
    </div>
    <?php
}

/**
 * Page 2 : Gestionnaire des 13 Visuels & Médias
 */
function fidcogest_render_images_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('Accès non autorisé.', 'fidcogest-cm'));
    }

    $fields = fidcogest_get_media_fields_definition();

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && check_admin_referer('fidcogest_save_images_nonce')) {
        $saved = [];
        foreach ($fields as $key => $meta) {
            if (isset($_POST['fidcogest_img_' . $key])) {
                $raw_val = trim($_POST['fidcogest_img_' . $key]);
                // Autoriser uniquement les URL complètes HTTP/HTTPS ou les chemins relatifs commençant par /assets/
                if (strpos($raw_val, '/assets/') === 0) {
                    $saved[$key] = sanitize_text_field($raw_val);
                } else {
                    $saved[$key] = esc_url_raw($raw_val);
                }
            }
        }
        update_option('fidcogest_images', $saved);
        echo '<div class="notice notice-success is-dismissible"><p><strong>Visuels enregistrés avec succès !</strong> Le signal de synchronisation a été déclenché vers l\'application Express.</p></div>';
    }

    $current_images = fidcogest_get_current_images();
    ?>
    <div class="wrap fidcogest-admin-wrap">
        <div class="fidcogest-header">
            <div class="fidcogest-badge">MÉDIATHÈQUE CABINET PREMIUM</div>
            <h1>Gestionnaire des Visuels &amp; Images du Cabinet</h1>
            <p>Sélectionnez, remplacez ou rétablissez n'importe quelle illustration officielle sans toucher au code ni redéployer.</p>
        </div>

        <form method="post" action="">
            <?php wp_nonce_field('fidcogest_save_images_nonce'); ?>

            <div class="fidcogest-media-grid">
                <?php foreach ($fields as $key => $meta): 
                    $val = $current_images[$key] ?? $meta['default'];
                ?>
                <div class="fidcogest-media-item" data-field="<?php echo esc_attr($key); ?>">
                    <div class="fidcogest-media-preview">
                        <img src="<?php echo esc_url($val); ?>" id="preview_<?php echo esc_attr($key); ?>" alt="<?php echo esc_attr($meta['label']); ?>" />
                    </div>
                    <div class="fidcogest-media-meta">
                        <h3><?php echo esc_html($meta['label']); ?></h3>
                        <p class="description"><?php echo esc_html($meta['description']); ?></p>
                        <p class="recommended">Format conseillé : <strong><?php echo esc_html($meta['recommended']); ?></strong></p>
                        
                        <div class="fidcogest-media-inputs">
                            <input type="text" name="fidcogest_img_<?php echo esc_attr($key); ?>" id="input_<?php echo esc_attr($key); ?>" value="<?php echo esc_attr($val); ?>" class="regular-text" />
                            <div class="fidcogest-btn-group">
                                <button type="button" class="button button-primary fidcogest-upload-btn" data-target="<?php echo esc_attr($key); ?>">
                                    <span class="dashicons dashicons-admin-media"></span> Médiathèque WP
                                </button>
                                <button type="button" class="button fidcogest-reset-btn" data-target="<?php echo esc_attr($key); ?>" data-default="<?php echo esc_attr($meta['default']); ?>">
                                    Rétablir officiel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>

            <div class="fidcogest-submit-bar">
                <button type="submit" class="button button-primary button-hero">
                    <span class="dashicons dashicons-saved"></span> Enregistrer tous les visuels et synchroniser
                </button>
            </div>
        </form>
    </div>
    <?php
}

/**
 * Page 3 : Identité & Coordonnées
 */
function fidcogest_render_identity_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('Accès non autorisé.', 'fidcogest-cm'));
    }

    $identity = get_option('fidcogest_cabinet_identity', []);

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && check_admin_referer('fidcogest_save_identity_nonce')) {
        $clean = [
            'name'                  => sanitize_text_field($_POST['name'] ?? ''),
            'legalForm'             => sanitize_text_field($_POST['legalForm'] ?? ''),
            'foundingYear'          => intval($_POST['foundingYear'] ?? 2008),
            'foundingDate'          => sanitize_text_field($_POST['foundingDate'] ?? '17 juillet 2008'),
            'bceNumber'             => sanitize_text_field($_POST['bceNumber'] ?? ''),
            'vatNumber'             => sanitize_text_field($_POST['vatNumber'] ?? ''),
            'peppolIdentifier'      => sanitize_text_field($_POST['peppolIdentifier'] ?? ''),
            'phone'                 => sanitize_text_field($_POST['phone'] ?? ''),
            'mobile'                => sanitize_text_field($_POST['mobile'] ?? ''),
            'email'                 => sanitize_email($_POST['email'] ?? ''),
            'secondaryEmail'        => sanitize_email($_POST['secondaryEmail'] ?? ''),
            'openingHours'          => sanitize_text_field($_POST['openingHours'] ?? ''),
            'officialAccreditation' => sanitize_text_field($_POST['officialAccreditation'] ?? 'ITAA (Institute for Tax Advisors and Accountants)'),
            'accreditationStatus'   => sanitize_text_field($_POST['accreditationStatus'] ?? 'Cabinet agréé et certifié ITAA'),
            'primaryTool'           => sanitize_text_field($_POST['primaryTool'] ?? 'Basecone (Wolters Kluwer)'),
            'headquarters'          => [
                'address'       => sanitize_text_field($_POST['hq_address'] ?? ''),
                'postalCode'    => sanitize_text_field($_POST['hq_postalCode'] ?? ''),
                'city'          => sanitize_text_field($_POST['hq_city'] ?? ''),
                'country'       => sanitize_text_field($_POST['hq_country'] ?? 'Belgique'),
                'googleMapsUrl' => esc_url_raw($_POST['hq_mapsUrl'] ?? '')
            ]
        ];
        update_option('fidcogest_cabinet_identity', $clean);
        echo '<div class="notice notice-success is-dismissible"><p><strong>Coordonnées enregistrées avec succès !</strong></p></div>';
        $identity = $clean;
    }
    ?>
    <div class="wrap fidcogest-admin-wrap">
        <div class="fidcogest-header">
            <div class="fidcogest-badge">REGISTRE LÉGAL BELGE</div>
            <h1>Identité &amp; Coordonnées Officielles</h1>
            <p>Conforme à la Banque-Carrefour des Entreprises (BCE) et aux statuts de FIDCOGEST SRL.</p>
        </div>

        <form method="post" action="">
            <?php wp_nonce_field('fidcogest_save_identity_nonce'); ?>
            <div class="fidcogest-card">
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="name">Dénomination Sociale</label></th>
                        <td><input name="name" type="text" id="name" value="<?php echo esc_attr($identity['name'] ?? 'FIDCOGEST SRL'); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="bceNumber">Numéro d'Entreprise BCE</label></th>
                        <td><input name="bceNumber" type="text" id="bceNumber" value="<?php echo esc_attr($identity['bceNumber'] ?? '0899.441.309'); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="vatNumber">Numéro de TVA</label></th>
                        <td><input name="vatNumber" type="text" id="vatNumber" value="<?php echo esc_attr($identity['vatNumber'] ?? 'BE 0899.441.309'); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="peppolIdentifier">Identifiant Peppol (Facturation 2026)</label></th>
                        <td><input name="peppolIdentifier" type="text" id="peppolIdentifier" value="<?php echo esc_attr($identity['peppolIdentifier'] ?? '0208:0899441309'); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="phone">Téléphone Fixe</label></th>
                        <td><input name="phone" type="text" id="phone" value="<?php echo esc_attr($identity['phone'] ?? '+32 2 425 18 58'); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="mobile">GSM / WhatsApp</label></th>
                        <td><input name="mobile" type="text" id="mobile" value="<?php echo esc_attr($identity['mobile'] ?? '+32 476 62 66 21'); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="email">Courriel de Direction</label></th>
                        <td><input name="email" type="email" id="email" value="<?php echo esc_attr($identity['email'] ?? 'management@fidcogest.be'); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="hq_address">Adresse du Siège</label></th>
                        <td><input name="hq_address" type="text" id="hq_address" value="<?php echo esc_attr($identity['headquarters']['address'] ?? 'Place de la Reine Paola n°3'); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="hq_city">Commune &amp; Code Postal</label></th>
                        <td>
                            <input name="hq_postalCode" type="text" value="<?php echo esc_attr($identity['headquarters']['postalCode'] ?? '1083'); ?>" style="width:80px;" />
                            <input name="hq_city" type="text" value="<?php echo esc_attr($identity['headquarters']['city'] ?? 'Ganshoren (Bruxelles)'); ?>" style="width:250px;" />
                        </td>
                    </tr>
                </table>
                <p class="submit">
                    <button type="submit" class="button button-primary">Enregistrer l'identité légale</button>
                </p>
            </div>
        </form>
    </div>
    <?php
}

/**
 * Page 4 : Équipe & Direction
 */
function fidcogest_render_team_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('Accès non autorisé.', 'fidcogest-cm'));
    }
    ?>
    <div class="wrap fidcogest-admin-wrap">
        <div class="fidcogest-header">
            <div class="fidcogest-badge">AGRÉMENT ITAA</div>
            <h1>Équipe et Direction du Cabinet</h1>
            <p>Paul Holl Mpeck, Gérant Fondateur • Expert-comptable &amp; Conseil fiscal certifié ITAA.</p>
        </div>
        <div class="fidcogest-card">
            <p>Les informations relatives à la direction et aux collaborateurs certifiés sont synchronisées avec la table officielle des membres ITAA.</p>
            <p>Pour modifier la photo de Paul Holl Mpeck, rendez-vous dans le <a href="<?php echo admin_url('admin.php?page=fidcogest-images'); ?>">Gestionnaire des Visuels</a> (Emplacement n°10).</p>
        </div>
    </div>
    <?php
}

/**
 * Page 5 : Les 7 Pôles de Services
 */
function fidcogest_render_services_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('Accès non autorisé.', 'fidcogest-cm'));
    }
    ?>
    <div class="wrap fidcogest-admin-wrap">
        <div class="fidcogest-header">
            <div class="fidcogest-badge">OFFRES &amp; PÔLES D'EXPERTISE</div>
            <h1>Les 7 Pôles de Services</h1>
            <p>Comptabilité, Fiscalité, Création, Conseil, Audit, Financement et E-compta Basecone.</p>
        </div>
        <div class="fidcogest-card">
            <p>Chacun des 7 pôles dispose de son illustration propre, personnalisable depuis la <a href="<?php echo admin_url('admin.php?page=fidcogest-images'); ?>">Médiathèque des Visuels</a>.</p>
        </div>
    </div>
    <?php
}

/**
 * Page 6 : Configuration Sécurisée du Webhook
 */
function fidcogest_render_webhook_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('Accès non autorisé.', 'fidcogest-cm'));
    }

    $config = get_option('fidcogest_webhook_config', [
        'app_url'        => '',
        'webhook_secret' => '',
        'auto_flush'     => 0
    ]);

    $notice_message = null;
    $notice_type = 'info';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!check_admin_referer('fidcogest_save_webhook_nonce')) {
            wp_die(__('Échec de validation CSRF (Nonce invalide).', 'fidcogest-cm'));
        }

        if (isset($_POST['save_webhook'])) {
            $raw_url = sanitize_text_field($_POST['app_url'] ?? '');
            $validated_url = '';

            if (!empty($raw_url)) {
                $check_url = fidcogest_validate_webhook_url($raw_url);
                if (is_wp_error($check_url)) {
                    $notice_type = 'error';
                    $notice_message = 'Erreur d\'URL : ' . $check_url->get_error_message();
                } else {
                    $validated_url = $check_url;
                }
            }

            // Gestion sécurisée du secret : si le champ est laissé vide, conserver le secret existant
            $submitted_secret = trim($_POST['webhook_secret'] ?? '');
            $final_secret = $config['webhook_secret'] ?? '';

            if (!empty($submitted_secret)) {
                if (strlen($submitted_secret) < 24) {
                    $notice_type = 'error';
                    $notice_message = 'Le secret de webhook doit contenir au minimum 24 caractères pour être robuste.';
                } else {
                    $final_secret = $submitted_secret;
                }
            }

            if ($notice_type !== 'error') {
                $config = [
                    'app_url'        => $validated_url,
                    'webhook_secret' => $final_secret,
                    'auto_flush'     => !empty($_POST['auto_flush']) ? 1 : 0
                ];
                update_option('fidcogest_webhook_config', $config);
                $notice_type = 'success';
                $notice_message = 'Configuration du webhook enregistrée avec succès.';
            }

        } elseif (isset($_POST['test_webhook'])) {
            $secret = !empty($config['webhook_secret']) ? trim($config['webhook_secret']) : '';
            $app_url = !empty($config['app_url']) ? trim($config['app_url']) : '';

            if (empty($secret) || strlen($secret) < 24) {
                $notice_type = 'error';
                $notice_message = 'Impossible d\'exécuter le test : le secret de webhook n\'est pas encore configuré (24 caractères min).';
            } else {
                $check_url = fidcogest_validate_webhook_url($app_url);
                if (is_wp_error($check_url)) {
                    $notice_type = 'error';
                    $notice_message = 'Impossible d\'exécuter le test : ' . $check_url->get_error_message();
                } else {
                    $target = $check_url . '/api/webhook/wp-flush';

                    // Envoi du test avec en-tête sécurisé uniquement (aucun paramètre dans l'URL)
                    $resp = wp_remote_post($target, [
                        'timeout'     => 6,
                        'redirection' => 0,
                        'headers'     => [
                            'Content-Type'        => 'application/json',
                            'x-fidcogest-secret' => $secret,
                            'User-Agent'          => 'FIDCOGEST-WordPress-Webhook-Test/2.0'
                        ],
                        'body'        => wp_json_encode(['action' => 'test_ping', 'timestamp' => time()])
                    ]);

                    if (is_wp_error($resp)) {
                        $notice_type = 'error';
                        $notice_message = 'Échec de transmission du webhook : ' . $resp->get_error_message();
                    } else {
                        $code = wp_remote_retrieve_response_code($resp);
                        $body = wp_remote_retrieve_body($resp);
                        if ($code === 200) {
                            $notice_type = 'success';
                            $notice_message = "Succès du test HTTP 200 : Le serveur Node/Express a validé le secret et purgé son cache.";
                        } elseif ($code === 403 || $code === 401) {
                            $notice_type = 'error';
                            $notice_message = "Erreur HTTP {$code} : Le serveur Express a refusé le secret. Vérifiez que la variable WP_WEBHOOK_SECRET dans le fichier .env d'Hostinger est strictement identique.";
                        } elseif ($code === 503) {
                            $notice_type = 'error';
                            $notice_message = "Erreur HTTP 503 : Le serveur Express signale que WP_WEBHOOK_SECRET n'est pas encore défini dans son environnement .env.";
                        } else {
                            $notice_type = 'error';
                            $notice_message = "Réponse inattendue du serveur Express : HTTP {$code} ({$body})";
                        }
                    }
                }
            }
        }
    }

    $has_existing_secret = !empty($config['webhook_secret']) && strlen(trim($config['webhook_secret'])) >= 24;
    $secret_length = $has_existing_secret ? strlen(trim($config['webhook_secret'])) : 0;
    ?>
    <div class="wrap fidcogest-admin-wrap">
        <div class="fidcogest-header">
            <div class="fidcogest-badge">SÉCURITÉ RENFORCÉE</div>
            <h1>Passerelle Webhook Sécurisée vers Express</h1>
            <p>Purge instantanée du cache mémoire lors de chaque modification de visuel ou de contenu.</p>
        </div>

        <?php if ($notice_message): ?>
            <div class="notice notice-<?php echo esc_attr($notice_type); ?> is-dismissible">
                <p><strong><?php echo esc_html($notice_message); ?></strong></p>
            </div>
        <?php endif; ?>

        <form method="post" action="">
            <?php wp_nonce_field('fidcogest_save_webhook_nonce'); ?>
            <div class="fidcogest-card">
                <h2>Paramètres de Sécurité &amp; Transmission</h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="app_url">URL de l'application Node.js / Express</label></th>
                        <td>
                            <input name="app_url" type="url" id="app_url" value="<?php echo esc_attr($config['app_url'] ?? ''); ?>" class="regular-text" placeholder="https://votre-app.hostinger.app ou https://www.fidcogest.be" />
                            <p class="description">
                                <strong>Obligation de sécurité :</strong> L'URL doit obligatoirement utiliser le protocole <code>https://</code> (protection SSRF active).
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="webhook_secret">Secret Cryptographique de Webhook</label></th>
                        <td>
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                                <!-- Exigence 6 : Ne jamais afficher le secret en clair dans l'interface -->
                                <input
                                    name="webhook_secret"
                                    type="password"
                                    id="webhook_secret"
                                    value=""
                                    class="regular-text"
                                    autocomplete="new-password"
                                    placeholder="<?php echo $has_existing_secret ? '•••••••••••••••••••••••••••••••• (' . $secret_length . ' caractères configurés)' : 'Saisissez un secret d\'au moins 24 caractères...'; ?>"
                                />
                                <button type="button" id="btn_generate_secret" class="button button-secondary">
                                    <span class="dashicons dashicons-randomize" style="vertical-align:middle;"></span> Générer un secret robuste (48 car.)
                                </button>
                            </div>
                            
                            <div id="secret_notice_box" style="display:none; padding:10px 14px; background:#FEF3C7; border:1px solid #F59E0B; border-radius:6px; margin-bottom:8px; font-size:12px; color:#92400E;">
                                <strong>Nouveau secret généré :</strong> <code id="generated_secret_display" style="user-select:all; font-weight:bold;"></code><br/>
                                <em>Copiez immédiatement cette valeur dans le fichier <code>.env</code> de votre serveur Hostinger (variable <code>WP_WEBHOOK_SECRET</code>) avant d'enregistrer !</em>
                            </div>

                            <p class="description">
                                Ce secret est strictement transmis via l'en-tête HTTP sécurisé <code>x-fidcogest-secret</code> (jamais dans l'URL). Laissez le champ vide pour conserver le secret actuellement enregistré.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Purge automatique</th>
                        <td>
                            <label>
                                <input type="checkbox" name="auto_flush" value="1" <?php checked($config['auto_flush'] ?? 0, 1); ?> />
                                Déclencher la purge du cache Express dès qu'un visuel ou un texte est enregistré dans WordPress.
                            </label>
                        </td>
                    </tr>
                </table>
                <p class="submit">
                    <button type="submit" name="save_webhook" class="button button-primary">Enregistrer la configuration</button>
                    <button type="submit" name="test_webhook" class="button button-secondary">Tester l'envoi du webhook maintenant &rarr;</button>
                </p>
            </div>
        </form>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        var btn = document.getElementById('btn_generate_secret');
        var input = document.getElementById('webhook_secret');
        var box = document.getElementById('secret_notice_box');
        var display = document.getElementById('generated_secret_display');

        if (btn && input) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // Génération cryptographique aléatoire de 48 caractères hexadécimaux
                var array = new Uint8Array(24);
                window.crypto.getRandomValues(array);
                var hex = Array.from(array, function(byte) {
                    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
                }).join('');

                input.value = hex;
                input.type = 'text'; // Affichage temporaire pour la copie
                display.textContent = hex;
                box.style.display = 'block';
            });
        }
    });
    </script>
    <?php
}
