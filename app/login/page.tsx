"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

type Paso = "email" | "codigo";

function enmascararEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.length > 3 ? user.slice(0, 3) : user.slice(0, 1);
  const oculto = "*".repeat(Math.max(user.length - visible.length, 3));
  return `${visible}${oculto}@${domain}`;
}

const ERRORES_ES: Record<string, string> = {
  "Email rate limit exceeded": "Demasiados intentos. Espera un momento antes de volver a intentar.",
  "Invalid OTP": "El código es incorrecto. Verifica e intenta de nuevo.",
  "Token has expired": "El código ha expirado. Solicita uno nuevo.",
  "Email not confirmed": "Tu correo no ha sido confirmado.",
  "User not found": "No se encontró una cuenta con este correo.",
  "Signup is disabled": "El registro está desactivado temporalmente.",
  "only one OTP": "Ya se envió un código recientemente. Espera antes de solicitar otro.",
};

function traducirError(msg: string): string {
  for (const [key, val] of Object.entries(ERRORES_ES)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return "Ocurrió un error. Intenta de nuevo.";
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [paso, setPaso] = useState<Paso>("email");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState<string[]>(Array(6).fill(""));
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const t = setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundosRestantes]);

  async function handleGoogleLogin() {
    setCargando(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError(traducirError(oauthError.message));
      setCargando(false);
    }
  }

  async function handleEnviarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setCargando(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { nombre_completo: nombre },
        shouldCreateUser: true,
        emailRedirectTo: undefined,
      },
    });

    if (otpError) {
      setError(traducirError(otpError.message));
      setCargando(false);
      return;
    }

    setCodigo(Array(6).fill(""));
    setSegundosRestantes(60);
    setPaso("codigo");
    setCargando(false);
    setTimeout(() => inputsRef.current[0]?.focus(), 100);
  }

  async function handleVerificarCodigo(e: React.FormEvent) {
    e.preventDefault();
    const token = codigo.join("");
    if (token.length !== 6) return;
    setError(null);
    setCargando(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (verifyError) {
      setError(traducirError(verifyError.message));
      setCargando(false);
      return;
    }

    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
    router.refresh();
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCodigo = [...codigo];
    newCodigo[index] = digit;
    setCodigo(newCodigo);
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      const newCodigo = [...codigo];
      newCodigo[index - 1] = "";
      setCodigo(newCodigo);
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handleDigitPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCodigo = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) newCodigo[i] = pasted[i];
    setCodigo(newCodigo);
    const nextFocus = Math.min(pasted.length, 5);
    inputsRef.current[nextFocus]?.focus();
  }

  async function handleReenviar() {
    if (!email) return;
    setError(null);
    setCargando(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { nombre_completo: nombre },
        shouldCreateUser: true,
        emailRedirectTo: undefined,
      },
    });

    if (otpError) {
      setError(traducirError(otpError.message));
    } else {
      setCodigo(Array(6).fill(""));
      setSegundosRestantes(60);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
    setCargando(false);
  }

  const codigoCompleto = codigo.join("").length === 6;

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center p-4">

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
            className="absolute text-[var(--verde-fuerte)] sparkle-item"
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
      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl shadow-green-100 overflow-hidden grid md:grid-cols-[1fr_1.1fr]">

        {/* ── PANEL IZQUIERDO ── */}
        <div className="px-8 md:px-10 py-10 md:py-12 flex flex-col gap-6 bg-white">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/iconoNutricion.png" alt="Logo" width={56} height={56} className="object-contain drop-shadow-sm" />
            <div>
              <p className="font-playfair font-bold text-[var(--verde-fuerte)] text-lg leading-tight">María Luisa</p>
              <p className="text-[10px] uppercase tracking-widest text-[#5a7255]">Nutricionista</p>
            </div>
          </Link>

          {/* ── PASO 1: Email ── */}
          {paso === "email" && (
            <>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--verde-fuerte)] leading-tight">
                  ¡Bienvenida{" "}
                  <span className="font-playfair italic text-[var(--primrose)]">de nuevo!</span>{" "}
                  <span className="text-[var(--primrose)]">♡</span>
                </h1>
                <p className="font-nunito mt-2 text-[#5a7255] text-sm leading-relaxed">
                  Inicia sesión o crea tu cuenta para reservar citas y acceder a tu contenido.
                </p>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={cargando}
                className="btn-coquette w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 py-3.5 rounded-2xl text-gray-700 font-medium transition duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.5 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-1.8 13.7-4.8l-6.3-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.5-2.6-11.3-6.3l-6.6 5.1C9.8 39.8 16.4 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.3 5.2C40.7 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
                Continuar con Google
              </button>

              <div className="relative flex items-center">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-xs text-[#8aa487] bg-white px-2 font-nunito">o con tu correo</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleEnviarCodigo} className="space-y-3">
                {/* Nombre */}
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa487]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre (opcional)"
                    className="font-nunito w-full bg-[#f5f0e8] border border-[#d4c8b0] pl-11 pr-4 py-3.5 rounded-2xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa487]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="font-nunito w-full bg-[#f5f0e8] border border-[#d4c8b0] pl-11 pr-4 py-3.5 rounded-2xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-nunito flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={cargando || !email}
                  className="btn-coquette w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-md shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.7a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {cargando ? "Enviando..." : "Enviar código por correo"}
                </button>
              </form>

              <Link href="/" className="text-sm text-[#5a7255] hover:text-[#31543d] transition font-nunito">
                ← Volver al inicio
              </Link>
            </>
          )}

          {/* ── PASO 2: Código OTP ── */}
          {paso === "codigo" && (
            <div className="flex flex-col gap-5">
              <div>
                <div className="w-14 h-14 rounded-full bg-[#f5f0e8] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-[var(--verde-fuerte)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-[var(--verde-fuerte)] leading-tight mb-2">
                  Revisa tu{" "}
                  <span className="font-playfair italic text-[var(--primrose)]">correo</span>
                </h1>
                <p className="font-nunito text-sm text-[#5a7255] leading-relaxed">
                  Enviamos un código de 6 dígitos a{" "}
                  <span className="font-semibold text-[var(--verde-fuerte)]">{enmascararEmail(email)}</span>.
                  Ingresa el código aquí abajo.
                </p>
              </div>

              <form onSubmit={handleVerificarCodigo} className="space-y-4">
                {/* 6 digit inputs */}
                <div className="flex gap-2 justify-center" onPaste={handleDigitPaste}>
                  {codigo.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputsRef.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(index, e)}
                      className="w-11 h-14 text-center text-xl font-bold bg-[#f5f0e8] border-2 border-[#d4c8b0] rounded-xl text-[var(--verde-fuerte)] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition caret-transparent"
                    />
                  ))}
                </div>

                {/* Countdown / reenviar */}
                <div className="text-center">
                  {segundosRestantes > 0 ? (
                    <p className="text-sm text-[#8aa487] font-nunito">
                      Puedes solicitar un nuevo código en{" "}
                      <span className="font-bold tabular-nums text-[var(--verde-fuerte)]">{segundosRestantes}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleReenviar}
                      disabled={cargando}
                      className="text-sm text-[var(--verde-fuerte)] hover:underline font-nunito font-medium disabled:opacity-50"
                    >
                      ¿No recibiste el código? Reenviar
                    </button>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-nunito flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={cargando || !codigoCompleto}
                  className="btn-coquette w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-md shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargando ? "Verificando..." : "Verificar código"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setPaso("email"); setError(null); setCodigo(Array(6).fill("")); }}
                className="text-sm text-[#5a7255] hover:text-[#31543d] transition font-nunito text-center"
              >
                ← Cambiar correo electrónico
              </button>
            </div>
          )}

        </div>

        {/* ── PANEL DERECHO: IMAGEN ── */}
        <div className="hidden md:flex flex-col relative bg-[#edf7e8] overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[var(--primrose)]/10 rounded-full" />
          <div className="absolute top-[30%] left-[-30px] w-24 h-24 bg-[#d4edcc] rounded-full" />

          <div className="flex-1 relative overflow-hidden">
            <Image
              src="/images/login-doctora.jpeg"
              alt="Nutricionista"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="bg-[#f5f0e8] px-8 py-5">
            <h2 className="font-playfair italic text-2xl text-[var(--verde-fuerte)] leading-snug">
              Pequeños cambios,
              <span className="font-semibold not-italic"> + grandes resultados </span>
              <span className="text-[var(--primrose)]">🌿 ♡</span>
            </h2>
            <div className="flex gap-5 mt-3">
              {[
                { icon: "🥗", label: "Alimentación", sub: "personalizada" },
                { icon: "♡",  label: "Bienestar",    sub: "integral" },
                { icon: "📅", label: "Citas",         sub: "fáciles y rápidas" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-sm shrink-0">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[var(--verde-fuerte)] font-nunito">{item.label}</p>
                    <p className="text-[10px] text-[#5a7255] font-nunito">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <p className="mt-5 text-sm text-[#5a7255] font-nunito">
        🌿 Tu salud es tu mejor inversión 🍓
      </p>
    </div>
  );
}
