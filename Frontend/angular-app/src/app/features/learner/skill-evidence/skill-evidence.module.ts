import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillEvidenceRoutingModule } from './skill-evidence-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [CommonModule, SkillEvidenceRoutingModule, FormsModule]
})
export class SkillEvidenceModule {}
