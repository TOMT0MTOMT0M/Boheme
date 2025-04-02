<?php
// Test de compatibilité PHP

// Afficher les erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Test de compatibilité PHP pour Bohème Fleurs Admin</h1>";

// Vérifier la version PHP
echo "<h2>Version PHP</h2>";
echo "Version PHP: " . phpversion() . "<br>";
echo "Version minimale requise: 7.4.0<br>";
if (version_compare(phpversion(), '7.4.0', '>=')) {
    echo "<span style='color:green'>✓ Version PHP compatible</span><br>";
} else {
    echo "<span style='color:red'>✗ Version PHP non compatible</span><br>";
}

// Vérifier les extensions requises
echo "<h2>Extensions PHP</h2>";
$required_extensions = ['gd', 'fileinfo', 'session'];
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<span style='color:green'>✓ Extension $ext chargée</span><br>";
    } else {
        echo "<span style='color:red'>✗ Extension $ext non disponible</span><br>";
    }
}

// Vérifier les chemins
echo "<h2>Chemins</h2>";
echo "Document root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";
echo "Script filename: " . $_SERVER['SCRIPT_FILENAME'] . "<br>";
echo "Current script path: " . __FILE__ . "<br>";

// Tester les chemins du fichier config
echo "<h2>Test des chemins de configuration</h2>";
try {
    // Test de chemin avec répertoire courant
    $test_path = dirname(__FILE__);
    echo "Répertoire courant: $test_path<br>";
    
    // Test chemin up 2 directories
    $test_root = dirname(dirname(__FILE__));
    echo "Répertoire parent (admin): $test_root<br>";
    
    // Test chemin up 3 directories (root)
    $test_site_root = dirname(dirname(dirname(__FILE__)));
    echo "Répertoire racine du site: $test_site_root<br>";
    
    // Test realpath
    $test_realpath = realpath(dirname(__FILE__) . '/../..');
    echo "Chemin réel (realpath): $test_realpath<br>";
    
    // Test d'écriture dans uploads
    $uploads_dir = dirname(__FILE__) . '/uploads';
    if (!file_exists($uploads_dir)) {
        if (mkdir($uploads_dir, 0755, true)) {
            echo "<span style='color:green'>✓ Dossier uploads créé avec succès: $uploads_dir</span><br>";
        } else {
            echo "<span style='color:red'>✗ Impossible de créer le dossier uploads: $uploads_dir</span><br>";
        }
    } else {
        echo "Le dossier uploads existe déjà: $uploads_dir<br>";
        if (is_writable($uploads_dir)) {
            echo "<span style='color:green'>✓ Le dossier uploads est accessible en écriture</span><br>";
        } else {
            echo "<span style='color:red'>✗ Le dossier uploads n'est PAS accessible en écriture</span><br>";
        }
    }
    
} catch (Exception $e) {
    echo "<span style='color:red'>Erreur: " . $e->getMessage() . "</span><br>";
}

// Vérifier la configuration GD pour les images
echo "<h2>Support de manipulation d'images (GD)</h2>";
if (function_exists('gd_info')) {
    $gd_info = gd_info();
    echo "Version GD: " . $gd_info['GD Version'] . "<br>";
    echo "Support JPG: " . ($gd_info['JPEG Support'] ? 'Oui' : 'Non') . "<br>";
    echo "Support PNG: " . ($gd_info['PNG Support'] ? 'Oui' : 'Non') . "<br>";
    echo "Support GIF: " . ($gd_info['GIF Read Support'] ? 'Oui' : 'Non') . "<br>";
    echo "Support WebP: " . (isset($gd_info['WebP Support']) && $gd_info['WebP Support'] ? 'Oui' : 'Non') . "<br>";
} else {
    echo "<span style='color:red'>✗ Extension GD non disponible</span><br>";
}

echo "<h2>Vérification du module mod_rewrite</h2>";
if (function_exists('apache_get_modules')) {
    $modules = apache_get_modules();
    if (in_array('mod_rewrite', $modules)) {
        echo "<span style='color:green'>✓ mod_rewrite activé</span><br>";
    } else {
        echo "<span style='color:red'>✗ mod_rewrite non activé</span><br>";
    }
} else {
    echo "Impossible de vérifier les modules Apache<br>";
}

echo "<p><a href='index.php'>Retour à la page d'accueil</a></p>";
?> 