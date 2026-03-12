import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getResend, FROM_EMAIL } from '@/lib/resend';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { is_active?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const is_active = body.is_active ?? false;

  // Upsert notification subscription in Supabase
  const { error } = await supabase
    .from('notification_subscriptions')
    .upsert(
      { user_id: user.id, email: user.email!, is_active },
      { onConflict: 'email' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Keep profile in sync
  await supabase
    .from('profiles')
    .update({ notification_opt_in: is_active })
    .eq('id', user.id);

  // Sync with Resend — send a welcome email on first subscribe
  const resend = getResend();
  if (is_active && resend) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email!,
      subject: 'You\'re subscribed to Berlin Blockchain Events',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#10b981">You're in!</h2>
          <p>You'll now receive email alerts whenever a new blockchain event is posted in Berlin.</p>
          <p style="color:#666;font-size:0.85rem">
            To unsubscribe at any time, visit your
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#10b981">dashboard</a>.
          </p>
        </div>
      `,
    }).catch(() => {
      // Don't fail the request if email delivery fails
    });
  }

  return NextResponse.json({ success: true, is_active });
}

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await supabase
    .from('notification_subscriptions')
    .select('is_active')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json({ is_active: data?.is_active ?? false });
}
