import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SegmentedTab, SegmentedTabsComponent } from '../../shared/ui/segmented-tabs/segmented-tabs.component';
import { DateGroupHeaderComponent } from '../../shared/ui/date-group-header/date-group-header.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { EventsService, ScheduleGroup } from '../events/data-access/events.service';
import { EventScheduleCardComponent } from './event-schedule-card/event-schedule-card.component';

type ScheduleTab = 'rsvpd' | 'saved';

const TABS: SegmentedTab[] = [
  { label: "RSVP'D", value: 'rsvpd' },
  { label: 'SAVED', value: 'saved' },
];

const EMPTY_MESSAGES: Record<ScheduleTab, string> = {
  rsvpd: "You haven't RSVP'd to any events yet.",
  saved: "You haven't saved any events yet.",
};

@Component({
  selector: 'app-schedule-page',
  imports: [
    PageHeaderComponent,
    SegmentedTabsComponent,
    DateGroupHeaderComponent,
    EventScheduleCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulePageComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);

  protected readonly tabs = TABS;
  protected readonly activeTab = signal<ScheduleTab>('rsvpd');
  protected readonly groupedEvents = signal<ScheduleGroup[]>([]);

  protected emptyMessage(): string {
    return EMPTY_MESSAGES[this.activeTab()];
  }

  ngOnInit(): void {
    this.load();
  }

  onTabChange(value: string): void {
    this.activeTab.set(value as ScheduleTab);
    this.load();
  }

  onViewDetails(id: string): void {
    void this.router.navigate(['/events', id]);
  }

  private load(): void {
    this.eventsService.getScheduleEvents(this.activeTab()).subscribe((groups) => this.groupedEvents.set(groups));
  }
}
