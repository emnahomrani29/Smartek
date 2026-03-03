import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { LearningStylePreferenceRequest, LearningStylePreferenceResponse, LearningStylePreference } from '../models/learning-style.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LearningStyleService {
  private apiUrl = `${environment.learningApiUrl}/learning-style-preferences`;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private cache: {
    data: LearningStylePreference[] | null;
    timestamp: number | null;
  } = { data: null, timestamp: null };

  constructor(private http: HttpClient) {}

  // Créer ou mettre à jour une préférence (upsert)
  savePreference(request: LearningStylePreferenceRequest): Observable<LearningStylePreferenceResponse> {
    return this.http.post<LearningStylePreferenceResponse>(this.apiUrl, request);
  }

  // Récupérer la préférence d'un apprenant
  getPreferenceByLearner(learnerId: number): Observable<LearningStylePreferenceResponse> {
    return this.http.get<LearningStylePreferenceResponse>(`${this.apiUrl}/learner/${learnerId}`);
  }

  // Vérifier si une préférence existe
  existsForLearner(learnerId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/learner/${learnerId}/exists`);
  }

  // Supprimer une préférence
  deletePreference(learnerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/learner/${learnerId}`);
  }

  // Récupérer toutes les préférences d'apprentissage avec cache et retry logic
  getAllLearningStyles(forceRefresh = false): Observable<LearningStylePreference[]> {
    // Check cache validity if not forcing refresh
    if (!forceRefresh && this.isCacheValid()) {
      return of(this.cache.data!);
    }

    // Fetch from API with retry logic
    return this.fetchFromApi();
  }

  private isCacheValid(): boolean {
    if (!this.cache.data || !this.cache.timestamp) {
      return false;
    }

    const age = Date.now() - this.cache.timestamp;
    return age < this.CACHE_DURATION;
  }

  private fetchFromApi(): Observable<LearningStylePreference[]> {
    return this.http.get<LearningStylePreference[]>(this.apiUrl).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          // Exponential backoff: 2^retryCount seconds (1s, 2s, 4s)
          const delayMs = Math.pow(2, retryCount) * 1000;
          return timer(delayMs);
        }
      }),
      tap(data => this.updateCache(data)),
      catchError(error => this.handleError(error))
    );
  }

  private updateCache(data: LearningStylePreference[]): void {
    this.cache = {
      data,
      timestamp: Date.now()
    };
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.status === 0) {
      // Network error
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    } else if (error.status === 404) {
      // Not found
      errorMessage = 'The learning styles service is currently unavailable.';
    } else if (error.status === 500) {
      // Server error
      errorMessage = 'A server error occurred. Please try again later.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    console.error('LearningStyleService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
