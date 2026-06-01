"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/use-user";
import { useAdmin } from "@/lib/use-admin";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[var(--texto-principal)]">
      <FloatingSparkles />
      <Navbar />
      <HeroLibro />
      <CarruselImagenes />
      <FilosofiaYServicios />
      <SeccionEnfermedades />
      <SeccionProductos />
      <SeccionEmpresas />
      <AsesoriasProyectos />
      <Trayectoria />
      <Footer />
    </main>
  );
}

/* ---------- ICONOS SVG REUTILIZABLES ---------- */
function IcoHeart({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
}
function IcoEye({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function IcoTarget({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
function IcoPerson({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function IcoChild({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="5" r="3"/><path d="M12 8v5"/><path d="M9 21v-4l3-3 3 3v4"/><path d="M7 13l2-2"/><path d="M17 13l-2-2"/></svg>;
}
function IcoBook({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function IcoBlender({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6L8 21H5L3 6"/><path d="M13 6V3"/><path d="M11 6V3"/></svg>;
}
function IcoBowl({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22C6.5 22 2 17.5 2 12h20c0 5.5-4.5 10-10 10z"/><path d="M2 12h20"/><path d="M7 8l2-4"/><path d="M17 8l-2-4"/><path d="M12 8V4"/></svg>;
}
function IcoChat({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function IcoPin({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IcoDrop({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 7 4 11.5 4 15a8 8 0 0 0 16 0c0-3.5-4-8-8-13z"/></svg>;
}
function IcoScale({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v18"/><path d="M3 7l9-4 9 4"/><path d="M3 7c0 3.3 2.7 6 6 6s6-2.7 6-6"/><path d="M9 13c0 3.3 2.7 6 6 6s6-2.7 6-6"/></svg>;
}
function IcoLeaf({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
}
function IcoBone({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0-2.5 2.5c0 .81.7 1.8 0 2.5l-5 5c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 2.5-2.5c0-.81-.7-1.8 0-2.5l5-5z"/></svg>;
}
function IcoWave({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function IcoStomach({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 3H7a4 4 0 0 0-4 4v1a4 4 0 0 0 4 4h.5"/><path d="M14.5 12H15a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-1"/><path d="M9 3v9"/></svg>;
}

/* ---------- FONDO VEGETAL ANIMADO (ilustraciones SVG coloridas) ---------- */
function FoodBg() {
  type P = { style?: React.CSSProperties; className?: string };

  /* Smoothie copa — esquina superior izquierda */
  const Smoothie = ({ className, style }: P) => (
    <svg className={className} style={style} viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 40 L35 150 Q60 162 85 150 L95 40 Z" fill="#b8dda0"/>
      <path d="M28 60 L36 148 Q60 158 84 148 L92 60 Z" fill="#7dbf6a"/>
      <path d="M25 40 Q60 45 95 40 Q60 35 25 40Z" fill="#a0cfaa"/>
      <rect x="55" y="5" width="10" height="55" rx="5" fill="white" opacity="0.9"/>
      <rect x="55" y="5" width="5" height="55" rx="5" fill="#7dbf6a" opacity="0.6"/>
      <ellipse cx="60" cy="40" rx="35" ry="8" fill="#a8d890" opacity="0.5"/>
      <circle cx="38" cy="90" r="4" fill="#5aaa5a" opacity="0.4"/>
      <circle cx="82" cy="110" r="3" fill="#5aaa5a" opacity="0.4"/>
    </svg>
  );

  /* Aguacate cortado — izquierda medio */
  const Avocado = ({ className, style }: P) => (
    <svg className={className} style={style} viewBox="0 0 130 170" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M65 8 Q22 55 22 105 Q22 155 65 160 Q108 155 108 105 Q108 55 65 8Z" fill="#2d5016"/>
      <path d="M65 22 Q38 65 38 105 Q38 145 65 150 Q92 145 92 105 Q92 65 65 22Z" fill="#c8e096"/>
      <ellipse cx="65" cy="110" rx="20" ry="26" fill="#8B5E3C"/>
      <ellipse cx="65" cy="108" rx="14" ry="18" fill="#a0724a"/>
    </svg>
  );

  /* Kiwi rodaja — esquina superior derecha */
  const Kiwi = ({ className, style }: P) => (
    <svg className={className} style={style} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="72" fill="#5a8a2a"/>
      <circle cx="80" cy="80" r="58" fill="#d4e87a"/>
      <circle cx="80" cy="80" r="14" fill="white"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => {
        const rad = (Math.PI * a) / 180;
        const x2 = 80 + 56 * Math.cos(rad);
        const y2 = 80 + 56 * Math.sin(rad);
        const sx = 80 + 14 * Math.cos(rad);
        const sy = 80 + 14 * Math.sin(rad);
        const ex = 80 + 40 * Math.cos(rad);
        const ey = 80 + 40 * Math.sin(rad);
        return (
          <g key={i}>
            <line x1={sx} y1={sy} x2={x2} y2={y2} stroke="white" strokeWidth="1.2" opacity="0.6"/>
            <ellipse cx={ex} cy={ey} rx="5" ry="9"
              transform={`rotate(${a} ${ex} ${ey})`}
              fill="#2d4a10"/>
          </g>
        );
      })}
    </svg>
  );

  /* Limón rodaja — derecha medio */
  const Lime = ({ className, style }: P) => (
    <svg className={className} style={style} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="56" fill="#8fcc3a"/>
      <circle cx="60" cy="60" r="56" fill="#a8d840"/>
      <circle cx="60" cy="60" r="44" fill="#c8ec60"/>
      <circle cx="60" cy="60" r="10" fill="white" opacity="0.9"/>
      {[0,45,90,135,180,225,270,315].map((a, i) => {
        const rad = (Math.PI * a) / 180;
        return (
          <line key={i}
            x1={60 + 10 * Math.cos(rad)} y1={60 + 10 * Math.sin(rad)}
            x2={60 + 43 * Math.cos(rad)} y2={60 + 43 * Math.sin(rad)}
            stroke="white" strokeWidth="1.5" opacity="0.7"/>
        );
      })}
    </svg>
  );

  /* Uvas — esquina inferior izquierda */
  const Grapes = ({ className, style }: P) => (
    <svg className={className} style={style} viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 40 Q75 18 80 12" stroke="#4a7a2a" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M80 12 Q96 4 100 18 Q85 22 80 12Z" fill="#4a7a2a"/>
      {[
        {x:45,y:110},{x:70,y:100},{x:95,y:110},
        {x:32,y:85}, {x:57,y:75}, {x:82,y:75}, {x:107,y:85},
        {x:45,y:60}, {x:70,y:50}, {x:95,y:60},
                     {x:70,y:130}
      ].map((g,i)=>(
        <g key={i}>
          <circle cx={g.x} cy={g.y} r="18" fill="#6b3d9a"/>
          <circle cx={g.x-5} cy={g.y-5} r="5" fill="white" opacity="0.25"/>
        </g>
      ))}
    </svg>
  );

  /* Brócoli — esquina inferior derecha */
  const Broccoli = ({ className, style }: P) => (
    <svg className={className} style={style} viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="68" y="110" width="24" height="60" rx="10" fill="#3d6e2a"/>
      <rect x="72" y="110" width="8" height="60" rx="6" fill="#4d8a3a" opacity="0.5"/>
      <circle cx="80" cy="80" r="38" fill="#3a8a3a"/>
      <circle cx="48" cy="94" r="28" fill="#3a8a3a"/>
      <circle cx="112" cy="94" r="28" fill="#3a8a3a"/>
      <circle cx="62" cy="58" r="22" fill="#4aaa4a"/>
      <circle cx="98" cy="58" r="22" fill="#4aaa4a"/>
      <circle cx="80" cy="46" r="20" fill="#5aba5a"/>
      <circle cx="48" cy="94" r="14" fill="#4aaa4a"/>
      <circle cx="112" cy="94" r="14" fill="#4aaa4a"/>
    </svg>
  );

  const fd = (dur: string, del: string) => ({"--fdur": dur, "--fdel": del} as React.CSSProperties);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Esquina superior izquierda: smoothie */}
      <Smoothie className="absolute -top-8 -left-14 w-32 md:w-40 opacity-85 food-d2" style={fd("7s","0s")} />
      {/* Esquina superior derecha: kiwi grande */}
      <Kiwi     className="absolute -top-8 -right-14 w-36 md:w-52 opacity-85 food-d1" style={fd("9s","0.5s")} />
      {/* Pequeño kiwi justo debajo en la derecha */}
      <Kiwi     className="absolute top-28 md:top-20 -right-10 w-20 md:w-28 opacity-70 food-d3" style={fd("8s","1.5s")} />
      {/* Limón borde derecho centro */}
      <Lime     className="absolute top-1/2 -translate-y-1/2 -right-10 w-20 md:w-24 opacity-75 food-d2" style={fd("7s","2s")} />
      {/* Aguacate borde izquierdo centro */}
      <Avocado  className="absolute top-1/3 -left-14 w-28 md:w-36 opacity-85 food-d1" style={fd("8s","1.2s")} />
      {/* Uvas esquina inferior izquierda */}
      <Grapes   className="absolute -bottom-6 -left-10 w-28 md:w-40 opacity-80 food-sw" style={fd("9s","0.8s")} />
      {/* Brócoli esquina inferior derecha */}
      <Broccoli className="absolute -bottom-8 -right-10 w-36 md:w-52 opacity-85 food-d3" style={fd("7s","2.5s")} />
    </div>
  );
}

/* ---------- BRILLITOS FLOTANTES ---------- */
function FloatingSparkles() {
  const items = [
    { char: "✦", top: "8%",  left: "2%",  dur: "3.5s", delay: "0s"   },
    { char: "♡", top: "18%", left: "95%", dur: "4.5s", delay: "0.8s" },
    { char: "✿", top: "38%", left: "1%",  dur: "5s",   delay: "1.5s" },
    { char: "✦", top: "52%", left: "97%", dur: "4s",   delay: "0.3s" },
    { char: "♡", top: "68%", left: "3%",  dur: "3.8s", delay: "2s"   },
    { char: "✿", top: "82%", left: "93%", dur: "4.2s", delay: "1.2s" },
    { char: "✦", top: "28%", left: "98%", dur: "5.5s", delay: "2.5s" },
    { char: "♡", top: "72%", left: "1%",  dur: "4.8s", delay: "0.6s" },
    { char: "✦", top: "5%",  left: "50%", dur: "3.5s", delay: "1.8s" },
    { char: "✿", top: "92%", left: "48%", dur: "4s",   delay: "3s"   },
    { char: "♡", top: "45%", left: "99%", dur: "3.8s", delay: "1s"   },
    { char: "✦", top: "60%", left: "0%",  dur: "5s",   delay: "2.2s" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className="absolute text-[var(--lime)] sparkle-item"
          style={{
            top: item.top,
            left: item.left,
            fontSize: i % 3 === 0 ? "18px" : i % 3 === 1 ? "14px" : "20px",
            ["--dur" as string]: item.dur,
            ["--delay" as string]: item.delay,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}

/* ---------- NAVBAR ---------- */
function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#f5f0e8]/95 backdrop-blur-sm border-b border-[var(--borde-verde)]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 font-playfair font-bold tracking-tight text-[var(--texto-principal)] text-base md:text-lg">
          <Image src="/images/iconoNutricion.png" alt="Logo" width={80} height={80} className="object-contain drop-shadow-sm w-14 h-14 sm:w-20 sm:h-20" />
          <span className="truncate"><span className="hidden sm:inline">María Luisa </span><span className="text-[var(--primrose)]">Nutricionista</span></span>
        </Link>

        {/* Menú desktop */}
        <ul className="hidden md:flex gap-2 text-sm font-medium">
          <li><a href="#libro"    className="px-4 py-2 rounded-full bg-[var(--primrose)] text-white hover:bg-[var(--primrose-hover)] transition-all duration-300">Libro</a></li>
          <li><Link href="/productos" className="px-4 py-2 rounded-full bg-[var(--primrose)] text-white hover:bg-[var(--primrose-hover)] transition-all duration-300">Tienda</Link></li>
          <li><a href="#sobre-mi" className="px-4 py-2 rounded-full bg-[var(--primrose)] text-white hover:bg-[var(--primrose-hover)] transition-all duration-300">Sobre mí</a></li>
          <li><a href="#taller"   className="px-4 py-2 rounded-full bg-[var(--primrose)] text-white hover:bg-[var(--primrose-hover)] transition-all duration-300">Talleres</a></li>
          <li><Link href="/empresas"  className="px-4 py-2 rounded-full bg-[var(--primrose)] text-white hover:bg-[var(--primrose-hover)] transition-all duration-300">Empresas</Link></li>
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <MenuUsuario />

          {/* Botón hamburguesa - solo en mobile */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden w-10 h-10 rounded-full hover:bg-[var(--pinktone-soft)] flex items-center justify-center transition"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6 text-[var(--texto-principal)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menú mobile desplegable */}
      {menuAbierto && (
        <div className="md:hidden border-t border-[var(--borde-verde)] bg-[var(--verde-1)]">
          <ul className="px-6 py-4 space-y-1">
            <li>
              <a
                href="#libro"
                onClick={() => setMenuAbierto(false)}
                className="block py-3 px-4 rounded-lg text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)] transition font-medium"
              >
                Libro
              </a>
            </li>
            <li>
              <Link
                href="/productos"
                onClick={() => setMenuAbierto(false)}
                className="block py-3 px-4 rounded-lg text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)] transition font-medium"
              >
                Tienda
              </Link>
            </li>
            <li>
              <a
                href="#sobre-mi"
                onClick={() => setMenuAbierto(false)}
                className="block py-3 px-4 rounded-lg text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)] transition font-medium"
              >
                Sobre mí
              </a>
            </li>
            <li>
              <a
                href="#taller"
                onClick={() => setMenuAbierto(false)}
                className="block py-3 px-4 rounded-lg text-[var(--texto-principal)] hover:bg-[var(--lime-soft)] transition font-medium"
              >
                Talleres
              </a>
            </li>
            <li>
              <Link
                href="/empresas"
                onClick={() => setMenuAbierto(false)}
                className="block py-3 px-4 rounded-lg text-[var(--texto-principal)] hover:bg-[var(--lime-soft)] transition font-medium"
              >
                Empresas
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

/* ---------- MENÚ DEL USUARIO ---------- */
function MenuUsuario() {
  const { user, nombre, signOut, loading } = useUser();
  const [abierto, setAbierto] = useState(false);
  const { esAdmin } = useAdmin();

  if (loading) {
    return <div className="w-24 h-9" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden sm:inline-block text-sm px-4 py-2 rounded-full bg-[var(--texto-principal)] text-white hover:bg-[var(--lime-hover)] transition-all duration-300"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/login?redirect=/reservar-cita"
          className="text-xs sm:text-sm bg-[var(--texto-principal)] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-[var(--lime-hover)] transition-all duration-300 shadow-md shadow-green-200 whitespace-nowrap"
        >
          <span className="sm:hidden">Cita</span>
          <span className="hidden sm:inline">Reservar cita</span>
        </Link>
      </div>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const iniciales = nombre
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-3 hover:bg-[var(--pinktone-soft)] rounded-full pl-1 pr-3 py-1 transition"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={nombre}
            className="w-8 h-8 rounded-full object-cover border-2 border-[var(--pinktone)]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--primrose)] text-white text-xs font-semibold flex items-center justify-center">
            {iniciales}
          </div>
        )}
        <span className="text-sm font-medium hidden sm:inline text-[var(--texto-principal)]">{nombre.split(" ")[0]}</span>
        <svg
          className={`w-3.5 h-3.5 text-[var(--texto-tenue)] transition-transform ${abierto ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setAbierto(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-[var(--borde-rosa)] rounded-2xl shadow-xl shadow-pink-100 z-50 overflow-hidden">
            <div className="p-4 border-b border-[var(--borde-suave)] bg-[var(--pinktone-soft)]">
              <p className="text-sm font-semibold truncate text-[var(--texto-principal)]">{nombre}</p>
              <p className="text-xs text-[var(--texto-suave)] truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <Link
                href="/perfil"
                onClick={() => setAbierto(false)}
                className="block px-4 py-2.5 text-sm text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)] transition"
              >
                Mi perfil
              </Link>
              <Link
                href="/perfil?tab=compras"
                onClick={() => setAbierto(false)}
                className="block px-4 py-2.5 text-sm text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)] transition"
              >
                Mis compras
              </Link>
              <Link
                href="/perfil?tab=fidelizacion"
                onClick={() => setAbierto(false)}
                className="block px-4 py-2.5 text-sm text-[var(--texto-principal)] hover:bg-[var(--pinktone-soft)] transition"
              >
                Programa de fidelización
              </Link>

              {esAdmin && (
                <>
                  <div className="border-t border-[var(--borde-suave)] my-1" />
                  <Link
                    href="/admin"
                    onClick={() => setAbierto(false)}
                    className="block px-4 py-2.5 text-sm font-semibold text-[var(--primrose)] hover:bg-[var(--pinktone-soft)] transition"
                  >
                    Panel administrador
                  </Link>
                </>
              )}
            </div>

            <div className="border-t border-[var(--borde-suave)] py-1">
              <button
                onClick={async () => {
                  await signOut();
                  setAbierto(false);
                  window.location.href = "/";
                }}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- HERO: LIBRO (izq) + TALLER (der) ---------- */
function HeroLibro() {
  return (
    <section id="libro" className="relative overflow-hidden bg-[#f5f0e8]">
      <FoodBg />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 md:py-20">

        {/* Cabecera centrada */}
        <div className="text-center mb-10">
          <p className="font-playfair text-xl md:text-2xl text-[var(--texto-principal)] font-semibold italic leading-snug mb-1">
            &ldquo;Vive la magia de la comida dietética&rdquo;
          </p>
          <p className="text-sm text-[var(--texto-suave)]">
            María Luisa Nutricionista &nbsp;·&nbsp; <span className="font-medium text-[var(--texto-principal)]">Universidad de San Marcos</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── IZQUIERDA: Libro ── */}
          <div className="flex flex-col items-center">
            <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold flex items-center gap-2 self-start">
              <IcoBook cls="w-4 h-4" /> Nuevo lanzamiento
            </p>

            {/* Portada */}
            <div className="relative w-full max-w-sm mx-auto mb-6">
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--pinktone)] to-[var(--lime-soft)] rounded-2xl rotate-3" />
              <div className="relative aspect-[3/4] rounded-2xl shadow-2xl shadow-pink-200 overflow-hidden border-4 border-white">
                <Image
                  src="/images/libro-portada.jpg"
                  alt="Libro Nutrición del Bebé - Lic. María Luisa"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl font-light leading-tight tracking-tight mb-3 text-[var(--texto-principal)] text-center">
              Nutrición <span className="font-semibold shimmer-rose">del Bebé.</span>
            </h1>

            <p className="font-nunito text-sm text-[var(--texto-suave)] leading-relaxed mb-5 text-center max-w-sm">
              Guía de nutrición infantil <span className="text-[var(--lime)] font-semibold">preventiva</span> desde los 6 meses hasta el año de vida.
              Recientemente presentada en el Colegio de Nutricionistas del Perú.
            </p>

            {/* Precios */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative bg-[var(--lime-soft)] border-2 border-[var(--lime)] rounded-2xl px-4 py-2.5 flex flex-col items-start halo-animado overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full" style={{animation:"shimmer-slide 2.5s ease-in-out infinite"}}/>
                <span className="text-xs uppercase tracking-widest text-[var(--lime)] font-bold mb-0.5 relative z-10">Digital</span>
                <div className="flex items-baseline gap-1.5 relative z-10">
                  <span className="text-3xl font-bold text-[var(--texto-principal)]">S/ 10</span>
                  <span className="text-xs bg-[var(--primrose)] text-white px-1.5 py-0.5 rounded-full font-bold bow-animate">¡Oferta!</span>
                </div>
              </div>
              <div className="bg-white border-2 border-[var(--borde-verde)] rounded-2xl px-4 py-2.5 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest text-[var(--texto-tenue)] font-semibold mb-0.5">Físico</span>
                <span className="text-3xl font-semibold text-[var(--texto-principal)]">S/ 20</span>
              </div>
            </div>

            <Link
              href="/comprar-libro"
              className="btn-coquette bg-[var(--primrose)] text-white px-6 py-3 rounded-full hover:bg-[var(--primrose-hover)] transition font-medium shadow-lg shadow-pink-200 w-full max-w-sm text-center"
            >
              Adquirir el libro
            </Link>
          </div>

          {/* ── DERECHA: Taller ── */}
          <div id="taller" className="flex flex-col items-center">
            <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-4 font-semibold flex items-center gap-2 self-start">
              <IcoBlender cls="w-4 h-4" /> Próximo taller
            </p>

            {/* Imagen */}
            <div className="relative w-full max-w-sm mx-auto mb-6">
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--lime-soft)] to-[var(--verde-fuerte)]/30 rounded-2xl -rotate-3" />
              <div className="relative aspect-[3/4] rounded-2xl shadow-2xl shadow-green-200 overflow-hidden border-4 border-white">
                <Image src="/images/taller-dietetica.jpeg" alt="Taller de Comida Dietética" fill className="object-cover object-top"/>
              </div>
            </div>

            <h2 className="font-playfair text-3xl sm:text-4xl font-bold leading-tight mb-3 text-[var(--texto-principal)] text-center">
              Taller de <span className="text-[var(--lime)]">Comida Dietética.</span>
            </h2>

            <p className="font-nunito text-sm text-[var(--texto-suave)] leading-relaxed mb-5 text-center max-w-sm">
              Aprende a cocinar rico y saludable. Un taller práctico donde descubrirás
              comidas fáciles, saludables y saciadoras que transformarán tu día a día.
            </p>

            {/* Precios */}
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-[var(--verde-fuerte)] rounded-2xl px-4 py-2.5 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-0.5">Presencial</span>
                <span className="text-3xl font-bold text-white">S/ 80</span>
              </div>
              <div className="bg-[var(--verde-fuerte)]/80 border-2 border-[var(--borde-verde)] rounded-2xl px-4 py-2.5 flex flex-col items-start">
                <span className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-0.5">Virtual</span>
                <span className="text-3xl font-bold text-white">S/ 40</span>
              </div>
            </div>

            {/* Beneficios */}
            <ul className="space-y-2 mb-5 w-full max-w-sm">
              {["Degustación incluida","Materiales: taper, cubiertos, jabón y toalla","Modalidad presencial y virtual"].map((item,i)=>(
                <li key={i} className="flex items-center gap-2 font-nunito text-sm text-[var(--texto-suave)]">
                  <span className="w-5 h-5 rounded-full bg-[var(--lime-soft)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[var(--lime)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link href="/reservar-taller"
              className="btn-coquette bg-[var(--verde-fuerte)] text-white px-6 py-3 rounded-full hover:opacity-90 transition font-medium shadow-lg shadow-green-200 w-full max-w-sm text-center">
              Reservar cupo ahora
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------- TRAYECTORIA: BENTO ANIMADO ---------- */
function CarruselImagenes() {
  type Foto = { src: string; titulo: string; desc: string; fit: "cover" | "contain" };

  const slides: Foto[] = [
    { src: "/images/conferencia-1.jpeg",      titulo: "Conferencia en el Colegio de Nutricionistas", desc: "Presentación oficial del libro 'Nutrición del Bebé' ante colegas del sector.",                                     fit: "cover"   },
    { src: "/images/conferencia-grupo.jpeg",   titulo: "Compartiendo conocimiento",                   desc: "Profesionales y asistentes recibiendo el libro durante la conferencia.",                                           fit: "cover"   },
    { src: "/images/ExperienciaLaboral.jpeg",  titulo: "Lonchera Saludable",                          desc: "Guía práctica para preparar loncheras nutritivas y balanceadas para tus hijos.",                                   fit: "contain" },
    { src: "/images/CitasRealizadas.jpeg",     titulo: "Consultas Nutricionales",                     desc: "Sesiones personalizadas donde evaluamos tus hábitos alimenticios y creamos un plan adaptado.",                    fit: "cover"   },
    { src: "/images/ReunionConEscolares.jpeg", titulo: "Talleres con Escolares",                      desc: "Actividades educativas para enseñar a los niños la importancia de una alimentación saludable.",                   fit: "cover"   },
  ];

  const total = slides.length;
  const [destacado, setDestacado] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setDestacado((d) => (d + 1) % total), 4500);
    return () => clearInterval(t);
  }, [total]);

  /*
   * Bento layout: 1 grande (izquierda) + 4 pequeñas (2×2 derecha).
   * Cada slot tiene posición en % dentro del contenedor.
   * Cuando cambia `destacado`, cada imagen vuela suavemente a su nuevo slot.
   */
  const slots = [
    { top: 0,   left: 0,    w: 57,   h: 100  }, // slot 0 → DESTACADA (grande)
    { top: 0,   left: 58.5, w: 19.5, h: 48.5 }, // slot 1 → pequeña arriba-izq
    { top: 0,   left: 79,   w: 21,   h: 48.5 }, // slot 2 → pequeña arriba-der
    { top: 51.5,left: 58.5, w: 19.5, h: 48.5 }, // slot 3 → pequeña abajo-izq
    { top: 51.5,left: 79,   w: 21,   h: 48.5 }, // slot 4 → pequeña abajo-der
  ];

  const burbujas = [
    { w:70,  top:"6%",  left:"0%",  op:0.10, dur:"7s", del:"0s"   },
    { w:35,  top:"28%", left:"4%",  op:0.08, dur:"5s", del:"1.2s" },
    { w:110, top:"62%", left:"0%",  op:0.08, dur:"9s", del:"2s"   },
    { w:45,  top:"82%", left:"5%",  op:0.11, dur:"6s", del:"0.6s" },
    { w:28,  top:"12%", left:"93%", op:0.10, dur:"5s", del:"3s"   },
    { w:90,  top:"44%", left:"95%", op:0.08, dur:"9s", del:"1s"   },
    { w:55,  top:"72%", left:"91%", op:0.10, dur:"6s", del:"2.5s" },
    { w:40,  top:"90%", left:"96%", op:0.08, dur:"7s", del:"0.4s" },
  ];

  /* SVG de cohete pequeño reutilizable */
  const RocketSvg = ({ size = 28, color = "white" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 7 7 7 13c0 2.5 1.5 4.5 5 6 3.5-1.5 5-3.5 5-6 0-6-5-11-5-11z" fill={color} opacity="0.9"/>
      <path d="M10 14c0 0-3 1-3 4l2-1 1 2c0-2 2-3 2-5" fill={color} opacity="0.7"/>
      <path d="M14 14c0 0 3 1 3 4l-2-1-1 2c0-2-2-3-2-5" fill={color} opacity="0.7"/>
      <circle cx="12" cy="10" r="2.5" fill={color} opacity="0.5"/>
      <path d="M10 18c0 2 .5 3 2 4 1.5-1 2-2 2-4" fill={color} opacity="0.6"/>
    </svg>
  );

  const cohetes: { top: string; left: string; size: number; cls: string; dur: string; del: string; color: string }[] = [
    { top:"80%", left:"3%",   size:22, cls:"rocket-up",   dur:"5.5s", del:"0s",    color:"rgba(255,255,255,0.7)" },
    { top:"70%", left:"15%",  size:16, cls:"rocket-fast",  dur:"3.8s", del:"1.4s",  color:"rgba(255,255,255,0.5)" },
    { top:"85%", left:"30%",  size:26, cls:"rocket-up",   dur:"6.2s", del:"2.8s",  color:"rgba(200,240,180,0.7)" },
    { top:"75%", left:"52%",  size:18, cls:"rocket-fast",  dur:"4s",   del:"0.6s",  color:"rgba(255,255,255,0.5)" },
    { top:"82%", left:"68%",  size:24, cls:"rocket-up",   dur:"5s",   del:"3.5s",  color:"rgba(255,255,255,0.65)"},
    { top:"78%", left:"83%",  size:20, cls:"rocket-fast",  dur:"3.5s", del:"1.8s",  color:"rgba(200,240,180,0.6)" },
    { top:"10%", left:"8%",   size:18, cls:"rocket-down", dur:"6s",   del:"0.9s",  color:"rgba(255,255,255,0.45)"},
    { top:"5%",  left:"60%",  size:22, cls:"rocket-down", dur:"7s",   del:"2.2s",  color:"rgba(200,240,180,0.5)" },
    { top:"8%",  left:"88%",  size:16, cls:"rocket-down", dur:"5.5s", del:"4s",    color:"rgba(255,255,255,0.4)" },
  ];

  return (
    <section className="bg-[var(--verde-fuerte)] py-14 md:py-16 relative overflow-hidden">
      {/* Burbujas */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {burbujas.map((b, i) => (
          <span
            key={i}
            className={`absolute rounded-full food-d${(i % 3) + 1}`}
            style={{
              width: b.w, height: b.w, top: b.top, left: b.left, opacity: b.op,
              backgroundColor: i % 2 === 0 ? "white" : "#a8d890",
              border: i % 3 === 2 ? "2px solid rgba(255,255,255,0.35)" : "none",
              ["--fdur" as string]: b.dur, ["--fdel" as string]: b.del,
            }}
          />
        ))}

        {/* Cohetes animados */}
        {cohetes.map((c, i) => (
          <div
            key={`r${i}`}
            className={`absolute pointer-events-none ${c.cls}`}
            style={{
              top: c.top, left: c.left,
              ["--rdur" as string]: c.dur,
              ["--rdel" as string]: c.del,
            }}
          >
            <RocketSvg size={c.size} color={c.color} />
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Cabecera */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-white/80 mb-2 font-semibold flex items-center gap-2">
            <IcoLeaf cls="w-4 h-4 inline-block" /> Trayectoria reciente
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white">
            Momentos que marcan <span className="font-semibold text-[var(--primrose)]">una carrera.</span>
          </h2>
        </div>

        {/* Mobile: imagen única a pantalla completa */}
        <div className="sm:hidden">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#2d5016] shadow-xl">
            <Image
              src={slides[destacado].src}
              alt={slides[destacado].titulo}
              fill
              className={`transition-transform duration-700 ${
                slides[destacado].fit === "contain" ? "object-contain p-2" : "object-cover"
              }`}
              style={{ objectPosition: "center center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-base font-bold mb-1 drop-shadow-lg leading-snug">
                {slides[destacado].titulo}
              </h3>
              <p className="text-xs text-white/80 leading-relaxed line-clamp-2 drop-shadow">
                {slides[destacado].desc}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop: BENTO — contenedor con altura fija, posicionamiento absoluto */}
        <div className="hidden sm:block relative w-full h-[400px] md:h-[440px]">
          {slides.map((slide, i) => {
            const slotIdx = (i - destacado + total) % total;
            const s = slots[slotIdx];
            const esFeatured = slotIdx === 0;

            return (
              <div
                key={i}
                onClick={() => setDestacado(i)}
                className="absolute cursor-pointer"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: `${s.w}%`,
                  height: `${s.h}%`,
                  transition: "top 0.7s cubic-bezier(0.4,0,0.2,1), left 0.7s cubic-bezier(0.4,0,0.2,1), width 0.7s cubic-bezier(0.4,0,0.2,1), height 0.7s cubic-bezier(0.4,0,0.2,1)",
                  zIndex: esFeatured ? 3 : 1,
                  padding: "4px",
                }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#2d5016] group shadow-xl">
                  <Image
                    src={slide.src}
                    alt={slide.titulo}
                    fill
                    className={`transition-transform duration-700 group-hover:scale-105 ${
                      slide.fit === "contain" ? "object-contain p-2" : "object-cover"
                    }`}
                    style={{ objectPosition: "center center" }}
                    priority={i === 0}
                  />

                  {/* Overlay siempre */}
                  <div className={`absolute inset-0 transition-all duration-700 ${
                    esFeatured
                      ? "bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                      : "bg-black/30 group-hover:bg-black/15"
                  }`} />

                  {/* Texto solo en la destacada */}
                  {esFeatured && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                      <h3 className="text-base md:text-xl font-bold mb-1 drop-shadow-lg leading-snug">
                        {slide.titulo}
                      </h3>
                      <p className="text-xs md:text-sm text-white/80 leading-relaxed line-clamp-2 drop-shadow">
                        {slide.desc}
                      </p>
                    </div>
                  )}

                  {/* Ícono "expandir" en pequeñas al hover */}
                  {!esFeatured && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/80 text-[var(--texto-principal)] text-xs font-semibold px-3 py-1 rounded-full shadow">
                        Ver
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Puntos de navegación */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setDestacado(i)}
              className={`rounded-full transition-all duration-300 ${
                i === destacado
                  ? "w-8 h-2 bg-[var(--primrose)]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FILOSOFÍA + SERVICIOS ---------- */
function FilosofiaYServicios() {
  const secciones: { titulo: string; Ico: (p:{cls?:string})=>React.JSX.Element; contenido: React.ReactNode }[] = [
    { titulo: "Visión",               Ico: IcoEye,    contenido: <>Promover y vender servicios y productos nutricionales dedicados a la nutrición <span className="text-[var(--lime)] font-semibold">preventiva</span> en todas las etapas de la vida.</> },
    { titulo: "Misión",               Ico: IcoTarget,  contenido: "Cuidar el cuerpo humano con dietas María Luisa, escritas, cocinadas o envasadas, llegando a más familias cada día." },
    { titulo: "Objetivo en los niños", Ico: IcoChild,  contenido: "Elevar la estatura promedio de los peruanos con la dieta María Luisa y vencer a la genética tradicional con el poder de la ciencia de la nutrición." },
    { titulo: "Objetivo en los adultos", Ico: IcoPerson, contenido: "Mejorar la calidad de vida saludable de la población económicamente activa del Perú y Latinoamérica." },
  ];

  const servicios: { n: string; titulo: string; Ico: (p:{cls?:string})=>React.JSX.Element; desc: React.ReactNode }[] = [
    { n: "01", titulo: "Libros",       Ico: IcoBook,    desc: <>Guías prácticas de nutrición <span className="text-[var(--lime)] font-semibold">preventiva</span>.</> },
    { n: "02", titulo: "Talleres",     Ico: IcoBlender, desc: "Comida dietética, fácil y saciadora." },
    { n: "03", titulo: "Productos",    Ico: IcoBowl,    desc: "Cúrcuma, sacha inchi, cacao, estevia." },
    { n: "04", titulo: "Consultorías", Ico: IcoChat,    desc: "Asesorías personalizadas." },
  ];

  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <section id="sobre-mi" className="bg-[#f5f0e8] relative overflow-hidden">
      <FoodBg />
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">

          {/* IZQUIERDA: Filosofía */}
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--texto-principal)] mb-2 font-semibold flex items-center gap-2">
              <span className="text-[var(--lime)]">♥</span> Nuestra propuesta
            </p>
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-6 text-[var(--texto-principal)]">
              Filosofía <span className="font-semibold text-[var(--lime)]">profesional.</span>
            </h2>

            <div className="space-y-2">
              {secciones.map((s, i) => {
                const activo = abierto === i;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl overflow-hidden transition-all border-2 ${
                      activo
                        ? "bg-[var(--lime-soft)] border-[var(--lime)]"
                        : "bg-white border-[var(--borde-suave)]"
                    }`}
                  >
                    <button
                      onClick={() => setAbierto(abierto === i ? null : i)}
                      className="w-full px-5 py-4 flex items-center gap-3 text-left transition"
                    >
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                        activo ? "bg-[var(--lime)] text-white" : "bg-[var(--lime-soft)] text-[var(--lime)]"
                      }`}>
                        <s.Ico cls="w-5 h-5" />
                      </span>
                      <span className="flex-1 text-base md:text-lg font-medium text-[var(--texto-principal)]">
                        {s.titulo}
                      </span>
                      <span className={`text-2xl transition-transform duration-300 text-[var(--lime)] ${activo ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    <div className={`grid transition-all duration-500 ease-in-out ${
                      activo ? "grid-rows-[1fr] opacity-100 px-5 pb-4" : "grid-rows-[0fr] opacity-0"
                    }`}>
                      <div className="overflow-hidden">
                        <p className="font-nunito text-base text-[var(--texto-suave)] leading-relaxed pl-[52px]">
                          {s.contenido}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DERECHA: Servicios */}
          <div id="servicios">
            <p className="text-sm uppercase tracking-widest text-[var(--texto-principal)] mb-2 font-semibold">
              Lo que ofrezco
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--texto-principal)]">
              Cuatro <span className="font-semibold text-[var(--lime)]">pilares.</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {servicios.map((item) => (
                <div
                  key={item.n}
                  className="p-3 sm:p-5 rounded-2xl bg-white border-2 border-[var(--borde-verde)] transition cursor-default hover:scale-[1.02] hover:border-[var(--lime)] hover:shadow-md"
                >
                  <p className="text-xs mb-2 font-semibold text-[var(--lime)]">{item.n}</p>
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[var(--lime-soft)] flex items-center justify-center mb-2 sm:mb-3">
                    <item.Ico cls="w-4 h-4 sm:w-5 sm:h-5 text-[var(--lime)]" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm md:text-base text-[var(--texto-principal)]">{item.titulo}</h3>
                  <p className="font-nunito text-xs sm:text-sm text-[var(--texto-suave)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="bg-[var(--verde-fuerte)] text-white py-4 px-8 flex flex-col sm:flex-row items-center justify-between gap-3 relative text-center sm:text-left">
        <p className="font-nunito text-sm">
          Nutrición que <strong>transforma</strong>. Bienestar que <strong>se nota</strong>.
        </p>
        <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 -top-6 w-12 h-12 rounded-full bg-white border-4 border-[var(--verde-fuerte)] items-center justify-center shadow-md">
          <IcoLeaf cls="w-6 h-6 text-[var(--verde-fuerte)]" />
        </div>
        <p className="font-nunito text-sm">
          Salud · Equilibrio · Bienestar <span className="text-white">♥</span>
        </p>
      </div>
    </section>
  );
}

/* ---------- TRAYECTORIA ---------- */
function Trayectoria() {
  const hitos = [
    { año: "Años de carrera", titulo: "Trabajo en MINSA", desc: "Ha trabajado en todo el Perú en forma presencial.", color: "primrose" },
    { año: "Experiencia", titulo: "Sector público", desc: "Trabajo en CENAN y diversas instituciones de salud.", color: "lime" },
    { año: "Reciente", titulo: "Conferencista", desc: "Presentación en el Colegio de Nutricionistas del Perú.", color: "primrose" },
    { año: "Hoy", titulo: "Práctica privada", desc: "Enfoque en prevención y nutrición personalizada.", color: "lime" },
  ];

  return (
    <section className="py-14 md:py-16 bg-[#f5f0e8] relative overflow-hidden">
      <FoodBg />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
          Trayectoria
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-10 text-[var(--texto-principal)]">
          Más de dos décadas <span className="font-semibold text-[var(--lime)]">construyendo experiencia.</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {hitos.map((h, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-3 sm:p-5 shadow-md border-t-4 transition hover:-translate-y-1 ${
                h.color === "primrose"
                  ? "border-[var(--primrose)] shadow-pink-100"
                  : "border-[var(--lime)] shadow-green-100"
              }`}
            >
              <p className={`text-[10px] mb-1.5 uppercase tracking-widest font-semibold ${
                h.color === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"
              }`}>{h.año}</p>
              <h3 className="font-semibold mb-1.5 text-sm md:text-base text-[var(--texto-principal)]">{h.titulo}</h3>
              <p className="font-nunito text-xs text-[var(--texto-suave)] leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  const sociales = [
    {
      label: "WhatsApp",
      sub: "985 577 017",
      href: "https://wa.me/51985577017",
      bg: "#25D366",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.848L.057 23.885a.5.5 0 0 0 .612.612l6.037-1.475A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.618-.5-5.12-1.374l-.368-.214-3.814.932.95-3.718-.236-.385A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      ),
    },
    {
      label: "Facebook",
      sub: "MaríaLuisaNutricionista",
      href: "https://www.facebook.com",
      bg: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "TikTok",
      sub: "@MaríaLuisaNutri",
      href: "https://www.tiktok.com/@maraluisanutricio?is_from_webapp=1&sender_device=pc",
      bg: "#010101",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.2 8.2 0 0 0 4.79 1.52V7.03a4.85 4.85 0 0 1-1.02-.34z"/>
        </svg>
      ),
    },
    {
      label: "Google Maps",
      sub: "Ver ubicación",
      href: "https://www.google.com/maps/place/Residencial+Mart%C3%ADn/@-12.1669714,-76.9685542,20z/data=!4m6!3m5!1s0x9105b96811cf226b:0x1e33f53b4d52f3d4!8m2!3d-12.1669142!4d-76.968644!16s%2Fg%2F11sdn55n89?hl=es&entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D",
      bg: "#EA4335",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer id="contacto" className="relative overflow-hidden bg-[var(--texto-principal)] text-white pt-14 pb-8">

      {/* Burbujas de fondo animadas */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[
          {w:120,top:"-10%",left:"-3%",dur:"9s",del:"0s"},
          {w:80, top:"60%", left:"-2%",dur:"7s",del:"1.5s"},
          {w:150,top:"30%", left:"95%",dur:"10s",del:"0.8s"},
          {w:60, top:"80%", left:"92%",dur:"6s",del:"2.2s"},
          {w:40, top:"20%", left:"50%",dur:"8s",del:"1s"},
        ].map((b,i)=>(
          <span key={i} className={`absolute rounded-full ${i%2===0?"food-d1":"food-d2"}`}
            style={{width:b.w,height:b.w,top:b.top,left:b.left,opacity:0.07,
              background:"radial-gradient(circle,#a8d890,#5a9a5a)",
              ["--fdur" as string]:b.dur,["--fdel" as string]:b.del}}/>
        ))}
        {/* Destellos */}
        {[{top:"15%",left:"20%"},{top:"70%",left:"60%"},{top:"40%",left:"80%"},{top:"85%",left:"30%"}].map((d,i)=>(
          <span key={i} className="absolute rounded-full sparkle-item"
            style={{top:d.top,left:d.left,width:5,height:5,
              background:i%2===0?"var(--primrose)":"var(--lime-mid)",opacity:0.4,
              ["--dur" as string]:`${3+i*0.7}s`,["--delay" as string]:`${i*0.9}s`}}/>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Columnas info */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6.09 6.09l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.04z"/></svg>
              Contacto directo
            </h4>
            <a href="https://wa.me/51985577017" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 group mb-4">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#25D366]/20 group-hover:bg-[#25D366]/40 transition">
                <svg viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.848L.057 23.885a.5.5 0 0 0 .612.612l6.037-1.475A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.618-.5-5.12-1.374l-.368-.214-3.814.932.95-3.718-.236-.385A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              </span>
              <div>
                <p className="text-xs text-white/50 font-nunito">WhatsApp</p>
                <p className="font-semibold text-white group-hover:text-[#25D366] transition text-sm">985 577 017</p>
              </div>
            </a>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold flex items-center gap-2">
              <IcoPin cls="w-3.5 h-3.5" /> Ubicación
            </h4>
            <a href="https://www.google.com/maps/place/Residencial+Mart%C3%ADn/@-12.1669714,-76.9685542,20z/data=!4m6!3m5!1s0x9105b96811cf226b:0x1e33f53b4d52f3d4!8m2!3d-12.1669142!4d-76.968644!16s%2Fg%2F11sdn55n89?hl=es&entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank" rel="noopener noreferrer"
              className="flex items-start gap-3 group">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#EA4335]/20 group-hover:bg-[#EA4335]/40 transition mt-0.5">
                <svg viewBox="0 0 24 24" fill="#EA4335" className="w-4 h-4"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </span>
              <div>
                <p className="text-xs text-white/50 font-nunito">Dirección</p>
                <p className="font-nunito text-sm text-white/80 group-hover:text-white transition leading-relaxed">
                  Calle José del Carmen Verastegui 303<br/>San Juan de Miraflores, Lima
                </p>
              </div>
            </a>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold flex items-center gap-2">
              <IcoLeaf cls="w-3.5 h-3.5" /> Redes sociales
            </h4>
            <div className="space-y-3">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <span className="w-9 h-9 rounded-xl bg-[#1877F2]/20 group-hover:bg-[#1877F2]/40 flex items-center justify-center transition">
                  <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 h-4"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                </span>
                <span className="font-nunito text-sm text-white/80 group-hover:text-white transition">MaríaLuisaNutricionista</span>
              </a>
              <a href="https://www.tiktok.com/@maraluisanutricio?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <span className="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.2 8.2 0 0 0 4.79 1.52V7.03a4.85 4.85 0 0 1-1.02-.34z"/></svg>
                </span>
                <span className="font-nunito text-sm text-white/80 group-hover:text-white transition">@MaríaLuisaNutri</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 text-center text-xs text-white font-nunito">
          <p>© {new Date().getFullYear()} María Luisa Nutricionista. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
/* ---------- SECCIÓN ENFERMEDADES PREVENIBLES ---------- */
function SeccionEnfermedades() {
  const enfermedades: { nombre: string; descripcion: string; Ico: (p:{cls?:string})=>React.JSX.Element }[] = [
    { nombre: "Anemia",                       descripcion: "Una alimentación rica en hierro y vitamina C previene la deficiencia que afecta a millones de niños y mujeres en el Perú.",                                                                       Ico: IcoDrop   },
    { nombre: "Obesidad y sobrepeso",          descripcion: "Dietas equilibradas con alimentos naturales regulan el peso corporal y reducen el riesgo de enfermedades asociadas.",                                                                            Ico: IcoScale  },
    { nombre: "Diabetes tipo 2",               descripcion: "Controlar el consumo de azúcares refinados y elegir alimentos de bajo índice glucémico reduce significativamente el riesgo.",                                                                    Ico: IcoLeaf   },
    { nombre: "Hipertensión arterial",         descripcion: "Reducir el sodio e incorporar potasio, magnesio y fibra ayuda a mantener la presión arterial en niveles saludables.",                                                                           Ico: IcoHeart  },
    { nombre: "Osteoporosis",                  descripcion: "El calcio, la vitamina D y el fósforo desde la infancia construyen huesos fuertes que protegen en la adultez y vejez.",                                                                          Ico: IcoBone   },
    { nombre: "Enfermedades cardiovasculares", descripcion: "Omega-3, fibra y antioxidantes reducen el colesterol malo y protegen el corazón a largo plazo.",                                                                                                Ico: IcoWave   },
    { nombre: "Desnutrición infantil",         descripcion: "Una nutrición adecuada desde la gestación y los primeros años garantiza el desarrollo físico e intelectual del niño.",                                                                           Ico: IcoChild  },
    { nombre: "Gastritis y problemas digestivos", descripcion: "Alimentos naturales, fibra y hábitos alimenticios ordenados protegen la mucosa gástrica y mejoran el tránsito intestinal.",                                                                   Ico: IcoStomach},
    { nombre: "Colesterol alto",               descripcion: "Superalimentos como la sacha inchi y el cacao orgánico aportan grasas saludables que equilibran los niveles de colesterol.",                                                                    Ico: IcoBowl   },
  ];

  return (
    <section className="py-14 md:py-20 bg-[#f5f0e8] relative overflow-hidden">
      <FoodBg />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-[var(--texto-principal)] mb-2 font-semibold flex items-center justify-center gap-2">
            <IcoLeaf cls="w-4 h-4 text-[var(--lime)]" /> Nutrición preventiva
          </p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4 text-[var(--texto-principal)]">
            Enfermedades que se pueden <span className="font-semibold text-[var(--primrose)]">prevenir.</span>
          </h2>
          <p className="font-nunito text-[var(--texto-suave)] max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Una buena nutrición es la mejor medicina preventiva. Estos son algunos de los problemas de salud
            que podemos reducir o evitar con hábitos alimenticios adecuados desde temprana edad.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {enfermedades.map((e, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border-2 border-[var(--borde-verde)] transition hover:-translate-y-1 hover:shadow-lg hover:border-[var(--lime)] hover:shadow-green-100"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-[var(--lime-soft)] flex items-center justify-center flex-shrink-0">
                  <e.Ico cls="w-5 h-5 text-[var(--lime)]" />
                </span>
                <h3 className="font-semibold text-[var(--texto-principal)] leading-tight pt-2">{e.nombre}</h3>
              </div>
              <p className="font-nunito text-sm md:text-base text-[var(--texto-suave)] leading-relaxed pl-[52px]">{e.descripcion}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="bg-[var(--verde-fuerte)] text-white rounded-2xl px-4 md:px-8 py-5 max-w-2xl flex items-start gap-3 md:gap-4">
            <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <IcoHeart cls="w-4 h-4 md:w-5 md:h-5 text-white" />
            </span>
            <p className="font-nunito text-sm md:text-base leading-relaxed text-white/90">
              <span className="font-semibold text-white">Recuerda:</span> la prevención siempre es más efectiva
              y menos costosa que el tratamiento. Con la orientación profesional adecuada, cada familia puede
              construir una base nutricional sólida para una vida más saludable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECCIÓN PRODUCTOS DESTACADOS ---------- */
function SeccionProductos() {
  const productos = [
    { 
      nombre: "Harina de Cúrcuma", 
      precio: 15, 
      descripcion: "Libre de gluten · 250 gr", 
      color: "primrose",
      imagen: "/images/harinaCurcuma.png"  
    },
    { 
      nombre: "Salvado de Trigo", 
      precio: 12, 
      descripcion: "100% Fibra Natural · 500 gr", 
      color: "lime",
      imagen: "/images/salvadoTrigo.png" 
    },
    { 
      nombre: "Sacha Inchi", 
      precio: 25, 
      descripcion: "Omega-3 y proteínas · 250 gr", 
      color: "primrose",
      imagen: "/images/SachaInchi.png"   
    },
    { 
      nombre: "Cacao Orgánico", 
      precio: 20, 
      descripcion: "Sin azúcar añadida · 200 gr", 
      color: "lime",
      imagen: "/images/Cacao.png"         
    },
  ];

  const burbujas = [
    { w: 90,  top: "8%",   left: "3%",   op: 0.12, dur: "7s",  del: "0s"   },
    { w: 50,  top: "20%",  left: "8%",   op: 0.08, dur: "5s",  del: "1s"   },
    { w: 130, top: "55%",  left: "1%",   op: 0.10, dur: "9s",  del: "2s"   },
    { w: 40,  top: "75%",  left: "10%",  op: 0.14, dur: "6s",  del: "0.5s" },
    { w: 70,  top: "5%",   left: "18%",  op: 0.07, dur: "8s",  del: "3s"   },
    { w: 110, top: "40%",  left: "88%",  op: 0.11, dur: "7s",  del: "1.5s" },
    { w: 60,  top: "10%",  left: "80%",  op: 0.09, dur: "6s",  del: "2.5s" },
    { w: 85,  top: "70%",  left: "92%",  op: 0.13, dur: "8s",  del: "0.8s" },
    { w: 45,  top: "85%",  left: "75%",  op: 0.08, dur: "5s",  del: "1.8s" },
    { w: 120, top: "25%",  left: "93%",  op: 0.10, dur: "9s",  del: "3.5s" },
    { w: 55,  top: "50%",  left: "5%",   op: 0.09, dur: "6.5s",del: "4s"   },
    { w: 35,  top: "90%",  left: "20%",  op: 0.12, dur: "5.5s",del: "2.2s" },
    { w: 75,  top: "60%",  left: "97%",  op: 0.07, dur: "7.5s",del: "0.3s" },
    { w: 95,  top: "15%",  left: "96%",  op: 0.11, dur: "8.5s",del: "1.2s" },
    { w: 48,  top: "35%",  left: "2%",   op: 0.08, dur: "6s",  del: "3.8s" },
  ];

  return (
    <section id="tienda" className="py-14 md:py-16 bg-[var(--verde-fuerte)] relative overflow-hidden">
      {/* Burbujas animadas */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {burbujas.map((b, i) => (
          <span
            key={i}
            className="absolute rounded-full border-2 border-white food-d1"
            style={{
              width: b.w,
              height: b.w,
              top: b.top,
              left: b.left,
              opacity: b.op,
              backgroundColor: i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#a8d890" : "transparent",
              ["--fdur" as string]: b.dur,
              ["--fdel" as string]: b.del,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/80 mb-2 font-semibold flex items-center gap-2">
              <IcoLeaf cls="w-4 h-4 inline-block" /> Nuestra tienda
            </p>
            <h2 className="font-playfair text-3xl md:text-5xl font-bold text-white">
              Productos <span className="font-semibold shimmer-white">naturales.</span>
            </h2>
            <p className="font-nunito text-white/80 mt-2 text-sm md:text-base max-w-lg">
              Superalimentos, harinas y suplementos cuidadosamente seleccionados.
            </p>
          </div>
          <Link
            href="/productos"
            className="text-sm bg-[var(--primrose)] text-white px-5 py-2.5 rounded-full hover:bg-[var(--primrose-hover)] transition font-medium w-fit"
          >
            Ver tienda completa →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {productos.map((p, i) => (
            <Link
              key={i}
              href="/productos"
              className="bg-white rounded-2xl border-2 border-[var(--borde-rosa)] p-3 sm:p-5 hover:border-[var(--primrose)] hover:shadow-lg hover:shadow-pink-200 hover:-translate-y-1 transition group"
            >
              <div className="aspect-square rounded-xl mb-4 overflow-hidden relative">
               <Image
                  src={p.imagen}
                  alt={p.nombre}
                  fill
                  className="object-contain p-2"
                 />
                </div>
              <p className={`text-xs uppercase tracking-widest mb-1 font-semibold ${
                p.color === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"
              }`}>
                Destacado
              </p>
              <h3 className="font-semibold text-[var(--texto-principal)] mb-1 text-sm">{p.nombre}</h3>
              <p className="font-nunito text-sm text-[var(--texto-suave)] mb-3 leading-relaxed">{p.descripcion}</p>
              <p className="text-lg font-semibold text-[var(--texto-principal)]">S/ {p.precio}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ---------- ASESORÍAS PARA PROYECTOS ---------- */
function AsesoriasProyectos() {
  const orbs = [
    { w:130, top:"2%",  left:"-4%",  op:0.20, dur:"9s",  del:"0s",   g:"#a8d870,#7bbf50" },
    { w:80,  top:"42%", left:"-3%",  op:0.16, dur:"7s",  del:"1.8s", g:"#c8ec90,#9dd060" },
    { w:170, top:"74%", left:"-5%",  op:0.14, dur:"11s", del:"0.5s", g:"#b4e07a,#8ac850" },
    { w:110, top:"5%",  left:"96%",  op:0.18, dur:"8s",  del:"2.3s", g:"#a8d870,#7bbf50" },
    { w:150, top:"52%", left:"97%",  op:0.15, dur:"10s", del:"0.8s", g:"#c0e882,#92cc55" },
    { w:65,  top:"85%", left:"93%",  op:0.19, dur:"6s",  del:"3.2s", g:"#c8ec90,#9dd060" },
    { w:55,  top:"28%", left:"46%",  op:0.09, dur:"7.5s",del:"1.2s", g:"#b4e07a,#8ac850" },
    { w:90,  top:"78%", left:"32%",  op:0.10, dur:"9.5s",del:"2.8s", g:"#a8d870,#7bbf50" },
    { w:42,  top:"55%", left:"68%",  op:0.11, dur:"6.5s",del:"0.4s", g:"#c8ec90,#9dd060" },
  ];

  const destellos = [
    { top:"18%", left:"22%", size:7,  dur:"3.5s", del:"0s"   },
    { top:"38%", left:"78%", size:5,  dur:"4.2s", del:"0.9s" },
    { top:"62%", left:"12%", size:9,  dur:"3.8s", del:"1.7s" },
    { top:"82%", left:"58%", size:6,  dur:"5s",   del:"2.3s" },
    { top:"28%", left:"90%", size:7,  dur:"4s",   del:"0.5s" },
    { top:"72%", left:"48%", size:5,  dur:"3.2s", del:"3.1s" },
    { top:"12%", left:"60%", size:8,  dur:"4.5s", del:"1.4s" },
    { top:"90%", left:"82%", size:6,  dur:"3.8s", del:"0.2s" },
  ];

  return (
    <section
      className="py-14 md:py-16 overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #e2f4ce 0%, #cce9b0 40%, #daf2c4 70%, #c8e8a8 100%)" }}
    >
      {/* Orbes animados */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {orbs.map((b, i) => (
          <span
            key={i}
            className={`absolute rounded-full ${i % 2 === 0 ? "food-d1" : "food-d2"}`}
            style={{
              width: b.w, height: b.w, top: b.top, left: b.left, opacity: b.op,
              background: `radial-gradient(circle, ${b.g})`,
              filter: "blur(3px)",
              ["--fdur" as string]: b.dur, ["--fdel" as string]: b.del,
            }}
          />
        ))}
        {destellos.map((d, i) => (
          <span
            key={`ds${i}`}
            className="absolute rounded-full sparkle-item"
            style={{
              width: d.size, height: d.size, top: d.top, left: d.left,
              background: i % 2 === 0 ? "var(--primrose)" : "#7bbf50",
              opacity: 0.50,
              ["--dur" as string]: d.dur,
              ["--delay" as string]: d.del,
            }}
          />
        ))}
      </div>

      <FoodBg />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Foto izquierda — mobile: arriba, desktop: izquierda */}
          <div className="relative">
            {/* TODO: reemplazar src con /images/marialuisa-perfil.jpg cuando esté disponible */}
            <div className="relative max-w-md mx-auto md:mx-0">
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--pinktone)] to-[var(--lime-soft)] rounded-2xl rotate-2" />
              <div className="relative aspect-[3/4] rounded-2xl shadow-2xl shadow-pink-200 overflow-hidden border-4 border-white">
                <Image
                  src="/images/conferencia-1.jpeg"
                  alt="Lic. María Luisa Peña Valdivia — Nutricionista"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Texto derecha */}
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
              Mi especialidad
            </p>
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4 leading-tight text-[var(--texto-principal)]">
              Asesorías para<br />
              <span className="font-semibold text-[var(--primrose)]">Proyectos nutricionales.</span>
            </h2>
            <p className="font-nunito text-base text-[var(--texto-suave)] leading-relaxed mb-6">
              Más de dos décadas diseñando e implementando proyectos de nutrición preventiva en instituciones,
              comunidades y empresas del Perú. Si tu organización necesita una estrategia nutricional con
              impacto real, conversemos.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                { t: "Diagnóstico nutricional poblacional",        ac: "var(--primrose)" },
                { t: "Diseño de programas de intervención",        ac: "#7bbf50"         },
                { t: "Capacitación a personal y equipos de salud", ac: "var(--primrose)" },
                { t: "Evaluación de impacto y seguimiento",        ac: "#7bbf50"         },
              ].map(({ t, ac }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[3px] flex-shrink-0 font-bold text-lg leading-none" style={{ color: ac }}>—</span>
                  <span className="font-nunito text-base text-[var(--texto-suave)] leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/empresas"
              className="inline-block bg-[var(--primrose)] text-white px-6 py-3 rounded-full hover:bg-[var(--primrose-hover)] transition font-medium shadow-lg shadow-pink-200"
            >
              Solicitar asesoría
            </Link>
          </div>
        </div>

        {/* Card con cita y stats */}
        <div className="mt-12 relative overflow-hidden rounded-2xl border-2 border-[var(--borde-rosa)] shadow-xl shadow-pink-100">

          {/* Fondo animado de la card */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {/* Orbes de fondo */}
            {[
              { w:120, top:"-20%", left:"-5%", g:"#f8d5e0,#f0b8cc", dur:"8s", del:"0s"   },
              { w:90,  top:"60%",  left:"90%", g:"#d4f0b8,#b8e890", dur:"7s", del:"1.5s" },
              { w:70,  top:"80%",  left:"5%",  g:"#f8d5e0,#f0c0d0", dur:"6s", del:"2.8s" },
              { w:50,  top:"10%",  left:"85%", g:"#d4f0b8,#c0e898", dur:"9s", del:"0.8s" },
            ].map((b, i) => (
              <span
                key={i}
                className={`absolute rounded-full ${i % 2 === 0 ? "food-d1" : "food-d2"}`}
                style={{
                  width: b.w, height: b.w, top: b.top, left: b.left, opacity: 0.40,
                  background: `radial-gradient(circle, ${b.g})`,
                  filter: "blur(18px)",
                  ["--fdur" as string]: b.dur, ["--fdel" as string]: b.del,
                }}
              />
            ))}
            {/* Destellos */}
            {[
              { top:"15%", left:"20%", size:5, dur:"3s",   del:"0s"   },
              { top:"70%", left:"70%", size:4, dur:"4.2s", del:"1.1s" },
              { top:"50%", left:"50%", size:6, dur:"3.8s", del:"2s"   },
              { top:"25%", left:"80%", size:4, dur:"5s",   del:"0.6s" },
              { top:"80%", left:"25%", size:5, dur:"3.5s", del:"1.8s" },
            ].map((d, i) => (
              <span
                key={`dsc${i}`}
                className="absolute rounded-full sparkle-item"
                style={{
                  width: d.size, height: d.size, top: d.top, left: d.left,
                  background: i % 2 === 0 ? "var(--primrose)" : "#7bbf50",
                  opacity: 0.55,
                  ["--dur" as string]: d.dur,
                  ["--delay" as string]: d.del,
                }}
              />
            ))}
          </div>

          {/* Contenido */}
          <div className="relative z-10 bg-white/80 backdrop-blur-sm p-5 md:p-8">
            {/* Comillas decorativas */}
            <span className="absolute top-4 left-6 text-7xl font-playfair text-[var(--primrose)] opacity-10 leading-none select-none">&ldquo;</span>

            <p className="font-playfair text-lg md:text-2xl font-light text-[var(--texto-principal)] leading-relaxed max-w-3xl relative z-10">
              &quot;Mi fuerte es la nutrición a escala. Si quieres impactar a tu comunidad, escuela o equipo,{" "}
              <span className="font-semibold text-[var(--primrose)]">te ayudo a diseñarlo bien.</span>&quot;
            </p>
            <p className="font-nunito text-sm text-[var(--texto-suave)] mt-3 mb-6 md:mb-8 italic">
              — Lic. María Luisa Peña Valdivia
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 pt-5 md:pt-6 border-t border-[var(--borde-rosa)]">
              {[
                { val: "20+",      sub: "Años en MINSA",           color: "var(--primrose)", bg: "var(--pinktone)"  },
                { val: "Nacional", sub: "Proyectos en el Perú",    color: "#5a9a3a",         bg: "var(--lime-soft)" },
                { val: "Experta",  sub: "Asesoría especializada",  color: "var(--primrose)", bg: "var(--pinktone)"  },
              ].map(({ val, sub, color, bg }, i) => (
                <div
                  key={i}
                  className="group flex sm:flex-col items-center gap-3 sm:gap-0 sm:items-center text-left sm:text-center rounded-xl px-4 py-3 sm:p-2 md:p-4 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default"
                  style={{ background: bg }}
                >
                  <p
                    className="font-playfair text-2xl md:text-3xl font-bold sm:mb-1 halo-animado rounded-full"
                    style={{ color }}
                  >
                    {val}
                  </p>
                  <p className="font-nunito text-xs text-[var(--texto-suave)] leading-snug">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SECCIÓN EMPRESAS ---------- */
function SeccionEmpresas() {
  return (
    <section className="py-14 md:py-16 bg-[#f5f0e8] relative overflow-hidden">
      <FoodBg />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold">
              Para empresas
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-[var(--texto-principal)]">
              Bienestar nutricional<br />
              <span className="font-semibold text-[var(--lime)]">para tu equipo.</span>
            </h2>
            <p className="font-nunito text-[var(--texto-suave)] leading-relaxed mb-6 text-sm md:text-base">
              Programa corporativo de evaluación nutricional con la{" "}
              <span className="text-[var(--lime)] font-semibold">Hoja de Levantamiento Nutricional</span>,
              charlas y planes personalizados para cada colaborador.
              Mejora el rendimiento, reduce el ausentismo y cuida a tu equipo.
            </p>

            <ul className="space-y-3 mb-6">
              {[
                { t: "Evaluación individual a cada colaborador", ac: "var(--primrose)" },
                { t: "Charlas y talleres in-company",            ac: "var(--lime)"     },
                { t: "Profesional colegiada con experiencia",    ac: "var(--primrose)" },
              ].map(({ t, ac }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 font-bold text-lg leading-none" style={{ color: ac }}>—</span>
                  <span className="font-nunito text-sm md:text-base text-[var(--texto-suave)] leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/empresas"
              className="inline-block bg-[var(--primrose)] text-white px-6 py-3 rounded-full hover:bg-[var(--primrose-hover)] transition font-medium shadow-lg shadow-pink-200"
            >
              Conocer el programa
            </Link>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl p-5 md:p-8 shadow-xl shadow-green-100 border-2 border-[var(--borde-verde)]">
              <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold">
                Empresas que confían
              </p>
              <p className="font-nunito text-sm md:text-lg font-light text-[var(--texto-principal)] mb-2 leading-relaxed">
                &quot;Más de <span className="font-semibold text-[var(--lime)]">20 años</span> recorriendo
                el Perú evaluando nutricionalmente a familias y trabajadores.&quot;
              </p>
              <p className="font-nunito text-sm md:text-base text-[var(--texto-suave)] leading-relaxed mt-4">
                — Lic. María Luisa Peña Valdivia, Nutricionista colegiada
              </p>

              <div className="grid grid-cols-3 gap-2 md:gap-4 mt-8 pt-6 border-t border-[var(--borde-rosa)]">
                <div>
                  <p className="text-lg md:text-2xl font-semibold text-[var(--primrose)]">20+</p>
                  <p className="font-nunito text-xs md:text-base text-[var(--texto-suave)] leading-relaxed">Años de experiencia</p>
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-semibold text-[var(--lime)]">100%</p>
                  <p className="font-nunito text-xs md:text-base text-[var(--texto-suave)] leading-relaxed">Personalizado</p>
                </div>
                <div>
                  <p className="text-lg md:text-2xl font-semibold text-[var(--primrose)]">B2B</p>
                  <p className="font-nunito text-xs md:text-base text-[var(--texto-suave)] leading-relaxed">Empresarial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}