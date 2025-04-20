// Script dédié pour le menu mobile - Solution définitive
document.addEventListener('DOMContentLoaded', function() {
    // Fonction de diagnostic pour aider à résoudre les problèmes de menu
    function diagnoseMenu() {
        const menuEl = document.querySelector('.menu-toggle');
        const navEl = document.querySelector('.nav-list');
        
        console.log("Diagnostic du menu mobile:");
        console.log("- Menu toggle trouvé:", !!menuEl);
        console.log("- Nav list trouvée:", !!navEl);
        
        if (menuEl) {
            console.log("- Menu toggle classes:", menuEl.className);
        }
        
        if (navEl) {
            console.log("- Nav list classes:", navEl.className);
        }
    }
    
    // Sélectionner les éléments du menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');
    const body = document.body;
    
    if (!menuToggle || !navList) {
        console.warn('Éléments du menu non trouvés');
        return;
    }
    
    // S'assurer que l'ID est correctement défini
    if (!navList.id) {
        navList.id = 'main-menu';
    }
    
    // CORRECTIF IMPORTANT: Assurer que le menu est visible en mode desktop
    function enforceDesktopMenu() {
        if (window.innerWidth > 768) {
            // Forcer la visibilité du menu sur desktop
            navList.style.visibility = 'visible';
            navList.style.opacity = '1';
            navList.style.transform = 'none';
            navList.style.position = 'static';
            navList.style.display = 'flex';
            navList.style.flexDirection = 'row';
            navList.style.height = 'auto';
            navList.style.width = '100%';
            navList.style.backgroundColor = 'transparent';
            
            // Cacher le menu hamburger sur desktop
            if (menuToggle) {
                menuToggle.style.display = 'none';
            }
            
            // Rendre tous les liens visibles
            navLinks.forEach(link => {
                link.style.opacity = '1';
                link.style.transform = 'none';
                link.style.animation = 'none';
                link.style.padding = '0';
                link.style.width = 'auto';
            });
            
            // S'assurer que le menu de langues est configuré correctement en desktop
            setupLanguageSelector();
        }
    }
    
    // Configuration du sélecteur de langues pour le desktop
    function setupLanguageSelector() {
        const languageToggle = document.querySelector('.language-toggle');
        const languagesContainer = document.querySelector('.languages-container');
        
        if (!languageToggle || !languagesContainer) return;
        
        // Assurer les styles de base pour le conteneur de langues
        languagesContainer.style.display = 'flex';
        languagesContainer.style.gap = '0.5rem';
        
        // Configurer les liens de langues
        const langOptions = languagesContainer.querySelectorAll('.lang-option');
        
        // Variable pour stocker la langue actuellement active
        let currentLang = '';
        
        // Déterminer la langue active actuelle
        langOptions.forEach(option => {
            if (option.classList.contains('active')) {
                currentLang = option.getAttribute('data-lang');
            }
            
            // Stockez la langue actuelle dans localStorage si elle n'est pas déjà définie
            if (currentLang && !localStorage.getItem('selectedLanguage')) {
                localStorage.setItem('selectedLanguage', currentLang);
            }
        });
        
        // Si pas de langue active mais une langue stockée, la définir comme active
        if (!currentLang && localStorage.getItem('selectedLanguage')) {
            currentLang = localStorage.getItem('selectedLanguage');
            langOptions.forEach(option => {
                if (option.getAttribute('data-lang') === currentLang) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
        
        langOptions.forEach(option => {
            option.style.color = 'var(--color-gold)';
            option.style.textDecoration = 'none';
            option.style.padding = '0.25rem 0.5rem';
            option.style.borderRadius = '3px';
            option.style.transition = 'background-color 0.3s ease';
            
            // Ajouter l'événement de clic pour changer de langue
            option.addEventListener('click', function(e) {
                // Récupérer le code de langue
                const lang = this.getAttribute('data-lang');
                
                // Si la langue est identique à la langue actuelle, empêcher le rechargement
                if (lang === currentLang) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                
                // Mettre à jour la langue actuelle
                currentLang = lang;
                localStorage.setItem('selectedLanguage', lang);
                
                // Mettre à jour la classe active
                langOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                console.log('Langue sélectionnée:', lang);
                
                // Ici, appeler la fonction de changement de langue si elle existe
                if (typeof changeLanguage === 'function') {
                    changeLanguage(lang);
                    // Le changeLanguage gère souvent déjà le rechargement si nécessaire
                    e.preventDefault();
                }
                
                // On ne fait rien d'autre ici, ce qui permet au comportement par défaut de s'exécuter
                // Le lien href (s'il y en a un) sera suivi, causant un rechargement si nécessaire
            });
        });
    }
    
    // Appliquer immédiatement le correctif
    enforceDesktopMenu();
    
    // Et réappliquer lors du redimensionnement de la fenêtre
    window.addEventListener('resize', enforceDesktopMenu);
    
    // Nettoyer les éventuels écouteurs d'événements précédents
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    // Ajouter des attributs ARIA pour l'accessibilité
    newMenuToggle.setAttribute('aria-expanded', 'false');
    newMenuToggle.setAttribute('aria-controls', navList.id);
    
    // Fonction pour s'assurer que la croix est correctement affichée
    function ensureCrossIconState() {
        const isActive = newMenuToggle.classList.contains('active');
        const inner = newMenuToggle.querySelector('.hamburger-inner');
        
        if (!inner) return;
        
        if (isActive) {
            // Forcer l'affichage correct de la croix
            inner.style.backgroundColor = 'transparent';
            inner.classList.add('cross-active');
            
            // On force l'opacité avec une règle CSS spécifique via un style inline
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                .hamburger-inner.cross-active::before {
                    opacity: 1 !important;
                    background-color: #fff !important;
                }
            `;
            document.head.appendChild(styleElement);
            
            // Alternative: créer une classe d'aide spécifique
            if (!document.querySelector('.force-cross-opacity')) {
                const styleHelp = document.createElement('style');
                styleHelp.className = 'force-cross-opacity';
                styleHelp.innerHTML = `
                    .menu-toggle.active .hamburger-inner::before,
                    .hamburger-inner.cross-active::before {
                        opacity: 1 !important;
                        background-color: #fff !important;
                    }
                `;
                document.head.appendChild(styleHelp);
            }
        } else {
            // Revenir à l'état hamburger
            inner.style.backgroundColor = '';
            inner.classList.remove('cross-active');
        }
    }
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        // Ne pas ouvrir le menu en mode desktop
        if (window.innerWidth > 768) return;
        
        newMenuToggle.classList.add('active');
        navList.classList.add('active');
        body.classList.add('menu-open');
        newMenuToggle.setAttribute('aria-expanded', 'true');
        document.documentElement.classList.add('menu-is-open');
        
        // S'assurer que la croix est correctement affichée
        ensureCrossIconState();
        
        // Bloquer le défilement du body
        document.body.style.overflow = 'hidden';
        
        // Log diagnostic
        diagnoseMenu();
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        newMenuToggle.classList.remove('active');
        navList.classList.remove('active');
        body.classList.remove('menu-open');
        newMenuToggle.setAttribute('aria-expanded', 'false');
        document.documentElement.classList.remove('menu-is-open');
        
        // S'assurer que l'hamburger est correctement affiché
        ensureCrossIconState();
        
        // Réactiver le scroll
        document.body.style.overflow = 'auto';
        
        // Réappliquer le correctif pour le desktop après fermeture
        if (window.innerWidth > 768) {
            enforceDesktopMenu();
        }
        
        // Log diagnostic
        diagnoseMenu();
    }
    
    // Toggle le menu quand on clique sur le bouton hamburger
    newMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log("Menu toggle clicked");
        
        if (this.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // Fermer le menu si on appuie sur Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && newMenuToggle.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Réinitialiser l'état du menu lors du redimensionnement
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && newMenuToggle.classList.contains('active')) {
            closeMenu();
        }
        
        // Réappliquer le correctif pour le desktop
        if (window.innerWidth > 768) {
            enforceDesktopMenu();
        }
    });
    
    // Log diagnostic initial
    diagnoseMenu();
    
    // Vérifier l'état initial après un court délai
    setTimeout(ensureCrossIconState, 300);
    
    // S'assurer que le menu desktop est visible après un petit délai
    setTimeout(enforceDesktopMenu, 500);

    // Gestion spécifique du menu de langues sur mobile
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    if (langToggle && langDropdown) {
        // S'assurer que cet écouteur n'interfère pas avec celui dans index.html
        // Si on est sur mobile ET que le menu est ouvert, on veut capter les clics sur le sélecteur de langues
        const handleLangToggle = function(e) {
            if (window.innerWidth <= 768 && document.body.classList.contains('menu-open')) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle la classe active sur le dropdown
                langDropdown.classList.toggle('active');
                
                // Éviter que le menu principal se ferme lors de cette action
                return false;
            }
        };
        
        // Nettoyer les écouteurs précédents si nécessaire
        const newLangToggle = langToggle.cloneNode(true);
        langToggle.parentNode.replaceChild(newLangToggle, langToggle);
        
        // Ajouter l'écouteur d'événement
        newLangToggle.addEventListener('click', handleLangToggle);
        
        // Fermer le menu déroulant des langues quand on clique sur une langue
        document.querySelectorAll('.lang-dropdown-content a').forEach(langOption => {
            langOption.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    langDropdown.classList.remove('active');
                }
            });
        });
        
        // Fermer le menu déroulant des langues quand on clique ailleurs sur la page
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && !e.target.closest('.lang-dropdown') && langDropdown.classList.contains('active')) {
                langDropdown.classList.remove('active');
            }
        });
    }
    
    // Initialiser le sélecteur de langues après chargement complet
    document.addEventListener('DOMContentLoaded', setupLanguageSelector);
}); 