import { Component, ChangeDetectionStrategy, inject, signal, HostListener } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { EventsService } from '../events/data-access/events.service';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { FormFieldComponent } from '../../shared/ui/form-field/form-field.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { EVENT_CATEGORIES, EventCategory } from '../../shared/models/categories.const';
import { getValidationErrorMessage } from '../../shared/utils/form-errors';
import { EventDetails } from '../../shared/models/event.model';
import { SuccessModalComponent } from './success-modal/success-modal.component';

// Type definitions for form controls
interface CreateEventFormValue {
  eventName: string;
  eventCategory: EventCategory | '';
  date: string;
  time: string;
  location: string;
  aboutEvent: string;
  capacity: number | null;
  admission: 'free' | 'paid';
  imageUrl: string;
}

@Component({
  selector: 'app-create-event-page',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    PageHeaderComponent,
    FormFieldComponent,
    ButtonComponent,
    SuccessModalComponent
  ],
  templateUrl: './create-event-page.component.html',
  styleUrl: './create-event-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventPageComponent {
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);

  eventCreated = false;

  // Constants
  protected readonly categories = EVENT_CATEGORIES;
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  // State signals
  protected readonly isSubmitting = signal(false);
  protected readonly coverImagePreview = signal<string | null>(null);
  protected readonly imageError = signal<string | null>(null);

  eventId = signal<string>('')

  // Form group with explicit type
  readonly form = this.createForm();

  constructor() {
    // Clean up unsaved changes warning on component destroy
    // (handled by Angular automatically in OnPush strategy)
  }

  /**
   * Create the event form with typed controls
   */
  private createForm(): FormGroup<{
    eventName: FormControl<string>;
    eventCategory: FormControl<EventCategory | ''>;
    date: FormControl<string>;
    time: FormControl<string>;
    location: FormControl<string>;
    aboutEvent: FormControl<string>;
    capacity: FormControl<number | null>;
    admission: FormControl<'free' | 'paid'>;
    imageUrl: FormControl<string>;

  }> {
    return new FormGroup({
      eventName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      }),
      eventCategory: new FormControl<EventCategory | ''>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      date: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, this.futureDateValidator.bind(this)],
      }),
      time: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      location: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      aboutEvent: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10), Validators.maxLength(1000)],
      }),
      capacity: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(1), Validators.max(1000000)],
      }),
      admission: new FormControl<'free' | 'paid'>('free', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      imageUrl: new FormControl('', { nonNullable: true }),
    });
  }

  /**
   * Custom validator to ensure date is in the future
   */
  private futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  }

  /**
   * Get validation error message for a form field
   */
  errorTextFor(field: string, label: string): string | null {
    const control = this.form.get(field);
    return control && control.touched ? getValidationErrorMessage(control, label) : null;
  }

  /**
   * Handle file selection with validation
   */
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Reset previous error
    this.imageError.set(null);

    // Validate file size
    if (file.size > this.MAX_IMAGE_SIZE) {
      this.imageError.set('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    // Validate file type
    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.imageError.set('Invalid image format. Please use JPEG, PNG, or WebP.');
      return;
    }

    // Read file and create preview
    this.readAndPreviewImage(file);
  }

  /**
   * Read image file and create preview
   */
  private readAndPreviewImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string | null;
      if (result) {
        this.coverImagePreview.set(result);
        this.form.patchValue({ imageUrl: result });
      }
    };

    reader.onerror = () => {
      this.imageError.set('Failed to read image file. Please try again.');
    };

    reader.readAsDataURL(file);
  }

  /**
   * Handle form submission
   */
  onSubmit(isDraft = false): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formValue = this.form.getRawValue();
      const eventDetails = this.createEventDetails(formValue);

      this.eventsService.createEvent(eventDetails).subscribe({
        next: (createdEvent) => {
          this.isSubmitting.set(false);
          this.eventCreated = true;
          this.eventId.set(createdEvent.id);
          // void this.router.navigate(['/home']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.handleSubmissionError(err);
        },
      });
    } catch (error) {
      this.isSubmitting.set(false);
      console.error('Error preparing event submission', error);
    }
  }

  /**
   * Create EventDetails object from form value with proper typing
   */
  private createEventDetails(formValue: CreateEventFormValue): Omit<EventDetails, 'id'> {
    const dateLabel = this.formatDateLabel(formValue.date);
    const timeLabel = this.formatTimeLabel(formValue.time);

    // Type guard to ensure category is valid
    const category = this.getValidCategory(formValue.eventCategory);

    return {
      title: formValue.eventName.trim(),
      category,
      date: formValue.date,
      dateLabel,
      timeLabel,
      location: formValue.location.trim(),
      description: formValue.aboutEvent.trim(),
      imageUrl: formValue.imageUrl || this.getDefaultImage(),
    };
  }

  /**
   * Get valid category with type safety
   */
  private getValidCategory(value: EventCategory | ''): EventCategory {
    if (!value) {
      throw new Error('Invalid category selected');
    }
    return value as EventCategory;
  }

  /**
   * Handle submission errors
   */
  private handleSubmissionError(error: unknown): void {
    console.error('Error creating event:', error);

    if (error instanceof Error) {
      // TODO: Show toast/snackbar notification to user
      console.error('Error details:', error.message);
    }
  }

  /**
   * Format date string (YYYY-MM-DD) to label (MMM D)
   */
  private formatDateLabel(dateStr: string): string {
    if (!dateStr) return '';

    try {
      const date = new Date(`${dateStr}T00:00:00Z`);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch {
      return '';
    }
  }

  /**
   * Format time string (HH:MM) to label (H:MM AM/PM)
   */
  private formatTimeLabel(timeStr: string): string {
    if (!timeStr) return '';

    try {
      const [hours, minutes] = timeStr.split(':').map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        return '';
      }

      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12; // Convert 0 to 12, keep others

      return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
    } catch {
      return '';
    }
  }

  /**
   * Get default image URL
   */
  private getDefaultImage(): string {
    return 'https://picsum.photos/seed/default/800/450';
  }

  /**
   * Warn user if they try to leave with unsaved changes
   */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.form.dirty && !this.isSubmitting()) {
      $event.returnValue = true;
    }
  }

  showSuccessModal(): boolean {
    console.log("event modal status", this.eventCreated)
    return this.eventCreated
  }

  getEventId():string | null {
    return this.eventId();
  }
}
