import { NextResponse } from "next/server";
import { applyReroll, type RerollKind } from "@/lib/game";
import { loadGame, saveGame } from "@/lib/server/store";

const VALID: RerollKind[] = ["nation", "decade", "fullSpin"];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const game = loadGame(id);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  const kind: RerollKind = body?.kind;
  if (!VALID.includes(kind)) {
    return NextResponse.json({ error: "Invalid reroll kind" }, { status: 400 });
  }
  const next = applyReroll(game, kind);
  if (next === game) {
    return NextResponse.json(
      { error: "Reroll unavailable (none left or no candidates)" },
      { status: 409 },
    );
  }
  saveGame(next);
  return NextResponse.json({ game: next });
}
