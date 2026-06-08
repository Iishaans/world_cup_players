"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useHydrated } from "@/lib/useHydrated";
import { dailySeed } from "@/lib/game";

interface DailyEntry {
  id: string;
  date: string;
  seed: string;
  wins: number;
  losses: number;
  champion: boolean;
  score: number;
  createdAt: string;
}

export default function LeaderboardPage() {
  const leaderboard = useGameStore((s) => s.leaderboard);
  const hydrated = useHydrated();
  const [globalDaily, setGlobalDaily] = useState<DailyEntry[]>([]);
  const [globalLoading, setGlobalLoading] = useState(true);
  const today = dailySeed();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/leaderboard/daily?date=${today}`);
        if (!res.ok) return;
        const data = (await res.json()) as { entries: DailyEntry[] };
        if (!cancelled) setGlobalDaily(data.entries ?? []);
      } finally {
        if (!cancelled) setGlobalLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [today]);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-black text-white">Leaderboard</h1>
        <p className="text-sm text-slate-400">
          Global daily scores and your best local runs.
        </p>
      </div>

      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-white">Today&apos;s daily</h2>
          <span className="text-xs text-slate-500">{today}</span>
        </div>
        {globalLoading ? (
          <div className="panel p-6 text-center text-slate-500">Loading global scores…</div>
        ) : globalDaily.length === 0 ? (
          <div className="panel p-6 text-center text-sm text-slate-400">
            No global scores yet today.{" "}
            <Link href="/daily" className="text-gold hover:underline">
              Play the daily
            </Link>
          </div>
        ) : (
          <LeaderboardTable entries={globalDaily} />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-white">Your best runs</h2>
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
          <LeaderboardTable entries={leaderboard.map((row) => ({
            id: row.id,
            date: row.date,
            seed: row.seed,
            wins: row.wins,
            losses: row.losses,
            champion: row.champion,
            score: row.score,
            createdAt: row.date,
          }))} linkToResults />
        )}
      </section>
    </div>
  );
}

function LeaderboardTable({
  entries,
  linkToResults = false,
}: {
  entries: DailyEntry[];
  linkToResults?: boolean;
}) {
  return (
    <div className="panel divide-y divide-ink-700/60">
      {entries.map((row, i) => {
        const inner = (
          <>
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-800 text-sm font-bold text-slate-300">
                {i + 1}
              </span>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  {row.wins}-{row.losses}
                  {row.champion && <span className="text-gold">🏆</span>}
                </div>
                <div className="text-[11px] text-slate-500">
                  {new Date(row.createdAt).toLocaleString()} · {row.seed}
                </div>
              </div>
            </div>
            <div className="font-display text-lg font-bold tabular-nums text-gold">
              {row.score.toLocaleString()}
            </div>
          </>
        );

        if (linkToResults) {
          return (
            <Link
              key={row.id}
              href={`/results/${row.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-ink-800/40"
            >
              {inner}
            </Link>
          );
        }

        return (
          <div
            key={row.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
