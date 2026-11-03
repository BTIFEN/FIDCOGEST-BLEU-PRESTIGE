/**
 * Intégration Native WordPress Media Library pour FIDCOGEST
 */
jQuery(document).ready(function ($) {
    'use strict';

    // Sélecteur de média
    $('.fidcogest-upload-btn').on('click', function (e) {
        e.preventDefault();

        var button = $(this);
        var targetField = button.data('target');
        var inputField = $('#input_' + targetField);
        var previewImg = $('#preview_' + targetField);

        var customUploader = wp.media({
            title: fidcogest_vars.select_image || 'Sélectionner un visuel pour le Cabinet',
            button: {
                text: fidcogest_vars.use_image || 'Utiliser ce visuel'
            },
            multiple: false
        });

        customUploader.on('select', function () {
            var attachment = customUploader.state().get('selection').first().toJSON();
            var imageUrl = attachment.url;

            inputField.val(imageUrl);
            previewImg.attr('src', imageUrl);

            // Petit effet visuel de confirmation
            previewImg.css({ opacity: 0 }).animate({ opacity: 1 }, 300);
        });

        customUploader.open();
    });

    // Rétablissement de la valeur par défaut
    $('.fidcogest-reset-btn').on('click', function (e) {
        e.preventDefault();
        var targetField = $(this).data('target');
        var defaultUrl = $(this).data('default');

        $('#input_' + targetField).val(defaultUrl);
        $('#preview_' + targetField).attr('src', defaultUrl);
    });

    // Mise à jour de l'aperçu si modification manuelle du champ texte
    $('.fidcogest-media-inputs input[type="text"]').on('input change', function () {
        var input = $(this);
        var fieldId = input.attr('id').replace('input_', '');
        var newUrl = input.val().trim();
        if (newUrl) {
            $('#preview_' + fieldId).attr('src', newUrl);
        }
    });
});
