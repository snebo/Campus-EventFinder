import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Eye, EyeOff, LoaderCircle, LucideAngularModule, X } from 'lucide-angular';

import { SignupFormValue } from '../../data-access/auth.models';
import { SignupFormComponent } from './signup-form.component';

@Component({
  selector: 'app-signup-form-host',
  imports: [SignupFormComponent],
  template: `
    <app-signup-form
      [isSubmitting]="isSubmitting()"
      [serverError]="serverError()"
      [fieldErrors]="fieldErrors()"
      (submitForm)="submitted = $event"
      (navigateToSignIn)="navigateCount = navigateCount + 1"
    />
  `,
})
class SignupFormHostComponent {
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);
  fieldErrors = signal<Record<string, string> | null>(null);
  submitted: SignupFormValue | null = null;
  navigateCount = 0;
}

describe('SignupFormComponent', () => {
  let fixture: ComponentFixture<SignupFormHostComponent>;
  let host: SignupFormHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupFormHostComponent, LucideAngularModule.pick({ Eye, EyeOff, LoaderCircle, X })],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupFormHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fullNameInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input#signup-full-name')).nativeElement as HTMLInputElement;
  }

  function emailInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input#signup-email')).nativeElement as HTMLInputElement;
  }

  function passwordInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input#signup-password')).nativeElement as HTMLInputElement;
  }

  function submitButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;
  }

  function setValue(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function blur(input: HTMLInputElement): void {
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  function messageFor(inputId: string): HTMLElement | null {
    const formFields = fixture.debugElement.queryAll(By.css('app-form-field'));
    const field = formFields.find((f) => f.query(By.css(`#${inputId}`)) !== null);
    const message = field?.query(By.css('[data-testid="form-field-message"]'));
    return message ? (message.nativeElement as HTMLElement) : null;
  }

  function fillValidForm(): void {
    setValue(fullNameInput(), 'Ada Eze');
    setValue(emailInput(), 'ada.eze@unilag.edu.ng');
    setValue(passwordInput(), 'Password123');
  }

  function tooltipBody() {
    return fixture.debugElement.query(By.css('[data-testid="tooltip-body"]'));
  }

  // AC1
  describe('submit button disabled state', () => {
    it('is disabled when the form is empty', () => {
      expect(submitButton().disabled).toBe(true);
    });

    it('stays disabled while email is invalid or password is too short', () => {
      setValue(fullNameInput(), 'Ada Eze');
      expect(submitButton().disabled).toBe(true);

      setValue(emailInput(), 'not-an-email');
      expect(submitButton().disabled).toBe(true);

      setValue(emailInput(), 'ada.eze@unilag.edu.ng');
      setValue(passwordInput(), 'short');
      expect(submitButton().disabled).toBe(true);
    });

    it('is enabled once fullName is non-empty, email is valid, and password has >= 8 characters', () => {
      fillValidForm();
      expect(submitButton().disabled).toBe(false);
    });
  });

  // AC2
  describe('submission', () => {
    it('emits submitForm with the form values when submitted while valid', () => {
      fillValidForm();

      submitButton().click();

      expect(host.submitted).toEqual<SignupFormValue>({
        fullName: 'Ada Eze',
        email: 'ada.eze@unilag.edu.ng',
        password: 'Password123',
      });
    });

    it('emits nothing when the form is submitted while invalid', () => {
      const formEl = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
      formEl.dispatchEvent(new Event('submit', { cancelable: true }));
      fixture.detectChanges();

      expect(host.submitted).toBeNull();
    });
  });

  // AC3
  describe('password helper text', () => {
    it('shows "Minimum 8 characters" with the default variant while under 8 characters', () => {
      setValue(passwordInput(), 'short');

      const message = messageFor('signup-password')!;
      expect(message.textContent?.trim()).toBe('Minimum 8 characters');
      expect(message.classList.contains('text-text-secondary')).toBe(true);
    });

    it('shows "Looks good" with the success variant once 8+ characters are entered', () => {
      setValue(passwordInput(), 'Password123');

      const message = messageFor('signup-password')!;
      expect(message.textContent?.trim()).toBe('Looks good');
      expect(message.classList.contains('text-text-success')).toBe(true);
    });
  });

  // AC4
  describe('server error tooltip', () => {
    it('becomes visible with the error variant when serverError is set, and hides when dismissed', () => {
      expect(tooltipBody()).toBeNull();

      host.serverError.set("We couldn't create your account. Please try again.");
      fixture.detectChanges();

      const tooltip = tooltipBody();
      expect(tooltip).toBeTruthy();
      expect(tooltip.nativeElement.textContent.trim()).toBe("We couldn't create your account. Please try again.");
      expect(tooltip.nativeElement.classList.contains('bg-tooltip-error-bg')).toBe(true);

      const dismissButton = fixture.debugElement.query(By.css('button[aria-label="Dismiss"]'));
      dismissButton.nativeElement.click();
      fixture.detectChanges();

      expect(tooltipBody()).toBeNull();
    });

    it('hides when serverError becomes null', () => {
      host.serverError.set('Email already in use');
      fixture.detectChanges();
      expect(tooltipBody()).toBeTruthy();

      host.serverError.set(null);
      fixture.detectChanges();

      expect(tooltipBody()).toBeNull();
    });

    it('shows again for a new serverError after a previous one was dismissed', () => {
      host.serverError.set('First error');
      fixture.detectChanges();

      fixture.debugElement.query(By.css('button[aria-label="Dismiss"]')).nativeElement.click();
      fixture.detectChanges();
      expect(tooltipBody()).toBeNull();

      host.serverError.set('Second error');
      fixture.detectChanges();

      const tooltip = tooltipBody();
      expect(tooltip).toBeTruthy();
      expect(tooltip.nativeElement.textContent.trim()).toBe('Second error');
    });
  });

  // AC5
  describe('email field error precedence', () => {
    it('shows client-side validation errorText once the email field is touched', () => {
      setValue(emailInput(), 'not-an-email');
      blur(emailInput());

      const message = messageFor('signup-email')!;
      expect(message.textContent?.trim()).toBe('Enter a valid email address');
      expect(message.classList.contains('text-text-error')).toBe(true);
    });

    it('overrides the client-side message with fieldErrors.email, and reverts once the user edits the email again', () => {
      setValue(emailInput(), 'not-an-email');
      blur(emailInput());
      expect(messageFor('signup-email')!.textContent?.trim()).toBe('Enter a valid email address');

      host.fieldErrors.set({ email: 'Email already in use' });
      fixture.detectChanges();

      expect(messageFor('signup-email')!.textContent?.trim()).toBe('Email already in use');

      setValue(emailInput(), 'ada.eze@unilag.edu.ng');

      expect(messageFor('signup-email')).toBeNull();
    });

    it('shows a fresh fieldErrors.email again if it is set again after being dismissed by an edit', () => {
      host.fieldErrors.set({ email: 'Email already in use' });
      fixture.detectChanges();

      setValue(emailInput(), 'ada.eze@unilag.edu.ng');
      expect(messageFor('signup-email')).toBeNull();

      host.fieldErrors.set({ email: 'Email already in use' });
      fixture.detectChanges();

      expect(messageFor('signup-email')!.textContent?.trim()).toBe('Email already in use');
    });
  });

  // AC6
  describe('footer navigation', () => {
    it('renders "Already have an account? Sign In" and emits navigateToSignIn when Sign In is clicked', () => {
      const footer = fixture.debugElement.query(By.css('app-auth-footer-link')).nativeElement as HTMLElement;
      expect(footer.textContent?.trim().replace(/\s+/g, ' ')).toBe('Already have an account? Sign In');

      fixture.debugElement.query(By.css('[data-testid="auth-footer-link-action"]')).nativeElement.click();

      expect(host.navigateCount).toBe(1);
    });
  });

  // AC7
  describe('isSubmitting', () => {
    it('sets the submit button to loading (spinner + disabled) when isSubmitting=true', () => {
      fillValidForm();
      expect(submitButton().disabled).toBe(false);

      host.isSubmitting.set(true);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('[data-testid="button-spinner"]'))).toBeTruthy();
      expect(submitButton().disabled).toBe(true);
    });
  });
});
