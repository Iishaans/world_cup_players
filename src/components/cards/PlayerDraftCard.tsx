"use client";

import type { PlayerWorldCupCard, Role } from "@/types";
import { ROLES } from "@/types";
import { nationFlag, nationName } from "@/lib/data";
import { ROLE_META, cn, overallTier } from "@/lib/ui";
import { PlayerRatingBars } from "./PlayerRatingBars";
import { TraitPills } from "./TraitPills";

interface Props {
  card: PlayerWorldCupCard;
  ratingsVisible: boolean;
  selected?: boolean;
  onClick?: () => void;
}

function bestRoles(card: PlayerWorldCupCard): { role: Role; fit: number }[] {
  return ROLES.map((role) => ({ role, fit: card.roleFit[role] }))
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 2);
}

export function PlayerDraftCard({ card, ratingsVisible, selected, onClick }: Props) {
  const positions = [card.primaryPosition, ...card.secondaryPositions].join(" / ");
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "panel group flex w-full flex-col gap-3 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-gold/50 animate-pop-in",
        selected && "ring-2 ring-gold",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-display text-base font-bold text-white">
            {card.shortName ?? card.name}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-300">
            <span aria-hidden>{nationFlag(card.nation)}</span>
            <span className="truncate">
              {nationName(card.nation)} · {card.decade}
            </span>
          </div>
        </div>
        {ratingsVisible ? (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold font-display text-lg font-black text-ink-950">
            {card.ratings.overall}
          </div>
        ) : (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-ink-600 bg-ink-800 text-sm font-bold text-slate-300">
            ?
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="pill">{positions}</span>
        <span className="pill">WC {card.worldCups.join(", ")}</span>
        {!ratingsVisible && (
          <span className="pill text-slate-400">{overallTier(card.ratings.overall)}</span>
        )}
      </div>

      {ratingsVisible && <PlayerRatingBars card={card} compact />}

      {ratingsVisible && (
        <div className="flex flex-wrap gap-1.5">
          {bestRoles(card).map(({ role, fit }) => (
            <span
              key={role}
              className="inline-flex items-center gap-1 rounded-md border border-ink-600 bg-ink-800/70 px-2 py-0.5 text-[10px] font-semibold"
              style={{ color: ROLE_META[role].accent }}
            >
              {ROLE_META[role].label} {fit}
            </span>
          ))}
        </div>
      )}

      <TraitPills traits={card.traits} max={ratingsVisible ? 4 : 3} />

      <div className="mt-auto pt-1 text-center text-xs font-semibold text-gold opacity-0 transition group-hover:opacity-100">
        Select player →
      </div>
    </button>
  );
}
