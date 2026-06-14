import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Clock, Image, LoaderCircle, LucideAngularModule, MapPin, Search } from 'lucide-angular';

import { EventSummary } from '../../shared/models/event.model';
import { AuthService } from '../auth/data-access/auth.service';
import { EventsService } from '../events/data-access/events.service';
import { HomePageComponent } from './home-page.component';

const UPCOMING: EventSummary[] = [
  { id: 'evt-01', title: 'Annual Tech Symposium', dateLabel: 'NOV 15', timeLabel: '10:00 AM', location: 'Hall A' },
  { id: 'evt-02', title: 'Music Festival', dateLabel: 'OCT 24', timeLabel: '6:00 PM', location: 'Main Bowl' },
];

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let router: Router;
  let navigate: ReturnType<typeof vi.spyOn>;
  const eventsService = { getUpcomingEvents: vi.fn().mockReturnValue(of(UPCOMING)) };

  beforeEach(async () => {
    eventsService.getUpcomingEvents.mockReturnValue(of(UPCOMING));

    await TestBed.configureTestingModule({
      imports: [HomePageComponent, LucideAngularModule.pick({ Clock, Image, LoaderCircle, MapPin, Search })],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { getSession: () => ({ user: { fullName: 'Ada Eze' } }) } },
        { provide: EventsService, useValue: eventsService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();
  });

  function chips() {
    return fixture.debugElement.queryAll(By.css('app-chip'));
  }

  it('greets the current user by name', () => {
    expect((fixture.debugElement.query(By.css('h1')).nativeElement as HTMLElement).textContent).toContain('Ada Eze');
  });

  it('renders 7 select chips: ALL + 6 categories, with ALL selected by default', () => {
    expect(chips().length).toBe(7);
    expect((chips()[0].nativeElement as HTMLElement).textContent?.trim()).toBe('ALL');
    expect((chips()[0].query(By.css('button')).nativeElement as HTMLElement).classList.contains('bg-chip-bg-selected')).toBe(
      true,
    );
  });

  it('renders an EventCardFeaturedComponent per upcoming event (max 2)', () => {
    expect(eventsService.getUpcomingEvents).toHaveBeenCalledWith(8);
    expect(fixture.debugElement.queryAll(By.css('app-event-card-featured')).length).toBe(2);
  });

  it('navigates to /search with q param on search submit', () => {
    const searchBar = fixture.debugElement.query(By.css('app-search-bar'));
    searchBar.componentInstance.submit.emit('jazz');
    expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: { q: 'jazz' } });
  });

  it('navigates to /search (no category) when ALL is clicked', () => {
    chips()[0].componentInstance.clicked.emit();
    expect(navigate).toHaveBeenCalledWith(['/search']);
  });

  it('navigates to /search?category=value and selects the chip when a category is clicked', () => {
    chips()[1].componentInstance.clicked.emit(); // first category = entertainment
    expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: { category: 'entertainment' } });
  });

  it('navigates to /events/{id} on learnMoreClick', () => {
    fixture.debugElement.query(By.css('app-event-card-featured')).componentInstance.learnMoreClick.emit('evt-01');
    expect(navigate).toHaveBeenCalledWith(['/events', 'evt-01']);
  });

  it('still renders the section header with no cards when there are no upcoming events', async () => {
    eventsService.getUpcomingEvents.mockReturnValue(of([]));
    const f = TestBed.createComponent(HomePageComponent);
    f.detectChanges();

    expect(f.debugElement.query(By.css('app-section-header'))).toBeTruthy();
    expect(f.debugElement.queryAll(By.css('app-event-card-featured')).length).toBe(0);
  });
});
