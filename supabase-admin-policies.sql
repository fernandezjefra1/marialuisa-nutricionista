-- =====================================================
-- EJECUTAR EN: Supabase Dashboard → SQL Editor → New query
-- Esto permite que TODOS los administradores vean y
-- gestionen todos los datos sin restricciones de RLS.
-- =====================================================

-- PRODUCTOS: admins pueden hacer todo (crear, editar, eliminar, ver)
DROP POLICY IF EXISTS "admins_all_productos" ON productos;
CREATE POLICY "admins_all_productos" ON productos
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

-- COMPRAS (pedidos de libro): admins pueden ver y actualizar
DROP POLICY IF EXISTS "admins_select_compras" ON compras;
CREATE POLICY "admins_select_compras" ON compras
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

DROP POLICY IF EXISTS "admins_update_compras" ON compras;
CREATE POLICY "admins_update_compras" ON compras
FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

-- PEDIDOS (pedidos de tienda): admins pueden ver y actualizar
DROP POLICY IF EXISTS "admins_select_pedidos" ON pedidos;
CREATE POLICY "admins_select_pedidos" ON pedidos
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

DROP POLICY IF EXISTS "admins_update_pedidos" ON pedidos;
CREATE POLICY "admins_update_pedidos" ON pedidos
FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

-- RESERVAS DE TALLER: crear tabla si no existe + políticas
CREATE TABLE IF NOT EXISTS reservas_taller (
  id          bigserial PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      text        NOT NULL,
  correo      text        NOT NULL,
  whatsapp    text        NOT NULL,
  modalidad   text        NOT NULL CHECK (modalidad IN ('presencial', 'virtual')),
  precio      numeric     NOT NULL,
  mensaje     text,
  estado      text        NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'cancelado'))
);

ALTER TABLE reservas_taller ENABLE ROW LEVEL SECURITY;

-- Usuarios autenticados pueden insertar sus propias reservas
DROP POLICY IF EXISTS "users_insert_reservas" ON reservas_taller;
CREATE POLICY "users_insert_reservas" ON reservas_taller
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden ver sus propias reservas (para la página de perfil)
DROP POLICY IF EXISTS "users_select_own_reservas" ON reservas_taller;
CREATE POLICY "users_select_own_reservas" ON reservas_taller
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Admins pueden ver todas las reservas
DROP POLICY IF EXISTS "admins_select_reservas" ON reservas_taller;
CREATE POLICY "admins_select_reservas" ON reservas_taller
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

-- Admins pueden actualizar el estado de las reservas
DROP POLICY IF EXISTS "admins_update_reservas" ON reservas_taller;
CREATE POLICY "admins_update_reservas" ON reservas_taller
FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

-- SOLICITUDES EMPRESARIALES: admins pueden ver y actualizar
DROP POLICY IF EXISTS "admins_select_solicitudes" ON solicitudes_empresariales;
CREATE POLICY "admins_select_solicitudes" ON solicitudes_empresariales
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

DROP POLICY IF EXISTS "admins_update_solicitudes" ON solicitudes_empresariales;
CREATE POLICY "admins_update_solicitudes" ON solicitudes_empresariales
FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);

-- ADMIN_EMAILS: admins pueden gestionar otros admins
DROP POLICY IF EXISTS "admins_all_admin_emails" ON admin_emails;
CREATE POLICY "admins_all_admin_emails" ON admin_emails
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_emails WHERE email = (auth.jwt() ->> 'email'))
);
