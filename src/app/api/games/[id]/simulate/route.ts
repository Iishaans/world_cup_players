import { NextResponse } from "next/server";
import { runSimulation } from "@/lib/game";
import { loadGame, recordDaily, saveGame } from "@/lib/server/store";

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
  recordDaily(next);
  return NextResponse.json({ game: next });
}
