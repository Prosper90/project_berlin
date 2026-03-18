import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div>
            <span className="font-mono text-base font-bold text-white">
              BLOCKCHAIN<span className="text-accent">_</span>EVENTS
            </span>
            <p className="mt-1.5 max-w-xs text-xs text-muted">
              The definitive event board for Berlin&apos;s blockchain ecosystem.
            </p>
          </div>

          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-medium text-white">Platform</span>
              <Link href="/events" className="text-muted hover:text-accent">
                Events
              </Link>
              <Link
                href="/dashboard/events/new"
                className="text-muted hover:text-accent"
              >
                Post an Event
              </Link>
              <Link href="/subscribe" className="text-muted hover:text-accent">
                Event Alerts
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} Berlin Blockchain Events. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
