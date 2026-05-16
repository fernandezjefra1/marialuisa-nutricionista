"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type ProductoAlerta = { id: number; nombre: string; stock: number; };

const UMBRAL_CRITICO = 5;
const UMBRAL_ADVERTENCIA = 10;

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    librosTotal: 0,
    librosPendientes: 0,
    librosVendidos: 0,
    pedidosTotal: 0,
    pedidosPendientes: 0,
    pedidosVentas: 0,
    solicitudesTotal: 0,
    solicitudesNuevas: 0,
    ingresoLibros: 0,
    ingresoProductos: 0,
    ingresoTotalMes: 0,
  });
  const [cargando, setCargando] = useState(true);
  const [actividadReciente, setActividadReciente] = useState<any[]>([]);
  const [productosAlerta, setProductosAlerta] = useState<ProductoAlerta[]>([]);

  useEffect(() => {
    async function cargar() {
      // Inicio del mes actual
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      // Compras de libro
      const { data: libros } = await supabase
        .from("compras")
        .select("precio, estado, created_at");

      // Pedidos del carrito
      const { data: pedidos } = await supabase
        .from("pedidos")
        .select("total, estado, created_at");

      // Solicitudes empresariales
      const { data: solicitudes } = await supabase
        .from("solicitudes_empresariales")
        .select("estado, created_at");

      const librosArr = libros || [];
      const pedidosArr = pedidos || [];
      const solicitudesArr = solicitudes || [];

      // Stats libros
      const librosVendidos = librosArr.filter((c) => c.estado === "completado" || c.estado === "pagado" || c.estado === "enviado");
      const ingresoLibrosMes = librosVendidos
        .filter((c) => new Date(c.created_at) >= inicioMes)
        .reduce((sum, c) => sum + Number(c.precio), 0);

      // Stats pedidos
      const pedidosVendidos = pedidosArr.filter((p) => p.estado === "completado" || p.estado === "pagado" || p.estado === "enviado");
      const ingresoProductosMes = pedidosVendidos
        .filter((p) => new Date(p.created_at) >= inicioMes)
        .reduce((sum, p) => sum + Number(p.total), 0);

      setStats({
        librosTotal: librosArr.length,
        librosPendientes: librosArr.filter((c) => c.estado === "pendiente").length,
        librosVendidos: librosVendidos.length,
        pedidosTotal: pedidosArr.length,
        pedidosPendientes: pedidosArr.filter((p) => p.estado === "pendiente").length,
        pedidosVentas: pedidosVendidos.length,
        solicitudesTotal: solicitudesArr.length,
        solicitudesNuevas: solicitudesArr.filter((s) => s.estado === "nuevo").length,
        ingresoLibros: ingresoLibrosMes,
        ingresoProductos: ingresoProductosMes,
        ingresoTotalMes: ingresoLibrosMes + ingresoProductosMes,
      });

      // Actividad reciente: mezclar los 3 tipos
      const recientes = [
        ...librosArr.slice(0, 5).map((c: any) => ({ ...c, tipo: "libro", fecha: c.created_at })),
        ...pedidosArr.slice(0, 5).map((p: any) => ({ ...p, tipo: "pedido", fecha: p.created_at })),
        ...solicitudesArr.slice(0, 5).map((s: any) => ({ ...s, tipo: "solicitud", fecha: s.created_at })),
      ]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 8);

      setActividadReciente(recientes);

      // Productos con stock bajo o agotado
      const { data: stockBajo } = await supabase
        .from("productos")
        .select("id, nombre, stock")
        .eq("activo", true)
        .lte("stock", UMBRAL_ADVERTENCIA)
        .order("stock");
      setProductosAlerta(stockBajo || []);

      setCargando(false);
    }
    cargar();
  }, [supabase]);

  if (cargando) {
    return <p className="text-sm text-[var(--texto-suave)]">Cargando dashboard...</p>;
  }

  const hoy = new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
          Dashboard
        </p>
        <h1 className="text-3xl md:text-4xl font-light text-[var(--texto-principal)]">
          Resumen <span className="font-semibold text-[var(--primrose)]">general.</span>
        </h1>
        <p className="text-sm text-[var(--texto-suave)] capitalize mt-1">{hoy}</p>
      </div>

      {/* Alerta de stock */}
      {productosAlerta.length > 0 && (
        <AlertaStock productos={productosAlerta} />
      )}

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          titulo="Ingresos del mes"
          valor={`S/ ${stats.ingresoTotalMes.toFixed(2)}`}
          subtitulo={`Libros: S/ ${stats.ingresoLibros.toFixed(0)} · Productos: S/ ${stats.ingresoProductos.toFixed(0)}`}
          color="primrose"
        />
        <StatCard
          titulo="Pedidos pendientes"
          valor={(stats.librosPendientes + stats.pedidosPendientes).toString()}
          subtitulo={`${stats.librosPendientes} libros · ${stats.pedidosPendientes} tienda`}
          color="amber"
          urgente={(stats.librosPendientes + stats.pedidosPendientes) > 0}
        />
        <StatCard
          titulo="Solicitudes nuevas"
          valor={stats.solicitudesNuevas.toString()}
          subtitulo={`${stats.solicitudesTotal} en total`}
          color="lime"
          urgente={stats.solicitudesNuevas > 0}
        />
        <StatCard
          titulo="Ventas totales"
          valor={(stats.librosVendidos + stats.pedidosVentas).toString()}
          subtitulo="Pagadas + enviadas + entregadas"
          color="primrose"
        />
      </div>

      {/* Atajos rápidos */}
      <h2 className="text-lg font-semibold text-[var(--texto-principal)] mb-4">Accesos rápidos</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <AtajoCard
          href="/admin/pedidos-libro"
          icono="📚"
          titulo="Pedidos de libro"
          descripcion={`${stats.librosTotal} pedidos en total · ${stats.librosPendientes} pendientes`}
          color="primrose"
        />
        <AtajoCard
          href="/admin/pedidos-productos"
          icono="🛒"
          titulo="Pedidos de tienda"
          descripcion={`${stats.pedidosTotal} pedidos en total · ${stats.pedidosPendientes} pendientes`}
          color="lime"
        />
        <AtajoCard
          href="/admin/solicitudes"
          icono="🏢"
          titulo="Solicitudes empresas"
          descripcion={`${stats.solicitudesTotal} solicitudes · ${stats.solicitudesNuevas} sin atender`}
          color="primrose"
        />
      </div>

      {/* Actividad reciente */}
      <h2 className="text-lg font-semibold text-[var(--texto-principal)] mb-4">Actividad reciente</h2>
      <div className="bg-white rounded-2xl border border-[var(--borde-rosa)] overflow-hidden">
        {actividadReciente.length === 0 ? (
          <p className="p-8 text-center text-sm text-[var(--texto-suave)]">
            Aún no hay actividad. Cuando los clientes hagan pedidos aparecerán aquí.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--borde-suave)]">
            {actividadReciente.map((item, i) => (
              <li key={i} className="p-4 hover:bg-[var(--pinktone-soft)] transition">
                <ActividadItem item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ titulo, valor, subtitulo, color, urgente }: {
  titulo: string;
  valor: string;
  subtitulo: string;
  color: "primrose" | "lime" | "amber";
  urgente?: boolean;
}) {
  const colorClass = {
    primrose: "bg-[var(--pinktone-soft)] border-[var(--primrose)]",
    lime: "bg-[var(--lime-soft)] border-[var(--lime)]",
    amber: "bg-amber-50 border-amber-400",
  }[color];

  const textColor = {
    primrose: "text-[var(--primrose)]",
    lime: "text-[var(--lime)]",
    amber: "text-amber-700",
  }[color];

  return (
    <div className={`rounded-2xl border-2 p-5 ${colorClass} ${urgente ? "ring-2 ring-amber-300 ring-offset-2" : ""}`}>
      <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${textColor}`}>
        {titulo}
      </p>
      <p className="text-3xl font-semibold text-[var(--texto-principal)] mb-1">{valor}</p>
      <p className="text-xs text-[var(--texto-suave)]">{subtitulo}</p>
    </div>
  );
}

function AtajoCard({ href, icono, titulo, descripcion, color }: {
  href: string;
  icono: string;
  titulo: string;
  descripcion: string;
  color: "primrose" | "lime";
}) {
  const borderColor = color === "primrose" ? "border-[var(--borde-rosa)] hover:border-[var(--primrose)]" : "border-[var(--borde-verde)] hover:border-[var(--lime)]";

  return (
    <Link href={href} className={`block bg-white rounded-2xl border-2 p-5 transition hover:-translate-y-1 hover:shadow-lg ${borderColor}`}>
      <div className="text-3xl mb-3">{icono}</div>
      <p className="font-semibold text-[var(--texto-principal)] mb-1">{titulo}</p>
      <p className="text-xs text-[var(--texto-suave)] leading-relaxed">{descripcion}</p>
    </Link>
  );
}

function ActividadItem({ item }: { item: any }) {
  const fecha = new Date(item.fecha).toLocaleString("es-PE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  let descripcion = "";
  let badge = "";
  let badgeColor = "";

  if (item.tipo === "libro") {
    descripcion = `Pedido de libro · S/ ${item.precio}`;
    badge = "Libro";
    badgeColor = "bg-[var(--pinktone-soft)] text-[var(--primrose)]";
  } else if (item.tipo === "pedido") {
    descripcion = `Pedido de tienda · S/ ${item.total}`;
    badge = "Tienda";
    badgeColor = "bg-[var(--lime-soft)] text-[var(--lime)]";
  } else {
    descripcion = `Solicitud empresarial`;
    badge = "Empresa";
    badgeColor = "bg-blue-50 text-blue-700";
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeColor}`}>
            {badge}
          </span>
          <span className="text-xs text-[var(--texto-suave)]">{fecha}</span>
        </div>
        <p className="text-sm text-[var(--texto-principal)] truncate">{descripcion}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full border font-medium whitespace-nowrap ${
        item.estado === "pendiente" || item.estado === "nuevo"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : item.estado === "completado"
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-neutral-50 text-neutral-600 border-neutral-200"
      }`}>
        {item.estado}
      </span>
    </div>
  );
}

function AlertaStock({ productos }: { productos: ProductoAlerta[] }) {
  const agotados = productos.filter((p) => p.stock === 0);
  const criticos = productos.filter((p) => p.stock > 0 && p.stock <= UMBRAL_CRITICO);
  const advertencia = productos.filter((p) => p.stock > UMBRAL_CRITICO && p.stock <= UMBRAL_ADVERTENCIA);

  return (
    <div className="mb-8 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <p className="font-semibold text-amber-800 text-base">
            Alerta de inventario — {productos.length} producto{productos.length !== 1 ? "s" : ""} requieren atención
          </p>
          <p className="text-sm text-amber-700 mt-0.5">
            Revisa y repone el stock para no quedarte sin existencias.
          </p>
        </div>
        <Link
          href="/admin/productos"
          className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
        >
          Gestionar stock →
        </Link>
      </div>

      <div className="space-y-3">
        {agotados.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-red-700 uppercase tracking-widest mb-2">Sin stock</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {agotados.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  <span className="text-red-500 text-base">🔴</span>
                  <p className="text-sm font-medium text-red-900 truncate">{p.nombre}</p>
                  <span className="ml-auto text-xs text-red-600 font-semibold whitespace-nowrap">0 unidades</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {criticos.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">Stock crítico (≤ {UMBRAL_CRITICO})</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {criticos.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-white border border-amber-200 rounded-xl px-3 py-2">
                  <span className="text-amber-500 text-base">🟡</span>
                  <p className="text-sm font-medium text-amber-900 truncate">{p.nombre}</p>
                  <span className="ml-auto text-xs text-amber-600 font-semibold whitespace-nowrap">{p.stock} und.</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {advertencia.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-widest mb-2">Por agotarse (≤ {UMBRAL_ADVERTENCIA})</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {advertencia.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-white border border-yellow-200 rounded-xl px-3 py-2">
                  <span className="text-yellow-500 text-base">🟠</span>
                  <p className="text-sm font-medium text-yellow-900 truncate">{p.nombre}</p>
                  <span className="ml-auto text-xs text-yellow-600 font-semibold whitespace-nowrap">{p.stock} und.</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}