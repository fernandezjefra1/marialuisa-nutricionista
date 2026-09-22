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

export default function LoncherasSaludablesPage() {
  const mensaje = encodeURIComponent(
    '¡Hola María Luisa! Tengo una consulta sobre el libro digital "Loncheras Saludables".'
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">
          {/* Portada */}
          <div className="relative">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white">
              <Image
                src="/images/loncheras-portada.png"
                alt="Libro Loncheras Saludables — Lic. María Luisa"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-contain bg-white"
                priority
              />
              <span className="absolute top-3 right-3 bg-[var(--lime)] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                Libro digital
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-2 font-semibold">Nuevo lanzamiento</p>
            <h1 className="font-playfair text-3xl md:text-4xl font-light text-[#31543d] mb-2">
              Loncheras <span className="font-semibold shimmer-rose">Saludables.</span>
            </h1>
            <p className="font-nunito text-xs text-[#8aa487] mb-6">Por María Luisa Peña Valdivia</p>

            <p className="font-nunito text-[#5a7255] leading-relaxed mb-6">
              Loncheras y snacks saludables para inicial, primaria y secundaria, con menús
              económicos de la Costa, Sierra y Selva del Perú y su valor nutricional.
            </p>

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

        {/* VISTA PREVIA */}
        <section className="mt-14">
          <div className="text-center mb-5">
            <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-1 font-semibold">Vista previa gratis</p>
            <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-[#31543d]">Hojea el libro</h2>
            <p className="font-nunito text-sm text-[#5a7255] mt-1">
              Lee gratis desde la portada hasta el capítulo <b>Enfermedades comunes</b>. El libro completo se adquiere por Hotmart.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border-2 border-[#C5DFC5] bg-white shadow-lg">
            <iframe
              src="/libro/loncheras-preview.pdf#view=FitH"
              title="Vista previa — Loncheras Saludables"
              className="w-full h-[75vh]"
            />
          </div>
          <div className="text-center mt-6">
            <a
              href={HOTMART_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-coquette inline-flex items-center justify-center gap-3 bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white px-8 py-4 rounded-full transition font-semibold shadow-lg shadow-pink-200 font-nunito"
            >
              Comprar el libro completo
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
