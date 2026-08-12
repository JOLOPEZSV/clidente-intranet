-- ═══ Datos duros Enero-Junio 2026 - Dashboard CLIDENTE ═══
-- Ejecutar en Supabase SQL Editor DESPUES de supabase-migracion-20260811.sql
-- (la migracion crea las columnas efectivo/tarjeta/transferencia).
--
-- Fuentes:
--   * Ingresos y pacientes: Presentacion 11 de agosto, slide 5 ("verificados contra caja").
--   * Costos variables abril-junio: slide 7 (P&L IIQ). Enero-marzo: estimados al 34.1%
--     del ingreso (promedio IIQ) porque la presentacion no detalla el P&L del IQ.
--   * Comisiones = 25% del ingreso (comision plana vigente, slide 8);
--     insumos = costos variables - comisiones.
--   * flujo_neto = resultado operativo (ingresos - variables - fijos), sin pago a bancos.
--   * Produccion por doctor y mix de cobro: CAJA <MES> 2026.xlsx, hoja RESUMEN DEL MES.
--     "N/A" grande del resumen = Dra. Dayana Carmona (validado contra slide 4).
--   * NOTA Mayo: reemplaza el seed anterior (30,443.34 / 783 px) por la cifra oficial
--     de la presentacion (32,687.59 / 841 px). El mix de cobro de mayo suma 28,960.62
--     (lo efectivamente cobrado en caja); la diferencia se muestra como "Otros".
-- Re-ejecutable sin duplicar (borra los 6 meses y los reinserta).
-- ⚠ EJECUTAR EL ARCHIVO COMPLETO, nunca por partes: el BEGIN/COMMIT garantiza que
--   si algo falla (p.ej. correrlo antes de la migracion) no queden los DELETE aplicados.

BEGIN;

DELETE FROM public.produccion_dentistas WHERE mes IN ('Enero 2026','Febrero 2026','Marzo 2026','Abril 2026','Mayo 2026','Junio 2026');
DELETE FROM public.dashboard_mensual WHERE mes IN ('Enero 2026','Febrero 2026','Marzo 2026','Abril 2026','Mayo 2026','Junio 2026');

INSERT INTO public.dashboard_mensual
  (mes, facturacion_total, pacientes_atendidos, ticket_promedio, flujo_neto, costos_fijos, comisiones, insumos, punto_equilibrio, efectivo, tarjeta, transferencia)
VALUES
  ('Enero 2026', 39077.51, 1134, 34.46, 14952.08, 10800.0, 9769.38, 3556.05, 476, 26797.41, 11905.81, 374.29),
  ('Febrero 2026', 28156.24, 843, 33.4, 7754.96, 10800.0, 7039.06, 2562.22, 491, 19541.84, 8540.13, 74.27),
  ('Marzo 2026', 33036.84, 974, 33.92, 10971.28, 10800.0, 8259.21, 3006.35, 484, 22611.47, 9721.8, 703.57),
  ('Abril 2026', 34055.72, 931, 36.58, 11416.69, 10800.0, 8513.93, 3325.1, 453, 21648.21, 11411.79, 995.72),
  ('Mayo 2026', 32687.59, 841, 38.87, 10934.59, 10800.0, 8171.9, 2781.1, 418, 20724.67, 8056.66, 179.29),
  ('Junio 2026', 27665.23, 839, 32.97, 7498.71, 10800.0, 6916.31, 2450.21, 496, 18369.76, 8769.68, 525.79);

INSERT INTO public.produccion_dentistas (mes, nombre, facturacion, meta, estado)
VALUES
  ('Enero 2026', 'Dra. Olga Vigil', 5577.63, 2500, 'sobre_meta'),
  ('Enero 2026', 'Dra. Miriam Avelar', 5000.65, 2500, 'sobre_meta'),
  ('Enero 2026', 'Dra. Cindy Artiga', 1814.98, 2500, 'advertencia'),
  ('Enero 2026', 'Dr. Luis Alarcon', 3604.98, 2500, 'sobre_meta'),
  ('Enero 2026', 'Dr. Rafael Mendez', 1794.52, 2500, 'critico'),
  ('Enero 2026', 'Dr. Oscar Guardado', 6552.62, 2500, 'sobre_meta'),
  ('Enero 2026', 'Dr. Nelson Erazo', 3414.31, 2500, 'sobre_meta'),
  ('Enero 2026', 'Dra. Haybi Figueroa', 4367.69, 2500, 'sobre_meta'),
  ('Enero 2026', 'Dra. Arriaza', 933.0, 2500, 'critico'),
  ('Enero 2026', 'Dra. Dayana Carmona', 4287.39, 2500, 'sobre_meta'),
  ('Enero 2026', 'Dra. Nancy', 1031.89, 2500, 'critico'),
  ('Enero 2026', 'Dr. Osegueda', 375.0, 2500, 'critico'),
  ('Febrero 2026', 'Dra. Olga Vigil', 2648.86, 2500, 'sobre_meta'),
  ('Febrero 2026', 'Dra. Miriam Avelar', 3550.0, 2500, 'sobre_meta'),
  ('Febrero 2026', 'Dra. Cindy Artiga', 2614.35, 2500, 'sobre_meta'),
  ('Febrero 2026', 'Dr. Luis Alarcon', 2827.92, 2500, 'sobre_meta'),
  ('Febrero 2026', 'Dr. Rafael Mendez', 1082.12, 2500, 'critico'),
  ('Febrero 2026', 'Dr. Oscar Guardado', 3096.4, 2500, 'sobre_meta'),
  ('Febrero 2026', 'Dr. Nelson Erazo', 1797.2, 2500, 'critico'),
  ('Febrero 2026', 'Dra. Haybi Figueroa', 3654.18, 2500, 'sobre_meta'),
  ('Febrero 2026', 'Dra. Arriaza', 868.0, 2500, 'critico'),
  ('Febrero 2026', 'Dra. Dayana Carmona', 4994.17, 2500, 'sobre_meta'),
  ('Febrero 2026', 'Dra. Nancy', 256.12, 2500, 'critico'),
  ('Febrero 2026', 'Dr. Rodrigo', 100.0, 2500, 'critico'),
  ('Febrero 2026', 'Dr. Osegueda', 125.0, 2500, 'critico'),
  ('Marzo 2026', 'Dra. Olga Vigil', 2116.55, 2500, 'advertencia'),
  ('Marzo 2026', 'Dra. Miriam Avelar', 5253.33, 2500, 'sobre_meta'),
  ('Marzo 2026', 'Dra. Cindy Artiga', 3279.32, 2500, 'sobre_meta'),
  ('Marzo 2026', 'Dr. Luis Alarcon', 3079.56, 2500, 'sobre_meta'),
  ('Marzo 2026', 'Dr. Rafael Mendez', 1026.52, 2500, 'critico'),
  ('Marzo 2026', 'Dr. Oscar Guardado', 3450.56, 2500, 'sobre_meta'),
  ('Marzo 2026', 'Dr. Nelson Erazo', 2218.68, 2500, 'advertencia'),
  ('Marzo 2026', 'Dra. Haybi Figueroa', 3936.32, 2500, 'sobre_meta'),
  ('Marzo 2026', 'Dra. Arriaza', 1248.0, 2500, 'critico'),
  ('Marzo 2026', 'Dra. Dayana Carmona', 6290.49, 2500, 'sobre_meta'),
  ('Marzo 2026', 'Dra. Nancy', 758.05, 2500, 'critico'),
  ('Marzo 2026', 'Dr. Rodrigo', 75.0, 2500, 'critico'),
  ('Marzo 2026', 'Dr. Osegueda', 75.0, 2500, 'critico'),
  ('Abril 2026', 'Dra. Olga Vigil', 3669.36, 2500, 'sobre_meta'),
  ('Abril 2026', 'Dra. Miriam Avelar', 4610.51, 2500, 'sobre_meta'),
  ('Abril 2026', 'Dra. Cindy Artiga', 3259.27, 2500, 'sobre_meta'),
  ('Abril 2026', 'Dr. Luis Alarcon', 3477.33, 2500, 'sobre_meta'),
  ('Abril 2026', 'Dr. Rafael Mendez', 1288.52, 2500, 'critico'),
  ('Abril 2026', 'Dr. Oscar Guardado', 2938.36, 2500, 'sobre_meta'),
  ('Abril 2026', 'Dr. Nelson Erazo', 3263.98, 2500, 'sobre_meta'),
  ('Abril 2026', 'Dra. Haybi Figueroa', 2727.1, 2500, 'sobre_meta'),
  ('Abril 2026', 'Dra. Arriaza', 1858.0, 2500, 'advertencia'),
  ('Abril 2026', 'Dra. Dayana Carmona', 5631.44, 2500, 'sobre_meta'),
  ('Abril 2026', 'Dra. Nancy', 544.75, 2500, 'critico'),
  ('Abril 2026', 'Dr. Osegueda', 159.29, 2500, 'critico'),
  ('Mayo 2026', 'Dra. Olga Vigil', 3466.74, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dra. Miriam Avelar', 4256.23, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dra. Cindy Artiga', 3220.42, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dr. Luis Alarcon', 3516.47, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dr. Rafael Mendez', 1320.45, 2500, 'critico'),
  ('Mayo 2026', 'Dr. Oscar Guardado', 727.27, 2500, 'critico'),
  ('Mayo 2026', 'Dr. Nelson Erazo', 1926.88, 2500, 'advertencia'),
  ('Mayo 2026', 'Dra. Haybi Figueroa', 2497.91, 2500, 'advertencia'),
  ('Mayo 2026', 'Dra. Arriaza', 1300.0, 2500, 'critico'),
  ('Mayo 2026', 'Dra. Dayana Carmona', 6279.31, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dr. Rodrigo', 22.86, 2500, 'critico'),
  ('Mayo 2026', 'Dr. Osegueda', 125.0, 2500, 'critico'),
  ('Junio 2026', 'Dra. Olga Vigil', 2932.74, 2500, 'sobre_meta'),
  ('Junio 2026', 'Dra. Miriam Avelar', 3673.32, 2500, 'sobre_meta'),
  ('Junio 2026', 'Dra. Cindy Artiga', 3659.08, 2500, 'sobre_meta'),
  ('Junio 2026', 'Dr. Luis Alarcon', 2830.82, 2500, 'sobre_meta'),
  ('Junio 2026', 'Dr. Rafael Mendez', 1621.36, 2500, 'critico'),
  ('Junio 2026', 'Dr. Oscar Guardado', 799.02, 2500, 'critico'),
  ('Junio 2026', 'Dr. Nelson Erazo', 1380.98, 2500, 'critico'),
  ('Junio 2026', 'Dra. Haybi Figueroa', 4201.94, 2500, 'sobre_meta'),
  ('Junio 2026', 'Dra. Arriaza', 1894.0, 2500, 'advertencia'),
  ('Junio 2026', 'Dra. Dayana Carmona', 3957.25, 2500, 'sobre_meta'),
  ('Junio 2026', 'Dr. Osegueda', 350.0, 2500, 'critico');

COMMIT;

-- Verificacion (los 6 meses comparten created_at, por eso se ordena por nombre de mes):
-- SELECT mes, facturacion_total, pacientes_atendidos, flujo_neto, efectivo, tarjeta, transferencia
--   FROM public.dashboard_mensual
--   ORDER BY array_position(ARRAY['Enero 2026','Febrero 2026','Marzo 2026','Abril 2026','Mayo 2026','Junio 2026'], mes);
