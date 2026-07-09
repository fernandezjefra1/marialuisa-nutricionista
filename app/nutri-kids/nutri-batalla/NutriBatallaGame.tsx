"use client";

import { useEffect, useReducer } from "react";
import Link from "next/link";
import { HEROES, ENEMIGOS, calcularDano } from "@/data/nutri-batalla";
import HpBar from "./_components/HpBar";
import Fighter from "./_components/Fighter";
import DialogBox from "./_components/DialogBox";
import ActionMenu from "./_components/ActionMenu";

type FighterState = { hp: number; escudoActivo: boolean };

type Fase =
  | "intro"
  | "menu_principal"
  | "submenu_ataque"
  | "submenu_cambio"
  | "submenu_info"
  | "turno_enemigo_pendiente"
  | "victoria"
  | "derrota";

type BatallaState = {
  fase: Fase;
  heroes: FighterState[];
  enemigos: FighterState[];
  heroeActivoIdx: number;
  enemigoActivoIdx: number;
  dialogo: string;
  datosAprendidos: string[];
};

type BatallaAction =
  | { type: "INICIAR" }
  | { type: "ABRIR_ATAQUE" }
  | { type: "ABRIR_CAMBIO" }
  | { type: "ABRIR_INFO" }
  | { type: "VOLVER" }
  | { type: "USAR_MOVIMIENTO"; movIndex: 0 | 1 }
  | { type: "CAMBIAR_HEROE"; idx: number }
  | { type: "ENEMIGO_ATACA"; movIndex: 0 | 1 }
  | { type: "RENDIRSE" }
  | { type: "REINICIAR" };

function siguienteVivo(fighters: FighterState[]): number {
  return fighters.findIndex((f) => f.hp > 0);
}

function estadoInicial(): BatallaState {
  return {
    fase: "intro",
    heroes: HEROES.map((h) => ({ hp: h.hpMax, escudoActivo: false })),
    enemigos: ENEMIGOS.map((e) => ({ hp: e.hpMax, escudoActivo: false })),
    heroeActivoIdx: 0,
    enemigoActivoIdx: 0,
    dialogo: "",
    datosAprendidos: [],
  };
}

function agregarDato(datos: string[], dato: string): string[] {
  return datos.includes(dato) ? datos : [...datos, dato];
}

function reducer(state: BatallaState, action: BatallaAction): BatallaState {
  switch (action.type) {
    case "INICIAR":
      return { ...estadoInicial(), fase: "menu_principal", dialogo: `¡${ENEMIGOS[0].nombre} apareció!` };

    case "ABRIR_ATAQUE":
      return state.fase === "menu_principal" ? { ...state, fase: "submenu_ataque" } : state;

    case "ABRIR_CAMBIO":
      return state.fase === "menu_principal" ? { ...state, fase: "submenu_cambio" } : state;

    case "ABRIR_INFO":
      return state.fase === "menu_principal" ? { ...state, fase: "submenu_info" } : state;

    case "VOLVER":
      return { ...state, fase: "menu_principal" };

    case "RENDIRSE":
      return { ...state, fase: "derrota", dialogo: "Te rendiste. ¡Volviste al hogar!" };

    case "REINICIAR":
      return estadoInicial();

    case "CAMBIAR_HEROE": {
      if (state.fase !== "submenu_cambio") return state;
      const idx = action.idx;
      if (idx === state.heroeActivoIdx || state.heroes[idx].hp <= 0) return state;
      return {
        ...state,
        heroeActivoIdx: idx,
        fase: "turno_enemigo_pendiente",
        dialogo: `¡Adelante, ${HEROES[idx].nombre}!`,
      };
    }

    case "USAR_MOVIMIENTO": {
      if (state.fase !== "submenu_ataque") return state;
      const heroeTpl = HEROES[state.heroeActivoIdx];
      const enemigoTpl = ENEMIGOS[state.enemigoActivoIdx];
      const mov = heroeTpl.movimientos[action.movIndex];
      let dialogo = `¡${heroeTpl.nombre} usa ${mov.nombre}! ${mov.dato}`;
      const datosAprendidos = agregarDato(state.datosAprendidos, mov.dato);

      if (mov.tipoAtaque === "defensa") {
        const heroes = [...state.heroes];
        heroes[state.heroeActivoIdx] = { ...heroes[state.heroeActivoIdx], escudoActivo: true };
        return { ...state, heroes, dialogo, datosAprendidos, fase: "turno_enemigo_pendiente" };
      }

      const { dano, esSuperEfectivo } = calcularDano(heroeTpl.tipo, enemigoTpl.tipo, mov.poder);
      if (esSuperEfectivo) dialogo += " ¡Fue muy efectivo!";

      const enemigos = [...state.enemigos];
      const nuevoHp = Math.max(0, enemigos[state.enemigoActivoIdx].hp - dano);
      enemigos[state.enemigoActivoIdx] = { ...enemigos[state.enemigoActivoIdx], hp: nuevoHp };

      if (nuevoHp <= 0) {
        dialogo += ` ¡${enemigoTpl.nombre} fue derrotado!`;
        const siguiente = siguienteVivo(enemigos);
        if (siguiente === -1) {
          return { ...state, enemigos, dialogo: dialogo + " ¡Victoria!", datosAprendidos, fase: "victoria" };
        }
        return { ...state, enemigos, enemigoActivoIdx: siguiente, dialogo, datosAprendidos, fase: "menu_principal" };
      }

      return { ...state, enemigos, dialogo, datosAprendidos, fase: "turno_enemigo_pendiente" };
    }

    case "ENEMIGO_ATACA": {
      if (state.fase !== "turno_enemigo_pendiente") return state;
      const enemigoTpl = ENEMIGOS[state.enemigoActivoIdx];
      const heroeTpl = HEROES[state.heroeActivoIdx];
      const mov = enemigoTpl.movimientos[action.movIndex];
      const activo = state.heroes[state.heroeActivoIdx];
      const escudoConsumido = activo.escudoActivo;
      const dano = escudoConsumido ? Math.round(mov.poder / 2) : mov.poder;

      const heroes = [...state.heroes];
      const nuevoHp = Math.max(0, activo.hp - dano);
      heroes[state.heroeActivoIdx] = { hp: nuevoHp, escudoActivo: false };

      let dialogo = `¡${enemigoTpl.nombre} usa ${mov.nombre}! ${mov.dato}`;
      if (escudoConsumido) dialogo += ` El escudo de ${heroeTpl.nombre} redujo el golpe.`;
      const datosAprendidos = agregarDato(state.datosAprendidos, mov.dato);

      if (nuevoHp <= 0) {
        dialogo += ` ¡${heroeTpl.nombre} se debilitó!`;
        const siguiente = siguienteVivo(heroes);
        if (siguiente === -1) {
          return {
            ...state,
            heroes,
            dialogo: dialogo + " Todos tus Nutri-héroes se debilitaron.",
            datosAprendidos,
            fase: "derrota",
          };
        }
        return { ...state, heroes, heroeActivoIdx: siguiente, dialogo, datosAprendidos, fase: "menu_principal" };
      }

      return { ...state, heroes, dialogo, datosAprendidos, fase: "menu_principal" };
    }

    default:
      return state;
  }
}

export default function NutriBatallaGame() {
  const [state, dispatch] = useReducer(reducer, undefined, estadoInicial);

  useEffect(() => {
    if (state.fase !== "turno_enemigo_pendiente") return;
    const id = setTimeout(() => {
      dispatch({ type: "ENEMIGO_ATACA", movIndex: Math.random() < 0.5 ? 0 : 1 });
    }, 1400);
    return () => clearTimeout(id);
  }, [state.fase]);

  const heroeTpl = HEROES[state.heroeActivoIdx];
  const enemigoTpl = ENEMIGOS[state.enemigoActivoIdx];
  const heroeActivo = state.heroes[state.heroeActivoIdx];
  const enemigoActivo = state.enemigos[state.enemigoActivoIdx];

  return (
    <main
      className="min-h-screen pb-10 nutri-batalla"
      style={{ background: "linear-gradient(135deg, #2b2b4a 0%, #1a1a2e 100%)" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1a1a2e]/95 border-b-4 border-[#FFD93D]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <Link href="/nutri-kids" className="text-[#FFD93D] text-[10px] hover:underline" style={{ touchAction: "manipulation" }}>
            ← Nutri Kids
          </Link>
          <span className="text-[11px] sm:text-sm font-bold text-white flex-1 text-center">⚔️ Nutri Batalla</span>
          <Link href="/" className="text-[10px] text-[#AEE6FF] hover:underline" style={{ touchAction: "manipulation" }}>
            🏠
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Intro */}
        {state.fase === "intro" && (
          <div className="pixel-box bg-white p-6 text-center">
            <div className="text-4xl mb-3">🌾🥑🍒 vs 🍬🛋️🍔</div>
            <h1 className="text-sm sm:text-base font-bold text-[#1a1a2e] mb-3">Nutri Batalla</h1>
            <p className="text-[10px] sm:text-xs text-[#3a3a3a] mb-4 leading-relaxed">
              Tus 3 Nutri-héroes peruanos se enfrentan a 3 monstruos que representan malos hábitos.
              Cada ataque te enseña un dato real de nutrición. ¡Elige bien tu estrategia!
            </p>
            <button
              onClick={() => dispatch({ type: "INICIAR" })}
              className="w-full py-3 bg-[var(--verde-fuerte)] text-white font-bold text-[11px]"
              style={{ touchAction: "manipulation", minHeight: "44px" }}
            >
              ¡Comenzar batalla!
            </button>
          </div>
        )}

        {/* Combate */}
        {state.fase !== "intro" && state.fase !== "victoria" && state.fase !== "derrota" && (
          <div className="flex flex-col gap-3">
            {/* HP bars + banca */}
            <div className="flex justify-between items-start gap-3">
              <div className="flex flex-col gap-2">
                <HpBar nombre={heroeTpl.nombre} emoji={heroeTpl.emoji} hp={heroeActivo.hp} hpMax={heroeTpl.hpMax} />
                <div className="flex gap-1" role="group" aria-label="Equipo de Nutri-héroes">
                  {HEROES.map((h, i) => (
                    <Fighter key={h.id} emoji={h.emoji} color={h.color} nombre={h.nombre} derrotado={state.heroes[i].hp <= 0} tamano="pequeno" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <HpBar nombre={enemigoTpl.nombre} emoji={enemigoTpl.emoji} hp={enemigoActivo.hp} hpMax={enemigoTpl.hpMax} alineacion="derecha" />
                <div className="flex gap-1" role="group" aria-label="Equipo enemigo">
                  {ENEMIGOS.map((e, i) => (
                    <Fighter key={e.id} emoji={e.emoji} color={e.color} nombre={e.nombre} derrotado={state.enemigos[i].hp <= 0} tamano="pequeno" />
                  ))}
                </div>
              </div>
            </div>

            {/* Arena */}
            <div className="pixel-box bg-[#dff0e0] py-6 flex items-center justify-around">
              <Fighter emoji={heroeTpl.emoji} color={heroeTpl.color} nombre={heroeTpl.nombre} />
              <span className="text-xs font-bold text-[#1a1a2e]">VS</span>
              <Fighter emoji={enemigoTpl.emoji} color={enemigoTpl.color} nombre={enemigoTpl.nombre} />
            </div>

            <DialogBox texto={state.dialogo} />

            {state.fase === "menu_principal" && (
              <ActionMenu
                onAtacar={() => dispatch({ type: "ABRIR_ATAQUE" })}
                onCambiar={() => dispatch({ type: "ABRIR_CAMBIO" })}
                onInfo={() => dispatch({ type: "ABRIR_INFO" })}
                onRendirse={() => dispatch({ type: "RENDIRSE" })}
              />
            )}

            {state.fase === "turno_enemigo_pendiente" && (
              <ActionMenu onAtacar={() => {}} onCambiar={() => {}} onInfo={() => {}} onRendirse={() => {}} disabled />
            )}

            {state.fase === "submenu_ataque" && (
              <div className="grid grid-cols-2 gap-2">
                {heroeTpl.movimientos.map((mov, i) => (
                  <button
                    key={mov.nombre}
                    onClick={() => dispatch({ type: "USAR_MOVIMIENTO", movIndex: i as 0 | 1 })}
                    className="bg-[#FFD93D] text-[#1a1a2e] font-bold py-3 text-[9px] sm:text-[10px] px-2"
                    style={{ touchAction: "manipulation", minHeight: "44px" }}
                  >
                    {mov.tipoAtaque === "defensa" ? "🛡️" : "⚔️"} {mov.nombre}
                  </button>
                ))}
                <button
                  onClick={() => dispatch({ type: "VOLVER" })}
                  className="col-span-2 bg-white text-[#1a1a2e] font-bold py-2 text-[9px] sm:text-[10px]"
                  style={{ touchAction: "manipulation", minHeight: "44px" }}
                >
                  ↩️ Volver
                </button>
              </div>
            )}

            {state.fase === "submenu_cambio" && (
              <div className="grid grid-cols-2 gap-2">
                {HEROES.map((h, i) => (
                  <button
                    key={h.id}
                    onClick={() => dispatch({ type: "CAMBIAR_HEROE", idx: i })}
                    disabled={i === state.heroeActivoIdx || state.heroes[i].hp <= 0}
                    className="bg-[#AEE6FF] text-[#1a1a2e] font-bold py-3 text-[9px] sm:text-[10px] px-2 disabled:opacity-30"
                    style={{ touchAction: "manipulation", minHeight: "44px" }}
                  >
                    {h.emoji} {h.nombre} {i === state.heroeActivoIdx ? "(activo)" : state.heroes[i].hp <= 0 ? "(debilitado)" : ""}
                  </button>
                ))}
                <button
                  onClick={() => dispatch({ type: "VOLVER" })}
                  className="col-span-2 bg-white text-[#1a1a2e] font-bold py-2 text-[9px] sm:text-[10px]"
                  style={{ touchAction: "manipulation", minHeight: "44px" }}
                >
                  ↩️ Volver
                </button>
              </div>
            )}

            {state.fase === "submenu_info" && (
              <div className="pixel-box bg-white p-4">
                <h3 className="text-[10px] font-bold mb-2 text-[#1a1a2e]">Datos aprendidos:</h3>
                {state.datosAprendidos.length === 0 ? (
                  <p className="text-[9px] text-gray-500 mb-3">Aún no has aprendido ningún dato. ¡Ataca para descubrirlos!</p>
                ) : (
                  <ul className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto">
                    {state.datosAprendidos.map((dato) => (
                      <li key={dato} className="text-[9px] text-[#3a3a3a] leading-relaxed">
                        • {dato}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => dispatch({ type: "VOLVER" })}
                  className="w-full bg-[var(--verde-fuerte)] text-white font-bold py-2 text-[9px] sm:text-[10px]"
                  style={{ touchAction: "manipulation", minHeight: "44px" }}
                >
                  ↩️ Volver
                </button>
              </div>
            )}
          </div>
        )}

        {/* Victoria */}
        {state.fase === "victoria" && (
          <div className="pixel-box bg-white p-6 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h2 className="text-sm font-bold text-[#1a1a2e] mb-3">¡VICTORIA!</h2>
            <p className="text-[9px] sm:text-[10px] text-[#3a3a3a] mb-3">{state.dialogo}</p>
            <h3 className="text-[10px] font-bold mb-2 text-left">Aprendiste en este combate:</h3>
            <ul className="flex flex-col gap-2 mb-4 text-left max-h-48 overflow-y-auto">
              {state.datosAprendidos.map((dato) => (
                <li key={dato} className="text-[9px] text-[#3a3a3a] leading-relaxed bg-[#fff8e1] border-2 border-[#FFD93D] p-2">
                  {dato}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => dispatch({ type: "REINICIAR" })}
                className="w-full py-3 bg-[var(--verde-fuerte)] text-white font-bold text-[10px]"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                Jugar de nuevo 🔄
              </button>
              <Link
                href="/nutri-kids"
                className="w-full py-3 border-4 border-[var(--primrose)] text-[var(--primrose)] font-bold text-[10px] text-center block"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                Volver a Nutri Kids
              </Link>
            </div>
          </div>
        )}

        {/* Derrota */}
        {state.fase === "derrota" && (
          <div className="pixel-box bg-white p-6 text-center">
            <div className="text-4xl mb-3">🏠</div>
            <h2 className="text-sm font-bold text-[#1a1a2e] mb-3">Volviste al hogar</h2>
            <p className="text-[9px] sm:text-[10px] text-[#3a3a3a] mb-4 leading-relaxed">
              ¡Prueba otra estrategia! Cada combate te ayuda a conocer mejor a tus Nutri-héroes.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => dispatch({ type: "REINICIAR" })}
                className="w-full py-3 bg-[var(--verde-fuerte)] text-white font-bold text-[10px]"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                Intentar de nuevo 🔄
              </button>
              <Link
                href="/nutri-kids"
                className="w-full py-3 border-4 border-[var(--primrose)] text-[var(--primrose)] font-bold text-[10px] text-center block"
                style={{ touchAction: "manipulation", minHeight: "44px" }}
              >
                Volver a Nutri Kids
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
