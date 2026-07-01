import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Get validation error message for a form control
 * @param control - FormControl to get error message from
 * @param fieldLabel - Human-readable field name
 * @returns Error message string or null
 */
export function getValidationErrorMessage(
  control: AbstractControl | null,
  fieldLabel: string
): string | null {
  if (!control || !control.errors || !control.touched) {
    return null;
  }

  const errors = control.errors;

  if (!errors) {
    return null;
  }

  if (errors['required']) {
    return `${fieldLabel} is required`;
  }

  if (errors['email']) {
    return 'Enter a valid email address';
  }

  if (errors['minlength']) {
    const { requiredLength } = errors['minlength'] as { requiredLength: number };
    return `${fieldLabel} must be at least ${requiredLength} characters`;
  }

  if (errors['minlength']) {
    return `${fieldLabel} must be at least ${errors['minlength'].requiredLength} characters`;
  }

  if (errors['maxlength']) {
    return `${fieldLabel} must not exceed ${errors['maxlength'].requiredLength} characters`;
  }

  if (errors['min']) {
    return `${fieldLabel} must be at least ${errors['min'].min}`;
  }

  if (errors['max']) {
    return `${fieldLabel} must not exceed ${errors['max'].max}`;
  }

  if (errors['email']) {
    return `${fieldLabel} must be a valid email address`;
  }

  if (errors['pattern']) {
    return `${fieldLabel} format is invalid`;
  }

  if (errors['pastDate']) {
    return `${fieldLabel} must be in the future`;
  }

  // Generic error message
  return `${fieldLabel} is invalid`;
}

/**
 * Get all form errors as a flat array for display
 * @param control - FormGroup to check for errors
 * @returns Array of error messages
 */
export function getFormErrorMessages(control: AbstractControl): string[] {
  const errors: string[] = [];

  if (control instanceof FormGroup) {
    Object.keys(control.controls).forEach((key) => {
      const fieldControl = control.get(key);
      if (fieldControl && fieldControl.errors && fieldControl.touched) {
        const fieldLabel = formatFieldLabel(key);
        const errorMessage = getValidationErrorMessage(fieldControl, fieldLabel);
        if (errorMessage) {
          errors.push(errorMessage);
        }
      }
    });
  }

  return errors;
}

/**
 * Convert camelCase field name to human-readable label
 * @param fieldName - camelCase field name
 * @returns Human-readable label
 */
export function formatFieldLabel(fieldName: string): string {
  // Insert space before uppercase letters and capitalize first letter
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

}

import { FormGroup } from '@angular/forms';
