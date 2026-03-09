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
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirectTo = searchParams.get('redirectTo') || '/events';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsUnconfirmed(false);
    setResendSuccess(false);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (authError) {
      if (authError.message.toLowerCase().includes('email not confirmed')) {
        setIsUnconfirmed(true);
        setError('Your email address has not been confirmed yet.');
      } else {
        setError(authError.message);
      }
      return;
    }

    window.location.href = redirectTo;
  };

  const handleResend = async () => {
    setResendLoading(true);
    await supabase.auth.resend({ type: 'signup', email });
    setResendLoading(false);
    setResendSuccess(true);
  };

  const handleGoogle = async () => {
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback?next=${redirectTo}` },
    });
    if (oauthError) {
      setError('Google sign-in is currently unavailable. Please use email/password or check that Google OAuth is enabled in your Supabase project.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <p>{error}</p>
          {isUnconfirmed && (
            <div className="mt-2">
              {resendSuccess ? (
                <p className="text-accent">Confirmation email resent — check your inbox.</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="font-medium text-accent hover:underline disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend confirmation email →'}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <Button type="button" variant="secondary" onClick={handleGoogle}>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Input
        label="Email"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        required
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit" size="lg" loading={loading}>
        Sign In
      </Button>

      <p className="text-center text-sm text-muted">
        No account yet?{' '}
        <Link href="/signup" className="text-accent hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
