import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getResend, FROM_EMAIL } from '@/lib/resend';
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

  const { data: event, error } = await supabase
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

  // Send notification emails to active subscribers (non-blocking)
  if (getResend()) {
    sendEventNotifications(event).catch(() => {});
  }

  return NextResponse.json({ data: event }, { status: 201 });
}

async function sendEventNotifications(event: {
  id: string;
  title: string;
  hosting_company: string;
  event_date: string;
  description?: string | null;
  venue_name?: string | null;
  city: string;
  [key: string]: unknown;
}) {
  const admin = createAdminClient();

  const { data: subscribers } = await admin
    .from('notification_subscriptions')
    .select('email')
    .eq('is_active', true);

  if (!subscribers || subscribers.length === 0) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const emails = subscribers.map((s) => s.email);

  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: emails.length === 1 ? emails[0] : FROM_EMAIL,
    bcc: emails.length > 1 ? emails : undefined,
    subject: `New Event: ${event.title}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#e5e7eb">
        <div style="background:#111820;border-radius:8px;padding:24px;border:1px solid #1e2d3d">
          <p style="color:#10b981;font-family:monospace;font-size:12px;letter-spacing:0.1em;margin:0 0 12px">
            BERLIN · BLOCKCHAIN · EVENTS
          </p>
          <h2 style="margin:0 0 4px;color:#fff;font-size:20px">${event.title}</h2>
          <p style="margin:0 0 16px;color:#10b981;font-weight:600">${event.hosting_company}</p>
          ${event.description ? `<p style="color:#9ca3af;margin:0 0 16px">${event.description}</p>` : ''}
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px;width:80px">Date</td>
              <td style="padding:6px 0;color:#fff;font-size:13px">${event.event_date}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px">Location</td>
              <td style="padding:6px 0;color:#fff;font-size:13px">${event.venue_name ? `${event.venue_name}, ` : ''}${event.city}</td>
            </tr>
          </table>
          <a href="${appUrl}/events/${event.id}"
            style="display:inline-block;background:#10b981;color:#0f1410;font-weight:600;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px">
            View Event →
          </a>
        </div>
        <p style="color:#4b5563;font-size:12px;margin-top:16px;text-align:center">
          <a href="${appUrl}/dashboard" style="color:#6b7280">Unsubscribe</a>
        </p>
      </div>
    `,
  });
}
