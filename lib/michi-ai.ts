export type Casilla = "nutritivo" | "chatarra" | null;
export type Equipo = "nutritivo" | "chatarra";
export type Dificultad = "facil" | "dificil";

const LINEAS_GANADORAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function ganador(tablero: Casilla[]): { equipo: Equipo; linea: number[] } | null {
  for (const linea of LINEAS_GANADORAS) {
    const [a, b, c] = linea;
    if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
      return { equipo: tablero[a] as Equipo, linea };
    }
  }
  return null;
}

export function tableroLleno(tablero: Casilla[]): boolean {
  return tablero.every((c) => c !== null);
}

function casillasLibres(tablero: Casilla[]): number[] {
  return tablero.reduce<number[]>((acc, c, i) => {
    if (c === null) acc.push(i);
    return acc;
  }, []);
}

function minimax(tablero: Casilla[], equipoTurno: Equipo, equipoBot: Equipo): number {
  const resultado = ganador(tablero);
  if (resultado) return resultado.equipo === equipoBot ? 10 : -10;
  if (tableroLleno(tablero)) return 0;

  const libres = casillasLibres(tablero);
  const equipoRival: Equipo = equipoTurno === "nutritivo" ? "chatarra" : "nutritivo";
  const puntajes = libres.map((i) => {
    const copia = [...tablero];
    copia[i] = equipoTurno;
    return minimax(copia, equipoRival, equipoBot);
  });

  return equipoTurno === equipoBot ? Math.max(...puntajes) : Math.min(...puntajes);
}

export function getBotMove(tablero: Casilla[], dificultad: Dificultad, equipoBot: Equipo): number {
  const libres = casillasLibres(tablero);
  if (libres.length === 0) return -1;

  if (dificultad === "facil") {
    return libres[Math.floor(Math.random() * libres.length)];
  }

  const equipoRival: Equipo = equipoBot === "nutritivo" ? "chatarra" : "nutritivo";
  let mejorPuntaje = -Infinity;
  let mejorJugada = libres[0];
  for (const i of libres) {
    const copia = [...tablero];
    copia[i] = equipoBot;
    const puntaje = minimax(copia, equipoRival, equipoBot);
    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejorJugada = i;
    }
  }
  return mejorJugada;
}
