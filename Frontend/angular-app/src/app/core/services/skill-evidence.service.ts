import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkillEvidenceRequest, SkillEvidenceResponse, LearnerAnalytics, GlobalAnalytics } from '../models/skill-evidence.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillEvidenceService {
  private apiUrl = `${environment.apiUrl}/skill-evidence`;

  constructor(private http: HttpClient) {}

  // Créer une nouvelle preuve de compétence
  createEvidence(request: SkillEvidenceRequest): Observable<SkillEvidenceResponse> {
    return this.http.post<SkillEvidenceResponse>(this.apiUrl, request);
  }

  // Récupérer toutes les preuves d'un apprenant
  getEvidenceByLearner(learnerId: number): Observable<SkillEvidenceResponse[]> {
    return this.http.get<SkillEvidenceResponse[]>(`${this.apiUrl}/learner/${learnerId}`);
  }

  // Récupérer toutes les preuves (pour admin)
  getAllEvidence(): Observable<SkillEvidenceResponse[]> {
    return this.http.get<SkillEvidenceResponse[]>(this.apiUrl);
  }

  // Récupérer une preuve par ID
  getEvidenceById(id: number): Observable<SkillEvidenceResponse> {
    return this.http.get<SkillEvidenceResponse>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour une preuve
  updateEvidence(id: number, request: SkillEvidenceRequest): Observable<SkillEvidenceResponse> {
    return this.http.put<SkillEvidenceResponse>(`${this.apiUrl}/${id}`, request);
  }

  // Supprimer une preuve
  deleteEvidence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ========== VALIDATION METHODS ==========

  // Approuver une preuve avec un score
  approveEvidence(id: number, score: number, adminComment?: string): Observable<SkillEvidenceResponse> {
    return this.http.post<SkillEvidenceResponse>(`${this.apiUrl}/${id}/approve`, { score, adminComment });
  }

  // Rejeter une preuve avec un commentaire
  rejectEvidence(id: number, adminComment: string): Observable<SkillEvidenceResponse> {
    return this.http.post<SkillEvidenceResponse>(`${this.apiUrl}/${id}/reject`, { adminComment });
  }

  // Réviser une preuve (approuver ou rejeter avec détails)
  reviewEvidence(id: number, status: string, score?: number, adminComment?: string): Observable<SkillEvidenceResponse> {
    return this.http.put<SkillEvidenceResponse>(`${this.apiUrl}/${id}/review`, { status, score, adminComment });
  }

  // ========== ANALYTICS METHODS ==========

  // Obtenir les analytics d'un apprenant
  getLearnerAnalytics(learnerId: number): Observable<LearnerAnalytics> {
    return this.http.get<LearnerAnalytics>(`${this.apiUrl}/analytics/learner/${learnerId}`);
  }

  // Obtenir les analytics globales
  getGlobalAnalytics(): Observable<GlobalAnalytics> {
    return this.http.get<GlobalAnalytics>(`${this.apiUrl}/analytics/global`);
  }

  // ========== FILTER METHODS ==========

  // Filtrer les preuves par statut
  getEvidenceByStatus(status: string): Observable<SkillEvidenceResponse[]> {
    return this.http.get<SkillEvidenceResponse[]>(`${this.apiUrl}/status/${status}`);
  }

  // Filtrer les preuves par catégorie
  getEvidenceByCategory(category: string): Observable<SkillEvidenceResponse[]> {
    return this.http.get<SkillEvidenceResponse[]>(`${this.apiUrl}/category/${category}`);
  }
}
