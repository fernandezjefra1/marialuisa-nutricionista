type Props = {
  emoji: string;
  color: string;
  nombre: string;
  derrotado?: boolean;
  tamano?: "grande" | "pequeno";
};

export default function Fighter({ emoji, color, nombre, derrotado = false, tamano = "grande" }: Props) {
  const dimension = tamano === "grande" ? "w-20 h-20 sm:w-28 sm:h-28 text-5xl sm:text-6xl" : "w-8 h-8 text-lg";

  return (
    <div
      className={`pixel-box flex items-center justify-center ${dimension} ${derrotado ? "grayscale opacity-40" : ""}`}
      style={{ background: color }}
      role="img"
      aria-label={derrotado ? `${nombre} (fuera de combate)` : nombre}
    >
      {emoji}
    </div>
  );
}
