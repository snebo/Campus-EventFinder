import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChevronDown, LucideAngularModule, X } from 'lucide-angular';

import { ChipComponent, ChipVariant } from './chip.component';

describe('ChipComponent', () => {
  let fixture: ComponentFixture<ChipComponent>;
  let component: ChipComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipComponent, LucideAngularModule.pick({ ChevronDown, X })],
    }).compileComponents();

    fixture = TestBed.createComponent(ChipComponent);
    component = fixture.componentInstance;
  });

  function render(variant: ChipVariant, label = 'ALL', selected = false): void {
    fixture.componentRef.setInput('label', label);
    fixture.componentRef.setInput('variant', variant);
    fixture.componentRef.setInput('selected', selected);
    fixture.detectChanges();
  }

  function root(): HTMLElement {
    return (fixture.debugElement.query(By.css('button, span')).nativeElement as HTMLElement);
  }

  it('always uses the fully-rounded chip radius', () => {
    render('select');
    expect(root().classList.contains('rounded-chip')).toBe(true);
  });

  describe('variant="select"', () => {
    it('renders the label outlined with dark text when unselected, and emits clicked', () => {
      render('select', 'SPORTS', false);
      const btn = root();
      expect(btn.textContent?.trim()).toBe('SPORTS');
      expect(btn.classList.contains('bg-chip-bg')).toBe(true);
      expect(btn.classList.contains('text-text-primary')).toBe(true);

      let count = 0;
      component.clicked.subscribe(() => (count += 1));
      btn.click();
      expect(count).toBe(1);
    });

    it('renders selected style (dark bg, white text) when selected=true', () => {
      render('select', 'SPORTS', true);
      const btn = root();
      expect(btn.classList.contains('bg-chip-bg-selected')).toBe(true);
      expect(btn.classList.contains('text-white')).toBe(true);
    });
  });

  describe('variant="dismissible"', () => {
    it('renders dark style with a trailing X; X emits dismiss and label emits clicked', () => {
      render('dismissible', 'TODAY');
      expect(root().classList.contains('bg-chip-bg-selected')).toBe(true);
      expect(fixture.debugElement.query(By.css('lucide-icon[name="X"]'))).toBeTruthy();

      let dismissed = 0;
      let clicked = 0;
      component.dismiss.subscribe(() => (dismissed += 1));
      component.clicked.subscribe(() => (clicked += 1));

      (fixture.debugElement.query(By.css('button[aria-label="Dismiss"]')).nativeElement as HTMLElement).click();
      expect(dismissed).toBe(1);
      expect(clicked).toBe(0);
    });
  });

  describe('variant="dropdown"', () => {
    it('renders outlined with a trailing ChevronDown and emits clicked on click', () => {
      render('dropdown', 'CATEGORY');
      const btn = root();
      expect(btn.classList.contains('bg-chip-bg')).toBe(true);
      expect(fixture.debugElement.query(By.css('lucide-icon[name="ChevronDown"]'))).toBeTruthy();

      let count = 0;
      component.clicked.subscribe(() => (count += 1));
      btn.click();
      expect(count).toBe(1);
    });
  });
});
