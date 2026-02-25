# Event Service

Microservice de gestion des événements pour la plateforme SMARTEK.

## Description

Ce service gère toutes les opérations liées aux événements :
- Création, modification et suppression d'événements
- Consultation des événements (tous, à venir, par ID)
- Gestion des inscriptions aux événements
- Suivi du nombre de participants

## Entité Event

```
- eventId : Long (ID auto-généré)
- title : String (titre de l'événement)
- startDate : LocalDateTime (date de début)
- endDate : LocalDateTime (date de fin)
- location : String (lieu)
- maxParticipations : Integer (nombre max de participants)
- currentParticipations : Integer (nombre actuel de participants)
- createdAt : LocalDateTime
- updatedAt : LocalDateTime
```

## Endpoints API

### Gestion des événements

- `POST /api/events` - Créer un événement
- `GET /api/events` - Récupérer tous les événements
- `GET /api/events/{id}` - Récupérer un événement par ID
- `GET /api/events/upcoming` - Récupérer les événements à venir
- `PUT /api/events/{id}` - Mettre à jour un événement
- `DELETE /api/events/{id}` - Supprimer un événement

### Gestion des participations

- `POST /api/events/{id}/register` - S'inscrire à un événement
- `POST /api/events/{id}/cancel` - Annuler une inscription

### Health Check

- `GET /api/events/health` - Vérifier l'état du service

## Configuration

- **Port**: 8082
- **Base de données**: MySQL (smartek_events)
- **Eureka**: Enregistré sur http://localhost:8761

## Démarrage

```bash
cd Backend/event-service
mvn spring-boot:run
```

## Exemple de requête

### Créer un événement

```json
POST /api/events
{
  "title": "Conférence Tech 2026",
  "startDate": "2026-03-15T09:00:00",
  "endDate": "2026-03-15T17:00:00",
  "location": "Paris Convention Center",
  "maxParticipations": 100
}
```

### Réponse

```json
{
  "eventId": 1,
  "title": "Conférence Tech 2026",
  "startDate": "2026-03-15T09:00:00",
  "endDate": "2026-03-15T17:00:00",
  "location": "Paris Convention Center",
  "maxParticipations": 100,
  "currentParticipations": 0,
  "isAvailable": true,
  "createdAt": "2026-02-23T00:30:00",
  "updatedAt": "2026-02-23T00:30:00"
}
```
