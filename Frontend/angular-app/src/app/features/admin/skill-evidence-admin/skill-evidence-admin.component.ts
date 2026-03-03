import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillEvidenceService } from '../../../core/services/skill-evidence.service';
import { SkillEvidenceResponse } from '../../../core/models/skill-evidence.model';
import { ValidationModalComponent } from './validation-modal/validation-modal.component';

@Component({
  selector: 'app-skill-evidence-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ValidationModalComponent],
  templateUrl: './skill-evidence-admin.component.html',
  styleUrls: ['./skill-evidence-admin.component.css']
})
export class SkillEvidenceAdminComponent implements OnInit {
  evidences: SkillEvidenceResponse[] = [];
  filteredEvidences: SkillEvidenceResponse[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';
  
  // Task 23: Filter state
  selectedStatus: string = '';
  selectedCategory: string = '';
  
  // Task 22.2 & 22.3: Validation modal state
  showValidationModal = false;
  selectedEvidence: SkillEvidenceResponse | null = null;
  modalDefaultAction: 'approve' | 'reject' | 'review' = 'review';

  constructor(private skillEvidenceService: SkillEvidenceService) {}

  ngOnInit(): void {
    this.loadAllEvidences();
  }

  loadAllEvidences(): void {
    this.loading = true;
    console.log('Loading all evidences...');
    this.skillEvidenceService.getAllEvidence().subscribe({
      next: (data) => {
        console.log('Evidences loaded:', data);
        this.evidences = data;
        this.filteredEvidences = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading evidences:', error);
        this.errorMessage = 'Error loading skill evidences: ' + (error.message || error.status);
        this.loading = false;
      }
    });
  }

  filterEvidences(): void {
    this.applyFilters();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTotalEvidences(): number {
    return this.evidences.length;
  }

  getUniqueLearners(): number {
    const uniqueLearnerIds = new Set(this.evidences.map(e => e.learnerId));
    return uniqueLearnerIds.size;
  }

  // Task 22.2: Open validation modal
  openValidationModal(evidence: SkillEvidenceResponse, action: 'approve' | 'reject' | 'review'): void {
    this.selectedEvidence = evidence;
    this.modalDefaultAction = action;
    this.showValidationModal = true;
  }

  // Close validation modal
  closeValidationModal(): void {
    this.showValidationModal = false;
    this.selectedEvidence = null;
    this.modalDefaultAction = 'review';
  }

  // Handle validation completion
  onValidationComplete(): void {
    this.loadAllEvidences();
    this.closeValidationModal();
  }

  // Get status badge class
  getStatusBadgeClass(status: string): string {
    const badgeClasses: { [key: string]: string } = {
      'PENDING': 'badge-warning',
      'APPROVED': 'badge-success',
      'REJECTED': 'badge-danger'
    };
    return badgeClasses[status] || 'badge-secondary';
  }

  // Task 23.3: Filter by status
  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (!status) {
      this.loadAllEvidences();
      return;
    }

    this.loading = true;
    this.skillEvidenceService.getEvidenceByStatus(status).subscribe({
      next: (data) => {
        this.evidences = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering by status:', error);
        this.errorMessage = 'Error filtering evidences';
        this.loading = false;
      }
    });
  }

  // Task 23.5: Filter by category
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (!category) {
      this.loadAllEvidences();
      return;
    }

    this.loading = true;
    this.skillEvidenceService.getEvidenceByCategory(category).subscribe({
      next: (data) => {
        this.evidences = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error filtering by category:', error);
        this.errorMessage = 'Error filtering evidences';
        this.loading = false;
      }
    });
  }

  // Apply search filter on top of status/category filters
  applyFilters(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEvidences = this.evidences;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredEvidences = this.evidences.filter(evidence =>
      evidence.title.toLowerCase().includes(term) ||
      evidence.learnerName.toLowerCase().includes(term) ||
      (evidence.description && evidence.description.toLowerCase().includes(term))
    );
  }

  // Clear all filters
  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.searchTerm = '';
    this.loadAllEvidences();
  }
}
