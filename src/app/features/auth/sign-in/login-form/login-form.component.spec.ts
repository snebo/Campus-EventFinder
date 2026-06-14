import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Eye, EyeOff, LoaderCircle, LucideAngularModule, X } from 'lucide-angular';

import { LoginFormValue } from '../../data-access/auth.models';
import { LoginFormComponent } from './login-form.component';

@Component({
  selector: 'app-login-form-host',
  imports: [LoginFormComponent],
  template: `
    <app-login-form
      [isSubmitting]="isSubmitting()"
      [serverError]="serverError()"
      [fieldErrors]="fieldErrors()"
      (submitForm)="submitted = $event"
      (navigateToSignUp)="navigateCount = navigateCount + 1"
    />
  `,
})
class LoginFormHostComponent {
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
  fieldErrors = signal<Record<string, string> | null>(null);
  submitted: LoginFormValue | null = null;
  navigateCount = 0;
}

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormHostComponent>;
  let host: LoginFormHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormHostComponent, LucideAngularModule.pick({ Eye, EyeOff, LoaderCircle, X })],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function emailInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input#login-email')).nativeElement as HTMLInputElement;
  }

  function passwordInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input#login-password')).nativeElement as HTMLInputElement;
  }

  function submitButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;
  }

  function setValue(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function fillValidForm(): void {
    setValue(emailInput(), 'ada.eze@unilag.edu.ng');
    setValue(passwordInput(), 'Password123');
  }

  function tooltipBody() {
    return fixture.debugElement.query(By.css('[data-testid="tooltip-body"]'));
  }

  // AC1
  describe('submit button disabled state', () => {
    it('is disabled when empty and while email is invalid or password is empty', () => {
      expect(submitButton().disabled).toBe(true);

      setValue(emailInput(), 'not-an-email');
      setValue(passwordInput(), 'secret');
      expect(submitButton().disabled).toBe(true);

      setValue(emailInput(), 'ada.eze@unilag.edu.ng');
      setValue(passwordInput(), '');
      expect(submitButton().disabled).toBe(true);
    });

    it('is enabled once email is valid and password is non-empty', () => {
      fillValidForm();
      expect(submitButton().disabled).toBe(false);
    });
  });

  // AC2
  describe('submission', () => {
    it('emits submitForm with { email, password } when submitted while valid', () => {
      fillValidForm();
      submitButton().click();

      expect(host.submitted).toEqual<LoginFormValue>({
        email: 'ada.eze@unilag.edu.ng',
        password: 'Password123',
      });
    });

    it('emits nothing when submitted while invalid', () => {
      const formEl = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
      formEl.dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();

      expect(host.submitted).toBeNull();
    });
  });

  // AC3
  describe('server error tooltip', () => {
    it('shows the error-variant tooltip when serverError is set and hides when dismissed', () => {
      expect(tooltipBody()).toBeNull();

      host.serverError.set('Invalid email or password. Please try again.');
      fixture.detectChanges();

      const tooltip = tooltipBody();
      expect(tooltip).toBeTruthy();
      expect(tooltip.nativeElement.textContent.trim()).toBe('Invalid email or password. Please try again.');
      expect(tooltip.nativeElement.classList.contains('bg-tooltip-error-bg')).toBe(true);

      fixture.debugElement.query(By.css('button[aria-label="Dismiss"]')).nativeElement.click();
      fixture.detectChanges();
      expect(tooltipBody()).toBeNull();
    });
  });

  // AC4
  describe('forgot password', () => {
    it('renders a coming-soon TextLink with no routerLink and shows a tooltip without navigating on click', () => {
      const link = fixture.debugElement.query(By.css('app-text-link a'));
      expect(link.attributes['href']).toBeUndefined();
      expect((link.nativeElement as HTMLElement).textContent?.trim()).toBe('Forgot Password?');

      link.nativeElement.click();
      fixture.detectChanges();

      const tooltip = fixture.debugElement.query(By.css('app-text-link [data-testid="tooltip-body"]'));
      expect(tooltip.nativeElement.textContent.trim()).toBe('Coming soon');
    });
  });

  // AC5
  describe('footer navigation', () => {
    it('renders "Don\'t have an account? Sign Up" and emits navigateToSignUp on action click', () => {
      const footer = fixture.debugElement.query(By.css('app-auth-footer-link')).nativeElement as HTMLElement;
      expect(footer.textContent?.trim().replace(/\s+/g, ' ')).toBe("Don't have an account? Sign Up");

      fixture.debugElement.query(By.css('[data-testid="auth-footer-link-action"]')).nativeElement.click();
      expect(host.navigateCount).toBe(1);
    });
  });

  // AC6
  describe('isSubmitting', () => {
    it('sets the submit button to loading when isSubmitting=true', () => {
      fillValidForm();
      expect(submitButton().disabled).toBe(false);

      host.isSubmitting.set(true);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('[data-testid="button-spinner"]'))).toBeTruthy();
      expect(submitButton().disabled).toBe(true);
    });
  });
});
