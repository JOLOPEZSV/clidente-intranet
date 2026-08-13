-- ═══ Reunion del viernes: los cuatro numeros ═══
-- Ejecutar en Supabase SQL Editor.
--
-- El mecanismo de seguimiento que propone la consultoria cabe en una frase:
-- cada viernes, cuatro numeros.
--   1. Ocupacion por silla
--   2. Pacientes contra meta
--   3. Horas de silla vacia
--   4. Garantias
-- "La Direccion decide, la administracion opera, el sistema mide."
--
-- El resto del portal es mensual. Esta tabla es SEMANAL y por SILLA, porque
-- los numeros 1 y 3 solo existen a ese nivel: se miden en HORAS de silla, no
-- en pacientes. La lamina 11 fija la capacidad en 62 horas por silla a la
-- semana (muestreo del 25 al 31 de mayo).
--
-- Una fila por silla y por semana. La semana se identifica por su LUNES.

CREATE TABLE IF NOT EXISTS public.seguimiento_semanal (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  semana_inicio DATE NOT NULL,                          -- lunes de la semana
  silla TEXT NOT NULL,                                  -- 'Unidad 1' .. 'Unidad 7'
  horas_disponibles NUMERIC(8,2) NOT NULL DEFAULT 62,   -- capacidad de la silla
  horas_utilizadas  NUMERIC(8,2) NOT NULL DEFAULT 0,    -- horas realmente ocupadas
  pacientes         INTEGER      NOT NULL DEFAULT 0,
  garantias_casos   INTEGER      NOT NULL DEFAULT 0,    -- retrabajos cubiertos por garantia
  garantias_monto   NUMERIC(10,2) NOT NULL DEFAULT 0,   -- costo de esos retrabajos
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (semana_inicio, silla)
);

CREATE INDEX IF NOT EXISTS seguimiento_semanal_semana_idx
  ON public.seguimiento_semanal (semana_inicio);

COMMENT ON TABLE public.seguimiento_semanal IS
  'Los cuatro numeros de la reunion de seguimiento del viernes, por silla y por semana.';
COMMENT ON COLUMN public.seguimiento_semanal.horas_utilizadas IS
  'Horas de silla efectivamente ocupadas. Horas vacias = disponibles - utilizadas.';
COMMENT ON COLUMN public.seguimiento_semanal.garantias_casos IS
  'Retrabajos cubiertos por garantia. Descuentan de la produccion NETA de la Propuesta 4.';

-- Seguridad: mismas reglas que el resto del portal.
ALTER TABLE public.seguimiento_semanal ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.seguimiento_semanal FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seguimiento_semanal TO authenticated;

DROP POLICY IF EXISTS portal_allowed_read_seguimiento ON public.seguimiento_semanal;
CREATE POLICY portal_allowed_read_seguimiento
ON public.seguimiento_semanal FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.portal_allowed_users au
               WHERE au.active = true AND lower(au.email) = lower(auth.jwt() ->> 'email')));

DROP POLICY IF EXISTS portal_allowed_manage_seguimiento ON public.seguimiento_semanal;
CREATE POLICY portal_allowed_manage_seguimiento
ON public.seguimiento_semanal FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.portal_allowed_users au
               WHERE au.active = true AND au.role IN ('admin','editor')
                 AND lower(au.email) = lower(auth.jwt() ->> 'email')))
WITH CHECK (EXISTS (SELECT 1 FROM public.portal_allowed_users au
               WHERE au.active = true AND au.role IN ('admin','editor')
                 AND lower(au.email) = lower(auth.jwt() ->> 'email')));

-- Semana del muestreo de la lamina 11 (25 al 31 de mayo de 2026), como
-- referencia viva de que el tablero funciona. Del muestreo se conoce el
-- agregado: 78.83 horas utilizadas de 496 disponibles (84% de capacidad
-- ociosa). Se reparte entre las 7 sillas operativas para poder mostrarlo;
-- ⚠️ el detalle por silla es un prorrateo, no un dato medido silla por silla.
INSERT INTO public.seguimiento_semanal
  (semana_inicio, silla, horas_disponibles, horas_utilizadas, pacientes, garantias_casos, garantias_monto, notas)
VALUES
  ('2026-05-25', 'Unidad 1', 62, 11.26, 0, 0, 0, 'Prorrateo del muestreo 25-31 mayo (lamina 11)'),
  ('2026-05-25', 'Unidad 2', 62, 11.26, 0, 0, 0, 'Prorrateo del muestreo 25-31 mayo (lamina 11)'),
  ('2026-05-25', 'Unidad 3', 62, 11.26, 0, 0, 0, 'Prorrateo del muestreo 25-31 mayo (lamina 11)'),
  ('2026-05-25', 'Unidad 4', 62, 11.26, 0, 0, 0, 'Prorrateo del muestreo 25-31 mayo (lamina 11)'),
  ('2026-05-25', 'Unidad 5', 62, 11.26, 0, 0, 0, 'Prorrateo del muestreo 25-31 mayo (lamina 11)'),
  ('2026-05-25', 'Unidad 6', 62, 11.26, 0, 0, 0, 'Prorrateo del muestreo 25-31 mayo (lamina 11)'),
  ('2026-05-25', 'Unidad 7', 62, 11.27, 0, 0, 0, 'Prorrateo del muestreo 25-31 mayo (lamina 11)')
ON CONFLICT (semana_inicio, silla) DO NOTHING;

-- Verificacion: la semana del muestreo debe dar 434 horas disponibles,
-- 78.83 utilizadas y 81.8% de capacidad ociosa sobre las 7 sillas operativas.
-- (La lamina cita 84% porque calcula sobre 496 horas, es decir 8 sillas.)
-- SELECT semana_inicio,
--        sum(horas_disponibles) AS disponibles,
--        sum(horas_utilizadas)  AS utilizadas,
--        sum(horas_disponibles) - sum(horas_utilizadas) AS vacias,
--        round(100 * sum(horas_utilizadas) / sum(horas_disponibles), 1) AS ocupacion_pct
--   FROM public.seguimiento_semanal GROUP BY semana_inicio ORDER BY semana_inicio;
