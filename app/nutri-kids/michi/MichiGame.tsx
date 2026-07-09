"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ganador, tableroLleno, getBotMove, type Casilla, type Equipo, type Dificultad } from "@/lib/michi-ai";

const NUTRITIVOS = [
  { emoji: "🌾", nombre: "Quinua" },
  { emoji: "🥑", nombre: "Palta" },
  { emoji: "🍎", nombre: "Manzana" },
  { emoji: "🥦", nombre: "Brócoli" },
];

const CHATARRAS = [
  { emoji: "🍔", nombre: "Hamburguesa" },
  { emoji: "🥤", nombre: "Gaseosa" },
  { emoji: "🍟", nombre: "Papitas" },
  { emoji: "🍩", nombre: "Dona" },
];

type Modo = "1v1" | "bot";
type Pantalla = "modo" | "config" | "jugando" | "fin";

const TABLERO_VACIO: Casilla[] = Array(9).fill(null);

export default function MichiGame() {
  const [pantalla, setPantalla] = useState<Pantalla>("modo");
  const [modo, setModo] = useState<Modo>("1v1");
  const [dificultad, setDificultad] = useState<Dificultad>("facil");
  const [iconoNutritivo, setIconoNutritivo] = useState(NUTRITIVOS[0]);
  const [iconoChatarra, setIconoChatarra] = useState(CHATARRAS[0]);

  const [tablero, setTablero] = useState<Casilla[]>(TABLERO_VACIO);
  const [turno, setTurno] = useState<Equipo>("nutritivo");
  const [resultado, setResultado] = useState<{ equipo: Equipo | "empate"; linea: number[] | null } | null>(null);
  const [anuncio, setAnuncio] = useState("");

  const iniciarPartida = useCallback(() => {
    setTablero(TABLERO_VACIO);
    setTurno("nutritivo");
    setResultado(null);
    setAnuncio("");
    setPantalla("jugando");
  }, []);

  const jugarCasilla = useCallback(
    (i: number) => {
      if (pantalla !== "jugando" || resultado) return;
      if (tablero[i] !== null) {
        setAnuncio("Esa casilla ya está ocupada.");
        return;
      }
      const nuevoTablero = [...tablero];
      nuevoTablero[i] = turno;
      setTablero(nuevoTablero);

      const gano = ganador(nuevoTablero);
      if (gano) {
        setResultado({ equipo: gano.equipo, linea: gano.linea });
        setAnuncio(
          gano.equipo === "nutritivo" ? "¡Ganaron los alimentos nutritivos!" : "¡Ganó la comida chatarra!"
        );
        setPantalla("fin");
        return;
      }
      if (tableroLleno(nuevoTablero)) {
        setResultado({ equipo: "empate", linea: null });
        setAnuncio("¡Empate!");
        setPantalla("fin");
        return;
      }

      setTurno(turno === "nutritivo" ? "chatarra" : "nutritivo");
    },
    [pantalla, resultado, tablero, turno]
  );

  /* Turno del bot */
  useEffect(() => {
    if (modo !== "bot" || pantalla !== "jugando" || resultado || turno !== "chatarra") return;
    const id = setTimeout(() => {
      const i = getBotMove(tablero, dificultad, "chatarra");
      if (i >= 0) jugarCasilla(i);
    }, 600);
    return () => clearTimeout(id);
  }, [modo, pantalla, resultado, turno, tablero, dificultad, jugarCasilla]);

  const volverAlInicio = () => {
    setPantalla("modo");
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
          <Link
            href="/nutri-kids"
            className="text-[var(--verde-fuerte)] font-semibold text-sm hover:underline"
            style={{ touchAction: "manipulation" }}
          >
            ← Nutri Kids
          </Link>
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">❌⭕ Michi Nutricional</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>
            🏠
          </Link>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {anuncio}
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Selección de modo */}
        {pantalla === "modo" && (
          <div className="bg-white rounded-3xl p-6 shadow-lg text-center bounce-in">
            <h1 className="text-2xl font-bold text-[#1a3d22] mb-4">¿Cómo quieres jugar?</h1>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setModo("1v1");
                  setPantalla("config");
                }}
                className="w-full py-4 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                👫 1 vs 1
              </button>
              <button
                onClick={() => {
                  setModo("bot");
                  setPantalla("config");
                }}
                className="w-full py-4 rounded-full bg-[var(--primrose)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                🤖 vs Computadora
              </button>
            </div>
          </div>
        )}

        {/* Configuración de fichas y dificultad */}
        {pantalla === "config" && (
          <div className="bg-white rounded-3xl p-6 shadow-lg bounce-in">
            <h2 className="text-xl font-bold text-[#1a3d22] mb-3 text-center">
              Jugador 1: elige tu alimento nutritivo
            </h2>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {NUTRITIVOS.map((f) => (
                <button
                  key={f.nombre}
                  onClick={() => setIconoNutritivo(f)}
                  aria-pressed={iconoNutritivo.nombre === f.nombre}
                  aria-label={f.nombre}
                  className={`aspect-square rounded-2xl text-3xl flex items-center justify-center border-2 transition-all ${
                    iconoNutritivo.nombre === f.nombre
                      ? "border-[var(--verde-fuerte)] bg-[#B5EAD7] scale-105"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  style={{ touchAction: "manipulation", minHeight: "44px" }}
                >
                  {f.emoji}
                </button>
              ))}
            </div>

            {modo === "1v1" ? (
              <>
                <h2 className="text-xl font-bold text-[#1a3d22] mb-3 text-center">
                  Jugador 2: elige tu comida chatarra
                </h2>
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {CHATARRAS.map((f) => (
                    <button
                      key={f.nombre}
                      onClick={() => setIconoChatarra(f)}
                      aria-pressed={iconoChatarra.nombre === f.nombre}
                      aria-label={f.nombre}
                      className={`aspect-square rounded-2xl text-3xl flex items-center justify-center border-2 transition-all ${
                        iconoChatarra.nombre === f.nombre
                          ? "border-[var(--primrose)] bg-[#FFAAC9] scale-105"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      style={{ touchAction: "manipulation", minHeight: "44px" }}
                    >
                      {f.emoji}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#1a3d22] mb-3 text-center">Elige la dificultad</h2>
                <div className="flex gap-3 mb-5">
                  <button
                    onClick={() => setDificultad("facil")}
                    aria-pressed={dificultad === "facil"}
                    className={`flex-1 py-3 rounded-full font-semibold border-2 transition-all ${
                      dificultad === "facil"
                        ? "bg-[var(--verde-fuerte)] text-white border-[var(--verde-fuerte)]"
                        : "bg-white text-[#1a3d22] border-gray-300"
                    }`}
                    style={{ touchAction: "manipulation", minHeight: "44px" }}
                  >
                    😊 Fácil
                  </button>
                  <button
                    onClick={() => setDificultad("dificil")}
                    aria-pressed={dificultad === "dificil"}
                    className={`flex-1 py-3 rounded-full font-semibold border-2 transition-all ${
                      dificultad === "dificil"
                        ? "bg-[var(--primrose)] text-white border-[var(--primrose)]"
                        : "bg-white text-[#1a3d22] border-gray-300"
                    }`}
                    style={{ touchAction: "manipulation", minHeight: "44px" }}
                  >
                    🔥 Difícil
                  </button>
                </div>
                <p className="text-sm text-gray-600 text-center mb-5">
                  La computadora jugará con una comida chatarra al azar 🎲
                </p>
              </>
            )}

            <button
              onClick={() => {
                if (modo === "bot") {
                  setIconoChatarra(CHATARRAS[Math.floor(Math.random() * CHATARRAS.length)]);
                }
                iniciarPartida();
              }}
              className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
              style={{ touchAction: "manipulation", minHeight: "44px" }}
            >
              ¡Jugar! 🎮
            </button>
          </div>
        )}

        {/* Tablero */}
        {(pantalla === "jugando" || pantalla === "fin") && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <p className="text-center font-semibold text-[#1a3d22] mb-4">
              {pantalla === "jugando"
                ? `Turno: ${turno === "nutritivo" ? iconoNutritivo.emoji + " " + iconoNutritivo.nombre : iconoChatarra.emoji + " " + iconoChatarra.nombre}`
                : "Partida terminada"}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {tablero.map((casilla, i) => {
                const enLinea = resultado?.linea?.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => jugarCasilla(i)}
                    disabled={pantalla === "fin"}
                    aria-label={
                      casilla === null
                        ? `Casilla ${i + 1}, vacía`
                        : `Casilla ${i + 1}, ocupada por ${casilla === "nutritivo" ? iconoNutritivo.nombre : iconoChatarra.nombre}`
                    }
                    className={`aspect-square rounded-2xl text-4xl flex items-center justify-center border-2 transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--verde-fuerte)] ${
                      enLinea ? "bg-[#FFD93D] border-[#e6c200]" : "bg-[#f5f0e8] border-gray-200"
                    }`}
                    style={{ touchAction: "manipulation", minHeight: "44px" }}
                  >
                    {casilla === "nutritivo" ? iconoNutritivo.emoji : casilla === "chatarra" ? iconoChatarra.emoji : ""}
                    {enLinea && <span className="sr-only"> (parte de la línea ganadora)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Resultado */}
        {pantalla === "fin" && resultado && (
          <div className="mt-4 bg-white rounded-3xl p-6 shadow-2xl text-center bounce-in">
            <div className="text-5xl mb-3">
              {resultado.equipo === "nutritivo" ? "🌟" : resultado.equipo === "chatarra" ? "😋" : "🤝"}
            </div>
            <h2 className="text-2xl font-bold text-[#1a3d22] mb-3">
              {resultado.equipo === "nutritivo"
                ? "¡Ganaron los alimentos nutritivos!"
                : resultado.equipo === "chatarra"
                ? "¡Ganó la comida chatarra!"
                : "¡Empate!"}
            </h2>
            <div className="bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-4 mb-5 text-sm text-[#5a3e00]">
              {resultado.equipo === "nutritivo" &&
                "¡Los alimentos que nutren te dan energía real! Cada uno de estos alimentos ayuda a tu cuerpo a crecer fuerte y sano."}
              {resultado.equipo === "chatarra" &&
                "¡Buena partida! La chatarra es divertida a veces, pero los alimentos que nutren son los que te hacen crecer fuerte. ¿Jugamos de nuevo?"}
              {resultado.equipo === "empate" &&
                "¡Un empate reñido! Tanto los alimentos nutritivos como saber elegir bien son parte de aprender sobre nutrición."}
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={iniciarPartida}
                className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                Jugar de nuevo 🔄
              </button>
              <button
                onClick={volverAlInicio}
                className="w-full py-3 rounded-full border-2 border-[var(--primrose)] text-[var(--primrose)] font-bold text-lg hover:bg-[var(--pinktone)] active:scale-95 transition-all"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                Cambiar modo
              </button>
              <Link
                href="/nutri-kids"
                className="w-full py-3 rounded-full border-2 border-gray-300 text-gray-600 font-bold text-lg hover:bg-gray-50 active:scale-95 transition-all text-center block"
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
