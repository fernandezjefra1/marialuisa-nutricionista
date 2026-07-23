export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generarConstancia } from "@/lib/pdf/generarConstancia";

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const DIACRITICOS = new RegExp("[\\u0300-\\u036f]", "g");

function sanitizarNombreArchivo(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(DIACRITICOS, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const { id } = await Promise.resolve(params);
  const admin = serviceClient();

  const { data: solicitud, error } = await admin
    .from("solicitudes_constancia")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }

  if (!["pagado_pendiente_validacion", "pagado_validado"].includes(solicitud.estado)) {
    return NextResponse.json(
      { error: "El pago de esta solicitud aún no ha sido registrado." },
      { status: 403 }
    );
  }

  const pdfBytes = await generarConstancia({
    nombre: solicitud.nombre,
    dni: solicitud.dni,
    empresa: solicitud.empresa,
    motivo: solicitud.motivo,
    imc: Number(solicitud.imc),
    categoria: "Peso normal",
    peso_kg: Number(solicitud.peso_kg),
    altura_cm: Number(solicitud.altura_cm),
    fecha: new Date(),
    solicitud_id: solicitud.id,
  });

  await admin
    .from("solicitudes_constancia")
    .update({
      pdf_descargado: true,
      pdf_descargas_count: (solicitud.pdf_descargas_count ?? 0) + 1,
    })
    .eq("id", id);

  const nombreArchivo = `Constancia-Nutricional-${sanitizarNombreArchivo(solicitud.nombre)}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}
