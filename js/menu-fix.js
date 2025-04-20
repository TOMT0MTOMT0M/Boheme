// Script pour corriger le menu hamburger
document.addEventListener('DOMContentLoaded', function() {
    console.log("Menu fix script loaded");
    
    // Fonction de diagnostic pour aider à résoudre les problèmes de menu
    function diagnoseMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        console.log("Diagnostic du menu mobile:");
        console.log("- Menu toggle trouvé:", !!menuToggle);
        console.log("- Nav list trouvée:", !!navList);
        
        if (menuToggle) {
            console.log("- Menu toggle classes:", menuToggle.className);
            console.log("- Menu toggle visible:", getComputedStyle(menuToggle).display !== 'none');
        }
        
        if (navList) {
            console.log("- Nav list classes:", navList.className);
            console.log("- Nav list visible:", getComputedStyle(navList).visibility !== 'hidden');
            console.log("- Nav list style:", {
                position: getComputedStyle(navList).position,
                display: getComputedStyle(navList).display,
                visibility: getComputedStyle(navList).visibility,
                opacity: getComputedStyle(navList).opacity,
                zIndex: getComputedStyle(navList).zIndex
            });
        }
    }
    
    // Lancer le diagnostic au chargement
    diagnoseMenu();
    
    // Sélectionner à nouveau les éléments du menu ici pour s'assurer qu'ils sont bien trouvés
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const menuBackdrop = document.querySelector('.menu-backdrop');
    const body = document.body;
    
    if (menuToggle && navList) {
        console.log("Menu elements found");
        
        // Ajouter une classe pour identifier que le JS est chargé
        document.body.classList.add('js-loaded');
        
        // Nettoyer les éventuels écouteurs d'événements précédents
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        
        // Nous nous assurons que les attributs ARIA sont correctement définis
        newMenuToggle.setAttribute('aria-expanded', 'false');
        newMenuToggle.setAttribute('aria-controls', navList.id || 'main-menu');
        
        if (!navList.id) {
            navList.id = 'main-menu';
        }
        
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
            newMenuToggle.classList.add('active');
            navList.classList.add('active');
            body.classList.add('menu-open');
            newMenuToggle.setAttribute('aria-expanded', 'true');
            document.documentElement.classList.add('menu-is-open');
            
            // S'assurer que la croix est correctement affichée
            ensureCrossIconState();
            
            // Bloquer le défilement du body quand le menu est ouvert
            document.body.style.overflow = 'hidden';
            
            // Exécuter le diagnostic après l'ouverture
            setTimeout(diagnoseMenu, 100);
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
            
            // Exécuter le diagnostic après la fermeture
            setTimeout(diagnoseMenu, 100);
        }
        
        // Écouteur d'événement optimisé sur le nouvel élément
        newMenuToggle.addEventListener('click', function(e) {
            console.log("Menu toggle clicked");
            e.preventDefault();
            e.stopPropagation();
            
            if (this.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Fermer le menu lorsqu'un lien est cliqué
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', function() {
                if (!link.closest('.language-toggle') && window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
        
        // Fermer le menu au clic sur l'arrière-plan sombre
        if (menuBackdrop) {
            menuBackdrop.addEventListener('click', function() {
                closeMenu();
            });
        }
        
        // Fermer le menu si on appuie sur Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && newMenuToggle.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Vérifier l'état initial après un court délai
        setTimeout(ensureCrossIconState, 300);
    } else {
        console.error("Menu elements not found:", { menuToggle, navList });
    }
}); 