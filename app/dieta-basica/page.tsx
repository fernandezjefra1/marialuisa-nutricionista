import type { Metadata } from "next";
import PlanDetalle from "@/components/PlanDetalle";

export const metadata: Metadata = {
  title: "Plan Básico — S/ 20",
  description: "Alimentación para las 24 horas, según tu edad, peso y talla. Incluye lista práctica de loncheras saludables de regalo.",
};

export default function DietaBasicaPage() {
  return (
    <PlanDetalle
      badge="Básico"
      nombre="Plan Básico"
      precio="S/ 20"
      periodo="plan diario"
      desc="Alimentación para las 24 horas, según tu edad, peso y talla."
      beneficios={[
        "Alimentación para las 24 horas, según edad, peso y talla",
        "Regalo: 01 lista práctica de loncheras saludables",
      ]}
      colorAccent="verde-fuerte"
      imagen="/images/free.png"
    />
  );
}
