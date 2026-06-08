"use client";

import type { MatchResult } from "@/types";
import { STAGE_LABELS } from "@/types";
import { getOpponent, nationFlag } from "@/lib/data";
import { cn } from "@/lib/ui";

export function MatchResultCard({ match }: { match: MatchResult }) {
  const win = match.outcome === "win";
  const opp = getOpponent(match.opponentId);
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 transition animate-fade-up",
        win ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/40 bg-rose-500/10",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-14 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {STAGE_LABELS[match.stage]}
          </span>
          <span
            className={cn(
              "grid h-6 w-7 place-items-center rounded-md text-[11px] font-bold",
              win ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-200",
            )}
          >
            {win ? "W" : "L"}
          </span>
          <span className="text-sm text-slate-200">
            <span aria-hidden>{opp ? nationFlag(opp.nation) : ""}</span> {match.opponentName}
          </span>
        </div>
        <div className="text-right">
          <div className="font-display text-lg font-bold tabular-nums text-white">
            {match.userGoals}–{match.opponentGoals}
          </div>
          {match.wentToPenalties && match.penaltyResult && (
            <div className="text-[10px] text-slate-400">
              pens {match.penaltyResult.userPenalties}–{match.penaltyResult.opponentPenalties}
            </div>
          )}
          {match.wentToExtraTime && !match.wentToPenalties && (
            <div className="text-[10px] text-slate-400">a.e.t.</div>
          )}
        </div>
      </div>
      {match.notes.length > 0 && (
        <ul className="mt-2 space-y-0.5 border-t border-white/5 pt-2 text-[11px] text-slate-400">
          {match.notes.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
