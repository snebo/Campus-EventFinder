export type EventCategory =
  | 'entertainment' | 'sports' | 'professional'
  | 'cultural' | 'food' | 'academic';

export interface EventSummary {
  id: string;
  title: string;
  category?: EventCategory;
  imageUrl?: string;
  dateLabel?: string; // display label, e.g. "NOV 15"
  timeLabel?: string; // e.g. "10:00 AM - 2:00 PM"
  location?: string;
  date?: string; // ISO 8601 date (e.g. "2026-11-15") — used for chronological sort,
  // Schedule date grouping, and past-event filtering.
  isBookmarked?: boolean;
  rsvpStatus?: 'rsvpd' | 'saved';
}

export interface EventDetails extends EventSummary {
  description: string;
}
