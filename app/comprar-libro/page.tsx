"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser, NIVELES_FIDELIZACION } from "@/lib/use-user";

const WHATSAPP_NUMERO = "51985577017";
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
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validarCampo(campo: string, valor: string): string {
    switch (campo) {
      case "nombre":
        if (!valor.trim()) return "El nombre es obligatorio";
        if (valor.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
        if (!valor.trim().includes(" ")) return "Ingresa tu nombre y apellido";
        return "";
      case "whatsapp":
        if (!valor) return "El número de WhatsApp es obligatorio";
        if (valor.length < 9) return "Debe tener exactamente 9 dígitos";
        if (!valor.startsWith("9")) return "El número debe empezar con 9";
        return "";
      case "correo":
        if (!valor) return "El correo es obligatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "Ingresa un correo válido (ejemplo@correo.com)";
        return "";
      case "direccion":
        if (!valor.trim()) return "La dirección es obligatoria";
        if (valor.trim().length < 10) return "La dirección es muy corta, sé más específico";
        if (!/\d/.test(valor)) return "Incluye el número de la calle (ej: Av. Lima 245)";
        return "";
      default:
        return "";
    }
  }

  function marcarError(campo: string, valor: string) {
    setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, valor) }));
  }

  useEffect(() => {
    if (!loadingUser && !user) router.push("/login?redirect=/comprar-libro");
  }, [loadingUser, user, router]);

  useEffect(() => {
    if (user) { setNombre(nombreUsuario); setCorreo(correoUsuario); }
  }, [user, nombreUsuario, correoUsuario]);

  const precio = formato === "virtual" ? PRECIO_VIRTUAL : PRECIO_FISICO;

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#d4edcc] flex items-center justify-center">
        <p className="font-nunito text-sm text-[#5a7255]">Cargando...</p>
      </div>
    );
  }

  if (!user) return null;

  function validar(): boolean {
    const nuevosErrores: Record<string, string> = {
      nombre: validarCampo("nombre", nombre),
      whatsapp: validarCampo("whatsapp", whatsapp),
      correo: validarCampo("correo", correo),
      direccion: formato === "fisico" ? validarCampo("direccion", direccion) : "",
    };
    setErrores(nuevosErrores);
    return Object.values(nuevosErrores).every((e) => e === "");
  }

  async function handleConfirmar() {
    if (!validar()) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setError(null);
    setEnviando(true);

    const { error: errorDb } = await supabase.from("compras").insert({
      user_id: user!.id,
      producto: "Libro Nutrición del Bebé",
      formato, precio, nombre, whatsapp, correo,
      direccion: formato === "fisico" ? direccion : null,
      referencia: formato === "fisico" ? referencia : null,
      metodo_pago: metodoPago,
      estado: "pendiente",
    });

    if (errorDb) { setError("Hubo un error al guardar tu pedido. Intenta de nuevo."); setEnviando(false); return; }

    const nuevoTotal = numCompras + 1;
    let nuevoNivel = NIVELES_FIDELIZACION[0];
    for (const n of NIVELES_FIDELIZACION) { if (nuevoTotal >= n.comprasMinimas) nuevoNivel = n; }

    const metodoTexto = { yape: "Yape", plin: "Plin", transferencia: "Transferencia bancaria", efectivo: "Efectivo contra entrega" }[metodoPago];
    const formatoTexto = formato === "virtual" ? "Libro Digital (PDF)" : "Libro Físico";

    let mensaje = `NUEVO PEDIDO — Libro Nutrición del Bebé\n\n`;
    mensaje += `— Cliente —\nNombre: ${nombre}\nWhatsApp: ${whatsapp}\nCorreo: ${correo}\nNivel: ${nuevoNivel.nombre} (${nuevoTotal} compra${nuevoTotal !== 1 ? "s" : ""})\n\n`;
    mensaje += `— Producto —\nFormato: ${formatoTexto}\nPrecio: S/ ${precio}\n\n`;
    if (formato === "fisico") { mensaje += `— Envío —\nDirección: ${direccion}\n`; if (referencia) mensaje += `Referencia: ${referencia}\n`; mensaje += `\n`; }
    mensaje += `— Pago —\nMétodo: ${metodoTexto}\n\nPor favor confírmame los datos para coordinar el pago. ¡Gracias!`;

    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`, "_blank");
    router.push("/perfil?tab=compras&nuevo=1");
  }

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10">

          {/* ---- COLUMNA IZQUIERDA: FORMULARIO ---- */}
          <div>
            <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-2 font-semibold">
              Finalizar compra
            </p>
            <h1 className="font-playfair text-3xl md:text-4xl font-light text-[#31543d] mb-2">
              Completa tu <span className="font-semibold shimmer-rose">pedido.</span>
            </h1>
            <p className="font-nunito text-[#5a7255] mb-10 text-sm">
              Llena este formulario y María Luisa coordinará contigo por WhatsApp.
            </p>

            {error && (
              <div className="mb-6 font-nunito text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* PASO 1: Formato */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-[#6daa6d] text-white text-xs flex items-center justify-center font-semibold">1</span>
                <h2 className="font-playfair text-lg font-semibold text-[#31543d]">Elige el formato</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* Libro Digital */}
                <button
                  type="button"
                  onClick={() => setFormato("virtual")}
                  className={`text-left p-5 rounded-2xl border-2 transition bg-white ${
                    formato === "virtual" ? "border-[#6daa6d] shadow-md shadow-green-100" : "border-[#C5DFC5] hover:border-[#6daa6d]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formato === "virtual" ? "bg-[#d4edcc]" : "bg-[#f0f8ec]"}`}>
                      <svg className="w-5 h-5 text-[#6daa6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/>
                      </svg>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formato === "virtual" ? "border-[#6daa6d]" : "border-[#C5DFC5]"}`}>
                      {formato === "virtual" && <div className="w-2.5 h-2.5 bg-[#6daa6d] rounded-full" />}
                    </div>
                  </div>
                  <h3 className="font-playfair font-semibold text-[#31543d] mb-1">Libro Digital</h3>
                  <p className="font-nunito text-xs text-[#5a7255] mb-3">PDF · Lo recibes por correo</p>
                  <p className="font-playfair text-2xl font-semibold text-[#31543d]">S/ {PRECIO_VIRTUAL}</p>
                </button>

                {/* Libro Físico */}
                <button
                  type="button"
                  onClick={() => setFormato("fisico")}
                  className={`text-left p-5 rounded-2xl border-2 transition bg-white ${
                    formato === "fisico" ? "border-[#6daa6d] shadow-md shadow-green-100" : "border-[#C5DFC5] hover:border-[#6daa6d]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formato === "fisico" ? "bg-[#d4edcc]" : "bg-[#f0f8ec]"}`}>
                      <svg className="w-5 h-5 text-[#6daa6d]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                      </svg>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formato === "fisico" ? "border-[#6daa6d]" : "border-[#C5DFC5]"}`}>
                      {formato === "fisico" && <div className="w-2.5 h-2.5 bg-[#6daa6d] rounded-full" />}
                    </div>
                  </div>
                  <h3 className="font-playfair font-semibold text-[#31543d] mb-1">Libro Físico</h3>
                  <p className="font-nunito text-xs text-[#C4607A] font-medium mb-3">Delivery gratis en San Juan</p>
                  <p className="font-playfair text-2xl font-semibold text-[#31543d]">S/ {PRECIO_FISICO}</p>
                </button>
              </div>
            </section>

            {/* PASO 2: Datos */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-[#6daa6d] text-white text-xs flex items-center justify-center font-semibold">2</span>
                <h2 className="font-playfair text-lg font-semibold text-[#31543d]">Tus datos</h2>
              </div>

              <div className="space-y-4 bg-white p-4 sm:p-6 rounded-2xl border border-[#C5DFC5]">
                <div>
                  <label className="font-nunito text-xs uppercase tracking-widest text-[#5a7255] mb-2 block font-semibold">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    maxLength={80}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, "");
                      setNombre(val);
                      if (errores.nombre) marcarError("nombre", val);
                    }}
                    onBlur={() => marcarError("nombre", nombre)}
                    placeholder="María García López"
                    className={`font-nunito w-full px-4 py-3 rounded-xl text-[#31543d] outline-none transition border-2 ${
                      errores.nombre ? "border-red-400 bg-red-50" :
                      nombre && !errores.nombre ? "border-green-400 bg-[#f0f8ec]" :
                      "border-[#C5DFC5] bg-[#f0f8ec] focus:border-[#6daa6d]"
                    }`}
                  />
                  {errores.nombre && <p className="font-nunito text-red-500 text-xs mt-1">{errores.nombre}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-nunito text-xs uppercase tracking-widest text-[#5a7255] mb-2 block font-semibold">
                      WhatsApp * <span className="normal-case tracking-normal font-normal text-[#8aa487]">(9 dígitos)</span>
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setWhatsapp(val);
                        if (errores.whatsapp) marcarError("whatsapp", val);
                      }}
                      onBlur={() => marcarError("whatsapp", whatsapp)}
                      placeholder="987654321"
                      className={`font-nunito w-full px-4 py-3 rounded-xl text-[#31543d] outline-none transition border-2 ${
                        errores.whatsapp ? "border-red-400 bg-red-50" :
                        whatsapp.length === 9 ? "border-green-400 bg-[#f0f8ec]" :
                        "border-[#C5DFC5] bg-[#f0f8ec] focus:border-[#6daa6d]"
                      }`}
                    />
                    {errores.whatsapp && <p className="font-nunito text-red-500 text-xs mt-1">{errores.whatsapp}</p>}
                  </div>
                  <div>
                    <label className="font-nunito text-xs uppercase tracking-widest text-[#5a7255] mb-2 block font-semibold">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      value={correo}
                      maxLength={100}
                      onChange={(e) => {
                        setCorreo(e.target.value);
                        if (errores.correo) marcarError("correo", e.target.value);
                      }}
                      onBlur={() => marcarError("correo", correo)}
                      placeholder="tu@correo.com"
                      className={`font-nunito w-full px-4 py-3 rounded-xl text-[#31543d] outline-none transition border-2 ${
                        errores.correo ? "border-red-400 bg-red-50" :
                        correo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ? "border-green-400 bg-[#f0f8ec]" :
                        "border-[#C5DFC5] bg-[#f0f8ec] focus:border-[#6daa6d]"
                      }`}
                    />
                    {errores.correo && <p className="font-nunito text-red-500 text-xs mt-1">{errores.correo}</p>}
                  </div>
                </div>

                {formato === "fisico" && (
                  <>
                    <div className="pt-2 border-t border-[#C5DFC5]">
                      <p className="font-nunito text-xs uppercase tracking-widest text-[#6daa6d] mb-3 mt-3 font-semibold">
                        Dirección de envío (San Juan de Miraflores)
                      </p>
                    </div>
                    <div>
                      <label className="font-nunito text-xs uppercase tracking-widest text-[#5a7255] mb-2 block font-semibold">
                        Dirección * <span className="normal-case tracking-normal font-normal text-[#8aa487]">(incluye número de calle)</span>
                      </label>
                      <input
                        type="text"
                        value={direccion}
                        maxLength={200}
                        onChange={(e) => {
                          setDireccion(e.target.value);
                          if (errores.direccion) marcarError("direccion", e.target.value);
                        }}
                        onBlur={() => marcarError("direccion", direccion)}
                        placeholder="Av. Las Flores 123"
                        className={`font-nunito w-full px-4 py-3 rounded-xl text-[#31543d] outline-none transition border-2 ${
                          errores.direccion ? "border-red-400 bg-red-50" :
                          direccion.trim().length >= 10 && /\d/.test(direccion) ? "border-green-400 bg-[#f0f8ec]" :
                          "border-[#C5DFC5] bg-[#f0f8ec] focus:border-[#6daa6d]"
                        }`}
                      />
                      {errores.direccion && <p className="font-nunito text-red-500 text-xs mt-1">{errores.direccion}</p>}
                    </div>
                    <div>
                      <label className="font-nunito text-xs uppercase tracking-widest text-[#5a7255] mb-2 block font-semibold">Referencia (opcional)</label>
                      <input
                        type="text"
                        value={referencia}
                        maxLength={150}
                        onChange={(e) => setReferencia(e.target.value)}
                        placeholder="Frente al parque, casa color blanco"
                        className="font-nunito w-full bg-[#f0f8ec] border-2 border-[#C5DFC5] px-4 py-3 rounded-xl text-[#31543d] outline-none focus:border-[#6daa6d] transition"
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* PASO 3: Método de pago */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-[#6daa6d] text-white text-xs flex items-center justify-center font-semibold">3</span>
                <h2 className="font-playfair text-lg font-semibold text-[#31543d]">Método de pago</h2>
              </div>

              <div className="space-y-2">
                <OpcionPago seleccionado={metodoPago === "yape"} onClick={() => setMetodoPago("yape")} titulo="Yape" descripcion="Pago instantáneo desde tu app" />
                <OpcionPago seleccionado={metodoPago === "plin"} onClick={() => setMetodoPago("plin")} titulo="Plin" descripcion="Pago instantáneo desde tu app" />
                <OpcionPago seleccionado={metodoPago === "transferencia"} onClick={() => setMetodoPago("transferencia")} titulo="Transferencia bancaria" descripcion="BCP, Interbank, BBVA u otros" />
                {formato === "fisico" && (
                  <OpcionPago seleccionado={metodoPago === "efectivo"} onClick={() => setMetodoPago("efectivo")} titulo="Efectivo contra entrega" descripcion="Paga al recibir el libro (solo libro físico)" />
                )}
              </div>

              <p className="font-nunito text-xs text-[#5a7255] mt-4 leading-relaxed">
                María Luisa te enviará por WhatsApp los datos para realizar el pago una vez confirmes el pedido.
              </p>
            </section>

            <div className="lg:hidden">
              <BotonConfirmar onClick={handleConfirmar} precio={precio} enviando={enviando} />
            </div>
          </div>

          {/* ---- COLUMNA DERECHA: RESUMEN ---- */}
          <aside className="lg:sticky lg:top-6 lg:self-start space-y-4">

            {/* Fidelización */}
            <div className="bg-gradient-to-br from-[#31543d] to-[#4a7a58] text-white rounded-2xl p-4 sm:p-6">
              <p className="font-nunito text-xs uppercase tracking-widest text-white/60 mb-3 font-semibold">
                Programa de Fidelización
              </p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{nivel.emoji}</span>
                <div>
                  <p className="font-playfair font-semibold">{nivel.nombre}</p>
                  <p className="font-nunito text-xs text-white/70">{numCompras} compra{numCompras !== 1 ? "s" : ""} realizadas</p>
                </div>
              </div>
              {proximoNivel ? (
                <div className="border-t border-white/20 pt-3 text-xs text-white/70 leading-relaxed font-nunito">
                  <p className="text-white/50 mb-1">Próximo nivel: {proximoNivel.emoji} {proximoNivel.nombre}</p>
                  <p>Te faltan <span className="text-white font-semibold">{proximoNivel.comprasFaltantes}</span> compra{proximoNivel.comprasFaltantes !== 1 ? "s" : ""} para desbloquearlo</p>
                  <p className="text-white/50 italic mt-1">{proximoNivel.beneficio}</p>
                </div>
              ) : (
                <div className="border-t border-white/20 pt-3 text-xs text-white/70 font-nunito">
                  <p>¡Felicidades! Ya alcanzaste el nivel máximo.</p>
                </div>
              )}
            </div>

            {/* Resumen del pedido */}
            <div className="bg-white rounded-2xl border border-[#C5DFC5] p-4 sm:p-6">
              <h3 className="font-playfair font-semibold text-[#31543d] mb-4">Resumen del pedido</h3>

              <div className="flex gap-4 pb-4 border-b border-[#C5DFC5]">
                <div className="relative w-16 h-20 bg-[#f0f8ec] rounded-xl overflow-hidden flex-shrink-0">
                  <Image src="/images/libro-portada.jpg" alt="Libro" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-playfair font-semibold text-sm text-[#31543d]">Nutrición del Bebé</p>
                  <p className="font-nunito text-xs text-[#5a7255] mt-1">
                    {formato === "virtual" ? "Libro Digital (PDF)" : "Libro Físico"}
                  </p>
                  <p className="font-playfair text-sm font-semibold mt-2 text-[#31543d]">S/ {precio}</p>
                </div>
              </div>

              <div className="py-4 space-y-2 text-sm font-nunito">
                <div className="flex justify-between text-[#5a7255]">
                  <span>Subtotal</span>
                  <span>S/ {precio}</span>
                </div>
                <div className="flex justify-between text-[#5a7255]">
                  <span>Envío</span>
                  <span className="text-[#6daa6d] font-semibold">
                    {formato === "fisico" ? "Gratis" : "—"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#C5DFC5] mb-6">
                <span className="font-playfair font-semibold text-[#31543d]">Total</span>
                <span className="font-playfair text-2xl font-semibold text-[#31543d]">S/ {precio}</span>
              </div>

              <div className="hidden lg:block">
                <BotonConfirmar onClick={handleConfirmar} precio={precio} enviando={enviando} />
              </div>

              <p className="font-nunito text-xs text-[#5a7255] text-center mt-4 leading-relaxed">
                Al confirmar, se abrirá WhatsApp con tu pedido pre-llenado para que María Luisa coordine el pago.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

/* ---------- COMPONENTES AUXILIARES ---------- */

function OpcionPago({ seleccionado, onClick, titulo, descripcion }: {
  seleccionado: boolean; onClick: () => void; titulo: string; descripcion: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition flex items-center gap-4 bg-white ${
        seleccionado ? "border-[#6daa6d] shadow-sm shadow-green-100" : "border-[#C5DFC5] hover:border-[#6daa6d]"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        seleccionado ? "border-[#6daa6d]" : "border-[#C5DFC5]"
      }`}>
        {seleccionado && <div className="w-2.5 h-2.5 bg-[#6daa6d] rounded-full" />}
      </div>
      <div className="flex-1">
        <p className="font-playfair font-semibold text-sm text-[#31543d]">{titulo}</p>
        <p className="font-nunito text-xs text-[#5a7255]">{descripcion}</p>
      </div>
    </button>
  );
}

function BotonConfirmar({ onClick, precio, enviando }: { onClick: () => void; precio: number; enviando: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={enviando}
      className="btn-coquette w-full bg-[#25D366] hover:bg-[#1FAA52] disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-3 font-nunito"
    >
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      {enviando ? "Procesando..." : `Confirmar pedido · S/ ${precio}`}
    </button>
  );
}
