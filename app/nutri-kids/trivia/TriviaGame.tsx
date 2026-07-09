"use client";

import { useState } from "react";
import Link from "next/link";
import { preguntasPorDificultad, type Dificultad, type Pregunta } from "@/data/trivia-questions";
import { sampleWithoutReplacement } from "@/lib/shuffle";

const COLORES_OPCIONES = [
  "bg-[#FFD93D] text-[#5a3e00] border-[#e6c200]",
  "bg-[#FFAAC9] text-[#6a1a35] border-[#f07ba0]",
  "bg-[#AEE6FF] text-[#1a3d55] border-[#7ac8f0]",
  "bg-[#B5EAD7] text-[#1a3d22] border-[#6fc8a0]",
];

const NIVELES: { id: Dificultad; nombre: string; rango: string; emoji: string }[] = [
  { id: "facil", nombre: "Fácil", rango: "6-8 años", emoji: "🌱" },
  { id: "medio", nombre: "Medio", rango: "9-10 años", emoji: "🌿" },
  { id: "dificil", nombre: "Difícil", rango: "11-12 años", emoji: "🌳" },
];

const PREGUNTAS_POR_SESION = 10;

type Pantalla = "dificultad" | "jugando" | "fin";

export default function TriviaGame() {
  const [pantalla, setPantalla] = useState<Pantalla>("dificultad");
  const [preguntasSesion, setPreguntasSesion] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [falladas, setFalladas] = useState<Pregunta[]>([]);

  const elegirDificultad = (dificultad: Dificultad) => {
    const banco = preguntasPorDificultad(dificultad);
    setPreguntasSesion(sampleWithoutReplacement(banco, PREGUNTAS_POR_SESION));
    setIndice(0);
    setPuntaje(0);
    setSeleccion(null);
    setFalladas([]);
    setPantalla("jugando");
  };

  const preguntaActual = preguntasSesion[indice];

  const responder = (opcionIdx: number) => {
    if (seleccion !== null) return;
    setSeleccion(opcionIdx);
    if (opcionIdx === preguntaActual.correcta) {
      setPuntaje((p) => p + 10);
    } else {
      setFalladas((f) => [...f, preguntaActual]);
    }
  };

  const siguiente = () => {
    if (indice + 1 >= preguntasSesion.length) {
      setPantalla("fin");
      return;
    }
    setIndice((i) => i + 1);
    setSeleccion(null);
  };

  const reiniciar = () => {
    setPantalla("dificultad");
  };

  return (
    <main
      className="min-h-screen pb-10"
      style={{
        background: "linear-gradient(135deg, #f5f0e8 0%, #e8f7ff 60%, #fff8e1 100%)",
        fontFamily: "var(--font-fredoka), sans-serif",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#FFD93D]/40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <Link href="/nutri-kids" className="text-[var(--verde-fuerte)] font-semibold text-sm hover:underline" style={{ touchAction: "manipulation" }}>
            ← Nutri Kids
          </Link>
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">❓ Trivia Nutri</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>
            🏠
          </Link>
        </div>
        {pantalla === "jugando" && (
          <div className="max-w-2xl mx-auto px-4 pb-3 flex justify-center gap-4 text-sm">
            <span className="bg-[#FFD93D] text-[#5a3e00] px-3 py-1 rounded-full font-semibold">
              Pregunta {indice + 1}/{preguntasSesion.length}
            </span>
            <span className="bg-[#B5EAD7] text-[#1a3d22] px-3 py-1 rounded-full font-semibold">
              Puntaje: {puntaje}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Selección de dificultad */}
        {pantalla === "dificultad" && (
          <div className="bg-white rounded-3xl p-6 shadow-lg text-center bounce-in">
            <h1 className="text-2xl font-bold text-[#1a3d22] mb-4">Elige tu nivel</h1>
            <div className="flex flex-col gap-3">
              {NIVELES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => elegirDificultad(n.id)}
                  className="w-full py-4 rounded-2xl bg-[#f5f0e8] border-2 border-gray-200 hover:border-[var(--verde-fuerte)] hover:bg-[#B5EAD7]/40 transition-all flex items-center justify-between px-5"
                  style={{ touchAction: "manipulation", minHeight: "44px" }}
                >
                  <span className="text-2xl">{n.emoji}</span>
                  <span className="font-bold text-lg text-[#1a3d22]">{n.nombre}</span>
                  <span className="text-sm text-gray-500">{n.rango}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pregunta actual */}
        {pantalla === "jugando" && preguntaActual && (
          <div className="bg-white rounded-3xl p-6 shadow-lg bounce-in">
            <h2 className="text-xl font-bold text-[#1a3d22] mb-5 text-center">{preguntaActual.pregunta}</h2>
            <div className="grid grid-cols-1 gap-3 mb-4">
              {preguntaActual.opciones.map((opcion, i) => {
                const esCorrecta = i === preguntaActual.correcta;
                const esSeleccionada = i === seleccion;
                let estilo = COLORES_OPCIONES[i];
                if (seleccion !== null) {
                  if (esCorrecta) estilo = "bg-[#B5EAD7] text-[#1a3d22] border-[#2fa25c] correct-glow";
                  else if (esSeleccionada) estilo = "bg-red-100 text-red-700 border-red-400 shake";
                  else estilo = "bg-gray-100 text-gray-400 border-gray-200";
                }
                return (
                  <button
                    key={i}
                    onClick={() => responder(i)}
                    disabled={seleccion !== null}
                    aria-pressed={esSeleccionada}
                    className={`w-full py-3 px-4 rounded-2xl border-2 font-semibold text-left transition-all ${estilo}`}
                    style={{ touchAction: "manipulation", minHeight: "44px" }}
                  >
                    {seleccion !== null && esCorrecta && "✅ "}
                    {seleccion !== null && esSeleccionada && !esCorrecta && "❌ "}
                    {opcion}
                  </button>
                );
              })}
            </div>

            {seleccion !== null && (
              <div aria-live="polite" className="bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-4 mb-4 text-sm text-[#5a3e00]">
                💡 {preguntaActual.explicacion}
              </div>
            )}

            {seleccion !== null && (
              <button
                onClick={siguiente}
                className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                {indice + 1 >= preguntasSesion.length ? "Ver resultado 🏁" : "Siguiente ➡️"}
              </button>
            )}
          </div>
        )}

        {/* Resultado final */}
        {pantalla === "fin" && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl text-center bounce-in">
            <div className="text-6xl mb-3">{puntaje >= 80 ? "🏆" : puntaje >= 50 ? "🌟" : "💪"}</div>
            <h2 className="text-2xl font-bold text-[#1a3d22] mb-2">¡Trivia completada!</h2>
            <p className="text-lg text-[#3a3a3a] mb-5">
              Puntaje: <span className="font-bold text-[var(--verde-fuerte)]">{puntaje}</span> de{" "}
              {preguntasSesion.length * 10}
            </p>

            {falladas.length > 0 && (
              <div className="text-left mb-5">
                <h3 className="font-bold text-[#1a3d22] mb-2">Repasemos lo que falló:</h3>
                <div className="flex flex-col gap-2">
                  {falladas.map((p) => (
                    <div key={p.id} className="bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-3 text-sm text-[#5a3e00]">
                      <p className="font-semibold mb-1">{p.pregunta}</p>
                      <p>
                        ✅ {p.opciones[p.correcta]} — {p.explicacion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={reiniciar}
                className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                Jugar de nuevo 🔄
              </button>
              <Link
                href="/nutri-kids"
                className="w-full py-3 rounded-full border-2 border-[var(--primrose)] text-[var(--primrose)] font-bold text-lg hover:bg-[var(--pinktone)] active:scale-95 transition-all text-center block"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                Volver a Nutri Kids 🎮
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
