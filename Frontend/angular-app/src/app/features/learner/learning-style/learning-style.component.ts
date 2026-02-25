// features/learner/learning-style/learning-style.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LearningStyleService } from '../../../core/services/learning-style.service';
import { 
    LearningStyleType, 
    LearningStyleLabels, 
    LearningStyleDescriptions,
    LearningStyleIcons,
    LearningStyleColors,
    LearningStylePreference 
} from '../../../core/models/learning-style.model';

@Component({
    selector: 'app-learning-style',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './learning-style.component.html',
    styleUrls: ['./learning-style.component.scss']
})
export class LearningStyleComponent implements OnInit {
    isLoading = true;
    isSubmitting = false;
    hasPreferences = false;
    showResetConfirm = false;
    showDeleteConfirm = false;
    errorMessage = '';
    
    isViewMode = true;

    styleForm: FormGroup;
    learningStyleTypes = Object.values(LearningStyleType);
    
    styleLabels = LearningStyleLabels;
    styleDescriptions = LearningStyleDescriptions;
    styleIcons = LearningStyleIcons;
    styleColors = LearningStyleColors;
    
    currentPreferences: LearningStylePreference | null = null;

    constructor(
        private fb: FormBuilder,
        private learningStyleService: LearningStyleService,
        private router: Router
    ) {
        this.styleForm = this.fb.group({
            preferredStyle: ['', Validators.required],
            videoPreferred: [false],
            textPreferred: [false],
            practicalWorkPreferred: [false]
        });
    }

    ngOnInit(): void {
        this.loadPreferences();
    }

    loadPreferences(): void {
        this.isLoading = true;
        this.errorMessage = '';
        
        this.learningStyleService.getPreferences().subscribe({
            next: (preferences) => {
                console.log('Préférences chargées:', preferences);
                this.hasPreferences = true;
                this.currentPreferences = preferences;
                this.styleForm.patchValue({
                    preferredStyle: preferences.preferredStyle,
                    videoPreferred: preferences.videoPreferred,
                    textPreferred: preferences.textPreferred,
                    practicalWorkPreferred: preferences.practicalWorkPreferred
                });
                this.isViewMode = true;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Erreur chargement:', error);
                if (error.status === 404) {
                    console.log('Aucune préférence trouvée, mode création');
                    this.hasPreferences = false;
                    this.isViewMode = false;
                    this.styleForm.patchValue({
                        preferredStyle: LearningStyleType.VISUAL,
                        videoPreferred: true,
                        textPreferred: false,
                        practicalWorkPreferred: false
                    });
                } else {
                    this.errorMessage = 'Erreur de chargement: ' + (error.error?.message || error.message);
                }
                this.isLoading = false;
            }
        });
    }

    editMode(): void {
        this.isViewMode = false;
    }

    cancelEdit(): void {
        if (this.currentPreferences) {
            this.styleForm.patchValue({
                preferredStyle: this.currentPreferences.preferredStyle,
                videoPreferred: this.currentPreferences.videoPreferred,
                textPreferred: this.currentPreferences.textPreferred,
                practicalWorkPreferred: this.currentPreferences.practicalWorkPreferred
            });
        }
        this.isViewMode = true;
    }

    deletePreferences(): void {
        this.showDeleteConfirm = true;
    }

    confirmDelete(): void {
        this.isSubmitting = true;
        this.learningStyleService.deletePreferences().subscribe({
            next: () => {
                console.log('Préférences supprimées');
                this.hasPreferences = false;
                this.currentPreferences = null;
                this.isViewMode = false;
                this.showDeleteConfirm = false;
                this.isSubmitting = false;
                this.styleForm.patchValue({
                    preferredStyle: LearningStyleType.VISUAL,
                    videoPreferred: true,
                    textPreferred: false,
                    practicalWorkPreferred: false
                });
            },
            error: (error) => {
                console.error('Erreur suppression:', error);
                this.errorMessage = 'Erreur lors de la suppression';
                this.showDeleteConfirm = false;
                this.isSubmitting = false;
            }
        });
    }

    cancelDelete(): void {
        this.showDeleteConfirm = false;
    }

    onSubmit(): void {
        if (this.styleForm.invalid) {
            console.log('Formulaire invalide:', this.styleForm.errors);
            return;
        }

        this.isSubmitting = true;
        this.errorMessage = '';
        
        const preferences = this.styleForm.value;

        if (!preferences.preferredStyle) {
            this.errorMessage = 'Le style préféré est requis';
            this.isSubmitting = false;
            return;
        }

        const request = this.hasPreferences 
            ? this.learningStyleService.updatePreferences(preferences)
            : this.learningStyleService.createPreferences(preferences);

        request.subscribe({
            next: (response) => {
                console.log('Succès! Réponse:', response);
                this.hasPreferences = true;
                this.currentPreferences = response;
                this.isViewMode = true;
                this.isSubmitting = false;
            },
            error: (error) => {
                console.error('ERREUR COMPLÈTE:', error);
                if (error.status === 400) {
                    this.errorMessage = 'Données invalides: ' + JSON.stringify(error.error);
                } else if (error.status === 401) {
                    this.errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
                } else if (error.status === 403) {
                    this.errorMessage = 'Accès interdit. Vérifiez vos permissions.';
                } else if (error.status === 500) {
                    this.errorMessage = 'Erreur serveur. Vérifiez les logs backend.';
                } else {
                    this.errorMessage = 'Erreur inconnue: ' + (error.error?.message || error.message);
                }
                this.isSubmitting = false;
            }
        });
    }

    resetToDefault(): void {
        this.showResetConfirm = true;
    }

    confirmReset(): void {
        this.isSubmitting = true;
        this.learningStyleService.resetToDefault().subscribe({
            next: () => {
                console.log('Reset réussi');
                this.loadPreferences();
                this.showResetConfirm = false;
                this.isSubmitting = false;
                this.isViewMode = true;
            },
            error: (error) => {
                console.error('Erreur reset:', error);
                this.errorMessage = 'Erreur lors de la réinitialisation';
                this.isSubmitting = false;
                this.showResetConfirm = false;
            }
        });
    }

    cancelReset(): void {
        this.showResetConfirm = false;
    }

    getStyleColor(style: string): string {
        return this.styleColors[style as LearningStyleType] || '#757575';
    }

    goBack(): void {
        this.router.navigate(['/learner/dashboard']);
    }
}