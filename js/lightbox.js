/**
 * Boheme Fleurs Lightbox - Custom image viewer
 * Features:
 * - Click to open image in near fullscreen view
 * - Hover for 3+ seconds to auto-open
 * - Blurred grainy background
 * - Click outside or X to close
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.className = 'boheme-lightbox';
    
    // Create content container
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'boheme-lightbox-content';
    
    // Create close button
    const closeButton = document.createElement('div');
    closeButton.className = 'boheme-lightbox-close';
    
    // Create image element
    const lightboxImage = document.createElement('img');
    
    // Create caption element
    const caption = document.createElement('div');
    caption.className = 'boheme-lightbox-caption';
    
    // Assemble the lightbox
    lightboxContent.appendChild(lightboxImage);
    lightboxContent.appendChild(caption);
    lightbox.appendChild(closeButton);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
    // Store hover timers for images
    const hoverTimers = new Map();
    
    // Target all images that should have lightbox functionality
    const imageSelectors = [
        '.gallery-item img',
        '.carousel-item img', 
        '.service-image img',
        '.pro-service img',
        '.testimonial-image img'
    ];
    
    // Find all images matching our selectors
    const images = document.querySelectorAll(imageSelectors.join(', '));
    
    // Add click and hover event listeners to each image
    images.forEach(img => {
        // Make the image container clickable
        makeClickable(img);
        
        // Add hover functionality
        img.addEventListener('mouseenter', function() {
            // Start a timer when mouse enters
            const timer = setTimeout(() => {
                openLightbox(img);
            }, 3000); // 3 seconds hover to open
            
            hoverTimers.set(img, timer);
        });
        
        img.addEventListener('mouseleave', function() {
            // Cancel timer when mouse leaves
            if (hoverTimers.has(img)) {
                clearTimeout(hoverTimers.get(img));
                hoverTimers.delete(img);
            }
        });
    });
    
    // Make image clickable
    function makeClickable(img) {
        // Add cursor pointer style
        img.style.cursor = 'pointer';
        
        // Add click event to open lightbox
        img.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(img);
        });
        
        // If image is inside a link, prevent default and open lightbox instead
        const parentLink = findParentLink(img);
        if (parentLink) {
            parentLink.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(img);
            });
        }
    }
    
    // Find parent link if exists
    function findParentLink(element) {
        let current = element;
        while (current !== null && current.tagName !== 'A') {
            current = current.parentElement;
        }
        return current;
    }
    
    // Open lightbox with specified image
    function openLightbox(img) {
        // Set the image source
        lightboxImage.src = img.src;
        
        // Set alt text as caption if available
        caption.textContent = img.alt || '';
        
        // Fade in the lightbox
        lightbox.classList.add('active');
        
        // Prevent scrolling on body
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        
        // Reset image src to reduce memory usage
        setTimeout(() => {
            lightboxImage.src = '';
        }, 300); // Wait for fade out animation
        
        // Restore scrolling
        document.body.style.overflow = '';
    }
    
    // Close on close button click
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        closeLightbox();
    });
    
    // Close on click outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}); 