import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contract, Sponsor } from '../../../shared/models/sponsor.model';
import { ContractService } from '../../../shared/contract.service';
import { SponsorService } from '../../../shared/sponsor.service';

@Component({
  selector: 'app-edit-contract',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Edit Contract</h1>

      <div *ngIf="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>

      <div *ngIf="contract" class="bg-white rounded-lg shadow p-6 space-y-4">
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
                 class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input type="text" [(ngModel)]="contract.currency"
                   class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea [(ngModel)]="contract.description" rows="3"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
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
          <button (click)="updateContract()" [disabled]="isLoading"
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
export class EditContractComponent implements OnInit {
  contract: Contract | null = null;
  sponsors: Sponsor[] = [];
  sponsorId: number | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private contractId!: number;

  constructor(
    private contractService: ContractService,
    private sponsorService: SponsorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.contractId = Number(this.route.snapshot.paramMap.get('id'));

    this.sponsorService.getAllSponsors().subscribe({
      next: (data) => this.sponsors = data,
      error: (err) => console.error('Error loading sponsors', err)
    });

    this.contractService.getContractById(this.contractId).subscribe({
      next: (data) => {
        this.contract = data;
        this.sponsorId = data.sponsor?.id || null;
      },
      error: (err) => {
        console.error('Error loading contract', err);
        this.errorMessage = 'Failed to load contract.';
      }
    });
  }

  updateContract(): void {
    if (!this.contract || !this.sponsorId) return;
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;
    this.contractService.updateContract(this.contractId, this.sponsorId, this.contract).subscribe({
      next: () => {
        this.successMessage = 'Contract updated successfully!';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/dashboard/contracts']), 1000);
      },
      error: (err) => {
        console.error('Error updating contract', err);
        this.errorMessage = err.error?.message || 'Failed to update contract.';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/contracts']);
  }
}

