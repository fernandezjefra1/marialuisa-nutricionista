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

const UMBRAL_STOCK_BAJO = 5;
const WHATSAPP_PROPIO = "51985577017";

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
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [modalReposicion, setModalReposicion] = useState<Producto | null>(null);
  const [cantidadReponer, setCantidadReponer] = useState(0);
  const [reponiendo, setReponiendo] = useState(false);

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

  function abrirReposicion(p: Producto) {
    setModalReposicion(p);
    setCantidadReponer(20);
  }

  async function confirmarReposicion() {
    if (!modalReposicion || cantidadReponer <= 0) return;
    setReponiendo(true);
    const nuevoStock = modalReposicion.stock + cantidadReponer;
    const { error } = await supabase
      .from("productos")
      .update({ stock: nuevoStock })
      .eq("id", modalReposicion.id);
    if (error) { alert("Error al reponer stock."); setReponiendo(false); return; }
    setProductos((prev) =>
      prev.map((p) => p.id === modalReposicion.id ? { ...p, stock: nuevoStock } : p)
    );
    setReponiendo(false);
    setModalReposicion(null);
  }

  function notificarWhatsApp(productosStockBajo: Producto[]) {
    let mensaje = `⚠️ ALERTA DE STOCK BAJO — Nutricionista María Luisa\n\n`;
    mensaje += `Los siguientes productos necesitan reposición:\n\n`;
    productosStockBajo.forEach((p) => {
      mensaje += `• ${p.nombre}: solo ${p.stock} unidad${p.stock !== 1 ? "es" : ""} restante${p.stock !== 1 ? "s" : ""}\n`;
    });
    mensaje += `\nRecuerda reponer el stock para no quedarte sin productos disponibles en la tienda.`;
    window.open(`https://wa.me/${WHATSAPP_PROPIO}?text=${encodeURIComponent(mensaje)}`, "_blank");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const extensionesPermitidas = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!extensionesPermitidas.includes(archivo.type) && !archivo.name.toLowerCase().endsWith(".heic")) {
      alert("Solo se permiten imágenes (JPG, PNG, WEBP o HEIC).");
      return;
    }

    setSubiendoImagen(true);
    const nombreArchivo = `producto_${Date.now()}_${archivo.name.replace(/\s+/g, "_")}`;

    const { error } = await supabase.storage
      .from("productos")
      .upload(nombreArchivo, archivo, { upsert: true });

    if (error) {
      alert("Error al subir la imagen. Verifica que el bucket 'productos' exista en Supabase Storage.");
      setSubiendoImagen(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("productos").getPublicUrl(nombreArchivo);
    setForm((prev) => ({ ...prev, imagen_url: urlData.publicUrl }));
    setSubiendoImagen(false);
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

  const productosFiltrados = productos
    .filter((p) => {
      const matchBusqueda =
        busqueda === "" ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.descripcion || "").toLowerCase().includes(busqueda.toLowerCase());
      const matchCategoria = filtroCategoria === "todas" || p.categoria === filtroCategoria;
      const matchActivo =
        filtroActivo === "todos" ||
        (filtroActivo === "activos" && p.activo) ||
        (filtroActivo === "inactivos" && !p.activo) ||
        (filtroActivo === "stock-bajo" && p.stock <= UMBRAL_STOCK_BAJO);
      return matchBusqueda && matchCategoria && matchActivo;
    })
    .sort((a, b) => {
      if (filtroActivo !== "stock-bajo") return 0;
      return a.stock - b.stock;
    });

  const totalActivos = productos.filter((p) => p.activo).length;
  const totalSnacks = productos.filter((p) => CATEGORIAS_SNACKS.includes(p.categoria)).length;
  const sinStock = productos.filter((p) => p.stock === 0 && p.activo).length;
  const productosStockBajo = productos.filter((p) => p.activo && p.stock <= UMBRAL_STOCK_BAJO);

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

      {/* Alerta de stock bajo */}
      {productosStockBajo.length > 0 && (
        <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-amber-800 text-base mb-1">
                  {productosStockBajo.length} producto{productosStockBajo.length !== 1 ? "s" : ""} con stock bajo
                </p>
                <p className="text-sm text-amber-700">
                  Estos productos tienen {UMBRAL_STOCK_BAJO} unidades o menos. Repón el stock para no quedarte sin existencias.
                </p>
              </div>
            </div>
            <button
              onClick={() => notificarWhatsApp(productosStockBajo)}
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1FAA52] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm whitespace-nowrap self-start"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Recordarme por WhatsApp
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {productosStockBajo.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-white border border-amber-200 rounded-xl px-4 py-3 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-lg font-bold ${p.stock === 0 ? "text-red-500" : "text-amber-500"}`}>
                    {p.stock === 0 ? "🔴" : "🟡"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-amber-900 truncate">{p.nombre}</p>
                    <p className="text-xs text-amber-600">
                      {p.stock === 0 ? "Sin stock" : `${p.stock} unidad${p.stock !== 1 ? "es" : ""} restante${p.stock !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => abrirReposicion(p)}
                  className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                >
                  + Reponer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <option value="stock-bajo">⚠️ Stock bajo</option>
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

              {/* Imagen — subida directa desde el celular */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold block mb-2">
                  Foto del producto
                </label>

                {/* Vista previa */}
                {form.imagen_url && (
                  <div className="mb-3 relative w-28 h-28 rounded-xl overflow-hidden border-2 border-[var(--borde-rosa)] bg-[var(--pinktone-soft)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.imagen_url}
                      alt="Vista previa"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, imagen_url: "" }))}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none hover:bg-red-600"
                      title="Quitar imagen"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Botón de subida */}
                <label className={`flex items-center gap-3 cursor-pointer w-full border-2 border-dashed rounded-xl px-4 py-4 transition ${
                  subiendoImagen
                    ? "border-[var(--lime)] bg-[var(--lime-soft)] cursor-not-allowed"
                    : "border-[var(--borde-rosa)] bg-[var(--pinktone-soft)] hover:border-[var(--primrose)] hover:bg-[var(--pinktone)]"
                }`}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,.heic"
                    className="hidden"
                    disabled={subiendoImagen}
                    onChange={handleImageUpload}
                  />
                  {subiendoImagen ? (
                    <>
                      <span className="text-xl">⏳</span>
                      <span className="text-sm text-[var(--texto-suave)]">Subiendo imagen...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">📷</span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--texto-principal)]">
                          {form.imagen_url ? "Cambiar foto" : "Subir foto del producto"}
                        </p>
                        <p className="text-xs text-[var(--texto-suave)]">
                          Elige una foto desde tu celular o computadora
                        </p>
                      </div>
                    </>
                  )}
                </label>
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

      {/* Modal reposición rápida de stock */}
      {modalReposicion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalReposicion(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center mb-5">
              <span className="text-4xl">📦</span>
              <h3 className="text-lg font-semibold text-[var(--texto-principal)] mt-2">
                Reponer stock
              </h3>
              <p className="text-sm text-[var(--texto-suave)] mt-1">
                <strong>{modalReposicion.nombre}</strong>
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Stock actual: {modalReposicion.stock} unidad{modalReposicion.stock !== 1 ? "es" : ""}
              </p>
            </div>

            <div className="mb-5">
              <label className="text-xs uppercase tracking-widest text-[var(--texto-suave)] font-semibold block mb-2">
                ¿Cuántas unidades vas a agregar?
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidadReponer((v) => Math.max(1, v - 5))}
                  className="w-11 h-11 rounded-xl border-2 border-[var(--borde-rosa)] text-lg font-bold text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)] transition flex items-center justify-center"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={cantidadReponer}
                  onChange={(e) => setCantidadReponer(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 text-center border-2 border-[var(--borde-rosa)] px-4 py-2.5 rounded-xl text-lg font-semibold focus:outline-none focus:border-[var(--lime)]"
                />
                <button
                  onClick={() => setCantidadReponer((v) => v + 5)}
                  className="w-11 h-11 rounded-xl border-2 border-[var(--borde-rosa)] text-lg font-bold text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)] transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-center text-[var(--texto-suave)] mt-2">
                Nuevo stock total: <strong className="text-[var(--lime)]">{modalReposicion.stock + cantidadReponer} unidades</strong>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalReposicion(null)}
                className="flex-1 border border-[var(--borde-rosa)] px-4 py-2.5 rounded-xl text-sm text-[var(--texto-suave)] hover:bg-[var(--pinktone-soft)] transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarReposicion}
                disabled={reponiendo}
                className="flex-1 bg-[var(--lime)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {reponiendo ? "Guardando..." : "Confirmar reposición"}
              </button>
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
