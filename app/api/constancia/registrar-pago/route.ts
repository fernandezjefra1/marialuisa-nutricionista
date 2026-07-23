export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CODIGO_REGEX = /^\d{6,12}$/;

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  let solicitud_id: string;
  let yape_codigo_operacion: string;
  let yape_hora_pago: string | null;

  try {
    const body = await request.json();
    solicitud_id = body.solicitud_id;
    yape_codigo_operacion = body.yape_codigo_operacion;
    yape_hora_pago = body.yape_hora_pago ?? null;
    if (!solicitud_id || !yape_codigo_operacion) throw new Error("missing fields");
  } catch {
    return NextResponse.json({ success: false, error: "Solicitud inválida." }, { status: 400 });
  }

  if (!CODIGO_REGEX.test(yape_codigo_operacion)) {
    return NextResponse.json(
      { success: false, error: "El código de operación debe tener entre 6 y 12 dígitos." },
      { status: 400 }
    );
  }

  const admin = serviceClient();

  const { data: solicitud, error: errorBusqueda } = await admin
    .from("solicitudes_constancia")
    .select("id, estado")
    .eq("id", solicitud_id)
    .maybeSingle();

  if (errorBusqueda || !solicitud) {
    return NextResponse.json({ success: false, error: "Solicitud no encontrada." }, { status: 404 });
  }

  if (solicitud.estado !== "pendiente_pago") {
    return NextResponse.json(
      { success: false, error: "Esta solicitud ya fue procesada anteriormente." },
      { status: 409 }
    );
  }

  const { error: errorUpdate } = await admin
    .from("solicitudes_constancia")
    .update({
      estado: "pagado_pendiente_validacion",
      yape_codigo_operacion,
      yape_hora_pago,
      pagado_at: new Date().toISOString(),
    })
    .eq("id", solicitud_id);

  if (errorUpdate) {
    return NextResponse.json({ success: false, error: "No se pudo registrar el pago." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    solicitud_id,
    download_url: `/api/constancia/${solicitud_id}/descargar`,
  });
}
