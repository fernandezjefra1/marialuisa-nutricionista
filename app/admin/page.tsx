"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";

type ProductoAlerta = { id: number; nombre: string; stock: number; imagen_url?: string | null };

const UMBRAL_CRITICO    = 5;
const UMBRAL_ADVERTENCIA = 10;

/* ---- KAWAII SVGs ---- */
function KawaiiAvocado({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="40" cy="68" rx="30" ry="40" fill="#6daa6d"/>
      <ellipse cx="40" cy="62" rx="20" ry="30" fill="#c8e8a8"/>
      <ellipse cx="40" cy="70" rx="11" ry="14" fill="#8B5E3C"/>
      <ellipse cx="40" cy="22" rx="17" ry="20" fill="#4a8a4a"/>
      {/* cara kawaii */}
      <circle cx="34" cy="65" r="2.5" fill="#5a7255"/>
      <circle cx="46" cy="65" r="2.5" fill="#5a7255"/>
      <path d="M36 71 Q40 74 44 71" stroke="#5a7255" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* mejillas */}
      <circle cx="30" cy="68" r="3" fill="#f0a0b8" opacity="0.5"/>
      <circle cx="50" cy="68" r="3" fill="#f0a0b8" opacity="0.5"/>
    </svg>
  );
}
function KawaiiLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M30 75 C8 55 5 28 18 12 C28 2 52 8 56 28 C60 48 45 65 30 75Z" fill="#5a9a5a"/>
      <path d="M30 75 C8 55 5 28 18 12 C28 2 52 8 56 28 C60 48 45 65 30 75Z" fill="#7aba7a" opacity="0.5"/>
      <line x1="30" y1="75" x2="30" y2="18" stroke="#4a8a4a" strokeWidth="1.5"/>
      <line x1="30" y1="50" x2="44" y2="40" stroke="#4a8a4a" strokeWidth="1"/>
      <line x1="30" y1="60" x2="18" y2="50" stroke="#4a8a4a" strokeWidth="1"/>
      <line x1="30" y1="38" x2="42" y2="30" stroke="#4a8a4a" strokeWidth="1"/>
      {/* cara */}
      <circle cx="34" cy="35" r="2" fill="#3a7a3a"/>
      <circle cx="42" cy="32" r="2" fill="#3a7a3a"/>
      <path d="M35 39 Q38 41 42 38" stroke="#3a7a3a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function KawaiiLime({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="35" fill="#a8d870"/>
      <circle cx="40" cy="40" r="27" fill="#c8f090"/>
      {[0,60,120,180,240,300].map((deg, i) => (
        <line key={i} x1="40" y1="40"
          x2={40 + 22*Math.cos((deg*Math.PI)/180)}
          y2={40 + 22*Math.sin((deg*Math.PI)/180)}
          stroke="#8abe50" strokeWidth="1.5"/>
      ))}
      <circle cx="40" cy="40" r="4" fill="#8abe50"/>
      {/* cara */}
      <circle cx="33" cy="35" r="2.5" fill="#5a8a20"/>
      <circle cx="47" cy="35" r="2.5" fill="#5a8a20"/>
      <path d="M34 42 Q40 46 46 42" stroke="#5a8a20" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="30" cy="40" r="3.5" fill="#f0a0b8" opacity="0.45"/>
      <circle cx="50" cy="40" r="3.5" fill="#f0a0b8" opacity="0.45"/>
    </svg>
  );
}
function KawaiiCarrot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* hojas */}
      <path d="M30 10 C20 0 10 5 15 15 C18 20 26 18 30 10Z" fill="#5a9a5a"/>
      <path d="M30 10 C40 0 50 5 45 15 C42 20 34 18 30 10Z" fill="#6aaa6a"/>
      <path d="M30 10 C25 2 28 8 30 10Z" fill="#4a8a4a"/>
      {/* cuerpo zanahoria */}
      <path d="M22 15 Q18 55 30 90 Q42 55 38 15 Z" fill="#7aba7a"/>
      <path d="M22 15 Q18 55 30 90 Q42 55 38 15 Z" fill="#6daa6d" opacity="0.7"/>
      {/* líneas */}
      <path d="M24 30 Q30 28 36 30" stroke="#5a9a5a" strokeWidth="1" fill="none"/>
      <path d="M23 42 Q30 40 37 42" stroke="#5a9a5a" strokeWidth="1" fill="none"/>
      <path d="M24 54 Q30 52 36 54" stroke="#5a9a5a" strokeWidth="1" fill="none"/>
      {/* cara */}
      <circle cx="27" cy="45" r="2" fill="#3a7a3a"/>
      <circle cx="33" cy="45" r="2" fill="#3a7a3a"/>
      <path d="M27 50 Q30 53 33 50" stroke="#3a7a3a" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function KawaiiStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M25 5 L28 20 L43 20 L31 29 L35 44 L25 36 L15 44 L19 29 L7 20 L22 20 Z" fill="#c8e8a8" stroke="#6daa6d" strokeWidth="1.5"/>
      <circle cx="22" cy="24" r="2" fill="#5a7255"/>
      <circle cx="28" cy="24" r="2" fill="#5a7255"/>
      <path d="M22 29 Q25 32 28 29" stroke="#5a7255" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function KawaiiApple({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M38 12 C38 12 32 4 38 2 C44 0 42 8 42 12" fill="#5a9a5a"/>
      <path d="M42 10 C42 10 50 6 52 12 C54 18 46 16 42 10" fill="#6aaa6a"/>
      <path d="M15 30 Q12 55 20 70 Q28 82 40 82 Q52 82 60 70 Q68 55 65 30 Q58 20 50 18 Q44 16 40 18 Q36 16 30 18 Q22 20 15 30Z" fill="#6daa6d"/>
      <path d="M15 30 Q12 55 20 70 Q28 82 40 82 Q52 82 60 70 Q68 55 65 30 Q58 20 50 18 Q44 16 40 18 Q36 16 30 18 Q22 20 15 30Z" fill="#8aca8a" opacity="0.4"/>
      {/* cara */}
      <circle cx="33" cy="52" r="2.5" fill="#4a7a4a"/>
      <circle cx="47" cy="52" r="2.5" fill="#4a7a4a"/>
      <path d="M34 59 Q40 63 46 59" stroke="#4a7a4a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="28" cy="56" r="4" fill="#f0a0b8" opacity="0.4"/>
      <circle cx="52" cy="56" r="4" fill="#f0a0b8" opacity="0.4"/>
    </svg>
  );
}

/* Fondo kawaii decorativo */
function KawaiiBackground() {
  const items = [
    { comp: <KawaiiAvocado className="w-full h-full"/>, top:"5%",   left:"2%",   w:70,  anim:"food-d1", dur:"6s",   del:"0s"   },
    { comp: <KawaiiLime    className="w-full h-full"/>, top:"15%",  right:"3%",  w:60,  anim:"food-d2", dur:"5s",   del:"1s"   },
    { comp: <KawaiiLeaf    className="w-full h-full"/>, top:"40%",  left:"1%",   w:50,  anim:"food-d3", dur:"7s",   del:"0.5s" },
    { comp: <KawaiiCarrot  className="w-full h-full"/>, top:"60%",  right:"2%",  w:55,  anim:"food-d1", dur:"8s",   del:"1.5s" },
    { comp: <KawaiiStar    className="w-full h-full"/>, top:"75%",  left:"3%",   w:45,  anim:"food-d2", dur:"5.5s", del:"2s"   },
    { comp: <KawaiiApple   className="w-full h-full"/>, top:"80%",  right:"3%",  w:65,  anim:"food-d3", dur:"6.5s", del:"0.8s" },
    { comp: <KawaiiLime    className="w-full h-full"/>, top:"30%",  right:"1%",  w:40,  anim:"food-d1", dur:"4.5s", del:"3s"   },
    { comp: <KawaiiLeaf    className="w-full h-full"/>, top:"55%",  left:"2%",   w:38,  anim:"food-d2", dur:"6s",   del:"1.2s" },
  ] as const;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{zIndex:0}}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`absolute ${item.anim} opacity-[0.12]`}
          style={{
            top: item.top,
            ...("left" in item ? { left: item.left } : { right: item.right }),
            width: item.w,
            height: item.w,
            ["--fdur" as string]: item.dur,
            ["--fdel" as string]: item.del,
          }}
        >
          {item.comp}
        </div>
      ))}
    </div>
  );
}

/* ---- ICONOS ---- */
const IcoClock   = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoCalendarWhite = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoWarning = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoPeople  = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoCalendar= () => <svg className="w-4 h-4 text-[var(--texto-suave)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoTriangle= () => <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

type Cita = {
  id: number;
  created_at: string;
  nombre: string;
  correo: string;
  tipo_cita: string;
  fecha_preferida: string;
  horario_preferido: string;
  estado: string;
};

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  activo: boolean;
  imagen_url?: string | null;
};

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    citasPendientes: 0, citasConfirmadas: 0, citasTotal: 0,
    productosActivos: 0, stockBajoCount: 0, pacientes: 0,
  });
  const [citasRecientes, setCitasRecientes] = useState<Cita[]>([]);
  const [productosAlerta, setProductosAlerta] = useState<ProductoAlerta[]>([]);
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [{ data: citasArr }, { data: productosArr }] = await Promise.all([
          supabase.from("reservas_cita").select("*").order("created_at", { ascending: false }),
          supabase.from("productos").select("*").order("created_at", { ascending: false }),
        ]);

        const citas: Cita[] = citasArr || [];
        const productos: Producto[] = productosArr || [];

        const activos = productos.filter((p) => p.activo);
        const stockBajo = activos.filter((p) => p.stock <= UMBRAL_ADVERTENCIA);

        setStats({
          citasTotal: citas.length,
          citasPendientes: citas.filter((c) => c.estado === "pendiente").length,
          citasConfirmadas: citas.filter((c) => c.estado === "confirmada").length,
          productosActivos: activos.length,
          stockBajoCount: stockBajo.length,
          pacientes: new Set(citas.map((c) => c.correo).filter(Boolean)).size,
        });

        setCitasRecientes(citas.slice(0, 5));
        setProductosAlerta(stockBajo);
        setProductosDestacados(activos.slice(0, 5));
      } catch {
        // error silencioso
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [supabase]);

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[var(--texto-suave)] animate-pulse">Cargando dashboard...</p>
      </div>
    );
  }

  const hoy = new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="relative">
      <KawaiiBackground />

      {/* ===== ENCABEZADO ===== */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[var(--texto-principal)]">
            ¡Hola, <span className="text-[var(--primrose)]">María Luisa!</span>
          </h1>
          <p className="font-nunito text-base text-[var(--texto-suave)] mt-1">Aquí tienes el resumen de tus citas y tu catálogo.</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-[var(--borde-verde)] shadow-sm self-start">
          <IcoCalendar />
          <span className="font-nunito text-sm text-[var(--texto-suave)] capitalize">{hoy}</span>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<IcoClock />} iconBg="bg-[var(--primrose)]" bg="bg-[var(--pinktone-soft)]"
          titulo="Citas pendientes"
          valor={stats.citasPendientes.toString()}
          badge={stats.citasPendientes > 0 ? "Por responder" : "Todo al día"}
          badgeColor={stats.citasPendientes > 0 ? "red" : "green"}
          sub=""
        />
        <StatCard
          icon={<IcoCalendarWhite />} iconBg="bg-[var(--lime)]" bg="bg-[var(--lime-soft)]"
          titulo="Citas confirmadas"
          valor={stats.citasConfirmadas.toString()}
          badge={`${stats.citasTotal} en total`} badgeColor="green"
          sub=""
        />
        <StatCard
          icon={<IcoWarning />} iconBg="bg-amber-500" bg="bg-amber-50"
          titulo="Productos stock bajo"
          valor={stats.stockBajoCount.toString()}
          badge={stats.stockBajoCount > 0 ? "Atención requerida" : "Stock sano"}
          badgeColor={stats.stockBajoCount > 0 ? "red" : "green"}
          sub={`de ${stats.productosActivos} activos`}
        />
        <StatCard
          icon={<IcoPeople />} iconBg="bg-purple-500" bg="bg-purple-50"
          titulo="Pacientes atendidos"
          valor={stats.pacientes.toString()}
          badge="Han solicitado cita" badgeColor="green"
          sub=""
        />
      </div>

      {/* ===== ALERTA STOCK ===== */}
      {productosAlerta.length > 0 && <AlertaStock productos={productosAlerta} />}

      {/* ===== CITAS RECIENTES ===== */}
      <div className="bg-white rounded-2xl border border-[var(--borde-verde)] p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-[var(--texto-principal)]">Citas recientes</h2>
          <Link href="/admin/citas" className="font-nunito text-sm text-[var(--lime)] hover:underline font-medium">
            Ver todas
          </Link>
        </div>
        {citasRecientes.length === 0 ? (
          <p className="text-sm text-[var(--texto-suave)] text-center py-8">Aún no hay solicitudes de cita.</p>
        ) : (
          <div className="space-y-3">
            {citasRecientes.map((cita) => (
              <CitaRow key={cita.id} cita={cita} />
            ))}
          </div>
        )}
      </div>

      {/* ===== CATÁLOGO ===== */}
      {productosDestacados.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--borde-verde)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-[var(--texto-principal)]">Tu catálogo</h2>
            <Link href="/admin/productos" className="font-nunito text-sm text-[var(--lime)] hover:underline font-medium">
              Ver todo el catálogo
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {productosDestacados.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 bg-[var(--lime-soft)] rounded-xl p-3 shrink-0 min-w-[180px]">
                <span className="w-7 h-7 rounded-full bg-[var(--lime)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {p.imagen_url ? (
                  <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-white">
                    <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-1" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[var(--texto-tenue)] shrink-0">◇</div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-[var(--texto-principal)] truncate max-w-[100px]">{p.nombre}</p>
                  <p className="font-nunito text-xs text-[var(--texto-suave)]">S/ {p.precio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* ===== STAT CARD ===== */
function StatCard({ icon, iconBg, bg, titulo, valor, badge, badgeColor, sub }: {
  icon: React.ReactNode; iconBg: string; bg: string;
  titulo: string; valor: string; badge: string; badgeColor: "green" | "red"; sub: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-5 border border-white shadow-sm hover:-translate-y-0.5 transition`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shadow-md`}>
          {icon}
        </div>
      </div>
      <p className="font-nunito text-xs text-[var(--texto-suave)] mb-1 uppercase tracking-widest">{titulo}</p>
      <p className="font-playfair text-2xl font-bold text-[var(--texto-principal)] mb-1">{valor}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`font-nunito text-xs font-semibold ${badgeColor === "green" ? "text-green-600" : "text-red-600"}`}>
          {badge}
        </span>
        {sub && <span className="font-nunito text-xs text-[var(--texto-tenue)]">{sub}</span>}
      </div>
    </div>
  );
}

/* ===== FILA CITA ===== */
function CitaRow({ cita }: { cita: Cita }) {
  const fecha = new Date(cita.created_at).toLocaleString("es-PE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const statusColor: Record<string, string> = {
    pendiente:  "bg-orange-50 text-orange-700 border-orange-200",
    confirmada: "bg-green-50 text-green-700 border-green-200",
    atendida:   "bg-blue-50 text-blue-700 border-blue-200",
    cancelada:  "bg-neutral-50 text-neutral-500 border-neutral-200",
  };

  const statusLabel: Record<string, string> = {
    pendiente: "Pendiente", confirmada: "Confirmada",
    atendida: "Atendida", cancelada: "Cancelada",
  };

  const tipoLabel: Record<string, string> = {
    primera_consulta: "Primera consulta", seguimiento: "Seguimiento", control: "Control",
  };

  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--borde-suave)] last:border-0">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[var(--pinktone-soft)] text-[var(--primrose)]">
        <IcoCalendar />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--texto-principal)] truncate">
          {tipoLabel[cita.tipo_cita] ?? cita.tipo_cita}
        </p>
        <p className="font-nunito text-xs text-[var(--texto-suave)] truncate">{cita.nombre || "—"}</p>
      </div>
      <span className={`font-nunito text-xs px-2.5 py-1 rounded-full border font-medium whitespace-nowrap ${statusColor[cita.estado] || "bg-neutral-50 text-neutral-500 border-neutral-200"}`}>
        {statusLabel[cita.estado] || cita.estado}
      </span>
      <p className="font-nunito text-xs text-[var(--texto-tenue)] whitespace-nowrap hidden md:block">{fecha}</p>
    </div>
  );
}

/* ===== ALERTA STOCK ===== */
function AlertaStock({ productos }: { productos: ProductoAlerta[] }) {
  const agotados    = productos.filter((p) => p.stock === 0);
  const criticos    = productos.filter((p) => p.stock > 0 && p.stock <= UMBRAL_CRITICO);
  const advertencia = productos.filter((p) => p.stock > UMBRAL_CRITICO);

  return (
    <div className="mb-8 bg-amber-50 border border-amber-300 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
          <IcoTriangle />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-amber-800 text-base">Alerta de inventario</p>
          <p className="font-nunito text-sm text-amber-700 mt-0.5">
            Hay {productos.length} producto{productos.length !== 1 ? "s" : ""} que requiere{productos.length !== 1 ? "n" : ""} tu atención.
          </p>
        </div>
        <Link href="/admin/productos" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
          Gestionar stock
        </Link>
      </div>
      <div className="space-y-2">
        {[...agotados, ...criticos, ...advertencia].map((p) => (
          <div key={p.id} className="flex items-center gap-3 bg-white border border-amber-200 rounded-xl px-4 py-2.5">
            {p.imagen_url ? (
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-0.5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-amber-50 shrink-0" />
            )}
            <p className="font-semibold text-sm text-amber-900 flex-1 truncate">{p.nombre}</p>
            <p className="font-nunito text-xs text-amber-700">Quedan {p.stock} unidades</p>
            <Link href="/admin/productos" className="font-nunito text-xs text-amber-600 hover:underline font-semibold whitespace-nowrap">
              Stock bajo &rsaquo;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

