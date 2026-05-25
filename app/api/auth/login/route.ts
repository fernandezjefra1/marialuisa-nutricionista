import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

  // Verificar intentos fallidos recientes por IP en la base de datos
  const { count } = await admin
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", ip)
    .eq("event_type", "login_failed")
    .gte("created_at", windowStart);

  const failedCount = count ?? 0;

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

  // Autenticar con Supabase — el cliente SSR gestiona las cookies de sesión
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
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

  // Verificar si requiere MFA
  const { data: aalData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (
    aalData?.nextLevel === "aal2" &&
    aalData?.currentLevel !== "aal2"
  ) {
    const { data: factorsData } = await supabase.auth.mfa.listFactors();
    const totpFactor = factorsData?.totp?.[0];

    if (totpFactor) {
      const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId: totpFactor.id });

      if (challengeError) {
        return NextResponse.json(
          { ok: false, reason: "mfa_error" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        ok: true,
        requiresMfa: true,
        factorId: totpFactor.id,
        challengeId: challengeData.id,
      });
    }
  }

  await admin.from("audit_logs").insert({
    event_type: "login_success",
    email: email ?? null,
    user_id: data.user?.id ?? null,
    ip_address: ip,
    user_agent: userAgent,
    metadata: {},
  });

  return NextResponse.json({ ok: true, requiresMfa: false });
}
