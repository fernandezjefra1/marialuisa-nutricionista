import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const WHATSAPP_NUMERO = "51985577017";

// TODO: Reemplazar por el enlace real del checkout de Hotmart del libro digital.
const HOTMART_URL = "https://pay.hotmart.com/";

export const metadata: Metadata = {
  title: "Nutrición del Bebé | Libro de María Luisa Nutricionista",
  description:
    "Guía de nutrición infantil preventiva desde los 6 meses hasta el año de vida. Disponible en versión digital.",
};

const CONTENIDO = [
  "Alimentación por etapas, desde los 6 meses hasta el año de vida",
  "Cantidades y texturas recomendadas en cada mes",
  "Recetas fáciles con ingredientes que se consiguen en el mercado",
  "Señales de alerta y cuándo consultar con un profesional",
];

export default function NutricionDelBebePage() {
  const mensaje = encodeURIComponent(
    "¡Hola María Luisa! Tengo una consulta sobre el libro digital \"Nutrición del Bebé\"."
  );

  return (
    <div className="min-h-screen bg-[#d4edcc]">
      {/* Header */}
      <header className="bg-[#edf7e8] border-b border-[#C5DFC5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="font-nunito text-sm text-[#5a7255] hover:text-[#31543d] transition flex items-center gap-1 shrink-0">
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">← Volver al inicio</span>
          </Link>
          <p className="font-playfair font-semibold text-[#31543d] truncate px-3">María Luisa Nutricionista</p>
          <div className="w-16 sm:w-24 shrink-0" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">

          {/* Portada */}
          <div className="relative">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white">
              <Image
                src="/images/libro-portada.jpg"
                alt="Libro Nutrición del Bebé — Lic. María Luisa"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
                priority
              />
              <span className="absolute top-3 right-3 bg-[var(--lime)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Versión digital
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-2 font-semibold">
              Libro digital
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl font-light text-[#31543d] mb-2">
              Nutrición <span className="font-semibold shimmer-rose">del Bebé.</span>
            </h1>
            <p className="font-nunito text-xs text-[#8aa487] mb-6">Por María Luisa Peña Valdivia</p>

            <p className="font-nunito text-[#5a7255] leading-relaxed mb-6">
              Guía de nutrición infantil preventiva desde los 6 meses hasta el año de vida.
              Recientemente presentada en el Colegio de Nutricionistas del Perú.
            </p>

            {/* TODO: Confirmar con la clienta el índice real del libro. */}
            <div className="mb-8">
              <h2 className="font-playfair text-lg font-semibold text-[#31543d] mb-3">Qué vas a encontrar</h2>
              <ul className="space-y-2.5">
                {CONTENIDO.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#d4edcc] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#6daa6d]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="font-nunito text-sm text-[#5a7255] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 p-6 rounded-2xl border-2 border-[#C5DFC5] bg-white">
              <h2 className="font-playfair text-xl font-semibold text-[#31543d] mb-2">
                Compra tu libro digital
              </h2>
              <p className="font-nunito text-sm text-[#5a7255] leading-relaxed mb-5">
                Pago 100% seguro a través de Hotmart. Tras la compra recibirás el acceso a la
                descarga en tu correo.
              </p>

              <a
                href={HOTMART_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-coquette inline-flex items-center justify-center gap-3 bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-pink-200 font-nunito w-full"
              >
                Comprar versión digital
              </a>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm text-[#5a7255] hover:text-[#31543d] font-nunito transition"
            >
              ¿Tienes dudas? Escríbenos por WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
