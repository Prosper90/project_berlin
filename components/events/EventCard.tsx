import Link from "next/link";
import { Event } from "@/types";
import { formatTime } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  conference: "border-accent text-accent",
  hackathon: "border-purple-400 text-purple-400",
  meetup: "border-blue-400 text-blue-400",
  workshop: "border-yellow-400 text-yellow-400",
  summit: "border-orange-400 text-orange-400",
  panel: "border-pink-400 text-pink-400",
  networking: "border-cyan-400 text-cyan-400",
  other: "border-muted text-muted",
};

export default function EventCard({ event }: EventCardProps) {
  const typeColor =
    EVENT_TYPE_COLORS[event.event_type ?? "other"] ?? EVENT_TYPE_COLORS.other;

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className="rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-accent/50 hover:bg-surface/80">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {event.event_type && (
              <span
                className={`inline-block rounded border px-2 py-0.5 text-xs font-mono uppercase tracking-wider mb-2 ${typeColor}`}
              >
                {event.event_type}
              </span>
            )}
            <h3 className="text-base font-semibold text-white group-hover:text-accent transition-colors line-clamp-2">
              {event.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-accent">
              {event.hosting_company}
            </p>

            {event.description && (
              <p className="mt-2 text-sm text-muted line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          {event.is_featured && (
            <span className="shrink-0 rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
              Featured
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          {(event.start_time || event.end_time) && (
            <span className="flex items-center gap-1">
              <ClockIcon />
              {event.start_time && formatTime(event.start_time)}
              {event.end_time && ` – ${formatTime(event.end_time)}`}
            </span>
          )}
          {event.venue_name && (
            <span className="flex items-center gap-1">
              <PinIcon />
              {event.venue_name}
            </span>
          )}
          {event.city && (
            <span className="flex items-center gap-1">
              <MapIcon />
              {event.city}
            </span>
          )}
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {event.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-border/50 px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
      />
    </svg>
  );
}
