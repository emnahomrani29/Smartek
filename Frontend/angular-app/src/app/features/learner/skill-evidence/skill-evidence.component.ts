import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillEvidenceService } from '../../../core/services/skill-evidence.service';
import { AuthService } from '../../../core/services/auth.service';
import { SkillEvidenceRequest, SkillEvidenceResponse } from '../../../core/models/skill-evidence.model';

@Component({
  selector: 'app-skill-evidence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-evidence.component.html',
  styleUrls: ['./skill-evidence.component.css']
})
export class SkillEvidenceComponent implements OnInit {
  evidences: SkillEvidenceResponse[] = [];
  showModal = false;
  isEditMode = false;
  currentEvidence: SkillEvidenceRequest = this.getEmptyEvidence();
  currentEvidenceId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private skillEvidenceService: SkillEvidenceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvidences();
  }

  loadEvidences(): void {
    const user = this.authService.getUserInfo();
    if (user && user.userId) {
      this.loading = true;
      this.skillEvidenceService.getEvidenceByLearner(user.userId).subscribe({
        next: (data) => {
          this.evidences = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading evidences:', error);
          this.errorMessage = 'Erreur lors du chargement des preuves de compétences';
          this.loading = false;
        }
      });
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentEvidence = this.getEmptyEvidence();
    this.currentEvidenceId = null;
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditModal(evidence: SkillEvidenceResponse): void {
    this.isEditMode = true;
    this.currentEvidenceId = evidence.evidenceId;
    this.currentEvidence = {
      title: evidence.title,
      fileUrl: evidence.fileUrl,
      description: evidence.description,
      learnerId: evidence.learnerId,
      learnerName: evidence.learnerName,
      learnerEmail: evidence.learnerEmail,
      category: evidence.category // Task 19.3: Pre-select current category
    };
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.currentEvidence = this.getEmptyEvidence();
    this.currentEvidenceId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveEvidence(): void {
    if (!this.validateForm()) {
      return;
    }

    const user = this.authService.getUserInfo();
    if (!user) {
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    // Remplir les informations de l'apprenant
    this.currentEvidence.learnerId = user.userId;
    this.currentEvidence.learnerName = user.firstName;
    this.currentEvidence.learnerEmail = user.email;

    this.loading = true;

    if (this.isEditMode && this.currentEvidenceId) {
      // Mode édition
      this.skillEvidenceService.updateEvidence(this.currentEvidenceId, this.currentEvidence).subscribe({
        next: () => {
          this.successMessage = 'Preuve de compétence mise à jour avec succès';
          this.loadEvidences();
          setTimeout(() => this.closeModal(), 1500);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating evidence:', error);
          this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour';
          this.loading = false;
        }
      });
    } else {
      // Mode création
      this.skillEvidenceService.createEvidence(this.currentEvidence).subscribe({
        next: () => {
          this.successMessage = 'Preuve de compétence ajoutée avec succès';
          this.loadEvidences();
          setTimeout(() => this.closeModal(), 1500);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating evidence:', error);
          this.errorMessage = error.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }

  deleteEvidence(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette preuve de compétence ?')) {
      this.loading = true;
      this.skillEvidenceService.deleteEvidence(id).subscribe({
        next: () => {
          this.successMessage = 'Preuve de compétence supprimée avec succès';
          this.loadEvidences();
          setTimeout(() => this.successMessage = '', 3000);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting evidence:', error);
          this.errorMessage = 'Erreur lors de la suppression';
          setTimeout(() => this.errorMessage = '', 3000);
          this.loading = false;
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.currentEvidence.title || this.currentEvidence.title.trim() === '') {
      this.errorMessage = 'Le titre est obligatoire';
      return false;
    }
    // Task 19.1: Validate category selection
    if (!this.currentEvidence.category) {
      this.errorMessage = 'La catégorie est obligatoire';
      return false;
    }
    return true;
  }

  getEmptyEvidence(): SkillEvidenceRequest {
    return {
      title: '',
      fileUrl: '',
      description: '',
      learnerId: 0,
      learnerName: '',
      learnerEmail: '',
      category: undefined // Task 19.1: Initialize category
    };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Task 18.1: Get status badge class
  getStatusBadgeClass(status: string): string {
    const badgeClasses: { [key: string]: string } = {
      'PENDING': 'badge-warning',
      'APPROVED': 'badge-success',
      'REJECTED': 'badge-danger'
    };
    return badgeClasses[status] || 'badge-secondary';
  }

  // Task 18.4: Check if score should be shown
  shouldShowScore(evidence: SkillEvidenceResponse): boolean {
    return evidence.status === 'APPROVED' && evidence.score !== null && evidence.score !== undefined;
  }
}
