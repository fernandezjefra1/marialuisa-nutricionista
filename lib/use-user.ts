"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// === NIVELES DE FIDELIZACIÓN ===
export const NIVELES_FIDELIZACION = [
  { 
    nombre: "Bienvenida", 
    emoji: "🌱",
    comprasMinimas: 0, 
    beneficio: "Acceso a contenido exclusivo" 
  },
  { 
    nombre: "Cliente Frecuente", 
    emoji: "⭐",
    comprasMinimas: 3, 
    beneficio: "10% de descuento en tu próxima compra" 
  },
  { 
    nombre: "Cliente VIP", 
    emoji: "💎",
    comprasMinimas: 5, 
    beneficio: "20% de descuento + acceso prioritario a talleres" 
  },
  { 
    nombre: "Cliente Elite", 
    emoji: "👑",
    comprasMinimas: 10, 
    beneficio: "Una consulta nutricional gratis" 
  },
];

// Calcular el nivel actual según número de compras
export function getNivelActual(numCompras: number) {
  // Buscar el nivel más alto que el usuario haya alcanzado
  let nivelActual = NIVELES_FIDELIZACION[0];
  for (const nivel of NIVELES_FIDELIZACION) {
    if (numCompras >= nivel.comprasMinimas) {
      nivelActual = nivel;
    }
  }
  return nivelActual;
}

// Calcular el siguiente nivel y cuántas compras faltan
export function getProximoNivel(numCompras: number) {
  const proximo = NIVELES_FIDELIZACION.find(
    (n) => n.comprasMinimas > numCompras
  );
  if (!proximo) return null; // Ya es el nivel máximo
  return {
    ...proximo,
    comprasFaltantes: proximo.comprasMinimas - numCompras,
  };
}

// Hook para obtener info del usuario actual
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [numCompras, setNumCompras] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Obtener usuario actual al montar
    async function cargarUsuario() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Contar compras de libros
        const { count: countLibros } = await supabase
          .from("compras")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .neq("estado", "cancelado");

        // Contar pedidos de productos (carrito)
        const { count: countPedidos } = await supabase
          .from("pedidos")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .neq("estado", "cancelado");

        setNumCompras((countLibros || 0) + (countPedidos || 0));
      }

      setLoading(false);
    }

    cargarUsuario();

    // Escuchar cambios de sesión (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (!session?.user) setNumCompras(0);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Función para cerrar sesión
  async function signOut() {
    await supabase.auth.signOut();
  }

  // Obtener nombre del usuario (de los metadatos)
  const nombre = user?.user_metadata?.nombre 
                || user?.user_metadata?.full_name 
                || user?.user_metadata?.name 
                || user?.email?.split("@")[0] 
                || "";

  return {
    user,
    nombre,
    correo: user?.email || "",
    numCompras,
    nivel: getNivelActual(numCompras),
    proximoNivel: getProximoNivel(numCompras),
    loading,
    signOut,
  };
}