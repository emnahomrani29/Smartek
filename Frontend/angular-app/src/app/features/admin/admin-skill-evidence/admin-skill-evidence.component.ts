// features/admin/skill-evidence-list/admin-skill-evidence.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkillEvidenceService } from '../../../core/services/skill-evidence.service';
import { SkillEvidence } from '../../../core/models/skill-evidence.model';

@Component({
  selector: 'app-admin-skill-evidence',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-skill-evidence.component.html',
  styleUrls: ['./admin-skill-evidence.component.scss']
})
export class AdminSkillEvidenceComponent implements OnInit {

  evidences: SkillEvidence[] = [];
  loading = true;
  error: string | null = null;

  constructor(private skillEvidenceService: SkillEvidenceService) {}

  ngOnInit(): void {
    this.loadEvidences();
  }

  loadEvidences(): void {
    this.loading = true;
    this.skillEvidenceService.getSkillEvidences().subscribe({
      next: (data) => {
        this.evidences = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des preuves', err);
        this.error = 'Impossible de charger la liste des preuves de compétences';
        this.loading = false;
      }
    });
  }

  formatDate(date?: Date): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}