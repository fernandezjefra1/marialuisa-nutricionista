import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { event_type, email, user_id, metadata } = body;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const user_agent = request.headers.get("user-agent") ?? "unknown";

  // Service role key: bypasses RLS para escritura segura de logs
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await supabase.from("audit_logs").insert({
    event_type,
    email: email ?? null,
    user_id: user_id ?? null,
    ip_address: ip,
    user_agent,
    metadata: metadata ?? {},
  });

  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
