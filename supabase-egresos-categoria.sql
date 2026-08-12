-- ═══ Egresos por categoria y mes ═══
-- Ejecutar en Supabase SQL Editor DESPUES de supabase-estado-resultados.sql
-- (necesita clasificacion_egresos para saber a que linea del ER va cada una).
--
-- POR QUE EXISTE ESTO
-- Hasta ahora el portal sabia CUANTO se gasto cada mes, pero no EN QUE. Los
-- montos por categoria solo vivian en la hoja EGRESOS de cada Excel, asi que
-- al hacer clic en "Costos fijos" de la cascada no habia nada abajo. Esta
-- tabla es ese nivel: 20 categorias x 6 meses = 120 filas.
--
-- FUENTE: hoja EGRESOS de cada CAJA <MES> 2026.xlsx, bloque "GLOBAL"
-- (col B = categoria, col E = total del mes). Verificado: en los 6 meses la
-- suma de las 20 categorias cuadra al centavo con "TOTAL EGRESO EN EFECTIVO".
--
-- ⚠ ESTO ES EGRESO EN EFECTIVO, NO EL COSTO DEL ESTADO DE RESULTADOS. Son dos
--   cosas distintas y no deben sumarse entre si: junio da 18,369.76 aqui contra
--   20,377.24 de costos en el PPT. REMESAS (32,116 en los 6 meses) son
--   traslados de efectivo, no gasto -- por eso clasificacion_egresos las marca
--   'excluido'. El drill-down muestra la clasificacion de cada categoria para
--   que la diferencia quede a la vista en vez de esconderse.
--
-- ⚠ MAYO: la correccion del PDF fue de INGRESOS, no de egresos, asi que estos
--   18,972.56 salen del Excel sin corregir y son lo mejor que tenemos.
--   OJO: la caja diaria de mayo suma 18,979.21 de egresos, 6.65 mas que este
--   bloque GLOBAL. El descuadre es del propio Excel, no de la carga.
--
-- Re-ejecutable: upsert por (mes, categoria), no borra ni duplica.

CREATE TABLE IF NOT EXISTS public.egresos_categoria (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mes TEXT NOT NULL,
  categoria TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  monto NUMERIC(12,2) NOT NULL DEFAULT 0,
  origen TEXT NOT NULL DEFAULT 'excel',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (mes, categoria)
);

CREATE INDEX IF NOT EXISTS egresos_categoria_mes_idx ON public.egresos_categoria (mes);

COMMENT ON TABLE public.egresos_categoria IS
  'Egreso EN EFECTIVO por categoria y mes (hoja EGRESOS del Excel). No es el costo del Estado de Resultados.';

INSERT INTO public.egresos_categoria (mes, categoria, orden, monto) VALUES
  ('Enero 2026', 'SALARIOS', 1, 12697.12),
  ('Enero 2026', 'INSUMOS', 2, 449.45),
  ('Enero 2026', 'EQUIPO', 3, 112.94),
  ('Enero 2026', 'INSTRUMENTO', 4, 0.00),
  ('Enero 2026', 'TRANSPORTE', 5, 0.00),
  ('Enero 2026', 'DESCARTABLE', 6, 0.00),
  ('Enero 2026', 'SERVICIOS BASICOS', 7, 42.75),
  ('Enero 2026', 'BIOINFECCIOSO', 8, 25.00),
  ('Enero 2026', 'IMPUESTOS', 9, 0.00),
  ('Enero 2026', 'SEGUROS', 10, 2321.76),
  ('Enero 2026', 'REMODELACION', 11, 0.00),
  ('Enero 2026', 'DESECHABLES', 12, 16.80),
  ('Enero 2026', 'ADMINISTRACION', 13, 186.60),
  ('Enero 2026', 'ALIMENTACION', 14, 411.17),
  ('Enero 2026', 'ALQUILER', 15, 0.00),
  ('Enero 2026', 'GASTOS DE VENTA', 16, 0.00),
  ('Enero 2026', 'INVERSION', 17, 155.00),
  ('Enero 2026', 'PRESTAMOS', 18, 0.00),
  ('Enero 2026', 'SERVICIOS DE TERCEROS', 19, 452.00),
  ('Enero 2026', 'REMESAS', 20, 8872.89),
  ('Febrero 2026', 'SALARIOS', 1, 10617.17),
  ('Febrero 2026', 'INSUMOS', 2, 235.35),
  ('Febrero 2026', 'EQUIPO', 3, 0.00),
  ('Febrero 2026', 'INSTRUMENTO', 4, 0.00),
  ('Febrero 2026', 'TRANSPORTE', 5, 0.00),
  ('Febrero 2026', 'DESCARTABLE', 6, 0.00),
  ('Febrero 2026', 'SERVICIOS BASICOS', 7, 51.30),
  ('Febrero 2026', 'BIOINFECCIOSO', 8, 25.00),
  ('Febrero 2026', 'IMPUESTOS', 9, 0.00),
  ('Febrero 2026', 'SEGUROS', 10, 2077.70),
  ('Febrero 2026', 'REMODELACION', 11, 0.00),
  ('Febrero 2026', 'DESECHABLES', 12, 34.50),
  ('Febrero 2026', 'ADMINISTRACION', 13, 129.54),
  ('Febrero 2026', 'ALIMENTACION', 14, 389.18),
  ('Febrero 2026', 'ALQUILER', 15, 0.00),
  ('Febrero 2026', 'GASTOS DE VENTA', 16, 0.00),
  ('Febrero 2026', 'INVERSION', 17, 155.00),
  ('Febrero 2026', 'PRESTAMOS', 18, 0.00),
  ('Febrero 2026', 'SERVICIOS DE TERCEROS', 19, 467.55),
  ('Febrero 2026', 'REMESAS', 20, 4380.52),
  ('Marzo 2026', 'SALARIOS', 1, 12208.86),
  ('Marzo 2026', 'INSUMOS', 2, 92.08),
  ('Marzo 2026', 'EQUIPO', 3, 40.82),
  ('Marzo 2026', 'INSTRUMENTO', 4, 0.00),
  ('Marzo 2026', 'TRANSPORTE', 5, 0.00),
  ('Marzo 2026', 'DESCARTABLE', 6, 0.00),
  ('Marzo 2026', 'SERVICIOS BASICOS', 7, 39.90),
  ('Marzo 2026', 'BIOINFECCIOSO', 8, 0.00),
  ('Marzo 2026', 'IMPUESTOS', 9, 2230.56),
  ('Marzo 2026', 'SEGUROS', 10, 406.68),
  ('Marzo 2026', 'REMODELACION', 11, 0.00),
  ('Marzo 2026', 'DESECHABLES', 12, 108.25),
  ('Marzo 2026', 'ADMINISTRACION', 13, 147.14),
  ('Marzo 2026', 'ALIMENTACION', 14, 406.22),
  ('Marzo 2026', 'ALQUILER', 15, 0.00),
  ('Marzo 2026', 'GASTOS DE VENTA', 16, 320.00),
  ('Marzo 2026', 'INVERSION', 17, 155.00),
  ('Marzo 2026', 'PRESTAMOS', 18, 0.00),
  ('Marzo 2026', 'SERVICIOS DE TERCEROS', 19, 32.85),
  ('Marzo 2026', 'REMESAS', 20, 6303.73),
  ('Abril 2026', 'SALARIOS', 1, 11800.71),
  ('Abril 2026', 'INSUMOS', 2, 112.08),
  ('Abril 2026', 'EQUIPO', 3, 0.00),
  ('Abril 2026', 'INSTRUMENTO', 4, 0.00),
  ('Abril 2026', 'TRANSPORTE', 5, 0.00),
  ('Abril 2026', 'DESCARTABLE', 6, 0.00),
  ('Abril 2026', 'SERVICIOS BASICOS', 7, 37.05),
  ('Abril 2026', 'BIOINFECCIOSO', 8, 15.49),
  ('Abril 2026', 'IMPUESTOS', 9, 1613.28),
  ('Abril 2026', 'SEGUROS', 10, 2302.80),
  ('Abril 2026', 'REMODELACION', 11, 0.00),
  ('Abril 2026', 'DESECHABLES', 12, 71.00),
  ('Abril 2026', 'ADMINISTRACION', 13, 247.76),
  ('Abril 2026', 'ALIMENTACION', 14, 334.28),
  ('Abril 2026', 'ALQUILER', 15, 0.00),
  ('Abril 2026', 'GASTOS DE VENTA', 16, 208.57),
  ('Abril 2026', 'INVERSION', 17, 130.00),
  ('Abril 2026', 'PRESTAMOS', 18, 0.00),
  ('Abril 2026', 'SERVICIOS DE TERCEROS', 19, 452.00),
  ('Abril 2026', 'REMESAS', 20, 4317.48),
  ('Mayo 2026', 'SALARIOS', 1, 9367.57),
  ('Mayo 2026', 'INSUMOS', 2, 749.95),
  ('Mayo 2026', 'EQUIPO', 3, 0.00),
  ('Mayo 2026', 'INSTRUMENTO', 4, 0.00),
  ('Mayo 2026', 'TRANSPORTE', 5, 0.00),
  ('Mayo 2026', 'DESCARTABLE', 6, 0.00),
  ('Mayo 2026', 'SERVICIOS BASICOS', 7, 51.30),
  ('Mayo 2026', 'BIOINFECCIOSO', 8, 25.00),
  ('Mayo 2026', 'IMPUESTOS', 9, 976.50),
  ('Mayo 2026', 'SEGUROS', 10, 2353.98),
  ('Mayo 2026', 'REMODELACION', 11, 0.00),
  ('Mayo 2026', 'DESECHABLES', 12, 103.40),
  ('Mayo 2026', 'ADMINISTRACION', 13, 305.49),
  ('Mayo 2026', 'ALIMENTACION', 14, 509.91),
  ('Mayo 2026', 'ALQUILER', 15, 0.00),
  ('Mayo 2026', 'GASTOS DE VENTA', 16, 156.42),
  ('Mayo 2026', 'INVERSION', 17, 155.00),
  ('Mayo 2026', 'PRESTAMOS', 18, 0.00),
  ('Mayo 2026', 'SERVICIOS DE TERCEROS', 19, 200.00),
  ('Mayo 2026', 'REMESAS', 20, 4018.04),
  ('Junio 2026', 'SALARIOS', 1, 10694.60),
  ('Junio 2026', 'INSUMOS', 2, 133.26),
  ('Junio 2026', 'EQUIPO', 3, 0.00),
  ('Junio 2026', 'INSTRUMENTO', 4, 0.00),
  ('Junio 2026', 'TRANSPORTE', 5, 0.00),
  ('Junio 2026', 'DESCARTABLE', 6, 0.00),
  ('Junio 2026', 'SERVICIOS BASICOS', 7, 54.16),
  ('Junio 2026', 'BIOINFECCIOSO', 8, 0.00),
  ('Junio 2026', 'IMPUESTOS', 9, 0.00),
  ('Junio 2026', 'SEGUROS', 10, 1873.09),
  ('Junio 2026', 'REMODELACION', 11, 0.00),
  ('Junio 2026', 'DESECHABLES', 12, 154.00),
  ('Junio 2026', 'ADMINISTRACION', 13, 250.72),
  ('Junio 2026', 'ALIMENTACION', 14, 379.50),
  ('Junio 2026', 'ALQUILER', 15, 0.00),
  ('Junio 2026', 'GASTOS DE VENTA', 16, 0.00),
  ('Junio 2026', 'INVERSION', 17, 155.00),
  ('Junio 2026', 'PRESTAMOS', 18, 0.00),
  ('Junio 2026', 'SERVICIOS DE TERCEROS', 19, 452.00),
  ('Junio 2026', 'REMESAS', 20, 4223.43)
ON CONFLICT (mes, categoria) DO UPDATE
  SET monto = EXCLUDED.monto, orden = EXCLUDED.orden, origen = EXCLUDED.origen;

-- Seguridad: mismas reglas que el resto del portal.
ALTER TABLE public.egresos_categoria ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.egresos_categoria FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.egresos_categoria TO authenticated;

DROP POLICY IF EXISTS portal_allowed_read_egresos_categoria ON public.egresos_categoria;
CREATE POLICY portal_allowed_read_egresos_categoria
ON public.egresos_categoria FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.portal_allowed_users au
          WHERE au.active = true AND lower(au.email) = lower(auth.jwt() ->> 'email'))
);

DROP POLICY IF EXISTS portal_allowed_manage_egresos_categoria ON public.egresos_categoria;
CREATE POLICY portal_allowed_manage_egresos_categoria
ON public.egresos_categoria FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.portal_allowed_users au
          WHERE au.active = true AND au.role IN ('admin','editor')
            AND lower(au.email) = lower(auth.jwt() ->> 'email'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.portal_allowed_users au
          WHERE au.active = true AND au.role IN ('admin','editor')
            AND lower(au.email) = lower(auth.jwt() ->> 'email'))
);

-- Verificacion: los totales por mes deben dar
--   Enero 25,743.48 | Febrero 18,562.81 | Marzo 22,492.09
--   Abril 21,642.50 | Mayo 18,972.56 | Junio 18,369.76
-- SELECT mes, count(*) AS categorias, sum(monto) AS total
--   FROM public.egresos_categoria GROUP BY mes
--   ORDER BY array_position(ARRAY['Enero 2026','Febrero 2026','Marzo 2026','Abril 2026','Mayo 2026','Junio 2026'], mes);
--
-- Reparto por clasificacion (lo que alimenta el drill-down de la cascada):
-- SELECT e.mes, c.tipo, sum(e.monto)
--   FROM public.egresos_categoria e
--   LEFT JOIN public.clasificacion_egresos c ON c.categoria = e.categoria
--  GROUP BY 1,2 ORDER BY 1,2;
