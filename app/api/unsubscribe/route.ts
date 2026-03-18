import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = body.email;
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const admin = createAdminClient();
  await admin
    .from('notification_subscriptions')
    .update({ is_active: false })
    .eq('email', email);

  return NextResponse.json({ success: true });
}
