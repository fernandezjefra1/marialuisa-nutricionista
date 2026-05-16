"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/lib/use-admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { esAdmin, loading, user } = useAdmin();
  const [sidebarMobile, setSidebarMobile] = useState(false);

  // Proteger ruta: solo admins
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/admin");
      } else if (!esAdmin) {
        router.push("/");
      }
    }
  }, [loading, user, esAdmin, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--yucca)] flex items-center justify-center">
        <p className="text-sm text-[var(--texto-suave)]">Verificando acceso...</p>
      </main>
    );
  }

  if (!user || !esAdmin) {
    return null; // El useEffect ya redirige
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icono: "📊" },
    { href: "/admin/pedidos-libro", label: "Pedidos de libro", icono: "📚" },
    { href: "/admin/pedidos-productos", label: "Pedidos de tienda", icono: "🛒" },
    { href: "/admin/solicitudes", label: "Solicitudes empresariales", icono: "🏢" },
    { href: "/admin/productos", label: "Gestión de productos", icono: "🥑" },
    { href: "/admin/administradores", label: "Administradores", icono: "👤" },
  ];

  return (
    <div className="min-h-screen bg-[var(--yucca-soft)] flex">
      {/* Backdrop mobile */}
      {sidebarMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarMobile(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${
        sidebarMobile ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 fixed md:sticky top-0 left-0 z-50 md:z-0 w-72 h-screen bg-white border-r border-[var(--borde-rosa)] flex flex-col transition-transform`}>
        {/* Logo */}
        <div className="p-6 border-b border-[var(--borde-rosa)]">
          <Link href="/" className="block">
            <p className="font-semibold text-sm text-[var(--texto-principal)]">
              María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
            </p>
            <p className="text-xs text-[var(--texto-suave)] mt-1">Panel administrador</p>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const activa = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarMobile(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  activa
                    ? "bg-[var(--primrose)] text-white shadow-md shadow-pink-200"
                    : "text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)]"
                }`}
              >
                <span className="text-lg">{item.icono}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-[var(--borde-rosa)]">
          <Link
            href="/"
            className="block px-4 py-2.5 rounded-xl text-sm text-[var(--texto-suave)] hover:bg-[var(--pinktone-soft)] hover:text-[var(--texto-principal)] transition text-center"
          >
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 md:ml-0 min-w-0">
        {/* Topbar mobile */}
        <div className="md:hidden bg-white border-b border-[var(--borde-rosa)] px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarMobile(true)}
            className="w-10 h-10 rounded-full hover:bg-[var(--pinktone-soft)] flex items-center justify-center"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6 text-[var(--texto-principal)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm font-semibold text-[var(--texto-principal)]">Admin</p>
        </div>

        <div className="p-6 md:p-10 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}