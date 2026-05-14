"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/lib/use-user";

// === CONFIGURACIÓN ===
const WHATSAPP_NUMERO = "51941827803";

export default function EmpresasPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, nombre, correo, loading } = useUser();

  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/empresas");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[var(--yucca)] flex items-center justify-center">
        <p className="text-sm text-[var(--texto-suave)]">Cargando...</p>
      </main>
    );
  }

  async function handleSolicitar() {
    if (!whatsapp.trim() || whatsapp.length < 9) {
      setError("Por favor ingresa un número de WhatsApp válido");
      return;
    }
    setError(null);
    setEnviando(true);

    // Guardar en Supabase
    const { error: errorDb } = await supabase.from("solicitudes_empresariales").insert({
      user_id: user!.id,
      nombre_contacto: nombre,
      correo: correo,
      whatsapp,
      nombre_empresa: nombreEmpresa || null,
      mensaje: mensaje || null,
      estado: "nuevo",
    });

    if (errorDb) {
      setError("Hubo un error al enviar tu solicitud. Intenta de nuevo.");
      setEnviando(false);
      console.error(errorDb);
      return;
    }

    // Construir mensaje WhatsApp
    let mensajeWA = `*SOLICITUD DE COTIZACIÓN EMPRESARIAL*\n\n`;
    mensajeWA += `*— Datos de contacto —*\n`;
    mensajeWA += `Nombre: ${nombre}\n`;
    mensajeWA += `Correo: ${correo}\n`;
    mensajeWA += `WhatsApp: ${whatsapp}\n\n`;
    if (nombreEmpresa) {
      mensajeWA += `*— Empresa —*\n`;
      mensajeWA += `${nombreEmpresa}\n\n`;
    }
    mensajeWA += `*— Interés —*\n`;
    mensajeWA += `Servicio: Programa de Bienestar Nutricional para empresas (Hoja de Levantamiento Nutricional)\n\n`;
    if (mensaje) {
      mensajeWA += `*— Mensaje —*\n${mensaje}\n\n`;
    }
    mensajeWA += `Por favor, me gustaría recibir más información y cotización. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensajeWA)}`;
    window.open(url, "_blank");

    router.push("/perfil?tab=compras&nuevo=1");
  }

  return (
    <main className="min-h-screen bg-[var(--yucca)]">
      {/* Header simple */}
      <header className="bg-[var(--yucca-soft)] border-b border-[var(--borde-rosa)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-[var(--texto-suave)] hover:text-[var(--primrose)] transition">
            ← Volver al inicio
          </Link>
          <p className="text-sm font-semibold text-[var(--texto-principal)]">
            María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
          </p>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[var(--lime-soft)] via-[var(--yucca)] to-[var(--pinktone-soft)] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-4 font-semibold">
            Programa Corporativo
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6 text-[var(--texto-principal)]">
            Bienestar Nutricional<br />
            <span className="font-semibold text-[var(--lime)]">para tu Empresa.</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--texto-suave)] leading-relaxed max-w-2xl mx-auto mb-8">
            Mejora la salud, el rendimiento y la productividad de tus colaboradores
            con un programa profesional de evaluación nutricional, diseñado para empresas modernas
            que invierten en el bienestar de su equipo.
          </p>
          <a
            href="#solicitar"
            className="inline-block bg-[var(--lime)] text-white px-8 py-4 rounded-full hover:bg-[var(--lime-hover)] transition font-medium shadow-lg shadow-green-200"
          >
            Solicitar información
          </a>
        </div>
      </section>

      {/* QUÉ INCLUYE */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold text-center">
            Servicios incluidos
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-[var(--texto-principal)]">
            Un programa <span className="font-semibold text-[var(--lime)]">integral.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <CardServicio
              numero="01"
              titulo="Hoja de Levantamiento Nutricional"
              descripcion="Evaluación individualizada de cada colaborador. Documento estructurado que recopila datos clave, diagnostica su estado nutricional y diseña intervenciones personalizadas."
              color="lime"
            />
            <CardServicio
              numero="02"
              titulo="Evaluación grupal de hábitos"
              descripcion="Análisis del comportamiento alimentario del equipo para identificar oportunidades de mejora colectiva en el ambiente laboral."
              color="primrose"
            />
            <CardServicio
              numero="03"
              titulo="Plan alimentario recomendado"
              descripcion="Sugerencias personalizadas de alimentación según el perfil de cada colaborador, considerando su rutina y necesidades."
              color="primrose"
            />
            <CardServicio
              numero="04"
              titulo="Charlas y talleres in-company"
              descripcion="Capacitaciones presenciales o virtuales sobre nutrición preventiva, alimentación saludable y hábitos para la oficina."
              color="lime"
            />
          </div>
        </div>
      </section>

      {/* PARA QUIÉN ES */}
      <section className="py-16 md:py-20 bg-[var(--lime-soft)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
                Diseñado para
              </p>
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-[var(--texto-principal)]">
                Empresas que <span className="font-semibold text-[var(--primrose)]">cuidan a su equipo.</span>
              </h2>
              <ul className="space-y-3 text-[var(--texto-principal)]">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lime)] font-bold text-xl">—</span>
                  <span>Empresas con 10 o más colaboradores</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lime)] font-bold text-xl">—</span>
                  <span>Áreas de Recursos Humanos enfocadas en wellness corporativo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lime)] font-bold text-xl">—</span>
                  <span>Organizaciones que cumplen con responsabilidad social</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--lime)] font-bold text-xl">—</span>
                  <span>Instituciones educativas, clínicas y centros de salud</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-green-100 border-2 border-[var(--borde-verde)]">
              <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-3 font-semibold">
                Beneficios para tu empresa
              </p>
              <ul className="space-y-3 text-sm text-[var(--texto-principal)]">
                <li>Reducción del ausentismo por temas de salud</li>
                <li>Mejora en el rendimiento y concentración del equipo</li>
                <li>Cumplimiento de responsabilidad social empresarial</li>
                <li>Beneficio diferencial para retención de talento</li>
                <li>Profesional colegiada con experiencia en MINSA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold text-center">
            ¿Cómo trabajamos?
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-[var(--texto-principal)]">
            Cuatro pasos <span className="font-semibold text-[var(--primrose)]">simples.</span>
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <PasoCard
              numero="1"
              titulo="Solicitas cotización"
              descripcion="Llenas el formulario y coordinamos por WhatsApp."
            />
            <PasoCard
              numero="2"
              titulo="Reunión inicial"
              descripcion="Conversamos las necesidades de tu equipo (virtual o presencial)."
            />
            <PasoCard
              numero="3"
              titulo="Evaluación"
              descripcion="Realizamos las hojas de levantamiento a cada colaborador."
            />
            <PasoCard
              numero="4"
              titulo="Resultados"
              descripcion="Entregamos diagnósticos individuales y plan grupal."
            />
          </div>
        </div>
      </section>

      {/* FORMULARIO */}
      <section id="solicitar" className="py-16 md:py-20 bg-[var(--yucca)]">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold text-center">
            Empieza hoy
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-center mb-3 text-[var(--texto-principal)]">
            Solicita <span className="font-semibold text-[var(--lime)]">información.</span>
          </h2>
          <p className="text-sm text-[var(--texto-suave)] text-center mb-10 leading-relaxed">
            María Luisa recibirá tu solicitud por WhatsApp y te contactará en menos de 24 horas
            para coordinar una reunión inicial.
          </p>

          <div className="bg-white rounded-2xl border-2 border-[var(--borde-verde)] p-6 md:p-8 shadow-lg shadow-green-100">
            {error && (
              <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Datos del usuario (auto-llenados) */}
              <div className="bg-[var(--pinktone-soft)] rounded-xl p-4 border border-[var(--borde-rosa)]">
                <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
                  Tus datos (de tu perfil)
                </p>
                <p className="text-sm text-[var(--texto-principal)]"><strong>{nombre}</strong></p>
                <p className="text-xs text-[var(--texto-suave)]">{correo}</p>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                  WhatsApp de contacto *
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="999 888 777"
                  className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--lime)] transition"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                  Nombre de tu empresa
                </label>
                <input
                  type="text"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  placeholder="Mi Empresa S.A.C."
                  className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--lime)] transition"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                  Mensaje (opcional)
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={4}
                  placeholder="¿Cuántos colaboradores? ¿Algún requerimiento específico?"
                  className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--lime)] transition resize-none"
                />
              </div>

              <button
                onClick={handleSolicitar}
                disabled={enviando}
                className="w-full bg-[var(--lime)] hover:bg-[var(--lime-hover)] disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {enviando ? "Enviando..." : "Solicitar por WhatsApp"}
              </button>

              <p className="text-xs text-[var(--texto-tenue)] text-center leading-relaxed">
                Al enviar, María Luisa recibirá tu solicitud y se contactará contigo
                en las próximas 24 horas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER simple */}
      <footer className="bg-[var(--texto-principal)] text-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm mb-2">
            María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
          </p>
          <p className="text-xs text-pink-100/60">
            Nutrición preventiva para todas las etapas de la vida
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ---------- COMPONENTES ---------- */

function CardServicio({
  numero,
  titulo,
  descripcion,
  color,
}: {
  numero: string;
  titulo: string;
  descripcion: string;
  color: "primrose" | "lime";
}) {
  return (
    <div className={`p-6 rounded-2xl border-2 transition hover:-translate-y-1 ${
      color === "primrose"
        ? "bg-[var(--pinktone-soft)] border-[var(--borde-rosa)] hover:border-[var(--primrose)]"
        : "bg-[var(--lime-soft)] border-[var(--borde-verde)] hover:border-[var(--lime)]"
    }`}>
      <p className={`text-xs mb-3 font-semibold ${
        color === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"
      }`}>
        {numero}
      </p>
      <h3 className="font-semibold mb-2 text-[var(--texto-principal)]">{titulo}</h3>
      <p className="text-sm text-[var(--texto-suave)] leading-relaxed">{descripcion}</p>
    </div>
  );
}

function PasoCard({
  numero,
  titulo,
  descripcion,
}: {
  numero: string;
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--primrose)] to-[var(--lime)] text-white text-xl font-semibold flex items-center justify-center shadow-lg shadow-pink-200">
        {numero}
      </div>
      <h3 className="font-semibold mb-2 text-[var(--texto-principal)]">{titulo}</h3>
      <p className="text-sm text-[var(--texto-suave)] leading-relaxed">{descripcion}</p>
    </div>
  );
}