/**
 * Format date string to display label
 * @param dateStr - ISO date string (YYYY-MM-DD)
 * @param locale - Locale code (default: 'en-US')
 * @returns Formatted date label (e.g., 'Jan 15')
 */
export function formatDateLabel(dateStr: string, locale = 'en-US'): string {
  if (!dateStr) return '';

  try {
    const date = new Date(`${dateStr}T00:00:00Z`);

    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateStr);
      return '';
    }

    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
}

/**
 * Format time string to display label
 * @param timeStr - Time string in HH:MM format
 * @param locale - Locale code (default: 'en-US')
 * @returns Formatted time label (e.g., '2:30 PM')
 */
export function formatTimeLabel(timeStr: string, locale = 'en-US'): string {
  if (!timeStr) return '';

  try {
    const [hours, minutes] = timeStr.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      console.warn('Invalid time string:', timeStr);
      return '';
    }

    const date = new Date();
    date.setHours(hours, minutes, 0);

    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
}

/**
 * Check if a date string is in the past
 * @param dateStr - ISO date string (YYYY-MM-DD)
 * @returns true if date is in the past
 */
export function isPastDate(dateStr: string): boolean {
  try {
    const selectedDate = new Date(`${dateStr}T00:00:00Z`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate < today;
  } catch {
    return false;
  }
}

/**
 * Get time from date string
 * @param dateTimeStr - ISO datetime string
 * @returns Time string in HH:MM format or null
 */
export function getTimeFromDateTime(dateTimeStr: string): string | null {
  try {
    const date = new Date(dateTimeStr);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return null;
  }
}
