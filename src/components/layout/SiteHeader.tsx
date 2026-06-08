import Link from "next/link";

const NAV = [
  { href: "/play", label: "Play" },
  { href: "/daily", label: "Daily" },
  { href: "/cards", label: "Cards" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold text-base font-black text-ink-950">
            5s
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            World Cup <span className="text-gold">5s</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 font-medium text-slate-300 transition hover:bg-ink-800/70 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
