import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  currentUser: AuthResponse | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Charger les données depuis le localStorage d'abord
    this.currentUser = this.authService.getUserInfo();
    
    // Puis récupérer les données à jour depuis la base de données
    this.authService.fetchUserData().subscribe({
      next: (userData) => {
        this.currentUser = userData;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  getUserInitial(): string {
    return this.currentUser?.firstName?.charAt(0).toUpperCase() || 'U';
  }

  getUserImage(): string | null {
    if (this.currentUser?.imageBase64) {
      return `data:image/jpeg;base64,${this.currentUser.imageBase64}`;
    }
    return null;
  }
}
