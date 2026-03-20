import Link from "next/link";
import { Event } from "@/types";
import { formatTime } from "@/lib/utils";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

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

function staticMapUrl(event: Event): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;
  const q = event.latitude && event.longitude
    ? `${event.latitude},${event.longitude}`
    : encodeURIComponent([event.venue_name, event.venue_address, event.city].filter(Boolean).join(', '));
  if (!q) return null;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${q}&zoom=14&size=160x160&scale=2&markers=color:0x10b981|${q}&style=element:geometry|color:0x1a2320&style=element:labels.text.stroke|color:0x0f1410&style=element:labels.text.fill|color:0x9ca3af&key=${apiKey}`;
}

export default function EventCard({ event }: EventCardProps) {
  const typeColor =
    EVENT_TYPE_COLORS[event.event_type ?? "other"] ?? EVENT_TYPE_COLORS.other;
  const mapUrl = staticMapUrl(event);

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className="h-52 rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-accent/50 hover:bg-surface/80">
        <div className="flex h-full">
        {event.cover_image_url && (
          <div className="w-32 shrink-0 sm:w-40 h-full overflow-hidden">
            <img
              src={event.cover_image_url}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1 p-4 overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {event.event_type && (
                <span
                  className={`inline-block rounded border px-2 py-0.5 text-xs font-mono uppercase tracking-wider ${typeColor}`}
                >
                  {event.event_type}
                </span>
              )}
              {event.event_date && (
                <span className="text-xs font-medium text-accent">
                  {formatDate(event.event_date)}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-muted truncate">
              {event.hosting_company}
            </p>

            {event.description && (
              <p className="mt-1 text-xs text-muted line-clamp-2">
                {event.description.replace(/<[^>]*>/g, '')}
              </p>
            )}
          </div>

          {event.is_featured && (
            <span className="shrink-0 rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          {(event.start_time || event.end_time) && (
            <span className="flex items-center gap-1">
              <ClockIcon />
              {event.start_time && formatTime(event.start_time)}
              {event.end_time && ` – ${formatTime(event.end_time)}`}
            </span>
          )}
          {event.venue_name && (
            <span className="flex items-center gap-1 truncate max-w-[140px]">
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
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-border/50 px-2 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        </div>

        {/* Static map thumbnail on the right */}
        {mapUrl && (
          <div className="hidden sm:block w-36 shrink-0 overflow-hidden border-l border-border">
            <img
              src={mapUrl}
              alt="Map"
              className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        )}

        </div>
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
