import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

function isAdmin(email: string | null): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const adminEmail = request.headers.get('x-admin-email');

  if (!isAdmin(adminEmail)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body: Record<string, unknown> = await request.json();
  const db = createAdminClient();

  const { data, error } = await db
    .from('events')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const adminEmail = _.headers.get('x-admin-email');

  if (!isAdmin(adminEmail)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = createAdminClient();
  const { error } = await db.from('events').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
