-- ═══ Indicadores financieros de balance ═══
-- Ejecutar en Supabase SQL Editor.
--
-- Estos cinco NO se calculan mes a mes: salen del balance auditado, no de la
-- caja. Viven en tabla para poder actualizarlos cuando haya estados nuevos sin
-- tocar el codigo. Los indicadores por paciente y el punto de equilibrio SI se
-- calculan al vuelo desde dashboard_mensual y estado_resultados.
--
-- Convencion de color (la de la presentacion):
--   neutro -> informativo | alerta -> problema | umbral -> meta por cruzar | meta -> objetivo

CREATE TABLE IF NOT EXISTS public.indicadores_financieros (
  clave TEXT PRIMARY KEY,
  etiqueta TEXT NOT NULL,
  valor NUMERIC(12,4) NOT NULL,
  formato TEXT NOT NULL DEFAULT 'x',        -- 'x' | 'pct' | 'usd'
  estado TEXT NOT NULL DEFAULT 'neutro',    -- 'neutro' | 'alerta' | 'umbral' | 'meta'
  nota TEXT,
  fuente TEXT,
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.indicadores_financieros (clave, etiqueta, valor, formato, estado, nota, fuente, orden) VALUES
  ('razon_circulante', 'Razon Circulante',              3.1400, 'x',   'neutro', NULL,
   'Estados auditados a junio 2025', 1),
  ('prueba_acida',     'Prueba Acida',                  1.6400, 'x',   'neutro', NULL,
   'Estados auditados a junio 2025', 2),
  ('endeudamiento',    'Endeudamiento',                55.9000, 'pct', 'alerta', 'Mas de la mitad del activo esta financiado con deuda',
   'Estados auditados a junio 2025', 3),
  ('roe',              'Rendimiento sobre Patrimonio',  6.0900, 'pct', 'neutro', 'ROE',
   'Estados auditados a junio 2025', 4),
  ('roa',              'Rendimiento sobre Activos',     2.6900, 'pct', 'neutro', 'ROA',
   'Estados auditados a junio 2025', 5)
ON CONFLICT (clave) DO UPDATE SET
  etiqueta = EXCLUDED.etiqueta, valor = EXCLUDED.valor, formato = EXCLUDED.formato,
  estado = EXCLUDED.estado, nota = EXCLUDED.nota, fuente = EXCLUDED.fuente, orden = EXCLUDED.orden;

ALTER TABLE public.indicadores_financieros ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.indicadores_financieros FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.indicadores_financieros TO authenticated;

DROP POLICY IF EXISTS portal_allowed_read_indicadores ON public.indicadores_financieros;
CREATE POLICY portal_allowed_read_indicadores
ON public.indicadores_financieros FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.portal_allowed_users au
               WHERE au.active = true AND lower(au.email) = lower(auth.jwt() ->> 'email')));

DROP POLICY IF EXISTS portal_allowed_manage_indicadores ON public.indicadores_financieros;
CREATE POLICY portal_allowed_manage_indicadores
ON public.indicadores_financieros FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.portal_allowed_users au
               WHERE au.active = true AND au.role IN ('admin','editor')
                 AND lower(au.email) = lower(auth.jwt() ->> 'email')))
WITH CHECK (EXISTS (SELECT 1 FROM public.portal_allowed_users au
               WHERE au.active = true AND au.role IN ('admin','editor')
                 AND lower(au.email) = lower(auth.jwt() ->> 'email')));

-- Verificacion:
-- SELECT clave, etiqueta, valor, formato, estado FROM public.indicadores_financieros ORDER BY orden;
