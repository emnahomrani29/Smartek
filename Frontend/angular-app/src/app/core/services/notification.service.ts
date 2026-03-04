import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Notification } from '../models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number): Observable<Notification[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    console.log('NotificationService: Fetching notifications from:', url);
    return this.http.get<Notification[]>(url).pipe(
      tap(notifications => console.log('NotificationService: Received', notifications.length, 'notifications'))
    );
  }

  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}/unread`);
  }

  getUnreadCount(userId: number): Observable<number> {
    const url = `${this.apiUrl}/user/${userId}/unread/count`;
    console.log('NotificationService: Fetching unread count from:', url);
    return this.http.get<number>(url).pipe(
      tap(count => {
        console.log('NotificationService: Unread count:', count);
        this.unreadCountSubject.next(count);
      })
    );
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/user/${userId}/read-all`, {});
  }

  // Polling pour mettre à jour le compteur de notifications non lues
  startPolling(userId: number, intervalMs: number = 30000) {
    return interval(intervalMs).pipe(
      switchMap(() => this.getUnreadCount(userId))
    ).subscribe();
  }
}
