
export const EVENT_CATEGORIES: { value: EventCategory | string; label: string }[] = [
  { value: 'entertainment', label: 'ENTERTAINMENT' },
  { value: 'sports', label: 'SPORTS' },
  { value: 'professional', label: 'PROFESSIONAL' },
  { value: 'cultural', label: 'CULTURAL' },
  { value: 'food', label: 'FOOD' },
  { value: 'academic', label: 'ACADEMIC' },
];

export type EventCategory = 'tech' | 'music' | 'sports' | 'business' | 'arts' | 'other';

export interface Category {
  value: EventCategory | string;
  label: string;
  icon?: string;
}
