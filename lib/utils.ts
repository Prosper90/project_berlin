import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(timeString?: string): string {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-DE', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-DE', {
    month: 'short',
    day: 'numeric',
  });
}

export function groupEventsByDate<T extends { event_date: string }>(events: T[]): Record<string, T[]> {
  return events.reduce(
    (groups, event) => {
      const date = event.event_date;
      return {
        ...groups,
        [date]: [...(groups[date] || []), event],
      };
    },
    {} as Record<string, T[]>
  );
}

export function isUpcoming(dateString: string): boolean {
  return new Date(dateString) >= new Date(new Date().toDateString());
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
