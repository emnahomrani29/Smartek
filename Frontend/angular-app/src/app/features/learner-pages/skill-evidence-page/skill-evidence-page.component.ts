import { Component } from '@angular/core';
import { SkillEvidenceComponent } from '../../learner/skill-evidence/skill-evidence.component';

@Component({
  selector: 'app-skill-evidence-page',
  standalone: true,
  imports: [SkillEvidenceComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <app-skill-evidence></app-skill-evidence>
      </div>
    </div>
  `
})
export class SkillEvidencePageComponent {}
