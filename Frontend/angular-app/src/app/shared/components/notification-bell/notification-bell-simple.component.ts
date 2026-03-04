import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface SimpleNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedOfferId?: number;
}

@Component({
  selector: 'app-notification-bell-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Bell Button -->
      <button 
        (click)="toggleDropdown()"
        class="relative p-2 rounded-lg hover:bg-gray-100 transition">
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        
        <!-- Badge -->
        <span *ngIf="unreadCount > 0" 
              class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>

      <!-- Dropdown -->
      <div *ngIf="showDropdown" 
           class="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
        
        <!-- Header -->
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="font-semibold text-lg">Notifications</h3>
          <button (click)="refresh()" 
                  class="text-blue-600 text-sm hover:underline">
            Rafraîchir
          </button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="p-8 text-center text-gray-500">
          Chargement...
        </div>

        <!-- Error -->
        <div *ngIf="error" class="p-4 bg-red-50 text-red-600 text-sm">
          {{ error }}
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div *ngIf="!loading && notifications.length === 0" 
               class="p-8 text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <p>Aucune notification</p>
          </div>

          <div *ngFor="let notif of notifications" 
               (click)="markAsRead(notif)"
               class="p-4 border-b hover:bg-gray-50 cursor-pointer transition"
               [class.bg-blue-50]="!notif.isRead">
            
            <div class="flex gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                </svg>
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 text-sm">{{ notif.title }}</p>
                <p class="text-gray-600 text-xs mt-1">{{ notif.message }}</p>
                <p class="text-gray-400 text-xs mt-1">{{ getTimeAgo(notif.createdAt) }}</p>
              </div>
              
              <div *ngIf="!notif.isRead" class="flex-shrink-0">
                <span class="w-2 h-2 bg-blue-500 rounded-full block"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t text-center">
          <a (click)="goToOffers()" 
             class="text-blue-600 text-sm hover:underline cursor-pointer">
            Voir toutes les offres
          </a>
        </div>
      </div>

      <!-- Backdrop -->
      <div *ngIf="showDropdown" 
           (click)="showDropdown = false"
           class="fixed inset-0 z-40"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotificationBellSimpleComponent implements OnInit {
  notifications: SimpleNotification[] = [];
  unreadCount = 0;
  showDropdown = false;
  loading = false;
  error = '';
  userId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupérer l'ID utilisateur depuis localStorage
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        this.userId = userInfo.userId;
        console.log('NotificationBell: User ID:', this.userId);
        this.loadNotifications();
        this.loadUnreadCount();
        
        // Rafraîchir toutes les 30 secondes
        setInterval(() => {
          this.loadUnreadCount();
        }, 30000);
      } catch (e) {
        console.error('NotificationBell: Error parsing user info', e);
      }
    } else {
      console.warn('NotificationBell: No user info in localStorage');
    }
  }

  loadNotifications() {
    if (!this.userId) return;

    this.loading = true;
    this.error = '';

    const url = `${environment.apiUrl}/notifications/user/${this.userId}`;
    console.log('NotificationBell: Loading from:', url);

    this.http.get<SimpleNotification[]>(url).subscribe({
      next: (data) => {
        console.log('NotificationBell: Loaded', data.length, 'notifications');
        this.notifications = data.slice(0, 10);
        this.loading = false;
      },
      error: (err) => {
        console.error('NotificationBell: Error:', err);
        this.error = 'Erreur de chargement';
        this.loading = false;
      }
    });
  }

  loadUnreadCount() {
    if (!this.userId) return;

    const url = `${environment.apiUrl}/notifications/user/${this.userId}/unread/count`;
    
    this.http.get<number>(url).subscribe({
      next: (count) => {
        console.log('NotificationBell: Unread count:', count);
        this.unreadCount = count;
      },
      error: (err) => {
        console.error('NotificationBell: Error loading count:', err);
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.loadNotifications();
    }
  }

  refresh() {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  markAsRead(notif: SimpleNotification) {
    if (notif.isRead) return;

    const url = `${environment.apiUrl}/notifications/${notif.id}/read`;
    
    this.http.put(url, {}).subscribe({
      next: () => {
        notif.isRead = true;
        this.loadUnreadCount();
        
        if (notif.relatedOfferId) {
          this.showDropdown = false;
          this.router.navigate(['/test-offers-learner']);
        }
      },
      error: (err) => {
        console.error('NotificationBell: Error marking as read:', err);
      }
    });
  }

  goToOffers() {
    this.showDropdown = false;
    this.router.navigate(['/test-offers-learner']);
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "À l'instant";
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`;
    return date.toLocaleDateString('fr-FR');
  }
}
