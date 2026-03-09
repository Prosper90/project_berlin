import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Event } from '@/types';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirectTo=/dashboard');

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('event_date', { ascending: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, notification_opt_in')
    .eq('id', user.id)
    .single();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {profile?.first_name ?? 'there'}
          </h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <Link href="/dashboard/events/new">
          <Button>+ Post New Event</Button>
        </Link>
      </div>

      {/* My Events */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">My Events</h2>
        {!events || events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted">You haven&apos;t posted any events yet.</p>
            <Link href="/dashboard/events/new" className="mt-4 inline-block">
              <Button size="sm">Post your first event</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-white">{event.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDate(event.event_date)} &bull; {event.hosting_company}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-xs ${
                    event.is_published ? 'bg-accent/10 text-accent' : 'bg-border text-muted'
                  }`}>
                    {event.is_published ? 'Live' : 'Draft'}
                  </span>
                  <Link href={`/dashboard/events/${event.id}/edit`}>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </Link>
                  <Link href={`/events/${event.id}`}>
                    <Button size="sm" variant="ghost">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Notification preference */}
      <section className="mt-10 rounded-lg border border-border bg-surface p-6">
        <h2 className="text-base font-semibold text-white">Email Notifications</h2>
        <p className="mt-1 text-sm text-muted">
          {profile?.notification_opt_in
            ? 'You are subscribed to event alerts.'
            : 'You are not subscribed to event alerts.'}
        </p>
        <form action="/api/notifications" method="POST" className="mt-3">
          <Button size="sm" variant="secondary" type="submit">
            {profile?.notification_opt_in ? 'Unsubscribe' : 'Subscribe to alerts'}
          </Button>
        </form>
      </section>
    </div>
  );
}
