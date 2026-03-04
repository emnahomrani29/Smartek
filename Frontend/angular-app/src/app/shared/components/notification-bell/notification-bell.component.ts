import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Notification } from '../../../core/models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;
  userId: number | null = null;
  private pollingSubscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('NotificationBell: Component initialized');
    const userInfo = this.authService.getUserInfo();
    console.log('NotificationBell: User info:', userInfo);
    
    if (userInfo) {
      this.userId = userInfo.userId;
      console.log('NotificationBell: User ID:', this.userId);
      this.loadNotifications();
      this.loadUnreadCount();
      
      // Démarrer le polling pour les nouvelles notifications
      this.pollingSubscription = this.notificationService.startPolling(this.userId);
      
      // S'abonner aux changements du compteur
      this.notificationService.unreadCount$.subscribe(count => {
        console.log('NotificationBell: Unread count updated:', count);
        this.unreadCount = count;
      });
    } else {
      console.warn('NotificationBell: No user info found');
    }
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadNotifications() {
    if (!this.userId) {
      console.warn('NotificationBell: Cannot load notifications - no user ID');
      return;
    }
    
    console.log('NotificationBell: Loading notifications for user', this.userId);
    this.notificationService.getUserNotifications(this.userId).subscribe({
      next: (data) => {
        console.log('NotificationBell: Received notifications:', data);
        this.notifications = data.slice(0, 10); // Afficher les 10 dernières
        console.log('NotificationBell: Displaying', this.notifications.length, 'notifications');
      },
      error: (error) => {
        console.error('NotificationBell: Error loading notifications:', error);
      }
    });
  }

  loadUnreadCount() {
    if (!this.userId) return;
    
    this.notificationService.getUnreadCount(this.userId).subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
      }
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.loadNotifications();
    }
  }

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.loadUnreadCount();
        
        // Naviguer vers l'offre si c'est une notification d'offre
        if (notification.relatedOfferId) {
          this.router.navigate(['/learner/job-offers']);
          this.showDropdown = false;
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  markAllAsRead() {
    if (!this.userId) return;
    
    this.notificationService.markAllAsRead(this.userId).subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.loadUnreadCount();
      },
      error: (error) => {
        console.error('Error marking all as read:', error);
      }
    });
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`;
    return date.toLocaleDateString('fr-FR');
  }
}
