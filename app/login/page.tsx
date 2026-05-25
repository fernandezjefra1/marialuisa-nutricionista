"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { logEvent } from "@/lib/audit-log";

const MAX_ATTEMPTS = 5;

type Step = "credentials" | "mfa";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // ── Campos del formulario ──────────────────────────────────────────
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Estado general ─────────────────────────────────────────────────
  const [step, setStep]     = useState<Step>("credentials");
  const [error, setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Rate limiting ──────────────────────────────────────────────────
  const [locked, setLocked]           = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  // ── MFA ────────────────────────────────────────────────────────────
  const [totpCode, setTotpCode]     = useState("");
  const [factorId, setFactorId]     = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  // Cuenta regresiva del bloqueo
  useEffect(() => {
    if (!locked) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setLocked(false);
          setAttemptsLeft(MAX_ATTEMPTS);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [locked]);

  // ── Login con email/contraseña (rate limiting server-side) ───────────
  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.ok) {
      if (data.reason === "rate_limited") {
        setLocked(true);
        setSecondsLeft(
          Math.max(0, Math.ceil((data.lockedUntil - Date.now()) / 1000))
        );
        setError("Demasiados intentos fallidos. Cuenta bloqueada temporalmente.");
        setLoading(false);
        return;
      }
      if (data.reason === "invalid_credentials") {
        const left = data.attemptsLeft ?? 0;
        setAttemptsLeft(left);
        setError(
          left <= 2
            ? `Correo o contraseña incorrectos. Te quedan ${left} intento${left === 1 ? "" : "s"}.`
            : "Correo o contraseña incorrectos."
        );
        setLoading(false);
        return;
      }
      setError("Error inesperado. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    if (data.requiresMfa) {
      setFactorId(data.factorId);
      setChallengeId(data.challengeId);
      setStep("mfa");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  // ── Verificación del código TOTP ───────────────────────────────────
  const handleMfaVerify = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!factorId || !challengeId) return;
      setError(null);
      setLoading(true);

      const { data: verifyData, error: verifyError } =
        await supabase.auth.mfa.verify({
          factorId,
          challengeId,
          code: totpCode.replace(/\s/g, ""),
        });

      if (verifyError) {
        setError("Código incorrecto. Verifica tu aplicación de autenticación.");
        await logEvent("login_mfa_failed", { email });
        setLoading(false);
        return;
      }

      await logEvent("login_mfa_success", {
        email,
        userId: verifyData.user?.id,
      });
      router.push("/");
      router.refresh();
    },
    [factorId, challengeId, totpCode, email, router, supabase]
  );

  // ── Login con Google ───────────────────────────────────────────────
  async function handleGoogleLogin() {
    setLoading(true);
    await logEvent("login_google_initiated", { email: undefined });
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  // ── Utilidades UI ──────────────────────────────────────────────────
  const minutosRestantes = Math.ceil(secondsLeft / 60);

  return (
    <div className="min-h-screen bg-[#d4edcc] flex flex-col items-center justify-center p-4">

      {/* Brillitos decorativos */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[
          { char: "✦", top: "8%",  left: "2%",  size: "16px", delay: "0s",   dur: "3.5s" },
          { char: "♡", top: "20%", left: "95%", size: "14px", delay: "0.8s", dur: "4.5s" },
          { char: "✿", top: "70%", left: "1%",  size: "18px", delay: "1.5s", dur: "5s"   },
          { char: "✦", top: "85%", left: "94%", size: "12px", delay: "0.3s", dur: "4s"   },
          { char: "♡", top: "50%", left: "97%", size: "10px", delay: "2s",   dur: "3.8s" },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute text-[#C4607A] sparkle-item"
            style={{
              top: s.top, left: s.left, fontSize: s.size,
              ["--dur" as string]: s.dur, ["--delay" as string]: s.delay,
            }}
          >
            {s.char}
          </span>
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl shadow-green-200 overflow-hidden grid md:grid-cols-[1fr_1.1fr]">

        {/* ── PANEL IZQUIERDO ── */}
        <div className="px-10 py-12 flex flex-col justify-between bg-white">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Image src="/images/iconoNutricion.png" alt="Logo" width={60} height={60} className="object-contain drop-shadow-sm" />
            <div>
              <p className="font-playfair font-bold text-[#31543d] text-lg leading-tight">María Luisa</p>
              <p className="text-[10px] uppercase tracking-widest text-[#5a7255]">Nutricionista</p>
            </div>
          </Link>

          {/* ── PASO 1: Credenciales ── */}
          {step === "credentials" && (
            <>
              <div className="mb-7">
                <h1 className="text-4xl font-bold text-[#31543d] leading-tight">
                  ¡Bienvenida{" "}
                  <span className="font-playfair italic text-[#C4607A]">de nuevo!</span>{" "}
                  <span className="text-[#C4607A]">♡</span>
                </h1>
                <p className="font-nunito mt-3 text-[#5a7255] leading-relaxed text-sm">
                  Inicia sesión para reservar tu cita<br />
                  y continuar tu camino hacia tu bienestar.
                </p>
              </div>

              {/* Bloqueo por rate limit */}
              {locked && (
                <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div>
                    <p className="font-semibold">Cuenta bloqueada temporalmente</p>
                    <p className="mt-1">
                      Demasiados intentos fallidos. Podrás intentarlo de nuevo en{" "}
                      <span className="font-bold tabular-nums">
                        {minutosRestantes > 1 ? `${minutosRestantes} minutos` : `${secondsLeft} segundos`}
                      </span>.
                    </p>
                  </div>
                </div>
              )}

              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading || locked}
                className="btn-coquette w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 py-3.5 rounded-2xl text-gray-700 font-medium transition duration-300 shadow-sm mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.5 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-1.8 13.7-4.8l-6.3-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.5-2.6-11.3-6.3l-6.6 5.1C9.8 39.8 16.4 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.3 5.2C40.7 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                Continuar con Google
              </button>

              <div className="relative flex items-center mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-xs text-[#8aa487] bg-white px-2 font-nunito">o con correo</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                {/* Email */}
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa487]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    disabled={locked}
                    className="font-nunito w-full bg-[#f0f8ec] border border-[#C5DFC5] pl-11 pr-4 py-3.5 rounded-2xl text-[#31543d] outline-none focus:border-[#6daa6d] focus:ring-2 focus:ring-[#d4edcc] transition disabled:opacity-50"
                  />
                </div>

                {/* Contraseña */}
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa487]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    disabled={locked}
                    className="font-nunito w-full bg-[#f0f8ec] border border-[#C5DFC5] pl-11 pr-12 py-3.5 rounded-2xl text-[#31543d] outline-none focus:border-[#6daa6d] focus:ring-2 focus:ring-[#d4edcc] transition disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8aa487] hover:text-[#31543d] transition"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-nunito flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </p>
                )}

                {/* Indicador de intentos restantes */}
                {!locked && attemptsLeft <= 3 && attemptsLeft > 0 && (
                  <p className="text-amber-600 text-xs font-nunito">
                    ⚠️ Te quedan {attemptsLeft} intento{attemptsLeft === 1 ? "" : "s"} antes del bloqueo temporal.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || locked}
                  className="btn-coquette w-full bg-[#6daa6d] hover:bg-[#5a9a5a] text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-md shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
              </form>

              <div className="mt-6">
                <Link href="/" className="text-sm text-[#5a7255] hover:text-[#31543d] transition font-nunito">
                  ← Volver al inicio
                </Link>
              </div>

              <div className="mt-4 bg-[#f0f8ec] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image src="/images/iconoNutricion.png" alt="Logo" width={42} height={42} className="object-contain" />
                  <div>
                    <p className="text-xs text-[#5a7255] font-nunito">¿No tienes cuenta?</p>
                    <Link href="/registro" className="text-sm font-semibold text-[#C4607A] hover:underline font-nunito">
                      Crea tu cuenta y comienza hoy
                    </Link>
                  </div>
                </div>
                <Link
                  href="/registro"
                  className="w-9 h-9 rounded-full bg-[#C4607A] text-white flex items-center justify-center hover:bg-[#A84D65] transition text-sm font-bold"
                >
                  →
                </Link>
              </div>
            </>
          )}

          {/* ── PASO 2: Código MFA ── */}
          {step === "mfa" && (
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-7">
                <div className="w-14 h-14 rounded-full bg-[#f0f8ec] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[#31543d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-[#31543d] leading-tight mb-2">
                  Verificación{" "}
                  <span className="font-playfair italic text-[#C4607A]">en dos pasos</span>
                </h1>
                <p className="font-nunito text-sm text-[#5a7255] leading-relaxed">
                  Abre tu aplicación de autenticación (Google Authenticator, Authy, etc.)
                  e ingresa el código de 6 dígitos.
                </p>
              </div>

              <form onSubmit={handleMfaVerify} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="font-nunito w-full bg-[#f0f8ec] border border-[#C5DFC5] px-5 py-4 rounded-2xl text-[#31543d] text-center text-2xl tracking-[0.4em] outline-none focus:border-[#6daa6d] focus:ring-2 focus:ring-[#d4edcc] transition"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-nunito flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || totpCode.length !== 6}
                  className="btn-coquette w-full bg-[#6daa6d] hover:bg-[#5a9a5a] text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-md shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verificando..." : "Verificar código"}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep("credentials"); setError(null); setTotpCode(""); }}
                  className="w-full text-sm text-[#5a7255] hover:text-[#31543d] transition font-nunito text-center"
                >
                  ← Volver al inicio de sesión
                </button>
              </form>
            </div>
          )}

        </div>

        {/* ── PANEL DERECHO: IMAGEN ── */}
        <div className="hidden md:flex flex-col relative bg-[#edf7e8] overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#C4607A]/10 rounded-full" />
          <div className="absolute top-[30%] left-[-30px] w-24 h-24 bg-[#d4edcc] rounded-full" />

          <div className="flex-1 relative overflow-hidden">
            <Image
              src="/images/login-doctora.jpeg"
              alt="Nutricionista"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="bg-[#f4f8f4] px-8 py-5">
            <h2 className="font-playfair italic text-2xl text-[#31543d] leading-snug">
              Pequeños cambios,
              <span className="font-semibold text-[#6daa6d] not-italic"> + grandes resultados </span>
              <span className="text-[#C4607A]">🌿 ♡</span>
            </h2>
            <div className="flex gap-5 mt-3">
              {[
                { icon: "🥗", label: "Alimentación", sub: "personalizada" },
                { icon: "♡",  label: "Bienestar",    sub: "integral" },
                { icon: "📅", label: "Citas",         sub: "fáciles y rápidas" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#edf7e8] flex items-center justify-center text-sm shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#31543d] font-nunito">{item.label}</p>
                    <p className="text-[10px] text-[#5a7255] font-nunito">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <p className="mt-5 text-sm text-[#5a7255] font-nunito flex items-center gap-2">
        🌿 Tu salud es tu mejor inversión 🍓
      </p>
    </div>
  );
}
