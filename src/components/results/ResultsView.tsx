"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { GameState } from "@/types";
import { STAGE_LABELS } from "@/types";
import { getCard, nationFlag, nationName } from "@/lib/data";
import { VECTOR_FIELDS, ratingColor } from "@/lib/ui";
import { useGameStore } from "@/store/gameStore";
import { MatchResultCard } from "./MatchResultCard";
import { StrengthWeaknessPanel } from "./StrengthWeaknessPanel";
import { ShareCard } from "./ShareCard";

export function ResultsView({ game }: { game: GameState }) {
  const router = useRouter();
  const startGame = useGameStore((s) => s.startGame);
  const result = game.result;
  if (!result) return null;

  const finalMatch = result.matches[result.matches.length - 1];
  const mvp = result.mvpPlayerCardId ? getCard(result.mvpPlayerCardId) : undefined;

  const playAgain = () => {
    startGame(game.mode === "daily" ? "classic" : game.mode);
    router.push("/play");
  };

  return (
    <div className="space-y-6">
      <div className="panel overflow-hidden">
        <div
          className={
            "px-6 py-6 text-center " +
            (result.champion
              ? "bg-gradient-to-b from-gold/20 to-transparent"
              : "bg-gradient-to-b from-ink-800/60 to-transparent")
          }
        >
          <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
            World Cup 5s Result
          </div>
          <div className="mt-2 font-display text-5xl font-black text-white">
            {result.record.wins}-{result.record.losses}
            {result.champion && <span className="ml-3 text-gold">🏆</span>}
          </div>
          <div className="mt-1 text-sm text-slate-300">
            {result.champion
              ? "Champions of the world."
              : `Eliminated in the ${result.eliminatedStage ? STAGE_LABELS[result.eliminatedStage] : "tournament"}.`}
          </div>
          {finalMatch && (
            <div className="mt-1 text-xs text-slate-400">
              {STAGE_LABELS[finalMatch.stage]}:{" "}
              {finalMatch.outcome === "win" ? "Beat" : "Lost to"}{" "}
              {finalMatch.opponentName} {finalMatch.userGoals}-{finalMatch.opponentGoals}
            </div>
          )}
          <div className="mt-3 inline-flex items-center gap-2">
            <span className="pill border-gold/40 text-gold-soft">Score {result.score.toLocaleString()}</span>
            <span className="pill capitalize">{game.mode} mode</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="panel p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-300">
              Match log
            </h2>
            <div className="space-y-2">
              {result.matches.map((m) => (
                <MatchResultCard key={m.stage} match={m} />
              ))}
            </div>
          </div>

          <StrengthWeaknessPanel
            strengths={result.strengths}
            weaknesses={result.weaknesses}
          />
        </div>

        <div className="space-y-6">
          <div className="panel p-5">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-300">
              Your XI… er, V
            </h2>
            <div className="mb-4 space-y-1.5">
              {result.matches.length > 0 &&
                (Object.keys(game.roster) as (keyof typeof game.roster)[]).map((role) => {
                  const sel = game.roster[role];
                  const card = sel ? getCard(sel.playerCardId) : undefined;
                  if (!card) return null;
                  const isMvp = card.id === result.mvpPlayerCardId;
                  return (
                    <div key={role} className="flex items-center justify-between text-sm">
                      <span className="text-slate-100">
                        <span aria-hidden>{nationFlag(card.nation)}</span>{" "}
                        {card.shortName ?? card.name}
                        {isMvp && <span className="ml-2 text-[10px] font-bold text-gold">MVP</span>}
                      </span>
                      <span className="text-xs capitalize text-slate-400">{role}</span>
                    </div>
                  );
                })}
            </div>

            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              Team ratings · Overall {result.teamVector.overall}
            </h3>
            <div className="space-y-1.5">
              {VECTOR_FIELDS.map(({ key, label }) => {
                const v = result.teamVector[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-28 shrink-0 text-[11px] text-slate-400">{label}</span>
                    <div className="rating-track h-2 flex-1 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${v}%`, backgroundColor: ratingColor(v) }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-semibold tabular-nums">{v}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {mvp && (
            <div className="panel flex items-center gap-3 p-4">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-gold font-display text-lg font-black text-ink-950">
                ★
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  Player of the tournament
                </div>
                <div className="font-display text-lg font-bold text-white">
                  {mvp.shortName ?? mvp.name}
                </div>
                <div className="text-xs text-slate-400">
                  {nationName(mvp.nation)} · {mvp.decade}
                </div>
              </div>
            </div>
          )}

          <ShareCard game={game} />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" className="btn-primary" onClick={playAgain}>
          Play again
        </button>
        <Link href="/leaderboard" className="btn-ghost">
          View leaderboard
        </Link>
        <Link href="/cards" className="btn-ghost">
          Browse cards
        </Link>
      </div>
    </div>
  );
}
