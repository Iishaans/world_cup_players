import type { GameState } from "@/types";
import { hasDatabase, prisma } from "@/lib/db/prisma";

/**
 * Hybrid persistence: in-memory by default, PostgreSQL when DATABASE_URL is set.
 */

export interface DailyEntry {
  id: string;
  date: string;
  seed: string;
  wins: number;
  losses: number;
  champion: boolean;
  score: number;
  createdAt: string;
}

export interface SubmitDailyArgs {
  date: string;
  gameId: string;
  wins: number;
  losses: number;
  champion: boolean;
  score: number;
  rosterHash?: string;
  userId?: string;
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

function sortDaily(entries: DailyEntry[], limit: number): DailyEntry[] {
  return [...entries]
    .sort((a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt))
    .slice(0, limit);
}

export async function submitDailyEntry(args: SubmitDailyArgs): Promise<DailyEntry> {
  const createdAt = new Date().toISOString();
  const seed = `daily-${args.date}`;

  if (hasDatabase()) {
    const row = await prisma.dailyResult.create({
      data: {
        date: args.date,
        gameId: args.gameId,
        userId: args.userId,
        score: args.score,
        wins: args.wins,
        losses: args.losses,
        champion: args.champion,
        rosterHash: args.rosterHash ?? args.gameId,
      },
    });
    return {
      id: row.id,
      date: row.date,
      seed,
      wins: row.wins,
      losses: row.losses,
      champion: row.champion,
      score: row.score,
      createdAt: row.createdAt.toISOString(),
    };
  }

  const entry: DailyEntry = {
    id: args.gameId,
    date: args.date,
    seed,
    wins: args.wins,
    losses: args.losses,
    champion: args.champion,
    score: args.score,
    createdAt,
  };
  daily.push(entry);
  return entry;
}

export async function dailyLeaderboard(
  date: string,
  limit = 50,
): Promise<DailyEntry[]> {
  if (hasDatabase()) {
    const rows = await prisma.dailyResult.findMany({
      where: { date },
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      take: limit,
    });
    return rows.map((row) => ({
      id: row.id,
      date: row.date,
      seed: `daily-${row.date}`,
      wins: row.wins,
      losses: row.losses,
      champion: row.champion,
      score: row.score,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  return sortDaily(
    daily.filter((d) => d.date === date),
    limit,
  );
}

/** @deprecated Prefer submitDailyEntry — kept for API game simulate route */
export function dailyLeaderboardSync(date: string, limit = 50): DailyEntry[] {
  return sortDaily(
    daily.filter((d) => d.date === date),
    limit,
  );
}
