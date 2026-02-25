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
      // 401 = unauthenticated -> force logout
      if (error.status === 401) {
        console.log('Token invalide ou non authentifié, déconnexion...');
        authService.logout();
      }

      // 403 = Forbidden (user not authorized for this resource).
      // Do NOT logout or force navigation here — let the UI/component
      // decide how to present the access-denied state to the user.
      if (error.status === 403) {
        console.warn('Accès refusé (403) — accès restreint pour cette ressource.');
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
