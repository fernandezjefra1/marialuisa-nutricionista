"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Este correo ya está registrado. Inicia sesión.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  /* ---- PANTALLA ÉXITO ---- */
  if (success) {
    return (
      <div className="min-h-screen bg-[#d4edcc] flex items-center justify-center p-6">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-green-200 p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#d4edcc] flex items-center justify-center mx-auto text-4xl">
            🌿
          </div>
          <h1 className="font-playfair text-4xl text-[#31543d] mt-6 font-bold">
            ¡Revisa tu correo! <span className="text-[#C4607A]">♡</span>
          </h1>
          <p className="font-nunito text-[#5a7255] mt-4">
            Te enviamos un enlace de confirmación a:
          </p>
          <p className="font-semibold text-[#31543d] mt-2 font-nunito">{email}</p>
          <p className="font-nunito text-sm text-[#8aa487] mt-6 leading-7">
            Haz clic en el enlace del correo para activar tu cuenta y poder reservar citas.
          </p>
          <Link
            href="/"
            className="btn-coquette inline-block mt-8 bg-[#6daa6d] hover:bg-[#5a9a5a] text-white px-8 py-4 rounded-2xl transition font-nunito font-semibold shadow-md shadow-green-200"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl shadow-green-200 overflow-hidden grid md:grid-cols-[1.1fr_1fr]">

        {/* ---- PANEL IZQUIERDO: IMAGEN ---- */}
        <div className="hidden md:flex flex-col relative bg-[#edf7e8] overflow-hidden">

          {/* Círculos decorativos */}
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-[#C4607A]/10 rounded-full" />
          <div className="absolute bottom-[160px] right-[-30px] w-24 h-24 bg-[#d4edcc] rounded-full" />

          {/* Imagen */}
          <div className="flex-1 relative overflow-hidden">
            <Image
              src="/images/registro-nutricion.jpeg"
              alt="Nutricionista"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Texto inferior */}
          <div className="bg-[#f4f8f4] px-8 py-5">
            <h2 className="font-playfair italic text-2xl text-[#31543d] leading-snug">
              Empieza tu cambio,
              <span className="font-semibold text-[#6daa6d] not-italic"> + bienestar y armonía </span>
              <span className="text-[#C4607A]">🌿 ♡</span>
            </h2>
            <p className="font-nunito text-sm text-[#5a7255] mt-2">
              Crea tu cuenta y comienza tu camino hacia una vida más saludable
            </p>
          </div>

        </div>

        {/* ---- PANEL DERECHO: FORMULARIO ---- */}
        <div className="px-10 py-12 flex flex-col justify-between bg-white">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-6">
            <span className="text-2xl bow-animate">🌿</span>
            <div>
              <p className="font-playfair font-bold text-[#31543d] text-lg leading-tight">María Luisa</p>
              <p className="text-[10px] uppercase tracking-widest text-[#5a7255]">Nutricionista</p>
            </div>
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-4xl font-bold text-[#31543d] leading-tight">
              Crear{" "}
              <span className="font-playfair italic text-[#C4607A]">cuenta</span>{" "}
              <span className="text-[#C4607A]">✦</span>
            </h1>
            <p className="font-nunito mt-3 text-[#5a7255] leading-relaxed text-sm">
              Únete y comienza a reservar tus citas<br />
              hacia tu mejor versión.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Nombre */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa487]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo"
                className="font-nunito w-full bg-[#f0f8ec] border border-[#C5DFC5] pl-11 pr-4 py-3.5 rounded-2xl text-[#31543d] outline-none focus:border-[#6daa6d] focus:ring-2 focus:ring-[#d4edcc] transition"
              />
            </div>

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
                className="font-nunito w-full bg-[#f0f8ec] border border-[#C5DFC5] pl-11 pr-4 py-3.5 rounded-2xl text-[#31543d] outline-none focus:border-[#6daa6d] focus:ring-2 focus:ring-[#d4edcc] transition"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña (mín. 6 caracteres)"
                className="font-nunito w-full bg-[#f0f8ec] border border-[#C5DFC5] pl-11 pr-12 py-3.5 rounded-2xl text-[#31543d] outline-none focus:border-[#6daa6d] focus:ring-2 focus:ring-[#d4edcc] transition"
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

            {error && <p className="text-red-500 text-sm font-nunito">{error}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-coquette w-full bg-[#6daa6d] hover:bg-[#5a9a5a] text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-md shadow-green-200 flex items-center justify-center gap-2"
            >
              <span>🌿</span>
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center mt-5 text-[#5a7255] font-nunito text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-semibold text-[#C4607A] hover:underline">
              Iniciar sesión
            </Link>
          </p>

          {/* Volver */}
          <div className="mt-4">
            <Link href="/" className="text-sm text-[#5a7255] hover:text-[#31543d] transition font-nunito">
              ← Volver al inicio
            </Link>
          </div>

        </div>

      </div>

      {/* Footer */}
      <p className="mt-5 text-sm text-[#5a7255] font-nunito flex items-center gap-2">
        🌿 Tu salud es tu mejor inversión 🍓
      </p>

    </div>
  );
}
