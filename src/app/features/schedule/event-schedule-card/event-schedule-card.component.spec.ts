import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Clock, LucideAngularModule, MapPin, X } from 'lucide-angular';

import { EventSummary } from '../../../shared/models/event.model';
import { EventScheduleCardComponent } from './event-schedule-card.component';

const EVENT: EventSummary = {
  id: 'evt-01',
  title: 'Annual Tech Symposium',
  timeLabel: '10:00 AM - 2:00 PM',
  location: 'Hall A',
  rsvpStatus: 'rsvpd',
};

describe('EventScheduleCardComponent', () => {
  let fixture: ComponentFixture<EventScheduleCardComponent>;
  let component: EventScheduleCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventScheduleCardComponent, LucideAngularModule.pick({ Clock, MapPin, X })],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EventScheduleCardComponent);
    component = fixture.componentInstance;
  });

  function render(event: EventSummary): void {
    fixture.componentRef.setInput('event', event);
    fixture.detectChanges();
  }

  function badgeText(): string {
    return (fixture.debugElement.query(By.css('app-event-badge')).nativeElement as HTMLElement).textContent!.trim();
  }

  it('renders title, two meta rows, and a RSVP\'D status badge for rsvpd', () => {
    render(EVENT);
    expect((fixture.debugElement.query(By.css('h3')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      'Annual Tech Symposium',
    );
    const rows = fixture.debugElement.queryAll(By.css('app-event-meta-row'));
    expect(rows[0].query(By.css('lucide-icon')).componentInstance.name).toBe('Clock');
    expect(rows[1].query(By.css('lucide-icon')).componentInstance.name).toBe('MapPin');
    expect(badgeText()).toBe("RSVP'D");
  });

  it('renders a SAVED status badge for saved', () => {
    render({ ...EVENT, rsvpStatus: 'saved' });
    expect(badgeText()).toBe('SAVED');
  });

  it('emits viewDetailsClick with the event id when View Details is clicked', () => {
    render(EVENT);
    let emitted: string | null = null;
    component.viewDetailsClick.subscribe((id) => (emitted = id));

    (fixture.debugElement.query(By.css('app-text-link a')).nativeElement as HTMLElement).click();
    expect(emitted).toBe('evt-01');
  });
});
