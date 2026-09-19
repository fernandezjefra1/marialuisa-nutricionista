export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  // ── 1. Validar variables de entorno ─────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    const missing = [
      !supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
      !anonKey     && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ].filter(Boolean);
    console.error("[login] Faltan variables de entorno:", missing);
    return NextResponse.json(
      { ok: false, reason: "missing_env", missing },
      { status: 500 }
    );
  }

  // ── 2. Parsear body ──────────────────────────────────────────────────────────
  let email: string;
  let password: string;
  try {
    const body = await request.json();
    email    = body.email;
    password = body.password;
    if (!email || !password) throw new Error("missing fields");
  } catch {
    return NextResponse.json({ ok: false, reason: "bad_request" }, { status: 400 });
  }

  // ── 3. Autenticar ────────────────────────────────────────────────────────────
  // Cliente anon sin cookies; la sesión vuelve en JSON y el browser la aplica
  // con setSession() para no necesitar escribir cookies en el Route Handler.
  try {
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return NextResponse.json(
        { ok: false, reason: "invalid_credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[login] Error inesperado:", message);
    return NextResponse.json(
      {
        ok: false,
        reason: "server_error",
        // Solo exponer el mensaje real en desarrollo para poder depurar
        ...(process.env.NODE_ENV !== "production" && { debug: message }),
      },
      { status: 500 }
    );
  }
}
