"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

/* ══════════════════════════════════════════════════════════════════
   15-PUZZLE DESLIZANTE (4×4)
   estado: array de 16 números — valor 1-15 = pieza, 0 = hueco vacío
   Estado resuelto: [1,2,3,...,15,0]
   ══════════════════════════════════════════════════════════════════ */

const N = 4;
const TOTAL = N * N;
const RESUELTO: number[] = [...Array.from({ length: TOTAL - 1 }, (_, i) => i + 1), 0];

function vecinos(pos: number): number[] {
  const fila = Math.floor(pos / N);
  const col  = pos % N;
  const v: number[] = [];
  if (fila > 0)     v.push(pos - N);
  if (fila < N - 1) v.push(pos + N);
  if (col > 0)      v.push(pos - 1);
  if (col < N - 1)  v.push(pos + 1);
  return v;
}

/* Garantiza resolubilidad: parte del estado resuelto y hace N movimientos válidos */
function crearEstadoMezclado(): number[] {
  const s = [...RESUELTO];
  for (let i = 0; i < 200; i++) {
    const huecoIdx = s.indexOf(0);
    const vs = vecinos(huecoIdx);
    const dest = vs[Math.floor(Math.random() * vs.length)];
    [s[huecoIdx], s[dest]] = [s[dest], s[huecoIdx]];
  }
  return s;
}

function estaResuelto(s: number[]) {
  return s.every((v, i) => v === RESUELTO[i]);
}

function formatTiempo(s: number) {
  const m  = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

/* Estilo CSS para mostrar el fragmento de imagen correspondiente a la pieza */
function estiloPieza(valor: number): React.CSSProperties {
  const fila = Math.floor((valor - 1) / N);
  const col  = (valor - 1) % N;
  return {
    backgroundImage: "url('/images/plato-saludable.png')",
    backgroundSize:  `${N * 100}% ${N * 100}%`,
    backgroundPosition: `${(col / (N - 1)) * 100}% ${(fila / (N - 1)) * 100}%`,
    backgroundRepeat: "no-repeat",
  };
}

/* ── Confetti ── */
const CCONF = ["#FFD93D","#FF6B6B","#AEE6FF","#B5EAD7","#FFAAC9","#D4AAFF","#FF9A3C"];
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }, (_, i) => (
        <div
          key={i}
          className="confetti-piece absolute top-0 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 8}px`,
            height: `${10 + Math.random() * 8}px`,
            background: CCONF[i % CCONF.length],
            "--cdur": `${2 + Math.random() * 2}s`,
            "--cdel": `${Math.random() * 1}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function Rompecabezas() {
  const [estado, setEstado]     = useState<number[]>(crearEstadoMezclado);
  const [movimientos, setMov]   = useState(0);
  const [tiempo, setTiempo]     = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [ganaste, setGanaste]   = useState(false);
  const [piezaShake, setShake]  = useState<number | null>(null);

  /* Timer */
  useEffect(() => {
    if (!iniciado || ganaste) return;
    const id = setInterval(() => setTiempo(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [iniciado, ganaste]);

  const reiniciar = useCallback(() => {
    setEstado(crearEstadoMezclado());
    setMov(0);
    setTiempo(0);
    setIniciado(false);
    setGanaste(false);
    setShake(null);
  }, []);

  const moverPieza = useCallback((posClick: number) => {
    const valor = estado[posClick];
    if (valor === 0) return;                       // click en el hueco

    const huecoPos = estado.indexOf(0);
    const adj      = vecinos(huecoPos);

    if (adj.includes(posClick)) {
      /* Movimiento válido: intercambiar pieza con hueco */
      const next = [...estado];
      [next[huecoPos], next[posClick]] = [next[posClick], next[huecoPos]];
      setEstado(next);
      setMov(m => m + 1);
      if (!iniciado) setIniciado(true);
      if (estaResuelto(next)) setGanaste(true);
    } else {
      /* Movimiento inválido: shake breve */
      setShake(valor);
      setTimeout(() => setShake(null), 380);
    }
  }, [estado, iniciado]);

  /* ── Render ── */
  return (
    <main
      className="min-h-screen pb-10"
      style={{
        background: "linear-gradient(135deg, #fff8e1 0%, #ffe0b2 50%, #fff3e0 100%)",
        fontFamily: "var(--font-fredoka), sans-serif",
      }}
    >
      {ganaste && <Confetti />}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#FF9A3C]/40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/nutri-kids" className="text-[var(--verde-fuerte)] font-semibold text-sm hover:underline" style={{ touchAction: "manipulation" }}>
            ← Nutri Kids
          </Link>
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">🧩 Rompecabezas Deslizante</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>🏠</Link>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-[#FFD93D] text-[#5a3e00] px-3 py-1 rounded-full font-semibold">
            Movimientos: {movimientos}
          </span>
          <span className="bg-[#AEE6FF] text-[#1a3d55] px-3 py-1 rounded-full font-semibold">
            Tiempo: {formatTiempo(tiempo)}
          </span>
          <button
            onClick={reiniciar}
            className="bg-[#FF9A3C] text-white px-4 py-1 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all"
            style={{ touchAction: "manipulation" }}
          >
            🔀 Mezclar
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5 flex flex-col items-center gap-5">

        {/* Referencia */}
        <div className="flex items-center gap-3 bg-white/70 rounded-2xl px-4 py-2 shadow-sm">
          <Image
            src="/images/plato-saludable.png"
            alt="Modelo"
            width={80}
            height={80}
            className="rounded-xl border-2 border-[#d4a574] object-cover"
          />
          <div className="text-sm text-[#5a3e00]">
            <p className="font-bold mb-0.5">Así debe quedar 👆</p>
            <p className="text-xs text-[#8a6a40]">Toca una pieza adyacente al hueco para deslizarla</p>
          </div>
        </div>

        {/* Puzzle grid — contenedor relativo, piezas absolutas */}
        <div
          className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-[#d4a574] shadow-2xl"
          style={{ background: "#8b6b4a", touchAction: "manipulation" }}
        >
          {/* Hueco vacío */}
          {(() => {
            const hPos  = estado.indexOf(0);
            const hFila = Math.floor(hPos / N);
            const hCol  = hPos % N;
            return (
              <div
                className="absolute rounded-sm"
                style={{
                  top:    `${(hFila * 100) / N}%`,
                  left:   `${(hCol  * 100) / N}%`,
                  width:  `${100 / N}%`,
                  height: `${100 / N}%`,
                  background: "rgba(60,35,10,0.55)",
                  padding: "3px",
                  boxSizing: "border-box",
                  transition: "top 0.18s ease, left 0.18s ease",
                }}
              />
            );
          })()}

          {/* 15 piezas, cada una keyed por su valor para que React la rastree
              individualmente y CSS anime su desplazamiento */}
          {Array.from({ length: 15 }, (_, i) => i + 1).map(valor => {
            const posIdx = estado.indexOf(valor);
            const fila   = Math.floor(posIdx / N);
            const col    = posIdx % N;
            const shaking = piezaShake === valor;

            return (
              <div
                key={valor}
                className={`absolute cursor-pointer ${shaking ? "shake" : ""}`}
                style={{
                  top:    `${(fila * 100) / N}%`,
                  left:   `${(col  * 100) / N}%`,
                  width:  `${100 / N}%`,
                  height: `${100 / N}%`,
                  padding: "3px",
                  boxSizing: "border-box",
                  transition: shaking ? "none" : "top 0.18s ease, left 0.18s ease",
                  touchAction: "manipulation",
                }}
                onClick={() => moverPieza(posIdx)}
              >
                <div
                  className="w-full h-full rounded-sm relative hover:brightness-110 active:brightness-90 transition-all border border-white/30 shadow-inner"
                  style={estiloPieza(valor)}
                >
                  {/* Número de pieza — referencia visual para el niño */}
                  <span
                    className="absolute top-0.5 left-1 text-[10px] font-bold leading-none"
                    style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 2px rgba(0,0,0,0.7)" }}
                  >
                    {valor}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-[#8a6a40] text-center">
          Desliza las piezas hacia el hueco para armar el plato saludable
        </p>
      </div>

      {/* Modal victoria */}
      {ganaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            className="bg-white rounded-3xl p-7 max-w-sm w-full text-center shadow-2xl bounce-in"
            style={{ fontFamily: "var(--font-fredoka), sans-serif" }}
          >
            <div className="text-6xl mb-3">🎊</div>
            <h2 className="text-3xl font-bold text-[#1a3d22] mb-1">¡Lo resolviste!</h2>
            <p className="text-[#5a3e00] mb-1">
              Movimientos: <span className="font-bold text-[var(--verde-fuerte)]">{movimientos}</span>
            </p>
            <p className="text-[#5a3e00] mb-4">
              Tiempo: <span className="font-bold text-[var(--verde-fuerte)]">{formatTiempo(tiempo)}</span>
            </p>

            {/* Imagen completa de victoria */}
            <div className="flex justify-center mb-4">
              <Image
                src="/images/plato-saludable.png"
                alt="Plato saludable"
                width={140}
                height={140}
                className="rounded-2xl border-4 border-[#6fc8a0] shadow-lg"
              />
            </div>

            <div className="bg-[#f0fff8] border border-[#B5EAD7] rounded-2xl p-4 mb-5 text-left text-sm text-[#1a3d22]">
              <p className="font-bold mb-1">Este es un plato balanceado y saludable:</p>
              <p>🥦 La mitad del plato: <strong>verduras y frutas</strong></p>
              <p>🍗 Un cuarto: <strong>proteína</strong> (pollo, pescado, huevos)</p>
              <p>🍚 Un cuarto: <strong>carbohidratos</strong> (arroz, papa, quinua)</p>
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
