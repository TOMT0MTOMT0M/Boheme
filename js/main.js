// Bohème Fleurs - Script Principal - Optimisé

// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const revealElements = document.querySelectorAll('.reveal-text');
    
    // Fonction pour s'assurer que GSAP et ScrollTrigger sont chargés
    function ensureGSAPLoaded() {
        if (typeof gsap === 'undefined') {
            console.error('GSAP n\'est pas chargé. Les animations ne fonctionneront pas correctement.');
            return false;
        }
        
        if (typeof ScrollTrigger === 'undefined') {
            console.error('ScrollTrigger n\'est pas chargé. Les animations de défilement ne fonctionneront pas.');
            return false;
        }
        
        try {
            gsap.registerPlugin(ScrollTrigger);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de ScrollTrigger:', error);
            return false;
        }
    }
    
    // S'assurer que GSAP est chargé avant d'initialiser
    const isGSAPReady = ensureGSAPLoaded();
    
    // Initialisation
    if (isGSAPReady) {
        initGSAP();
        initScrollAnimations();
        initSectionAnimations();
        initGalleryAnimation();
    } else {
        // Fallback pour garantir la visibilité du contenu si GSAP n'est pas chargé
        forceTextVisibility();
    }
    
    // Initialiser les fonctions qui ne dépendent pas de GSAP
    initMenuToggle();
    initScrollHeader();
    handleMissingImages();
    
    // Fonction pour initialiser GSAP
    function initGSAP() {
        try {
            // Animation de la hero section
            const heroTitle = document.querySelector('.hero h2');
            if (!heroTitle) return;
            
            const heroText = heroTitle.textContent;
            heroTitle.textContent = '';
            
            for (let i = 0; i < heroText.length; i++) {
                const span = document.createElement('span');
                span.textContent = heroText[i] === ' ' ? '\u00A0' : heroText[i];
                span.style.opacity = '0';
                span.style.display = 'inline-block';
                if (heroText[i] !== ' ') {
                    span.style.letterSpacing = '1px';
                }
                heroTitle.appendChild(span);
            }
            
            const heroLetters = heroTitle.querySelectorAll('span');
            gsap.to(heroLetters, {
                opacity: 1,
                duration: 0.05,
                stagger: 0.05,
                ease: "power1.inOut"
            });
            
            // Animation d'entrée pour le paragraphe de la hero
            const heroPara = document.querySelector('.hero p');
            if (heroPara) {
                gsap.to(heroPara, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: 0.3
                });
            }
        } catch (error) {
            console.error('Error initializing GSAP:', error);
            forceTextVisibility();
        }
    }
    
    // Fonction pour initialiser les animations au scroll
    function initScrollAnimations() {
        try {
            // Pour chaque élément à révéler
            revealElements.forEach(el => {
                // S'assurer que l'élément est initialement visible mais transparent
                el.style.opacity = "0";
                el.style.transform = "translateY(30px)";
                el.style.visibility = "visible";
                
                gsap.fromTo(el, 
                    { opacity: 0, y: 30 }, 
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        visibility: "visible",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            once: true
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error in scroll animations:', error);
            forceTextVisibility();
        }
    }
    
    // Fonction pour gérer le menu mobile
    function initMenuToggle() {
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                navList.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Fermer le menu quand on clique sur un lien
            const navLinks = document.querySelectorAll('.nav-list a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }
    
    // Fonction pour gérer le header au défilement
    function initScrollHeader() {
        const scrollThreshold = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--scroll-threshold').trim() || '120');
        
        function updateHeaderTransform() {
            let scrollProgress = Math.min(1, window.scrollY / scrollThreshold);
            scrollProgress = scrollProgress * (2 - scrollProgress);
            
            if (window.scrollY < 10) scrollProgress = 0;
            
            if (scrollProgress >= 0.9) {
                header.classList.add('scrolled');
            } else if (scrollProgress <= 0.1) {
                header.classList.remove('scrolled');
            }
        }
        
        window.addEventListener('scroll', function() {
            requestAnimationFrame(updateHeaderTransform);
        });
        
        updateHeaderTransform();
    }
    
    // Fonction pour gérer les images manquantes
    function handleMissingImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'images/placeholder.svg';
                this.alt = 'Image temporairement indisponible';
                this.classList.add('placeholder-img');
            });
        });
    }
    
    // Fonctions pour les animations au défilement sur les sections
    function initSectionAnimations() {
        try {
            const sections = document.querySelectorAll('.section');
            
            if (sections.length === 0) return;
            
            sections.forEach(section => {
                try {
                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                            once: true
                        }
                    });
                    
                    const title = section.querySelector('.section-title');
                    const content = section.querySelector('.section-content');
                    
                    if (title) {
                        timeline.from(title, {
                            y: 30,
                            opacity: 0,
                            duration: 0.6
                        });
                    }
                    
                    if (content) {
                        timeline.from(content, {
                            y: 30,
                            opacity: 0,
                            duration: 0.8
                        }, "-=0.3");
                    }
                } catch (error) {
                    console.error('Error animating section:', error);
                }
            });
        } catch (error) {
            console.error('Error initializing section animations:', error);
        }
    }
    
    // Initialiser les animations de la galerie
    function initGalleryAnimation() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
        if (!galleryItems.length) return;
        
        try {
            galleryItems.forEach((galleryItem, i) => {
                gsap.from(galleryItem, {
                    y: 50,
                    opacity: 0,
                    duration: 0.6,
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: galleryGrid,
                        start: "top 85%",
                        once: true
                    }
                });
            });
        } catch (error) {
            console.error('Error in gallery animation:', error);
            galleryItems.forEach(item => {
                item.style.opacity = 1;
                item.style.transform = 'translateY(0)';
            });
        }
    }
    
    // Fonction pour forcer la visibilité de tous les textes en cas d'erreur
    function forceTextVisibility() {
        document.querySelectorAll('.reveal-text, .text-content p, .gallery-item, .hero p, .hero h2').forEach(el => {
            el.style.opacity = "1";
            el.style.visibility = "visible";
            el.style.transform = "translateY(0)";
        });
    }
    
    // Appeler cette fonction après un délai pour s'assurer que tout est chargé
    setTimeout(forceTextVisibility, 1000);
}); 