-- ═══ Estado de Resultados y flujo de efectivo - Portal CLIDENTE ═══
-- Ejecutar en Supabase SQL Editor DESPUES de portal-auth-schema.sql.
--
-- Replica el cuadro de la presentacion (Estado de Resultados + Flujo de
-- efectivo del mes). Se guardan solo las lineas de entrada; las lineas
-- derivadas (utilidad bruta, resultado operativo, utilidad neta y flujo de
-- efectivo) se calculan en el portal para que nunca puedan descuadrar.
--
-- OJO con la diferencia de bases:
--   * resultado operativo = ingresos - costos variables - costos fijos
--   * flujo de efectivo   = resultado operativo - pago a bancos (cuota completa,
--                           capital + intereses), NO los gastos financieros.
--   El Estado de Resultados registra solo los intereses; el flujo registra la
--   cuota entera. Por eso la clinica puede tener utilidad y flujo negativo.

CREATE TABLE IF NOT EXISTS public.estado_resultados (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mes VARCHAR(20) NOT NULL UNIQUE,
  ingresos NUMERIC(12,2) NOT NULL DEFAULT 0,
  costos_variables NUMERIC(12,2) NOT NULL DEFAULT 0,
  costos_fijos NUMERIC(12,2) NOT NULL DEFAULT 0,
  gastos_financieros NUMERIC(12,2) NOT NULL DEFAULT 0,
  pago_bancos NUMERIC(12,2) NOT NULL DEFAULT 0,
  origen TEXT NOT NULL DEFAULT 'manual',    -- 'manual' | 'excel' | 'ppt'
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clasificacion de las categorias de egreso del Excel de caja.
-- El Excel NO trae un Estado de Resultados: trae 20 categorias de egreso en
-- efectivo. Esta tabla dice a que linea del Estado de Resultados va cada una,
-- y es editable desde el portal porque es un criterio contable, no un dato.
CREATE TABLE IF NOT EXISTS public.clasificacion_egresos (
  categoria TEXT PRIMARY KEY,
  tipo TEXT NOT NULL DEFAULT 'fijo',        -- 'variable' | 'fijo' | 'financiero' | 'excluido'
  nota TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clasificacion inicial propuesta (revisar con Ricardo antes de darla por buena).
INSERT INTO public.clasificacion_egresos (categoria, tipo, nota) VALUES
  ('INSUMOS',               'variable',  'Escala con el numero de pacientes'),
  ('DESECHABLES',           'variable',  'Escala con el numero de pacientes'),
  ('DESCARTABLE',           'variable',  'Escala con el numero de pacientes'),
  ('BIOINFECCIOSO',         'variable',  'Recoleccion ligada al volumen atendido'),
  ('GASTOS DE VENTA',       'variable',  'Ligado a la actividad comercial'),
  ('SALARIOS',              'fijo',      'Planilla base'),
  ('SERVICIOS BASICOS',     'fijo',      NULL),
  ('SEGUROS',               'fijo',      NULL),
  ('ADMINISTRACION',        'fijo',      NULL),
  ('ALIMENTACION',          'fijo',      NULL),
  ('ALQUILER',              'fijo',      NULL),
  ('SERVICIOS DE TERCEROS', 'fijo',      NULL),
  ('IMPUESTOS',             'fijo',      NULL),
  ('TRANSPORTE',            'fijo',      NULL),
  ('INSTRUMENTO',           'fijo',      NULL),
  ('PRESTAMOS',             'financiero','Va a gastos financieros / pago a bancos'),
  ('REMESAS',               'excluido',  'Traslado de efectivo a cuentas, no es gasto'),
  ('INVERSION',             'excluido',  'Inversion de capital, no gasto del periodo'),
  ('EQUIPO',                'excluido',  'Inversion de capital, no gasto del periodo'),
  ('REMODELACION',          'excluido',  'Inversion de capital, no gasto del periodo')
ON CONFLICT (categoria) DO NOTHING;

-- Seguridad: mismas reglas que el resto del portal.
DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['estado_resultados', 'clasificacion_egresos']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', tbl);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl);
    EXECUTE format('DROP POLICY IF EXISTS portal_allowed_read_%I ON public.%I', tbl, tbl);
    EXECUTE format('DROP POLICY IF EXISTS portal_allowed_manage_%I ON public.%I', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY portal_allowed_read_%I ON public.%I FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.portal_allowed_users au
                WHERE au.active = true AND lower(au.email) = lower(auth.jwt() ->> ''email''))
      )', tbl, tbl);
    EXECUTE format(
      'CREATE POLICY portal_allowed_manage_%I ON public.%I FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.portal_allowed_users au
                WHERE au.active = true AND au.role IN (''admin'', ''editor'')
                  AND lower(au.email) = lower(auth.jwt() ->> ''email''))
      ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.portal_allowed_users au
                WHERE au.active = true AND au.role IN (''admin'', ''editor'')
                  AND lower(au.email) = lower(auth.jwt() ->> ''email''))
      )', tbl, tbl);
  END LOOP;
END $$;

-- Datos de la presentacion del 11 de agosto (abril, mayo y junio con P&L
-- detallado). Enero-marzo: la presentacion no publica su P&L, se cargan con
-- los costos variables estimados al 34.1% del ingreso (promedio del II
-- trimestre) y quedan marcados como origen 'ppt' para poder distinguirlos.
INSERT INTO public.estado_resultados
  (mes, ingresos, costos_variables, costos_fijos, gastos_financieros, pago_bancos, origen, notas)
VALUES
  ('Enero 2026',   39077.51, 13325.43, 10800.00, 210.72, 12000.00, 'ppt', 'Costos variables estimados al 34.1% (promedio IIQ)'),
  ('Febrero 2026', 28156.24,  9601.28, 10800.00, 210.72, 12000.00, 'ppt', 'Costos variables estimados al 34.1% (promedio IIQ)'),
  ('Marzo 2026',   33036.84, 11265.56, 10800.00, 210.72, 12000.00, 'ppt', 'Costos variables estimados al 34.1% (promedio IIQ)'),
  ('Abril 2026',   34055.72, 11839.03, 10800.00, 210.72, 12000.00, 'ppt', 'P&L publicado en la presentacion del 11 de agosto'),
  ('Mayo 2026',    32687.59, 10953.00, 10800.00, 210.72, 12000.00, 'ppt', 'P&L publicado en la presentacion del 11 de agosto'),
  ('Junio 2026',   27665.23,  9366.52, 10800.00, 210.72, 12000.00, 'ppt', 'P&L publicado en la presentacion del 11 de agosto')
ON CONFLICT (mes) DO UPDATE SET
  ingresos           = EXCLUDED.ingresos,
  costos_variables   = EXCLUDED.costos_variables,
  costos_fijos       = EXCLUDED.costos_fijos,
  gastos_financieros = EXCLUDED.gastos_financieros,
  pago_bancos        = EXCLUDED.pago_bancos,
  origen             = EXCLUDED.origen,
  notas              = EXCLUDED.notas;

-- Verificacion:
-- SELECT mes, ingresos, costos_variables, costos_fijos,
--        ingresos - costos_variables - costos_fijos AS resultado_operativo,
--        ingresos - costos_variables - costos_fijos - pago_bancos AS flujo_efectivo
--   FROM public.estado_resultados ORDER BY created_at;
