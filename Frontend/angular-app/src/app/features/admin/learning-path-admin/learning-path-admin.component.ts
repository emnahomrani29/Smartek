import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPathService } from '../../../core/services/learning-path.service';
import { LearningPathResponse, LearningPathStatus } from '../../../core/models/learning-path.model';

@Component({
  selector: 'app-learning-path-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning-path-admin.component.html',
  styleUrls: ['./learning-path-admin.component.css']
})
export class LearningPathAdminComponent implements OnInit {
  paths: LearningPathResponse[] = [];
  filteredPaths: LearningPathResponse[] = [];
  loading = false;
  errorMessage = '';
  searchTerm = '';

  // Statistiques
  totalPaths = 0;
  uniqueLearners = 0;
  averageProgress = 0;

  constructor(private learningPathService: LearningPathService) {}

  ngOnInit(): void {
    this.loadAllPaths();
  }

  loadAllPaths(): void {
    this.loading = true;
    this.learningPathService.getAllPaths().subscribe({
      next: (data) => {
        this.paths = data;
        this.filteredPaths = data;
        this.calculateStatistics();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading paths:', error);
        this.errorMessage = 'Error loading learning paths';
        this.loading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalPaths = this.paths.length;
    
    // Nombre d'apprenants uniques
    const uniqueLearnerIds = new Set(this.paths.map(p => p.learnerId));
    this.uniqueLearners = uniqueLearnerIds.size;
    
    // Progression moyenne
    if (this.paths.length > 0) {
      const totalProgress = this.paths.reduce((sum, path) => sum + path.progress, 0);
      this.averageProgress = Math.round(totalProgress / this.paths.length);
    }
  }

  filterPaths(): void {
    if (!this.searchTerm) {
      this.filteredPaths = this.paths;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredPaths = this.paths.filter(path =>
      path.title.toLowerCase().includes(term) ||
      path.learnerName.toLowerCase().includes(term) ||
      path.description?.toLowerCase().includes(term) ||
      path.status.toLowerCase().includes(term)
    );
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
      month: 'short',
      day: 'numeric'
    });
  }
}
