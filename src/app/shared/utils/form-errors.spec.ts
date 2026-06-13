import { FormControl } from '@angular/forms';
import { getValidationErrorMessage } from './form-errors';

describe('getValidationErrorMessage', () => {
  it('returns null when the control has no errors', () => {
    const control = new FormControl('value');

    expect(getValidationErrorMessage(control, 'Email')).toBeNull();
  });

  it('returns a required message when the required error is present', () => {
    const control = new FormControl('');
    control.setErrors({ required: true });

    expect(getValidationErrorMessage(control, 'Email')).toBe('Email is required');
  });

  it('returns an email format message when the email error is present', () => {
    const control = new FormControl('not-an-email');
    control.setErrors({ email: true });

    expect(getValidationErrorMessage(control, 'Email')).toBe('Enter a valid email address');
  });

  it('returns a minlength message with the actual required length substituted', () => {
    const control = new FormControl('ab');
    control.setErrors({ minlength: { requiredLength: 8, actualLength: 2 } });

    expect(getValidationErrorMessage(control, 'Password')).toBe('Password must be at least 8 characters');
  });

  it('prioritizes the required message over email and minlength errors', () => {
    const control = new FormControl('');
    control.setErrors({
      required: true,
      email: true,
      minlength: { requiredLength: 8, actualLength: 0 },
    });

    expect(getValidationErrorMessage(control, 'Password')).toBe('Password is required');
  });

  it('prioritizes the email message over the minlength error', () => {
    const control = new FormControl('a');
    control.setErrors({
      email: true,
      minlength: { requiredLength: 8, actualLength: 1 },
    });

    expect(getValidationErrorMessage(control, 'Email')).toBe('Enter a valid email address');
  });
});
