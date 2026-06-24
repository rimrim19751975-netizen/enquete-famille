import { NextRequest, NextResponse } from "next/server";
import { getClient, ensureDatabase } from "@/db";

async function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const decoded = Buffer.from(auth.replace("Basic ", ""), "base64").toString();
  const [u, p] = decoded.split(":");
  const result = await getClient().execute({
    sql: "SELECT id FROM admin_users WHERE username = ? AND password_hash = ?",
    args: [u, p],
  });
  return result.rows.length > 0;
}

export async function GET(req: NextRequest) {
  try {
    await ensureDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    const familles = await getClient().execute({
      sql: `SELECT * FROM familles ORDER BY submitted_at DESC LIMIT ? OFFSET ?`,
      args: [limit, offset],
    });

    const countResult = await getClient().execute("SELECT COUNT(*) as total FROM familles");
    const total = Number(countResult.rows[0]?.total || 0);

    const data = await Promise.all(
      familles.rows.map(async (f: any) => {
        const enfants = await getClient().execute({
          sql: "SELECT * FROM enfants WHERE famille_id = ? ORDER BY id",
          args: [f.id],
        });
        const enfantsData = await Promise.all(
          enfants.rows.map(async (e: any) => {
            const petits = await getClient().execute({
              sql: "SELECT * FROM petits_enfants WHERE enfant_id = ? ORDER BY id",
              args: [e.id],
            });
            return { ...e, petits_enfants: petits.rows };
          })
        );
        return { ...f, enfants: enfantsData };
      })
    );

    return NextResponse.json({ data, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
