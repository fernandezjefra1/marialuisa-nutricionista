"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Solicitud = {
  id: number;
  user_id: string;
  nombre_contacto: string;
  correo: string;
  whatsapp: string;
  nombre_empresa: string | null;
  mensaje: string | null;
  estado: string;
  created_at: string;
};

const ESTADOS = ["nuevo", "contactado", "cotizado", "cerrado", "cancelado"];

const ESTADO_COLOR: Record<string, string> = {
  nuevo: "bg-amber-50 text-amber-700 border-amber-200",
  contactado: "bg-blue-50 text-blue-700 border-blue-200",
  cotizado: "bg-purple-50 text-purple-700 border-purple-200",
  cerrado: "bg-green-50 text-green-700 border-green-200",
  cancelado: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export default function AdminSolicitudes() {
  const supabase = createClient();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [seleccionada, setSeleccionada] = useState<Solicitud | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    const { data } = await supabase
      .from("solicitudes_empresariales")
      .select("*")
      .order("created_at", { ascending: false });
    setSolicitudes(data || []);
    setCargando(false);
  }

  async function cambiarEstado(id: number, nuevoEstado: string) {
    const { error } = await supabase
      .from("solicitudes_empresariales")
      .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar el estado.");
      return;
    }

    setSolicitudes((prev) => prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s)));
    if (seleccionada?.id === id) {
      setSeleccionada({ ...seleccionada, estado: nuevoEstado });
    }
  }

  const solicitudesFiltradas = filtroEstado === "todos"
    ? solicitudes
    : solicitudes.filter((s) => s.estado === filtroEstado);

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
          Empresariales
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-[var(--texto-principal)]">
          Solicitudes <span className="font-semibold text-[var(--primrose)]">B2B.</span>
        </h1>
        <p className="text-sm text-[var(--texto-suave)] mt-2">
          Cotizaciones del servicio de Hoja de Levantamiento Nutricional para empresas.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 mb-6">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm bg-white capitalize"
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e} className="capitalize">{e}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p className="text-center py-12 text-sm text-[var(--texto-suave)]">Cargando solicitudes...</p>
      ) : solicitudesFiltradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-12 text-center">
          <p className="text-sm text-[var(--texto-suave)]">
            {solicitudes.length === 0
              ? "Aún no hay solicitudes empresariales."
              : "No hay resultados con ese filtro."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {solicitudesFiltradas.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-5 hover:shadow-lg hover:shadow-pink-100 transition">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-[var(--texto-principal)]">{s.nombre_empresa || "Sin nombre de empresa"}</p>
                  <p className="text-sm text-[var(--texto-suave)]">Contacto: {s.nombre_contacto}</p>
                </div>
                <select
                  value={s.estado}
                  onChange={(e) => cambiarEstado(s.id, e.target.value)}
                  className={`text-xs px-3 py-1 rounded-full border font-medium cursor-pointer capitalize ${ESTADO_COLOR[s.estado]}`}
                >
                  {ESTADOS.map((e) => (
                    <option key={e} value={e} className="bg-white text-[var(--texto-principal)] capitalize">
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-xs text-[var(--texto-suave)] uppercase tracking-widest font-semibold mb-1">WhatsApp</p>
                  <a
                    href={`https://wa.me/51${s.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primrose)] hover:underline"
                  >
                    {s.whatsapp}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-[var(--texto-suave)] uppercase tracking-widest font-semibold mb-1">Correo</p>
                  <p className="text-[var(--texto-principal)]">{s.correo}</p>
                </div>
              </div>

              {s.mensaje && (
                <div className="bg-[var(--pinktone-soft)] p-3 rounded-lg mb-3">
                  <p className="text-xs text-[var(--texto-suave)] uppercase tracking-widest font-semibold mb-1">Mensaje</p>
                  <p className="text-sm text-[var(--texto-principal)]">{s.mensaje}</p>
                </div>
              )}

              <p className="text-xs text-[var(--texto-suave)]">
                Solicitada el {new Date(s.created_at).toLocaleString("es-PE")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}