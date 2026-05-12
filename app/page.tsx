"use client";

import { useState, useEffect } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Navbar />
      <Hero />
      <Carrusel />
      <Servicios />
      <LibroDestacado />
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
          <li><a href="#sobre-mi" className="hover:text-neutral-900 transition">Sobre mí</a></li>
          <li><a href="#servicios" className="hover:text-neutral-900 transition">Servicios</a></li>
          <li><a href="#libro" className="hover:text-neutral-900 transition">Libro</a></li>
          <li><a href="#contacto" className="hover:text-neutral-900 transition">Contacto</a></li>
        </ul>
        <a
          href="#contacto"
          className="text-sm border border-neutral-900 px-4 py-2 rounded-full hover:bg-neutral-900 hover:text-white transition"
        >
          Reservar cita
        </a>
      </div>
    </nav>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <p className="text-sm uppercase tracking-widest text-neutral-500 mb-6">
        Nutrición preventiva
      </p>
      <h1 className="text-5xl md:text-7xl font-light leading-tight tracking-tight">
        Cuidar tu cuerpo<br />
        <span className="font-semibold">en todas las etapas de la vida.</span>
      </h1>
      <p className="mt-8 text-lg text-neutral-600 max-w-2xl leading-relaxed">
        Lic. María Luisa — Nutricionista, autora y conferencista. Acompaño a personas
        y familias hacia una vida más saludable mediante la prevención nutricional.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#servicios"
          className="bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-700 transition"
        >
          Conoce mis servicios
        </a>
        <a
          href="#libro"
          className="border border-neutral-300 px-6 py-3 rounded-full hover:border-neutral-900 transition"
        >
          Ver el libro
        </a>
      </div>
    </section>
  );
}

/* ---------- CARRUSEL ---------- */
function Carrusel() {
  const slides = [
    {
      titulo: "Quién soy",
      contenido:
        "Soy nutricionista colegiada con amplia trayectoria en el sector público y privado. Mi enfoque está en la nutrición preventiva, acompañando a las personas desde la gestación hasta la adultez.",
    },
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
      titulo: "Objetivo — En los niños",
      contenido:
        "Elevar la estatura promedio de los peruanos con la dieta María Luisa y vencer a la genética tradicional con el poder de la ciencia de la nutrición, como lo han logrado países avanzados en nutrición.",
    },
    {
      titulo: "Objetivo — En los adultos",
      contenido:
        "Mejorar la calidad de vida saludable de la población económicamente activa del Perú y Latinoamérica.",
    },
  ];

  const [actual, setActual] = useState(0);

  // Auto-avance cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActual((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="sobre-mi" className="bg-neutral-50 py-24">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
          Conoce mi propuesta
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-12">
          Una mirada profesional <span className="font-semibold">a la nutrición.</span>
        </h2>

        <div className="relative bg-white border border-neutral-200 rounded-2xl p-10 md:p-16 min-h-[320px] flex flex-col justify-between">
          <div>
            <p className="text-sm text-neutral-500 mb-4">
              {String(actual + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">
              {slides[actual].titulo}
            </h3>
            <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl">
              {slides[actual].contenido}
            </p>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between mt-10">
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActual(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === actual ? "w-8 bg-neutral-900" : "w-4 bg-neutral-300"
                  }`}
                  aria-label={`Ir al slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActual((actual - 1 + slides.length) % slides.length)}
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition flex items-center justify-center"
                aria-label="Anterior"
              >
                ←
              </button>
              <button
                onClick={() => setActual((actual + 1) % slides.length)}
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition flex items-center justify-center"
                aria-label="Siguiente"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SERVICIOS ---------- */
function Servicios() {
  const items = [
    {
      n: "01",
      titulo: "Libros",
      desc: "Guías prácticas de nutrición preventiva para todas las etapas de la vida.",
    },
    {
      n: "02",
      titulo: "Talleres",
      desc: "Comida dietética, fácil, saludable y saciadora. Modalidad presencial y virtual.",
    },
    {
      n: "03",
      titulo: "Productos",
      desc: "Cúrcuma, sacha inchi, cacao orgánico y estevia de calidad seleccionada.",
    },
    {
      n: "04",
      titulo: "Consultorías",
      desc: "Asesorías personalizadas y elaboración de proyectos de nutrición.",
    },
  ];

  return (
    <section id="servicios" className="max-w-6xl mx-auto px-6 py-24">
      <p className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
        Lo que ofrezco
      </p>
      <h2 className="text-3xl md:text-4xl font-light mb-16">
        Cuatro pilares de mi <span className="font-semibold">práctica profesional.</span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200">
        {items.map((item) => (
          <div
            key={item.n}
            className="bg-white p-8 hover:bg-neutral-50 transition group cursor-default"
          >
            <p className="text-sm text-neutral-400 mb-6">{item.n}</p>
            <h3 className="text-xl font-semibold mb-3">{item.titulo}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- LIBRO DESTACADO ---------- */
function LibroDestacado() {
  return (
    <section id="libro" className="bg-neutral-900 text-white py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm uppercase tracking-widest text-neutral-400 mb-4">
            Publicación destacada
          </p>
          <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
            Nutrición<br />
            <span className="font-semibold">del Bebé</span>
          </h2>
          <p className="text-neutral-300 leading-relaxed mb-8">
            Una guía única y completa sobre nutrición infantil, fruto de años
            de experiencia profesional recorriendo el Perú. Recientemente
            presentado en el Colegio de Nutricionistas del Perú.
          </p>
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-3xl font-semibold">S/ 20</span>
            <span className="text-neutral-400 line-through">S/ 25</span>
          </div>
          <a
            href="#contacto"
            className="inline-block bg-white text-neutral-900 px-6 py-3 rounded-full hover:bg-neutral-200 transition"
          >
            Adquirir el libro
          </a>
        </div>
        <div className="border border-neutral-700 rounded-2xl p-12 aspect-[3/4] flex items-center justify-center text-neutral-500">
          [ Espacio para foto del libro ]
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
    <section className="max-w-6xl mx-auto px-6 py-24">
      <p className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
        Trayectoria
      </p>
      <h2 className="text-3xl md:text-4xl font-light mb-16">
        Más de dos décadas <span className="font-semibold">construyendo experiencia.</span>
      </h2>

      <div className="grid md:grid-cols-4 gap-8">
        {hitos.map((h, i) => (
          <div key={i} className="border-t border-neutral-900 pt-6">
            <p className="text-sm text-neutral-500 mb-2">{h.año}</p>
            <h3 className="font-semibold mb-2">{h.titulo}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{h.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer id="contacto" className="bg-neutral-50 border-t border-neutral-200 py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-semibold mb-3">María Luisa Nutricionista</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Nutrición preventiva para todas las etapas de la vida.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-neutral-500 mb-3">
            Contacto
          </h4>
          <ul className="text-sm space-y-2 text-neutral-700">
            <li>WhatsApp: por confirmar</li>
            <li>San Juan de Miraflores, Lima</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-neutral-500 mb-3">
            Síguenos
          </h4>
          <ul className="text-sm space-y-2 text-neutral-700">
            <li>Facebook</li>
            <li>TikTok</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-neutral-200 text-xs text-neutral-500">
        © {new Date().getFullYear()} María Luisa Nutricionista. Todos los derechos reservados.
      </div>
    </footer>
  );
}