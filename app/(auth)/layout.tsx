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
              alt="Jobited bear"
              width="32"
              height="32"
              decoding="async"
              className="h-8 w-8"
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
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
