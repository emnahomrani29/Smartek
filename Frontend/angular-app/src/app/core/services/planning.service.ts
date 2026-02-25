import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Planning, PlanningRequest } from '../models/planning.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private apiUrl = `${environment.apiUrl}/plannings`;

  constructor(private http: HttpClient) {}

  getAllPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(this.apiUrl);
  }

  getPlanningById(id: number): Observable<Planning> {
    return this.http.get<Planning>(`${this.apiUrl}/${id}`);
  }

  getUpcomingPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(`${this.apiUrl}/upcoming`);
  }

  getPlanningsByDate(date: string): Observable<Planning[]> {
    return this.http.get<Planning[]>(`${this.apiUrl}/date/${date}`);
  }

  getPlanningsByDateRange(startDate: string, endDate: string): Observable<Planning[]> {
    return this.http.get<Planning[]>(`${this.apiUrl}/range?startDate=${startDate}&endDate=${endDate}`);
  }

  getPlanningsByDateAndType(date: string, eventType: string): Observable<Planning[]> {
    return this.http.get<Planning[]>(`${this.apiUrl}/date/${date}/type/${eventType}`);
  }

  createPlanning(planning: PlanningRequest): Observable<Planning> {
    // Ajouter les secondes au format de temps si nécessaire
    const formattedPlanning = {
      ...planning,
      startTime: this.formatTime(planning.startTime),
      endTime: this.formatTime(planning.endTime)
    };
    return this.http.post<Planning>(this.apiUrl, formattedPlanning);
  }

  private formatTime(time: string): string {
    // Si le temps est au format HH:mm, ajouter :00 pour les secondes
    if (time && time.length === 5) {
      return `${time}:00`;
    }
    return time;
  }

  updatePlanning(id: number, planning: PlanningRequest): Observable<Planning> {
    // Ajouter les secondes au format de temps si nécessaire
    const formattedPlanning = {
      ...planning,
      startTime: this.formatTime(planning.startTime),
      endTime: this.formatTime(planning.endTime)
    };
    return this.http.put<Planning>(`${this.apiUrl}/${id}`, formattedPlanning);
  }

  deletePlanning(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
