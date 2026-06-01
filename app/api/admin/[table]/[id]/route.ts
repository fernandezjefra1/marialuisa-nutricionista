import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_TABLES = [
  "compras",
  "pedidos",
  "reservas_taller",
  "solicitudes_empresariales",
  "productos",
  "admin_emails",
];

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return false;

  const admin = serviceClient();
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user?.email) return false;

  const { data } = await admin
    .from("admin_emails")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();

  return !!data;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> | { table: string; id: string } }
) {
  const { table, id } = await Promise.resolve(params);
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
  }

  const ok = await verifyAdmin(req);
  if (!ok) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const updates = await req.json();
  const admin = serviceClient();
  const { error } = await admin.from(table).update(updates).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> | { table: string; id: string } }
) {
  const { table, id } = await Promise.resolve(params);
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
  }

  const ok = await verifyAdmin(req);
  if (!ok) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const admin = serviceClient();
  const { error } = await admin.from(table).delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
