import { NextResponse } from "next/server";
import { runSimulation } from "@/lib/game";
import { loadGame, saveGame, submitDailyEntry } from "@/lib/server/store";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const game = loadGame(id);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  if (game.status === "drafting") {
    return NextResponse.json(
      { error: "Draft is not complete" },
      { status: 409 },
    );
  }
  const next = runSimulation(game);
  saveGame(next);
  if (next.mode === "daily" && next.result) {
    const date = next.seed.replace("daily-", "");
    await submitDailyEntry({
      date,
      gameId: next.id,
      wins: next.result.record.wins,
      losses: next.result.record.losses,
      champion: next.result.champion,
      score: next.result.score,
    });
  }
  return NextResponse.json({ game: next });
}
