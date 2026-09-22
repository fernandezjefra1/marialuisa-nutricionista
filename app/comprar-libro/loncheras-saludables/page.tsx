import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const WHATSAPP_NUMERO = "51985577017";
const HOTMART_URL = "https://go.hotmart.com/U107706372S?dp=1";

export const metadata: Metadata = {
  title: "Loncheras Saludables | Libro de María Luisa Nutricionista",
  description:
    "Libro digital de loncheras y snacks saludables para inicial, primaria y secundaria, con menús de la Costa, Sierra y Selva del Perú. Vista previa gratis.",
};

const CONTENIDO = [
  "Loncheras por región: Costa, Sierra y Selva del Perú",
  "Menús para inicial, primaria y secundaria",
  "Valor nutricional y calorías de cada lonchera",
  "Enfermedades comunes y cómo prevenirlas desde la lonchera",
];

// Páginas de la vista previa (portada + hasta el capítulo "Enfermedades comunes")
const PREVIEW: { src: string; w: number; h: number }[] = [
  { src: "/images/loncheras-portada.jpg", w: 1000, h: 1500 },
  { src: "/libro/preview/p02.png", w: 820, h: 1267 },
  { src: "/libro/preview/p03.png", w: 820, h: 1267 },
  { src: "/libro/preview/p04.png", w: 820, h: 1267 },
  { src: "/libro/preview/p05.png", w: 820, h: 1267 },
  { src: "/libro/preview/p06.png", w: 820, h: 1267 },
  { src: "/libro/preview/p07.png", w: 820, h: 1267 },
  { src: "/libro/preview/p08.png", w: 820, h: 1267 },
];

export default function LoncherasSaludablesPage() {
  const mensaje = encodeURIComponent(
    '¡Hola María Luisa! Tengo una consulta sobre el libro digital "Loncheras Saludables".'
  );

  return (
    <div className="min-h-screen bg-[#d4edcc]">
      {/* Header */}
      <header className="bg-[#edf7e8] border-b border-[#C5DFC5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="font-nunito text-sm text-[#5a7255] hover:text-[#31543d] transition flex items-center gap-1 shrink-0">
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">← Volver al inicio</span>
          </Link>
          <p className="font-playfair font-semibold text-[#31543d] truncate px-3">María Luisa Nutricionista</p>
          <div className="w-16 sm:w-24 shrink-0" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ===== IZQUIERDA: COMPRA ===== */}
          <div>
            <div className="flex gap-4 sm:gap-5 items-start mb-6">
              <div className="relative w-28 sm:w-36 aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-white shrink-0">
                <Image
                  src="/images/loncheras-portada.jpg"
                  alt="Libro Loncheras Saludables — Lic. María Luisa"
                  fill
                  sizes="150px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="pt-1">
                <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-1 font-semibold">Libro digital</p>
                <h1 className="font-playfair text-2xl sm:text-3xl font-light text-[#31543d] leading-tight">
                  Loncheras <span className="font-semibold shimmer-rose">Saludables.</span>
                </h1>
                <p className="font-nunito text-xs text-[#8aa487] mt-1">Por María Luisa Peña Valdivia</p>
              </div>
            </div>

            <p className="font-nunito text-[#5a7255] leading-relaxed mb-6">
              Loncheras y snacks saludables para inicial, primaria y secundaria, con menús
              económicos de la Costa, Sierra y Selva del Perú y su valor nutricional.
            </p>

            <div className="mb-6">
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

            <div className="p-6 rounded-2xl border-2 border-[#C5DFC5] bg-white">
              <h2 className="font-playfair text-xl font-semibold text-[#31543d] mb-2">Compra tu libro digital</h2>
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
                Comprar versión completa
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-sm text-[#5a7255] hover:text-[#31543d] font-nunito transition"
              >
                ¿Tienes dudas? Escríbenos por WhatsApp →
              </a>
            </div>
          </div>

          {/* ===== DERECHA: VISTA PREVIA ===== */}
          <div>
            <div className="mb-3">
              <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-1 font-semibold">Vista previa gratis</p>
              <h2 className="font-playfair text-2xl font-semibold text-[#31543d]">Hojea el libro</h2>
              <p className="font-nunito text-sm text-[#5a7255] mt-1">
                Gratis desde la portada hasta el capítulo <b>Enfermedades comunes</b>. El resto se desbloquea al comprar.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#C5DFC5] bg-[#eef6ea] shadow-lg p-3 sm:p-4 max-h-[72vh] overflow-y-auto space-y-3">
              {PREVIEW.map((pg, i) => (
                <Image
                  key={pg.src}
                  src={pg.src}
                  alt={`Vista previa — página ${i + 1}`}
                  width={pg.w}
                  height={pg.h}
                  className="w-full h-auto rounded-lg shadow bg-white"
                  priority={i === 0}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={HOTMART_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-coquette inline-flex items-center justify-center gap-2 bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white px-7 py-3.5 rounded-full transition font-semibold shadow-lg shadow-pink-200 font-nunito"
              >
                Comprar el libro completo
              </a>
              <a
                href="/libro/loncheras-preview.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#5a7255] hover:text-[#31543d] font-nunito underline"
              >
                Descargar vista previa (PDF)
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
