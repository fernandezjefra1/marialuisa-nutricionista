"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Estado = "pendiente" | "confirmado" | "cancelado";
type Modalidad = "presencial" | "virtual";

type Reserva = {
  id: number;
  created_at: string;
  nombre: string;
  correo: string;
  whatsapp: string;
  modalidad: Modalidad;
  precio: number;
  mensaje: string | null;
  estado: Estado;
};

const ETIQUETA_ESTADO: Record<Estado, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  cancelado: "Cancelado",
};

const COLOR_ESTADO: Record<Estado, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  confirmado: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export default function ReservasTallerAdminPage() {
  const supabase = createClient();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<Estado | "todos">("todos");
  const [filtroModalidad, setFiltroModalidad] = useState<Modalidad | "todos">("todos");
  const [actualizando, setActualizando] = useState<number | null>(null);

  useEffect(() => {
    cargarReservas();
  }, []);

  async function cargarReservas() {
    setLoading(true);
    try {
      const { data } = await supabase.from("reservas_taller").select("*").order("created_at", { ascending: false });
      setReservas(data ?? []);
    } catch {
      setReservas([]);
    } finally {
      setLoading(false);
    }
  }

  async function cambiarEstado(id: number, nuevoEstado: Estado) {
    setActualizando(id);
    await supabase.from("reservas_taller").update({ estado: nuevoEstado }).eq("id", id);
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r))
    );
    setActualizando(null);
  }

  const reservasFiltradas = reservas.filter((r) => {
    if (filtroEstado !== "todos" && r.estado !== filtroEstado) return false;
    if (filtroModalidad !== "todos" && r.modalidad !== filtroModalidad) return false;
    return true;
  });

  const contadores = {
    pendiente: reservas.filter((r) => r.estado === "pendiente").length,
    confirmado: reservas.filter((r) => r.estado === "confirmado").length,
    cancelado: reservas.filter((r) => r.estado === "cancelado").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--texto-principal)]">Reservas de Taller</h1>
        <p className="text-sm text-[var(--texto-suave)] mt-1">
          Gestiona las reservas del taller de comida dietética
        </p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{contadores.pendiente}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Pendientes</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{contadores.confirmado}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Confirmados</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{contadores.cancelado}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Cancelados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 bg-white rounded-2xl border border-[var(--borde-rosa)] p-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--texto-suave)]">Estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as Estado | "todos")}
            className="text-sm border border-[var(--borde-rosa)] rounded-lg px-3 py-1.5 bg-white text-[var(--texto-principal)] focus:outline-none"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[var(--texto-suave)]">Modalidad:</label>
          <select
            value={filtroModalidad}
            onChange={(e) => setFiltroModalidad(e.target.value as Modalidad | "todos")}
            className="text-sm border border-[var(--borde-rosa)] rounded-lg px-3 py-1.5 bg-white text-[var(--texto-principal)] focus:outline-none"
          >
            <option value="todos">Todas</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        <button
          onClick={cargarReservas}
          className="ml-auto text-xs px-3 py-1.5 rounded-lg border border-[var(--borde-rosa)] text-[var(--texto-suave)] hover:bg-[var(--pinktone-soft)] transition"
        >
          Actualizar
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-10 text-center">
          <p className="text-sm text-[var(--texto-suave)]">Cargando reservas...</p>
        </div>
      ) : reservasFiltradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-10 text-center">
          <p className="text-sm text-[var(--texto-suave)]">No hay reservas con esos filtros.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--borde-rosa)] bg-[var(--yucca-soft)]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Participante</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">WhatsApp</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Modalidad</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Precio</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Fecha</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--texto-suave)]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.map((reserva) => (
                  <tr key={reserva.id} className="border-b border-[var(--borde-rosa)] last:border-0 hover:bg-[var(--yucca-soft)] transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--texto-principal)]">{reserva.nombre}</p>
                      <p className="text-xs text-[var(--texto-suave)]">{reserva.correo}</p>
                      {reserva.mensaje && (
                        <p className="text-xs text-[var(--texto-suave)] mt-1 italic">"{reserva.mensaje}"</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--texto-principal)]">
                      <a
                        href={`https://wa.me/${reserva.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        {reserva.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        reserva.modalidad === "presencial"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {reserva.modalidad === "presencial" ? "Presencial" : "Virtual"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--texto-principal)] font-medium">
                      S/ {reserva.precio}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${COLOR_ESTADO[reserva.estado]}`}>
                        {ETIQUETA_ESTADO[reserva.estado]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--texto-suave)]">
                      {new Date(reserva.created_at).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={reserva.estado}
                        disabled={actualizando === reserva.id}
                        onChange={(e) => cambiarEstado(reserva.id, e.target.value as Estado)}
                        className="text-xs border border-[var(--borde-rosa)] rounded-lg px-2 py-1.5 bg-white text-[var(--texto-principal)] focus:outline-none disabled:opacity-50"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[var(--borde-rosa)] text-xs text-[var(--texto-suave)]">
            {reservasFiltradas.length} reserva{reservasFiltradas.length !== 1 ? "s" : ""} mostrada{reservasFiltradas.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}
