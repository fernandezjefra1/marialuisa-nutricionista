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

const CATEGORIAS_SNACKS = ["snacks", "bebidas", "comida-dietetica"];

const BADGE_CATEGORIA: Record<string, string> = {
  libros: "Guía completa",
  harinas: "100% Natural",
  superalimentos: "Omega 3-6-9",
  semillas: "100% Natural",
  endulzantes: "Sin azúcar",
  cereales: "100% Natural",
  snacks: "Fresco del día",
  bebidas: "Fresco",
  "comida-dietetica": "Dietético",
};

function getBadge(producto: Producto): string {
  const nombre = producto.nombre.toLowerCase();
  if (nombre.includes("físico") || nombre.includes("fisico")) return "Envío incluido";
  return BADGE_CATEGORIA[producto.categoria] || "Destacado";
}

/* ---- SVG DECORACIONES HERO ---- */
function AvocadoSvg() {
  return (
    <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="40" cy="65" rx="32" ry="42" fill="#6daa6d"/>
      <ellipse cx="40" cy="60" rx="22" ry="32" fill="#c8e8a8"/>
      <ellipse cx="40" cy="68" rx="12" ry="16" fill="#8B5E3C"/>
      <ellipse cx="40" cy="20" rx="18" ry="22" fill="#4a8a4a"/>
    </svg>
  );
}
function LimeSvg() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="40" cy="40" r="36" fill="#a8d870"/>
      <circle cx="40" cy="40" r="28" fill="#c8f090" stroke="#8abe50" strokeWidth="1"/>
      {[0,60,120,180,240,300].map((deg,i) => (
        <line key={i} x1="40" y1="40"
          x2={40 + 24*Math.cos((deg*Math.PI)/180)}
          y2={40 + 24*Math.sin((deg*Math.PI)/180)}
          stroke="#8abe50" strokeWidth="1.5"/>
      ))}
      <circle cx="40" cy="40" r="4" fill="#8abe50"/>
    </svg>
  );
}
function LeafSvg() {
  return (
    <svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M30 85 C10 60 5 35 20 15 C30 5 50 10 55 30 C60 50 45 70 30 85Z" fill="#5a9a5a"/>
      <line x1="30" y1="85" x2="30" y2="20" stroke="#4a8a4a" strokeWidth="2"/>
      {[30,50,65,75].map((y,i) => (
        <line key={i} x1="30" y1={y} x2={i%2===0?45:15} y2={y-10} stroke="#4a8a4a" strokeWidth="1.5"/>
      ))}
    </svg>
  );
}

export default function ProductosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: loadingUser } = useUser();
  const supabase = createClient();
  const { agregar, cantidadTotal } = useCarrito();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState<"productos" | "snacks">("productos");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todos");
  const [agregadoId, setAgregadoId] = useState<number | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "snacks") setTabActiva("snacks");
  }, [searchParams]);

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/login?redirect=/productos");
    }
  }, [loadingUser, user, router]);

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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-[var(--texto-suave)]">Cargando...</p>
      </main>
    );
  }

  const todosProductos = productos.filter((p) => !CATEGORIAS_SNACKS.includes(p.categoria));
  const todosSnacks = productos.filter((p) => CATEGORIAS_SNACKS.includes(p.categoria));
  const productosVisibles = tabActiva === "productos" ? todosProductos : todosSnacks;
  const categoriasDeTab = ["todos", ...Array.from(new Set(productosVisibles.map((p) => p.categoria)))];
  const productosFiltrados =
    categoriaActiva === "todos"
      ? productosVisibles
      : productosVisibles.filter((p) => p.categoria === categoriaActiva);

  function cambiarTab(nueva: "productos" | "snacks") {
    setTabActiva(nueva);
    setCategoriaActiva("todos");
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

  const nombreCategoria = (cat: string) => {
    const nombres: Record<string, string> = {
      todos: "Todos",
      harinas: "Harinas",
      semillas: "Semillas",
      superalimentos: "Superalimentos",
      endulzantes: "Endulzantes",
      cereales: "Cereales",
      general: "General",
      libros: "Libros",
      snacks: "Sándwiches",
      bebidas: "Bebidas",
      "comida-dietetica": "Comida dietética",
    };
    return nombres[cat] || cat;
  };

  function abrirCarrito() {
    window.dispatchEvent(new CustomEvent("abrir-carrito"));
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-[var(--borde-rosa)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-[var(--texto-suave)] hover:text-[var(--primrose)] transition font-nunito">
            ← Volver al inicio
          </Link>
          <div className="flex items-center gap-2">
            <p className="font-playfair font-bold text-[var(--texto-principal)] text-base">
              María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--borde-rosa)] hover:bg-[var(--pinktone-soft)] transition">
              <svg className="w-4 h-4 text-[var(--primrose)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--borde-rosa)] hover:bg-[var(--pinktone-soft)] transition">
              <svg className="w-4 h-4 text-[var(--texto-suave)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <button
              onClick={abrirCarrito}
              className="flex items-center gap-2 bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white px-4 py-2 rounded-full transition text-sm font-semibold shadow-md shadow-pink-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Carrito
              {cantidadTotal > 0 && (
                <span className="bg-white text-[var(--primrose)] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cantidadTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO — FLYER ===== */}
      <section className="w-full">
        <div className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/flayer_tienda.png"
            alt="Tienda María Luisa Nutricionista"
            className="w-full h-auto block"
          />
        </div>
      </section>

      {/* ===== TABS ===== */}
      <section className="bg-white border-b border-[var(--borde-rosa)] sticky top-[65px] z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 justify-center">
            {(["productos","snacks"] as const).map((tab) => {
              const activa = tabActiva === tab;
              const color = tab === "productos" ? "var(--primrose)" : "var(--lime)";
              const count = tab === "productos" ? todosProductos.length : todosSnacks.length;
              return (
                <button
                  key={tab}
                  onClick={() => cambiarTab(tab)}
                  className={`px-8 py-4 font-medium text-base transition relative font-nunito capitalize ${
                    activa ? "text-[var(--texto-principal)]" : "text-[var(--texto-suave)] hover:text-[var(--texto-principal)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab === "productos" ? "Productos" : "Snacks"}
                    <span className="text-sm px-2 py-0.5 rounded-full" style={{
                      background: activa ? color : "var(--pinktone-soft)",
                      color: activa ? "white" : "var(--texto-suave)"
                    }}>
                      {count}
                    </span>
                  </span>
                  {activa && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{background: color}} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FILTROS CATEGORÍA ===== */}
      {categoriasDeTab.length > 2 && (
        <section className="bg-white py-5 border-b border-[var(--borde-rosa)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {categoriasDeTab.map((cat) => {
                const activa = categoriaActiva === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={`px-5 py-2 rounded-full text-base font-medium transition font-nunito border-2 ${
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
      <section className="py-12 md:py-16 bg-[var(--lime-soft)]">
        <div className="max-w-7xl mx-auto px-6">
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

      {/* ===== FEATURES ROW ===== */}
      <section className="bg-white py-10 border-t border-[var(--borde-verde)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                title: "Nutrición Preventiva", sub: "Para todas las etapas de la vida",
              },
              {
                svg: <svg className="w-5 h-5 text-[var(--lime)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                title: "Envíos Seguros", sub: "Llegamos a tu hogar con mucho cuidado",
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

      <CarritoFlotante />
    </main>
  );
}

/* ===== TARJETA DE PRODUCTO ===== */
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
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-[var(--borde-verde)] group">

      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-[var(--lime-soft)]">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
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
          <span className={`absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full font-semibold shadow ${
            colorPrincipal === "primrose" ? "bg-[var(--primrose)]" : "bg-[var(--lime)]"
          }`}>
            Destacado
          </span>
        )}

        {/* Stock badge */}
        {sinStock ? (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Agotado</span>
        ) : stockBajo && !producto.destacado ? (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">Últimos {producto.stock}</span>
        ) : null}

        {/* Corazón — top right */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:scale-110 transition">
          <svg className="w-4 h-4 text-[var(--primrose)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Badge descriptivo — bottom left */}
        <span className="absolute bottom-3 left-3 bg-[var(--lime)] text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
          {getBadge(producto)}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className={`font-nunito text-xs uppercase tracking-widest mb-1 font-semibold ${
          colorPrincipal === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"
        }`}>
          {nombreCategoria(producto.categoria)}
        </p>
        <h3 className="font-semibold text-[var(--texto-principal)] mb-1.5 text-base leading-snug">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="font-nunito text-sm text-[var(--texto-suave)] leading-relaxed mb-4 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <p className="text-2xl font-semibold text-[var(--texto-principal)]">
            S/ {producto.precio}
          </p>
          <button
            onClick={onAgregar}
            disabled={sinStock}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition ${
              sinStock
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : recienAgregado
                ? "bg-green-500 text-white"
                : colorPrincipal === "primrose"
                ? "bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white shadow-md shadow-pink-200"
                : "bg-[var(--lime)] hover:bg-[var(--lime-hover)] text-white shadow-md shadow-green-200"
            }`}
          >
            {recienAgregado ? (
              "✓ Agregado"
            ) : sinStock ? (
              "Agotado"
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Agregar al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Helper usado en ProductoCard */
function nombreCategoria(cat: string) {
  const nombres: Record<string, string> = {
    todos: "Todos", harinas: "Harinas", semillas: "Semillas",
    superalimentos: "Superalimentos", endulzantes: "Endulzantes",
    cereales: "Cereales", general: "General", libros: "Libros",
    snacks: "Sándwiches", bebidas: "Bebidas", "comida-dietetica": "Comida dietética",
  };
  return nombres[cat] || cat;
}
