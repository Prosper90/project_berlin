import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import EventTimeline from '@/components/events/EventTimeline';
import EventFilters from '@/components/events/EventFilters';
import { Event, EventType } from '@/types';

export const metadata: Metadata = { title: 'Events' };

interface SearchParams {
  search?: string;
  hosting_company?: string;
  event_type?: string;
  date_from?: string;
  date_to?: string;
  page?: string;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const page = parseInt(params.page ?? '1', 10);
  const limit = 30;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('event_date', { ascending: true })
    .range(offset, offset + limit - 1);

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,hosting_company.ilike.%${params.search}%`);
  }
  if (params.hosting_company) {
    query = query.ilike('hosting_company', `%${params.hosting_company}%`);
  }
  if (params.event_type) {
    query = query.eq('event_type', params.event_type as EventType);
  }
  if (params.date_from) {
    query = query.gte('event_date', params.date_from);
  }
  if (params.date_to) {
    query = query.lte('event_date', params.date_to);
  }

  const { data: events, count } = await query;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Events</h1>
        <p className="mt-1 text-sm text-muted">
          {count ?? 0} event{count !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-64 lg:shrink-0">
          <Suspense>
            <EventFilters />
          </Suspense>
        </aside>

        {/* Timeline */}
        <div className="flex-1 min-w-0">
          <EventTimeline events={(events as Event[]) ?? []} />
        </div>
      </div>
    </div>
  );
}
