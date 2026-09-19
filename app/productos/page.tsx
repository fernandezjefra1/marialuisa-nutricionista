"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

const WHATSAPP_NUMERO = "51985577017";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  categoria: string | null;
  imagen_url: string | null;
  destacado: boolean;
};

export default function ProductosPage() {
  const supabase = createClient();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let vigente = true;
    supabase
      .from("productos")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true })
      .then(({ data }) => {
        if (!vigente) return;
        setProductos((data as Producto[]) ?? []);
        setLoading(false);
      });
    return () => { vigente = false; };
  }, [supabase]);

  return (
    <main className="min-h-screen bg-[#f5f0e8]">
      {/* Header */}
      <header className="bg-[#f5f0e8]/95 backdrop-blur-md border-b border-[var(--verde-fuerte)]/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-nunito text-sm text-[var(--texto-suave)] hover:text-[var(--lime)] transition">
            ← Volver al inicio
          </Link>
          <p className="font-playfair font-semibold text-[var(--texto-principal)] truncate px-3">
            María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-sm font-semibold text-[#25D366] hover:underline"
          >
            WhatsApp
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
          Productos saludables
        </p>
        <h1 className="font-playfair text-3xl md:text-5xl font-bold text-[var(--texto-principal)] mb-3">
          Catálogo <span className="text-[var(--lime)]">María Luisa.</span>
        </h1>
        <p className="font-nunito text-base text-[var(--texto-suave)] max-w-2xl mx-auto">
          Superalimentos y productos seleccionados para complementar tu nutrición.
          Haz tu pedido directo por WhatsApp.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <p className="text-center text-sm text-[var(--texto-suave)] py-16">Cargando catálogo...</p>
        ) : productos.length === 0 ? (
          <p className="text-center text-sm text-[var(--texto-suave)] py-16">
            Pronto agregaremos productos. Escríbenos por WhatsApp para consultar disponibilidad.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {productos.map((p) => {
              const mensaje = encodeURIComponent(
                `¡Hola María Luisa! Me interesa el producto "${p.nombre}"${p.precio ? ` (S/ ${p.precio})` : ""}. ¿Está disponible?`
              );
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-[var(--borde-verde)] overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <div className="relative aspect-square bg-[var(--lime-soft)]">
                    {p.imagen_url ? (
                      <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-4" sizes="(max-width:768px) 50vw, 25vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--texto-tenue)]">◇</div>
                    )}
                    {p.destacado && (
                      <span className="absolute top-2 left-2 bg-[var(--primrose)] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        Destacado
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    {p.categoria && (
                      <p className="text-[10px] uppercase tracking-widest text-[var(--lime)] font-semibold mb-1">{p.categoria}</p>
                    )}
                    <h3 className="font-semibold text-sm text-[var(--texto-principal)] mb-1">{p.nombre}</h3>
                    {p.descripcion && (
                      <p className="font-nunito text-xs text-[var(--texto-suave)] leading-relaxed mb-3 line-clamp-3">{p.descripcion}</p>
                    )}
                    <div className="mt-auto">
                      {p.precio != null && (
                        <p className="font-playfair text-lg font-bold text-[var(--texto-principal)] mb-2">S/ {p.precio}</p>
                      )}
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-semibold px-4 py-2.5 rounded-full transition"
                      >
                        Pedir por WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
