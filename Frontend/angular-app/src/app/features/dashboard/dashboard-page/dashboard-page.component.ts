import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  currentUser: AuthResponse | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserInfo();

    // Redirect sponsors to their dedicated dashboard
    if (this.currentUser?.role === 'SPONSOR') {
      this.router.navigate(['/dashboard/sponsor-dashboard']);
      return;
    }

    // Fetch fresh data from database
    this.authService.fetchUserData().subscribe({
      next: (userData) => {
        this.currentUser = userData;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  getUserImage(): string | null {
    if (this.currentUser?.imageBase64) {
      return `data:image/jpeg;base64,${this.currentUser.imageBase64}`;
    }
    return null;
  }

  getUserInitial(): string {
    return this.currentUser?.firstName?.charAt(0).toUpperCase() || 'U';
  }

  getExperience(): number {
    return this.currentUser?.experience ?? 0;
  }

  formatRole(role: string | undefined): string {
    if (!role) return 'User';

    const roleMap: { [key: string]: string } = {
      'LEARNER': 'Learner',
      'TRAINER': 'Trainer',
      'RH_COMPANY': 'HR Company',
      'RH_SMARTEK': 'HR Smartek',
      'PARTNER': 'Partner',
      'ADMIN': 'Admin',
      'SPONSOR': 'Sponsor'
    };

    return roleMap[role] || role;
  }
}
