"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser } from "@/lib/use-user";
import type { User } from "@supabase/supabase-js";

type Tab = "info" | "seguridad";

// Wrapper con Suspense (requerido por useSearchParams en Next.js 14+)
export default function PerfilPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PerfilContent />
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "url(/images/fondoperfil.png)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <p className="text-sm text-neutral-500">Cargando...</p>
    </main>
  );
}

function PerfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, nombre, correo, loading, signOut } = useUser();

  // La tab sale del URL (?tab=seguridad); "info" es el valor por defecto
  const tabUrl = searchParams.get("tab");
  const tabActiva: Tab = tabUrl === "seguridad" ? "seguridad" : "info";

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/perfil");
    }
  }, [loading, user, router]);

  if (loading) return <LoadingScreen />;
  if (!user) return null;

  // Avatar
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const iniciales = nombre
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  function cambiarTab(nueva: Tab) {
    router.replace(nueva === "info" ? "/perfil" : `/perfil?tab=${nueva}`, { scroll: false });
  }

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage: "url(/images/fondoperfil.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition">
            ← Volver al inicio
          </Link>
          <p className="text-sm font-semibold">María Luisa Nutricionista</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
        {/* Sección de bienvenida con avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10 animate-fade-in">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={nombre}
              className="w-20 h-20 rounded-full object-cover shadow-xl flotar"
              style={{ border: "4px solid rgba(255,255,255,0.85)" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full text-white text-2xl font-bold flex items-center justify-center shadow-xl flotar shrink-0"
              style={{ background: "var(--lime)", border: "4px solid rgba(255,255,255,0.85)" }}
            >
              {iniciales}
            </div>
          )}
          <div>
            <p className="font-nunito text-xs uppercase tracking-widest text-neutral-600 mb-1 drop-shadow-sm">Mi cuenta</p>
            <h1
              className="font-playfair text-3xl md:text-4xl drop-shadow-sm flotar"
              style={{ animationDelay: "0.4s", color: "#1a3a1a" }}
            >
              Hola, <span style={{ color: "var(--lime)", fontWeight: 800 }}>{nombre.split(" ")[0]}</span>
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8" style={{ borderBottom: "2px solid rgba(255,255,255,0.5)" }}>
          <div className="flex gap-1 overflow-x-auto">
            <BotonTab activa={tabActiva === "info"} onClick={() => cambiarTab("info")} label="Mi información" />
            <BotonTab activa={tabActiva === "seguridad"} onClick={() => cambiarTab("seguridad")} label="Seguridad" />
          </div>
        </div>

        {/* Contenido de las tabs */}
        {tabActiva === "info" && <TabMiInfo user={user} nombre={nombre} correo={correo} onSignOut={handleSignOut} />}
        {tabActiva === "seguridad" && <TabSeguridad correo={correo} />}
      </div>
    </main>
  );
}

/* ---------- BOTÓN DE TAB ---------- */
function BotonTab({ activa, onClick, label }: { activa: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`font-nunito px-5 py-3 text-sm font-semibold transition-all duration-200 relative whitespace-nowrap ${
        activa
          ? "text-[var(--lime)] border-b-2 -mb-px"
          : "text-neutral-600 hover:text-[var(--texto-principal)]"
      }`}
      style={activa ? { borderBottomColor: "var(--lime)" } : {}}
    >
      {label}
    </button>
  );
}

/* ---------- TAB 1: MI INFORMACIÓN ---------- */
function TabMiInfo({ user, nombre, correo, onSignOut }: { user: User; nombre: string; correo: string; onSignOut: () => void }) {
  const proveedor = user.app_metadata?.provider || "email";
  const proveedorTexto = proveedor === "google" ? "Google" : "Correo y contraseña";
  const fechaRegistro = new Date(user.created_at).toLocaleDateString("es-PE", {
    year: "numeric", month: "long", day: "numeric",
  });

  const campos = [
    {
      label: "Nombre completo", valor: nombre,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
    {
      label: "Correo electrónico", valor: correo,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    },
    {
      label: "Método de acceso", valor: proveedorTexto,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    },
    {
      label: "Miembro desde", valor: fechaRegistro,
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Datos personales */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[var(--borde-verde)] p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[var(--lime-soft)] flex items-center justify-center text-[var(--lime)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 className="font-nunito font-semibold text-lg text-[var(--texto-principal)]">Datos personales</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {campos.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--lime-soft)] border border-[var(--borde-verde)] transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[var(--lime)] shrink-0 shadow-sm">
                {c.icon}
              </div>
              <div className="min-w-0">
                <p className="font-nunito text-xs uppercase tracking-widest text-[var(--texto-suave)] mb-0.5">{c.label}</p>
                <p className="font-nunito text-sm font-semibold text-[var(--texto-principal)] truncate">{c.valor}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="font-nunito text-xs text-[var(--texto-suave)] mt-5 leading-relaxed">
          Si necesitas actualizar alguno de estos datos, por favor contacta a María Luisa por WhatsApp.
        </p>
      </div>

      {/* Sesión */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[var(--borde-verde)] p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <h2 className="font-nunito font-semibold text-lg text-[var(--texto-principal)]">Sesión</h2>
        </div>
        <p className="font-nunito text-sm text-[var(--texto-suave)] mb-5 leading-relaxed">
          Al cerrar sesión tendrás que volver a iniciar sesión para acceder a tu cuenta.
        </p>
        <button
          onClick={onSignOut}
          className="font-nunito text-sm text-red-600 border border-red-200 px-5 py-2.5 rounded-full hover:bg-red-50 transition-all duration-200 hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}


/* ---------- TAB 2: SEGURIDAD ---------- */
function TabSeguridad({ correo }: { correo: string }) {
  const supabase = createClient();
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCambiarPassword() {
    setError(null);
    setMensaje(null);
    setEnviando(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: `${window.location.origin}/recuperar-contrasena`,
    });

    if (resetError) {
      setError("No se pudo enviar el correo. Intenta de nuevo en unos minutos.");
    } else {
      setMensaje("Te enviamos un correo con el enlace para crear una contraseña nueva. Revisa también tu carpeta de spam.");
    }
    setEnviando(false);
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[var(--borde-verde)] p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[var(--lime-soft)] flex items-center justify-center text-[var(--lime)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <h2 className="font-nunito text-lg font-semibold text-[var(--texto-principal)]">Contraseña</h2>
            <p className="font-nunito text-sm text-[var(--texto-suave)]">
              Te enviaremos un enlace seguro a <strong>{correo}</strong>
            </p>
          </div>
        </div>

        {mensaje && (
          <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-800 leading-relaxed">
            {mensaje}
          </div>
        )}
        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 leading-relaxed">
            {error}
          </div>
        )}

        <button
          onClick={handleCambiarPassword}
          disabled={enviando}
          className="font-nunito inline-flex items-center gap-2 bg-[var(--lime)] text-white px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-md disabled:opacity-50 disabled:hover:scale-100"
        >
          {enviando ? "Enviando..." : "Cambiar mi contraseña"}
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--borde-verde)] p-6">
        <h3 className="font-nunito text-sm font-semibold mb-3 text-[var(--texto-principal)]">
          Consejos para tu cuenta
        </h3>
        <ul className="space-y-2 font-nunito text-sm text-[var(--texto-suave)] leading-relaxed">
          <li>• Usa una contraseña de al menos 8 caracteres, con mayúsculas y números.</li>
          <li>• No compartas tu contraseña con nadie, ni siquiera por WhatsApp.</li>
          <li>• Si entras desde una computadora compartida, cierra sesión al terminar.</li>
        </ul>
      </div>
    </div>
  );
}
