import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { AuthError, SignupFormValue } from '../data-access/auth.models';
import { AuthService } from '../data-access/auth.service';
import { AuthHeaderComponent } from '../shared/auth-header/auth-header.component';
import { SignupFormComponent } from './signup-form/signup-form.component';

const SIGNUP_SUBTITLE = 'Join the EventFinder community at University of Lagos.';

const GENERIC_SIGNUP_ERROR: AuthError = {
  message: "We couldn't create your account. Please try again.",
};

function isAuthError(value: unknown): value is AuthError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { message?: unknown }).message === 'string'
  );
}

@Component({
  selector: 'app-signup-page',
  imports: [AuthHeaderComponent, PageHeaderComponent, SignupFormComponent],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly subtitle = SIGNUP_SUBTITLE;

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<AuthError | null>(null);

  protected readonly serverError = computed<string | null>(
    () => this.submitError()?.message ?? null,
  );

  protected readonly fieldErrors = computed<Record<string, string> | null>(() => {
    const errors = this.submitError()?.fieldErrors;
    if (!errors) {
      return null;
    }

    const result: Record<string, string> = {};
    for (const [field, message] of Object.entries(errors)) {
      if (message != null) {
        result[field] = message;
      }
    }
    return result;
  });

  async onSubmit(value: SignupFormValue): Promise<void> {
    this.isSubmitting.set(true);
    this.submitError.set(null);

    try {
      await this.authService.signup(value);
      await this.router.navigate(['/home']);
    } catch (err) {
      this.submitError.set(isAuthError(err) ? err : GENERIC_SIGNUP_ERROR);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onNavigateToSignIn(): void {
    void this.router.navigate(['/login']);
  }
}
