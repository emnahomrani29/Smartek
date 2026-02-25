# Modifications Frontend - SMARTEK PI

## ✅ Modifications Effectuées

### 1. Composants Ajoutés

Les composants de Smartek-molka ont été intégrés dans le projet PI:

#### Gestion des Cours
- ✅ `course-management/` - Gestion des cours (RH_SMARTEK, TRAINER)
- ✅ `my-courses/` - Mes cours (LEARNER)
- ✅ `chapter-management/` - Gestion des chapitres (RH_SMARTEK, TRAINER)

#### Gestion des Examens
- ✅ `exam-management/` - Gestion des examens (RH_SMARTEK, TRAINER)
- ✅ `my-exams/` - Mes examens (LEARNER)

#### Gestion des Formations
- ✅ `training-management/` - Gestion des formations (Tous avec permission)
- ✅ `my-training/` - Mes formations (LEARNER)

**Emplacement:** `PI/Frontend/angular-app/src/app/features/dashboard/`

---

### 2. Services Ajoutés

Les services pour communiquer avec le backend ont été ajoutés:

- ✅ `course.service.ts` - Service pour les cours
- ✅ `exam.service.ts` - Service pour les examens
- ✅ `training.service.ts` - Service pour les formations

**Emplacement:** `PI/Frontend/angular-app/src/app/core/services/`

---

### 3. Routing Mis à Jour

Le fichier `app.routes.ts` a été mis à jour pour utiliser les vrais composants:

#### Routes Cours
```typescript
// Gestion des cours (RH_SMARTEK, TRAINER)
{ 
  path: 'courses',
  loadComponent: () => import('./features/dashboard/course-management/course-management.component')
    .then(m => m.CourseManagementComponent),
  canActivate: [permissionGuard],
  data: { roles: [Role.RH_SMARTEK, Role.TRAINER] }
}

// Mes cours (LEARNER)
{ 
  path: 'my-courses', 
  loadComponent: () => import('./features/dashboard/my-courses/my-courses.component')
    .then(m => m.MyCoursesComponent),
  canActivate: [permissionGuard],
  data: { roles: [Role.LEARNER], permissions: [Permission.COURSES_VIEW] }
}

// Gestion des chapitres (RH_SMARTEK, TRAINER)
{ 
  path: 'courses/:courseId/chapters',
  loadComponent: () => import('./features/dashboard/chapter-management/chapter-management.component')
    .then(m => m.ChapterManagementComponent),
  canActivate: [permissionGuard],
  data: { roles: [Role.RH_SMARTEK, Role.TRAINER] }
}
```

#### Routes Examens
```typescript
// Gestion des examens (RH_SMARTEK, TRAINER)
{ 
  path: 'exams', 
  loadComponent: () => import('./features/dashboard/exam-management/exam-management.component')
    .then(m => m.ExamManagementComponent),
  canActivate: [permissionGuard],
  data: { roles: [Role.RH_SMARTEK, Role.TRAINER] }
}

// Mes examens (LEARNER)
{ 
  path: 'my-exams', 
  loadComponent: () => import('./features/dashboard/my-exams/my-exams.component')
    .then(m => m.MyExamsComponent),
  canActivate: [permissionGuard],
  data: { roles: [Role.LEARNER], permissions: [Permission.EXAMS_TAKE] }
}
```

#### Routes Formations
```typescript
// Gestion des formations (Tous avec permission)
{ 
  path: 'training', 
  loadComponent: () => import('./features/dashboard/training-management/training-management.component')
    .then(m => m.TrainingManagementComponent),
  canActivate: [permissionGuard],
  data: { permissions: [Permission.TRAINING_VIEW] }
}

// Mes formations (LEARNER)
{ 
  path: 'my-training',
  loadComponent: () => import('./features/dashboard/my-training/my-training.component')
    .then(m => m.MyTrainingComponent),
  canActivate: [permissionGuard],
  data: { roles: [Role.LEARNER], permissions: [Permission.TRAINING_VIEW] }
}
```

---

### 4. URLs Corrigées

#### Environment Configuration
**Fichier:** `src/environments/environment.ts`

**Avant:**
```typescript
apiUrl: 'http://localhost:8082/api'  // Direct vers offers-service
```

**Après:**
```typescript
apiUrl: 'http://localhost:8080/api'  // API Gateway - Point d'entrée unique
```

#### Exam Service
**Fichier:** `src/app/core/services/exam.service.ts`

**Avant:**
```typescript
private apiUrl = 'http://localhost:9090/api/exams';  // Port Smartek-molka
```

**Après:**
```typescript
private apiUrl = 'http://localhost:8080/api/exams';  // API Gateway PI
```

---

## 📊 Routes Disponibles par Rôle

### LEARNER (Apprenant)
- ✅ `/dashboard/my-courses` - Mes cours
- ✅ `/dashboard/my-exams` - Mes examens
- ✅ `/dashboard/my-training` - Mes formations
- ✅ `/dashboard/my-certifications` - Mes certifications
- ✅ `/dashboard/job-offers` - Offres d'emploi
- ✅ `/dashboard/profile` - Mon profil

### RH_SMARTEK (Ressources Humaines)
- ✅ `/dashboard/courses` - Gestion des cours
- ✅ `/dashboard/courses/:id/chapters` - Gestion des chapitres
- ✅ `/dashboard/exams` - Gestion des examens
- ✅ `/dashboard/training` - Gestion des formations
- ✅ `/dashboard/users` - Gestion des utilisateurs
- ✅ `/dashboard/companies` - Gestion des entreprises
- ✅ `/dashboard/job-offers` - Gestion des offres
- ✅ `/dashboard/interviews` - Gestion des entretiens
- ✅ `/dashboard/planning` - Planning
- ✅ `/dashboard/events` - Événements
- ✅ `/dashboard/certifications` - Certifications
- ✅ `/dashboard/skill-evidence` - Preuves de compétences

### TRAINER (Formateur)
- ✅ `/dashboard/courses` - Gestion des cours
- ✅ `/dashboard/courses/:id/chapters` - Gestion des chapitres
- ✅ `/dashboard/exams` - Gestion des examens
- ✅ `/dashboard/training` - Gestion des formations
- ✅ `/dashboard/planning` - Planning

### COMPANY (Entreprise)
- ✅ `/dashboard/job-offers` - Gestion des offres d'emploi
- ✅ `/dashboard/interviews` - Gestion des entretiens
- ✅ `/dashboard/profile` - Profil entreprise

### ADMIN (Administrateur)
- ✅ Accès à toutes les routes
- ✅ `/dashboard/settings` - Paramètres système
- ✅ `/dashboard/users` - Gestion des utilisateurs

---

## 🔗 URLs Backend (API Gateway)

Toutes les requêtes passent par l'API Gateway sur le port **8080**:

### Cours
- `GET /api/courses` - Liste des cours
- `GET /api/courses/:id` - Détails d'un cours
- `POST /api/courses` - Créer un cours
- `PUT /api/courses/:id` - Modifier un cours
- `DELETE /api/courses/:id` - Supprimer un cours

### Examens
- `GET /api/exams` - Liste des examens
- `GET /api/exams/:id` - Détails d'un examen
- `POST /api/exams` - Créer un examen
- `PUT /api/exams/:id` - Modifier un examen
- `DELETE /api/exams/:id` - Supprimer un examen
- `POST /api/exams/:id/submit-quiz` - Soumettre un quiz
- `POST /api/exam-results/submit` - Soumettre un examen

### Formations
- `GET /api/trainings` - Liste des formations
- `GET /api/trainings/:id` - Détails d'une formation
- `POST /api/trainings` - Créer une formation
- `PUT /api/trainings/:id` - Modifier une formation
- `DELETE /api/trainings/:id` - Supprimer une formation
- `POST /api/trainings/:id/courses/:courseId` - Ajouter un cours
- `DELETE /api/trainings/:id/courses/:courseId` - Retirer un cours

### Offres d'Emploi
- `GET /api/offers` - Liste des offres
- `GET /api/offers/:id` - Détails d'une offre
- `POST /api/offers` - Créer une offre
- `PUT /api/offers/:id` - Modifier une offre
- `DELETE /api/offers/:id` - Supprimer une offre

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

---

## ✅ Vérification

### 1. Vérifier que les composants existent
```bash
ls PI/Frontend/angular-app/src/app/features/dashboard/
```

Vous devriez voir:
- course-management/
- my-courses/
- chapter-management/
- exam-management/
- my-exams/
- training-management/
- my-training/

### 2. Vérifier que les services existent
```bash
ls PI/Frontend/angular-app/src/app/core/services/
```

Vous devriez voir:
- course.service.ts
- exam.service.ts
- training.service.ts

### 3. Vérifier l'URL de l'API
```bash
cat PI/Frontend/angular-app/src/environments/environment.ts
```

Devrait afficher:
```typescript
apiUrl: 'http://localhost:8080/api'
```

---

## 🚀 Démarrage

### 1. Installer les dépendances
```bash
cd PI/Frontend/angular-app
npm install
```

### 2. Démarrer le frontend
```bash
ng serve
```

### 3. Accéder à l'application
```
http://localhost:4200
```

---

## 🧪 Tests

### Tester les Routes

1. **Se connecter en tant que LEARNER:**
   - Aller sur `/dashboard/my-courses`
   - Aller sur `/dashboard/my-exams`
   - Aller sur `/dashboard/my-training`

2. **Se connecter en tant que RH_SMARTEK:**
   - Aller sur `/dashboard/courses`
   - Aller sur `/dashboard/exams`
   - Aller sur `/dashboard/training`

3. **Se connecter en tant que TRAINER:**
   - Aller sur `/dashboard/courses`
   - Créer un cours
   - Ajouter des chapitres

---

## 📝 Notes Importantes

1. **Lazy Loading:** Les composants utilisent le lazy loading pour optimiser les performances
2. **Guards:** Toutes les routes sont protégées par `authGuard` et `permissionGuard`
3. **API Gateway:** Toutes les requêtes passent par l'API Gateway (port 8080)
4. **CORS:** Le backend doit autoriser les requêtes depuis `http://localhost:4200`

---

## 🔧 Prochaines Étapes

- [ ] Tester toutes les routes avec différents rôles
- [ ] Vérifier que les APIs backend répondent correctement
- [ ] Ajouter des tests unitaires pour les nouveaux composants
- [ ] Optimiser les performances
- [ ] Ajouter la gestion d'erreurs

---

**Modifications effectuées avec succès! ✅**

Le frontend du projet PI est maintenant complètement intégré avec tous les composants de Smartek-emna et Smartek-molka.
