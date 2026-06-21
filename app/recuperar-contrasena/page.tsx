"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type Paso = "email" | "codigo" | "password";

interface RequisitosPassword {
  longitud: boolean;
  mayuscula: boolean;
  numero: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function enmascararEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.length > 3 ? user.slice(0, 3) : user.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(user.length - visible.length, 3))}@${domain}`;
}

function traducirError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("user not found") || m.includes("unable to validate")) return "No existe una cuenta con ese correo.";
  if (m.includes("rate limit") || m.includes("email rate limit")) return "Demasiados intentos. Espera un momento e intenta luego.";
  if (m.includes("invalid token") || m.includes("token has expired") || m.includes("otp expired") || m.includes("invalid otp")) return "Código incorrecto o expirado. Solicita uno nuevo.";
  if (m.includes("password should be")) return "La contraseña debe tener al menos 8 caracteres.";
  if (m.includes("invalid email")) return "Correo no válido.";
  return "Algo salió mal. Intenta de nuevo.";
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

// ─── Íconos ───────────────────────────────────────────────────────────────────

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

function RequisitosPasswordUI({ req, visible }: { req: RequisitosPassword; visible: boolean }) {
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

function AvisoSpam() {
  return (
    <div className="bg-[#fff3e0] border-2 border-[#ff9800]/30 rounded-xl p-3 sm:p-4 my-2">
      <div className="flex items-start gap-2">
        <span className="text-xl flex-shrink-0">📬</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#e65100] mb-1">
            ¿No te llega el correo?
          </p>
          <ul className="text-xs text-[#b8551c] space-y-1 list-disc list-inside font-nunito">
            <li>Revisa tu carpeta de <strong>SPAM o Correo no deseado</strong>.</li>
            <li>Puede tardar hasta <strong>5 minutos</strong> en llegar.</li>
            <li>Verifica que tu correo esté bien escrito.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Logo reutilizable ────────────────────────────────────────────────────────

function LogoHeader() {
  return (
    <Link href="/" className="flex items-center gap-2 mb-6">
      <Image src="/images/logoNutricion.png" alt="Logo" width={52} height={52} className="object-contain drop-shadow-sm" />
      <div>
        <p className="font-playfair font-bold text-[var(--verde-fuerte)] text-lg leading-tight">María Luisa</p>
        <p className="text-[10px] uppercase tracking-widest text-[#5a7255]">Nutricionista</p>
      </div>
    </Link>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ mensaje }: { mensaje: string }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[var(--verde-fuerte)] text-white px-6 py-3 rounded-full shadow-lg font-nunito font-semibold text-sm animate-bounce">
      {mensaje}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

function RecuperarContent() {
  const router = useRouter();
  const supabase = createClient();

  const [paso, setPaso] = useState<Paso>("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState<string[]>(Array(6).fill(""));
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  useEffect(() => {
    if (segundosRestantes <= 0) return;
    const t = setTimeout(() => setSegundosRestantes((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [segundosRestantes]);

  // ── Paso 1: Enviar código ─────────────────────────────────────────────────

  async function handleEnviarCodigo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: undefined,
    });

    if (resetError) {
      setError(traducirError(resetError.message));
      setCargando(false);
      return;
    }

    setCodigo(Array(6).fill(""));
    setSegundosRestantes(60);
    setPaso("codigo");
    setCargando(false);
    setTimeout(() => inputsRef.current[0]?.focus(), 100);
  }

  // ── Paso 2: Verificar OTP ─────────────────────────────────────────────────

  async function handleVerificarCodigo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = codigo.join("");
    if (token.length !== 6) return;
    setError(null);
    setCargando(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });

    if (verifyError) {
      setError(traducirError(verifyError.message));
      setCargando(false);
      return;
    }

    setPaso("password");
    setCargando(false);
  }

  // ── Reenviar código ───────────────────────────────────────────────────────

  async function handleReenviar() {
    setError(null);
    setCargando(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: undefined,
    });

    if (resetError) {
      setError(traducirError(resetError.message));
    } else {
      setCodigo(Array(6).fill(""));
      setSegundosRestantes(60);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
    setCargando(false);
  }

  // ── Paso 3: Guardar nueva contraseña ─────────────────────────────────────

  async function handleGuardarPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (nuevaPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const req = validarPassword(nuevaPassword);
    if (!req.longitud || !req.mayuscula || !req.numero) {
      setError("La contraseña no cumple los requisitos mínimos.");
      return;
    }

    setCargando(true);

    const { error: updateError } = await supabase.auth.updateUser({ password: nuevaPassword });

    if (updateError) {
      setError(traducirError(updateError.message));
      setCargando(false);
      return;
    }

    setToast("¡Contraseña actualizada!");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  // ── Handlers OTP ─────────────────────────────────────────────────────────

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

  // ── Derivados ─────────────────────────────────────────────────────────────

  const req = validarPassword(nuevaPassword);
  const fuerza = fuerzaPassword(req);
  const codigoCompleto = codigo.join("").length === 6;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center p-4">

      {toast && <Toast mensaje={toast} />}

      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl shadow-green-100 px-8 py-10">

        <LogoHeader />

        {/* ══════════════════════════════════════════════════════ */}
        {/* PASO 1 — Ingresar correo                              */}
        {/* ══════════════════════════════════════════════════════ */}
        {paso === "email" && (
          <>
            <h1 className="text-2xl font-bold text-[var(--verde-fuerte)] mb-1">
              Recuperar{" "}
              <span className="font-playfair italic text-[var(--primrose)]">contraseña</span>
            </h1>
            <p className="text-sm text-[#5a7255] font-nunito mb-6 leading-relaxed">
              Ingresa tu correo y te enviaremos un código de 6 dígitos.
            </p>

            <form onSubmit={handleEnviarCodigo} className="flex flex-col gap-4">
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

              {error && <CajaError mensaje={error} />}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white py-3.5 rounded-full font-semibold transition hover:scale-105 shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {cargando ? "Enviando..." : "Enviar código"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-[#5a7255] hover:text-[var(--verde-fuerte)] font-nunito transition">
                ← Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* PASO 2 — Verificar código OTP                         */}
        {/* ══════════════════════════════════════════════════════ */}
        {paso === "codigo" && (
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
                Te enviamos un código a{" "}
                <span className="font-semibold text-[var(--verde-fuerte)]">{enmascararEmail(email)}</span>.
              </p>
            </div>

            <AvisoSpam />

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
                {cargando ? "Verificando..." : "Verificar código"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setPaso("email"); setError(null); setCodigo(Array(6).fill("")); }}
              className="text-sm text-[#5a7255] hover:text-[var(--verde-fuerte)] font-nunito transition text-center"
            >
              ← Cambiar correo electrónico
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* PASO 3 — Nueva contraseña                             */}
        {/* ══════════════════════════════════════════════════════ */}
        {paso === "password" && (
          <>
            <h2 className="text-2xl font-bold text-[var(--verde-fuerte)] mb-1">
              Crea tu{" "}
              <span className="font-playfair italic text-[var(--primrose)]">nueva contraseña</span>
            </h2>
            <p className="text-sm text-[#5a7255] font-nunito mb-5 leading-relaxed">
              Tu nueva contraseña debe cumplir los requisitos de seguridad.
            </p>

            <form onSubmit={handleGuardarPassword} className="flex flex-col gap-4">
              <div className="space-y-2">
                <div className="relative">
                  <InputIcono><IconoLlave /></InputIcono>
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="font-nunito w-full bg-[#f5f0e8] border-2 border-[#d4c8b0] pl-11 pr-12 py-3.5 rounded-xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                  />
                  <BotonOjo mostrar={mostrarPassword} onToggle={() => setMostrarPassword(!mostrarPassword)} />
                </div>
                {nuevaPassword.length > 0 && (
                  <>
                    <BarraFuerza fuerza={fuerza} />
                    <RequisitosPasswordUI req={req} visible={nuevaPassword.length > 0} />
                  </>
                )}
              </div>

              <div className="relative">
                <InputIcono><IconoLlave /></InputIcono>
                <input
                  type={mostrarConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmar nueva contraseña"
                  className={`font-nunito w-full bg-[#f5f0e8] border-2 pl-11 pr-12 py-3.5 rounded-xl text-[#31543d] outline-none transition focus:ring-2 focus:ring-[#d4edcc] ${
                    confirmPassword && confirmPassword !== nuevaPassword
                      ? "border-[var(--primrose)] focus:border-[var(--primrose)]"
                      : confirmPassword && confirmPassword === nuevaPassword
                      ? "border-[var(--verde-fuerte)] focus:border-[var(--verde-fuerte)]"
                      : "border-[#d4c8b0] focus:border-[var(--verde-fuerte)]"
                  }`}
                />
                <BotonOjo mostrar={mostrarConfirm} onToggle={() => setMostrarConfirm(!mostrarConfirm)} />
              </div>

              {error && <CajaError mensaje={error} />}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white py-3.5 rounded-full font-semibold transition hover:scale-105 shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {cargando ? "Guardando..." : "Guardar nueva contraseña"}
              </button>
            </form>
          </>
        )}

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

// ─── Export con Suspense ──────────────────────────────────────────────────────

export default function RecuperarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--verde-fuerte)] border-t-transparent animate-spin" />
      </div>
    }>
      <RecuperarContent />
    </Suspense>
  );
}
