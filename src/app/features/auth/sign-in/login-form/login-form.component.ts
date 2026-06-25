import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { FormFieldComponent } from '../../../../shared/ui/form-field/form-field.component';
import { PasswordInputComponent } from '../../../../shared/ui/password-input/password-input.component';
import { TextInputComponent } from '../../../../shared/ui/text-input/text-input.component';
import { TextLinkComponent } from '../../../../shared/ui/text-link/text-link.component';
import { TooltipComponent } from '../../../../shared/ui/tooltip/tooltip.component';
import { getValidationErrorMessage } from '../../../../shared/utils/form-errors';
import { LoginFormValue } from '../../data-access/auth.models';
import { AuthFooterLinkComponent } from '../../shared/auth-footer-link/auth-footer-link.component';

type LoginField = 'email' | 'password';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    TextInputComponent,
    PasswordInputComponent,
    TextLinkComponent,
    ButtonComponent,
    TooltipComponent,
    AuthFooterLinkComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  isSubmitting = input<boolean>(false);
  serverError = input<string | null>();
  fieldErrors = input<Record<string, string> | null>();
  showComingSoon = signal(false);

  submitForm = output<LoginFormValue>();
  navigateToSignUp = output<void>();

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  private readonly serverErrorDismissed = signal(false);
  private readonly dismissedFieldErrors = signal<ReadonlySet<string>>(new Set());

  showServerErrorTooltip = computed(
    () => this.serverError() != null && !this.serverErrorDismissed(),
  );

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

    this.form.controls.email.valueChanges.subscribe(() => this.dismissFieldError('email'));
    this.form.controls.password.valueChanges.subscribe(() => this.dismissFieldError('password'));
  }

  isFormValid(): boolean {
    return this.form.status === 'VALID';
  }

  emailErrorText(): string | null {
    return this.errorTextFor('email', 'Email');
  }

  passwordErrorText(): string | null {
    return this.errorTextFor('password', 'Password');
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

  onGoogleSignIn(): void {
    this.showComingSoon.set(true);
  }

  onComingSoonDismiss(): void {
    this.showComingSoon.set(false);
  }

  private errorTextFor(field: LoginField, label: string): string | null {
    const control = this.form.controls[field];
    const serverError = this.fieldErrors()?.[field];

    if (serverError && !this.dismissedFieldErrors().has(field)) {
      return serverError;
    }

    return control.touched ? getValidationErrorMessage(control, label) : null;
  }

  private dismissFieldError(field: LoginField): void {
    if (this.dismissedFieldErrors().has(field)) {
      return;
    }

    this.dismissedFieldErrors.update((dismissed) => new Set(dismissed).add(field));
  }
}
