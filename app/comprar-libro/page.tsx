import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const WHATSAPP_NUMERO = "51985577017";

export const metadata: Metadata = {
  title: "Libros de nutrición",
  description:
    "Los libros de María Luisa Nutricionista: Nutrición del Bebé y Loncheras Saludables. Próximamente en versión digital.",
};

type Libro = {
  slug: string;
  titulo: string;
  autor: string;
  portada: string;
  portadaProvisional?: boolean;
  descripcion: string;
};

const LIBROS: Libro[] = [
  {
    slug: "nutricion-del-bebe",
    titulo: "Nutrición del Bebé",
    autor: "María Luisa Peña Valdivia",
    portada: "/images/libro-portada.jpg",
    descripcion:
      "Guía práctica para la alimentación de tu bebé, con recomendaciones nutricionales por etapa y recetas fáciles de preparar.",
  },
  {
    slug: "loncheras-saludables",
    titulo: "Loncheras Saludables",
    autor: "María Luisa Peña Valdivia",
    // TODO: Reemplazar imagen placeholder con la portada real del libro de Loncheras.
    portada: "/images/imagenlibro.jpeg",
    portadaProvisional: true,
    // TODO: Reemplazar descripción con el resumen que enviará la clienta para la contratapa.
    descripcion:
      "Ideas de loncheras nutritivas, rápidas y ricas para acompañar el crecimiento de los más pequeños de la casa.",
  },
];

/* TODO: FASE 2 — Venta online de los libros digitales.
   Aquí volverá el precio y el botón de compra. Hará falta:
   - Una tabla de pedidos digitales (o reutilizar `compras`) con el estado del pago.
   - El flujo de pago y la entrega del archivo (link firmado con expiración desde Supabase Storage).
   - Un campo `archivo_url` por libro para servir el PDF solo a quien lo compró. */

function linkWhatsApp(titulo: string): string {
  const texto = `¡Hola María Luisa! Quiero que me avises cuando el libro "${titulo}" esté disponible en versión digital.`;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}

export default function ComprarLibroPage() {
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-2 font-semibold">
            Nuestros libros
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl font-light text-[#31543d] mb-2">
            Aprende nutrición <span className="font-semibold shimmer-rose">página a página.</span>
          </h1>
          <p className="font-nunito text-[#5a7255] max-w-xl mx-auto text-sm">
            Próximamente disponibles en versión digital. Déjanos tu mensaje y te avisamos apenas salgan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {LIBROS.map((libro) => (
            <div key={libro.slug} className="bg-white rounded-2xl border-2 border-[#C5DFC5] overflow-hidden flex flex-col">
              {/* Portada */}
              <div className="relative w-full aspect-[4/3] bg-[#f0f8ec]">
                <Image
                  src={libro.portada}
                  alt={libro.titulo}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute top-3 right-3 bg-[var(--verde-fuerte)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Próximamente
                </span>
                {libro.portadaProvisional && (
                  <span className="absolute bottom-3 left-3 bg-white/90 text-[#5a7255] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    Portada provisional
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h2 className="font-playfair text-xl font-semibold text-[#31543d] mb-1">{libro.titulo}</h2>
                <p className="font-nunito text-xs text-[#8aa487] mb-3">Por {libro.autor}</p>
                <p className="font-nunito text-sm text-[#5a7255] leading-relaxed mb-4">{libro.descripcion}</p>

                <div className="mb-5 rounded-xl bg-[#f0f8ec] border border-[#C5DFC5] px-4 py-3">
                  <p className="font-nunito text-sm font-semibold text-[#31543d]">
                    Disponible próximamente en versión digital
                  </p>
                </div>

                <div className="mt-auto flex flex-col gap-2.5">
                  <Link
                    href={`/comprar-libro/${libro.slug}`}
                    className="w-full text-center bg-[var(--verde-fuerte)] text-white px-5 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition"
                  >
                    Ver detalles
                  </Link>
                  <a
                    href={linkWhatsApp(libro.titulo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center border-2 border-[#25D366] text-[#1FAA52] px-5 py-3 rounded-full font-semibold text-sm hover:bg-[#25D366] hover:text-white transition"
                  >
                    Avísame por WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
