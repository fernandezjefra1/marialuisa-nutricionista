import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { event_type, email, user_id, metadata } = body;

  // Extraer IP del cliente (Vercel / proxies pasan x-forwarded-for)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const user_agent = request.headers.get("user-agent") ?? "unknown";

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

  const { error } = await supabase.from("audit_logs").insert({
    event_type,
    email: email ?? null,
    user_id: user_id ?? null,
    ip_address: ip,
    user_agent,
    metadata: metadata ?? {},
  });

  if (error) {
    // Silencioso en producción — no exponer detalles al cliente
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
