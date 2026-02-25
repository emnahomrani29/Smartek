# SMARTEK Backend - Architecture Microservices

Architecture microservices complète pour la plateforme SMARTEK avec Spring Cloud.

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   Angular       │
│   Port: 4200    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │
│  Port: 8080     │◄──────┐
└────────┬────────┘       │
         │                │
         │         ┌──────┴──────┐
         │         │   Eureka    │
         │         │   Server    │
         │         │  Port: 8761 │
         │         └──────┬──────┘
         │                │
         ▼                │
┌─────────────────┐       │
│  Auth Service   │       │
│  Port: 8081     │◄──────┤
└────────┬────────┘       │
         │                │
         ▼                │
┌─────────────────┐       │
│   MySQL DB      │       │
│  smartek_db     │       │
└─────────────────┘       │
                          │
                   ┌──────┴──────┐
                   │   Config    │
                   │   Server    │
                   │  Port: 8888 │
                   └─────────────┘
```

## Services

### 1. Eureka Server (Port: 8761)
Service de découverte et registre des microservices.

**Fonctionnalités:**
- Enregistrement automatique des services
- Health check des services
- Load balancing
- Dashboard de monitoring

**Démarrage:**
```bash
cd eureka-server
mvn spring-boot:run
```

**Dashboard:** http://localhost:8761

---

### 2. Config Server (Port: 8888)
Serveur de configuration centralisée.

**Fonctionnalités:**
- Configuration centralisée pour tous les services
- Gestion des profils (dev, prod)
- Rechargement dynamique des configurations
- Intégration avec Eureka

**Démarrage:**
```bash
cd config-server
mvn spring-boot:run
```

**Configurations disponibles:**
- `auth-service.yml` - Configuration du service d'authentification
- `api-gateway.yml` - Configuration de l'API Gateway

---

### 3. API Gateway (Port: 8080)
Point d'entrée unique pour tous les microservices.

**Fonctionnalités:**
- Routage intelligent vers les microservices
- Load balancing automatique
- CORS configuration
- Circuit breaker
- Fallback endpoints
- Rate limiting (à configurer)

**Routes configurées:**
- `/api/auth/**` → auth-service

**Démarrage:**
```bash
cd api-gateway
mvn spring-boot:run
```

**Endpoints:**
- Health: http://localhost:8080/actuator/health
- Gateway routes: http://localhost:8080/actuator/gateway/routes

---

### 4. Auth Service (Port: 8081)
Microservice d'authentification et gestion des utilisateurs.

**Fonctionnalités:**
- Inscription des utilisateurs
- Authentification JWT
- Gestion des rôles (6 types)
- Sécurité Spring Security
- Base de données MySQL

**Démarrage:**
```bash
cd auth-service
mvn spring-boot:run
```

**API Endpoints:**
- POST `/api/auth/register` - Inscription
- POST `/api/auth/login` - Connexion
- GET `/api/auth/health` - Health check

---

## Ordre de démarrage

**IMPORTANT:** Démarrer les services dans cet ordre:

1. **Eureka Server** (8761)
   ```bash
   cd eureka-server && mvn spring-boot:run
   ```
   Attendre que le serveur soit complètement démarré (Dashboard accessible)

2. **Config Server** (8888)
   ```bash
   cd config-server && mvn spring-boot:run
   ```
   Attendre l'enregistrement dans Eureka

3. **Auth Service** (8081)
   ```bash
   cd auth-service && mvn spring-boot:run
   ```
   Attendre l'enregistrement dans Eureka

4. **API Gateway** (8080)
   ```bash
   cd api-gateway && mvn spring-boot:run
   ```
   Attendre l'enregistrement dans Eureka

5. **Frontend Angular** (4200)
   ```bash
   cd ../Frontend/angular-app && ng serve
   ```

---

## Configuration MySQL

Créer la base de données:
```sql
CREATE DATABASE smartek_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configuration par défaut:
- Host: localhost
- Port: 3306
- Database: smartek_db
- Username: root
- Password: root

---

## Tests de l'architecture

### 1. Vérifier Eureka Dashboard
```
http://localhost:8761
```
Tous les services doivent être enregistrés (UP)

### 2. Tester via API Gateway
```bash
# Health check
curl http://localhost:8080/api/auth/health

# Inscription
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "email": "test@smartek.com",
    "password": "password123",
    "role": "LEARNER"
  }'

# Connexion
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@smartek.com",
    "password": "password123"
  }'
```

### 3. Tester directement le service
```bash
curl http://localhost:8081/api/auth/health
```

---

## Monitoring

### Eureka Dashboard
- URL: http://localhost:8761
- Affiche tous les services enregistrés
- Status de santé de chaque service

### Gateway Actuator
- Health: http://localhost:8080/actuator/health
- Routes: http://localhost:8080/actuator/gateway/routes
- Info: http://localhost:8080/actuator/info

---

## Ports utilisés

| Service       | Port | Description                    |
|---------------|------|--------------------------------|
| Frontend      | 4200 | Application Angular            |
| API Gateway   | 8080 | Point d'entrée API             |
| Auth Service  | 8081 | Service d'authentification     |
| Config Server | 8888 | Configuration centralisée      |
| Eureka Server | 8761 | Service de découverte          |
| MySQL         | 3306 | Base de données                |

---

## Sécurité

- JWT avec expiration de 24h
- Mots de passe hashés avec BCrypt
- CORS configuré pour Angular (localhost:4200)
- Endpoints publics: `/api/auth/**`
- Circuit breaker pour la résilience

---

## Prochaines étapes

- [ ] Ajouter d'autres microservices (courses, users, etc.)
- [ ] Implémenter le refresh token
- [ ] Ajouter Redis pour le cache
- [ ] Configurer Zipkin pour le tracing distribué
- [ ] Ajouter Prometheus + Grafana pour le monitoring
- [ ] Implémenter rate limiting
- [ ] Ajouter des tests d'intégration
- [ ] Dockeriser les services
- [ ] Créer docker-compose.yml

---

## Troubleshooting

### Service ne s'enregistre pas dans Eureka
- Vérifier que Eureka Server est démarré
- Vérifier la configuration `eureka.client.service-url.defaultZone`
- Attendre 30 secondes (délai d'enregistrement)

### Erreur de connexion MySQL
- Vérifier que MySQL est démarré
- Vérifier les credentials dans application.yml
- Créer la base de données si elle n'existe pas

### Gateway ne route pas correctement
- Vérifier les logs du Gateway
- Vérifier que le service cible est UP dans Eureka
- Tester directement le service (sans passer par le Gateway)
