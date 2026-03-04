import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  isEditing = false;
  editForm: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getUserInfo();
    
    // Récupérer les données à jour depuis la base de données
    this.authService.fetchUserData().subscribe({
      next: (userData) => {
        this.currentUser = userData;
        this.initEditForm();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

  initEditForm(): void {
    this.editForm = {
      firstName: this.currentUser?.firstName || '',
      email: this.currentUser?.email || '',
      experience: this.currentUser?.experience || 0
    };
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.initEditForm();
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.initEditForm();
  }

  saveProfile(): void {
    // TODO: Implémenter la sauvegarde du profil via API
    console.log('Saving profile:', this.editForm);
    this.isEditing = false;
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

  formatRole(role: string | undefined): string {
    if (!role) return 'User';
    
    const roleMap: { [key: string]: string } = {
      'LEARNER': 'Learner',
      'TRAINER': 'Trainer',
      'RH_COMPANY': 'HR Company',
      'RH_SMARTEK': 'HR Smartek',
      'SPONSOR': 'Sponsor',
      'ADMIN': 'Administrator'
    };
    
    return roleMap[role] || role;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
