"use client";

import { use } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { useHydrated } from "@/lib/useHydrated";
import { ResultsView } from "@/components/results/ResultsView";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = use(params);
  const getGame = useGameStore((s) => s.getGame);
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="grid min-h-[40vh] place-items-center text-slate-500">Loading…</div>;
  }

  const game = getGame(gameId);
  if (!game || !game.result) {
    return (
      <div className="panel mx-auto max-w-md p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-white">Result not found</h2>
        <p className="mt-2 text-sm text-slate-400">
          This result isn&apos;t stored on this device.
        </p>
        <Link href="/" className="btn-primary mt-5 inline-flex">
          Start a new game
        </Link>
      </div>
    );
  }

  return <ResultsView game={game} />;
}
