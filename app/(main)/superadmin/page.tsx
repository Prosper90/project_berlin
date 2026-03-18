import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminEventsTable from '@/components/superadmin/AdminEventsTable';
import type { Event } from '@/types';

export const metadata: Metadata = { title: 'Admin' };

function isAdmin(email: string | null): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

type Props = { searchParams: Promise<{ admin?: string }> };

export default async function SuperAdminPage({ searchParams }: Props) {
  const { admin } = await searchParams;

  if (!isAdmin(admin ?? null)) redirect('/');

  const db = createAdminClient();
  const { data: events } = await db
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  const published = (events ?? []).filter((e) => e.is_published).length;
  const hidden = (events ?? []).length - published;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted">
            {(events ?? []).length} events total &mdash; {published} live, {hidden} hidden
          </p>
        </div>
        <a
          href="/dashboard/events/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors"
        >
          + New Event
        </a>
      </div>

      <AdminEventsTable initialEvents={(events ?? []) as Event[]} adminEmail={admin!} />
    </div>
  );
}
