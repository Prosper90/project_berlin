'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function NotificationToggle({ initialOptIn }: { initialOptIn: boolean }) {
  const [optIn, setOptIn] = useState(initialOptIn);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !optIn }),
    });
    if (res.ok) setOptIn((prev) => !prev);
    setLoading(false);
  };

  return (
    <>
      <p className="mt-1 text-sm text-muted">
        {optIn
          ? 'You are subscribed to event alerts.'
          : 'You are not subscribed to event alerts.'}
      </p>
      <Button
        size="sm"
        variant="secondary"
        onClick={toggle}
        loading={loading}
        className="mt-3"
      >
        {optIn ? 'Unsubscribe' : 'Subscribe to alerts'}
      </Button>
    </>
  );
}
