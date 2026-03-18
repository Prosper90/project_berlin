import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getResend, FROM_EMAIL } from '@/lib/resend';

export async function POST(request: NextRequest) {
  let body: {
    first_name?: string;
    last_name?: string;
    company?: string;
    email?: string;
    gdpr_consent?: boolean;
  };

  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { first_name, last_name, company, email, gdpr_consent } = body;

  if (!email || !first_name || !last_name) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  if (!gdpr_consent) {
    return NextResponse.json({ error: 'Privacy policy consent is required' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from('notification_subscriptions')
    .upsert(
      {
        email,
        first_name,
        last_name,
        subscriber_company: company || null,
        is_active: true,
        user_id: null,
      },
      { onConflict: 'email' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Send confirmation email
  const resend = getResend();
  if (resend) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'You\'re subscribed to Berlin Blockchain Events',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#e5e7eb">
          <div style="background:#111820;border-radius:8px;padding:28px;border:1px solid #1e2d3d">
            <p style="color:#10b981;font-family:monospace;font-size:11px;letter-spacing:0.1em;margin:0 0 16px;text-transform:uppercase">
              Berlin · Blockchain · Events
            </p>
            <h2 style="margin:0 0 12px;color:#fff;font-size:20px">Hey ${first_name}, you're in! 🔔</h2>
            <p style="color:#9ca3af;margin:0 0 8px;line-height:1.6">
              You are now subscribed to event alerts. You will get emails when exciting blockchain events pop up in Berlin.
            </p>
            <p style="color:#9ca3af;margin:0 0 24px;font-size:13px">
              Remember that you can unsubscribe anytime.
            </p>
            <a href="${appUrl}/events"
              style="display:inline-block;background:#10b981;color:#0f1410;font-weight:600;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:14px">
              Browse Events →
            </a>
          </div>
          <p style="color:#4b5563;font-size:12px;margin-top:16px;text-align:center">
            <a href="${appUrl}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#6b7280;text-decoration:underline">
              Unsubscribe
            </a>
          </p>
        </div>
      `,
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
