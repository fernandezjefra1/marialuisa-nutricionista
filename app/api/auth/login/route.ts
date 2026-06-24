export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

const memAttempts = new Map<string, { count: number; windowStart: number }>();

function getMemCount(ip: string): number {
  const entry = memAttempts.get(ip);
  if (!entry || Date.now() - entry.windowStart > WINDOW_MS) return 0;
  return entry.count;
}

function incrementMem(ip: string): void {
  const now = Date.now();
  const entry = memAttempts.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    memAttempts.set(ip, { count: 1, windowStart: now });
  } else {
    entry.count++;
  }
}

export async function POST(request: NextRequest) {
  // ── 1. Validar variables de entorno ─────────────────────────────────────────
  const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey        = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    const missing = [
      !supabaseUrl    && "NEXT_PUBLIC_SUPABASE_URL",
      !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
      !anonKey        && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
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

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  // ── 3. Lógica principal ──────────────────────────────────────────────────────
  try {
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

    const { count, error: rateCheckError } = await admin
      .from("audit_logs")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("event_type", "login_failed")
      .gte("created_at", windowStart);

    if (rateCheckError) {
      // La tabla puede no existir o RLS bloquea — degradamos a solo memoria
      console.error("[rate-limit] audit_logs no disponible:", rateCheckError.message);
    }

    const dbCount    = rateCheckError ? null : (count ?? 0);
    const failedCount = dbCount !== null ? Math.max(dbCount, getMemCount(ip)) : getMemCount(ip);

    if (failedCount >= MAX_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCKOUT_MS;
      await admin.from("audit_logs").insert({
        event_type: "login_rate_limited",
        email,
        ip_address: ip,
        user_agent: userAgent,
        metadata: {},
      });
      return NextResponse.json({ ok: false, reason: "rate_limited", lockedUntil }, { status: 429 });
    }

    // Autenticar — cliente anon sin cookies; la sesión vuelve en JSON y el
    // browser la aplica con setSession() para no necesitar escribir cookies
    // en el Route Handler (no soportado en esta versión de Next.js).
    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      incrementMem(ip);
      const attemptsLeft = MAX_ATTEMPTS - (failedCount + 1);

      await admin.from("audit_logs").insert({
        event_type: "login_failed",
        email,
        ip_address: ip,
        user_agent: userAgent,
        metadata: {},
      });

      if (attemptsLeft <= 0) {
        const lockedUntil = Date.now() + LOCKOUT_MS;
        return NextResponse.json({ ok: false, reason: "rate_limited", lockedUntil }, { status: 429 });
      }

      return NextResponse.json({ ok: false, reason: "invalid_credentials", attemptsLeft }, { status: 401 });
    }

    await admin.from("audit_logs").insert({
      event_type: "login_success",
      email,
      user_id: data.user?.id ?? null,
      ip_address: ip,
      user_agent: userAgent,
      metadata: {},
    });

    return NextResponse.json({
      ok: true,
      session: {
        access_token: data.session!.access_token,
        refresh_token: data.session!.refresh_token,
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
