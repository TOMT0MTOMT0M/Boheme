// Script de vérification de connexion pour les pages d'administration
(function() {
    // Vérifier si nous sommes sur la page de connexion
    const isLoginPage = window.location.pathname.includes('index.html') || 
                        window.location.pathname.endsWith('/admin/');
    
    // Fonction pour vérifier si l'utilisateur est connecté
    function checkLogin() {
        const adminSession = localStorage.getItem('adminSession');
        
        // Si on est sur la page de connexion et que l'utilisateur est déjà connecté, rediriger vers le tableau de bord
        if (isLoginPage && adminSession) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Si on n'est pas sur la page de connexion et que l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        if (!isLoginPage && !adminSession) {
            window.location.href = 'index.html';
            return;
        }
    }
    
    // Vérifier la connexion au chargement de la page
    checkLogin();
    
    // Vérifier périodiquement si la session est toujours valide (toutes les 5 minutes)
    setInterval(checkLogin, 5 * 60 * 1000);
})(); 