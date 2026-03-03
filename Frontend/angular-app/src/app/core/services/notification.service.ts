import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8089/api/notifications';

  constructor(private http: HttpClient) {}

  getUnreadNotifications(learnerId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/learner/${learnerId}/unread`);
  }

  getAllNotifications(learnerId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/learner/${learnerId}`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(learnerId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/learner/${learnerId}/read-all`, {});
  }

  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${notificationId}`);
  }
}
