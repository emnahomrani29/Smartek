# Event Service - Logique Métier Avancée

## 📋 Vue d'ensemble

Ce document décrit les fonctionnalités métier avancées implémentées au-dessus du CRUD de base du service Event.

## 🎯 Fonctionnalités Métier

### 1️⃣ Workflow des Statuts

**Endpoint:** `POST /events/business/{eventId}/status`

**Statuts disponibles:**
- `DRAFT` - Brouillon (création initiale)
- `PUBLISHED` - Publié (ouvert aux inscriptions)
- `FULL` - Complet (capacité maximale atteinte)
- `ONGOING` - En cours (événement démarré)
- `COMPLETED` - Terminé (événement fini)
- `CANCELLED` - Annulé

**Transitions autorisées:**
```
DRAFT → PUBLISHED, CANCELLED
PUBLISHED → FULL, ONGOING, CANCELLED
FULL → ONGOING, CANCELLED
ONGOING → COMPLETED, CANCELLED
COMPLETED → (aucune transition)
CANCELLED → DRAFT, PUBLISHED (réactivation)
```

**Mise à jour automatique:**
- Si capacité atteinte → `FULL`
- Si date actuelle > date début → `ONGOING`
- Si date fin passée → `COMPLETED`

**Exemple de requête:**
```json
{
  "newStatus": "PUBLISHED",
  "reason": "Événement prêt pour les inscriptions",
  "changedBy": 1
}
```

### 2️⃣ Gestion Avancée des Inscriptions

**Endpoint:** `POST /events/business/register`

**Fonctionnalités:**
- ✅ Vérification des doublons d'inscription
- ✅ Gestion automatique de la liste d'attente
- ✅ Support des modes hybrides (présentiel/en ligne)
- ✅ Gestion des paiements
- ✅ Promotion automatique depuis la liste d'attente

**Exemple de requête:**
```json
{
  "eventId": 1,
  "userId": 123,
  "participationMode": "PHYSICAL"
}
```

**Exemple de réponse:**
```json
{
  "registrationId": 456,
  "eventId": 1,
  "userId": 123,
  "status": "CONFIRMED",
  "paymentStatus": "PENDING",
  "participationMode": "PHYSICAL",
  "registeredAt": "2026-03-02T15:30:00",
  "waitingListPosition": null,
  "message": "Inscription confirmée avec succès"
}
```

### 3️⃣ Gestion Capacité Hybride

**Nouveaux champs dans Event:**
- `physicalCapacity` - Capacité présentiel
- `onlineCapacity` - Capacité en ligne
- `physicalRegistered` - Inscrits présentiel
- `onlineRegistered` - Inscrits en ligne

**Logique:**
- Vérification de capacité selon le mode choisi
- Compteurs séparés pour chaque mode
- Blocage automatique si limite atteinte

### 4️⃣ Calcul des Revenus

**Endpoint:** `GET /events/business/{eventId}/revenue`

**Métriques calculées:**
- Revenus totaux (inscriptions payées)
- Revenus potentiels (toutes inscriptions confirmées)
- Nombre de paiements en attente
- Revenu moyen par participant

**Exemple de réponse:**
```json
{
  "eventId": 1,
  "totalRevenue": 2500.00,
  "potentialRevenue": 3000.00,
  "paidRegistrations": 25,
  "pendingPayments": 5,
  "averageRevenuePerParticipant": 100.00
}
```

### 5️⃣ Analytics Avancées

**Endpoint:** `GET /events/business/{eventId}/analytics`

**Métriques calculées:**
- Taux de remplissage (confirmés / capacité totale)
- Taux d'annulation (annulés / total inscriptions)
- Répartition présentiel/en ligne
- Indicateur de performance (EXCELLENT, GOOD, AVERAGE, POOR)
- Recommandations automatiques

**Exemple de réponse:**
```json
{
  "eventId": 1,
  "eventTitle": "Formation Angular Avancé",
  "totalCapacity": 50,
  "totalRegistered": 45,
  "confirmedRegistrations": 42,
  "waitingListSize": 8,
  "fillRate": 84.0,
  "cancellationRate": 6.7,
  "physicalCapacity": 30,
  "physicalRegistered": 28,
  "onlineCapacity": 20,
  "onlineRegistered": 17,
  "totalRevenue": 4200.00,
  "potentialRevenue": 5000.00,
  "paidRegistrations": 42,
  "pendingPayments": 0,
  "performanceIndicator": "GOOD",
  "recommendation": "Événement populaire. Considérez une duplication automatique."
}
```

### 6️⃣ Duplication Automatique

**Endpoint:** `POST /events/business/{eventId}/auto-duplicate`

**Conditions de duplication:**
- Statut = `FULL`
- Liste d'attente > 50% de la capacité

**Processus:**
- Copie titre, description, capacités, prix
- Propose nouvelle date (+1 semaine)
- Statut initial = `DRAFT`
- Titre modifié avec "- Session 2"

## 📊 Nouveaux Champs du Modèle Event

```java
// Capacités hybrides
private Integer physicalCapacity;
private Integer onlineCapacity;
private Integer physicalRegistered;
private Integer onlineRegistered;

// Workflow
private EventStatus status = EventStatus.DRAFT;

// Paiements
private BigDecimal price = BigDecimal.ZERO;
private Boolean isPaid = false;

// Mode
private EventMode mode = EventMode.PHYSICAL;

// Métadonnées
private Long createdBy;
private String description;
```

## 🗄️ Nouvelles Entités

### EventRegistration
- Gestion des inscriptions individuelles
- Statuts: CONFIRMED, WAITING, CANCELLED
- Paiements: PENDING, PAID, REFUNDED, FAILED
- Position en liste d'attente

### EventStatusHistory
- Historique des changements de statut
- Traçabilité complète
- Raisons des changements

## 🔄 Workflows Automatiques

### Inscription Utilisateur
1. Vérifier si déjà inscrit
2. Vérifier capacité selon mode
3. Si place disponible → CONFIRMED
4. Sinon → WAITING (avec position)
5. Gérer paiement si nécessaire
6. Mettre à jour compteurs événement

### Annulation Inscription
1. Marquer comme CANCELLED
2. Si était confirmé → libérer place
3. Promouvoir premier en liste d'attente
4. Mettre à jour compteurs

### Mise à Jour Statut Auto
1. Vérifier capacité → FULL si atteinte
2. Vérifier date début → ONGOING si dépassée
3. Vérifier date fin → COMPLETED si passée

## 📈 Indicateurs de Performance

### Excellent (EXCELLENT)
- Taux remplissage ≥ 90%
- Taux annulation ≤ 5%

### Bon (GOOD)
- Taux remplissage ≥ 70%
- Taux annulation ≤ 10%

### Moyen (AVERAGE)
- Taux remplissage ≥ 50%
- Taux annulation ≤ 20%

### Faible (POOR)
- Autres cas

## 🚀 Endpoints Métier

```
POST   /events/business/{eventId}/status
POST   /events/business/{eventId}/auto-update-status
POST   /events/business/{eventId}/auto-duplicate
GET    /events/business/{eventId}/can-duplicate
POST   /events/business/register
DELETE /events/business/registrations/{registrationId}
POST   /events/business/registrations/{registrationId}/confirm-payment
GET    /events/business/{eventId}/registrations
GET    /events/business/{eventId}/waiting-list
GET    /events/business/{eventId}/analytics
GET    /events/business/{eventId}/revenue
```

## 🎯 Cas d'Usage

### Cas 1: Inscription à un Événement Complet
1. Utilisateur tente inscription
2. Système détecte capacité atteinte
3. Ajout automatique en liste d'attente
4. Attribution position d'attente
5. Notification utilisateur

### Cas 2: Annulation avec Promotion
1. Utilisateur annule inscription confirmée
2. Système libère la place
3. Promotion automatique du premier en attente
4. Notification au promu
5. Mise à jour des compteurs

### Cas 3: Duplication Automatique
1. Événement atteint capacité maximale
2. Liste d'attente dépasse seuil (50%)
3. Système propose duplication
4. Création automatique session 2
5. Notification aux organisateurs

## 📝 Notes Techniques

- Toutes les opérations sont transactionnelles
- Historique complet des changements de statut
- Support des événements gratuits et payants
- Gestion des fuseaux horaires
- Validation des transitions de statut
- Promotion automatique intelligente

---

**Date de création:** 2 Mars 2026  
**Statut:** ✅ Implémenté  
**Prochaine étape:** Tests et intégration frontend