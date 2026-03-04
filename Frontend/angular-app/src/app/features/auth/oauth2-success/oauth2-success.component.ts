import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth2-success',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  `
})
export class Oauth2SuccessComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('OAuth2Success - Query params:', params);
      
      const token = params['token'];
      const userId = params['userId'];
      const email = params['email'];
      const firstName = params['firstName'];
      const role = params['role'];
      const error = params['error'];
      
      console.log('OAuth2Success - Parsed values:', { token, userId, email, firstName, role, error });
      
      if (error) {
        console.error('OAuth2 error:', error);
        this.router.navigate(['/auth/sign-in'], { 
          queryParams: { error: 'Échec de l\'authentification: ' + error } 
        });
        return;
      }
      
      if (token && userId && email) {
        console.log('OAuth2Success - Saving to localStorage');
        // Sauvegarder les informations d'authentification
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify({
          token,
          userId: parseInt(userId),
          email,
          firstName: firstName || '',
          role,
          message: 'Connexion OAuth2 réussie'
        }));
        
        console.log('OAuth2Success - Token saved:', localStorage.getItem('token'));
        console.log('OAuth2Success - UserInfo saved:', localStorage.getItem('userInfo'));
        console.log('OAuth2Success - Redirecting to home page');
        
        // Rediriger vers la page d'accueil
        setTimeout(() => {
          this.router.navigate(['/']).then(
            () => console.log('Navigation successful'),
            (error) => console.error('Navigation failed:', error)
          );
        }, 100);
      } else {
        console.error('OAuth2Success - Missing data:', { token: !!token, userId: !!userId, email: !!email });
        this.router.navigate(['/auth/sign-in'], { 
          queryParams: { error: 'Données d\'authentification manquantes' } 
        });
      }
    });
  }
}
