# Test du Système de Notification

## Étapes de test

### 1. Vérifier que tous les services sont démarrés

```bash
# Vérifier Eureka (port 8761)
curl http://localhost:8761

# Vérifier Auth Service (port 8081)
curl http://localhost:8081/api/auth/health

# Vérifier Offers Service (port 8085)
curl http://localhost:8085/actuator/health

# Vérifier API Gateway (port 8080)
curl http://localhost:8080/actuator/health
```

### 2. Créer la table notifications

```bash
mysql -u root -p
```

Puis exécuter:
```sql
USE offers_db;
SOURCE Backend/offers-service/src/main/resources/init-notifications.sql;
```

Ou directement:
```bash
mysql -u root -p offers_db < Backend/offers-service/src/main/resources/init-notifications.sql
```

### 3. Vérifier que des learners existent

```bash
# Via API Gateway
curl http://localhost:8080/api/auth/users/role/LEARNER

# Ou directement
curl http://localhost:8081/api/auth/users/role/LEARNER
```

Si aucun learner n'existe, créez-en un via l'interface d'inscription avec le rôle LEARNER.

### 4. Créer une offre d'emploi ACTIVE

Via Postman ou curl:

```bash
curl -X POST http://localhost:8080/api/offers \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Développeur Full Stack",
    "description": "Nous recherchons un développeur Full Stack expérimenté",
    "companyName": "TechCorp",
    "location": "Paris",
    "contractType": "CDI",
    "salary": "45000-55000€",
    "companyId": 1,
    "status": "ACTIVE"
  }'
```

### 5. Vérifier les logs du offers-service

Vous devriez voir dans les logs:
```
=== OFFER CREATED ===
Offer ID: X
Offer Title: Développeur Full Stack
Offer Status: ACTIVE
=== CALLING NOTIFICATION SERVICE ===
Notifying learners about new offer: Développeur Full Stack
Calling auth-service at: http://auth-service/api/auth/users/role/LEARNER
Found X learners to notify
Notification created for learner ID: Y
Successfully notified X learners
```

### 6. Vérifier que les notifications ont été créées

```sql
USE offers_db;
SELECT * FROM notifications;
```

Vous devriez voir une notification pour chaque learner.

### 7. Tester l'API de notifications

```bash
# Récupérer les notifications d'un learner (remplacer {userId} par l'ID du learner)
curl http://localhost:8080/api/notifications/user/{userId}

# Récupérer le nombre de notifications non lues
curl http://localhost:8080/api/notifications/user/{userId}/unread/count

# Récupérer les notifications non lues
curl http://localhost:8080/api/notifications/user/{userId}/unread
```

### 8. Tester l'interface frontend

1. Connectez-vous avec un compte learner
2. Vérifiez que l'icône de cloche apparaît dans le header
3. Vérifiez que le badge affiche le nombre de notifications non lues
4. Cliquez sur la cloche pour voir les notifications
5. Cliquez sur une notification pour la marquer comme lue

## Dépannage

### Problème: Aucune notification créée

**Vérifier les logs du offers-service:**
- Est-ce que "=== CALLING NOTIFICATION SERVICE ===" apparaît?
- Est-ce qu'il y a des erreurs?

**Vérifier que l'endpoint auth-service fonctionne:**
```bash
curl http://localhost:8081/api/auth/users/role/LEARNER
```

**Vérifier que la table existe:**
```sql
USE offers_db;
SHOW TABLES LIKE 'notifications';
```

### Problème: Erreur lors de l'appel à auth-service

**Vérifier qu'Eureka fonctionne:**
```bash
curl http://localhost:8761/eureka/apps
```

**Vérifier que auth-service est enregistré dans Eureka:**
Cherchez "AUTH-SERVICE" dans la réponse.

**Vérifier que RestTemplate est configuré avec @LoadBalanced:**
Le fichier `RestTemplateConfig.java` doit exister.

### Problème: Les notifications ne s'affichent pas dans le frontend

**Vérifier la console du navigateur:**
- Y a-t-il des erreurs?
- Les appels API fonctionnent-ils?

**Vérifier que l'utilisateur est bien un LEARNER:**
```javascript
// Dans la console du navigateur
localStorage.getItem('userInfo')
```

**Vérifier que le composant NotificationBell est bien affiché:**
Inspectez le HTML du header.

## Commandes utiles

### Redémarrer tous les services

```bash
# Arrêter tous les services (Ctrl+C dans chaque terminal)

# Redémarrer dans l'ordre:
# 1. Eureka Server
cd Backend/eureka-server
mvn spring-boot:run

# 2. Auth Service
cd Backend/auth-service
mvn spring-boot:run

# 3. Offers Service
cd Backend/offers-service
mvn spring-boot:run

# 4. API Gateway
cd Backend/api-gateway
mvn spring-boot:run
```

### Nettoyer et recompiler

```bash
cd Backend/offers-service
mvn clean install
mvn spring-boot:run
```

### Vider les notifications pour retester

```sql
USE offers_db;
TRUNCATE TABLE notifications;
```
