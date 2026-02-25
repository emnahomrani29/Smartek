// core/services/learning-style.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningStylePreference } from '../models/learning-style.model';

@Injectable({
    providedIn: 'root'
})
export class LearningStyleService {
    private apiUrl = 'http://localhost:8081/api/learning-styles';

    constructor(private http: HttpClient) {}

    // Récupérer les préférences
    getPreferences(): Observable<LearningStylePreference> {
        return this.http.get<LearningStylePreference>(this.apiUrl);
    }

    // Créer les préférences
    createPreferences(preferences: LearningStylePreference): Observable<LearningStylePreference> {
        return this.http.post<LearningStylePreference>(this.apiUrl, preferences);
    }

    // Mettre à jour les préférences
    updatePreferences(preferences: LearningStylePreference): Observable<LearningStylePreference> {
        return this.http.put<LearningStylePreference>(this.apiUrl, preferences);
    }

    // Réinitialiser aux valeurs par défaut
    resetToDefault(): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/reset`);
    }

    // Supprimer les préférences
    deletePreferences(): Observable<void> {
        return this.http.delete<void>(this.apiUrl);
    }
}