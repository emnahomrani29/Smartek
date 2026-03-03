import { Component } from '@angular/core';
import { LearningStyleComponent } from '../../learner/learning-style/learning-style.component';

@Component({
  selector: 'app-learning-style-page',
  standalone: true,
  imports: [LearningStyleComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <app-learning-style></app-learning-style>
      </div>
    </div>
  `
})
export class LearningStylePageComponent {}
