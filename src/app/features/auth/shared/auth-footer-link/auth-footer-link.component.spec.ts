import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AuthFooterLinkComponent } from './auth-footer-link.component';

@Component({
  selector: 'app-auth-footer-link-host',
  imports: [AuthFooterLinkComponent],
  template: `
    <app-auth-footer-link
      [promptText]="promptText()"
      [actionText]="actionText()"
      (actionClick)="clickCount = clickCount + 1"
    />
  `,
})
class AuthFooterLinkHostComponent {
  promptText = signal('Already have an account?');
  actionText = signal('Sign In');
  clickCount = 0;
}

describe('AuthFooterLinkComponent', () => {
  let fixture: ComponentFixture<AuthFooterLinkHostComponent>;
  let host: AuthFooterLinkHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFooterLinkHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthFooterLinkHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function rootEl(): HTMLElement {
    return fixture.debugElement.query(By.css('app-auth-footer-link')).nativeElement as HTMLElement;
  }

  function actionEl(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('[data-testid="auth-footer-link-action"]'))
      .nativeElement as HTMLButtonElement;
  }

  it('renders promptText as plain secondary text immediately followed by actionText as a bold underlined inline action', () => {
    expect(rootEl().textContent?.trim().replace(/\s+/g, ' ')).toBe('Already have an account? Sign In');

    const action = actionEl();
    expect(action.textContent?.trim()).toBe('Sign In');
    expect(action.classList.contains('font-bold')).toBe(true);
    expect(action.classList.contains('underline')).toBe(true);
    expect(action.type).toBe('button');
  });

  it('emits actionClick exactly once when actionText is clicked', () => {
    actionEl().click();

    expect(host.clickCount).toBe(1);
  });

  it('emits nothing when clicking elsewhere in the component', () => {
    rootEl().click();

    expect(host.clickCount).toBe(0);
  });

  it('renders correctly for the "Don\'t have an account? / Sign Up" pair', () => {
    host.promptText.set("Don't have an account?");
    host.actionText.set('Sign Up');
    fixture.detectChanges();

    expect(rootEl().textContent?.trim().replace(/\s+/g, ' ')).toBe("Don't have an account? Sign Up");
    expect(actionEl().textContent?.trim()).toBe('Sign Up');
  });
});
