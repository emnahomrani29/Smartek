# Planning Management Component

Composant Angular pour la gestion des plannings dans le dashboard Smartek.

## Fonctionnalités

### CRUD Complet
- **Créer** un nouveau planning avec dates de début et fin
- **Lire** tous les plannings avec affichage en grille
- **Mettre à jour** un planning existant
- **Supprimer** un planning avec confirmation

### Fonctionnalités supplémentaires
- Validation des formulaires (dates requises)
- Calcul automatique de la durée en jours
- Formatage des dates en français
- États de chargement et gestion des erreurs
- Interface responsive (mobile-friendly)
- Design moderne avec cartes et icônes SVG

## Structure des fichiers

```
planning/
├── planning.component.ts       # Logique du composant
├── planning.component.html     # Template HTML
├── planning.component.scss     # Styles SCSS
└── README.md                   # Documentation
```

## Modèles de données

### Planning
```typescript
{
  planningId: number;
  startDate: string;  // Format: YYYY-MM-DD
  endDate: string;    // Format: YYYY-MM-DD
}
```

### PlanningRequest
```typescript
{
  startDate: string;
  endDate: string;
}
```

## API Endpoints utilisés

- `GET /api/plannings` - Récupérer tous les plannings
- `POST /api/plannings` - Créer un planning
- `PUT /api/plannings/{id}` - Mettre à jour un planning
- `DELETE /api/plannings/{id}` - Supprimer un planning

## Route

Le composant est accessible via:
```
/dashboard/planning
```

## Permissions requises

- `PLANNING_VIEW` - Pour voir les plannings
- `PLANNING_CREATE` - Pour créer/modifier des plannings

## Utilisation

Le composant est automatiquement chargé lorsque l'utilisateur navigue vers `/dashboard/planning` dans le dashboard.

### Créer un planning
1. Remplir les champs "Date de début" et "Date de fin"
2. Cliquer sur "Créer"

### Modifier un planning
1. Cliquer sur l'icône de modification (crayon) sur une carte
2. Modifier les dates dans le formulaire
3. Cliquer sur "Mettre à jour"

### Supprimer un planning
1. Cliquer sur l'icône de suppression (poubelle) sur une carte
2. Confirmer la suppression dans la boîte de dialogue

## Design

- Cartes avec dégradé violet pour l'en-tête
- Affichage de la durée en jours
- Formatage des dates en français
- Animations au survol
- État vide avec illustration
- Responsive design pour mobile et tablette
