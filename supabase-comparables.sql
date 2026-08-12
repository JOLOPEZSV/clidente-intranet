-- ═══ Profesionales comparables para el analisis de silla ═══
-- Ejecutar en Supabase SQL Editor.
--
-- El informe compara solo a los odontologos generales que realmente ocupan una
-- silla ("9 odontologos generales rotando en 7 sillas operativas"). Sin esta
-- marca el dashboard mete en la comparacion a laboratorio, especialistas y a
-- quienes ya no estan, y entonces contradice a la lamina: dice 5 sillas bajo
-- piso y -3,180 donde el informe dice 3 y -957.
--
-- IMPORTANTE: la marca afecta UNICAMENTE el analisis de silla (piso de
-- rentabilidad, Meta Cero, brecha y media del grupo). NO toca la facturacion,
-- el ticket ni el Estado de Resultados: ese dinero se cobro de verdad y llega
-- a representar el 20.5% de la produccion de enero.

ALTER TABLE public.produccion_dentistas
  ADD COLUMN IF NOT EXISTS comparable BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.produccion_dentistas.comparable IS
  'Ocupa una silla como odontologo general ese mes. Solo afecta el analisis de silla, no el ingreso.';

-- Por defecto todos comparables; luego se excluyen los casos conocidos.
UPDATE public.produccion_dentistas SET comparable = true;

-- 1. Exclusiones estructurales: no ocupan silla de odontologia general.
UPDATE public.produccion_dentistas
SET comparable = false
WHERE nombre IN ('Dr. Rodrigo', 'Dr. Osegueda');
--   Rodrigo  -> laboratorio (produccion 0-100/mes, nunca ocupa silla)
--   Osegueda -> especialista maxilofacial (fuera por Politica v2.0)

-- 2. Salidas: cada quien cuenta en los meses que SI trabajo, y sale del
--    comparativo a partir del mes en que dejo de ocupar la silla.
--    Dra. Nancy renuncio el 1 de mayo (produccion cero en mayo y junio).
--    Dr. Oscar Guardado inactivo desde el 6 de mayo; de enero a abril fue el
--    mayor productor, asi que en esos meses SI cuenta. Lo de mayo y junio son
--    cobros posteriores a su salida.
UPDATE public.produccion_dentistas
SET comparable = false
WHERE nombre IN ('Dra. Nancy', 'Dr. Oscar Guardado')
  AND mes IN ('Mayo 2026', 'Junio 2026');

-- 4. Sin produccion en el mes no hay silla ocupada.
UPDATE public.produccion_dentistas
SET comparable = false
WHERE facturacion <= 0;

-- Nota: Dra. Valezka no aparece en ninguno de los seis archivos de caja
-- (enero-junio). Ingreso despues de junio, por eso no hay filas que marcar.

-- Verificacion: junio debe dar 9 comparables y 3 bajo el piso de 2,057.14.
-- SELECT mes,
--        count(*) FILTER (WHERE comparable)                              AS comparables,
--        count(*)                                                        AS registrados,
--        count(*) FILTER (WHERE comparable AND facturacion < 2057.14)    AS bajo_piso,
--        round(avg(facturacion) FILTER (WHERE comparable), 2)            AS media_grupo
--   FROM public.produccion_dentistas GROUP BY mes ORDER BY min(created_at);
