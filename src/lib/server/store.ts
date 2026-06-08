import type { GameState } from "@/types";

/**
 * Simple in-memory persistence so the API works out of the box without a
 * database. Swap this module for Prisma/Postgres in production — the route
 * handlers only depend on these functions.
 */

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

declare global {
  var __wc5sGames: Map<string, GameState> | undefined;
  var __wc5sDaily: DailyEntry[] | undefined;
}

const games: Map<string, GameState> =
  globalThis.__wc5sGames ?? (globalThis.__wc5sGames = new Map());
const daily: DailyEntry[] = globalThis.__wc5sDaily ?? (globalThis.__wc5sDaily = []);

export function saveGame(game: GameState): GameState {
  games.set(game.id, game);
  return game;
}

export function loadGame(id: string): GameState | undefined {
  return games.get(id);
}

export function recordDaily(game: GameState): void {
  if (!game.result || !game.seed.startsWith("daily-")) return;
  const date = game.seed.replace("daily-", "");
  daily.push({
    id: game.id,
    date,
    seed: game.seed,
    wins: game.result.record.wins,
    losses: game.result.record.losses,
    champion: game.result.champion,
    score: game.result.score,
    createdAt: new Date().toISOString(),
  });
}

export function dailyLeaderboard(date: string, limit = 50): DailyEntry[] {
  return daily
    .filter((d) => d.date === date)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
