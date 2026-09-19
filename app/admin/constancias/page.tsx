"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Estado =
  | "pendiente_pago"
  | "pagado_pendiente_validacion"
  | "pagado_validado"
  | "rechazado";

type Solicitud = {
  id: string;
  created_at: string;
  nombre: string;
  dni: string;
  empresa: string;
  motivo: string;
  imc: number;
  correo: string;
  whatsapp: string;
  monto_soles: number;
  estado: Estado;
  yape_codigo_operacion: string | null;
  yape_hora_pago: string | null;
  notas_validacion: string | null;
};

const ETIQUETA_ESTADO: Record<Estado, string> = {
  pendiente_pago: "Pendiente de pago",
  pagado_pendiente_validacion: "Por validar",
  pagado_validado: "Validada",
  rechazado: "Rechazada",
};

const COLOR_ESTADO: Record<Estado, string> = {
  pendiente_pago: "bg-neutral-100 text-neutral-600",
  pagado_pendiente_validacion: "bg-yellow-100 text-yellow-800",
  pagado_validado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
};

export default function ConstanciasAdminPage() {
  const supabase = createClient();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Estado | "todos">("todos");
  const [actualizando, setActualizando] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("solicitudes_constancia")
      .select("*")
      .order("created_at", { ascending: false });
    setSolicitudes((data as Solicitud[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let vigente = true;
    supabase
      .from("solicitudes_constancia")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!vigente) return;
        setSolicitudes((data as Solicitud[]) ?? []);
        setLoading(false);
      });
    return () => { vigente = false; };
  }, [supabase]);

  async function validar(id: string, aprobar: boolean) {
    setActualizando(id);
    await supabase
      .from("solicitudes_constancia")
      .update({
        estado: aprobar ? "pagado_validado" : "rechazado",
        validado_por_nutricionista: aprobar,
        validado_at: new Date().toISOString(),
      })
      .eq("id", id);
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: aprobar ? "pagado_validado" : "rechazado" } : s
      )
    );
    setActualizando(null);
  }

  const lista =
    filtro === "todos" ? solicitudes : solicitudes.filter((s) => s.estado === filtro);

  const contadores = {
    porValidar: solicitudes.filter((s) => s.estado === "pagado_pendiente_validacion").length,
    validadas: solicitudes.filter((s) => s.estado === "pagado_validado").length,
    pendientesPago: solicitudes.filter((s) => s.estado === "pendiente_pago").length,
    total: solicitudes.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--texto-principal)]">Constancias nutricionales</h1>
        <p className="text-sm text-[var(--texto-suave)] mt-1">
          Solicitudes generadas desde la calculadora de IMC. Valida el pago por Yape para habilitar la descarga.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{contadores.porValidar}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Por validar</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{contadores.validadas}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Validadas</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-neutral-500">{contadores.pendientesPago}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Sin pagar</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--primrose)]">{contadores.total}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 bg-white rounded-2xl border border-[var(--borde-rosa)] p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="filtro" className="text-xs font-medium text-[var(--texto-suave)]">Estado:</label>
          <select
            id="filtro"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as Estado | "todos")}
            className="text-sm border border-[var(--borde-rosa)] rounded-lg px-3 py-1.5 bg-white text-[var(--texto-principal)] focus:outline-none"
          >
            <option value="todos">Todos</option>
            <option value="pagado_pendiente_validacion">Por validar</option>
            <option value="pagado_validado">Validadas</option>
            <option value="pendiente_pago">Sin pagar</option>
            <option value="rechazado">Rechazadas</option>
          </select>
        </div>
        <button
          onClick={cargar}
          className="ml-auto text-xs px-3 py-1.5 rounded-lg border border-[var(--borde-rosa)] text-[var(--texto-suave)] hover:bg-[var(--pinktone-soft)] transition"
        >
          Actualizar
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-10 text-center">
          <p className="text-sm text-[var(--texto-suave)]">Cargando constancias...</p>
        </div>
      ) : lista.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-10 text-center">
          <p className="text-sm text-[var(--texto-suave)]">No hay solicitudes con esos filtros.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lista.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-[var(--texto-principal)]">{s.nombre}</p>
                  <p className="text-xs text-[var(--texto-suave)]">DNI {s.dni} · IMC {s.imc}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${COLOR_ESTADO[s.estado] ?? "bg-neutral-100 text-neutral-600"}`}>
                  {ETIQUETA_ESTADO[s.estado] ?? s.estado}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-[var(--texto-suave)] mb-4">
                <p><span className="font-medium text-[var(--texto-principal)]">Empresa:</span> {s.empresa}</p>
                <p><span className="font-medium text-[var(--texto-principal)]">Motivo:</span> {s.motivo}</p>
                <p><span className="font-medium text-[var(--texto-principal)]">Correo:</span> {s.correo}</p>
                <p>
                  <span className="font-medium text-[var(--texto-principal)]">WhatsApp:</span>{" "}
                  <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{s.whatsapp}</a>
                </p>
                <p><span className="font-medium text-[var(--texto-principal)]">Monto:</span> S/ {s.monto_soles}</p>
                <p><span className="font-medium text-[var(--texto-principal)]">Yape op.:</span> {s.yape_codigo_operacion || "—"} {s.yape_hora_pago ? `(${s.yape_hora_pago})` : ""}</p>
              </div>

              {s.estado === "pagado_pendiente_validacion" && (
                <div className="flex flex-wrap gap-3 pt-3 border-t border-[var(--borde-suave)]">
                  <button
                    onClick={() => validar(s.id, true)}
                    disabled={actualizando === s.id}
                    className="bg-[var(--lime)] hover:opacity-90 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    {actualizando === s.id ? "Guardando..." : "Validar pago"}
                  </button>
                  <button
                    onClick={() => validar(s.id, false)}
                    disabled={actualizando === s.id}
                    className="bg-red-500 hover:opacity-90 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
