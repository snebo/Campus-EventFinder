import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, of, shareReplay, tap } from 'rxjs';

import { MockApiService, MockUserEvents } from '../../../core/data-access/mock-api.service';
import { EventCategory, EventDetails, EventSummary, TrendingDetails } from '../../../shared/models/event.model';
import { AuthService } from '../../auth/data-access/auth.service';

interface EventsStore {
  events: EventDetails[];
  trending: TrendingDetails[];
  userEvents: Record<string, MockUserEvents>;
}

export interface EventsFilters {
  category?: EventCategory;
  query?: string;
}

export interface ScheduleGroup {
  dateLabel: string;
  events: EventSummary[];
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly mockApi = inject(MockApiService);
  private readonly authService = inject(AuthService);

  private readonly store = signal<EventsStore | null>(null);
  private load$: Observable<void> | null = null;

  getEvents(filters?: EventsFilters): Observable<EventSummary[]> {
    return this.read(() => {
      let result = this.allWithUserState();

      const category = filters?.category;
      if (category) {
        result = result.filter((event) => event.category === category);
      }

      const query = filters?.query?.trim().toLowerCase();
      if (query) {
        result = result.filter((event) => event.title.toLowerCase().includes(query));
      }

      return this.sortByDateAsc(result);
    });
  }

  getUpcomingEvents(limit?: number): Observable<EventSummary[]> {
    return this.read(() => {
      const today = this.todayIso();
      const upcoming = this.sortByDateAsc(this.allWithUserState().filter((event) => this.isOnOrAfter(event, today)));
      return limit != null ? upcoming.slice(0, limit) : upcoming;
    });
  }

  getTrendingEvents(limit?: number): Observable<TrendingDetails[]> {
    return this.read(() => {
      const trending = this.store()!.trending.map((event) => this.withUserState(event));
      return limit != null ? trending.slice(0, limit) : trending;
    });
  }

  getEventById(id: string): Observable<EventDetails | undefined> {
  return this.read(() => {
    const store = this.store();
    if (!store) return undefined;

    const event =
      store.events.find((candidate) => candidate.id === id) ??
      store.trending.find((candidate) => candidate.id === id);

    return event ? this.withUserState(event) : undefined;
  });
}

  getScheduleEvents(tab: 'rsvpd' | 'saved'): Observable<ScheduleGroup[]> {
    return this.read(() => {
      const ids = new Set(this.currentUserEvents()[tab]);
      const today = this.todayIso();

      const events = this.sortByDateAsc(
        this.allWithUserState().filter((event) => ids.has(event.id) && this.isOnOrAfter(event, today)),
      );

      return this.groupByDateLabel(events);
    });
  }

  toggleBookmark(id: string): void {
    this.toggleMembership('saved', id);
  }

  toggleRsvp(id: string): void {
    this.toggleMembership('rsvpd', id);
  }

  // --- internals -----------------------------------------------------------

  private read<T>(project: () => T): Observable<T> {
    return this.ensureLoaded().pipe(map(project));
  }

  private ensureLoaded(): Observable<void> {
    if (this.store()) {
      return of(undefined);
    }

    if (!this.load$) {
      this.load$ = this.mockApi.getEventsData().pipe(
        tap((data) =>
          this.store.set({
            events: data.events.map((event) => ({ ...event })),
            trending: data.trending.map((trending) => ({ ...trending })),
            userEvents: this.cloneUserEvents(data.userEvents),
          }),
        ),
        map(() => undefined),
        shareReplay(1),
      );
    }

    return this.load$;
  }

  private allWithUserState(): EventSummary[] {
    return this.store()!.events.map((event) => this.withUserState(event));
  }

  private withUserState<T extends EventSummary>(event: T): T {
    const { rsvpd, saved } = this.currentUserEvents();
    return {
      ...event,
      isBookmarked: saved.includes(event.id),
      rsvpStatus: rsvpd.includes(event.id) ? 'rsvpd' : undefined,
    };
  }

  private currentUserEvents(): MockUserEvents {
    const userId = this.authService.getSession()?.user.id;
    const entry = userId ? this.store()?.userEvents[userId] : undefined;
    return entry ?? { rsvpd: [], saved: [] };
  }

  private toggleMembership(list: keyof MockUserEvents, id: string): void {
    const userId = this.authService.getSession()?.user.id;
    const store = this.store();
    if (!userId || !store) {
      return;
    }

    const current = store.userEvents[userId] ?? { rsvpd: [], saved: [] };
    const exists = current[list].includes(id);
    const nextList = exists ? current[list].filter((entryId) => entryId !== id) : [...current[list], id];

    this.store.set({
      events: store.events,
      trending: store.trending,
      userEvents: {
        ...store.userEvents,
        [userId]: { ...current, [list]: nextList },
      },
    });
  }

  private sortByDateAsc<T extends EventSummary>(events: T[]): T[] {
    return [...events].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
  }

  private groupByDateLabel(events: EventSummary[]): ScheduleGroup[] {
    const groups: ScheduleGroup[] = [];

    for (const event of events) {
      const label = event.dateLabel ?? '';
      const last = groups.at(-1);
      if (last && last.dateLabel === label) {
        last.events.push(event);
      } else {
        groups.push({ dateLabel: label, events: [event] });
      }
    }

    return groups;
  }

  private isOnOrAfter(event: EventSummary, todayIso: string): boolean {
    return event.date != null && event.date >= todayIso;
  }

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private cloneUserEvents(source: Record<string, MockUserEvents>): Record<string, MockUserEvents> {
    const clone: Record<string, MockUserEvents> = {};
    for (const [userId, entry] of Object.entries(source)) {
      clone[userId] = { rsvpd: [...entry.rsvpd], saved: [...entry.saved] };
    }
    return clone;
  }
}
