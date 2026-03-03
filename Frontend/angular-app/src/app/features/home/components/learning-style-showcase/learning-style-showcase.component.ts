import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningStyleService } from '../../../../core/services/learning-style.service';
import { LearningStylePreference } from '../../../../core/models/learning-style.model';
import { LearningStyleCardComponent } from '../learning-style-card/learning-style-card.component';

@Component({
  selector: 'app-learning-style-showcase',
  standalone: true,
  imports: [CommonModule, LearningStyleCardComponent],
  templateUrl: './learning-style-showcase.component.html',
  styleUrls: ['./learning-style-showcase.component.scss']
})
export class LearningStyleShowcaseComponent implements OnInit {
  learningStyles = signal<LearningStylePreference[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  lastUpdated = signal<Date | null>(null);

  constructor(private learningStyleService: LearningStyleService) {}

  ngOnInit(): void {
    this.loadLearningStyles();
  }

  loadLearningStyles(): void {
    this.loading.set(true);
    this.error.set(null);

    this.learningStyleService.getAllLearningStyles().subscribe({
      next: (data) => {
        this.learningStyles.set(data);
        this.lastUpdated.set(new Date());
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'An unexpected error occurred');
        this.loading.set(false);
      }
    });
  }

  refresh(): void {
    this.learningStyleService.getAllLearningStyles(true).subscribe({
      next: (data) => {
        this.learningStyles.set(data);
        this.lastUpdated.set(new Date());
      },
      error: (err) => {
        this.error.set(err.message || 'An unexpected error occurred');
      }
    });
  }

  retry(): void {
    this.loadLearningStyles();
  }

  trackByLearnerId(index: number, item: LearningStylePreference): number {
    return item.learnerId;
  }
}
