"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Pedido = {
  id: number;
  user_id: string;
  nombre: string;
  whatsapp: string;
  correo: string;
  direccion: string;
  referencia: string | null;
  items: any[];
  subtotal: number;
  total: number;
  metodo_pago: string;
  estado: string;
  tipo: string;
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

export default function AdminPedidosProductos() {
  const supabase = createClient();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<Pedido | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false });
    setPedidos(data || []);
    setCargando(false);
  }

  async function cambiarEstado(id: number, nuevoEstado: string) {
    const { error } = await supabase
      .from("pedidos")
      .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar el estado.");
      console.error(error);
      return;
    }

    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
    if (seleccionado?.id === id) {
      setSeleccionado({ ...seleccionado, estado: nuevoEstado });
    }
  }

  const pedidosFiltrados = pedidos.filter((p) => {
    const matchEstado = filtroEstado === "todos" || p.estado === filtroEstado;
    const matchBusqueda = busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.whatsapp.includes(busqueda);
    return matchEstado && matchBusqueda;
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold">
          Pedidos
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-[var(--texto-principal)]">
          Pedidos de <span className="font-semibold text-[var(--lime)]">tienda.</span>
        </h1>
        <p className="text-sm text-[var(--texto-suave)] mt-2">
          Pedidos del carrito: productos naturales, snacks y comida dietética.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--borde-verde)] p-4 mb-6 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, correo o WhatsApp..."
          className="flex-1 border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--lime)] text-sm"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--lime)] text-sm bg-white"
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e} className="capitalize">{e}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p className="text-center py-12 text-sm text-[var(--texto-suave)]">Cargando pedidos...</p>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-verde)] p-12 text-center">
          <p className="text-sm text-[var(--texto-suave)]">
            {pedidos.length === 0
              ? "Aún no hay pedidos de la tienda."
              : "No hay resultados con esos filtros."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--borde-verde)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--lime-soft)] text-xs uppercase tracking-widest text-[var(--lime)]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Items</th>
                  <th className="text-left px-4 py-3 font-semibold">Total</th>
                  <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--borde-suave)]">
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-[var(--lime-soft)]/50 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--texto-principal)]">{pedido.nombre}</p>
                      <p className="text-xs text-[var(--texto-suave)]">{pedido.whatsapp}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[var(--texto-principal)]">{pedido.items?.length || 0} items</span>
                      <p className="text-xs text-[var(--texto-suave)] capitalize">{pedido.tipo}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--texto-principal)]">
                      S/ {pedido.total}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--texto-suave)]">
                      {new Date(pedido.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={pedido.estado}
                        onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border font-medium cursor-pointer ${ESTADO_COLOR[pedido.estado]}`}
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
                        onClick={() => setSeleccionado(pedido)}
                        className="text-xs text-[var(--lime)] hover:underline font-medium"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-[var(--lime-soft)] px-4 py-3 text-xs text-[var(--texto-suave)] text-center">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </div>
        </div>
      )}

      {seleccionado && (
        <ModalDetalle pedido={seleccionado} onClose={() => setSeleccionado(null)} onCambiarEstado={cambiarEstado} />
      )}
    </div>
  );
}

function ModalDetalle({ pedido, onClose, onCambiarEstado }: { pedido: Pedido; onClose: () => void; onCambiarEstado: (id: number, estado: string) => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[var(--borde-verde)] bg-[var(--lime-soft)] flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--lime)] font-semibold mb-1">Pedido #{pedido.id}</p>
            <h2 className="text-xl font-semibold text-[var(--texto-principal)]">
              {pedido.items?.length || 0} productos · S/ {pedido.total}
            </h2>
          </div>
          <button onClick={onClose} className="text-2xl text-[var(--texto-suave)] hover:text-[var(--texto-principal)]">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Cliente" valor={pedido.nombre} />
            <Campo label="WhatsApp" valor={pedido.whatsapp} clickable={`https://wa.me/51${pedido.whatsapp.replace(/\D/g, "")}`} />
            <Campo label="Correo" valor={pedido.correo} />
            <Campo label="Método de pago" valor={pedido.metodo_pago} capitalize />
          </div>

          <Campo label="Dirección" valor={pedido.direccion} />
          {pedido.referencia && <Campo label="Referencia" valor={pedido.referencia} />}

          {/* Lista de items */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 font-semibold">Productos del pedido</p>
            <div className="bg-[var(--lime-soft)]/30 rounded-xl p-3 space-y-2">
              {pedido.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-[var(--texto-principal)]">
                    <span className="font-semibold">{item.cantidad}×</span> {item.nombre}
                  </span>
                  <span className="text-[var(--texto-suave)]">
                    S/ {item.subtotal?.toFixed(2) || (item.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-[var(--borde-verde)] flex justify-between font-semibold">
                <span>Total</span>
                <span>S/ {pedido.total}</span>
              </div>
            </div>
          </div>

          <Campo label="Fecha" valor={new Date(pedido.created_at).toLocaleString("es-PE")} />

          <div className="pt-4 border-t border-[var(--borde-verde)]">
            <p className="text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-2 font-semibold">Cambiar estado</p>
            <select
              value={pedido.estado}
              onChange={(e) => onCambiarEstado(pedido.id, e.target.value)}
              className="w-full border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--lime)] capitalize"
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
        <a href={clickable} target="_blank" rel="noopener noreferrer" className={`text-[var(--lime)] hover:underline ${capitalize ? "capitalize" : ""}`}>
          {valor}
        </a>
      ) : (
        <p className={`text-[var(--texto-principal)] ${capitalize ? "capitalize" : ""}`}>{valor}</p>
      )}
    </div>
  );
}