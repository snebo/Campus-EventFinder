import { Component, input, output } from '@angular/core';

import { EventSummary } from '../../../shared/models/event.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { EventBadgeComponent } from '../../../shared/ui/event-badge/event-badge.component';
import { EventMetaRowComponent } from '../../../shared/ui/event-meta-row/event-meta-row.component';
import { ImagePlaceholderComponent } from '../../../shared/ui/image-placeholder/image-placeholder.component';

@Component({
  selector: 'app-event-card-featured',
  imports: [ImagePlaceholderComponent, EventBadgeComponent, EventMetaRowComponent, ButtonComponent],
  templateUrl: './event-card-featured.component.html',
  styleUrl: './event-card-featured.component.scss',
})
export class EventCardFeaturedComponent {
  event = input.required<EventSummary>();

  learnMoreClick = output<string>();

  onLearnMore(): void {
    this.learnMoreClick.emit(this.event().id);
  }
}
