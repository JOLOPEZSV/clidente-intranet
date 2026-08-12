-- Migracion 11/08/2026 - Dashboard financiero CLIDENTE
-- Ejecutar en Supabase SQL Editor (proyecto lgoevspmiuyvlttmuyuz) en este orden:
--   PASO A: este archivo completo.
--   PASO B: re-ejecutar portal-auth-schema.sql (version actualizada de hoy), que
--           agrega a Vanessa y Roberto a la allowlist y aplica las politicas por
--           rol (viewer = solo lectura; admin/editor = escritura).
-- Objetivo de este archivo:
--   1. Eliminar duplicados historicos de dashboard_mensual y produccion_dentistas.
--   2. Agregar indices UNIQUE para que el portal guarde con upsert
--      (sin la ventana de borrado + insercion que podia perder el mes).
--   3. Corregir el redondeo del seed de Mayo 2026 (flujo neto -964.66, no -965).

-- 1a. Deduplicar dashboard_mensual conservando el registro mas reciente por mes.
--     Comparacion por tupla con COALESCE: robusta aunque algun created_at sea NULL.
DELETE FROM public.dashboard_mensual a
USING public.dashboard_mensual b
WHERE a.mes = b.mes
  AND a.id <> b.id
  AND (COALESCE(b.created_at, '-infinity'::timestamptz), b.id)
      > (COALESCE(a.created_at, '-infinity'::timestamptz), a.id);

-- 1b. Deduplicar produccion_dentistas conservando el registro mas reciente por (mes, nombre).
DELETE FROM public.produccion_dentistas a
USING public.produccion_dentistas b
WHERE a.mes = b.mes
  AND a.nombre = b.nombre
  AND a.id <> b.id
  AND (COALESCE(b.created_at, '-infinity'::timestamptz), b.id)
      > (COALESCE(a.created_at, '-infinity'::timestamptz), a.id);

-- 1c. Blindaje: created_at siempre presente de aqui en adelante.
UPDATE public.dashboard_mensual SET created_at = now() WHERE created_at IS NULL;
UPDATE public.produccion_dentistas SET created_at = now() WHERE created_at IS NULL;
ALTER TABLE public.dashboard_mensual ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE public.produccion_dentistas ALTER COLUMN created_at SET NOT NULL;

-- 1d. Mix de cobro (efectivo / POS / transferencia) que registra la caja de Henry.
ALTER TABLE public.dashboard_mensual ADD COLUMN IF NOT EXISTS efectivo NUMERIC(10,2);
ALTER TABLE public.dashboard_mensual ADD COLUMN IF NOT EXISTS tarjeta NUMERIC(10,2);
ALTER TABLE public.dashboard_mensual ADD COLUMN IF NOT EXISTS transferencia NUMERIC(10,2);

-- 2. Indices unicos (habilitan on_conflict en PostgREST para el guardado con upsert).
CREATE UNIQUE INDEX IF NOT EXISTS dashboard_mensual_mes_key
  ON public.dashboard_mensual (mes);

CREATE UNIQUE INDEX IF NOT EXISTS produccion_dentistas_mes_nombre_key
  ON public.produccion_dentistas (mes, nombre);

-- 3. El seed original redondeo el flujo de Mayo a -965; el valor que cuadra la
--    tarjeta de flujo de caja es 30,443.34 - 7,611 - 12,997 - 10,800 = -964.66.
UPDATE public.dashboard_mensual
SET flujo_neto = -964.66
WHERE mes = 'Mayo 2026' AND flujo_neto = -965;

-- Verificacion rapida (opcional):
-- SELECT mes, count(*) FROM public.dashboard_mensual GROUP BY mes HAVING count(*) > 1;
-- SELECT mes, nombre, count(*) FROM public.produccion_dentistas GROUP BY mes, nombre HAVING count(*) > 1;
-- SELECT email, role, active FROM public.portal_allowed_users ORDER BY email;
