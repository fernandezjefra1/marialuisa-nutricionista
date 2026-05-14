"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/use-user";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--yucca)] text-[var(--texto-principal)]">
      <Navbar />
      <HeroLibro />
      <CarruselImagenes />
      <FilosofiaYServicios />
      <SeccionProductos />
      <SeccionEmpresas />
      <ProximoTaller />
      <Trayectoria />
      <Footer />
    </main>
  );
}

/* ---------- NAVBAR ---------- */
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[var(--yucca-soft)]/95 backdrop-blur-sm border-b border-[var(--borde-rosa)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-[var(--texto-principal)]">
          María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
        </Link>
        <ul className="hidden md:flex gap-8 text-sm text-[var(--texto-suave)]">
  <li><a href="#libro" className="hover:text-[var(--primrose)] transition">Libro</a></li>
  <li><Link href="/productos" className="hover:text-[var(--primrose)] transition">Tienda</Link></li>
  <li><a href="#sobre-mi" className="hover:text-[var(--primrose)] transition">Sobre mí</a></li>
  <li><a href="#taller" className="hover:text-[var(--lime)] transition">Talleres</a></li>
  <li><Link href="/empresas" className="hover:text-[var(--lime)] transition">Empresas</Link></li>
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
          className="hidden sm:inline-block text-sm text-[var(--texto-suave)] hover:text-[var(--primrose)] px-3 py-2 transition"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/login?redirect=/comprar-libro"
          className="text-sm bg-[var(--primrose)] text-white px-4 py-2 rounded-full hover:bg-[var(--primrose-hover)] transition shadow-md shadow-pink-200"
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

/* ---------- HERO: LIBRO DESTACADO ---------- */
function HeroLibro() {
  return (
    <section id="libro" className="relative overflow-hidden bg-[var(--yucca)]">
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Texto */}
        <div className="order-2 md:order-1">
          <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold">
            Nuevo lanzamiento
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6 text-[var(--texto-principal)]">
            Nutrición<br />
            <span className="font-semibold text-[var(--primrose)]">del Bebé.</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--texto-suave)] leading-relaxed mb-6 max-w-lg">
            Una guía única en su tipo sobre nutrición infantil preventiva, fruto
            de años de experiencia profesional recorriendo todo el Perú.
            Recientemente presentada en el Colegio de Nutricionistas del Perú.
          </p>

          <ul className="space-y-1.5 mb-6 text-[var(--texto-principal)] text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[var(--primrose)] mt-0.5 font-bold">—</span>
              <span>Guía completa desde la gestación hasta los primeros años</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--lime)] mt-0.5 font-bold">—</span>
              <span>Recetas, planes alimentarios y consejos prácticos</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--primrose)] mt-0.5 font-bold">—</span>
              <span>Basado en evidencia y experiencia profesional</span>
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold text-[var(--texto-principal)]">S/ 20</span>
              <span className="text-[var(--texto-tenue)] line-through text-lg">S/ 25</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-white bg-[var(--lime)] px-3 py-1 rounded-full font-semibold shadow-md shadow-green-200">
              Edición disponible
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/comprar-libro"
              className="bg-[var(--primrose)] text-white px-8 py-4 rounded-full hover:bg-[var(--primrose-hover)] transition font-medium shadow-lg shadow-pink-200"
            >
              Adquirir el libro
            </Link>
            <a
              href="#sobre-mi"
              className="border-2 border-[var(--primrose)] text-[var(--primrose)] px-6 py-3 rounded-full hover:bg-[var(--pinktone-soft)] transition font-medium"
            >
              Conocer a la autora
            </a>
          </div>
        </div>

        {/* Portada del libro */}
        <div className="order-1 md:order-2 relative">
          <div className="relative max-w-md mx-auto">
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
            <div className="hidden md:block absolute -bottom-4 -left-4 bg-white border border-[var(--borde-rosa)] rounded-2xl p-4 shadow-lg shadow-pink-100 max-w-[200px]">
              <p className="text-xs text-[var(--primrose)] uppercase tracking-widest mb-1 font-semibold">
                Por
              </p>
              <p className="font-semibold text-sm text-[var(--texto-principal)]">Lic. María Luisa</p>
              <p className="text-xs text-[var(--texto-suave)]">Nutricionista colegiada</p>
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
    <section className="bg-[var(--pinktone-soft)] py-14 md:py-16">
      <div className="w-full px-4 md:px-8">
        <div className="max-w-6xl mx-auto mb-8">
          <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
            Trayectoria reciente
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[var(--texto-principal)]">
            Momentos que marcan <span className="font-semibold text-[var(--primrose)]">una carrera.</span>
          </h2>
        </div>

        {/* Carrusel SIN overlay opaco - fotos nítidas */}
        <div className="relative overflow-hidden rounded-3xl bg-black h-[300px] sm:h-[400px] md:h-[450px] shadow-xl shadow-pink-200 border-4 border-white">
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
              {/* Overlay solo abajo para el texto, mucho más sutil */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <h3 className="text-2xl md:text-3xl font-semibold mb-1 drop-shadow-lg">
                  {slide.titulo}
                </h3>
                <p className="text-sm md:text-base text-white/90 max-w-2xl drop-shadow-md">
                  {slide.descripcion}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={() => setActual((actual - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-[var(--primrose)] text-[var(--texto-principal)] hover:text-white flex items-center justify-center transition shadow-lg"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={() => setActual((actual + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-[var(--primrose)] text-[var(--texto-principal)] hover:text-white flex items-center justify-center transition shadow-lg"
            aria-label="Siguiente"
          >
            →
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActual(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === actual ? "w-8 bg-[var(--primrose)]" : "w-4 bg-white/70"
                }`}
                aria-label={`Ir al slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-[var(--texto-suave)] mt-3 text-right">
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
      color: "primrose",
    },
    {
      titulo: "Misión",
      contenido:
        "Cuidar el cuerpo humano con dietas María Luisa, escritas, cocinadas o envasadas, llegando a más familias cada día.",
      color: "lime",
    },
    {
      titulo: "Objetivo en los niños",
      contenido:
        "Elevar la estatura promedio de los peruanos con la dieta María Luisa y vencer a la genética tradicional con el poder de la ciencia de la nutrición, como lo han logrado países avanzados en nutrición.",
      color: "primrose",
    },
    {
      titulo: "Objetivo en los adultos",
      contenido:
        "Mejorar la calidad de vida saludable de la población económicamente activa del Perú y Latinoamérica.",
      color: "lime",
    },
  ];

  const servicios = [
    { n: "01", titulo: "Libros", desc: "Guías prácticas de nutrición preventiva.", color: "primrose" },
    { n: "02", titulo: "Talleres", desc: "Comida dietética, fácil y saciadora.", color: "lime" },
    { n: "03", titulo: "Productos", desc: "Cúrcuma, sacha inchi, cacao, estevia.", color: "lime" },
    { n: "04", titulo: "Consultorías", desc: "Asesorías personalizadas.", color: "primrose" },
  ];

  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <section id="sobre-mi" className="py-14 md:py-16 bg-[var(--yucca)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* IZQUIERDA: Filosofía con acordeón alternando colores */}
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
              Nuestra propuesta
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-[var(--texto-principal)]">
              Filosofía <span className="font-semibold text-[var(--lime)]">profesional.</span>
            </h2>

            <div className="space-y-2">
              {secciones.map((s, i) => {
                const esRosa = s.color === "primrose";
                const colorActivo = abierto === i;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl overflow-hidden transition-all border-2 ${
                      colorActivo
                        ? esRosa
                          ? "bg-[var(--pinktone-soft)] border-[var(--primrose)]"
                          : "bg-[var(--lime-soft)] border-[var(--lime)]"
                        : "bg-white border-[var(--borde-suave)]"
                    }`}
                  >
                    <button
                      onClick={() => setAbierto(abierto === i ? null : i)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left transition group"
                    >
                      <span className={`text-base md:text-lg font-medium transition ${
                        colorActivo
                          ? esRosa ? "text-[var(--primrose)]" : "text-[var(--lime)]"
                          : "text-[var(--texto-principal)]"
                      }`}>
                        {s.titulo}
                      </span>
                      <span
                        className={`text-2xl transition-transform duration-300 ${
                          colorActivo ? "rotate-45" : ""
                        } ${esRosa ? "text-[var(--primrose)]" : "text-[var(--lime)]"}`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        colorActivo
                          ? "grid-rows-[1fr] opacity-100 px-5 pb-4"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-[var(--texto-suave)] leading-relaxed">
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
            <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold">
              Lo que ofrezco
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-[var(--texto-principal)]">
              Cuatro <span className="font-semibold text-[var(--primrose)]">pilares.</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {servicios.map((item) => (
                <div
                  key={item.n}
                  className={`p-5 rounded-2xl border-2 transition cursor-default hover:scale-[1.02] ${
                    item.color === "primrose"
                      ? "bg-[var(--pinktone-soft)] border-[var(--borde-rosa)] hover:bg-[var(--pinktone)] hover:border-[var(--primrose)]"
                      : "bg-[var(--lime-soft)] border-[var(--borde-verde)] hover:border-[var(--lime)]"
                  }`}
                >
                  <p className={`text-xs mb-3 font-semibold ${
                    item.color === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"
                  }`}>{item.n}</p>
                  <h3 className="font-semibold mb-1.5 text-[var(--texto-principal)]">{item.titulo}</h3>
                  <p className="text-xs text-[var(--texto-suave)] leading-relaxed">{item.desc}</p>
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
    <section id="taller" className="bg-[var(--lime-soft)] py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Imagen con halo animado */}
          <div className="relative max-w-sm mx-auto md:mx-0 w-full">
            {/* Halo de fondo giratorio */}
            <div className="halo-fondo" />
            {/* Halo pulsante */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border-4 border-white shadow-2xl halo-animado">
              <Image
                src="/images/taller-dietetica.jpeg"
                alt="Taller de Comida Dietética"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold">
              Próximo evento
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight text-[var(--texto-principal)]">
              Taller de<br />
              <span className="font-semibold text-[var(--lime)]">Comida Dietética.</span>
            </h2>
            <p className="text-[var(--texto-suave)] leading-relaxed mb-6 text-sm md:text-base">
              Aprende a cocinar rico y saludable. Un taller práctico donde
              descubrirás cómo preparar comidas fáciles, saludables y saciadoras
              que transformarán tu día a día.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white border-2 border-[var(--primrose)] rounded-2xl p-4 shadow-md shadow-pink-100">
                <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-1 font-semibold">Presencial</p>
                <p className="text-2xl font-semibold text-[var(--texto-principal)]">S/ 80</p>
              </div>
              <div className="bg-white border-2 border-[var(--lime)] rounded-2xl p-4 shadow-md shadow-green-100">
                <p className="text-xs uppercase tracking-widest text-[var(--lime)] mb-1 font-semibold">Virtual</p>
                <p className="text-2xl font-semibold text-[var(--texto-principal)]">S/ 40</p>
              </div>
            </div>

            <ul className="text-sm text-[var(--texto-principal)] space-y-1.5 mb-6">
              <li className="flex items-start gap-2"><span className="text-[var(--lime)] font-bold">—</span> Degustación incluida</li>
              <li className="flex items-start gap-2"><span className="text-[var(--primrose)] font-bold">—</span> Materiales: taper, cubiertos, jabón y toalla</li>
              <li className="flex items-start gap-2"><span className="text-[var(--lime)] font-bold">—</span> Modalidad presencial y virtual</li>
            </ul>

            <Link
              href="/login"
              className="inline-block bg-[var(--lime)] text-white px-6 py-3 rounded-full hover:bg-[var(--lime-hover)] transition font-medium shadow-lg shadow-green-200"
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
    { año: "Años de carrera", titulo: "Trabajo en MINSA", desc: "Recorrido por todas las regiones del Perú como nutricionista.", color: "primrose" },
    { año: "Experiencia", titulo: "Sector público", desc: "Trabajo en SENA y diversas instituciones de salud.", color: "lime" },
    { año: "Reciente", titulo: "Conferencista", desc: "Presentación en el Colegio de Nutricionistas del Perú.", color: "primrose" },
    { año: "Hoy", titulo: "Práctica privada", desc: "Enfoque en prevención y nutrición personalizada.", color: "lime" },
  ];

  return (
    <section className="py-14 md:py-16 bg-[var(--yucca-soft)]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
          Trayectoria
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-10 text-[var(--texto-principal)]">
          Más de dos décadas <span className="font-semibold text-[var(--lime)]">construyendo experiencia.</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {hitos.map((h, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-5 shadow-md border-t-4 transition hover:-translate-y-1 ${
                h.color === "primrose"
                  ? "border-[var(--primrose)] shadow-pink-100"
                  : "border-[var(--lime)] shadow-green-100"
              }`}
            >
              <p className={`text-xs mb-2 uppercase tracking-widest font-semibold ${
                h.color === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"
              }`}>{h.año}</p>
              <h3 className="font-semibold mb-1.5 text-[var(--texto-principal)]">{h.titulo}</h3>
              <p className="text-sm text-[var(--texto-suave)] leading-relaxed">{h.desc}</p>
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
    <footer id="contacto" className="bg-[var(--texto-principal)] text-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-semibold mb-2">
            María Luisa <span className="text-[var(--primrose)]">Nutricionista</span>
          </h3>
          <p className="text-sm text-pink-100/70 leading-relaxed">
            Nutrición preventiva para todas las etapas de la vida.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-3 font-semibold">
            Contacto
          </h4>
          <ul className="text-sm space-y-1.5 text-pink-50">
            <li>
              <a href="https://wa.me/51985577017" target="_blank">
                  WhatsApp: 959 560 616
              </a>
              </li>
            <li>San Juan de Miraflores, Lima</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-[var(--lime-mid)] mb-3 font-semibold">
            Síguenos
          </h4>
          <ul className="text-sm space-y-1.5 text-pink-50">
            <li>Facebook</li>
            <li>
              <a
                href="https://www.tiktok.com/@maraluisanutricio?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--primrose)] transition"
              >
                TikTok: MaríaLuisaNutricionista
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-pink-100/20 text-xs text-pink-100/50">
        © {new Date().getFullYear()} María Luisa Nutricionista. Todos los derechos reservados.
      </div>
    </footer>

  );
}
/* ---------- SECCIÓN PRODUCTOS DESTACADOS ---------- */
function SeccionProductos() {
  const productos = [
    { nombre: "Harina de Cúrcuma", precio: 15, descripcion: "Libre de gluten · 250 gr", color: "primrose" },
    { nombre: "Salvado de Trigo", precio: 12, descripcion: "100% Fibra Natural · 500 gr", color: "lime" },
    { nombre: "Sacha Inchi", precio: 25, descripcion: "Omega-3 y proteínas · 250 gr", color: "primrose" },
    { nombre: "Cacao Orgánico", precio: 20, descripcion: "Sin azúcar añadida · 200 gr", color: "lime" },
  ];

  return (
    <section id="tienda" className="py-14 md:py-16 bg-[var(--pinktone-soft)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--primrose)] mb-2 font-semibold">
              Nuestra tienda
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[var(--texto-principal)]">
              Productos <span className="font-semibold text-[var(--primrose)]">naturales.</span>
            </h2>
            <p className="text-[var(--texto-suave)] mt-2 text-sm md:text-base max-w-lg">
              Superalimentos, harinas y suplementos cuidadosamente seleccionados.
            </p>
          </div>
          <Link
            href="/productos"
            className="text-sm border-2 border-[var(--primrose)] text-[var(--primrose)] px-5 py-2.5 rounded-full hover:bg-[var(--primrose)] hover:text-white transition font-medium w-fit"
          >
            Ver tienda completa →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {productos.map((p, i) => (
            <Link
              key={i}
              href="/productos"
              className="bg-white rounded-2xl border-2 border-[var(--borde-rosa)] p-5 hover:border-[var(--primrose)] hover:shadow-lg hover:shadow-pink-200 hover:-translate-y-1 transition group"
            >
              <div className={`aspect-square rounded-xl mb-4 flex items-center justify-center text-4xl ${
                p.color === "primrose" ? "bg-[var(--pinktone-soft)]" : "bg-[var(--lime-soft)]"
              }`}>
                <span className={p.color === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"}>
                  ◇
                </span>
              </div>
              <p className={`text-xs uppercase tracking-widest mb-1 font-semibold ${
                p.color === "primrose" ? "text-[var(--primrose)]" : "text-[var(--lime)]"
              }`}>
                Destacado
              </p>
              <h3 className="font-semibold text-[var(--texto-principal)] mb-1 text-sm">{p.nombre}</h3>
              <p className="text-xs text-[var(--texto-suave)] mb-3 leading-relaxed">{p.descripcion}</p>
              <p className="text-lg font-semibold text-[var(--texto-principal)]">S/ {p.precio}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ---------- SECCIÓN EMPRESAS ---------- */
function SeccionEmpresas() {
  return (
    <section className="py-14 md:py-16 bg-gradient-to-br from-[var(--lime-soft)] via-[var(--yucca)] to-[var(--pinktone-soft)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--lime)] mb-2 font-semibold">
              Para empresas
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight text-[var(--texto-principal)]">
              Bienestar nutricional<br />
              <span className="font-semibold text-[var(--lime)]">para tu equipo.</span>
            </h2>
            <p className="text-[var(--texto-suave)] leading-relaxed mb-6 text-sm md:text-base">
              Programa corporativo de evaluación nutricional con la Hoja de Levantamiento
              Nutricional, charlas y planes personalizados para cada colaborador.
              Mejora el rendimiento, reduce el ausentismo y cuida a tu equipo.
            </p>

            <ul className="text-sm text-[var(--texto-principal)] space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[var(--primrose)] font-bold">—</span>
                Evaluación individual a cada colaborador
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--lime)] font-bold">—</span>
                Charlas y talleres in-company
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primrose)] font-bold">—</span>
                Profesional colegiada con experiencia
              </li>
            </ul>

            <Link
              href="/empresas"
              className="inline-block bg-[var(--lime)] text-white px-6 py-3 rounded-full hover:bg-[var(--lime-hover)] transition font-medium shadow-lg shadow-green-200"
            >
              Conocer el programa
            </Link>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-green-100 border-2 border-[var(--borde-verde)]">
              <p className="text-xs uppercase tracking-widest text-[var(--primrose)] mb-4 font-semibold">
                Empresas que confían
              </p>
              <p className="text-2xl font-light text-[var(--texto-principal)] mb-2 leading-relaxed">
                &quot;Más de <span className="font-semibold text-[var(--lime)]">20 años</span> recorriendo
                el Perú evaluando nutricionalmente a familias y trabajadores.&quot;
              </p>
              <p className="text-sm text-[var(--texto-suave)] mt-4">
                — Lic. María Luisa Peña Valdivia, Nutricionista colegiada
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[var(--borde-rosa)]">
                <div>
                  <p className="text-2xl font-semibold text-[var(--primrose)]">20+</p>
                  <p className="text-xs text-[var(--texto-suave)]">Años de experiencia</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--lime)]">100%</p>
                  <p className="text-xs text-[var(--texto-suave)]">Personalizado</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--primrose)]">B2B</p>
                  <p className="text-xs text-[var(--texto-suave)]">Servicio empresarial</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}