"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
};

const WHATSAPP = "51985577017";

const BADGE_CATEGORIA: Record<string, string> = {
  libros: "Guía completa",
  harinas: "100% Natural",
  superalimentos: "Omega 3-6-9",
  semillas: "100% Natural",
  endulzantes: "Sin azúcar",
  cereales: "100% Natural",
  bebidas: "Fresco",
  "comida-dietetica": "Dietético",
};

const NOMBRE_CATEGORIA: Record<string, string> = {
  todos: "Todos",
  harinas: "Harinas",
  semillas: "Semillas",
  superalimentos: "Superalimentos",
  endulzantes: "Endulzantes",
  cereales: "Cereales",
  general: "General",
  libros: "Libros",
  bebidas: "Bebidas",
  "comida-dietetica": "Comida dietética",
};

/** Nombre legible de una categoría; si no está mapeada, se capitaliza el slug */
function nombreCategoria(cat: string): string {
  if (NOMBRE_CATEGORIA[cat]) return NOMBRE_CATEGORIA[cat];
  const limpio = cat.replace(/-/g, " ");
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

function getBadge(producto: Producto): string {
  return BADGE_CATEGORIA[producto.categoria] || "Destacado";
}

/** Link de WhatsApp con el nombre del producto prellenado */
function linkWhatsApp(producto: Producto): string {
  const texto = `¡Hola María Luisa! Me interesa "${producto.nombre}" (S/ ${producto.precio}) del catálogo. ¿Está disponible?`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

export default function ProductosContent() {
  const supabase = createClient();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todos");

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

  const categorias = ["todos", ...Array.from(new Set(productos.map((p) => p.categoria)))];
  const productosFiltrados =
    categoriaActiva === "todos"
      ? productos
      : productos.filter((p) => p.categoria === categoriaActiva);

  return (
    <main className="min-h-screen bg-white">

      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-[var(--borde-rosa)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link href="/" className="text-sm text-[var(--texto-suave)] hover:text-[var(--primrose)] transition font-nunito shrink-0">
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">← Volver al inicio</span>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-playfair font-bold text-[var(--texto-principal)] text-sm sm:text-base truncate">
              María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/perfil" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full border border-[var(--borde-rosa)] hover:bg-[var(--pinktone-soft)] transition">
              <svg className="w-4 h-4 text-[var(--texto-suave)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("¡Hola María Luisa! Quiero consultar por el catálogo de productos.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 bg-[var(--lime)] hover:bg-[var(--lime-hover)] text-white px-3 sm:px-4 py-2 rounded-full transition text-sm font-semibold shadow-md shadow-green-200"
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.993 2.898 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413"/>
              </svg>
              <span className="hidden sm:inline">Pedir por WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ===== HERO — FLYER ===== */}
      <section className="relative w-full overflow-hidden" style={{ height: "300px" }}>
        <Image
          src="/images/flayeeeeeeerfinal.png"
          alt="Catálogo María Luisa Nutricionista"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </section>

      {/* ===== INTRO CATÁLOGO ===== */}
      <section className="bg-white py-6 sm:py-8 border-b border-[var(--borde-rosa)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[var(--texto-principal)]">
            Catálogo de <span className="text-[var(--primrose)]">productos</span>
          </h1>
          <p className="font-nunito text-sm sm:text-base text-[var(--texto-suave)] leading-relaxed mt-2">
            Suplementos y alimentos seleccionados para acompañar tu entrenamiento.
            Los precios son referenciales: escríbenos por WhatsApp para confirmar
            disponibilidad y coordinar tu pedido.
          </p>
        </div>
      </section>

      {/* ===== FILTROS CATEGORÍA ===== */}
      {categorias.length > 2 && (
        <section className="bg-white py-3 sm:py-5 border-b border-[var(--borde-rosa)]">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {categorias.map((cat) => {
                const activa = categoriaActiva === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition font-nunito border-2 ${
                      activa
                        ? "bg-[var(--primrose)] border-[var(--primrose)] text-white shadow-md shadow-pink-200"
                        : "bg-white border-[var(--borde-rosa)] text-[var(--texto-principal)] hover:border-[var(--primrose)] hover:text-[var(--primrose)]"
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

      {/* ===== GRID DE PRODUCTOS ===== */}
      <section className="py-8 md:py-16 bg-[var(--lime-soft)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {cargando ? (
            <p className="text-center text-sm text-[var(--texto-suave)] py-12">Cargando...</p>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-base text-[var(--texto-suave)] font-nunito">
                No hay items en esta categoría todavía.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {productosFiltrados.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== FEATURES ROW ===== */}
      <section className="bg-white py-8 sm:py-10 border-t border-[var(--borde-verde)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {([
              {
                svg: <svg className="w-5 h-5 text-[var(--lime)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: "100% Naturales", sub: "Productos seleccionados con altos estándares",
              },
              {
                svg: <svg className="w-5 h-5 text-[var(--lime)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
                title: "Calidad Garantizada", sub: "Marcas confiables y seguras para tu salud",
              },
              {
                svg: <svg className="w-5 h-5 text-[var(--lime)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                title: "Apoyo a tu entrenamiento", sub: "Para ganancia muscular, definición y rendimiento",
              },
              {
                svg: <svg className="w-5 h-5 text-[var(--lime)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                title: "Coordinación directa", sub: "Confirmamos stock y entrega por WhatsApp",
              },
            ] as { svg: React.ReactNode; title: string; sub: string }[]).map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--lime-soft)] border border-[var(--borde-verde)] flex items-center justify-center shrink-0">
                  {f.svg}
                </div>
                <div>
                  <p className="font-nunito font-semibold text-base text-[var(--texto-principal)]">{f.title}</p>
                  <p className="font-nunito text-sm text-[var(--texto-suave)] leading-relaxed mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===== TARJETA DE PRODUCTO ===== */
function ProductoCard({ producto }: { producto: Producto }) {
  const stockBajo = producto.stock <= 5;
  const sinStock = producto.stock === 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-[var(--borde-verde)] group">

      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-[var(--lime-soft)]">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--texto-tenue)] text-5xl">
            ◇
          </div>
        )}

        {/* Badge destacado — top left */}
        {producto.destacado && (
          <span className="absolute top-3 left-3 bg-[var(--primrose)] text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
            Destacado
          </span>
        )}

        {/* Stock badge */}
        {sinStock ? (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Agotado</span>
        ) : stockBajo && !producto.destacado ? (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Últimos {producto.stock}</span>
        ) : null}

        {/* Badge descriptivo — bottom left */}
        <span className="absolute bottom-3 left-3 bg-[var(--lime)] text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
          {getBadge(producto)}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="font-nunito text-xs uppercase tracking-widest mb-1 font-semibold text-[var(--primrose)]">
          {nombreCategoria(producto.categoria)}
        </p>
        <h3 className="font-semibold text-[var(--texto-principal)] mb-1.5 text-sm sm:text-base leading-snug">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="font-nunito text-xs sm:text-sm text-[var(--texto-suave)] leading-relaxed mb-3 sm:mb-4 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xl sm:text-2xl font-semibold text-[var(--texto-principal)]">
              S/ {producto.precio}
            </p>
            <p className="font-nunito text-[10px] text-[var(--texto-tenue)] leading-none">precio referencial</p>
          </div>
          {sinStock ? (
            <span className="px-2.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-neutral-200 text-neutral-400 shrink-0">
              Agotado
            </span>
          ) : (
            <a
              href={linkWhatsApp(producto)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition shrink-0 bg-[var(--lime)] hover:bg-[var(--lime-hover)] text-white shadow-md shadow-green-200"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.993 2.898 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413"/>
              </svg>
              <span className="sm:hidden">Pedir</span>
              <span className="hidden sm:inline">Pedir por WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
