import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoaderCircle, LucideAngularComponent, LucideAngularModule } from 'lucide-angular';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, LucideAngularModule.pick({ LoaderCircle })],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Sign Up');
  });

  function buttonEl(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
  }

  it('renders a button with the given label and default type="button"', () => {
    fixture.detectChanges();

    expect(buttonEl().textContent?.trim()).toBe('Sign Up');
    expect(buttonEl().type).toBe('button');
  });

  it('renders type="submit" when type is set', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    expect(buttonEl().type).toBe('submit');
  });

  it('renders the label using the button font token', () => {
    fixture.detectChanges();

    expect(buttonEl().classList.contains('text-button')).toBe(true);
  });

  it('applies brand-dark/primary background and white text for variant="primary" (default)', () => {
    fixture.detectChanges();

    expect(component.variant()).toBe('primary');
    expect(buttonEl().classList.contains('bg-brand-dark')).toBe(true);
    expect(buttonEl().classList.contains('text-white')).toBe(true);
  });

  it('applies a transparent background with border-default border and text-primary text for variant="outline"', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    expect(buttonEl().classList.contains('bg-transparent')).toBe(true);
    expect(buttonEl().classList.contains('border-border-default')).toBe(true);
    expect(buttonEl().classList.contains('text-text-primary')).toBe(true);
  });

  it('applies a visually distinct fill for variant="secondary"', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();

    expect(buttonEl().classList.contains('bg-surface')).toBe(true);
    expect(buttonEl().classList.contains('bg-brand-dark')).toBe(false);
    expect(buttonEl().classList.contains('bg-transparent')).toBe(false);
  });

  it('applies w-full when fullWidth=true (default)', () => {
    fixture.detectChanges();

    expect(buttonEl().classList.contains('w-full')).toBe(true);
  });

  it('does not apply w-full when fullWidth=false', () => {
    fixture.componentRef.setInput('fullWidth', false);
    fixture.detectChanges();

    expect(buttonEl().classList.contains('w-full')).toBe(false);
  });

  it('renders a spinning LoaderCircle icon and disables the button when loading=true, regardless of disabled', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('[data-testid="button-spinner"]'));
    const icon = fixture.debugElement.query(By.directive(LucideAngularComponent));

    expect(spinner).toBeTruthy();
    expect(spinner.nativeElement.classList.contains('animate-spin')).toBe(true);
    expect(icon.componentInstance.name).toBe('LoaderCircle');
    expect(buttonEl().disabled).toBe(true);
  });

  it('disables the button and applies reduced-opacity styling when disabled=true and loading=false', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(buttonEl().disabled).toBe(true);
    expect(buttonEl().classList.contains('opacity-50')).toBe(true);
    expect(buttonEl().classList.contains('cursor-not-allowed')).toBe(true);
  });

  it('emits clicked exactly once when clicked while enabled', () => {
    fixture.detectChanges();

    let emitCount = 0;
    component.clicked.subscribe(() => emitCount++);

    buttonEl().click();

    expect(emitCount).toBe(1);
  });

  it('emits nothing when clicked while disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let emitCount = 0;
    component.clicked.subscribe(() => emitCount++);

    component.onClick();

    expect(emitCount).toBe(0);
  });

  it('emits nothing when clicked while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    let emitCount = 0;
    component.clicked.subscribe(() => emitCount++);

    component.onClick();

    expect(emitCount).toBe(0);
  });
});
