"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const TOTAL = 9;
const COLS = 3;
const ROWS = 3;

type Pieza = { id: number; posCorrecia: number };

function mezclar(arr: Pieza[]): Pieza[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function crearPiezas(): Pieza[] {
  return Array.from({ length: TOTAL }, (_, i) => ({ id: i, posCorrecia: i }));
}

const CONFETTI_COLORS = ["#FFD93D", "#FF6B6B", "#AEE6FF", "#B5EAD7", "#FFAAC9", "#D4AAFF", "#FF9A3C"];
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
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            "--cdur": `${2 + Math.random() * 2}s`,
            "--cdel": `${Math.random() * 1}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* Muestra un segmento de la imagen usando background-position */
function PiezaImagen({
  id,
  size,
  className = "",
  style = {},
}: {
  id: number;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const col = id % COLS;
  const row = Math.floor(id / COLS);
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: "url('/images/plato-saludable.png')",
        backgroundSize: `${size * COLS}px ${size * ROWS}px`,
        backgroundPosition: `-${col * size}px -${row * size}px`,
        backgroundRepeat: "no-repeat",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export default function Rompecabezas() {
  const [banco, setBanco] = useState<Pieza[]>(() => mezclar(crearPiezas()));
  const [tablero, setTablero] = useState<(Pieza | null)[]>(() => Array(TOTAL).fill(null));
  const [seleccionada, setSeleccionada] = useState<{ origen: "banco" | "tablero"; idx: number } | null>(null);
  const [ganaste, setGanaste] = useState(false);
  const [piezasBrillando, setPiezasBrillando] = useState<number[]>([]);

  const colocadasCorrectamente = tablero.filter((p, i) => p && p.posCorrecia === i).length;

  const reiniciar = useCallback(() => {
    setBanco(mezclar(crearPiezas()));
    setTablero(Array(TOTAL).fill(null));
    setSeleccionada(null);
    setGanaste(false);
    setPiezasBrillando([]);
  }, []);

  const verPista = useCallback(() => {
    const primerSlotVacio = tablero.findIndex((t) => t === null);
    if (primerSlotVacio === -1) return;
    const piezaCorrecta = banco.find((p) => p.posCorrecia === primerSlotVacio);
    if (!piezaCorrecta) return;
    const idxBanco = banco.indexOf(piezaCorrecta);
    setPiezasBrillando([idxBanco]);
    setTimeout(() => setPiezasBrillando([]), 1800);
  }, [tablero, banco]);

  const clickBanco = useCallback(
    (idx: number) => {
      if (!seleccionada) {
        setSeleccionada({ origen: "banco", idx });
        return;
      }
      if (seleccionada.origen === "banco" && seleccionada.idx === idx) {
        setSeleccionada(null);
        return;
      }
      // Si hay algo seleccionado del tablero, devolver al banco y seleccionar esta
      setSeleccionada({ origen: "banco", idx });
    },
    [seleccionada]
  );

  const clickTablero = useCallback(
    (pos: number) => {
      if (!seleccionada) {
        // Si hay pieza en el tablero, la seleccionamos para moverla
        if (tablero[pos]) {
          setSeleccionada({ origen: "tablero", idx: pos });
        }
        return;
      }

      if (seleccionada.origen === "banco") {
        const pieza = banco[seleccionada.idx];
        if (!pieza) return;

        const nuevoBanco = [...banco];
        const nuevoTablero = [...tablero];

        // Si ya hay pieza en destino, la regresamos al banco
        if (nuevoTablero[pos]) {
          nuevoBanco.push(nuevoTablero[pos]!);
        }

        nuevoTablero[pos] = pieza;
        nuevoBanco.splice(seleccionada.idx, 1);
        setBanco(nuevoBanco);
        setTablero(nuevoTablero);
        setSeleccionada(null);

        if (nuevoTablero.every((p, i) => p && p.posCorrecia === i)) {
          setTimeout(() => setGanaste(true), 400);
        }
        return;
      }

      if (seleccionada.origen === "tablero") {
        if (seleccionada.idx === pos) {
          // deseleccionar o enviar al banco
          const pieza = tablero[pos]!;
          const nuevoTablero = [...tablero];
          nuevoTablero[pos] = null;
          setTablero(nuevoTablero);
          setBanco((b) => [...b, pieza]);
          setSeleccionada(null);
          return;
        }
        // Intercambiar con otra posición del tablero
        const nuevoTablero = [...tablero];
        const temp = nuevoTablero[pos];
        nuevoTablero[pos] = nuevoTablero[seleccionada.idx];
        nuevoTablero[seleccionada.idx] = temp;
        setTablero(nuevoTablero);
        setSeleccionada(null);

        if (nuevoTablero.every((p, i) => p && p.posCorrecia === i)) {
          setTimeout(() => setGanaste(true), 400);
        }
      }
    },
    [seleccionada, banco, tablero]
  );

  const PIEZA_SIZE_TABLERO = 96; // px por pieza en el tablero
  const PIEZA_SIZE_BANCO = 72;

  return (
    <main
      className="min-h-screen pb-10"
      style={{
        background: "linear-gradient(135deg, #f5f0e8 0%, #f0fff8 60%, #fff8e1 100%)",
        fontFamily: "var(--font-fredoka), sans-serif",
      }}
    >
      {ganaste && <Confetti />}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#B5EAD7]/50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/nutri-kids" className="text-[var(--verde-fuerte)] font-semibold text-sm hover:underline" style={{ touchAction: "manipulation" }}>
            ← Nutri Kids
          </Link>
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">🧩 Rompecabezas</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>🏠</Link>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3 flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-[#B5EAD7] text-[#1a3d22] px-3 py-1 rounded-full font-semibold">
            Piezas: {colocadasCorrectamente}/{TOTAL}
          </span>
          <button
            onClick={verPista}
            className="bg-[#D4AAFF] text-[#3a1a6a] px-3 py-1 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all"
            style={{ touchAction: "manipulation" }}
          >
            💡 Ver pista
          </button>
          <button
            onClick={reiniciar}
            className="bg-[var(--primrose)] text-white px-4 py-1 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all"
            style={{ touchAction: "manipulation" }}
          >
            Mezclar de nuevo
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-5 flex flex-col items-center gap-6">
        {/* Modelo referencia */}
        <div className="text-center">
          <p className="text-sm text-[#5a3e00] font-semibold mb-2">Así debe quedar:</p>
          <div
            className="rounded-2xl overflow-hidden shadow-md border-2 border-[#B5EAD7] mx-auto"
            style={{ width: 96, height: 96 }}
          >
            <Image
              src="/images/plato-saludable.png"
              alt="Plato saludable completo"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Tablero 3x3 */}
        <div>
          <p className="text-center text-sm text-[#5a3e00] font-semibold mb-3">
            {seleccionada
              ? "✅ Pieza seleccionada — toca un cuadro para colocarla"
              : "Toca una pieza del banco para seleccionarla"}
          </p>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, ${PIEZA_SIZE_TABLERO}px)` }}
          >
            {tablero.map((pieza, pos) => {
              const correcta = pieza && pieza.posCorrecia === pos;
              const esSel = seleccionada?.origen === "tablero" && seleccionada.idx === pos;
              return (
                <button
                  key={pos}
                  onClick={() => clickTablero(pos)}
                  className={`rounded-xl border-2 flex items-center justify-center transition-all duration-200
                    ${esSel ? "border-[#FFD93D] scale-105 shadow-lg" : correcta ? "border-[#6fc8a0]" : "border-dashed border-[#ccc]"}
                    ${!pieza ? "bg-[#f0f0f0] hover:bg-[#e8f7ff]" : ""}
                  `}
                  style={{
                    width: PIEZA_SIZE_TABLERO,
                    height: PIEZA_SIZE_TABLERO,
                    touchAction: "manipulation",
                    padding: 0,
                  }}
                  aria-label={pieza ? `Pieza ${pieza.id}` : `Espacio vacío ${pos}`}
                >
                  {pieza ? (
                    <PiezaImagen
                      id={pieza.id}
                      size={PIEZA_SIZE_TABLERO - 4}
                      style={{ borderRadius: "10px" }}
                    />
                  ) : (
                    <span className="text-gray-300 text-2xl">+</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Banco de piezas */}
        {banco.length > 0 && (
          <div className="w-full">
            <p className="text-center text-sm text-[#5a3e00] font-semibold mb-2">Piezas disponibles:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {banco.map((pieza, idx) => {
                const esSel = seleccionada?.origen === "banco" && seleccionada.idx === idx;
                const brilla = piezasBrillando.includes(idx);
                return (
                  <button
                    key={`banco-${pieza.id}`}
                    onClick={() => clickBanco(idx)}
                    className={`rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95
                      ${esSel ? "border-[#FFD93D] scale-110 shadow-xl" : "border-[#ccc] hover:border-[#B5EAD7]"}
                      ${brilla ? "ring-4 ring-[#D4AAFF] ring-offset-2 animate-pulse" : ""}
                    `}
                    style={{
                      width: PIEZA_SIZE_BANCO,
                      height: PIEZA_SIZE_BANCO,
                      touchAction: "manipulation",
                      padding: 0,
                    }}
                    aria-label={`Pieza ${pieza.id}`}
                  >
                    <PiezaImagen id={pieza.id} size={PIEZA_SIZE_BANCO - 4} style={{ borderRadius: "10px" }} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal victoria */}
      {ganaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in" style={{ fontFamily: "var(--font-fredoka), sans-serif" }}>
            <div className="text-6xl mb-3">🎊</div>
            <h2 className="text-3xl font-bold text-[#1a3d22] mb-3">¡Lo lograste!</h2>
            <div className="bg-[#f0fff8] border border-[#B5EAD7] rounded-2xl p-4 mb-5 text-left text-sm text-[#1a3d22]">
              <p className="font-bold mb-2">Este es un plato balanceado:</p>
              <p>🥦 <span className="font-semibold">50%</span> verduras y frutas</p>
              <p>🍗 <span className="font-semibold">25%</span> proteínas</p>
              <p>🍚 <span className="font-semibold">25%</span> granos integrales</p>
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
