import { Component, ChangeDetectionStrategy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { EVENT_CATEGORIES } from '../../shared/models/categories.const';
import { DATE_FILTERS, EventDateFilter } from '../../shared/models/date-filters.const';
import { EventCategory, EventSummary } from '../../shared/models/event.model';
import { ChipComponent } from '../../shared/ui/chip/chip.component';
import { SearchBarComponent } from '../../shared/ui/search-bar/search-bar.component';
import { EventsService } from '../events/data-access/events.service';
import { EventCardSearchResultComponent } from './event-card-search-result/event-card-search-result.component';
import { ResultsToolbarComponent } from './results-toolbar/results-toolbar.component';

const CATEGORY_VALUES = new Set<string>(EVENT_CATEGORIES.map((category) => category.value));
const DATE_FILTER_VALUES = new Set<string>(DATE_FILTERS.map((entry) => entry.value));

@Component({
  selector: 'app-search-page',
  imports: [SearchBarComponent, ChipComponent, ResultsToolbarComponent, EventCardSearchResultComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly categories = EVENT_CATEGORIES;
  protected readonly dateFilters = DATE_FILTERS;

  protected readonly query = signal('');
  protected readonly activeCategory = signal<EventCategory | null>(null);
  protected readonly activeDate = signal<EventDateFilter | null>(null);
  protected readonly activeLocation = signal<string | null>(null);
  protected readonly locations = signal<string[]>([]);
  protected readonly results = signal<EventSummary[]>([]);
  protected readonly datePickerOpen = signal(false);
  protected readonly locationPickerOpen = signal(false);
  protected readonly categoryPickerOpen = signal(false);

  protected readonly dateLabel = computed(() => {
    const date = this.activeDate();
    if (!date) {
      return 'DATE';
    }
    return this.dateFilters.find((entry) => entry.value === date)?.label ?? date.toUpperCase();
  });

  protected readonly locationLabel = computed(() => this.activeLocation() ?? 'ALL LOCATIONS');

  protected readonly categoryLabel = computed(() => {
    const category = this.activeCategory();
    if (!category) {
      return 'CATEGORY';
    }
    return this.categories.find((entry) => entry.value === category)?.label ?? category.toUpperCase();
  });

  ngOnInit(): void {
    this.eventsService.getEventLocations().subscribe((locations) => this.locations.set(locations));

    // The URL query params are the single source of truth; user actions update the
    // URL, and this subscription re-derives state + results from it.
    this.route.queryParamMap.subscribe((params) => {
      this.query.set(params.get('q') ?? '');
      this.activeCategory.set(this.readCategory(params));
      this.activeDate.set(this.readDate(params));
      this.activeLocation.set(this.readLocation(params));
      this.runSearch();
    });
  }

  onQueryChange(value: string): void {
    this.updateUrl({ q: value || null });
  }

  onToggleDatePicker(): void {
    this.locationPickerOpen.set(false);
    this.categoryPickerOpen.set(false);
    this.datePickerOpen.update((open) => !open);
  }

  onToggleLocationPicker(): void {
    this.datePickerOpen.set(false);
    this.categoryPickerOpen.set(false);
    this.locationPickerOpen.update((open) => !open);
  }

  onToggleCategoryPicker(): void {
    this.datePickerOpen.set(false);
    this.locationPickerOpen.set(false);
    this.categoryPickerOpen.update((open) => !open);
  }

  onSelectDate(date: EventDateFilter): void {
    this.datePickerOpen.set(false);
    this.updateUrl({ date });
  }

  onClearDate(): void {
    this.datePickerOpen.set(false);
    this.updateUrl({ date: null });
  }

  onSelectLocation(location: string): void {
    this.locationPickerOpen.set(false);
    this.updateUrl({ location });
  }

  onClearLocation(): void {
    this.locationPickerOpen.set(false);
    this.updateUrl({ location: null });
  }

  onSelectCategory(category: EventCategory): void {
    this.categoryPickerOpen.set(false);
    this.updateUrl({ category });
  }

  onClearCategory(): void {
    this.categoryPickerOpen.set(false);
    this.updateUrl({ category: null });
  }

  onBookmarkToggle(id: string): void {
    this.eventsService.toggleBookmark(id);
    this.runSearch();
  }

  onOpenDetails(id: string): void {
    void this.router.navigate(['/events', id]);
  }

  private runSearch(): void {
    this.eventsService
      .getEvents({
        category: this.activeCategory() ?? undefined,
        query: this.query() || undefined,
        date: this.activeDate() ?? undefined,
        location: this.activeLocation() ?? undefined,
      })
      .subscribe((results) => this.results.set(results));
  }

  private readCategory(params: ParamMap): EventCategory | null {
    const value = params.get('category');
    return value && CATEGORY_VALUES.has(value) ? (value as EventCategory) : null;
  }

  private readDate(params: ParamMap): EventDateFilter | null {
    const value = params.get('date');
    return value && DATE_FILTER_VALUES.has(value) ? (value as EventDateFilter) : null;
  }

  private readLocation(params: ParamMap): string | null {
    return params.get('location');
  }

  private updateUrl(queryParams: Record<string, string | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
