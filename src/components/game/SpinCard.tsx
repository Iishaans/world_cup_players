"use client";

import type { DraftSpin, GameMode } from "@/types";
import { nationFlag, nationName } from "@/lib/data";

const MODE_LABEL: Record<GameMode, string> = {
  classic: "Classic",
  knowledge: "Knowledge",
  hardcore: "Hardcore",
  daily: "Daily",
};

export function DraftRoundHeader({
  round,
  total,
  mode,
  spin,
}: {
  round: number;
  total: number;
  mode: GameMode;
  spin: DraftSpin;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700/70 px-5 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="pill border-gold/40 text-gold-soft">
            Round {round} of {total}
          </span>
          <span className="pill">{MODE_LABEL[mode]} mode</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 px-5 py-6 text-center">
        <div className="text-5xl" aria-hidden>
          {nationFlag(spin.nation)}
        </div>
        <div className="font-display text-3xl font-black tracking-tight text-white">
          {nationName(spin.nation)} — {spin.decade}
        </div>
        <div className="pill border-ink-600 text-slate-300">
          Eligible World Cups: {spin.eligibleWorldCups.join(", ")}
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Pick one player and lock them into a five-a-side role.
        </p>
      </div>
    </div>
  );
}
