"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ALIMENTOS_SALUDABLES } from "@/data/nutrition-facts";

const CHATARRA = [
  { id: "hamburguesa", emoji: "🍔", nombre: "Hamburguesa" },
  { id: "gaseosa", emoji: "🥤", nombre: "Gaseosa" },
  { id: "papitas", emoji: "🍟", nombre: "Papitas fritas" },
  { id: "dona", emoji: "🍩", nombre: "Dona" },
  { id: "chizitos", emoji: "🧀", nombre: "Chizitos" },
];

const VIDAS_MAX = 3;
const ANCHO_CANASTA = 22; // % de ancho de la zona de captura
const Y_ATRAPE = 88; // % vertical donde se resuelve captura/pérdida
const MAX_PERDIDAS_SALUDABLE = 5;
const MAX_CHATARRA_ATRAPADA = 3;

type Item = {
  id: number;
  tipo: "saludable" | "chatarra";
  alimentoId: string;
  emoji: string;
  nombre: string;
  x: number;
  y: number;
};

type Flotante = { id: number; x: number; y: number; texto: string; tipo: "puntos" | "error" };

type Pantalla = "instrucciones" | "jugando" | "pausado" | "fin";

function Corazones({ vidas }: { vidas: number }) {
  return (
    <span className="text-xl sm:text-2xl leading-none" aria-label={`${vidas} de ${VIDAS_MAX} vidas`}>
      {Array.from({ length: VIDAS_MAX }, (_, i) => (
        <span key={i}>{i < vidas ? "❤️" : "🤍"}</span>
      ))}
    </span>
  );
}

export default function AtrapaSaludableGame() {
  const [pantalla, setPantalla] = useState<Pantalla>("instrucciones");
  const [cestaX, setCestaX] = useState(50);
  const [items, setItems] = useState<Item[]>([]);
  const [flotantes, setFlotantes] = useState<Flotante[]>([]);
  const [puntaje, setPuntaje] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_MAX);
  const [capturados, setCapturados] = useState<Set<string>>(new Set());

  const idRef = useRef(0);
  const cestaXRef = useRef(50);
  const perdidasSaludableRef = useRef(0);
  const atrapadasChatarraRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const ultimoFrameRef = useRef<number | null>(null);
  const ultimoSpawnRef = useRef(0);
  const inicioRef = useRef(0);

  useEffect(() => {
    cestaXRef.current = cestaX;
  }, [cestaX]);

  const siguienteId = () => {
    idRef.current += 1;
    return idRef.current;
  };

  const agregarFlotante = useCallback((x: number, y: number, texto: string, tipo: Flotante["tipo"]) => {
    const id = siguienteId();
    setFlotantes((prev) => [...prev, { id, x, y, texto, tipo }]);
    setTimeout(() => setFlotantes((prev) => prev.filter((f) => f.id !== id)), 800);
  }, []);

  const crearItem = useCallback((): Item => {
    const esSaludable = Math.random() < 0.55;
    if (esSaludable) {
      const alimento = ALIMENTOS_SALUDABLES[Math.floor(Math.random() * ALIMENTOS_SALUDABLES.length)];
      return {
        id: siguienteId(),
        tipo: "saludable",
        alimentoId: alimento.id,
        emoji: alimento.emoji,
        nombre: alimento.nombre,
        x: 8 + Math.random() * 84,
        y: 0,
      };
    }
    const chatarra = CHATARRA[Math.floor(Math.random() * CHATARRA.length)];
    return {
      id: siguienteId(),
      tipo: "chatarra",
      alimentoId: chatarra.id,
      emoji: chatarra.emoji,
      nombre: chatarra.nombre,
      x: 8 + Math.random() * 84,
      y: 0,
    };
  }, []);

  /* Game loop */
  useEffect(() => {
    if (pantalla !== "jugando") {
      ultimoFrameRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const paso = (ahora: number) => {
      if (ultimoFrameRef.current === null) {
        ultimoFrameRef.current = ahora;
        inicioRef.current = ahora;
      }
      const dt = (ahora - ultimoFrameRef.current) / 1000;
      ultimoFrameRef.current = ahora;
      const transcurridoS = (ahora - inicioRef.current) / 1000;
      const velocidad = Math.min(50, 14 + transcurridoS * 0.35); // %/s
      const spawnMs = Math.max(450, 1100 - transcurridoS * 15);

      setItems((prev) => {
        const restantes: Item[] = [];
        for (const it of prev) {
          const nuevoY = it.y + velocidad * dt;

          if (nuevoY >= Y_ATRAPE) {
            const distancia = Math.abs(cestaXRef.current - it.x);
            const atrapado = distancia <= ANCHO_CANASTA / 2;

            if (atrapado) {
              if (it.tipo === "saludable") {
                setPuntaje((p) => p + 10);
                setCapturados((prev) => new Set(prev).add(it.alimentoId));
                agregarFlotante(it.x, Y_ATRAPE, "+10 " + it.emoji, "puntos");
              } else {
                setPuntaje((p) => Math.max(0, p - 5));
                agregarFlotante(it.x, Y_ATRAPE, "-5 " + it.emoji, "error");
                atrapadasChatarraRef.current += 1;
                if (atrapadasChatarraRef.current >= MAX_CHATARRA_ATRAPADA) {
                  atrapadasChatarraRef.current = 0;
                  setVidas((v) => Math.max(0, v - 1));
                }
              }
            } else if (it.tipo === "saludable") {
              perdidasSaludableRef.current += 1;
              if (perdidasSaludableRef.current >= MAX_PERDIDAS_SALUDABLE) {
                perdidasSaludableRef.current = 0;
                setVidas((v) => Math.max(0, v - 1));
              }
            }
            continue;
          }

          restantes.push({ ...it, y: nuevoY });
        }
        return restantes;
      });

      if (ahora - ultimoSpawnRef.current >= spawnMs) {
        ultimoSpawnRef.current = ahora;
        setItems((prev) => (prev.length < 8 ? [...prev, crearItem()] : prev));
      }

      rafRef.current = requestAnimationFrame(paso);
    };

    rafRef.current = requestAnimationFrame(paso);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pantalla, crearItem, agregarFlotante]);

  useEffect(() => {
    if (pantalla === "jugando" && vidas <= 0) {
      setPantalla("fin");
      setItems([]);
    }
  }, [vidas, pantalla]);

  const iniciar = useCallback(() => {
    setItems([]);
    setFlotantes([]);
    setPuntaje(0);
    setVidas(VIDAS_MAX);
    setCapturados(new Set());
    perdidasSaludableRef.current = 0;
    atrapadasChatarraRef.current = 0;
    setCestaX(50);
    ultimoSpawnRef.current = 0;
    ultimoFrameRef.current = null;
    setPantalla("jugando");
  }, []);

  const togglePausa = useCallback(() => {
    setPantalla((p) => (p === "jugando" ? "pausado" : "jugando"));
  }, []);

  const moverCesta = useCallback((delta: number) => {
    setCestaX((x) => Math.min(100, Math.max(0, x + delta)));
  }, []);

  const capturadosLista = ALIMENTOS_SALUDABLES.filter((a) => capturados.has(a.id));
  const datosParaMostrar =
    capturadosLista.length >= 3
      ? capturadosLista.slice(0, 5)
      : [
          ...capturadosLista,
          ...ALIMENTOS_SALUDABLES.filter((a) => !capturados.has(a.id)).slice(0, 3 - capturadosLista.length),
        ];

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
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">🧺 Atrapa Saludable</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>
            🏠
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-4 pb-3 flex items-center justify-between gap-2 text-sm">
          <Corazones vidas={vidas} />
          <span className="bg-[#FFD93D] text-[#5a3e00] px-3 py-1 rounded-full font-semibold whitespace-nowrap">
            Puntaje: {puntaje}
          </span>
          {(pantalla === "jugando" || pantalla === "pausado") && (
            <button
              onClick={togglePausa}
              className="w-9 h-9 rounded-full bg-white border-2 border-[var(--primrose)] text-[var(--primrose)] flex items-center justify-center shrink-0"
              style={{ touchAction: "manipulation" }}
              aria-label={pantalla === "pausado" ? "Reanudar" : "Pausar"}
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
            background: "linear-gradient(180deg, #cdeeff 0%, #eafcff 60%, #f5fff0 100%)",
          }}
        >
          <div className="absolute top-4 left-6 w-16 h-8 bg-white/70 rounded-full blur-[1px]" />
          <div className="absolute top-10 right-10 w-20 h-9 bg-white/60 rounded-full blur-[1px]" />

          {items.map((it) => (
            <span
              key={it.id}
              className="absolute text-3xl sm:text-4xl leading-none pointer-events-none"
              style={{ left: `${it.x}%`, top: `${it.y}%`, transform: "translate(-50%, -50%)" }}
              aria-hidden="true"
            >
              {it.emoji}
            </span>
          ))}

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

          {/* Canasta */}
          <span
            className="absolute text-4xl sm:text-5xl pointer-events-none"
            style={{ left: `${cestaX}%`, bottom: "6%", transform: "translateX(-50%)" }}
            aria-hidden="true"
          >
            🧺
          </span>

          {/* Control accesible: input range nativo (teclado + arrastre) */}
          {(pantalla === "jugando" || pantalla === "pausado") && (
            <input
              type="range"
              min={0}
              max={100}
              step={3}
              value={cestaX}
              onChange={(e) => setCestaX(Number(e.target.value))}
              disabled={pantalla === "pausado"}
              aria-label="Mover canasta hacia la izquierda o derecha"
              className="absolute inset-x-0 bottom-0 w-full h-11 opacity-0 cursor-pointer"
              style={{ touchAction: "none" }}
            />
          )}

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

        {/* Botones de movimiento en pantalla */}
        {(pantalla === "jugando" || pantalla === "pausado") && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => moverCesta(-10)}
              disabled={pantalla === "pausado"}
              aria-label="Mover canasta a la izquierda"
              className="w-14 h-14 rounded-full bg-white border-2 border-[var(--verde-fuerte)] text-2xl text-[var(--verde-fuerte)] flex items-center justify-center active:scale-95 transition-all"
              style={{ touchAction: "manipulation", minHeight: "44px", minWidth: "44px" }}
            >
              ◀
            </button>
            <button
              onClick={() => moverCesta(10)}
              disabled={pantalla === "pausado"}
              aria-label="Mover canasta a la derecha"
              className="w-14 h-14 rounded-full bg-white border-2 border-[var(--verde-fuerte)] text-2xl text-[var(--verde-fuerte)] flex items-center justify-center active:scale-95 transition-all"
              style={{ touchAction: "manipulation", minHeight: "44px", minWidth: "44px" }}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* Modal instrucciones */}
      {pantalla === "instrucciones" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in">
            <h2 className="text-2xl font-bold text-[#1a3d22] mb-3">🧺 Atrapa Saludable</h2>
            <p className="text-lg text-[#3a3a3a] mb-2">
              Mueve la canasta con ← → , arrastrando o con los botones.
            </p>
            <p className="text-lg text-[#3a3a3a] mb-2">
              ✅ Atrapa los alimentos que nutren: quinua, camote, lúcuma y más.
            </p>
            <p className="text-lg text-[#3a3a3a] mb-4">
              🍔 Deja caer la comida de vez en cuando, ¡no la atrapes!
            </p>
            <p className="text-[#5a3e00] bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-3 mb-5 font-semibold text-sm">
              Tienes 3 vidas. Pierdes una si dejas caer 5 alimentos saludables o atrapas 3 comidas de vez en cuando.
            </p>
            <button
              onClick={iniciar}
              className="w-full py-3 rounded-full bg-[var(--verde-fuerte)] text-white font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
              style={{ touchAction: "manipulation", minHeight: "44px" }}
            >
              ¡Comenzar! 🎮
            </button>
          </div>
        </div>
      )}

      {/* Modal fin */}
      {pantalla === "fin" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in max-h-[85vh] overflow-y-auto">
            <div className="text-6xl mb-3">🌟</div>
            <h2 className="text-2xl font-bold text-[#1a3d22] mb-2">¡Buen juego!</h2>
            <p className="text-lg text-[#3a3a3a] mb-4">
              Puntaje final: <span className="font-bold text-[var(--verde-fuerte)]">{puntaje}</span>
            </p>
            <h3 className="font-bold text-[#1a3d22] mb-2 text-left">Alimentos que aprendiste hoy:</h3>
            <div className="flex flex-col gap-2 mb-5 text-left">
              {datosParaMostrar.map((a) => (
                <div key={a.id} className="bg-[#fff8e1] border border-[#FFD93D] rounded-2xl p-3 text-sm text-[#5a3e00]">
                  <span className="font-bold">{a.emoji} {a.nombre}:</span> {a.dato}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={iniciar}
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
        </div>
      )}
    </main>
  );
}
