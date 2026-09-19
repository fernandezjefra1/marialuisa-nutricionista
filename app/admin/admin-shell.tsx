"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/lib/use-admin";
import { createClient } from "@/lib/supabase";

/* ---- ICONOS SVG ---- */
const IcoHome    = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoBox     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IcoCalendar= () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoUsers   = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoLogout  = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { esAdmin, loading, user } = useAdmin();
  const supabase = createClient();
  const [sidebarMobile, setSidebarMobile] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login?redirect=/admin");
      else if (!esAdmin) router.push("/");
    }
  }, [loading, user, esAdmin, router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--lime-soft)] flex items-center justify-center">
        <p className="text-sm text-[var(--texto-suave)]">Verificando acceso...</p>
      </main>
    );
  }
  if (!user || !esAdmin) return null;

  const nombre   = user.user_metadata?.nombre || user.email?.split("@")[0] || "María Luisa";
  const initials = nombre.substring(0, 2).toUpperCase();

  const navItems = [
    { href: "/admin",                 label: "Dashboard",       icon: <IcoHome /> },
    { href: "/admin/productos",       label: "Catálogo",        icon: <IcoBox /> },
    { href: "/admin/citas",           label: "Citas",           icon: <IcoCalendar /> },
    { href: "/admin/administradores", label: "Administradores", icon: <IcoUsers /> },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#f0f5ec" }}>

      {/* Backdrop mobile */}
      {sidebarMobile && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarMobile(false)} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`${
        sidebarMobile ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 fixed top-0 left-0 z-50 md:z-0 md:sticky w-60 h-screen bg-white border-r border-[var(--borde-verde)] flex flex-col transition-transform shrink-0`}>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-[var(--borde-verde)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--borde-verde)] shrink-0">
              <Image src="/images/logoNutricion.png" alt="Logo" fill sizes="36px" className="object-cover" />
            </div>
            <div>
              <p className="font-playfair font-bold text-[var(--texto-principal)] text-sm leading-tight">María Luisa</p>
              <p className="text-xs text-[var(--primrose)] font-semibold">Nutricionista</p>
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const activa = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarMobile(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  activa
                    ? "bg-[var(--primrose)] text-white shadow-md shadow-pink-200"
                    : "text-[var(--texto-suave)] hover:bg-[var(--lime-soft)] hover:text-[var(--texto-principal)]"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Usuario + cerrar sesión */}
        <div className="px-3 py-4 border-t border-[var(--borde-verde)]">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-[var(--lime)] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--texto-principal)] truncate">{nombre}</p>
              <p className="text-xs text-[var(--texto-suave)]">Nutricionista</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[var(--texto-suave)] hover:bg-[var(--pinktone-soft)] hover:text-[var(--primrose)] transition"
          >
            <IcoLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Topbar */}
        <header className="bg-white border-b border-[var(--borde-verde)] px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          {/* Hamburger mobile */}
          <button
            onClick={() => setSidebarMobile(true)}
            className="md:hidden w-9 h-9 rounded-full hover:bg-[var(--lime-soft)] flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-[var(--texto-principal)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
        </header>

        {/* Página */}
        <main
          className="flex-1 p-6 md:p-8 overflow-auto"
          style={{
            backgroundImage: "url(/images/fondoPanel.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "local",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
