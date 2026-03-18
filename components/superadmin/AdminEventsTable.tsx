'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Event } from '@/types';

interface AdminEventsTableProps {
  initialEvents: Event[];
  adminEmail: string;
}

export default function AdminEventsTable({ initialEvents, adminEmail }: AdminEventsTableProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setLoadingId(id);
    const res = await fetch(`/api/admin/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-email': adminEmail },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (res.ok) {
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...json.data } : e)));
    }
    setLoadingId(null);
  };

  const deleteEvent = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoadingId(id);
    const res = await fetch(`/api/admin/events/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-email': adminEmail },
    });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
    setLoadingId(null);
  };

  if (events.length === 0) {
    return <p className="text-sm text-muted">No events found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted">
            <th className="px-4 py-3 text-left">Event</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Organizer</th>
            <th className="px-4 py-3 text-center">Published</th>
            <th className="px-4 py-3 text-center">Featured</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {events.map((event) => {
            const busy = loadingId === event.id;
            return (
              <tr key={event.id} className="bg-card hover:bg-surface transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-white line-clamp-1 max-w-xs">{event.title}</p>
                  {event.event_type && (
                    <span className="text-xs text-muted">{event.event_type}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted whitespace-nowrap">
                  {event.event_date
                    ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className="px-4 py-3 text-muted">{event.hosting_company}</td>

                {/* Published toggle */}
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => patch(event.id, { is_published: !event.is_published })}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                      event.is_published
                        ? 'bg-accent/15 text-accent hover:bg-accent/25'
                        : 'bg-border/50 text-muted hover:bg-border hover:text-white'
                    }`}
                  >
                    {event.is_published ? '● Live' : '○ Hidden'}
                  </button>
                </td>

                {/* Featured toggle */}
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => patch(event.id, { is_featured: !event.is_featured })}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                      event.is_featured
                        ? 'bg-yellow-400/15 text-yellow-400 hover:bg-yellow-400/25'
                        : 'bg-border/50 text-muted hover:bg-border hover:text-white'
                    }`}
                  >
                    {event.is_featured ? '★ Yes' : '☆ No'}
                  </button>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/dashboard/events/${event.id}/edit`}
                      className="rounded px-2 py-1 text-xs text-muted hover:bg-surface hover:text-white transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => deleteEvent(event.id, event.title)}
                      className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
