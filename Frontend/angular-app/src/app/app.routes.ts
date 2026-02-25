import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { SignInComponent } from './features/auth/sign-in/sign-in.component';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { Permission } from './core/enums/permission.enum';
import { Role } from './core/enums/role.enum';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth/sign-in', component: SignInComponent },
  { path: 'auth/sign-up', component: SignUpComponent },
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
      // Course Management - RH_SMARTEK & TRAINER
      { 
        path: 'courses',
        loadComponent: () => import('./features/dashboard/course-management/course-management.component').then(m => m.CourseManagementComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.RH_SMARTEK, Role.TRAINER] }
      },
      // Chapter Management - RH_SMARTEK & TRAINER
      { 
        path: 'courses/:courseId/chapters',
        loadComponent: () => import('./features/dashboard/chapter-management/chapter-management.component').then(m => m.ChapterManagementComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.RH_SMARTEK, Role.TRAINER] }
      },
      // My Courses - LEARNER
      { 
        path: 'my-courses', 
        loadComponent: () => import('./features/dashboard/my-courses/my-courses.component').then(m => m.MyCoursesComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER], permissions: [Permission.COURSES_VIEW] }
      },
      // Exam Management - RH_SMARTEK & TRAINER
      { 
        path: 'exams', 
        loadComponent: () => import('./features/dashboard/exam-management/exam-management.component').then(m => m.ExamManagementComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.RH_SMARTEK, Role.TRAINER] }
      },
      // My Exams - LEARNER
      { 
        path: 'my-exams', 
        loadComponent: () => import('./features/dashboard/my-exams/my-exams.component').then(m => m.MyExamsComponent),
        canActivate: [permissionGuard],
        data: { roles: [Role.LEARNER], permissions: [Permission.EXAMS_TAKE] }
      },
      // Training Management - All with TRAINING_VIEW permission
      { 
        path: 'training', 
        loadComponent: () => import('./features/dashboard/training-management/training-management.component').then(m => m.TrainingManagementComponent),
        canActivate: [permissionGuard],
        data: { permissions: [Permission.TRAINING_VIEW] }
      },
      // My Training - LEARNER
      { 
        path: 'my-training',
        loadComponent: () => import('./features/dashboard/my-training/my-training.component').then(m => m.MyTrainingComponent),
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
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.SKILL_EVIDENCE_VIEW, Permission.SKILL_EVIDENCE_VIEW_ALL] }
      },
      // Interview Management
      { 
        path: 'interviews', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.INTERVIEWS_VIEW, Permission.INTERVIEWS_CREATE] }
      },
      // Job Offers
      { 
        path: 'job-offers', 
        component: DashboardPageComponent,
        canActivate: [permissionGuard],
        data: { permissions: [Permission.JOB_OFFERS_VIEW, Permission.JOB_OFFERS_CREATE] }
      },
      // Planning
      { 
        path: 'planning', 
        component: DashboardPageComponent,
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
