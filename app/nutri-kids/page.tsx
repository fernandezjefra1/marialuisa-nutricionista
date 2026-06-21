"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const JUEGOS = [
  {
    emoji: "🧠",
    titulo: "Memorama",
    descripcion: "¡Encuentra los pares de alimentos saludables!",
    href: "/nutri-kids/memorama",
    bg: "bg-[#FFD93D]",
    border: "border-[#e6c200]",
    shadow: "hover:shadow-[#FFD93D]/60",
    delay: "0ms",
  },
  {
    emoji: "🔤",
    titulo: "Pupiletras",
    descripcion: "Busca alimentos nutritivos escondidos en la sopa de letras.",
    href: "/nutri-kids/pupiletras",
    bg: "bg-[#AEE6FF]",
    border: "border-[#7ac8f0]",
    shadow: "hover:shadow-[#AEE6FF]/60",
    delay: "100ms",
  },
  {
    emoji: "❓",
    titulo: "Trivia Nutri",
    descripcion: "¡Demuestra cuánto sabes sobre comer sano!",
    href: "/nutri-kids/trivia",
    bg: "bg-[#FFAAC9]",
    border: "border-[#f07ba0]",
    shadow: "hover:shadow-[#FFAAC9]/60",
    delay: "200ms",
  },
  {
    emoji: "🧩",
    titulo: "Rompecabezas Deslizante",
    descripcion: "Desliza las piezas para armar el plato saludable.",
    href: "/nutri-kids/rompecabezas",
    bg: "bg-[#B5EAD7]",
    border: "border-[#6fc8a0]",
    shadow: "hover:shadow-[#B5EAD7]/60",
    delay: "300ms",
  },
];

export default function NutriKidsLanding() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <main
      className="min-h-screen font-fredoka"
      style={{
        background: "linear-gradient(135deg, #f5f0e8 0%, #e8f7ff 40%, #f0fff8 80%, #fff8e1 100%)",
        fontFamily: "var(--font-fredoka), sans-serif",
      }}
    >
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#FFD93D]/40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <Image src="/images/logoNutricion.png" alt="Logo" width={48} height={48} className="w-10 h-10 object-contain" />
            <span className="hidden sm:block font-playfair italic text-[var(--texto-principal)] text-base">
              María Luisa
            </span>
          </Link>
          <div className="flex-1" />
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--verde-fuerte)] text-white text-sm font-medium hover:opacity-90 transition-all"
            style={{ touchAction: "manipulation" }}
          >
            ← Inicio
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center px-4 pt-10 pb-6">
        <div
          className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex justify-center mb-4">
            <Image
              src="/images/NutriKids.jpeg"
              alt="Nutri Kids"
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-xl border-4 border-[#FFD93D]"
            />
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold text-[#1a5c34] mb-3"
            style={{ fontFamily: "var(--font-fredoka), sans-serif" }}
          >
            🌟 Nutri Kids 🌟
          </h1>
          <p className="text-lg md:text-2xl text-[#5a3e00] max-w-xl mx-auto">
            Juegos divertidos para aprender a comer saludable
          </p>
          <div className="flex justify-center gap-3 mt-4 text-2xl">
            {["🍎", "🥑", "🥦", "🥕", "🍓", "🌽"].map((e, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  animation: `flotar ${3 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* GRID DE JUEGOS */}
      <section className="max-w-4xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {JUEGOS.map((j, i) => (
          <div
            key={j.titulo}
            className={`rounded-3xl border-2 ${j.bg} ${j.border} p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl ${j.shadow} hover:scale-105 hover:rotate-1 transition-all duration-300 cursor-pointer`}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.5s ease ${j.delay}, transform 0.5s ease ${j.delay}`,
            }}
          >
            <span className="text-6xl md:text-7xl mb-3 block">{j.emoji}</span>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#1a3d22] mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {j.titulo}
            </h2>
            <p className="text-base text-[#3a3a3a] mb-5">{j.descripcion}</p>
            <Link
              href={j.href}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--verde-fuerte)] text-white text-lg font-semibold shadow-md hover:opacity-90 hover:scale-105 transition-all active:scale-95"
              style={{ touchAction: "manipulation", minHeight: "48px" }}
            >
              ¡Jugar! 🎮
            </Link>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 px-4 text-[#7a6a50] text-sm">
        <p>
          Hecho con 💚 por{" "}
          <span className="font-semibold text-[var(--verde-fuerte)]">María Luisa Nutricionista</span>.
          Para niños de 5 a 12 años.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-[var(--primrose)] hover:underline"
          style={{ touchAction: "manipulation" }}
        >
          ← Volver al inicio
        </Link>
      </footer>
    </main>
  );
}
