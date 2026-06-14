import { Component, computed, input, output } from '@angular/core';

import { EventSummary } from '../../../shared/models/event.model';
import { EventBadgeComponent } from '../../../shared/ui/event-badge/event-badge.component';
import { EventMetaRowComponent } from '../../../shared/ui/event-meta-row/event-meta-row.component';
import { TextLinkComponent } from '../../../shared/ui/text-link/text-link.component';

@Component({
  selector: 'app-event-schedule-card',
  imports: [EventBadgeComponent, EventMetaRowComponent, TextLinkComponent],
  templateUrl: './event-schedule-card.component.html',
  styleUrl: './event-schedule-card.component.scss',
})
export class EventScheduleCardComponent {
  event = input.required<EventSummary>();

  viewDetailsClick = output<string>();

  statusLabel = computed(() => (this.event().rsvpStatus === 'rsvpd' ? "RSVP'D" : 'SAVED'));

  onViewDetails(): void {
    this.viewDetailsClick.emit(this.event().id);
  }
}
