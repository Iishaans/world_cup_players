"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { allCards, NATIONS, nationFlag, nationName } from "@/lib/data";
import { ALL_DECADES } from "@/lib/data";
import { PlayerRatingBars } from "@/components/cards/PlayerRatingBars";
import { TraitPills } from "@/components/cards/TraitPills";

export default function CardsPage() {
  const [query, setQuery] = useState("");
  const [nation, setNation] = useState("all");
  const [decade, setDecade] = useState("all");

  const cards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCards()
      .filter((c) => (nation === "all" ? true : c.nation === nation))
      .filter((c) => (decade === "all" ? true : c.decade === decade))
      .filter((c) =>
        q ? c.name.toLowerCase().includes(q) || nationName(c.nation).toLowerCase().includes(q) : true,
      )
      .sort((a, b) => b.ratings.overall - a.ratings.overall);
  }, [query, nation, decade]);

  const nationOptions = Object.values(NATIONS).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-black text-white">Player cards</h1>
        <p className="text-sm text-slate-400">
          {allCards().length} World Cup versions across nations and decades.
        </p>
      </div>

      <div className="panel flex flex-wrap items-center gap-2 p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players…"
          className="min-w-[180px] flex-1 rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-gold/60 focus:outline-none"
          aria-label="Search players"
        />
        <select
          value={nation}
          onChange={(e) => setNation(e.target.value)}
          className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-white focus:border-gold/60 focus:outline-none"
          aria-label="Filter by nation"
        >
          <option value="all">All nations</option>
          {nationOptions.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
        <select
          value={decade}
          onChange={(e) => setDecade(e.target.value)}
          className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-white focus:border-gold/60 focus:outline-none"
          aria-label="Filter by decade"
        >
          <option value="all">All decades</option>
          {ALL_DECADES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="text-xs text-slate-500">{cards.length} cards</div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/cards/${card.id}`}
            className="panel flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:border-gold/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-display text-base font-bold text-white">
                  {card.name}
                </div>
                <div className="text-xs text-slate-400">
                  <span aria-hidden>{nationFlag(card.nation)}</span>{" "}
                  {nationName(card.nation)} · {card.decade} ·{" "}
                  {card.primaryPosition}
                </div>
              </div>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold font-display text-base font-black text-ink-950">
                {card.ratings.overall}
              </div>
            </div>
            <PlayerRatingBars card={card} compact />
            <TraitPills traits={card.traits} max={3} />
          </Link>
        ))}
      </div>
      {cards.length === 0 && (
        <div className="panel p-8 text-center text-sm text-slate-400">
          No cards match your filters.
        </div>
      )}
    </div>
  );
}
