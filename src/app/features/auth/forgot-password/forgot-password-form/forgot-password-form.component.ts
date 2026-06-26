import { Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { TextInputComponent } from '../../../../shared/ui/text-input/text-input.component';
import { AuthFooterLinkComponent } from '../../shared/auth-footer-link/auth-footer-link.component';
import { ForgotPasswordFormValue } from '../../data-access/auth.models';

@Component({
  selector: 'app-forgot-password-form',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    TextInputComponent,
    ButtonComponent,
    AuthFooterLinkComponent,
  ],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss',
})
export class ForgotPasswordFormComponent {
  isSubmitting = input<boolean>(false);

  submitForm = output<ForgotPasswordFormValue>();
  navigateToSignIn = output<void>();

  emailSent = signal(false);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  emailErrorText(): string | null {
    const control = this.form.controls.email;
    if (control.touched && control.hasError('required')) {
      return 'Please enter your email address.';
    }
    return null;
  }

  isFormValid(): boolean {
    return this.form.status === 'VALID';
  }

  onSubmit(): void {
    this.form.controls.email.markAsTouched();
    if (this.form.invalid) return;

    this.emailSent.set(true);
    this.submitForm.emit(this.form.getRawValue());
  }

  onNavigateToSignIn(): void {
    this.navigateToSignIn.emit();
  }
}