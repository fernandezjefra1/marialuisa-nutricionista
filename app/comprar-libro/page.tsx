"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser, NIVELES_FIDELIZACION } from "@/lib/use-user";

// === CONFIGURACIÓN ===
const WHATSAPP_NUMERO = "51941827803";
const PRECIO_VIRTUAL = 10;
const PRECIO_FISICO = 20;

type Formato = "virtual" | "fisico";
type MetodoPago = "yape" | "plin" | "transferencia" | "efectivo";

export default function ComprarLibroPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, nombre: nombreUsuario, correo: correoUsuario, numCompras, nivel, proximoNivel, loading: loadingUser } = useUser();

  const [formato, setFormato] = useState<Formato>("fisico");
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("yape");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Redirigir a login si no está autenticado (después de que termine de cargar)
  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login?redirect=/comprar-libro");
    }
  }, [loadingUser, user, router]);

  // Auto-llenar nombre y correo cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      setNombre(nombreUsuario);
      setCorreo(correoUsuario);
    }
  }, [user, nombreUsuario, correoUsuario]);

  const precio = formato === "virtual" ? PRECIO_VIRTUAL : PRECIO_FISICO;

  // Mientras carga la info del usuario
  if (loadingUser) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-sm text-neutral-500">Cargando...</p>
      </main>
    );
  }

  // Si no hay usuario, no renderizamos nada (el useEffect ya redirige)
  if (!user) {
    return null;
  }

  function validar() {
    if (!nombre.trim()) return "Por favor ingresa tu nombre completo";
    if (!whatsapp.trim() || whatsapp.length < 9) return "Por favor ingresa un WhatsApp válido";
    if (!correo.trim() || !correo.includes("@")) return "Por favor ingresa un correo válido";
    if (formato === "fisico") {
      if (!direccion.trim()) return "Por favor ingresa tu dirección";
    }
    return null;
  }

  async function handleConfirmar() {
    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError(null);
    setEnviando(true);

    // 1. Guardar la compra en Supabase
    const { error: errorDb } = await supabase.from("compras").insert({
      user_id: user!.id,
      producto: "Libro Nutrición del Bebé",
      formato,
      precio,
      nombre,
      whatsapp,
      correo,
      direccion: formato === "fisico" ? direccion : null,
      referencia: formato === "fisico" ? referencia : null,
      metodo_pago: metodoPago,
      estado: "pendiente",
    });

    if (errorDb) {
      setError("Hubo un error al guardar tu pedido. Intenta de nuevo.");
      setEnviando(false);
      console.error(errorDb);
      return;
    }

    // 2. Calcular el nuevo nivel tras esta compra
    const nuevoTotal = numCompras + 1;
    let nuevoNivel = NIVELES_FIDELIZACION[0];
    for (const n of NIVELES_FIDELIZACION) {
      if (nuevoTotal >= n.comprasMinimas) nuevoNivel = n;
    }

    // 3. Construir mensaje de WhatsApp
    const metodoTexto = {
      yape: "Yape",
      plin: "Plin",
      transferencia: "Transferencia bancaria",
      efectivo: "Efectivo contra entrega",
    }[metodoPago];

    const formatoTexto = formato === "virtual" ? "Libro Digital (PDF)" : "Libro Físico";

    let mensaje = `📚 *NUEVO PEDIDO — Libro Nutrición del Bebé*\n\n`;
    mensaje += `*— Cliente —*\n`;
    mensaje += `Nombre: ${nombre}\n`;
    mensaje += `WhatsApp: ${whatsapp}\n`;
    mensaje += `Correo: ${correo}\n`;
    mensaje += `${nuevoNivel.emoji} Nivel: ${nuevoNivel.nombre} (${nuevoTotal} compra${nuevoTotal !== 1 ? "s" : ""})\n\n`;
    mensaje += `*— Producto —*\n`;
    mensaje += `Formato: ${formatoTexto}\n`;
    mensaje += `Precio: S/ ${precio}\n\n`;

    if (formato === "fisico") {
      mensaje += `*— Envío (San Juan de Miraflores) —*\n`;
      mensaje += `Dirección: ${direccion}\n`;
      if (referencia) mensaje += `Referencia: ${referencia}\n`;
      mensaje += `\n`;
    }

    mensaje += `*— Pago —*\n`;
    mensaje += `Método: ${metodoTexto}\n\n`;
    mensaje += `Por favor confírmame los datos para coordinar el pago. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
window.open(url, "_blank");

// Redirigir al perfil con flag de "nuevo pedido"
router.push("/perfil?tab=compras&nuevo=1");
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header simple */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition">
            ← Volver al inicio
          </Link>
          <p className="text-sm font-semibold">María Luisa Nutricionista</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Columna izquierda: Formulario */}
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
              Finalizar compra
            </p>
            <h1 className="text-3xl md:text-4xl font-light mb-2">
              Completa tu <span className="font-semibold">pedido.</span>
            </h1>
            <p className="text-neutral-600 mb-10 text-sm">
              Llena este formulario y María Luisa coordinará contigo por WhatsApp.
            </p>

            {error && (
              <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* PASO 1: Formato */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-semibold">1</span>
                <h2 className="text-lg font-semibold">Elige el formato</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormato("virtual")}
                  className={`text-left p-5 rounded-2xl border-2 transition ${
                    formato === "virtual"
                      ? "border-neutral-900 bg-white"
                      : "border-neutral-200 bg-white hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">📱</div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formato === "virtual" ? "border-neutral-900" : "border-neutral-300"
                    }`}>
                      {formato === "virtual" && <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full" />}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">Libro Digital</h3>
                  <p className="text-xs text-neutral-500 mb-3">PDF · Lo recibes por correo</p>
                  <p className="text-2xl font-semibold">S/ {PRECIO_VIRTUAL}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormato("fisico")}
                  className={`text-left p-5 rounded-2xl border-2 transition ${
                    formato === "fisico"
                      ? "border-neutral-900 bg-white"
                      : "border-neutral-200 bg-white hover:border-neutral-400"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-2xl">📚</div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formato === "fisico" ? "border-neutral-900" : "border-neutral-300"
                    }`}>
                      {formato === "fisico" && <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full" />}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">Libro Físico</h3>
                  <p className="text-xs text-neutral-500 mb-3">Delivery gratis en San Juan</p>
                  <p className="text-2xl font-semibold">S/ {PRECIO_FISICO}</p>
                </button>
              </div>
            </section>

            {/* PASO 2: Datos */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-semibold">2</span>
                <h2 className="text-lg font-semibold">Tus datos</h2>
              </div>

              <div className="space-y-4 bg-white p-6 rounded-2xl border border-neutral-200">
                <div>
                  <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="María García López"
                    className="w-full border border-neutral-300 px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="999 888 777"
                      className="w-full border border-neutral-300 px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full border border-neutral-300 px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-900 transition"
                    />
                  </div>
                </div>

                {formato === "fisico" && (
                  <>
                    <div className="pt-2 border-t border-neutral-200">
                      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3 mt-3">
                        Dirección de envío (San Juan de Miraflores)
                      </p>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Av. Las Flores 123"
                        className="w-full border border-neutral-300 px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-900 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block">
                        Referencia (opcional)
                      </label>
                      <input
                        type="text"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                        placeholder="Frente al parque, casa color blanco"
                        className="w-full border border-neutral-300 px-4 py-3 rounded-lg focus:outline-none focus:border-neutral-900 transition"
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* PASO 3: Método de pago */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-semibold">3</span>
                <h2 className="text-lg font-semibold">Método de pago</h2>
              </div>

              <div className="space-y-2">
                <OpcionPago seleccionado={metodoPago === "yape"} onClick={() => setMetodoPago("yape")} titulo="Yape" descripcion="Pago instantáneo desde tu app" />
                <OpcionPago seleccionado={metodoPago === "plin"} onClick={() => setMetodoPago("plin")} titulo="Plin" descripcion="Pago instantáneo desde tu app" />
                <OpcionPago seleccionado={metodoPago === "transferencia"} onClick={() => setMetodoPago("transferencia")} titulo="Transferencia bancaria" descripcion="BCP, Interbank, BBVA u otros" />
                {formato === "fisico" && (
                  <OpcionPago seleccionado={metodoPago === "efectivo"} onClick={() => setMetodoPago("efectivo")} titulo="Efectivo contra entrega" descripcion="Paga al recibir el libro (solo libro físico)" />
                )}
              </div>

              <p className="text-xs text-neutral-500 mt-4">
                María Luisa te enviará por WhatsApp los datos para realizar el pago una vez confirmes el pedido.
              </p>
            </section>

            <div className="lg:hidden">
              <BotonConfirmar onClick={handleConfirmar} precio={precio} enviando={enviando} />
            </div>
          </div>

          {/* Columna derecha: Resumen sticky */}
          <aside className="lg:sticky lg:top-6 lg:self-start space-y-4">
            {/* Card de fidelización */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-700 text-white rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">
                Programa de Fidelización
              </p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{nivel.emoji}</span>
                <div>
                  <p className="font-semibold">{nivel.nombre}</p>
                  <p className="text-xs text-neutral-300">{numCompras} compra{numCompras !== 1 ? "s" : ""} realizadas</p>
                </div>
              </div>
              {proximoNivel ? (
                <div className="border-t border-neutral-700 pt-3 text-xs text-neutral-300 leading-relaxed">
                  <p className="text-neutral-400 mb-1">Próximo nivel: {proximoNivel.emoji} {proximoNivel.nombre}</p>
                  <p>Te faltan <span className="text-white font-semibold">{proximoNivel.comprasFaltantes}</span> compra{proximoNivel.comprasFaltantes !== 1 ? "s" : ""} para desbloquearlo</p>
                  <p className="text-neutral-400 italic mt-1">{proximoNivel.beneficio}</p>
                </div>
              ) : (
                <div className="border-t border-neutral-700 pt-3 text-xs text-neutral-300">
                  <p>🎉 ¡Felicidades! Ya alcanzaste el nivel máximo.</p>
                </div>
              )}
            </div>

            {/* Card de pedido */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h3 className="font-semibold mb-4">Resumen del pedido</h3>

              <div className="flex gap-4 pb-4 border-b border-neutral-200">
                <div className="relative w-16 h-20 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/libro-portada.jpg"
                    alt="Libro"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">Nutrición del Bebé</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formato === "virtual" ? "Libro Digital (PDF)" : "Libro Físico"}
                  </p>
                  <p className="text-sm font-semibold mt-2">S/ {precio}</p>
                </div>
              </div>

              <div className="py-4 space-y-2 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>S/ {precio}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Envío</span>
                  <span className="text-green-700 font-medium">
                    {formato === "fisico" ? "Gratis" : "—"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-neutral-200 mb-6">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-semibold">S/ {precio}</span>
              </div>

              <div className="hidden lg:block">
                <BotonConfirmar onClick={handleConfirmar} precio={precio} enviando={enviando} />
              </div>

              <p className="text-xs text-neutral-500 text-center mt-4 leading-relaxed">
                Al confirmar, se abrirá WhatsApp con tu pedido pre-llenado para que María Luisa coordine el pago.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ---------- COMPONENTES AUXILIARES ---------- */

function OpcionPago({
  seleccionado,
  onClick,
  titulo,
  descripcion,
}: {
  seleccionado: boolean;
  onClick: () => void;
  titulo: string;
  descripcion: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-4 ${
        seleccionado
          ? "border-neutral-900 bg-white"
          : "border-neutral-200 bg-white hover:border-neutral-400"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        seleccionado ? "border-neutral-900" : "border-neutral-300"
      }`}>
        {seleccionado && <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full" />}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{titulo}</p>
        <p className="text-xs text-neutral-500">{descripcion}</p>
      </div>
    </button>
  );
}

function BotonConfirmar({ onClick, precio, enviando }: { onClick: () => void; precio: number; enviando: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={enviando}
      className="w-full bg-[#25D366] hover:bg-[#1FAA52] disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-3"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      {enviando ? "Procesando..." : `Confirmar pedido · S/ ${precio}`}
    </button>
  );
}