"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { useHydrated } from "@/lib/useHydrated";
import { DraftView } from "./DraftView";
import { SimulationScreen } from "./SimulationScreen";
import { ResultsView } from "@/components/results/ResultsView";

export function GameShell() {
  const game = useGameStore((s) => s.game);
  const simulate = useGameStore((s) => s.simulate);
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!game) {
    return (
      <div className="panel mx-auto max-w-md p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-white">No active game</h2>
        <p className="mt-2 text-sm text-slate-400">
          Start a new draft to begin building your five-a-side.
        </p>
        <Link href="/" className="btn-primary mt-5 inline-flex">
          Choose a mode
        </Link>
      </div>
    );
  }

  if (game.status === "drafting") return <DraftView game={game} />;

  if (game.status === "simulating") {
    return <SimulationScreen onDone={simulate} />;
  }

  return <ResultsView game={game} />;
}
