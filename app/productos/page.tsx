import { Suspense } from "react";
import ProductosContent from "./ProductosContent";

export const dynamic = "force-dynamic";

export default function ProductosPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[var(--yucca)] flex items-center justify-center">
          <p className="text-sm text-[var(--texto-suave)]">Cargando...</p>
        </main>
      }
    >
      <ProductosContent />
    </Suspense>
  );
}
