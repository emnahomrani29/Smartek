# 🚀 SMARTEK - Plateforme de Formation

Plateforme de formation moderne avec architecture microservices Spring Boot et frontend Angular 18.

---

## 📋 Prérequis

- ✅ **Java 17+** (actuellement: Java 21)
- ✅ **Maven 3.9+**
- ⚠️ **MySQL 8.0+**
- ✅ **Node.js 18+** et **npm**
- ✅ **Angular CLI 18**

---

## 🚀 Démarrage Rapide (Recommandé)

### Option 1: Script Automatique ⚡

**Le plus simple!** Double-cliquez sur:

```
start-all.bat
```

Ce script lance automatiquement:
1. 🔵 Eureka Server (8761)
2. 🟢 Config Server (8888)
3. 🟡 Auth Service (8081)
4. 🟣 API Gateway (8080)
5. 🎨 Frontend Angular (4200)

**Temps total:** ~2 minutes

Le script ouvrira automatiquement:
- Eureka Dashboard: http://localhost:8761
- Frontend SMARTEK: http://localhost:4200

### Option 2: Arrêter tous les services 🛑

Double-cliquez sur:

```
stop-all.bat
```

---

## 🗄️ Configuration MySQL

### 1. Démarrer MySQL

Assurez-vous que MySQL est démarré.

### 2. Créer la base de données

```sql
CREATE DATABASE smartek_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Note:** La base sera créée automatiquement si elle n'existe pas.

### 3. Vérifier les credentials

Dans `Backend/auth-service/src/main/resources/application.yml`:
- Username: `root`
- Password: `root`

Modifiez si nécessaire.

---

## 🧪 Tests de l'API

### Health Check

```bash
curl http://localhost:8080/api/auth/health
```

### Inscription

```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Test User\",\"email\":\"test@smartek.com\",\"password\":\"password123\",\"role\":\"LEARNER\"}"
```

### Connexion

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@smartek.com\",\"password\":\"password123\"}"
```

**Réponse attendue:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "test@smartek.com",
  "firstName": "Test User",
  "role": "LEARNER",
  "message": "Connexion réussie"
}
```

---

## 📊 URLs Importantes

| Service       | Port | URL                          |
|---------------|------|------------------------------|
| Frontend      | 4200 | http://localhost:4200        |
| API Gateway   | 8080 | http://localhost:8080        |
| Auth Service  | 8081 | http://localhost:8081        |
| Config Server | 8888 | http://localhost:8888        |
| Eureka Server | 8761 | http://localhost:8761        |

---

## 🎨 Architecture Frontend

### Pages disponibles

1. **Page d'accueil** - http://localhost:4200
   - Hero section SMARTEK
   - Entreprises partenaires
   - Catalogue de cours
   - Mentors
   - Témoignages

2. **Dashboard** - http://localhost:4200/dashboard
   - Interface Soft UI Dashboard
   - Sidebar SMARTEK

---

## 🔐 Rôles Utilisateurs

1. **LEARNER** - Apprenant
2. **ADMIN** - Administrateur
3. **TRAINER** - Formateur
4. **RH_COMPANY** - RH Entreprise
5. **RH_SMARTEK** - RH SMARTEK
6. **PARTNER** - Partenaire

---

## 🎨 Palette de Couleurs

```
Primary Orange: #F25C2B
Accent Blue:    #2563EB
Background:     #FFF8F5
Text:           #1C1917
```

---

## ❌ Troubleshooting

### Service ne démarre pas

1. Vérifiez que le port n'est pas utilisé
2. Vérifiez les logs
3. Assurez-vous que les services précédents sont démarrés

### Service ne s'enregistre pas dans Eureka

1. Vérifiez que Eureka est démarré (http://localhost:8761)
2. Attendez 30 secondes
3. Vérifiez la configuration

### Erreur MySQL

1. Vérifiez que MySQL est démarré
2. Vérifiez les credentials
3. Créez la base manuellement si besoin

### CORS Error

- Le CORS est configuré pour `localhost:4200`
- N'utilisez pas `127.0.0.1`

---

## 📚 Documentation

- **Backend:** `Backend/README.md`
- **Auth Service:** `Backend/auth-service/README.md`
- **Frontend:** `Frontend/angular-app/README.md`

---

## 🎉 Prêt!

Votre plateforme SMARTEK est opérationnelle! 🚀

**Architecture:**
- ✅ Microservices Spring Boot
- ✅ API Gateway avec CORS
- ✅ Service d'authentification JWT
- ✅ Frontend Angular 18
- ✅ Design SMARTEK (Orange & Bleu)
