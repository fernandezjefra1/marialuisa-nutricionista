import type { Metadata } from "next";
import PlanDetalle from "@/components/PlanDetalle";

export const metadata: Metadata = {
  title: "Plan MiniChef — S/ 90",
  description: "Plan MiniChef de María Luisa Nutricionista. Detalles próximamente.",
};

// TODO: Reemplazar con la descripción real del Plan MiniChef cuando la clienta la envíe.
export default function PlanMinichefPage() {
  return (
    <PlanDetalle
      badge="MiniChef"
      nombre="Plan MiniChef"
      precio="S/ 90"
      periodo="por confirmar"
      desc="Próximamente detalles de este plan."
      beneficios={[]}
      colorAccent="lime"
      proximamente
    />
  );
}
