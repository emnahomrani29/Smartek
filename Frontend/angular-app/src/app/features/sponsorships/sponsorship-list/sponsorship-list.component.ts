import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sponsorship } from '../../../shared/models/sponsor.model';
import { SponsorshipService } from '../../../shared/sponsorship.service';

@Component({
  selector: 'app-sponsorship-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Sponsorships</h1>
        <a routerLink="/dashboard/sponsorships/add"
           class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
          + Add Sponsorship
        </a>
      </div>

      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let s of sponsorships; let i = index" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ i + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ s.sponsorshipType || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ s.amountAllocated }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ s.startDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ s.endDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ s.targetType }} #{{ s.targetId }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-yellow-100 text-yellow-800': s.visibilityLevel === 'LOGO',
                        'bg-blue-100 text-blue-800': s.visibilityLevel === 'FEATURED',
                        'bg-purple-100 text-purple-800': s.visibilityLevel === 'TITLE'
                      }">
                  {{ s.visibilityLevel || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button (click)="deleteSponsorship(s.id!)"
                        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow transition">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="sponsorships.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-400 text-sm">No sponsorships found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SponsorshipListComponent implements OnInit {
  sponsorships: Sponsorship[] = [];

  constructor(private sponsorshipService: SponsorshipService) {}

  ngOnInit(): void {
    this.loadSponsorships();
  }

  loadSponsorships(): void {
    this.sponsorshipService.getAllSponsorships().subscribe({
      next: (data) => this.sponsorships = data,
      error: (err) => console.error('Error loading sponsorships', err)
    });
  }

  deleteSponsorship(id: number): void {
    this.sponsorshipService.deleteSponsorship(id).subscribe({
      next: () => this.loadSponsorships(),
      error: (err) => console.error('Error deleting sponsorship', err)
    });
  }
}

