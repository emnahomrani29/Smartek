import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SkillEvidence } from '../models/skill-evidence.model';

@Injectable({
  providedIn: 'root'
})
export class SkillEvidenceService {
  // match the path defined in `SkillEvidenceController`
  private apiUrl = 'http://localhost:8081/api/skill-evidence';

  constructor(private http: HttpClient) { }


  getSkillEvidences(): Observable<SkillEvidence[]> {
    // convert backend DTO to client model and map dates
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(list => (list || []).map(e => ({
        evidenceId: e.evidenceId,
        title: e.title,
        fileUrl: e.fileUrl,
        description: e.description,
        uploadDate: e.uploadDate ? new Date(e.uploadDate) : undefined,
        user: {
          userId: e.userId,
          email: e.userEmail,
          fullName: e.userFirstName
        }
      } as SkillEvidence)))
    );
  }


  getSkillEvidenceById(evidenceId: number): Observable<SkillEvidence> {
    return this.http.get<SkillEvidence>(`${this.apiUrl}/${evidenceId}`);
  }

  createSkillEvidence(evidence: SkillEvidence): Observable<SkillEvidence> {
    // backend ignores uploadDate on create but also expects date format yyyy-MM-dd
    const payload: any = { ...evidence };
    if (payload.uploadDate) {
      // convert Date to plain ISO date string (no time)
      const d = new Date(payload.uploadDate);
      payload.uploadDate = d.toISOString().split('T')[0];
    } else {
      delete payload.uploadDate;
    }
    return this.http.post<SkillEvidence>(this.apiUrl, payload);
  }


  updateSkillEvidence(evidenceId: number, evidence: SkillEvidence): Observable<SkillEvidence> {
    const payload: any = { ...evidence };
    if (payload.uploadDate) {
      const d = new Date(payload.uploadDate);
      payload.uploadDate = d.toISOString().split('T')[0];
    } else {
      delete payload.uploadDate;
    }
    return this.http.put<SkillEvidence>(`${this.apiUrl}/${evidenceId}`, payload);
  }


  deleteSkillEvidence(evidenceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${evidenceId}`);
  }
}
