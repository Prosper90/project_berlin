import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm py-2 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              alt="Brandenburg Gate"
              width="32"
              height="32"
              decoding="async"
              className="h-8 w-8 rounded object-cover"
              src="/berlin_brnenburger.png"
            />
            <span className="font-mono text-xs font-bold tracking-tight text-white sm:text-base whitespace-nowrap">
              BLOCKCHAIN<span className="text-accent">_</span>EVENTS
            </span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
