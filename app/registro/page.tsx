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

  // PANTALLA ÉXITO
  if (success) {
    return (
      <main className="min-h-screen bg-[#edf5ea] flex items-center justify-center p-6">

        <div className="bg-white rounded-[40px] shadow-2xl p-12 max-w-lg w-full text-center">

          <div className="w-20 h-20 rounded-full bg-[#dcebd8] flex items-center justify-center mx-auto text-4xl text-[#4f7057]">
            ✓
          </div>

          <h1 className="text-5xl font-serif text-[#31543d] mt-6">
            Revisa tu correo
          </h1>

          <p className="text-[#5f7865] mt-4">
            Te enviamos un enlace de confirmación a:
          </p>

          <p className="font-semibold text-[#31543d] mt-2">
            {email}
          </p>

          <p className="text-sm text-[#7b9180] mt-6 leading-7">
            Haz clic en el enlace del correo para activar tu cuenta y poder reservar citas.
          </p>

          <Link
            href="/"
            className="inline-block mt-8 bg-[#5f8a68] hover:bg-[#4f7057] text-white px-8 py-4 rounded-2xl transition"
          >
            Volver al inicio
          </Link>

        </div>

      </main>
    );
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
              src="/images/registro-nutricion.jpeg"
              alt="Nutricionista"
              width={820}
              height={620}
              className="object-contain"
            />

          </div>


          {/* TEXTOS */}
          <div className="relative z-10 px-8">

            <h2 className="mt-2 text-5xl font-serif text-[#31543d] text-center leading-tight">
              Empieza tu cambio
            </h2>

            <p className="mt-3 text-xl italic text-[#d79aa3] text-center">
              bienestar y armonía ♡
            </p>

            <p className="mt-6 text-base text-[#55735f] text-center leading-7 max-w-md mx-auto">
              Crea tu cuenta y comienza tu camino hacia una vida más saludable
            </p>

          </div>

        </div>


        {/* FORMULARIO */}
        <div className="px-10 py-14 md:px-16 flex flex-col justify-center bg-white">

          <h1 className="text-6xl font-serif text-[#31543d] leading-tight">
            Crear cuenta
          </h1>

          <p className="mt-3 text-[#5d7766] text-lg">
            Únete y reserva tus citas
          </p>


          {/* FORM */}
          <form
            onSubmit={handleSignup}
            className="space-y-5 mt-10"
          >

            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre completo"
              className="w-full bg-[#f8fcf6] border border-[#dbe8d7] px-5 py-4 rounded-2xl text-[#31543d] outline-none focus:border-[#8caf94] focus:ring-2 focus:ring-[#dcebd8] transition"
            />


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
              minLength={6}
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


            {/* BOTÓN */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b07cab] hover:bg-[#9c6997] text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-md"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

          </form>


          {/* LOGIN */}
          <p className="text-center mt-8 text-[#6d826f]">
            ¿Ya tienes cuenta?{" "}

            <Link
              href="/login"
              className="text-[#d79aa3] font-semibold hover:underline"
            >
              Iniciar sesión
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