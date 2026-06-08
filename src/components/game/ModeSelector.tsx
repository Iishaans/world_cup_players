"use client";

import { useRouter } from "next/navigation";
import type { GameMode } from "@/types";
import { useGameStore } from "@/store/gameStore";

const MODES: {
  mode: GameMode;
  title: string;
  blurb: string;
  primary?: boolean;
}[] = [
  {
    mode: "daily",
    title: "Play Daily",
    blurb: "One shared seed for everyone, every day. Build a shareable run.",
    primary: true,
  },
  {
    mode: "classic",
    title: "Classic Game",
    blurb: "Ratings, traits and the full eligible pool visible. Rerolls on.",
  },
  {
    mode: "knowledge",
    title: "Knowledge Mode",
    blurb: "Ratings hidden until full time. Trust your football memory.",
  },
  {
    mode: "hardcore",
    title: "Hardcore Mode",
    blurb: "No repeat nations or decades. Ratings hidden. One reroll only.",
  },
];

export function ModeSelector() {
  const router = useRouter();
  const startGame = useGameStore((s) => s.startGame);

  const start = (mode: GameMode) => {
    startGame(mode);
    router.push("/play");
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {MODES.map((m) => (
        <button
          key={m.mode}
          type="button"
          onClick={() => start(m.mode)}
          className={
            "panel group flex flex-col items-start gap-1 p-5 text-left transition hover:-translate-y-0.5 hover:border-gold/60 " +
            (m.primary ? "ring-1 ring-gold/40" : "")
          }
        >
          <div className="flex w-full items-center justify-between">
            <span className="font-display text-lg font-bold text-white">{m.title}</span>
            <span className="text-gold opacity-0 transition group-hover:opacity-100">→</span>
          </div>
          <span className="text-sm text-slate-400">{m.blurb}</span>
        </button>
      ))}
    </div>
  );
}
