// Script de gestion des photos pour l'administration
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des variables
    const photoGallery = document.getElementById('photoGallery');
    const photoForm = document.getElementById('photoForm');
    const photoFormModal = document.getElementById('photoFormModal');
    const photoModalTitle = document.getElementById('photoModalTitle');
    const addPhotoBtn = document.getElementById('addPhotoBtn');
    const cancelPhotoBtn = document.getElementById('cancelPhotoBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const photoPreview = document.getElementById('photoPreview');
    const photoFile = document.getElementById('photoFile');
    const triggerFileUpload = document.getElementById('triggerFileUpload');
    const sectionTabs = document.querySelectorAll('.tab-btn');
    
    // Variable pour stocker le fichier image sélectionné
    let selectedFile = null;
    // Variable pour stocker l'URL de l'image existante (en cas de modification)
    let existingImageUrl = null;
    // Section active courante
    let currentSection = 'hero';
    
    // Chargement des photos depuis le localStorage
    let photos = JSON.parse(localStorage.getItem('bohemePhotos')) || {
        hero: [],
        services: [],
        gallery: [],
        about: []
    };
    
    // Données d'exemple si aucune photo n'existe
    if (!localStorage.getItem('bohemePhotos')) {
        // Générer des exemples pour chaque section
        const sections = ['hero', 'services', 'gallery', 'about'];
        sections.forEach(section => {
            for (let i = 1; i <= 4; i++) {
                photos[section].push({
                    id: section + '_' + Date.now() + '_' + i,
                    section: section,
                    title: 'Exemple ' + i + ' - ' + section,
                    description: 'Description de l\'exemple ' + i + ' pour la section ' + section,
                    url: '../images/placeholder.jpg',
                    altText: 'Image exemple pour ' + section,
                    isActive: true,
                    dateAdded: Date.now()
                });
            }
        });
        
        // Sauvegarder les exemples dans le localStorage
        localStorage.setItem('bohemePhotos', JSON.stringify(photos));
    }
    
    // Gérer les onglets de section
    sectionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Supprimer la classe active de tous les onglets
            sectionTabs.forEach(t => t.classList.remove('active'));
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            // Mettre à jour la section courante
            currentSection = this.dataset.section;
            // Recharger les photos
            displayPhotos();
        });
    });
    
    // Afficher les photos dans la galerie
    function displayPhotos() {
        // Vider la galerie
        photoGallery.innerHTML = '';
        
        if (photos[currentSection].length === 0) {
            photoGallery.innerHTML = '<p class="no-photos">Aucune photo n\'a été ajoutée pour cette section.</p>';
            return;
        }
        
        // Créer une carte pour chaque photo
        photos[currentSection].forEach(photo => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card' + (photo.isActive ? '' : ' inactive');
            photoCard.dataset.id = photo.id;
            
            photoCard.innerHTML = `
                <div class="photo-img">
                    <img src="${photo.url}" alt="${photo.altText}">
                    ${!photo.isActive ? '<div class="photo-inactive">Non visible</div>' : ''}
                </div>
                <div class="photo-info">
                    <h4>${photo.title}</h4>
                    <p>${AdminUtils.truncateText(photo.description, 80)}</p>
                </div>
                <div class="photo-actions">
                    <button class="btn-icon edit-photo" title="Modifier"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-photo" title="Supprimer"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            photoGallery.appendChild(photoCard);
            
            // Ajouter les événements pour les boutons d'action
            photoCard.querySelector('.edit-photo').addEventListener('click', () => editPhoto(photo.id));
            photoCard.querySelector('.delete-photo').addEventListener('click', () => deletePhoto(photo.id));
        });
    }
    
    // Fonction pour ouvrir le formulaire d'ajout de photo
    function openAddPhotoForm() {
        // Réinitialiser le formulaire
        photoForm.reset();
        document.getElementById('photoId').value = '';
        document.getElementById('photoSection').value = currentSection;
        photoPreview.innerHTML = '';
        selectedFile = null;
        existingImageUrl = null;
        
        // Mettre à jour le titre du modal
        photoModalTitle.textContent = 'Ajouter une nouvelle photo';
        
        // Afficher le modal
        photoFormModal.style.display = 'block';
    }
    
    // Fonction pour ouvrir le formulaire de modification d'une photo
    function editPhoto(photoId) {
        // Trouver la photo dans la collection
        let photoToEdit = null;
        for (const section in photos) {
            const foundPhoto = photos[section].find(p => p.id === photoId);
            if (foundPhoto) {
                photoToEdit = foundPhoto;
                break;
            }
        }
        
        if (!photoToEdit) {
            AdminUtils.showNotification('Photo non trouvée', 'error');
            return;
        }
        
        // Remplir le formulaire avec les données de la photo
        document.getElementById('photoId').value = photoToEdit.id;
        document.getElementById('photoSection').value = photoToEdit.section;
        document.getElementById('photoTitle').value = photoToEdit.title;
        document.getElementById('photoDescription').value = photoToEdit.description;
        document.getElementById('photoAltText').value = photoToEdit.altText;
        document.getElementById('photoIsActive').checked = photoToEdit.isActive;
        
        // Afficher l'image existante
        existingImageUrl = photoToEdit.url;
        photoPreview.innerHTML = `<img src="${existingImageUrl}" alt="${photoToEdit.altText}">`;
        
        // Mettre à jour le titre du modal
        photoModalTitle.textContent = 'Modifier la photo';
        
        // Afficher le modal
        photoFormModal.style.display = 'block';
    }
    
    // Fonction pour supprimer une photo
    function deletePhoto(photoId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
            return;
        }
        
        // Supprimer la photo de la collection
        for (const section in photos) {
            const index = photos[section].findIndex(p => p.id === photoId);
            if (index !== -1) {
                photos[section].splice(index, 1);
                break;
            }
        }
        
        // Sauvegarder les modifications
        localStorage.setItem('bohemePhotos', JSON.stringify(photos));
        
        // Recharger l'affichage
        displayPhotos();
        
        // Afficher une notification
        AdminUtils.showNotification('La photo a été supprimée avec succès');
    }
    
    // Gérer la soumission du formulaire de photo
    photoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valider le formulaire
        if (!AdminUtils.validateForm(photoForm)) {
            AdminUtils.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        // Récupérer les données du formulaire
        const photoId = document.getElementById('photoId').value;
        const photoSection = document.getElementById('photoSection').value;
        const photoTitle = document.getElementById('photoTitle').value;
        const photoDescription = document.getElementById('photoDescription').value;
        const photoAltText = document.getElementById('photoAltText').value;
        const photoIsActive = document.getElementById('photoIsActive').checked;
        
        // En situation réelle, il faudrait télécharger le fichier sur un serveur
        // Pour ce prototype, nous utilisons l'URL locale ou gardons l'existante
        let photoUrl = existingImageUrl;
        
        if (selectedFile) {
            // Simuler le téléchargement d'image (en réalité, nous utilisons un objet URL local)
            photoUrl = URL.createObjectURL(selectedFile);
        } else if (!existingImageUrl) {
            // Si aucune image n'est sélectionnée ou existante, utiliser une image par défaut
            photoUrl = '../images/placeholder.jpg';
        }
        
        // Créer ou mettre à jour l'objet photo
        const photoData = {
            id: photoId || photoSection + '_' + Date.now(),
            section: photoSection,
            title: photoTitle,
            description: photoDescription,
            url: photoUrl,
            altText: photoAltText,
            isActive: photoIsActive,
            dateAdded: photoId ? (photos[photoSection].find(p => p.id === photoId)?.dateAdded || Date.now()) : Date.now()
        };
        
        // Si c'est une modification, supprimer l'ancienne photo
        if (photoId) {
            for (const section in photos) {
                const index = photos[section].findIndex(p => p.id === photoId);
                if (index !== -1) {
                    photos[section].splice(index, 1);
                    break;
                }
            }
        }
        
        // Ajouter la photo à la collection
        photos[photoSection].push(photoData);
        
        // Sauvegarder les modifications
        localStorage.setItem('bohemePhotos', JSON.stringify(photos));
        
        // Fermer le modal
        photoFormModal.style.display = 'none';
        
        // Si la section active a changé, mettre à jour l'affichage
        if (currentSection !== photoSection) {
            currentSection = photoSection;
            // Mettre à jour l'onglet actif
            sectionTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.section === currentSection);
            });
        }
        
        // Recharger l'affichage
        displayPhotos();
        
        // Afficher une notification
        AdminUtils.showNotification('La photo a été ' + (photoId ? 'modifiée' : 'ajoutée') + ' avec succès');
    });
    
    // Prévisualiser l'image sélectionnée
    photoFile.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            selectedFile = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Prévisualisation">`;
            }
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Déclencher le sélecteur de fichier lors du clic sur le bouton
    triggerFileUpload.addEventListener('click', function() {
        photoFile.click();
    });
    
    // Événements pour les boutons
    addPhotoBtn.addEventListener('click', openAddPhotoForm);
    cancelPhotoBtn.addEventListener('click', () => photoFormModal.style.display = 'none');
    closeModalBtn.addEventListener('click', () => photoFormModal.style.display = 'none');
    
    // Fermer le modal si l'utilisateur clique en dehors
    window.addEventListener('click', function(e) {
        if (e.target === photoFormModal) {
            photoFormModal.style.display = 'none';
        }
    });
    
    // Initialiser l'affichage des photos
    displayPhotos();
}); 