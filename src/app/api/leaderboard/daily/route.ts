import { NextResponse } from "next/server";
import { dailySeed } from "@/lib/game";
import { dailyLeaderboard } from "@/lib/server/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? dailySeed();
  return NextResponse.json({ date, entries: dailyLeaderboard(date) });
}
