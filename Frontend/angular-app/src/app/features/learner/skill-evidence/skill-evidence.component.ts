import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillEvidenceService } from '../../../core/services/skill-evidence.service';
import { SkillEvidence } from '../../../core/models/skill-evidence.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-skill-evidence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-evidence.component.html',
  styleUrls: ['./skill-evidence.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SkillEvidenceComponent implements OnInit {

  evidences: SkillEvidence[] = [];
  selectedEvidence: SkillEvidence | null = null;
  showEditModal = false;
  isLoading = false;
  validationErrors: { [key: string]: string } = {};
  errorMessage: string | null = null;

  // ────────────────────────────────────────────────
  //  →→→ CONTRÔLE DES DROITS ←←←
  // Mettre à true   → mode learner (édition possible)
  // Mettre à false  → mode admin   (lecture seule)
  // ────────────────────────────────────────────────
  canEdit = false;   // ←←← ICI : mets true pour tester le mode learner

  Object = Object;

  constructor(private skillEvidenceService: SkillEvidenceService) {}

  ngOnInit(): void {
    this.detectUserRole();
    this.loadEvidences();
  }

  private detectUserRole(): void {
    // ───────────────────────────────────────────────────────────────
    // Remplace cette partie par TA vraie logique d'authentification
    // Exemples :
    //   - this.canEdit = !this.authService.isAdmin();
    //   - const role = localStorage.getItem('role') || 'admin';
    //   - this.canEdit = role.toLowerCase() === 'learner' || role === 'apprenant';
    // ───────────────────────────────────────────────────────────────

    // Pour tester rapidement : décommente une des lignes ci-dessous

    // this.canEdit = true;               // force mode learner
    // this.canEdit = false;              // force mode admin (lecture seule)

    // Exemple avec localStorage (très courant en dev)
    const storedRole = localStorage.getItem('userRole')?.toLowerCase();
    if (storedRole) {
      this.canEdit = !['admin', 'administrator'].includes(storedRole);
    }

    console.log('[Role Detection] canEdit =', this.canEdit, '→ mode:', this.canEdit ? 'LEARNER' : 'ADMIN');
  }

  loadEvidences(): void {
    this.isLoading = true;
    this.skillEvidenceService.getSkillEvidences().subscribe({
      next: (data) => {
        this.evidences = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement preuves', err);
        this.errorMessage = 'Impossible de charger les preuves';
        this.isLoading = false;
      }
    });
  }

  openAddForm(): void {
    if (!this.canEdit) return;
    this.validationErrors = {};
    this.selectedEvidence = {
      title: '',
      description: '',
      fileUrl: '',
      uploadDate: new Date()
    };
    this.showEditModal = true;
  }

  editEvidence(evidence: SkillEvidence): void {
    if (!this.canEdit) return;
    this.validationErrors = {};
    this.selectedEvidence = { ...evidence };
    this.showEditModal = true;
  }

  viewEvidence(evidence: SkillEvidence): void {
    if (evidence.fileUrl) {
      window.open(evidence.fileUrl, '_blank');
    }
  }

  deleteEvidence(evidenceId?: number): void {
    if (!this.canEdit || !evidenceId) return;

    if (confirm('Confirmez-vous la suppression de cette preuve ?')) {
      this.skillEvidenceService.deleteSkillEvidence(evidenceId).subscribe({
        next: () => {
          this.evidences = this.evidences.filter(e => e.evidenceId !== evidenceId);
        },
        error: (err) => {
          console.error('Échec suppression', err);
          this.errorMessage = 'Erreur lors de la suppression';
        }
      });
    }
  }

  validateForm(): boolean {
    this.validationErrors = {};
    if (!this.selectedEvidence) return false;

    if (!this.selectedEvidence.title?.trim()) {
      this.validationErrors['title'] = 'Le titre est obligatoire';
    } else if (this.selectedEvidence.title.length < 3) {
      this.validationErrors['title'] = 'Minimum 3 caractères';
    } else if (this.selectedEvidence.title.length > 100) {
      this.validationErrors['title'] = 'Maximum 100 caractères';
    }

    if (this.selectedEvidence.description && this.selectedEvidence.description.length > 500) {
      this.validationErrors['description'] = 'Maximum 500 caractères';
    }

    if (this.selectedEvidence.fileUrl?.trim()) {
      try { new URL(this.selectedEvidence.fileUrl); } catch {
        this.validationErrors['fileUrl'] = 'URL invalide';
      }
    }

    if (!this.selectedEvidence.uploadDate) {
      this.validationErrors['uploadDate'] = 'La date est obligatoire';
    } else {
      const d = new Date(this.selectedEvidence.uploadDate);
      if (isNaN(d.getTime()) || d > new Date()) {
        this.validationErrors['uploadDate'] = d > new Date() ? 'Date future interdite' : 'Date invalide';
      }
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  saveEdit(): void {
    if (!this.canEdit || !this.selectedEvidence || !this.validateForm()) return;

    const isUpdate = !!this.selectedEvidence.evidenceId;
    const obs = isUpdate
      ? this.skillEvidenceService.updateSkillEvidence(this.selectedEvidence.evidenceId!, this.selectedEvidence)
      : this.skillEvidenceService.createSkillEvidence(this.selectedEvidence);

    obs.subscribe({
      next: (result) => {
        if (isUpdate) {
          const idx = this.evidences.findIndex(e => e.evidenceId === result.evidenceId);
          if (idx !== -1) this.evidences[idx] = result;
        } else {
          this.evidences = [...this.evidences, result];
        }
        this.closeEditModal();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur sauvegarde';
        console.error('Échec sauvegarde', err);
      }
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedEvidence = null;
    this.validationErrors = {};
    this.errorMessage = null;
  }
}