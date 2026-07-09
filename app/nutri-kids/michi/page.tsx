import type { Metadata } from "next";
import MichiGame from "./MichiGame";

export const metadata: Metadata = {
  title: { absolute: "Michi Nutricional — Juego para niños | Nutri Kids" },
  description:
    "Juega Michi con alimentos saludables vs chatarra. 1 vs 1 o contra la computadora. Aprende nutrición jugando.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://nutricionistamarialuisa.vercel.app/nutri-kids/michi",
    title: "Michi Nutricional — Juego para niños | Nutri Kids",
    description:
      "Juega Michi con alimentos saludables vs chatarra. 1 vs 1 o contra la computadora. Aprende nutrición jugando.",
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
  return <MichiGame />;
}
