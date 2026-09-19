"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.ok || !data.session) {
        setError("Correo o contraseña incorrectos.");
        setCargando(false);
        return;
      }

      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
    } catch {
      setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--pinktone-soft)] via-[var(--yucca)] to-[var(--lime-soft)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <Image
              src="/images/logoNutricion.png"
              alt="María Luisa Nutricionista"
              width={80}
              height={80}
              className="w-16 h-16 object-contain drop-shadow-sm"
            />
            <span className="font-playfair italic text-lg text-[var(--texto-principal)]">
              María Luisa <span className="not-italic text-[var(--primrose)] font-semibold">Nutricionista</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[var(--borde-rosa)] shadow-lg shadow-pink-100 p-6 md:p-8">
          <h1 className="font-playfair text-2xl font-semibold text-[var(--texto-principal)] mb-1 text-center">
            Acceso administrador
          </h1>
          <p className="text-sm text-[var(--texto-suave)] text-center mb-6">
            Ingresa tus credenciales para gestionar citas y constancias.
          </p>

          {error && (
            <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                Correo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--primrose)] transition"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--primrose)] transition"
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] disabled:opacity-50 text-white px-6 py-3 rounded-full transition font-semibold shadow-lg shadow-pink-200"
            >
              {cargando ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-[var(--texto-suave)] hover:text-[var(--primrose)] transition">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center"><p className="text-sm text-[var(--texto-suave)]">Cargando...</p></main>}>
      <LoginContent />
    </Suspense>
  );
}
