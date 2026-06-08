import { NextResponse } from "next/server";
import { nationDecadePools } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    count: nationDecadePools.length,
    pools: nationDecadePools,
  });
}
