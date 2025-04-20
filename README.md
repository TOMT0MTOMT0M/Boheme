# Bohème Fleurs - Site Web

Ce dépôt contient le code source du site web Bohème Fleurs, conçu pour présenter les créations florales et services proposés par l'entreprise.

## Structure du Projet

```
boheme-fleurs-site/
├── admin/                # Interface d'administration
│   ├── css/              # Styles de l'administration
│   ├── includes/         # Fichiers PHP inclus
│   ├── js/               # Scripts JavaScript admin
│   ├── uploads/          # Dossier des fichiers téléchargés
│   └── ...               # Autres fichiers de l'admin
├── css/                  # Feuilles de style
│   ├── reset.css         # Réinitialisation des styles par défaut
│   ├── styles.css        # Styles principaux
│   ├── gallery.css       # Styles pour la galerie
│   ├── lightbox.css      # Styles pour la lightbox
│   └── testimonials.css  # Styles spécifiques aux témoignages
├── fonts/                # Polices personnalisées
├── images/               # Images et ressources graphiques
├── js/                   # Scripts JavaScript
│   ├── main.js           # Script principal
│   ├── lightbox.js       # Script pour la lightbox
│   ├── film-grain.js     # Effet de grain cinématographique
│   ├── google-reviews.js # Intégration des avis Google
│   ├── config.js         # Configuration
│   └── admin-data.js     # Script pour l'admin
├── pages/                # Pages additionnelles
│   ├── mentions-legales.html       # Mentions légales
│   └── politique-confidentialite.html  # Politique de confidentialité
└── index.html            # Page principale
```

## Design & Style

Le site a été conçu en suivant une approche sophistiquée et moderne, inspirée du brutalisme tout en gardant une lisibilité optimale. Un effet de grain cinématographique a été ajouté pour renforcer l'esthétique et améliorer l'ambiance visuelle.

### Palette de Couleurs

- **Couleur principale**: #100d0c (noir foncé)
- **Couleurs secondaires**: 
  - #bd8f39 (doré)
  - #35502B (vert)
- **Couleur de texte**: #FCF5E1 (beige clair)

### Typographie

- **Titres**: Bebas Neue (sans-serif)
- **Corps de texte**: Lora (serif)

## Fonctionnalités

- Design responsive pour une expérience optimale sur tous les appareils
- Animations fluides à l'entrée et au défilement
- Navigation intuitive
- Galerie d'images interactive avec lightbox
- Intégration des avis Google
- Effet de grain cinématographique pour une esthétique unique
- Formulaire de contact fonctionnel
- Pages légales (mentions légales et politique de confidentialité)
- Interface d'administration complète

## Interface d'Administration

Une interface d'administration a été développée pour permettre la gestion du contenu:

- Connexion sécurisée
- Modification des textes du site
- Gestion des images (ajout, suppression, réorganisation)
- Tableau de bord intuitif

## Animations et Effets

Le site utilise plusieurs technologies pour des animations sophistiquées :
- GSAP pour les animations de texte et de contenu
- Effet de grain cinématographique pour l'esthétique visuelle
- Animations au défilement pour les différentes sections
- Transitions fluides et lightbox pour la galerie d'images

## Comment Utiliser

1. Clonez ce dépôt
2. Configurez un serveur web (Apache, Nginx, etc.) avec PHP
3. Configurez la base de données selon les instructions dans `/admin/README.md`
4. Accédez à l'interface admin via `/admin/`

## Personnalisation

Pour personnaliser le site:

- Utilisez l'interface d'administration pour modifier textes et images
- Modifiez les couleurs dans `css/styles.css` (variables CSS)
- Modifiez les paramètres d'animation dans `js/main.js`
- Ajustez la configuration dans `js/config.js`

## Compatibilité

Le site est conçu pour fonctionner sur les navigateurs modernes :
- Chrome
- Firefox
- Safari
- Edge

## Sécurité

- Protection contre les injections SQL
- Validation des formulaires côté client et serveur
- Gestion sécurisée des sessions administrateur
- Protection des dossiers sensibles avec .htaccess

## Optimisations Techniques

- Chargement différé des images (lazy loading)
- Optimisation des performances avec effet de grain optimisé
- Intégration API Google pour les avis clients
- Compression des ressources

---

Conçu avec soin pour Bohème Fleurs © 2023-2024 