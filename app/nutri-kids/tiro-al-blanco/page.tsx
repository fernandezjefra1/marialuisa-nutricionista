"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── Datos de alimentos ── */
const CHATARRA = ["🍔", "🍟", "🌭", "🍕", "🥤", "🍬", "🍭", "🍫", "🍩", "🧁"];
const SALUDABLE = ["🍎", "🥦", "🥕", "🍌", "🥑", "🍓", "🥬", "🥒", "🍇", "💧"];

/* ── Configuración de los 10 niveles ── */
type NivelConfig = {
  puntos: number;
  velocidad: number; // px/s (referencia, convertido a %/s)
  spawnRate: number; // ms
  ratioChatarra: number; // % de aparición de chatarra
};

const NIVELES: NivelConfig[] = [
  { puntos: 30, velocidad: 80, spawnRate: 2000, ratioChatarra: 60 },
  { puntos: 50, velocidad: 100, spawnRate: 1800, ratioChatarra: 60 },
  { puntos: 70, velocidad: 130, spawnRate: 1600, ratioChatarra: 55 },
  { puntos: 100, velocidad: 160, spawnRate: 1400, ratioChatarra: 55 },
  { puntos: 130, velocidad: 200, spawnRate: 1200, ratioChatarra: 50 },
  { puntos: 170, velocidad: 250, spawnRate: 1000, ratioChatarra: 50 },
  { puntos: 210, velocidad: 300, spawnRate: 900, ratioChatarra: 45 },
  { puntos: 260, velocidad: 350, spawnRate: 800, ratioChatarra: 45 },
  { puntos: 320, velocidad: 400, spawnRate: 700, ratioChatarra: 40 },
  { puntos: 400, velocidad: 480, spawnRate: 600, ratioChatarra: 40 },
];

const VIDAS_MAX = 3;
const VELOCIDAD_BASE = 8; // divisor px/s → %/s
const VIDA_ALIMENTO_MS = 4500;

type Alimento = {
  id: number;
  emoji: string;
  esChatarra: boolean;
  x: number; // %
  y: number; // %
  velocidadX: number; // %/s
  velocidadY: number; // %/s
  creado: number; // timestamp
  estado: "normal" | "eliminado" | "error";
};

type Flotante = {
  id: number;
  x: number;
  y: number;
  texto: string;
  tipo: "puntos" | "error";
};

type Pantalla =
  | "instrucciones"
  | "jugando"
  | "pausado"
  | "nivel_completado"
  | "game_over"
  | "victoria_total";

/* ── Confetti para la victoria total ── */
const COLORES_CONFETTI = ["#FFD93D", "#FF6B6B", "#AEE6FF", "#B5EAD7", "#FFAAC9", "#D4AAFF", "#FF9A3C"];
function Confetti() {
  const piezas = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {piezas.map((i) => (
        <div
          key={i}
          className="confetti-piece absolute top-0 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 8}px`,
            height: `${10 + Math.random() * 8}px`,
            background: COLORES_CONFETTI[i % COLORES_CONFETTI.length],
            "--cdur": `${2 + Math.random() * 2}s`,
            "--cdel": `${Math.random() * 1}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function Corazones({ vidas }: { vidas: number }) {
  return (
    <span className="text-xl sm:text-2xl leading-none">
      {Array.from({ length: VIDAS_MAX }, (_, i) => (
        <span key={i}>{i < vidas ? "❤️" : "🤍"}</span>
      ))}
    </span>
  );
}

export default function TiroAlBlanco() {
  const [pantalla, setPantalla] = useState<Pantalla>("instrucciones");
  const [nivel, setNivel] = useState(1);
  const [puntajeNivel, setPuntajeNivel] = useState(0);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_MAX);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [flotantes, setFlotantes] = useState<Flotante[]>([]);

  const idRef = useRef(0);
  const nivelRef = useRef(nivel);
  const rafRef = useRef<number | null>(null);
  const ultimoFrameRef = useRef<number | null>(null);
  const ultimoSpawnRef = useRef(0);
  const pantallaRef = useRef<Pantalla>(pantalla);

  const config = NIVELES[nivel - 1];

  useEffect(() => {
    nivelRef.current = nivel;
  }, [nivel]);

  useEffect(() => {
    pantallaRef.current = pantalla;
  }, [pantalla]);

  const siguienteId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  const agregarFlotante = useCallback((x: number, y: number, texto: string, tipo: Flotante["tipo"]) => {
    const id = siguienteId();
    setFlotantes((prev) => [...prev, { id, x, y, texto, tipo }]);
    setTimeout(() => {
      setFlotantes((prev) => prev.filter((f) => f.id !== id));
    }, 800);
  }, []);

  const perderVida = useCallback(() => {
    setVidas((v) => Math.max(0, v - 1));
  }, []);

  const crearAlimento = useCallback((cfg: NivelConfig): Alimento => {
    const esChatarra = Math.random() * 100 < cfg.ratioChatarra;
    const lista = esChatarra ? CHATARRA : SALUDABLE;
    const emoji = lista[Math.floor(Math.random() * lista.length)];
    const angulo = Math.random() * Math.PI * 2;
    const magnitud = cfg.velocidad / VELOCIDAD_BASE;
    return {
      id: siguienteId(),
      emoji,
      esChatarra,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
      velocidadX: Math.cos(angulo) * magnitud,
      velocidadY: Math.sin(angulo) * magnitud,
      creado: performance.now(),
      estado: "normal",
    };
  }, []);

  /* Click sobre un alimento */
  const tocarAlimento = useCallback(
    (alimento: Alimento) => {
      if (alimento.estado !== "normal") return;

      if (alimento.esChatarra) {
        setAlimentos((prev) =>
          prev.map((a) => (a.id === alimento.id ? { ...a, estado: "eliminado" } : a))
        );
        setPuntajeNivel((p) => p + 10);
        setPuntajeTotal((p) => p + 10);
        agregarFlotante(alimento.x, alimento.y, "+10 💥", "puntos");
      } else {
        setAlimentos((prev) =>
          prev.map((a) => (a.id === alimento.id ? { ...a, estado: "error" } : a))
        );
        perderVida();
        agregarFlotante(alimento.x, alimento.y, "❌ ¡Es saludable!", "error");
      }

      setTimeout(() => {
        setAlimentos((prev) => prev.filter((a) => a.id !== alimento.id));
      }, 400);
    },
    [agregarFlotante, perderVida]
  );

  /* Game loop */
  useEffect(() => {
    if (pantalla !== "jugando") {
      ultimoFrameRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const paso = (ahora: number) => {
      if (ultimoFrameRef.current === null) ultimoFrameRef.current = ahora;
      const dt = (ahora - ultimoFrameRef.current) / 1000;
      ultimoFrameRef.current = ahora;

      const cfg = NIVELES[nivelRef.current - 1];

      setAlimentos((prev) => {
        const restantes: Alimento[] = [];
        for (const a of prev) {
          if (a.estado !== "normal") {
            restantes.push(a);
            continue;
          }

          let { x, y, velocidadX, velocidadY } = a;
          x += velocidadX * dt;
          y += velocidadY * dt;

          if (x <= 4 || x >= 96) {
            velocidadX = -velocidadX;
            x = Math.min(96, Math.max(4, x));
          }
          if (y <= 12 || y >= 88) {
            velocidadY = -velocidadY;
            y = Math.min(88, Math.max(12, y));
          }

          const edad = ahora - a.creado;
          if (edad >= VIDA_ALIMENTO_MS) {
            if (a.esChatarra) perderVida();
            continue;
          }

          restantes.push({ ...a, x, y, velocidadX, velocidadY });
        }
        return restantes;
      });

      if (ahora - ultimoSpawnRef.current >= cfg.spawnRate) {
        ultimoSpawnRef.current = ahora;
        setAlimentos((prev) => (prev.length < 10 ? [...prev, crearAlimento(cfg)] : prev));
      }

      rafRef.current = requestAnimationFrame(paso);
    };

    rafRef.current = requestAnimationFrame(paso);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pantalla, crearAlimento, perderVida]);

  /* Chequeo de fin de partida / nivel completado */
  useEffect(() => {
    if (pantalla !== "jugando") return;
    if (vidas <= 0) {
      setPantalla("game_over");
      setAlimentos([]);
    } else if (puntajeNivel >= config.puntos) {
      setPantalla(nivel >= 10 ? "victoria_total" : "nivel_completado");
      setAlimentos([]);
    }
  }, [vidas, puntajeNivel, pantalla, nivel, config.puntos]);

  const iniciarNivel = useCallback(() => {
    setAlimentos([]);
    setFlotantes([]);
    setPuntajeNivel(0);
    ultimoSpawnRef.current = 0;
    ultimoFrameRef.current = null;
    setPantalla("jugando");
  }, []);

  const reintentarNivel = useCallback(() => {
    setVidas(VIDAS_MAX);
    setPuntajeNivel(0);
    setAlimentos([]);
    setFlotantes([]);
    setPantalla("instrucciones");
  }, []);

  const irSiguienteNivel = useCallback(() => {
    setNivel((n) => Math.min(10, n + 1));
    setPantalla("instrucciones");
  }, []);

  const reiniciarTodo = useCallback(() => {
    setNivel(1);
    setVidas(VIDAS_MAX);
    setPuntajeNivel(0);
    setPuntajeTotal(0);
    setAlimentos([]);
    setFlotantes([]);
    setPantalla("instrucciones");
  }, []);

  const togglePausa = useCallback(() => {
    setPantalla((p) => (p === "jugando" ? "pausado" : "jugando"));
  }, []);

  return (
    <main
      className="min-h-screen pb-10"
      style={{
        background: "linear-gradient(135deg, #f5f0e8 0%, #e8f7ff 60%, #fff8e1 100%)",
        fontFamily: "var(--font-fredoka), sans-serif",
      }}
    >
      {pantalla === "victoria_total" && <Confetti />}

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
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">🎯 Tira al Blanco</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>
            🏠
          </Link>
        </div>

        {/* Barra de estado del juego */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex items-center justify-between gap-2 text-sm">
          <Corazones vidas={vidas} />

          <div className="flex-1 flex flex-col items-center gap-1">
            <span className="font-bold text-[#1a3d22]">Nivel {nivel}</span>
            <div className="w-full max-w-[160px] h-2 bg-white rounded-full overflow-hidden border border-[#e6c200]">
              <div
                className="h-full bg-[var(--verde-fuerte)] transition-all duration-300"
                style={{ width: `${Math.min(100, (puntajeNivel / config.puntos) * 100)}%` }}
              />
            </div>
          </div>

          <span className="bg-[#FFD93D] text-[#5a3e00] px-3 py-1 rounded-full font-semibold whitespace-nowrap">
            Puntaje: {puntajeTotal}
          </span>

          {(pantalla === "jugando" || pantalla === "pausado") && (
            <button
              onClick={togglePausa}
              className="w-9 h-9 rounded-full bg-white border-2 border-[var(--primrose)] text-[var(--primrose)] flex items-center justify-center shrink-0"
              style={{ touchAction: "manipulation" }}
              aria-label="Pausar"
            >
              {pantalla === "pausado" ? "▶" : "⏸"}
            </button>
          )}
        </div>
      </div>

      {/* Área de juego */}
      <div className="max-w-2xl mx-auto px-3 pt-5">
        <div
          className="relative w-full aspect-[3/4] sm:aspect-video rounded-3xl overflow-hidden border-4 border-[#AEE6FF] shadow-lg select-none"
          style={{
            touchAction: "manipulation",
            background: "linear-gradient(180deg, #cdeeff 0%, #eafcff 60%, #f5fff0 100%)",
          }}
        >
          {/* Nubes decorativas */}
          <div className="absolute top-4 left-6 w-16 h-8 bg-white/70 rounded-full blur-[1px]" />
          <div className="absolute top-10 right-10 w-20 h-9 bg-white/60 rounded-full blur-[1px]" />
          <div className="absolute bottom-8 left-1/3 w-24 h-10 bg-white/50 rounded-full blur-[1px]" />

          {/* Alimentos */}
          {alimentos.map((a) => (
            <button
              key={a.id}
              onClick={() => tocarAlimento(a)}
              className={`absolute text-4xl sm:text-5xl leading-none cursor-pointer ${
                a.estado === "eliminado" ? "food-pop" : a.estado === "error" ? "shake" : ""
              }`}
              style={{
                left: `${a.x}%`,
                top: `${a.y}%`,
                transform: "translate(-50%, -50%)",
                touchAction: "manipulation",
              }}
              aria-label={a.esChatarra ? "Comida chatarra" : "Comida saludable"}
            >
              {a.emoji}
            </button>
          ))}

          {/* Textos flotantes de puntaje/error */}
          {flotantes.map((f) => (
            <span
              key={f.id}
              className={`absolute font-bold text-lg whitespace-nowrap pointer-events-none float-up-fade ${
                f.tipo === "puntos" ? "text-[var(--verde-fuerte)]" : "text-red-500"
              }`}
              style={{ left: `${f.x}%`, top: `${f.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {f.texto}
            </span>
          ))}

          {/* Overlay de pausa */}
          {pantalla === "pausado" && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4">
              <span className="text-4xl">⏸</span>
              <p className="text-white font-bold text-xl">Pausado</p>
              <button
                onClick={togglePausa}
                className="px-6 py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold"
                style={{ touchAction: "manipulation" }}
              >
                ▶ Continuar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal instrucciones */}
      {pantalla === "instrucciones" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in">
            <h2 className="text-3xl font-bold text-[#1a3d22] mb-3">Nivel {nivel}</h2>
            <p className="text-lg text-[#3a3a3a] mb-2">
              🎯 Toca solo la comida chatarra:
              <br />
              <span className="text-2xl">🍔🍟🍕🥤🍬</span>
            </p>
            <p className="text-lg text-[#3a3a3a] mb-4">
              🚫 NO toques la comida saludable:
              <br />
              <span className="text-2xl">🍎🥦🥕</span>
            </p>
            <p className="text-[#5a3e00] bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-3 mb-5 font-semibold">
              Necesitas {config.puntos} puntos para pasar
            </p>
            <button
              onClick={iniciarNivel}
              className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
              style={{ touchAction: "manipulation" }}
            >
              ¡Comenzar! 🎮
            </button>
          </div>
        </div>
      )}

      {/* Modal nivel completado */}
      {pantalla === "nivel_completado" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in">
            <div className="text-6xl mb-3">⭐</div>
            <h2 className="text-3xl font-bold text-[#1a3d22] mb-2">¡Nivel completado!</h2>
            <p className="text-lg text-[#3a3a3a] mb-1">
              Puntaje: <span className="font-bold text-[var(--verde-fuerte)]">{puntajeTotal}</span>
            </p>
            <p className="text-lg text-[#3a3a3a] mb-5">
              Vidas restantes: <Corazones vidas={vidas} />
            </p>
            <button
              onClick={irSiguienteNivel}
              className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
              style={{ touchAction: "manipulation" }}
            >
              Siguiente nivel ➡️
            </button>
          </div>
        </div>
      )}

      {/* Modal game over */}
      {pantalla === "game_over" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in">
            <div className="text-6xl mb-3">😢</div>
            <h2 className="text-3xl font-bold text-[#1a3d22] mb-2">¡Se acabó!</h2>
            <p className="text-lg text-[#3a3a3a] mb-1">Llegaste al nivel {nivel}</p>
            <p className="text-lg text-[#3a3a3a] mb-4">
              Puntaje total: <span className="font-bold text-[var(--verde-fuerte)]">{puntajeTotal}</span>
            </p>
            <div className="bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-4 mb-5 text-sm text-[#5a3e00]">
              💡 Recuerda: la comida chatarra es fácil de encontrar pero difícil de digerir. ¡La comida
              saludable te da súper poderes! 💪
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={reintentarNivel}
                className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
                style={{ touchAction: "manipulation" }}
              >
                Reintentar nivel 🔄
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

      {/* Modal victoria total */}
      {pantalla === "victoria_total" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in">
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3d22] mb-2">¡ERES UN NUTRI-HÉROE!</h2>
            <p className="text-lg text-[#3a3a3a] mb-4">
              Puntaje total: <span className="font-bold text-[var(--verde-fuerte)]">{puntajeTotal}</span>
            </p>
            <div className="bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-4 mb-5 text-sm text-[#5a3e00]">
              Has demostrado que puedes distinguir la comida chatarra de la saludable. ¡María Luisa está
              orgullosa de ti! 🎉
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={reiniciarTodo}
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
