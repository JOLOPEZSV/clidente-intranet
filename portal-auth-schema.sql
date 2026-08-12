-- Seguridad para Portal CLIDENTE con Supabase Auth + allowlist.
-- Ejecutar en Supabase SQL Editor despues de crear las tablas del portal.

CREATE TABLE IF NOT EXISTS public.portal_allowed_users (
  email TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'viewer',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.portal_allowed_users (email, role, active)
VALUES
  ('jolopezsalsv@gmail.com', 'admin', true),
  ('cecilia_cbcg@hotmail.com', 'editor', true),
  ('ricardoa7@hotmail.com', 'editor', true),
  ('jm.josemenjivar@gmail.com', 'editor', true),
  ('vbeltran@iseade.edu.sv', 'viewer', true),   -- Vanessa Beltran - coordinacion academica ISEADE (solo lectura)
  ('roca2608@gmail.com', 'viewer', true)        -- Lcdo. Roberto Castro - asesor (solo lectura)
ON CONFLICT (email) DO UPDATE
SET role = EXCLUDED.role,
    active = EXCLUDED.active;

DELETE FROM public.portal_allowed_users
WHERE lower(email) NOT IN (
  'jolopezsalsv@gmail.com',
  'cecilia_cbcg@hotmail.com',
  'ricardoa7@hotmail.com',
  'jm.josemenjivar@gmail.com',
  'vbeltran@iseade.edu.sv',
  'roca2608@gmail.com'
);

ALTER TABLE public.portal_allowed_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.portal_allowed_users FROM anon;
GRANT SELECT ON public.portal_allowed_users TO authenticated;

DROP POLICY IF EXISTS portal_allowed_read_self ON public.portal_allowed_users;
CREATE POLICY portal_allowed_read_self
ON public.portal_allowed_users
FOR SELECT
TO authenticated
USING (
  active = true
  AND lower(email) = lower(auth.jwt() ->> 'email')
);

-- Politicas por rol:
--   * lectura: cualquier usuario activo de la allowlist (incluye role 'viewer').
--   * escritura (INSERT/UPDATE/DELETE): solo role 'admin' o 'editor'.
DO $$
DECLARE
  tbl TEXT;
  policy_name TEXT;
  read_policy_name TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'indice_responsables',
    'cronograma_actividades',
    'diagnostico_entregables',
    'dashboard_mensual',
    'produccion_dentistas'
  ]
  LOOP
    IF to_regclass('public.' || tbl) IS NOT NULL THEN
      policy_name := 'portal_allowed_manage_' || tbl;
      read_policy_name := 'portal_allowed_read_' || tbl;
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
      EXECUTE format('REVOKE ALL ON public.%I FROM anon', tbl);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', read_policy_name, tbl);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (
          EXISTS (
            SELECT 1
            FROM public.portal_allowed_users au
            WHERE au.active = true
              AND lower(au.email) = lower(auth.jwt() ->> ''email'')
          )
        )',
        read_policy_name,
        tbl
      );
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (
          EXISTS (
            SELECT 1
            FROM public.portal_allowed_users au
            WHERE au.active = true
              AND au.role IN (''admin'', ''editor'')
              AND lower(au.email) = lower(auth.jwt() ->> ''email'')
          )
        ) WITH CHECK (
          EXISTS (
            SELECT 1
            FROM public.portal_allowed_users au
            WHERE au.active = true
              AND au.role IN (''admin'', ''editor'')
              AND lower(au.email) = lower(auth.jwt() ->> ''email'')
          )
        )',
        policy_name,
        tbl
      );
    END IF;
  END LOOP;
END $$;
