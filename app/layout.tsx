import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import WhatsAppFlotante from "@/components/WhatsAppFlotante";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marialuisanutricionista.com"),
  alternates: { canonical: "/" },
  title: {
    default: "María Luisa Nutricionista | Nutrición deportiva y preventiva en Lima",
    template: "%s | María Luisa Nutricionista",
  },
  description:
    "Nutricionista colegiada con 20+ años de experiencia. Planes de alimentación deportiva para ganancia muscular, definición y rendimiento en San Juan de Miraflores, Lima. Atención presencial y virtual.",
  keywords: [
    "nutricionista deportiva Lima",
    "nutricionista Lima",
    "nutricionista San Juan de Miraflores",
    "nutrición deportiva Perú",
    "plan alimentación gimnasio",
    "ganancia muscular nutrición",
    "definición muscular dieta",
    "María Luisa Peña Valdivia",
    "consulta nutricional Lima",
    "dieta María Luisa",
    "alimentación saludable Lima",
    "calculadora IMC",
    "constancia nutricional",
    "examen médico ocupacional",
    "evaluación nutricional Perú",
    "certificado nutricional laboral",
  ],
  authors: [{ name: "María Luisa Peña Valdivia" }],
  creator: "María Luisa Nutricionista",
  publisher: "María Luisa Nutricionista",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://www.marialuisanutricionista.com",
    title: "María Luisa Nutricionista | Nutrición deportiva y preventiva",
    description:
      "Más de 20 años de experiencia. Planes de alimentación para entrenamiento, consultas y libros para una vida saludable.",
    siteName: "María Luisa Nutricionista",
    images: [
      {
        url: "/images/logoNutricion.png",
        width: 800,
        height: 800,
        alt: "María Luisa Nutricionista - Logo oficial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "María Luisa Nutricionista",
    description: "Nutrición preventiva en Lima, Perú",
    images: ["/images/logoNutricion.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: "María Luisa Nutricionista",
              image: "https://www.marialuisanutricionista.com/images/logoNutricion.png",
              "@id": "https://www.marialuisanutricionista.com",
              url: "https://www.marialuisanutricionista.com",
              telephone: "+51985577017",
              priceRange: "S/.20 - S/.90",
              description:
                "Nutricionista colegiada con más de 20 años de experiencia en nutrición preventiva.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Calle José del Carmen Verastegui 303",
                addressLocality: "San Juan de Miraflores",
                addressRegion: "Lima",
                postalCode: "15803",
                addressCountry: "PE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -12.1669714,
                longitude: -76.9685542,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "18:00",
              },
              sameAs: [
                "https://www.facebook.com/marialuisa.penavaldivia",
                "https://www.instagram.com/nutri.marialuisa.pe",
              ],
              medicalSpecialty: "Nutrition",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Servicios de nutrición",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Consulta nutricional personalizada",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Plan de alimentación deportiva",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Plan nutricional preventivo",
                    },
                  },
                ],
              },
            }),
          }}
        />
        {children}
        <WhatsAppFlotante />
      </body>
    </html>
  );
}
