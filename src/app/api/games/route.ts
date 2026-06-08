import { NextResponse } from "next/server";
import type { GameMode } from "@/types";
import { createGame } from "@/lib/game";
import { saveGame } from "@/lib/server/store";

const VALID_MODES: GameMode[] = ["classic", "knowledge", "hardcore", "daily"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const mode: GameMode = VALID_MODES.includes(body?.mode) ? body.mode : "classic";
  const seed: string | undefined =
    typeof body?.seed === "string" ? body.seed : undefined;
  const game = saveGame(createGame(mode, seed));
  return NextResponse.json({ game }, { status: 201 });
}
