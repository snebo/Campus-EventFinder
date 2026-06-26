import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { MockApiService, MockEventsData } from '../../../core/data-access/mock-api.service';
import { EventDetails } from '../../../shared/models/event.model';
import { AuthService } from '../../auth/data-access/auth.service';
import { EventsService } from './events.service';

// Far-future / far-past dates keep real-clock filtering deterministic.
const EVENTS: EventDetails[] = [
  {
    id: 'evt-a',
    title: 'Annual Tech Symposium',
    category: 'academic',
    dateLabel: 'JAN 10',
    date: '2099-01-10',
    description: 'Academic event.',
  },
  {
    id: 'evt-c',
    title: 'Food Fair',
    category: 'food',
    dateLabel: 'JAN 10',
    date: '2099-01-10',
    description: 'Food event.',
  },
  {
    id: 'evt-b',
    title: 'Football Final',
    category: 'sports',
    dateLabel: 'FEB 20',
    date: '2099-02-20',
    description: 'Sports event.',
  },
  {
    id: 'evt-past',
    title: 'Old Festival',
    category: 'cultural',
    dateLabel: 'MAY 1',
    date: '2000-05-01',
    description: 'Past event.',
  },
];

function buildData(): MockEventsData {
  return {
    events: EVENTS,
    trending: [],
    userEvents: {
      'user-1': { rsvpd: ['evt-b', 'evt-a', 'evt-c', 'evt-past'], saved: ['evt-a'] },
      'user-2': { rsvpd: [], saved: [] },
    },
  };
}

function sync<T>(obs: Observable<T>): T {
  let value!: T;
  obs.subscribe((v) => (value = v));
  return value;
}

describe('EventsService', () => {
  let service: EventsService;
  let session: { user: { id: string } } | null;

  function configure(userId = 'user-1'): void {
    session = { user: { id: userId } };
    TestBed.configureTestingModule({
      providers: [
        { provide: MockApiService, useValue: { getEventsData: () => of(buildData()) } },
        { provide: AuthService, useValue: { getSession: () => session } },
      ],
    });
    service = TestBed.inject(EventsService);
  }

  beforeEach(() => configure());

  describe('getEvents', () => {
    it('returns all events sorted by date ascending with user state joined', () => {
      const result = sync(service.getEvents());

      expect(result.map((e) => e.id)).toEqual(['evt-past', 'evt-a', 'evt-c', 'evt-b']);
      const a = result.find((e) => e.id === 'evt-a')!;
      expect(a.isBookmarked).toBe(true);
      expect(a.rsvpStatus).toBe('rsvpd');
      const c = result.find((e) => e.id === 'evt-c')!;
      expect(c.isBookmarked).toBe(false);
      expect(c.rsvpStatus).toBe('rsvpd');
    });

    it('filters by exact category', () => {
      expect(sync(service.getEvents({ category: 'academic' })).map((e) => e.id)).toEqual(['evt-a']);
    });

    it('filters by case-insensitive title substring', () => {
      expect(sync(service.getEvents({ query: 'sym' })).map((e) => e.id)).toEqual(['evt-a']);
    });

    it('filters by today date', () => {
      const today = new Date().toISOString().slice(0, 10);
      const events = EVENTS.map((event) =>
        event.id === 'evt-a' ? { ...event, date: today } : event,
      );
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: MockApiService, useValue: { getEventsData: () => of({ ...buildData(), events }) } },
          { provide: AuthService, useValue: { getSession: () => ({ user: { id: 'user-1' } }) } },
        ],
      });
      const scoped = TestBed.inject(EventsService);
      expect(sync(scoped.getEvents({ date: 'today' })).map((e) => e.id)).toEqual(['evt-a']);
    });

    it('filters by exact location', () => {
      const events = EVENTS.map((event) =>
        event.id === 'evt-a' ? { ...event, location: 'Hall A' } : event,
      );
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: MockApiService, useValue: { getEventsData: () => of({ ...buildData(), events }) } },
          { provide: AuthService, useValue: { getSession: () => ({ user: { id: 'user-1' } }) } },
        ],
      });
      const scoped = TestBed.inject(EventsService);
      expect(sync(scoped.getEvents({ location: 'Hall A' })).map((e) => e.id)).toEqual(['evt-a']);
    });
  });

  describe('getEventLocations', () => {
    it('returns unique sorted locations from events', () => {
      const events = [
        { ...EVENTS[0], location: 'Zeta Hall' },
        { ...EVENTS[1], location: 'Alpha Hall' },
        { ...EVENTS[2], location: 'Alpha Hall' },
      ];
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: MockApiService, useValue: { getEventsData: () => of({ ...buildData(), events }) } },
          { provide: AuthService, useValue: { getSession: () => ({ user: { id: 'user-1' } }) } },
        ],
      });
      const scoped = TestBed.inject(EventsService);
      expect(sync(scoped.getEventLocations())).toEqual(['Alpha Hall', 'Zeta Hall']);
    });
  });

  describe('getUpcomingEvents', () => {
    it('returns only future events, ascending, capped to limit', () => {
      const result = sync(service.getUpcomingEvents(2));
      expect(result.map((e) => e.id)).toEqual(['evt-a', 'evt-c']);
      expect(result.every((e) => e.date! >= new Date().toISOString().slice(0, 10))).toBe(true);
    });

    it('returns all future events when no limit is given (past excluded)', () => {
      expect(sync(service.getUpcomingEvents()).map((e) => e.id)).toEqual(['evt-a', 'evt-c', 'evt-b']);
    });
  });

  describe('getEventById', () => {
    it('returns the joined EventDetails for a known id', () => {
      const event = sync(service.getEventById('evt-a'));
      expect(event?.description).toBe('Academic event.');
      expect(event?.isBookmarked).toBe(true);
      expect(event?.rsvpStatus).toBe('rsvpd');
    });

    it('returns undefined for an unknown id', () => {
      expect(sync(service.getEventById('nope'))).toBeUndefined();
    });
  });

  describe('getScheduleEvents', () => {
    it('groups future rsvpd events by dateLabel, chronologically, excluding past', () => {
      const groups = sync(service.getScheduleEvents('rsvpd'));
      expect(groups.map((g) => g.dateLabel)).toEqual(['JAN 10', 'FEB 20']);
      expect(groups[0].events.map((e) => e.id)).toEqual(['evt-a', 'evt-c']);
      expect(groups[1].events.map((e) => e.id)).toEqual(['evt-b']);
    });

    it('returns saved events for the saved tab', () => {
      const groups = sync(service.getScheduleEvents('saved'));
      expect(groups.map((g) => g.dateLabel)).toEqual(['JAN 10']);
      expect(groups[0].events.map((e) => e.id)).toEqual(['evt-a']);
    });

    it('returns [] for a user with no upcoming events in that list', () => {
      session = { user: { id: 'user-2' } };
      expect(sync(service.getScheduleEvents('rsvpd'))).toEqual([]);
      expect(sync(service.getScheduleEvents('saved'))).toEqual([]);
    });
  });

  describe('toggleBookmark', () => {
    it('flips saved membership and reflects it in getEvents and getScheduleEvents', () => {
      sync(service.getEvents()); // ensure loaded
      service.toggleBookmark('evt-b');

      expect(sync(service.getEvents()).find((e) => e.id === 'evt-b')!.isBookmarked).toBe(true);
      expect(sync(service.getScheduleEvents('saved')).map((g) => g.dateLabel)).toEqual(['JAN 10', 'FEB 20']);

      service.toggleBookmark('evt-b');
      expect(sync(service.getEvents()).find((e) => e.id === 'evt-b')!.isBookmarked).toBe(false);
    });
  });

  describe('toggleRsvp', () => {
    it('flips rsvp membership and reflects it in getEventById and getScheduleEvents', () => {
      sync(service.getEvents());
      service.toggleRsvp('evt-a'); // was rsvpd -> remove

      expect(sync(service.getEventById('evt-a'))?.rsvpStatus).toBeUndefined();
      expect(sync(service.getScheduleEvents('rsvpd')).flatMap((g) => g.events.map((e) => e.id))).not.toContain('evt-a');

      service.toggleRsvp('evt-a'); // add back
      expect(sync(service.getEventById('evt-a'))?.rsvpStatus).toBe('rsvpd');
    });
  });
});
