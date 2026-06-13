import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LucideAngularComponent, LucideAngularModule, Menu, User } from 'lucide-angular';

import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  let fixture: ComponentFixture<IconButtonComponent>;
  let component: IconButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButtonComponent, LucideAngularModule.pick({ Menu, User })],
    }).compileComponents();

    fixture = TestBed.createComponent(IconButtonComponent);
    component = fixture.componentInstance;
  });

  function setInputs(icon: string, ariaLabel: string): void {
    fixture.componentRef.setInput('icon', icon);
    fixture.componentRef.setInput('ariaLabel', ariaLabel);
    fixture.detectChanges();
  }

  it('renders a button containing the given icon with the given aria-label', () => {
    setInputs('Menu', 'Open menu');

    const button = fixture.debugElement.query(By.css('button'));
    const icon = fixture.debugElement.query(By.directive(LucideAngularComponent));

    expect(button).toBeTruthy();
    expect(button.nativeElement.getAttribute('aria-label')).toBe('Open menu');
    expect(icon.componentInstance.name).toBe('Menu');
  });

  it('does not throw when clicked without a listener attached', () => {
    setInputs('Menu', 'Open menu');

    expect(() => fixture.debugElement.query(By.css('button')).nativeElement.click()).not.toThrow();
  });

  it('emits clicked exactly once per click', () => {
    setInputs('Menu', 'Open menu');

    let emitCount = 0;
    component.clicked.subscribe(() => emitCount++);

    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(emitCount).toBe(1);
  });

  it('renders with a transparent background for variant="ghost" (default)', () => {
    setInputs('Menu', 'Open menu');

    expect(component.variant()).toBe('ghost');

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.classList.contains('bg-transparent')).toBe(true);
  });

  it('renders with a filled circular background for variant="default"', () => {
    setInputs('Menu', 'Open menu');
    fixture.componentRef.setInput('variant', 'default');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.classList.contains('rounded-full')).toBe(true);
    expect(button.nativeElement.classList.contains('bg-transparent')).toBe(false);
  });

  it('renders correctly for different icon values without console errors', () => {
    expect(() => setInputs('Menu', 'Open menu')).not.toThrow();
    expect(() => setInputs('User', 'Profile')).not.toThrow();
  });
});
