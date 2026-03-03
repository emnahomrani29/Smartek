import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningStylePreference, LearningStyleType } from '../../../../core/models/learning-style.model';

@Component({
  selector: 'app-learning-style-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-style-card.component.html',
  styleUrls: ['./learning-style-card.component.scss']
})
export class LearningStyleCardComponent {
  @Input() learningStyle!: LearningStylePreference;

  // Expose enum to template
  LearningStyleType = LearningStyleType;

  getStyleIcon(style: LearningStyleType): string {
    const iconMap: Record<LearningStyleType, string> = {
      [LearningStyleType.VISUAL]: 'visibility',
      [LearningStyleType.AUDITORY]: 'hearing',
      [LearningStyleType.READ_WRITE]: 'menu_book',
      [LearningStyleType.KINESTHETIC]: 'touch_app',
      [LearningStyleType.MULTIMODAL]: 'apps'
    };
    return iconMap[style];
  }

  getStyleLabel(style: LearningStyleType): string {
    const labelMap: Record<LearningStyleType, string> = {
      [LearningStyleType.VISUAL]: 'Visual Learner',
      [LearningStyleType.AUDITORY]: 'Auditory Learner',
      [LearningStyleType.READ_WRITE]: 'Reading/Writing Learner',
      [LearningStyleType.KINESTHETIC]: 'Kinesthetic Learner',
      [LearningStyleType.MULTIMODAL]: 'Multimodal Learner'
    };
    return labelMap[style];
  }
}
