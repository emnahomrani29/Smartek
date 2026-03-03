import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPathService } from '../../../core/services/learning-path.service';
import { AuthService } from '../../../core/services/auth.service';
import { LearningPathRequest, LearningPathResponse, LearningPathStatus } from '../../../core/models/learning-path.model';

@Component({
  selector: 'app-learning-path',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.css']
})
export class LearningPathComponent implements OnInit {
  paths: LearningPathResponse[] = [];
  showModal = false;
  isEditMode = false;
  currentPath: LearningPathRequest = this.getEmptyPath();
  editingPathId: number | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';

  // Enum pour le template
  pathStatuses = Object.values(LearningPathStatus);

  constructor(
    private learningPathService: LearningPathService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPaths();
  }

  loadPaths(): void {
    const user = this.authService.getUserInfo();
    if (user && user.userId) {
      this.loading = true;
      this.learningPathService.getPathsByLearner(user.userId).subscribe({
        next: (data) => {
          this.paths = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading paths:', error);
          this.errorMessage = 'Error loading paths';
          this.loading = false;
        }
      });
    }
  }

  get filteredPaths(): LearningPathResponse[] {
    if (!this.searchTerm) {
      return this.paths;
    }
    const term = this.searchTerm.toLowerCase();
    return this.paths.filter(path =>
      path.title.toLowerCase().includes(term) ||
      path.description?.toLowerCase().includes(term) ||
      path.status.toLowerCase().includes(term)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentPath = this.getEmptyPath();
    this.editingPathId = null;
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditModal(path: LearningPathResponse): void {
    this.isEditMode = true;
    this.editingPathId = path.pathId;
    this.currentPath = {
      title: path.title,
      description: path.description,
      learnerId: path.learnerId,
      learnerName: path.learnerName,
      status: path.status,
      startDate: path.startDate,
      endDate: path.endDate,
      progress: path.progress
    };
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.currentPath = this.getEmptyPath();
    this.editingPathId = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  savePath(): void {
    if (!this.validateForm()) {
      return;
    }

    const user = this.authService.getUserInfo();
    if (!user) {
      this.errorMessage = 'User not logged in';
      return;
    }

    this.currentPath.learnerId = user.userId;
    this.currentPath.learnerName = user.firstName;

    this.loading = true;

    if (this.isEditMode && this.editingPathId) {
      this.learningPathService.updatePath(this.editingPathId, this.currentPath).subscribe({
        next: () => {
          this.successMessage = 'Path updated successfully';
          this.loadPaths();
          setTimeout(() => this.closeModal(), 1500);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating path:', error);
          this.errorMessage = error.error?.message || 'Error updating path';
          this.loading = false;
        }
      });
    } else {
      this.learningPathService.createPath(this.currentPath).subscribe({
        next: () => {
          this.successMessage = 'Path created successfully';
          this.loadPaths();
          setTimeout(() => this.closeModal(), 1500);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating path:', error);
          this.errorMessage = error.error?.message || 'Error creating path';
          this.loading = false;
        }
      });
    }
  }

  deletePath(pathId: number, title: string): void {
    if (confirm(`Are you sure you want to delete the path "${title}"?`)) {
      this.loading = true;
      this.learningPathService.deletePath(pathId).subscribe({
        next: () => {
          this.successMessage = 'Path deleted successfully';
          this.loadPaths();
          setTimeout(() => this.successMessage = '', 3000);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting path:', error);
          this.errorMessage = 'Error deleting path';
          setTimeout(() => this.errorMessage = '', 3000);
          this.loading = false;
        }
      });
    }
  }

  validateForm(): boolean {
    if (!this.currentPath.title || this.currentPath.title.trim() === '') {
      this.errorMessage = 'Title is required';
      return false;
    }
    if (!this.currentPath.status) {
      this.errorMessage = 'Status is required';
      return false;
    }
    if (!this.currentPath.startDate) {
      this.errorMessage = 'Start date is required';
      return false;
    }
    if (this.currentPath.progress < 0 || this.currentPath.progress > 100) {
      this.errorMessage = 'Progress must be between 0 and 100';
      return false;
    }
    return true;
  }

  getEmptyPath(): LearningPathRequest {
    return {
      title: '',
      description: '',
      learnerId: 0,
      learnerName: '',
      status: LearningPathStatus.PLANIFIE,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      progress: 0
    };
  }

  getStatusLabel(status: LearningPathStatus): string {
    const labels = {
      [LearningPathStatus.PLANIFIE]: 'Planned',
      [LearningPathStatus.EN_COURS]: 'In Progress',
      [LearningPathStatus.TERMINE]: 'Completed',
      [LearningPathStatus.ABANDONNE]: 'Abandoned'
    };
    return labels[status];
  }

  getStatusColor(status: LearningPathStatus): string {
    const colors = {
      [LearningPathStatus.PLANIFIE]: '#6c757d',
      [LearningPathStatus.EN_COURS]: '#007bff',
      [LearningPathStatus.TERMINE]: '#28a745',
      [LearningPathStatus.ABANDONNE]: '#dc3545'
    };
    return colors[status];
  }

  getProgressColor(progress: number): string {
    if (progress < 30) return '#dc3545';
    if (progress < 70) return '#ffc107';
    return '#28a745';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
