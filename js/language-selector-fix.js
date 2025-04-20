// Script simplifié pour le sélecteur de langues horizontal
document.addEventListener('DOMContentLoaded', function() {
    console.log("Language selector fix loaded - Simple version");
    
    // Éléments du sélecteur de langue
    const langOptions = document.querySelectorAll('.lang-option');
    const navList = document.querySelector('.nav-list');
    
    // Vérifier si les éléments nécessaires sont présents
    if (!langOptions || langOptions.length === 0) {
        console.warn("Éléments du sélecteur de langue non trouvés");
        return;
    }
    
    console.log("Nombre d'options de langue trouvées:", langOptions.length);
    
    // Obtenir la langue actuelle
    function getCurrentLanguage() {
        // Vérifier d'abord localStorage
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang) return storedLang;
        
        // Sinon vérifier l'élément actif
        const activeOption = document.querySelector('.lang-option.active');
        if (activeOption) {
            return activeOption.getAttribute('data-lang');
        }
        
        // Par défaut, français
        return 'fr';
    }
    
    // Fonction pour mettre à jour visuellement la langue active
    function updateActiveLangOption(langCode) {
        // Retirer la classe active de toutes les options
        langOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Ajouter la classe active à l'option sélectionnée
        const selectedOption = document.querySelector(`.lang-option[data-lang="${langCode}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    }
    
    // Fonction pour déclencher le changement de langue
    function triggerLanguageChange(langCode) {
        // Vérifier si c'est la même langue
        const currentLang = getCurrentLanguage();
        if (currentLang === langCode) {
            console.log(`La langue ${langCode} est déjà sélectionnée, pas de changement nécessaire`);
            return true; // Réussite sans rien faire
        }
        
        // Sauvegarder la langue dans le stockage local
        localStorage.setItem('preferredLanguage', langCode);
        
        // Mettre à jour l'affichage
        updateActiveLangOption(langCode);
        
        // Créer un événement simulé pour déclencher la modification par un script existant
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        // Rechercher l'ancien élément de langue correspondant (utilisé par le script original)
        const oldLangOption = document.querySelector(`.lang-dropdown-content a[data-lang="${langCode}"]`);
        
        if (oldLangOption) {
            // Déclencher l'événement sur l'élément original
            oldLangOption.dispatchEvent(clickEvent);
            console.log(`Événement de clic déclenché sur l'élément de langue ${langCode}`);
            return true;
        } else {
            // Si on ne trouve pas l'élément original, on essaie d'autres approches
            // Ne pas recharger la page systématiquement

            try {
                // Essayer d'accéder aux fonctions de traduction via window
                if (window.translationUtils && typeof window.translationUtils.changeLanguage === 'function') {
                    window.translationUtils.changeLanguage(langCode);
                    return true;
                }
                
                // Si aucune méthode ne fonctionne et que c'est vraiment une nouvelle langue
                if (currentLang !== langCode) {
                    console.log("Aucune méthode de changement de langue n'a fonctionné, rechargement de la page");
                    // Stocker la langue pour qu'elle soit appliquée après le rechargement
                    localStorage.setItem('preferredLanguage', langCode);
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }
                return false;
            } catch (error) {
                console.error("Erreur lors du changement de langue:", error);
                return false;
            }
        }
    }
    
    // Ajouter des écouteurs d'événements pour chaque option de langue
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Empêcher la propagation pour éviter que le menu se ferme trop tôt
            
            // Récupérer le code de langue
            const langCode = this.getAttribute('data-lang');
            if (!langCode) return;
            
            console.log(`Option de langue cliquée: ${langCode}`);
            
            // Déclencher le changement de langue
            const success = triggerLanguageChange(langCode);
            
            // Sur mobile, retarder légèrement la fermeture du menu
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    // Fermer le menu mobile manuellement
                    const menuToggle = document.querySelector('.menu-toggle');
                    if (menuToggle && menuToggle.classList.contains('active') && navList) {
                        console.log("Fermeture du menu mobile");
                        menuToggle.classList.remove('active');
                        navList.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        document.body.style.overflow = '';
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }, 500); // Délai pour s'assurer que le changement de langue est bien déclenché
            }
        });
    });
    
    // Initialiser avec la langue stockée
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'fr';
    updateActiveLangOption(savedLanguage);
}); 