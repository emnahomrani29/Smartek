import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { Event, EventRequest } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss']
})
export class EventManagementComponent implements OnInit {
  events: Event[] = [];
  eventForm: FormGroup;
  isEditing = false;
  editingEventId: number | null = null;
  showForm = false;
  loading = false;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      maxParticipations: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load events';
        this.loading = false;
        console.error('Error loading events:', err);
      }
    });
  }

  openCreateForm(): void {
    this.isEditing = false;
    this.editingEventId = null;
    this.eventForm.reset({ maxParticipations: 1 });
    this.showForm = true;
  }

  openEditForm(event: Event): void {
    this.isEditing = true;
    this.editingEventId = event.eventId!;
    
    const startDate = this.formatDateForInput(event.startDate);
    const endDate = this.formatDateForInput(event.endDate);
    
    this.eventForm.patchValue({
      title: event.title,
      startDate: startDate,
      endDate: endDate,
      location: event.location,
      maxParticipations: event.maxParticipations
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.eventForm.reset();
    this.isEditing = false;
    this.editingEventId = null;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.eventForm.value;
    const eventRequest: EventRequest = {
      title: formValue.title,
      startDate: this.formatDateForApi(formValue.startDate),
      endDate: this.formatDateForApi(formValue.endDate),
      location: formValue.location,
      maxParticipations: formValue.maxParticipations
    };

    if (this.isEditing && this.editingEventId) {
      this.eventService.updateEvent(this.editingEventId, eventRequest).subscribe({
        next: () => {
          this.loadEvents();
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to update event';
          this.loading = false;
          console.error('Error updating event:', err);
        }
      });
    } else {
      this.eventService.createEvent(eventRequest).subscribe({
        next: () => {
          this.loadEvents();
          this.closeForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to create event';
          this.loading = false;
          console.error('Error creating event:', err);
        }
      });
    }
  }

  deleteEvent(id: number): void {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.loadEvents();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to delete event';
        this.loading = false;
        console.error('Error deleting event:', err);
      }
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  formatDateForApi(dateString: string): string {
    return new Date(dateString).toISOString();
  }

  formatDateForDisplay(dateString: string): string {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
