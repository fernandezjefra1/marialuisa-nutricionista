"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Navbar />
      <HeroLibro />
      <CarruselImagenes />
      <FilosofiaYServicios />
      <ProximoTaller />
      <Trayectoria />
      <Footer />
    </main>
  );
}

/* ---------- NAVBAR ---------- */
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-semibold tracking-tight">
          María Luisa <span className="text-neutral-500">Nutricionista</span>
        </div>
        <ul className="hidden md:flex gap-8 text-sm text-neutral-600">
          <li><a href="#libro" className="hover:text-neutral-900 transition">Libro</a></li>
          <li><a href="#sobre-mi" className="hover:text-neutral-900 transition">Sobre mí</a></li>
          <li><a href="#servicios" className="hover:text-neutral-900 transition">Servicios</a></li>
          <li><a href="#taller" className="hover:text-neutral-900 transition">Talleres</a></li>
          <li><a href="#contacto" className="hover:text-neutral-900 transition">Contacto</a></li>
        </ul>
        <Link
  href="/login"
  className="text-sm border border-neutral-900 px-4 py-2 rounded-full hover:bg-neutral-900 hover:text-white transition"
>
  Reservar cita
</Link>
      </div>
    </nav>
  );
}

/* ---------- HERO: LIBRO DESTACADO ---------- */
function HeroLibro() {
  return (
    <section id="libro" className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Texto */}
        <div className="order-2 md:order-1">
          <p className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
            Nuevo lanzamiento
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6">
            Nutrición<br />
            <span className="font-semibold">del Bebé.</span>
          </h1>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-6 max-w-lg">
            Una guía única en su tipo sobre nutrición infantil preventiva, fruto
            de años de experiencia profesional recorriendo todo el Perú.
            Recientemente presentada en el Colegio de Nutricionistas del Perú.
          </p>

          <ul className="space-y-1.5 mb-6 text-neutral-700 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-neutral-900 mt-0.5">—</span>
              <span>Guía completa desde la gestación hasta los primeros años</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-neutral-900 mt-0.5">—</span>
              <span>Recetas, planes alimentarios y consejos prácticos</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-neutral-900 mt-0.5">—</span>
              <span>Basado en evidencia y experiencia profesional</span>
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold">S/ 20</span>
              <span className="text-neutral-400 line-through text-lg">S/ 25</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full">
              Edición disponible
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
  href="/login"
  className="bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-700 transition font-medium"
>
  Adquirir el libro
</Link>
            <a
              href="#sobre-mi"
              className="border border-neutral-300 px-6 py-3 rounded-full hover:border-neutral-900 transition"
            >
              Conocer a la autora
            </a>
          </div>
        </div>

        {/* Portada del libro */}
        <div className="order-1 md:order-2 relative">
          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl rotate-3" />
            <div className="relative aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden">
              <Image
                src="/images/libro-portada.jpg"
                alt="Libro Nutrición del Bebé - Lic. María Luisa"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden md:block absolute -bottom-4 -left-4 bg-white border border-neutral-200 rounded-2xl p-4 shadow-lg max-w-[200px]">
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-1">
                Por
              </p>
              <p className="font-semibold text-sm">Lic. María Luisa</p>
              <p className="text-xs text-neutral-600">Nutricionista colegiada</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CARRUSEL DE IMÁGENES ---------- */
function CarruselImagenes() {
  const slides = [
    {
      imagen: "/images/conferencia-1.jpeg",
      titulo: "Conferencia en el Colegio de Nutricionistas",
      descripcion: "Presentación oficial del libro 'Nutrición del Bebé' ante colegas del sector.",
      ajuste: "cover",
    },
    {
      imagen: "/images/conferencia-grupo.jpeg",
      titulo: "Compartiendo conocimiento",
      descripcion: "Profesionales y asistentes recibiendo el libro durante la conferencia.",
      ajuste: "cover",
    },
    {
      imagen: "/images/taller-dietetica.jpeg",
      titulo: "Taller de Comida Dietética",
      descripcion: "Aprende a cocinar rico y saludable. Modalidad presencial y virtual.",
      ajuste: "contain",
    },
  ];

  const [actual, setActual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActual((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="bg-neutral-50 py-14 md:py-16">
      <div className="w-full px-4 md:px-8">
        <div className="max-w-6xl mx-auto mb-8">
          <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
            Trayectoria reciente
          </p>
          <h2 className="text-3xl md:text-4xl font-light">
            Momentos que marcan <span className="font-semibold">una carrera.</span>
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-neutral-900 h-[300px] sm:h-[400px] md:h-[450px]">
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === actual ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.imagen}
                alt={slide.titulo}
                fill
                className={slide.ajuste === "contain" ? "object-contain" : "object-cover"}
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <h3 className="text-2xl md:text-3xl font-semibold mb-1">
                  {slide.titulo}
                </h3>
                <p className="text-sm md:text-base text-neutral-200 max-w-2xl">
                  {slide.descripcion}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={() => setActual((actual - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white flex items-center justify-center transition"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={() => setActual((actual + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white flex items-center justify-center transition"
            aria-label="Siguiente"
          >
            →
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActual(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === actual ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-neutral-500 mt-3 text-right">
            {String(actual + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- FILOSOFÍA + SERVICIOS (fusionados) ---------- */
function FilosofiaYServicios() {
  const secciones = [
    {
      titulo: "Visión",
      contenido:
        "Promover y vender servicios y productos nutricionales dedicados a la nutrición preventiva en todas las etapas de la vida.",
    },
    {
      titulo: "Misión",
      contenido:
        "Cuidar el cuerpo humano con dietas María Luisa, escritas, cocinadas o envasadas, llegando a más familias cada día.",
    },
    {
      titulo: "Objetivo en los niños",
      contenido:
        "Elevar la estatura promedio de los peruanos con la dieta María Luisa y vencer a la genética tradicional con el poder de la ciencia de la nutrición, como lo han logrado países avanzados en nutrición.",
    },
    {
      titulo: "Objetivo en los adultos",
      contenido:
        "Mejorar la calidad de vida saludable de la población económicamente activa del Perú y Latinoamérica.",
    },
  ];

  const servicios = [
    { n: "01", titulo: "Libros", desc: "Guías prácticas de nutrición preventiva." },
    { n: "02", titulo: "Talleres", desc: "Comida dietética, fácil y saciadora." },
    { n: "03", titulo: "Productos", desc: "Cúrcuma, sacha inchi, cacao, estevia." },
    { n: "04", titulo: "Consultorías", desc: "Asesorías personalizadas." },
  ];

  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <section id="sobre-mi" className="py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* IZQUIERDA: Filosofía */}
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
              Nuestra propuesta
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Filosofía <span className="font-semibold">profesional.</span>
            </h2>

            <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
              {secciones.map((s, i) => (
                <div key={i}>
                  <button
                    onClick={() => setAbierto(abierto === i ? null : i)}
                    className="w-full py-4 flex items-center justify-between text-left hover:text-neutral-600 transition group"
                  >
                    <span className="text-lg md:text-xl font-light group-hover:font-normal transition">
                      {s.titulo}
                    </span>
                    <span
                      className={`text-xl transition-transform duration-300 ${
                        abierto === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-in-out ${
                      abierto === i
                        ? "grid-rows-[1fr] opacity-100 pb-4"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {s.contenido}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DERECHA: Servicios */}
          <div id="servicios">
            <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
              Lo que ofrezco
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Cuatro <span className="font-semibold">pilares.</span>
            </h2>

            <div className="grid grid-cols-2 gap-px bg-neutral-200 border border-neutral-200">
              {servicios.map((item) => (
                <div
                  key={item.n}
                  className="bg-white p-5 hover:bg-neutral-50 transition cursor-default"
                >
                  <p className="text-xs text-neutral-400 mb-3">{item.n}</p>
                  <h3 className="font-semibold mb-1.5">{item.titulo}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PRÓXIMO TALLER ---------- */
function ProximoTaller() {
  return (
    <section id="taller" className="bg-neutral-50 py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[3/4] max-w-sm mx-auto md:mx-0 w-full">
            <Image
              src="/images/taller-dietetica.jpeg"
              alt="Taller de Comida Dietética"
              fill
              className="object-contain rounded-2xl"
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
              Próximo evento
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight">
              Taller de<br />
              <span className="font-semibold">Comida Dietética.</span>
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-6 text-sm md:text-base">
              Aprende a cocinar rico y saludable. Un taller práctico donde
              descubrirás cómo preparar comidas fáciles, saludables y saciadoras
              que transformarán tu día a día.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border-t border-neutral-900 pt-3">
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Presencial</p>
                <p className="text-2xl font-semibold">S/ 80</p>
              </div>
              <div className="border-t border-neutral-300 pt-3">
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Virtual</p>
                <p className="text-2xl font-semibold">S/ 40</p>
              </div>
            </div>

            <ul className="text-sm text-neutral-700 space-y-1.5 mb-6">
              <li>— Degustación incluida</li>
              <li>— Materiales: taper, cubiertos, jabón y toalla</li>
              <li>— Modalidad presencial y virtual</li>
            </ul>

            <Link
  href="/login"
  className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-700 transition"
>
  Reservar cupo
</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- TRAYECTORIA ---------- */
function Trayectoria() {
  const hitos = [
    { año: "Años de carrera", titulo: "Trabajo en MINSA", desc: "Recorrido por todas las regiones del Perú como nutricionista." },
    { año: "Experiencia", titulo: "Sector público", desc: "Trabajo en SENA y diversas instituciones de salud." },
    { año: "Reciente", titulo: "Conferencista", desc: "Presentación en el Colegio de Nutricionistas del Perú." },
    { año: "Hoy", titulo: "Práctica privada", desc: "Enfoque en prevención y nutrición personalizada." },
  ];

  return (
    <section className="py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm uppercase tracking-widest text-neutral-500 mb-2">
          Trayectoria
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-10">
          Más de dos décadas <span className="font-semibold">construyendo experiencia.</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {hitos.map((h, i) => (
            <div key={i} className="border-t border-neutral-900 pt-4">
              <p className="text-xs text-neutral-500 mb-2 uppercase tracking-widest">{h.año}</p>
              <h3 className="font-semibold mb-1.5">{h.titulo}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer id="contacto" className="bg-neutral-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-semibold mb-2">María Luisa Nutricionista</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Nutrición preventiva para todas las etapas de la vida.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
            Contacto
          </h4>
          <ul className="text-sm space-y-1.5 text-neutral-300">
            <li>WhatsApp: 985 577 017</li>
            <li>San Juan de Miraflores, Lima</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
            Síguenos
          </h4>
          <ul className="text-sm space-y-1.5 text-neutral-300">
            <li>Facebook</li>
            <li>TikTok</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-neutral-800 text-xs text-neutral-500">
        © {new Date().getFullYear()} María Luisa Nutricionista. Todos los derechos reservados.
      </div>
    </footer>
  );
}