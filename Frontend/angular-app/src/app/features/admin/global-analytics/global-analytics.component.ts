import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { SkillEvidenceService } from '../../../core/services/skill-evidence.service';
import { GlobalAnalytics } from '../../../core/models/skill-evidence.model';
import { PdfExportService } from '../../../core/services/pdf-export.service';

Chart.register(...registerables);

@Component({
  selector: 'app-global-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-analytics.component.html',
  styleUrls: ['./global-analytics.component.css']
})
export class GlobalAnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  analytics: GlobalAnalytics | null = null;
  loading = false;
  errorMessage = '';
  exportingPdf = false;
  
  private categoryBarChart: Chart | null = null;
  private submissionLineChart: Chart | null = null;
  private statusPieChart: Chart | null = null;

  constructor(
    private skillEvidenceService: SkillEvidenceService,
    private pdfExportService: PdfExportService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.categoryBarChart) this.categoryBarChart.destroy();
    if (this.submissionLineChart) this.submissionLineChart.destroy();
    if (this.statusPieChart) this.statusPieChart.destroy();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.skillEvidenceService.getGlobalAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.loading = false;
        setTimeout(() => this.renderCharts(), 100);
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.errorMessage = 'Error loading global analytics';
        this.loading = false;
      }
    });
  }

  renderCharts(): void {
    if (this.analytics) {
      this.renderCategoryBarChart();
      this.renderSubmissionLineChart();
      this.renderStatusPieChart();
    }
  }

  renderCategoryBarChart(): void {
    if (!this.analytics) return;
    const canvas = document.getElementById('categoryBarChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.categoryBarChart) this.categoryBarChart.destroy();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const categories = Object.keys(this.analytics.categoryDistribution);
    const counts = Object.values(this.analytics.categoryDistribution);

    this.categoryBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Evidence Count',
          data: counts,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  renderSubmissionLineChart(): void {
    if (!this.analytics) return;
    const canvas = document.getElementById('submissionLineChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.submissionLineChart) this.submissionLineChart.destroy();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dates = Object.keys(this.analytics.submissionTrend);
    const counts = Object.values(this.analytics.submissionTrend);

    this.submissionLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates.map(d => new Date(d).toLocaleDateString('fr-FR')),
        datasets: [{
          label: 'Submissions',
          data: counts,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

  renderStatusPieChart(): void {
    if (!this.analytics) return;
    const canvas = document.getElementById('statusPieChart') as HTMLCanvasElement;
    if (!canvas) return;
    if (this.statusPieChart) this.statusPieChart.destroy();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const statuses = Object.keys(this.analytics.statusDistribution);
    const counts = Object.values(this.analytics.statusDistribution);

    this.statusPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: statuses,
        datasets: [{
          data: counts,
          backgroundColor: ['#fbbf24', '#10b981', '#ef4444'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top' } }
      }
    });
  }

  getApprovalRateDisplay(): string {
    if (!this.analytics) return 'N/A';
    return (this.analytics.approvalRate * 100).toFixed(1) + '%';
  }

  getAverageScoreDisplay(): string {
    if (!this.analytics || this.analytics.averageScore === null) return 'N/A';
    return this.analytics.averageScore.toFixed(1);
  }

  exportToPDF(): void {
    if (!this.analytics) {
      return;
    }

    this.exportingPdf = true;

    try {
      // Prepare data for PDF export
      const pdfData = {
        totalEvidence: this.analytics.totalCount,
        pendingCount: this.analytics.pendingCount,
        approvedCount: this.analytics.approvedCount,
        rejectedCount: this.analytics.rejectedCount,
        totalLearners: 0, // Not available in current analytics
        averageScore: this.analytics.averageScore,
        
        // Calculate percentages
        pendingPercentage: this.analytics.totalCount > 0 
          ? ((this.analytics.pendingCount / this.analytics.totalCount) * 100).toFixed(1)
          : '0',
        approvedPercentage: this.analytics.totalCount > 0
          ? ((this.analytics.approvedCount / this.analytics.totalCount) * 100).toFixed(1)
          : '0',
        rejectedPercentage: this.analytics.totalCount > 0
          ? ((this.analytics.rejectedCount / this.analytics.totalCount) * 100).toFixed(1)
          : '0',
        
        // Category distribution
        categoryDistribution: Object.entries(this.analytics.categoryDistribution).map(([category, count]) => ({
          category: category,
          count: count,
          percentage: this.analytics!.totalCount > 0
            ? ((count / this.analytics!.totalCount) * 100).toFixed(1)
            : '0'
        }))
      };

      // Export PDF
      this.pdfExportService.exportGlobalAnalyticsPDF(pdfData);
      
      this.exportingPdf = false;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      this.errorMessage = 'Error exporting PDF report';
      this.exportingPdf = false;
    }
  }
}
