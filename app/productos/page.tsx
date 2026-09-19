import type { Metadata } from "next";
import ProductosContent from "./ProductosContent";

export const metadata: Metadata = {
  title: "Catálogo de productos | María Luisa Nutricionista",
  description:
    "Suplementos y alimentos seleccionados para acompañar tu entrenamiento. Coordina tu pedido por WhatsApp.",
};

export default function ProductosPage() {
  return <ProductosContent />;
}
