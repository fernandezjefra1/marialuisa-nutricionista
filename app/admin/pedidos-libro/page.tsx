"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Compra = {
  id: number;
  user_id: string;
  producto: string;
  formato: string;
  precio: number;
  nombre: string;
  whatsapp: string;
  correo: string;
  direccion: string | null;
  referencia: string | null;
  metodo_pago: string;
  estado: string;
  created_at: string;
};

const ESTADOS = ["pendiente", "pagado", "enviado", "completado", "cancelado"];

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  pagado: "bg-blue-50 text-blue-700 border-blue-200",
  enviado: "bg-purple-50 text-purple-700 border-purple-200",
  completado: "bg-green-50 text-green-700 border-green-200",
  cancelado: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

export default function AdminPedidosLibro() {
  const supabase = createClient();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<Compra | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    try {
      const { data } = await supabase.from("compras").select("*").order("created_at", { ascending: false });
      setCompras(data || []);
    } catch {
      setCompras([]);
    } finally {
      setCargando(false);
    }
  }

  async function cambiarEstado(id: number, nuevoEstado: string) {
    const { error } = await supabase
      .from("compras")
      .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar el estado. Intenta de nuevo.");
      return;
    }

    setCompras((prev) => prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)));
    if (seleccionado?.id === id) {
      setSeleccionado({ ...seleccionado, estado: nuevoEstado });
    }
  }

  const comprasFiltradas = compras.filter((c) => {
    const matchEstado = filtroEstado === "todos" || c.estado === filtroEstado;
    const matchBusqueda = busqueda === "" ||
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.whatsapp.includes(busqueda);
    return matchEstado && matchBusqueda;
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
          Pedidos
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-[var(--texto-principal)]">
          Pedidos de <span className="font-semibold text-[var(--primrose)]">libro.</span>
        </h1>
        <p className="text-sm text-[var(--texto-suave)] mt-2">
          Gestiona el estado de cada pedido del libro &quot;Nutrición del Bebé&quot;.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 mb-6 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, correo o WhatsApp..."
          className="flex-1 border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm bg-white"
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e} className="capitalize">{e}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      {cargando ? (
        <p className="text-center py-12 text-sm text-[var(--texto-suave)]">Cargando pedidos...</p>
      ) : comprasFiltradas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-12 text-center">
          <p className="text-sm text-[var(--texto-suave)]">
            {compras.length === 0
              ? "Aún no hay pedidos de libro."
              : "No hay resultados con esos filtros."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--pinktone-soft)] text-xs uppercase tracking-widest text-[var(--primrose)]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Formato</th>
                  <th className="text-left px-4 py-3 font-semibold">Precio</th>
                  <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--borde-suave)]">
                {comprasFiltradas.map((compra) => (
                  <tr key={compra.id} className="hover:bg-[var(--pinktone-soft)]/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--texto-principal)]">{compra.nombre}</p>
                      <p className="text-xs text-[var(--texto-suave)]">{compra.whatsapp}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="capitalize text-[var(--texto-principal)]">{compra.formato}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--texto-principal)]">
                      S/ {compra.precio}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--texto-suave)]">
                      {new Date(compra.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={compra.estado}
                        onChange={(e) => cambiarEstado(compra.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border font-medium cursor-pointer ${ESTADO_COLOR[compra.estado]}`}
                      >
                        {ESTADOS.map((e) => (
                          <option key={e} value={e} className="bg-white text-[var(--texto-principal)] capitalize">
                            {e}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSeleccionado(compra)}
                        className="text-xs text-[var(--primrose)] hover:underline font-medium"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-[var(--pinktone-soft)] px-4 py-3 text-xs text-[var(--texto-suave)] text-center">
            Mostrando {comprasFiltradas.length} de {compras.length} pedidos
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      {seleccionado && (
        <ModalDetalle compra={seleccionado} onClose={() => setSeleccionado(null)} onCambiarEstado={cambiarEstado} />
      )}
    </div>
  );
}

function ModalDetalle({ compra, onClose, onCambiarEstado }: { compra: Compra; onClose: () => void; onCambiarEstado: (id: number, estado: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[var(--borde-rosa)] bg-[var(--pinktone-soft)] flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--primrose)] font-semibold mb-1">Pedido #{compra.id}</p>
            <h2 className="text-xl font-semibold text-[var(--texto-principal)]">{compra.producto}</h2>
          </div>
          <button onClick={onClose} className="text-2xl text-[var(--texto-suave)] hover:text-[var(--texto-principal)]">×</button>
        </div>

        <div className="p-6 space-y-4">
          <Campo label="Cliente" valor={compra.nombre} />
          <Campo label="WhatsApp" valor={compra.whatsapp} clickable={`https://wa.me/51${compra.whatsapp.replace(/\D/g, "")}`} />
          <Campo label="Correo" valor={compra.correo} />
          <Campo label="Formato" valor={compra.formato} capitalize />
          <Campo label="Precio" valor={`S/ ${compra.precio}`} />
          <Campo label="Método de pago" valor={compra.metodo_pago} capitalize />
          {compra.direccion && <Campo label="Dirección" valor={compra.direccion} />}
          {compra.referencia && <Campo label="Referencia" valor={compra.referencia} />}
          <Campo label="Fecha" valor={new Date(compra.created_at).toLocaleString("es-PE")} />

          <div className="pt-4 border-t border-[var(--borde-rosa)]">
            <p className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 font-semibold">Cambiar estado</p>
            <select
              value={compra.estado}
              onChange={(e) => onCambiarEstado(compra.id, e.target.value)}
              className="w-full border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] capitalize"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e} className="capitalize">{e}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, valor, capitalize, clickable }: { label: string; valor: string; capitalize?: boolean; clickable?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-1 font-semibold">{label}</p>
      {clickable ? (
        <a href={clickable} target="_blank" rel="noopener noreferrer" className={`text-[var(--primrose)] hover:underline ${capitalize ? "capitalize" : ""}`}>
          {valor}
        </a>
      ) : (
        <p className={`text-[var(--texto-principal)] ${capitalize ? "capitalize" : ""}`}>{valor}</p>
      )}
    </div>
  );
}