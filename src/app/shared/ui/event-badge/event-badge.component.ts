import { Component, computed, input } from '@angular/core';

export type EventBadgeVariant = 'neutral' | 'status';

const VARIANT_CLASSES: Record<EventBadgeVariant, string> = {
  neutral: 'bg-badge-bg-neutral text-text-primary',
  status: 'bg-chip-bg-selected text-white',
};

@Component({
  selector: 'app-event-badge',
  imports: [],
  templateUrl: './event-badge.component.html',
  styleUrl: './event-badge.component.scss',
})
export class EventBadgeComponent {
  label = input.required<string>();
  variant = input<EventBadgeVariant>('neutral');

  badgeClasses = computed(
    () =>
      'inline-block whitespace-nowrap rounded-badge px-2 py-0.5 text-label uppercase ' + VARIANT_CLASSES[this.variant()],
  );
}
