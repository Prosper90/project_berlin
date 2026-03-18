import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import EventForm from '@/components/events/EventForm';
import { EventFormData } from '@/types';

export const metadata: Metadata = { title: 'Admin — Edit Event' };

function isAdmin(email: string | null): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ admin?: string }>;
};

export default async function AdminEditEventPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { admin } = await searchParams;

  if (!isAdmin(admin ?? null)) redirect('/');

  const db = createAdminClient();
  const { data: event } = await db.from('events').select('*').eq('id', id).single();

  if (!event) notFound();

  const initialData: Partial<EventFormData> = {
    title: event.title,
    description: event.description ?? '',
    event_date: event.event_date,
    start_time: event.start_time ?? '',
    end_time: event.end_time ?? '',
    venue_name: event.venue_name ?? '',
    venue_address: event.venue_address ?? '',
    city: event.city,
    hosting_company: event.hosting_company,
    event_type: event.event_type,
    event_types: event.event_types ?? [],
    tags: event.tags ?? [],
    website_url: event.website_url ?? '',
    registration_url: event.registration_url ?? '',
    cover_image_url: event.cover_image_url ?? '',
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <a
          href={`/superadmin?admin=${admin}`}
          className="text-sm text-muted hover:text-accent transition-colors"
        >
          ← Back to admin
        </a>
      </div>
      <h1 className="mb-8 text-2xl font-bold text-white">Edit Event</h1>
      <div className="rounded-xl border border-border bg-surface p-8">
        <EventForm initialData={initialData} eventId={id} />
      </div>
    </div>
  );
}
