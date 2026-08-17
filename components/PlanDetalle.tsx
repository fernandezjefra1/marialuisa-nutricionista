import Link from "next/link";
import Image from "next/image";

const WHATSAPP_NUMERO = "51985577017";

type Props = {
  badge: string;
  nombre: string;
  precio: string;
  periodo: string;
  desc: string;
  beneficios: string[];
  colorAccent: "verde-fuerte" | "primrose" | "lime";
  imagen?: string;
  proximamente?: boolean;
};

const ACCENTOS = {
  "verde-fuerte": {
    border: "border-[var(--verde-fuerte)]",
    bg: "bg-[var(--verde-fuerte)]",
    text: "text-[var(--verde-fuerte)]",
    soft: "bg-[var(--lime-soft)]",
    hoverBtn: "hover:bg-[var(--verde-fuerte)] hover:text-white",
  },
  primrose: {
    border: "border-[var(--primrose)]",
    bg: "bg-[var(--primrose)]",
    text: "text-[var(--primrose)]",
    soft: "bg-[var(--pinktone)]",
    hoverBtn: "hover:bg-[var(--primrose)] hover:text-white",
  },
  lime: {
    border: "border-[var(--lime)]",
    bg: "bg-[var(--lime)]",
    text: "text-[var(--lime)]",
    soft: "bg-[var(--lime-soft)]",
    hoverBtn: "hover:bg-[var(--lime)] hover:text-white",
  },
};

export default function PlanDetalle({ badge, nombre, precio, periodo, desc, beneficios, colorAccent, imagen, proximamente }: Props) {
  const acc = ACCENTOS[colorAccent];
  const mensaje = encodeURIComponent(`Hola María Luisa, quisiera más información sobre el ${nombre} 🌿`);

  return (
    <main className="min-h-screen bg-[#f5f0e8]">
      {/* Header */}
      <header className="bg-white/90 border-b border-[var(--borde-suave)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/#dieta" className="font-nunito text-sm text-[var(--texto-suave)] hover:text-[var(--texto-principal)] transition flex items-center gap-1 shrink-0">
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">← Ver todos los planes</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/images/logoNutricion.png" alt="Logo María Luisa Nutricionista" width={64} height={64} className="w-8 h-8 object-contain" />
            <p className="font-playfair font-semibold text-[var(--texto-principal)] text-sm truncate">María Luisa Nutricionista</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="text-center mb-8">
          <span
            className={`inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${acc.bg} text-white mb-4`}
          >
            {badge}
          </span>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-[var(--texto-principal)] mb-3">
            {nombre}
          </h1>
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-4xl md:text-5xl font-bold text-[var(--texto-principal)]">{precio}</span>
            <span className="text-base text-[var(--texto-suave)]">/ {periodo}</span>
          </div>
          <p className="font-nunito text-[var(--texto-suave)] max-w-lg mx-auto leading-relaxed">{desc}</p>
        </div>

        {imagen && (
          <img src={imagen} alt={nombre} className="w-full max-w-md mx-auto rounded-2xl shadow-lg mb-8 object-cover" />
        )}

        {proximamente ? (
          <div className={`rounded-2xl border-2 border-dashed ${acc.border} ${acc.soft} flex flex-col items-center justify-center py-14 px-6 text-center mb-8`}>
            <p className={`font-playfair text-xl font-semibold ${acc.text} mb-2`}>🍳 Próximamente detalles</p>
            <p className="font-nunito text-sm text-[var(--texto-suave)] max-w-sm">
              Estamos preparando la información completa de este plan. Escríbenos por WhatsApp y te avisamos apenas
              esté disponible.
            </p>
          </div>
        ) : (
          <ul className={`bg-white rounded-2xl border-2 ${acc.border} p-6 sm:p-8 space-y-3 mb-8`}>
            {beneficios.map((b, i) => (
              <li key={i} className="flex items-start gap-3 font-nunito text-[var(--texto-suave)]">
                <span className={`mt-0.5 w-5 h-5 rounded-full border-2 ${acc.border} flex items-center justify-center flex-shrink-0`}>
                  <svg className={`w-3 h-3 ${acc.text}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-coquette flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1FAA52] text-white px-8 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 font-nunito"
          >
            {proximamente ? "Quiero que me avisen" : `Quiero este plan · ${precio}`}
          </a>
          <Link
            href="/#dieta"
            className={`flex items-center justify-center gap-2 border-2 ${acc.border} ${acc.text} px-8 py-4 rounded-full transition font-semibold ${acc.hoverBtn} font-nunito`}
          >
            Ver otros planes
          </Link>
        </div>
      </div>
    </main>
  );
}
