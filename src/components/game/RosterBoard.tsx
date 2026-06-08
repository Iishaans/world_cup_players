"use client";

import type { Roster } from "@/types";
import { ROLES } from "@/types";
import { getCard, nationFlag, nationName } from "@/lib/data";
import { ROLE_META } from "@/lib/ui";

export function RosterBoard({ roster }: { roster: Roster }) {
  return (
    <div className="space-y-2">
      {ROLES.map((role) => {
        const sel = roster[role];
        const card = sel ? getCard(sel.playerCardId) : undefined;
        return (
          <div
            key={role}
            className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/50 px-3 py-2"
          >
            <span
              className="grid h-9 w-11 shrink-0 place-items-center rounded-md text-[11px] font-bold"
              style={{
                backgroundColor: ROLE_META[role].accent + "22",
                color: ROLE_META[role].accent,
              }}
            >
              {ROLE_META[role].abbr}
            </span>
            {card ? (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-white">
                  {card.shortName ?? card.name}
                </div>
                <div className="truncate text-[11px] text-slate-400">
                  <span aria-hidden>{nationFlag(card.nation)}</span>{" "}
                  {nationName(card.nation)} · {card.decade}
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500">{ROLE_META[role].label} — empty</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
