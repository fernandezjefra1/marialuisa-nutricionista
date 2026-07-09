import type { Metadata } from "next";
import TriviaGame from "./TriviaGame";

export const metadata: Metadata = {
  title: { absolute: "Trivia de Nutrición para Niños | Nutri Kids" },
  description:
    "Trivia con 3 niveles de dificultad sobre alimentos peruanos y hábitos saludables.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://nutricionistamarialuisa.vercel.app/nutri-kids/trivia",
    title: "Trivia de Nutrición para Niños | Nutri Kids",
    description:
      "Trivia con 3 niveles de dificultad sobre alimentos peruanos y hábitos saludables.",
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
  return <TriviaGame />;
}
