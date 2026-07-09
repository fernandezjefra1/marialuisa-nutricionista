export type AlimentoSaludable = {
  id: string;
  emoji: string;
  nombre: string;
  dato: string;
};

export const ALIMENTOS_SALUDABLES: AlimentoSaludable[] = [
  { id: "quinua", emoji: "🌾", nombre: "Quinua", dato: "La quinua tiene los 9 aminoácidos esenciales, algo poco común en plantas. ¡Ayuda a tus músculos a crecer fuertes!" },
  { id: "kiwicha", emoji: "🌾", nombre: "Kiwicha", dato: "La kiwicha es rica en hierro, un mineral que ayuda a que la sangre lleve oxígeno a todo tu cuerpo." },
  { id: "camote", emoji: "🍠", nombre: "Camote", dato: "El camote tiene vitamina A, que cuida tu vista y fortalece tus defensas." },
  { id: "olluco", emoji: "🥔", nombre: "Olluco", dato: "El olluco aporta vitamina C y fibra, ayudando a tu digestión y a cuidar tus defensas." },
  { id: "tarwi", emoji: "🫘", nombre: "Tarwi", dato: "El tarwi (chocho) tiene tanta proteína como la carne, ¡pero viene de una planta de los Andes!" },
  { id: "lucuma", emoji: "🍈", nombre: "Lúcuma", dato: "La lúcuma tiene fibra y antioxidantes, y le da un dulce natural a los postres sin usar tanta azúcar." },
  { id: "chirimoya", emoji: "🍏", nombre: "Chirimoya", dato: "La chirimoya es rica en vitamina C y potasio, que ayudan a tus músculos y tu corazón." },
  { id: "camu-camu", emoji: "🍒", nombre: "Camu Camu", dato: "El camu camu tiene muchísima más vitamina C que la naranja, ¡una fruta amazónica súper poderosa!" },
  { id: "sacha-inchi", emoji: "🌰", nombre: "Sacha Inchi", dato: "El sacha inchi tiene omega-3, una grasa buena que ayuda a tu cerebro a pensar mejor." },
  { id: "pallar", emoji: "🫛", nombre: "Pallar", dato: "El pallar es un frejol peruano lleno de proteína y fibra que te da energía de larga duración." },
  { id: "aguaymanto", emoji: "🟡", nombre: "Aguaymanto", dato: "El aguaymanto tiene vitamina A y C, perfecto para fortalecer tus defensas contra los resfríos." },
];

export function obtenerDato(id: string): AlimentoSaludable | undefined {
  return ALIMENTOS_SALUDABLES.find((a) => a.id === id);
}
