"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameMode, GameState, Role } from "@/types";
import {
  applyReroll,
  createGame,
  dailySeed,
  runSimulation,
  selectPlayer,
  type RerollKind,
} from "@/lib/game";

async function submitDailyScore(game: GameState): Promise<void> {
  if (game.mode !== "daily" || !game.result) return;
  const date = game.seed.startsWith("daily-")
    ? game.seed.replace("daily-", "")
    : dailySeed();
  try {
    await fetch("/api/leaderboard/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        gameId: game.id,
        wins: game.result.record.wins,
        losses: game.result.record.losses,
        champion: game.result.champion,
        score: game.result.score,
      }),
    });
  } catch {
    // Leaderboard submission is best-effort; local results still persist.
  }
}

export interface CompletedSummary {
  id: string;
  mode: GameMode;
  seed: string;
  date: string;
  wins: number;
  losses: number;
  champion: boolean;
  score: number;
}

interface GameStore {
  game?: GameState;
  completed: Record<string, GameState>;
  leaderboard: CompletedSummary[];

  startGame: (mode: GameMode, seed?: string) => GameState;
  select: (cardId: string, role: Role) => void;
  reroll: (kind: RerollKind) => void;
  simulate: () => void;
  resetGame: () => void;
  getGame: (id: string) => GameState | undefined;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: undefined,
      completed: {},
      leaderboard: [],

      startGame: (mode, seed) => {
        const game = createGame(mode, seed);
        set({ game });
        return game;
      },

      select: (cardId, role) => {
        const current = get().game;
        if (!current) return;
        set({ game: selectPlayer(current, cardId, role) });
      },

      reroll: (kind) => {
        const current = get().game;
        if (!current) return;
        set({ game: applyReroll(current, kind) });
      },

      simulate: () => {
        const current = get().game;
        if (!current) return;
        const done = runSimulation(current);
        const summary: CompletedSummary = {
          id: done.id,
          mode: done.mode,
          seed: done.seed,
          date: done.updatedAt,
          wins: done.result?.record.wins ?? 0,
          losses: done.result?.record.losses ?? 0,
          champion: done.result?.champion ?? false,
          score: done.result?.score ?? 0,
        };
        set((s) => ({
          game: done,
          completed: { ...s.completed, [done.id]: done },
          leaderboard: [summary, ...s.leaderboard.filter((l) => l.id !== done.id)]
            .sort((a, b) => b.score - a.score)
            .slice(0, 50),
        }));
        void submitDailyScore(done);
      },

      resetGame: () => set({ game: undefined }),

      getGame: (id) => {
        const s = get();
        if (s.game?.id === id) return s.game;
        return s.completed[id];
      },
    }),
    {
      name: "wc5s-store",
      version: 1,
    },
  ),
);
