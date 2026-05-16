"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen_url: string | null;
  categoria: string;
  destacado: boolean;
  activo: boolean;
};

const CATEGORIAS_PRODUCTOS = ["harinas", "semillas", "superalimentos", "endulzantes", "cereales", "general"];
const CATEGORIAS_SNACKS = ["snacks", "bebidas", "comida-dietetica"];
const TODAS_CATEGORIAS = [...CATEGORIAS_PRODUCTOS, ...CATEGORIAS_SNACKS];

const TIPO_CATEGORIA: Record<string, string> = {
  harinas: "Producto",
  semillas: "Producto",
  superalimentos: "Producto",
  endulzantes: "Producto",
  cereales: "Producto",
  general: "Producto",
  snacks: "Snack",
  bebidas: "Snack",
  "comida-dietetica": "Snack",
};

const VACIO: Omit<Producto, "id"> = {
  nombre: "",
  descripcion: "",
  precio: 0,
  stock: 0,
  imagen_url: "",
  categoria: "general",
  destacado: false,
  activo: true,
};

export default function AdminProductos() {
  const supabase = createClient();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroActivo, setFiltroActivo] = useState("activos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [form, setForm] = useState<Omit<Producto, "id">>(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [confirmEliminar, setConfirmEliminar] = useState<Producto | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setCargando(true);
    const { data } = await supabase
      .from("productos")
      .select("*")
      .order("categoria")
      .order("nombre");
    setProductos(data || []);
    setCargando(false);
  }

  function abrirCrear() {
    setEditando(null);
    setForm(VACIO);
    setModalAbierto(true);
  }

  function abrirEditar(p: Producto) {
    setEditando(p);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || "",
      precio: p.precio,
      stock: p.stock,
      imagen_url: p.imagen_url || "",
      categoria: p.categoria,
      destacado: p.destacado,
      activo: p.activo,
    });
    setModalAbierto(true);
  }

  async function guardar() {
    if (!form.nombre.trim()) return alert("El nombre es obligatorio.");
    if (form.precio <= 0) return alert("El precio debe ser mayor a 0.");
    setGuardando(true);

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() || null,
      precio: Number(form.precio),
      stock: Number(form.stock),
      imagen_url: form.imagen_url?.trim() || null,
      categoria: form.categoria,
      destacado: form.destacado,
      activo: form.activo,
    };

    if (editando) {
      const { error } = await supabase.from("productos").update(payload).eq("id", editando.id);
      if (error) { alert("Error al actualizar."); setGuardando(false); return; }
      setProductos((prev) => prev.map((p) => (p.id === editando.id ? { ...p, ...payload } : p)));
    } else {
      const { data, error } = await supabase.from("productos").insert(payload).select().single();
      if (error) { alert("Error al crear el producto."); setGuardando(false); return; }
      setProductos((prev) => [...prev, data]);
    }

    setGuardando(false);
    setModalAbierto(false);
  }

  async function confirmarEliminar(p: Producto) {
    const { error } = await supabase.from("productos").delete().eq("id", p.id);
    if (error) { alert("Error al eliminar."); return; }
    setProductos((prev) => prev.filter((x) => x.id !== p.id));
    setConfirmEliminar(null);
  }

  async function toggleActivo(p: Producto) {
    const nuevoActivo = !p.activo;
    const { error } = await supabase.from("productos").update({ activo: nuevoActivo }).eq("id", p.id);
    if (error) { alert("Error al actualizar."); return; }
    setProductos((prev) => prev.map((x) => (x.id === p.id ? { ...x, activo: nuevoActivo } : x)));
  }

  const productosFiltrados = productos.filter((p) => {
    const matchBusqueda =
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.descripcion || "").toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = filtroCategoria === "todas" || p.categoria === filtroCategoria;
    const matchActivo =
      filtroActivo === "todos" ||
      (filtroActivo === "activos" && p.activo) ||
      (filtroActivo === "inactivos" && !p.activo);
    return matchBusqueda && matchCategoria && matchActivo;
  });

  const totalActivos = productos.filter((p) => p.activo).length;
  const totalSnacks = productos.filter((p) => CATEGORIAS_SNACKS.includes(p.categoria)).length;
  const sinStock = productos.filter((p) => p.stock === 0 && p.activo).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
            Inventario
          </p>
          <h1 className="text-3xl md:text-4xl font-light text-[var(--texto-principal)]">
            Gestión de <span className="font-semibold text-[var(--primrose)]">productos.</span>
          </h1>
          <p className="text-sm text-[var(--texto-suave)] mt-2">
            Crea, edita, ajusta precios y stock de productos y snacks.
          </p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-[var(--primrose)] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-md shadow-pink-200 self-start md:self-auto"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--texto-principal)]">{totalActivos}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Activos</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className="text-2xl font-bold text-[var(--texto-principal)]">{totalSnacks}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Snacks</p>
        </div>
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 text-center">
          <p className={`text-2xl font-bold ${sinStock > 0 ? "text-red-500" : "text-[var(--texto-principal)]"}`}>{sinStock}</p>
          <p className="text-xs text-[var(--texto-suave)] mt-1">Sin stock</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-4 mb-6 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o descripción..."
          className="flex-1 border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm bg-white"
        >
          <option value="todas">Todas las categorías</option>
          <optgroup label="Productos">
            {CATEGORIAS_PRODUCTOS.map((c) => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </optgroup>
          <optgroup label="Snacks">
            {CATEGORIAS_SNACKS.map((c) => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </optgroup>
        </select>
        <select
          value={filtroActivo}
          onChange={(e) => setFiltroActivo(e.target.value)}
          className="border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm bg-white"
        >
          <option value="activos">Solo activos</option>
          <option value="inactivos">Solo inactivos</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      {/* Tabla */}
      {cargando ? (
        <p className="text-center py-12 text-sm text-[var(--texto-suave)]">Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-12 text-center">
          <p className="text-sm text-[var(--texto-suave)]">
            {productos.length === 0 ? "Aún no hay productos. Crea el primero." : "No hay resultados con esos filtros."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--pinktone-soft)] text-xs uppercase tracking-widest text-[var(--primrose)]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Producto</th>
                  <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Categoría</th>
                  <th className="text-right px-4 py-3 font-semibold">Precio</th>
                  <th className="text-right px-4 py-3 font-semibold">Stock</th>
                  <th className="text-center px-4 py-3 font-semibold hidden lg:table-cell">Destacado</th>
                  <th className="text-center px-4 py-3 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--borde-suave)]">
                {productosFiltrados.map((p) => (
                  <tr key={p.id} className={`hover:bg-[var(--pinktone-soft)]/40 transition ${!p.activo ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--texto-principal)]">{p.nombre}</p>
                      {p.descripcion && (
                        <p className="text-xs text-[var(--texto-suave)] truncate max-w-[200px]">{p.descripcion}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                        CATEGORIAS_SNACKS.includes(p.categoria)
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}>
                        {TIPO_CATEGORIA[p.categoria]} · {p.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[var(--texto-principal)]">
                      S/ {p.precio.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-[var(--texto-principal)]"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {p.destacado ? <span className="text-amber-400 text-base">★</span> : <span className="text-[var(--borde-rosa)] text-base">☆</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActivo(p)}
                        className={`text-xs px-3 py-1 rounded-full border font-medium transition ${
                          p.activo
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200"
                        }`}
                      >
                        {p.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirEditar(p)}
                          className="text-xs text-[var(--primrose)] hover:underline font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmEliminar(p)}
                          className="text-xs text-red-400 hover:text-red-600 font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-[var(--pinktone-soft)] px-4 py-3 text-xs text-[var(--texto-suave)] text-center">
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </div>
        </div>
      )}

      {/* Modal crear/editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalAbierto(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--borde-rosa)] bg-[var(--pinktone-soft)] flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--primrose)] font-semibold mb-1">
                  {editando ? "Editar" : "Nuevo"}
                </p>
                <h2 className="text-xl font-semibold text-[var(--texto-principal)]">
                  {editando ? editando.nombre : "Crear producto"}
                </h2>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-2xl text-[var(--texto-suave)] hover:text-[var(--texto-principal)] leading-none">×</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold block mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm"
                  placeholder="Ej: Harina de avena integral"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold block mb-1">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion || ""}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={2}
                  className="w-full border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm resize-none"
                  placeholder="Descripción breve del producto"
                />
              </div>

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold block mb-1">
                    Precio (S/) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold block mb-1">
                    Stock (unidades)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                    className="w-full border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm"
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold block mb-1">
                  Categoría
                </label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm bg-white"
                >
                  <optgroup label="Productos naturales">
                    {CATEGORIAS_PRODUCTOS.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Snacks y bebidas">
                    {CATEGORIAS_SNACKS.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* URL Imagen */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold block mb-1">
                  URL de imagen
                </label>
                <input
                  type="url"
                  value={form.imagen_url || ""}
                  onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                  className="w-full border border-[var(--borde-rosa)] px-4 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] text-sm"
                  placeholder="https://..."
                />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--texto-principal)]">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                    className="w-4 h-4 accent-[var(--primrose)]"
                  />
                  Destacado ★
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--texto-principal)]">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="w-4 h-4 accent-[var(--primrose)]"
                  />
                  Activo (visible en tienda)
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 border border-[var(--borde-rosa)] px-4 py-2.5 rounded-xl text-sm text-[var(--texto-suave)] hover:bg-[var(--pinktone-soft)] transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardar}
                  disabled={guardando}
                  className="flex-1 bg-[var(--primrose)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmEliminar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setConfirmEliminar(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="text-lg font-semibold text-[var(--texto-principal)] mb-2">
              Eliminar producto
            </h3>
            <p className="text-sm text-[var(--texto-suave)] mb-6">
              ¿Seguro que deseas eliminar <strong>{confirmEliminar.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmEliminar(null)}
                className="flex-1 border border-[var(--borde-rosa)] px-4 py-2.5 rounded-xl text-sm text-[var(--texto-suave)] hover:bg-[var(--pinktone-soft)] transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmarEliminar(confirmEliminar)}
                className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
