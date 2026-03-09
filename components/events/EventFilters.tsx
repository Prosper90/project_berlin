'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { EventType } from '@/types';

const EVENT_TYPE_OPTIONS = [
  { value: 'conference', label: 'Conference' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'summit', label: 'Summit' },
  { value: 'panel', label: 'Panel' },
  { value: 'networking', label: 'Networking' },
  { value: 'other', label: 'Other' },
];

export default function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/events?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push('/events');
  };

  const hasFilters = Array.from(searchParams.keys()).some((k) => k !== 'page');

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Filter Events</h2>
        {hasFilters && (
          <Button size="sm" variant="ghost" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Input
          label="Search"
          placeholder="Event name, company..."
          defaultValue={searchParams.get('search') ?? ''}
          onChange={(e) => updateFilter('search', e.target.value)}
        />

        <Input
          label="Company"
          placeholder="Hosting company"
          defaultValue={searchParams.get('hosting_company') ?? ''}
          onChange={(e) => updateFilter('hosting_company', e.target.value)}
        />

        <Select
          label="Event Type"
          placeholder="All types"
          options={EVENT_TYPE_OPTIONS}
          value={searchParams.get('event_type') ?? ''}
          onChange={(e) => updateFilter('event_type', e.target.value as EventType)}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="From"
            type="date"
            defaultValue={searchParams.get('date_from') ?? ''}
            onChange={(e) => updateFilter('date_from', e.target.value)}
          />
          <Input
            label="To"
            type="date"
            defaultValue={searchParams.get('date_to') ?? ''}
            onChange={(e) => updateFilter('date_to', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
