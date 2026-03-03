import { Component } from '@angular/core';
import { LearningPathComponent } from '../../learner/learning-path/learning-path.component';

@Component({
  selector: 'app-learning-path-page',
  standalone: true,
  imports: [LearningPathComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <app-learning-path></app-learning-path>
      </div>
    </div>
  `
})
export class LearningPathPageComponent {}
