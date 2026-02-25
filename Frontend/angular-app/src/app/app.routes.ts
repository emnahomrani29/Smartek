import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { SignInComponent } from './features/auth/sign-in/sign-in.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// Admin Components
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { CompanyManagementComponent } from './features/admin/company-management/company-management.component';
import { ContractManagementComponent } from './features/admin/contract-management/contract-management.component';

// Learner Components
import { LearnerLayoutComponent } from './features/learner/learner-layout/learner-layout.component';
import { LearnerCoursesComponent } from './features/learner/courses/courses.component';
import { LearnerExamsComponent } from './features/learner/exams/exams.component';
import { LearnerCertificationsComponent } from './features/learner/certifications/certifications.component';
import { LearnerParticipationComponent } from './features/learner/participation/participation.component';

// Trainer Components
import { TrainerLayoutComponent } from './features/trainer/trainer-layout/trainer-layout.component';
import { TrainerCoursesComponent } from './features/trainer/courses/courses.component';
import { TrainingManagementComponent } from './features/trainer/training-management/training-management.component';
import { SkillEvidenceComponent } from './features/learner/skill-evidence/skill-evidence.component';
import { BadgeManagementComponent } from './features/trainer/badge-management/badge-management.component';

// RH Smartek Components
import { RhSmartekLayoutComponent } from './features/rh-smartek/rh-smartek-layout/rh-smartek-layout.component';
import { RhCertificationsComponent } from './features/rh-smartek/certifications/certifications.component';
import { RhCoursesComponent } from './features/rh-smartek/courses/courses.component';
import { RhExamsComponent } from './features/rh-smartek/exams/exams.component';
import { InterviewsComponent } from './features/rh-smartek/interviews/interviews.component';
import { ScheduleComponent } from './features/rh-smartek/schedule/schedule.component';
import { RhEventsComponent } from './features/rh-smartek/events/events.component';

// RH Company Components
import { RhCompanyLayoutComponent } from './features/rh-company/rh-company-layout/rh-company-layout.component';
import { OffersComponent } from './features/rh-company/offers/offers.component';
import { CompanyParticipationComponent } from './features/rh-company/participation/participation.component';

// Partner Components
import { PartnerLayoutComponent } from './features/partner/partner-layout/partner-layout.component';
import { SponsorshipComponent } from './features/partner/sponsorship/sponsorship.component';
import { PartnerEventsComponent } from './features/partner/events/events.component';

// Test Component
import { RoleTestComponent } from './features/test/role-test/role-test.component';
import { LearningStyleComponent }  from './features/learner/learning-style/learning-style.component';
import { AdminSkillEvidenceComponent } from './features/admin/admin-skill-evidence/admin-skill-evidence.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth/sign-in', component: SignInComponent },
  { path: 'auth/sign-up', component: SignUpComponent },
  { path: 'test/roles', component: RoleTestComponent }, // Route de test
  
  // Dashboard principal (tous les utilisateurs authentifiés)
  { 
    path: 'dashboard', 
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'profile', component: DashboardPageComponent }
    ]
  },

  // Routes ADMIN
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'users', component: UserManagementComponent },
      { path: 'companies', component: CompanyManagementComponent },
      { path: 'contracts', component: ContractManagementComponent },
      { path: 'skill-evidence', component: AdminSkillEvidenceComponent },
    ]
  },

  // Routes LEARNER (Apprenant) - Avec layout personnalisé
  {
    path: 'learner',
    component: LearnerLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['LEARNER'] },
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      { path: 'courses', component: LearnerCoursesComponent },
      { path: 'exams', component: LearnerExamsComponent },
      { path: 'certifications', component: LearnerCertificationsComponent },
      { path: 'participation', component: LearnerParticipationComponent },
      { path: 'skill-evidence', component: SkillEvidenceComponent },
      { path: 'learning-style', component: LearningStyleComponent }
    ]
  },

  // Routes TRAINER (Formateur) - Avec layout personnalisé
  {
    path: 'trainer',
    component: TrainerLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['TRAINER'] },
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      { path: 'courses', component: TrainerCoursesComponent },
      { path: 'training-management', component: TrainingManagementComponent },
      { path: 'skill-evidence', component: SkillEvidenceComponent },
      { path: 'badge-management', component: BadgeManagementComponent }
    ]
  },

  // Routes RH_SMARTEK - Avec layout personnalisé
  {
    path: 'rh-smartek',
    component: RhSmartekLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['RH_SMARTEK'] },
    children: [
      { path: '', redirectTo: 'certifications', pathMatch: 'full' },
      { path: 'certifications', component: RhCertificationsComponent },
      { path: 'courses', component: RhCoursesComponent },
      { path: 'exams', component: RhExamsComponent },
      { path: 'interviews', component: InterviewsComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'events', component: RhEventsComponent }
    ]
  },

  // Routes RH_COMPANY - Avec layout personnalisé
  {
    path: 'rh-company',
    component: RhCompanyLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['RH_COMPANY'] },
    children: [
      { path: '', redirectTo: 'offers', pathMatch: 'full' },
      { path: 'offers', component: OffersComponent },
      { path: 'participation', component: CompanyParticipationComponent }
    ]
  },

  // Routes PARTNER (Partenaire/Sponsor) - Avec layout personnalisé
  {
    path: 'partner',
    component: PartnerLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['PARTNER'] },
    children: [
      { path: '', redirectTo: 'sponsorship', pathMatch: 'full' },
      { path: 'sponsorship', component: SponsorshipComponent },
      { path: 'events', component: PartnerEventsComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];
