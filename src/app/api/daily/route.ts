import { NextResponse } from "next/server";
import { createGame, dailySeed } from "@/lib/game";
import { saveGame } from "@/lib/server/store";

export async function GET() {
  const game = saveGame(createGame("daily"));
  return NextResponse.json({ date: dailySeed(), seed: game.seed, game });
}
