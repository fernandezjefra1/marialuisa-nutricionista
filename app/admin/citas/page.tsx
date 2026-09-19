"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Estado = "pendiente" | "confirmada" | "atendida" | "cancelada";
type TipoCita = "primera_consulta" | "seguimiento" | "control";

type Cita = {
  id: number;
  created_at: string;
  nombre: string;
  correo: string;
  whatsapp: string;
  tipo_cita: TipoCita;
  fecha_preferida: string;
  horario_preferido: string;
  motivo: string | null;
  estado: Estado;
};

const ETIQUETA_ESTADO: Record<Estado, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  atendida: "Atendida",
  cancelada: "Cancelada",
};

const COLOR_ESTADO: Record<Estado, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmada: "bg-green-100 text-green-800",
  atendida: "bg-blue-100 text-blue-800",
  cancelada: "bg-red-100 text-red-800",
};

const ETIQUETA_TIPO: Record<TipoCita, string> = {
  primera_consulta: "Primera consulta",
  seguimiento: "Seguimiento",
  control: "Control",
};

function formatearFecha(valor: string): string {
  if (!valor) return "—";
  const fecha = new Date(`${valor}T12:00:00`);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

export default function CitasAdminPage() {
  const supabase = createClient();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<Estado | "todos">("todos");
  const [actualizando, setActualizando] = useState<number | null>(null);

  const cargarCitas = useCallback(async () => {
    const { data } = await supabase
      .from("reservas_cita")
      .select("*")
      .order("created_at", { ascending: false });
    setCitas(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let vigente = true;
    supabase
      .from("reservas_cita")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!vigente) return;
        setCitas(data ?? []);
        setLoading(false);
      });
    return () => { vigente = false; };
  }, [supabase]);

  async function cambiarEstado(id: number, nuevoEstado: Estado) {
    setActualizando(id);
    await supabase.from("reservas_cita").update({ estado: nuevoEstado }).eq("id", id);
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)));
    setActualizando(null);
  }

  const citasFiltradas =
    filtroEstado === "todos" ? citas : citas.filter((c) => c.estado === filtroEstado);

  const contadores = {
    pendiente: citas.filter((c) => c.estado === "pendiente").length,
    confirmada: citas.filter((c) => c.estado === "confirmada").length,
    atendida: citas.filter((c) => c.estado === "atendida").length,
    cancelada: citas.filter((c) => c.estado === "cancelada").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--texto-principal)]">Citas</h1>
        <p className="text-sm text-[var(--texto-suave)] mt-1">
          Solicitudes de consulta nutricional enviadas desde la web
        </p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{contadores.pendiente}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Pendientes</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{contadores.confirmada}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Confirmadas</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{contadores.atendida}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Atendidas</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{contadores.cancelada}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Canceladas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 bg-white rounded-2xl border border-[var(--borde-rosa)] p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="filtro-estado" className="text-xs font-medium text-[var(--texto-suave)]">Estado:</label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as Estado | "todos")}
            className="text-sm border border-[var(--borde-rosa)] rounded-lg px-3 py-1.5 bg-white text-[var(--texto-principal)] focus:outline-none"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="atendida">Atendida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <button
          onClick={cargarCitas}
          className="ml-auto text-xs px-3 py-1.5 rounded-lg border border-[var(--borde-rosa)] text-[var(--texto-suave)] hover:bg-[var(--pinktone-soft)] transition"
        >
          Actualizar
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-10 text-center">
          <p className="text-sm text-[var(--texto-suave)]">Cargando citas...</p>
        </div>
      ) : citasFiltradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-10 text-center">
          <p className="text-sm text-[var(--texto-suave)]">No hay citas con esos filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--borde-rosa)] bg-[var(--yucca-soft)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Paciente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">WhatsApp</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Preferencia</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Solicitada</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citasFiltradas.map((cita) => (
                  <tr key={cita.id} className="border-b border-[var(--borde-rosa)] last:border-0 hover:bg-[var(--yucca-soft)] transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--texto-principal)]">{cita.nombre}</p>
                      <p className="text-xs text-[var(--texto-suave)]">{cita.correo}</p>
                      {cita.motivo && (
                        <p className="text-xs text-[var(--texto-suave)] mt-1 italic">&ldquo;{cita.motivo}&rdquo;</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/${cita.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        {cita.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700">
                        {ETIQUETA_TIPO[cita.tipo_cita] ?? cita.tipo_cita}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--texto-principal)]">
                      <p className="font-medium">{formatearFecha(cita.fecha_preferida)}</p>
                      <p className="text-xs text-[var(--texto-suave)]">{cita.horario_preferido}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${COLOR_ESTADO[cita.estado] ?? "bg-neutral-100 text-neutral-600"}`}>
                        {ETIQUETA_ESTADO[cita.estado] ?? cita.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--texto-suave)] whitespace-nowrap">
                      {new Date(cita.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Cambiar estado de la cita de ${cita.nombre}`}
                        value={cita.estado}
                        disabled={actualizando === cita.id}
                        onChange={(e) => cambiarEstado(cita.id, e.target.value as Estado)}
                        className="text-xs border border-[var(--borde-rosa)] rounded-lg px-2 py-1.5 bg-white text-[var(--texto-principal)] focus:outline-none disabled:opacity-50"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="atendida">Atendida</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
