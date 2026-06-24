import { NextResponse } from "next/server";
import { ensureDatabase } from "@/db";

export async function GET() {
  try {
    await ensureDatabase();
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (e) {
    return NextResponse.json({ status: "error", message: String(e) }, { status: 500 });
  }
}
