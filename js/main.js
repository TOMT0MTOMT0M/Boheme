// Bohème Fleurs - Script Principal - Optimisé

// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le loader
    initAdvancedLoader();
    
    // Variables globales
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const revealElements = document.querySelectorAll('.reveal-text');
    
    // Initialiser les attributs d'accessibilité pour le menu
    initMenuAccessibility();
    
    // Vérifier si GSAP et ScrollTrigger sont chargés correctement
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP ou ScrollTrigger non chargé. Les animations sont désactivées.');
        forceTextVisibility(); // Assurer la visibilité du contenu même sans animations
    }
    
    // Vérification de la clé API 
    if (typeof window.GOOGLE_API_KEY === 'undefined') {
        console.warn('Config.js non chargé. Utilisation de la valeur de secours.');
        window.GOOGLE_API_KEY = 'AIzaSyCTJ-ttYO8KkKmvDGAFFpjRwiBJf9ciXrA';
    }
    
    // Initialiser et actualiser tous les swipers
    initAllSwipers();
    
    // Fonction avancée pour initialiser le loader de style Awwwards
    function initAdvancedLoader() {
        // Créer le loader
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'loader-container';
        
        // Structure du loader
        loaderContainer.innerHTML = `
            <div class="loader-content">
                <img src="images/Logo Boheme.png" alt="Bohème Fleurs" class="loader-logo">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="loading-text">
                    Chargement 
                    <span class="loader-dot"></span>
                    <span class="loader-dot"></span>
                    <span class="loader-dot"></span>
                </div>
            </div>
            <div class="counter">0%</div>
        `;
        
        document.body.appendChild(loaderContainer);
        document.body.style.overflow = 'hidden'; // Empêcher le défilement pendant le chargement
        
        // Liste des ressources à précharger
        const resources = [
            { type: 'image', src: 'images/herobg.jpg', weight: 30 },
            { type: 'image', src: 'images/Logo Boheme.png', weight: 10 },
            { type: 'image', src: 'images/quoti-hori.jpg', weight: 15 },
            { type: 'image', src: 'images/quoti1.jpg', weight: 10 },
            { type: 'image', src: 'images/quoti2.jpg', weight: 10 },
            { type: 'image', src: 'images/quoti3.jpg', weight: 10 },
            { type: 'script', src: 'js/config.js', weight: 5 },
            { type: 'font', weight: 10 } // Simulation du chargement des polices
        ];
        
        const progressFill = loaderContainer.querySelector('.progress-fill');
        const counterElement = loaderContainer.querySelector('.counter');
        let loadedWeight = 0;
        let totalWeight = resources.reduce((sum, resource) => sum + resource.weight, 0);
        
        // Fonction pour mettre à jour la progression
        function updateProgress(additionalWeight) {
            loadedWeight += additionalWeight;
            const percentage = Math.round((loadedWeight / totalWeight) * 100);
            
            // Mettre à jour la barre de progression et le compteur
            progressFill.style.width = `${percentage}%`;
            counterElement.textContent = `${percentage}%`;
            
            // Si tout est chargé, masquer le loader
            if (percentage >= 100) {
                setTimeout(() => {
                    loaderContainer.classList.add('loader-hidden');
                    document.body.style.overflow = ''; // Réactiver le défilement
                    
                    // Animer l'apparition des éléments de la page
                    animatePageElements();
                    
                    // Supprimer le loader une fois l'animation terminée
                    setTimeout(() => {
                        loaderContainer.remove();
                    }, 1000);
                }, 600); // Petit délai pour montrer 100%
            }
        }
        
        // Précharger les images
        function preloadResource(resource) {
            return new Promise((resolve) => {
                if (resource.type === 'image') {
                    const img = new Image();
                    
                    img.onload = () => {
                        updateProgress(resource.weight);
                        resolve();
                    };
                    
                    img.onerror = () => {
                        console.warn(`Erreur lors du chargement de l'image: ${resource.src}`);
                        updateProgress(resource.weight / 2); // Compter partiellement même en cas d'erreur
                        resolve();
                    };
                    
                    img.src = resource.src;
                } else if (resource.type === 'script') {
                    // Simuler le chargement d'un script
                    setTimeout(() => {
                        updateProgress(resource.weight);
                        resolve();
                    }, 200);
                } else if (resource.type === 'font') {
                    // Simuler le chargement des polices
                    setTimeout(() => {
                        updateProgress(resource.weight);
                        resolve();
                    }, 500);
                }
            });
        }
        
        // Ajouter un petit délai initial pour l'effet
        setTimeout(() => {
            // Précharger toutes les ressources
            Promise.all(resources.map(resource => preloadResource(resource)))
                .catch(err => {
                    console.error('Erreur lors du préchargement des ressources:', err);
                    // En cas d'erreur, finir le chargement quand même
                    updateProgress(totalWeight - loadedWeight);
                });
        }, 300);
    }
    
    // Animer l'apparition des éléments de la page
    function animatePageElements() {
        // Ajouter la classe fade-in aux éléments principaux
        const elementsToAnimate = [
            '.hero-content',
            '.section-title',
            '.section-content',
            '.gallery-item',
            '.service-card',
            '.testimonial-card'
        ];
        
        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('fade-in');
                // Ajouter un délai progressif pour une apparition en cascade
                setTimeout(() => {
                    el.classList.add('visible');
                }, 100 + (index * 100));
            });
        });
        
        // Initialiser les autres fonctionnalités du site
        // Commenté pour éviter un conflit avec le menu dans index.html
        // initMenuToggle();
        initScrollHeader();
        handleMissingImages();
        
        // Initialiser les animations GSAP si disponibles
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            try {
                gsap.registerPlugin(ScrollTrigger);
                initGalleryAnimation();
            } catch (error) {
                console.error('Erreur lors de l\'initialisation des animations GSAP:', error);
            }
        }
    }
    
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
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');
        const navLinks = document.querySelectorAll('.nav-list a');
        const body = document.body;
        
        if (!menuToggle || !navList) {
            console.warn('Éléments du menu non trouvés');
            return;
        }
        
        // Fonction pour ouvrir le menu
        function openMenu() {
            menuToggle.classList.add('active');
            navList.classList.add('active');
            body.classList.add('menu-open');
            
            // Ajouter aria-expanded pour l'accessibilité
            menuToggle.setAttribute('aria-expanded', 'true');
            
            // Focus trap (empêche le focus de sortir du menu)
            document.addEventListener('keydown', handleKeydown);
        }
        
        // Fonction pour fermer le menu
        function closeMenu() {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Mettre à jour aria-expanded
            menuToggle.setAttribute('aria-expanded', 'false');
            
            // Retirer l'écouteur d'événement
            document.removeEventListener('keydown', handleKeydown);
        }
        
        // Gérer les touches clavier (Echap pour fermer, Tab pour la navigation)
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        }
        
        // Toggle le menu quand on clique sur le bouton hamburger
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (menuToggle.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Fermer le menu quand on clique sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Si nous sommes sur mobile, fermer le menu
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
        
        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(e) {
            if (navList.classList.contains('active') && 
                !navList.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Réinitialiser le menu quand la fenêtre est redimensionnée
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navList.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Initialiser l'état du bouton
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Menu principal');
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
        try {
            if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
                console.warn('GSAP ou ScrollTrigger non chargé. Animation de galerie désactivée.');
                return;
            }
            
            // Sélectionner les éléments de la galerie
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            // Vérifier si des éléments de galerie existent
            if (galleryItems.length === 0) {
                console.log('Aucun élément de galerie trouvé');
                return;
            }
            
            // Animation pour chaque élément de la galerie
            galleryItems.forEach((item, index) => {
                try {
                    // Animation simple sans ScrollTrigger pour éviter les erreurs sur GitHub Pages
                    gsap.from(item, {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        delay: index * 0.1 + 0.2,
                        ease: "power2.out"
                    });
                } catch (error) {
                    console.warn('Erreur lors de l\'animation d\'un élément de galerie:', error);
                    // Assurer la visibilité en cas d'erreur
                    item.style.opacity = 1;
                    item.style.transform = 'translateY(0)';
                }
            });
        } catch (error) {
            console.error('Erreur dans l\'animation de la galerie:', error);
            // Assurer que tous les éléments sont visibles en cas d'erreur
            document.querySelectorAll('.gallery-item').forEach(el => {
                el.style.opacity = 1;
                el.style.transform = 'translateY(0)';
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

    // Améliorer les interactions tactiles sur mobile
    // Détecter si l'appareil est tactile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Ajouter une classe au body pour les styles spécifiques aux appareils tactiles
        document.body.classList.add('is-touch-device');
        
        // Améliorer l'expérience tactile pour les cartes de services professionnels
        const serviceCards = document.querySelectorAll('.pro-service-card');
        serviceCards.forEach(card => {
            // Premier tap pour afficher la description, deuxième tap pour exécuter le lien si présent
            let isTapped = false;
            
            card.addEventListener('touchstart', function(e) {
                if (!isTapped) {
                    e.preventDefault();
                    // Réinitialiser tous les autres éléments
                    serviceCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.remove('tapped');
                        }
                    });
                    
                    // Activer l'état hover via une classe
                    card.classList.add('tapped');
                    isTapped = true;
                    
                    // Réinitialiser après un délai
                    setTimeout(() => {
                        isTapped = false;
                    }, 3000);
                }
            });
        });
        
        // Améliorer l'expérience tactile pour les éléments de galerie
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                this.classList.add('touched');
                
                // Retirer la classe après la fin de l'animation
                setTimeout(() => {
                    this.classList.remove('touched');
                }, 300);
            });
        });
        
        // Amélioration spécifique pour les catégories d'événements
        const eventCategories = document.querySelectorAll('.event-category');
        eventCategories.forEach(category => {
            // Feedback visuel sur touch
            category.addEventListener('touchstart', function(e) {
                // Ajouter une classe temporaire pour indiquer l'état touched
                this.classList.add('category-touched');
                
                // Si c'est juste un tap simple (pas un swipe), empêcher le comportement par défaut
                if (e.touches && e.touches.length === 1) {
                    // Permettre au processus de clic de se produire naturellement
                    // mais ajouter un feedback visuel
                }
                
                // Retirer la classe après un délai
                setTimeout(() => {
                    this.classList.remove('category-touched');
                }, 500);
            });
            
            // Annuler l'état touché si l'utilisateur fait un mouvement de swipe
            category.addEventListener('touchmove', function() {
                this.classList.remove('category-touched');
            });
            
            // S'assurer que l'état touché est annulé si l'utilisateur retire son doigt
            category.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('category-touched');
                }, 200);
            });
            
            // S'assurer que l'état touché est annulé si le toucher est annulé
            category.addEventListener('touchcancel', function() {
                this.classList.remove('category-touched');
            });
        });
    }
    
    // Détecter iOS pour les correctifs spécifiques
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        document.body.classList.add('is-ios');
        
        // Corriger le comportement des inputs sur iOS
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                // Faire défiler légèrement vers le haut pour éviter que le clavier ne cache l'input
                setTimeout(() => {
                    window.scrollBy(0, -100);
                }, 300);
            });
        });
    }

    // Fonctionnalité pour afficher plus d'images dans la galerie
    const showMoreBtn = document.getElementById('gallery-show-more');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (showMoreBtn && galleryGrid) {
        showMoreBtn.addEventListener('click', function() {
            galleryGrid.classList.toggle('show-all');
            
            if (galleryGrid.classList.contains('show-all')) {
                showMoreBtn.querySelector('span').textContent = 'Voir moins';
                showMoreBtn.classList.add('active');
            } else {
                showMoreBtn.querySelector('span').textContent = 'Voir plus';
                showMoreBtn.classList.remove('active');
                
                // Scroll up to gallery top if closing
                const gallerySection = document.getElementById('galerie');
                gallerySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Fonction pour initialiser et actualiser tous les swipers
    function initAllSwipers() {
        // Detect if it's a touch device
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
        
        // Configuration des événements pour les carrousels
        const eventCategories = document.querySelectorAll('.event-category');
        const eventGalleries = document.querySelectorAll('.event-gallery');
        
        // Nettoyer tous les écouteurs existants
        eventCategories.forEach(category => {
            // Créer un clone pour supprimer tous les écouteurs d'événements
            const newCategory = category.cloneNode(true);
            category.parentNode.replaceChild(newCategory, category);
        });
        
        // Ajouter des écouteurs d'événements pour chaque catégorie et ses enfants
        document.querySelectorAll('.event-category').forEach(category => {
            // Fonction pour gérer le clic sur une catégorie
            const handleCategoryClick = function() {
                const categoryName = category.getAttribute('data-category');
                const targetGallery = document.getElementById('gallery-' + categoryName);
                
                // Si la galerie est déjà active, la fermer
                if (targetGallery.classList.contains('active')) {
                    targetGallery.classList.remove('active');
                    return;
                }
                
                // Fermer toutes les galeries
                eventGalleries.forEach(gallery => {
                    gallery.classList.remove('active');
                });
                
                // Ouvrir la galerie sélectionnée
                targetGallery.classList.add('active');
                
                // Effet visuel de feedback pour les appareils tactiles
                if (isTouchDevice) {
                    category.classList.add('touched');
                    setTimeout(() => {
                        category.classList.remove('touched');
                    }, 300);
                }
                
                // Forcer la mise à jour des Swiper après l'affichage
                setTimeout(() => {
                    if (window.swiperInstances) {
                        const swiperKey = `swiper-${categoryName}`;
                        if (window.swiperInstances[swiperKey]) {
                            window.swiperInstances[swiperKey].update();
                        }
                    }
                    
                    // Comportement amélioré pour mobile - scrolling plus fluide et précis
                    if (window.innerWidth <= 768) {
                        // Défiler directement après la catégorie, ce qui est maintenant la galerie
                        const galleryRect = targetGallery.getBoundingClientRect();
                        const isMobile = window.innerWidth <= 768;
                        
                        // Sur mobile, on veut afficher la galerie juste en dessous du haut de l'écran
                        const offset = isMobile ? 
                            galleryRect.top + window.scrollY - 20 : // position plus haute sur mobile
                            galleryRect.top + window.scrollY - (window.innerHeight / 4); // position centrée sur desktop
                        
                        window.scrollTo({
                            top: offset,
                            behavior: 'smooth'
                        });
                    }
                    
                    console.log('Galerie ouverte:', categoryName);
                }, 50);
            };
            
            // Ajouter l'écouteur d'événement principal à la catégorie
            category.addEventListener('click', handleCategoryClick);
            
            // Rendre TOUS les éléments à l'intérieur de la catégorie cliquables individuellement
            // Le titre de la catégorie
            const categoryTitle = category.querySelector('h3');
            if (categoryTitle) {
                categoryTitle.style.cursor = 'pointer'; // Assurer que le curseur indique que c'est cliquable
                categoryTitle.addEventListener('click', function(e) {
                    e.stopPropagation(); // Empêcher la propagation pour éviter un double déclenchement
                    handleCategoryClick();
                });
            }
            
            // Le texte descriptif
            const categoryDesc = category.querySelector('p');
            if (categoryDesc) {
                categoryDesc.style.cursor = 'pointer'; // Assurer que le curseur indique que c'est cliquable
                categoryDesc.addEventListener('click', function(e) {
                    e.stopPropagation(); // Empêcher la propagation pour éviter un double déclenchement
                    handleCategoryClick();
                });
            }
            
            // Tout autre élément potentiellement présent dans la catégorie
            const otherElements = category.querySelectorAll('*:not(h3):not(p)');
            otherElements.forEach(element => {
                if (element.nodeType === 1) { // Uniquement les éléments (pas les nœuds texte)
                    element.style.cursor = 'pointer'; // Assurer que le curseur indique que c'est cliquable
                    element.addEventListener('click', function(e) {
                        e.stopPropagation(); // Empêcher la propagation pour éviter un double déclenchement
                        handleCategoryClick();
                    });
                }
            });
        });
        
        // Empêcher la fermeture lorsqu'on clique sur le swiper
        eventGalleries.forEach(gallery => {
            gallery.addEventListener('click', (e) => {
                // Vérifier si c'est un bouton de navigation
                const isNavButton = e.target.closest('.swiper-button-next, .swiper-button-prev');
                
                // Si c'est un bouton de navigation, ne pas arrêter la propagation pour permettre le clic
                if (isNavButton) {
                    return; // Laisser l'événement se propager
                }
                
                // Sinon, si c'est dans le swiper, empêcher la fermeture de la galerie
                if (e.target.closest('.swiper')) {
                    e.stopPropagation();
                }
            });
        });
        
        // Permettre de fermer les galeries en cliquant ailleurs dans la page
        document.addEventListener('click', function(event) {
            // Si on clique à l'extérieur d'une galerie et d'une catégorie
            if (!event.target.closest('.event-gallery') && 
                !event.target.closest('.event-category')) {
                // Fermer toutes les galeries
                eventGalleries.forEach(gallery => {
                    gallery.classList.remove('active');
                });
            }
        });
        
        // Vérifier si les instances précédentes doivent être détruites
        document.addEventListener('beforeunload', function() {
            const swiperInstances = ['swiperMariages', 'swiperDeuil', 'swiperFestivites'];
            
            swiperInstances.forEach(instance => {
                if (window[instance]) {
                    try {
                        window[instance].destroy(true, true);
                        console.log(`Instance ${instance} détruite.`);
                    } catch (error) {
                        console.warn(`Impossible de détruire l'instance ${instance}:`, error);
                    }
                }
            });
            
            /* Désactivation de l'initialisation des Swipers ici, car maintenant gérée directement dans index.html */
            
            console.log('Les initialisations des Swipers sont maintenant gérées directement dans index.html');
        });
    }

    // Fonction pour initialiser les attributs d'accessibilité du menu
    function initMenuAccessibility() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        if (!menuToggle || !navList) return;
        
        // Ajouter les attributs ARIA au bouton hamburger
        menuToggle.setAttribute('role', 'button');
        menuToggle.setAttribute('aria-controls', 'main-nav');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Menu principal');
        
        // Ajouter les attributs ARIA à la navigation
        navList.setAttribute('id', 'main-nav');
        navList.setAttribute('role', 'navigation');
        navList.setAttribute('aria-label', 'Menu principal');
        
        // Ajouter l'attribut tabindex aux liens de navigation
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.setAttribute('tabindex', '0');
        });
    }

    // Gestion du formulaire de contact compact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formGroups = contactForm.querySelectorAll('.form-group');
        
        // Initialiser tous les champs en mode réduit
        formGroups.forEach(group => {
            group.classList.add('collapsed');
            
            const input = group.querySelector('input, textarea');
            if (input) {
                // Ajouter un gestionnaire d'événements pour le focus
                input.addEventListener('focus', function() {
                    // Réduire tous les autres champs
                    formGroups.forEach(otherGroup => {
                        if (otherGroup !== group) {
                            otherGroup.classList.add('collapsed');
                            otherGroup.classList.remove('expanded');
                        }
                    });
                    
                    // Développer le champ actuel
                    group.classList.remove('collapsed');
                    group.classList.add('expanded');
                });
                
                // Ajouter un gestionnaire d'événements pour le blur
                input.addEventListener('blur', function() {
                    // Si le champ est vide, le réduire
                    if (!input.value.trim()) {
                        group.classList.add('collapsed');
                        group.classList.remove('expanded');
                    }
                });
            }
        });
    }
}); 