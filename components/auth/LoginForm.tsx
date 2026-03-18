'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const handleGoogle = async () => {
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback?next=${redirectTo}` },
    });
    if (oauthError) {
      setError('Google sign-in is currently unavailable. Please use your email below.');
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${redirectTo}`,
      },
    });

    setLoading(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }

    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
          ✉️
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Check your email</h2>
          <p className="mt-1.5 text-sm text-muted">
            We sent a sign-in link to{' '}
            <span className="font-medium text-white">{email}</span>.
            Click it to continue.
          </p>
        </div>
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={() => { setEmailSent(false); setEmail(''); }}
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button type="button" variant="secondary" size="lg" onClick={handleGoogle}>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmail} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" size="lg" loading={loading}>
          Proceed
        </Button>
      </form>

      <p className="text-center text-sm text-muted">
        Just want event alerts?{' '}
        <Link href="/subscribe" className="text-accent hover:underline">
          Subscribe here
        </Link>
      </p>
    </div>
  );
}
