import { NextResponse } from "next/server";
import { choices } from "@/db/choices";

export async function GET() {
  return NextResponse.json(choices);
}
