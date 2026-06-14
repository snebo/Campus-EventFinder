import { Component, computed, input, output } from '@angular/core';

import { EventSummary } from '../../../shared/models/event.model';
import { BookmarkButtonComponent } from '../../../shared/ui/bookmark-button/bookmark-button.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { EventBadgeComponent } from '../../../shared/ui/event-badge/event-badge.component';
import { EventMetaRowComponent } from '../../../shared/ui/event-meta-row/event-meta-row.component';

@Component({
  selector: 'app-event-card-search-result',
  imports: [BookmarkButtonComponent, EventBadgeComponent, EventMetaRowComponent, ButtonComponent],
  templateUrl: './event-card-search-result.component.html',
  styleUrl: './event-card-search-result.component.scss',
})
export class EventCardSearchResultComponent {
  event = input.required<EventSummary>();

  registerClick = output<string>();
  detailsClick = output<string>();
  bookmarkToggle = output<string>();

  categoryLabel = computed(() => this.event().category?.toUpperCase() ?? '');

  dateTimeLabel = computed(() => {
    const { dateLabel, timeLabel } = this.event();
    return [dateLabel, timeLabel].filter(Boolean).join(' · ');
  });

  onRegister(): void {
    this.registerClick.emit(this.event().id);
  }

  onDetails(): void {
    this.detailsClick.emit(this.event().id);
  }

  onBookmarkToggle(): void {
    this.bookmarkToggle.emit(this.event().id);
  }
}
