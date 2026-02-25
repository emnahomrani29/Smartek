import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';           // ← ajouter Router
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';   // ← adapter le chemin selon ton projet

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {

  constructor(
    private authService: AuthService,    // ← injection du service
    private router: Router               // ← injection du router
  ) {}

  logout(): void {
    this.authService.logout();           // nettoie token, session, etc.
    this.router.navigate(['/auth/sign-in']);  // ou ['/'], ['/login'], selon ton besoin
  }
}