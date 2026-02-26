import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sponsor } from '../../../shared/models/sponsor.model';
import { SponsorService } from '../../../shared/sponsor.service';

@Component({
  selector: 'app-sponsor-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Sponsors</h1>
        <a routerLink="/dashboard/sponsors/add"
           class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
          + Add Sponsor
        </a>
      </div>

      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let sponsor of sponsors; let i = index" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ i + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sponsor.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sponsor.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sponsor.companyName || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span [class]="sponsor.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ sponsor.status || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <a [routerLink]="['/dashboard/sponsors/edit', sponsor.id]"
                   class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg shadow transition inline-block">
                  Edit
                </a>
                <button (click)="deleteSponsor(sponsor.id!)"
                        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow transition">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="sponsors.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-400 text-sm">No sponsors found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SponsorListComponent implements OnInit {
  sponsors: Sponsor[] = [];

  constructor(private sponsorService: SponsorService) {}

  ngOnInit(): void {
    this.loadSponsors();
  }

  loadSponsors(): void {
    this.sponsorService.getAllSponsors().subscribe({
      next: (data) => this.sponsors = data,
      error: (err) => console.error('Error loading sponsors', err)
    });
  }

  deleteSponsor(id: number): void {
    this.sponsorService.deleteSponsor(id).subscribe({
      next: () => this.loadSponsors(),
      error: (err) => console.error('Error deleting sponsor', err)
    });
  }
}
