"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { useEffect, useState, useRef } from "react";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    setProfileOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const userInitial = user?.email?.[0].toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 leading-tight">
          <img
            alt="Brandenburg Gate"
            width="36"
            height="36"
            decoding="async"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded object-cover"
            src="/berlin_brnenburger.jpg"
          />
          <span className="font-mono text-xs font-bold tracking-tight text-white sm:text-base whitespace-nowrap">
            BLOCKCHAIN<span className="text-accent">_</span>EVENTS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/events" className="text-sm text-white transition-colors hover:text-accent">
            Events
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm text-white transition-colors hover:text-accent">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/dashboard/events/new">
                <Button size="sm">+ Post an Event</Button>
              </Link>
              {/* Profile dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent hover:bg-accent/30 transition-colors"
                  aria-label="Profile menu"
                >
                  {userInitial}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-10 w-48 rounded-lg border border-border bg-card shadow-xl z-50">
                    <div className="border-b border-border px-3 py-2">
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-sm text-white hover:bg-surface hover:text-accent transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="block px-3 py-2 text-sm text-white hover:bg-surface hover:text-accent transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full px-3 py-2 text-left text-sm text-muted hover:bg-surface hover:text-white transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/subscribe">
                <Button size="sm" variant="ghost">Create an event alert</Button>
              </Link>
              <Link href="/login?redirectTo=/dashboard/events/new">
                <Button size="sm">Post an Event</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden flex-col items-center justify-center gap-1.5 p-2 text-white"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            <Link
              href="/events"
              className="rounded-md px-3 py-3 text-sm font-medium text-white hover:bg-surface hover:text-accent transition-colors"
            >
              Events
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-3 text-sm font-medium text-white hover:bg-surface hover:text-accent transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/events/new"
                  className="rounded-md px-3 py-3 text-sm font-medium text-white hover:bg-surface hover:text-accent transition-colors"
                >
                  + Post an Event
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="rounded-md px-3 py-3 text-sm font-medium text-white hover:bg-surface hover:text-accent transition-colors"
                >
                  Settings
                </Link>
                <div className="mt-3 border-t border-border pt-3">
                  <p className="px-3 pb-1 text-xs text-muted truncate">{user.email}</p>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-md px-3 py-3 text-left text-sm font-medium text-muted hover:bg-surface hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <Link href="/subscribe">
                  <Button type="button" variant="ghost" className="w-full justify-start">
                    Create an event alert
                  </Button>
                </Link>
                <Link href="/login?redirectTo=/dashboard/events/new">
                  <Button className="w-full">Post an Event</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
