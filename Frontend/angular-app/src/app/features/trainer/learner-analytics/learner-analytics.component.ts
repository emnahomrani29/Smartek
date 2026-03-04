import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { AuthService } from '../../../core/services/auth.service';
import { ExamAnalytics, TrainingAnalytics } from '../../../core/models/analytics.model';

@Component({
  selector: 'app-learner-analytics',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './learner-analytics.component.html',
  styleUrls: ['./learner-analytics.component.scss']
})
export class LearnerAnalyticsComponent implements OnInit {
  examResults: ExamAnalytics[] = [];
  trainingEnrollments: TrainingAnalytics[] = [];
  loading = false;
  selectedTab: 'exams' | 'enrollments' = 'exams';
  trainerId: number | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.userId) {
      this.trainerId = userInfo.userId;
      this.loadData();
    }
  }

  loadData() {
    if (!this.trainerId) return;
    
    this.loading = true;
    
    // Charger les résultats d'examens
    this.analyticsService.getTrainerExamAnalytics(this.trainerId).subscribe({
      next: (data) => {
        this.examResults = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam analytics:', error);
        this.loading = false;
      }
    });
    
    // Charger les inscriptions aux formations
    this.analyticsService.getTrainerTrainingAnalytics(this.trainerId).subscribe({
      next: (data) => {
        this.trainingEnrollments = data;
      },
      error: (error) => {
        console.error('Error loading training analytics:', error);
      }
    });
  }

  selectTab(tab: 'exams' | 'enrollments') {
    this.selectedTab = tab;
  }

  getStatusColor(status: string): string {
    return status === 'passed' ? 'text-green-600' : 'text-red-600';
  }

  getStatusBadge(status: string): string {
    return status === 'passed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
}
