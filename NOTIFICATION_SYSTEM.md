# Système de Notification pour les Learners

## Vue d'ensemble

Ce système notifie automatiquement tous les learners lorsqu'une nouvelle offre d'emploi active est créée.

## Architecture

### Backend

#### 1. Entité Notification
- **Fichier**: `Backend/offers-service/src/main/java/com/smartek/offersservice/entity/Notification.java`
- Stocke les notifications avec les champs:
  - `userId`: ID de l'utilisateur
  - `userRole`: Rôle de l'utilisateur (LEARNER, COMPANY, etc.)
  - `type`: Type de notification (NEW_OFFER, APPLICATION_STATUS, etc.)
  - `title`: Titre de la notification
  - `message`: Message de la notification
  - `relatedOfferId`: ID de l'offre liée (optionnel)
  - `isRead`: Statut de lecture
  - `createdAt`: Date de création

#### 2. NotificationService
- **Fichier**: `Backend/offers-service/src/main/java/com/smartek/offersservice/service/NotificationService.java`
- Méthodes principales:
  - `notifyLearnersAboutNewOffer()`: Crée des notifications pour tous les learners
  - `getUserNotifications()`: Récupère toutes les notifications d'un utilisateur
  - `getUnreadNotifications()`: Récupère les notifications non lues
  - `getUnreadCount()`: Compte les notifications non lues
  - `markAsRead()`: Marque une notification comme lue
  - `markAllAsRead()`: Marque toutes les notifications comme lues

#### 3. NotificationController
- **Fichier**: `Backend/offers-service/src/main/java/com/smartek/offersservice/controller/NotificationController.java`
- Endpoints API:
  - `GET /api/notifications/user/{userId}`: Toutes les notifications
  - `GET /api/notifications/user/{userId}/unread`: Notifications non lues
  - `GET /api/notifications/user/{userId}/unread/count`: Nombre de non lues
  - `PUT /api/notifications/{notificationId}/read`: Marquer comme lu
  - `PUT /api/notifications/user/{userId}/read-all`: Tout marquer comme lu

#### 4. Intégration avec OfferService
- Lorsqu'une offre ACTIVE est créée, `notifyLearnersAboutNewOffer()` est appelé automatiquement
- Récupère tous les learners via l'endpoint auth-service
- Crée une notification pour chaque learner

#### 5. Auth Service - Endpoint supplémentaire
- **Fichier**: `Backend/auth-service/src/main/java/com/smartek/authservice/controller/AuthController.java`
- Nouveau endpoint: `GET /api/auth/users/role/{role}`
- Retourne les IDs de tous les utilisateurs avec un rôle spécifique

### Frontend

#### 1. NotificationService
- **Fichier**: `Frontend/angular-app/src/app/core/services/notification.service.ts`
- Gère les appels API pour les notifications
- Implémente un système de polling pour mettre à jour le compteur automatiquement
- Utilise un BehaviorSubject pour partager le compteur de notifications non lues

#### 2. NotificationBellComponent
- **Fichier**: `Frontend/angular-app/src/app/shared/components/notification-bell/notification-bell.component.ts`
- Composant standalone affichant l'icône de cloche avec badge
- Dropdown avec liste des notifications
- Polling automatique toutes les 30 secondes
- Fonctionnalités:
  - Affichage du nombre de notifications non lues
  - Liste des 10 dernières notifications
  - Marquer comme lu au clic
  - Marquer tout comme lu
  - Navigation vers les offres d'emploi

#### 3. Intégration dans le Header
- Le composant NotificationBell est affiché dans le header
- Visible uniquement pour les utilisateurs connectés avec le rôle LEARNER
- Positionné entre la navigation et le menu utilisateur

## Base de données

### Table notifications

```sql
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    related_offer_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_user_id_is_read (user_id, is_read),
    INDEX idx_created_at (created_at)
);
```

## Installation et Configuration

### 1. Base de données
Exécutez le script SQL:
```bash
mysql -u root -p smartek_offers < Backend/offers-service/src/main/resources/notifications-schema.sql
```

### 2. Backend
Aucune configuration supplémentaire nécessaire. Le système utilise RestTemplate pour communiquer entre services.

### 3. Frontend
Le composant est déjà intégré dans le header. Aucune action requise.

## Utilisation

### Pour les développeurs

#### Créer une notification personnalisée
```java
@Autowired
private NotificationService notificationService;

// Créer une notification manuelle
Notification notification = new Notification();
notification.setUserId(learnerId);
notification.setUserRole("LEARNER");
notification.setType("CUSTOM_TYPE");
notification.setTitle("Titre personnalisé");
notification.setMessage("Message personnalisé");
notification.setIsRead(false);
notificationRepository.save(notification);
```

#### Étendre le système
Pour ajouter de nouveaux types de notifications:
1. Définir un nouveau type dans `NotificationService`
2. Créer une méthode pour générer ce type de notification
3. Appeler cette méthode depuis le service approprié

### Pour les utilisateurs (Learners)

1. Connectez-vous avec un compte learner
2. L'icône de cloche apparaît dans le header
3. Un badge rouge indique le nombre de notifications non lues
4. Cliquez sur la cloche pour voir les notifications
5. Cliquez sur une notification pour la marquer comme lue et naviguer vers l'offre
6. Utilisez "Tout marquer comme lu" pour marquer toutes les notifications

## Fonctionnalités futures possibles

- [ ] Notifications en temps réel avec WebSocket
- [ ] Notifications par email
- [ ] Notifications push (PWA)
- [ ] Préférences de notification par utilisateur
- [ ] Notifications pour d'autres événements (acceptation de candidature, entretien programmé, etc.)
- [ ] Filtrage des notifications par type
- [ ] Archivage des notifications
- [ ] Notifications pour les entreprises

## Dépannage

### Les notifications ne s'affichent pas
- Vérifiez que la table `notifications` existe dans la base de données
- Vérifiez que l'auth-service est accessible sur le port 8081
- Vérifiez les logs du offers-service pour les erreurs

### Le compteur ne se met pas à jour
- Le polling est configuré pour 30 secondes
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que l'utilisateur est bien connecté

### Les learners ne reçoivent pas de notifications
- Vérifiez que l'offre créée a le statut "ACTIVE"
- Vérifiez que l'endpoint `/api/auth/users/role/LEARNER` retourne des IDs
- Vérifiez les logs du NotificationService
