<?php
session_start();
require_once 'includes/functions.php';

// Vérifier si l'utilisateur est connecté
require_login();

// Variables pour la page
$page_title = 'Modification des textes';
$message = '';
$message_type = '';

// Récupérer la section sélectionnée
$selected_section = isset($_GET['section']) ? clean_input($_GET['section']) : 'hero';

// Récupérer les sections éditables depuis la configuration
global $editable_sections;

// Vérifier si la section existe
if (!isset($editable_sections[$selected_section])) {
    $message = 'La section sélectionnée n\'existe pas.';
    $message_type = 'error';
    $selected_section = array_key_first($editable_sections);
}

// Initialiser le tableau des contenus
$section_content = [];

// Récupérer le contenu HTML actuel de la section
$file_path = ROOT_PATH . '/' . $editable_sections[$selected_section]['file'];
$html_content = read_html_content($file_path);

// Si le HTML a été récupéré
if ($html_content !== false) {
    // Extraire les éléments éditables
    foreach ($editable_sections[$selected_section]['elements'] as $element_id => $element_info) {
        $element_text = extract_html_element_text($html_content, $element_info['selector']);
        if ($element_text !== false) {
            $section_content[$element_id] = [
                'label' => $element_info['label'],
                'text' => $element_text,
                'selector' => $element_info['selector']
            ];
        }
    }
} else {
    $message = 'Impossible de lire le fichier HTML de la section.';
    $message_type = 'error';
}

// Traitement du formulaire de mise à jour
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_text'])) {
    $updated_content = $html_content;
    $has_changes = false;
    
    // Parcourir chaque élément éditable
    foreach ($editable_sections[$selected_section]['elements'] as $element_id => $element_info) {
        if (isset($_POST['content'][$element_id])) {
            $new_text = $_POST['content'][$element_id];
            $selector = $element_info['selector'];
            
            // Mettre à jour le contenu HTML
            $updated_content = update_html_element_text($updated_content, $selector, $new_text);
            
            if ($updated_content !== $html_content) {
                $has_changes = true;
                $html_content = $updated_content;
            }
            
            // Mettre à jour l'affichage actuel
            $section_content[$element_id]['text'] = $new_text;
        }
    }
    
    // Sauvegarder les modifications
    if ($has_changes) {
        if (save_html_content($file_path, $updated_content)) {
            $message = 'Les modifications ont été enregistrées avec succès.';
            $message_type = 'success';
        } else {
            $message = 'Erreur lors de l\'enregistrement des modifications.';
            $message_type = 'error';
        }
    } else {
        $message = 'Aucune modification détectée.';
        $message_type = 'info';
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?> | Administration Bohème Fleurs</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            min-height: 100vh;
            background-color: var(--color-dark);
            color: var(--color-text);
            font-family: var(--font-secondary);
        }
        
        .admin-header {
            background-color: rgba(16, 13, 12, 0.95);
            padding: 1rem 0;
            border-bottom: 1px solid rgba(189, 143, 57, 0.3);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }
        
        .admin-header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .admin-title {
            font-family: var(--font-primary);
            font-size: 1.5rem;
            color: var(--color-gold);
        }
        
        .admin-nav ul {
            display: flex;
            gap: 1.5rem;
        }
        
        .admin-nav a {
            color: var(--color-text);
            text-decoration: none;
            transition: color 0.3s ease;
            font-family: var(--font-primary);
            font-size: 1rem;
            letter-spacing: 1px;
        }
        
        .admin-nav a:hover {
            color: var(--color-gold);
        }
        
        .admin-content {
            padding: 6rem 0 3rem;
            min-height: calc(100vh - 9rem);
        }
        
        .message {
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 4px;
        }
        
        .message.success {
            background-color: rgba(46, 204, 113, 0.1);
            border: 1px solid rgba(46, 204, 113, 0.3);
            color: #2ecc71;
        }
        
        .message.error {
            background-color: rgba(231, 76, 60, 0.1);
            border: 1px solid rgba(231, 76, 60, 0.3);
            color: #e74c3c;
        }
        
        .message.info {
            background-color: rgba(52, 152, 219, 0.1);
            border: 1px solid rgba(52, 152, 219, 0.3);
            color: #3498db;
        }
        
        .section-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .section-tab {
            padding: 0.75rem 1.25rem;
            background-color: rgba(255, 255, 255, 0.05);
            color: var(--color-text);
            border: 1px solid rgba(189, 143, 57, 0.2);
            border-radius: 4px;
            text-decoration: none;
            font-family: var(--font-primary);
            font-size: 0.9rem;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }
        
        .section-tab:hover {
            background-color: rgba(189, 143, 57, 0.1);
        }
        
        .section-tab.active {
            background-color: var(--color-gold);
            color: var(--color-dark);
            border-color: var(--color-gold);
        }
        
        .edit-form {
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(189, 143, 57, 0.2);
            border-radius: 4px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .edit-form-title {
            font-family: var(--font-primary);
            font-size: 1.25rem;
            margin-bottom: 1.5rem;
            color: var(--color-gold);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--color-text);
            font-weight: 500;
        }
        
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(189, 143, 57, 0.3);
            border-radius: 2px;
            color: var(--color-text);
            font-family: var(--font-secondary);
            min-height: 150px;
            resize: vertical;
        }
        
        .form-group input[type="text"] {
            width: 100%;
            padding: 0.75rem;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(189, 143, 57, 0.3);
            border-radius: 2px;
            color: var(--color-text);
            font-family: var(--font-secondary);
        }
        
        button {
            padding: 0.75rem 1.5rem;
            background-color: var(--color-gold);
            border: none;
            border-radius: 2px;
            color: var(--color-dark);
            font-family: var(--font-primary);
            font-size: 1rem;
            letter-spacing: 1px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        button:hover {
            background-color: #d3a349;
        }
        
        .admin-footer {
            text-align: center;
            padding: 1.5rem 0;
            background-color: rgba(16, 13, 12, 0.8);
            border-top: 1px solid rgba(189, 143, 57, 0.1);
            color: var(--color-text-muted);
            font-size: 0.8rem;
        }
        
        .preview-button {
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--color-text);
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-right: 1rem;
        }
        
        .preview-button:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }
        
        .buttons-group {
            display: flex;
            justify-content: flex-end;
            margin-top: 1.5rem;
        }
        
        .info-text {
            margin-top: 0.5rem;
            color: var(--color-text-muted);
            font-size: 0.85rem;
            font-style: italic;
        }
    </style>
</head>
<body>
    <header class="admin-header">
        <div class="container">
            <h1 class="admin-title">Administration Bohème Fleurs</h1>
            <nav class="admin-nav">
                <ul>
                    <li><a href="dashboard.php"><i class="fas fa-tachometer-alt"></i> Tableau de bord</a></li>
                    <li><a href="edit_text.php"><i class="fas fa-edit"></i> Modifier textes</a></li>
                    <li><a href="manage_images.php"><i class="fas fa-images"></i> Gérer images</a></li>
                    <li><a href="logout.php"><i class="fas fa-sign-out-alt"></i> Déconnexion</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <main class="admin-content">
        <div class="container">
            <h2 class="section-title"><?php echo $page_title; ?></h2>
            
            <?php if (!empty($message)): ?>
                <div class="message <?php echo $message_type; ?>">
                    <?php echo $message; ?>
                </div>
            <?php endif; ?>
            
            <div class="section-tabs">
                <?php foreach ($editable_sections as $section_key => $section_info): ?>
                    <a href="?section=<?php echo $section_key; ?>" class="section-tab <?php echo $selected_section === $section_key ? 'active' : ''; ?>">
                        <?php echo $section_info['title']; ?>
                    </a>
                <?php endforeach; ?>
            </div>
            
            <div class="edit-form">
                <h3 class="edit-form-title">Modifier les textes de la section: <?php echo $editable_sections[$selected_section]['title']; ?></h3>
                
                <?php if (empty($section_content)): ?>
                    <p>Aucun contenu éditable n'a été trouvé dans cette section.</p>
                <?php else: ?>
                    <form method="POST">
                        <?php foreach ($section_content as $element_id => $element): ?>
                            <div class="form-group">
                                <label for="content_<?php echo $element_id; ?>"><?php echo $element['label']; ?></label>
                                <?php if (strpos($element['text'], "\n") !== false || strlen($element['text']) > 100): ?>
                                    <textarea name="content[<?php echo $element_id; ?>]" id="content_<?php echo $element_id; ?>" rows="5"><?php echo htmlspecialchars($element['text']); ?></textarea>
                                <?php else: ?>
                                    <input type="text" name="content[<?php echo $element_id; ?>]" id="content_<?php echo $element_id; ?>" value="<?php echo htmlspecialchars($element['text']); ?>">
                                <?php endif; ?>
                                <p class="info-text">Sélecteur: <?php echo htmlspecialchars($element['selector']); ?></p>
                            </div>
                        <?php endforeach; ?>
                        
                        <div class="buttons-group">
                            <a href="../<?php echo $editable_sections[$selected_section]['file']; ?>" target="_blank" class="preview-button">
                                <i class="fas fa-eye"></i> Prévisualiser la page
                            </a>
                            <button type="submit" name="update_text">
                                <i class="fas fa-save"></i> Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                <?php endif; ?>
            </div>
        </div>
    </main>
    
    <footer class="admin-footer">
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> Bohème Fleurs - Tous droits réservés</p>
        </div>
    </footer>
</body>
</html> 