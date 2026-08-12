-- ═══ Reparto de lo cobrado: operacion vs titular ═══
-- Ejecutar en Supabase SQL Editor.
--
-- POR QUE EXISTE ESTO
-- La cuota de 12,000 al banco no aparece en la caja de la clinica y "Pagos al
-- banco" sale en cero. No es un dato faltante: la clinica no le paga al banco
-- desde su caja. La hoja ADMINISTRACION DE FONDOS EFECTIVO de cada Excel
-- reparte TODO lo cobrado en dos destinos -- operacion de la clinica y retiro
-- de la titular -- y la suma cuadra al centavo con la facturacion del mes en
-- los seis meses. La cuota se atiende al nivel de la titular, tal como dice el
-- pie de la presentacion ("excluye los retiros de la titular, que se
-- administran a nivel de la propietaria").
--
-- ⚠️ PENDIENTE DE CONFIRMAR CON HENRY: que la cuota al banco efectivamente
-- salga de ese retiro. Es una inferencia consistente con los numeros, no un
-- dato declarado por la clinica.
--
-- El hallazgo: en febrero la titular recibio 994.92 por encima de la cuota.
--
-- ⚠️ MAYO VA EN NULL A PROPOSITO (12/08/2026). El reparto que teniamos
-- (16,706.63 / 12,254.00) salia del Excel de mayo SIN CORREGIR, que esta corto
-- en 3,726.97. De ahi salia el hallazgo "mayo cerro con 254.00 de margen", que
-- ya no se sostiene. Con la correccion hay dos lecturas posibles y opuestas:
--   A) el extra se lo llevo la titular -> 16,706.63 / 15,980.96 -> +3,980.96
--   B) el extra se quedo en caja       -> 20,518.81 / 12,168.78 ->   +168.78
-- No se puede elegir sin la hoja ADMINISTRACION DE FONDOS EFECTIVO corregida,
-- asi que la tarjeta muestra mayo como "pendiente de correccion".

ALTER TABLE public.dashboard_mensual ADD COLUMN IF NOT EXISTS admin_operacion NUMERIC(12,2);
ALTER TABLE public.dashboard_mensual ADD COLUMN IF NOT EXISTS retiro_titular  NUMERIC(12,2);

COMMENT ON COLUMN public.dashboard_mensual.admin_operacion IS
  'Parte de lo cobrado que queda en la operacion de la clinica (hoja ADMINISTRACION DE FONDOS EFECTIVO).';
COMMENT ON COLUMN public.dashboard_mensual.retiro_titular IS
  'Parte de lo cobrado que va a la titular. De aqui se atiende la cuota bancaria (pendiente de confirmar con Henry).';

UPDATE public.dashboard_mensual SET admin_operacion = 17924.52, retiro_titular = 21152.99 WHERE mes = 'Enero 2026';
UPDATE public.dashboard_mensual SET admin_operacion = 15161.32, retiro_titular = 12994.92 WHERE mes = 'Febrero 2026';
UPDATE public.dashboard_mensual SET admin_operacion = 16307.74, retiro_titular = 16729.10 WHERE mes = 'Marzo 2026';
UPDATE public.dashboard_mensual SET admin_operacion = 17330.73, retiro_titular = 16724.99 WHERE mes = 'Abril 2026';
UPDATE public.dashboard_mensual SET admin_operacion = NULL,     retiro_titular = NULL     WHERE mes = 'Mayo 2026';
UPDATE public.dashboard_mensual SET admin_operacion = 14146.33, retiro_titular = 13518.90 WHERE mes = 'Junio 2026';

-- Regla verificada con junio: admin = egresos en efectivo (sin remesas) + sobrante
-- de caja. Junio: 18,369.76 - 4,223.43 = 14,146.33 + 0.00 = 14,146.33 ✓
--
-- Verificacion: reparto + facturacion deben cuadrar, y el margen sobre la cuota
-- debe dar 994.92 en febrero. Mayo no debe aparecer (viene en NULL).
-- SELECT mes,
--        facturacion_total,
--        admin_operacion + retiro_titular              AS suma_reparto,
--        facturacion_total - (admin_operacion + retiro_titular) AS descuadre,
--        retiro_titular - 12000                        AS margen_sobre_cuota
--   FROM public.dashboard_mensual
--  WHERE retiro_titular IS NOT NULL
--  ORDER BY created_at;
