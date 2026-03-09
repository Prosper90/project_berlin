import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EventFilters, EventFormData } from '@/types';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  const filters: EventFilters = {
    search: searchParams.get('search') ?? undefined,
    hosting_company: searchParams.get('hosting_company') ?? undefined,
    event_type: (searchParams.get('event_type') as EventFilters['event_type']) ?? undefined,
    date_from: searchParams.get('date_from') ?? undefined,
    date_to: searchParams.get('date_to') ?? undefined,
  };

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from('events')
    .select('*, organizer:profiles(id, first_name, last_name, company)', { count: 'exact' })
    .eq('is_published', true)
    .order('event_date', { ascending: true })
    .range(offset, offset + limit - 1);

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,hosting_company.ilike.%${filters.search}%`);
  }
  if (filters.hosting_company) {
    query = query.ilike('hosting_company', `%${filters.hosting_company}%`);
  }
  if (filters.event_type) {
    query = query.eq('event_type', filters.event_type);
  }
  if (filters.date_from) {
    query = query.gte('event_date', filters.date_from);
  }
  if (filters.date_to) {
    query = query.lte('event_date', filters.date_to);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, page, limit });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: EventFormData = await request.json();

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...body,
      organizer_id: user.id,
      organizer_email: user.email,
      source: 'manual',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
