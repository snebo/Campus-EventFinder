import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormFieldComponent, FormFieldHelperVariant } from '../../../../shared/ui/form-field/form-field.component';
import { PasswordInputComponent } from '../../../../shared/ui/password-input/password-input.component';
import { TextInputComponent } from '../../../../shared/ui/text-input/text-input.component';
import { TooltipComponent } from '../../../../shared/ui/tooltip/tooltip.component';
import { getValidationErrorMessage } from '../../../../shared/utils/form-errors';
import { SignupFormValue } from '../../data-access/auth.models';
import { AuthFooterLinkComponent } from '../../shared/auth-footer-link/auth-footer-link.component';

const PASSWORD_MIN_LENGTH = 8;

type SignupField = 'fullName' | 'email';

@Component({
  selector: 'app-signup-form',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    TextInputComponent,
    PasswordInputComponent,
    ButtonComponent,
    TooltipComponent,
    AuthFooterLinkComponent,
  ],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss',
})
export class SignupFormComponent {
  isSubmitting = input<boolean>(false);
  serverError = input<string | null>();
  fieldErrors = input<Record<string, string> | null>();

  submitForm = output<SignupFormValue>();
  navigateToSignIn = output<void>();

  readonly form = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(PASSWORD_MIN_LENGTH)],
    }),
  });

  private readonly serverErrorDismissed = signal(false);
  private readonly dismissedFieldErrors = signal<ReadonlySet<string>>(new Set());

  showServerErrorTooltip = computed(() => this.serverError() != null && !this.serverErrorDismissed());

  constructor() {
    effect(() => {
      this.serverError();
      this.serverErrorDismissed.set(false);
    });

    effect(() => {
      const errors = this.fieldErrors();
      if (!errors) {
        return;
      }

      this.dismissedFieldErrors.update((dismissed) => {
        const next = new Set(dismissed);
        for (const field of Object.keys(errors)) {
          next.delete(field);
        }
        return next;
      });
    });

    this.form.controls.fullName.valueChanges.subscribe(() => this.dismissFieldError('fullName'));
    this.form.controls.email.valueChanges.subscribe(() => this.dismissFieldError('email'));
  }

  isFormValid(): boolean {
    return this.form.status === 'VALID';
  }

  passwordHelperText(): string {
    return this.form.controls.password.value.length >= PASSWORD_MIN_LENGTH ? 'Looks good' : 'Minimum 8 characters';
  }

  passwordHelperVariant(): FormFieldHelperVariant {
    return this.form.controls.password.value.length >= PASSWORD_MIN_LENGTH ? 'success' : 'default';
  }

  fullNameErrorText(): string | null {
    return this.errorTextFor('fullName', 'Full Name');
  }

  emailErrorText(): string | null {
    return this.errorTextFor('email', 'Email');
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }
    this.submitForm.emit(this.form.getRawValue());
  }

  onServerErrorDismiss(): void {
    this.serverErrorDismissed.set(true);
  }

  private errorTextFor(field: SignupField, label: string): string | null {
    const control = this.form.controls[field];
    const serverError = this.fieldErrors()?.[field];

    if (serverError && !this.dismissedFieldErrors().has(field)) {
      return serverError;
    }

    return control.touched ? getValidationErrorMessage(control, label) : null;
  }

  private dismissFieldError(field: SignupField): void {
    if (this.dismissedFieldErrors().has(field)) {
      return;
    }

    this.dismissedFieldErrors.update((dismissed) => new Set(dismissed).add(field));
  }
}
