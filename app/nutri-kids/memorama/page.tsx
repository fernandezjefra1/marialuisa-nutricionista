"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const PARES = [
  { emoji: "🍎", nombre: "Manzana" },
  { emoji: "🥑", nombre: "Palta" },
  { emoji: "🥦", nombre: "Brócoli" },
  { emoji: "🥕", nombre: "Zanahoria" },
  { emoji: "🍓", nombre: "Fresa" },
  { emoji: "🌽", nombre: "Maíz" },
  { emoji: "🍌", nombre: "Banana" },
  { emoji: "🥬", nombre: "Espinaca" },
];

const DATOS_NUTRI = [
  "¿Sabías que la palta tiene grasas buenas para tu cerebro? 🧠",
  "El brócoli te da súper fuerza con vitamina C. 💪",
  "Comer 5 colores de frutas y verduras al día te hace súper saludable. 🌈",
  "La zanahoria mejora tu visión y tiene vitamina A. 👀",
  "Las fresas son ricas en antioxidantes que protegen tu cuerpo. 🛡️",
];

type Carta = { id: number; emoji: string; nombre: string; volteada: boolean; encontrada: boolean };

function crearCartas(): Carta[] {
  const todas = [...PARES, ...PARES].map((p, i) => ({
    id: i,
    emoji: p.emoji,
    nombre: p.nombre,
    volteada: false,
    encontrada: false,
  }));
  for (let i = todas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [todas[i], todas[j]] = [todas[j], todas[i]];
  }
  return todas;
}

function formatTiempo(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

/* ── Confetti ── */
const COLORES = ["#FFD93D", "#FF6B6B", "#AEE6FF", "#B5EAD7", "#FFAAC9", "#D4AAFF", "#FF9A3C"];
function Confetti() {
  const piezas = Array.from({ length: 50 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {piezas.map((i) => (
        <div
          key={i}
          className="confetti-piece absolute top-0 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 8}px`,
            height: `${10 + Math.random() * 8}px`,
            background: COLORES[i % COLORES.length],
            "--cdur": `${2 + Math.random() * 2}s`,
            "--cdel": `${Math.random() * 1}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function Memorama() {
  const [cartas, setCartas] = useState<Carta[]>(crearCartas);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [movimientos, setMovimientos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [activo, setActivo] = useState(true);
  const [ganaste, setGanaste] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [datoNutri] = useState(() => DATOS_NUTRI[Math.floor(Math.random() * DATOS_NUTRI.length)]);

  // Timer
  useEffect(() => {
    if (!activo || ganaste) return;
    const id = setInterval(() => setTiempo((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [activo, ganaste]);

  const paresEncontrados = cartas.filter((c) => c.encontrada).length / 2;

  const reiniciar = useCallback(() => {
    setCartas(crearCartas());
    setSeleccionadas([]);
    setMovimientos(0);
    setTiempo(0);
    setActivo(true);
    setGanaste(false);
    setBloqueado(false);
  }, []);

  const clickCarta = useCallback(
    (id: number) => {
      if (bloqueado) return;
      const carta = cartas.find((c) => c.id === id);
      if (!carta || carta.volteada || carta.encontrada) return;
      if (seleccionadas.includes(id)) return;

      const nuevasSeleccionadas = [...seleccionadas, id];

      setCartas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, volteada: true } : c))
      );

      if (nuevasSeleccionadas.length === 2) {
        setMovimientos((m) => m + 1);
        setBloqueado(true);

        const [id1, id2] = nuevasSeleccionadas;
        const c1 = cartas.find((c) => c.id === id1)!;
        const c2 = cartas.find((c) => c.id === id2)!;
        const c2actual = { ...c2, volteada: true };

        if (c1.emoji === c2actual.emoji) {
          setTimeout(() => {
            setCartas((prev) =>
              prev.map((c) =>
                c.id === id1 || c.id === id2
                  ? { ...c, encontrada: true, volteada: true }
                  : c
              )
            );
            setSeleccionadas([]);
            setBloqueado(false);
            setCartas((prev) => {
              const todas = prev.map((c) =>
                c.id === id1 || c.id === id2
                  ? { ...c, encontrada: true, volteada: true }
                  : c
              );
              if (todas.every((c) => c.encontrada)) {
                setGanaste(true);
                setActivo(false);
              }
              return todas;
            });
          }, 600);
        } else {
          setTimeout(() => {
            setCartas((prev) =>
              prev.map((c) =>
                c.id === id1 || c.id === id2
                  ? { ...c, volteada: false }
                  : c
              )
            );
            setSeleccionadas([]);
            setBloqueado(false);
          }, 900);
        }

        setSeleccionadas(nuevasSeleccionadas);
      } else {
        setSeleccionadas(nuevasSeleccionadas);
      }
    },
    [bloqueado, cartas, seleccionadas]
  );

  return (
    <main
      className="min-h-screen pb-10"
      style={{
        background: "linear-gradient(135deg, #f5f0e8 0%, #e8f7ff 60%, #fff8e1 100%)",
        fontFamily: "var(--font-fredoka), sans-serif",
      }}
    >
      {ganaste && <Confetti />}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#FFD93D]/40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <Link
            href="/nutri-kids"
            className="text-[var(--verde-fuerte)] font-semibold text-sm hover:underline"
            style={{ touchAction: "manipulation" }}
          >
            ← Nutri Kids
          </Link>
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">🧠 Memorama</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>
            🏠
          </Link>
        </div>

        {/* Stats */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-[#FFD93D] text-[#5a3e00] px-3 py-1 rounded-full font-semibold">
            Movimientos: {movimientos}
          </span>
          <span className="bg-[#AEE6FF] text-[#1a3d55] px-3 py-1 rounded-full font-semibold">
            Tiempo: {formatTiempo(tiempo)}
          </span>
          <span className="bg-[#B5EAD7] text-[#1a3d22] px-3 py-1 rounded-full font-semibold">
            Pares: {paresEncontrados}/8
          </span>
          <button
            onClick={reiniciar}
            className="bg-[var(--primrose)] text-white px-4 py-1 rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
            style={{ touchAction: "manipulation", minHeight: "36px" }}
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Grid de cartas */}
      <div className="max-w-2xl mx-auto px-3 pt-5">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {cartas.map((carta) => {
            const mostrar = carta.volteada || carta.encontrada;
            return (
              <button
                key={carta.id}
                onClick={() => clickCarta(carta.id)}
                className="aspect-square rounded-2xl transition-all duration-300 select-none focus:outline-none"
                style={{
                  touchAction: "manipulation",
                  minHeight: "60px",
                  transform: mostrar ? "rotateY(0deg)" : "rotateY(0deg)",
                }}
                aria-label={mostrar ? carta.nombre : "Carta oculta"}
              >
                <div
                  className={`w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 border-2 shadow-sm
                    ${carta.encontrada
                      ? "bg-[#B5EAD7] border-[#6fc8a0] scale-95"
                      : mostrar
                      ? "bg-white border-[#AEE6FF] scale-100"
                      : "bg-[var(--verde-fuerte)] border-[#0e4d22] hover:scale-105 active:scale-95 cursor-pointer"
                    }`}
                >
                  {mostrar ? (
                    <span className="text-3xl sm:text-4xl md:text-5xl leading-none select-none">
                      {carta.emoji}
                    </span>
                  ) : (
                    <span className="text-2xl sm:text-3xl leading-none select-none">🌿</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal victoria */}
      {ganaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in"
            style={{ fontFamily: "var(--font-fredoka), sans-serif" }}
          >
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-3xl font-bold text-[#1a3d22] mb-2">¡Felicidades!</h2>
            <p className="text-[#3a3a3a] mb-1 text-lg">
              Completaste el memorama en{" "}
              <span className="font-bold text-[var(--verde-fuerte)]">{movimientos} movimientos</span>
            </p>
            <p className="text-[#3a3a3a] mb-4 text-lg">
              Tiempo:{" "}
              <span className="font-bold text-[var(--verde-fuerte)]">{formatTiempo(tiempo)}</span>
            </p>
            <div className="bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-4 mb-5 text-sm text-[#5a3e00]">
              💡 {datoNutri}
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={reiniciar}
                className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ touchAction: "manipulation" }}
              >
                Jugar de nuevo 🔄
              </button>
              <Link
                href="/nutri-kids"
                className="w-full py-3 rounded-full border-2 border-[var(--primrose)] text-[var(--primrose)] font-bold text-lg hover:bg-[var(--pinktone)] active:scale-95 transition-all text-center block"
                style={{ touchAction: "manipulation" }}
              >
                Volver a Nutri Kids 🎮
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
