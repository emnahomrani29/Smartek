# Correction URL Auth Service - Frontend PI

## ❌ Problème Identifié

Le frontend appelait directement le auth-service sur le port 8081 au lieu de passer par l'API Gateway:

```
Access to XMLHttpRequest at 'http://localhost:8081/api/auth/user/3' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

## 🔍 Cause

Le service `auth.service.ts` utilisait une URL incorrecte:

```typescript
private apiUrl = 'http://localhost:8081/api/auth';  // ❌ Port du service direct
```

## ✅ Solution Appliquée

### Correction dans auth.service.ts

**Avant:**
```typescript
private apiUrl = 'http://localhost:8081/api/auth';  // ❌ Direct vers auth-service
```

**Après:**
```typescript
private apiUrl = 'http://localhost:8080/api/auth';  // ✅ Via API Gateway
```

## 📋 URLs Correctes dans Tous les Services

### ✅ Services Vérifiés

Tous les services utilisent maintenant le port 8080 (API Gateway):

1. **auth.service.ts**
   ```typescript
   private apiUrl = 'http://localhost:8080/api/auth';  ✅
   ```

2. **exam.service.ts**
   ```typescript
   private apiUrl = 'http://localhost:8080/api/exams';  ✅
   submitExam: 'http://localhost:8080/api/exam-results/submit'  ✅
   getMyExams: 'http://localhost:8080/api/exam-enrollments/my-exams'  ✅
   ```

3. **course.service.ts**
   ```typescript
   private apiUrl = `${environment.apiUrl}/courses`;  ✅
   // environment.apiUrl = 'http://localhost:8080/api'
   ```

4. **training.service.ts**
   ```typescript
   private apiUrl = `${environment.apiUrl}/trainings`;  ✅
   // environment.apiUrl = 'http://localhost:8080/api'
   ```

## 🔄 Pour Appliquer les Changements

### Option 1: Redémarrage Complet (Recommandé)

```bash
# Arrêter le serveur Angular (Ctrl+C)
cd PI/Frontend/angular-app
ng serve
```

### Option 2: Rechargement à Chaud

Si `ng serve` est déjà en cours:
1. Sauvegarder le fichier (déjà fait)
2. Angular recompile automatiquement
3. Rafraîchir le navigateur (F5)

## 🧪 Tests

### 1. Tester l'Inscription

```bash
# Ouvrir http://localhost:4200/auth/sign-up
# Remplir le formulaire
# Cliquer sur "Sign Up"
```

**Vérifier dans DevTools (F12) → Network:**
- URL appelée: `http://localhost:8080/api/auth/register` ✅
- Status: 200 ou 201 ✅
- Pas d'erreur CORS ✅

### 2. Tester la Connexion

```bash
# Ouvrir http://localhost:4200/auth/sign-in
# Entrer email et mot de passe
# Cliquer sur "Sign In"
```

**Vérifier:**
- URL appelée: `http://localhost:8080/api/auth/login` ✅
- Redirection vers `/dashboard` ✅
- Token JWT sauvegardé ✅

### 3. Tester la Validation Utilisateur

```bash
# Naviguer vers n'importe quelle page du dashboard
```

**Vérifier:**
- URL appelée: `http://localhost:8080/api/auth/validate/{userId}` ✅
- Pas d'erreur CORS ✅

### 4. Tester Fetch User Data

```bash
# Ouvrir le dashboard
# Vérifier le header avec les infos utilisateur
```

**Vérifier:**
- URL appelée: `http://localhost:8080/api/auth/user/{userId}` ✅
- Données utilisateur affichées ✅

## 📊 Architecture des Appels API

### ✅ Architecture Correcte (Après Correction)

```
Frontend (4200)
    │
    │ Toutes les requêtes vers port 8080
    ▼
API Gateway (8080)
    │ CORS géré ici
    │ Routage vers les services
    ├─→ /api/auth/** → auth-service (8081)
    ├─→ /api/offers/** → offers-service (8082)
    ├─→ /api/courses/** → course-service (8083)
    ├─→ /api/trainings/** → training-service (8084)
    └─→ /api/exams/** → exam-service (8085)
```

### ❌ Architecture Incorrecte (Avant Correction)

```
Frontend (4200)
    │
    ├─→ Port 8080 (API Gateway) → offers, courses, etc. ✅
    │
    └─→ Port 8081 (auth-service direct) ❌ ERREUR CORS!
```

## 🔐 Endpoints Auth Corrigés

Tous ces endpoints passent maintenant par l'API Gateway:

| Endpoint | Méthode | URL Correcte |
|----------|---------|--------------|
| Register | POST | `http://localhost:8080/api/auth/register` |
| Login | POST | `http://localhost:8080/api/auth/login` |
| Validate | GET | `http://localhost:8080/api/auth/validate/{userId}` |
| Get User | GET | `http://localhost:8080/api/auth/user/{userId}` |

## ⚠️ Règles Importantes

### ✅ À FAIRE
- Toujours utiliser le port 8080 (API Gateway)
- Utiliser `environment.apiUrl` quand possible
- Passer par l'API Gateway pour tous les appels backend

### ❌ À NE PAS FAIRE
- Appeler directement les ports des microservices (8081-8085)
- Hardcoder les URLs sans utiliser `environment.apiUrl`
- Contourner l'API Gateway

## 📝 Configuration Environment

**Fichier:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // ✅ API Gateway
};
```

**Utilisation dans les services:**

```typescript
// ✅ RECOMMANDÉ
private apiUrl = `${environment.apiUrl}/auth`;

// ⚠️ ACCEPTABLE (si nécessaire)
private apiUrl = 'http://localhost:8080/api/auth';

// ❌ INCORRECT
private apiUrl = 'http://localhost:8081/api/auth';
```

## ✅ Résultat

Après correction et redémarrage du frontend:

- ✅ Inscription fonctionne
- ✅ Connexion fonctionne
- ✅ Validation utilisateur fonctionne
- ✅ Récupération des données utilisateur fonctionne
- ✅ Aucune erreur CORS
- ✅ Tous les appels passent par l'API Gateway

## 🔍 Vérification Rapide

### Dans le Navigateur (DevTools → Network)

Filtrer par "auth" et vérifier que toutes les URLs commencent par:
```
http://localhost:8080/api/auth/...
```

Et NON par:
```
http://localhost:8081/api/auth/...  ❌
```

## 📚 Documentation Liée

- [CORRECTION-CORS-DUPLICATE.md](../Backend/CORRECTION-CORS-DUPLICATE.md) - Configuration CORS
- [CORRECTION-ROUTES-API-GATEWAY.md](../Backend/CORRECTION-ROUTES-API-GATEWAY.md) - Routes Gateway
- [MODIFICATIONS-FRONTEND.md](MODIFICATIONS-FRONTEND.md) - Modifications frontend

---

**Date:** Janvier 2024
**Statut:** ✅ Correction appliquée - Redémarrage frontend requis
