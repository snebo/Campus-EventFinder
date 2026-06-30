import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

import { MockApiService, MockUser } from '../../../core/data-access/mock-api.service';
import { AuthError, AuthSession, LoginFormValue, SignupFormValue } from './auth.models';

const SESSION_STORAGE_KEY = 'eventfindr.session';

const INVALID_CREDENTIALS_ERROR: AuthError = {
  message: 'Invalid email or password. Please try again.',
};

const EMAIL_IN_USE_ERROR: AuthError = {
  message: 'Email already in use',
  fieldErrors: { email: 'Email already in use' },
};

const SIGNUP_FAILED_ERROR: AuthError = {
  message: "We couldn't create your account. Please try again.",
};

const NETWORK_ERROR: AuthError = {
  message: "Can't reach the server. Please check your connection and try again.",
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly mockApi = inject(MockApiService);

  async login(value: LoginFormValue): Promise<AuthSession> {
    const user = await this.fetch(this.mockApi.validateCredentials(value.email, value.password), NETWORK_ERROR);

    if (!user) {
      throw INVALID_CREDENTIALS_ERROR;
    }

    return this.persistSession(user);
  }

  async signup(value: SignupFormValue): Promise<AuthSession> {
    const existing = await this.fetch(this.mockApi.findUserByEmail(value.email), NETWORK_ERROR);

    if (existing) {
      throw EMAIL_IN_USE_ERROR;
    }

    const user = await this.fetch(this.mockApi.createUser(value), SIGNUP_FAILED_ERROR);

    return this.persistSession(user);
  }

  getSession(): AuthSession | null {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  }

  logout(): void {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  private async fetch<T>(source: Observable<T>, onError: AuthError): Promise<T> {
    try {
      return await firstValueFrom(source);
    } catch {
      throw onError;
    }
  }

  private persistSession(user: MockUser): AuthSession {
    const session: AuthSession = {
      user: { id: user.id, fullName: user.fullName, email: user.email, memberType: user.memberType },
      token: user.token,
    };
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  }

   sendPasswordReset (_email: string): void {
    // MVP: no backend — caller shows success UI
   }

}
