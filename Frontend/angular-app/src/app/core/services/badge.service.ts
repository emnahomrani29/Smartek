import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BadgeTemplate, EarnedBadge, AwardBadgeRequest, BulkAwardBadgeRequest } from '../models/badge.model';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private apiUrl = 'http://localhost:8083/api/certifications-badges/badge-templates';
  private earnedApiUrl = 'http://localhost:8083/api/certifications-badges/earned-badges';

  constructor(private http: HttpClient) {}

  // Badge Template CRUD
  getAllTemplates(): Observable<BadgeTemplate[]> {
    return this.http.get<BadgeTemplate[]>(this.apiUrl);
  }

  getActiveTemplates(): Observable<BadgeTemplate[]> {
    return this.http.get<BadgeTemplate[]>(`${this.apiUrl}/active`);
  }

  getTemplateById(id: number): Observable<BadgeTemplate> {
    return this.http.get<BadgeTemplate>(`${this.apiUrl}/${id}`);
  }

  createTemplate(template: BadgeTemplate): Observable<BadgeTemplate> {
    return this.http.post<BadgeTemplate>(this.apiUrl, template);
  }

  updateTemplate(id: number, template: BadgeTemplate): Observable<BadgeTemplate> {
    return this.http.put<BadgeTemplate>(`${this.apiUrl}/${id}`, template);
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Earned Badges
  getAllEarnedBadges(): Observable<EarnedBadge[]> {
    return this.http.get<EarnedBadge[]>(this.earnedApiUrl);
  }

  getEarnedBadgeById(id: number): Observable<EarnedBadge> {
    return this.http.get<EarnedBadge>(`${this.earnedApiUrl}/${id}`);
  }

  getBadgesByLearner(learnerId: number): Observable<EarnedBadge[]> {
    return this.http.get<EarnedBadge[]>(`${this.earnedApiUrl}/learner/${learnerId}`);
  }

  getBadgesByTemplate(templateId: number): Observable<EarnedBadge[]> {
    return this.http.get<EarnedBadge[]>(`${this.earnedApiUrl}/template/${templateId}`);
  }

  awardBadge(request: AwardBadgeRequest): Observable<EarnedBadge> {
    return this.http.post<EarnedBadge>(this.earnedApiUrl, request);
  }

  bulkAwardBadge(request: BulkAwardBadgeRequest): Observable<any> {
    return this.http.post<any>(`${this.earnedApiUrl}/award/bulk`, request);
  }

  revokeBadge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.earnedApiUrl}/${id}`);
  }
}
