// Script pour synchroniser les données de l'administration avec le site principal
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour appliquer les textes stockés dans le localStorage au site
    function applyStoredTexts() {
        // Récupérer les textes depuis le localStorage
        const storedTexts = JSON.parse(localStorage.getItem('bohemeTexts'));
        
        // Si aucun texte n'est stocké, ne rien faire
        if (!storedTexts) return;
        
        // Appliquer les textes de l'entête et la page d'accueil
        if (storedTexts.hero) {
            // Mettre à jour le titre du site
            updateTextContent('.site-title', storedTexts.hero.siteTitle?.value);
            
            // Mettre à jour le slogan
            updateTextContent('.site-tagline', storedTexts.hero.siteTagline?.value);
            
            // Mettre à jour les textes de la section héro
            updateTextContent('.hero-title', storedTexts.hero.heroTitle?.value);
            updateTextContent('.hero-subtitle', storedTexts.hero.heroSubtitle?.value);
            
            // Mettre à jour le texte du bouton CTA
            const heroCtaBtn = document.querySelector('.hero-cta');
            if (heroCtaBtn && storedTexts.hero.heroCta?.value) {
                heroCtaBtn.textContent = storedTexts.hero.heroCta.value;
            }
        }
        
        // Appliquer les textes de la section "À propos"
        if (storedTexts.about) {
            updateTextContent('.about-title', storedTexts.about.aboutTitle?.value);
            updateTextContent('.about-content', storedTexts.about.aboutContent?.value);
            updateTextContent('.about-philosophy', storedTexts.about.aboutPhilosophy?.value);
        }
        
        // Appliquer les textes de la section "Services"
        if (storedTexts.services) {
            updateTextContent('.services-title', storedTexts.services.servicesTitle?.value);
            updateTextContent('.services-intro', storedTexts.services.servicesIntro?.value);
            
            // Mettre à jour les textes des services
            const serviceCards = document.querySelectorAll('.service-card');
            if (serviceCards.length >= 3) {
                // Premier service
                updateTextContent('.service-card:nth-child(1) .service-title', storedTexts.services.service1Title?.value);
                updateTextContent('.service-card:nth-child(1) .service-description', storedTexts.services.service1Desc?.value);
                
                // Deuxième service
                updateTextContent('.service-card:nth-child(2) .service-title', storedTexts.services.service2Title?.value);
                updateTextContent('.service-card:nth-child(2) .service-description', storedTexts.services.service2Desc?.value);
                
                // Troisième service
                updateTextContent('.service-card:nth-child(3) .service-title', storedTexts.services.service3Title?.value);
                updateTextContent('.service-card:nth-child(3) .service-description', storedTexts.services.service3Desc?.value);
            }
        }
        
        // Appliquer les textes de la section "Contact"
        if (storedTexts.contact) {
            updateTextContent('.contact-title', storedTexts.contact.contactTitle?.value);
            updateTextContent('.contact-intro', storedTexts.contact.contactIntro?.value);
            updateTextContent('.contact-address', storedTexts.contact.contactAddress?.value);
            updateTextContent('.contact-phone', storedTexts.contact.contactPhone?.value);
            updateTextContent('.contact-email', storedTexts.contact.contactEmail?.value);
            updateTextContent('.contact-hours', storedTexts.contact.contactHours?.value);
        }
        
        // Appliquer les textes du pied de page
        if (storedTexts.footer) {
            updateTextContent('.footer-copyright', storedTexts.footer.footerCopyright?.value);
            updateTextContent('.footer-tagline', storedTexts.footer.footerTagline?.value);
            
            // Mettre à jour les liens sociaux
            updateSocialLink('facebook', storedTexts.footer.footerSocialFacebook?.value);
            updateSocialLink('instagram', storedTexts.footer.footerSocialInstagram?.value);
            updateSocialLink('pinterest', storedTexts.footer.footerSocialPinterest?.value);
        }
    }
    
    // Fonction pour appliquer les photos stockées dans le localStorage au site
    function applyStoredPhotos() {
        // Récupérer les photos depuis le localStorage
        const storedPhotos = JSON.parse(localStorage.getItem('bohemePhotos'));
        
        // Si aucune photo n'est stockée, ne rien faire
        if (!storedPhotos) return;
        
        // Appliquer les photos à la page d'accueil
        if (storedPhotos.hero) {
            const activeHeroPhotos = storedPhotos.hero.filter(photo => photo.isActive);
            if (activeHeroPhotos.length > 0) {
                // Utiliser la première photo active pour l'arrière-plan du héros
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) {
                    heroSection.style.backgroundImage = `url(${activeHeroPhotos[0].url})`;
                }
            }
        }
        
        // Appliquer les photos à la section "À propos"
        if (storedPhotos.about) {
            const activeAboutPhotos = storedPhotos.about.filter(photo => photo.isActive);
            if (activeAboutPhotos.length > 0) {
                // Utiliser la première photo active pour l'image "à propos"
                const aboutImage = document.querySelector('.about-image img');
                if (aboutImage) {
                    aboutImage.src = activeAboutPhotos[0].url;
                    aboutImage.alt = activeAboutPhotos[0].altText;
                }
            }
        }
        
        // Appliquer les photos à la section "Services"
        if (storedPhotos.services) {
            const activeServicePhotos = storedPhotos.services.filter(photo => photo.isActive);
            
            // Mettre à jour les images des services
            const serviceCards = document.querySelectorAll('.service-card');
            serviceCards.forEach((card, index) => {
                // Vérifier s'il y a une photo pour ce service
                if (activeServicePhotos[index]) {
                    const serviceImage = card.querySelector('img');
                    if (serviceImage) {
                        serviceImage.src = activeServicePhotos[index].url;
                        serviceImage.alt = activeServicePhotos[index].altText;
                    }
                }
            });
        }
        
        // Appliquer les photos à la galerie
        if (storedPhotos.gallery) {
            const activeGalleryPhotos = storedPhotos.gallery.filter(photo => photo.isActive);
            const galleryContainer = document.querySelector('.gallery-container');
            
            // S'il y a un conteneur de galerie et des photos à afficher
            if (galleryContainer && activeGalleryPhotos.length > 0) {
                // Vider la galerie existante
                galleryContainer.innerHTML = '';
                
                // Ajouter chaque photo à la galerie
                activeGalleryPhotos.forEach(photo => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    
                    galleryItem.innerHTML = `
                        <img src="${photo.url}" alt="${photo.altText}">
                        <div class="gallery-item-overlay">
                            <h3>${photo.title}</h3>
                            <p>${photo.description}</p>
                        </div>
                    `;
                    
                    galleryContainer.appendChild(galleryItem);
                });
            }
        }
    }
    
    // Fonction utilitaire pour mettre à jour le contenu texte d'un élément
    function updateTextContent(selector, text) {
        if (!text) return;
        
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }
    
    // Fonction utilitaire pour mettre à jour un lien social
    function updateSocialLink(platform, url) {
        if (!url) return;
        
        const socialLink = document.querySelector(`.social-icon.${platform}`);
        if (socialLink) {
            socialLink.href = url;
        }
    }
    
    // Appliquer les textes et photos au chargement de la page
    applyStoredTexts();
    applyStoredPhotos();
}); 