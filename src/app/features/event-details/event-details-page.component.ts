import { Location } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EventDetails } from '../../shared/models/event.model';
import { BookmarkButtonComponent } from '../../shared/ui/bookmark-button/bookmark-button.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { EventMetaRowComponent } from '../../shared/ui/event-meta-row/event-meta-row.component';
import { IconButtonComponent } from '../../shared/ui/icon-button/icon-button.component';
import { ImagePlaceholderComponent } from '../../shared/ui/image-placeholder/image-placeholder.component';
import { EventsService } from '../events/data-access/events.service';

@Component({
  selector: 'app-event-details-page',
  imports: [
    ImagePlaceholderComponent,
    EventMetaRowComponent,
    ButtonComponent,
    BookmarkButtonComponent,
    IconButtonComponent,
  ],
  templateUrl: './event-details-page.component.html',
  styleUrl: './event-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventsService = inject(EventsService);
  private readonly location = inject(Location);

  private readonly id = this.route.snapshot.params['id'] as string;

  protected readonly event = signal<EventDetails | undefined>(undefined);
  protected readonly loaded = signal(false);

  protected readonly registerLabel = computed(() =>
    this.event()?.rsvpStatus === 'rsvpd' ? 'Cancel Registration' : 'Register',
  );

  ngOnInit(): void {
    this.reload();
  }

  onBack(): void {
    this.location.back();
  }

  onToggleRsvp(): void {
    this.eventsService.toggleRsvp(this.id);
    this.reload();
  }

  onToggleBookmark(): void {
    this.eventsService.toggleBookmark(this.id);
    this.reload();
  }

  private reload(): void {
    this.eventsService.getEventById(this.id).subscribe((event) => {
      this.event.set(event);
      this.loaded.set(true);
    });
  }
}
