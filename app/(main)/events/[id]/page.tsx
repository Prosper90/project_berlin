import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate, formatTime } from '@/lib/utils';
import { renderDescription } from '@/lib/renderDescription';
import Button from '@/components/ui/Button';
import { Event } from '@/types';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('events').select('title, description').eq('id', id).single();
  if (!data) return { title: 'Event Not Found' };
  return { title: data.title, description: data.description ?? undefined };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from('events')
    .select('*, organizer:profiles(first_name, last_name, company)')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (!event) notFound();

  const e = event as Event;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/events" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
        ← Back to Events
      </Link>

      <article>
        <div className="mb-2 flex items-center gap-2">
          {e.event_type && (
            <span className="rounded border border-accent/40 px-2 py-0.5 font-mono text-xs uppercase text-accent">
              {e.event_type}
            </span>
          )}
          {e.is_featured && (
            <span className="rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">Featured</span>
          )}
        </div>

        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{e.title}</h1>
        <p className="mt-2 text-lg font-medium text-accent">{e.hosting_company}</p>

        {e.description && (
          <div
            className="event-description mt-5 text-base leading-relaxed text-muted"
            dangerouslySetInnerHTML={{ __html: renderDescription(e.description) }}
          />
        )}

        {/* Details grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 rounded-lg border border-border bg-surface p-6 sm:grid-cols-2">
          <Detail label="Date" value={formatDate(e.event_date)} />
          {(e.start_time || e.end_time) && (
            <Detail
              label="Time"
              value={[e.start_time && formatTime(e.start_time), e.end_time && formatTime(e.end_time)]
                .filter(Boolean)
                .join(' – ')}
            />
          )}
          {e.venue_name && <Detail label="Venue" value={e.venue_name} />}
          {e.venue_address && <Detail label="Address" value={e.venue_address} />}
          <Detail label="City" value={e.city} />
          {e.tags && e.tags.length > 0 && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Tags</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {e.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-border/50 px-3 py-0.5 text-sm text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          {e.registration_url && (
            <a href={e.registration_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg">Register Now →</Button>
            </a>
          )}
          {e.website_url && (
            <a href={e.website_url} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary">Visit Website</Button>
            </a>
          )}
        </div>
      </article>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 text-sm text-white">{value}</p>
    </div>
  );
}
