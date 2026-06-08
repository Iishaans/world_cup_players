"use client";

import { useMemo, useState } from "react";
import type { GameState, PlayerWorldCupCard, Role } from "@/types";
import { getCard, getCards } from "@/lib/data";
import { computeTeamVector } from "@/lib/game";
import { useGameStore } from "@/store/gameStore";
import type { RerollKind } from "@/lib/game";
import { DraftRoundHeader } from "./SpinCard";
import { PlayerDraftCard } from "@/components/cards/PlayerDraftCard";
import { RoleAssignmentModal } from "./RoleAssignmentModal";
import { RosterBoard } from "./RosterBoard";
import { RerollControls } from "./RerollControls";
import { TeamVectorPreview } from "./TeamVectorPreview";

export function DraftView({ game }: { game: GameState }) {
  const select = useGameStore((s) => s.select);
  const reroll = useGameStore((s) => s.reroll);
  const [active, setActive] = useState<PlayerWorldCupCard | null>(null);

  const spin = game.currentSpin;
  const players = useMemo(
    () => (spin ? getCards(spin.eligiblePlayerCardIds) : []),
    [spin],
  );

  const selectedCount = Object.keys(game.roster).length;
  const previewVector = useMemo(
    () => computeTeamVector(game.roster, getCard),
    [game.roster],
  );
  const fuzzy = !game.constraints.ratingsVisible;

  const onAssign = (role: Role) => {
    if (!active) return;
    select(active.id, role);
    setActive(null);
  };

  const onReroll = (kind: RerollKind) => reroll(kind);

  if (!spin) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <DraftRoundHeader
          round={game.round}
          total={game.totalRounds}
          mode={game.mode}
          spin={spin}
        />

        <RerollControls rerolls={game.rerolls} onReroll={onReroll} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {players.map((card) => (
            <PlayerDraftCard
              key={card.id}
              card={card}
              ratingsVisible={game.constraints.ratingsVisible}
              onClick={() => setActive(card)}
            />
          ))}
        </div>
        {players.length === 0 && (
          <div className="panel p-6 text-center text-sm text-slate-400">
            No eligible players left in this pool — try a reroll.
          </div>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="panel p-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-300">
            Roster
          </h2>
          <RosterBoard roster={game.roster} />
        </div>

        {selectedCount >= 3 && (
          <div className="panel p-4">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-300">
              Live team preview {fuzzy && <span className="text-[10px] text-slate-500">(approx.)</span>}
            </h2>
            <TeamVectorPreview vector={previewVector} fuzzy={fuzzy} />
          </div>
        )}
      </aside>

      {active && (
        <RoleAssignmentModal
          card={active}
          roster={game.roster}
          ratingsVisible={game.constraints.ratingsVisible}
          onAssign={onAssign}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
