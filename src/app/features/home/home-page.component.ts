import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { EVENT_CATEGORIES } from '../../shared/models/categories.const';
import { EventCategory, EventSummary } from '../../shared/models/event.model';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SearchBarComponent } from '../../shared/ui/search-bar/search-bar.component';
import { SectionHeaderComponent } from '../../shared/ui/section-header/section-header.component';
import { ChipComponent } from '../../shared/ui/chip/chip.component';
import { AuthService } from '../auth/data-access/auth.service';
import { EventsService } from '../events/data-access/events.service';
import { EventCardFeaturedComponent } from './event-card-featured/event-card-featured.component';

@Component({
  selector: 'app-home-page',
  imports: [
    PageHeaderComponent,
    SearchBarComponent,
    ChipComponent,
    SectionHeaderComponent,
    EventCardFeaturedComponent,
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

  protected readonly activeCategory = signal<EventCategory | 'all'>('all');
  protected readonly upcomingEvents = signal<EventSummary[]>([]);

  ngOnInit(): void {
    this.eventsService.getUpcomingEvents(8).subscribe((events) => this.upcomingEvents.set(events));
  }

  onSearchSubmit(query: string): void {
    void this.router.navigate(['/search'], { queryParams: { q: query || null } });
  }

  onSelectAll(): void {
    this.activeCategory.set('all');
    void this.router.navigate(['/search']);
  }

  onSelectCategory(category: EventCategory): void {
    this.activeCategory.set(category);
    void this.router.navigate(['/search'], { queryParams: { category } });
  }

  onLearnMore(id: string): void {
    void this.router.navigate(['/events', id]);
  }
}
