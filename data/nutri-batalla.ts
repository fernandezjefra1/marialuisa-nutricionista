export type TipoNutricional = "cereal" | "grasa-buena" | "vitamina";
export type TipoEnemigo = "azucar" | "sedentarismo" | "chatarra";

export type Movimiento = {
  nombre: string;
  tipoAtaque: "daño" | "defensa";
  poder: number; // 0 en movimientos de defensa pura
  dato: string; // dato nutricional educativo mostrado en el diálogo
};

export type FighterTemplate = {
  id: string;
  nombre: string;
  emoji: string;
  color: string; // placeholder de color plano hasta tener sprite
  hpMax: number;
  movimientos: [Movimiento, Movimiento];
};

export type HeroeTemplate = FighterTemplate & { tipo: TipoNutricional };
export type EnemigoTemplate = FighterTemplate & { tipo: TipoEnemigo };

/**
 * Triángulo de efectividad: cada tipo nutricional es 2x efectivo contra el
 * hábito que combate en la vida real; contra los otros dos enemigos hace
 * daño normal (x1).
 *
 * Cereal (fibra)      -> Azucaromon:   la fibra regula la absorción de azúcar en sangre.
 * Grasa Buena (omega)  -> Chatarrasaurio: reemplaza las grasas trans dañinas por grasas saludables.
 * Vitamina (vit. C)    -> Sedentarix:  refuerza el sistema inmune debilitado por el sedentarismo.
 */
export const EFECTIVIDAD: Record<TipoNutricional, TipoEnemigo> = {
  cereal: "azucar",
  "grasa-buena": "chatarra",
  vitamina: "sedentarismo",
};

export const HEROES: HeroeTemplate[] = [
  {
    id: "super-quinua",
    nombre: "Súper Quinua",
    emoji: "🌾",
    color: "#E6C200",
    hpMax: 100,
    tipo: "cereal",
    movimientos: [
      {
        nombre: "Golpe de Proteína",
        tipoAtaque: "daño",
        poder: 22,
        dato: "La quinua tiene los 9 aminoácidos esenciales que ayudan a tus músculos a crecer fuertes.",
      },
      {
        nombre: "Escudo de Fibra",
        tipoAtaque: "defensa",
        poder: 0,
        dato: "La fibra de la quinua ayuda a tu digestión y te protege por más tiempo.",
      },
    ],
  },
  {
    id: "palta-poderosa",
    nombre: "Palta Poderosa",
    emoji: "🥑",
    color: "#5B8C3E",
    hpMax: 100,
    tipo: "grasa-buena",
    movimientos: [
      {
        nombre: "Omega Impacto",
        tipoAtaque: "daño",
        poder: 22,
        dato: "La palta tiene grasas buenas que cuidan tu corazón y tu cerebro.",
      },
      {
        nombre: "Corazón Fuerte",
        tipoAtaque: "defensa",
        poder: 0,
        dato: "Las grasas buenas de la palta fortalecen tu corazón y te dan resistencia.",
      },
    ],
  },
  {
    id: "camu-guerrero",
    nombre: "Camu Guerrero",
    emoji: "🍒",
    color: "#D6336C",
    hpMax: 100,
    tipo: "vitamina",
    movimientos: [
      {
        nombre: "Explosión de Vitamina C",
        tipoAtaque: "daño",
        poder: 22,
        dato: "El camu camu tiene muchísima más vitamina C que la naranja. ¡Fortalece tus defensas!",
      },
      {
        nombre: "Defensa Antioxidante",
        tipoAtaque: "defensa",
        poder: 0,
        dato: "Los antioxidantes del camu camu protegen tus células del desgaste diario.",
      },
    ],
  },
];

export const ENEMIGOS: EnemigoTemplate[] = [
  {
    id: "azucaromon",
    nombre: "Azucaromon",
    emoji: "🍬",
    color: "#D6336C",
    hpMax: 90,
    tipo: "azucar",
    movimientos: [
      {
        nombre: "Subidón de Azúcar",
        tipoAtaque: "daño",
        poder: 18,
        dato: "El exceso de azúcar da un pico de energía rápido, seguido de un bajón y cansancio.",
      },
      {
        nombre: "Caries Traviesa",
        tipoAtaque: "daño",
        poder: 16,
        dato: "Comer mucha azúcar sin cepillarte los dientes puede causar caries.",
      },
    ],
  },
  {
    id: "sedentarix",
    nombre: "Sedentarix",
    emoji: "🛋️",
    color: "#6D4C41",
    hpMax: 90,
    tipo: "sedentarismo",
    movimientos: [
      {
        nombre: "Pereza Total",
        tipoAtaque: "daño",
        poder: 16,
        dato: "Pasar todo el día sin moverte puede debilitar tus músculos poco a poco.",
      },
      {
        nombre: "Bostezo Contagioso",
        tipoAtaque: "daño",
        poder: 18,
        dato: "El sedentarismo puede bajar tu energía y tu ánimo durante el día.",
      },
    ],
  },
  {
    id: "chatarrasaurio",
    nombre: "Chatarrasaurio",
    emoji: "🍔",
    color: "#FB8C00",
    hpMax: 95,
    tipo: "chatarra",
    movimientos: [
      {
        nombre: "Grasa Trans Rugido",
        tipoAtaque: "daño",
        poder: 20,
        dato: "Comer comida chatarra muy seguido puede aportar grasas trans poco saludables.",
      },
      {
        nombre: "Combo Gigante",
        tipoAtaque: "daño",
        poder: 18,
        dato: "Los combos de comida chatarra suelen tener muchas calorías y pocos nutrientes.",
      },
    ],
  },
];

export function calcularDano(tipoAtacante: TipoNutricional, tipoDefensor: TipoEnemigo, poder: number): { dano: number; esSuperEfectivo: boolean } {
  const esSuperEfectivo = EFECTIVIDAD[tipoAtacante] === tipoDefensor;
  return { dano: esSuperEfectivo ? poder * 2 : poder, esSuperEfectivo };
}
