// Script de gestion des textes pour l'administration
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des variables
    const textEditorForm = document.getElementById('textEditorForm');
    const sectionTabs = document.querySelectorAll('.tab-btn');
    const saveButton = document.getElementById('saveTextChanges');
    const resetButton = document.getElementById('resetTextChanges');
    
    // Section active courante
    let currentSection = 'hero';
    
    // Structure des textes du site
    const defaultTexts = {
        hero: {
            siteTitle: {
                label: "Titre du site",
                value: "Bohème Fleurs",
                type: "text"
            },
            siteTagline: {
                label: "Slogan",
                value: "Artisan fleuriste à Paris",
                type: "text"
            },
            heroTitle: {
                label: "Titre principal",
                value: "Créations florales uniques et personnalisées",
                type: "text"
            },
            heroSubtitle: {
                label: "Sous-titre",
                value: "Sublimez vos événements avec des arrangements floraux sur mesure",
                type: "text"
            },
            heroCta: {
                label: "Texte du bouton",
                value: "Découvrir nos créations",
                type: "text"
            }
        },
        about: {
            aboutTitle: {
                label: "Titre de la section",
                value: "Notre histoire",
                type: "text"
            },
            aboutContent: {
                label: "Contenu",
                value: "Fondée en 2015, Bohème Fleurs est née d'une passion pour l'art floral et d'un désir de créer des arrangements qui racontent une histoire. Notre approche combinant l'esthétique bohème et le raffinement parisien nous permet de créer des compositions florales uniques qui capturent l'essence de chaque occasion. Nous travaillons exclusivement avec des fleurs de saison, en privilégiant les producteurs locaux et les méthodes de culture respectueuses de l'environnement.",
                type: "textarea",
                rows: 6
            },
            aboutPhilosophy: {
                label: "Notre philosophie",
                value: "Nous croyons que chaque création florale doit être aussi unique que le moment qu'elle célèbre. Nos arrangements sont conçus avec une attention méticuleuse aux détails, en tenant compte de l'ambiance de l'événement, de la personnalité de nos clients et de la saisonnalité des fleurs.",
                type: "textarea",
                rows: 4
            }
        },
        services: {
            servicesTitle: {
                label: "Titre de la section",
                value: "Nos services",
                type: "text"
            },
            servicesIntro: {
                label: "Introduction",
                value: "Bohème Fleurs vous accompagne dans tous vos moments importants avec des créations florales sur mesure.",
                type: "text"
            },
            service1Title: {
                label: "Service 1 - Titre",
                value: "Mariages & Cérémonies",
                type: "text"
            },
            service1Desc: {
                label: "Service 1 - Description",
                value: "De la conception à la réalisation, nous créons des décors floraux enchanteurs pour votre mariage ou cérémonie. Bouquets, arches, centres de table - chaque détail est soigneusement orchestré.",
                type: "textarea",
                rows: 3
            },
            service2Title: {
                label: "Service 2 - Titre",
                value: "Événements d'entreprise",
                type: "text"
            },
            service2Desc: {
                label: "Service 2 - Description",
                value: "Impressionnez vos clients et collaborateurs avec des arrangements floraux élégants pour vos événements professionnels, lancements de produits ou dîners d'affaires.",
                type: "textarea",
                rows: 3
            },
            service3Title: {
                label: "Service 3 - Titre",
                value: "Abonnements floraux",
                type: "text"
            },
            service3Desc: {
                label: "Service 3 - Description",
                value: "Recevez régulièrement des créations florales fraîches et saisonnières à votre domicile ou dans vos locaux professionnels, avec notre service d'abonnement personnalisable.",
                type: "textarea",
                rows: 3
            }
        },
        contact: {
            contactTitle: {
                label: "Titre de la section",
                value: "Contactez-nous",
                type: "text"
            },
            contactIntro: {
                label: "Introduction",
                value: "Nous serions ravis de discuter de votre projet floral. N'hésitez pas à nous contacter par téléphone, email ou en remplissant le formulaire ci-dessous.",
                type: "textarea",
                rows: 2
            },
            contactAddress: {
                label: "Adresse",
                value: "15 Rue des Fleurs, 75004 Paris",
                type: "text"
            },
            contactPhone: {
                label: "Téléphone",
                value: "+33 1 23 45 67 89",
                type: "text"
            },
            contactEmail: {
                label: "Email",
                value: "contact@boheme-fleurs.fr",
                type: "text"
            },
            contactHours: {
                label: "Horaires",
                value: "Lundi - Samedi: 10h00 - 19h00\nDimanche: Sur rendez-vous uniquement",
                type: "textarea",
                rows: 2
            }
        },
        footer: {
            footerCopyright: {
                label: "Copyright",
                value: "© 2023 Bohème Fleurs. Tous droits réservés.",
                type: "text"
            },
            footerTagline: {
                label: "Slogan de pied de page",
                value: "Artisan fleuriste créant des moments de beauté éphémère",
                type: "text"
            },
            footerSocialFacebook: {
                label: "URL Facebook",
                value: "https://facebook.com/bohemefleurs",
                type: "text"
            },
            footerSocialInstagram: {
                label: "URL Instagram",
                value: "https://instagram.com/boheme_fleurs",
                type: "text"
            },
            footerSocialPinterest: {
                label: "URL Pinterest",
                value: "https://pinterest.com/bohemefleurs",
                type: "text"
            }
        }
    };
    
    // Chargement des textes depuis le localStorage ou utilisation des valeurs par défaut
    let siteTexts = JSON.parse(localStorage.getItem('bohemeTexts')) || JSON.parse(JSON.stringify(defaultTexts));
    
    // Fonction pour générer le formulaire en fonction de la section active
    function generateTextForm() {
        // Vider le contenu précédent
        textEditorForm.innerHTML = '';
        
        // Si la section n'existe pas dans le localStorage, l'initialiser avec les valeurs par défaut
        if (!siteTexts[currentSection]) {
            siteTexts[currentSection] = JSON.parse(JSON.stringify(defaultTexts[currentSection]));
        }
        
        // Créer les champs pour chaque texte de la section
        for (const textKey in siteTexts[currentSection]) {
            const textData = siteTexts[currentSection][textKey];
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            
            // Créer le label
            const label = document.createElement('label');
            label.setAttribute('for', textKey);
            label.textContent = textData.label;
            formGroup.appendChild(label);
            
            // Créer le champ de saisie en fonction du type
            let inputField;
            
            if (textData.type === 'textarea') {
                inputField = document.createElement('textarea');
                inputField.rows = textData.rows || 3;
            } else {
                inputField = document.createElement('input');
                inputField.type = textData.type || 'text';
            }
            
            inputField.id = textKey;
            inputField.name = textKey;
            inputField.className = 'text-input';
            inputField.value = textData.value;
            
            // Ajouter l'événement pour suivre les modifications
            inputField.addEventListener('input', function() {
                siteTexts[currentSection][textKey].value = this.value;
                // Afficher le bouton d'enregistrement comme modifié
                saveButton.classList.add('modified');
            });
            
            formGroup.appendChild(inputField);
            
            // Ajouter une petite description si nécessaire
            if (textData.description) {
                const description = document.createElement('small');
                description.textContent = textData.description;
                formGroup.appendChild(description);
            }
            
            textEditorForm.appendChild(formGroup);
        }
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
            // Générer le formulaire pour la nouvelle section
            generateTextForm();
        });
    });
    
    // Sauvegarder les modifications
    saveButton.addEventListener('click', function() {
        // Sauvegarder les textes dans le localStorage
        localStorage.setItem('bohemeTexts', JSON.stringify(siteTexts));
        
        // Retirer la classe modified
        saveButton.classList.remove('modified');
        
        // Afficher une notification
        AdminUtils.showNotification('Les modifications ont été enregistrées avec succès');
    });
    
    // Annuler les modifications
    resetButton.addEventListener('click', function() {
        if (confirm('Êtes-vous sûr de vouloir annuler toutes les modifications non enregistrées ?')) {
            // Recharger les textes depuis le localStorage
            siteTexts = JSON.parse(localStorage.getItem('bohemeTexts')) || JSON.parse(JSON.stringify(defaultTexts));
            
            // Régénérer le formulaire
            generateTextForm();
            
            // Retirer la classe modified
            saveButton.classList.remove('modified');
            
            // Afficher une notification
            AdminUtils.showNotification('Les modifications ont été annulées');
        }
    });
    
    // Initialiser l'affichage des textes
    generateTextForm();
}); 