"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import MultiSelect from "@/components/ui/MultiSelect";
import Button from "@/components/ui/Button";
import { EventFormData, EventType } from "@/types";

const BLANK_FORM: EventFormData = {
  title: "",
  description: "",
  event_date: "",
  start_time: "",
  end_time: "",
  venue_name: "",
  venue_address: "",
  city: "Berlin",
  hosting_company: "",
  event_type: undefined,
  tags: [],
  website_url: "",
  registration_url: "",
  cover_image_url: "",
};

const EVENT_TYPE_OPTIONS = [
  { value: "conference", label: "Conference" },
  { value: "meetup", label: "Meetup" },
  { value: "hackathon", label: "Hackathon" },
  { value: "workshop", label: "Workshop" },
  { value: "summit", label: "Summit" },
  { value: "panel", label: "Panel" },
  { value: "networking", label: "Networking" },
  { value: "other", label: "Other" },
];

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  eventId?: string;
  defaultCompany?: string;
}

export default function EventForm({ initialData, eventId, defaultCompany }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") ?? "",
  );

  const [form, setForm] = useState<EventFormData>({
    ...BLANK_FORM,
    hosting_company: defaultCompany ?? '',
    ...initialData,
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialData?.event_types ?? (initialData?.event_type ? [initialData.event_type] : [])
  );

  const set = (key: keyof EventFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || successId) return; // prevent double-submit
    setLoading(true);
    setError("");

    const payload: EventFormData = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      event_types: selectedTypes as EventType[],
      event_type: selectedTypes[0] as EventType | undefined,
    };

    const url = eventId ? `/api/events/${eventId}` : "/api/events";
    const method = eventId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (res.status === 401) {
        window.location.href = `/login?redirectTo=${eventId ? `/dashboard/events/${eventId}/edit` : "/dashboard/events/new"}`;
        return;
      }
      setError(data.error || "Something went wrong");
      return;
    }

    if (eventId) {
      // Edit flow: full reload to avoid router race condition
      window.location.href = `/events/${data.data.id}`;
    } else {
      // Create flow: show success, reset form
      setSuccessId(data.data.id);
      setForm({ ...BLANK_FORM });
      setTagsInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {successId && (
        <div className="rounded-md border border-accent/30 bg-accent/10 px-4 py-4 text-sm">
          <p className="font-semibold text-accent">
            ✓ Your event has been registered successfully!
          </p>
          <p className="mt-1 text-muted">
            It is now live on the events board.
          </p>
          <div className="mt-3 flex gap-3">
            <Link
              href={`/events/${successId}`}
              className="font-medium text-accent hover:underline"
            >
              View event →
            </Link>
            <button
              type="button"
              className="text-muted hover:text-white"
              onClick={() => setSuccessId(null)}
            >
              Post another
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">
          Event Details
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Event Title"
            required
            placeholder="e.g. Web3 Berlin Meetup #42"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
          <Textarea
            label="Description"
            placeholder="What is this event about?"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          <MultiSelect
            label="Event Type"
            options={EVENT_TYPE_OPTIONS}
            values={selectedTypes}
            onChange={setSelectedTypes}
          />
          <Input
            label="Tags"
            placeholder="DeFi, NFT, Web3, Blockchain (comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            hint="Separate tags with commas"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">
          Date & Time
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Event Date"
            type="date"
            required
            value={form.event_date}
            onChange={(e) => set("event_date", e.target.value)}
          />
          <Input
            label="Start Time"
            type="time"
            value={form.start_time}
            onChange={(e) => set("start_time", e.target.value)}
          />
          <Input
            label="End Time"
            type="time"
            value={form.end_time}
            onChange={(e) => set("end_time", e.target.value)}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">
          Location
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Venue Name"
            placeholder="e.g. Factory Berlin"
            value={form.venue_name}
            onChange={(e) => set("venue_name", e.target.value)}
          />
          <Input
            label="Venue Address"
            placeholder="e.g. Rheinsberger Str. 76-77"
            value={form.venue_address}
            onChange={(e) => set("venue_address", e.target.value)}
          />
          <Input
            label="City"
            required
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">
          Organizer
        </h2>
        <Input
          label="Hosting Company"
          required
          placeholder="e.g. Ethereum Foundation"
          value={form.hosting_company}
          onChange={(e) => set("hosting_company", e.target.value)}
        />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">
          Links & Media
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Event Website"
            type="url"
            placeholder="https://..."
            value={form.website_url}
            onChange={(e) => set("website_url", e.target.value)}
          />
          <Input
            label="Registration URL"
            type="url"
            placeholder="https://lu.ma/..."
            value={form.registration_url}
            onChange={(e) => set("registration_url", e.target.value)}
          />
          <Input
            label="Cover Image URL"
            type="url"
            placeholder="https://..."
            value={form.cover_image_url}
            onChange={(e) => set("cover_image_url", e.target.value)}
          />
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {eventId ? "Save Changes" : "Publish Event"}
        </Button>
      </div>
    </form>
  );
}
