"use client";

import { useState } from "react";
import { PAGOS_CONFIG } from "@/lib/config/pagos";

const WHATSAPP_NUMERO = "51985577017";

export default function PagoYape({
  solicitudId,
  resumen,
  onVolverInicio,
}: {
  solicitudId: string;
  resumen: { nombre: string; dni: string; empresa: string; motivo: string };
  onVolverInicio: () => void;
}) {
  const [codigoOperacion, setCodigoOperacion] = useState("");
  const [horaPago, setHoraPago] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [descargaLista, setDescargaLista] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [qrError, setQrError] = useState(false);

  function copiarNumero() {
    navigator.clipboard.writeText(PAGOS_CONFIG.yapeNumero.replace(/\s/g, ""));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  async function handleValidarPago() {
    if (!/^\d{6,12}$/.test(codigoOperacion)) {
      setError("Ingresa un código de operación válido (6 a 12 dígitos).");
      return;
    }
    setError(null);
    setEnviando(true);

    try {
      const res = await fetch("/api/constancia/registrar-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solicitud_id: solicitudId,
          yape_codigo_operacion: codigoOperacion,
          yape_hora_pago: horaPago || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "No se pudo validar el pago. Intenta nuevamente.");
        setEnviando(false);
        return;
      }

      window.location.href = data.download_url;
      setDescargaLista(true);
    } catch {
      setError("Ocurrió un error de conexión. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  const mensajeWA = encodeURIComponent(
    "Hola María Luisa, tengo una consulta sobre el pago de mi Constancia Nutricional."
  );

  return (
    <main className="min-h-screen bg-[var(--yucca)] py-8 sm:py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-light text-center text-[var(--texto-principal)]">
          Pago de tu <span className="font-semibold text-[var(--lime)]">Constancia Nutricional.</span>
        </h1>

        {/* Resumen */}
        <div className="bg-white rounded-2xl border-2 border-[var(--borde-verde)] p-5 shadow-md">
          <p className="text-xs uppercase tracking-widest text-[var(--lime)] font-semibold mb-3">Resumen de tu solicitud</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm text-[var(--texto-principal)]">
            <span className="text-[var(--texto-suave)]">Nombre</span><span className="font-medium text-right">{resumen.nombre}</span>
            <span className="text-[var(--texto-suave)]">DNI</span><span className="font-medium text-right">{resumen.dni}</span>
            <span className="text-[var(--texto-suave)]">Empresa</span><span className="font-medium text-right">{resumen.empresa}</span>
            <span className="text-[var(--texto-suave)]">Motivo</span><span className="font-medium text-right">{resumen.motivo}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--borde-suave)] flex items-center justify-between">
            <span className="text-sm text-[var(--texto-suave)]">Monto a pagar</span>
            <span className="text-2xl font-bold text-[var(--texto-principal)]">
              S/ {PAGOS_CONFIG.precioConstanciaSoles.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-2xl border-2 border-[var(--borde-verde)] p-5 shadow-md">
          <p className="text-xs uppercase tracking-widest text-[var(--lime)] font-semibold mb-3">Cómo pagar</p>
          <ol className="space-y-2">
            {[
              "Abre tu app Yape o Plin",
              `Escanea el código QR o transfiere al número ${PAGOS_CONFIG.yapeNumero}`,
              `Confirma que el monto sea S/ ${PAGOS_CONFIG.precioConstanciaSoles.toFixed(2)}`,
              "Copia el código de operación que te muestra tu app",
              "Ingrésalo abajo y descarga tu constancia",
            ].map((paso, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--texto-suave)]">
                <span className="w-5 h-5 rounded-full bg-[var(--lime-soft)] text-[var(--lime)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {paso}
              </li>
            ))}
          </ol>
        </div>

        {/* QR */}
        <div className="bg-white rounded-2xl border-2 border-[var(--borde-verde)] p-6 shadow-md text-center">
          <div className="mx-auto mb-4 flex items-center justify-center" style={{ width: 220, height: 220, maxWidth: "100%" }}>
            {!qrError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={PAGOS_CONFIG.qrImagePath}
                alt="Código QR de Yape - María Luisa Peña Valdivia"
                width={220}
                height={220}
                className="w-full h-full object-contain rounded-xl"
                onError={() => setQrError(true)}
              />
            ) : (
              <div className="w-full h-full rounded-xl border-2 border-dashed border-[var(--borde-verde)] bg-[var(--lime-soft)] flex flex-col items-center justify-center px-4">
                <p className="text-sm text-[var(--texto-suave)] font-medium">QR no disponible</p>
                <p className="text-xs text-[var(--texto-tenue)] mt-1">Usa el número Yape/Plin de abajo</p>
              </div>
            )}
          </div>

          <p className="text-2xl font-bold text-[var(--texto-principal)] mb-2">{PAGOS_CONFIG.yapeNumero}</p>

          <button
            onClick={copiarNumero}
            className="inline-flex items-center gap-1.5 text-sm bg-[var(--lime-soft)] text-[var(--lime)] px-4 py-2 rounded-full font-medium hover:bg-[var(--lime)] hover:text-white transition mb-2"
          >
            {copiado ? "¡Copiado! ✓" : "📋 Copiar número"}
          </button>

          <p className="text-sm text-[var(--texto-suave)]">{PAGOS_CONFIG.yapeNombreTitular}</p>
        </div>

        {/* Formulario de validación */}
        {!descargaLista ? (
          <div className="bg-white rounded-2xl border-2 border-[var(--borde-verde)] p-5 shadow-md space-y-4">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                Código de operación de Yape/Plin *
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={codigoOperacion}
                onChange={(e) => setCodigoOperacion(e.target.value.replace(/\D/g, "").slice(0, 12))}
                placeholder="Ej: 12345678"
                className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--lime)] transition text-sm"
              />
              <p className="text-xs text-[var(--texto-tenue)] mt-1">
                Lo encuentras en el comprobante de tu app Yape/Plin
              </p>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
                Hora aproximada del pago (opcional)
              </label>
              <input
                type="time"
                value={horaPago}
                onChange={(e) => setHoraPago(e.target.value)}
                className="w-full border border-[var(--borde-rosa)] px-4 py-3 rounded-lg focus:outline-none focus:border-[var(--lime)] transition text-sm"
              />
            </div>

            <button
              onClick={handleValidarPago}
              disabled={enviando}
              className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-3"
            >
              {enviando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Validando...
                </>
              ) : (
                "Validar pago y descargar constancia"
              )}
            </button>
          </div>
        ) : (
          <div className="bg-[var(--lime-soft)] border border-[var(--borde-verde)] rounded-2xl p-5 space-y-4 text-center">
            <p className="text-sm text-[var(--texto-principal)] font-medium leading-relaxed">
              ¡Constancia descargada! Envíala a tu empresa desde tu correo personal. María Luisa validará tu pago
              en las próximas horas — si detecta cualquier problema, te contactará por WhatsApp.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMERO}?text=${mensajeWA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:opacity-90 text-white px-6 py-3.5 rounded-full transition font-semibold"
            >
              Contactar por WhatsApp
            </a>
            <button
              onClick={onVolverInicio}
              className="w-full text-sm text-[var(--texto-suave)] hover:text-[var(--lime)] transition py-2"
            >
              Volver al inicio
            </button>
          </div>
        )}

        <p className="text-xs text-[var(--texto-tenue)] text-center leading-relaxed px-2">
          El código de operación será validado por María Luisa en su cuenta de Yape/Plin. Si el pago no puede ser
          verificado, se contactará contigo por WhatsApp. El uso fraudulento de códigos falsos puede ser reportado
          a las autoridades competentes.
        </p>
      </div>
    </main>
  );
}
