import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  showHeaderFooter = true; // valeur par défaut OK pour la home

  constructor(private router: Router) {
    this.updateHeaderFooterVisibility(this.router.url); // applique immédiatement pour la route initiale

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateHeaderFooterVisibility(event.urlAfterRedirects || event.url);
    });
  }

  private updateHeaderFooterVisibility(url: string): void {
    console.log('URL détectée :', url); // pour debug
    this.showHeaderFooter = 
      !url.includes('/dashboard') && 
      !url.startsWith('/auth/');
  }
}