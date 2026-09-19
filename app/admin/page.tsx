"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Cita = {
  id: string;
  created_at: string;
  nombre: string;
  correo: string;
  tipo_cita: string;
  fecha_preferida: string;
  horario_preferido: string;
  estado: string;
};

/* ---- ICONOS ---- */
const IcoClock = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IcoCalendarWhite = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoDoc = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoPeople = () => <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoCalendar = () => <svg className="w-4 h-4 text-[var(--texto-suave)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    citasPendientes: 0, citasConfirmadas: 0, citasTotal: 0,
    constanciasPendientes: 0, pacientes: 0,
  });
  const [citasRecientes, setCitasRecientes] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [{ data: citasArr }, { data: constArr }] = await Promise.all([
          supabase.from("reservas_cita").select("*").order("created_at", { ascending: false }),
          supabase.from("solicitudes_constancia").select("id,estado"),
        ]);

        const citas: Cita[] = citasArr || [];
        const constancias: { estado: string }[] = constArr || [];

        setStats({
          citasTotal: citas.length,
          citasPendientes: citas.filter((c) => c.estado === "pendiente").length,
          citasConfirmadas: citas.filter((c) => c.estado === "confirmada").length,
          constanciasPendientes: constancias.filter((c) => c.estado !== "pagado_validado" && c.estado !== "rechazado").length,
          pacientes: new Set(citas.map((c) => c.correo).filter(Boolean)).size,
        });

        setCitasRecientes(citas.slice(0, 6));
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
      {/* ===== ENCABEZADO ===== */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[var(--texto-principal)]">
            ¡Hola, <span className="text-[var(--primrose)]">María Luisa!</span>
          </h1>
          <p className="font-nunito text-base text-[var(--texto-suave)] mt-1">Aquí tienes el resumen de tus citas y constancias.</p>
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
        />
        <StatCard
          icon={<IcoCalendarWhite />} iconBg="bg-[var(--lime)]" bg="bg-[var(--lime-soft)]"
          titulo="Citas confirmadas"
          valor={stats.citasConfirmadas.toString()}
          badge={`${stats.citasTotal} en total`} badgeColor="green"
        />
        <StatCard
          icon={<IcoDoc />} iconBg="bg-amber-500" bg="bg-amber-50"
          titulo="Constancias por validar"
          valor={stats.constanciasPendientes.toString()}
          badge={stats.constanciasPendientes > 0 ? "Atención requerida" : "Al día"}
          badgeColor={stats.constanciasPendientes > 0 ? "red" : "green"}
        />
        <StatCard
          icon={<IcoPeople />} iconBg="bg-purple-500" bg="bg-purple-50"
          titulo="Pacientes atendidos"
          valor={stats.pacientes.toString()}
          badge="Han solicitado cita" badgeColor="green"
        />
      </div>

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

      {/* ===== ACCESO CONSTANCIAS ===== */}
      <div className="bg-white rounded-2xl border border-[var(--borde-verde)] p-6 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-lg text-[var(--texto-principal)]">Constancias nutricionales</h2>
          <p className="text-sm text-[var(--texto-suave)] mt-1">Revisa y valida las solicitudes generadas desde la calculadora de IMC.</p>
        </div>
        <Link href="/admin/constancias" className="shrink-0 bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
          Ver constancias
        </Link>
      </div>
    </div>
  );
}

/* ===== STAT CARD ===== */
function StatCard({ icon, iconBg, bg, titulo, valor, badge, badgeColor }: {
  icon: React.ReactNode; iconBg: string; bg: string;
  titulo: string; valor: string; badge: string; badgeColor: "green" | "red";
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
