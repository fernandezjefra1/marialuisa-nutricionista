"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  categoria: string | null;
  imagen_url: string | null;
  activo: boolean;
  destacado: boolean;
  orden: number;
};

const VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  categoria: "Superalimentos",
  imagen_url: "",
  activo: true,
  destacado: false,
  orden: 0,
};

// Imágenes provisionales disponibles en /public/images
const IMAGENES_SUGERIDAS = [
  "/images/Cacao.png",
  "/images/SachaInchi.png",
  "/images/harinaCurcuma.png",
  "/images/salvadoTrigo.png",
];

export default function AdminProductosPage() {
  const supabase = createClient();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof VACIO>({ ...VACIO });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function cargar() {
    setLoading(true);
    const { data } = await supabase.from("productos").select("*").order("orden", { ascending: true });
    setProductos((data as Producto[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    let vigente = true;
    supabase.from("productos").select("*").order("orden", { ascending: true }).then(({ data }) => {
      if (!vigente) return;
      setProductos((data as Producto[]) ?? []);
      setLoading(false);
    });
    return () => { vigente = false; };
  }, [supabase]);

  function resetForm() {
    setForm({ ...VACIO });
    setEditandoId(null);
  }

  function editar(p: Producto) {
    setEditandoId(p.id);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion ?? "",
      precio: p.precio != null ? String(p.precio) : "",
      categoria: p.categoria ?? "",
      imagen_url: p.imagen_url ?? "",
      activo: p.activo,
      destacado: p.destacado,
      orden: p.orden,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) { setMensaje("El nombre es obligatorio."); return; }
    setGuardando(true);
    setMensaje(null);

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      precio: form.precio === "" ? null : Number(form.precio),
      categoria: form.categoria.trim() || null,
      imagen_url: form.imagen_url.trim() || null,
      activo: form.activo,
      destacado: form.destacado,
      orden: Number(form.orden) || 0,
      updated_at: new Date().toISOString(),
    };

    if (editandoId) {
      await supabase.from("productos").update(payload).eq("id", editandoId);
    } else {
      await supabase.from("productos").insert(payload);
    }
    setGuardando(false);
    resetForm();
    setMensaje("Guardado ✓");
    cargar();
  }

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar este producto del catálogo?")) return;
    await supabase.from("productos").delete().eq("id", id);
    cargar();
  }

  async function toggleActivo(p: Producto) {
    await supabase.from("productos").update({ activo: !p.activo }).eq("id", p.id);
    setProductos((prev) => prev.map((x) => (x.id === p.id ? { ...x, activo: !x.activo } : x)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--texto-principal)]">Catálogo de productos</h1>
        <p className="text-sm text-[var(--texto-suave)] mt-1">
          Agrega y edita los productos que se muestran en la página. Los clientes piden por WhatsApp.
        </p>
      </div>

      {mensaje && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">{mensaje}</div>
      )}

      {/* Formulario */}
      <form onSubmit={guardar} className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-5 md:p-6 space-y-4">
        <h2 className="font-semibold text-[var(--texto-principal)]">
          {editandoId ? "Editar producto" : "Nuevo producto"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[var(--texto-suave)] block mb-1">Nombre *</label>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border border-[var(--borde-rosa)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--texto-suave)] block mb-1">Categoría</label>
            <input value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full border border-[var(--borde-rosa)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--texto-suave)] block mb-1">Precio (S/)</label>
            <input type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
              className="w-full border border-[var(--borde-rosa)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--texto-suave)] block mb-1">Orden</label>
            <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
              className="w-full border border-[var(--borde-rosa)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--texto-suave)] block mb-1">Descripción</label>
            <textarea value={form.descripcion} rows={2} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full border border-[var(--borde-rosa)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)] resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-[var(--texto-suave)] block mb-1">Imagen (ruta)</label>
            <input list="imgs" value={form.imagen_url} onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
              placeholder="/images/Cacao.png"
              className="w-full border border-[var(--borde-rosa)] px-3 py-2 rounded-lg focus:outline-none focus:border-[var(--primrose)]" />
            <datalist id="imgs">
              {IMAGENES_SUGERIDAS.map((i) => <option key={i} value={i} />)}
            </datalist>
            <p className="text-[11px] text-[var(--texto-tenue)] mt-1">Sube tus imágenes a la carpeta <code>public/images</code> y escribe la ruta, ej. <code>/images/Cacao.png</code>.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm text-[var(--texto-principal)]">
            <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} /> Visible en la web
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--texto-principal)]">
            <input type="checkbox" checked={form.destacado} onChange={(e) => setForm({ ...form, destacado: e.target.checked })} /> Destacado
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={guardando}
            className="bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition">
            {guardando ? "Guardando..." : editandoId ? "Guardar cambios" : "Agregar producto"}
          </button>
          {editandoId && (
            <button type="button" onClick={resetForm}
              className="text-sm text-[var(--texto-suave)] px-4 py-2.5 rounded-lg border border-[var(--borde-rosa)] hover:bg-[var(--pinktone-soft)] transition">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista */}
      {loading ? (
        <p className="text-sm text-[var(--texto-suave)] text-center py-10">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-sm text-[var(--texto-suave)] text-center py-10">Aún no hay productos. Agrega el primero arriba.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p) => (
            <div key={p.id} className={`bg-white rounded-2xl border p-4 flex gap-3 ${p.activo ? "border-[var(--borde-verde)]" : "border-neutral-200 opacity-60"}`}>
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--lime-soft)] shrink-0">
                {p.imagen_url ? <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-1" sizes="64px" /> : <div className="w-full h-full flex items-center justify-center text-[var(--texto-tenue)]">◇</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm text-[var(--texto-principal)] truncate">{p.nombre}</p>
                  {p.destacado && <span className="text-[10px] bg-[var(--pinktone)] text-[var(--primrose)] font-semibold px-2 py-0.5 rounded-full shrink-0">★</span>}
                </div>
                <p className="text-xs text-[var(--texto-suave)]">{p.categoria} · {p.precio != null ? `S/ ${p.precio}` : "sin precio"}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={() => editar(p)} className="text-xs text-[var(--lime)] hover:underline font-medium">Editar</button>
                  <button onClick={() => toggleActivo(p)} className="text-xs text-[var(--texto-suave)] hover:underline">{p.activo ? "Ocultar" : "Mostrar"}</button>
                  <button onClick={() => eliminar(p.id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
