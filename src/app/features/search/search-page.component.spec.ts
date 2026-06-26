import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronDown,
  LoaderCircle,
  LucideAngularModule,
  MapPin,
  Search,
  X,
} from 'lucide-angular';

import { EventSummary } from '../../shared/models/event.model';
import { EventsService } from '../events/data-access/events.service';
import { SearchPageComponent } from './search-page.component';

const RESULTS: EventSummary[] = [
  { id: 'evt-01', title: 'Annual Tech Symposium', category: 'academic', imageUrl: 'x.jpg', dateLabel: 'NOV 15' },
  { id: 'evt-02', title: 'Music Festival', category: 'entertainment', imageUrl: 'y.jpg', dateLabel: 'OCT 24' },
];

describe('SearchPageComponent', () => {
  let fixture: ComponentFixture<SearchPageComponent>;
  let params$: BehaviorSubject<ParamMap>;
  let router: Router;
  let navigate: ReturnType<typeof vi.spyOn>;
  const eventsService = {
    getEvents: vi.fn().mockReturnValue(of(RESULTS)),
    getEventLocations: vi.fn().mockReturnValue(of(['Main Bowl', 'Sports Complex'])),
    toggleBookmark: vi.fn(),
  };

  async function setup(initial: Record<string, string> = {}): Promise<void> {
    params$ = new BehaviorSubject<ParamMap>(convertToParamMap(initial));
    eventsService.getEvents.mockReturnValue(of(RESULTS));
    eventsService.getEventLocations.mockReturnValue(of(['Main Bowl', 'Sports Complex']));
    eventsService.toggleBookmark.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        SearchPageComponent,
        LucideAngularModule.pick({ Bookmark, BookmarkCheck, Calendar, ChevronDown, LoaderCircle, MapPin, Search, X }),
      ],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParamMap: params$ } },
        { provide: EventsService, useValue: eventsService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(SearchPageComponent);
    fixture.detectChanges();
  }

  function chips() {
    return fixture.debugElement.queryAll(By.css('app-chip'));
  }

  it('seeds from query params and queries all events when none are present', async () => {
    await setup();
    expect(eventsService.getEvents).toHaveBeenCalledWith({
      category: undefined,
      query: undefined,
      date: undefined,
      location: undefined,
    });
    expect(fixture.debugElement.queryAll(By.css('app-event-card-search-result')).length).toBe(2);
  });

  it('renders date, location, and category filter chips with default dropdown labels', async () => {
    await setup();
    expect(chips().length).toBe(3);
    expect(chips()[0].componentInstance.label()).toBe('DATE');
    expect(chips()[1].componentInstance.label()).toBe('ALL LOCATIONS');
    expect(chips()[2].componentInstance.label()).toBe('CATEGORY');
    expect(chips().every((chip) => chip.componentInstance.variant() === 'dropdown')).toBe(true);
  });

  it('pre-selects the category and filters when arriving at /search?category=academic', async () => {
    await setup({ category: 'academic' });
    expect(eventsService.getEvents).toHaveBeenCalledWith({
      category: 'academic',
      query: undefined,
      date: undefined,
      location: undefined,
    });
    expect(chips()[2].componentInstance.label()).toBe('ACADEMIC');
    expect(chips()[2].componentInstance.variant()).toBe('dismissible');
  });

  it('pre-selects date and location filters from query params', async () => {
    await setup({ date: 'today', location: 'Main Bowl' });
    expect(eventsService.getEvents).toHaveBeenCalledWith({
      category: undefined,
      query: undefined,
      date: 'today',
      location: 'Main Bowl',
    });
    expect(chips()[0].componentInstance.label()).toBe('TODAY');
    expect(chips()[0].componentInstance.variant()).toBe('dismissible');
    expect(chips()[1].componentInstance.label()).toBe('Main Bowl');
    expect(chips()[1].componentInstance.variant()).toBe('dismissible');
  });

  it('seeds the query from the q param', async () => {
    await setup({ q: 'sym' });
    expect(eventsService.getEvents).toHaveBeenCalledWith({
      category: undefined,
      query: 'sym',
      date: undefined,
      location: undefined,
    });
  });

  it('renders the results toolbar count', async () => {
    await setup();
    expect(
      (fixture.debugElement.query(By.css('[data-testid="results-toolbar-count"]')).nativeElement as HTMLElement).textContent?.trim(),
    ).toBe('Showing 2 events');
  });

  it('updates the q query param (merge, replaceUrl) on query change', async () => {
    await setup();
    fixture.debugElement.query(By.css('app-search-bar')).componentInstance.valueChange.emit('jazz');

    expect(navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { q: 'jazz' }, queryParamsHandling: 'merge', replaceUrl: true }),
    );
  });

  it('toggles the date picker and updates the date param on selection', async () => {
    await setup();
    expect(fixture.debugElement.query(By.css('[data-testid="date-picker"]'))).toBeNull();

    chips()[0].componentInstance.clicked.emit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[data-testid="date-picker"]'))).toBeTruthy();

    const options = fixture.debugElement.queryAll(By.css('[data-testid="date-picker"] button'));
    (options[1].nativeElement as HTMLElement).click();

    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { date: 'today' } }));
  });

  it('toggles the location picker and updates the location param on selection', async () => {
    await setup();
    chips()[1].componentInstance.clicked.emit();
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('[data-testid="location-picker"] button'));
    (options[1].nativeElement as HTMLElement).click();

    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { location: 'Main Bowl' } }));
  });

  it('toggles the category picker and updates the category param on selection', async () => {
    await setup();
    expect(fixture.debugElement.query(By.css('[data-testid="category-picker"]'))).toBeNull();

    chips()[2].componentInstance.clicked.emit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[data-testid="category-picker"]'))).toBeTruthy();

    const options = fixture.debugElement.queryAll(By.css('[data-testid="category-picker"] button'));
    (options[1].nativeElement as HTMLElement).click();

    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { category: 'entertainment' } }));
  });

  it('clears the date param when the dismiss button is tapped on an active date chip', async () => {
    await setup({ date: 'today' });
    chips()[0].componentInstance.dismiss.emit();
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { date: null } }));
  });

  it('clears the location param when the dismiss button is tapped on an active location chip', async () => {
    await setup({ location: 'Main Bowl' });
    chips()[1].componentInstance.dismiss.emit();
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { location: null } }));
  });

  it('clears the category param when the dismiss button is tapped on an active category chip', async () => {
    await setup({ category: 'academic' });
    chips()[2].componentInstance.dismiss.emit();
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { category: null } }));
  });

  it('clears the category param when "All categories" is chosen', async () => {
    await setup({ category: 'academic' });
    chips()[2].componentInstance.clicked.emit();
    fixture.detectChanges();

    (fixture.debugElement.query(By.css('[data-testid="category-option-all"]')).nativeElement as HTMLElement).click();
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { category: null } }));
  });

  it('toggles bookmark via EventsService and refreshes results', async () => {
    await setup();
    const callsBefore = eventsService.getEvents.mock.calls.length;

    fixture.debugElement.query(By.css('app-event-card-search-result')).componentInstance.bookmarkToggle.emit('evt-01');

    expect(eventsService.toggleBookmark).toHaveBeenCalledWith('evt-01');
    expect(eventsService.getEvents.mock.calls.length).toBe(callsBefore + 1);
  });

  it('navigates to /events/{id} on details and register clicks', async () => {
    await setup();
    const card = fixture.debugElement.query(By.css('app-event-card-search-result'));

    card.componentInstance.detailsClick.emit('evt-01');
    expect(navigate).toHaveBeenCalledWith(['/events', 'evt-01']);

    card.componentInstance.registerClick.emit('evt-02');
    expect(navigate).toHaveBeenCalledWith(['/events', 'evt-02']);
  });
});
