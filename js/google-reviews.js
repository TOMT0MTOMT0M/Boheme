// Configuration de l'API Google Places
const GOOGLE_PLACE_ID = 'ChIJq6put__q9EcREH6B3VlZUrM';
const GOOGLE_API_KEY = 'AIzaSyCTJ-ttYO8KkKmvDGAFFpjRwiBJf9ciXrA';

// Variable pour stocker l'instance Swiper
let reviewsSwiper;

// Fonction pour initialiser l'API Google Places
async function initGooglePlaces() {
    try {
        // Afficher un message de chargement
        showLoadingMessage();
        
        // Importer la bibliothèque places de manière asynchrone
        const { Place } = await google.maps.importLibrary("places");
        
        // Utiliser la nouvelle classe Place pour récupérer les avis
        loadPlaceDetailsWithNewAPI(Place);
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'API Google Places:', error);
        showErrorMessage("Impossible de charger l'API Google Places. Veuillez activer 'Places API (New)' dans la console Google Cloud.");
    }
}

// Fonction pour afficher un message de chargement
function showLoadingMessage() {
    const reviewsContainer = document.getElementById('google-reviews-container');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '<div class="swiper-slide"><div class="loading-message">Chargement des avis...</div></div>';
    }
}

// Fonction pour afficher un message d'erreur
function showErrorMessage(message) {
    const reviewsContainer = document.getElementById('google-reviews-container');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = `<div class="swiper-slide"><div class="error-message">${message}</div></div>`;
        // Initialiser Swiper même avec un message d'erreur pour que l'interface reste cohérente
        initReviewsSwiper();
    }
}

// Fonction pour initialiser le carousel Swiper
function initReviewsSwiper() {
    // Détruire l'instance précédente si elle existe
    if (reviewsSwiper) {
        reviewsSwiper.destroy();
    }
    
    // Initialiser une nouvelle instance Swiper
    reviewsSwiper = new Swiper('.swiper-reviews', {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: false,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        direction: 'horizontal',
        // Ajuster pour une meilleure transition entre mobile et desktop
        breakpoints: {
            // Pour les très petits écrans (mobiles)
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            // Pour les tablettes en portrait
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            // Pour les tablettes en paysage et petits laptops
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            // Pour les écrans d'ordinateur
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
        // Forcer la mise à jour lors des changements d'orientation
        on: {
            resize: function() {
                this.update();
            }
        }
    });
}

// Fonction pour charger les détails du lieu avec la nouvelle API
async function loadPlaceDetailsWithNewAPI(Place) {
    try {
        // Créer une nouvelle instance Place avec l'ID du lieu
        const place = new Place({
            id: GOOGLE_PLACE_ID,
        });

        // Récupérer les détails incluant les avis
        // Utiliser uniquement des champs disponibles dans la nouvelle API
        await place.fetchFields({
            fields: ["reviews", "rating"]
        });

        // Vérifier si des avis sont disponibles
        if (place.reviews && place.reviews.length > 0) {
            displayGoogleReviews(place.reviews);
        } else {
            showErrorMessage('Aucun avis trouvé pour ce lieu');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des avis Google:', error);
        showErrorMessage('Erreur lors de la récupération des avis Google. Assurez-vous que "Places API (New)" est activée dans la console Google Cloud.');
    }
}

// Fonction pour afficher les avis dans le DOM
function displayGoogleReviews(reviews) {
    const reviewsContainer = document.getElementById('google-reviews-container');
    if (!reviewsContainer) {
        console.error('Container de témoignages non trouvé');
        return;
    }

    // Vider le conteneur (supprimer le message de chargement)
    reviewsContainer.innerHTML = '';

    // Limiter à 10 avis les plus récents
    const recentReviews = reviews.slice(0, 10);

    if (recentReviews.length === 0) {
        showErrorMessage('Aucun avis à afficher');
        return;
    }

    // Déterminer la longueur maximale du texte en fonction de la taille de l'écran
    let maxTextLength = 150;
    if (window.innerWidth <= 768) {
        maxTextLength = 100; // Réduire sur mobile
    }

    recentReviews.forEach(review => {
        // Créer un slide Swiper pour chaque avis
        const testimonialSlide = document.createElement('div');
        testimonialSlide.classList.add('swiper-slide');
        
        const testimonialCard = document.createElement('div');
        testimonialCard.classList.add('testimonial-card', 'reveal-element');
        
        // Créer le contenu du témoignage
        const content = document.createElement('div');
        content.classList.add('testimonial-content');
        
        // Ajouter le texte du témoignage avec longueur adaptative
        const text = document.createElement('p');
        text.classList.add('testimonial-text');
        const reviewText = review.text.length > maxTextLength ? review.text.substring(0, maxTextLength) + '...' : review.text;
        text.textContent = `"${reviewText}"`;
        
        // Ajouter le nom de l'auteur uniquement
        const author = document.createElement('p');
        author.classList.add('testimonial-author');
        // Utiliser authorAttribution.displayName au lieu de author_name avec la nouvelle API
        author.textContent = review.authorAttribution ? review.authorAttribution.displayName : "Anonyme";
        
        // Assembler les éléments
        content.appendChild(text);
        content.appendChild(author);
        testimonialCard.appendChild(content);
        testimonialSlide.appendChild(testimonialCard);
        
        reviewsContainer.appendChild(testimonialSlide);
    });
    
    // Initialiser le carousel Swiper une fois que tous les avis sont ajoutés
    initReviewsSwiper();
    
    // Ajouter un écouteur d'événement pour la réinitialisation lors des changements d'orientation
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            if (reviewsSwiper) {
                reviewsSwiper.update();
            }
        }, 300); // Petit délai pour laisser le temps au navigateur de se réorienter
    });
}

// Initialiser les avis Google au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Charger les scripts Google Maps avec la nouvelle approche
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&loading=async&callback=initGooglePlaces`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
});

// Exposer la fonction d'initialisation globalement pour le callback
window.initGooglePlaces = initGooglePlaces; 