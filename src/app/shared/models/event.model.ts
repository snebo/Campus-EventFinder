import { EventCategory } from './categories.const';

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
  description?: string;
  status?: 'draft' | 'published' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
  isBookmarked?: boolean;
  rsvpStatus?: 'rsvpd' | 'saved';
}

export type CreateEventInput = Omit<EventDetails, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export interface EventFormErrors {
  eventName?: string[];
  eventCategory?: string[];
  date?: string[];
  time?: string[];
  location?: string[];
  aboutEvent?: string[];
  capacity?: string[];
  admission?: string[];
  imageUrl?: string[];
}

export interface EventDetails extends EventSummary {
  description?: string;
}
export interface TrendingDetails extends EventSummary{
  attendeeLabel: string;
  when: string;
}
