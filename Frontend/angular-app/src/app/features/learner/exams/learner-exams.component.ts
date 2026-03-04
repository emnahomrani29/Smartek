import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ExamService } from '../../../core/services/exam.service';
import { Exam } from '../../../core/models/exam.model';

@Component({
  selector: 'app-learner-exams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learner-exams.component.html',
  styleUrl: './learner-exams.component.scss'
})
export class LearnerExamsComponent implements OnInit {
  quizzes: Exam[] = [];
  exams: Exam[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyExams();
  }

  loadMyExams(): void {
    const currentUser = this.authService.getUserInfo();
    if (!currentUser?.userId) {
      this.errorMessage = 'Utilisateur non connecté';
      return;
    }

    this.isLoading = true;
    
    this.examService.getMyExams(currentUser.userId).subscribe({
      next: (data) => {
        this.quizzes = data.filter(item => item.examType === 'QUIZ');
        this.exams = data.filter(item => item.examType === 'EXAM');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.errorMessage = 'Erreur lors du chargement des examens';
        this.isLoading = false;
      }
    });
  }

  getScorePercentage(exam: Exam): number {
    if (!exam.bestScore || !exam.totalMarks) return 0;
    return Math.round((exam.bestScore / exam.totalMarks) * 100);
  }

  getScoreColor(exam: Exam): string {
    const percentage = this.getScorePercentage(exam);
    if (percentage >= exam.passingScore) return 'text-green-600';
    return 'text-red-600';
  }

  getScoreBgColor(exam: Exam): string {
    const percentage = this.getScorePercentage(exam);
    if (percentage >= exam.passingScore) return 'bg-green-50 border-green-200';
    return 'bg-red-50 border-red-200';
  }

  startExam(exam: Exam): void {
    if (exam.isLocked) {
      const message = exam.examType === 'QUIZ' 
        ? 'Vous devez terminer le cours associé avant de passer ce quiz.'
        : 'Vous devez terminer la formation associée avant de passer cet examen.';
      alert(message);
      return;
    }
    
    // Rediriger vers la page de passage d'examen
    this.router.navigate(['/learner-exams/take', exam.id]);
  }
}
