# Planning Service - Logique Métier Avancée

## 📋 Vue d'ensemble

Ce document décrit les fonctionnalités métier avancées implémentées au-dessus du CRUD de base du service Planning.

## 🎯 Fonctionnalités Métier

### 1. Détection Automatique des Conflits

**Endpoint:** `POST /plannings/business/check-conflicts`

**Description:** Vérifie automatiquement les conflits avant la création ou modification d'un planning.

**Types de conflits détectés:**
- ✅ Conflit de formateur (trainer déjà occupé)
- ✅ Conflit de salle (room déjà réservée)
- ✅ Chevauchement de créneaux horaires

**Exemple de requête:**
```json
{
  "date": "2026-02-25",
  "startTime": "09:00:00",
  "endTime": "11:00:00",
  "trainerId": 1,
  "roomId": "A101",
  "excludePlanningId": null
}
```

**Exemple de réponse:**
```json
{
  "hasConflict": true,
  "conflicts": [
    {
      "type": "TRAINER",
      "message": "Le formateur est déjà occupé sur ce créneau",
      "conflictingPlanningId": 5,
      "conflictingPlanningTitle": "Cours de Java"
    }
  ]
}
```

### 2. Suggestion Automatique de Créneaux Optimaux

**Endpoint:** `POST /plannings/business/suggest-slots`

**Description:** Suggère automatiquement les meilleurs créneaux horaires disponibles selon les contraintes.

**Critères d'optimisation:**
- 🎯 Pas de conflit avec les plannings existants
- ⭐ Score de qualité basé sur l'heure (meilleurs créneaux: 9h-11h et 14h-16h)
- 📅 Exclusion automatique des week-ends
- 🔍 Filtrage par formateur et/ou salle

**Exemple de requête:**
```json
{
  "startDate": "2026-02-25",
  "endDate": "2026-02-28",
  "durationMinutes": 120,
  "trainerId": 1,
  "roomId": "A101",
  "maxSuggestions": 5
}
```

**Exemple de réponse:**
```json
[
  {
    "date": "2026-02-25",
    "startTime": "09:00:00",
    "endTime": "11:00:00",
    "score": 80,
    "reason": "Créneau disponible"
  },
  {
    "date": "2026-02-25",
    "startTime": "14:00:00",
    "endTime": "16:00:00",
    "score": 70,
    "reason": "Créneau disponible"
  }
]
```

### 3. Contrôle de Charge de Travail du Formateur

**Endpoint:** `GET /plannings/business/trainer-workload/{trainerId}?date=2026-02-25`

**Description:** Calcule la charge de travail d'un formateur pour une journée donnée.

**Règles métier:**
- ⚠️ Limite maximale: 8 heures par jour
- 📊 Calcul automatique du temps total
- 🚨 Avertissement si surcharge détectée

**Exemple de réponse:**
```json
{
  "trainerId": 1,
  "date": "2026-02-25",
  "totalHours": 6,
  "totalMinutes": 30,
  "sessionCount": 3,
  "overloaded": false,
  "maxDailyHours": 8,
  "warning": null
}
```

**Exemple avec surcharge:**
```json
{
  "trainerId": 1,
  "date": "2026-02-25",
  "totalHours": 9,
  "totalMinutes": 0,
  "sessionCount": 4,
  "overloaded": true,
  "maxDailyHours": 8,
  "warning": "Le formateur dépasse la limite de 8 heures par jour"
}
```

## 🔧 Nouveaux Champs du Modèle Planning

```java
private Long createdBy;           // ID de l'utilisateur créateur
private Long trainerId;            // ID du formateur assigné
private String roomId;             // ID de la salle
private Integer maxParticipants;   // Capacité maximale
private Integer currentParticipants; // Nombre actuel de participants
private String status;             // SCHEDULED, COMPLETED, CANCELLED
```

## 📊 Cas d'Usage

### Cas 1: Création d'un Planning avec Vérification Automatique

1. L'utilisateur remplit le formulaire de création
2. Le frontend appelle `/business/check-conflicts` avant la soumission
3. Si conflit détecté, afficher un message d'erreur avec les détails
4. Si pas de conflit, procéder à la création via le CRUD classique

### Cas 2: Suggestion Intelligente de Créneaux

1. L'utilisateur clique sur "Suggérer des créneaux"
2. Le système appelle `/business/suggest-slots` avec les critères
3. Afficher les suggestions triées par score de qualité
4. L'utilisateur sélectionne un créneau suggéré
5. Pré-remplir le formulaire avec le créneau choisi

### Cas 3: Contrôle de Surcharge du Formateur

1. Lors de l'assignation d'un formateur à un planning
2. Appeler `/business/trainer-workload/{trainerId}` pour la date
3. Si `isOverloaded = true`, afficher un avertissement
4. Permettre quand même la création mais avec confirmation

## 🚀 Prochaines Étapes

- [ ] Gestion de liste d'attente
- [ ] Duplication automatique de sessions
- [ ] Calcul du taux de présence
- [ ] Notifications automatiques
- [ ] Intégration avec le système de certification

## 📝 Notes Techniques

- Toutes les APIs métier sont dans le package `business`
- Les APIs CRUD classiques restent inchangées
- Les règles métier sont configurables (MAX_DAILY_HOURS, WORK_START, WORK_END)
- Les week-ends sont automatiquement exclus des suggestions
