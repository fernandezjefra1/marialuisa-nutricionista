import Link from "next/link";

export const metadata = {
  title: "Política de privacidad — María Luisa Nutricionista",
};

const SECCIONES = [
  {
    titulo: "1. Información que recopilamos",
    contenido: `Recopilamos la siguiente información cuando usas nuestros servicios:

• Datos de identificación: nombre completo y correo electrónico, proporcionados al registrarte.
• Datos de autenticación: si inicias sesión con Google, recibimos tu nombre, foto de perfil y correo electrónico desde Google.
• Datos nutricionales: información de salud que ingresas voluntariamente (objetivos, restricciones alimentarias, historial de citas) para personalizar tu plan.
• Datos de uso: páginas visitadas, productos comprados, historial de citas y preferencias dentro del Sitio.
• Datos técnicos: dirección IP, tipo de navegador y sistema operativo, recopilados automáticamente con fines de seguridad y mejora del servicio.`,
  },
  {
    titulo: "2. Cómo usamos tu información",
    contenido: `Utilizamos tu información para los siguientes fines:

• Brindarte los servicios solicitados: envío de planes nutricionales, gestión de citas y entrega de materiales digitales adquiridos.
• Comunicación: responder tus consultas, enviarte recordatorios de citas y, con tu consentimiento, comunicaciones informativas sobre nutrición y nuevos servicios.
• Mejora del servicio: analizar cómo se usa el Sitio para mejorar la experiencia de usuario y desarrollar nuevos contenidos.
• Seguridad: detectar y prevenir fraudes o usos no autorizados de las cuentas.
• Cumplimiento legal: cuando sea requerido por las autoridades competentes de la República del Perú.`,
  },
  {
    titulo: "3. Compartir información con terceros",
    contenido: `No vendemos ni alquilamos tu información personal. Solo compartimos datos con los siguientes proveedores de servicios, estrictamente necesarios para operar el Sitio:

• Supabase: proveedor de base de datos y autenticación que almacena tus credenciales de forma segura.
• Google (solo si usas login social): si inicias sesión con Google, Google procesa tu autenticación según su propia política de privacidad.
• Vercel: proveedor de hosting donde se aloja el Sitio. Puede acceder a metadatos de tráfico para garantizar el funcionamiento.
• Pasarelas de pago: si realizas compras, los datos de pago son procesados directamente por el proveedor de pago (no almacenamos datos bancarios).

Todos los proveedores están sujetos a acuerdos de confidencialidad y solo pueden usar tus datos para los fines contratados.`,
  },
  {
    titulo: "4. Seguridad de los datos",
    contenido: `Implementamos medidas técnicas y organizativas razonables para proteger tu información contra accesos no autorizados, pérdida o alteración. Estas incluyen: cifrado en tránsito (HTTPS/TLS), autenticación segura mediante Supabase, control de acceso por roles y monitoreo de actividad sospechosa. Sin embargo, ningún sistema es completamente infalible. Te recomendamos usar contraseñas seguras y no compartir tus credenciales de acceso.`,
  },
  {
    titulo: "5. Tus derechos — Ley 29733 (Perú)",
    contenido: `De conformidad con la Ley de Protección de Datos Personales del Perú (Ley N.° 29733) y su Reglamento, tienes los siguientes derechos:

• Acceso: solicitar qué datos personales tenemos sobre ti.
• Rectificación: corregir datos inexactos o incompletos.
• Cancelación: solicitar la eliminación de tus datos cuando ya no sean necesarios.
• Oposición: oponerte al tratamiento de tus datos para fines específicos (como comunicaciones comerciales).

Para ejercer cualquiera de estos derechos, escríbenos por WhatsApp o correo electrónico. Responderemos en un plazo máximo de 20 días hábiles. Puedes también presentar una reclamación ante la Autoridad Nacional de Protección de Datos Personales del Perú.`,
  },
  {
    titulo: "6. Cookies y tecnologías similares",
    contenido: `El Sitio utiliza cookies propias estrictamente necesarias para el funcionamiento de la sesión de usuario (autenticación). No utilizamos cookies de rastreo publicitario de terceros. Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad del Sitio, en particular el inicio de sesión y el acceso a contenido personalizado. Las cookies de sesión se eliminan automáticamente al cerrar el navegador.`,
  },
  {
    titulo: "7. Contacto del responsable del tratamiento",
    contenido: `El responsable del tratamiento de tus datos personales es:

María Luisa Nutricionista
Lima, Perú
WhatsApp: +51 985 577 017 (wa.me/51985577017)

Para cualquier consulta, solicitud o reclamación relacionada con el tratamiento de tus datos personales, puedes contactarnos directamente por los canales indicados. Nos comprometemos a responderte en el menor tiempo posible.`,
  },
];

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24">

        {/* Encabezado */}
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-[#8aa487] font-nunito mb-3">
            Legal
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[var(--verde-fuerte)] mb-4">
            Política de privacidad
          </h1>
          <p className="text-sm text-[#8aa487] font-nunito">
            Última actualización: junio de 2025
          </p>
          <div className="mt-6 h-1 w-16 bg-[var(--primrose)] rounded-full mx-auto" />
        </div>

        {/* Intro */}
        <p className="text-[#5a7255] font-nunito leading-relaxed mb-10 text-base">
          En <strong className="text-[var(--verde-fuerte)]">María Luisa Nutricionista</strong> nos
          comprometemos a proteger tu información personal. Esta Política de privacidad describe qué
          datos recopilamos, cómo los utilizamos y cuáles son tus derechos, en cumplimiento de la
          Ley N.° 29733 — Ley de Protección de Datos Personales del Perú.
        </p>

        {/* Secciones */}
        <div className="space-y-10">
          {SECCIONES.map((seccion) => (
            <div key={seccion.titulo}>
              <h2 className="font-playfair text-xl font-bold text-[var(--verde-fuerte)] mb-3">
                {seccion.titulo}
              </h2>
              <p className="text-[#5a7255] font-nunito leading-relaxed text-[15px] whitespace-pre-line">
                {seccion.contenido}
              </p>
            </div>
          ))}
        </div>

        {/* Contacto destacado */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-[#d4c8b0]">
          <p className="text-sm font-semibold text-[var(--verde-fuerte)] mb-1 font-nunito">
            ¿Quieres ejercer tus derechos o tienes preguntas?
          </p>
          <p className="text-sm text-[#5a7255] font-nunito">
            Contáctanos directamente por{" "}
            <a
              href="https://wa.me/51985577017"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--verde-fuerte)] font-semibold hover:underline"
            >
              WhatsApp (+51 985 577 017)
            </a>
            . Respondemos en máximo 20 días hábiles.
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
