# Planning Service

Microservice de gestion des plannings pour l'application Smartek.

## Configuration

- **Port**: 8083
- **Base de données**: MySQL (smartek_planning)
- **Service Discovery**: Eureka Client

## Entité Planning

```java
- planningId: Long (ID auto-généré)
- startDate: LocalDate (Date de début)
- endDate: LocalDate (Date de fin)
```

## Endpoints API

### CRUD Operations

- `POST /plannings` - Créer un nouveau planning
- `GET /plannings` - Récupérer tous les plannings
- `GET /plannings/{id}` - Récupérer un planning par ID
- `PUT /plannings/{id}` - Mettre à jour un planning
- `DELETE /plannings/{id}` - Supprimer un planning

### Endpoints spéciaux

- `GET /plannings/upcoming` - Récupérer les plannings à venir
- `GET /plannings/active` - Récupérer les plannings actifs (en cours)
- `GET /plannings/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Récupérer les plannings dans une plage de dates
- `GET /plannings/health` - Vérifier l'état du service

## Accès via API Gateway

Toutes les requêtes doivent passer par l'API Gateway:

```
http://localhost:8090/api/plannings/*
```

## Démarrage

```bash
cd Backend/planning-service
mvn spring-boot:run
```

Ou utiliser le script de démarrage global:

```bash
start-all-simple.bat
```

## Validation

- Les dates de début et de fin sont obligatoires
- La date de fin ne peut pas être antérieure à la date de début
