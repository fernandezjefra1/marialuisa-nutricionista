"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[var(--texto-principal)]">
      <FloatingSparkles />
      <Navbar />
      <HeroLibro />
      <SeccionPlanes />
      <SeccionCatalogo />
      <FilosofiaYServicios />
      <Footer />
    </main>
  );
}

/* ---------- ICONOS SVG REUTILIZABLES ---------- */
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

function IcoLeaf({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
}
function IcoWhatsapp({ cls = "" }) {
  return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.85.5 3.58 1.36 5.07L2 22l5.08-1.33A9.96 9.96 0 0 0 12.02 22C17.55 22 22 17.52 22 12S17.55 2 12.02 2zm0 18.06c-1.64 0-3.17-.48-4.46-1.31l-.32-.19-3.02.79.8-2.94-.21-.31A8.03 8.03 0 0 1 3.99 12c0-4.42 3.6-8.02 8.03-8.02 4.42 0 8.02 3.6 8.02 8.02 0 4.43-3.6 8.06-8.02 8.06z"/></svg>;
}

/* ---------- ILUSTRACIONES SVG DE FONDO (compartidas por los dos fondos) ---------- */
type FoodSvgProps = { style?: React.CSSProperties; className?: string };

/* Smoothie copa */
const Smoothie = ({ className, style }: FoodSvgProps) => (
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

/* Aguacate cortado */
const Avocado = ({ className, style }: FoodSvgProps) => (
  <svg className={className} style={style} viewBox="0 0 130 170" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 8 Q22 55 22 105 Q22 155 65 160 Q108 155 108 105 Q108 55 65 8Z" fill="#2d5016"/>
    <path d="M65 22 Q38 65 38 105 Q38 145 65 150 Q92 145 92 105 Q92 65 65 22Z" fill="#c8e096"/>
    <ellipse cx="65" cy="110" rx="20" ry="26" fill="#8B5E3C"/>
    <ellipse cx="65" cy="108" rx="14" ry="18" fill="#a0724a"/>
  </svg>
);

/* Kiwi rodaja */
const Kiwi = ({ className, style }: FoodSvgProps) => (
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
          <ellipse cx={ex} cy={ey} rx="5" ry="9" transform={`rotate(${a} ${ex} ${ey})`} fill="#2d4a10"/>
        </g>
      );
    })}
  </svg>
);

/* Limón rodaja */
const Lime = ({ className, style }: FoodSvgProps) => (
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

/* Uvas */
const Grapes = ({ className, style }: FoodSvgProps) => (
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

/* Brócoli */
const Broccoli = ({ className, style }: FoodSvgProps) => (
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

/* Duración y retraso de la animación flotante */
const fd = (dur: string, del: string) => ({ "--fdur": dur, "--fdel": del } as React.CSSProperties);

/* ---------- FONDO VEGETAL ANIMADO (ilustraciones SVG coloridas) ---------- */
function FoodBg() {
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

/* ---------- FONDO VEGETAL HERO (kiwis a la izquierda, sin palta ni smoothie) ---------- */
function FoodBgHero() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <Kiwi     className="absolute -top-8 -left-14 w-32 md:w-40 opacity-85 food-d2" style={fd("7s","0s")} />
      <Kiwi     className="absolute top-1/3 -left-14 w-36 md:w-52 opacity-85 food-d1" style={fd("9s","0.5s")} />
      <Kiwi     className="absolute top-28 md:top-20 -left-10 w-20 md:w-28 opacity-70 food-d3" style={fd("8s","1.5s")} />
      <Lime     className="absolute top-1/2 -translate-y-1/2 -right-10 w-20 md:w-24 opacity-75 food-d2" style={fd("7s","2s")} />
      <Grapes   className="absolute -bottom-6 -left-10 w-28 md:w-40 opacity-80 food-sw" style={fd("9s","0.8s")} />
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
  return (
    <nav className="sticky top-0 z-50 bg-[#f5f0e8]/95 backdrop-blur-md border-b border-[var(--verde-fuerte)]/20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <Image
              src="/images/logoNutricion.png"
              alt="Logo María Luisa Nutricionista"
              width={112}
              height={112}
              className="w-[58px] h-[58px] sm:w-[70px] sm:h-[70px] object-contain drop-shadow-sm"
            />
            <div className="hidden md:block leading-tight">
              <p className="font-playfair italic text-[var(--texto-principal)] text-base md:text-lg leading-none">
                María Luisa
              </p>
              <p className="text-xs uppercase tracking-wider text-[var(--primrose)] font-semibold">
                Nutricionista
              </p>
            </div>
          </Link>

          {/* BOTONES DERECHA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">

            {/* BOTÓN WHATSAPP — número visible en sm+, solo ícono en mobile */}
            <a
              href="https://wa.me/51985577017"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escríbenos por WhatsApp al +51 985 577 017"
              className="inline-flex items-center justify-center gap-1.5
                         w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2
                         rounded-full bg-[#25D366] text-white
                         hover:bg-[#1ebe57] hover:scale-105 transition-all duration-300"
            >
              <IcoWhatsapp cls="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline text-sm font-semibold">+51 985 577 017</span>
            </a>

            {/* BOTÓN CATÁLOGO */}
            <Link
              href="/productos"
              aria-label="Catálogo"
              className="inline-flex items-center justify-center gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2 rounded-full border-2 border-[var(--primrose)] text-[var(--primrose)] hover:bg-[var(--primrose)] hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              <span className="hidden sm:inline text-sm font-medium">Catálogo</span>
            </Link>

            {/* BOTÓN CALCULADORA IMC — solo ícono en mobile, texto en sm+ */}
            <Link
              href="/calculadora-imc"
              aria-label="Calcula tu IMC"
              className="inline-flex items-center justify-center gap-2
                         w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2
                         rounded-full border-2 border-[var(--lime)] text-[var(--lime)]
                         hover:bg-[var(--lime)] hover:text-white
                         transition-all duration-300"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18" />
                <path d="M3 7l9-4 9 4" />
                <path d="M3 7c0 3.3 2.7 6 6 6s6-2.7 6-6" />
                <path d="M9 13c0 3.3 2.7 6 6 6s6-2.7 6-6" />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">Calcula tu IMC</span>
            </Link>

            {/* BOTÓN RESERVAR CITA — solo ícono en mobile, texto en sm+ */}
            <Link
              href="/reservar-cita"
              aria-label="Reservar cita"
              className="inline-flex items-center justify-center gap-1.5
                         w-9 h-9 sm:w-auto sm:h-auto sm:px-5 sm:py-2
                         rounded-full bg-[var(--verde-fuerte)] text-white
                         shadow-md shadow-[var(--verde-fuerte)]/30
                         hover:shadow-xl hover:scale-105 transition-all"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="hidden sm:inline text-sm font-medium">Cita</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

/* ---------- HERO: INTRO + LIBRO ---------- */
function HeroLibro() {
  return (
    <section id="libro" className="relative overflow-hidden bg-[#f5f0e8]">
      <FoodBgHero />
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-20 space-y-12 md:space-y-20">

        {/* ── INTRO: María Luisa arriba en móvil, al lado en desktop ── */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Fondo San Marcos */}
          <Image
            src="/images/sanmarcos.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Capa suave para que el texto se lea bien */}
          <div className="absolute inset-0 bg-[#f5f0e8]/75" />

          <div className="relative z-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-6 md:gap-10 items-center px-6 py-10 md:py-14">
          {/* Frase — queda abajo en móvil, izquierda en desktop */}
          <div className="text-center md:text-left">
            <p className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[var(--texto-principal)] font-semibold italic leading-tight mb-4">
              &ldquo;Vive la magia de la comida dietética&rdquo;
            </p>
            <p className="text-sm md:text-base text-[var(--texto-suave)]">
              María Luisa Nutricionista &nbsp;·&nbsp;
              <span className="font-semibold text-[var(--texto-principal)]">Universidad de San Marcos</span>
            </p>
          </div>
          {/* Imagen — queda arriba en móvil, derecha en desktop */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/images/marialuisa.png"
              alt="María Luisa Nutricionista"
              width={320}
              height={420}
              priority
              className="w-44 sm:w-56 md:w-72 lg:w-80 h-auto flotar drop-shadow-2xl pointer-events-none"
            />
          </div>
          </div>{/* fin grid interior */}
        </div>{/* fin bloque intro con fondo */}

        {/* ── LIBRO: imagen arriba en móvil, fila en desktop ── */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          {/* Imagen */}
          <div className="relative w-full max-w-[280px] sm:max-w-xs mx-auto md:mx-0 pb-4">
            <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-3 font-semibold flex items-center gap-2">
              <IcoBook cls="w-4 h-4" /> Nuevo lanzamiento
            </p>
            <div className="absolute inset-0 top-8 bg-gradient-to-br from-[var(--pinktone)] to-[var(--lime-soft)] rounded-2xl rotate-3 -z-0" />
            <div className="relative aspect-[3/4] rounded-2xl shadow-2xl shadow-pink-200 overflow-hidden border-4 border-white z-10">
              <Image
                src="/images/libro-portada.jpg"
                alt="Libro Nutrición del Bebé - Lic. María Luisa"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          {/* Info */}
          <div className="flex flex-col">
            <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight mb-3 text-[var(--texto-principal)]">
              Nutrición <span className="font-semibold shimmer-rose">del Bebé.</span>
            </h1>
            <p className="font-nunito text-sm text-[var(--texto-suave)] leading-relaxed mb-5">
              Guía de nutrición infantil <span className="text-[var(--lime)] font-semibold">preventiva</span> desde
              los 6 meses hasta el año de vida. Recientemente presentada en el Colegio de Nutricionistas del Perú.
            </p>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative bg-[var(--lime-soft)] border-2 border-[var(--lime)] rounded-2xl px-4 py-2.5 flex flex-col items-start halo-animado overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full" style={{animation:"shimmer-slide 2.5s ease-in-out infinite"}}/>
                <span className="text-xs uppercase tracking-widest text-[var(--lime)] font-bold mb-0.5 relative z-10">Versión digital</span>
                <span className="text-xl font-bold text-[var(--texto-principal)] relative z-10">Disponible online</span>
              </div>
            </div>
            <Link
              href="/comprar-libro/nutricion-del-bebe"
              className="btn-coquette bg-[var(--primrose)] text-white px-6 py-3 rounded-full hover:bg-[var(--primrose-hover)] transition font-medium shadow-lg shadow-pink-200 w-full md:w-fit text-center"
            >
              Ver y comprar el libro
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

function FilosofiaYServicios() {
  const servicios: { n: string; titulo: string; Ico: (p:{cls?:string})=>React.JSX.Element; desc: React.ReactNode }[] = [
    { n: "01", titulo: "Consulta nutricional", Ico: IcoChat,    desc: "Evaluación y plan personalizado, presencial o virtual." },
    { n: "02", titulo: "Nutrición deportiva",  Ico: IcoBlender, desc: <>Alimentación para <span className="text-[var(--lime)] font-semibold">ganar músculo y definir</span>.</> },
    { n: "03", titulo: "Libro digital",        Ico: IcoBook,    desc: "Guías prácticas de nutrición preventiva." },
    { n: "04", titulo: "Superalimentos",       Ico: IcoBowl,    desc: "Cúrcuma, sacha inchi, cacao y más en el catálogo." },
  ];

  return (
    <section id="sobre-mi" className="bg-[#f5f0e8] relative overflow-hidden">
      <FoodBg />
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-14 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--texto-principal)] mb-2 font-semibold flex items-center gap-2">
              <span className="text-[var(--lime)]">♥</span> Sobre mí
            </p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-[var(--texto-principal)]">
              Nutrición que <span className="text-[var(--lime)]">transforma.</span>
            </h2>
            {/* TODO: Reemplazar por el texto real de la clienta (enfoque fitness/deportivo). */}
            <div className="rounded-2xl border-2 border-[var(--lime)] bg-[var(--lime-soft)] p-5 md:p-6">
              <p className="text-xs uppercase tracking-widest text-[var(--lime)] font-semibold mb-2">Especialidad</p>
              <p className="font-nunito text-base md:text-lg text-[var(--texto-principal)] leading-relaxed">
                Nutricionista colegiada de la Universidad de San Marcos, con enfoque en
                <span className="font-semibold text-[var(--lime)]"> nutrición deportiva y preventiva</span>.
                Planes para gente de gimnasio que busca resultados reales.
              </p>
            </div>
          </div>
          <div id="servicios">
            <p className="text-sm uppercase tracking-widest text-[var(--texto-principal)] mb-2 font-semibold">Lo que ofrezco</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5 text-[var(--texto-principal)]">Cuatro <span className="font-semibold text-[var(--lime)]">pilares.</span></h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {servicios.map((item) => (
                <div key={item.n} className="p-5 rounded-2xl bg-white border-2 border-[var(--borde-verde)] transition hover:border-[var(--lime)] hover:shadow-md">
                  <p className="text-xs mb-2 font-semibold text-[var(--lime)]">{item.n}</p>
                  <div className="w-11 h-11 rounded-full bg-[var(--lime-soft)] flex items-center justify-center mb-3">
                    <item.Ico cls="w-5 h-5 text-[var(--lime)]" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm md:text-base text-[var(--texto-principal)]">{item.titulo}</h3>
                  <p className="font-nunito text-xs sm:text-sm text-[var(--texto-suave)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PLANES / ASESORÍAS (venta) ---------- */
function SeccionPlanes() {
  const WA = "51985577017";
  const planes: { titulo: string; desc: string; badge: string; destacado: boolean; href?: string; wa?: string; cta: string }[] = [
    { titulo: "Consulta nutricional", desc: "Evaluación completa y plan personalizado, presencial o virtual.", badge: "Más pedido", destacado: false, href: "/reservar-cita", cta: "Reservar cita" },
    { titulo: "Plan Fitness personalizado", desc: "Alimentación para ganar músculo o definir, según tu rutina de gym.", badge: "Fitness", destacado: true, wa: "¡Hola María Luisa! Quiero información sobre el Plan Fitness personalizado.", cta: "Lo quiero" },
    { titulo: "Asesoría deportiva mensual", desc: "Seguimiento continuo con ajustes y control por WhatsApp.", badge: "Mensual", destacado: false, wa: "¡Hola María Luisa! Quiero información sobre la Asesoría deportiva mensual.", cta: "Más información" },
  ];
  return (
    <section id="planes" className="bg-white py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">Planes y asesorías</p>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[var(--texto-principal)]">Elige tu <span className="text-[var(--lime)]">plan.</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {planes.map((p) => (
            <div key={p.titulo} className={`rounded-2xl p-6 flex flex-col border-2 transition hover:-translate-y-1 ${p.destacado ? "border-[var(--primrose)] bg-[var(--pinktone-soft)] shadow-lg shadow-pink-100" : "border-[var(--borde-verde)] bg-[var(--lime-soft)]"}`}>
              <span className={`self-start text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full mb-3 ${p.destacado ? "bg-[var(--primrose)] text-white" : "bg-white text-[var(--lime)]"}`}>{p.badge}</span>
              <h3 className="font-playfair text-xl font-bold text-[var(--texto-principal)] mb-2">{p.titulo}</h3>
              <p className="font-nunito text-sm text-[var(--texto-suave)] leading-relaxed mb-6 flex-1">{p.desc}</p>
              {p.href ? (
                <Link href={p.href} className="text-center bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] text-white text-sm font-semibold px-5 py-3 rounded-full transition">{p.cta}</Link>
              ) : (
                <a href={`https://wa.me/${WA}?text=${encodeURIComponent(p.wa!)}`} target="_blank" rel="noopener noreferrer" className="text-center bg-[var(--verde-fuerte)] hover:opacity-90 text-white text-sm font-semibold px-5 py-3 rounded-full transition">{p.cta}</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CATÁLOGO (destacados) ---------- */
type ProductoHome = { id: number; nombre: string; precio: number | null; imagen_url: string | null };
function SeccionCatalogo() {
  const [items, setItems] = useState<ProductoHome[]>([]);
  useEffect(() => {
    let vigente = true;
    const supabase = createClient();
    supabase.from("productos").select("id,nombre,precio,imagen_url").eq("activo", true).eq("destacado", true).order("orden", { ascending: true }).limit(4)
      .then(({ data }) => { if (!vigente) return; setItems((data as ProductoHome[]) ?? []); });
    return () => { vigente = false; };
  }, []);
  return (
    <section id="catalogo" className="bg-[var(--verde-fuerte)] py-12 md:py-16 relative overflow-hidden text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--lime-mid)] mb-2 font-semibold">Productos saludables</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold">Catálogo <span className="text-[var(--lime-mid)]">María Luisa.</span></h2>
          </div>
          <Link href="/productos" className="self-start md:self-auto bg-white text-[var(--verde-fuerte)] text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[var(--lime-soft)] transition">Ver catálogo completo</Link>
        </div>
        {items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden text-[var(--texto-principal)]">
                <div className="relative aspect-square bg-[var(--lime-soft)]">
                  {p.imagen_url && <Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-4" sizes="(max-width:768px) 50vw, 25vw" />}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{p.nombre}</h3>
                  {p.precio != null && <p className="font-nunito text-sm text-[var(--texto-suave)]">S/ {p.precio}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {

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

      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">

        {/* Firma institucional */}
        <div className="text-center mb-10">
          <Image
            src="/images/logoNutricion.png"
            alt="Logo María Luisa Nutricionista"
            width={80}
            height={80}
            className="w-14 h-14 mx-auto mb-3 object-contain drop-shadow-sm"
          />
          <p className="font-playfair text-xl sm:text-2xl text-white leading-snug max-w-xl mx-auto">
            Centro de Salud y Nutrición Preventivo María Luisa
          </p>
        </div>

        {/* Columnas info */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6.09 6.09l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.04z"/></svg>
              Contacto directo
            </h4>
            <a href="https://wa.me/51985577017" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-4 group mb-4 bg-[#25D366]/15 hover:bg-[#25D366]/30 border border-[#25D366]/40 rounded-2xl px-5 py-4 transition-all hover:scale-105">
              <span className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#25D366] whatsapp-pulse">
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.848L.057 23.885a.5.5 0 0 0 .612.612l6.037-1.475A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.618-.5-5.12-1.374l-.368-.214-3.814.932.95-3.718-.236-.385A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              </span>
              <div>
                <p className="text-xs text-white/60 font-nunito">Escríbenos por WhatsApp</p>
                <p className="font-bold text-white group-hover:text-[#25D366] transition text-lg">+51 985 577 017</p>
              </div>
            </a>
            <Link href="/reservar-cita" className="mt-4 inline-flex items-center gap-3 bg-[var(--primrose)] hover:bg-[var(--primrose-hover)] rounded-2xl px-5 py-4 transition-all hover:scale-105 text-white font-semibold">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Reservar una cita
            </Link>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold flex items-center gap-2">
              <IcoLeaf cls="w-3.5 h-3.5" /> Redes sociales
            </h4>
            <div className="space-y-3">
              <a href="https://www.facebook.com/marialuisa.penavaldivia?locale=es_LA" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <span className="w-11 h-11 rounded-xl bg-[#1877F2]/20 group-hover:bg-[#1877F2]/40 flex items-center justify-center transition-all group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="#1877F2" className="w-5 h-5"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                </span>
                <span className="font-nunito text-sm text-white/80 group-hover:text-white transition">Maria Luisa Peña Valdivia</span>
              </a>
              <a href="https://www.instagram.com/nutri.marialuisa.pe/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <span className="w-11 h-11 rounded-xl bg-[#E1306C]/20 group-hover:bg-[#E1306C]/40 flex items-center justify-center transition-all group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="#E1306C" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </span>
                <span className="font-nunito text-sm text-white/80 group-hover:text-white transition">nutri.marialuisa.pe</span>
              </a>
              <a href="https://www.tiktok.com/@maraluisanutricio?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <span className="w-11 h-11 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-all group-hover:scale-110">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.2 8.2 0 0 0 4.79 1.52V7.03a4.85 4.85 0 0 1-1.02-.34z"/></svg>
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
