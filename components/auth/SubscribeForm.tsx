'use client';

import { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SubscribeForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    company: '',
    email: '',
    gdpr_consent: false,
  });

  const set = (key: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.gdpr_consent) {
      setError('Please accept the privacy policy to subscribe.');
      return;
    }
    setLoading(true);
    setError('');

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.');
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
          🔔
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">You&apos;re subscribed!</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            You are now subscribed to event alerts. You will get emails when exciting blockchain events pop up in Berlin.
          </p>
          <p className="mt-3 text-xs text-muted">
            Remember that you can{' '}
            <Link href="/unsubscribe" className="text-accent hover:underline">
              unsubscribe anytime
            </Link>
            .
          </p>
        </div>
        <Link href="/events" className="text-sm text-accent hover:underline">
          Browse events →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First Name"
          required
          placeholder="Ada"
          value={form.first_name}
          onChange={(e) => set('first_name', e.target.value)}
        />
        <Input
          label="Last Name"
          required
          placeholder="Lovelace"
          value={form.last_name}
          onChange={(e) => set('last_name', e.target.value)}
        />
      </div>

      <Input
        label="Company"
        placeholder="Your organisation (optional)"
        value={form.company}
        onChange={(e) => set('company', e.target.value)}
      />

      <Input
        label="Email"
        type="email"
        required
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
      />

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 rounded border-border bg-surface accent-accent"
          checked={form.gdpr_consent}
          onChange={(e) => set('gdpr_consent', e.target.checked)}
        />
        <span className="text-sm text-muted">
          I accept the{' '}
          <Link href="/privacy" className="text-accent underline-offset-2 hover:underline">
            Privacy Policy
          </Link>{' '}
          and consent to receiving event alert emails.{' '}
          <span className="text-red-400">*</span>
        </span>
      </label>

      <Button type="submit" size="lg" loading={loading} className="mt-1">
        Subscribe to event alerts
      </Button>

      <p className="text-center text-sm text-muted">
        Want to post events?{' '}
        <Link href="/login?redirectTo=/dashboard/events/new" className="text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
