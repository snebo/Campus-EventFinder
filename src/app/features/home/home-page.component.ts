import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { EVENT_CATEGORIES, EventCategory } from '../../shared/models/categories.const';
import { EventSummary, TrendingDetails } from '../../shared/models/event.model';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SearchBarComponent } from '../../shared/ui/search-bar/search-bar.component';
import { ChipComponent } from '../../shared/ui/chip/chip.component';
import { AuthService } from '../auth/data-access/auth.service';
import { EventsService } from '../events/data-access/events.service';
import { EventCardFeaturedComponent } from './event-card-featured/event-card-featured.component';
import { TrendingCardComponent } from './trending-card/trending-card.component';

@Component({
  selector: 'app-home-page',
  imports: [
    PageHeaderComponent,
    SearchBarComponent,
    ChipComponent,
    EventCardFeaturedComponent,
    TrendingCardComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);

  protected readonly categories = EVENT_CATEGORIES;
  protected readonly userName = this.authService.getSession()?.user.fullName ?? '';

  protected readonly activeCategory = signal<string | 'all'>('all');
  protected readonly upcomingEvents = signal<EventSummary[]>([]);
  protected readonly trendingEvents = signal<TrendingDetails[]>([]);

  ngOnInit(): void {
    this.eventsService.getUpcomingEvents(8).subscribe((events) => this.upcomingEvents.set(events));
    this.eventsService.getTrendingEvents(5).subscribe((trending) => this.trendingEvents.set(trending));
  }

  onSearchSubmit(query: string): void {
    void this.router.navigate(['/search'], { queryParams: { q: query || null } });
  }

  onSelectAll(): void {
    this.activeCategory.set('all');
    void this.router.navigate(['/search']);
  }

  onSelectCategory(category: string): void {
    this.activeCategory.set(category);
    void this.router.navigate(['/search'], { queryParams: { category } });
  }

  onLearnMore(id: string): void {
    void this.router.navigate(['/events', id]);
  }
}
