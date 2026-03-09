"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase.auth]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2 leading-tight">
            <img
              alt="Jobited bear"
              width="32"
              height="32"
              decoding="async"
              className="h-8 w-8 sm:h-10 sm:w-10"
              src="/jobited-bear.svg"
            />
            <span className="font-mono text-xs font-bold tracking-tight text-white sm:text-base whitespace-nowrap">
              BERLIN<span className="text-accent">_</span>BLOCKCHAIN
            </span>
          </Link>
          <span className="hidden text-[10px] text-muted sm:inline-block">
            powered by{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:underline"
              href="https://jobited.com"
            >
              Jobited
            </a>
          </span>
        </div>

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
                <Button size="sm">+ Post Event</Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
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
          <nav className="flex flex-col px-4 py-4 gap-1">
            <Link
              href="/events"
              className="rounded-md px-3 py-3 text-sm font-medium text-white hover:bg-surface hover:text-accent transition-colors"
            >
              Events
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-3 text-sm font-medium text-white hover:bg-surface hover:text-accent transition-colors"
              >
                Dashboard
              </Link>
            )}
            {user && (
              <Link
                href="/dashboard/events/new"
                className="rounded-md px-3 py-3 text-sm font-medium text-white hover:bg-surface hover:text-accent transition-colors"
              >
                + Post Event
              </Link>
            )}

            <div className="mt-3 border-t border-border pt-3 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="rounded-md px-3 py-3 text-left text-sm font-medium text-muted hover:bg-surface hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
