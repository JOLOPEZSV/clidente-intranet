-- ═══ Caja diaria - Portal CLIDENTE ═══
-- Implementa la PROPUESTA 1 de la consultoria (flujo de caja diario).
-- Ejecutar en Supabase SQL Editor DESPUES de supabase-migracion-20260811.sql
-- y de portal-auth-schema.sql (para que herede las politicas por rol).
--
-- La clinica ya registra a diario en sus archivos CAJA <MES>.xlsx (hojas 1..31
-- y la matriz categoria x dia de la hoja EGRESOS). Esta tabla guarda ese mismo
-- detalle en el portal, para responder la pregunta que el cierre mensual no
-- puede: "que dia se queda la clinica sin efectivo".

CREATE TABLE IF NOT EXISTS public.caja_diaria (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  ingreso NUMERIC(10,2) NOT NULL DEFAULT 0,
  egreso NUMERIC(10,2) NOT NULL DEFAULT 0,
  pago_banco NUMERIC(10,2) NOT NULL DEFAULT 0,
  pacientes INTEGER NOT NULL DEFAULT 0,
  origen TEXT NOT NULL DEFAULT 'manual',   -- 'manual' | 'excel'
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS caja_diaria_fecha_idx ON public.caja_diaria (fecha);

-- Seguridad: mismas reglas que el resto del portal.
--   lectura  = cualquier usuario activo de la allowlist (incluye viewer)
--   escritura= solo admin / editor
ALTER TABLE public.caja_diaria ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.caja_diaria FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.caja_diaria TO authenticated;

DROP POLICY IF EXISTS portal_allowed_read_caja_diaria ON public.caja_diaria;
CREATE POLICY portal_allowed_read_caja_diaria
ON public.caja_diaria FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portal_allowed_users au
    WHERE au.active = true
      AND lower(au.email) = lower(auth.jwt() ->> 'email')
  )
);

DROP POLICY IF EXISTS portal_allowed_manage_caja_diaria ON public.caja_diaria;
CREATE POLICY portal_allowed_manage_caja_diaria
ON public.caja_diaria FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portal_allowed_users au
    WHERE au.active = true
      AND au.role IN ('admin', 'editor')
      AND lower(au.email) = lower(auth.jwt() ->> 'email')
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.portal_allowed_users au
    WHERE au.active = true
      AND au.role IN ('admin', 'editor')
      AND lower(au.email) = lower(auth.jwt() ->> 'email')
  )
);

-- Verificacion:
-- SELECT date_trunc('month', fecha) AS mes, count(*) AS dias,
--        sum(ingreso) AS ingresos, sum(egreso) AS egresos, sum(pago_banco) AS banco
--   FROM public.caja_diaria GROUP BY 1 ORDER BY 1;
