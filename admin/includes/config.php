<?php
// Afficher les erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuration de l'application
define('SITE_NAME', 'Bohème Fleurs');
define('ADMIN_EMAIL', 'contact@boheme-fleurs.com');

// Chemins
define('ROOT_PATH', realpath(dirname(__FILE__) . '/../..'));
define('ADMIN_PATH', ROOT_PATH . '/admin');
define('UPLOADS_PATH', ADMIN_PATH . '/uploads');
define('UPLOADS_URL', '../admin/uploads');

// Configuration des uploads
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5 MB
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Sections éditables du site
$editable_sections = [
    'hero' => [
        'title' => 'Section Héro',
        'file' => 'index.html',
        'elements' => [
            'hero_title' => [
                'label' => 'Titre principal',
                'selector' => '.hero-title'
            ],
            'hero_subtitle' => [
                'label' => 'Sous-titre',
                'selector' => '.hero-subtitle'
            ]
        ]
    ],
    'au-quotidien' => [
        'title' => 'Au Quotidien',
        'file' => 'index.html',
        'elements' => [
            'daily_title' => [
                'label' => 'Titre de la section',
                'selector' => '.section-title.daily'
            ],
            'daily_text' => [
                'label' => 'Texte descriptif',
                'selector' => '.daily-description'
            ]
        ]
    ],
    'mariages' => [
        'title' => 'Mariages',
        'file' => 'index.html',
        'elements' => [
            'wedding_title' => [
                'label' => 'Titre de la section',
                'selector' => '.section-title.wedding'
            ],
            'wedding_text' => [
                'label' => 'Texte descriptif',
                'selector' => '.wedding-description'
            ]
        ]
    ],
    'professionnels' => [
        'title' => 'Professionnels',
        'file' => 'index.html',
        'elements' => [
            'pro_title' => [
                'label' => 'Titre de la section',
                'selector' => '.section-title.pro'
            ],
            'pro_text' => [
                'label' => 'Texte descriptif',
                'selector' => '.pro-description'
            ]
        ]
    ],
    'philosophie' => [
        'title' => 'Notre Philosophie',
        'file' => 'index.html',
        'elements' => [
            'philosophy_title' => [
                'label' => 'Titre de la section',
                'selector' => '.section-title.philosophy'
            ],
            'philosophy_text' => [
                'label' => 'Texte descriptif',
                'selector' => '.philosophy-description'
            ]
        ]
    ],
    'services' => [
        'title' => 'Nos Services',
        'file' => 'index.html',
        'elements' => [
            'services_title' => [
                'label' => 'Titre de la section',
                'selector' => '.section-title.services'
            ],
            'services_intro' => [
                'label' => 'Texte d\'introduction',
                'selector' => '.services-intro'
            ]
        ]
    ],
    'contact' => [
        'title' => 'Contact',
        'file' => 'index.html',
        'elements' => [
            'contact_title' => [
                'label' => 'Titre de la section',
                'selector' => '.section-title.contact'
            ],
            'contact_address' => [
                'label' => 'Adresse',
                'selector' => '.contact-address'
            ],
            'contact_phone' => [
                'label' => 'Téléphone',
                'selector' => '.contact-phone'
            ],
            'contact_email' => [
                'label' => 'Email',
                'selector' => '.contact-email'
            ]
        ]
    ]
];

// Catégories d'images
$image_categories = [
    'hero' => 'Images Hero',
    'gallery' => 'Galerie Générale',
    'daily' => 'Au Quotidien',
    'wedding' => 'Mariages',
    'pro' => 'Professionnels',
    'events' => 'Événements',
    'services' => 'Services'
];

// Fonction pour nettoyer les entrées utilisateur
function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
} 