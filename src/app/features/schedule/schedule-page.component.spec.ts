import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Clock, LoaderCircle, LucideAngularModule, MapPin, X } from 'lucide-angular';

import { ScheduleGroup } from '../events/data-access/events.service';
import { EventsService } from '../events/data-access/events.service';
import { SchedulePageComponent } from './schedule-page.component';

const RSVPD_GROUPS: ScheduleGroup[] = [
  {
    dateLabel: 'NOV 15',
    events: [{ id: 'evt-01', title: 'Symposium', timeLabel: '10 AM', location: 'Hall A', rsvpStatus: 'rsvpd' }],
  },
  {
    dateLabel: 'DEC 5',
    events: [{ id: 'evt-03', title: 'Final', timeLabel: '4 PM', location: 'Field', rsvpStatus: 'rsvpd' }],
  },
];

describe('SchedulePageComponent', () => {
  let fixture: ComponentFixture<SchedulePageComponent>;
  let router: Router;
  let navigate: ReturnType<typeof vi.spyOn>;
  const eventsService = { getScheduleEvents: vi.fn() };

  async function setup(initialGroups: ScheduleGroup[] = RSVPD_GROUPS): Promise<void> {
    eventsService.getScheduleEvents.mockImplementation((tab: string) =>
      of(tab === 'rsvpd' ? initialGroups : []),
    );

    await TestBed.configureTestingModule({
      imports: [SchedulePageComponent, LucideAngularModule.pick({ Clock, LoaderCircle, MapPin, X })],
      providers: [provideRouter([]), { provide: EventsService, useValue: eventsService }],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(SchedulePageComponent);
    fixture.detectChanges();
  }

  function tabs() {
    return fixture.debugElement.queryAll(By.css('button[role="tab"]'));
  }

  it('loads the rsvpd tab on init and renders a group header + card per event', async () => {
    await setup();
    expect(eventsService.getScheduleEvents).toHaveBeenCalledWith('rsvpd');
    expect(fixture.debugElement.queryAll(By.css('app-date-group-header')).length).toBe(2);
    expect(fixture.debugElement.queryAll(By.css('app-event-schedule-card')).length).toBe(2);
    expect(fixture.debugElement.query(By.css('app-empty-state'))).toBeNull();
  });

  it('shows the RSVP\'d empty state when the rsvpd list is empty', async () => {
    await setup([]);
    const empty = fixture.debugElement.query(By.css('app-empty-state'));
    expect(empty).toBeTruthy();
    expect((empty.nativeElement as HTMLElement).textContent).toContain("You haven't RSVP'd to any events yet.");
  });

  it('switches to the saved tab, re-fetches, and shows the saved empty state with no stale cards', async () => {
    await setup();
    expect(fixture.debugElement.queryAll(By.css('app-event-schedule-card')).length).toBe(2);

    tabs()[1].nativeElement.click(); // SAVED -> returns []
    fixture.detectChanges();

    expect(eventsService.getScheduleEvents).toHaveBeenLastCalledWith('saved');
    expect(fixture.debugElement.queryAll(By.css('app-event-schedule-card')).length).toBe(0);
    const empty = fixture.debugElement.query(By.css('app-empty-state'));
    expect((empty.nativeElement as HTMLElement).textContent).toContain("You haven't saved any events yet.");
  });

  it('navigates to /events/{id} on a card view-details click', async () => {
    await setup();
    fixture.debugElement.query(By.css('app-event-schedule-card')).componentInstance.viewDetailsClick.emit('evt-01');
    expect(navigate).toHaveBeenCalledWith(['/events', 'evt-01']);
  });
});
