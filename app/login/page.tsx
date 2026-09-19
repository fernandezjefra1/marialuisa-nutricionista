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

  async function handleGoogle() {
    setError(null);
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (e) setError("No se pudo iniciar con Google.");
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

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-[var(--borde-rosa)] hover:bg-[var(--pinktone-soft)] text-[var(--texto-principal)] px-6 py-3 rounded-full transition font-medium mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[var(--borde-rosa)]" />
            <span className="text-xs text-[var(--texto-tenue)]">o con tu correo</span>
            <div className="flex-1 h-px bg-[var(--borde-rosa)]" />
          </div>

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
