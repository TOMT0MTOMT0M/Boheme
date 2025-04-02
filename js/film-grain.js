/**
 * Bohème Fleurs - Contrôleur d'effet de grain de film
 * Ce script permet d'initialiser et de contrôler l'effet de grain de film sur le site
 */

(function() {
    // Configuration par défaut
    const defaultConfig = {
        opacity: 0.03,
        blendMode: 'soft-light',
        animationSpeed: '12s',
        animationScale: '0.5%',
        density: 0.65
    };
    
    // Variables internes
    let isEnabled = true;
    let currentConfig = { ...defaultConfig };
    
    // Initialisation de l'effet de grain
    function initFilmGrain() {
        // S'assurer que l'effet est activé par défaut
        updateGrainEffect();
        
        // Ajouter un écouteur d'événements pour les préférences de mouvement réduit
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion.addEventListener('change', handleReducedMotion);
        handleReducedMotion(prefersReducedMotion);
        
        // Si on est en mode développement, ajouter les contrôles de debug
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            initDebugControls();
        }
    }
    
    // Gestion des préférences de mouvement réduit
    function handleReducedMotion(mediaQuery) {
        if (mediaQuery.matches) {
            document.documentElement.style.setProperty('--grain-animation-speed', '0s');
        } else {
            document.documentElement.style.setProperty('--grain-animation-speed', currentConfig.animationSpeed);
        }
    }
    
    // Activation/désactivation de l'effet
    function toggleGrainEffect(enable = null) {
        if (enable !== null) {
            isEnabled = enable;
        } else {
            isEnabled = !isEnabled;
        }
        
        if (isEnabled) {
            document.documentElement.style.setProperty('--grain-opacity', currentConfig.opacity);
        } else {
            document.documentElement.style.setProperty('--grain-opacity', '0');
        }
        
        return isEnabled;
    }
    
    // Mise à jour des paramètres de l'effet
    function updateGrainEffect(config = {}) {
        // Mettre à jour la configuration avec les nouveaux paramètres
        Object.assign(currentConfig, config);
        
        // Appliquer les paramètres aux variables CSS
        document.documentElement.style.setProperty('--grain-opacity', currentConfig.opacity);
        document.documentElement.style.setProperty('--grain-blend-mode', currentConfig.blendMode);
        document.documentElement.style.setProperty('--grain-animation-speed', currentConfig.animationSpeed);
        document.documentElement.style.setProperty('--grain-animation-scale', currentConfig.animationScale);
        
        // Mettre à jour le SVG avec la nouvelle densité
        // Note: Cela nécessiterait de recréer l'élément SVG, ce qui n'est pas implémenté ici
    }
    
    // Réinitialiser aux paramètres par défaut
    function resetGrainEffect() {
        updateGrainEffect(defaultConfig);
    }
    
    // Initialiser les contrôles de debug (uniquement en développement)
    function initDebugControls() {
        // Créer un panneau de contrôle
        const controlPanel = document.createElement('div');
        controlPanel.id = 'grain-control-panel';
        controlPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            width: 250px;
            transform: translateX(260px);
            transition: transform 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        `;
        
        // Bouton toggle
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Film Grain Controls';
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--color-gold);
            color: var(--color-dark);
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-weight: bold;
        `;
        
        // Contenu du panneau
        controlPanel.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 10px;">Film Grain Controls</h3>
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="grain-enabled" ${isEnabled ? 'checked' : ''}>
                    Enable Film Grain
                </label>
            </div>
            <div style="margin-bottom: 10px;">
                <label>Opacity: <span id="opacity-value">${currentConfig.opacity}</span></label>
                <input type="range" id="grain-opacity" min="0" max="0.1" step="0.005" value="${currentConfig.opacity}">
            </div>
            <div style="margin-bottom: 10px;">
                <label>Animation Scale: <span id="scale-value">${currentConfig.animationScale}</span></label>
                <input type="range" id="grain-scale" min="0.1" max="1" step="0.1" value="${parseFloat(currentConfig.animationScale)}">
            </div>
            <div style="margin-bottom: 10px;">
                <label>Animation Speed: <span id="speed-value">${currentConfig.animationSpeed}</span></label>
                <input type="range" id="grain-speed" min="5" max="20" step="1" value="${parseInt(currentConfig.animationSpeed)}">
            </div>
            <div style="margin-bottom: 10px;">
                <label>Blend Mode:</label>
                <select id="grain-blend">
                    <option value="soft-light" ${currentConfig.blendMode === 'soft-light' ? 'selected' : ''}>Soft Light</option>
                    <option value="overlay" ${currentConfig.blendMode === 'overlay' ? 'selected' : ''}>Overlay</option>
                    <option value="screen" ${currentConfig.blendMode === 'screen' ? 'selected' : ''}>Screen</option>
                    <option value="multiply" ${currentConfig.blendMode === 'multiply' ? 'selected' : ''}>Multiply</option>
                </select>
            </div>
            <button id="reset-grain" style="background-color: var(--color-gold); color: var(--color-dark); border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Reset to Default</button>
        `;
        
        // Ajouter le panneau et le bouton au document
        document.body.appendChild(controlPanel);
        document.body.appendChild(toggleButton);
        
        // Gestion de l'affichage du panneau
        let isPanelVisible = false;
        toggleButton.addEventListener('click', () => {
            isPanelVisible = !isPanelVisible;
            controlPanel.style.transform = isPanelVisible ? 'translateX(0)' : 'translateX(260px)';
        });
        
        // Récupérer les références aux contrôles
        const enabledCheckbox = document.getElementById('grain-enabled');
        const opacitySlider = document.getElementById('grain-opacity');
        const opacityValue = document.getElementById('opacity-value');
        const scaleSlider = document.getElementById('grain-scale');
        const scaleValue = document.getElementById('scale-value');
        const speedSlider = document.getElementById('grain-speed');
        const speedValue = document.getElementById('speed-value');
        const blendSelect = document.getElementById('grain-blend');
        const resetButton = document.getElementById('reset-grain');
        
        // Ajouter les écouteurs d'événements
        enabledCheckbox.addEventListener('change', () => {
            toggleGrainEffect(enabledCheckbox.checked);
        });
        
        opacitySlider.addEventListener('input', () => {
            const value = opacitySlider.value;
            opacityValue.textContent = value;
            updateGrainEffect({ opacity: value });
        });
        
        scaleSlider.addEventListener('input', () => {
            const value = scaleSlider.value + '%';
            scaleValue.textContent = value;
            updateGrainEffect({ animationScale: value });
        });
        
        speedSlider.addEventListener('input', () => {
            const value = speedSlider.value + 's';
            speedValue.textContent = value;
            updateGrainEffect({ animationSpeed: value });
        });
        
        blendSelect.addEventListener('change', () => {
            updateGrainEffect({ blendMode: blendSelect.value });
        });
        
        resetButton.addEventListener('click', () => {
            resetGrainEffect();
            opacitySlider.value = defaultConfig.opacity;
            opacityValue.textContent = defaultConfig.opacity;
            scaleSlider.value = parseFloat(defaultConfig.animationScale);
            scaleValue.textContent = defaultConfig.animationScale;
            speedSlider.value = parseInt(defaultConfig.animationSpeed);
            speedValue.textContent = defaultConfig.animationSpeed;
            blendSelect.value = defaultConfig.blendMode;
        });
    }
    
    // Exposer l'API publique
    window.filmGrain = {
        init: initFilmGrain,
        toggle: toggleGrainEffect,
        update: updateGrainEffect,
        reset: resetGrainEffect
    };
    
    // Initialiser automatiquement si le DOM est déjà chargé, sinon attendre
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initFilmGrain);
    } else {
        initFilmGrain();
    }
})(); 