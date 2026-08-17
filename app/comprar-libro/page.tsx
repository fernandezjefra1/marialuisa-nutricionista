import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// TODO: Reemplazar con el link real de Hotmart de cada libro cuando la clienta lo envíe.
const HOTMART_LINK = "#";

export const metadata: Metadata = {
  title: "Libros de nutrición",
  description:
    "Descubre los libros de María Luisa Nutricionista: Nutrición del Bebé y Loncheras Saludables. Disponibles en físico, digital y en Hotmart.",
};

type Libro = {
  slug: string;
  titulo: string;
  autor: string;
  portada: string;
  portadaProvisional?: boolean;
  descripcion: string;
  precioDigital: number;
  precioFisico: number;
};

const LIBROS: Libro[] = [
  {
    slug: "nutricion-del-bebe",
    titulo: "Nutrición del Bebé",
    autor: "María Luisa Peña Valdivia",
    portada: "/images/libro-portada.jpg",
    descripcion:
      "Guía práctica para la alimentación de tu bebé, con recomendaciones nutricionales por etapa y recetas fáciles de preparar.",
    precioDigital: 10,
    precioFisico: 20,
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
    precioDigital: 20,
    precioFisico: 30,
  },
];

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
            Disponibles en físico, digital y en Hotmart.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {LIBROS.map((libro) => (
            <div key={libro.slug} className="bg-white rounded-2xl border-2 border-[#C5DFC5] overflow-hidden flex flex-col">
              {/* Portada + sello Hotmart */}
              <div className="relative w-full aspect-[4/3] bg-[#f0f8ec]">
                <Image src={libro.portada} alt={libro.titulo} fill className="object-cover" />
                <span className="absolute top-3 right-3 bg-[#FF6600] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  🔥 Disponible en Hotmart
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

                <div className="flex items-center gap-4 mb-5 text-sm font-nunito">
                  <div>
                    <p className="text-[#8aa487] text-xs">Digital</p>
                    <p className="font-playfair font-semibold text-[#31543d]">S/ {libro.precioDigital}</p>
                  </div>
                  <div className="w-px h-8 bg-[#C5DFC5]" />
                  <div>
                    <p className="text-[#8aa487] text-xs">Físico</p>
                    <p className="font-playfair font-semibold text-[#31543d]">S/ {libro.precioFisico}</p>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2.5">
                  <Link
                    href={`/comprar-libro/${libro.slug}`}
                    className="w-full text-center bg-[var(--verde-fuerte)] text-white px-5 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition"
                  >
                    Ver detalles
                  </Link>
                  <a
                    href={HOTMART_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center border-2 border-[#FF6600] text-[#FF6600] px-5 py-3 rounded-full font-semibold text-sm hover:bg-[#FF6600] hover:text-white transition"
                  >
                    🔥 Comprar en Hotmart
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
