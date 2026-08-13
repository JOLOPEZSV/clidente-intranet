# Mayo 2026 — estado de la corrección

Actualizado 12/08/2026. **El código ya está aplicado; falta correr el SQL en Supabase.**

Archivo a ejecutar: `supabase-correccion-mayo-2026.sql` (completo, de una sola vez).

## Qué pasó

Ricardo pasó tres archivos de mayo. Henry **nunca le mandó el Excel corregido**; lo único
corregido es el PDF `CAJA MAYO 2026 - RESUMEN DEL MES.pdf` (pie: `31/5/2026 11:03:29`).
Decisión tomada: **ese PDF es la fuente de mayo**.

El `CAJA MAYO 2026.xlsx` de Downloads es **byte por byte idéntico** al que ya teníamos
(2,255,163 bytes) y sigue sin la corrección.

## Corrección de un juicio mío anterior

Yo dije que el número del PPT ($32,687.59) era probablemente el equivocado, porque tres
fuentes del Excel decían $28,960.62. **Estaba mal**: las tres salían del mismo archivo sin
corregir, así que no eran independientes. El PDF corregido y el PPT coinciden en
**$32,687.59**. Ese es el bueno.

## El descuadre de $3,726.97, localizado (todo en la 2ª quincena)

| Profesional | Excel viejo | PDF corregido | Diferencia |
|---|---|---|---|
| Flotante | 276.08 | 2,008.53 | +1,732.45 |
| Dra. Olga Vigil | 3,466.74 | 5,642.47 | +2,175.73 |
| Dra. Miriam Avelar | 4,256.23 | 4,075.01 | −181.22 |
| Dr. Oscar Guardado | 727.27 | 664.41 | −62.86 |
| N/A (línea nueva) | 0.00 | 62.86 | +62.86 |
| Dr. Nelson Erazo | 1,926.88 | 1,926.89 | +0.01 |
| **TOTAL** | | | **+3,726.97** |

Por medio de cobro: efectivo **+3,812.18**, POS **−85.21**, transferencia sin cambio.

---

# ✅ Aplicado

## 1. Mix de cobro de mayo — `dashboard_mensual`

`efectivo = 24536.85`, `tarjeta = 7971.45`, `transferencia = 179.29`
(antes 20724.67 / 8056.66 / 179.29).

Con la corrección los tres suman **exacto $32,687.59**, así que mayo pierde la franja
"Otros / ajustes" que tenía en la gráfica de mix. Eso es, por sí solo, una confirmación
de que la corrección es la buena.

## 2. Producción por dentista de mayo — `produccion_dentistas`

Olga `5642.47` · Miriam `4075.01` · Oscar `664.41` · Nelson `1926.89`. Los demás no cambian
(Flotante y N/A no son filas de esta tabla).

Ningún semáforo cambia de estado. Sí cambia la media del grupo.

## 3. Reparto administración / titular de mayo → **NULL**

El reparto viejo (`admin 16,706.63 + titular 12,254.00` = 28,960.63) salía del Excel sin
corregir, y de ahí venía el hallazgo **"mayo cerró con $254 de margen sobre la cuota"**.
Ese hallazgo queda retirado.

Con la corrección hay **dos lecturas posibles y dan resultados opuestos**:

| Lectura | admin | titular | Margen sobre la cuota |
|---|---|---|---|
| A — el dinero extra se lo llevó la titular | 16,706.63 | 15,980.96 | **+3,980.96** |
| B — el dinero extra se quedó en caja | 20,518.81 | 12,168.78 | **+168.78** |

Elegir una sería inventar, así que mayo va en NULL y **la tarjeta lo muestra como
"pendiente de corrección"** (fila gris, en su lugar cronológico, con el cobrado del mes y
una nota que explica por qué está en blanco). El código de la tarjeta ya no esconde los
meses sin reparto que caen dentro del período: los marca.

Regla verificada con junio: `admin = egresos en efectivo (sin remesas) + sobrante de caja`.
Junio: 18,369.76 − 4,223.43 = 14,146.33 + 0.00 = 14,146.33 ✓

## 4. Aviso de caja diaria descuadrada — nuevo, sirve para cualquier mes

Los 31 días de mayo suman $28,960.63 y el mes cerró en $32,687.59. El PDF solo da totales
por quincena, así que **no se puede repartir día por día sin inventar** y los días se
dejaron como están.

En vez de eso, el dashboard ahora avisa **solo cuando la suma de los días capturados no
cuadra con la facturación del mes**, en meses ya cerrados (en el mes en curso faltan días
por definición, así que no molesta). Mayo dispara el aviso; los demás meses no.

---

# ⏳ Sigue pendiente

## Egresos por categoría de mayo

La corrección fue de **ingresos**, no de egresos, así que los $18,979.21 probablemente
siguen válidos. No verificado.

## Conteo de pacientes de mayo

El PDF `RECEPCION MAYO 2026.pdf` (31 páginas, una por día) es una **fuente nueva e
independiente**: da **858 registros** de pacientes con nombre. Sigue a la caja día por día
con diferencias de 0 a 8, así que ambas registran la misma realidad.

Quedan tres cifras sobre la mesa para mayo:

- **858** — libro de recepción
- **841** — PPT slide 5 (lo que está cargado en el portal)
- **914** — filas con nombre en las hojas diarias de la caja

Conviene cerrar el criterio con Ricardo, y aplicar el mismo a los seis meses.

## Preguntas para Henry / Ricardo

1. El Excel corregido de mayo, del que salió ese PDF (para el detalle diario y el reparto).
2. ¿La cuota de $12,000 al banco sale del retiro de la titular? (sigue sin confirmar)
3. ¿Qué criterio de conteo de pacientes usamos: recepción, caja o el del PPT?

---

# Reunión del viernes — los cuatro números (12/08/2026)

**Ya está en vivo** (commits `da6c4e9` + `fafa79a`, SQL corrido).

La lámina 23 promete: *"cada viernes, cuatro números. 1. Ocupación por silla.
2. Pacientes contra meta. 3. Horas de silla vacía. 4. Garantías."*

Verificación de lo que había antes:

| Número | Estado previo |
|---|---|
| 1. Ocupación por silla | Existía, pero mensual, global y **en pacientes**, no por silla ni en horas |
| 2. Pacientes contra meta | Existía, pero mensual (878/mes) |
| 3. Horas de silla vacía | **No existía** |
| 4. Garantías | **No existía** |

Y el portal entero era mensual: no había concepto de semana.

## Lo que se agregó

- Tabla `seguimiento_semanal`: una fila por **silla y semana** (la semana se
  identifica por su lunes). Los números 1 y 3 solo existen a ese nivel porque
  se miden en **horas de silla**, no en pacientes.
- Sección 12: tarjeta "Reunión del viernes" con los cuatro números y el detalle
  por silla ordenado por ocupación (para ver dónde está la silla vacía).
- Sección 13: cuarta pestaña para capturar la semana. La fecha se normaliza al
  lunes automáticamente.
- Capacidad: **62 horas por silla a la semana** (lámina 11). Meta de pacientes:
  la mensual de 878 prorrateada a **203 por semana**.

## ⚠️ Inconsistencia detectada en la lámina 11

La lámina calcula la capacidad ociosa sobre **496 horas = 8 sillas**, y da 84%.
Pero el resto de la presentación ya usa **7 sillas operativas** (fue el cambio
de $1,350 a $1,542.86 por silla). Con 7 sillas la capacidad es **434 horas** y
la ociosa **81.8%**, no 84%.

El portal usa 7 sillas, consistente con el resto. **Conviene corregir la lámina
11** o explicar por qué ahí se usan 8.

## ⚠️ El dato del muestreo es un prorrateo

De la lámina 11 solo se conoce el **agregado** de la semana 25-31 de mayo
(78.83 horas utilizadas). El detalle por silla que se cargó reparte esas horas
en partes iguales entre las 7 sillas: sirve para que el tablero muestre algo
real, pero **no es una medición silla por silla**. Queda anotado en la columna
`notas` de cada fila.

Cuando Henry capture su primera semana de verdad, esa fila se reemplaza.

---

# De dónde sale cada uno de los cuatro números (13/08/2026)

Se auditaron los archivos fuente (`CAJA MAYO 2026.xlsx`, 42 hojas) buscando el
origen real de cada número. Resultado:

| # | Número | ¿Existe el dato fuente? | Origen hoy |
|---|---|---|---|
| 1 | Ocupación por silla | **No** | Captura semanal de Henry |
| 2 | Pacientes contra meta | **Sí** | `produccion_detalle`, automático |
| 3 | Horas de silla vacía | **No** | Se deriva de 1 |
| 4 | Garantías | **No** | Captura semanal de Henry |

## Los números 1 y 3 no tienen fuente

Las hojas diarias 1..31 tienen: cajero, paciente y tres columnas de forma de
pago por doctor. **No hay columna de silla, ni hora de inicio, ni duración, ni
cita.** Se buscaron esas palabras en las 42 hojas del libro y en todos los xlsx
del equipo: cero coincidencias.

La lámina 11 pudo dar 78.83 horas porque fue un **muestreo manual de una
semana**, no una extracción. Nadie está midiendo tiempo de silla hoy.

## El número 2 ya es automático (commit de hoy)

`produccion_detalle` tiene fecha, paciente y doctor cobro a cobro. La sección 12
y el formulario ahora **cuentan pacientes distintos con cobro entre el lunes y
el domingo** de la semana (`fdPacientesSemanaSistema`). La columna de pacientes
por silla del formulario quedó **opcional**: sirve para saber qué silla atendió
a quién, no para el total.

⚠️ El conteo automático solo ve a **quien pagó**. Los atendidos sin cobro no
están en esa tabla, así que subestima la atención real. El formulario avisa la
diferencia contra lo capturado en vez de esconderla.

## El número 4 no tiene registro — y ahí hay un hallazgo

En todo mayo hay **dos** menciones de garantía, ambas escritas a mano dentro de
la columna del nombre del paciente:

- Día 26: `SONIA FIGUEROA GALICIA  entrega de una garantia`
- Día 22: `MARIA FELICITA ORTEGA DE GONZALEZ DEVOLUCION`

No es un registro: no hay campo, ni catálogo, ni monto.

Lo más cercano que existe es la marca **`XXX`**: paciente atendido, doctor
asignado, sin monto cobrado ese día. Aparece **168 veces en mayo**. Pero mezcla
garantías, controles, continuaciones y cortesías, y nadie las distingue.

**El hallazgo, dicho en una línea:** la clínica atendió 168 veces en un mes sin
registrar cobro y no puede decir cuántas de esas fueron retrabajo propio.

**Arreglo propuesto (cambia el proceso, no el sistema):** que el `XXX` lleve
motivo — garantía / control / continuación / cortesía. Una columna en la hoja
diaria.

## Factor de conversión pacientes → horas (por si hace falta estimar)

Se contaron los pacientes de la semana del muestreo directo del Excel:

| Día | | Pacientes |
|---|---|---|
| 25 | Lun | 29 |
| 26 | Mar | 27 |
| 27 | Mié | 29 |
| 28 | Jue | 25 |
| 29 | Vie | 24 |
| 30 | Sáb | 40 |
| 31 | Dom | 10 |
| | **Total** | **184** |

Control: mayo completo da **882 pacientes** contra la meta de 878, así que el
conteo es bueno.

**78.83 h ÷ 184 pacientes = 0.43 h = 26 minutos por paciente.**

⚠️ **No se implementó, a propósito.** Estimar las horas así vuelve la ocupación
un múltiplo constante de los pacientes: los cuatro números se convierten en
tres, y deja de poder distinguirse "muchos pacientes cortos" de "pocos pacientes
largos" — que es justo la decisión que la Dirección tiene que tomar. Y nunca
diría *cuál* silla está vacía. Queda anotado como último recurso, rotulado como
estimación si algún día se usa.
