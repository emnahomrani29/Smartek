import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { JobOffersRouterComponent } from './features/dashboard/job-offers-router/job-offers-router.component';
import { JobOffersComponent } from './features/dashboard/job-offers/job-offers.component';
import { JobOffersLearnerComponent } from './features/learner/job-offers/job-offers-learner.component';
import { InterviewsLearnerComponent } from './features/learner/interviews/interviews-learner.component';
import { PlanningComponent } from './features/dashboard/planning/planning.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { SignInComponent } from './features/auth/sign-in/sign-in.component';
import { SettingsComponent } from './features/settings/settings.component';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { Permission } from './core/enums/permission.enum';
import { Role } from './core/enums/role.enum';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth/sign-in', component: SignInComponent },
  { path: 'auth/sign-up', component: SignUpComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'test-offers', component: JobOffersComponent }, // Route de test sans guards
  { path: 'test-offers-learner', component: JobOffersLearnerComponent }, // Route de test pour learner
  { path: 'test-interviews-learner', component: InterviewsLearnerComponent }, // Route de test pour entretiens learner
  
  // Routes Learning Path avec navbar et footer (hors dashboard)
  { 
    path: 'skill-evidence', 
    loadComponent: () => import('./features/learner-pages/skill-evidence-page/skill-evidence-page.component').then(m => m.SkillEvidencePageComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'learner-analytics', 
    loadComponent: () => import('./features/learner-pages/learner-analytics-page/learner-analytics-page.component').then(m => m.LearnerAnalyticsPageComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'learning-style', 
    loadComponent: () => import('./features/learner-pages/learning-style-page/learning-style-page.component').then(m => m.LearningStylePageComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'learning-path', 
    loadComponent: () => import('./features/learner-pages/learning-path-page/learning-path-page.component').then(m => m.LearningPathPageComponent),
    canActivate: [authGuard]
  },
  
  { 
    path: 'dashboard', 
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: '', 
        component: DashboardPageComponent 
      },
      { 
        path: 'profile', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.PROFILE_VIEW] }
      },
      // Course Management - RH_SMARTEK
      { 
        path: 'courses', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.COURSES_VIEW, Permission.COURSES_CREATE] }
      },
      // My Courses - LEARNER
      { 
        path: 'my-courses', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER], permissions: [Permission.COURSES_VIEW] }
      },
      // Exam Management - RH_SMARTEK
      { 
        path: 'exams', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.EXAMS_VIEW, Permission.EXAMS_CREATE] }
      },
      // My Exams - LEARNER
      { 
        path: 'my-exams', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER], permissions: [Permission.EXAMS_TAKE] }
      },
      // Training Management
      { 
        path: 'training', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.TRAINING_VIEW, Permission.TRAINING_CREATE] }
      },
      // My Training - LEARNER
      { 
        path: 'my-training', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER], permissions: [Permission.TRAINING_VIEW] }
      },
      // Certifications & Badges
      { 
        path: 'certifications', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.CERTIFICATIONS_VIEW, Permission.BADGES_VIEW] }
      },
      // My Certifications - LEARNER
      { 
        path: 'my-certifications', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER], permissions: [Permission.CERTIFICATIONS_VIEW] }
      },
      // Skill Evidence
      { 
        path: 'skill-evidence', 
        loadComponent: () => import('./features/learner/skill-evidence/skill-evidence.component').then(m => m.SkillEvidenceComponent),
        canActivate: [permissionGuard],
        data: { permissions: [Permission.SKILL_EVIDENCE_VIEW, Permission.SKILL_EVIDENCE_VIEW_ALL] }
      },
      // Learner Analytics Dashboard - LEARNER
      { 
        path: 'learner-analytics', 
        loadComponent: () => import('./features/learner/learner-analytics/learner-analytics.component').then(m => m.LearnerAnalyticsComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER] }
      },
      // Skill Evidence Admin - Vue pour tous les apprenants
      { 
        path: 'skill-evidence-admin', 
        loadComponent: () => import('./features/admin/skill-evidence-admin/skill-evidence-admin.component').then(m => m.SkillEvidenceAdminComponent),
        canActivate: [permissionGuard],
        data: { permissions: [Permission.SKILL_EVIDENCE_VIEW_ALL] }
      },
      // Global Analytics Dashboard - ADMIN
      { 
        path: 'global-analytics', 
        loadComponent: () => import('./features/admin/global-analytics/global-analytics.component').then(m => m.GlobalAnalyticsComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.ADMIN] }
      },
      // Learning Path Admin - Vue pour tous les apprenants
      { 
        path: 'learning-path-admin', 
        loadComponent: () => import('./features/admin/learning-path-admin/learning-path-admin.component').then(m => m.LearningPathAdminComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.ADMIN] }
      },
      // Learning Style - Tous les utilisateurs
      { 
        path: 'learning-style', 
        loadComponent: () => import('./features/learner/learning-style/learning-style.component').then(m => m.LearningStyleComponent)
      },
      // Learning Path - LEARNER
      { 
        path: 'learning-path', 
        loadComponent: () => import('./features/learner/learning-path/learning-path.component').then(m => m.LearningPathComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER] }
      },
      // Interview Management
      { 
        path: 'interviews', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.INTERVIEWS_VIEW, Permission.INTERVIEWS_CREATE] }
      },
      // Job Offers - Route intelligente selon le rôle
      { 
        path: 'job-offers', 
        component: JobOffersRouterComponent
      },
      // Planning
      { 
        path: 'planning', 
        component: PlanningComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.PLANNING_VIEW, Permission.PLANNING_CREATE] }
      },
      // Event Management
      { 
        path: 'events', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.EVENTS_VIEW, Permission.EVENTS_CREATE] }
      },
      // User Management
      { 
        path: 'users', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.USERS_VIEW] }
      },
      // Company Management
      { 
        path: 'companies', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.COMPANIES_VIEW, Permission.COMPANIES_CREATE] }
      },
      // Sponsor Management
      { 
        path: 'sponsors', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.SPONSORS_VIEW] }
      },
      // Contact Management
      { 
        path: 'contacts', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.CONTACTS_VIEW] }
      },
      // Participation
      { 
        path: 'participation', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.PARTICIPATION_VIEW, Permission.PARTICIPATION_VIEW_ALL] }
      },
      // Learning Paths
      { 
        path: 'learning-paths', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.LEARNING_PATH_VIEW] }
      },
      // System Settings - ADMIN
      { 
        path: 'settings', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.SYSTEM_SETTINGS] }
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
