"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const COLORES_OPCIONES = [
  "bg-[#FFD93D] text-[#5a3e00] border-[#e6c200]",
  "bg-[#FFAAC9] text-[#6a1a35] border-[#f07ba0]",
  "bg-[#AEE6FF] text-[#1a3d55] border-[#7ac8f0]",
  "bg-[#B5EAD7] text-[#1a3d22] border-[#6fc8a0]",
];

const PREGUNTAS = [
  {
    pregunta: "¿Cuántos colores de frutas y verduras debes comer al día?",
    opciones: ["1 color", "3 colores", "5 colores", "10 colores"],
    correcta: 2,
    explicacion: "¡5 colores al día te dan todas las vitaminas que necesitas! 🌈",
  },
  {
    pregunta: "¿Cuál de estos alimentos es un superalimento peruano?",
    opciones: ["Quinua", "Manzana", "Pan blanco", "Galleta"],
    correcta: 0,
    explicacion: "La quinua es originaria de los Andes y es súper nutritiva. 🇵🇪",
  },
  {
    pregunta: "¿Qué fruta tiene más vitamina C?",
    opciones: ["Banana", "Naranja", "Manzana", "Uva"],
    correcta: 1,
    explicacion: "La naranja es famosa por su vitamina C que fortalece tus defensas. 🍊",
  },
  {
    pregunta: "¿Cuántos vasos de agua debes tomar al día?",
    opciones: ["1 vaso", "4 vasos", "8 vasos", "15 vasos"],
    correcta: 2,
    explicacion: "8 vasos de agua al día mantienen tu cuerpo hidratado y saludable. 💧",
  },
  {
    pregunta: "¿Cuál NO es un alimento saludable?",
    opciones: ["Brócoli", "Hamburguesa con papas fritas", "Palta", "Pescado"],
    correcta: 1,
    explicacion: "Las hamburguesas con papas fritas tienen mucha grasa y sal, ¡evítalas! 🚫",
  },
  {
    pregunta: "¿Qué te da más energía para jugar?",
    opciones: ["Caramelos", "Avena con frutas", "Gaseosa", "Chocolate"],
    correcta: 1,
    explicacion: "La avena con frutas da energía duradera para jugar todo el día. ⚡",
  },
  {
    pregunta: "¿Qué color de verdura te da más hierro?",
    opciones: ["Amarillo", "Rojo", "Verde oscuro", "Blanco"],
    correcta: 2,
    explicacion: "Las verduras verdes oscuras como la espinaca tienen mucho hierro para tu sangre. 🥬",
  },
  {
    pregunta: "¿Cuántas comidas debes hacer al día?",
    opciones: ["1 comida", "2 comidas", "5 comidas", "10 comidas"],
    correcta: 2,
    explicacion: "5 comidas al día (desayuno, media mañana, almuerzo, merienda y cena) es lo ideal. 🍽️",
  },
  {
    pregunta: "¿Qué alimento te ayuda a crecer fuerte?",
    opciones: ["Leche y huevos", "Galletas", "Helado", "Soda"],
    correcta: 0,
    explicacion: "La leche y los huevos tienen proteínas y calcio para crecer fuerte. 🥛🥚",
  },
  {
    pregunta: "¿Cuándo debes desayunar?",
    opciones: ["Apenas te levantas", "Al mediodía", "En la noche", "Nunca"],
    correcta: 0,
    explicacion: "¡El desayuno es la comida más importante! Dale energía a tu cerebro por la mañana. 🌅",
  },
];

function getMensajeFinal(puntaje: number) {
  if (puntaje >= 90) return { texto: "¡Eres un Súper Nutri Detective! 🦸", color: "text-[#1a7a34]" };
  if (puntaje >= 70) return { texto: "¡Muy bien, sabes mucho de nutrición! ⭐", color: "text-[#0070c0]" };
  if (puntaje >= 50) return { texto: "¡Buen trabajo! Sigue aprendiendo. 💪", color: "text-[#e65c00]" };
  return { texto: "¡No te rindas! Practica de nuevo. 🌱", color: "text-[var(--primrose)]" };
}

const COLORES = ["#FFD93D", "#FF6B6B", "#AEE6FF", "#B5EAD7", "#FFAAC9", "#D4AAFF", "#FF9A3C"];
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
            background: COLORES[i % COLORES.length],
            "--cdur": `${2 + Math.random() * 2}s`,
            "--cdel": `${Math.random() * 1}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export default function Trivia() {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null);
  const [mostrandoFeedback, setMostrandoFeedback] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const reiniciar = useCallback(() => {
    setPreguntaActual(0);
    setPuntaje(0);
    setRespuestaSeleccionada(null);
    setMostrandoFeedback(false);
    setJuegoTerminado(false);
  }, []);

  const responder = useCallback(
    (idx: number) => {
      if (mostrandoFeedback) return;
      setRespuestaSeleccionada(idx);
      setMostrandoFeedback(true);
      const correcta = PREGUNTAS[preguntaActual].correcta === idx;
      if (correcta) setPuntaje((p) => p + 10);

      setTimeout(() => {
        if (preguntaActual + 1 >= PREGUNTAS.length) {
          setJuegoTerminado(true);
        } else {
          setPreguntaActual((p) => p + 1);
          setRespuestaSeleccionada(null);
          setMostrandoFeedback(false);
        }
      }, 1800);
    },
    [mostrandoFeedback, preguntaActual]
  );

  const p = PREGUNTAS[preguntaActual];
  const puntajeFinal = puntaje;
  const { texto: mensajeFinal, color: colorFinal } = getMensajeFinal(puntajeFinal);
  const progreso = ((preguntaActual + (juegoTerminado ? 1 : 0)) / PREGUNTAS.length) * 100;

  return (
    <main
      className="min-h-screen pb-10"
      style={{
        background: "linear-gradient(135deg, #f5f0e8 0%, #fff8e1 50%, #f0fff8 100%)",
        fontFamily: "var(--font-fredoka), sans-serif",
      }}
    >
      {juegoTerminado && puntajeFinal >= 70 && <Confetti />}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#FFAAC9]/40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/nutri-kids" className="text-[var(--verde-fuerte)] font-semibold text-sm hover:underline" style={{ touchAction: "manipulation" }}>
            ← Nutri Kids
          </Link>
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">❓ Trivia Nutri</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>🏠</Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {!juegoTerminado ? (
          <>
            {/* Progreso */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-[#5a3e00] mb-1 font-semibold">
                <span>Pregunta {preguntaActual + 1} de {PREGUNTAS.length}</span>
                <span>Puntos: {puntaje}</span>
              </div>
              <div className="w-full h-3 bg-[#f0e8d0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--verde-fuerte)] rounded-full transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>

            {/* Tarjeta de pregunta */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-5">
              <p className="text-xl md:text-2xl font-bold text-[#1a3d22] text-center leading-snug">
                {p.pregunta}
              </p>
            </div>

            {/* Opciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {p.opciones.map((op, idx) => {
                let extra = "";
                if (mostrandoFeedback) {
                  if (idx === p.correcta) extra = "ring-4 ring-green-500 scale-105";
                  else if (idx === respuestaSeleccionada) extra = "ring-4 ring-red-400 opacity-60";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => responder(idx)}
                    disabled={mostrandoFeedback}
                    className={`w-full py-4 px-5 rounded-2xl border-2 text-left text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${COLORES_OPCIONES[idx]} ${extra}`}
                    style={{ touchAction: "manipulation", minHeight: "56px" }}
                  >
                    <span className="mr-2">{["A", "B", "C", "D"][idx]}.</span>
                    {op}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {mostrandoFeedback && (
              <div
                className={`rounded-2xl p-4 text-center text-base font-semibold bounce-in ${
                  respuestaSeleccionada === p.correcta
                    ? "bg-[#B5EAD7] text-[#1a3d22]"
                    : "bg-[#FFAAC9] text-[#6a1a35]"
                }`}
              >
                {respuestaSeleccionada === p.correcta ? "¡Correcto! 🎉 " : "¡Casi! 😅 "}
                {p.explicacion}
              </div>
            )}
          </>
        ) : (
          /* Pantalla final */
          <div className="text-center bounce-in">
            <div className="text-7xl mb-4">{puntajeFinal >= 70 ? "🏆" : "🌱"}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3d22] mb-2">
              {mensajeFinal}
            </h2>
            <p className={`text-2xl font-bold mb-6 ${colorFinal}`}>
              Obtuviste {puntajeFinal}/100 puntos
            </p>
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
              <div className="text-5xl mb-3">
                {puntajeFinal >= 90 ? "🦸" : puntajeFinal >= 70 ? "⭐" : puntajeFinal >= 50 ? "💪" : "🌱"}
              </div>
              <p className="text-lg text-[#3a3a3a]">
                {puntajeFinal >= 90
                  ? "¡Increíble! Eres un experto en nutrición saludable."
                  : puntajeFinal >= 70
                  ? "¡Muy buen trabajo! Sabes mucho sobre alimentación."
                  : puntajeFinal >= 50
                  ? "¡Buen intento! Practica más para mejorar."
                  : "No te rindas, aprender de nutrición es divertido."}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={reiniciar}
                className="w-full py-4 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-xl hover:opacity-90 active:scale-95 transition-all"
                style={{ touchAction: "manipulation" }}
              >
                Jugar de nuevo 🔄
              </button>
              <Link
                href="/nutri-kids"
                className="w-full py-4 rounded-full border-2 border-[var(--primrose)] text-[var(--primrose)] font-bold text-xl hover:bg-[var(--pinktone)] active:scale-95 transition-all text-center block"
                style={{ touchAction: "manipulation" }}
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
