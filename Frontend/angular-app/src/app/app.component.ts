import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NotificationToastComponent } from './shared/components/notification-toast/notification-toast.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationToastComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SMARTEK';
  showHeaderFooter = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide header and footer on dashboard and auth pages
      this.showHeaderFooter = !event.url.includes('/dashboard') && 
                              !event.url.includes('/auth/');
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isLearner(): boolean {
    const user = this.authService.getUserInfo();
    return user?.role === 'LEARNER';
  }
}
