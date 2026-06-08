"use client";

import { useEffect } from "react";
import type { PlayerWorldCupCard, Role, Roster } from "@/types";
import { ROLES } from "@/types";
import { getRoleFitMultiplier } from "@/lib/game";
import { ROLE_META, cn, ratingColor } from "@/lib/ui";
import { nationFlag, nationName } from "@/lib/data";

interface Props {
  card: PlayerWorldCupCard;
  roster: Roster;
  ratingsVisible: boolean;
  onAssign: (role: Role) => void;
  onClose: () => void;
}

export function RoleAssignmentModal({
  card,
  roster,
  ratingsVisible,
  onAssign,
  onClose,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Assign ${card.name} to a role`}
      onClick={onClose}
    >
      <div
        className="panel w-full max-w-md animate-pop-in p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Assign</div>
            <div className="font-display text-xl font-bold text-white">
              {card.shortName ?? card.name}
            </div>
            <div className="mt-0.5 text-xs text-slate-300">
              <span aria-hidden>{nationFlag(card.nation)}</span> {nationName(card.nation)} · {card.decade}
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-slate-400 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {ROLES.map((role) => {
            const fit = card.roleFit[role];
            const filled = Boolean(roster[role]);
            const mult = getRoleFitMultiplier(fit);
            return (
              <button
                key={role}
                type="button"
                disabled={filled}
                onClick={() => onAssign(role)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition",
                  filled
                    ? "cursor-not-allowed border-ink-700 bg-ink-900/40 opacity-50"
                    : "border-ink-600 bg-ink-800/60 hover:border-gold/60 hover:bg-ink-800",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid h-8 w-10 place-items-center rounded-md text-[11px] font-bold"
                    style={{ backgroundColor: ROLE_META[role].accent + "22", color: ROLE_META[role].accent }}
                  >
                    {ROLE_META[role].abbr}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white">{ROLE_META[role].label}</div>
                    <div className="text-[11px] text-slate-400">
                      {filled ? "Already filled" : ROLE_META[role].blurb}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {ratingsVisible ? (
                    <div className="text-right">
                      <div className="text-sm font-bold tabular-nums" style={{ color: ratingColor(fit) }}>
                        {fit}
                      </div>
                      <div className="stat-label">×{mult.toFixed(2)}</div>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-slate-500">—</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-500">
          Role fit applies a performance multiplier. Choose wisely — you can&apos;t swap later.
        </p>
      </div>
    </div>
  );
}
