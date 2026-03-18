import type { Metadata } from 'next';
import SubscribeForm from '@/components/auth/SubscribeForm';

export const metadata: Metadata = { title: 'Create an Event Alert' };

export default function SubscribePage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Create an event alert</h1>
        <p className="mt-1 text-sm text-muted">
          Get notified when new blockchain events pop up in Berlin.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8">
        <SubscribeForm />
      </div>
    </div>
  );
}
