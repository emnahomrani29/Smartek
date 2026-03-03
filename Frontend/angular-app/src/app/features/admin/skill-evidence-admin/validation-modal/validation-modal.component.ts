import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillEvidenceService } from '../../../../core/services/skill-evidence.service';
import { SkillEvidenceResponse } from '../../../../core/models/skill-evidence.model';

@Component({
  selector: 'app-validation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.css']
})
export class ValidationModalComponent {
  @Input() evidence: SkillEvidenceResponse | null = null;
  @Input() defaultAction: 'approve' | 'reject' | 'review' = 'review';
  @Output() onValidated = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  // Task 21.2: Form fields
  score: number = 50;
  adminComment: string = '';
  validationError: string = '';
  loading = false;

  constructor(private skillEvidenceService: SkillEvidenceService) {}

  // Task 21.4: Approve method
  approve(): void {
    if (!this.evidence) {
      return;
    }

    // Validate score range
    if (this.score < 0 || this.score > 100) {
      this.validationError = 'Le score doit être entre 0 et 100';
      return;
    }

    this.loading = true;
    this.validationError = '';

    this.skillEvidenceService.approveEvidence(this.evidence.evidenceId, this.score, this.adminComment).subscribe({
      next: () => {
        this.loading = false;
        this.onValidated.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error approving evidence:', error);
        this.validationError = error.error?.message || 'Erreur lors de l\'approbation';
        this.loading = false;
      }
    });
  }

  // Task 21.6: Reject method
  reject(): void {
    if (!this.evidence) {
      return;
    }

    // Validate non-empty comment
    if (!this.adminComment || this.adminComment.trim() === '') {
      this.validationError = 'Un commentaire est requis pour le rejet';
      return;
    }

    this.loading = true;
    this.validationError = '';

    this.skillEvidenceService.rejectEvidence(this.evidence.evidenceId, this.adminComment).subscribe({
      next: () => {
        this.loading = false;
        this.onValidated.emit();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error rejecting evidence:', error);
        this.validationError = error.error?.message || 'Erreur lors du rejet';
        this.loading = false;
      }
    });
  }

  // Review method (combined approve/reject)
  review(action: 'approve' | 'reject'): void {
    if (action === 'approve') {
      this.approve();
    } else {
      this.reject();
    }
  }

  closeModal(): void {
    this.score = 50;
    this.adminComment = '';
    this.validationError = '';
    this.onClose.emit();
  }
}
