<?php
session_start();
require_once 'includes/functions.php';

// Vérifier si l'utilisateur est connecté
require_login();

// Variables pour la page
$page_title = 'Gestion des images';
$selected_category = isset($_GET['category']) ? $_GET['category'] : 'hero';
$message = '';
$message_type = '';

// Traitement de l'upload d'image
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['upload_image'])) {
    if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        $category = clean_input($_POST['category']);
        
        $result = save_uploaded_image($_FILES['image'], $category);
        
        if ($result['success']) {
            $message = 'L\'image a été uploadée avec succès.';
            $message_type = 'success';
            $selected_category = $category;
        } else {
            $message = 'Erreur: ' . $result['message'];
            $message_type = 'error';
        }
    } else {
        $message = 'Veuillez sélectionner une image à uploader.';
        $message_type = 'error';
    }
}

// Traitement de la suppression d'image
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['file'])) {
    $filename = clean_input($_GET['file']);
    $category = isset($_GET['category']) ? clean_input($_GET['category']) : $selected_category;
    
    if (delete_image($category, $filename)) {
        $message = 'L\'image a été supprimée avec succès.';
        $message_type = 'success';
    } else {
        $message = 'Erreur lors de la suppression de l\'image.';
        $message_type = 'error';
    }
    
    $selected_category = $category;
}

// Récupérer les images de la catégorie sélectionnée
$images = get_images_by_category($selected_category);

// Récupérer les catégories d'images depuis la configuration
global $image_categories;
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
        
        .category-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        
        .category-tab {
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
        
        .category-tab:hover {
            background-color: rgba(189, 143, 57, 0.1);
        }
        
        .category-tab.active {
            background-color: var(--color-gold);
            color: var(--color-dark);
            border-color: var(--color-gold);
        }
        
        .upload-form {
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(189, 143, 57, 0.2);
            border-radius: 4px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .upload-form-title {
            font-family: var(--font-primary);
            font-size: 1.25rem;
            margin-bottom: 1.5rem;
            color: var(--color-gold);
        }
        
        .upload-form-fields {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: flex-end;
        }
        
        .form-group {
            flex: 1;
            min-width: 200px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--color-text);
        }
        
        .form-group select,
        .form-group input[type="file"] {
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
        
        .images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .image-card {
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(189, 143, 57, 0.2);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            aspect-ratio: 1 / 1;
        }
        
        .image-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .image-card:hover img {
            transform: scale(1.05);
        }
        
        .image-actions {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(16, 13, 12, 0.8);
            padding: 0.5rem;
            display: flex;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .image-card:hover .image-actions {
            opacity: 1;
        }
        
        .image-action {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--color-text);
            border-radius: 50%;
            margin: 0 0.25rem;
            text-decoration: none;
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        
        .image-action:hover {
            background-color: var(--color-gold);
            color: var(--color-dark);
        }
        
        .image-action.delete {
            background-color: rgba(231, 76, 60, 0.2);
        }
        
        .image-action.delete:hover {
            background-color: #e74c3c;
            color: #fff;
        }
        
        .no-images {
            text-align: center;
            padding: 3rem;
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(189, 143, 57, 0.2);
            border-radius: 4px;
            color: var(--color-text-muted);
        }
        
        .admin-footer {
            text-align: center;
            padding: 1.5rem 0;
            background-color: rgba(16, 13, 12, 0.8);
            border-top: 1px solid rgba(189, 143, 57, 0.1);
            color: var(--color-text-muted);
            font-size: 0.8rem;
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
            
            <div class="category-tabs">
                <?php foreach ($image_categories as $cat_key => $cat_name): ?>
                    <a href="?category=<?php echo $cat_key; ?>" class="category-tab <?php echo $selected_category === $cat_key ? 'active' : ''; ?>">
                        <?php echo $cat_name; ?>
                    </a>
                <?php endforeach; ?>
            </div>
            
            <div class="upload-form">
                <h3 class="upload-form-title">Ajouter une nouvelle image</h3>
                <form method="POST" enctype="multipart/form-data">
                    <div class="upload-form-fields">
                        <div class="form-group">
                            <label for="category">Catégorie</label>
                            <select name="category" id="category">
                                <?php foreach ($image_categories as $cat_key => $cat_name): ?>
                                    <option value="<?php echo $cat_key; ?>" <?php echo $selected_category === $cat_key ? 'selected' : ''; ?>>
                                        <?php echo $cat_name; ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="image">Image (JPG, PNG, WEBP - Max 5MB)</label>
                            <input type="file" name="image" id="image" accept=".jpg,.jpeg,.png,.gif,.webp">
                        </div>
                        
                        <button type="submit" name="upload_image">Upload</button>
                    </div>
                </form>
            </div>
            
            <h3 class="section-title">Images de la catégorie: <?php echo $image_categories[$selected_category]; ?></h3>
            
            <?php if (empty($images)): ?>
                <div class="no-images">
                    <p>Aucune image n'a été trouvée dans cette catégorie.</p>
                </div>
            <?php else: ?>
                <div class="images-grid">
                    <?php foreach ($images as $image): ?>
                        <div class="image-card">
                            <img src="<?php echo $image['url']; ?>" alt="Image">
                            <div class="image-actions">
                                <a href="<?php echo $image['url']; ?>" class="image-action" target="_blank" title="Voir l'image">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <a href="?action=delete&category=<?php echo $selected_category; ?>&file=<?php echo $image['filename']; ?>" class="image-action delete" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette image ?')" title="Supprimer l'image">
                                    <i class="fas fa-trash"></i>
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </main>
    
    <footer class="admin-footer">
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> Bohème Fleurs - Tous droits réservés</p>
        </div>
    </footer>
</body>
</html> 