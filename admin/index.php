<?php
session_start();

// Vérifier si l'utilisateur est déjà connecté
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit();
}

// Configuration de base
$admin_username = "admin";
$admin_password = "boheme2024"; // À modifier après la première connexion

// Traitement du formulaire de connexion
$error_message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';
    
    // Vérification des identifiants
    if ($username === $admin_username && $password === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $admin_username;
        
        header('Location: dashboard.php');
        exit();
    } else {
        $error_message = 'Identifiants incorrects. Veuillez réessayer.';
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion | Administration Bohème Fleurs</title>
    <link rel="stylesheet" href="../css/reset.css">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
    <style>
        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            justify-content: center;
            align-items: center;
            background-color: var(--color-dark);
        }
        .login-container {
            width: 100%;
            max-width: 400px;
            padding: 2rem;
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(189, 143, 57, 0.2);
            border-radius: 4px;
        }
        .login-title {
            text-align: center;
            margin-bottom: 2rem;
            color: var(--color-gold);
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--color-text);
        }
        input {
            width: 100%;
            padding: 0.75rem;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(189, 143, 57, 0.3);
            border-radius: 2px;
            color: var(--color-text);
        }
        button {
            width: 100%;
            padding: 0.75rem;
            background-color: var(--color-gold);
            border: none;
            border-radius: 2px;
            color: var(--color-dark);
            font-family: var(--font-primary);
            font-size: 1.1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #d3a349;
        }
        .error-message {
            color: #e74c3c;
            margin-bottom: 1rem;
            text-align: center;
        }
        .back-link {
            margin-top: 1rem;
            text-align: center;
        }
        .back-link a {
            color: var(--color-text-muted);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .back-link a:hover {
            color: var(--color-gold);
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1 class="login-title">Administration Bohème Fleurs</h1>
        
        <?php if (!empty($error_message)): ?>
            <div class="error-message"><?php echo $error_message; ?></div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="username">Nom d'utilisateur</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit">Se connecter</button>
        </form>
        
        <div class="back-link">
            <a href="../index.html">Retour au site</a>
        </div>
    </div>
</body>
</html> 