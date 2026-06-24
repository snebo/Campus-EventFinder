import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PageHeaderComponent } from '../../../shared/ui/page-header/page-header.component';
import { AuthError, LoginFormValue } from '../data-access/auth.models';
import { AuthService } from '../data-access/auth.service';
import { AuthHeaderComponent } from '../shared/auth-header/auth-header.component';
import { LoginFormComponent } from './login-form/login-form.component';

const LOGIN_SUBTITLE = 'Sign in to keep discovering and managing events on Eventfindr.';

const GENERIC_LOGIN_ERROR: AuthError = {
  message: 'Something went wrong. Please try again.',
};

function isAuthError(value: unknown): value is AuthError {
  return typeof value === 'object' && value !== null && typeof (value as { message?: unknown }).message === 'string';
}

@Component({
  selector: 'app-login-page',
  imports: [AuthHeaderComponent, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly subtitle = LOGIN_SUBTITLE;

  protected readonly isSubmitting = signal(false);
  protected readonly submitError = signal<AuthError | null>(null);

  protected readonly serverError = computed<string | null>(() => this.submitError()?.message ?? null);

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

  async onSubmit(value: LoginFormValue): Promise<void> {
    this.isSubmitting.set(true);
    this.submitError.set(null);

    try {
      await this.authService.login(value);
      await this.router.navigate(['/home']);
    } catch (err) {
      this.submitError.set(isAuthError(err) ? err : GENERIC_LOGIN_ERROR);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onNavigateToSignUp(): void {
    void this.router.navigate(['/sign-up']);
  }
}
