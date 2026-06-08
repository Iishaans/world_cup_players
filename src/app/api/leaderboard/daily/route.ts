import { NextResponse } from "next/server";
import { dailySeed } from "@/lib/game";
import { dailyLeaderboard, submitDailyEntry } from "@/lib/server/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? dailySeed();
  const entries = await dailyLeaderboard(date);
  return NextResponse.json({ date, entries });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      date?: string;
      gameId?: string;
      wins?: number;
      losses?: number;
      champion?: boolean;
      score?: number;
      rosterHash?: string;
      userId?: string;
    };

    const date = body.date ?? dailySeed();
    const gameId = body.gameId;
    const wins = body.wins;
    const losses = body.losses;
    const champion = body.champion;
    const score = body.score;

    if (
      !gameId ||
      typeof wins !== "number" ||
      typeof losses !== "number" ||
      typeof champion !== "boolean" ||
      typeof score !== "number"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const entry = await submitDailyEntry({
      date,
      gameId,
      wins,
      losses,
      champion,
      score,
      rosterHash: body.rosterHash,
      userId: body.userId,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit score" }, { status: 500 });
  }
}
