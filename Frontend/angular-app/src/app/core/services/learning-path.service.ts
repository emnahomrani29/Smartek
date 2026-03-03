import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningPathRequest, LearningPathResponse } from '../models/learning-path.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LearningPathService {
  private apiUrl = `${environment.learningApiUrl}/learning-paths`;

  constructor(private http: HttpClient) {}

  createPath(request: LearningPathRequest): Observable<LearningPathResponse> {
    return this.http.post<LearningPathResponse>(this.apiUrl, request);
  }

  getPathsByLearner(learnerId: number): Observable<LearningPathResponse[]> {
    return this.http.get<LearningPathResponse[]>(`${this.apiUrl}/learner/${learnerId}`);
  }

  getAllPaths(): Observable<LearningPathResponse[]> {
    return this.http.get<LearningPathResponse[]>(this.apiUrl);
  }

  getPathById(pathId: number): Observable<LearningPathResponse> {
    return this.http.get<LearningPathResponse>(`${this.apiUrl}/${pathId}`);
  }

  updatePath(pathId: number, request: LearningPathRequest): Observable<LearningPathResponse> {
    return this.http.put<LearningPathResponse>(`${this.apiUrl}/${pathId}`, request);
  }

  deletePath(pathId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pathId}`);
  }
}
