import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import Button from "@/components/ui/Button";
import { Event } from "@/types";
import NetworkBackground from "@/components/external/NetworkBackground";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: upcomingEvents }, { data: { user } }] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(4),
    supabase.auth.getUser(),
  ]);

  const postEventUrl = user ? "/dashboard/events/new" : "/signup";

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section
          className="network-bg relative border-b border-border px-4 py-20 sm:px-6 sm:py-28"
          style={{ isolation: "isolate" }}
        >
          <NetworkBackground />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
              Berlin &bull; Blockchain &bull; Web3
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              The event board for
              <br />
              <span className="text-accent">Berlin&apos;s</span> blockchain
              scene.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted">
              Discover conferences, meetups, hackathons, and networking events.
              Stay plugged into the Berlin ecosystem — all in one place.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/events">
                <Button size="lg">Browse Events</Button>
              </Link>
              <Link href={postEventUrl}>
                <Button size="lg" variant="secondary">
                  Post an Event
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming events preview */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
              <Link
                href="/events"
                className="text-sm text-accent hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event as Event} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border-t border-border bg-card px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-white">Hosting an event?</h2>
            <p className="mt-2 text-muted">
              List your blockchain event and reach the entire Berlin Web3
              community.
            </p>
            <Link href={postEventUrl} className="mt-6 inline-block">
              <Button size="lg">{user ? "Post an Event" : "Get Started — It's Free"}</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
