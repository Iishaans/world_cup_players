import { NextResponse } from "next/server";
import { ROLES, type Role } from "@/types";
import { selectPlayer } from "@/lib/game";
import { loadGame, saveGame } from "@/lib/server/store";

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
  const cardId: string = body?.cardId;
  const role: Role = body?.role;
  if (!cardId || !ROLES.includes(role)) {
    return NextResponse.json(
      { error: "cardId and a valid role are required" },
      { status: 400 },
    );
  }
  const next = selectPlayer(game, cardId, role);
  if (next === game) {
    return NextResponse.json(
      { error: "Selection rejected (role filled, ineligible card, or not drafting)" },
      { status: 409 },
    );
  }
  saveGame(next);
  return NextResponse.json({ game: next });
}
