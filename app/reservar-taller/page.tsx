"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/lib/use-user";

const WHATSAPP_NUMERO = "51985577017";

type Modalidad = "presencial" | "virtual";

const PRECIOS: Record<Modalidad, number> = {
  presencial: 80,
  virtual: 40,
};

export default function ReservarTallerPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, nombre, correo, loading } = useUser();

  const [whatsapp, setWhatsapp] = useState("");
  const [modalidad, setModalidad] = useState<Modalidad>("presencial");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/reservar-taller");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[var(--yucca)] flex items-center justify-center">
        <p className="text-sm text-[var(--texto-suave)]">Cargando...</p>
      </main>
    );
  }

  async function handleReservar() {
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, "").length < 9) {
      setError("Por favor ingresa un número de WhatsApp válido.");
      return;
    }
    setError(null);
    setEnviando(true);

    await supabase.from("reservas_taller").insert({
      user_id: user!.id,
      nombre,
      correo,
      whatsapp,
      modalidad,
      precio: PRECIOS[modalidad],
      mensaje: mensaje || null,
      estado: "pendiente",
    });

    const precio = PRECIOS[modalidad];
    const modalidadTexto = modalidad === "presencial" ? "Presencial" : "Virtual";

    let mensajeWA = `*RESERVA DE CUPO — TALLER DE COMIDA DIETÉTICA*\n\n`;
    mensajeWA += `*— Datos del participante —*\n`;
    mensajeWA += `Nombre: ${nombre}\n`;
    mensajeWA += `Correo: ${correo}\n`;
    mensajeWA += `WhatsApp: ${whatsapp}\n\n`;
    mensajeWA += `*— Detalles del taller —*\n`;
    mensajeWA += `Modalidad: ${modalidadTexto}\n`;
    mensajeWA += `Precio: S/ ${precio}\n\n`;
    if (mensaje) {
      mensajeWA += `*— Mensaje —*\n${mensaje}\n\n`;
    }
    mensajeWA += `¡Quiero reservar mi cupo! Por favor, indícame los detalles de pago y fecha. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensajeWA)}`;
    window.open(url, "_blank");

    router.push("/perfil?tab=compras&reserva=1");
  }

  return (
    <main className="min-h-screen bg-[var(--yucca)]">
      <header className="bg-[var(--yucca-soft)] border-b border-[var(--borde-rosa)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-[var(--texto-suave)] hover:text-[var(--lime)] transition">
            ← Volver al inicio
          </Link>
          <p className="text-sm font-semibold text-[var(--texto-principal)]">
            María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
          </p>
        </div>
      </header>

      <section className="bg-gradient-to-br from-[var(--lime-soft)] via-[var(--yucca)] to-[var(--pinktone-soft)] py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-4 font-semibold">
            Próximo evento
          </p>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-4 text-[var(--texto-principal)]">
            Taller de<br />
            <span className="font-semibold text-[var(--lime)]">Comida Dietética.</span>
          </h1>
          <p className="text-base text-[var(--texto-suave)] leading-relaxed max-w-xl mx-auto">
            Aprende a cocinar rico y saludable. Un taller práctico con degustación incluida
            donde descubrirás cómo preparar comidas fáciles, saludables y saciadoras.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[var(--lime-soft)] rounded-2xl p-5 border-2 border-[var(--borde-verde)] text-center">
              <p className="text-xs uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold">Incluye</p>
              <p className="text-sm text-[var(--texto-principal)] font-medium">Degustación</p>
            </div>
            <div className="bg-[var(--pinktone-soft)] rounded-2xl p-5 border-2 border-[var(--borde-rosa)] text-center">
              <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">Materiales</p>
              <p className="text-sm text-[var(--texto-principal)] font-medium">Taper, cubiertos, jabón y toalla</p>
            </div>
            <div className="bg-[var(--lime-soft)] rounded-2xl p-5 border-2 border-[var(--borde-verde)] text-center">
              <p className="text-xs uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold">Modalidad</p>
              <p className="text-sm text-[var(--texto-principal)] font-medium">Presencial y Virtual</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-[var(--yucca)]">
        <div className="max-w-xl mx-auto px-6">
          <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold text-center">
            Reserva tu lugar
          </p>
          <h2 className="text-3xl font-light text-center mb-3 text-[var(--texto-principal)]">
            Completa el <span className="font-semibold text-[var(--lime)]">formulario.</span>
          </h2>
          <p className="text-sm text-[var(--texto-suave)] text-center mb-10 leading-relaxed">
            María Luisa recibirá tu solicitud por WhatsApp y te confirmará los detalles del pago y fecha.
          </p>

          <div className="bg-white rounded-2xl border-2 border-[var(--borde-verde)] p-6 md:p-8 shadow-lg shadow-green-100">
            {error && (
              <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="bg-[var(--pinktone-soft)] rounded-xl p-4 border border-[var(--borde-rosa)]">
                <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
                  Tus datos (de tu perfil)
                </p>
                <p className="text-sm font-semibold text-[var(--texto-principal)]">{nombre}</p>
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
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-3 block font-semibold">
                  Modalidad *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setModalidad("presencial")}
                    className={`rounded-xl p-4 border-2 text-left transition ${
                      modalidad === "presencial"
                        ? "border-[var(--primrose)] bg-[var(--pinktone-soft)]"
                        : "border-[var(--borde-rosa)] bg-white hover:border-[var(--primrose)]"
                    }`}
                  >
                    <p className={`text-xs uppercase tracking-widest font-semibold mb-1 ${
                      modalidad === "presencial" ? "text-[var(--primrose)]" : "text-[var(--texto-suave)]"
                    }`}>
                      Presencial
                    </p>
                    <p className="text-2xl font-semibold text-[var(--texto-principal)]">S/ 80</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalidad("virtual")}
                    className={`rounded-xl p-4 border-2 text-left transition ${
                      modalidad === "virtual"
                        ? "border-[var(--lime)] bg-[var(--lime-soft)]"
                        : "border-[var(--borde-verde)] bg-white hover:border-[var(--lime)]"
                    }`}
                  >
                    <p className={`text-xs uppercase tracking-widest font-semibold mb-1 ${
                      modalidad === "virtual" ? "text-[var(--lime)]" : "text-[var(--texto-suave)]"
                    }`}>
                      Virtual
                    </p>
                    <p className="text-2xl font-semibold text-[var(--texto-principal)]">S/ 40</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                  Mensaje (opcional)
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={3}
                  placeholder="¿Alguna pregunta o comentario sobre el taller?"
                  className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--lime)] transition resize-none"
                />
              </div>

              <button
                onClick={handleReservar}
                disabled={enviando}
                className="w-full bg-[var(--lime)] hover:bg-[var(--lime-hover)] disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {enviando ? "Enviando..." : "Reservar cupo por WhatsApp"}
              </button>

              <p className="text-xs text-[var(--texto-tenue)] text-center leading-relaxed">
                Al enviar, María Luisa recibirá tu solicitud y te confirmará la fecha,
                lugar y detalles de pago.
              </p>
            </div>
          </div>
        </div>
      </section>

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
