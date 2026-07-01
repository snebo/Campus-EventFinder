import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator: Date must be in the future
 */
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(`${control.value}T00:00:00Z`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { pastDate: true };
  };
}

/**
 * Validator: Capacity must be within reasonable limits
 */
export function capacityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = Number(control.value);
    const MIN_CAPACITY = 1;
    const MAX_CAPACITY = 1000000; // 1 million

    if (value < MIN_CAPACITY || value > MAX_CAPACITY) {
      return { capacityOutOfRange: { min: MIN_CAPACITY, max: MAX_CAPACITY } };
    }

    return null;
  };
}

/**
 * Validator: Location must not be empty after trim
 */
export function nonEmptyStringValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const trimmed = String(control.value).trim();
    return trimmed.length > 0 ? null : { emptyString: true };
  };
}
