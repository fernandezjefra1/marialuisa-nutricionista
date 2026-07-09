import type { Metadata } from "next";
import NutriBatallaGame from "./NutriBatallaGame";

export const metadata: Metadata = {
  title: { absolute: "Nutri Batalla — Combate Retro de Nutrición | Nutri Kids" },
  description:
    "Combate por turnos estilo retro: 3 Nutri-héroes peruanos contra 3 monstruos de malos hábitos. Aprende nutrición mientras luchas.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://nutricionistamarialuisa.vercel.app/nutri-kids/nutri-batalla",
    title: "Nutri Batalla — Combate Retro de Nutrición | Nutri Kids",
    description:
      "Combate por turnos estilo retro: 3 Nutri-héroes peruanos contra 3 monstruos de malos hábitos. Aprende nutrición mientras luchas.",
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
  return <NutriBatallaGame />;
}
