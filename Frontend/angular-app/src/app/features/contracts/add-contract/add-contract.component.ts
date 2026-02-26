import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Contract, Sponsor } from '../../../shared/models/sponsor.model';
import { ContractService } from '../../../shared/contract.service';
import { SponsorService } from '../../../shared/sponsor.service';

@Component({
  selector: 'app-add-contract',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Add Contract</h1>

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
          <label class="block text-sm font-medium text-gray-700 mb-1">Sponsor</label>
          <select [(ngModel)]="sponsorId"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option [ngValue]="null" disabled>-- Select a Sponsor --</option>
            <option *ngFor="let s of sponsors" [ngValue]="s.id">
              #{{ s.id }} - {{ s.name }} ({{ s.email }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contract Number</label>
          <input type="text" [(ngModel)]="contract.contractNumber"
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                 placeholder="e.g. CNTR-2026-001" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" [(ngModel)]="contract.startDate"
                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" [(ngModel)]="contract.endDate"
                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input type="number" [(ngModel)]="contract.amount"
                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="e.g. 10000" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input type="text" [(ngModel)]="contract.currency"
                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   placeholder="e.g. USD" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea [(ngModel)]="contract.description" rows="3"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contract description"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select [(ngModel)]="contract.status"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select [(ngModel)]="contract.type"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="COURSE">Course</option>
              <option value="EVENT">Event</option>
              <option value="CERTIFICATION">Certification</option>
              <option value="GLOBAL">Global</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button (click)="addContract()" [disabled]="isLoading"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition disabled:opacity-50">
            {{ isLoading ? 'Saving...' : 'Save' }}
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
export class AddContractComponent implements OnInit {
  sponsorId: number | null = null;
  sponsors: Sponsor[] = [];
  contract: Contract = { contractNumber: '', startDate: '', endDate: '', status: 'DRAFT', type: 'GLOBAL' } as Contract;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private contractService: ContractService,
    private sponsorService: SponsorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sponsorService.getAllSponsors().subscribe({
      next: (data) => this.sponsors = data,
      error: (err) => console.error('Error loading sponsors', err)
    });

    // Auto-select sponsor if coming from add-sponsor redirect
    this.route.queryParams.subscribe(params => {
      if (params['sponsorId']) {
        this.sponsorId = +params['sponsorId'];
      }
    });
  }

  addContract(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.sponsorId || !this.contract.contractNumber || !this.contract.startDate || !this.contract.endDate) {
      this.errorMessage = 'Sponsor, Contract Number, Start Date, and End Date are required.';
      return;
    }

    this.isLoading = true;
    this.contractService.createContract(this.sponsorId, this.contract).subscribe({
      next: () => {
        this.successMessage = 'Contract created successfully!';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/dashboard/contracts']), 1000);
      },
      error: (err) => {
        console.error('Error creating contract', err);
        this.errorMessage = err.error?.message || 'Failed to create contract.';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/contracts']);
  }
}
