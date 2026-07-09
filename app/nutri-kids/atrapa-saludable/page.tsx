import type { Metadata } from "next";
import AtrapaSaludableGame from "./AtrapaSaludableGame";

export const metadata: Metadata = {
  title: { absolute: "Atrapa Saludable — Juego para niños | Nutri Kids" },
  description:
    "Mueve la canasta y atrapa alimentos peruanos saludables mientras dejas caer la comida chatarra. Un juego de reflejos con datos nutricionales reales.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://nutricionistamarialuisa.vercel.app/nutri-kids/atrapa-saludable",
    title: "Atrapa Saludable — Juego para niños | Nutri Kids",
    description:
      "Mueve la canasta y atrapa alimentos peruanos saludables mientras dejas caer la comida chatarra. Un juego de reflejos con datos nutricionales reales.",
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
  return <AtrapaSaludableGame />;
}
