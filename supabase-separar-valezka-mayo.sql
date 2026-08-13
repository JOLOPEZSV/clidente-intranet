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
--   Difieren en 81.90, y el detalle explica POR QUE:
--     * del 1 al 6 hay 14 cobros, todos bajo el encabezado DR OSCAR  -> 582.51
--     * el dia 30 hay 4 cobros, los cuatro bajo el encabezado DRA VALEZKA
--       -> 144.76, y entre el 7 y el 29 Oscar no tiene ni un cobro
--     * uno de esos cuatro, el de 62.86, trae ademas escrito a mano
--       "Dra. Valeska" en la celda del paciente
--   Es decir: quien corrigio el resumen vio SOLO la linea anotada a mano y
--   movio esos 62.86, cuando el encabezado de la columna ese dia ya estaba a
--   nombre de ella para los cuatro cobros. Por eso se toma el reparto de las
--   hojas diarias: 582.51 / 144.76.
--
-- Nota de nombre: el encabezado dice "DRA VALEZKA" (con z) y la anotacion a
-- mano dice "Dra. Valeska" (con s). Se usa la forma del encabezado, que es la
-- que aparece en los seis archivos.
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
