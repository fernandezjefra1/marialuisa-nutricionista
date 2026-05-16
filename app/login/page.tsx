"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#edf5ea] flex items-center justify-center p-6">

      <div className="w-full max-w-7xl bg-white rounded-[45px] shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* PANEL IZQUIERDO */}
        <div className="relative bg-[#f4f8f1] flex flex-col items-center justify-start px-0 pt-0 pb-12 overflow-hidden">

          {/* FORMAS DECORATIVAS */}
          <div className="absolute bottom-[-120px] left-[-80px] w-[300px] h-[300px] bg-[#dcebd8] rounded-full opacity-70"></div>

          <div className="absolute bottom-[-140px] right-[-100px] w-[320px] h-[320px] bg-[#f3dce3] rounded-full opacity-60"></div>

          <div className="absolute top-[-90px] right-[-70px] w-[220px] h-[220px] bg-[#e6f0e2] rounded-full opacity-70"></div>


          {/* IMAGEN */}
          <div className="relative z-10 w-full flex justify-center pt-0">

            <Image
              src="/images/login-doctora.jpeg"
              alt="Nutricionista"
              width={820}
              height={620}
              className="object-contain"
            />

          </div>


          {/* TEXTOS */}
          <div className="relative z-10 px-8">

            <h2 className="mt-2 text-5xl font-serif text-[#31543d] text-center leading-tight">
              Bienestar natural
            </h2>

            <p className="mt-3 text-xl italic text-[#d79aa3] text-center">
              vida en equilibrio ♡
            </p>

            <p className="mt-6 text-base text-[#55735f] text-center leading-7 max-w-md mx-auto">
              Tu salud comienza con pequeños cambios
            </p>

          </div>

        </div>


        {/* PANEL LOGIN */}
        <div className="px-10 py-14 md:px-16 flex flex-col justify-center bg-white">

          <h1 className="text-6xl font-serif text-[#31543d] leading-tight">
            ¡Bienvenida!
          </h1>

          <p className="mt-3 text-[#5d7766] text-lg">
            Inicia sesión para continuar
          </p>


          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mt-10 border border-[#d8b1d7] bg-[#efd8ef] hover:bg-[#e8c8e5] py-4 rounded-2xl text-[#31543d] font-medium transition duration-300"
          >
            Continuar con Google
          </button>


          <div className="text-center text-[#75a380] text-sm my-6">
            o continúa con tu correo
          </div>


          {/* FORMULARIO */}
          <form
            onSubmit={handleEmailLogin}
            className="space-y-5"
          >

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full bg-[#f8fcf6] border border-[#dbe8d7] px-5 py-4 rounded-2xl text-[#31543d] outline-none focus:border-[#8caf94] focus:ring-2 focus:ring-[#dcebd8] transition"
            />


            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-[#f8fcf6] border border-[#dbe8d7] px-5 py-4 rounded-2xl text-[#31543d] outline-none focus:border-[#8caf94] focus:ring-2 focus:ring-[#dcebd8] transition"
            />


            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}


            {/* BOTÓN LOGIN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b07cab] hover:bg-[#9c6997] text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-md"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

          </form>


          {/* LINK REGISTRO */}
          <p className="text-center mt-8 text-[#6d826f]">
            ¿No tienes cuenta?{" "}

            <Link
              href="/registro"
              className="text-[#d79aa3] font-semibold hover:underline"
            >
              Crear cuenta
            </Link>

          </p>


          {/* VOLVER */}
          <div className="mt-8">
            <Link
              href="/"
              className="text-sm text-[#5d7766] hover:text-[#31543d] transition"
            >
              ← Volver al inicio
            </Link>
          </div>

        </div>

      </div>

    </main>
  );
}