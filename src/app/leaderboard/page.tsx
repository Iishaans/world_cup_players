"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { useHydrated } from "@/lib/useHydrated";

export default function LeaderboardPage() {
  const leaderboard = useGameStore((s) => s.leaderboard);
  const hydrated = useHydrated();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-3xl font-black text-white">Leaderboard</h1>
        <p className="text-sm text-slate-400">
          Your best runs on this device, ranked by score.
        </p>
      </div>

      {!hydrated ? (
        <div className="panel p-8 text-center text-slate-500">Loading…</div>
      ) : leaderboard.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-slate-400">No runs yet.</p>
          <Link href="/" className="btn-primary mt-4 inline-flex">
            Play your first game
          </Link>
        </div>
      ) : (
        <div className="panel divide-y divide-ink-700/60">
          {leaderboard.map((row, i) => (
            <Link
              key={row.id}
              href={`/results/${row.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-ink-800/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-800 text-sm font-bold text-slate-300">
                  {i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    {row.wins}-{row.losses}
                    {row.champion && <span className="text-gold">🏆</span>}
                    <span className="pill capitalize">{row.mode}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(row.date).toLocaleDateString()} · seed {row.seed}
                  </div>
                </div>
              </div>
              <div className="font-display text-lg font-bold tabular-nums text-gold">
                {row.score.toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
