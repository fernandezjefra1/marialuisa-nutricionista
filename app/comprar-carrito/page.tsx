"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/lib/use-user";
import { useCarrito } from "@/lib/use-carrito";

const WHATSAPP_NUMERO = "51941827803";

type MetodoPago = "yape" | "plin" | "transferencia" | "efectivo";

export default function ComprarCarritoPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, nombre: nombreUsuario, correo: correoUsuario, loading: loadingUser } = useUser();
  const { items, subtotal, vaciar, cargado: carritoCargado } = useCarrito();

  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("yape");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login?redirect=/comprar-carrito");
    }
  }, [loadingUser, user, router]);

  // Auto-llenar datos del usuario
  useEffect(() => {
    if (user) {
      setNombre(nombreUsuario);
      setCorreo(correoUsuario);
    }
  }, [user, nombreUsuario, correoUsuario]);

  // Si el carrito está vacío, redirigir a productos
  useEffect(() => {
    if (carritoCargado && items.length === 0 && !enviando) {
      router.push("/productos");
    }
  }, [carritoCargado, items.length, router, enviando]);

  if (loadingUser || !user || !carritoCargado) {
    return (
      <main className="min-h-screen bg-[var(--yucca)] flex items-center justify-center">
        <p className="text-sm text-[var(--texto-suave)]">Cargando...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return null; // El useEffect ya redirige
  }

  function validar() {
    if (!nombre.trim()) return "Por favor ingresa tu nombre completo";
    if (!whatsapp.trim() || whatsapp.length < 9) return "Por favor ingresa un WhatsApp válido";
    if (!correo.trim() || !correo.includes("@")) return "Por favor ingresa un correo válido";
    if (!direccion.trim()) return "Por favor ingresa tu dirección de envío";
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

    // Determinar tipo de pedido
    const tieneProductos = items.some((i) => i.tipo === "producto");
    const tieneSnacks = items.some((i) => i.tipo === "snack");
    const tipo = tieneProductos && tieneSnacks ? "mixto" : tieneProductos ? "productos" : "snacks";

    // Guardar pedido en Supabase
    const { error: errorDb } = await supabase.from("pedidos").insert({
      user_id: user!.id,
      nombre,
      whatsapp,
      correo,
      direccion,
      referencia: referencia || null,
      items: items.map((i) => ({
        id: i.id,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad,
        tipo: i.tipo,
        subtotal: i.precio * i.cantidad,
      })),
      subtotal,
      total: subtotal,
      metodo_pago: metodoPago,
      estado: "pendiente",
      tipo,
    });

    if (errorDb) {
      setError("Hubo un error al guardar tu pedido. Intenta de nuevo.");
      setEnviando(false);
      console.error(errorDb);
      return;
    }

    // Construir mensaje WhatsApp
    const metodoTexto = {
      yape: "Yape",
      plin: "Plin",
      transferencia: "Transferencia bancaria",
      efectivo: "Efectivo contra entrega",
    }[metodoPago];

    let mensaje = `*NUEVO PEDIDO - Productos*\n\n`;
    mensaje += `*— Cliente —*\n`;
    mensaje += `Nombre: ${nombre}\n`;
    mensaje += `WhatsApp: ${whatsapp}\n`;
    mensaje += `Correo: ${correo}\n\n`;
    mensaje += `*— Productos (${items.length}) —*\n`;
    items.forEach((item) => {
      mensaje += `• ${item.cantidad}x ${item.nombre} - S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    mensaje += `\n*Subtotal: S/ ${subtotal.toFixed(2)}*\n\n`;
    mensaje += `*— Envío —*\n`;
    mensaje += `Dirección: ${direccion}\n`;
    if (referencia) mensaje += `Referencia: ${referencia}\n`;
    mensaje += `\n*— Pago —*\n`;
    mensaje += `Método: ${metodoTexto}\n\n`;
    mensaje += `Por favor confírmame los datos para coordinar el pago. ¡Gracias!`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");

    // Vaciar el carrito tras confirmar
    vaciar();

    router.push("/perfil?tab=compras&nuevo=1");
  }

  return (
    <main className="min-h-screen bg-[var(--yucca)]">
      {/* Header */}
      <header className="bg-[var(--yucca-soft)] border-b border-[var(--borde-rosa)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/productos" className="text-sm text-[var(--texto-suave)] hover:text-[var(--primrose)] transition">
            ← Seguir comprando
          </Link>
          <p className="text-sm font-semibold text-[var(--texto-principal)]">
            María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-10">
          {/* Columna izquierda: Formulario */}
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
              Finalizar pedido
            </p>
            <h1 className="text-3xl md:text-4xl font-light mb-2 text-[var(--texto-principal)]">
              Completa tu <span className="font-semibold text-[var(--primrose)]">información.</span>
            </h1>
            <p className="text-[var(--texto-suave)] mb-10 text-sm">
              Llena este formulario y María Luisa coordinará contigo por WhatsApp.
            </p>

            {error && (
              <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* PASO 1: Datos */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[var(--primrose)] text-white text-xs flex items-center justify-center font-semibold">1</span>
                <h2 className="text-lg font-semibold text-[var(--texto-principal)]">Tus datos</h2>
              </div>

              <div className="space-y-4 bg-white p-6 rounded-2xl border-2 border-[var(--borde-rosa)]">
                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="María García López"
                    className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--primrose)] transition"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="999 888 777"
                      className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--primrose)] transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                      Correo *
                    </label>
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--primrose)] transition"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* PASO 2: Dirección */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[var(--lime)] text-white text-xs flex items-center justify-center font-semibold">2</span>
                <h2 className="text-lg font-semibold text-[var(--texto-principal)]">Dirección de envío</h2>
              </div>

              <div className="space-y-4 bg-white p-6 rounded-2xl border-2 border-[var(--borde-verde)]">
                <p className="text-xs text-[var(--texto-suave)] mb-2">
                  Por ahora solo realizamos envíos en San Juan de Miraflores. Para otras zonas, contáctanos directamente.
                </p>

                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Av. Las Flores 123, San Juan de Miraflores"
                    className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--lime)] transition"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                    Referencia (opcional)
                  </label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Frente al parque, casa color blanco"
                    className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--lime)] transition"
                  />
                </div>
              </div>
            </section>

            {/* PASO 3: Método de pago */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-[var(--primrose)] text-white text-xs flex items-center justify-center font-semibold">3</span>
                <h2 className="text-lg font-semibold text-[var(--texto-principal)]">Método de pago</h2>
              </div>

              <div className="space-y-2">
                <OpcionPago seleccionado={metodoPago === "yape"} onClick={() => setMetodoPago("yape")} titulo="Yape" descripcion="Pago instantáneo desde tu app" />
                <OpcionPago seleccionado={metodoPago === "plin"} onClick={() => setMetodoPago("plin")} titulo="Plin" descripcion="Pago instantáneo desde tu app" />
                <OpcionPago seleccionado={metodoPago === "transferencia"} onClick={() => setMetodoPago("transferencia")} titulo="Transferencia bancaria" descripcion="BCP, Interbank, BBVA u otros" />
                <OpcionPago seleccionado={metodoPago === "efectivo"} onClick={() => setMetodoPago("efectivo")} titulo="Efectivo contra entrega" descripcion="Paga al recibir tu pedido" />
              </div>

              <p className="text-xs text-[var(--texto-suave)] mt-4">
                María Luisa te enviará por WhatsApp los datos para realizar el pago una vez confirmes el pedido.
              </p>
            </section>

            {/* Botón mobile */}
            <div className="lg:hidden">
              <BotonConfirmar onClick={handleConfirmar} subtotal={subtotal} enviando={enviando} />
            </div>
          </div>

          {/* Columna derecha: Resumen sticky */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-2xl border-2 border-[var(--borde-rosa)] p-6 shadow-lg shadow-pink-100">
              <h3 className="font-semibold mb-4 text-[var(--texto-principal)]">
                Resumen del pedido <span className="text-sm font-normal text-[var(--texto-suave)]">({items.length} {items.length === 1 ? "item" : "items"})</span>
              </h3>

              {/* Lista de items */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4 pr-2">
                {items.map((item) => (
                  <div key={`${item.tipo}-${item.id}`} className="flex gap-3 pb-3 border-b border-[var(--borde-suave)] last:border-0">
                    <div className="relative w-12 h-12 bg-[var(--pinktone-soft)] rounded-lg overflow-hidden flex-shrink-0">
                      {item.imagen_url ? (
                        <Image
                          src={item.imagen_url}
                          alt={item.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--texto-tenue)] text-sm">
                          ◇
                        </div>
                      )}
                      <span className="absolute -top-1 -right-1 bg-[var(--primrose)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {item.cantidad}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--texto-principal)] truncate">{item.nombre}</p>
                      <p className="text-xs text-[var(--texto-suave)]">S/ {item.precio.toFixed(2)} c/u</p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--texto-principal)] whitespace-nowrap">
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="py-4 space-y-2 text-sm border-t border-[var(--borde-rosa)]">
                <div className="flex justify-between text-[var(--texto-suave)]">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--texto-suave)]">
                  <span>Envío</span>
                  <span className="text-[var(--lime)] font-semibold">A coordinar</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t-2 border-[var(--borde-rosa)] mb-6">
                <span className="font-semibold text-[var(--texto-principal)]">Total</span>
                <span className="text-2xl font-semibold text-[var(--texto-principal)]">
                  S/ {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="hidden lg:block">
                <BotonConfirmar onClick={handleConfirmar} subtotal={subtotal} enviando={enviando} />
              </div>

              <p className="text-xs text-[var(--texto-suave)] text-center mt-4 leading-relaxed">
                Al confirmar, se abrirá WhatsApp con tu pedido pre-llenado para que María Luisa coordine el pago y el envío.
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
          ? "border-[var(--primrose)] bg-[var(--pinktone-soft)]"
          : "border-[var(--borde-suave)] bg-white hover:border-[var(--borde-rosa)]"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        seleccionado ? "border-[var(--primrose)]" : "border-[var(--borde-rosa)]"
      }`}>
        {seleccionado && <div className="w-2.5 h-2.5 bg-[var(--primrose)] rounded-full" />}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-[var(--texto-principal)]">{titulo}</p>
        <p className="text-xs text-[var(--texto-suave)]">{descripcion}</p>
      </div>
    </button>
  );
}

function BotonConfirmar({ onClick, subtotal, enviando }: { onClick: () => void; subtotal: number; enviando: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={enviando}
      className="w-full bg-[#25D366] hover:bg-[#1FAA52] disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-3"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      {enviando ? "Procesando..." : `Confirmar pedido · S/ ${subtotal.toFixed(2)}`}
    </button>
  );
}