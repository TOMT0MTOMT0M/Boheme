/**
 * Boheme Fleurs Lightbox - Custom image viewer
 * Features:
 * - Click to open image in near fullscreen view
 * - Elegant magnifying effect that follows cursor
 * - Scroll wheel to adjust zoom level
 * - Smooth animations and transitions
 * - Parallax zoom effect on hover without opening lightbox
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
    
    // Create magnifier glass
    const magnifier = document.createElement('div');
    magnifier.className = 'boheme-magnifier-glass';
    magnifier.style.display = 'none';
    
    // Create zoom info display
    const zoomInfo = document.createElement('div');
    zoomInfo.className = 'boheme-zoom-info';
    zoomInfo.style.position = 'absolute';
    zoomInfo.style.bottom = '20px';
    zoomInfo.style.right = '20px';
    zoomInfo.style.background = 'rgba(0, 0, 0, 0.5)';
    zoomInfo.style.color = 'white';
    zoomInfo.style.padding = '5px 10px';
    zoomInfo.style.borderRadius = '3px';
    zoomInfo.style.fontSize = '14px';
    zoomInfo.style.opacity = '0';
    zoomInfo.style.transition = 'opacity 0.3s ease';
    
    // Create instruction message
    const instructions = document.createElement('div');
    instructions.className = 'boheme-instructions';
    instructions.style.position = 'absolute';
    instructions.style.top = '20px';
    instructions.style.left = '50%';
    instructions.style.transform = 'translateX(-50%)';
    instructions.style.background = 'rgba(0, 0, 0, 0.5)';
    instructions.style.color = 'white';
    instructions.style.padding = '8px 15px';
    instructions.style.borderRadius = '20px';
    instructions.style.fontSize = '14px';
    instructions.style.opacity = '0';
    instructions.style.transition = 'opacity 0.5s ease';
    instructions.style.zIndex = '101';
    instructions.style.pointerEvents = 'none';
    instructions.textContent = 'Survolez l\'image pour zoomer • Molette pour ajuster le niveau de zoom';
    
    // Create caption element
    const caption = document.createElement('div');
    caption.className = 'boheme-lightbox-caption';
    
    // Assemble the lightbox
    lightboxContent.appendChild(lightboxImage);
    lightboxContent.appendChild(caption);
    lightboxContent.appendChild(magnifier);
    lightboxContent.appendChild(zoomInfo);
    lightboxContent.appendChild(instructions);
    lightbox.appendChild(closeButton);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
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
    
    // Add parallax and lightbox functionality to each image
    images.forEach(img => {
        // Apply parallax hover effect
        applyParallaxEffect(img);
        
        // Make the image container clickable for lightbox
        makeClickable(img);
    });
    
    // Apply parallax zoom effect on hover
    function applyParallaxEffect(img) {
        // Create a wrapper for the image if it doesn't already have one
        let wrapper = img.parentElement;
        
        // Make sure the wrapper has proper styling for the effect
        if (!wrapper.classList.contains('boheme-parallax-wrapper')) {
            // If the current parent isn't our wrapper, create one
            if (wrapper.tagName !== 'DIV' || 
                !getComputedStyle(wrapper).position.includes('relative')) {
                
                const originalWrapper = wrapper;
                
                // Create new wrapper
                wrapper = document.createElement('div');
                wrapper.className = 'boheme-parallax-wrapper';
                wrapper.style.overflow = 'hidden';
                wrapper.style.position = 'relative';
                
                // Set wrapper dimensions to match image
                const imgStyles = getComputedStyle(img);
                if (imgStyles.display === 'block') {
                    wrapper.style.width = '100%';
                    wrapper.style.height = 'auto';
                } else {
                    wrapper.style.width = img.offsetWidth + 'px';
                    wrapper.style.height = img.offsetHeight + 'px';
                }
                
                // Insert the wrapper
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            } else {
                // Just add our class to the existing wrapper
                wrapper.classList.add('boheme-parallax-wrapper');
                wrapper.style.overflow = 'hidden';
                wrapper.style.position = 'relative';
            }
        }
        
        // Style the image for parallax effect - Start zoomed in to allow dezoom effect
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.transition = 'transform 0.2s ease-out';
        img.style.transform = 'scale(1.1)'; // Reduced initial zoom (was 1.2)
        
        // Variables to control zoom effect
        const normalScale = 1.1; // Reduced initial zoomed-in state (was 1.2)
        const dezoomLevel = 1.02; // Less dezoom effect (was 1.0)
        let isHovering = false;
        let mouseX = 0;
        let mouseY = 0;
        let imgCenterX = 0;
        let imgCenterY = 0;
        
        // Add event listeners
        wrapper.addEventListener('mouseenter', function() {
            isHovering = true;
            // Get the center coordinates of the image relative to viewport
            const rect = wrapper.getBoundingClientRect();
            imgCenterX = rect.left + rect.width / 2;
            imgCenterY = rect.top + rect.height / 2;
            
            // Apply initial dezoom effect
            img.style.transform = `scale(${dezoomLevel})`;
        });
        
        wrapper.addEventListener('mousemove', function(e) {
            if (!isHovering) return;
            
            // Get the mouse coordinates
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Calculate the distance from center as a percentage of width/height
            const moveX = (mouseX - imgCenterX) / (wrapper.offsetWidth / 2) * 8; // Reduced sensitivity (was 15)
            const moveY = (mouseY - imgCenterY) / (wrapper.offsetHeight / 2) * 8; // Reduced sensitivity (was 15)
            
            // Apply the parallax effect - move in SAME direction as mouse for dezoom effect
            img.style.transform = `scale(${dezoomLevel}) translate(${moveX}px, ${moveY}px)`;
        });
        
        wrapper.addEventListener('mouseleave', function() {
            isHovering = false;
            // Reset the image to initial zoomed state
            img.style.transform = `scale(${normalScale}) translate(0, 0)`;
        });
    }
    
    // Make image clickable for lightbox
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
        
        // Show instructions briefly
        instructions.style.opacity = '1';
        setTimeout(() => {
            instructions.style.opacity = '0';
        }, 3000);
        
        // Setup magnifier
        setupMagnifier();
    }
    
    // Setup magnifier glass functionality
    function setupMagnifier() {
        // Configure magnifier size and zoom
        let zoomFactor = 2.5; // Initial zoom level
        const minZoom = 1.5;
        const maxZoom = 5;
        const zoomStep = 0.3;
        const magnifierSize = 150; // Size in pixels
        
        // Configure magnifier appearance
        magnifier.style.width = magnifierSize + 'px';
        magnifier.style.height = magnifierSize + 'px';
        magnifier.style.borderRadius = '50%';
        magnifier.style.border = '3px solid rgba(255, 255, 255, 0.5)';
        magnifier.style.position = 'absolute';
        magnifier.style.overflow = 'hidden';
        magnifier.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        magnifier.style.cursor = 'none';
        magnifier.style.transformOrigin = 'center center';
        magnifier.style.zIndex = '100';
        magnifier.style.pointerEvents = 'none'; // Prevents interference with mousemove
        magnifier.style.transition = 'transform 0.1s ease-out, opacity 0.2s ease';
        magnifier.style.opacity = '0';
        
        // Variables to track mouse position
        let mouseX = 0;
        let mouseY = 0;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let isAnimating = false;
        
        // Add event listeners for magnifier movement
        lightboxImage.addEventListener('mousemove', moveMagnifier);
        lightboxImage.addEventListener('mouseenter', function() {
            magnifier.style.display = 'block';
            setTimeout(() => {
                magnifier.style.opacity = '1';
            }, 10);
        });
        lightboxImage.addEventListener('mouseleave', function() {
            magnifier.style.opacity = '0';
            setTimeout(() => {
                magnifier.style.display = 'none';
            }, 200);
        });
        
        // Add wheel event for zoom control
        lightboxImage.addEventListener('wheel', function(e) {
            e.preventDefault(); // Prevent page scrolling
            
            // Adjust zoom level based on wheel direction
            const oldZoom = zoomFactor;
            if (e.deltaY < 0) {
                // Zoom in
                zoomFactor = Math.min(maxZoom, zoomFactor + zoomStep);
            } else {
                // Zoom out
                zoomFactor = Math.max(minZoom, zoomFactor - zoomStep);
            }
            
            // Add a subtle pop animation when zooming
            if (oldZoom !== zoomFactor) {
                magnifier.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    magnifier.style.transform = 'scale(1)';
                }, 100);
            }
            
            // Update magnifier with new zoom level
            updateMagnifier();
            
            // Show zoom info
            zoomInfo.textContent = `Zoom: ${zoomFactor.toFixed(1)}x`;
            zoomInfo.style.opacity = '1';
            
            // Hide zoom info after delay
            clearTimeout(zoomInfo.timeout);
            zoomInfo.timeout = setTimeout(() => {
                zoomInfo.style.opacity = '0';
            }, 1500);
        });
        
        // Function to move magnifier with mouse
        function moveMagnifier(e) {
            // Get cursor position relative to image
            const rect = lightboxImage.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            
            // Apply smooth movement using requestAnimationFrame
            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(smoothMovement);
            }
        }
        
        // Smooth movement animation
        function smoothMovement() {
            // Calculate smoother position with easing
            lastMouseX = lastMouseX + (mouseX - lastMouseX) * 0.3;
            lastMouseY = lastMouseY + (mouseY - lastMouseY) * 0.3;
            
            updateMagnifier(lastMouseX, lastMouseY);
            
            // Continue animation if cursor is still moving
            if (Math.abs(lastMouseX - mouseX) > 0.1 || Math.abs(lastMouseY - mouseY) > 0.1) {
                requestAnimationFrame(smoothMovement);
            } else {
                isAnimating = false;
            }
        }
        
        // Function to update magnifier position and zoom
        function updateMagnifier(x = mouseX, y = mouseY) {
            // Set magnifier position - center on cursor
            magnifier.style.left = (x - magnifierSize / 2) + 'px';
            magnifier.style.top = (y - magnifierSize / 2) + 'px';
            
            // Calculate background position
            const bgX = x * zoomFactor - (magnifierSize / 2);
            const bgY = y * zoomFactor - (magnifierSize / 2);
            
            // Set background image and position for magnifier
            magnifier.style.backgroundImage = `url('${lightboxImage.src}')`;
            magnifier.style.backgroundSize = (lightboxImage.offsetWidth * zoomFactor) + 'px ' + 
                                           (lightboxImage.offsetHeight * zoomFactor) + 'px';
            magnifier.style.backgroundPosition = `-${bgX}px -${bgY}px`;
            magnifier.style.backgroundRepeat = 'no-repeat';
        }
    }
    
    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        
        // Reset image src and hide elements
        setTimeout(() => {
            lightboxImage.src = '';
            
            // Hide magnifier and zoom info
            magnifier.style.display = 'none';
            zoomInfo.style.opacity = '0';
            instructions.style.opacity = '0';
            
            // No need to remove event listeners as they're set up each time
            // the lightbox is opened in the setupMagnifier function
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