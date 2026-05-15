"use client";

import { useUser } from "@/lib/use-user";

// IMPORTANTE: Cambia este correo por el de María Luisa cuando esté lista
const ADMIN_EMAILS = [
  "fernandezjefra1@autonoma.edu.pe", // Reemplaza con tu correo
  // Puedes agregar más admins aquí en el futuro:
  // "asistente@gmail.com",
];

export function useAdmin() {
  const { user, correo, loading } = useUser();
  const esAdmin = user ? ADMIN_EMAILS.includes(correo) : false;
  return { esAdmin, loading, user };
}