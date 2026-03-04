import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Notification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-test-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-8">
      <h1 class="text-3xl font-bold mb-6">Test des Notifications</h1>
      
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Informations Utilisateur</h2>
        <p><strong>User ID:</strong> {{ userId }}</p>
        <p><strong>Email:</strong> {{ userEmail }}</p>
        <p><strong>Role:</strong> {{ userRole }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Statistiques</h2>
        <p><strong>Nombre total de notifications:</strong> {{ notifications.length }}</p>
        <p><strong>Notifications non lues:</strong> {{ unreadCount }}</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Liste des Notifications</h2>
        
        <div *ngIf="loading" class="text-center py-4">
          <p>Chargement...</p>
        </div>

        <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>

        <div *ngIf="!loading && notifications.length === 0" class="text-center py-8 text-gray-500">
          Aucune notification
        </div>

        <div *ngFor="let notification of notifications" 
             class="border-b border-gray-200 py-4 last:border-b-0"
             [class.bg-blue-50]="!notification.isRead">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ notification.title }}</h3>
              <p class="text-gray-600 text-sm mt-1">{{ notification.message }}</p>
              <div class="flex gap-4 mt-2 text-xs text-gray-500">
                <span>ID: {{ notification.id }}</span>
                <span>Type: {{ notification.type }}</span>
                <span *ngIf="notification.relatedOfferId">Offre ID: {{ notification.relatedOfferId }}</span>
                <span>{{ notification.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
            <div>
              <span *ngIf="!notification.isRead" 
                    class="inline-block px-3 py-1 bg-blue-500 text-white text-xs rounded-full">
                Non lu
              </span>
              <span *ngIf="notification.isRead" 
                    class="inline-block px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-full">
                Lu
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <button (click)="refresh()" 
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Rafraîchir
        </button>
      </div>
    </div>
  `
})
export class TestNotificationsComponent implements OnInit {
  userId: number | null = null;
  userEmail: string = '';
  userRole: string = '';
  notifications: Notification[] = [];
  unreadCount: number = 0;
  loading: boolean = false;
  error: string = '';

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userInfo = this.authService.getUserInfo();
    console.log('TestNotifications: User info:', userInfo);
    
    if (userInfo) {
      this.userId = userInfo.userId;
      this.userEmail = userInfo.email || '';
      this.userRole = userInfo.role || '';
      this.loadNotifications();
    } else {
      this.error = 'Utilisateur non connecté';
    }
  }

  loadNotifications() {
    if (!this.userId) {
      this.error = 'User ID non disponible';
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('TestNotifications: Loading notifications for user', this.userId);

    this.notificationService.getUserNotifications(this.userId).subscribe({
      next: (data) => {
        console.log('TestNotifications: Received notifications:', data);
        this.notifications = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('TestNotifications: Error loading notifications:', err);
        this.error = `Erreur: ${err.message || 'Impossible de charger les notifications'}`;
        this.loading = false;
      }
    });

    this.notificationService.getUnreadCount(this.userId).subscribe({
      next: (count) => {
        console.log('TestNotifications: Unread count:', count);
        this.unreadCount = count;
      },
      error: (err) => {
        console.error('TestNotifications: Error loading unread count:', err);
      }
    });
  }

  refresh() {
    this.loadNotifications();
  }
}
