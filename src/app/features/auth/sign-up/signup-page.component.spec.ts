import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Eye, EyeOff, GraduationCap, Info, LoaderCircle, LucideAngularModule, X } from 'lucide-angular';

import { AuthError, AuthSession, SignupFormValue } from '../data-access/auth.models';
import { AuthService } from '../data-access/auth.service';
import { SignupPageComponent } from './signup-page.component';

const NEW_SESSION: AuthSession = {
  user: { id: 'user-new', fullName: 'New Student', email: 'new.student@unilag.edu.ng' },
  token: 'mock-token-new',
};

const EMAIL_IN_USE_ERROR: AuthError = {
  message: 'Email already in use',
  fieldErrors: { email: 'Email already in use' },
};

describe('SignupPageComponent', () => {
  let fixture: ComponentFixture<SignupPageComponent>;
  let authService: { signup: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = { signup: vi.fn() };
    router = { navigate: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [
        SignupPageComponent,
        LucideAngularModule.pick({ Eye, EyeOff, GraduationCap, Info, LoaderCircle, X }),
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPageComponent);
    fixture.detectChanges();
  });

  function setValue(selector: string, value: string): void {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function fillValidForm(email = 'new.student@unilag.edu.ng'): SignupFormValue {
    setValue('input#signup-full-name', 'New Student');
    setValue('input#signup-email', email);
    setValue('input#signup-password', 'Password123');
    return { fullName: 'New Student', email, password: 'Password123' };
  }

  function submitButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;
  }

  function emailMessage(): string | null {
    const fields = fixture.debugElement.queryAll(By.css('app-form-field'));
    const field = fields.find((f) => f.query(By.css('#signup-email')) !== null);
    const msg = field?.query(By.css('[data-testid="form-field-message"]'));
    return msg ? (msg.nativeElement as HTMLElement).textContent?.trim() ?? null : null;
  }

  // AC1
  it('renders the auth header, "Create Account" page header, and the signup form with no app shell chrome', () => {
    expect(fixture.debugElement.query(By.css('app-auth-header'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-signup-form'))).toBeTruthy();

    const heading = fixture.debugElement.query(By.css('app-page-header h1')).nativeElement as HTMLElement;
    expect(heading.textContent?.trim()).toBe('Create Account');

    expect(fixture.debugElement.query(By.css('app-top-bar'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-nav-drawer'))).toBeNull();
  });

  // AC2
  it('signs up with the form value and navigates to /home on success', async () => {
    authService.signup.mockResolvedValue(NEW_SESSION);
    const expected = fillValidForm();

    submitButton().click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(authService.signup).toHaveBeenCalledWith(expected);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('reflects isSubmitting=true on the submit button while the signup call is in flight', async () => {
    let resolve!: (s: AuthSession) => void;
    authService.signup.mockReturnValue(new Promise<AuthSession>((r) => (resolve = r)));
    fillValidForm();

    submitButton().click();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('[data-testid="button-spinner"]'))).toBeTruthy();
    expect(submitButton().disabled).toBe(true);

    resolve(NEW_SESSION);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  // AC3
  it('stays on /sign-up and shows the field-level email error when the email already exists', async () => {
    authService.signup.mockRejectedValue(EMAIL_IN_USE_ERROR);
    fillValidForm('ada.eze@unilag.edu.ng');

    submitButton().click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
    expect(emailMessage()).toBe('Email already in use');
  });

  // AC4
  it('navigates to /login when the Sign In footer link is clicked', () => {
    fixture.debugElement.query(By.css('[data-testid="auth-footer-link-action"]')).nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
