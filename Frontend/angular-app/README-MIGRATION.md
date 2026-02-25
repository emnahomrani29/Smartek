# Si Education - Angular Migration

Ce projet est une migration du template Next.js "Si Education" et du dashboard "Soft UI Dashboard" vers Angular 18.

## Structure du projet

```
src/app/
├── core/                    # Module Core (services, models)
│   ├── models/             # Interfaces TypeScript
│   └── services/           # Services singleton (DataService)
├── shared/                 # Composants partagés
│   ├── header/            # Header avec navigation
│   └── footer/            # Footer
├── features/              # Modules fonctionnels
│   ├── home/             # Module Home (Site public)
│   │   ├── hero/         # Section Hero
│   │   ├── companies/    # Section Companies
│   │   ├── courses/      # Section Courses avec filtres
│   │   ├── mentors/      # Section Mentors
│   │   ├── testimonials/ # Section Testimonials
│   │   ├── contact/      # Formulaire de contact
│   │   ├── newsletter/   # Newsletter
│   │   └── home-page/    # Page d'accueil assemblée
│   └── dashboard/        # Module Dashboard (Admin)
│       ├── dashboard-layout/  # Layout du dashboard
│       ├── sidebar/           # Sidebar de navigation
│       └── dashboard-page/    # Page principale du dashboard
```

## Technologies utilisées

- Angular 18
- Tailwind CSS 4
- TypeScript
- RxJS
- Standalone Components
- Soft UI Dashboard Tailwind

## Fonctionnalités migrées

### Site Public (/)
✅ Header avec navigation responsive
✅ Hero section avec dropdowns
✅ Section Companies (logos partenaires)
✅ Section Courses avec filtres par catégorie
✅ Section Mentors
✅ Section Testimonials
✅ Formulaire de contact
✅ Newsletter
✅ Footer avec liens et réseaux sociaux
✅ Modals Sign In / Sign Up
✅ Menu mobile

### Dashboard (/dashboard)
✅ Layout avec sidebar
✅ Navigation dashboard
✅ Cartes statistiques
✅ Tableau de projets
✅ Timeline des commandes
✅ Design Soft UI

## Assets

Tous les assets ont été copiés:
- `/public/images/` - Images du site éducatif
- `/public/data/data.json` - Données de l'application
- `/public/dashboard-assets/` - Assets du dashboard (images, fonts, CSS)

## Routes

- `/` - Page d'accueil du site éducatif
- `/dashboard` - Dashboard principal
- `/dashboard/tables` - Tables (à implémenter)
- `/dashboard/profile` - Profil (à implémenter)

## Commandes

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
ng serve

# Build de production
ng build

# Tests
ng test
```

## Accès

- Site public: `http://localhost:4200`
- Dashboard: `http://localhost:4200/dashboard`

## Prochaines étapes

- [ ] Implémenter les formulaires Sign In / Sign Up
- [ ] Ajouter la page Documentation
- [ ] Créer les pages Tables et Profile du dashboard
- [ ] Implémenter la validation des formulaires
- [ ] Ajouter des animations (AOS équivalent)
- [ ] Ajouter les graphiques (Chart.js)
- [ ] Optimiser les images
- [ ] Ajouter les tests unitaires
- [ ] Implémenter le lazy loading des modules
- [ ] Connecter au backend Java Spring Boot
