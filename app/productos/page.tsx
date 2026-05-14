"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/lib/use-user";
import { useCarrito } from "@/lib/use-carrito";
import CarritoFlotante from "@/components/CarritoFlotante";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen_url: string | null;
  categoria: string;
  destacado: boolean;
};

// Categorías que son "Snacks" (comida)
const CATEGORIAS_SNACKS = ["snacks", "bebidas", "comida-dietetica"];

export default function ProductosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: loadingUser } = useUser();
  const supabase = createClient();
  const { agregar } = useCarrito();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState<"productos" | "snacks">("productos");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todos");
  const [agregadoId, setAgregadoId] = useState<number | null>(null);

  // Leer tab del URL al cargar
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "snacks") setTabActiva("snacks");
  }, [searchParams]);

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login?redirect=/productos");
    }
  }, [loadingUser, user, router]);

  // Cargar productos
  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from("productos")
        .select("*")
        .eq("activo", true)
        .order("destacado", { ascending: false })
        .order("nombre", { ascending: true });
      setProductos(data || []);
      setCargando(false);
    }
    cargar();
  }, [supabase]);

  if (loadingUser || !user) {
    return (
      <main className="min-h-screen bg-[var(--yucca)] flex items-center justify-center">
        <p className="text-sm text-[var(--texto-suave)]">Cargando...</p>
      </main>
    );
  }

  // Separar productos por tab
  const todosProductos = productos.filter((p) => !CATEGORIAS_SNACKS.includes(p.categoria));
  const todosSnacks = productos.filter((p) => CATEGORIAS_SNACKS.includes(p.categoria));

  // Productos visibles según tab activa
  const productosVisibles = tabActiva === "productos" ? todosProductos : todosSnacks;

  // Categorías únicas dentro de la tab activa
  const categoriasDeTab = ["todos", ...Array.from(new Set(productosVisibles.map((p) => p.categoria)))];

  // Filtrar por categoría
  const productosFiltrados =
    categoriaActiva === "todos"
      ? productosVisibles
      : productosVisibles.filter((p) => p.categoria === categoriaActiva);

  function cambiarTab(nueva: "productos" | "snacks") {
    setTabActiva(nueva);
    setCategoriaActiva("todos");
    // Actualizar URL sin recargar
    const url = new URL(window.location.href);
    if (nueva === "productos") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", nueva);
    }
    window.history.replaceState({}, "", url);
  }

  function handleAgregar(producto: Producto) {
    const tipo = CATEGORIAS_SNACKS.includes(producto.categoria) ? "snack" : "producto";
    agregar({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url || undefined,
      tipo,
    });

    setAgregadoId(producto.id);
    setTimeout(() => setAgregadoId(null), 1500);
  }

  // Etiquetas amigables para las categorías
  const nombreCategoria = (cat: string) => {
    const nombres: Record<string, string> = {
      todos: "Todos",
      harinas: "Harinas",
      semillas: "Semillas",
      superalimentos: "Superalimentos",
      endulzantes: "Endulzantes",
      cereales: "Cereales",
      general: "General",
      snacks: "Sándwiches",
      bebidas: "Bebidas",
      "comida-dietetica": "Comida dietética",
    };
    return nombres[cat] || cat;
  };

  return (
    <main className="min-h-screen bg-[var(--yucca)]">
      {/* Header */}
      <header className="bg-[var(--yucca-soft)] border-b border-[var(--borde-rosa)] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-[var(--texto-suave)] hover:text-[var(--primrose)] transition">
            ← Volver al inicio
          </Link>
          <p className="text-sm font-semibold text-[var(--texto-principal)]">
            María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
          </p>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[var(--pinktone-soft)] py-12 md:py-14">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
            Tienda
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-[var(--texto-principal)] mb-3">
            {tabActiva === "productos" ? (
              <>Productos <span className="font-semibold text-[var(--primrose)]">naturales.</span></>
            ) : (
              <>Snacks y <span className="font-semibold text-[var(--lime)]">comida saludable.</span></>
            )}
          </h1>
          <p className="text-sm md:text-base text-[var(--texto-suave)] max-w-2xl mx-auto">
            {tabActiva === "productos"
              ? "Superalimentos, harinas y suplementos cuidadosamente seleccionados."
              : "Bebidas, sándwiches y platos preparados con ingredientes frescos del día."}
          </p>
        </div>
      </section>

      {/* TABS PRINCIPALES */}
      <section className="bg-white border-b border-[var(--borde-rosa)] sticky top-[57px] z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 justify-center">
            <button
              onClick={() => cambiarTab("productos")}
              className={`px-6 py-4 font-medium text-sm transition relative ${
                tabActiva === "productos"
                  ? "text-[var(--primrose)]"
                  : "text-[var(--texto-suave)] hover:text-[var(--texto-principal)]"
              }`}
            >
              <span className="flex items-center gap-2">
                Productos
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tabActiva === "productos"
                    ? "bg-[var(--primrose)] text-white"
                    : "bg-[var(--pinktone-soft)] text-[var(--texto-suave)]"
                }`}>
                  {todosProductos.length}
                </span>
              </span>
              {tabActiva === "productos" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primrose)]" />
              )}
            </button>

            <button
              onClick={() => cambiarTab("snacks")}
              className={`px-6 py-4 font-medium text-sm transition relative ${
                tabActiva === "snacks"
                  ? "text-[var(--lime)]"
                  : "text-[var(--texto-suave)] hover:text-[var(--texto-principal)]"
              }`}
            >
              <span className="flex items-center gap-2">
                Snacks
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tabActiva === "snacks"
                    ? "bg-[var(--lime)] text-white"
                    : "bg-[var(--lime-soft)] text-[var(--texto-suave)]"
                }`}>
                  {todosSnacks.length}
                </span>
              </span>
              {tabActiva === "snacks" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--lime)]" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* FILTROS SECUNDARIOS POR CATEGORÍA */}
      {categoriasDeTab.length > 2 && (
        <section className="bg-white py-4 border-b border-[var(--borde-rosa)]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categoriasDeTab.map((cat) => {
                const activa = categoriaActiva === cat;
                const colorTab = tabActiva === "productos" ? "primrose" : "lime";
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      activa
                        ? colorTab === "primrose"
                          ? "bg-[var(--primrose)] text-white shadow-md shadow-pink-200"
                          : "bg-[var(--lime)] text-white shadow-md shadow-green-200"
                        : "bg-[var(--pinktone-soft)] text-[var(--texto-principal)] hover:bg-[var(--pinktone)]"
                    }`}
                  >
                    {nombreCategoria(cat)}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          {cargando ? (
            <p className="text-center text-sm text-[var(--texto-suave)] py-12">Cargando...</p>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-[var(--texto-suave)]">
                No hay items en esta categoría todavía.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onAgregar={() => handleAgregar(producto)}
                  recienAgregado={agregadoId === producto.id}
                  esSnack={CATEGORIAS_SNACKS.includes(producto.categoria)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CarritoFlotante />
    </main>
  );
}

/* ---------- TARJETA DE PRODUCTO ---------- */
function ProductoCard({
  producto,
  onAgregar,
  recienAgregado,
  esSnack,
}: {
  producto: Producto;
  onAgregar: () => void;
  recienAgregado: boolean;
  esSnack: boolean;
}) {
  const stockBajo = producto.stock <= 5;
  const sinStock = producto.stock === 0;
  const colorPrincipal = esSnack ? "lime" : "primrose";

  return (
    <div className={`bg-white rounded-2xl border-2 overflow-hidden shadow-md transition group hover:-translate-y-1 ${
      colorPrincipal === "primrose"
        ? "border-[var(--borde-rosa)] shadow-pink-100 hover:shadow-pink-200"
        : "border-[var(--borde-verde)] shadow-green-100 hover:shadow-green-200"
    }`}>
      {/* Imagen */}
      <div className={`relative aspect-square overflow-hidden ${
        colorPrincipal === "primrose" ? "bg-[var(--pinktone-soft)]" : "bg-[var(--lime-soft)]"
      }`}>
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--texto-tenue)] text-5xl">
            ◇
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {producto.destacado && (
            <span className={`text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md ${
              colorPrincipal === "primrose" ? "bg-[var(--primrose)]" : "bg-[var(--lime)]"
            }`}>
              Destacado
            </span>
          )}
          {sinStock ? (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              Agotado
            </span>
          ) : stockBajo ? (
            <span className="bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              Últimos {producto.stock}
            </span>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className={`text-xs uppercase tracking-widest mb-1 font-semibold ${
          colorPrincipal === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"
        }`}>
          {producto.categoria.replace("-", " ")}
        </p>
        <h3 className="font-semibold text-[var(--texto-principal)] mb-2">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-xs text-[var(--texto-suave)] leading-relaxed mb-4 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-[var(--texto-principal)]">
            S/ {producto.precio}
          </p>
          <button
            onClick={onAgregar}
            disabled={sinStock}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              sinStock
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : recienAgregado
                ? "bg-green-500 text-white"
                : colorPrincipal === "primrose"
                ? "bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white shadow-md shadow-pink-200"
                : "bg-[var(--lime)] hover:bg-[var(--lime-hover)] text-white shadow-md shadow-green-200"
            }`}
          >
            {recienAgregado ? "✓ Agregado" : sinStock ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}