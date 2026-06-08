import { NextResponse } from "next/server";
import { allCards } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nation = searchParams.get("nation");
  const decade = searchParams.get("decade");
  let cards = allCards();
  if (nation) cards = cards.filter((c) => c.nation === nation);
  if (decade) cards = cards.filter((c) => c.decade === decade);
  return NextResponse.json({ count: cards.length, cards });
}
