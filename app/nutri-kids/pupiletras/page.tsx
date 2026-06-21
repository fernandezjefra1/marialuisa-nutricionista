"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const PALABRAS_LIST = [
  "MANZANA", "BROCOLI", "ZANAHORIA", "ESPINACA",
  "QUINUA", "PALTA", "FRESA", "LECHUGA",
];
const COLORES_PALABRAS = [
  "#FFD93D", "#FF9A3C", "#AEE6FF", "#B5EAD7",
  "#FFAAC9", "#D4AAFF", "#FF6B6B", "#74C0FC",
];

type Celda = { letra: string; color?: string };
type PalabraInfo = {
  palabra: string;
  celdas: [number, number][];   // posiciones exactas de cada letra
  encontrada: boolean;
  color: string;
};

const SIZE = 10;
const DIRS: [number, number][] = [
  [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1],
];

function letraRandom() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

/* ── Algoritmo robusto: genera un grid vacío, coloca cada palabra
   verificando límites Y conflictos de letras, rellena el resto con
   letras aleatorias. Reintenta hasta 100 veces si no caben todas. ── */
function generarGrid(): { grid: Celda[][]; palabras: PalabraInfo[] } {
  const MAX_GLOBAL = 100;

  for (let intGlobal = 0; intGlobal < MAX_GLOBAL; intGlobal++) {
    const raw: string[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
    const palabrasInfo: PalabraInfo[] = [];
    let todasOk = true;

    for (let wi = 0; wi < PALABRAS_LIST.length; wi++) {
      const palabra = PALABRAS_LIST[wi];
      let colocada = false;

      for (let intento = 0; intento < 200 && !colocada; intento++) {
        const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
        const fila = Math.floor(Math.random() * SIZE);
        const col  = Math.floor(Math.random() * SIZE);

        const celdas: [number, number][] = [];
        let valido = true;

        for (let i = 0; i < palabra.length; i++) {
          const r = fila + dr * i;
          const c = col  + dc * i;
          if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) { valido = false; break; }
          const existente = raw[r][c];
          // Solo es conflicto si la celda ya tiene UNA LETRA DISTINTA
          if (existente !== "" && existente !== palabra[i])  { valido = false; break; }
          celdas.push([r, c]);
        }

        if (valido) {
          for (let i = 0; i < palabra.length; i++) {
            raw[celdas[i][0]][celdas[i][1]] = palabra[i];
          }
          palabrasInfo.push({
            palabra,
            celdas,
            encontrada: false,
            color: COLORES_PALABRAS[wi],
          });
          colocada = true;
        }
      }

      if (!colocada) { todasOk = false; break; }
    }

    if (todasOk) {
      const grid: Celda[][] = raw.map(fila =>
        fila.map(letra => ({ letra: letra || letraRandom() }))
      );
      return { grid, palabras: palabrasInfo };
    }
  }

  // Fallback teórico (nunca debería ocurrir con SIZE=10 y 8 palabras)
  console.error("No se pudo generar el grid después de 100 intentos");
  return {
    grid: Array.from({ length: SIZE }, () =>
      Array.from({ length: SIZE }, () => ({ letra: letraRandom() }))
    ),
    palabras: PALABRAS_LIST.map((palabra, i) => ({
      palabra, celdas: [], encontrada: false, color: COLORES_PALABRAS[i],
    })),
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
export default function Pupiletras() {
  const [grid, setGrid]               = useState<Celda[][]>([]);
  const [palabras, setPalabras]       = useState<PalabraInfo[]>([]);
  const [seleccionadas, setSelec]     = useState<[number, number][]>([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [tiempo, setTiempo]           = useState(0);
  const [ganaste, setGanaste]         = useState(false);
  const [pistasRestantes, setPistas]  = useState(3);
  // Set de ÍNDICES de palabras ya pisteadas en esta ronda
  const [pistasUsadas, setPistasUsadas] = useState<Set<number>>(new Set());
  // Celdas actualmente iluminadas por una pista
  const [celdasPista, setCeldasPista] = useState<[number, number][]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  const reiniciar = useCallback(() => {
    const { grid: g, palabras: p } = generarGrid();
    setGrid(g);
    setPalabras(p);
    setSelec([]);
    setArrastrando(false);
    setTiempo(0);
    setGanaste(false);
    setPistas(3);
    setPistasUsadas(new Set());
    setCeldasPista([]);
  }, []);

  useEffect(() => { reiniciar(); }, [reiniciar]);

  useEffect(() => {
    if (ganaste) return;
    const id = setInterval(() => setTiempo(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [ganaste]);

  const formatTiempo = (s: number) => {
    const m  = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  /* ── Drag / Selección ── */
  const getCeldaDesdeEl = (el: Element | null): [number, number] | null => {
    if (!el) return null;
    const r = el.getAttribute("data-row");
    const c = el.getAttribute("data-col");
    if (r === null || c === null) return null;
    return [parseInt(r), parseInt(c)];
  };

  const iniciarSeleccion = useCallback((r: number, c: number) => {
    setArrastrando(true);
    setSelec([[r, c]]);
  }, []);

  const extenderSeleccion = useCallback((r: number, c: number) => {
    if (!arrastrando) return;
    setSelec(prev => {
      if (prev.length === 0) return [[r, c]];
      const [ir, ic] = prev[0];
      const dr = Math.sign(r - ir);
      const dc = Math.sign(c - ic);
      if (dr === 0 && dc === 0) return [prev[0]];
      const nuevas: [number, number][] = [];
      let cr = ir, cc = ic;
      while (true) {
        if (cr < 0 || cr >= SIZE || cc < 0 || cc >= SIZE) break;
        nuevas.push([cr, cc]);
        if (cr === r && cc === c) break;
        cr += dr;
        cc += dc;
      }
      return nuevas.length > 0 ? nuevas : [prev[0]];
    });
  }, [arrastrando]);

  const confirmarSeleccion = useCallback(() => {
    if (!arrastrando) return;
    setArrastrando(false);
    setSelec(sel => {
      if (sel.length === 0) return [];
      const letras    = sel.map(([r, c]) => grid[r]?.[c]?.letra ?? "").join("");
      const letrasRev = [...letras].reverse().join("");

      setPalabras(prev => {
        const actualizado = prev.map(pw => {
          if (pw.encontrada) return pw;
          if (pw.palabra === letras || pw.palabra === letrasRev) {
            setGrid(g =>
              g.map((fila, ri) =>
                fila.map((celda, ci) =>
                  sel.some(([r, c]) => r === ri && c === ci)
                    ? { ...celda, color: pw.color }
                    : celda
                )
              )
            );
            return { ...pw, encontrada: true };
          }
          return pw;
        });
        if (actualizado.every(p => p.encontrada)) {
          setTimeout(() => setGanaste(true), 400);
        }
        return actualizado;
      });
      return [];
    });
  }, [arrastrando, grid]);

  /* ── Touch handlers ── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const pos = getCeldaDesdeEl(el);
    if (pos) iniciarSeleccion(pos[0], pos[1]);
  }, [iniciarSeleccion]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const pos = getCeldaDesdeEl(el);
    if (pos) extenderSeleccion(pos[0], pos[1]);
  }, [extenderSeleccion]);

  /* ── Sistema de pistas rotativo ── */
  const usarPista = useCallback(() => {
    if (pistasRestantes <= 0) return;

    // Candidatas: no encontradas, tienen posición, y NO fueron pisteadas esta ronda
    const candidatas = palabras
      .map((p, i) => ({ p, i }))
      .filter(({ p, i }) => !p.encontrada && p.celdas.length > 0 && !pistasUsadas.has(i));

    let elegida: PalabraInfo;
    let idxElegido: number;

    if (candidatas.length === 0) {
      // Ya pisteamos todas las no encontradas → resetear ciclo
      const noEncontradas = palabras
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => !p.encontrada && p.celdas.length > 0);
      if (noEncontradas.length === 0) return;
      const pick = noEncontradas[Math.floor(Math.random() * noEncontradas.length)];
      elegida   = pick.p;
      idxElegido = pick.i;
      setPistasUsadas(new Set([idxElegido]));
    } else {
      const pick = candidatas[Math.floor(Math.random() * candidatas.length)];
      elegida    = pick.p;
      idxElegido = pick.i;
      setPistasUsadas(prev => new Set([...prev, idxElegido]));
    }

    setPistas(prev => prev - 1);
    setCeldasPista([elegida.celdas[0]]);
    setTimeout(() => setCeldasPista([]), 2000);
  }, [pistasRestantes, palabras, pistasUsadas]);

  const encontradas       = palabras.filter(p => p.encontrada).length;
  const estaSeleccionada  = (r: number, c: number) => seleccionadas.some(([sr, sc]) => sr === r && sc === c);
  const esPista           = (r: number, c: number) => celdasPista.some(([pr, pc]) => pr === r && pc === c);

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <main
      className="min-h-screen pb-10"
      style={{
        background: "linear-gradient(135deg, #f5f0e8 0%, #e8f7ff 60%, #f0fff8 100%)",
        fontFamily: "var(--font-fredoka), sans-serif",
      }}
    >
      {ganaste && <Confetti />}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#AEE6FF]/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/nutri-kids" className="text-[var(--verde-fuerte)] font-semibold text-sm hover:underline" style={{ touchAction: "manipulation" }}>
            ← Nutri Kids
          </Link>
          <span className="text-xl font-bold text-[#1a3d22] flex-1 text-center">🔤 Pupiletras</span>
          <Link href="/" className="text-xs text-[var(--primrose)] hover:underline" style={{ touchAction: "manipulation" }}>🏠</Link>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-3 flex flex-wrap justify-center gap-3 text-sm">
          <span className="bg-[#AEE6FF] text-[#1a3d55] px-3 py-1 rounded-full font-semibold">
            Palabras: {encontradas}/{palabras.length}
          </span>
          <span className="bg-[#FFD93D] text-[#5a3e00] px-3 py-1 rounded-full font-semibold">
            Tiempo: {formatTiempo(tiempo)}
          </span>
          <button
            onClick={usarPista}
            disabled={pistasRestantes === 0}
            className="bg-[#D4AAFF] text-[#3a1a6a] px-3 py-1 rounded-full font-semibold disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
            style={{ touchAction: "manipulation" }}
          >
            💡 Pista ({pistasRestantes}/3)
          </button>
          <button
            onClick={reiniciar}
            className="bg-[var(--primrose)] text-white px-4 py-1 rounded-full font-semibold hover:opacity-90 active:scale-95 transition-all"
            style={{ touchAction: "manipulation" }}
          >
            Reiniciar
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 pt-4 flex flex-col lg:flex-row gap-4">
        {/* Lista de palabras */}
        <div className="order-first lg:order-last lg:w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-3">
            <p className="font-bold text-[#1a3d22] text-sm mb-2 text-center">Encuentra:</p>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {palabras.map(pw => (
                <div key={pw.palabra} className="flex items-center gap-2 text-sm font-semibold" style={{ color: pw.encontrada ? "#888" : "#1a3d22" }}>
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: pw.color }} />
                  <span className={pw.encontrada ? "line-through" : ""}>
                    {pw.encontrada ? "✓ " : ""}{pw.palabra}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 flex justify-center">
          <div
            ref={gridRef}
            className="inline-grid gap-0.5 select-none"
            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, touchAction: "none" }}
            onMouseLeave={() => { if (arrastrando) confirmarSeleccion(); }}
            onMouseUp={confirmarSeleccion}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={confirmarSeleccion}
          >
            {grid.map((fila, ri) =>
              fila.map((celda, ci) => {
                const sel   = estaSeleccionada(ri, ci);
                const hint  = esPista(ri, ci);
                const bg    = celda.color
                  ? celda.color + "80"
                  : sel  ? "#FFD93D80"
                  : hint ? "#D4AAFF"
                  : "white";

                return (
                  <div
                    key={`${ri}-${ci}`}
                    data-row={ri}
                    data-col={ci}
                    onMouseDown={() => iniciarSeleccion(ri, ci)}
                    onMouseEnter={() => extenderSeleccion(ri, ci)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded text-xs sm:text-sm font-bold uppercase border cursor-pointer transition-colors duration-100 ${hint ? "ring-2 ring-[#9b59b6] ring-offset-1" : ""}`}
                    style={{
                      background: bg,
                      borderColor: sel ? "#e6c200" : celda.color ? celda.color : "#e0e0e0",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                    }}
                  >
                    {celda.letra}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal victoria */}
      {ganaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl bounce-in" style={{ fontFamily: "var(--font-fredoka), sans-serif" }}>
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-3xl font-bold text-[#1a3d22] mb-2">¡Encontraste todas las palabras!</h2>
            <div className="bg-[#e8f7ff] border border-[#AEE6FF] rounded-2xl p-4 mb-5 text-sm text-[#1a3d55]">
              💡 La quinua es originaria de los Andes peruanos y es uno de los alimentos más nutritivos del mundo. 🇵🇪
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
