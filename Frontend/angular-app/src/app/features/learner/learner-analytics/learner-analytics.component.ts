import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { SkillEvidenceService } from '../../../core/services/skill-evidence.service';
import { AuthService } from '../../../core/services/auth.service';
import { LearnerAnalytics } from '../../../core/models/skill-evidence.model';
import { PdfExportService } from '../../../core/services/pdf-export.service';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-learner-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learner-analytics.component.html',
  styleUrls: ['./learner-analytics.component.css']
})
export class LearnerAnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  analytics: LearnerAnalytics | null = null;
  loading = false;
  errorMessage = '';
  exportingPdf = false;
  
  private scoreLineChart: Chart | null = null;
  private categoryRadarChart: Chart | null = null;

  constructor(
    private skillEvidenceService: SkillEvidenceService,
    private authService: AuthService,
    private pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  ngAfterViewInit(): void {
    // Charts will be rendered after data is loaded
  }

  ngOnDestroy(): void {
    // Destroy charts to prevent memory leaks
    if (this.scoreLineChart) {
      this.scoreLineChart.destroy();
    }
    if (this.categoryRadarChart) {
      this.categoryRadarChart.destroy();
    }
  }

  // Task 20.2: Load analytics data
  loadAnalytics(): void {
    const user = this.authService.getUserInfo();
    if (user && user.userId) {
      this.loading = true;
      this.skillEvidenceService.getLearnerAnalytics(user.userId).subscribe({
        next: (data) => {
          this.analytics = data;
          this.loading = false;
          // Render charts after data is loaded
          setTimeout(() => this.renderCharts(), 100);
        },
        error: (error) => {
          console.error('Error loading analytics:', error);
          this.errorMessage = 'Erreur lors du chargement des statistiques';
          this.loading = false;
        }
      });
    }
  }

  // Task 20.4 & 20.5: Render all charts
  renderCharts(): void {
    if (this.analytics) {
      this.renderScoreLineChart();
      this.renderCategoryRadarChart();
    }
  }

  // Task 20.4: Render score evolution line chart
  renderScoreLineChart(): void {
    if (!this.analytics || this.analytics.scoreTrend.length === 0) {
      return;
    }

    const canvas = document.getElementById('scoreLineChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    // Destroy existing chart
    if (this.scoreLineChart) {
      this.scoreLineChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.analytics.scoreTrend.map(point => new Date(point.date).toLocaleDateString('fr-FR')),
        datasets: [{
          label: 'Score Evolution',
          data: this.analytics.scoreTrend.map(point => point.score),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              title: (context) => {
                const index = context[0].dataIndex;
                return this.analytics!.scoreTrend[index].title;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Score'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          }
        }
      }
    };

    this.scoreLineChart = new Chart(ctx, config);
  }

  // Task 20.5: Render category distribution radar chart
  renderCategoryRadarChart(): void {
    if (!this.analytics) {
      return;
    }

    const canvas = document.getElementById('categoryRadarChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    // Destroy existing chart
    if (this.categoryRadarChart) {
      this.categoryRadarChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const categories = Object.keys(this.analytics.categoryDistribution);
    const counts = Object.values(this.analytics.categoryDistribution);

    const config: ChartConfiguration = {
      type: 'radar',
      data: {
        labels: categories.map(cat => this.translateCategory(cat)),
        datasets: [{
          label: 'Evidence Count by Category',
          data: counts,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          pointBackgroundColor: 'rgb(16, 185, 129)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(16, 185, 129)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    this.categoryRadarChart = new Chart(ctx, config);
  }

  // Helper method to translate category names
  translateCategory(category: string): string {
    const translations: { [key: string]: string } = {
      'PROGRAMMING': 'Programmation',
      'DESIGN': 'Design',
      'MANAGEMENT': 'Management',
      'COMMUNICATION': 'Communication',
      'OTHER': 'Autre'
    };
    return translations[category] || category;
  }

  // Task 20.3: Get average score display
  getAverageScoreDisplay(): string {
    if (!this.analytics || this.analytics.averageScore === null || this.analytics.approvedCount === 0) {
      return 'N/A';
    }
    return this.analytics.averageScore.toFixed(1);
  }

  exportToPDF(): void {
    if (!this.analytics) {
      return;
    }

    const user = this.authService.getUserInfo();
    if (!user) {
      return;
    }

    this.exportingPdf = true;

    try {
      // Prepare data for PDF export
      const pdfData = {
        totalEvidence: this.analytics.totalCount,
        approvedCount: this.analytics.approvedCount,
        pendingCount: this.analytics.pendingCount,
        rejectedCount: this.analytics.rejectedCount,
        averageScore: this.analytics.averageScore,
        successRate: this.analytics.totalCount > 0
          ? (this.analytics.approvedCount / this.analytics.totalCount) * 100
          : 0,
        
        // Category performance
        categoryPerformance: Object.entries(this.analytics.categoryDistribution).map(([category, count]) => {
          // For simplicity, we'll assume all approved for now
          // In a real scenario, you'd need more detailed data from the backend
          const approved = Math.floor(count * (this.analytics!.approvedCount / this.analytics!.totalCount));
          return {
            category: category,
            count: count,
            approved: approved,
            successRate: count > 0 ? ((approved / count) * 100).toFixed(1) : '0'
          };
        }),
        
        // Recent activity from score trend
        recentActivity: this.analytics.scoreTrend.map(point => ({
          submittedAt: point.date,
          category: 'N/A', // Not available in current data structure
          status: 'APPROVED', // Assuming approved since it has a score
          score: point.score
        }))
      };

      // Get learner name
      const learnerName = user.firstName || user.email || 'Learner';

      // Export PDF
      this.pdfExportService.exportLearnerAnalyticsPDF(pdfData, learnerName);
      
      this.exportingPdf = false;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      this.errorMessage = 'Error exporting PDF report';
      this.exportingPdf = false;
    }
  }
}
