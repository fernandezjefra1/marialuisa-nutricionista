-- Calculadora de IMC: captación de leads y solicitudes de Constancia Nutricional
-- Reemplaza la sección Nutri Kids (eliminada por cumplimiento de protección a menores).

-- ============================================================
-- TABLA: leads_imc
-- ============================================================
create table if not exists leads_imc (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  edad int not null,
  sexo text not null,
  peso_kg numeric(5,2) not null,
  altura_cm int not null,
  imc numeric(5,2) not null,
  categoria text not null,
  correo text not null,
  whatsapp text not null,
  empresa text,
  cargo text,
  objetivo text,
  consentimiento_datos bool not null default false,
  opt_in_tips bool not null default false,
  contactado bool not null default false,
  created_at timestamptz default now()
);

alter table leads_imc enable row level security;

create policy "leads_imc_insert_publico"
  on leads_imc for insert
  to anon, authenticated
  with check (true);

create policy "leads_imc_select_admin"
  on leads_imc for select
  to authenticated
  using (exists (
    select 1 from admin_emails where email = auth.email()
  ));

-- ============================================================
-- TABLA: solicitudes_constancia
-- ============================================================
create table if not exists solicitudes_constancia (
  id uuid primary key default gen_random_uuid(),
  lead_imc_id uuid references leads_imc(id),
  nombre text not null,
  dni text not null check (dni ~ '^\d{8}$'),
  empresa text not null,
  motivo text not null,
  imc numeric(5,2) not null,
  peso_kg numeric(5,2) not null,
  altura_cm int not null,
  correo text not null,
  whatsapp text not null,
  monto_soles numeric(6,2) not null default 10.00,
  estado text not null default 'pendiente_pago'
    check (estado in ('pendiente_pago', 'pagado_pendiente_validacion', 'pagado_validado', 'rechazado')),
  yape_codigo_operacion text,
  yape_hora_pago text,
  validado_por_nutricionista bool not null default false,
  notas_validacion text,
  pdf_descargado bool not null default false,
  pdf_descargas_count int not null default 0,
  created_at timestamptz default now(),
  pagado_at timestamptz,
  validado_at timestamptz
);

alter table solicitudes_constancia enable row level security;

create policy "solicitudes_constancia_insert_publico"
  on solicitudes_constancia for insert
  to anon, authenticated
  with check (true);

-- Solo permite pasar de "pendiente_pago" a "pagado_pendiente_validacion" reportando el pago.
-- No permite modificar validado_por_nutricionista, notas_validacion, validado_at ni el monto.
create policy "solicitudes_constancia_update_reportar_pago"
  on solicitudes_constancia for update
  to anon, authenticated
  using (estado = 'pendiente_pago')
  with check (estado = 'pagado_pendiente_validacion');

-- Restringe a nivel de columna qué campos puede escribir el rol público,
-- incluso dentro de la política de UPDATE anterior.
revoke update on solicitudes_constancia from anon, authenticated;
grant update (
  estado,
  yape_codigo_operacion,
  yape_hora_pago,
  pagado_at,
  pdf_descargado,
  pdf_descargas_count
) on solicitudes_constancia to anon, authenticated;

create policy "solicitudes_constancia_select_admin"
  on solicitudes_constancia for select
  to authenticated
  using (exists (
    select 1 from admin_emails where email = auth.email()
  ));
