import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningStyleService } from '../../../core/services/learning-style.service';
import { AuthService } from '../../../core/services/auth.service';
import { LearningStylePreferenceRequest, LearningStylePreferenceResponse, LearningStyleType } from '../../../core/models/learning-style.model';

@Component({
  selector: 'app-learning-style',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning-style.component.html',
  styleUrls: ['./learning-style.component.css']
})
export class LearningStyleComponent implements OnInit {
  preference: LearningStylePreferenceResponse | null = null;
  showModal = false;
  isEditMode = false;
  currentPreference: LearningStylePreferenceRequest = this.getEmptyPreference();
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Enum pour le template
  learningStyleTypes = Object.values(LearningStyleType);
  
  // Descriptions des styles d'apprentissage
  styleDescriptions = {
    [LearningStyleType.VISUAL]: 'Vous apprenez mieux avec des images, diagrammes et vidéos',
    [LearningStyleType.AUDITORY]: 'Vous apprenez mieux en écoutant et en discutant',
    [LearningStyleType.READ_WRITE]: 'Vous apprenez mieux en lisant et en écrivant',
    [LearningStyleType.KINESTHETIC]: 'Vous apprenez mieux par la pratique et l\'expérimentation',
    [LearningStyleType.MULTIMODAL]: 'Vous apprenez avec une combinaison de plusieurs styles'
  };

  constructor(
    private learningStyleService: LearningStyleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('LearningStyleComponent loaded!');
    console.log('User info:', this.authService.getUserInfo());
    this.loadPreference();
  }

  loadPreference(): void {
    console.log('loadPreference called');
    const user = this.authService.getUserInfo();
    console.log('User from auth:', user);
    if (user && user.userId) {
      console.log('Loading preference for userId:', user.userId);
      this.loading = true;
      this.learningStyleService.getPreferenceByLearner(user.userId).subscribe({
        next: (data) => {
          console.log('Preference loaded:', data);
          this.preference = data;
          this.loading = false;
        },
        error: (error) => {
          console.log('Error loading preference:', error);
          if (error.status === 404) {
            // Pas de préférence trouvée, c'est normal
            console.log('No preference found (404) - this is normal for first time');
            this.preference = null;
          } else {
            console.error('Error loading preference:', error);
            this.errorMessage = 'Erreur lors du chargement de vos préférences';
          }
          this.loading = false;
        }
      });
    } else {
      console.log('No user or no userId found');
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentPreference = this.getEmptyPreference();
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditModal(): void {
    if (!this.preference) return;
    
    this.isEditMode = true;
    this.currentPreference = {
      preferredStyle: this.preference.preferredStyle,
      videoPreferred: this.preference.videoPreferred,
      textPreferred: this.preference.textPreferred,
      practicalWorkPreferred: this.preference.practicalWorkPreferred,
      learnerId: this.preference.learnerId,
      learnerName: this.preference.learnerName
    };
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.currentPreference = this.getEmptyPreference();
    this.errorMessage = '';
    this.successMessage = '';
  }

  savePreference(): void {
    if (!this.validateForm()) {
      return;
    }

    const user = this.authService.getUserInfo();
    if (!user) {
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    // Remplir les informations de l'apprenant
    this.currentPreference.learnerId = user.userId;
    this.currentPreference.learnerName = user.firstName;

    this.loading = true;

    this.learningStyleService.savePreference(this.currentPreference).subscribe({
      next: () => {
        this.successMessage = this.isEditMode 
          ? 'Préférences mises à jour avec succès' 
          : 'Préférences ajoutées avec succès';
        this.loadPreference();
        setTimeout(() => this.closeModal(), 1500);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error saving preference:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la sauvegarde';
        this.loading = false;
      }
    });
  }

  deletePreference(): void {
    if (!this.preference) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer vos préférences d\'apprentissage ?')) {
      this.loading = true;
      this.learningStyleService.deletePreference(this.preference.learnerId).subscribe({
        next: () => {
          this.successMessage = 'Préférences supprimées avec succès';
          this.preference = null;
          setTimeout(() => this.successMessage = '', 3000);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting preference:', error);
          this.errorMessage = 'Erreur lors de la suppression';
          setTimeout(() => this.errorMessage = '', 3000);
          this.loading = false;
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.currentPreference.preferredStyle) {
      this.errorMessage = 'Veuillez sélectionner un style d\'apprentissage';
      return false;
    }
    return true;
  }

  getEmptyPreference(): LearningStylePreferenceRequest {
    return {
      preferredStyle: LearningStyleType.VISUAL,
      videoPreferred: false,
      textPreferred: false,
      practicalWorkPreferred: false,
      learnerId: 0,
      learnerName: ''
    };
  }

  getStyleIcon(style: LearningStyleType): string {
    const icons = {
      [LearningStyleType.VISUAL]: 'visibility',
      [LearningStyleType.AUDITORY]: 'hearing',
      [LearningStyleType.READ_WRITE]: 'menu_book',
      [LearningStyleType.KINESTHETIC]: 'touch_app',
      [LearningStyleType.MULTIMODAL]: 'apps'
    };
    return icons[style];
  }

  getStyleLabel(style: LearningStyleType): string {
    const labels = {
      [LearningStyleType.VISUAL]: 'Visuel',
      [LearningStyleType.AUDITORY]: 'Auditif',
      [LearningStyleType.READ_WRITE]: 'Lecture/Écriture',
      [LearningStyleType.KINESTHETIC]: 'Kinesthésique',
      [LearningStyleType.MULTIMODAL]: 'Multimodal'
    };
    return labels[style];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
