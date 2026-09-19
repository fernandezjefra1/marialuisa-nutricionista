"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// Hook para obtener info del usuario actual
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Obtener usuario actual al montar
    async function cargarUsuario() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }

    cargarUsuario();

    // Escuchar cambios de sesión (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
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
    loading,
    signOut,
  };
}
