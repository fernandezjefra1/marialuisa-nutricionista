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
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundImage: "url(/images/fondoperfil.png)", backgroundSize: "cover", backgroundPosition: "center" }}>
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

  useEffect(() => {
    if (searchParams.get("nuevo") === "1") {
      setMostrarBanner(true);
      const timer = setTimeout(() => setMostrarBanner(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    async function cargar() {
      if (!user) return;

      // Cargar compras de libros
      const { data: comprasLibros } = await supabase
        .from("compras")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Cargar pedidos del carrito
      const { data: pedidos } = await supabase
        .from("pedidos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Normalizar ambos para mostrarlos juntos
      const todasLasCompras = [
        ...(comprasLibros || []).map((c) => ({
          ...c,
          tipo_compra: "libro",
          total_display: c.precio,
        })),
        ...(pedidos || []).map((p) => ({
          ...p,
          tipo_compra: "carrito",
          producto: `Pedido de ${p.items?.length || 0} producto${p.items?.length !== 1 ? "s" : ""}`,
          total_display: p.total,
        })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setCompras(todasLasCompras);
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

      {compras.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">Aún no tienes compras</h3>
          <p className="text-sm text-neutral-600 mb-6 max-w-sm mx-auto">
            Cuando hagas tu primera compra aparecerá aquí con todos los detalles.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-700 transition text-sm font-medium"
          >
            Explorar la tienda
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {compras.map((c) => (
            <CompraCard key={`${c.tipo_compra}-${c.id}`} compra={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function CompraCard({ compra }: { compra: any }) {
  const estadoColor = {
    pendiente: "bg-amber-50 text-amber-700 border-amber-200",
    pagado: "bg-blue-50 text-blue-700 border-blue-200",
    enviado: "bg-purple-50 text-purple-700 border-purple-200",
    completado: "bg-green-50 text-green-700 border-green-200",
    cancelado: "bg-neutral-100 text-neutral-600 border-neutral-200",
  }[compra.estado as string] || "bg-neutral-100 text-neutral-600 border-neutral-200";

  const estadoTexto = {
    pendiente: "Pendiente de pago",
    pagado: "Pago confirmado",
    enviado: "En camino",
    completado: "Entregado",
    cancelado: "Cancelado",
  }[compra.estado as string] || compra.estado;

  const fecha = new Date(compra.created_at).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const esCarrito = compra.tipo_compra === "carrito";

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold">{compra.producto}</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {esCarrito
              ? `🛒 Pedido de productos · ${fecha}`
              : compra.formato === "virtual"
              ? `📱 Libro Digital · ${fecha}`
              : `📚 Libro Físico · ${fecha}`}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border ${estadoColor} font-medium`}>
          {estadoTexto}
        </span>
      </div>

      {/* Si es pedido de carrito, mostrar lista de items */}
      {esCarrito && compra.items && compra.items.length > 0 && (
        <div className="mb-3 p-3 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-500 mb-2 uppercase tracking-widest">Productos</p>
          <ul className="space-y-1 text-sm">
            {compra.items.slice(0, 3).map((item: any, i: number) => (
              <li key={i} className="flex justify-between text-neutral-700">
                <span>{item.cantidad}× {item.nombre}</span>
                <span className="text-neutral-500">S/ {item.subtotal?.toFixed(2)}</span>
              </li>
            ))}
            {compra.items.length > 3 && (
              <li className="text-xs text-neutral-500 italic">
                ... y {compra.items.length - 3} más
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-3 pt-3 border-t border-neutral-100">
        <div className="text-xs text-neutral-500">
          <span className="capitalize">{compra.metodo_pago}</span>
          {compra.direccion && <> · {compra.direccion}</>}
        </div>
        <p className="text-lg font-semibold">S/ {compra.total_display}</p>
      </div>
    </div>
  );
}

/* ---------- ICONOS DE NIVELES ---------- */
function IcoLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}
function IcoStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function IcoDiamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="6 3 18 3 22 9 12 22 2 9"/>
      <line x1="2" y1="9" x2="22" y2="9"/>
      <polyline points="6 3 12 9 18 3"/>
    </svg>
  );
}
function IcoCrown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}

const NIVEL_ICON: Record<string, React.ReactNode> = {
  "Bienvenida":        <IcoLeaf    className="w-full h-full" />,
  "Cliente Frecuente": <IcoStar    className="w-full h-full" />,
  "Cliente VIP":       <IcoDiamond className="w-full h-full" />,
  "Cliente Elite":     <IcoCrown   className="w-full h-full" />,
};

/* ---------- TAB 3: FIDELIZACIÓN ---------- */
function TabFidelizacion({ numCompras, nivel, proximoNivel }: { numCompras: number; nivel: any; proximoNivel: any }) {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setProgreso(proximoNivel
        ? Math.min(100, (numCompras / proximoNivel.comprasMinimas) * 100)
        : 100
      );
    }, 350);
    return () => clearTimeout(t);
  }, [numCompras, proximoNivel]);

  return (
    <div className="space-y-6">

      {/* ===== CARD PRINCIPAL ===== */}
      <div
        className="relative rounded-3xl overflow-hidden p-8"
        style={{ background: "linear-gradient(135deg, #3d8b3d 0%, #2a6b2a 45%, #163016 100%)" }}
      >
        {/* Hojas flotantes decorativas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[
            { top:"8%",  left:"4%",  w:22, anim:"food-d1", dur:"5s",   del:"0s"   },
            { top:"18%", right:"6%", w:16, anim:"food-d2", dur:"6.5s", del:"0.8s" },
            { top:"55%", left:"2%",  w:14, anim:"food-d3", dur:"4.5s", del:"1.5s" },
            { top:"65%", right:"4%", w:19, anim:"food-d1", dur:"7s",   del:"0.4s" },
            { top:"38%", left:"48%", w:11, anim:"food-d2", dur:"5.5s", del:"2.1s" },
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute ${p.anim} opacity-[0.18]`}
              style={{
                top: p.top,
                ...("left" in p ? { left: (p as any).left } : { right: (p as any).right }),
                width: p.w, height: p.w,
                ["--fdur" as string]: p.dur, ["--fdel" as string]: p.del,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-full h-full">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Contenido */}
        <div className="relative z-10">
          <p className="font-nunito text-xs uppercase tracking-widest text-green-300 mb-5">Tu nivel actual</p>

          <div className="flex items-center gap-5 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 flotar"
              style={{ background: "rgba(168,216,112,0.2)", color: "#a8d870", border: "1.5px solid rgba(168,216,112,0.35)" }}
            >
              <div className="w-9 h-9">{NIVEL_ICON[nivel.nombre] ?? <IcoLeaf className="w-full h-full"/>}</div>
            </div>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-white leading-tight">{nivel.nombre}</h2>
              <p className="font-nunito text-sm text-green-300 mt-0.5">
                {numCompras} compra{numCompras !== 1 ? "s" : ""} realizadas
              </p>
            </div>
          </div>

          {/* Beneficio actual */}
          <div className="rounded-2xl px-5 py-4 mb-5" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <p className="font-nunito text-xs text-green-300 uppercase tracking-widest mb-1.5">Tu beneficio</p>
            <p className="font-nunito text-base text-white font-medium">{nivel.beneficio}</p>
          </div>

          {/* Próximo nivel + barra */}
          {proximoNivel && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-4 h-4 text-green-300">{NIVEL_ICON[proximoNivel.nombre] ?? <IcoStar className="w-full h-full"/>}</div>
                  <p className="font-nunito text-sm font-semibold">{proximoNivel.nombre}</p>
                </div>
                <p className="font-nunito text-xs text-green-300">
                  {proximoNivel.comprasFaltantes} compra{proximoNivel.comprasFaltantes !== 1 ? "s" : ""} más
                </p>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${progreso}%`,
                    background: "linear-gradient(90deg, #a8d870, #6daa6d)",
                    boxShadow: "0 0 10px rgba(168,216,112,0.55)",
                  }}
                />
              </div>
              <p className="font-nunito text-xs text-green-400 italic mt-2">{proximoNivel.beneficio}</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== TODOS LOS NIVELES ===== */}
      <div className="bg-white rounded-3xl border border-[var(--borde-verde)] p-6 md:p-8 shadow-sm">
        <h2 className="font-nunito font-semibold text-lg text-[var(--texto-principal)] mb-1">Todos los niveles</h2>
        <p className="font-nunito text-sm text-[var(--texto-suave)] mb-6 leading-relaxed">
          Sigue comprando libros y participando en talleres para subir de nivel y obtener mejores beneficios.
        </p>

        <div className="space-y-3">
          {NIVELES_FIDELIZACION.map((n, i) => {
            const desbloqueado = numCompras >= n.comprasMinimas;
            const esActual = nivel.nombre === n.nombre;
            return (
              <div
                key={i}
                className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                  esActual
                    ? "border-[var(--lime)] bg-[var(--lime-soft)]"
                    : desbloqueado
                    ? "border-green-200 bg-green-50"
                    : "border-neutral-100 bg-white opacity-55"
                }`}
                style={esActual ? { boxShadow: "0 0 18px rgba(109,170,109,0.25)" } : {}}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      esActual
                        ? "bg-[var(--lime)] text-white flotar"
                        : desbloqueado
                        ? "bg-green-100 text-green-600"
                        : "bg-neutral-100 text-neutral-400"
                    }`}
                  >
                    <div className="w-5 h-5">{NIVEL_ICON[n.nombre] ?? <IcoLeaf className="w-full h-full"/>}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-nunito font-semibold text-[var(--texto-principal)]">{n.nombre}</h3>
                      {esActual && (
                        <span className="font-nunito text-xs bg-[var(--lime)] text-white px-2.5 py-0.5 rounded-full font-semibold">
                          Tu nivel
                        </span>
                      )}
                      {desbloqueado && !esActual && (
                        <span className="font-nunito text-xs text-green-600 font-medium flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Desbloqueado
                        </span>
                      )}
                    </div>
                    <p className="font-nunito text-xs text-[var(--texto-suave)] mb-1.5">
                      {n.comprasMinimas === 0 ? "Desde tu registro" : `Desde la compra #${n.comprasMinimas}`}
                    </p>
                    <p className="font-nunito text-sm text-[var(--texto-suave)]">{n.beneficio}</p>
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