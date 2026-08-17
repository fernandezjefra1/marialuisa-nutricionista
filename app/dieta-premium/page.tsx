import type { Metadata } from "next";
import PlanDetalle from "@/components/PlanDetalle";

export const metadata: Metadata = {
  title: "Plan Premium — S/ 80",
  description: "Un mes completo de alimentación personalizada, con libro y video incluidos.",
};

export default function DietaPremiumPage() {
  return (
    <PlanDetalle
      badge="Premium"
      nombre="Plan Premium"
      precio="S/ 80"
      periodo="mensual"
      desc="Un mes completo de alimentación, con libro y video incluidos."
      beneficios={[
        "Alimentación de 01 mes",
        "Incluye libro",
        "Incluye video",
      ]}
      colorAccent="verde-fuerte"
      imagen="/images/imagenlibro.jpeg"
    />
  );
}
