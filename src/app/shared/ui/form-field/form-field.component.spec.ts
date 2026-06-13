import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FormFieldComponent, FormFieldHelperVariant } from './form-field.component';

@Component({
  selector: 'app-form-field-host',
  imports: [FormFieldComponent],
  template: `
    <app-form-field
      [label]="label()"
      [for]="for()"
      [helperText]="helperText()"
      [helperTextVariant]="helperTextVariant()"
      [errorText]="errorText()"
    >
      <input [id]="for()" type="text" />
    </app-form-field>
  `,
})
class FormFieldHostComponent {
  label = signal('Email');
  for = signal('email-input');
  helperText = signal<string | undefined>(undefined);
  helperTextVariant = signal<FormFieldHelperVariant>('default');
  errorText = signal<string | null>(null);
}

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<FormFieldHostComponent>;
  let host: FormFieldHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function labelEl(): HTMLLabelElement {
    return fixture.debugElement.query(By.css('label')).nativeElement as HTMLLabelElement;
  }

  function messageEl() {
    return fixture.debugElement.query(By.css('[data-testid="form-field-message"]'));
  }

  it('renders the label text and associates it with the given "for" id', () => {
    expect(labelEl().textContent?.trim()).toBe('Email');
    expect(labelEl().getAttribute('for')).toBe('email-input');
  });

  it('renders the projected content', () => {
    const inputEl = fixture.debugElement.query(By.css('input'));

    expect(inputEl).toBeTruthy();
    expect(inputEl.nativeElement.id).toBe('email-input');
  });

  it('renders no helper/error row when neither helperText nor errorText is provided', () => {
    expect(messageEl()).toBeNull();
  });

  it('renders helperText with the default variant color when no errorText is provided', () => {
    host.helperText.set('We will never share your email');
    fixture.detectChanges();

    const message = messageEl();
    expect(message.nativeElement.textContent.trim()).toBe('We will never share your email');
    expect(message.nativeElement.classList.contains('text-text-secondary')).toBe(true);
  });

  it('renders helperText with the success variant color', () => {
    host.helperText.set('Looks good');
    host.helperTextVariant.set('success');
    fixture.detectChanges();

    expect(messageEl().nativeElement.classList.contains('text-text-success')).toBe(true);
  });

  it('renders helperText with the error variant color', () => {
    host.helperText.set('Check this field');
    host.helperTextVariant.set('error');
    fixture.detectChanges();

    expect(messageEl().nativeElement.classList.contains('text-text-error')).toBe(true);
  });

  it('renders errorText in the error color and suppresses helperText when both are provided', () => {
    host.helperText.set('We will never share your email');
    host.errorText.set('Email is required');
    fixture.detectChanges();

    const message = messageEl();
    expect(message.nativeElement.textContent.trim()).toBe('Email is required');
    expect(message.nativeElement.classList.contains('text-text-error')).toBe(true);
  });

  it('falls back to helperText when errorText is null', () => {
    host.helperText.set('We will never share your email');
    host.errorText.set(null);
    fixture.detectChanges();

    expect(messageEl().nativeElement.textContent.trim()).toBe('We will never share your email');
  });

  it('falls back to helperText when errorText is an empty string', () => {
    host.helperText.set('We will never share your email');
    host.errorText.set('');
    fixture.detectChanges();

    expect(messageEl().nativeElement.textContent.trim()).toBe('We will never share your email');
  });
});
