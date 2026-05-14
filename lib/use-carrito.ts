"use client";

import { useEffect, useState, useCallback } from "react";

// === TIPOS ===
export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  imagen_url?: string;
  cantidad: number;
  tipo: "producto" | "snack";
};

// Clave para guardar en localStorage
const STORAGE_KEY = "marialuisa_carrito";

// Evento personalizado para notificar cambios entre componentes
const CARRITO_UPDATED_EVENT = "carrito-updated";

// === FUNCIONES DE HELPER ===

function leerCarrito(): ItemCarrito[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarCarrito(items: ItemCarrito[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  // Notificar a otros componentes que el carrito cambió
  window.dispatchEvent(new CustomEvent(CARRITO_UPDATED_EVENT));
}

// === HOOK PRINCIPAL ===

export function useCarrito() {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  // Cargar carrito al montar
  useEffect(() => {
    setItems(leerCarrito());
    setCargado(true);

    // Escuchar cambios en el carrito desde otros componentes
    const handleUpdate = () => setItems(leerCarrito());
    window.addEventListener(CARRITO_UPDATED_EVENT, handleUpdate);

    // Escuchar cambios en localStorage de otras pestañas
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(leerCarrito());
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(CARRITO_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Agregar un item al carrito (si ya está, suma cantidad)
  const agregar = useCallback((item: Omit<ItemCarrito, "cantidad">, cantidad = 1) => {
    const actuales = leerCarrito();
    const existente = actuales.find((i) => i.id === item.id && i.tipo === item.tipo);

    let nuevos: ItemCarrito[];
    if (existente) {
      nuevos = actuales.map((i) =>
        i.id === item.id && i.tipo === item.tipo
          ? { ...i, cantidad: i.cantidad + cantidad }
          : i
      );
    } else {
      nuevos = [...actuales, { ...item, cantidad }];
    }

    guardarCarrito(nuevos);
  }, []);

  // Cambiar la cantidad de un item específico
  const cambiarCantidad = useCallback((id: number, tipo: "producto" | "snack", cantidad: number) => {
    const actuales = leerCarrito();
    let nuevos: ItemCarrito[];
    if (cantidad <= 0) {
      nuevos = actuales.filter((i) => !(i.id === id && i.tipo === tipo));
    } else {
      nuevos = actuales.map((i) =>
        i.id === id && i.tipo === tipo ? { ...i, cantidad } : i
      );
    }
    guardarCarrito(nuevos);
  }, []);

  // Eliminar un item
  const eliminar = useCallback((id: number, tipo: "producto" | "snack") => {
    const actuales = leerCarrito();
    const nuevos = actuales.filter((i) => !(i.id === id && i.tipo === tipo));
    guardarCarrito(nuevos);
  }, []);

  // Vaciar el carrito completo
  const vaciar = useCallback(() => {
    guardarCarrito([]);
  }, []);

  // Calcular totales
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);
  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return {
    items,
    cantidadTotal,
    subtotal,
    agregar,
    cambiarCantidad,
    eliminar,
    vaciar,
    cargado,
  };
}