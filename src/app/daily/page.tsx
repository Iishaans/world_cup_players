"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { dailySeed } from "@/lib/game";

export default function DailyPage() {
  const router = useRouter();
  const startGame = useGameStore((s) => s.startGame);
  const game = useGameStore((s) => s.game);

  useEffect(() => {
    const seed = `daily-${dailySeed()}`;
    // Resume today's daily if it's still in progress; otherwise start fresh.
    if (!(game?.mode === "daily" && game.seed === seed && game.status !== "complete")) {
      startGame("daily");
    }
    router.replace("/play");
  }, [game, startGame, router]);

  return (
    <div className="grid min-h-[40vh] place-items-center text-slate-400">
      Loading today&apos;s daily challenge…
    </div>
  );
}
