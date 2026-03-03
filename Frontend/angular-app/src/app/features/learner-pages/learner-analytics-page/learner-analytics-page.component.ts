import { Component } from '@angular/core';
import { LearnerAnalyticsComponent } from '../../learner/learner-analytics/learner-analytics.component';

@Component({
  selector: 'app-learner-analytics-page',
  standalone: true,
  imports: [LearnerAnalyticsComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <app-learner-analytics></app-learner-analytics>
      </div>
    </div>
  `
})
export class LearnerAnalyticsPageComponent {}
