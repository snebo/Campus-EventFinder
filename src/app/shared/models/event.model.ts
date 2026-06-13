export type EventCategory =
  | 'entertainment' | 'sports' | 'professional'
  | 'cultural' | 'food' | 'academic';

export interface EventSummary {
  id: string;
  title: string;
  category?: EventCategory;
  imageUrl?: string;
  dateLabel?: string;
  timeLabel?: string;
  location?: string;
  isBookmarked?: boolean;
  rsvpStatus?: 'rsvpd' | 'saved';
}
