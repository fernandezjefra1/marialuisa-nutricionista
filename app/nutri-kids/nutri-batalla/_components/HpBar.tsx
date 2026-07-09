type Props = {
  nombre: string;
  emoji: string;
  hp: number;
  hpMax: number;
  alineacion?: "izquierda" | "derecha";
};

export default function HpBar({ nombre, emoji, hp, hpMax, alineacion = "izquierda" }: Props) {
  const porcentaje = Math.max(0, Math.min(100, (hp / hpMax) * 100));
  const critico = porcentaje <= 25;

  return (
    <div className={`pixel-box bg-white/95 px-3 py-2 w-full max-w-[220px] ${alineacion === "derecha" ? "ml-auto" : ""}`}>
      <div className="flex items-center justify-between text-[9px] sm:text-[10px] mb-1">
        <span>{emoji} {nombre}</span>
      </div>
      <div className="h-3 w-full bg-gray-300 rounded-sm overflow-hidden border-2 border-[#1a1a2e]">
        <div
          className={`h-full transition-all duration-500 ${critico ? "bg-red-500" : "bg-[var(--verde-fuerte)]"}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <div className="text-[8px] sm:text-[9px] mt-1 text-right">
        {hp} / {hpMax} HP
      </div>
    </div>
  );
}
