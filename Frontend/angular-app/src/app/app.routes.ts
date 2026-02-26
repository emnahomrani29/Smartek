import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { DashboardLayoutComponent } from './features/dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { SignInComponent } from './features/auth/sign-in/sign-in.component';
import { authGuard } from './core/guards/auth.guard';
import { SponsorListComponent } from './features/sponsors/sponsor-list/sponsor-list.component';
import { AddSponsorComponent } from './features/sponsors/add-sponsor/add-sponsor.component';
import { EditSponsorComponent } from './features/sponsors/edit-sponsor/edit-sponsor.component';
import { ContractListComponent } from './features/contracts/contract-list/contract-list.component';
import { AddContractComponent } from './features/contracts/add-contract/add-contract.component';
import { EditContractComponent } from './features/contracts/edit-contract/edit-contract.component';
import { SponsorshipListComponent } from './features/sponsorships/sponsorship-list/sponsorship-list.component';
import { AddSponsorshipComponent } from './features/sponsorships/add-sponsorship/add-sponsorship.component';
import { SponsorDashboardComponent } from './features/dashboard/sponsor-dashboard/sponsor-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth/sign-in', component: SignInComponent },
  { path: 'auth/sign-up', component: SignUpComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      { path: 'profile', component: DashboardPageComponent },
      { path: 'sponsor-dashboard', component: SponsorDashboardComponent },

      // Sponsor Management
      { path: 'sponsors', component: SponsorListComponent },
      { path: 'sponsors/add', component: AddSponsorComponent },
      { path: 'sponsors/edit/:id', component: EditSponsorComponent },

      // Contract Management
      { path: 'contracts', component: ContractListComponent },
      { path: 'contracts/add', component: AddContractComponent },
      { path: 'contracts/edit/:id', component: EditContractComponent },

      // Sponsorship Management
      { path: 'sponsorships', component: SponsorshipListComponent },
      { path: 'sponsorships/add', component: AddSponsorshipComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
