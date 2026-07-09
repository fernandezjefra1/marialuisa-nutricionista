import type { Metadata } from "next";
import NutriKidsIndexClient from "./_components/NutriKidsIndexClient";

export const metadata: Metadata = {
  title: { absolute: "Nutri Kids — Juegos de Nutrición para Niños | María Luisa Nutricionista" },
  description:
    "4 juegos gratis para que los niños aprendan nutrición jugando: Michi Nutricional, Atrapa Saludable, Trivia y Nutri Batalla, con alimentos peruanos.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://nutricionistamarialuisa.vercel.app/nutri-kids",
    title: "Nutri Kids — Juegos de Nutrición para Niños",
    description:
      "4 juegos gratis para que los niños aprendan nutrición jugando: Michi Nutricional, Atrapa Saludable, Trivia y Nutri Batalla, con alimentos peruanos.",
    siteName: "María Luisa Nutricionista",
    images: [
      {
        url: "/images/logoNutricion.png",
        width: 800,
        height: 800,
        alt: "Nutri Kids - María Luisa Nutricionista",
      },
    ],
  },
};

export default function Page() {
  return <NutriKidsIndexClient />;
}
