"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

export default function RecuperarContrasenaPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/actualizar-contrasena`,
    });

    if (resetError) {
      setError("Ocurrió un error. Verifica el correo e intenta de nuevo.");
      setCargando(false);
      return;
    }

    setEnviado(true);
    setCargando(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl shadow-green-100 p-10">

        <Link href="/login" className="flex items-center gap-2 mb-8">
          <Image src="/images/iconoNutricion.png" alt="Logo" width={48} height={48} className="object-contain" />
          <div>
            <p className="font-playfair font-bold text-[var(--verde-fuerte)] text-lg leading-tight">María Luisa</p>
            <p className="text-[10px] uppercase tracking-widest text-[#5a7255]">Nutricionista</p>
          </div>
        </Link>

        {!enviado ? (
          <>
            <h1 className="text-2xl font-bold text-[var(--verde-fuerte)] mb-2">
              Recuperar contraseña
            </h1>
            <p className="text-sm text-[#5a7255] font-nunito mb-6 leading-relaxed">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleEnviar} className="flex flex-col gap-4">
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
                  className="font-nunito w-full bg-[#f5f0e8] border-2 border-[#d4c8b0] pl-11 pr-4 py-3.5 rounded-xl text-[#31543d] outline-none focus:border-[var(--verde-fuerte)] focus:ring-2 focus:ring-[#d4edcc] transition"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-[var(--primrose)]/10 border border-[var(--primrose)]/30 rounded-xl px-4 py-3 text-sm text-[var(--primrose)]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white py-3.5 rounded-full font-semibold transition hover:scale-105 shadow-md shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {cargando ? "Enviando..." : "Enviar enlace de recuperación"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#f5f0e8] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--verde-fuerte)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--verde-fuerte)] mb-2">¡Revisa tu correo!</h2>
            <p className="text-sm text-[#5a7255] font-nunito leading-relaxed">
              Enviamos un enlace de recuperación a <span className="font-semibold">{email}</span>.
              Puede tardar unos minutos en llegar.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-[#5a7255] hover:text-[var(--verde-fuerte)] font-nunito transition">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
