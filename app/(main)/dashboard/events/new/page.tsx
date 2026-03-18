import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EventForm from "@/components/events/EventForm";

export const metadata: Metadata = { title: "Post New Event" };

export default async function NewEventPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/dashboard/events/new");

  const { data: profile } = await supabase
    .from("profiles")
    .select("company")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-white">Post a New Event</h1>
      <div className="rounded-xl border border-border bg-card p-8 text-white">
        <EventForm defaultCompany={profile?.company ?? undefined} />
      </div>
    </div>
  );
}
