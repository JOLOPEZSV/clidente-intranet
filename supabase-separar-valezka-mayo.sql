-- ═══ Mayo 2026: separar a la Dra. Valezka del Dr. Oscar Guardado ═══
-- Ejecutar en Supabase SQL Editor. Re-ejecutable.
--
-- QUE PASA
-- En las hojas diarias de mayo, la columna rotulada DR OSCAR pasa a decir
-- DRA VALEZKA en los ultimos dias del mes. El portal cargaba el bloque entero
-- como si fuera de Oscar, asi que sumaba la produccion de dos personas.
--
-- El reparto, dia por dia (produccion_detalle):
--   Dr. Oscar Guardado  582.51  dias 1, 2, 4, 5 y 6  (quedo inactivo el 6/05)
--   Dra. Valezka        144.76  dia 30
--                       ------
--                       727.27  = el bloque completo
--
-- ⚠ DOS FUENTES REPARTEN ESTO DISTINTO, y hay que saberlo:
--     PDF corregido de mayo:  Oscar 664.41 + "N/A" 62.86  = 727.27
--     Hojas diarias:          Oscar 582.51 + Valezka 144.76 = 727.27
--   Difieren en 81.90. Se toma el de las hojas diarias porque tiene evidencia
--   dia por dia y porque es el unico consistente con que Oscar dejo de trabajar
--   el 6 de mayo: con 664.41 tendria que haber cobrado 81.90 despues de esa
--   fecha, y no hay ningun dia que lo respalde. La "linea nueva N/A" del PDF es
--   casi con seguridad esta misma persona, contada con otro monto.
--
-- ⚠ NO CAMBIA LA FACTURACION DE MAYO. El bloque sigue sumando 727.27, asi que
--   los 32,687.59 del mes quedan igual. Lo unico que cambia es a quien se le
--   atribuye. La suma de produccion_dentistas de mayo sube 62.86 (de 30,591.20
--   a 30,654.06) porque hasta ahora faltaba la parte que el PDF habia separado
--   como "N/A" y que nunca se cargo como fila propia.
--
-- ⚠ VALEZKA VA FUERA DE COMPARATIVA (comparable = false), igual que Oscar en
--   mayo. Trabajo un solo dia del mes: meterla en la comparativa de sillas la
--   dejaria en critico por definicion y hundiria la media del grupo sin que eso
--   signifique nada. Misma regla que ya se aplico a Nancy y a Oscar.

BEGIN;

-- 1) Oscar se queda solo con lo suyo.
UPDATE public.produccion_dentistas
   SET facturacion = 582.51
 WHERE mes = 'Mayo 2026' AND nombre = 'Dr. Oscar Guardado';

-- 2) Valezka entra como fila propia. Sin ON CONFLICT porque la tabla no tiene
--    unique en (mes, nombre): se borra primero para que sea re-ejecutable.
DELETE FROM public.produccion_dentistas
 WHERE mes = 'Mayo 2026' AND nombre = 'Dra. Valezka';

INSERT INTO public.produccion_dentistas (mes, nombre, facturacion, meta, estado, comparable)
VALUES ('Mayo 2026', 'Dra. Valezka', 144.76, 2500, 'critico', false);

COMMIT;

-- Verificacion:
-- SELECT nombre, facturacion, estado, comparable
--   FROM public.produccion_dentistas
--  WHERE mes = 'Mayo 2026' AND nombre IN ('Dr. Oscar Guardado','Dra. Valezka');
-- -> Oscar 582.51 / false, Valezka 144.76 / false
--
-- Y contra el detalle diario, que debe cuadrar al centavo con ambos:
-- SELECT doctor, round(sum(total),2) FROM public.produccion_detalle
--  WHERE mes = 'Mayo 2026' AND doctor IN ('Dr. Oscar Guardado','Dra. Valezka')
--  GROUP BY doctor;
