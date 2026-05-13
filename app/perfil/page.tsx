"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useUser, NIVELES_FIDELIZACION } from "@/lib/use-user";

type Tab = "info" | "compras" | "fidelizacion";

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
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <p className="text-sm text-neutral-500">Cargando...</p>
    </main>
  );
}

function PerfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, nombre, correo, numCompras, nivel, proximoNivel, loading, signOut } = useUser();

  // Leer la tab del URL (?tab=compras) o usar "info" por defecto
  const tabUrl = searchParams.get("tab") as Tab | null;
  const [tabActiva, setTabActiva] = useState<Tab>(tabUrl || "info");

  // Si cambia la URL, actualizar la tab
  useEffect(() => {
    if (tabUrl && ["info", "compras", "fidelizacion"].includes(tabUrl)) {
      setTabActiva(tabUrl);
    }
  }, [tabUrl]);

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
    setTabActiva(nueva);
    // Actualizar URL sin recargar
    const url = new URL(window.location.href);
    if (nueva === "info") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", nueva);
    }
    window.history.replaceState({}, "", url);
  }

  return (
    <main className="min-h-screen bg-neutral-50">
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={nombre}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-neutral-900 text-white text-2xl font-semibold flex items-center justify-center shadow-md">
              {iniciales}
            </div>
          )}
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-500 mb-1">Mi cuenta</p>
            <h1 className="text-3xl md:text-4xl font-light">
              Hola, <span className="font-semibold">{nombre.split(" ")[0]}</span>
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-8">
          <div className="flex gap-1 overflow-x-auto">
            <BotonTab activa={tabActiva === "info"} onClick={() => cambiarTab("info")} label="Mi información" />
            <BotonTab activa={tabActiva === "compras"} onClick={() => cambiarTab("compras")} label="Mis compras" badge={numCompras > 0 ? numCompras : undefined} />
            <BotonTab activa={tabActiva === "fidelizacion"} onClick={() => cambiarTab("fidelizacion")} label="Fidelización" />
          </div>
        </div>

        {/* Contenido de las tabs */}
        {tabActiva === "info" && <TabMiInfo user={user} nombre={nombre} correo={correo} onSignOut={handleSignOut} />}
        {tabActiva === "compras" && <TabMisCompras />}
        {tabActiva === "fidelizacion" && <TabFidelizacion numCompras={numCompras} nivel={nivel} proximoNivel={proximoNivel} />}
      </div>
    </main>
  );
}

/* ---------- BOTÓN DE TAB ---------- */
function BotonTab({ activa, onClick, label, badge }: { activa: boolean; onClick: () => void; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-sm font-medium transition relative whitespace-nowrap ${
        activa
          ? "text-neutral-900 border-b-2 border-neutral-900 -mb-px"
          : "text-neutral-500 hover:text-neutral-900"
      }`}
    >
      {label}
      {badge !== undefined && (
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
          activa ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ---------- TAB 1: MI INFORMACIÓN ---------- */
function TabMiInfo({ user, nombre, correo, onSignOut }: { user: any; nombre: string; correo: string; onSignOut: () => void }) {
  const proveedor = user.app_metadata?.provider || "email";
  const proveedorTexto = proveedor === "google" ? "Google" : "Correo y contraseña";
  const fechaRegistro = new Date(user.created_at).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Datos personales */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-5">Datos personales</h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <Campo label="Nombre completo" valor={nombre} />
          <Campo label="Correo electrónico" valor={correo} />
          <Campo label="Método de acceso" valor={proveedorTexto} />
          <Campo label="Miembro desde" valor={fechaRegistro} />
        </div>

        <p className="text-xs text-neutral-500 mt-6 leading-relaxed">
          Si necesitas actualizar alguno de estos datos, por favor contacta a María Luisa por WhatsApp.
        </p>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-2">Sesión</h2>
        <p className="text-sm text-neutral-600 mb-5">
          Al cerrar sesión tendrás que volver a iniciar sesión para acceder a tu cuenta.
        </p>
        <button
          onClick={onSignOut}
          className="text-sm text-red-600 border border-red-200 px-5 py-2.5 rounded-full hover:bg-red-50 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1.5">{label}</p>
      <p className="text-sm font-medium">{valor}</p>
    </div>
  );
}

/* ---------- TAB 2: MIS COMPRAS ---------- */
function TabMisCompras() {
  const { user } = useUser();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [compras, setCompras] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarBanner, setMostrarBanner] = useState(false);

  // Detectar si viene de una compra nueva
  useEffect(() => {
    if (searchParams.get("nuevo") === "1") {
      setMostrarBanner(true);
      // Auto-ocultar después de 8 segundos
      const timer = setTimeout(() => setMostrarBanner(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    async function cargar() {
      if (!user) return;
      const { data } = await supabase
        .from("compras")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setCompras(data || []);
      setCargando(false);
    }
    cargar();
  }, [user, supabase]);

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
        <p className="text-sm text-neutral-500">Cargando tus compras...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Banner de éxito */}
      {mostrarBanner && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-2xl p-5 flex items-start gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
            ✓
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-1">¡Pedido enviado correctamente!</h3>
            <p className="text-sm text-green-800 leading-relaxed">
              María Luisa recibió tu pedido por WhatsApp y te contactará pronto para coordinar el pago. 
              Tu pedido aparece abajo con estado <strong>&quot;Pendiente de pago&quot;</strong>.
            </p>
          </div>
          <button
            onClick={() => setMostrarBanner(false)}
            className="text-green-700 hover:text-green-900 text-xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      {/* Lista de compras */}
      {compras.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">Aún no tienes compras</h3>
          <p className="text-sm text-neutral-600 mb-6 max-w-sm mx-auto">
            Cuando hagas tu primera compra aparecerá aquí con todos los detalles.
          </p>
          <Link
            href="/comprar-libro"
            className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-700 transition text-sm font-medium"
          >
            Comprar el libro
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {compras.map((c) => (
            <CompraCard key={c.id} compra={c} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- CARD DE COMPRA ---------- */
function CompraCard({ compra }: { compra: any }) {
  const fecha = new Date(compra.created_at).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const estadoConfig: Record<string, { label: string; className: string }> = {
    pendiente:  { label: "Pendiente de pago",  className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    pagado:     { label: "Pagado",             className: "bg-green-50 text-green-700 border-green-200" },
    enviado:    { label: "Enviado",            className: "bg-blue-50 text-blue-700 border-blue-200" },
    entregado:  { label: "Entregado",          className: "bg-neutral-100 text-neutral-600 border-neutral-200" },
    cancelado:  { label: "Cancelado",          className: "bg-red-50 text-red-600 border-red-200" },
  };

  const estado = estadoConfig[compra.estado] ?? { label: compra.estado, className: "bg-neutral-100 text-neutral-600 border-neutral-200" };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="text-3xl">{compra.formato === "virtual" ? "📱" : "📚"}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{compra.producto}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {compra.formato === "virtual" ? "Libro Digital (PDF)" : "Libro Físico"} · {fecha}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-semibold text-sm">S/ {compra.precio}</p>
        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${estado.className}`}>
          {estado.label}
        </span>
      </div>
    </div>
  );
}

/* ---------- TAB 3: FIDELIZACIÓN ---------- */
function TabFidelizacion({ numCompras, nivel, proximoNivel }: { numCompras: number; nivel: any; proximoNivel: any }) {
  return (
    <div className="space-y-6">
      {/* Card principal con nivel actual */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-700 text-white rounded-2xl p-8">
        <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Tu nivel actual</p>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl">{nivel.emoji}</span>
          <div>
            <h2 className="text-2xl font-semibold">{nivel.nombre}</h2>
            <p className="text-sm text-neutral-300">{numCompras} compra{numCompras !== 1 ? "s" : ""} realizadas</p>
          </div>
        </div>

        <div className="border-t border-neutral-700 pt-5">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">Tu beneficio</p>
          <p className="text-base">{nivel.beneficio}</p>
        </div>

        {proximoNivel && (
          <div className="border-t border-neutral-700 pt-5 mt-5">
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Próximo nivel</p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">{proximoNivel.emoji} {proximoNivel.nombre}</span>
              <span className="text-xs text-neutral-400">
                {proximoNivel.comprasFaltantes} compra{proximoNivel.comprasFaltantes !== 1 ? "s" : ""} más
              </span>
            </div>
            {/* Barra de progreso */}
            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{
                  width: `${Math.min(100, (numCompras / proximoNivel.comprasMinimas) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-neutral-400 italic mt-2">{proximoNivel.beneficio}</p>
          </div>
        )}
      </div>

      {/* Lista de todos los niveles */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-2">Todos los niveles</h2>
        <p className="text-sm text-neutral-600 mb-6">
          Sigue comprando libros y participando en talleres para subir de nivel y obtener mejores beneficios.
        </p>

        <div className="space-y-3">
          {NIVELES_FIDELIZACION.map((n, i) => {
            const desbloqueado = numCompras >= n.comprasMinimas;
            const esActual = nivel.nombre === n.nombre;
            return (
              <div
                key={i}
                className={`p-5 rounded-xl border-2 transition ${
                  esActual
                    ? "border-neutral-900 bg-neutral-50"
                    : desbloqueado
                    ? "border-green-200 bg-green-50"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`text-3xl ${!desbloqueado ? "grayscale opacity-40" : ""}`}>
                    {n.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold">{n.nombre}</h3>
                      {esActual && (
                        <span className="text-xs bg-neutral-900 text-white px-2 py-0.5 rounded-full font-medium">
                          Tu nivel
                        </span>
                      )}
                      {desbloqueado && !esActual && (
                        <span className="text-xs text-green-700">✓ Desbloqueado</span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mb-1">
                      {n.comprasMinimas === 0 ? "Desde tu registro" : `Desde la compra #${n.comprasMinimas}`}
                    </p>
                    <p className="text-sm text-neutral-700">{n.beneficio}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}