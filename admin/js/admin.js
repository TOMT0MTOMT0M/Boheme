// Scripts communs pour l'administration de Bohème Fleurs

document.addEventListener('DOMContentLoaded', function() {
    // Gérer la déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Supprimer la session
            localStorage.removeItem('adminSession');
            // Rediriger vers la page de connexion
            window.location.href = 'index.html';
        });
    }
    
    // Afficher le nom d'utilisateur dans le menu
    const adminUsername = document.getElementById('adminUsername');
    if (adminUsername) {
        const adminSession = JSON.parse(localStorage.getItem('adminSession'));
        if (adminSession && adminSession.username) {
            adminUsername.textContent = adminSession.username;
        }
    }
    
    // Utilitaires généraux
    const AdminUtils = {
        // Formater une date
        formatDate: function(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        // Créer une notification
        showNotification: function(message, type = 'success') {
            // Vérifier si une notification existe déjà
            const existingNotification = document.querySelector('.admin-notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Créer la notification
            const notification = document.createElement('div');
            notification.className = `admin-notification ${type}`;
            notification.textContent = message;
            
            // Ajouter la notification au DOM
            document.body.appendChild(notification);
            
            // Afficher la notification
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Supprimer la notification après 3 secondes
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        },
        
        // Tronquer un texte
        truncateText: function(text, maxLength = 50) {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        },
        
        // Valider un formulaire
        validateForm: function(form) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            return isValid;
        },
        
        // Charger les données depuis le localStorage
        loadData: function(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        },
        
        // Sauvegarder les données dans le localStorage
        saveData: function(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    };
    
    // Rendre les utilitaires disponibles globalement
    window.AdminUtils = AdminUtils;
}); 