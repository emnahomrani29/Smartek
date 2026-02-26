import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sponsor } from '../../../shared/models/sponsor.model';
import { SponsorService } from '../../../shared/sponsor.service';

@Component({
  selector: 'app-edit-sponsor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Sponsor</h1>

      <div *ngIf="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>

      <div *ngIf="sponsor" class="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" [(ngModel)]="sponsor.name"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" [(ngModel)]="sponsor.email"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="text" [(ngModel)]="sponsor.phone"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input type="text" [(ngModel)]="sponsor.companyName"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <input type="text" [(ngModel)]="sponsor.industry"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input type="text" [(ngModel)]="sponsor.website"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
          <input type="text" [(ngModel)]="sponsor.logoUrl"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          <button (click)="updateSponsor()" [disabled]="isLoading"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition disabled:opacity-50">
            {{ isLoading ? 'Saving...' : 'Update' }}
          </button>
          <button (click)="cancel()"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `
})
export class EditSponsorComponent implements OnInit {
  sponsor: Sponsor | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private sponsorId!: number;

  constructor(
    private sponsorService: SponsorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sponsorId = Number(this.route.snapshot.paramMap.get('id'));
    this.sponsorService.getSponsorById(this.sponsorId).subscribe({
      next: (data) => this.sponsor = data,
      error: (err) => {
        console.error('Error loading sponsor', err);
        this.errorMessage = 'Failed to load sponsor.';
      }
    });
  }

  updateSponsor(): void {
    if (!this.sponsor) return;
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;
    this.sponsorService.updateSponsor(this.sponsorId, this.sponsor).subscribe({
      next: () => {
        this.successMessage = 'Sponsor updated successfully!';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/dashboard/sponsors']), 1000);
      },
      error: (err) => {
        console.error('Error updating sponsor', err);
        this.errorMessage = err.error?.message || 'Failed to update sponsor.';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/sponsors']);
  }
}

