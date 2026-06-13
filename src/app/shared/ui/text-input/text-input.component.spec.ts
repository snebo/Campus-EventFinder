import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TextInputComponent, TextInputType } from './text-input.component';

@Component({
  selector: 'app-text-input-host',
  imports: [TextInputComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <app-text-input
        formControlName="email"
        [placeholder]="placeholder()"
        [type]="type()"
        [id]="id()"
        [invalid]="invalid()"
        [autocomplete]="autocomplete()"
        (blurred)="blurCount = blurCount + 1"
      />
    </form>
  `,
})
class TextInputHostComponent {
  form = new FormGroup({ email: new FormControl('') });
  placeholder = signal('Email');
  type = signal<TextInputType>('text');
  id = signal('email-input');
  invalid = signal(false);
  autocomplete = signal<string | undefined>(undefined);
  blurCount = 0;
}

describe('TextInputComponent', () => {
  let fixture: ComponentFixture<TextInputHostComponent>;
  let host: TextInputHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextInputHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function inputEl(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
  }

  it('renders an input with the given placeholder and id', () => {
    expect(inputEl().placeholder).toBe('Email');
    expect(inputEl().id).toBe('email-input');
  });

  it('updates the FormControl value when the user types', () => {
    inputEl().value = 'student@campus.edu';
    inputEl().dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(host.form.controls.email.value).toBe('student@campus.edu');
  });

  it('reflects programmatic FormControl value changes in the input', () => {
    host.form.controls.email.setValue('preset@campus.edu');
    fixture.detectChanges();

    expect(inputEl().value).toBe('preset@campus.edu');
  });

  it('defaults to type="text"', () => {
    expect(inputEl().type).toBe('text');
  });

  it('switches the rendered input type for email and password', () => {
    host.type.set('email');
    fixture.detectChanges();
    expect(inputEl().type).toBe('email');

    host.type.set('password');
    fixture.detectChanges();
    expect(inputEl().type).toBe('password');
  });

  it('applies the default border when invalid is false', () => {
    expect(inputEl().classList.contains('border-border-default')).toBe(true);
    expect(inputEl().classList.contains('border-border-error')).toBe(false);
  });

  it('applies the error border when invalid is true', () => {
    host.invalid.set(true);
    fixture.detectChanges();

    expect(inputEl().classList.contains('border-border-error')).toBe(true);
    expect(inputEl().classList.contains('border-border-default')).toBe(false);
  });

  it('applies focus-ring and primary border on focus, and removes them on blur', () => {
    inputEl().dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(inputEl().classList.contains('border-primary')).toBe(true);
    expect(inputEl().classList.contains('shadow-focus-ring')).toBe(true);

    inputEl().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(inputEl().classList.contains('border-primary')).toBe(false);
    expect(inputEl().classList.contains('shadow-focus-ring')).toBe(false);
    expect(inputEl().classList.contains('border-border-default')).toBe(true);
  });

  it('emits blurred exactly once on blur', () => {
    inputEl().dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    inputEl().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(host.blurCount).toBe(1);
  });

  it('keeps the error border on focus when invalid is true, while still showing the focus ring', () => {
    host.invalid.set(true);
    fixture.detectChanges();

    inputEl().dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(inputEl().classList.contains('border-border-error')).toBe(true);
    expect(inputEl().classList.contains('shadow-focus-ring')).toBe(true);
  });

  it('applies the given autocomplete attribute, and omits it when not provided', () => {
    expect(inputEl().getAttribute('autocomplete')).toBeNull();

    host.autocomplete.set('email');
    fixture.detectChanges();

    expect(inputEl().getAttribute('autocomplete')).toBe('email');
  });

  it('sets the native disabled attribute and disabled styling when the FormControl is disabled', () => {
    host.form.controls.email.disable();
    fixture.detectChanges();

    expect(inputEl().disabled).toBe(true);
    expect(inputEl().classList.contains('opacity-50')).toBe(true);
  });
});
