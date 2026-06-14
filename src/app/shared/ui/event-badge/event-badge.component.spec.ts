import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { EventBadgeComponent } from './event-badge.component';

describe('EventBadgeComponent', () => {
  let fixture: ComponentFixture<EventBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventBadgeComponent);
  });

  function badge(): HTMLElement {
    return fixture.debugElement.query(By.css('span')).nativeElement as HTMLElement;
  }

  it('renders neutral (light bg, dark text) by default with the badge radius', () => {
    fixture.componentRef.setInput('label', 'ACADEMIC');
    fixture.detectChanges();

    expect(badge().textContent?.trim()).toBe('ACADEMIC');
    expect(badge().classList.contains('bg-badge-bg-neutral')).toBe(true);
    expect(badge().classList.contains('text-text-primary')).toBe(true);
    expect(badge().classList.contains('rounded-badge')).toBe(true);
  });

  it('renders status variant as the inverse (dark bg, light text)', () => {
    fixture.componentRef.setInput('label', "RSVP'D");
    fixture.componentRef.setInput('variant', 'status');
    fixture.detectChanges();

    expect(badge().classList.contains('bg-chip-bg-selected')).toBe(true);
    expect(badge().classList.contains('text-white')).toBe(true);
  });

  it('keeps a ~12-char label on a single line (no wrap)', () => {
    fixture.componentRef.setInput('label', 'PROFESSIONAL');
    fixture.detectChanges();

    expect(badge().classList.contains('whitespace-nowrap')).toBe(true);
  });
});
