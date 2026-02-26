import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';
import { SponsorService } from '../../../shared/sponsor.service';
import { SponsorDashboard } from '../../../shared/models/sponsor.model';

@Component({
  selector: 'app-sponsor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Loading -->
    <div *ngIf="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error: No sponsor record found -->
    <div *ngIf="!isLoading && errorMessage" class="p-6">
      <div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-yellow-800 mb-2">Account Not Yet Configured</h3>
        <p class="text-yellow-600">Your sponsor profile hasn't been set up by the admin yet. Please contact the administrator.</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div *ngIf="!isLoading && dashboard" class="p-6 space-y-6">

      <!-- Welcome Banner -->
      <div class="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div class="relative z-10 flex items-center justify-between">
          <div>
            <p class="text-white/70 text-sm mb-1">Welcome back,</p>
            <h1 class="text-3xl font-bold mb-1">{{ dashboard.sponsor.name || currentUser?.firstName }}</h1>
            <p class="text-white/80 text-sm">{{ dashboard.sponsor.companyName || 'Sponsor' }} • {{ dashboard.sponsor.industry || '' }}</p>
          </div>
          <div *ngIf="dashboard.sponsor.logoUrl" class="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
            <img [src]="dashboard.sponsor.logoUrl" alt="Logo" class="w-full h-full object-cover">
          </div>
          <div *ngIf="!dashboard.sponsor.logoUrl" class="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
            <span class="text-3xl font-bold">{{ (dashboard.sponsor.name || 'S').charAt(0) }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Budget -->
        <div class="bg-white rounded-2xl shadow-soft-xl p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Total Budget</span>
          </div>
          <h3 class="text-3xl font-bold text-gray-800">{{ dashboard.totalContractAmount | number:'1.2-2' }} <span class="text-sm font-normal text-gray-400">{{ getCurrency() }}</span></h3>
          <p class="text-sm text-gray-500 mt-1">From {{ dashboard.contracts.length }} contract(s)</p>
        </div>

        <!-- Amount Spent -->
        <div class="bg-white rounded-2xl shadow-soft-xl p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <span class="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Spent</span>
          </div>
          <h3 class="text-3xl font-bold text-gray-800">{{ dashboard.totalSpent | number:'1.2-2' }} <span class="text-sm font-normal text-gray-400">{{ getCurrency() }}</span></h3>
          <p class="text-sm text-gray-500 mt-1">Across {{ dashboard.sponsorships.length }} sponsorship(s)</p>
        </div>

        <!-- Remaining Balance -->
        <div class="bg-white rounded-2xl shadow-soft-xl p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-xs font-medium px-3 py-1 rounded-full" [ngClass]="dashboard.remainingBalance > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">
              {{ dashboard.remainingBalance > 0 ? 'Available' : 'Exceeded' }}
            </span>
          </div>
          <h3 class="text-3xl font-bold" [ngClass]="dashboard.remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ dashboard.remainingBalance | number:'1.2-2' }} <span class="text-sm font-normal text-gray-400">{{ getCurrency() }}</span>
          </h3>
          <p class="text-sm text-gray-500 mt-1">Remaining from budget</p>
        </div>
      </div>

      <!-- Budget Progress Bar -->
      <div class="bg-white rounded-2xl shadow-soft-xl p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Budget Usage</h3>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">{{ getSpentPercentage() | number:'1.0-0' }}% used</span>
          <span class="text-sm text-gray-500">{{ dashboard.totalSpent | number:'1.2-2' }} / {{ dashboard.totalContractAmount | number:'1.2-2' }} {{ getCurrency() }}</span>
        </div>
        <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500"
               [ngStyle]="{'width': getSpentPercentage() + '%'}"
               [ngClass]="{
                 'bg-gradient-to-r from-green-400 to-green-500': getSpentPercentage() < 60,
                 'bg-gradient-to-r from-yellow-400 to-orange-500': getSpentPercentage() >= 60 && getSpentPercentage() < 85,
                 'bg-gradient-to-r from-red-400 to-red-600': getSpentPercentage() >= 85
               }">
          </div>
        </div>
      </div>

      <!-- Sponsorships Table -->
      <div class="bg-white rounded-2xl shadow-soft-xl border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800">My Sponsorships</h3>
          <p class="text-sm text-gray-500 mt-1">All sponsorships linked to your contracts</p>
        </div>

        <div *ngIf="dashboard.sponsorships.length === 0" class="p-12 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <p class="text-gray-500 font-medium">No sponsorships yet</p>
          <p class="text-gray-400 text-sm mt-1">Your sponsorships will appear here once the admin assigns them.</p>
        </div>

        <div *ngIf="dashboard.sponsorships.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Visibility</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let sp of dashboard.sponsorships; let i = index" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-600">{{ i + 1 }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                        [ngClass]="{
                          'bg-blue-100 text-blue-700': sp.sponsorshipType === 'COURSE',
                          'bg-purple-100 text-purple-700': sp.sponsorshipType === 'EVENT',
                          'bg-green-100 text-green-700': sp.sponsorshipType === 'CERTIFICATION',
                          'bg-orange-100 text-orange-700': sp.sponsorshipType === 'OFFER'
                        }">
                    {{ sp.sponsorshipType }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ sp.targetType }} #{{ sp.targetId }}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ sp.amountAllocated | number:'1.2-2' }} {{ getCurrency() }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ sp.startDate }} → {{ sp.endDate }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{{ sp.visibilityLevel }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Contracts Overview -->
      <div class="bg-white rounded-2xl shadow-soft-xl border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800">My Contracts</h3>
        </div>

        <div *ngIf="dashboard.contracts.length === 0" class="p-8 text-center text-gray-500">
          No contracts found.
        </div>

        <div *ngIf="dashboard.contracts.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contract #</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let c of dashboard.contracts" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-800">{{ c.contractNumber }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">{{ c.type }}</span>
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-800">{{ c.amount | number:'1.2-2' }} {{ c.currency || getCurrency() }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ c.startDate }} → {{ c.endDate }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                        [ngClass]="{
                          'bg-green-100 text-green-700': c.status === 'ACTIVE',
                          'bg-yellow-100 text-yellow-700': c.status === 'DRAFT',
                          'bg-red-100 text-red-700': c.status === 'EXPIRED' || c.status === 'TERMINATED'
                        }">
                    {{ c.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class SponsorDashboardComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  dashboard: SponsorDashboard | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private sponsorService: SponsorService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserInfo();
    if (this.currentUser?.email) {
      this.loadDashboard(this.currentUser.email);
    } else {
      this.isLoading = false;
      this.errorMessage = 'User not authenticated.';
    }
  }

  loadDashboard(email: string): void {
    this.sponsorService.getSponsorByEmail(email).subscribe({
      next: (sponsor) => {
        this.sponsorService.getSponsorDashboard(sponsor.id!).subscribe({
          next: (data) => {
            this.dashboard = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading dashboard:', err);
            this.isLoading = false;
            this.errorMessage = 'Failed to load dashboard data.';
          }
        });
      },
      error: (err) => {
        console.error('Sponsor not found:', err);
        this.isLoading = false;
        this.errorMessage = 'Your sponsor profile has not been created yet. Please contact the administrator.';
      }
    });
  }

  getSpentPercentage(): number {
    if (!this.dashboard || this.dashboard.totalContractAmount === 0) return 0;
    return Math.min((this.dashboard.totalSpent / this.dashboard.totalContractAmount) * 100, 100);
  }

  getCurrency(): string {
    if (this.dashboard?.contracts?.length) {
      return this.dashboard.contracts[0].currency || 'TND';
    }
    return 'TND';
  }
}


