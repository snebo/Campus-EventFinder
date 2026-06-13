import { AbstractControl } from '@angular/forms';

export function getValidationErrorMessage(control: AbstractControl, label: string): string | null {
  const errors = control.errors;

  if (!errors) {
    return null;
  }

  if (errors['required']) {
    return `${label} is required`;
  }

  if (errors['email']) {
    return 'Enter a valid email address';
  }

  if (errors['minlength']) {
    const { requiredLength } = errors['minlength'] as { requiredLength: number };
    return `${label} must be at least ${requiredLength} characters`;
  }

  return null;
}
