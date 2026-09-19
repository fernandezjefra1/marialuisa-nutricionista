import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const WHATSAPP_NUMERO = "51985577017";
// TODO: Reemplazar imagen placeholder con la portada real del libro de Loncheras.
const PORTADA_PLACEHOLDER = "/images/imagenlibro.jpeg";

export const metadata: Metadata = {
  title: "Loncheras Saludables | Libro de María Luisa Nutricionista",
  description:
    "Ideas de loncheras nutritivas, rápidas y ricas. Próximamente disponible en versión digital.",
};

/* TODO: FASE 2 — Venta online del libro digital.
   Aquí volverán el precio y el botón de compra (ver nota en app/comprar-libro/page.tsx). */

export default function LoncherasSaludablesPage() {
  const mensaje = encodeURIComponent(
    "¡Hola María Luisa! Quiero que me avises cuando el libro \"Loncheras Saludables\" esté disponible en versión digital."
  );

  return (
    <div className="min-h-screen bg-[#d4edcc]">
      {/* Header */}
      <header className="bg-[#edf7e8] border-b border-[#C5DFC5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/comprar-libro" className="font-nunito text-sm text-[#5a7255] hover:text-[#31543d] transition flex items-center gap-1 shrink-0">
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">← Volver a los libros</span>
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
                src={PORTADA_PLACEHOLDER}
                alt="Loncheras Saludables (portada provisional)"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
              />
              <span className="absolute top-3 right-3 bg-[var(--verde-fuerte)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Próximamente
              </span>
            </div>
            <p className="font-nunito text-[11px] text-[#5a7255] mt-2 text-center italic">
              Portada provisional — pendiente de la clienta
            </p>
          </div>

          {/* Info */}
          <div>
            <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-2 font-semibold">
              Próximo lanzamiento
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl font-light text-[#31543d] mb-2">
              Loncheras <span className="font-semibold shimmer-rose">Saludables.</span>
            </h1>
            <p className="font-nunito text-xs text-[#8aa487] mb-6">Por María Luisa Peña Valdivia</p>

            {/* TODO: Reemplazar con el resumen/descripción real que enviará la clienta para la contratapa. */}
            <p className="font-nunito text-[#5a7255] leading-relaxed mb-8">
              Un libro práctico con ideas de loncheras nutritivas, rápidas y ricas para acompañar el crecimiento
              de los más pequeños de la casa. Descripción completa pendiente de confirmación por la clienta.
            </p>

            <div className="mb-8 p-6 rounded-2xl border-2 border-[#C5DFC5] bg-white">
              <h2 className="font-playfair text-xl font-semibold text-[#31543d] mb-2">
                Disponible próximamente en versión digital
              </h2>
              <p className="font-nunito text-sm text-[#5a7255] leading-relaxed">
                Estamos preparando la edición digital de este libro. Escríbenos por WhatsApp
                y te avisamos apenas esté lista.
              </p>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-coquette inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1FAA52] text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 font-nunito w-full sm:w-auto"
            >
              Avísame por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
