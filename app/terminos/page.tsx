import Link from "next/link";

export const metadata = {
  title: "Términos y condiciones — María Luisa Nutricionista",
};

const SECCIONES = [
  {
    titulo: "1. Aceptación de los términos",
    contenido: `Al acceder y utilizar el sitio web de María Luisa Nutricionista (en adelante, "el Sitio"), usted acepta quedar vinculado por estos Términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice el Sitio. El uso continuado del Sitio después de la publicación de cambios constituye su aceptación de los términos modificados.`,
  },
  {
    titulo: "2. Descripción del servicio",
    contenido: `El Sitio ofrece información general sobre nutrición, servicios de consulta nutricional personalizada, venta de planes nutricionales, recetarios y materiales educativos digitales. Los servicios disponibles incluyen asesorías individuales, programas de alimentación y reserva de citas con la nutricionista. Todos los servicios están sujetos a disponibilidad y pueden modificarse sin previo aviso.`,
  },
  {
    titulo: "3. Registro de usuarios",
    contenido: `Para acceder a determinadas funcionalidades del Sitio, como la reserva de citas o la compra de planes digitales, es necesario crear una cuenta. Al registrarse, usted se compromete a proporcionar información veraz, actualizada y completa. Es su responsabilidad mantener la confidencialidad de sus credenciales de acceso. María Luisa Nutricionista no será responsable de los daños derivados del uso no autorizado de su cuenta.`,
  },
  {
    titulo: "4. Uso aceptable",
    contenido: `Usted se compromete a utilizar el Sitio únicamente con fines lícitos y de manera que no infrinja los derechos de terceros ni restrinja o inhiba su uso. Queda prohibido: (a) publicar contenido falso, ofensivo o engañoso; (b) intentar obtener acceso no autorizado a sistemas o datos del Sitio; (c) utilizar el contenido del Sitio con fines comerciales sin autorización expresa; (d) realizar cualquier actividad que pueda dañar la reputación o el funcionamiento del Sitio.`,
  },
  {
    titulo: "5. Propiedad intelectual del contenido nutricional",
    contenido: `Todo el contenido publicado en el Sitio —incluyendo planes nutricionales, recetas, artículos, imágenes, logotipos y materiales descargables— es propiedad exclusiva de María Luisa Nutricionista o de sus respectivos titulares, y está protegido por las leyes de propiedad intelectual del Perú y tratados internacionales. Queda prohibida su reproducción, distribución o modificación sin autorización previa y por escrito. Los planes nutricionales y materiales adquiridos son de uso personal e intransferible.`,
  },
  {
    titulo: "6. Política de citas, reservas y cancelaciones",
    contenido: `Las citas pueden reservarse a través del Sitio o por los canales de contacto indicados. Para cancelar o reprogramar una cita, se requiere un aviso con al menos 24 horas de anticipación. Las cancelaciones realizadas con menos de 24 horas de antelación podrán estar sujetas a un cargo del 50% del valor de la consulta. Los planes digitales y materiales descargables no son reembolsables una vez entregados, salvo en casos de error técnico comprobado.`,
  },
  {
    titulo: "7. Limitación de responsabilidad",
    contenido: `La información publicada en este Sitio tiene carácter orientativo y educativo. No reemplaza, en ningún caso, una consulta médica o diagnóstico personalizado por parte de un profesional de la salud habilitado. María Luisa Nutricionista no se responsabiliza de los resultados obtenidos por el seguimiento autónomo de información publicada en el Sitio sin una evaluación nutricional personalizada. Si padece alguna enfermedad o condición de salud, consulte siempre a su médico antes de realizar cambios en su alimentación.`,
  },
  {
    titulo: "8. Modificaciones y ley aplicable",
    contenido: `María Luisa Nutricionista se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios entrarán en vigor desde su publicación en el Sitio. Estos Términos se rigen por las leyes de la República del Perú. Cualquier controversia derivada del uso del Sitio se someterá a los tribunales competentes de la ciudad de Lima, Perú, con renuncia expresa a cualquier otro fuero que pudiera corresponder.`,
  },
];

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24">

        {/* Encabezado */}
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-[#8aa487] font-nunito mb-3">
            Legal
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[var(--verde-fuerte)] mb-4">
            Términos y condiciones
          </h1>
          <p className="text-sm text-[#8aa487] font-nunito">
            Última actualización: junio de 2025
          </p>
          <div className="mt-6 h-1 w-16 bg-[var(--primrose)] rounded-full mx-auto" />
        </div>

        {/* Intro */}
        <p className="text-[#5a7255] font-nunito leading-relaxed mb-10 text-base">
          Bienvenida a <strong className="text-[var(--verde-fuerte)]">María Luisa Nutricionista</strong>.
          Por favor, lee detenidamente estos Términos y condiciones antes de utilizar nuestro sitio web
          y servicios. Al acceder al Sitio, confirmas que has leído, entendido y aceptado cumplir con
          estos términos.
        </p>

        {/* Secciones */}
        <div className="space-y-10">
          {SECCIONES.map((seccion) => (
            <div key={seccion.titulo}>
              <h2 className="font-playfair text-xl font-bold text-[var(--verde-fuerte)] mb-3">
                {seccion.titulo}
              </h2>
              <p className="text-[#5a7255] font-nunito leading-relaxed text-[15px]">
                {seccion.contenido}
              </p>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-[#d4c8b0]">
          <p className="text-sm text-[#5a7255] font-nunito">
            ¿Tienes preguntas sobre estos términos? Contáctanos por{" "}
            <a
              href="https://wa.me/51985577017"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--verde-fuerte)] font-semibold hover:underline"
            >
              WhatsApp
            </a>.
          </p>
        </div>

        {/* Volver */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#5a7255] hover:text-[var(--verde-fuerte)] transition-colors font-nunito"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}
