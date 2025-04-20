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
    });
    
    // Log diagnostic initial
    diagnoseMenu();
    
    // Vérifier l'état initial après un court délai
    setTimeout(ensureCrossIconState, 300);
}); 