// Script de connexion à l'espace administrateur de Bohème Fleurs

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Vérification simple des identifiants (à remplacer par une vérification plus sécurisée)
            // Dans une vraie application, cela serait géré côté serveur avec un système d'authentification sécurisé
            if (username === 'admin' && password === 'boheme2023') {
                // Simulation d'une connexion réussie
                loginMessage.textContent = 'Connexion réussie ! Redirection...';
                loginMessage.className = 'form-message success';
                
                // Enregistrer la session dans le localStorage (solution temporaire pour démo)
                localStorage.setItem('adminSession', JSON.stringify({
                    username: username,
                    loggedIn: true,
                    timestamp: new Date().getTime()
                }));
                
                // Redirection vers le tableau de bord
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                // Message d'erreur en cas d'échec de connexion
                loginMessage.textContent = 'Identifiants incorrects. Veuillez réessayer.';
                loginMessage.className = 'form-message';
                
                // Effacer le champ de mot de passe
                document.getElementById('password').value = '';
            }
        });
    }
    
    // Vérifier si l'utilisateur est déjà connecté
    function checkSession() {
        const adminSession = JSON.parse(localStorage.getItem('adminSession'));
        
        // Si la page n'est pas la page de connexion et que l'utilisateur n'est pas connecté
        // ou si la session a expiré (après 24h), rediriger vers la page de connexion
        if (window.location.pathname.includes('dashboard') || 
            window.location.pathname.includes('photos') || 
            window.location.pathname.includes('textes')) {
            
            if (!adminSession || 
                !adminSession.loggedIn || 
                (new Date().getTime() - adminSession.timestamp > 86400000)) { // 24h en millisecondes
                
                // Effacer la session expirée
                localStorage.removeItem('adminSession');
                
                // Rediriger vers la page de connexion
                window.location.href = 'index.html';
            }
        }
    }
    
    // Vérifier la session à chaque chargement de page
    checkSession();
}); 