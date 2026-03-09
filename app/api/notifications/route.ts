import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { is_active } = await request.json();

  // Upsert notification subscription
  const { error } = await supabase
    .from('notification_subscriptions')
    .upsert({
      user_id: user.id,
      email: user.email!,
      is_active,
    }, { onConflict: 'email' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Also update profile preference
  await supabase
    .from('profiles')
    .update({ notification_opt_in: is_active })
    .eq('id', user.id);

  return NextResponse.json({ success: true });
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
