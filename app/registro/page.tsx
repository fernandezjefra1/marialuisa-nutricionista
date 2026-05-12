"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function RegistroPage() {
  const router = useRouter();
  const supabase = createClient();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  // Pantalla de éxito tras registrarse
  if (success) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-700 text-3xl mb-6">
            ✓
          </div>
          <h1 className="text-2xl md:text-3xl font-light mb-3">
            Revisa tu correo
          </h1>
          <p className="text-neutral-600 mb-2">
            Te enviamos un enlace de confirmación a:
          </p>
          <p className="font-semibold mb-8">{email}</p>
          <p className="text-sm text-neutral-500 mb-8">
            Haz clic en el enlace del correo para activar tu cuenta y poder reservar citas.
          </p>
          <Link
            href="/"
            className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-700 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl md:text-4xl font-light mt-6 mb-2">
            Crear cuenta<span className="font-semibold">.</span>
          </h1>
          <p className="text-sm text-neutral-600">
            Únete y reserva tu cita
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
              Nombre completo
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-neutral-300 px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-900 transition"
              placeholder="María García"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-900 transition"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
              Contraseña
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-neutral-300 px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-900 transition"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-sm text-neutral-600 text-center mt-8">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-neutral-900 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}