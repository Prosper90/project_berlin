import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EventForm from '@/components/events/EventForm';
import { EventFormData } from '@/types';

export const metadata: Metadata = { title: 'Edit Event' };

type Props = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('organizer_id', user.id)
    .single();

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
    tags: event.tags ?? [],
    website_url: event.website_url ?? '',
    registration_url: event.registration_url ?? '',
    cover_image_url: event.cover_image_url ?? '',
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-white">Edit Event</h1>
      <div className="rounded-xl border border-border bg-surface p-8">
        <EventForm initialData={initialData} eventId={id} />
      </div>
    </div>
  );
}
