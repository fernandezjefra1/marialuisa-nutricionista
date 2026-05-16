"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/lib/use-user";

type AdminEntry = {
  id: string;
  email: string;
  agregado_por: string | null;
  created_at: string;
};

export default function AdministradoresPage() {
  const { correo } = useUser();
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  async function cargarAdmins() {
    const supabase = createClient();
    const { data } = await supabase
      .from("admin_emails")
      .select("*")
      .order("created_at", { ascending: true });
    setAdmins(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    cargarAdmins();
  }, []);

  async function agregarAdmin(e: React.FormEvent) {
    e.preventDefault();
    const email = nuevoEmail.trim().toLowerCase();
    if (!email) return;

    setGuardando(true);
    setError("");
    setExito("");

    const supabase = createClient();
    const { error: err } = await supabase
      .from("admin_emails")
      .insert({ email, agregado_por: correo });

    if (err) {
      if (err.code === "23505") {
        setError("Ese correo ya es administrador.");
      } else {
        setError("No se pudo agregar el administrador. Verifica el correo.");
      }
    } else {
      setExito(`${email} agregado como administrador.`);
      setNuevoEmail("");
      await cargarAdmins();
    }

    setGuardando(false);
  }

  async function eliminarAdmin(id: string, email: string) {
    if (email === correo) {
      setError("No puedes eliminarte a ti mismo como administrador.");
      return;
    }
    if (!confirm(`¿Eliminar a ${email} como administrador?`)) return;

    const supabase = createClient();
    const { error: err } = await supabase
      .from("admin_emails")
      .delete()
      .eq("id", id);

    if (err) {
      setError("No se pudo eliminar el administrador.");
    } else {
      setExito(`${email} eliminado de administradores.`);
      await cargarAdmins();
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--texto-principal)]">Administradores</h1>
        <p className="text-sm text-[var(--texto-suave)] mt-1">
          Gestiona quién tiene acceso al panel de administración.
        </p>
      </div>

      {/* Formulario agregar */}
      <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] p-6">
        <h2 className="text-base font-semibold text-[var(--texto-principal)] mb-4">
          Agregar administrador
        </h2>
        <form onSubmit={agregarAdmin} className="flex gap-3 flex-wrap">
          <input
            type="email"
            required
            placeholder="correo@ejemplo.com"
            value={nuevoEmail}
            onChange={(e) => {
              setNuevoEmail(e.target.value);
              setError("");
              setExito("");
            }}
            className="flex-1 min-w-60 border border-[var(--borde-rosa)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primrose)] text-[var(--texto-principal)]"
          />
          <button
            type="submit"
            disabled={guardando}
            className="bg-[var(--primrose)] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
          >
            {guardando ? "Agregando..." : "Agregar"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
        {exito && (
          <p className="mt-3 text-sm text-green-600">{exito}</p>
        )}
      </div>

      {/* Lista de admins */}
      <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--borde-rosa)]">
          <h2 className="text-base font-semibold text-[var(--texto-principal)]">
            Administradores actuales
          </h2>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-sm text-[var(--texto-suave)]">Cargando...</p>
        ) : admins.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[var(--texto-suave)]">No hay administradores registrados.</p>
        ) : (
          <ul className="divide-y divide-[var(--borde-rosa)]">
            {admins.map((admin) => (
              <li key={admin.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--texto-principal)] truncate">
                    {admin.email}
                    {admin.email === correo && (
                      <span className="ml-2 text-xs text-[var(--primrose)] font-normal">(tú)</span>
                    )}
                  </p>
                  <p className="text-xs text-[var(--texto-suave)] mt-0.5">
                    Agregado el {new Date(admin.created_at).toLocaleDateString("es-PE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {admin.agregado_por && ` · por ${admin.agregado_por}`}
                  </p>
                </div>
                {admin.email !== correo && (
                  <button
                    onClick={() => eliminarAdmin(admin.id, admin.email)}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline transition shrink-0"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
