import Link from "next/link";
import { ModeSelector } from "@/components/game/ModeSelector";
import { ROLE_META } from "@/lib/ui";
import { ROLES } from "@/types";
import { allCards, nationDecadePools, opponents } from "@/lib/data";

const EXAMPLE = [
  { role: "keeper", name: "Neuer", info: "🇩🇪 2010s" },
  { role: "stopper", name: "Cannavaro", info: "🇮🇹 2000s" },
  { role: "controller", name: "Modrić", info: "🇭🇷 2010s" },
  { role: "carrier", name: "Maradona", info: "🇦🇷 1980s" },
  { role: "finisher", name: "Ronaldo", info: "🇧🇷 1990s" },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 pt-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="pill border-gold/40 text-gold-soft">Historical 5-a-side draft</span>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight text-white sm:text-5xl">
            Draft five World Cup legends.
            <br />
            Build the perfect five-a-side.
            <br />
            <span className="text-gold">Go 7-0 and lift the trophy.</span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            Every round spins a random <strong>nation + World Cup decade</strong>. Pick one
            eligible player, assign them a role, and simulate a seven-match tournament.
            Role balance, chemistry and tournament aura matter more than raw overall.
          </p>
          <div className="mt-6">
            <ModeSelector />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="pill">{allCards().length} player cards</span>
            <span className="pill">{nationDecadePools.length} nation-decade pools</span>
            <span className="pill">{opponents.length} opponent archetypes</span>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-ink-700/70 bg-gradient-to-b from-gold/15 to-transparent px-5 py-3">
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Example share card
            </div>
            <div className="font-display text-lg font-bold text-white">7-0 · Champions 🏆</div>
          </div>
          <div className="space-y-2 p-5">
            {EXAMPLE.map((row) => {
              const role = row.role;
              return (
                <div
                  key={role}
                  className="flex items-center justify-between rounded-lg border border-ink-700 bg-ink-900/50 px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid h-7 w-9 place-items-center rounded-md text-[10px] font-bold"
                      style={{
                        backgroundColor: ROLE_META[role].accent + "22",
                        color: ROLE_META[role].accent,
                      }}
                    >
                      {ROLE_META[role].abbr}
                    </span>
                    <span className="text-sm font-semibold text-white">{row.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{row.info}</span>
                </div>
              );
            })}
            <div className="flex gap-2 pt-1 text-xs text-slate-400">
              <span className="pill">Aura 99</span>
              <span className="pill">Chemistry 62</span>
              <span className="pill">Weakness: Low pressing</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-bold text-white">How it plays</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "1. Spin & draft",
              d: "Five rounds, each a random nation + World Cup decade. Pick one eligible legend per round.",
            },
            {
              t: "2. Assign roles",
              d: "Every player must fill a unique role. Role fit applies a performance multiplier — Messi can't play Stopper.",
            },
            {
              t: "3. Simulate 7 matches",
              d: "Group stage to final against historical archetypes. Win all seven to be crowned champions.",
            },
          ].map((c) => (
            <div key={c.t} className="panel p-5">
              <div className="font-display text-lg font-bold text-gold">{c.t}</div>
              <p className="mt-1.5 text-sm text-slate-400">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl font-bold text-white">The five roles</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ROLES.map((role) => (
            <div key={role} className="panel p-4">
              <span
                className="grid h-9 w-11 place-items-center rounded-md text-[11px] font-bold"
                style={{
                  backgroundColor: ROLE_META[role].accent + "22",
                  color: ROLE_META[role].accent,
                }}
              >
                {ROLE_META[role].abbr}
              </span>
              <div className="mt-2 font-semibold text-white">{ROLE_META[role].label}</div>
              <div className="text-xs text-slate-400">{ROLE_META[role].blurb}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/cards" className="btn-ghost">
            Browse the player card database →
          </Link>
        </div>
      </section>
    </div>
  );
}
