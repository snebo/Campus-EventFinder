import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  Image,
  LoaderCircle,
  LucideAngularModule,
  MapPin,
} from 'lucide-angular';

import { EventDetails } from '../../shared/models/event.model';
import { EventsService } from '../events/data-access/events.service';
import { EventDetailsPageComponent } from './event-details-page.component';

const EVENT: EventDetails = {
  id: 'evt-01',
  title: 'Annual Tech Symposium',
  imageUrl: 'https://example.com/evt-01.jpg',
  dateLabel: 'NOV 15',
  timeLabel: '10:00 AM - 2:00 PM',
  location: 'Hall A',
  description: 'A full-day symposium.',
  isBookmarked: false,
  rsvpStatus: undefined,
};

describe('EventDetailsPageComponent', () => {
  let fixture: ComponentFixture<EventDetailsPageComponent>;
  const eventsService = {
    getEventById: vi.fn(),
    toggleRsvp: vi.fn(),
    toggleBookmark: vi.fn(),
  };
  const location = { back: vi.fn() };
  let current: EventDetails | undefined;

  async function setup(initial: EventDetails | undefined, id = 'evt-01'): Promise<void> {
    current = initial;
    eventsService.getEventById.mockImplementation(() => of(current));
    eventsService.toggleRsvp.mockClear();
    eventsService.toggleBookmark.mockClear();
    location.back.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        EventDetailsPageComponent,
        LucideAngularModule.pick({ ArrowLeft, Bookmark, BookmarkCheck, Calendar, Clock, Image, LoaderCircle, MapPin }),
      ],
      providers: [
        { provide: EventsService, useValue: eventsService },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id } } } },
        { provide: Location, useValue: location },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsPageComponent);
    fixture.detectChanges();
  }

  function registerButton(): HTMLElement {
    return fixture.debugElement.query(By.css('app-button button')).nativeElement as HTMLElement;
  }

  it('renders "Event not found" for an unknown id', async () => {
    await setup(undefined);
    expect(fixture.debugElement.query(By.css('[data-testid="event-not-found"]'))).toBeTruthy();
  });

  it('goes back via Location when the back button is clicked', async () => {
    await setup(EVENT);
    (fixture.debugElement.query(By.css('button[aria-label="Go back"]')).nativeElement as HTMLElement).click();
    expect(location.back).toHaveBeenCalledTimes(1);
  });

  it('renders image, title, three meta rows, and description', async () => {
    await setup(EVENT);
    expect((fixture.debugElement.query(By.css('img')).nativeElement as HTMLImageElement).getAttribute('src')).toBe(
      'https://example.com/evt-01.jpg',
    );
    expect((fixture.debugElement.query(By.css('h1')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      'Annual Tech Symposium',
    );
    const rows = fixture.debugElement.queryAll(By.css('app-event-meta-row'));
    expect(rows.map((r) => r.query(By.css('lucide-icon')).componentInstance.name)).toEqual([
      'Calendar',
      'Clock',
      'MapPin',
    ]);
    expect((fixture.debugElement.query(By.css('p')).nativeElement as HTMLElement).textContent?.trim()).toBe(
      'A full-day symposium.',
    );
  });

  it('renders the placeholder when imageUrl is absent', async () => {
    await setup({ ...EVENT, imageUrl: undefined });
    expect(fixture.debugElement.query(By.css('img'))).toBeNull();
    expect(fixture.debugElement.query(By.css('app-image-placeholder'))).toBeTruthy();
  });

  it('toggles the register label between Register and Cancel Registration', async () => {
    await setup(EVENT);
    expect(registerButton().textContent?.trim()).toBe('Register');

    // Toggling flips the backing data; the component re-fetches on toggle.
    eventsService.toggleRsvp.mockImplementation(() => (current = { ...current!, rsvpStatus: 'rsvpd' }));
    registerButton().click();
    fixture.detectChanges();

    expect(eventsService.toggleRsvp).toHaveBeenCalledWith('evt-01');
    expect(registerButton().textContent?.trim()).toBe('Cancel Registration');
  });

  it('toggles bookmark via the service and reflects the new state', async () => {
    await setup(EVENT);
    eventsService.toggleBookmark.mockImplementation(() => (current = { ...current!, isBookmarked: true }));

    fixture.debugElement.query(By.css('app-bookmark-button')).componentInstance.toggle.emit();
    fixture.detectChanges();

    expect(eventsService.toggleBookmark).toHaveBeenCalledWith('evt-01');
    expect(fixture.debugElement.query(By.css('app-bookmark-button')).componentInstance.saved()).toBe(true);
  });
});
