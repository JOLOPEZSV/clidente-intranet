-- Tablas para Dashboard Financiero CLIDENTE
-- Ejecutar en Supabase SQL Editor si las tablas aun no existen.

CREATE TABLE IF NOT EXISTS dashboard_mensual (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mes VARCHAR(20) NOT NULL,
  facturacion_total NUMERIC(10,2),
  pacientes_atendidos INTEGER,
  ticket_promedio NUMERIC(8,2),
  flujo_neto NUMERIC(10,2),
  costos_fijos NUMERIC(10,2) DEFAULT 10800,
  comisiones NUMERIC(10,2),
  insumos NUMERIC(10,2),
  punto_equilibrio INTEGER DEFAULT 878,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS produccion_dentistas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mes VARCHAR(20) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  facturacion NUMERIC(10,2),
  meta NUMERIC(10,2) DEFAULT 2500,
  estado VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO dashboard_mensual (
  mes, facturacion_total, pacientes_atendidos, ticket_promedio, flujo_neto,
  costos_fijos, comisiones, insumos, punto_equilibrio
)
SELECT 'Mayo 2026', 30443.34, 783, 38.87, -965, 10800, 7611, 12997, 878
WHERE NOT EXISTS (SELECT 1 FROM dashboard_mensual WHERE mes = 'Mayo 2026');

INSERT INTO produccion_dentistas (mes, nombre, facturacion, meta, estado)
SELECT * FROM (VALUES
  ('Mayo 2026', 'Dra. Dayana Carmona', 6279.31, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dra. Olga Vigil', 5642.47, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dra. Miriam Avelar', 4075.01, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dr. Luis Alarcon', 3516.47, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dra. Cindy Artiga', 3220.42, 2500, 'sobre_meta'),
  ('Mayo 2026', 'Dra. Haybi Figueroa', 2497.91, 2500, 'advertencia'),
  ('Mayo 2026', 'Dr. Nelson Erazo', 1926.89, 2500, 'advertencia'),
  ('Mayo 2026', 'Dr. Rafael Mendez', 1320.45, 2500, 'critico'),
  ('Mayo 2026', 'Dra. Arriaza', 1300.00, 2500, 'critico'),
  ('Mayo 2026', 'Dr. Oscar Guardado', 664.41, 2500, 'critico')
) AS seed(mes, nombre, facturacion, meta, estado)
WHERE NOT EXISTS (SELECT 1 FROM produccion_dentistas WHERE mes = 'Mayo 2026');
