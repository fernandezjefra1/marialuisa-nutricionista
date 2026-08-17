import type { Metadata } from "next";
import PlanDetalle from "@/components/PlanDetalle";

export const metadata: Metadata = {
  title: "Plan VIP — S/ 40",
  description: "Alimentación de una quincena programada día por día, totalmente personalizada. Incluye un libro de la autora de regalo.",
};

export default function DietaVipPage() {
  return (
    <PlanDetalle
      badge="VIP"
      nombre="Plan VIP"
      precio="S/ 40"
      periodo="quincenal"
      desc="Alimentación de una quincena programada día por día, totalmente personalizada."
      beneficios={[
        "Alimentación de una quincena programada día por día",
        "La alimentación es personalizada",
        "Regalo: 01 libro de la autora",
      ]}
      colorAccent="primrose"
      imagen="/images/vip.png"
    />
  );
}
