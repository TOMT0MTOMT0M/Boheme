<?php
// Script d'initialisation pour l'espace administrateur

// Inclure la configuration
require_once 'includes/config.php';

// Fonction pour créer un dossier s'il n'existe pas
function create_directory($dir) {
    if (!file_exists($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "✅ Dossier créé : $dir<br>";
            return true;
        } else {
            echo "❌ Erreur lors de la création du dossier : $dir<br>";
            return false;
        }
    } else {
        echo "ℹ️ Le dossier existe déjà : $dir<br>";
        return true;
    }
}

// Fonction pour vérifier les permissions
function check_permissions($dir) {
    if (is_writable($dir)) {
        echo "✅ Permissions OK pour : $dir<br>";
        return true;
    } else {
        echo "❌ Permissions insuffisantes pour : $dir<br>";
        return false;
    }
}

// Vérifier si l'utilisateur est autorisé à exécuter ce script
// Ce script doit être exécuté une seule fois lors de l'installation
// ou pour recréer les dossiers manquants
if (!isset($_GET['confirm']) || $_GET['confirm'] !== 'yes') {
    echo '<!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Installation - Bohème Fleurs Admin</title>
        <link rel="stylesheet" href="../css/reset.css">
        <link rel="stylesheet" href="../css/styles.css">
        <style>
            body {
                background-color: var(--color-dark);
                color: var(--color-text);
                font-family: var(--font-secondary);
                padding: 2rem;
            }
            .setup-container {
                max-width: 800px;
                margin: 0 auto;
                background-color: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(189, 143, 57, 0.2);
                border-radius: 4px;
                padding: 2rem;
            }
            h1 {
                font-family: var(--font-primary);
                color: var(--color-gold);
                margin-bottom: 1.5rem;
            }
            p {
                margin-bottom: 1rem;
                line-height: 1.6;
            }
            .warning {
                background-color: rgba(231, 76, 60, 0.1);
                border: 1px solid rgba(231, 76, 60, 0.3);
                color: #e74c3c;
                padding: 1rem;
                margin: 1.5rem 0;
                border-radius: 4px;
            }
            .button {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                background-color: var(--color-gold);
                color: var(--color-dark);
                font-family: var(--font-primary);
                text-decoration: none;
                border-radius: 2px;
                margin-top: 1rem;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #d3a349;
            }
            .back-link {
                display: block;
                margin-top: 1.5rem;
                color: var(--color-text);
                text-decoration: none;
            }
            .back-link:hover {
                color: var(--color-gold);
            }
        </style>
    </head>
    <body>
        <div class="setup-container">
            <h1>Installation de l\'espace administrateur</h1>
            <p>Ce script va créer les dossiers nécessaires pour le stockage des images et vérifier les permissions requises pour le bon fonctionnement de l\'espace administrateur.</p>
            
            <div class="warning">
                <p><strong>Attention :</strong> Ce script ne doit être exécuté qu\'une seule fois lors de l\'installation initiale ou pour réparer l\'installation.</p>
                <p>Si vous avez déjà configuré votre espace administrateur, l\'exécution de ce script ne supprimera pas vos données existantes.</p>
            </div>
            
            <p>Êtes-vous sûr de vouloir continuer ?</p>
            
            <a href="setup.php?confirm=yes" class="button">Oui, exécuter l\'installation</a>
            <a href="index.php" class="back-link">← Retour à la page de connexion</a>
        </div>
    </body>
    </html>';
    exit;
}

// En-tête HTML
echo '<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation - Bohème Fleurs Admin</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/styles.css">
    <style>
        body {
            background-color: var(--color-dark);
            color: var(--color-text);
            font-family: var(--font-secondary);
            padding: 2rem;
        }
        .setup-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(189, 143, 57, 0.2);
            border-radius: 4px;
            padding: 2rem;
        }
        h1 {
            font-family: var(--font-primary);
            color: var(--color-gold);
            margin-bottom: 1.5rem;
        }
        h2 {
            font-family: var(--font-primary);
            color: var(--color-gold);
            margin: 1.5rem 0 1rem;
            font-size: 1.25rem;
        }
        p {
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        .status {
            margin: 1.5rem 0;
            line-height: 1.8;
        }
        .success {
            color: #2ecc71;
        }
        .error {
            color: #e74c3c;
        }
        .info {
            color: #3498db;
        }
        .button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: var(--color-gold);
            color: var(--color-dark);
            font-family: var(--font-primary);
            text-decoration: none;
            border-radius: 2px;
            margin-top: 1rem;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #d3a349;
        }
    </style>
</head>
<body>
    <div class="setup-container">
        <h1>Installation de l\'espace administrateur</h1>
        <p>Création des répertoires nécessaires et vérification des permissions...</p>
        
        <div class="status">';

// Créer le dossier d'uploads principal s'il n'existe pas
$uploads_dir = UPLOADS_PATH;
$main_dir_created = create_directory($uploads_dir);
$main_dir_writable = check_permissions($uploads_dir);

// Si le dossier principal est créé et accessible en écriture
if ($main_dir_created && $main_dir_writable) {
    // Créer les sous-dossiers pour chaque catégorie d'images
    $all_success = true;
    
    global $image_categories;
    foreach ($image_categories as $category_key => $category_name) {
        $category_dir = $uploads_dir . '/' . $category_key;
        $dir_created = create_directory($category_dir);
        $dir_writable = check_permissions($category_dir);
        
        if (!$dir_created || !$dir_writable) {
            $all_success = false;
        }
    }
    
    if ($all_success) {
        echo '<h2 class="success">✅ Installation réussie !</h2>';
        echo '<p>Tous les dossiers nécessaires ont été créés et sont accessibles en écriture.</p>';
    } else {
        echo '<h2 class="error">⚠️ Installation partiellement réussie</h2>';
        echo '<p>Certains dossiers n\'ont pas pu être créés ou ne sont pas accessibles en écriture. Veuillez vérifier les permissions des dossiers.</p>';
    }
} else {
    echo '<h2 class="error">❌ Échec de l\'installation</h2>';
    echo '<p>Impossible de créer ou d\'accéder au dossier principal d\'uploads. Veuillez vérifier les permissions du serveur.</p>';
}

// Pied de page
echo '</div>
        <a href="index.php" class="button">Aller à la page de connexion</a>
    </div>
</body>
</html>';
?> 