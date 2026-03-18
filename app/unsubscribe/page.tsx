'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function UnsubscribeHandler() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const email = searchParams.get('email');
    if (!email) {
      setStatus('error');
      return;
    }

    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then((res) => {
      setStatus(res.ok ? 'success' : 'error');
    }).catch(() => setStatus('error'));
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <p className="text-sm text-muted">Unsubscribing…</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-lg font-semibold text-white">Something went wrong</p>
        <p className="text-sm text-muted">
          We couldn&apos;t process your request. Please try again or{' '}
          <Link href="/subscribe" className="text-accent hover:underline">contact us</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-border/40 text-3xl">
        👋
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">You&apos;ve been unsubscribed</h2>
        <p className="mt-1.5 text-sm text-muted">
          You won&apos;t receive event alert emails anymore. You can resubscribe anytime.
        </p>
      </div>
      <Link href="/subscribe" className="text-sm text-accent hover:underline">
        Resubscribe →
      </Link>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-10 text-center">
        <Suspense fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
            <p className="text-sm text-muted">Loading…</p>
          </div>
        }>
          <UnsubscribeHandler />
        </Suspense>
      </div>
    </div>
  );
}
