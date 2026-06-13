import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Eye, EyeOff, LucideAngularComponent, LucideAngularModule } from 'lucide-angular';

import { PasswordInputComponent } from './password-input.component';

@Component({
  selector: 'app-password-input-host',
  imports: [PasswordInputComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <app-password-input
        formControlName="password"
        [placeholder]="placeholder()"
        [id]="id()"
        [invalid]="invalid()"
        [autocomplete]="autocomplete()"
      />
    </form>
  `,
})
class PasswordInputHostComponent {
  form = new FormGroup({ password: new FormControl('') });
  placeholder = signal('Password');
  id = signal('password-input');
  invalid = signal(false);
  autocomplete = signal<string | undefined>(undefined);
}

describe('PasswordInputComponent', () => {
  let fixture: ComponentFixture<PasswordInputHostComponent>;
  let host: PasswordInputHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInputHostComponent, LucideAngularModule.pick({ Eye, EyeOff })],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function inputEl(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
  }

  function toggleButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
  }

  function iconName(): string | undefined {
    return fixture.debugElement.query(By.directive(LucideAngularComponent)).componentInstance.name as
      | string
      | undefined;
  }

  it('renders an input with the given placeholder and id, defaulting to type="password"', () => {
    expect(inputEl().placeholder).toBe('Password');
    expect(inputEl().id).toBe('password-input');
    expect(inputEl().type).toBe('password');
  });

  it('updates the FormControl value when the user types', () => {
    inputEl().value = 'secret123';
    inputEl().dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.form.controls.password.value).toBe('secret123');
  });

  it('reflects programmatic FormControl value changes in the input', () => {
    host.form.controls.password.setValue('preset-secret');
    fixture.detectChanges();

    expect(inputEl().value).toBe('preset-secret');
  });

  it('renders the Eye icon when masked', () => {
    expect(iconName()).toBe('Eye');
  });

  it('switches to type="text" and the EyeOff icon when the toggle is clicked', () => {
    toggleButton().click();
    fixture.detectChanges();

    expect(inputEl().type).toBe('text');
    expect(iconName()).toBe('EyeOff');
  });

  it('toggles back to type="password" and the Eye icon on a second click', () => {
    toggleButton().click();
    fixture.detectChanges();

    toggleButton().click();
    fixture.detectChanges();

    expect(inputEl().type).toBe('password');
    expect(iconName()).toBe('Eye');
  });

  it('does not alter the input value when toggling visibility', () => {
    inputEl().value = 'keep-me';
    inputEl().dispatchEvent(new Event('input'));
    fixture.detectChanges();

    toggleButton().click();
    fixture.detectChanges();

    expect(inputEl().value).toBe('keep-me');
    expect(host.form.controls.password.value).toBe('keep-me');
  });

  it('applies the default border when invalid is false', () => {
    expect(inputEl().classList.contains('border-border-default')).toBe(true);
    expect(inputEl().classList.contains('border-border-error')).toBe(false);
  });

  it('applies the error border when invalid is true', () => {
    host.invalid.set(true);
    fixture.detectChanges();

    expect(inputEl().classList.contains('border-border-error')).toBe(true);
  });

  it('applies focus-ring and primary border on focus', () => {
    inputEl().dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(inputEl().classList.contains('border-primary')).toBe(true);
    expect(inputEl().classList.contains('shadow-focus-ring')).toBe(true);
  });

  it('sets the native disabled attribute and disabled styling when the FormControl is disabled', () => {
    host.form.controls.password.disable();
    fixture.detectChanges();

    expect(inputEl().disabled).toBe(true);
    expect(inputEl().classList.contains('opacity-50')).toBe(true);
  });
});
