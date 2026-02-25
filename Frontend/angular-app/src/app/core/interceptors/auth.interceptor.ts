import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Ajouter le token JWT à toutes les requêtes
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ne pas déconnecter sur les endpoints publics (login, register)
      const isPublicEndpoint = error.url?.includes('/api/auth/login') || 
                               error.url?.includes('/api/auth/register');
      
      // Si l'utilisateur n'existe plus ou le token est invalide (401 ou 403)
      // mais seulement si ce n'est pas un endpoint public
      if ((error.status === 401 || error.status === 403) && !isPublicEndpoint) {
        console.log('Utilisateur non autorisé ou token invalide, déconnexion...');
        authService.logout();
      }
      
      // Si l'utilisateur a été supprimé (404 sur les endpoints utilisateur)
      if (error.status === 404 && error.url?.includes('/api/users/')) {
        console.log('Utilisateur introuvable, déconnexion...');
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};
