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
-- El hallazgo: en mayo la titular recibio 254.00 por encima de la cuota, y en
-- febrero 994.92. Dos de seis meses con margen menor a mil dolares.

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
UPDATE public.dashboard_mensual SET admin_operacion = 16706.63, retiro_titular = 12254.00 WHERE mes = 'Mayo 2026';
UPDATE public.dashboard_mensual SET admin_operacion = 14146.33, retiro_titular = 13518.90 WHERE mes = 'Junio 2026';

-- Verificacion: reparto + facturacion deben cuadrar, y el margen sobre la cuota
-- debe dar 254.00 en mayo y 994.92 en febrero.
-- SELECT mes,
--        facturacion_total,
--        admin_operacion + retiro_titular              AS suma_reparto,
--        facturacion_total - (admin_operacion + retiro_titular) AS descuadre,
--        retiro_titular - 12000                        AS margen_sobre_cuota
--   FROM public.dashboard_mensual
--  WHERE retiro_titular IS NOT NULL
--  ORDER BY created_at;
