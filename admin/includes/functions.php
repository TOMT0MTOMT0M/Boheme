<?php
require_once 'config.php';

// Fonction pour vérifier si l'utilisateur est connecté
/**
 * Vérifie si l'utilisateur est connecté
 * @return bool True si l'utilisateur est connecté, false sinon
 */
function is_logged_in(): bool {
    return (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true);
}

// Fonction pour rediriger vers la page de connexion si non connecté
/**
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 * @return void
 */
function require_login(): void {
    if (!is_logged_in()) {
        header('Location: index.php');
        exit();
    }
}

// Fonction pour obtenir l'extension d'un fichier
/**
 * Récupère l'extension d'un fichier
 * @param string $filename Nom du fichier
 * @return string Extension du fichier en minuscules
 */
function get_file_extension(string $filename): string {
    return strtolower(pathinfo($filename, PATHINFO_EXTENSION));
}

// Fonction pour valider un fichier image uploadé
/**
 * Valide une image uploadée
 * @param array $file Tableau $_FILES de l'image
 * @return array Résultat de la validation
 */
function validate_image_upload(array $file): array {
    // Vérifier si l'upload s'est bien passé
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error_messages = [
            UPLOAD_ERR_INI_SIZE => 'La taille du fichier dépasse la limite autorisée par PHP.',
            UPLOAD_ERR_FORM_SIZE => 'La taille du fichier dépasse la limite autorisée par le formulaire.',
            UPLOAD_ERR_PARTIAL => 'Le fichier n\'a été que partiellement uploadé.',
            UPLOAD_ERR_NO_FILE => 'Aucun fichier n\'a été uploadé.',
            UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant.',
            UPLOAD_ERR_CANT_WRITE => 'Échec de l\'écriture du fichier sur le disque.',
            UPLOAD_ERR_EXTENSION => 'Une extension PHP a arrêté l\'upload du fichier.'
        ];
        
        $error_message = $error_messages[$file['error']] ?? 'Une erreur inconnue s\'est produite lors de l\'upload.';
        return ['success' => false, 'message' => $error_message];
    }
    
    // Vérifier la taille
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['success' => false, 'message' => 'La taille du fichier dépasse la limite de 5 Mo.'];
    }
    
    // Vérifier l'extension
    $extension = get_file_extension($file['name']);
    if (!in_array($extension, ALLOWED_EXTENSIONS)) {
        return ['success' => false, 'message' => 'Type de fichier non autorisé. Extensions acceptées: ' . implode(', ', ALLOWED_EXTENSIONS)];
    }
    
    // Vérifier si c'est une image valide
    $check = @getimagesize($file['tmp_name']);
    if ($check === false) {
        return ['success' => false, 'message' => 'Le fichier uploadé n\'est pas une image valide.'];
    }
    
    return ['success' => true, 'message' => 'Validation réussie'];
}

// Fonction pour enregistrer une image
/**
 * Enregistre une image uploadée
 * @param array $file Tableau $_FILES de l'image
 * @param string $category Catégorie de l'image
 * @return array Résultat de l'opération
 */
function save_uploaded_image(array $file, string $category): array {
    // Valider l'image
    $validation = validate_image_upload($file);
    if (!$validation['success']) {
        return $validation;
    }
    
    // Créer le répertoire de la catégorie s'il n'existe pas
    $category_dir = UPLOADS_PATH . '/' . $category;
    if (!file_exists($category_dir)) {
        if (!mkdir($category_dir, 0755, true)) {
            return ['success' => false, 'message' => 'Impossible de créer le répertoire pour cette catégorie.'];
        }
    }
    
    // Générer un nom de fichier unique
    $extension = get_file_extension($file['name']);
    $new_filename = uniqid('img_') . '.' . $extension;
    $destination = $category_dir . '/' . $new_filename;
    
    // Déplacer le fichier
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        return ['success' => false, 'message' => 'Impossible de déplacer le fichier uploadé.'];
    }
    
    return [
        'success' => true, 
        'message' => 'Image uploadée avec succès',
        'filename' => $new_filename,
        'path' => $destination,
        'url' => UPLOADS_URL . '/' . $category . '/' . $new_filename
    ];
}

// Fonction pour obtenir toutes les images d'une catégorie
/**
 * Récupère toutes les images d'une catégorie
 * @param string $category Catégorie d'images
 * @return array Liste des images
 */
function get_images_by_category(string $category): array {
    $images = [];
    $category_dir = UPLOADS_PATH . '/' . $category;
    
    if (!file_exists($category_dir)) {
        return $images;
    }
    
    $files = glob($category_dir . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);
    
    foreach ($files as $file) {
        $filename = basename($file);
        $images[] = [
            'filename' => $filename,
            'path' => $file,
            'url' => UPLOADS_URL . '/' . $category . '/' . $filename
        ];
    }
    
    return $images;
}

// Fonction pour supprimer une image
/**
 * Supprime une image
 * @param string $category Catégorie de l'image
 * @param string $filename Nom du fichier
 * @return bool True si la suppression a réussi, false sinon
 */
function delete_image(string $category, string $filename): bool {
    // Sécuriser le nom du fichier
    $filename = basename($filename);
    $file_path = UPLOADS_PATH . '/' . $category . '/' . $filename;
    
    // Vérifier si le fichier existe
    if (!file_exists($file_path)) {
        return false;
    }
    
    // Supprimer le fichier
    return unlink($file_path);
}

// Fonction pour lire le contenu d'un fichier HTML
/**
 * Lit le contenu d'un fichier HTML
 * @param string $file_path Chemin du fichier
 * @return string|false Contenu du fichier ou false en cas d'erreur
 */
function read_html_content(string $file_path) {
    if (!file_exists($file_path)) {
        return false;
    }
    
    return file_get_contents($file_path);
}

// Fonction pour extraire le texte d'un élément HTML spécifique
/**
 * Extrait le texte d'un élément HTML
 * @param string $html_content Contenu HTML
 * @param string $element_selector Sélecteur CSS de l'élément
 * @param int $index Index de l'élément (si plusieurs éléments correspondent)
 * @return string|false Texte extrait ou false en cas d'erreur
 */
function extract_html_element_text(string $html_content, string $element_selector, int $index = 0) {
    // Utilisation d'expressions régulières basiques pour extraire le contenu
    // Note: Ceci est une solution simplifiée, un parser HTML serait plus robuste
    
    // Convertir le sélecteur CSS en pattern regex
    $selector_parts = explode('.', $element_selector);
    $tag = $selector_parts[0] ?: '\w+';  // Si le tag n'est pas spécifié, chercher n'importe quel tag
    
    if (count($selector_parts) > 1) {
        // Il y a des classes
        $classes = array_slice($selector_parts, 1);
        $class_pattern = implode(' ', $classes);
        $pattern = "/<$tag[^>]*class=['\"]([^'\"]*$class_pattern[^'\"]*)['\"](.*?)>(.*?)<\/$tag>/si";
    } else {
        // Pas de classe, juste un tag
        $pattern = "/<$tag(.*?)>(.*?)<\/$tag>/si";
    }
    
    if (preg_match_all($pattern, $html_content, $matches, PREG_SET_ORDER)) {
        if (isset($matches[$index])) {
            // Le dernier groupe capturé contient le contenu
            $content_index = count($matches[$index]) - 1;
            return trim($matches[$index][$content_index]);
        }
    }
    
    return false;
}

// Fonction pour mettre à jour le contenu d'un élément HTML
/**
 * Met à jour le texte d'un élément HTML
 * @param string $html_content Contenu HTML
 * @param string $element_selector Sélecteur CSS de l'élément
 * @param string $new_text Nouveau texte
 * @param int $index Index de l'élément (si plusieurs éléments correspondent)
 * @return string Contenu HTML mis à jour
 */
function update_html_element_text(string $html_content, string $element_selector, string $new_text, int $index = 0): string {
    // Convertir le sélecteur CSS en pattern regex
    $selector_parts = explode('.', $element_selector);
    $tag = $selector_parts[0] ?: '\w+';  // Si le tag n'est pas spécifié, chercher n'importe quel tag
    
    if (count($selector_parts) > 1) {
        // Il y a des classes
        $classes = array_slice($selector_parts, 1);
        $class_pattern = implode(' ', $classes);
        $pattern = "/(<$tag[^>]*class=['\"]([^'\"]*$class_pattern[^'\"]*)['\"](.*?)>)(.*?)(<\/$tag>)/si";
    } else {
        // Pas de classe, juste un tag
        $pattern = "/(<$tag(.*?)>)(.*?)(<\/$tag>)/si";
    }
    
    $count = 0;
    $updated_content = preg_replace_callback($pattern, function($matches) use (&$count, $index, $new_text) {
        if ($count === $index) {
            // Remplacer le contenu
            return $matches[1] . $new_text . $matches[count($matches) - 1];
        }
        $count++;
        return $matches[0];
    }, $html_content, 1);
    
    return $updated_content ?: $html_content;
}

// Fonction pour sauvegarder le contenu HTML
/**
 * Enregistre le contenu dans un fichier HTML
 * @param string $file_path Chemin du fichier
 * @param string $content Contenu à enregistrer
 * @return bool True si l'enregistrement a réussi, false sinon
 */
function save_html_content(string $file_path, string $content): bool {
    return file_put_contents($file_path, $content) !== false;
} 