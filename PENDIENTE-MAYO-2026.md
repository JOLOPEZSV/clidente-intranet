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
