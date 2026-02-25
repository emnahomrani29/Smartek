# Event Management Component

Composant Angular pour la gestion complète des événements dans le dashboard SMARTEK.

## Fonctionnalités

### CRUD Complet
- ✅ **Create**: Créer de nouveaux événements
- ✅ **Read**: Afficher la liste des événements et leurs détails
- ✅ **Update**: Modifier les événements existants
- ✅ **Delete**: Supprimer des événements

### Fonctionnalités Additionnelles
- Affichage en grille responsive
- Formulaire de création/édition avec validation
- Indicateur de disponibilité (places disponibles)
- Compteur de participants
- Formatage des dates en français
- Gestion des erreurs
- Loading states
- Empty state quand aucun événement

## Structure

```
event-management/
├── event-management.component.ts      # Logique du composant
├── event-management.component.html    # Template
├── event-management.component.scss    # Styles
└── README.md                          # Documentation
```

## Services Utilisés

### EventService
Service pour communiquer avec l'API backend:
- `getAllEvents()`: Récupérer tous les événements
- `getEventById(id)`: Récupérer un événement par ID
- `createEvent(event)`: Créer un événement
- `updateEvent(id, event)`: Mettre à jour un événement
- `deleteEvent(id)`: Supprimer un événement
- `registerParticipation(id)`: S'inscrire à un événement
- `cancelParticipation(id)`: Annuler une inscription

## Modèles de Données

### Event
```typescript
interface Event {
  eventId?: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipations: number;
  currentParticipations?: number;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### EventRequest
```typescript
interface EventRequest {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipations: number;
}
```

## Validation du Formulaire

- **Title**: Requis, max 200 caractères
- **Start Date**: Requis, format datetime-local
- **End Date**: Requis, format datetime-local
- **Location**: Requis, max 255 caractères
- **Max Participations**: Requis, minimum 1

## Permissions Requises

Pour accéder à cette page, l'utilisateur doit avoir au moins une des permissions suivantes:
- `EVENTS_VIEW`
- `EVENTS_CREATE`

## Routes

- `/dashboard/events` - Page de gestion des événements

## API Endpoints

Le composant communique avec les endpoints suivants via l'API Gateway (port 8090):

- `GET /api/events` - Liste tous les événements
- `GET /api/events/{id}` - Détails d'un événement
- `POST /api/events` - Créer un événement
- `PUT /api/events/{id}` - Mettre à jour un événement
- `DELETE /api/events/{id}` - Supprimer un événement

## Utilisation

1. Accéder au dashboard
2. Cliquer sur "Event Management" dans le menu latéral
3. Utiliser le bouton "Create Event" pour créer un nouvel événement
4. Cliquer sur "Edit" pour modifier un événement existant
5. Cliquer sur "Delete" pour supprimer un événement

## Styles

Le composant utilise:
- Tailwind CSS pour certains utilitaires
- SCSS personnalisé pour les styles spécifiques
- Design responsive avec grille CSS
- Animations et transitions fluides
- Palette de couleurs cohérente avec le design system

## Améliorations Futures

- [ ] Filtrage et recherche d'événements
- [ ] Tri par date, titre, lieu
- [ ] Pagination pour grandes listes
- [ ] Export des événements (CSV, PDF)
- [ ] Vue calendrier
- [ ] Notifications pour les événements à venir
- [ ] Gestion des inscriptions utilisateurs
- [ ] Upload d'images pour les événements
