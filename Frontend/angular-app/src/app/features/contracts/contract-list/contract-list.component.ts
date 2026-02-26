import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Contract } from '../../../shared/models/sponsor.model';
import { ContractService } from '../../../shared/contract.service';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Contracts</h1>
        <a routerLink="/dashboard/contracts/add"
           class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
          + Add Contract
        </a>
      </div>

      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract #</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsor</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let contract of contracts; let i = index" class="hover:bg-gray-50 transition">
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{{ i + 1 }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ contract.contractNumber }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ contract.sponsor?.name || contract.sponsor?.email || 'N/A' }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ contract.startDate }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ contract.endDate }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{{ contract.amount }} {{ contract.currency }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-green-100 text-green-800': contract.status === 'ACTIVE',
                        'bg-yellow-100 text-yellow-800': contract.status === 'DRAFT',
                        'bg-red-100 text-red-800': contract.status === 'EXPIRED' || contract.status === 'TERMINATED'
                      }">
                  {{ contract.status || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{{ contract.type || 'N/A' }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm space-x-2">
                <a [routerLink]="['/dashboard/contracts/edit', contract.id]"
                   class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg shadow transition inline-block">
                  Edit
                </a>
                <button (click)="deleteContract(contract.id!)"
                        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg shadow transition">
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="contracts.length === 0">
              <td colspan="9" class="px-6 py-8 text-center text-gray-400 text-sm">No contracts found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ContractListComponent implements OnInit {
  contracts: Contract[] = [];

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.contractService.getAllContracts().subscribe({
      next: (data) => this.contracts = data,
      error: (err) => console.error('Error loading contracts', err)
    });
  }

  deleteContract(id: number): void {
    this.contractService.deleteContract(id).subscribe({
      next: () => this.loadContracts(),
      error: (err) => console.error('Error deleting contract', err)
    });
  }
}
