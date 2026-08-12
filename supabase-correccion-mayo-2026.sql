-- ═══ Correccion de Mayo 2026 ═══
-- Ejecutar en Supabase SQL Editor (una sola vez; es re-ejecutable sin efectos).
--
-- FUENTE: PDF "CAJA MAYO 2026 - RESUMEN DEL MES.pdf" (pie 31/5/2026 11:03:29),
-- que es la version corregida del mes. El Excel CAJA MAYO 2026.xlsx que tenemos
-- NUNCA fue corregido, asi que todo lo que salga de el esta desactualizado en
-- +3,726.97 (todo el descuadre cae en la 2a quincena).
--
-- El PDF corregido y el PPT coinciden en 32,687.59 de facturacion, que es lo que
-- ya esta cargado en el portal. Lo que cambia es COMO se cobro y QUIEN lo produjo.
--
-- Detalle del descuadre por profesional (Excel viejo -> PDF corregido):
--   Flotante            276.08 -> 2,008.53   +1,732.45   (no es fila de esta tabla)
--   Dra. Olga Vigil   3,466.74 -> 5,642.47   +2,175.73
--   Dra. Miriam Avelar 4,256.23 -> 4,075.01    -181.22
--   Dr. Oscar Guardado   727.27 ->   664.41     -62.86
--   N/A (linea nueva)      0.00 ->    62.86     +62.86   (no es fila de esta tabla)
--   Dr. Nelson Erazo   1,926.88 -> 1,926.89      +0.01
--                                             ---------
--                                             +3,726.97
--
-- ⚠ EJECUTAR EL ARCHIVO COMPLETO: el BEGIN/COMMIT evita dejar mayo a medio corregir.

BEGIN;

-- 1) Mix de cobro. Con la correccion, efectivo+tarjeta+transferencia suma
--    32,687.59 EXACTO, asi que mayo deja de tener la franja "Otros / ajustes".
UPDATE public.dashboard_mensual
   SET efectivo      = 24536.85,   -- antes 20724.67  (+3,812.18)
       tarjeta       =  7971.45,   -- antes  8056.66     (-85.21)
       transferencia =   179.29    -- sin cambio
 WHERE mes = 'Mayo 2026';

-- 2) Produccion por dentista. Los demas profesionales no cambian.
--    Ningun semaforo cambia de estado; si cambia la media del grupo.
UPDATE public.produccion_dentistas SET facturacion = 5642.47 WHERE mes = 'Mayo 2026' AND nombre = 'Dra. Olga Vigil';
UPDATE public.produccion_dentistas SET facturacion = 4075.01 WHERE mes = 'Mayo 2026' AND nombre = 'Dra. Miriam Avelar';
UPDATE public.produccion_dentistas SET facturacion =  664.41 WHERE mes = 'Mayo 2026' AND nombre = 'Dr. Oscar Guardado';
UPDATE public.produccion_dentistas SET facturacion = 1926.89 WHERE mes = 'Mayo 2026' AND nombre = 'Dr. Nelson Erazo';

-- 3) Reparto operacion / titular: SE ANULA, no se corrige.
--    La hoja ADMINISTRACION DE FONDOS EFECTIVO corregida no la tenemos, y las
--    dos lecturas posibles dan conclusiones OPUESTAS:
--      A) el extra se lo llevo la titular -> margen sobre la cuota +3,980.96
--      B) el extra se quedo en caja       -> margen sobre la cuota   +168.78
--    Elegir una seria inventar. Se deja en NULL y la tarjeta lo muestra como
--    "pendiente de correccion", que es mas honesto que el 16,706.63 / 12,254.00
--    que ya sabemos falso (de ahi salia el hallazgo "mayo cerro con $254").
UPDATE public.dashboard_mensual
   SET admin_operacion = NULL,
       retiro_titular  = NULL
 WHERE mes = 'Mayo 2026';

COMMIT;

-- NO SE TOCA:
--   * facturacion_total de mayo (32,687.59): ya era la cifra correcta.
--   * caja_diaria de mayo: los 31 dias suman 28,960.63 y estan cortos en
--     3,726.97, pero el PDF solo da totales por quincena. Repartirlo dia por dia
--     seria inventar. El dashboard ahora avisa solo cuando la suma diaria no
--     cuadra con la facturacion del mes (sirve para mayo y para cualquier mes).
--   * egresos de mayo (18,979.21): la correccion fue de ingresos, no de egresos.
--   * pacientes de mayo (841, del PPT): quedan tres cifras en disputa
--     (858 recepcion / 841 PPT / 914 hojas diarias). Falta criterio de Ricardo.

-- Verificacion:
-- SELECT mes, facturacion_total, efectivo, tarjeta, transferencia,
--        efectivo + tarjeta + transferencia AS cobrado,
--        admin_operacion, retiro_titular
--   FROM public.dashboard_mensual WHERE mes = 'Mayo 2026';
-- -> cobrado debe dar 32687.59 y el reparto debe venir en NULL.
--
-- SELECT nombre, facturacion FROM public.produccion_dentistas
--  WHERE mes = 'Mayo 2026' ORDER BY facturacion DESC;
