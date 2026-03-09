'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { EmailOtpType } from '@supabase/supabase-js';
import Link from 'next/link';

function ConfirmHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = searchParams.get('next') ?? '/events';

    if (!token_hash || !type) {
      setErrorMsg('Invalid confirmation link — missing parameters.');
      setStatus('error');
      return;
    }

    const supabase = createClient();
    supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
      if (error) {
        setErrorMsg(error.message);
        setStatus('error');
      } else {
        setStatus('success');
        router.replace(next);
      }
    });
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-sm text-muted">Confirming your email…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl">
          ✕
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Confirmation failed</p>
          <p className="mt-1 text-sm text-red-400">{errorMsg}</p>
        </div>
        <p className="text-xs text-muted">
          The link may have already been used or expired.
        </p>
        <Link href="/signup" className="text-sm text-accent hover:underline">
          Sign up again
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
        ✓
      </div>
      <p className="text-sm text-accent">Email confirmed! Redirecting…</p>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-sm text-muted">Loading…</p>
          </div>
        }
      >
        <ConfirmHandler />
      </Suspense>
    </div>
  );
}
