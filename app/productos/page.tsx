"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

export default function ProductosPage() {
  const router = useRouter();
  const { user, loading: loadingUser } = useUser();
  const supabase = createClient();
  const { agregar } = useCarrito();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todos");
  const [agregadoId, setAgregadoId] = useState<number | null>(null);

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

  // Categorías únicas
  const categorias = ["todos", ...Array.from(new Set(productos.map((p) => p.categoria)))];

  // Filtrar productos
  const productosFiltrados =
    categoriaActiva === "todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

  function handleAgregar(producto: Producto) {
    agregar({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen_url: producto.imagen_url || undefined,
      tipo: "producto",
    });

    // Animación de "agregado"
    setAgregadoId(producto.id);
    setTimeout(() => setAgregadoId(null), 1500);
  }

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

      {/* Hero de productos */}
      <section className="bg-[var(--pinktone-soft)] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
            Tienda
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-[var(--texto-principal)] mb-3">
            Productos <span className="font-semibold text-[var(--primrose)]">naturales.</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--texto-suave)] max-w-2xl mx-auto">
            Superalimentos, harinas y suplementos cuidadosamente seleccionados para acompañar tu vida saludable.
          </p>
        </div>
      </section>

      {/* Filtros de categoría */}
      <section className="bg-white py-6 border-b border-[var(--borde-rosa)] sticky top-[57px] z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
                  categoriaActiva === cat
                    ? "bg-[var(--primrose)] text-white shadow-md shadow-pink-200"
                    : "bg-[var(--pinktone-soft)] text-[var(--texto-principal)] hover:bg-[var(--pinktone)]"
                }`}
              >
                {cat === "todos" ? "Todos" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          {cargando ? (
            <p className="text-center text-sm text-[var(--texto-suave)] py-12">Cargando productos...</p>
          ) : productosFiltrados.length === 0 ? (
            <p className="text-center text-sm text-[var(--texto-suave)] py-12">
              No hay productos en esta categoría todavía.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((producto) => (
                <ProductoCard
                  key={producto.id}
                  producto={producto}
                  onAgregar={() => handleAgregar(producto)}
                  recienAgregado={agregadoId === producto.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Carrito flotante */}
      <CarritoFlotante />
    </main>
  );
}

/* ---------- TARJETA DE PRODUCTO ---------- */
function ProductoCard({
  producto,
  onAgregar,
  recienAgregado,
}: {
  producto: Producto;
  onAgregar: () => void;
  recienAgregado: boolean;
}) {
  const stockBajo = producto.stock <= 5;
  const sinStock = producto.stock === 0;

  return (
    <div className="bg-white rounded-2xl border-2 border-[var(--borde-rosa)] overflow-hidden shadow-md shadow-pink-100 hover:shadow-xl hover:shadow-pink-200 transition group">
      {/* Imagen */}
      <div className="relative aspect-square bg-[var(--pinktone-soft)] overflow-hidden">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => {
              // Si la imagen no carga, mostrar placeholder
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--texto-tenue)] text-4xl">
            ◇
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {producto.destacado && (
            <span className="bg-[var(--primrose)] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
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
        <p className="text-xs text-[var(--lime)] uppercase tracking-widest mb-1 font-semibold">
          {producto.categoria}
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
                ? "bg-[var(--lime)] text-white"
                : "bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white shadow-md shadow-pink-200"
            }`}
          >
            {recienAgregado ? "✓ Agregado" : sinStock ? "Agotado" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}