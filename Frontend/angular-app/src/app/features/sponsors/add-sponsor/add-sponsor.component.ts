import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sponsor } from '../../../shared/models/sponsor.model';
import { SponsorService } from '../../../shared/sponsor.service';

@Component({
  selector: 'app-add-sponsor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Add Sponsor</h1>

      <!-- Success message -->
      <div *ngIf="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>

      <!-- Error message -->
      <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>

      <div class="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" [(ngModel)]="sponsor.name"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter name" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
          <input type="email" [(ngModel)]="sponsor.email"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter email (used for sponsor login)" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password <span class="text-red-500">*</span></label>
          <input type="password" [(ngModel)]="sponsor.password"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Set password for sponsor login (min 8 chars)" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="text" [(ngModel)]="sponsor.phone"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter phone" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input type="text" [(ngModel)]="sponsor.companyName"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter company name" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <input type="text" [(ngModel)]="sponsor.industry"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter industry" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input type="text" [(ngModel)]="sponsor.website"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter website URL" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input type="text" [(ngModel)]="sponsor.logoUrl"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="Enter logo URL" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select [(ngModel)]="sponsor.status"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div class="flex gap-3 pt-2">
          <button (click)="addSponsor()"
                  [disabled]="isLoading"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Saving...' : 'Save' }}
          </button>
          <button (click)="cancel()"
                  [disabled]="isLoading"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `
})
export class AddSponsorComponent {
  sponsor: Sponsor = { name: '', email: '', status: 'ACTIVE' } as Sponsor;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private sponsorService: SponsorService,
    private router: Router
  ) {}

  addSponsor(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.sponsor.name || !this.sponsor.email || !this.sponsor.password) {
      this.errorMessage = 'Name, Email, and Password are required.';
      return;
    }

    if (this.sponsor.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }

    this.isLoading = true;
    this.sponsorService.createSponsor(this.sponsor).subscribe({
      next: (createdSponsor) => {
        this.successMessage = 'Sponsor created successfully! Redirecting to add contract...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/dashboard/contracts/add'], { queryParams: { sponsorId: createdSponsor.id } }), 1000);
      },
      error: (err) => {
        console.error('Error creating sponsor', err);
        this.errorMessage = err.error?.message || err.message || 'Failed to create sponsor. Make sure the backend is running on port 8080.';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/sponsors']);
  }
}


