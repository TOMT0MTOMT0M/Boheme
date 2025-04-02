// Bohème Fleurs - Script Principal

// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const revealElements = document.querySelectorAll('.reveal-text');
    
    // Définir testimonials pour initTestimonials
    const testimonials = [
        // Si vous avez des témoignages statiques, vous pouvez les ajouter ici
        // { name: "Nom du client", text: "Texte du témoignage", event: "Type d'événement" }
    ];
    
    // Fonction pour s'assurer que GSAP et ScrollTrigger sont chargés
    function ensureGSAPLoaded() {
        // Vérifier si GSAP est déjà disponible
        if (typeof gsap === 'undefined') {
            console.error('GSAP n\'est pas chargé. Les animations ne fonctionneront pas correctement.');
            return false;
        }
        
        // Vérifier si ScrollTrigger est disponible
        if (typeof ScrollTrigger === 'undefined') {
            console.error('ScrollTrigger n\'est pas chargé. Les animations de défilement ne fonctionneront pas.');
            // Tenter de l'enregistrer au cas où il serait chargé de manière asynchrone
            if (gsap.registerPlugin) {
                try {
                    // Essayer d'enregistrer ScrollTrigger (si jamais il était chargé mais pas enregistré)
                    gsap.registerPlugin(ScrollTrigger);
                    console.log('ScrollTrigger a été enregistré avec succès.');
                    return true;
                } catch (error) {
                    console.error('Erreur lors de l\'enregistrement de ScrollTrigger:', error);
                    return false;
                }
            }
            return false;
        }
        
        // Enregistrer ScrollTrigger pour être sûr
        if (gsap.registerPlugin) {
            try {
                gsap.registerPlugin(ScrollTrigger);
                console.log('ScrollTrigger a été enregistré avec succès.');
                return true;
            } catch (error) {
                console.error('Erreur lors de l\'enregistrement de ScrollTrigger:', error);
                return false;
            }
        }
        
        return true;
    }
    
    // S'assurer que GSAP est chargé avant d'initialiser
    const isGSAPReady = ensureGSAPLoaded();
    
    // Initialisation - seulement exécuter initGSAP et les animations ScrollTrigger si GSAP est prêt
    if (isGSAPReady) {
        initGSAP();
        initScrollAnimations();
        initParagraphAnimations();
        initSectionAnimations();
        initGalleryAnimation();
        initTestimonials();
    } else {
        // Fallback pour garantir la visibilité du contenu si GSAP n'est pas chargé
        forceTextVisibility();
    }
    
    // Initialiser les fonctions qui ne dépendent pas de GSAP
    initMenuToggle();
    initScrollHeader();
    handleMissingImages();
    enhanceGrainEffect();
    adaptGrainToPerformance();
    enhanceTransitions();
    
    // Fonction pour initialiser GSAP
    function initGSAP() {
        try {
            // Vérifier que GSAP est chargé
            if (typeof gsap === 'undefined') {
                console.error('GSAP is not loaded. Animations will not work.');
                return;
            }
            
            // Vérifier que ScrollTrigger est disponible
            if (typeof ScrollTrigger === 'undefined') {
                console.error('ScrollTrigger is not available. Scroll animations will not work.');
                return;
            }
            
            // Enregistrer le plugin ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);
            
            // Animation de la hero section
            const heroTl = gsap.timeline();
            
            // Animation d'entrée lettre par lettre pour le h2 de la hero
            const heroTitle = document.querySelector('.hero h2');
            if (!heroTitle) {
                console.log('Hero title not found in the DOM.');
                return;
            }
            
            const heroText = heroTitle.textContent;
            heroTitle.textContent = '';
            
            for (let i = 0; i < heroText.length; i++) {
                const span = document.createElement('span');
                span.textContent = heroText[i] === ' ' ? '\u00A0' : heroText[i];
                span.style.opacity = '0';
                span.style.display = 'inline-block';
                // Ajout d'un petit espacement pour Bebas Neue
                if (heroText[i] !== ' ') {
                    span.style.letterSpacing = '1px';
                }
                heroTitle.appendChild(span);
            }
            
            const heroLetters = heroTitle.querySelectorAll('span');
            heroTl.to(heroLetters, {
                opacity: 1,
                duration: 0.05,
                stagger: 0.05,
                ease: "power1.inOut"
            });
            
            // Animation d'entrée pour le paragraphe de la hero
            const heroPara = document.querySelector('.hero p');
            if (heroPara) {
                heroTl.to(heroPara, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    delay: 0.3
                }, "-=0.3");
            }
        } catch (error) {
            console.error('Error initializing GSAP:', error);
        }
    }
    
    // Fonction pour initialiser les animations au scroll
    function initScrollAnimations() {
        try {
            // Vérifier que ScrollTrigger est disponible
            if (typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') {
                console.error('GSAP or ScrollTrigger not available. Scroll animations will not work.');
                return;
            }
            
            // Pour chaque élément à révéler
            revealElements.forEach(el => {
                // S'assurer que l'élément est initialement visible mais transparent
                el.style.opacity = "0";
                el.style.transform = "translateY(30px)";
                el.style.visibility = "visible";
                
                try {
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
                                toggleClass: "revealed",
                                once: true,
                                onEnter: () => {
                                    // Assurer que le texte reste visible après l'animation
                                    setTimeout(() => {
                                        el.style.opacity = "1";
                                        el.style.transform = "translateY(0)";
                                        el.style.visibility = "visible";
                                    }, 1000);
                                }
                            }
                        }
                    );
                } catch (error) {
                    console.error('Error animating element:', error);
                    // Assurer la visibilité en cas d'erreur
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                    el.style.visibility = "visible";
                }
            });
            
            // Forcer la visibilité de tous les textes après un court délai
            setTimeout(() => {
                document.querySelectorAll('.text-content p').forEach(p => {
                    p.style.opacity = "1";
                    p.style.visibility = "visible";
                });
            }, 500);
        } catch (error) {
            console.error('Error in scroll animations:', error);
            // Assurer que tous les textes sont visibles en cas d'erreur
            document.querySelectorAll('.reveal-text, .text-content p').forEach(el => {
                el.style.opacity = "1";
                el.style.visibility = "visible";
                el.style.transform = "translateY(0)";
            });
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
        // Récupérer le seuil de défilement depuis les variables CSS
        const scrollThreshold = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--scroll-threshold').trim() || '120');
        let lastScrollY = 0;
        
        // Fonction pour appliquer une transformation progressive au header
        function updateHeaderTransform() {
            // Calculer le pourcentage de transformation (0-1)
            let scrollProgress = Math.min(1, window.scrollY / scrollThreshold);
            
            // Appliquer une courbe d'accélération pour une transition plus naturelle
            scrollProgress = scrollProgress * (2 - scrollProgress);
            
            // Si le scroll est très petit, forcer à 0
            if (window.scrollY < 10) scrollProgress = 0;
            
            // Ajouter/retirer la classe scrolled
            if (scrollProgress >= 0.9) {
                header.classList.add('scrolled');
            } else if (scrollProgress <= 0.1) {
                header.classList.remove('scrolled');
            }
        }
        
        // Mettre à jour la position du header au scroll
        window.addEventListener('scroll', function() {
            // Appeler la transformation avec demande d'animation frame pour optimisation
            requestAnimationFrame(updateHeaderTransform);
        });
        
        // Initialiser lors du chargement (important pour les rechargements de page)
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
    
    // Fonction pour les animations de paragraphes fluides
    function initParagraphAnimations() {
        try {
            // Vérifier que GSAP et ScrollTrigger sont disponibles
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                console.error('GSAP or ScrollTrigger not available. Paragraph animations will not work.');
                return;
            }
            
            const paragraphs = document.querySelectorAll('.text-content p');
            
            if (paragraphs.length === 0) {
                console.log('No paragraphs found to animate.');
                return;
            }
            
            paragraphs.forEach(paragraph => {
                try {
                    gsap.from(paragraph, {
                        y: 50,
                        opacity: 0,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: paragraph,
                            start: "top 85%",
                            once: true
                        }
                    });
                } catch (error) {
                    console.error('Error animating paragraph:', error);
                    // Assurer la visibilité en cas d'erreur
                    paragraph.style.opacity = "1";
                    paragraph.style.transform = "translateY(0)";
                }
            });
        } catch (error) {
            console.error('Error in paragraph animations:', error);
            // Assurer que tous les paragraphes sont visibles en cas d'erreur
            document.querySelectorAll('.text-content p').forEach(p => {
                p.style.opacity = "1";
                p.style.visibility = "visible";
                p.style.transform = "translateY(0)";
            });
        }
    }
    
    // Fonctions pour les animations au défilement sur les sections
    function initSectionAnimations() {
        try {
            // Vérifier que GSAP et ScrollTrigger sont disponibles
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                console.error('GSAP or ScrollTrigger not available. Section animations will not work.');
                return;
            }
            
            const sections = document.querySelectorAll('.section');
            
            if (sections.length === 0) {
                console.log('No sections found to animate.');
                return;
            }
            
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
                    // Assurer la visibilité de la section en cas d'erreur
                    const title = section.querySelector('.section-title');
                    const content = section.querySelector('.section-content');
                    
                    if (title) {
                        title.style.opacity = "1";
                        title.style.transform = "translateY(0)";
                    }
                    
                    if (content) {
                        content.style.opacity = "1";
                        content.style.transform = "translateY(0)";
                    }
                }
            });
        } catch (error) {
            console.error('Error in section animations:', error);
            // Assurer que toutes les sections sont visibles en cas d'erreur
            document.querySelectorAll('.section-title, .section-content').forEach(el => {
                el.style.opacity = "1";
                el.style.visibility = "visible";
                el.style.transform = "translateY(0)";
            });
        }
    }
    
    // Initialiser les animations de la galerie
    function initGalleryAnimation() {
        // Récupérer les éléments de galerie existants et les animer
        const galleryGrid = document.querySelector('.gallery-grid');
        
        // Vérifier si l'élément gallery-grid existe dans le DOM
        if (!galleryGrid) {
            console.log('Gallery grid not found in the DOM.');
            return; // Sortir de la fonction si l'élément n'existe pas
        }
        
        // Animer uniquement les éléments existants dans la galerie
        const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
        
        // Attendre que le DOM soit complètement chargé avant d'initialiser les animations
        setTimeout(() => {
            try {
                // Animer les éléments existants
                galleryItems.forEach((galleryItem, i) => {
                    // Animation d'entrée avec GSAP - utiliser un try-catch pour capturer les erreurs
                    try {
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
                    } catch (error) {
                        console.error(`Error animating gallery item ${i}:`, error);
                        // Fallback animation sans ScrollTrigger
                        gsap.from(galleryItem, {
                            y: 50,
                            opacity: 0,
                            duration: 0.6,
                            delay: i * 0.1
                        });
                    }
                });
            } catch (error) {
                console.error('Error in gallery animation:', error);
            }
        }, 100); // Un petit délai pour s'assurer que tout est chargé
    }
    
    // Initialiser les témoignages
    function initTestimonials() {
        const testimonialContainer = document.querySelector('.testimonials-container');
        
        // Vérifier si le conteneur existe dans le DOM
        if (!testimonialContainer) {
            console.log('Testimonial container not found in the DOM.');
            return; // Sortir de la fonction si l'élément n'existe pas
        }
        
        // Ajouter un petit délai pour s'assurer que tout est chargé
        setTimeout(() => {
            try {
                // Vérifier si testimonials existe et a des éléments
                if (!testimonials || testimonials.length === 0) {
                    console.log('No testimonials data available.');
                    return;
                }
                
                // Créer la structure des témoignages
                testimonials.forEach((testimonial, index) => {
                    const testimonialCard = document.createElement('div');
                    testimonialCard.classList.add('testimonial-card');
                    
                    const testimonialText = document.createElement('p');
                    testimonialText.classList.add('testimonial-text');
                    testimonialText.textContent = testimonial.text;
                    
                    const testimonialAuthor = document.createElement('div');
                    testimonialAuthor.classList.add('testimonial-author');
                    
                    const authorName = document.createElement('h4');
                    authorName.textContent = testimonial.name;
                    
                    const authorEvent = document.createElement('span');
                    authorEvent.textContent = testimonial.event;
                    
                    testimonialAuthor.appendChild(authorName);
                    testimonialAuthor.appendChild(authorEvent);
                    
                    testimonialCard.appendChild(testimonialText);
                    testimonialCard.appendChild(testimonialAuthor);
                    
                    testimonialContainer.appendChild(testimonialCard);
                    
                    // Animation avec GSAP - utiliser un try-catch pour capturer les erreurs
                    try {
                        gsap.from(testimonialCard, {
                            x: index % 2 === 0 ? -50 : 50,
                            opacity: 0,
                            duration: 0.8,
                            delay: index * 0.2,
                            scrollTrigger: {
                                trigger: testimonialContainer,
                                start: "top 85%",
                                once: true
                            }
                        });
                    } catch (error) {
                        console.error(`Error animating testimonial card ${index}:`, error);
                        // Fallback animation sans ScrollTrigger
                        gsap.from(testimonialCard, {
                            x: index % 2 === 0 ? -50 : 50,
                            opacity: 0,
                            duration: 0.8,
                            delay: index * 0.2
                        });
                    }
                });
            } catch (error) {
                console.error('Error in testimonials section:', error);
            }
        }, 100);
    }
    
    // Fonction pour améliorer l'effet de grain
    function enhanceGrainEffect() {
        try {
            // Supprimer l'élément grain-overlay du DOM
            const grainOverlay = document.querySelector('.grain-overlay');
            if (grainOverlay && grainOverlay.parentNode) {
                grainOverlay.parentNode.removeChild(grainOverlay);
            }
            
            // Supprimer les classes de grain de tous les éléments
            document.querySelectorAll('.grain-texture, .grain-animated, .grain-hover').forEach(el => {
                el.classList.remove('grain-texture', 'grain-animated', 'grain-hover');
            });
            
            // Empêcher l'ajout de classes de grain aux éléments interactifs
            const interactiveElements = document.querySelectorAll('.event-category, .service-card, .pro-service, .contact-item');
            interactiveElements.forEach(el => {
                el.classList.remove('grain-hover');
                
                // Définir les fonctions de gestion d'événements
                // Note: Ces fonctions ne peuvent pas être réellement supprimées car elles
                // n'étaient pas référencées avant, mais nous définissons des gestionnaires vides
                el.addEventListener('mouseenter', function() {
                    // Ne rien faire (ou ajouter d'autres effets non liés au grain si nécessaire)
                });
                
                el.addEventListener('mouseleave', function() {
                    // Ne rien faire (ou ajouter d'autres effets non liés au grain si nécessaire)
                });
            });
        } catch (error) {
            console.error('Error removing grain effect:', error);
        }
    }
    
    // Fonction pour adapter l'effet de grain en fonction des performances
    function adaptGrainToPerformance() {
        // Cette fonction est appelée mais non définie dans le code original
        // Nous ajoutons une implémentation vide pour éviter les erreurs
        try {
            // Désactiver complètement l'effet de grain pour optimiser les performances
            const grainElements = document.querySelectorAll('.grain-texture, .grain-animated, .grain-overlay, .grain-hover');
            grainElements.forEach(el => {
                el.style.backgroundImage = 'none';
                el.style.animation = 'none';
                el.style.opacity = '1';
            });
        } catch (error) {
            console.error('Error adapting grain effect:', error);
        }
    }
    
    // Améliorer les transitions
    function enhanceTransitions() {
        // Animation des éléments au scroll
        const animatedItems = document.querySelectorAll('.service-card, .event-category, .pro-service, .contact-item');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            animatedItems.forEach(item => {
                item.classList.add('will-animate');
                observer.observe(item);
            });
        } else {
            // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
            animatedItems.forEach(item => {
                item.classList.add('fade-in');
            });
        }
        
        // Améliorer la transition des images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.onload = function() {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                };
            }
        });
    }
    
    // Fonction d'urgence pour forcer l'affichage de tous les textes
    function forceTextVisibility() {
        // Sélectionner tous les éléments textuels importants
        const textElements = document.querySelectorAll('.text-content, .text-content p, .section-content p, .reveal-text');
        
        // Forcer leur visibilité
        textElements.forEach(el => {
            el.style.opacity = "1";
            el.style.visibility = "visible";
            el.style.color = "var(--color-text)";
            el.style.position = "relative";
            el.style.zIndex = "25";
        });
    }
    
    // Appeler cette fonction après un délai pour s'assurer que tout est chargé
    setTimeout(forceTextVisibility, 1000);
}); 