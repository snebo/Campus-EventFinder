import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { Eye, EyeOff, GraduationCap, LoaderCircle, LucideAngularModule, X } from 'lucide-angular';

import { AuthError, AuthSession, LoginFormValue } from '../data-access/auth.models';
import { AuthService } from '../data-access/auth.service';
import { LoginPageComponent } from './login-page.component';

const SESSION: AuthSession = {
  user: { id: 'user-1', fullName: 'Ada Eze', email: 'ada.eze@unilag.edu.ng' },
  token: 'mock-token-user-1',
};

const INVALID_CREDENTIALS_ERROR: AuthError = {
  message: 'Invalid email or password. Please try again.',
};

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: Router;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    authService = { login: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, LucideAngularModule.pick({ Eye, EyeOff, GraduationCap, LoaderCircle, X })],
      providers: [provideRouter([]), { provide: AuthService, useValue: authService }],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(LoginPageComponent);
    fixture.detectChanges();
  });

  function setValue(selector: string, value: string): void {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function fillValidForm(): LoginFormValue {
    setValue('input#login-email', 'ada.eze@unilag.edu.ng');
    setValue('input#login-password', 'Password123');
    return { email: 'ada.eze@unilag.edu.ng', password: 'Password123' };
  }

  function submitButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;
  }

  // AC1
  it('renders the auth header (no info), "Welcome back" header, and the login form, with no app shell chrome', () => {
    expect(fixture.debugElement.query(By.css('app-auth-header'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-login-form'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-auth-header app-icon-button'))).toBeNull();

    const heading = fixture.debugElement.query(By.css('app-page-header h1')).nativeElement as HTMLElement;
    expect(heading.textContent?.trim()).toBe('Welcome back');

    expect(fixture.debugElement.query(By.css('app-top-bar'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-nav-drawer'))).toBeNull();
  });

  // AC2
  it('logs in and navigates to /home on success', async () => {
    authService.login.mockResolvedValue(SESSION);
    const expected = fillValidForm();

    submitButton().click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(authService.login).toHaveBeenCalledWith(expected);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  // AC3
  it('stays on /login and shows the serverError tooltip on invalid credentials', async () => {
    authService.login.mockRejectedValue(INVALID_CREDENTIALS_ERROR);
    fillValidForm();

    submitButton().click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
    const tooltip = fixture.debugElement.query(By.css('[data-testid="tooltip-body"]'));
    expect(tooltip.nativeElement.textContent.trim()).toBe('Invalid email or password. Please try again.');
  });

  // AC4
  it('navigates to /sign-up when the Sign Up footer link is clicked', () => {
    fixture.debugElement.query(By.css('[data-testid="auth-footer-link-action"]')).nativeElement.click();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-up']);
  });
});
