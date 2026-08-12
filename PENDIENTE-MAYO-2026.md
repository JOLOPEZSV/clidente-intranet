# Mayo 2026 — corrección pendiente de aplicar

Estado al 12/08/2026. **Nada de esto está aplicado todavía** ni en el portal ni en Supabase.

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

## Lo que se puede aplicar con confianza (sale directo del PDF)

1. **Mix de cobro de mayo** en `dashboard_mensual`:
   `efectivo = 24536.85`, `tarjeta = 7971.45`, `transferencia = 179.29`
   (hoy tiene 20724.67 / 8056.66 / 179.29)

2. **Producción por dentista de mayo** en `produccion_dentistas`:
   - Dra. Olga Vigil → `5642.47`
   - Dra. Miriam Avelar → `4075.01`
   - Dr. Oscar Guardado → `664.41`
   - Dr. Nelson Erazo → `1926.89`
   (los demás no cambian; Flotante y N/A no son filas de esta tabla)

   Efecto en semáforos: ninguno cambia de estado. Olga y Miriam siguen sobre meta,
   Nelson sigue crítico, Oscar está fuera de comparativa en mayo. Sí cambia la
   **media del grupo**.

3. La **facturación de mayo ya está correcta** en el portal ($32,687.59, venía del PPT).

## Lo que NO se puede aplicar sin la hoja corregida

### Reparto administración / titular de mayo — ⚠️ AFECTA UNA CONCLUSIÓN PRESENTABLE

Hoy la tabla dice `admin 16,706.63 + titular 12,254.00` = 28,960.63, y de ahí sale el
hallazgo **"mayo cerró con $254 de margen sobre la cuota"**, que se presentó como uno de
los dos meses más apretados.

Con la corrección hay **dos lecturas posibles y dan resultados opuestos**:

| Lectura | admin | titular | Margen sobre la cuota |
|---|---|---|---|
| A — el dinero extra se lo llevó la titular | 16,706.63 | 15,980.96 | **+3,980.96** |
| B — el dinero extra se quedó en caja | 20,518.81 | 12,168.78 | **+168.78** |

Con A, mayo deja de ser un mes apretado. Con B, es aún más apretado que lo que dijimos.
**No se puede elegir sin la hoja `ADMINISTRACION DE FONDOS EFECTI` corregida.**

Regla verificada con junio: `admin = egresos en efectivo (sin remesas) + sobrante de caja`.
Junio: 18,369.76 − 4,223.43 = 14,146.33 + 0.00 = 14,146.33 ✓

**Acción recomendada:** poner `admin_operacion` y `retiro_titular` de mayo en NULL y que la
tarjeta muestre "pendiente de corrección", en vez de dejar un dato que ya sabemos falso.

### Caja diaria de mayo (31 días)

Los días suman $28,960.63 de ingreso; ya están desactualizados en $3,726.97. El PDF solo
da totales por quincena, no día por día, así que no se puede repartir sin inventar.

**Acción recomendada:** dejar los días como están pero agregar al dashboard un aviso
general cuando la suma diaria no cuadre con la facturación del mes. Sirve para mayo y para
cualquier mes futuro.

### Egresos por categoría de mayo

La corrección fue de **ingresos**, no de egresos, así que los $18,979.21 probablemente
siguen válidos. No verificado.

## Otro tema abierto: conteo de pacientes de mayo

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
