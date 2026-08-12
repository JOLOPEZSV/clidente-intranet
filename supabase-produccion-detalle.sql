-- ═══ Produccion por dentista: detalle dia x paciente ═══
-- Este archivo crea SOLO la tabla y su seguridad. Los datos NO se versionan
-- aqui a proposito: traen nombres de pacientes y este repo es publico (es lo
-- que sirve GitHub Pages). Se cargan directo a Supabase desde el archivo local.
--
-- POR QUE EXISTE ESTO
-- produccion_dentistas guarda un total por dentista y mes. Este es el nivel de
-- abajo: cada fila es un cobro, tal como esta en las hojas diarias 1..31 de
-- cada CAJA <MES> 2026.xlsx (col A cajero, col B paciente, y por cada doctor
-- tres columnas EFECTIVO / POST / TRANSFERENCIA). 4,169 filas en 6 meses.
--
-- VERIFICACION: reagrupando el detalle por doctor y mes, 70 de los 73 pares
-- doctor-mes cuadran AL CENTAVO contra produccion_dentistas. Los 3 que no son
-- de mayo, cuyo Excel nunca se corrigio (ver PENDIENTE-MAYO-2026.md):
--   Dra. Olga Vigil    detalle 3,466.74 vs portal 5,642.47  (-2,175.73)
--   Dra. Miriam Avelar detalle 4,256.23 vs portal 4,075.01  (+181.22)
--   Dr. Oscar Guardado detalle   582.51 vs portal   664.41  (ver Valezka abajo)
--
-- ⚠ HALLAZGO: en mayo la columna rotulada DR OSCAR pasa a decir DRA VALEZKA en
--   los ultimos dias. Oscar produjo 582.51 (dias 1, 2, 4, 5 y 6 -- quedo
--   inactivo el 6 de mayo) y Dra. Valezka 144.76 el dia 30. Suman los 727.27
--   que el portal tenia cargados como "Oscar" antes de la correccion de mayo.
--   Este detalle los separa; produccion_dentistas todavia no. Corrige la nota
--   anterior del proyecto, que decia que Valezka no aparecia en ningun archivo.
--
-- ⚠ Los montos pueden ser NEGATIVOS: son notas de credito / reversos (p.ej.
--   -123.84 de Dra. Figueroa el 30 de junio). Cualquier consulta que filtre por
--   total > 0 va a descuadrar hacia arriba contra el total del mes.
--
-- ⚠ "Flotante" y "N/A sin identificar" NO son filas de produccion_dentistas.
--   Flotante suma 1,936.02 en los 6 meses y el bloque sin rotular de la col 41
--   suma 457.53. El bloque N/A grande es el de la col 47 y SI es Dayana
--   Carmona: sus 31,440.05 cuadran exacto con su total en el portal.
--
-- ⚠ DATOS PERSONALES: la columna `paciente` trae nombres completos de pacientes
--   de la clinica. Cargada con autorizacion explicita del propietario, que
--   tambien decidio que la lea todo el equipo con acceso al portal (misma
--   politica que el resto de las tablas, viewers incluidos).

CREATE TABLE IF NOT EXISTS public.produccion_detalle (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  mes TEXT NOT NULL,
  fecha DATE NOT NULL,
  doctor TEXT NOT NULL,
  doctor_col TEXT,
  paciente TEXT,
  cajero TEXT,
  efectivo NUMERIC(10,2) NOT NULL DEFAULT 0,
  pos NUMERIC(10,2) NOT NULL DEFAULT 0,
  transferencia NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  origen TEXT NOT NULL DEFAULT 'excel',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS produccion_detalle_mes_doctor_idx ON public.produccion_detalle (mes, doctor);
CREATE INDEX IF NOT EXISTS produccion_detalle_fecha_idx ON public.produccion_detalle (fecha);

COMMENT ON TABLE public.produccion_detalle IS
  'Cobro a cobro por doctor, dia y paciente (hojas diarias del Excel). Contiene nombres de pacientes.';
COMMENT ON COLUMN public.produccion_detalle.doctor_col IS
  'Etiqueta cruda de la columna del Excel, para trazabilidad (p.ej. DRA VALEZKA en la columna que antes era DR OSCAR).';

-- Seguridad: mismas reglas que el resto del portal.
--   lectura   = cualquier usuario activo de la allowlist (incluye viewer)
--   escritura = solo admin / editor
ALTER TABLE public.produccion_detalle ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.produccion_detalle FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produccion_detalle TO authenticated;

DROP POLICY IF EXISTS portal_allowed_read_produccion_detalle ON public.produccion_detalle;
CREATE POLICY portal_allowed_read_produccion_detalle
ON public.produccion_detalle FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.portal_allowed_users au
          WHERE au.active = true AND lower(au.email) = lower(auth.jwt() ->> 'email'))
);

DROP POLICY IF EXISTS portal_allowed_manage_produccion_detalle ON public.produccion_detalle;
CREATE POLICY portal_allowed_manage_produccion_detalle
ON public.produccion_detalle FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.portal_allowed_users au
          WHERE au.active = true AND au.role IN ('admin','editor')
            AND lower(au.email) = lower(auth.jwt() ->> 'email'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.portal_allowed_users au
          WHERE au.active = true AND au.role IN ('admin','editor')
            AND lower(au.email) = lower(auth.jwt() ->> 'email'))
);

-- CARGA DE LOS DATOS
-- No hay archivo .sql de datos en el repo (ver el aviso de arriba). Se cargan
-- por el importador CSV de Supabase (Table Editor -> produccion_detalle ->
-- Insert -> Import data from CSV) desde el archivo generado localmente.
--
-- Verificacion despues de cargar:
-- SELECT mes, count(*) AS lineas, round(sum(total),2) AS total
--   FROM public.produccion_detalle GROUP BY mes
--   ORDER BY array_position(ARRAY['Enero 2026','Febrero 2026','Marzo 2026','Abril 2026','Mayo 2026','Junio 2026'], mes);
-- Debe dar: Enero 874 / 39,077.51 | Febrero 630 / 28,156.24 | Marzo 723 / 33,042.55
--           Abril 665 / 34,055.72 | Mayo 649 / 28,960.62   | Junio 628 / 27,665.23
--
-- Y el cuadre contra el total por dentista que ya tiene el portal:
-- SELECT d.mes, d.nombre, d.facturacion AS portal, round(sum(x.total),2) AS detalle,
--        round(sum(x.total) - d.facturacion, 2) AS dif
--   FROM public.produccion_dentistas d
--   JOIN public.produccion_detalle x ON x.mes = d.mes AND x.doctor = d.nombre
--  GROUP BY d.mes, d.nombre, d.facturacion
-- HAVING abs(sum(x.total) - d.facturacion) > 0.011;
-- -> deben salir solo las 3 filas de mayo listadas arriba.
