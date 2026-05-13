"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/use-user";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#5a3a3a]">
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
    <nav className="sticky top-0 z-50 bg-[#fdcfd4]/70 backdrop-blur-sm border-b border-[#edaab3]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-[#5a3a3a]">
          María Luisa <span className="text-[#edaab3]">Nutricionista</span>
        </Link>
        <ul className="hidden md:flex gap-8 text-sm text-[#c97d8a]">
          <li><a href="#libro" className="hover:text-[#5a3a3a] transition">Libro</a></li>
          <li><a href="#sobre-mi" className="hover:text-[#5a3a3a] transition">Sobre mí</a></li>
          <li><a href="#servicios" className="hover:text-[#5a3a3a] transition">Servicios</a></li>
          <li><a href="#taller" className="hover:text-[#5a3a3a] transition">Talleres</a></li>
        </ul>
        <MenuUsuario />
      </div>
    </nav>
  );
}

/* ---------- MENÚ DEL USUARIO ---------- */
function MenuUsuario() {
  const { user, nombre, signOut, loading } = useUser();
  const [abierto, setAbierto] = useState(false);

  if (loading) {
    return <div className="w-24 h-9" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="hidden sm:inline-block text-sm text-[#c97d8a] hover:text-[#5a3a3a] px-3 py-2 transition"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/login?redirect=/comprar-libro"
          className="text-sm border border-[#edaab3] text-[#edaab3] px-4 py-2 rounded-full hover:bg-[#edaab3] hover:text-white transition"
        >
          Reservar cita
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
        className="flex items-center gap-3 hover:bg-[#fdcfd4]/50 rounded-full pl-1 pr-3 py-1 transition"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={nombre}
            className="w-8 h-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#edaab3] text-white text-xs font-semibold flex items-center justify-center">
            {iniciales}
          </div>
        )}
        <span className="text-sm font-medium hidden sm:inline text-[#5a3a3a]">{nombre.split(" ")[0]}</span>
        <svg
          className={`w-3.5 h-3.5 text-[#edaab3] transition-transform ${abierto ? "rotate-180" : ""}`}
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
          <div className="fixed inset-0 z-40" onClick={() => setAbierto(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-[#fdcfd4] rounded-2xl shadow-lg z-50 overflow-hidden">
            <div className="p-4 border-b border-[#fdcfd4]">
              <p className="text-sm font-semibold truncate text-[#5a3a3a]">{nombre}</p>
              <p className="text-xs text-[#c97d8a] truncate">{user.email}</p>
            </div>
            <div className="py-1">
              <Link href="/perfil" onClick={() => setAbierto(false)} className="block px-4 py-2.5 text-sm hover:bg-[#fff5f6] transition text-[#5a3a3a]">
                Mi perfil
              </Link>
              <Link href="/perfil?tab=compras" onClick={() => setAbierto(false)} className="block px-4 py-2.5 text-sm hover:bg-[#fff5f6] transition text-[#5a3a3a]">
                Mis compras
              </Link>
              <Link href="/perfil?tab=fidelizacion" onClick={() => setAbierto(false)} className="block px-4 py-2.5 text-sm hover:bg-[#fff5f6] transition text-[#5a3a3a]">
                Programa de fidelización
              </Link>
            </div>
            <div className="border-t border-[#fdcfd4] py-1">
              <button
                onClick={async () => {
                  await signOut();
                  setAbierto(false);
                  window.location.href = "/";
                }}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-50 transition"
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

/* ---------- HERO: LIBRO DESTACADO ---------- */
function HeroLibro() {
  return (
    <section id="libro" className="relative overflow-hidden bg-gradient-to-br from-white via-[#fff5f6] to-[#fdcfd4]">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="order-2 md:order-1">
          <p className="text-sm uppercase tracking-widest text-[#edaab3] mb-4">
            Nuevo lanzamiento
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6 text-[#5a3a3a]">
            Nutrición<br />
            <span className="font-semibold text-[#809d47]">del Bebé.</span>
          </h1>
          <p className="text-base md:text-lg text-[#9a6e6e] leading-relaxed mb-6 max-w-lg">
            Una guía única en su tipo sobre nutrición infantil preventiva, fruto
            de años de experiencia profesional recorriendo todo el Perú.
            Recientemente presentada en el Colegio de Nutricionistas del Perú.
          </p>

          <ul className="space-y-1.5 mb-6 text-[#9a6e6e] text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[#edaab3] mt-0.5">—</span>
              <span>Guía completa desde la gestación hasta los primeros años</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#edaab3] mt-0.5">—</span>
              <span>Recetas, planes alimentarios y consejos prácticos</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#edaab3] mt-0.5">—</span>
              <span>Basado en evidencia y experiencia profesional</span>
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold text-[#809d47]">S/ 20</span>
              <span className="text-[#c9a0a0] line-through text-lg">S/ 25</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-[#809d47] bg-[#eaf3de] px-3 py-1 rounded-full">
              Edición disponible
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/comprar-libro"
              className="bg-[#edaab3] text-white px-8 py-4 rounded-full hover:bg-[#c97d8a] transition font-medium"
            >
              Adquirir el libro
            </Link>
            <a
              href="#sobre-mi"
              className="border border-[#afc28a] text-[#809d47] px-6 py-3 rounded-full hover:border-[#809d47] hover:bg-[#eaf3de] transition"
            >
              Conocer a la autora
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2 relative">
          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#fdcfd4] to-[#edaab3]/40 rounded-2xl rotate-3" />
            <div className="relative aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden">
              <Image
                src="/images/libro-portada.jpg"
                alt="Libro Nutrición del Bebé - Lic. María Luisa"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden md:block absolute -bottom-4 -left-4 bg-white border border-[#fdcfd4] rounded-2xl p-4 shadow-lg max-w-[200px]">
              <p className="text-xs text-[#edaab3] uppercase tracking-widest mb-1">Por</p>
              <p className="font-semibold text-sm text-[#5a3a3a]">Lic. María Luisa</p>
              <p className="text-xs text-[#9a6e6e]">Nutricionista colegiada</p>
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
    <section className="bg-[#fff9fa] py-14 md:py-16">
      <div className="w-full px-4 md:px-8">
        <div className="max-w-6xl mx-auto mb-8">
          <p className="text-sm uppercase tracking-widest text-[#edaab3] mb-2">
            Trayectoria reciente
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[#5a3a3a]">
            Momentos que marcan <span className="font-semibold text-[#809d47]">una carrera.</span>
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#5a3a3a] h-[300px] sm:h-[400px] md:h-[450px]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#5a3a3a]/80 via-[#5a3a3a]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <h3 className="text-2xl md:text-3xl font-semibold mb-1">{slide.titulo}</h3>
                <p className="text-sm md:text-base text-[#fdcfd4] max-w-2xl">{slide.descripcion}</p>
              </div>
            </div>
          ))}

          <button
            onClick={() => setActual((actual - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#edaab3]/40 backdrop-blur-sm hover:bg-[#edaab3]/70 text-white flex items-center justify-center transition"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={() => setActual((actual + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#edaab3]/40 backdrop-blur-sm hover:bg-[#edaab3]/70 text-white flex items-center justify-center transition"
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
                  i === actual ? "w-8 bg-[#fdcfd4]" : "w-4 bg-[#fdcfd4]/50"
                }`}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[#edaab3] mt-3 text-right">
            {String(actual + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- FILOSOFÍA + SERVICIOS ---------- */
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
    <section id="sobre-mi" className="py-14 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#edaab3] mb-2">
              Nuestra propuesta
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-[#5a3a3a]">
              Filosofía <span className="font-semibold text-[#809d47]">profesional.</span>
            </h2>

            <div className="divide-y divide-[#fdcfd4] border-t border-b border-[#fdcfd4]">
              {secciones.map((s, i) => (
                <div key={i}>
                  <button
                    onClick={() => setAbierto(abierto === i ? null : i)}
                    className="w-full py-4 flex items-center justify-between text-left hover:text-[#edaab3] transition group"
                  >
                    <span className="text-lg md:text-xl font-light text-[#5a3a3a] group-hover:text-[#edaab3] transition">
                      {s.titulo}
                    </span>
                    <span
                      className={`text-xl text-[#edaab3] transition-transform duration-300 ${
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
                      <p className="text-sm text-[#9a6e6e] leading-relaxed">{s.contenido}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="servicios">
            <p className="text-sm uppercase tracking-widest text-[#edaab3] mb-2">
              Lo que ofrezco
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-[#5a3a3a]">
              Cuatro <span className="font-semibold text-[#809d47]">pilares.</span>
            </h2>

            <div className="grid grid-cols-2 gap-px bg-[#fdcfd4] border border-[#fdcfd4]">
              {servicios.map((item) => (
                <div
                  key={item.n}
                  className="bg-white p-5 hover:bg-[#fff5f6] transition cursor-default"
                >
                  <p className="text-xs text-[#edaab3] mb-3">{item.n}</p>
                  <h3 className="font-semibold mb-1.5 text-[#5a3a3a]">{item.titulo}</h3>
                  <p className="text-xs text-[#9a6e6e] leading-relaxed">{item.desc}</p>
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
    <section id="taller" className="bg-[#fdcfd4]/30 py-14 md:py-16">
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
            <p className="text-sm uppercase tracking-widest text-[#edaab3] mb-2">
              Próximo evento
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight text-[#5a3a3a]">
              Taller de<br />
              <span className="font-semibold text-[#809d47]">Comida Dietética.</span>
            </h2>
            <p className="text-[#9a6e6e] leading-relaxed mb-6 text-sm md:text-base">
              Aprende a cocinar rico y saludable. Un taller práctico donde
              descubrirás cómo preparar comidas fáciles, saludables y saciadoras
              que transformarán tu día a día.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border-t-2 border-[#edaab3] pt-3">
                <p className="text-xs uppercase tracking-widest text-[#c97d8a] mb-1">Presencial</p>
                <p className="text-2xl font-semibold text-[#5a3a3a]">S/ 80</p>
              </div>
              <div className="border-t-2 border-[#afc28a] pt-3">
                <p className="text-xs uppercase tracking-widest text-[#809d47] mb-1">Virtual</p>
                <p className="text-2xl font-semibold text-[#5a3a3a]">S/ 40</p>
              </div>
            </div>

            <ul className="text-sm text-[#9a6e6e] space-y-1.5 mb-6">
              <li>— Degustación incluida</li>
              <li>— Materiales: taper, cubiertos, jabón y toalla</li>
              <li>— Modalidad presencial y virtual</li>
            </ul>

            <Link
              href="/login"
              className="inline-block bg-[#809d47] text-white px-6 py-3 rounded-full hover:bg-[#5e7a32] transition"
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
    <section className="py-14 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm uppercase tracking-widest text-[#edaab3] mb-2">
          Trayectoria
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-10 text-[#5a3a3a]">
          Más de dos décadas <span className="font-semibold text-[#809d47]">construyendo experiencia.</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {hitos.map((h, i) => (
            <div key={i} className="border-t-2 border-[#edaab3] pt-4">
              <p className="text-xs text-[#c97d8a] mb-2 uppercase tracking-widest">{h.año}</p>
              <h3 className="font-semibold mb-1.5 text-[#5a3a3a]">{h.titulo}</h3>
              <p className="text-sm text-[#9a6e6e] leading-relaxed">{h.desc}</p>
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
    <footer id="contacto" className="bg-[#5a3a3a] text-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-semibold mb-2 text-[#fdcfd4]">María Luisa Nutricionista</h3>
          <p className="text-sm text-[#edaab3]/70 leading-relaxed">
            Nutrición preventiva para todas las etapas de la vida.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#edaab3] mb-3">
            Contacto
          </h4>
          <ul className="text-sm space-y-1.5 text-[#fdcfd4]/80">
            <li>WhatsApp: 959 560 616</li>
            <li>SJM, Limaaaaa</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[#edaab3] mb-3">
            Síguenos
          </h4>
          <ul className="text-sm space-y-1.5 text-[#fdcfd4]/80">
            <li>Facebook</li>
            <li>
              <a href="https://www.tiktok.com/@maraluisanutricio?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="hover:text-[#fdcfd4] transition">
                TikTok: Maríaluisanutricionista
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-[#edaab3]/30 text-xs text-[#edaab3]/60">
        © {new Date().getFullYear()} María Luisa Nutricionista. Todos los derechos reservados.
      </div>
    </footer>
  );
}