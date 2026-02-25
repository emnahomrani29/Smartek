import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PlanningService } from '../../../core/services/planning.service';
import { EventService } from '../../../core/services/event.service';
import { Planning, PlanningRequest, EventType } from '../../../core/models/planning.model';
import { Event as EventModel } from '../../../core/models/event.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {
  plannings: Planning[] = [];
  events: EventModel[] = [];
  filteredPlannings: Planning[] = [];
  filteredEvents: EventModel[] = [];
  planningForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  loading = false;
  error: string | null = null;
  selectedDate: string = '';
  viewMode: 'day' | 'week' = 'day';
  showEvents = true; // Toggle pour afficher/masquer les événements
  
  eventTypes: EventType[] = [
    { value: 'COURSE', label: 'Cours', color: '#667eea', icon: '📚' },
    { value: 'TRAINING', label: 'Formation', color: '#f093fb', icon: '🎓' },
    { value: 'EXAM', label: 'Examen', color: '#fa709a', icon: '📝' },
    { value: 'MEETING', label: 'Réunion', color: '#4facfe', icon: '👥' },
    { value: 'EVENT', label: 'Événement', color: '#43e97b', icon: '🎉' },
    { value: 'OTHER', label: 'Autre', color: '#a8edea', icon: '📌' }
  ];

  timeSlots: string[] = [];

  constructor(
    private planningService: PlanningService,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.planningForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      eventType: ['COURSE', Validators.required],
      location: [''],
      color: ['#667eea', Validators.required]
    });

    this.generateTimeSlots();
  }

  ngOnInit(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.planningForm.patchValue({ date: this.selectedDate });
    this.loadPlannings();
  }

  generateTimeSlots(): void {
    for (let hour = 8; hour <= 18; hour++) {
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        this.timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
  }

  loadPlannings(): void {
    this.loading = true;
    this.error = null;
    
    // Charger à la fois les plannings et les événements
    forkJoin({
      plannings: this.planningService.getAllPlannings(),
      events: this.eventService.getAllEvents()
    }).subscribe({
      next: (data) => {
        this.plannings = data.plannings;
        this.events = data.events;
        this.filterByDate();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des données';
        this.loading = false;
        console.error('Error loading data:', err);
      }
    });
  }

  filterByDate(): void {
    this.filteredPlannings = this.plannings.filter(p => p.date === this.selectedDate);
    
    // Filtrer les événements pour la date sélectionnée
    this.filteredEvents = this.events.filter(e => {
      const eventStart = new Date(e.startDate).toISOString().split('T')[0];
      const eventEnd = new Date(e.endDate).toISOString().split('T')[0];
      return this.selectedDate >= eventStart && this.selectedDate <= eventEnd;
    });
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.filterByDate();
  }

  onEventTypeChange(event: any): void {
    const selectedType = this.eventTypes.find(t => t.value === event.target.value);
    if (selectedType) {
      this.planningForm.patchValue({ color: selectedType.color });
    }
  }

  onSubmit(): void {
    if (this.planningForm.valid) {
      const planningData: PlanningRequest = this.planningForm.value;
      
      if (this.isEditing && this.editingId) {
        this.updatePlanning(this.editingId, planningData);
      } else {
        this.createPlanning(planningData);
      }
    }
  }

  createPlanning(planningData: PlanningRequest): void {
    this.loading = true;
    this.planningService.createPlanning(planningData).subscribe({
      next: (planning) => {
        this.plannings.push(planning);
        this.filterByDate();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors de la création du planning';
        this.loading = false;
        console.error('Error creating planning:', err);
      }
    });
  }

  updatePlanning(id: number, planningData: PlanningRequest): void {
    this.loading = true;
    this.planningService.updatePlanning(id, planningData).subscribe({
      next: (updatedPlanning) => {
        const index = this.plannings.findIndex(p => p.planningId === id);
        if (index !== -1) {
          this.plannings[index] = updatedPlanning;
        }
        this.filterByDate();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors de la mise à jour du planning';
        this.loading = false;
        console.error('Error updating planning:', err);
      }
    });
  }

  editPlanning(planning: Planning): void {
    this.isEditing = true;
    this.editingId = planning.planningId;
    this.planningForm.patchValue({
      date: planning.date,
      startTime: planning.startTime,
      endTime: planning.endTime,
      title: planning.title,
      description: planning.description,
      eventType: planning.eventType,
      location: planning.location,
      color: planning.color
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deletePlanning(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.loading = true;
      this.planningService.deletePlanning(id).subscribe({
        next: () => {
          this.plannings = this.plannings.filter(p => p.planningId !== id);
          this.filterByDate();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression du planning';
          this.loading = false;
          console.error('Error deleting planning:', err);
        }
      });
    }
  }

  resetForm(): void {
    this.planningForm.reset({
      date: this.selectedDate,
      eventType: 'COURSE',
      color: '#667eea'
    });
    this.isEditing = false;
    this.editingId = null;
    this.error = null;
  }

  getEventTypeInfo(type: string): EventType {
    return this.eventTypes.find(t => t.value === type) || this.eventTypes[4];
  }

  getPlanningsForTimeSlot(time: string): Planning[] {
    return this.filteredPlannings.filter(p => {
      const startHour = parseInt(p.startTime.split(':')[0]);
      const startMinute = parseInt(p.startTime.split(':')[1]);
      const slotHour = parseInt(time.split(':')[0]);
      const slotMinute = parseInt(time.split(':')[1]);
      
      return (startHour === slotHour && startMinute === slotMinute);
    });
  }

  calculateDuration(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    return (endMinutes - startMinutes) / 30; // Nombre de créneaux de 30 minutes
  }

  previousDay(): void {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() - 1);
    this.selectedDate = date.toISOString().split('T')[0];
    this.planningForm.patchValue({ date: this.selectedDate });
    this.filterByDate();
  }

  nextDay(): void {
    const date = new Date(this.selectedDate);
    date.setDate(date.getDate() + 1);
    this.selectedDate = date.toISOString().split('T')[0];
    this.planningForm.patchValue({ date: this.selectedDate });
    this.filterByDate();
  }

  today(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.planningForm.patchValue({ date: this.selectedDate });
    this.filterByDate();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  toggleEvents(): void {
    this.showEvents = !this.showEvents;
  }

  getEventsForDisplay(): any[] {
    const items: any[] = [];
    
    // Ajouter les plannings
    this.filteredPlannings.forEach(p => {
      items.push({
        type: 'planning',
        data: p,
        startTime: p.startTime,
        endTime: p.endTime
      });
    });
    
    // Ajouter les événements (affichés toute la journée ou à 9h par défaut)
    if (this.showEvents) {
      this.filteredEvents.forEach(e => {
        items.push({
          type: 'event',
          data: e,
          startTime: '09:00',
          endTime: '17:00'
        });
      });
    }
    
    return items;
  }

  getItemsForTimeSlot(time: string): any[] {
    const items = this.getEventsForDisplay();
    return items.filter(item => {
      const startHour = parseInt(item.startTime.split(':')[0]);
      const startMinute = parseInt(item.startTime.split(':')[1]);
      const slotHour = parseInt(time.split(':')[0]);
      const slotMinute = parseInt(time.split(':')[1]);
      
      return (startHour === slotHour && startMinute === slotMinute);
    });
  }

  getEventColor(event: EventModel): string {
    return '#43e97b'; // Couleur verte pour les événements
  }

  getEventIcon(event: EventModel): string {
    return '🎉';
  }

  getTotalEventsCount(): number {
    return this.filteredPlannings.length + (this.showEvents ? this.filteredEvents.length : 0);
  }
}
