import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SegmentedTab, SegmentedTabsComponent } from './segmented-tabs.component';

const TABS: SegmentedTab[] = [
  { label: "RSVP'D", value: 'rsvpd' },
  { label: 'SAVED', value: 'saved' },
];

describe('SegmentedTabsComponent', () => {
  let fixture: ComponentFixture<SegmentedTabsComponent>;
  let component: SegmentedTabsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentedTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentedTabsComponent);
    component = fixture.componentInstance;
  });

  function render(activeValue: string): void {
    fixture.componentRef.setInput('tabs', TABS);
    fixture.componentRef.setInput('activeValue', activeValue);
    fixture.detectChanges();
  }

  function tabs() {
    return fixture.debugElement.queryAll(By.css('button[role="tab"]'));
  }

  it('renders one segment per tab with its label', () => {
    render('rsvpd');
    expect(tabs().map((t) => (t.nativeElement as HTMLElement).textContent?.trim())).toEqual(["RSVP'D", 'SAVED']);
  });

  it('applies the active style only to the segment matching activeValue', () => {
    render('saved');
    const [rsvpd, saved] = tabs().map((t) => t.nativeElement as HTMLElement);

    expect(saved.classList.contains('bg-chip-bg-selected')).toBe(true);
    expect(saved.classList.contains('text-white')).toBe(true);
    expect(rsvpd.classList.contains('text-text-secondary')).toBe(true);
    expect(rsvpd.classList.contains('bg-chip-bg-selected')).toBe(false);
  });

  it('emits tabChange with the value when an inactive segment is clicked', () => {
    render('rsvpd');
    let emitted: string | null = null;
    component.tabChange.subscribe((v) => (emitted = v));

    (tabs()[1].nativeElement as HTMLElement).click();
    expect(emitted).toBe('saved');
  });

  it('does not emit and does not change its own rendering when the active segment is clicked', () => {
    render('rsvpd');
    let count = 0;
    component.tabChange.subscribe(() => (count += 1));

    (tabs()[0].nativeElement as HTMLElement).click();
    fixture.detectChanges();

    expect(count).toBe(0);
    // Still controlled by activeValue input — rsvpd remains active.
    expect((tabs()[0].nativeElement as HTMLElement).classList.contains('bg-chip-bg-selected')).toBe(true);
  });
});
