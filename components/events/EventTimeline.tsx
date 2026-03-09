import { Event } from '@/types';
import { formatDate, groupEventsByDate } from '@/lib/utils';
import EventCard from './EventCard';

interface EventTimelineProps {
  events: Event[];
}

export default function EventTimeline({ events }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl">📭</p>
        <p className="mt-4 text-lg font-medium text-white">No events found</p>
        <p className="mt-1 text-sm text-muted">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  const grouped = groupEventsByDate(events);
  const sortedDates = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-[5.5rem] top-0 hidden h-full w-px bg-border md:block" />

      <div className="flex flex-col gap-8">
        {sortedDates.map((date) => (
          <section key={date} className="flex flex-col md:flex-row md:gap-8">
            {/* Desktop date column */}
            <div className="hidden w-20 shrink-0 flex-col items-end pt-1 md:flex">
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -right-[1.95rem] top-2 h-2 w-2 rounded-full bg-accent" />
                <time className="block text-right font-mono text-xs text-muted">
                  {new Date(date).toLocaleDateString('en-DE', { month: 'short' }).toUpperCase()}
                </time>
                <time className="block text-right font-mono text-2xl font-bold leading-tight text-white">
                  {new Date(date).getDate().toString().padStart(2, '0')}
                </time>
                <time className="block text-right font-mono text-xs text-muted">
                  {new Date(date).toLocaleDateString('en-DE', { weekday: 'short' }).toUpperCase()}
                </time>
              </div>
            </div>

            {/* Mobile date — full width row above cards */}
            <div className="mb-3 flex items-center gap-3 md:hidden">
              <div className="h-px flex-1 bg-border" />
              <time className="font-mono text-xs font-semibold text-accent">
                {formatDate(date)}
              </time>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Events for this date */}
            <div className="flex w-full flex-col gap-3 md:flex-1 md:min-w-0">
              {grouped[date].map((event) => (
                <EventCard key={event.id} event={event as Event} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
