import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillEvidenceComponent } from './skill-evidence.component';

const routes: Routes = [{ path: '', component: SkillEvidenceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillEvidenceRoutingModule { }
