"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const PALABRAS_LIST = ["MANZANA", "BROCOLI", "ZANAHORIA", "ESPINACA", "QUINUA", "PALTA", "FRESA", "LECHUGA"];
const COLORES_PALABRAS = [
  "#FFD93D", "#FF9A3C", "#AEE6FF", "#B5EAD7",
  "#FFAAC9", "#D4AAFF", "#FF6B6B", "#74C0FC",
];

type Celda = { letra: string; color?: string };
type PalabraInfo = {
  palabra: string;
  celdas: [number, number][];
  encontrada: boolean;
  color: string;
};

const SIZE = 10;

function letraRandom() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function generarGrid(): { grid: Celda[][]; palabras: PalabraInfo[] } {
  const grid: Celda[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({ letra: letraRandom() }))
  );

  const palabrasInfo: PalabraInfo[] = [];
  const direcciones = [
    [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1],
  ];

  for (let wi = 0; wi < PALABRAS_LIST.length; wi++) {
    const palabra = PALABRAS_LIST[wi];
    let colocada = false;
    let intentos = 0;

    while (!colocada && intentos < 200) {
      intentos++;
      const [dr, dc] = direcciones[Math.floor(Math.random() * direcciones.length)];
      const fila = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);

      const celdas: [number, number][] = [];
      let valido = true;

      for (let i = 0; i < palabra.length; i++) {
        const r = fila + dr * i;
        const c = col + dc * i;
        if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) { valido = false; break; }
        const existente = grid[r][c].letra;
        if (existente !== letraRandom() && existente !== palabra[i]) {
          /* chequear que la celda no ya tiene otra letra incompatible */
        }
        celdas.push([r, c]);
      }

      if (valido) {
        for (let i = 0; i < palabra.length; i++) {
          const [r, c] = celdas[i];
          grid[r][c] = { letra: palabra[i] };
        }
        palabrasInfo.push({ palabra, celdas, encontrada: false, color: COLORES_PALABRAS[wi] });
        colocada = true;
      }
    }

    if (!colocada) {
      palabrasInfo.push({ palabra, celdas: [], encontrada: false, color: COLORES_PALABRAS[wi] });
    }
  }

  return { grid, palabras: palabrasInfo };
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

export default function Pupiletras() {
  const [grid, setGrid] = useState<Celda[][]>([]);
  const [palabras, setPalabras] = useState<PalabraInfo[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<[number, number][]>([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [ganaste, setGanaste] = useState(false);
  const [pistasRestantes, setPistasRestantes] = useState(3);
  const [pista, setPista] = useState<[number, number] | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const reiniciar = useCallback(() => {
    const { grid: g, palabras: p } = generarGrid();
    setGrid(g);
    setPalabras(p);
    setSeleccionadas([]);
    setArrastrando(false);
    setTiempo(0);
    setGanaste(false);
    setPistasRestantes(3);
    setPista(null);
  }, []);

  useEffect(() => { reiniciar(); }, [reiniciar]);

  useEffect(() => {
    if (ganaste) return;
    const id = setInterval(() => setTiempo((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [ganaste]);

  const formatTiempo = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const getCeldaDesdeEl = (el: Element | null): [number, number] | null => {
    if (!el) return null;
    const r = el.getAttribute("data-row");
    const c = el.getAttribute("data-col");
    if (r === null || c === null) return null;
    return [parseInt(r), parseInt(c)];
  };

  const iniciarSeleccion = useCallback((r: number, c: number) => {
    setArrastrando(true);
    setSeleccionadas([[r, c]]);
  }, []);

  const extenderSeleccion = useCallback((r: number, c: number) => {
    if (!arrastrando) return;
    setSeleccionadas((prev) => {
      if (prev.length === 0) return [[r, c]];
      const inicio = prev[0];
      // Calcular dirección
      const dr = Math.sign(r - inicio[0]);
      const dc = Math.sign(c - inicio[1]);
      if (dr === 0 && dc === 0) return [inicio];
      const nuevas: [number, number][] = [];
      let cr = inicio[0], cc = inicio[1];
      while (cr !== r + dr || cc !== c + dc) {
        if (cr < 0 || cr >= SIZE || cc < 0 || cc >= SIZE) break;
        nuevas.push([cr, cc]);
        if (cr === r && cc === c) break;
        cr += dr;
        cc += dc;
      }
      return nuevas.length > 0 ? nuevas : [inicio];
    });
  }, [arrastrando]);

  const confirmarSeleccion = useCallback(() => {
    if (!arrastrando) return;
    setArrastrando(false);

    setSeleccionadas((sel) => {
      if (sel.length === 0) return [];
      const letras = sel.map(([r, c]) => grid[r]?.[c]?.letra ?? "").join("");
      const letrasRev = [...letras].reverse().join("");

      setPalabras((prev) => {
        const actualizado = prev.map((pw) => {
          if (pw.encontrada) return pw;
          if (pw.palabra === letras || pw.palabra === letrasRev) {
            setGrid((g) =>
              g.map((row, ri) =>
                row.map((celda, ci) =>
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

        if (actualizado.every((p) => p.encontrada)) {
          setTimeout(() => setGanaste(true), 400);
        }
        return actualizado;
      });

      return [];
    });
  }, [arrastrando, grid]);

  // Touch handlers
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

  const usarPista = useCallback(() => {
    if (pistasRestantes <= 0) return;
    const noEncontrada = palabras.find((p) => !p.encontrada && p.celdas.length > 0);
    if (!noEncontrada) return;
    setPistasRestantes((p) => p - 1);
    const primeracelda = noEncontrada.celdas[0];
    setPista(primeracelda);
    setTimeout(() => setPista(null), 2000);
  }, [pistasRestantes, palabras]);

  const encontradas = palabras.filter((p) => p.encontrada).length;

  const estaSeleccionada = (r: number, c: number) =>
    seleccionadas.some(([sr, sc]) => sr === r && sc === c);

  const esPista = (r: number, c: number) => pista && pista[0] === r && pista[1] === c;

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
            💡 Pista ({pistasRestantes})
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
        {/* Lista de palabras (mobile: arriba, desktop: derecha) */}
        <div className="order-first lg:order-last lg:w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-3">
            <p className="font-bold text-[#1a3d22] text-sm mb-2 text-center">Encuentra:</p>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {palabras.map((pw) => (
                <div
                  key={pw.palabra}
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: pw.encontrada ? "#888" : "#1a3d22" }}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: pw.color }}
                  />
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
            style={{
              gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
              touchAction: "none",
            }}
            onMouseLeave={() => { if (arrastrando) confirmarSeleccion(); }}
            onMouseUp={confirmarSeleccion}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={confirmarSeleccion}
          >
            {grid.map((fila, ri) =>
              fila.map((celda, ci) => {
                const sel = estaSeleccionada(ri, ci);
                const hint = esPista(ri, ci);
                const bg = celda.color
                  ? celda.color + "80"
                  : sel
                  ? "#FFD93D80"
                  : hint
                  ? "#D4AAFF"
                  : "white";

                return (
                  <div
                    key={`${ri}-${ci}`}
                    data-row={ri}
                    data-col={ci}
                    onMouseDown={() => iniciarSeleccion(ri, ci)}
                    onMouseEnter={() => extenderSeleccion(ri, ci)}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded text-xs sm:text-sm font-bold uppercase border border-gray-200 cursor-pointer transition-colors duration-100"
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
