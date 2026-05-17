"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCarrito } from "@/lib/use-carrito";

export default function CarritoFlotante() {
  const { items, cantidadTotal, subtotal, cambiarCantidad, eliminar, vaciar, cargado } = useCarrito();
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const handler = () => setAbierto(true);
    window.addEventListener("abrir-carrito", handler);
    return () => window.removeEventListener("abrir-carrito", handler);
  }, []);

  // No renderizar nada hasta que se cargue el carrito
  if (!cargado) return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(true)}
        className="fixed bottom-6 right-6 z-40 bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white rounded-full shadow-2xl shadow-pink-300 px-5 py-4 flex items-center gap-3 transition hover:scale-105"
        aria-label="Abrir carrito"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="font-semibold">
          {cantidadTotal > 0 ? `${cantidadTotal} ${cantidadTotal === 1 ? "item" : "items"}` : "Carrito"}
        </span>
        {subtotal > 0 && (
          <span className="text-sm bg-white text-[var(--primrose)] rounded-full px-3 py-1 font-semibold">
            S/ {subtotal.toFixed(2)}
          </span>
        )}
      </button>

      {/* Drawer lateral */}
      {abierto && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-50 transition-opacity"
            onClick={() => setAbierto(false)}
          />

          {/* Panel */}
          <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col">
            {/* Header del carrito */}
            <div className="p-6 border-b border-[var(--borde-rosa)] bg-[var(--pinktone-soft)]">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl font-semibold text-[var(--texto-principal)]">
                  Tu carrito
                </h2>
                <button
                  onClick={() => setAbierto(false)}
                  className="w-8 h-8 rounded-full hover:bg-white text-[var(--texto-suave)] hover:text-[var(--texto-principal)] flex items-center justify-center transition text-xl"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-[var(--texto-suave)]">
                {cantidadTotal > 0
                  ? `${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"} en total`
                  : "Tu carrito está vacío"}
              </p>
            </div>

            {/* Contenido */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--pinktone-soft)] flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[var(--primrose)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-[var(--texto-principal)] font-medium mb-2">
                  Aún no has agregado nada
                </p>
                <p className="text-sm text-[var(--texto-suave)] max-w-xs mb-6">
                  Explora el catálogo y arma tu pedido. Todo se coordina por WhatsApp.
                </p>
                <button
                  onClick={() => setAbierto(false)}
                  className="text-sm bg-[var(--primrose)] text-white px-5 py-2.5 rounded-full hover:bg-[var(--primrose-hover)] transition"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <>
                {/* Lista de items con scroll */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.tipo}-${item.id}`}
                      className="bg-white border border-[var(--borde-rosa)] rounded-2xl p-3 flex gap-3"
                    >
                      {/* Imagen */}
                      <div className="relative w-16 h-16 bg-[var(--pinktone-soft)] rounded-lg overflow-hidden flex-shrink-0">
                        {item.imagen_url ? (
                          <Image
                            src={item.imagen_url}
                            alt={item.nombre}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[var(--texto-tenue)]">
                            ◇
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--texto-principal)] truncate">
                          {item.nombre}
                        </p>
                        <p className="text-xs text-[var(--texto-suave)] mb-2">
                          S/ {item.precio.toFixed(2)} c/u
                        </p>

                        {/* Controles de cantidad */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => cambiarCantidad(item.id, item.tipo, item.cantidad - 1)}
                              className="w-7 h-7 rounded-full border border-[var(--borde-rosa)] hover:bg-[var(--pinktone-soft)] text-[var(--texto-principal)] flex items-center justify-center transition text-sm"
                              aria-label="Restar"
                            >
                              −
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => cambiarCantidad(item.id, item.tipo, item.cantidad + 1)}
                              className="w-7 h-7 rounded-full border border-[var(--borde-rosa)] hover:bg-[var(--pinktone-soft)] text-[var(--texto-principal)] flex items-center justify-center transition text-sm"
                              aria-label="Sumar"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-sm font-semibold text-[var(--primrose)]">
                            S/ {(item.precio * item.cantidad).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Eliminar */}
                      <button
                        onClick={() => eliminar(item.id, item.tipo)}
                        className="text-[var(--texto-tenue)] hover:text-red-500 transition self-start"
                        aria-label="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Vaciar */}
                  <button
                    onClick={() => {
                      if (confirm("¿Vaciar el carrito completo?")) vaciar();
                    }}
                    className="text-xs text-[var(--texto-tenue)] hover:text-red-500 transition mt-4 w-full text-center"
                  >
                    Vaciar carrito
                  </button>
                </div>

                {/* Footer con total y CTA */}
                <div className="p-6 border-t border-[var(--borde-rosa)] bg-[var(--yucca-soft)] space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-[var(--texto-suave)]">Subtotal</span>
                    <span className="text-2xl font-semibold text-[var(--texto-principal)]">
                      S/ {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--texto-suave)] leading-relaxed">
                    El costo de envío se confirma por WhatsApp según tu distrito.
                  </p>
                  <Link
                    href="/comprar-carrito"
                    onClick={() => setAbierto(false)}
                    className="block w-full bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white text-center px-6 py-4 rounded-full transition font-semibold shadow-lg shadow-pink-200"
                  >
                    Finalizar pedido
                  </Link>
                </div>
              </>
            )}
          </aside>
        </>
      )}
    </>
  );
}