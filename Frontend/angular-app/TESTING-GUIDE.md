# Guide de Test - Routage par Rôle

## Démarrage

1. **Lancer l'application Angular:**
   ```bash
   cd Frontend/angular-app
   npm start
   ```

2. **Accéder à la page de test:**
   ```
   http://localhost:4200/test/roles
   ```

## Méthodes de Test

### Méthode 1: Page de Test Interactive (Recommandé)

1. Ouvrez `http://localhost:4200/test/roles`
2. Cliquez sur un rôle pour simuler une connexion
3. Vous serez automatiquement redirigé vers le dashboard du rôle
4. Testez la navigation entre différentes pages

**Avantages:**
- Pas besoin de backend
- Test rapide de tous les rôles
- Visualisation claire du rôle actuel

### Méthode 2: Connexion Réelle

1. Assurez-vous que le backend est démarré
2. Allez sur `http://localhost:4200/auth/sign-in`
3. Connectez-vous avec un compte existant
4. Vous serez redirigé selon votre rôle

### Méthode 3: Console du Navigateur

Ouvrez la console (F12) et exécutez:

```javascript
// Simuler un ADMIN
localStorage.setItem('token', 'mock-token');
localStorage.setItem('userInfo', JSON.stringify({
  token: 'mock-token',
  userId: 1,
  email: 'admin@smartek.com',
  firstName: 'Admin',
  role: 'ADMIN',
  message: 'Test'
}));
location.href = '/admin/users';

// Simuler un LEARNER
localStorage.setItem('userInfo', JSON.stringify({
  token: 'mock-token',
  userId: 2,
  email: 'learner@smartek.com',
  firstName: 'Learner',
  role: 'LEARNER',
  message: 'Test'
}));
location.href = '/learner/courses';
```

## Scénarios de Test

### Test 1: Redirection selon le rôle
1. Simulez un rôle ADMIN
2. Vérifiez que vous êtes sur `/admin/users`
3. Simulez un rôle LEARNER
4. Vérifiez que vous êtes sur `/learner/courses`

### Test 2: Protection des routes
1. Simulez un rôle LEARNER
2. Essayez d'accéder à `/admin/users`
3. Vous devriez être redirigé vers `/dashboard`

### Test 3: Accès non authentifié
1. Déconnectez-vous
2. Essayez d'accéder à `/admin/users`
3. Vous devriez être redirigé vers `/auth/sign-in`

### Test 4: Navigation entre pages du même rôle
1. Simulez un rôle TRAINER
2. Naviguez entre:
   - `/trainer/courses`
   - `/trainer/training-management`
   - `/trainer/skill-evidence`
   - `/trainer/badge-management`
3. Toutes les pages devraient être accessibles

## Routes par Rôle

### ADMIN
- ✅ `/admin/users` - Gestion des utilisateurs
- ✅ `/admin/companies` - Gestion des entreprises
- ✅ `/admin/contracts` - Gestion des contrats

### LEARNER
- ✅ `/learner/courses` - Consulter les cours
- ✅ `/learner/exams` - Gestion des examens
- ✅ `/learner/certifications` - Certifications et badges
- ✅ `/learner/participation` - Participation

### TRAINER
- ✅ `/trainer/courses` - Gestion des cours
- ✅ `/trainer/training-management` - Gestion des formations
- ✅ `/trainer/skill-evidence` - Preuves de compétences
- ✅ `/trainer/badge-management` - Gestion des badges

### RH_SMARTEK
- ✅ `/rh-smartek/certifications` - Attribution des certifications
- ✅ `/rh-smartek/courses` - Consulter les cours
- ✅ `/rh-smartek/exams` - Passer un examen
- ✅ `/rh-smartek/interviews` - Gestion des entretiens
- ✅ `/rh-smartek/schedule` - Gestion des plannings
- ✅ `/rh-smartek/events` - Gestion des événements

### RH_COMPANY
- ✅ `/rh-company/offers` - Gestion des offres
- ✅ `/rh-company/participation` - Participation

### PARTNER
- ✅ `/partner/sponsorship` - Gestion des sponsors
- ✅ `/partner/events` - Gestion des événements

## Vérification des Guards

### authGuard
- Vérifie si l'utilisateur est authentifié
- Redirige vers `/auth/sign-in` si non authentifié

### roleGuard
- Vérifie si l'utilisateur a le bon rôle
- Redirige vers `/dashboard` si rôle non autorisé

## Débogage

### Vérifier le rôle actuel
```javascript
// Dans la console
const userInfo = JSON.parse(localStorage.getItem('userInfo'));
console.log('Rôle actuel:', userInfo?.role);
```

### Vérifier le token
```javascript
console.log('Token:', localStorage.getItem('token'));
```

### Nettoyer le localStorage
```javascript
localStorage.clear();
location.reload();
```

## Problèmes Courants

### Problème: Redirection infinie
**Solution:** Vérifiez que le rôle dans localStorage correspond à un rôle valide

### Problème: Accès refusé à toutes les routes
**Solution:** Vérifiez que le token existe dans localStorage

### Problème: Page blanche
**Solution:** Ouvrez la console pour voir les erreurs, vérifiez que tous les composants sont importés

## Tests Automatisés (À venir)

Pour créer des tests unitaires:

```typescript
// role.guard.spec.ts
describe('RoleGuard', () => {
  it('should allow access for correct role', () => {
    // Test implementation
  });
  
  it('should deny access for incorrect role', () => {
    // Test implementation
  });
});
```
