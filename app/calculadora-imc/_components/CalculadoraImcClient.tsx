"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import PagoYape from "./PagoYape";

const WHATSAPP_NUMERO = "51985577017";

type Sexo = "femenino" | "masculino" | "prefiero_no_decir";

type FormState = {
  nombre: string;
  edad: string;
  sexo: Sexo | "";
  peso: string;
  altura: string;
  correo: string;
  whatsappCodigo: string;
  whatsappNumero: string;
  empresa: string;
  cargo: string;
  objetivo: string;
  consentimiento: boolean;
  optInTips: boolean;
};

const FORM_INICIAL: FormState = {
  nombre: "",
  edad: "",
  sexo: "",
  peso: "",
  altura: "",
  correo: "",
  whatsappCodigo: "+51",
  whatsappNumero: "",
  empresa: "",
  cargo: "",
  objetivo: "",
  consentimiento: false,
  optInTips: false,
};

type CategoriaKey =
  | "bajo_peso"
  | "normal"
  | "sobrepeso"
  | "obesidad_1"
  | "obesidad_2"
  | "obesidad_3";

const CATEGORIAS: Record<CategoriaKey, {
  label: string;
  frase: string;
  badgeBg: string;
  badgeText: string;
  zonaColor: string;
}> = {
  bajo_peso: {
    label: "Bajo peso",
    frase: "Tu peso está por debajo del rango de referencia. Una evaluación profesional puede ayudarte a alcanzar un peso saludable.",
    badgeBg: "bg-amber-400", badgeText: "text-amber-950",
    zonaColor: "bg-amber-400",
  },
  normal: {
    label: "Peso normal",
    frase: "Tu peso se encuentra dentro del rango considerado saludable por la OMS.",
    badgeBg: "bg-green-500", badgeText: "text-white",
    zonaColor: "bg-green-500",
  },
  sobrepeso: {
    label: "Sobrepeso",
    frase: "Tu peso está ligeramente por encima del rango de referencia. Un plan personalizado puede ayudarte a mejorar tu bienestar.",
    badgeBg: "bg-orange-500", badgeText: "text-white",
    zonaColor: "bg-orange-500",
  },
  obesidad_1: {
    label: "Obesidad grado I",
    frase: "Tu resultado sugiere un estado nutricional que se beneficiaría de acompañamiento profesional.",
    badgeBg: "bg-red-400", badgeText: "text-white",
    zonaColor: "bg-red-400",
  },
  obesidad_2: {
    label: "Obesidad grado II",
    frase: "Tu resultado sugiere un estado nutricional que se beneficiaría de acompañamiento profesional cercano.",
    badgeBg: "bg-red-600", badgeText: "text-white",
    zonaColor: "bg-red-600",
  },
  obesidad_3: {
    label: "Obesidad grado III",
    frase: "Tu resultado sugiere la importancia de una evaluación profesional integral y personalizada.",
    badgeBg: "bg-red-800", badgeText: "text-white",
    zonaColor: "bg-red-800",
  },
};

function calcularCategoria(imc: number): CategoriaKey {
  if (imc < 18.5) return "bajo_peso";
  if (imc < 25) return "normal";
  if (imc < 30) return "sobrepeso";
  if (imc < 35) return "obesidad_1";
  if (imc < 40) return "obesidad_2";
  return "obesidad_3";
}

const ZONAS_BARRA: { key: CategoriaKey; desde: number; hasta: number }[] = [
  { key: "bajo_peso", desde: 15, hasta: 18.5 },
  { key: "normal", desde: 18.5, hasta: 25 },
  { key: "sobrepeso", desde: 25, hasta: 30 },
  { key: "obesidad_1", desde: 30, hasta: 35 },
  { key: "obesidad_2", desde: 35, hasta: 40 },
  { key: "obesidad_3", desde: 40, hasta: 45 },
];
const BARRA_MIN = 15;
const BARRA_MAX = 45;

// El código de país es un campo aparte (editable) para no romper el formato
// al escribir y para permitir números de otros países si el sitio se expande.
function formatCodigoPais(valor: string): string {
  const limpio = valor.replace(/[^\d+]/g, "").replace(/\+/g, "");
  return limpio ? `+${limpio.slice(0, 3)}` : "";
}

function agruparDigitos(digitos: string): string {
  return digitos.match(/.{1,3}/g)?.join(" ") ?? "";
}

type MotivoConstancia = "Ingreso laboral" | "Renovación anual" | "Chequeo médico" | "Otro";

export default function CalculadoraImcClient() {
  const supabase = createClient();

  const [form, setForm] = useState<FormState>(FORM_INICIAL);
  const [errores, setErrores] = useState<Partial<Record<keyof FormState, string>>>({});
  const [calculando, setCalculando] = useState(false);

  const [resultado, setResultado] = useState<{ imc: number; categoria: CategoriaKey } | null>(null);

  // Rama A — bajo peso / sobrepeso / obesidad
  const [guardandoLead, setGuardandoLead] = useState(false);
  const [leadEnviado, setLeadEnviado] = useState(false);

  // Rama B — peso normal → constancia
  const [mostrarMiniForm, setMostrarMiniForm] = useState(false);
  const [dni, setDni] = useState("");
  const [empresaConstancia, setEmpresaConstancia] = useState("");
  const [motivo, setMotivo] = useState<MotivoConstancia | "">("");
  const [erroresMini, setErroresMini] = useState<{ dni?: string; empresa?: string; motivo?: string }>({});
  const [guardandoSolicitud, setGuardandoSolicitud] = useState(false);
  const [solicitudId, setSolicitudId] = useState<string | null>(null);

  function actualizarCampo<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function validarFormulario(): boolean {
    const nuevosErrores: Partial<Record<keyof FormState, string>> = {};

    if (form.nombre.trim().length < 3) nuevosErrores.nombre = "Ingresa tu nombre completo (mínimo 3 caracteres).";

    const edadNum = Number(form.edad);
    if (!form.edad || isNaN(edadNum) || edadNum < 5 || edadNum > 100) {
      nuevosErrores.edad = "La edad debe estar entre 5 y 100 años.";
    }

    if (!form.sexo) nuevosErrores.sexo = "Selecciona una opción.";

    const pesoNum = Number(form.peso);
    if (!form.peso || isNaN(pesoNum) || pesoNum < 15 || pesoNum > 300) {
      nuevosErrores.peso = "El peso debe estar entre 15 y 300 kg.";
    }

    const alturaNum = Number(form.altura);
    if (!form.altura || isNaN(alturaNum) || alturaNum < 50 || alturaNum > 230) {
      nuevosErrores.altura = "La altura debe estar entre 50 y 230 cm.";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.correo)) nuevosErrores.correo = "Ingresa un correo electrónico válido.";

    const numeroDigitos = form.whatsappNumero.replace(/\D/g, "");
    if (!/^\+\d{1,3}$/.test(form.whatsappCodigo) || numeroDigitos.length < 6 || numeroDigitos.length > 12) {
      nuevosErrores.whatsappNumero = "Ingresa un código de país y un número de WhatsApp válidos.";
    }

    if (!form.consentimiento) nuevosErrores.consentimiento = "Debes aceptar el uso de tus datos para continuar.";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleCalcular() {
    if (!validarFormulario()) return;
    setCalculando(true);

    const pesoNum = Number(form.peso);
    const alturaM = Number(form.altura) / 100;
    const imc = pesoNum / (alturaM * alturaM);
    const categoria = calcularCategoria(imc);

    setTimeout(() => {
      setResultado({ imc, categoria });
      setCalculando(false);
    }, 400);
  }

  function datosLead() {
    return {
      nombre: form.nombre.trim(),
      edad: Number(form.edad),
      sexo: form.sexo,
      peso_kg: Number(form.peso),
      altura_cm: Number(form.altura),
      imc: Number(resultado!.imc.toFixed(2)),
      categoria: CATEGORIAS[resultado!.categoria].label,
      correo: form.correo.trim(),
      whatsapp: `${form.whatsappCodigo} ${agruparDigitos(form.whatsappNumero)}`.trim(),
      empresa: form.empresa.trim() || null,
      cargo: form.cargo.trim() || null,
      objetivo: form.objetivo.trim() || null,
      consentimiento_datos: form.consentimiento,
      opt_in_tips: form.optInTips,
    };
  }

  async function handleSolicitarOrientacion() {
    if (!resultado || guardandoLead) return;
    setGuardandoLead(true);
    await supabase.from("leads_imc").insert(datosLead());
    setGuardandoLead(false);
    setLeadEnviado(true);
  }

  function validarMiniForm(): boolean {
    const nuevosErrores: { dni?: string; empresa?: string; motivo?: string } = {};
    if (!/^\d{8}$/.test(dni)) nuevosErrores.dni = "El DNI debe tener exactamente 8 dígitos.";
    if (!empresaConstancia.trim()) nuevosErrores.empresa = "La empresa es obligatoria.";
    if (!motivo) nuevosErrores.motivo = "Selecciona un motivo.";
    setErroresMini(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleEnviarMiniForm() {
    if (!resultado || guardandoSolicitud) return;
    if (!validarMiniForm()) return;
    setGuardandoSolicitud(true);

    const { data: lead, error: errorLead } = await supabase
      .from("leads_imc")
      .insert(datosLead())
      .select("id")
      .single();

    if (errorLead || !lead) {
      setGuardandoSolicitud(false);
      setErroresMini({ empresa: "Ocurrió un error al guardar tu solicitud. Intenta nuevamente." });
      return;
    }

    const { data: solicitud, error: errorSolicitud } = await supabase
      .from("solicitudes_constancia")
      .insert({
        lead_imc_id: lead.id,
        nombre: form.nombre.trim(),
        dni,
        empresa: empresaConstancia.trim(),
        motivo,
        imc: Number(resultado.imc.toFixed(2)),
        peso_kg: Number(form.peso),
        altura_cm: Number(form.altura),
        correo: form.correo.trim(),
        whatsapp: `${form.whatsappCodigo} ${agruparDigitos(form.whatsappNumero)}`.trim(),
        estado: "pendiente_pago",
      })
      .select("id")
      .single();

    setGuardandoSolicitud(false);

    if (errorSolicitud || !solicitud) {
      setErroresMini({ empresa: "Ocurrió un error al guardar tu solicitud. Intenta nuevamente." });
      return;
    }

    setSolicitudId(solicitud.id);
  }

  function volverAlInicio() {
    setForm(FORM_INICIAL);
    setErrores({});
    setResultado(null);
    setLeadEnviado(false);
    setMostrarMiniForm(false);
    setDni("");
    setEmpresaConstancia("");
    setMotivo("");
    setErroresMini({});
    setSolicitudId(null);
  }

  // ── Pantalla de pago Yape/Plin (rama B) ──────────────────────────────
  if (resultado && solicitudId) {
    return (
      <PagoYape
        solicitudId={solicitudId}
        resumen={{
          nombre: form.nombre.trim(),
          dni,
          empresa: empresaConstancia.trim(),
          motivo,
        }}
        onVolverInicio={volverAlInicio}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[var(--yucca)]">
      <header className="bg-[var(--yucca-soft)] border-b border-[var(--borde-rosa)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-[var(--texto-suave)] hover:text-[var(--lime)] transition">
            ← Volver al inicio
          </Link>
          <p className="text-sm font-semibold text-[var(--texto-principal)]">
            María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
          </p>
        </div>
      </header>

      <section className="bg-gradient-to-br from-[var(--lime-soft)] via-[var(--yucca)] to-[var(--pinktone-soft)] py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-3 font-semibold">
            Herramienta gratuita
          </p>
          <h1 className="text-3xl sm:text-4xl font-light leading-tight mb-3 text-[var(--texto-principal)]">
            Calculadora de <span className="font-semibold text-[var(--lime)]">IMC.</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--texto-suave)] leading-relaxed max-w-xl mx-auto">
            Calcula tu Índice de Masa Corporal y recibe orientación de María Luisa, o descarga tu
            Constancia Nutricional para tu empresa.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
          {!resultado && (
            <div className="bg-white rounded-2xl border-2 border-[var(--borde-verde)] p-5 sm:p-8 shadow-lg shadow-green-100 space-y-6">
              {/* Datos personales */}
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-[var(--lime)] font-semibold">Tus datos</p>

                <Campo label="Nombre completo *" error={errores.nombre}>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => actualizarCampo("nombre", e.target.value)}
                    placeholder="Ej: María García Torres"
                    className={inputClass(!!errores.nombre)}
                  />
                </Campo>

                <div className="grid grid-cols-2 gap-4">
                  <Campo label="Edad *" error={errores.edad}>
                    <input
                      type="number"
                      value={form.edad}
                      onChange={(e) => actualizarCampo("edad", e.target.value)}
                      placeholder="30"
                      className={inputClass(!!errores.edad)}
                    />
                  </Campo>

                  <Campo label="Peso (kg) *" error={errores.peso}>
                    <input
                      type="number"
                      step="0.1"
                      value={form.peso}
                      onChange={(e) => actualizarCampo("peso", e.target.value)}
                      placeholder="65.5"
                      className={inputClass(!!errores.peso)}
                    />
                  </Campo>
                </div>

                <Campo label="Sexo *" error={errores.sexo}>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      ["femenino", "Femenino"],
                      ["masculino", "Masculino"],
                      ["prefiero_no_decir", "Prefiero no decir"],
                    ] as [Sexo, string][]).map(([valor, label]) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => actualizarCampo("sexo", valor)}
                        className={`rounded-xl px-2 py-2.5 text-xs sm:text-sm border-2 transition ${
                          form.sexo === valor
                            ? "border-[var(--lime)] bg-[var(--lime-soft)] text-[var(--texto-principal)] font-semibold"
                            : "border-[var(--borde-verde)] bg-white text-[var(--texto-suave)]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Campo>

                <Campo label="Altura (cm) *" error={errores.altura}>
                  <input
                    type="number"
                    value={form.altura}
                    onChange={(e) => actualizarCampo("altura", e.target.value)}
                    placeholder="165"
                    className={inputClass(!!errores.altura)}
                  />
                </Campo>
              </div>

              {/* Contacto */}
              <div className="space-y-4 pt-2 border-t border-[var(--borde-suave)]">
                <p className="text-xs uppercase tracking-widest text-[var(--primrose)] font-semibold pt-4">Contacto</p>

                <Campo label="Correo electrónico *" error={errores.correo}>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={(e) => actualizarCampo("correo", e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className={inputClass(!!errores.correo)}
                  />
                </Campo>

                <Campo label="WhatsApp *" error={errores.whatsappNumero}>
                  <div className="flex gap-2 items-stretch">
                    <input
                      type="text"
                      inputMode="tel"
                      value={form.whatsappCodigo}
                      onChange={(e) => actualizarCampo("whatsappCodigo", formatCodigoPais(e.target.value))}
                      placeholder="+51"
                      maxLength={4}
                      aria-label="Código de país"
                      className={`w-16 flex-shrink-0 px-2 py-3 text-center ${inputBaseClass(!!errores.whatsappNumero)}`}
                    />
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={agruparDigitos(form.whatsappNumero)}
                      onChange={(e) => actualizarCampo("whatsappNumero", e.target.value.replace(/\D/g, "").slice(0, 12))}
                      placeholder="999 888 777"
                      aria-label="Número de WhatsApp"
                      className={`flex-1 min-w-0 px-4 py-3 ${inputBaseClass(!!errores.whatsappNumero)}`}
                    />
                  </div>
                </Campo>
              </div>

              {/* Opcionales */}
              <div className="space-y-4 pt-2 border-t border-[var(--borde-suave)]">
                <p className="text-xs uppercase tracking-widest text-[var(--texto-tenue)] font-semibold pt-4">
                  Información adicional (opcional)
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <Campo label="Empresa donde labora">
                    <input
                      type="text"
                      value={form.empresa}
                      onChange={(e) => actualizarCampo("empresa", e.target.value)}
                      className={inputClass(false)}
                    />
                  </Campo>
                  <Campo label="Cargo">
                    <input
                      type="text"
                      value={form.cargo}
                      onChange={(e) => actualizarCampo("cargo", e.target.value)}
                      className={inputClass(false)}
                    />
                  </Campo>
                </div>

                <Campo label="Objetivo o comentarios">
                  <textarea
                    value={form.objetivo}
                    onChange={(e) => actualizarCampo("objetivo", e.target.value.slice(0, 500))}
                    rows={3}
                    maxLength={500}
                    placeholder="Cuéntanos qué te gustaría lograr..."
                    className={`${inputClass(false)} resize-none`}
                  />
                  <p className="text-[10px] text-[var(--texto-tenue)] text-right mt-1">
                    {form.objetivo.length}/500
                  </p>
                </Campo>
              </div>

              {/* Consentimiento */}
              <div className="space-y-3 pt-2 border-t border-[var(--borde-suave)]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consentimiento}
                    onChange={(e) => actualizarCampo("consentimiento", e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[var(--lime)] flex-shrink-0"
                  />
                  <span className="text-xs text-[var(--texto-suave)] leading-relaxed">
                    Al enviar este formulario aceptas que María Luisa Peña Valdivia (nutricionista colegiada)
                    te contacte por los medios proporcionados con fines de orientación nutricional. Tus datos
                    no serán compartidos con terceros. Ley N° 29733 de Protección de Datos Personales – Perú. *
                  </span>
                </label>
                {errores.consentimiento && <p className="text-xs text-red-600">{errores.consentimiento}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.optInTips}
                    onChange={(e) => actualizarCampo("optInTips", e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[var(--primrose)] flex-shrink-0"
                  />
                  <span className="text-xs text-[var(--texto-suave)] leading-relaxed">
                    Quiero recibir tips de nutrición por WhatsApp.
                  </span>
                </label>
              </div>

              <button
                onClick={handleCalcular}
                disabled={!form.consentimiento || calculando}
                className="w-full bg-[var(--lime)] hover:bg-[var(--lime-hover)] disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-3"
              >
                {calculando ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Calculando...
                  </>
                ) : (
                  "Calcular mi IMC"
                )}
              </button>
            </div>
          )}

          {resultado && !solicitudId && (
            <PanelResultado
              imc={resultado.imc}
              categoria={resultado.categoria}
              edad={Number(form.edad)}
              guardandoLead={guardandoLead}
              leadEnviado={leadEnviado}
              onSolicitarOrientacion={handleSolicitarOrientacion}
              mostrarMiniForm={mostrarMiniForm}
              onAbrirMiniForm={() => setMostrarMiniForm(true)}
              dni={dni} setDni={setDni}
              empresaConstancia={empresaConstancia} setEmpresaConstancia={setEmpresaConstancia}
              motivo={motivo} setMotivo={setMotivo}
              erroresMini={erroresMini}
              guardandoSolicitud={guardandoSolicitud}
              onEnviarMiniForm={handleEnviarMiniForm}
              onVolverInicio={volverAlInicio}
            />
          )}
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

// Clases compartidas SIN ancho ni padding: así los campos que necesitan un
// tamaño distinto (p. ej. el código de país junto al número de WhatsApp) no
// terminan con dos utilidades de "width" o "padding" en conflicto.
function inputBaseClass(conError: boolean) {
  return `border ${conError ? "border-red-400" : "border-[var(--borde-rosa)]"} rounded-lg focus:outline-none focus:border-[var(--lime)] transition text-sm`;
}

function inputClass(conError: boolean) {
  return `w-full px-4 py-3 ${inputBaseClass(conError)}`;
}

function Campo({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 block font-semibold">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function PanelResultado({
  imc, categoria, edad,
  guardandoLead, leadEnviado, onSolicitarOrientacion,
  mostrarMiniForm, onAbrirMiniForm,
  dni, setDni, empresaConstancia, setEmpresaConstancia, motivo, setMotivo,
  erroresMini, guardandoSolicitud, onEnviarMiniForm,
  onVolverInicio,
}: {
  imc: number;
  categoria: CategoriaKey;
  edad: number;
  guardandoLead: boolean;
  leadEnviado: boolean;
  onSolicitarOrientacion: () => void;
  mostrarMiniForm: boolean;
  onAbrirMiniForm: () => void;
  dni: string; setDni: (v: string) => void;
  empresaConstancia: string; setEmpresaConstancia: (v: string) => void;
  motivo: MotivoConstancia | ""; setMotivo: (v: MotivoConstancia | "") => void;
  erroresMini: { dni?: string; empresa?: string; motivo?: string };
  guardandoSolicitud: boolean;
  onEnviarMiniForm: () => void;
  onVolverInicio: () => void;
}) {
  const cat = CATEGORIAS[categoria];
  const esNormal = categoria === "normal";
  const posicionMarcador = Math.min(100, Math.max(0, ((Math.min(Math.max(imc, BARRA_MIN), BARRA_MAX) - BARRA_MIN) / (BARRA_MAX - BARRA_MIN)) * 100));

  const mensajeWA = encodeURIComponent(
    "Hola María Luisa, acabo de hacer mi cálculo de IMC y me interesa recibir orientación nutricional."
  );

  return (
    <div className="bg-white rounded-2xl border-2 border-[var(--borde-verde)] p-5 sm:p-8 shadow-lg shadow-green-100 space-y-6 animate-[fadeSlideIn_0.4s_ease-out]">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold mb-2">Tu resultado</p>
        <p className="text-6xl sm:text-7xl font-bold text-[var(--texto-principal)] mb-3">{imc.toFixed(2)}</p>
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${cat.badgeBg} ${cat.badgeText}`}>
          {cat.label}
        </span>
        <p className="text-sm text-[var(--texto-suave)] leading-relaxed mt-4 max-w-md mx-auto">
          {cat.frase}
        </p>
      </div>

      {/* Barra visual */}
      <div>
        <div className="flex w-full h-4 rounded-full overflow-hidden relative">
          {ZONAS_BARRA.map((zona) => (
            <div
              key={zona.key}
              className={CATEGORIAS[zona.key].zonaColor}
              style={{ width: `${((zona.hasta - zona.desde) / (BARRA_MAX - BARRA_MIN)) * 100}%` }}
            />
          ))}
          <div
            className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-2 border-[var(--texto-principal)] shadow-md -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${posicionMarcador}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[var(--texto-tenue)] mt-1.5">
          <span>15</span>
          <span>Rango saludable: 18.5 – 24.9</span>
          <span>45+</span>
        </div>
      </div>

      {edad < 18 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            En menores de 18 años el IMC se interpreta con tablas de percentil pediátrico.
            Recomendamos consulta profesional para evaluación completa.
          </p>
        </div>
      )}

      <p className="text-xs text-[var(--texto-tenue)] text-center leading-relaxed">
        El IMC es un indicador referencial. La evaluación completa requiere consulta profesional con la nutricionista.
      </p>

      {/* RAMA A: no normal */}
      {!esNormal && !leadEnviado && (
        <button
          onClick={onSolicitarOrientacion}
          disabled={guardandoLead}
          className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200"
        >
          {guardandoLead ? "Enviando..." : "Solicitar orientación de María Luisa"}
        </button>
      )}

      {!esNormal && leadEnviado && (
        <div className="space-y-4">
          <div className="bg-[var(--lime-soft)] border border-[var(--borde-verde)] rounded-xl p-4 text-center">
            <p className="text-sm text-[var(--texto-principal)] font-medium">
              ¡Listo! María Luisa revisará tus datos y te contactará por WhatsApp en las próximas 24 horas.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${mensajeWA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:opacity-90 text-white px-6 py-3.5 rounded-full transition font-semibold"
          >
            Contactar por WhatsApp ahora
          </a>
          <button
            onClick={onVolverInicio}
            className="w-full text-sm text-[var(--texto-suave)] hover:text-[var(--lime)] transition py-2"
          >
            Volver al inicio
          </button>
        </div>
      )}

      {/* RAMA B: normal */}
      {esNormal && !mostrarMiniForm && (
        <button
          onClick={onAbrirMiniForm}
          className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200"
        >
          Solicitar Constancia Nutricional (S/ 10)
        </button>
      )}

      {esNormal && mostrarMiniForm && (
        <div className="space-y-4 pt-2 border-t border-[var(--borde-suave)]">
          <p className="text-xs uppercase tracking-widest text-[var(--primrose)] font-semibold pt-4">
            Datos para tu constancia
          </p>

          <Campo label="DNI *" error={erroresMini.dni}>
            <input
              type="text"
              inputMode="numeric"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="12345678"
              className={inputClass(!!erroresMini.dni)}
            />
          </Campo>

          <Campo label="Empresa *" error={erroresMini.empresa}>
            <input
              type="text"
              value={empresaConstancia}
              onChange={(e) => setEmpresaConstancia(e.target.value)}
              placeholder="Nombre de la empresa"
              className={inputClass(!!erroresMini.empresa)}
            />
          </Campo>

          <Campo label="Motivo *" error={erroresMini.motivo}>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as MotivoConstancia)}
              className={inputClass(!!erroresMini.motivo)}
            >
              <option value="">Selecciona un motivo</option>
              <option value="Ingreso laboral">Ingreso laboral</option>
              <option value="Renovación anual">Renovación anual</option>
              <option value="Chequeo médico">Chequeo médico</option>
              <option value="Otro">Otro</option>
            </select>
          </Campo>

          <button
            onClick={onEnviarMiniForm}
            disabled={guardandoSolicitud}
            className="w-full bg-[var(--verde-fuerte)] hover:opacity-90 disabled:opacity-50 text-white px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-green-200 flex items-center justify-center gap-3"
          >
            {guardandoSolicitud ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              "Continuar al pago"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
