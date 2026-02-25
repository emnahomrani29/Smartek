import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CertificationTemplate, EarnedCertification, AwardCertificationRequest, BulkAwardCertificationRequest } from '../models/certification.model';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {
  private apiUrl = 'http://localhost:8083/api/certifications-badges/certification-templates';
  private earnedApiUrl = 'http://localhost:8083/api/certifications-badges/earned-certifications';

  constructor(private http: HttpClient) {}

  // Certification Template CRUD
  getAllTemplates(): Observable<CertificationTemplate[]> {
    return this.http.get<CertificationTemplate[]>(this.apiUrl);
  }

  getActiveTemplates(): Observable<CertificationTemplate[]> {
    return this.http.get<CertificationTemplate[]>(`${this.apiUrl}/active`);
  }

  getTemplateById(id: number): Observable<CertificationTemplate> {
    return this.http.get<CertificationTemplate>(`${this.apiUrl}/${id}`);
  }

  createTemplate(template: CertificationTemplate): Observable<CertificationTemplate> {
    return this.http.post<CertificationTemplate>(this.apiUrl, template);
  }

  updateTemplate(id: number, template: CertificationTemplate): Observable<CertificationTemplate> {
    return this.http.put<CertificationTemplate>(`${this.apiUrl}/${id}`, template);
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Earned Certifications
  getAllEarnedCertifications(): Observable<EarnedCertification[]> {
    return this.http.get<EarnedCertification[]>(this.earnedApiUrl);
  }

  getEarnedCertificationById(id: number): Observable<EarnedCertification> {
    return this.http.get<EarnedCertification>(`${this.earnedApiUrl}/${id}`);
  }

  getCertificationsByLearner(learnerId: number): Observable<EarnedCertification[]> {
    return this.http.get<EarnedCertification[]>(`${this.earnedApiUrl}/learner/${learnerId}`);
  }

  getCertificationsByTemplate(templateId: number): Observable<EarnedCertification[]> {
    return this.http.get<EarnedCertification[]>(`${this.earnedApiUrl}/template/${templateId}`);
  }

  awardCertification(request: AwardCertificationRequest): Observable<EarnedCertification> {
    return this.http.post<EarnedCertification>(this.earnedApiUrl, request);
  }

  bulkAwardCertification(request: BulkAwardCertificationRequest): Observable<any> {
    return this.http.post<any>(`${this.earnedApiUrl}/award/bulk`, request);
  }

  revokeCertification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.earnedApiUrl}/${id}`);
  }
}
