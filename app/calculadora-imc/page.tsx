import type { Metadata } from "next";
import CalculadoraImcClient from "./_components/CalculadoraImcClient";

export const metadata: Metadata = {
  title: "Calculadora de IMC",
  description:
    "Calcula tu Índice de Masa Corporal gratis. Recibe orientación profesional o descarga tu Constancia Nutricional para empresa firmada por una nutricionista colegiada por solo S/ 10.",
  openGraph: {
    title: "Calculadora de IMC | María Luisa Nutricionista",
    description:
      "Calcula tu Índice de Masa Corporal gratis. Recibe orientación profesional o descarga tu Constancia Nutricional para empresa firmada por una nutricionista colegiada por solo S/ 10.",
    images: [
      {
        url: "/images/logoNutricion.png",
        width: 800,
        height: 800,
        alt: "María Luisa Nutricionista - Logo oficial",
      },
    ],
  },
};

export default function CalculadoraImcPage() {
  return <CalculadoraImcClient />;
}
