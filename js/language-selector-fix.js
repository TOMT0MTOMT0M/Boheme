// Script pour le nouveau sélecteur de langues
document.addEventListener('DOMContentLoaded', function() {
    console.log("Nouveau sélecteur de langues chargé");
    
    // Variables pour suivre l'état de traduction
    let hasBeenTranslatedOnce = false;
    const savedTranslationState = localStorage.getItem('hasBeenTranslatedBefore');
    if (savedTranslationState === 'true') {
        hasBeenTranslatedOnce = true;
    }
    
    // Éléments du sélecteur de langue
    const langSelector = document.querySelector('.lang-selector');
    const langSelected = document.querySelector('.lang-selected');
    const langOptions = document.querySelector('.lang-options');
    const langOptionLinks = document.querySelectorAll('.lang-option');
    const currentLangDisplay = document.getElementById('current-lang');
    
    // Vérifier si les éléments nécessaires sont présents
    if (!langSelector || !langSelected || !langOptions || !langOptionLinks || langOptionLinks.length === 0) {
        console.warn("Éléments du sélecteur de langue non trouvés");
        return;
    }
    
    console.log("Sélecteur de langue initialisé avec", langOptionLinks.length, "options");
    
    // Récupérer la langue actuelle depuis localStorage ou utiliser le français par défaut
    const currentLang = localStorage.getItem('preferredLanguage') || 'fr';
    
    // Mettre à jour l'affichage de la langue actuelle
    function updateCurrentLangDisplay() {
        if (currentLangDisplay) {
            currentLangDisplay.textContent = currentLang.toUpperCase();
        }
        
        // Mettre à jour la classe active
        langOptionLinks.forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === currentLang) {
                option.classList.add('active');
            }
        });
        
        // Mettre à jour l'état d'expansion du bouton
        if (langSelected.hasAttribute('aria-expanded')) {
            langSelected.setAttribute('aria-expanded', langSelector.classList.contains('active') ? 'true' : 'false');
        }
    }
    
    // Fonction pour ouvrir/fermer le menu des langues
    function toggleLangMenu() {
        langSelector.classList.toggle('active');
        updateCurrentLangDisplay(); // Pour mettre à jour l'état aria-expanded
    }
    
    // Fonction pour fermer le menu des langues
    function closeLangMenu() {
        langSelector.classList.remove('active');
        updateCurrentLangDisplay(); // Pour mettre à jour l'état aria-expanded
    }
    
    // Fonction pour changer de langue
    function changeLanguage(langCode) {
        // Si la langue sélectionnée est identique à la langue actuelle, ne rien faire
        if (langCode === currentLang) {
            closeLangMenu();
            return;
        }
        
        // Stocker la nouvelle langue
        localStorage.setItem('preferredLanguage', langCode);
        
        // Simuler un clic sur le sélecteur de langue du script de traduction principal
        // en utilisant un élément caché existant (pour la compatibilité)
        const hiddenLangOption = document.querySelector(`.lang-dropdown-content a[data-lang="${langCode}"]`);
        
        if (hiddenLangOption) {
            // Créer un événement de clic simulé
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            
            // Déclencher l'événement sur l'élément (appel au système de traduction)
            hiddenLangOption.dispatchEvent(clickEvent);
            console.log(`Changement de langue vers ${langCode} via le système de traduction existant`);
            
            // Marquer que la traduction a eu lieu si ce n'est pas vers le français
            if (!hasBeenTranslatedOnce && langCode !== 'fr') {
                hasBeenTranslatedOnce = true;
                localStorage.setItem('hasBeenTranslatedBefore', 'true');
            }
        } else {
            // Si l'élément n'existe pas, déterminer s'il faut recharger la page
            if (hasBeenTranslatedOnce || savedTranslationState === 'true') {
                console.log("Rechargement nécessaire - traduction précédente détectée");
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            } else {
                console.log("Changement de langue sans rechargement - première traduction");
                // Mise à jour manuelle de l'interface sans rechargement
                document.documentElement.lang = langCode;
                updateCurrentLangDisplay();
            }
        }
        
        // Fermer le menu des langues
        closeLangMenu();
    }
    
    // Écouteur pour le bouton principal (ouvrir/fermer menu)
    langSelected.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleLangMenu();
    });
    
    // Support de la navigation au clavier (accessibilité)
    langSelected.addEventListener('keydown', function(e) {
        // Si Espace ou Entrée, ouvrir/fermer le menu
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggleLangMenu();
        }
        // Si flèche bas, ouvrir le menu et sélectionner la première option
        else if (e.key === 'ArrowDown' || e.key === 'Down') {
            e.preventDefault();
            if (!langSelector.classList.contains('active')) {
                toggleLangMenu();
            }
            const firstOption = langOptions.querySelector('a');
            if (firstOption) firstOption.focus();
        }
    });
    
    // Écouteurs pour chaque option de langue
    langOptionLinks.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const langCode = this.getAttribute('data-lang');
            if (!langCode) return;
            
            console.log(`Option de langue sélectionnée: ${langCode}`);
            changeLanguage(langCode);
            
            // Fermer le menu mobile s'il est ouvert
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    const menuToggle = document.querySelector('.menu-toggle');
                    const navList = document.querySelector('.nav-list');
                    
                    if (menuToggle && menuToggle.classList.contains('active') && navList) {
                        menuToggle.classList.remove('active');
                        navList.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        document.body.style.overflow = '';
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }, 300);
            }
        });
        
        // Support de navigation au clavier entre les options
        option.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || e.key === 'Down') {
                e.preventDefault();
                const nextLi = this.closest('li').nextElementSibling;
                if (nextLi) {
                    const nextLink = nextLi.querySelector('a');
                    if (nextLink) nextLink.focus();
                }
            } 
            else if (e.key === 'ArrowUp' || e.key === 'Up') {
                e.preventDefault();
                const prevLi = this.closest('li').previousElementSibling;
                if (prevLi) {
                    const prevLink = prevLi.querySelector('a');
                    if (prevLink) prevLink.focus();
                } else {
                    // Si on est au début, revenir au bouton principal
                    langSelected.focus();
                }
            }
            else if (e.key === 'Escape') {
                e.preventDefault();
                closeLangMenu();
                langSelected.focus();
            }
            else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                const langCode = this.getAttribute('data-lang');
                if (langCode) changeLanguage(langCode);
            }
        });
    });
    
    // Fermer le menu quand on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!langSelector.contains(e.target)) {
            closeLangMenu();
        }
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && langSelector.classList.contains('active')) {
            closeLangMenu();
            langSelected.focus();
        }
    });
    
    // Initialiser l'affichage
    updateCurrentLangDisplay();
}); 