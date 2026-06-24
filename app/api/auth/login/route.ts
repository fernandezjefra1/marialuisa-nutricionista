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

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const admin = adminClient();
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error: rateCheckError } = await admin
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .eq("event_type", "login_failed")
    .gte("created_at", windowStart);

  if (rateCheckError) {
    console.error("[rate-limit] Error consultando audit_logs:", rateCheckError.message);
  }

  const dbCount = rateCheckError ? null : (count ?? 0);
  const failedCount = dbCount !== null ? Math.max(dbCount, getMemCount(ip)) : getMemCount(ip);

  if (failedCount >= MAX_ATTEMPTS) {
    const lockedUntil = Date.now() + LOCKOUT_MS;
    await admin.from("audit_logs").insert({
      event_type: "login_rate_limited",
      email: email ?? null,
      ip_address: ip,
      user_agent: userAgent,
      metadata: {},
    });
    return NextResponse.json(
      { ok: false, reason: "rate_limited", lockedUntil },
      { status: 429 }
    );
  }

  // Usar cliente anon sin cookies — la sesión se devuelve en el JSON y el
  // cliente browser la aplica con setSession(), evitando escribir cookies
  // en el Route Handler (no soportado en esta versión de Next.js).
  const supabase = anonClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    incrementMem(ip);
    const newCount = failedCount + 1;
    const attemptsLeft = MAX_ATTEMPTS - newCount;

    await admin.from("audit_logs").insert({
      event_type: "login_failed",
      email: email ?? null,
      ip_address: ip,
      user_agent: userAgent,
      metadata: {},
    });

    if (attemptsLeft <= 0) {
      const lockedUntil = Date.now() + LOCKOUT_MS;
      return NextResponse.json(
        { ok: false, reason: "rate_limited", lockedUntil },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { ok: false, reason: "invalid_credentials", attemptsLeft },
      { status: 401 }
    );
  }

  await admin.from("audit_logs").insert({
    event_type: "login_success",
    email: email ?? null,
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
}
