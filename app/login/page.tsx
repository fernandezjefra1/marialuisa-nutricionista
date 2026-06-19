"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

type Modo = "login" | "registro";
type PasoRegistro = "datos" | "codigo";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function enmascararEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.length > 3 ? user.slice(0, 3) : user.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(user.length - visible.length, 3))}@${domain}`;
}

function traducirError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials"))
    return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed"))
    return "Confirma tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Este correo ya está registrado. Inicia sesión.";
  if (m.includes("token has expired") || m.includes("otp expired") || m.includes("invalid otp"))
    return "Código incorrecto o expirado. Solicita uno nuevo.";
  if (m.includes("email rate limit") || m.includes("rate limit"))
    return "Demasiados intentos. Espera un momento antes de volver a intentar.";
  if (m.includes("password should be"))
    return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("signup is disabled"))
    return "El registro está desactivado temporalmente.";
  return "Ocurrió un error. Intenta de nuevo.";
}

interface RequisitosPassword {
  longitud: boolean;
  mayuscula: boolean;
  numero: boolean;
}

function validarPassword(pwd: string): RequisitosPassword {
  return {
    longitud: pwd.length >= 8,
    mayuscula: /[A-Z]/.test(pwd),
    numero: /[0-9]/.test(pwd),
  };
}

function fuerzaPassword(req: RequisitosPassword): number {
  return [req.longitud, req.mayuscula, req.numero].filter(Boolean).length;
}

// ─── Íconos SVG reutilizables ─────────────────────────────────────────────────

function IconoCorreo() {
  return (
    <svg className="w-4 h-4 text-[#8aa487]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function IconoLlave() {
  return (
    <svg className="w-4 h-4 text-[#8aa487]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function IconoPersona() {
  return (
    <svg className="w-4 h-4 text-[#8aa487]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function IconoOjoAbierto() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function IconoOjoCerrado() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function IconoError() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

// ─── Google SVG ───────────────────────────────────────────────────────────────

function SvgGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.5 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-1.8 13.7-4.8l-6.3-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.5-2.6-11.3-6.3l-6.6 5.1C9.8 39.8 16.4 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.3 5.2C40.7 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  );
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function InputIcono({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
      {children}
    </span>
  );
}

function CajaError({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex items-start gap-2 bg-[var(--primrose)]/10 border border-[var(--primrose)]/30 rounded-xl px-4 py-3 text-sm text-[var(--primrose)]">
      <IconoError />
      <span>{mensaje}</span>
    </div>
  );
}

function BotonOjo({ mostrar, onToggle }: { mostrar: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8aa487] hover:text-[var(--verde-fuerte)] transition"
      aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
    >
      {mostrar ? <IconoOjoCerrado /> : <IconoOjoAbierto />}
    </button>
  );
}

function BotonGoogle({ onClick, cargando }: { onClick: () => void; cargando: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={cargando}
      className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 bg-white hover:bg-gray-50 py-3 rounded-full text-gray-700 font-medium transition hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      <SvgGoogle />
      Continuar con Google
    </button>
  );
}

function Separador() {
  return (
    <div className="relative flex items-center">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="mx-3 text-xs text-[#8aa487] bg-white px-2 font-nunito">o</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ─── Barra de fuerza de contraseña ───────────────────────────────────────────

function BarraFuerza({ fuerza }: { fuerza: number }) {
  const colores = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-[var(--verde-fuerte)]"];
  const etiquetas = ["Muy débil", "Débil", "Aceptable", "Fuerte"];
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${fuerza >= n ? colores[fuerza - 1] ?? "bg-gray-200" : "bg-gray-200"}`}
          />
        ))}
      </div>
      {fuerza > 0 && (
        <p className="text-xs text-[#8aa487] font-nunito">{etiquetas[fuerza - 1]}</p>
      )}
    </div>
  );
}

// ─── Requisitos de contraseña ─────────────────────────────────────────────────

function RequisitosPassword({ req, visible }: { req: RequisitosPassword; visible: boolean }) {
  if (!visible) return null;
  const items = [
    { ok: req.longitud, texto: "Mínimo 8 caracteres" },
    { ok: req.mayuscula, texto: "Al menos una mayúscula" },
    { ok: req.numero, texto: "Al menos un número" },
  ];
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.texto} className={`flex items-center gap-2 text-xs font-nunito transition-colors ${item.ok ? "text-[var(--verde-fuerte)]" : "text-gray-400"}`}>
          <span className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${item.ok ? "bg-[var(--verde-fuerte)] text-white" : "bg-gray-200"}`}>
            {item.ok && <IconoCheck />}
          </span>
          {item.texto}
        </div>
      ))}
    </div>
  );
}

// ─── 6 inputs de código OTP ───────────────────────────────────────────────────

function InputsCodigo({
  codigo,
  inputsRef,
  onChange,
  onKeyDown,
  onPaste,
}: {
  codigo: string[];
  inputsRef: React.RefObject<Array<HTMLInputElement | null>>;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}) {
  return (
    <div className="flex gap-2 justify-center" onPaste={onPaste}>
      {codigo.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { if (inputsRef.current) inputsRef.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          className="w-12 h-14 text-center text-2xl font-bold bg-[#f5f0e8] border-2 border-[#d4c8b0] rounded-xl text-[var(--verde-fuerte)] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition caret-transparent"
        />
      ))}
    </div>
  );
}

// ─── PANEL DERECHO (imagen) ───────────────────────────────────────────────────

function PanelImagen() {
  return (
    <div className="hidden md:flex flex-col relative bg-[#edf7e8] overflow-hidden">
      <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[var(--primrose)]/10 rounded-full" />
      <div className="absolute top-[30%] left-[-30px] w-24 h-24 bg-[#d4edcc] rounded-full" />
      <div className="flex-1 relative overflow-hidden">
        <Image
          src="/images/login-doctora.jpeg"
          alt="Nutricionista María Luisa"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="bg-[#f5f0e8] px-8 py-5">
        <h2 className="font-playfair italic text-2xl text-[var(--verde-fuerte)] leading-snug">
          Pequeños cambios,
          <span className="font-semibold not-italic"> grandes resultados </span>
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
  );
}

// ─── COMPONENTE PRINCIPAL (con useSearchParams) ───────────────────────────────

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // ── Modo y paso ──
  const [modo, setModo] = useState<Modo>("login");
  const [pasoRegistro, setPasoRegistro] = useState<PasoRegistro>("datos");

  // ── Campos compartidos ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // ── Campos de registro ──
  const [nombre, setNombre] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarConfirm, setMostrarConfirm] = useState(false);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  // ── OTP ──
  const [codigo, setCodigo] = useState<string[]>(Array(6).fill(""));
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  // ── Estado general ──
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown reenvío
  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const t = setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundosRestantes]);

  function cambiarModo(m: Modo) {
    setModo(m);
    setPasoRegistro("datos");
    setError(null);
    setCodigo(Array(6).fill(""));
  }

  // ── Google ──────────────────────────────────────────────────────────────────
  async function handleGoogle() {
    setCargando(true);
    setError(null);
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (e) { setError(traducirError(e.message)); setCargando(false); }
  }

  // ── Login ────────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(traducirError(authError.message));
      setCargando(false);
      return;
    }

    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
    router.refresh();
  }

  // ── Registro — paso datos ────────────────────────────────────────────────────
  async function handleRegistro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const req = validarPassword(password);
    if (!req.longitud || !req.mayuscula || !req.numero) {
      setError("La contraseña no cumple los requisitos mínimos.");
      return;
    }
    if (!aceptoTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    setCargando(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre_completo: nombre },
        emailRedirectTo: undefined,
      },
    });

    if (signUpError) {
      setError(traducirError(signUpError.message));
      setCargando(false);
      return;
    }

    setCodigo(Array(6).fill(""));
    setSegundosRestantes(60);
    setPasoRegistro("codigo");
    setCargando(false);
    setTimeout(() => inputsRef.current[0]?.focus(), 100);
  }

  // ── Registro — verificar OTP ─────────────────────────────────────────────────
  async function handleVerificarCodigo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = codigo.join("");
    if (token.length !== 6) return;
    setError(null);
    setCargando(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
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

  // ── Reenviar código ──────────────────────────────────────────────────────────
  async function handleReenviar() {
    setError(null);
    setCargando(true);
    const { error: e } = await supabase.auth.resend({ type: "signup", email });
    if (e) {
      setError(traducirError(e.message));
    } else {
      setCodigo(Array(6).fill(""));
      setSegundosRestantes(60);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
    setCargando(false);
  }

  // ── Handlers inputs OTP ──────────────────────────────────────────────────────
  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...codigo];
    next[index] = digit;
    setCodigo(next);
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      const next = [...codigo];
      next[index - 1] = "";
      setCodigo(next);
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handleDigitPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setCodigo(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  // ── Derivados ────────────────────────────────────────────────────────────────
  const req = validarPassword(password);
  const fuerza = fuerzaPassword(req);
  const codigoCompleto = codigo.join("").length === 6;

  // ─────────────────────────────────────────────────────────────────────────────
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
            style={{ top: s.top, left: s.left, fontSize: s.size, ["--dur" as string]: s.dur, ["--delay" as string]: s.delay }}
          >
            {s.char}
          </span>
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl shadow-green-100 overflow-hidden grid md:grid-cols-[1fr_1.1fr]">

        {/* ── PANEL IZQUIERDO ── */}
        <div className="px-8 md:px-10 py-10 md:py-12 flex flex-col gap-5 bg-white overflow-y-auto max-h-screen">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/iconoNutricion.png" alt="Logo" width={52} height={52} className="object-contain drop-shadow-sm" />
            <div>
              <p className="font-playfair font-bold text-[var(--verde-fuerte)] text-lg leading-tight">María Luisa</p>
              <p className="text-[10px] uppercase tracking-widest text-[#5a7255]">Nutricionista</p>
            </div>
          </Link>

          {/* ── TABS ── */}
          <div className="flex bg-[#f5f0e8] rounded-full p-1 gap-1">
            {(["login", "registro"] as Modo[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => cambiarModo(m)}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all duration-200 font-nunito ${
                  modo === m
                    ? "bg-[var(--primrose)] text-white shadow-sm"
                    : "text-[#5a7255] hover:text-[var(--verde-fuerte)]"
                }`}
              >
                {m === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>

          {/* Google siempre visible */}
          <BotonGoogle onClick={handleGoogle} cargando={cargando} />
          <Separador />

          {/* ══════════════════════════════════════════════════════ */}
          {/* MODO LOGIN                                             */}
          {/* ══════════════════════════════════════════════════════ */}
          {modo === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              {/* Email */}
              <div className="relative">
                <InputIcono><IconoCorreo /></InputIcono>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="font-nunito w-full bg-[#f5f0e8] border-2 border-[#d4c8b0] pl-11 pr-4 py-3.5 rounded-xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                />
              </div>

              {/* Contraseña */}
              <div className="relative">
                <InputIcono><IconoLlave /></InputIcono>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="font-nunito w-full bg-[#f5f0e8] border-2 border-[#d4c8b0] pl-11 pr-12 py-3.5 rounded-xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                />
                <BotonOjo mostrar={mostrarPassword} onToggle={() => setMostrarPassword(!mostrarPassword)} />
              </div>

              <Link href="/recuperar-contrasena" className="text-xs text-[#8aa487] hover:text-[var(--verde-fuerte)] font-nunito transition -mt-2 text-right">
                ¿Olvidaste tu contraseña?
              </Link>

              {error && <CajaError mensaje={error} />}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white py-3.5 rounded-full font-semibold transition hover:scale-105 shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {cargando ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <p className="text-center text-sm text-[#8aa487] font-nunito">
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={() => cambiarModo("registro")} className="text-[var(--verde-fuerte)] font-semibold hover:underline">
                  Crea una
                </button>
              </p>
            </form>
          )}

          {/* ══════════════════════════════════════════════════════ */}
          {/* MODO REGISTRO — PASO DATOS                            */}
          {/* ══════════════════════════════════════════════════════ */}
          {modo === "registro" && pasoRegistro === "datos" && (
            <form onSubmit={handleRegistro} className="flex flex-col gap-3">

              {/* Nombre */}
              <div className="relative">
                <InputIcono><IconoPersona /></InputIcono>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre completo"
                  className="font-nunito w-full bg-[#f5f0e8] border-2 border-[#d4c8b0] pl-11 pr-4 py-3.5 rounded-xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <InputIcono><IconoCorreo /></InputIcono>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="font-nunito w-full bg-[#f5f0e8] border-2 border-[#d4c8b0] pl-11 pr-4 py-3.5 rounded-xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                />
              </div>

              {/* Contraseña + requisitos + barra */}
              <div className="space-y-2">
                <div className="relative">
                  <InputIcono><IconoLlave /></InputIcono>
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña (mín. 8 caracteres)"
                    className="font-nunito w-full bg-[#f5f0e8] border-2 border-[#d4c8b0] pl-11 pr-12 py-3.5 rounded-xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                  />
                  <BotonOjo mostrar={mostrarPassword} onToggle={() => setMostrarPassword(!mostrarPassword)} />
                </div>
                {password.length > 0 && (
                  <>
                    <BarraFuerza fuerza={fuerza} />
                    <RequisitosPassword req={req} visible={password.length > 0} />
                  </>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div className="relative">
                <InputIcono><IconoLlave /></InputIcono>
                <input
                  type={mostrarConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar contraseña"
                  className={`font-nunito w-full bg-[#f5f0e8] border-2 pl-11 pr-12 py-3.5 rounded-xl text-[#31543d] outline-none transition focus:ring-2 focus:ring-[#d4edcc] ${
                    confirmPassword && confirmPassword !== password
                      ? "border-[var(--primrose)] focus:border-[var(--primrose)]"
                      : confirmPassword && confirmPassword === password
                      ? "border-[var(--verde-fuerte)] focus:border-[var(--verde-fuerte)]"
                      : "border-[#d4c8b0] focus:border-[var(--verde-fuerte)]"
                  }`}
                />
                <BotonOjo mostrar={mostrarConfirm} onToggle={() => setMostrarConfirm(!mostrarConfirm)} />
              </div>

              {/* Checkbox términos */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acepto-terminos"
                  checked={aceptoTerminos}
                  onChange={(e) => setAceptoTerminos(e.target.checked)}
                  className="mt-0.5 w-5 h-5 flex-shrink-0 cursor-pointer accent-[var(--verde-fuerte)] rounded"
                />
                <label htmlFor="acepto-terminos" className="text-sm text-[#5a7255] font-nunito leading-relaxed cursor-pointer select-none">
                  Acepto los{" "}
                  <Link
                    href="/terminos"
                    target="_blank"
                    className="text-[var(--primrose)] underline hover:text-[var(--verde-fuerte)] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    términos y condiciones
                  </Link>
                  {" "}y la{" "}
                  <Link
                    href="/privacidad"
                    target="_blank"
                    className="text-[var(--primrose)] underline hover:text-[var(--verde-fuerte)] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    política de privacidad
                  </Link>
                </label>
              </div>

              {error && <CajaError mensaje={error} />}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white py-3.5 rounded-full font-semibold transition hover:scale-105 shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {cargando ? "Creando cuenta..." : "Crear cuenta"}
              </button>

              <p className="text-center text-sm text-[#8aa487] font-nunito">
                ¿Ya tienes cuenta?{" "}
                <button type="button" onClick={() => cambiarModo("login")} className="text-[var(--verde-fuerte)] font-semibold hover:underline">
                  Inicia sesión
                </button>
              </p>
            </form>
          )}

          {/* ══════════════════════════════════════════════════════ */}
          {/* MODO REGISTRO — PASO CÓDIGO OTP                       */}
          {/* ══════════════════════════════════════════════════════ */}
          {modo === "registro" && pasoRegistro === "codigo" && (
            <div className="flex flex-col gap-4">
              <div>
                <div className="w-14 h-14 rounded-full bg-[#f5f0e8] flex items-center justify-center mb-3">
                  <IconoCorreo />
                </div>
                <h2 className="text-2xl font-bold text-[var(--verde-fuerte)] mb-1">
                  Revisa tu{" "}
                  <span className="font-playfair italic text-[var(--primrose)]">correo</span>
                </h2>
                <p className="text-sm text-[#5a7255] font-nunito leading-relaxed">
                  Enviamos un código de 6 dígitos a{" "}
                  <span className="font-semibold text-[var(--verde-fuerte)]">{enmascararEmail(email)}</span>.
                </p>
              </div>

              <form onSubmit={handleVerificarCodigo} className="flex flex-col gap-4">
                <InputsCodigo
                  codigo={codigo}
                  inputsRef={inputsRef}
                  onChange={handleDigitChange}
                  onKeyDown={handleDigitKeyDown}
                  onPaste={handleDigitPaste}
                />

                <div className="text-center">
                  {segundosRestantes > 0 ? (
                    <p className="text-sm text-[#8aa487] font-nunito">
                      Reenviar en{" "}
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

                {error && <CajaError mensaje={error} />}

                <button
                  type="submit"
                  disabled={cargando || !codigoCompleto}
                  className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white py-3.5 rounded-full font-semibold transition hover:scale-105 shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {cargando ? "Verificando..." : "Verificar y crear cuenta"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => { setPasoRegistro("datos"); setError(null); setCodigo(Array(6).fill("")); }}
                className="text-sm text-[#5a7255] hover:text-[var(--verde-fuerte)] font-nunito transition text-center"
              >
                ← Cambiar correo electrónico
              </button>
            </div>
          )}

        </div>

        {/* PANEL DERECHO */}
        <PanelImagen />

      </div>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#5a7255] hover:text-[var(--verde-fuerte)] transition-colors duration-300 font-nunito"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver al inicio
        </Link>
      </div>

      <p className="mt-3 text-sm text-[#5a7255] font-nunito">
        🌿 Tu salud es tu mejor inversión 🍓
      </p>
    </div>
  );
}

// ─── Export con Suspense (evita error de prerender por useSearchParams) ────────

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--verde-fuerte)] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
