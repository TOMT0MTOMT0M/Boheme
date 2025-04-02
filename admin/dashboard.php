<?php
session_start();
require_once 'includes/functions.php';

// Vérifier si l'utilisateur est connecté
require_login();

// Variables pour la page
$page_title = 'Tableau de bord';
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
        
        .dashboard-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .dashboard-card {
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(189, 143, 57, 0.2);
            border-radius: 4px;
            padding: 2rem;
            text-align: center;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        .dashboard-card:hover {
            transform: translateY(-5px);
            background-color: rgba(189, 143, 57, 0.05);
        }
        
        .dashboard-card-icon {
            font-size: 3rem;
            color: var(--color-gold);
            margin-bottom: 1rem;
        }
        
        .dashboard-card-title {
            font-family: var(--font-primary);
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--color-gold);
        }
        
        .dashboard-card-desc {
            color: var(--color-text-muted);
            margin-bottom: 1.5rem;
        }
        
        .dashboard-card-link {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: var(--color-gold);
            color: var(--color-dark);
            text-decoration: none;
            border-radius: 2px;
            font-family: var(--font-primary);
            transition: background-color 0.3s ease;
            font-size: 1rem;
            letter-spacing: 1px;
        }
        
        .dashboard-card-link:hover {
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
            <p>Bienvenue dans l'espace d'administration de Bohème Fleurs. Utilisez les cartes ci-dessous pour gérer le contenu de votre site web.</p>
            
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">
                        <i class="fas fa-edit"></i>
                    </div>
                    <h3 class="dashboard-card-title">Modifier les textes</h3>
                    <p class="dashboard-card-desc">Modifiez les textes des différentes sections de votre site web.</p>
                    <a href="edit_text.php" class="dashboard-card-link">Accéder</a>
                </div>
                
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">
                        <i class="fas fa-images"></i>
                    </div>
                    <h3 class="dashboard-card-title">Gérer les images</h3>
                    <p class="dashboard-card-desc">Ajoutez, modifiez ou supprimez les images de votre site web.</p>
                    <a href="manage_images.php" class="dashboard-card-link">Accéder</a>
                </div>
                
                <div class="dashboard-card">
                    <div class="dashboard-card-icon">
                        <i class="fas fa-user-cog"></i>
                    </div>
                    <h3 class="dashboard-card-title">Paramètres</h3>
                    <p class="dashboard-card-desc">Modifiez les paramètres de votre compte administrateur.</p>
                    <a href="settings.php" class="dashboard-card-link">Accéder</a>
                </div>
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