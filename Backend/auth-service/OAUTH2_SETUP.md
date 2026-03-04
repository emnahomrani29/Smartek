# Configuration OAuth2 - Google et GitHub

Ce guide explique comment configurer l'authentification OAuth2 avec Google et GitHub pour votre application SMARTEK.

## 1. Configuration Google OAuth2

### Étape 1: Créer un projet Google Cloud
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API" ou "Google Identity"

### Étape 2: Créer des identifiants OAuth2
1. Dans le menu, allez à "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "OAuth client ID"
3. Sélectionnez "Web application"
4. Configurez:
   - **Nom**: SMARTEK Auth
   - **Authorized JavaScript origins**: 
     - `http://localhost:4200`
     - `http://localhost:8081`
   - **Authorized redirect URIs**: 
     - `http://localhost:8081/api/auth/oauth2/callback/google`
5. Copiez le **Client ID** et le **Client Secret**

### Étape 3: Configurer l'application
1. Ouvrez `Backend/auth-service/src/main/resources/application.yml`
2. Remplacez les valeurs:
   ```yaml
   spring:
     security:
       oauth2:
         client:
           registration:
             google:
               client-id: VOTRE_GOOGLE_CLIENT_ID
               client-secret: VOTRE_GOOGLE_CLIENT_SECRET
   ```

3. Ouvrez `Frontend/angular-app/src/app/core/services/auth.service.ts`
4. Remplacez dans la méthode `loginWithGoogle()`:
   ```typescript
   const clientId = 'VOTRE_GOOGLE_CLIENT_ID';
   ```

## 2. Configuration GitHub OAuth2

### Étape 1: Créer une OAuth App GitHub
1. Allez sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Cliquez sur "OAuth Apps" > "New OAuth App"
3. Configurez:
   - **Application name**: SMARTEK Auth
   - **Homepage URL**: `http://localhost:4200`
   - **Authorization callback URL**: `http://localhost:8081/api/auth/oauth2/callback/github`
4. Cliquez sur "Register application"
5. Copiez le **Client ID**
6. Générez un nouveau **Client Secret** et copiez-le

### Étape 2: Configurer l'application
1. Ouvrez `Backend/auth-service/src/main/resources/application.yml`
2. Remplacez les valeurs:
   ```yaml
   spring:
     security:
       oauth2:
         client:
           registration:
             github:
               client-id: VOTRE_GITHUB_CLIENT_ID
               client-secret: VOTRE_GITHUB_CLIENT_SECRET
   ```

3. Ouvrez `Frontend/angular-app/src/app/core/services/auth.service.ts`
4. Remplacez dans la méthode `loginWithGithub()`:
   ```typescript
   const clientId = 'VOTRE_GITHUB_CLIENT_ID';
   ```

## 3. Variables d'environnement (Recommandé pour la production)

Pour la production, utilisez des variables d'environnement au lieu de valeurs en dur:

### Backend
```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}
```

Définissez les variables d'environnement:
```bash
export GOOGLE_CLIENT_ID="votre-google-client-id"
export GOOGLE_CLIENT_SECRET="votre-google-client-secret"
export GITHUB_CLIENT_ID="votre-github-client-id"
export GITHUB_CLIENT_SECRET="votre-github-client-secret"
```

### Frontend
Créez un fichier `environment.ts` pour gérer les configurations:
```typescript
export const environment = {
  production: false,
  oauth: {
    google: {
      clientId: 'votre-google-client-id'
    },
    github: {
      clientId: 'votre-github-client-id'
    }
  }
};
```

## 4. Tester l'authentification

1. Démarrez le backend:
   ```bash
   cd Backend/auth-service
   mvn spring-boot:run
   ```

2. Démarrez le frontend:
   ```bash
   cd Frontend/angular-app
   npm start
   ```

3. Accédez à `http://localhost:4200/auth/sign-in`
4. Cliquez sur "Google" ou "GitHub"
5. Autorisez l'application
6. Vous serez redirigé vers le dashboard après authentification

## 5. Flux OAuth2

```
1. Utilisateur clique sur "Login with Google/GitHub"
   ↓
2. Redirection vers Google/GitHub pour autorisation
   ↓
3. Utilisateur autorise l'application
   ↓
4. Google/GitHub redirige vers: http://localhost:8081/api/auth/oauth2/callback/{provider}?code=...
   ↓
5. Backend échange le code contre un access token
   ↓
6. Backend récupère les infos utilisateur (email, nom)
   ↓
7. Backend crée ou trouve l'utilisateur dans la DB
   ↓
8. Backend génère un JWT token
   ↓
9. Redirection vers: http://localhost:4200/auth/oauth2/success?token=...&userId=...
   ↓
10. Frontend sauvegarde le token et redirige vers le dashboard
```

## 6. Sécurité

- Ne commitez JAMAIS vos Client ID et Client Secret dans Git
- Utilisez des variables d'environnement pour la production
- Activez HTTPS en production
- Mettez à jour les redirect URIs pour votre domaine de production
- Limitez les scopes OAuth2 au minimum nécessaire

## 7. Dépannage

### Erreur "redirect_uri_mismatch"
- Vérifiez que l'URI de redirection dans votre code correspond exactement à celle configurée dans Google/GitHub
- Assurez-vous qu'il n'y a pas de slash final (`/`) en trop

### Erreur "invalid_client"
- Vérifiez que le Client ID et Client Secret sont corrects
- Assurez-vous que l'application OAuth est activée

### L'email n'est pas fourni
- Pour GitHub, assurez-vous que l'utilisateur a un email public ou que vous demandez le scope `user:email`
- Pour Google, vérifiez que le scope `email` est inclus
