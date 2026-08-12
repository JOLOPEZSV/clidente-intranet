/* Dashboard Financiero CLIDENTE - Supabase + SPA */

/* Economia de la silla (Propuesta 4, version del 12/08/2026).
   Se derivan de los costos fijos y del numero de sillas OPERATIVAS: antes se
   repartia entre 8 sillas ($1,350) y ahora entre las 7 que realmente operan.
   El piso de rentabilidad es lo que la silla debe PRODUCIR para cubrirse, dado
   que la clinica retiene el 75% de lo producido. */
const FD_COSTOS_FIJOS_MES = 10800;
const FD_SILLAS_OPERATIVAS = 7;
const FD_RETENCION_CLINICA = 0.75;
const FD_COSTO_POR_SILLA = FD_COSTOS_FIJOS_MES / FD_SILLAS_OPERATIVAS;      /* 1,542.86 */
const FD_PISO_RENTABILIDAD = FD_COSTO_POR_SILLA / FD_RETENCION_CLINICA;     /* 2,057.14 */
const FD_META_DENTISTA = 2500;                                             /* "Meta Cero" */
const FD_MAX_BARRA = 6500;
/* Plan original del PPT (asume ~33% de costos variables). Se muestra como referencia;
   el punto de equilibrio operativo se calcula con los costos reales de cada periodo. */
const FD_PLAN_PPT = { punto_equilibrio_px: 418, punto_equilibrio_usd: 16243 };
const FD_PUNTO_EQUILIBRIO = FD_PLAN_PPT.punto_equilibrio_px;
const FD_META_PACIENTES = 878;
const FD_CAPACIDAD_MENSUAL = 3000;
const FD_MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
let fdVistaDashboard = 'mensual';

/* Punto de equilibrio real: costos fijos / margen de contribucion observado.
   Margen de contribucion = 1 - (comisiones + insumos) / facturacion.
   motivo: 'sin_datos' (faltan cifras) o 'margen_negativo' (los costos variables
   superan la facturacion: no existe punto de equilibrio alcanzable). */
function fdPuntoEquilibrioReal(mensual) {
  const facturacion = parseFloat(mensual?.facturacion_total || 0);
  const comisiones = parseFloat(mensual?.comisiones || 0);
  const insumos = parseFloat(mensual?.insumos || 0);
  const costosFijos = parseFloat(mensual?.costos_fijos || 0);
  const pacientes = parseInt(mensual?.pacientes_atendidos || 0, 10);
  if (facturacion <= 0 || costosFijos <= 0) return { valido: false, motivo: 'sin_datos' };
  const margenContribucion = 1 - (comisiones + insumos) / facturacion;
  if (margenContribucion <= 0) return { valido: false, motivo: 'margen_negativo', margenContribucion };
  const usd = costosFijos / margenContribucion;
  const ticket = pacientes > 0 ? facturacion / pacientes : 0;
  const px = ticket > 0 ? Math.ceil(usd / ticket) : null;
  return { valido: true, usd, px, margenContribucion, ticket };
}

function fdMesAnteriorTexto(mesTexto) {
  const parsed = fdParseMesActivo(mesTexto);
  const idx = FD_MESES.indexOf(parsed.mes);
  if (idx <= 0) return `Diciembre ${parsed.anio - 1}`;
  return `${FD_MESES[idx - 1]} ${parsed.anio}`;
}

function fdTieneDatos(mensual) {
  if (!mensual) return false;
  return ['facturacion_total', 'pacientes_atendidos', 'comisiones', 'insumos', 'flujo_neto']
    .some(k => parseFloat(mensual[k] || 0) !== 0);
}

function fdEscapeXml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fdDolarCorto(n) {
  const v = parseFloat(n || 0);
  const abs = Math.abs(v);
  const signo = v < 0 ? '-' : '';
  if (abs >= 1000) {
    return signo + '$' + (abs / 1000).toLocaleString('es-SV', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'k';
  }
  return signo + '$' + abs.toLocaleString('es-SV', { maximumFractionDigits: 0 });
}

const FD_MAYO_2026 = {
  mes: 'Mayo 2026',
  facturacion_total: 30443.34,
  pacientes_atendidos: 783,
  ticket_promedio: 38.87,
  flujo_neto: -964.66,
  costos_fijos: 10800,
  comisiones: 7611,
  insumos: 12997,
  punto_equilibrio: 418
};

const FD_DENTISTAS_MAYO_2026 = [
  { nombre: 'Dra. Dayana Carmona', facturacion: 6279.31, meta: 2500, estado: 'sobre_meta' },
  { nombre: 'Dra. Olga Vigil', facturacion: 5642.47, meta: 2500, estado: 'sobre_meta' },
  { nombre: 'Dra. Miriam Avelar', facturacion: 4075.01, meta: 2500, estado: 'sobre_meta' },
  { nombre: 'Dr. Luis Alarcon', facturacion: 3516.47, meta: 2500, estado: 'sobre_meta' },
  { nombre: 'Dra. Cindy Artiga', facturacion: 3220.42, meta: 2500, estado: 'sobre_meta' },
  { nombre: 'Dra. Haybi Figueroa', facturacion: 2497.91, meta: 2500, estado: 'advertencia' },
  { nombre: 'Dr. Nelson Erazo', facturacion: 1926.89, meta: 2500, estado: 'advertencia' },
  { nombre: 'Dr. Rafael Mendez', facturacion: 1320.45, meta: 2500, estado: 'critico' },
  { nombre: 'Dra. Arriaza', facturacion: 1300.00, meta: 2500, estado: 'critico' },
  { nombre: 'Dr. Oscar Guardado', facturacion: 664.41, meta: 2500, estado: 'critico' },
];

const FD_DENTISTAS_NOMBRES = [
  'Dra. Dayana Carmona',
  'Dra. Olga Vigil',
  'Dra. Miriam Avelar',
  'Dr. Luis Alarcon',
  'Dra. Cindy Artiga',
  'Dra. Haybi Figueroa',
  'Dr. Nelson Erazo',
  'Dr. Rafael Mendez',
  'Dra. Arriaza',
  'Dr. Oscar Guardado',
];

const FD_MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
];

const FD_ANIOS_BASE = [2026, 2027, 2028, 2029, 2030];
/* Mes actual en hora local (nunca via toISOString, que aplica UTC y en
   El Salvador puede correr el dia). */
function fdMesActualLocal() {
  const h = new Date();
  return `${FD_MESES[h.getMonth()]} ${h.getFullYear()}`;
}
let fdMesActivoSeleccionado = fdMesActualLocal();
/* Una vez que el usuario elige un mes a mano, deja de aplicarse el salto
   automatico al ultimo mes con datos. */
let fdMesElegidoPorUsuario = false;
const FD_LOCAL_DASHBOARD_KEY = 'clidente_fd_dashboard_mensual';
const FD_LOCAL_DENTISTAS_KEY = 'clidente_fd_produccion_dentistas';

function fdParseMesActivo(mesTexto = fdMesActivoSeleccionado) {
  const parts = String(mesTexto || 'Mayo 2026').trim().split(/\s+/);
  const anio = parseInt(parts[parts.length - 1], 10) || 2026;
  const mes = parts.slice(0, -1).join(' ') || 'Mayo';
  return {
    mes: FD_MESES.includes(mes) ? mes : 'Mayo',
    anio
  };
}

function fdBuildMesActivo(mes, anio) {
  const cleanMes = FD_MESES.includes(mes) ? mes : 'Mayo';
  const cleanAnio = parseInt(anio, 10) || 2026;
  return `${cleanMes} ${cleanAnio}`;
}

function fdMesOptions(selected = fdParseMesActivo().mes) {
  return FD_MESES.map(mes => `<option value="${mes}" ${mes === selected ? 'selected' : ''}>${mes}</option>`).join('');
}

function fdAnioOptions(selected = fdParseMesActivo().anio, extraAnios = []) {
  const anios = [...new Set([...FD_ANIOS_BASE, ...extraAnios.map(Number).filter(Boolean), Number(selected)])].sort((a, b) => a - b);
  return anios.map(anio => `<option value="${anio}" ${Number(anio) === Number(selected) ? 'selected' : ''}>${anio}</option>`).join('');
}

function fdReadMesControls(prefix) {
  const mes = document.getElementById(`${prefix}-mes`)?.value;
  const anio = document.getElementById(`${prefix}-anio`)?.value;
  return fdBuildMesActivo(mes, anio);
}

function fdSetMesControls(prefix, mesTexto, extraAnios = []) {
  const parsed = fdParseMesActivo(mesTexto);
  const mesSelect = document.getElementById(`${prefix}-mes`);
  const anioSelect = document.getElementById(`${prefix}-anio`);
  if (mesSelect) mesSelect.value = parsed.mes;
  if (anioSelect) {
    anioSelect.innerHTML = fdAnioOptions(parsed.anio, extraAnios);
    anioSelect.value = String(parsed.anio);
  }
}

function fdGetLocalJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function fdSetLocalJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value || []));
}

function fdGetLocalMes(mes) {
  const mensual = fdGetLocalJson(FD_LOCAL_DASHBOARD_KEY).find(row => row.mes === mes);
  const dentistas = fdGetLocalJson(FD_LOCAL_DENTISTAS_KEY).filter(row => row.mes === mes);
  if (!mensual) return null;
  return { mensual, dentistas: dentistas.length ? dentistas : FD_DENTISTAS_NOMBRES.map(nombre => ({ mes, nombre, facturacion: 0, meta: FD_META_DENTISTA, estado: 'critico' })) };
}

function fdGuardarLocal(data) {
  const pe = fdPuntoEquilibrioReal({
    facturacion_total: data.facturacion,
    comisiones: data.comisiones,
    insumos: data.insumos,
    costos_fijos: data.costos,
    pacientes_atendidos: data.pacientes
  });
  const mensualRows = fdGetLocalJson(FD_LOCAL_DASHBOARD_KEY).filter(row => row.mes !== data.mes);
  mensualRows.push({
    mes: data.mes,
    facturacion_total: data.facturacion,
    pacientes_atendidos: data.pacientes,
    ticket_promedio: data.ticket,
    flujo_neto: data.flujo,
    costos_fijos: data.costos,
    comisiones: data.comisiones,
    insumos: data.insumos,
    punto_equilibrio: pe.valido && pe.px ? pe.px : FD_PUNTO_EQUILIBRIO,
    efectivo: data.efectivo,
    tarjeta: data.tarjeta,
    transferencia: data.transferencia,
    local_only: true,
    created_at: new Date().toISOString()
  });
  fdSetLocalJson(FD_LOCAL_DASHBOARD_KEY, mensualRows);

  const dentistaRows = fdGetLocalJson(FD_LOCAL_DENTISTAS_KEY).filter(row => row.mes !== data.mes);
  fdSetLocalJson(FD_LOCAL_DENTISTAS_KEY, dentistaRows.concat(data.dentistas.map(row => ({ ...row, local_only: true, created_at: new Date().toISOString() }))));
}
function formatoDolar(n) {
  return '$' + parseFloat(n || 0).toLocaleString('es-SV', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function fdEntero(n) {
  return parseInt(n || 0, 10).toLocaleString('es-SV');
}

function fdPorcentaje(n) {
  return parseFloat(n || 0).toLocaleString('es-SV', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }) + '%';
}

function fdSupabaseConfigurado() {
  if (typeof supabaseRequest === 'function') return true;
  return typeof SUPABASE_URL !== 'undefined'
    && typeof SUPABASE_KEY !== 'undefined'
    && SUPABASE_URL
    && SUPABASE_KEY
    && !SUPABASE_URL.includes('REEMPLAZAR_CON_TU_SUPABASE_URL')
    && !SUPABASE_KEY.includes('REEMPLAZAR_CON_TU_SUPABASE_ANON_KEY');
}

function fdEstadoDentista(valor, meta = FD_META_DENTISTA, piso = FD_PISO_RENTABILIDAD) {
  const n = parseFloat(valor || 0);
  if (n >= meta) return { key: 'sobre_meta', label: 'Sobre meta', css: 'ok' };
  if (n >= piso) return { key: 'advertencia', label: 'Advertencia', css: 'warn' };
  return { key: 'critico', label: 'Critico', css: 'no' };
}

function fdFiltroMes(mes) {
  return `?mes=eq.${encodeURIComponent(mes)}`;
}

/* Rol propio segun portal_allowed_users (RLS solo deja leer la fila propia).
   'viewer' = solo lectura (Vanessa, Roberto): se le ocultan los controles de
   guardado; la barrera real sigue siendo RLS en Supabase. */
let fdRolPropio = null;
async function fdCargarRolPropio() {
  if (fdRolPropio !== null) return fdRolPropio;
  if (!fdSupabaseConfigurado()) return (fdRolPropio = 'editor');
  try {
    const rows = await fdSupabaseGetRows('portal_allowed_users?select=role&limit=1');
    fdRolPropio = Array.isArray(rows) && rows.length ? (rows[0].role || 'editor') : 'editor';
  } catch {
    fdRolPropio = 'editor';
  }
  return fdRolPropio;
}

async function fdSupabaseGetRows(path) {
  if (typeof supabaseRequest === 'function') return supabaseRequest(path);
  if (typeof supabaseGet === 'function') {
    const queryIndex = path.indexOf('?');
    const tabla = queryIndex === -1 ? path : path.slice(0, queryIndex);
    const filtros = queryIndex === -1 ? '' : path.slice(queryIndex);
    return supabaseGet(tabla, filtros);
  }
  throw new Error('No hay cliente Supabase disponible');
}

async function fdSupabaseInsert(tabla, datos) {
  if (typeof supabaseRequest === 'function') {
    await supabaseRequest(tabla, {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(datos)
    });
    return true;
  }
  if (typeof supabasePost === 'function') return supabasePost(tabla, datos);
  throw new Error('No hay cliente Supabase disponible');
}

async function fdSupabaseDelete(tabla, filtros) {
  if (typeof supabaseRequest === 'function') {
    await supabaseRequest(`${tabla}${filtros}`, { method: 'DELETE' });
    return true;
  }
  if (typeof getSupabaseHeaders === 'function') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabla}${filtros}`, {
      method: 'DELETE',
      headers: getSupabaseHeaders()
    });
    return res.ok;
  }
  if (typeof supabaseHeaders !== 'undefined') {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tabla}${filtros}`, {
      method: 'DELETE',
      headers: supabaseHeaders
    });
    return res.ok;
  }
  throw new Error('No hay cliente Supabase disponible');
}
async function seedMayo2026() {
  if (!fdSupabaseConfigurado()) return false;

  const existentes = await fdSupabaseGetRows('dashboard_mensual?select=id&limit=1');
  if (Array.isArray(existentes) && existentes.length > 0) return false;

  const okDashboard = await fdSupabaseInsert('dashboard_mensual', FD_MAYO_2026);
  const okDentistas = await fdSupabaseInsert('produccion_dentistas', FD_DENTISTAS_MAYO_2026.map(d => ({
    mes: 'Mayo 2026',
    nombre: d.nombre,
    facturacion: d.facturacion,
    meta: d.meta,
    estado: d.estado
  })));

  return okDashboard && okDentistas;
}

/* Ultimo mes que realmente tiene datos. El dashboard debe abrir ahi y no en el
   mes corriente: a inicios de mes (o antes de capturar el cierre) el mes actual
   esta vacio y el portal mostraria ceros. */
function fdMesMasReciente(meses) {
  const orden = m => {
    const p = fdParseMesActivo(m);
    return p.anio * 100 + (FD_MESES.indexOf(p.mes) + 1);
  };
  return (Array.isArray(meses) ? meses : [])
    .filter(Boolean)
    .sort((a, b) => orden(b) - orden(a))[0] || null;
}

async function fdCargarAniosDisponibles() {
  if (!fdSupabaseConfigurado()) return { anios: FD_ANIOS_BASE, ultimoConDatos: null };
  try {
    await seedMayo2026();
    const rows = await fdSupabaseGetRows('dashboard_mensual?select=mes,facturacion_total,pacientes_atendidos');
    const lista = Array.isArray(rows) ? rows : [];
    const anios = lista.map(row => fdParseMesActivo(row.mes).anio).filter(Boolean);
    const conDatos = lista
      .filter(row => parseFloat(row.facturacion_total || 0) || parseInt(row.pacientes_atendidos || 0, 10))
      .map(row => row.mes);
    return {
      anios: [...new Set([...FD_ANIOS_BASE, ...anios])].sort((a, b) => a - b),
      ultimoConDatos: fdMesMasReciente(conDatos)
    };
  } catch (err) {
    console.error('No se pudo cargar la lista de periodos:', err);
    return { anios: FD_ANIOS_BASE, ultimoConDatos: null };
  }
}
async function fdCargarDatosDashboard(mesActivo = fdMesActivoSeleccionado) {
  if (!fdSupabaseConfigurado()) {
    const localData = fdGetLocalMes(mesActivo);
    if (localData) return { ...localData, fallback: true, vista: 'mensual' };
    if (mesActivo === 'Mayo 2026') return { mensual: FD_MAYO_2026, dentistas: FD_DENTISTAS_MAYO_2026, fallback: true, vista: 'mensual' };
    return { mensual: fdBuildEmptyMensual(mesActivo), dentistas: fdDentistasCero(mesActivo), fallback: true, vista: 'mensual' };
  }

  try {
    await seedMayo2026();
    const mensualRows = await fdSupabaseGetRows(`dashboard_mensual?select=*&mes=eq.${encodeURIComponent(mesActivo)}&limit=1`);
    const dentistasRows = await fdSupabaseGetRows(`produccion_dentistas?select=*&mes=eq.${encodeURIComponent(mesActivo)}&order=facturacion.desc`);
    fdDepurarLocalesSincronizados(mensualRows, dentistasRows);
    const localData = fdGetLocalMes(mesActivo);
    const remotoRow = Array.isArray(mensualRows) && mensualRows.length ? mensualRows[0] : null;
    const localRow = localData?.mensual || null;
    const usaLocal = !!(localRow && (!remotoRow || fdFechaRow(localRow) > fdFechaRow(remotoRow)));
    const mensual = usaLocal ? localRow : (remotoRow || fdBuildEmptyMensual(mesActivo));
    const dentistas = usaLocal
      ? (localData?.dentistas || fdDentistasCero(mesActivo))
      : (Array.isArray(dentistasRows) && dentistasRows.length ? dentistasRows : fdDentistasCero(mesActivo));
    return { mensual, dentistas, fallback: usaLocal, vista: 'mensual' };
  } catch (err) {
    console.error('No se pudo cargar Supabase:', err);
    const localData = fdGetLocalMes(mesActivo);
    if (localData) return { ...localData, fallback: true, vista: 'mensual' };
    if (mesActivo === 'Mayo 2026') return { mensual: FD_MAYO_2026, dentistas: FD_DENTISTAS_MAYO_2026, fallback: true, vista: 'mensual' };
    return { mensual: fdBuildEmptyMensual(mesActivo), dentistas: fdDentistasCero(mesActivo), fallback: true, vista: 'mensual' };
  }
}

function fdMesIndice(mesTexto) {
  const parsed = fdParseMesActivo(mesTexto);
  return FD_MESES.indexOf(parsed.mes) + 1;
}

function fdBuildEmptyMensual(mes) {
  return {
    mes,
    facturacion_total: 0,
    pacientes_atendidos: 0,
    ticket_promedio: 0,
    flujo_neto: 0,
    costos_fijos: 10800,
    comisiones: 0,
    insumos: 0,
    punto_equilibrio: FD_PUNTO_EQUILIBRIO,
    meta_pacientes: FD_META_PACIENTES
  };
}

function fdDentistasCero(mes) {
  return FD_DENTISTAS_NOMBRES.map(nombre => ({
    mes,
    nombre,
    facturacion: 0,
    meta: FD_META_DENTISTA,
    estado: 'critico'
  }));
}

function fdFiltrarMensualesAnio(rows, anio, mesLimite) {
  return (Array.isArray(rows) ? rows : [])
    .filter(row => {
      const parsed = fdParseMesActivo(row.mes);
      const idx = fdMesIndice(row.mes);
      return parsed.anio === Number(anio) && idx > 0 && idx <= mesLimite;
    })
    .sort((a, b) => fdMesIndice(a.mes) - fdMesIndice(b.mes));
}

function fdFechaRow(row) {
  const t = Date.parse(row?.created_at || '');
  return Number.isFinite(t) ? t : 0;
}

/* Supabase (fuente compartida) gana sobre el respaldo local, salvo que el respaldo
   local sea mas reciente (guardado sin conexion que aun no llega a Supabase). */
function fdMergeMensuales(remoteRows, localRows) {
  const map = new Map();
  (Array.isArray(remoteRows) ? remoteRows : []).forEach(row => map.set(row.mes, row));
  (Array.isArray(localRows) ? localRows : []).forEach(row => {
    const remoto = map.get(row.mes);
    if (!remoto || fdFechaRow(row) > fdFechaRow(remoto)) map.set(row.mes, row);
  });
  return [...map.values()];
}

function fdMergeDentistas(remoteRows, localRows) {
  const map = new Map();
  (Array.isArray(remoteRows) ? remoteRows : []).forEach(row => {
    if (!row || !row.mes || !row.nombre) return;
    map.set(`${row.mes}||${row.nombre}`, row);
  });
  (Array.isArray(localRows) ? localRows : []).forEach(row => {
    if (!row || !row.mes || !row.nombre) return;
    const key = `${row.mes}||${row.nombre}`;
    const remoto = map.get(key);
    if (!remoto || fdFechaRow(row) > fdFechaRow(remoto)) map.set(key, row);
  });
  return [...map.values()];
}

/* Elimina respaldos locales que ya estan cubiertos por un registro remoto
   igual de reciente o mas nuevo, para que ningun navegador se quede
   mostrando cifras viejas despues de una correccion en Supabase. */
function fdDepurarLocalesSincronizados(remoteMensual, remoteDentistas) {
  const remotoMes = new Map((Array.isArray(remoteMensual) ? remoteMensual : []).map(row => [row.mes, fdFechaRow(row)]));
  const localMes = fdGetLocalJson(FD_LOCAL_DASHBOARD_KEY);
  const vivosMes = localMes.filter(row => !(remotoMes.has(row.mes) && remotoMes.get(row.mes) >= fdFechaRow(row)));
  if (vivosMes.length !== localMes.length) fdSetLocalJson(FD_LOCAL_DASHBOARD_KEY, vivosMes);

  const remotoDen = new Map((Array.isArray(remoteDentistas) ? remoteDentistas : []).map(row => [`${row.mes}||${row.nombre}`, fdFechaRow(row)]));
  const localDen = fdGetLocalJson(FD_LOCAL_DENTISTAS_KEY);
  const vivosDen = localDen.filter(row => {
    const key = `${row.mes}||${row.nombre}`;
    return !(remotoDen.has(key) && remotoDen.get(key) >= fdFechaRow(row));
  });
  if (vivosDen.length !== localDen.length) fdSetLocalJson(FD_LOCAL_DENTISTAS_KEY, vivosDen);
}

function fdDepurarLocalMes(mes) {
  fdSetLocalJson(FD_LOCAL_DASHBOARD_KEY, fdGetLocalJson(FD_LOCAL_DASHBOARD_KEY).filter(row => row.mes !== mes));
  fdSetLocalJson(FD_LOCAL_DENTISTAS_KEY, fdGetLocalJson(FD_LOCAL_DENTISTAS_KEY).filter(row => row.mes !== mes));
}

function fdRowsConMayoBase(rows, anio, mesLimite) {
  const incluyeMayo = Number(anio) === 2026 && mesLimite >= 5;
  if (!incluyeMayo || rows.some(row => row.mes === 'Mayo 2026')) return rows;
  return rows.concat(FD_MAYO_2026);
}

function fdDentistasConMayoBase(rows, mesesIncluidos) {
  if (!mesesIncluidos.has('Mayo 2026') || rows.some(row => row.mes === 'Mayo 2026')) return rows;
  return rows.concat(FD_DENTISTAS_MAYO_2026.map(row => ({ ...row, mes: 'Mayo 2026' })));
}

function fdAgruparDentistas(rows, mesesRegistrados) {
  const map = new Map();
  (Array.isArray(rows) ? rows : []).forEach(row => {
    const nombre = row.nombre || 'Sin nombre';
    const actual = map.get(nombre) || { nombre, facturacion: 0, meta: FD_META_DENTISTA * mesesRegistrados, estado: 'critico', comparable: false };
    actual.facturacion += parseFloat(row.facturacion || 0);
    /* En el acumulado cuenta quien ocupo una silla en AL MENOS un mes del
       periodo: su produccion acumulada si sale de trabajo en silla. */
    if (row.comparable !== false) actual.comparable = true;
    map.set(nombre, actual);
  });
  const grouped = [...map.values()];
  FD_DENTISTAS_NOMBRES.forEach(nombre => {
    if (!map.has(nombre)) grouped.push({ nombre, facturacion: 0, meta: FD_META_DENTISTA * mesesRegistrados, estado: 'critico', comparable: true });
  });
  return grouped.map(row => {
    const estado = fdEstadoDentista(row.facturacion, FD_META_DENTISTA * mesesRegistrados, FD_PISO_RENTABILIDAD * mesesRegistrados);
    return { ...row, estado: estado.key, meta: FD_META_DENTISTA * mesesRegistrados, comparable: row.comparable !== false };
  });
}

async function fdCargarDatosAcumulados(mesActivo = fdMesActivoSeleccionado) {
  const parsed = fdParseMesActivo(mesActivo);
  const mesLimite = fdMesIndice(mesActivo);
  let remoteMensual = [];
  let remoteDentistas = [];
  let fallback = !fdSupabaseConfigurado();

  if (fdSupabaseConfigurado()) {
    try {
      await seedMayo2026();
      remoteMensual = await fdSupabaseGetRows('dashboard_mensual?select=*&order=created_at.asc');
      remoteDentistas = await fdSupabaseGetRows('produccion_dentistas?select=*&order=created_at.asc');
      fdDepurarLocalesSincronizados(remoteMensual, remoteDentistas);
    } catch (err) {
      console.error('No se pudo cargar acumulado desde Supabase:', err);
      fallback = true;
    }
  }
  const localMensual = fdGetLocalJson(FD_LOCAL_DASHBOARD_KEY);
  const localDentistas = fdGetLocalJson(FD_LOCAL_DENTISTAS_KEY);

  let mensuales = fdMergeMensuales(remoteMensual, localMensual);
  mensuales = fdRowsConMayoBase(mensuales, parsed.anio, mesLimite);
  mensuales = fdFiltrarMensualesAnio(mensuales, parsed.anio, mesLimite);

  if (!mensuales.length) {
    return {
      mensual: {
        ...fdBuildEmptyMensual(mesActivo),
        mes: `Acumulado ${parsed.anio}`,
        mes_activo: mesActivo,
        periodo_titulo: `Acumulado ${parsed.anio} hasta ${parsed.mes}`,
        meses_registrados: 0,
        meta_pacientes: 0,
        punto_equilibrio: 0
      },
      dentistas: fdDentistasCero(mesActivo),
      fallback,
      vista: 'acumulado'
    };
  }

  const mesesIncluidos = new Set(mensuales.map(row => row.mes));
  let dentistasRows = fdMergeDentistas(remoteDentistas, localDentistas)
    .filter(row => mesesIncluidos.has(row.mes));
  dentistasRows = fdDentistasConMayoBase(dentistasRows, mesesIncluidos);

  const mesesRegistrados = mensuales.length;
  const facturacion = mensuales.reduce((sum, row) => sum + parseFloat(row.facturacion_total || 0), 0);
  const pacientes = mensuales.reduce((sum, row) => sum + parseInt(row.pacientes_atendidos || 0, 10), 0);
  const comisiones = mensuales.reduce((sum, row) => sum + parseFloat(row.comisiones || 0), 0);
  const insumos = mensuales.reduce((sum, row) => sum + parseFloat(row.insumos || 0), 0);
  const costos = mensuales.reduce((sum, row) => sum + parseFloat(row.costos_fijos || 0), 0);
  const flujo = mensuales.reduce((sum, row) => sum + parseFloat(row.flujo_neto || 0), 0);
  const mesesTexto = mensuales.map(row => fdParseMesActivo(row.mes).mes).join(', ');

  return {
    mensual: {
      mes: `Acumulado ${parsed.anio}`,
      mes_activo: mesActivo,
      periodo_titulo: `Acumulado ${parsed.anio} hasta ${parsed.mes}`,
      periodo_detalle: `${mesesRegistrados} mes(es) registrado(s): ${mesesTexto}`,
      facturacion_total: facturacion,
      pacientes_atendidos: pacientes,
      ticket_promedio: pacientes > 0 ? facturacion / pacientes : 0,
      flujo_neto: flujo,
      costos_fijos: costos,
      comisiones,
      insumos,
      punto_equilibrio: FD_PUNTO_EQUILIBRIO * mesesRegistrados,
      meta_pacientes: FD_META_PACIENTES * mesesRegistrados,
      meses_registrados: mesesRegistrados
    },
    dentistas: fdAgruparDentistas(dentistasRows, mesesRegistrados || 1),
    fallback,
    vista: 'acumulado'
  };
}

/* Serie con todos los meses del anio que tienen datos (para las graficas de evolucion). */
async function fdCargarSerieAnual(anio) {
  let remoteMensual = [];
  if (fdSupabaseConfigurado()) {
    try {
      remoteMensual = await fdSupabaseGetRows('dashboard_mensual?select=*&order=created_at.asc');
    } catch (err) {
      console.error('No se pudo cargar la serie anual:', err);
    }
  }
  let rows = fdMergeMensuales(remoteMensual, fdGetLocalJson(FD_LOCAL_DASHBOARD_KEY));
  rows = fdRowsConMayoBase(rows, anio, 12);
  return fdFiltrarMensualesAnio(rows, anio, 12);
}

/* Zona de clic que cubre la columna entera de un mes en los graficos anuales.
   Transparente pero con fill (un fill:none no recibe eventos). */
function fdSvgZonaMes(mes, x0, yTop, ancho, alto, titulo, tipo = 'mes') {
  const que = tipo === 'operativo' ? 'el resultado operativo' : 'la facturacion diaria';
  return `<g class="fd-drill-zona" data-fd-drill="${tipo}" data-fd-mes="${fdEscapeXml(mes)}" tabindex="0" role="button" aria-label="${fdEscapeXml(`Ver ${que} de ${mes}`)}">
    <rect x="${x0.toFixed(1)}" y="${yTop.toFixed(1)}" width="${ancho.toFixed(1)}" height="${alto.toFixed(1)}" fill="#0f2340" opacity="0"><title>${fdEscapeXml(titulo)}</title></rect>
  </g>`;
}

function fdSvgFacturacionVsPE(rows) {
  const W = 760, H = 250, L = 58, R = 12, T = 26, B = 32;
  const plotW = W - L - R, plotH = H - T - B;
  const porMes = new Map(rows.map(row => [fdMesIndice(row.mes), row]));
  const facturaciones = [...porMes.values()].map(row => Math.max(parseFloat(row.facturacion_total || 0), 0));
  const maxFact = Math.max(...facturaciones, 1);
  const valores = [maxFact];
  porMes.forEach(row => {
    const pe = fdPuntoEquilibrioReal(row);
    /* Un PE desorbitado (margen casi cero) no debe aplastar la escala de todo
       el anio; su linea simplemente queda fuera del chart y el tooltip lo dice. */
    if (pe.valido && pe.usd <= maxFact * 3) valores.push(pe.usd);
  });
  const yMax = Math.max(Math.ceil((Math.max(...valores) * 1.12) / 5000) * 5000, 5000);
  const y = v => T + plotH - (v / yMax) * plotH;
  const slotW = plotW / 12;
  const barW = Math.min(slotW * 0.56, 34);
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Facturacion mensual contra punto de equilibrio real" style="width:100%;height:auto;display:block">`;
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const v = (yMax / ticks) * i;
    out += `<line x1="${L}" y1="${y(v)}" x2="${W - R}" y2="${y(v)}" stroke="${i === 0 ? '#94a3b8' : '#e2e8f0'}" stroke-width="1"/>`;
    out += `<text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#64748b">${fdDolarCorto(v)}</text>`;
  }
  const baseY = T + plotH;
  for (let m = 1; m <= 12; m++) {
    const x0 = L + slotW * (m - 1);
    const cx = x0 + slotW / 2;
    const row = porMes.get(m);
    out += `<text x="${cx}" y="${H - 10}" text-anchor="middle" font-size="11" font-weight="${row ? '700' : '400'}" fill="${row ? '#475569' : '#94a3b8'}">${FD_MESES_CORTOS[m - 1]}</text>`;
    if (!row) continue;
    const fact = Math.max(parseFloat(row.facturacion_total || 0), 0);
    const pe = fdPuntoEquilibrioReal(row);
    const margenNegativo = !pe.valido && pe.motivo === 'margen_negativo';
    const sobre = pe.valido ? fact >= pe.usd : (margenNegativo ? false : null);
    const color = sobre === null ? '#94a3b8' : (sobre ? '#16a34a' : '#dc2626');
    const hBar = Math.max(plotH * fact / yMax, 2);
    const yRect = Math.min(y(fact), baseY - hBar);
    const peFueraEscala = pe.valido && pe.usd > yMax;
    const detalle = `${row.mes}: facturacion ${formatoDolar(fact)}${pe.valido ? ' | PE real ' + formatoDolar(pe.usd) + (sobre ? ' (sobre equilibrio)' : ' (bajo equilibrio)') + (peFueraEscala ? ' - fuera de escala' : '') : (margenNegativo ? ' | costos variables superan la facturacion: sin punto de equilibrio alcanzable' : '')}`;
    /* Toda la columna es zona de clic, no solo la barra: apuntarle a una barra
       de 34px de ancho en un telefono es una miseria. */
    out += fdSvgZonaMes(row.mes, x0, T, slotW, plotH, `${detalle} - clic para ver el mes`);
    out += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${yRect.toFixed(1)}" width="${barW.toFixed(1)}" height="${hBar.toFixed(1)}" rx="3" fill="${color}" pointer-events="none"/>`;
    if (pe.valido && !peFueraEscala) {
      out += `<line x1="${(x0 + slotW * 0.08).toFixed(1)}" y1="${y(pe.usd).toFixed(1)}" x2="${(x0 + slotW * 0.92).toFixed(1)}" y2="${y(pe.usd).toFixed(1)}" stroke="#b45309" stroke-width="2" stroke-dasharray="5 3" pointer-events="none"/>`;
    }
    out += `<text x="${cx}" y="${(yRect - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#334155" stroke="#ffffff" stroke-width="3" style="paint-order:stroke" pointer-events="none">${fdDolarCorto(fact)}</text>`;
  }
  out += '</svg>';
  return out;
}

function fdSvgFlujoMensual(rows) {
  const W = 760, H = 210, L = 58, R = 12, T = 22, B = 32;
  const plotW = W - L - R, plotH = H - T - B;
  const porMes = new Map(rows.map(row => [fdMesIndice(row.mes), row]));
  let minV = 0, maxV = 0;
  porMes.forEach(row => {
    const f = parseFloat(row.flujo_neto || 0);
    minV = Math.min(minV, f);
    maxV = Math.max(maxV, f);
  });
  if (minV === 0 && maxV === 0) maxV = 1000;
  const paso = 500;
  let yMax = Math.max(Math.ceil((maxV * 1.15) / paso) * paso, 0);
  /* Con todos los flujos negativos, headroom proporcional al rango para que
     las etiquetas '$0' y la del tope no se encimen. */
  if (yMax === 0) yMax = Math.max(paso, Math.ceil((Math.abs(minV) * 0.08) / paso) * paso);
  const yMin = Math.min(Math.floor((minV * 1.15) / paso) * paso, 0);
  const y = v => T + plotH * (yMax - v) / (yMax - yMin);
  const slotW = plotW / 12;
  const barW = Math.min(slotW * 0.56, 34);
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Resultado operativo mensual" style="width:100%;height:auto;display:block">`;
  out += `<line x1="${L}" y1="${y(yMax)}" x2="${L}" y2="${y(yMin)}" stroke="#e2e8f0" stroke-width="1"/>`;
  /* El '$0' se etiqueta primero; niveles cuya etiqueta quedaria a <12px de otra
     ya dibujada conservan su gridline pero sin texto (evita encimados). */
  const etiquetasY = [];
  [0, yMin, yMax].filter((v, i, arr) => arr.indexOf(v) === i).forEach(v => {
    out += `<line x1="${L}" y1="${y(v).toFixed(1)}" x2="${W - R}" y2="${y(v).toFixed(1)}" stroke="${v === 0 ? '#94a3b8' : '#e2e8f0'}" stroke-width="${v === 0 ? 1.5 : 1}"/>`;
    const yv = y(v);
    if (etiquetasY.every(prev => Math.abs(prev - yv) >= 12)) {
      etiquetasY.push(yv);
      out += `<text x="${L - 8}" y="${(yv + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#64748b">${fdDolarCorto(v)}</text>`;
    }
  });
  for (let m = 1; m <= 12; m++) {
    const x0 = L + slotW * (m - 1);
    const cx = x0 + slotW / 2;
    const row = porMes.get(m);
    out += `<text x="${cx}" y="${H - 10}" text-anchor="middle" font-size="11" font-weight="${row ? '700' : '400'}" fill="${row ? '#475569' : '#94a3b8'}">${FD_MESES_CORTOS[m - 1]}</text>`;
    if (!row) continue;
    const f = parseFloat(row.flujo_neto || 0);
    const positivo = f >= 0;
    const hBar = Math.max(Math.abs(y(f) - y(0)), 2);
    /* El stub minimo de 2px queda anclado en la linea cero, sin cruzarla. */
    const yTop = positivo ? Math.min(y(f), y(0) - hBar) : y(0);
    const color = f === 0 ? '#94a3b8' : (positivo ? '#16a34a' : '#dc2626');
    out += fdSvgZonaMes(row.mes, x0, T, slotW, plotH, `${row.mes}: resultado operativo ${formatoDolar(f)} - clic para ver como se formo`, 'operativo');
    out += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${yTop.toFixed(1)}" width="${barW.toFixed(1)}" height="${hBar.toFixed(1)}" rx="3" fill="${color}" pointer-events="none"/>`;
    const yLabel = positivo ? yTop - 6 : y(f) + 14;
    out += `<text x="${cx}" y="${yLabel.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#334155" stroke="#ffffff" stroke-width="3" style="paint-order:stroke" pointer-events="none">${fdDolarCorto(f)}</text>`;
  }
  out += '</svg>';
  return out;
}

/* ══════════════════════════════════════════════════════════════════════
   ESTADO DE RESULTADOS Y FLUJO DE EFECTIVO
   Replica el cuadro de la presentacion. Solo se guardan las lineas de
   entrada; las derivadas se calculan aqui para que nunca descuadren.
   ══════════════════════════════════════════════════════════════════════ */
const FD_LOCAL_ER_KEY = 'clidente_fd_estado_resultados';
const FD_ER_LINEAS = ['ingresos', 'costos_variables', 'costos_fijos', 'gastos_financieros', 'pago_bancos'];

function fdCalcularER(row) {
  const n = k => parseFloat(row?.[k] || 0);
  const ingresos = n('ingresos');
  const cv = n('costos_variables');
  const cf = n('costos_fijos');
  const gf = n('gastos_financieros');
  const banco = n('pago_bancos');
  const utilidadBruta = ingresos - cv;
  const resultadoOperativo = utilidadBruta - cf;
  const utilidadNeta = resultadoOperativo - gf;
  /* El Estado de Resultados carga solo los intereses; el flujo carga la cuota
     completa al banco (capital + intereses). De ahi que se pueda tener
     utilidad neta positiva y flujo de efectivo negativo. */
  const flujoEfectivo = resultadoOperativo - banco;
  const pct = v => ingresos > 0 ? (v / ingresos) * 100 : 0;
  return {
    ingresos, costosVariables: cv, costosFijos: cf, gastosFinancieros: gf, pagoBancos: banco,
    utilidadBruta, resultadoOperativo, utilidadNeta, flujoEfectivo,
    margenBruto: pct(utilidadBruta), margenOperativo: pct(resultadoOperativo),
    margenNeto: pct(utilidadNeta), pctVariables: pct(cv), pctFijos: pct(cf),
    pctFinancieros: pct(gf), pctBancos: pct(banco), pctFlujo: pct(flujoEfectivo)
  };
}

async function fdCargarER(mesTexto) {
  const locales = fdGetLocalJson(FD_LOCAL_ER_KEY);
  const local = locales.find(r => r.mes === mesTexto) || null;
  if (!fdSupabaseConfigurado()) return { row: local, fallback: true, lecturaOk: false };
  try {
    const rows = await fdSupabaseGetRows(`estado_resultados?select=*&mes=eq.${encodeURIComponent(mesTexto)}&limit=1`);
    const remoto = Array.isArray(rows) && rows.length ? rows[0] : null;
    const usaLocal = !!(local && (!remoto || fdFechaRow(local) > fdFechaRow(remoto)));
    return { row: usaLocal ? local : remoto, fallback: usaLocal, lecturaOk: true };
  } catch (err) {
    console.error('No se pudo cargar el estado de resultados:', err);
    return { row: local, fallback: true, lecturaOk: false };
  }
}

async function fdCargarSerieER(anio) {
  if (!fdSupabaseConfigurado()) return [];
  try {
    const rows = await fdSupabaseGetRows('estado_resultados?select=*');
    return (Array.isArray(rows) ? rows : [])
      .filter(r => fdParseMesActivo(r.mes).anio === Number(anio))
      .sort((a, b) => fdMesIndice(a.mes) - fdMesIndice(b.mes));
  } catch (err) {
    console.error('No se pudo cargar la serie del estado de resultados:', err);
    return [];
  }
}

async function fdCargarClasificacionEgresos() {
  if (!fdSupabaseConfigurado()) return {};
  try {
    const rows = await fdSupabaseGetRows('clasificacion_egresos?select=categoria,tipo');
    return Object.fromEntries((Array.isArray(rows) ? rows : []).map(r => [String(r.categoria).toUpperCase(), r.tipo]));
  } catch (err) {
    console.error('No se pudo cargar la clasificacion de egresos:', err);
    return {};
  }
}

async function fdCargarEgresosCategoria(mesTexto) {
  if (!fdSupabaseConfigurado()) return [];
  try {
    const rows = await fdSupabaseGetRows(
      `egresos_categoria?select=categoria,monto,orden&mes=eq.${encodeURIComponent(mesTexto)}&order=monto.desc`);
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    /* La tabla puede no existir todavia (SQL sin correr): eso no es un error
       que deba romper el dashboard, solo significa que no hay drill-down. */
    console.error('No se pudieron cargar los egresos por categoria:', err);
    return [];
  }
}

/* ══════════════════════════════════════════════════════════════════════
   DRILL-DOWN
   Cuatro niveles, todos sobre datos que ya estan en la base:
     barra de mes  -> el dashboard entero salta a ese mes
     fila dentista -> su evolucion en el anio
     punto del dia -> el detalle de ese dia
     "Costos"      -> las 20 categorias de egreso del mes
   El panel es uno solo y se reutiliza; navegar por mes NO abre panel, porque
   ahi el detalle ya es la vista mensual completa que el portal sabe dibujar.
   ══════════════════════════════════════════════════════════════════════ */
function fdDrillCerrar() {
  const ov = document.getElementById('fd-drill-overlay');
  if (ov) ov.remove();
  document.removeEventListener('keydown', fdDrillEsc);
}

function fdDrillEsc(ev) {
  if (ev.key === 'Escape') fdDrillCerrar();
}

function fdDrillAbrir(titulo, subtitulo, html) {
  fdDrillCerrar();
  const ov = document.createElement('div');
  ov.id = 'fd-drill-overlay';
  ov.className = 'fd-drill-overlay';
  ov.innerHTML = `<div class="fd-drill-panel" role="dialog" aria-modal="true" aria-label="${fdEscapeXml(titulo)}">
    <div class="fd-drill-head">
      <div>
        <h3>${fdEscapeXml(titulo)}</h3>
        ${subtitulo ? `<p>${fdEscapeXml(subtitulo)}</p>` : ''}
      </div>
      <button type="button" class="fd-drill-close" aria-label="Cerrar">&times;</button>
    </div>
    <div class="fd-drill-body">${html}</div>
  </div>`;
  ov.addEventListener('click', ev => { if (ev.target === ov) fdDrillCerrar(); });
  /* El overlay cuelga de <body>, fuera del root del dashboard, asi que necesita
     su propio handler para que se pueda encadenar un nivel mas (del mes al dia). */
  ov.addEventListener('click', fdDrillHandler);
  ov.addEventListener('keydown', fdDrillTeclado);
  ov.querySelector('.fd-drill-close').addEventListener('click', fdDrillCerrar);
  document.body.appendChild(ov);
  document.addEventListener('keydown', fdDrillEsc);
  ov.querySelector('.fd-drill-close').focus();
}

function fdDrillCargando(titulo) {
  fdDrillAbrir(titulo, '', '<p class="fd-note">Cargando detalle...</p>');
}

function fdDrillBody(html) {
  const body = document.querySelector('#fd-drill-overlay .fd-drill-body');
  if (body) body.innerHTML = html;
}

function fdDrillSub(texto) {
  const p = document.querySelector('#fd-drill-overlay .fd-drill-head p');
  const cont = document.querySelector('#fd-drill-overlay .fd-drill-head > div');
  if (p) p.textContent = texto;
  else if (cont) cont.insertAdjacentHTML('beforeend', `<p>${fdEscapeXml(texto)}</p>`);
}

/* Navegar a un mes = mover el selector y dejar que cargarVista haga el resto.
   No se duplica logica de carga. */
function fdDrillIrAMes(mesTexto) {
  const parsed = fdParseMesActivo(mesTexto);
  const selMes = document.getElementById('fd-dashboard-mes');
  const selAnio = document.getElementById('fd-dashboard-anio');
  if (!selMes) return;
  if (selAnio && String(parsed.anio) !== selAnio.value &&
      [...selAnio.options].some(o => o.value === String(parsed.anio))) {
    selAnio.value = String(parsed.anio);
  }
  selMes.value = parsed.mes;
  selMes.dispatchEvent(new Event('change', { bubbles: true }));
  document.getElementById('dashboard-financiero-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Barras horizontales simples, en HTML. Sirven para las tres vistas de detalle
   sin arrastrar otro generador de SVG. */
function fdDrillBarras(items, opciones = {}) {
  const max = Math.max(...items.map(i => Math.abs(i.valor)), 1);
  const filas = items.map(i => {
    const w = Math.max((Math.abs(i.valor) / max) * 100, i.valor ? 1.5 : 0);
    const clases = [i.tenue ? 'fd-drill-tenue' : '', i.attrs ? 'fd-drill-fila' : ''].filter(Boolean).join(' ');
    return `<tr${clases ? ` class="${clases}"` : ''}${i.attrs || ''}>
      <td>${fdEscapeXml(i.etiqueta)}${i.nota ? ` <em class="fd-drill-nota">${fdEscapeXml(i.nota)}</em>` : ''}</td>
      <td class="num"><strong>${formatoDolar(i.valor)}</strong></td>
      ${opciones.pct ? `<td class="num">${fdPorcentaje(i.pct || 0)}</td>` : ''}
      <td class="fd-drill-barra"><div class="fd-mini-track"><div class="fd-mini-fill ${i.css || 'neutro'}" style="width:${w.toFixed(1)}%"></div></div></td>
    </tr>`;
  }).join('');
  return `<table class="fd-table fd-drill-tabla">
    <thead><tr><th>${opciones.col1 || 'Concepto'}</th><th class="num">${opciones.col2 || 'Monto'}</th>${opciones.pct ? '<th class="num">%</th>' : ''}<th></th></tr></thead>
    <tbody>${filas}</tbody></table>`;
}

/* 'Marzo 2026' a partir de '2026-03-15'. El detalle de un dia tiene que saber
   de que mes es sin depender del mes que este activo en el dashboard: desde el
   panel de un mes se puede abrir un dia de OTRO mes. */
function fdMesTextoDeISO(fechaISO) {
  const [a, m] = String(fechaISO).split('-').map(Number);
  return `${FD_MESES[(m || 1) - 1]} ${a}`;
}

/* Barras de un dia por columna, con la linea del promedio. Los fines de semana
   van en un tono mas claro: el patron semanal es la mitad de la historia. */
function fdSvgDiarioMes(detalle, mesTexto, promedio) {
  const W = 700, H = 210, L = 52, R = 10, T = 16, B = 34;
  const plotW = W - L - R, plotH = H - T - B;
  const diasMes = fdDiasDelMes(mesTexto) || 31;
  const porDia = new Map(detalle.map(r => [parseInt(String(r.fecha).slice(-2), 10), r]));
  const maxV = Math.max(...detalle.map(r => r.ingreso), 1);
  const yMax = maxV * 1.14;
  const y = v => T + plotH - (v / yMax) * plotH;
  const slot = plotW / diasMes;
  const barW = Math.max(Math.min(slot * 0.72, 20), 2);
  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Facturacion dia a dia de ${fdEscapeXml(mesTexto)}" style="width:100%;height:auto;display:block">`;
  [0, yMax / 2, yMax].forEach(v => {
    out += `<line x1="${L}" y1="${y(v).toFixed(1)}" x2="${W - R}" y2="${y(v).toFixed(1)}" stroke="${v === 0 ? '#94a3b8' : '#e2e8f0'}" stroke-width="1"/>`;
    out += `<text x="${L - 6}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="#64748b">${fdDolarCorto(v)}</text>`;
  });
  for (let d = 1; d <= diasMes; d++) {
    const cx = L + slot * (d - 1) + slot / 2;
    const r = porDia.get(d);
    const iso = fdFechaISO(mesTexto, d);
    const [ay, am, ad] = iso.split('-').map(Number);
    const finde = [0, 6].includes(new Date(ay, am - 1, ad).getDay());
    if (r && r.ingreso > 0) {
      const alto = Math.max(plotH * r.ingreso / yMax, 1.5);
      out += `<g class="fd-drill-zona" data-fd-drill="dia" data-fd-fecha="${iso}" tabindex="0" role="button" aria-label="${fdEscapeXml(`Ver el detalle del ${iso}`)}">
        <rect x="${(cx - slot / 2).toFixed(1)}" y="${T}" width="${slot.toFixed(1)}" height="${plotH.toFixed(1)}" fill="#0f2340" opacity="0"><title>${fdEscapeXml(`${iso} (${fdDiaSemana(iso)}): ${formatoDolar(r.ingreso)}${r.pacientes ? ' - ' + r.pacientes + ' pacientes' : ''} - clic para el detalle`)}</title></rect>
        <rect x="${(cx - barW / 2).toFixed(1)}" y="${y(r.ingreso).toFixed(1)}" width="${barW.toFixed(1)}" height="${alto.toFixed(1)}" rx="2" fill="${finde ? '#86c9a0' : '#16a34a'}" pointer-events="none"/>
      </g>`;
    } else {
      /* Dia sin movimiento: un tic gris al pie, para que se vea que existio y
         estuvo cerrado en vez de desaparecer del eje. */
      out += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${(T + plotH - 2).toFixed(1)}" width="${barW.toFixed(1)}" height="2" fill="#e2e8f0"><title>${fdEscapeXml(`${iso} (${fdDiaSemana(iso)}): sin movimiento`)}</title></rect>`;
    }
    if (d === 1 || d % 5 === 0) {
      out += `<text x="${cx.toFixed(1)}" y="${(H - 16).toFixed(1)}" text-anchor="middle" font-size="10" fill="#64748b">${d}</text>`;
    }
  }
  if (promedio > 0) {
    out += `<line x1="${L}" y1="${y(promedio).toFixed(1)}" x2="${W - R}" y2="${y(promedio).toFixed(1)}" stroke="#b45309" stroke-width="1.5" stroke-dasharray="5 3" pointer-events="none"/>`;
    out += `<text x="${W - R}" y="${(y(promedio) - 5).toFixed(1)}" text-anchor="end" font-size="10" font-weight="700" fill="#b45309" pointer-events="none">promedio ${fdDolarCorto(promedio)}</text>`;
  }
  out += `<text x="${(L + plotW / 2).toFixed(1)}" y="${H - 2}" text-anchor="middle" font-size="10" fill="#94a3b8">Dia del mes &middot; barra clara = fin de semana</text>`;
  out += '</svg>';
  return out;
}

async function fdDrillMes(mesTexto) {
  fdDrillCargando(`Facturacion diaria - ${mesTexto}`);
  let rows = [], mensual = null;
  try {
    const [caja, serie] = await Promise.all([
      fdCargarCajaDiaria(mesTexto),
      fdCargarSerieAnual(fdParseMesActivo(mesTexto).anio)
    ]);
    rows = caja.rows;
    mensual = (serie || []).find(m => m.mes === mesTexto) || null;
  } catch (err) {
    console.error('No se pudo cargar la facturacion diaria:', err);
  }
  if (!document.getElementById('fd-drill-overlay')) return;
  const conMov = rows.filter(r => parseFloat(r.ingreso || 0) > 0);
  const irAlMes = `<p class="fd-drill-acciones"><button type="button" class="fd-drill-ir" data-fd-drill="ir-mes" data-fd-mes="${fdEscapeXml(mesTexto)}">Abrir ${fdEscapeXml(mesTexto)} en el dashboard &rarr;</button></p>`;
  if (!conMov.length) {
    fdDrillBody(`<p class="fd-note">No hay caja diaria capturada para ${fdEscapeXml(mesTexto)}. El detalle por dia se ingresa en "Ingresar datos del mes".</p>${irAlMes}`);
    return;
  }
  const res = fdResumenCajaDiaria(rows.filter(r =>
    parseFloat(r.ingreso || 0) || parseFloat(r.egreso || 0) || parseFloat(r.pago_banco || 0)));
  const diarios = res.detalle.filter(r => r.ingreso > 0);
  const total = diarios.reduce((s, r) => s + r.ingreso, 0);
  const prom = total / diarios.length;
  const pacientes = diarios.reduce((s, r) => s + (parseInt(r.pacientes, 10) || 0), 0);
  const orden = diarios.slice().sort((a, b) => b.ingreso - a.ingreso);
  const mejor = orden[0], peor = orden[orden.length - 1];
  const facturado = parseFloat(mensual?.facturacion_total || 0);

  /* Por dia de la semana: es el patron que decide en que dias conviene abrir. */
  const semana = Array.from({ length: 7 }, () => ({ suma: 0, n: 0 }));
  diarios.forEach(r => {
    const [a, m, d] = String(r.fecha).split('-').map(Number);
    const i = new Date(a, m - 1, d).getDay();
    semana[i].suma += r.ingreso;
    semana[i].n++;
  });
  const itemsSemana = [1, 2, 3, 4, 5, 6, 0].filter(i => semana[i].n).map(i => ({
    etiqueta: FD_DIAS_SEMANA[i],
    valor: semana[i].suma / semana[i].n,
    nota: `${semana[i].n} ${semana[i].n === 1 ? 'dia' : 'dias'}`,
    css: 'ok'
  }));

  const brecha = facturado ? facturado - total : 0;
  const avisoBrecha = facturado && Math.abs(brecha) > 1
    ? `<p class="fd-note"><strong class="fd-negative">Los dias suman ${formatoDolar(total)} y el mes cerro en ${formatoDolar(facturado)}: ${formatoDolar(Math.abs(brecha))} de diferencia.</strong> El detalle diario es lo cobrado en caja; la facturacion del mes es la cifra oficial. Cuando no cuadran, el bueno es el cierre.</p>`
    : (facturado ? `<p class="fd-note">Los dias suman exactamente la facturacion del mes.</p>` : '');

  fdDrillSub(`${diarios.length} dias con ingreso · promedio ${formatoDolar(prom)}/dia${pacientes ? ` · ${fdEntero(pacientes)} pacientes` : ''}`);
  fdDrillBody(
    fdSvgDiarioMes(res.detalle, mesTexto, prom) +
    `<div class="fd-drill-cifras">
       <div><span>Cobrado en el mes</span><strong>${formatoDolar(total)}</strong></div>
       <div><span>Mejor dia</span><strong>${formatoDolar(mejor.ingreso)}</strong><em>${mejor.fecha} (${fdDiaSemana(mejor.fecha)})</em></div>
       <div><span>Mas flojo</span><strong>${formatoDolar(peor.ingreso)}</strong><em>${peor.fecha} (${fdDiaSemana(peor.fecha)})</em></div>
     </div>` +
    avisoBrecha +
    `<p class="fd-chart-subtitle" style="margin-top:1rem">Promedio por dia de la semana</p>` +
    fdDrillBarras(itemsSemana, { col1: 'Dia', col2: 'Promedio' }) +
    `<p class="fd-note">Clic en cualquier dia de la grafica para ver su detalle.</p>` +
    irAlMes);
}

/* Fila del desglose del resultado operativo. Los restos van entre parentesis,
   igual que en el Estado de Resultados, para no leerlos como sumas. */
function fdFilaOperativo(etiqueta, valor, pct, clase = '', resta = false) {
  return `<tr class="${clase}">
    <td>${etiqueta}</td>
    <td class="num ${valor < 0 ? 'fd-negative' : ''}">${resta && valor > 0 ? `(${formatoDolar(valor)})` : formatoDolar(valor)}</td>
    <td class="num">${fdPorcentaje(pct)}</td>
  </tr>`;
}

async function fdDrillOperativo(mesTexto) {
  fdDrillCargando(`Resultado operativo - ${mesTexto}`);
  const anio = fdParseMesActivo(mesTexto).anio;
  let serieER = [], serieMes = [];
  try {
    [serieER, serieMes] = await Promise.all([fdCargarSerieER(anio), fdCargarSerieAnual(anio)]);
  } catch (err) {
    console.error('No se pudo cargar el detalle del resultado operativo:', err);
  }
  if (!document.getElementById('fd-drill-overlay')) return;
  const rowER = (serieER || []).find(r => r.mes === mesTexto);
  const rowMes = (serieMes || []).find(r => r.mes === mesTexto);
  if (!rowER && !rowMes) {
    fdDrillBody(`<p class="fd-note">No hay Estado de Resultados cargado para ${fdEscapeXml(mesTexto)}.</p>`);
    return;
  }
  /* El ER es la fuente cuando existe; si el mes solo tiene la fila del
     dashboard, se arma el equivalente para no dejar el panel vacio. */
  const er = fdCalcularER(rowER || {
    ingresos: rowMes?.facturacion_total,
    costos_variables: parseFloat(rowMes?.comisiones || 0) + parseFloat(rowMes?.insumos || 0),
    costos_fijos: rowMes?.costos_fijos
  });
  const comisiones = parseFloat(rowMes?.comisiones || 0);
  const insumos = parseFloat(rowMes?.insumos || 0);
  /* Comisiones + insumos deben dar los costos variables del ER. Si el mes se
     capturo por separado y no cuadran, se muestra la diferencia como "otros"
     en vez de dejar una tabla que no suma. */
  const otrosVar = er.costosVariables - comisiones - insumos;
  const pct = v => er.ingresos > 0 ? (v / er.ingresos) * 100 : 0;

  let tabla = `<table class="fd-table fd-er-tabla">
    <thead><tr><th>Concepto</th><th class="num">Monto</th><th class="num">% de ingresos</th></tr></thead><tbody>` +
    fdFilaOperativo('Ingresos', er.ingresos, 100);
  if (comisiones || insumos) {
    tabla += fdFilaOperativo('Comisiones de doctores', comisiones, pct(comisiones), '', true);
    tabla += fdFilaOperativo('Insumos y descartables', insumos, pct(insumos), '', true);
    if (Math.abs(otrosVar) > 1) tabla += fdFilaOperativo('Otros costos variables', otrosVar, pct(otrosVar), '', true);
  } else {
    tabla += fdFilaOperativo('Costos variables', er.costosVariables, er.pctVariables, '', true);
  }
  tabla += fdFilaOperativo('Margen de contribucion', er.utilidadBruta, er.margenBruto, 'fd-er-subtotal') +
    fdFilaOperativo('Costos fijos', er.costosFijos, er.pctFijos, '', true) +
    fdFilaOperativo('Resultado operativo', er.resultadoOperativo, er.margenOperativo, 'fd-er-total') +
    '</tbody></table>';

  /* Puente contra el mes anterior: ΔRO = ΔIngresos - ΔVariables - ΔFijos.
     Las tres partes suman la diferencia exacta, sin residuo que explicar. */
  const idx = fdMesIndice(mesTexto);
  const prevTexto = idx > 1 ? `${FD_MESES[idx - 2]} ${anio}` : null;
  const rowPrev = prevTexto ? (serieER || []).find(r => r.mes === prevTexto) : null;
  let puente = '';
  if (rowPrev) {
    const ant = fdCalcularER(rowPrev);
    const dRO = er.resultadoOperativo - ant.resultadoOperativo;
    const partes = [
      { etiqueta: 'Por ingresos', valor: er.ingresos - ant.ingresos },
      { etiqueta: 'Por costos variables', valor: -(er.costosVariables - ant.costosVariables) },
      { etiqueta: 'Por costos fijos', valor: -(er.costosFijos - ant.costosFijos) }
    ].filter(p => Math.abs(p.valor) > 1);
    const dominante = partes.slice().sort((a, b) => Math.abs(b.valor) - Math.abs(a.valor))[0];
    puente =
      `<p class="fd-chart-subtitle" style="margin-top:1.1rem">Que explica el cambio contra ${fdEscapeXml(FD_MESES[idx - 2])}</p>` +
      fdDrillBarras(partes.map(p => ({
        etiqueta: p.etiqueta,
        valor: p.valor,
        css: p.valor >= 0 ? 'ok' : 'no'
      })), { col1: 'Efecto', col2: 'Impacto' }) +
      `<p class="fd-note">El resultado operativo ${dRO >= 0 ? 'subio' : 'bajo'} ${formatoDolar(Math.abs(dRO))} contra ${fdEscapeXml(FD_MESES[idx - 2])} (${formatoDolar(ant.resultadoOperativo)} &rarr; ${formatoDolar(er.resultadoOperativo)})${dominante ? `, y lo que mas pesa es <strong>${fdEscapeXml(dominante.etiqueta.toLowerCase())}</strong> con ${formatoDolar(Math.abs(dominante.valor))}` : ''}. Los efectos listados suman la diferencia exacta; los que no aparecen es porque no se movieron.</p>`;
  }

  const cuota = er.pagoBancos;
  const notaCuota = cuota > 0
    ? `<p class="fd-note"><strong>Esto es antes de la cuota al banco.</strong> Con los ${formatoDolar(cuota)} de cuota, el mes deja ${formatoDolar(er.flujoEfectivo)} de flujo de efectivo${er.flujoEfectivo < 0 ? ': la operacion no alcanza a cubrirla sola' : ''}.</p>`
    : '';

  fdDrillSub(`Margen operativo ${fdPorcentaje(er.margenOperativo)} · margen de contribucion ${fdPorcentaje(er.margenBruto)}`);
  fdDrillBody(tabla + puente + notaCuota +
    `<p class="fd-drill-acciones">
       <button type="button" class="fd-drill-ir" data-fd-drill="costos" data-fd-mes="${fdEscapeXml(mesTexto)}">Ver en que se fue el efectivo &rarr;</button>
       <button type="button" class="fd-drill-ir" data-fd-drill="mes" data-fd-mes="${fdEscapeXml(mesTexto)}">Ver la facturacion diaria &rarr;</button>
     </p>`);
}

/* Nivel mas fino que existe: los cobros de un doctor en un mes, tal como
   quedaron en las hojas diarias. Sale de produccion_detalle. */
async function fdDrillDentistaMes(nombre, mesTexto) {
  fdDrillCargando(`${nombre} - ${mesTexto}`);
  let filas = [];
  try {
    filas = await fdSupabaseGetRows(
      `produccion_detalle?select=fecha,paciente,efectivo,pos,transferencia,total` +
      `&doctor=eq.${encodeURIComponent(nombre)}&mes=eq.${encodeURIComponent(mesTexto)}&order=fecha.asc`);
  } catch (err) {
    console.error('No se pudo cargar el detalle del dentista:', err);
  }
  if (!document.getElementById('fd-drill-overlay')) return;
  const volver = `<p class="fd-drill-acciones"><button type="button" class="fd-drill-ir" data-fd-drill="dentista" data-fd-nombre="${fdEscapeXml(nombre)}">&larr; Volver al anio de ${fdEscapeXml(nombre)}</button></p>`;
  if (!Array.isArray(filas) || !filas.length) {
    fdDrillBody(`<p class="fd-note">No hay detalle cargado para ${fdEscapeXml(nombre)} en ${fdEscapeXml(mesTexto)}. El detalle diario existe desde enero 2026 y se carga con <code>supabase-produccion-detalle.sql</code>.</p>${volver}`);
    return;
  }
  const num = (r, k) => parseFloat(r[k] || 0);
  const total = filas.reduce((s, r) => s + num(r, 'total'), 0);
  const efectivo = filas.reduce((s, r) => s + num(r, 'efectivo'), 0);
  const pos = filas.reduce((s, r) => s + num(r, 'pos'), 0);
  const transf = filas.reduce((s, r) => s + num(r, 'transferencia'), 0);
  /* Un paciente puede pagar varias veces en el mes: para el ticket interesa
     cuanta gente distinta atendio, no cuantos cobros hubo. */
  const pacientes = new Set(filas.map(r => String(r.paciente || '').trim()).filter(Boolean)).size;
  const negativos = filas.filter(r => num(r, 'total') < 0);

  const porDia = new Map();
  filas.forEach(r => porDia.set(r.fecha, (porDia.get(r.fecha) || 0) + num(r, 'total')));
  const dias = [...porDia.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const mejor = dias.slice().sort((a, b) => b[1] - a[1])[0];

  const mix = [
    { etiqueta: 'Efectivo', valor: efectivo, css: 'ok' },
    { etiqueta: 'POS / tarjeta', valor: pos, css: 'warn' },
    { etiqueta: 'Transferencia', valor: transf, css: 'neutro' }
  ].filter(i => Math.abs(i.valor) > 0.005);

  const cobros = filas.slice().sort((a, b) => num(b, 'total') - num(a, 'total')).slice(0, 40);
  const tabla = `<table class="fd-table fd-drill-tabla">
    <thead><tr><th>Fecha</th><th>Paciente</th><th class="num">Monto</th></tr></thead>
    <tbody>${cobros.map(r => `<tr${num(r, 'total') < 0 ? ' class="fd-drill-tenue"' : ''}>
      <td>${fdEscapeXml(String(r.fecha))}</td>
      <td>${fdEscapeXml(String(r.paciente || '(sin nombre)'))}</td>
      <td class="num ${num(r, 'total') < 0 ? 'fd-negative' : ''}"><strong>${formatoDolar(num(r, 'total'))}</strong></td>
    </tr>`).join('')}</tbody></table>`;

  fdDrillSub(`${filas.length} cobros · ${pacientes} pacientes distintos · ${dias.length} dias con produccion`);
  fdDrillBody(
    `<div class="fd-drill-cifras">
       <div><span>Producido en el mes</span><strong>${formatoDolar(total)}</strong></div>
       <div><span>Ticket por paciente</span><strong>${pacientes ? formatoDolar(total / pacientes) : '&mdash;'}</strong></div>
       <div><span>Mejor dia</span><strong>${formatoDolar(mejor[1])}</strong><em>${mejor[0]} (${fdDiaSemana(mejor[0])})</em></div>
     </div>` +
    `<p class="fd-chart-subtitle" style="margin-top:1rem">Como le pagaron</p>` +
    fdDrillBarras(mix, { col1: 'Medio de cobro', col2: 'Monto' }) +
    `<p class="fd-chart-subtitle" style="margin-top:1rem">Cobros del mes${filas.length > 40 ? ` &middot; los 40 mas altos de ${filas.length}` : ''}</p>` +
    tabla +
    (negativos.length
      ? `<p class="fd-note">${negativos.length} ${negativos.length === 1 ? 'linea es negativa' : 'lineas son negativas'} (nota de credito o reverso) y ya ${negativos.length === 1 ? 'esta restada' : 'estan restadas'} del total.</p>`
      : '') +
    volver);
}

async function fdDrillDentista(nombre) {
  const anio = fdParseMesActivo(fdMesActivoSeleccionado).anio;
  fdDrillCargando(nombre);
  let filas = [];
  try {
    const rows = await fdSupabaseGetRows(
      `produccion_dentistas?select=mes,facturacion,meta,estado,comparable&nombre=eq.${encodeURIComponent(nombre)}`);
    filas = (Array.isArray(rows) ? rows : [])
      .filter(r => fdParseMesActivo(r.mes).anio === anio)
      .sort((a, b) => fdMesIndice(a.mes) - fdMesIndice(b.mes));
  } catch (err) {
    console.error('No se pudo cargar la serie del dentista:', err);
  }
  if (!document.getElementById('fd-drill-overlay')) return;
  if (!filas.length) {
    fdDrillBody(`<p class="fd-note">No hay meses registrados para ${fdEscapeXml(nombre)} en ${anio}.</p>`);
    return;
  }
  const piso = FD_COSTOS_FIJOS_MES / FD_SILLAS_OPERATIVAS / FD_RETENCION_CLINICA;
  const meta = parseFloat(filas[0].meta || 0) || 2500;
  const activos = filas.filter(f => parseFloat(f.facturacion || 0) > 0);
  const total = filas.reduce((s, f) => s + parseFloat(f.facturacion || 0), 0);
  const prom = activos.length ? total / activos.length : 0;
  const items = filas.map(f => {
    const v = parseFloat(f.facturacion || 0);
    const fuera = f.comparable === false;
    return {
      etiqueta: fdParseMesActivo(f.mes).mes,
      valor: v,
      nota: fuera ? 'fuera de comparativa' : (v < piso ? 'bajo el piso' : ''),
      tenue: fuera,
      css: fuera ? 'neutro' : fdEstadoDentista(v, meta, piso).css,
      /* Cada mes baja un nivel mas: los cobros de ese doctor en ese mes. */
      attrs: ` data-fd-drill="dentista-mes" data-fd-nombre="${fdEscapeXml(nombre)}" data-fd-mes="${fdEscapeXml(f.mes)}" tabindex="0" role="button" title="Ver los cobros de ${fdEscapeXml(f.mes)}"`
    };
  });
  const bajoPiso = items.filter(i => !i.tenue && i.valor < piso).length;
  const resumen = bajoPiso
    ? `${bajoPiso} de ${items.filter(i => !i.tenue).length} meses comparables por debajo del piso de ${formatoDolar(piso)}.`
    : `Ningun mes comparable cayo bajo el piso de ${formatoDolar(piso)}.`;
  fdDrillSub(`${anio} · promedio ${formatoDolar(prom)}/mes en ${activos.length} meses con produccion`);
  fdDrillBody(
    fdDrillBarras(items, { col1: 'Mes', col2: 'Produccion' }) +
    `<p class="fd-note">Meta Cero ${formatoDolar(meta)} · piso de rentabilidad ${formatoDolar(piso)} (${formatoDolar(FD_COSTOS_FIJOS_MES)} entre ${FD_SILLAS_OPERATIVAS} sillas, sobre ${fdPorcentaje(FD_RETENCION_CLINICA * 100)} de retencion). ${resumen}</p>
     <p class="fd-note">Clic en cualquier mes para ver sus cobros, paciente por paciente.</p>`);
}

async function fdDrillDia(fechaISO) {
  /* El mes sale de la fecha, no del selector: desde el panel de un mes se puede
     abrir un dia que no pertenece al mes activo del dashboard. */
  const mesTexto = fdMesTextoDeISO(fechaISO);
  fdDrillCargando(`${fechaISO} (${fdDiaSemana(fechaISO)})`);
  let res = null;
  try {
    const data = await fdCargarCajaDiaria(mesTexto);
    res = fdResumenCajaDiaria(data.rows.filter(r =>
      parseFloat(r.ingreso || 0) || parseFloat(r.egreso || 0) || parseFloat(r.pago_banco || 0)));
  } catch (err) {
    console.error('No se pudo cargar el detalle del dia:', err);
  }
  if (!document.getElementById('fd-drill-overlay')) return;
  const dia = res?.detalle.find(r => String(r.fecha) === String(fechaISO));
  if (!dia) {
    fdDrillBody('<p class="fd-note">No hay movimiento registrado ese dia.</p>');
    return;
  }
  const conIngreso = res.detalle.filter(r => r.ingreso > 0);
  const promDia = conIngreso.length ? conIngreso.reduce((s, r) => s + r.ingreso, 0) / conIngreso.length : 0;
  const mejores = conIngreso.slice().sort((a, b) => b.ingreso - a.ingreso);
  const puesto = mejores.findIndex(r => r.fecha === dia.fecha) + 1;
  const vsProm = promDia ? ((dia.ingreso - promDia) / promDia) * 100 : 0;
  const items = [
    { etiqueta: 'Ingreso del dia', valor: dia.ingreso, css: 'ok' },
    { etiqueta: 'Egreso en efectivo', valor: dia.egreso, css: 'no' },
    { etiqueta: 'Pago al banco', valor: dia.pago_banco, css: 'warn' }
  ];
  fdDrillSub(`${mesTexto} · ${dia.pacientes || 0} pacientes`);
  fdDrillBody(
    fdDrillBarras(items, { col1: 'Movimiento', col2: 'Monto' }) +
    `<div class="fd-drill-cifras">
       <div><span>Neto del dia</span><strong class="${dia.neto >= 0 ? 'fd-positive' : 'fd-negative'}">${formatoDolar(dia.neto)}</strong></div>
       <div><span>Acumulado del mes hasta hoy</span><strong class="${dia.saldo >= 0 ? 'fd-positive' : 'fd-negative'}">${formatoDolar(dia.saldo)}</strong></div>
       <div><span>Ticket del dia</span><strong>${dia.pacientes ? formatoDolar(dia.ingreso / dia.pacientes) : '&mdash;'}</strong></div>
     </div>
     <p class="fd-note">Puesto ${puesto} de ${conIngreso.length} dias con ingreso del mes; ${vsProm >= 0 ? 'arriba' : 'abajo'} del promedio diario (${formatoDolar(promDia)}) por ${fdPorcentaje(Math.abs(vsProm))}. El acumulado arranca en cero cada mes: es flujo del periodo, no saldo bancario.</p>
     <p class="fd-drill-acciones"><button type="button" class="fd-drill-ir" data-fd-drill="mes" data-fd-mes="${fdEscapeXml(mesTexto)}">&larr; Ver los ${conIngreso.length} dias de ${fdEscapeXml(mesTexto)}</button></p>`);
}

async function fdDrillCostos(mesTexto) {
  /* Texto plano: el titulo se escapa, asi que una entidad HTML saldria literal. */
  fdDrillCargando(`Egresos en efectivo - ${mesTexto}`);
  const [cats, clasif] = await Promise.all([
    fdCargarEgresosCategoria(mesTexto),
    fdCargarClasificacionEgresos()
  ]);
  if (!document.getElementById('fd-drill-overlay')) return;
  if (!cats.length) {
    fdDrillBody(`<p class="fd-note">Todavia no hay egresos por categoria cargados para ${fdEscapeXml(mesTexto)}. Se cargan con <code>supabase-egresos-categoria.sql</code>.</p>`);
    return;
  }
  const CSS = { variable: 'warn', fijo: 'no', financiero: 'neutro', excluido: 'neutro' };
  const ETIQ = { variable: 'variable', fijo: 'fijo', financiero: 'financiero', excluido: 'excluido - no es gasto' };
  const conMonto = cats.filter(c => parseFloat(c.monto || 0) > 0);
  const total = conMonto.reduce((s, c) => s + parseFloat(c.monto || 0), 0);
  const items = conMonto.map(c => {
    const tipo = clasif[String(c.categoria).toUpperCase()] || 'fijo';
    return {
      etiqueta: c.categoria,
      valor: parseFloat(c.monto || 0),
      pct: total ? (parseFloat(c.monto || 0) / total) * 100 : 0,
      nota: ETIQ[tipo] || tipo,
      tenue: tipo === 'excluido',
      css: CSS[tipo] || 'neutro'
    };
  });
  const porTipo = {};
  items.forEach(i => {
    const t = clasif[i.etiqueta.toUpperCase()] || 'fijo';
    porTipo[t] = (porTipo[t] || 0) + i.valor;
  });
  const excluido = porTipo.excluido || 0;
  const resumenTipos = Object.entries(porTipo)
    .sort((a, b) => b[1] - a[1])
    .map(([t, v]) => `${ETIQ[t] || t}: ${formatoDolar(v)}`)
    .join(' · ');
  fdDrillSub(`${conMonto.length} categorias con movimiento · total ${formatoDolar(total)}`);
  fdDrillBody(
    fdDrillBarras(items, { col1: 'Categoria', col2: 'Egreso', pct: true }) +
    `<p class="fd-note">${resumenTipos}.</p>
     <p class="fd-note"><strong>Esto es salida de efectivo, no el costo del Estado de Resultados.</strong>${excluido > 0 ? ` De este total, ${formatoDolar(excluido)} son traslados o inversion de capital y no son gasto del periodo.` : ''} Por eso este total y la linea de costos del ER no tienen por que coincidir.</p>`);
}

/* Un solo listener para todo el dashboard: los SVG se redibujan enteros en
   cada carga, asi que enganchar handlers por elemento los perderia. */
function fdDrillHandler(ev) {
  const objetivo = ev.target.closest?.('[data-fd-drill]');
  if (!objetivo) return;
  const tipo = objetivo.getAttribute('data-fd-drill');
  if (tipo === 'mes') fdDrillMes(objetivo.getAttribute('data-fd-mes'));
  else if (tipo === 'operativo') fdDrillOperativo(objetivo.getAttribute('data-fd-mes'));
  else if (tipo === 'dentista') fdDrillDentista(objetivo.getAttribute('data-fd-nombre'));
  else if (tipo === 'dentista-mes') fdDrillDentistaMes(objetivo.getAttribute('data-fd-nombre'), objetivo.getAttribute('data-fd-mes'));
  else if (tipo === 'dia') fdDrillDia(objetivo.getAttribute('data-fd-fecha'));
  else if (tipo === 'costos') fdDrillCostos(objetivo.getAttribute('data-fd-mes') || fdMesActivoSeleccionado);
  else if (tipo === 'ir-mes') { fdDrillCerrar(); fdDrillIrAMes(objetivo.getAttribute('data-fd-mes')); }
}

/* Teclado: las filas y los grupos SVG llevan tabindex, asi que Enter/Espacio
   deben hacer lo mismo que el clic. */
function fdDrillTeclado(ev) {
  if (ev.key !== 'Enter' && ev.key !== ' ') return;
  const objetivo = ev.target.closest?.('[data-fd-drill]');
  if (!objetivo) return;
  ev.preventDefault();
  objetivo.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function fdDrillInit() {
  const root = document.getElementById('dashboard-financiero-root');
  if (!root || root.dataset.drillListo === '1') return;
  root.dataset.drillListo = '1';
  root.addEventListener('click', fdDrillHandler);
  root.addEventListener('keydown', fdDrillTeclado);
}

/* ══════════════════════════════════════════════════════════════════════
   INFORME EJECUTIVO EN PDF
   Una pagina para que Henry se lo mande por WhatsApp a la Dra. Olga.
   Se dibuja con jsPDF (no captura de pantalla) para que salga nitido y
   legible en un telefono.
   ══════════════════════════════════════════════════════════════════════ */
const FD_JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

function fdCargarJsPDF() {
  if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = FD_JSPDF_URL;
    s.onload = () => window.jspdf?.jsPDF ? resolve(window.jspdf.jsPDF) : reject(new Error('jsPDF no quedo disponible'));
    s.onerror = () => reject(new Error('No se pudo descargar el generador de PDF (revisa la conexion)'));
    document.head.appendChild(s);
  });
}

const FD_PDF_COLORES = {
  navy: [15, 35, 64], dorado: [180, 83, 9], verde: [22, 163, 74], rojo: [220, 38, 38],
  gris: [100, 116, 139], grisClaro: [241, 245, 249], texto: [30, 41, 59], blanco: [255, 255, 255]
};

function fdPdfKpi(doc, x, y, w, etiqueta, valor, color) {
  doc.setFillColor(...FD_PDF_COLORES.grisClaro);
  doc.roundedRect(x, y, w, 52, 4, 4, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(...FD_PDF_COLORES.gris);
  doc.setFont('helvetica', 'bold');
  doc.text(String(etiqueta).toUpperCase(), x + 9, y + 16);
  doc.setFontSize(15);
  doc.setTextColor(...(color || FD_PDF_COLORES.navy));
  doc.text(String(valor), x + 9, y + 38);
}

async function fdGenerarInformeEjecutivo(mesTexto) {
  const jsPDF = await fdCargarJsPDF();
  const datos = await fdCargarDatosDashboard(mesTexto);
  const mensual = datos.mensual || {};
  const dentistas = (datos.dentistas || []).slice()
    .sort((a, b) => parseFloat(b.facturacion || 0) - parseFloat(a.facturacion || 0));
  let diaria = { rows: [] };
  try { diaria = await fdCargarCajaDiaria(mesTexto); } catch { /* opcional */ }
  const caja = fdResumenCajaDiaria(diaria.rows.filter(r =>
    parseFloat(r.ingreso || 0) || parseFloat(r.egreso || 0) || parseFloat(r.pago_banco || 0)));

  const fact = parseFloat(mensual.facturacion_total || 0);
  const pac = parseInt(mensual.pacientes_atendidos || 0, 10);
  const ticket = pac > 0 ? fact / pac : 0;
  const flujo = parseFloat(mensual.flujo_neto || 0);
  const pe = fdPuntoEquilibrioReal(mensual);

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const M = 40;
  const ancho = W - M * 2;

  /* Encabezado */
  doc.setFillColor(...FD_PDF_COLORES.navy);
  doc.rect(0, 0, W, 82, 'F');
  doc.setTextColor(...FD_PDF_COLORES.blanco);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('Clinica Dental Clidente', M, 36);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Informe ejecutivo - ${mesTexto}`, M, 56);
  doc.setFontSize(8);
  doc.setTextColor(200, 214, 232);
  doc.text('Preparado por la administracion', W - M, 36, { align: 'right' });
  doc.text(`Generado el ${new Date().toLocaleDateString('es-SV')}`, W - M, 52, { align: 'right' });

  let y = 108;

  /* KPIs */
  const wKpi = (ancho - 24) / 4;
  fdPdfKpi(doc, M, y, wKpi, 'Facturacion', formatoDolar(fact));
  fdPdfKpi(doc, M + wKpi + 8, y, wKpi, 'Pacientes', fdEntero(pac));
  fdPdfKpi(doc, M + (wKpi + 8) * 2, y, wKpi, 'Ticket promedio', formatoDolar(ticket));
  fdPdfKpi(doc, M + (wKpi + 8) * 3, y, wKpi, 'Resultado operativo', formatoDolar(flujo),
    flujo >= 0 ? FD_PDF_COLORES.verde : FD_PDF_COLORES.rojo);
  y += 72;

  /* Punto de equilibrio */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...FD_PDF_COLORES.navy);
  doc.text('Punto de equilibrio', M, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...FD_PDF_COLORES.texto);
  const lineaPE = pe.valido && pe.px
    ? `Con el margen de contribucion de este mes (${fdPorcentaje(pe.margenContribucion * 100)}), la clinica cubre sus costos fijos a partir de ${fdEntero(pe.px)} pacientes (${formatoDolar(pe.usd)}). Este mes atendio ${fdEntero(pac)}: ${pac >= pe.px ? 'equilibrio cubierto' : 'faltaron ' + fdEntero(pe.px - pac) + ' pacientes'}.`
    : 'No hay datos suficientes del mes para calcular el punto de equilibrio.';
  doc.text(doc.splitTextToSize(lineaPE, ancho), M, y);
  y += doc.getTextDimensions(doc.splitTextToSize(lineaPE, ancho)).h + 14;

  /* Alerta de caja (lo que el cierre mensual no muestra) */
  if (caja.diasConDatos) {
    const critico = !!caja.peorSaldo.fecha;
    doc.setFillColor(...(critico ? [254, 226, 226] : [220, 252, 231]));
    const textoCaja = critico
      ? `Alerta de caja: el saldo de efectivo se vuelve negativo el ${caja.peorSaldo.fecha} y toca fondo en ${formatoDolar(caja.peorSaldo.valor)}. El mes cierra con ${formatoDolar(caja.saldoFinal)} despues de ${formatoDolar(caja.banco)} de pagos al banco.`
      : `Caja del mes: ingresos ${formatoDolar(caja.ingresos)}, egresos ${formatoDolar(caja.egresos)}, pagos al banco ${formatoDolar(caja.banco)}. El saldo acumulado nunca baja de cero y cierra en ${formatoDolar(caja.saldoFinal)}.`;
    const lineas = doc.splitTextToSize(textoCaja, ancho - 20);
    const alto = doc.getTextDimensions(lineas).h + 18;
    doc.roundedRect(M, y, ancho, alto, 4, 4, 'F');
    doc.setTextColor(...(critico ? [153, 27, 27] : [22, 101, 52]));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(lineas, M + 10, y + 14);
    y += alto + 16;
  }

  /* Produccion por dentista */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...FD_PDF_COLORES.navy);
  doc.text('Produccion por dentista', M, y);
  y += 14;
  doc.setFillColor(...FD_PDF_COLORES.navy);
  doc.rect(M, y, ancho, 18, 'F');
  doc.setTextColor(...FD_PDF_COLORES.blanco);
  doc.setFontSize(8);
  doc.text('DENTISTA', M + 8, y + 12);
  doc.text('FACTURACION', M + ancho * 0.52, y + 12);
  doc.text('META $2,500', M + ancho * 0.75, y + 12);
  y += 18;

  const maxFact = Math.max(...dentistas.map(d => parseFloat(d.facturacion || 0)), 1);
  doc.setFont('helvetica', 'normal');
  dentistas.slice(0, 12).forEach((d, i) => {
    const v = parseFloat(d.facturacion || 0);
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(M, y, ancho, 17, 'F');
    }
    doc.setTextColor(...FD_PDF_COLORES.texto);
    doc.setFontSize(8.5);
    doc.text(String(d.nombre || '').slice(0, 34), M + 8, y + 12);
    doc.setFont('helvetica', 'bold');
    doc.text(formatoDolar(v), M + ancho * 0.52, y + 12);
    doc.setFont('helvetica', 'normal');
    /* Barra proporcional con el color del estado */
    const est = fdEstadoDentista(v);
    const col = est.key === 'sobre_meta' ? FD_PDF_COLORES.verde : est.key === 'advertencia' ? FD_PDF_COLORES.dorado : FD_PDF_COLORES.rojo;
    const wBarra = ancho * 0.2;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(M + ancho * 0.75, y + 5, wBarra, 7, 2, 2, 'F');
    doc.setFillColor(...col);
    const wLleno = Math.max(Math.min(v / maxFact, 1) * wBarra, 1.5);
    doc.roundedRect(M + ancho * 0.75, y + 5, wLleno, 7, 2, 2, 'F');
    y += 17;
  });

  y += 16;

  /* Mix de cobro */
  const ef = parseFloat(mensual.efectivo || 0);
  const ta = parseFloat(mensual.tarjeta || 0);
  const tr = parseFloat(mensual.transferencia || 0);
  if (ef + ta + tr > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...FD_PDF_COLORES.navy);
    doc.text('Como cobro la clinica', M, y);
    y += 14;
    const totalCobros = ef + ta + tr;
    const segmentos = [[ef, FD_PDF_COLORES.verde, 'Efectivo'], [ta, [29, 78, 216], 'POS'], [tr, [124, 58, 237], 'Transferencia']];
    let x = M;
    segmentos.forEach(([v, c]) => {
      if (v <= 0) return;
      const w = (v / totalCobros) * ancho;
      doc.setFillColor(...c);
      doc.rect(x, y, w, 14, 'F');
      x += w;
    });
    y += 24;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...FD_PDF_COLORES.texto);
    doc.text(segmentos.filter(s => s[0] > 0)
      .map(([v, , n]) => `${n}: ${formatoDolar(v)} (${fdPorcentaje(v / totalCobros * 100)})`).join('     '), M, y);
    y += 18;
  }

  /* Pie */
  const alturaPag = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(M, alturaPag - 46, W - M, alturaPag - 46);
  doc.setFontSize(7.5);
  doc.setTextColor(...FD_PDF_COLORES.gris);
  doc.text('Fuentes: control de caja, FG Dental y contador externo. Confidencial - uso exclusivo de Clinica Dental Clidente.', M, alturaPag - 32);
  doc.text('Generado desde el Portal de Gestion Clidente.', M, alturaPag - 21);

  return { doc, nombre: `Informe Clidente ${mesTexto}.pdf` };
}

async function fdCompartirInformeEjecutivo() {
  const btn = document.getElementById('fd-btn-informe');
  const original = btn?.innerHTML;
  try {
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...'; }
    const mesTexto = fdVistaDashboard === 'acumulado'
      ? fdReadMesControls('fd-dashboard')
      : (fdMesActivoSeleccionado || fdReadMesControls('fd-dashboard'));
    const { doc, nombre } = await fdGenerarInformeEjecutivo(mesTexto);
    const blob = doc.output('blob');
    const archivo = new File([blob], nombre, { type: 'application/pdf' });
    /* En el telefono abre la hoja de compartir (WhatsApp incluido);
       en escritorio simplemente descarga el PDF. */
    if (navigator.canShare?.({ files: [archivo] })) {
      await navigator.share({
        files: [archivo],
        title: `Informe Clidente ${mesTexto}`,
        text: `Informe ejecutivo de ${mesTexto} - Clinica Dental Clidente`
      });
    } else {
      doc.save(nombre);
    }
  } catch (err) {
    if (err?.name === 'AbortError') return;   /* el usuario cerro la hoja de compartir */
    console.error(err);
    alert(`No se pudo generar el informe: ${err?.message || 'error desconocido'}`);
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = original; }
  }
}

/* Curva de saldo acumulado del mes: el grafico de la propuesta 1.
   Muestra con cuanto efectivo cuenta la clinica cada dia y marca los pagos
   al banco, que son los que hunden el saldo. */
function fdSvgCajaDiaria(detalle, mesTexto) {
  const W = 760, H = 240, L = 58, R = 12, T = 22, B = 40;
  const plotW = W - L - R, plotH = H - T - B;
  const n = detalle.length;
  if (!n) return '';
  const saldos = detalle.map(r => r.saldo);
  const maxS = Math.max(...saldos, 0);
  const minS = Math.min(...saldos, 0);
  const span = (maxS - minS) || 1;
  const yMax = maxS + span * 0.12;
  const yMin = minS - span * 0.12;
  const y = v => T + plotH * (yMax - v) / (yMax - yMin);
  /* Eje X en escala de calendario: un mes a medio capturar debe verse a medias,
     no estirado a todo el ancho. */
  const diasMes = fdDiasDelMes(mesTexto) || 31;
  const diaDe = r => parseInt(String(r.fecha).slice(-2), 10) || 1;
  const x = i => L + (plotW * (diaDe(detalle[i]) - 1)) / Math.max(diasMes - 1, 1);

  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Saldo de caja acumulado dia a dia" style="width:100%;height:auto;display:block">`;
  [yMax, 0, yMin].filter((v, i, a) => a.indexOf(v) === i).forEach(v => {
    out += `<line x1="${L}" y1="${y(v).toFixed(1)}" x2="${W - R}" y2="${y(v).toFixed(1)}" stroke="${v === 0 ? '#94a3b8' : '#e2e8f0'}" stroke-width="${v === 0 ? 1.5 : 1}"/>`;
    out += `<text x="${L - 8}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#64748b">${fdDolarCorto(v)}</text>`;
  });

  /* Area bajo la curva, partida en el cruce por cero para pintar en rojo
     el tramo en que la clinica opera sin efectivo. */
  const puntos = detalle.map((r, i) => `${x(i).toFixed(1)},${y(r.saldo).toFixed(1)}`).join(' ');
  const y0 = y(0).toFixed(1);
  out += `<defs><clipPath id="fd-clip-pos"><rect x="${L}" y="${T}" width="${plotW}" height="${(parseFloat(y0) - T).toFixed(1)}"/></clipPath>`;
  out += `<clipPath id="fd-clip-neg"><rect x="${L}" y="${y0}" width="${plotW}" height="${(T + plotH - parseFloat(y0)).toFixed(1)}"/></clipPath></defs>`;
  const area = `${x(0).toFixed(1)},${y0} ${puntos} ${x(n - 1).toFixed(1)},${y0}`;
  out += `<polygon points="${area}" fill="#16a34a" opacity=".14" clip-path="url(#fd-clip-pos)"/>`;
  out += `<polygon points="${area}" fill="#dc2626" opacity=".16" clip-path="url(#fd-clip-neg)"/>`;
  out += `<polyline points="${puntos}" fill="none" stroke="#0f2340" stroke-width="2" stroke-linejoin="round"/>`;

  detalle.forEach((r, i) => {
    const dia = parseInt(String(r.fecha).slice(-2), 10);
    const cx = x(i), cy = y(r.saldo);
    const titulo = r.pago_banco > 0
      ? `${r.fecha}: pago al banco ${formatoDolar(r.pago_banco)} - saldo ${formatoDolar(r.saldo)}`
      : `${r.fecha} (${fdDiaSemana(r.fecha)}): ingreso ${formatoDolar(r.ingreso)}, egreso ${formatoDolar(r.egreso)} - saldo ${formatoDolar(r.saldo)}`;
    if (r.pago_banco > 0) {
      out += `<line x1="${cx.toFixed(1)}" y1="${T}" x2="${cx.toFixed(1)}" y2="${(T + plotH).toFixed(1)}" stroke="#b45309" stroke-width="1.5" stroke-dasharray="4 3" opacity=".85" pointer-events="none"/>`;
    }
    /* El circulo visible es pequenio; el aro transparente de 11px es el que
       recibe el clic, para que el dia se pueda tocar con el dedo. */
    out += `<g class="fd-drill-zona" data-fd-drill="dia" data-fd-fecha="${fdEscapeXml(String(r.fecha))}" tabindex="0" role="button" aria-label="${fdEscapeXml(`Ver el detalle del ${r.fecha}`)}">
      <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="11" fill="#0f2340" opacity="0"><title>${fdEscapeXml(titulo + ' - clic para el detalle')}</title></circle>
      <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.pago_banco > 0 ? 5 : 3}" fill="${r.pago_banco > 0 ? '#b45309' : (r.saldo < 0 ? '#dc2626' : '#0f2340')}"${r.pago_banco > 0 ? ' stroke="#fff" stroke-width="2"' : ''} pointer-events="none"/>
    </g>`;
    if (dia === 1 || dia % 5 === 0) {
      out += `<text x="${cx.toFixed(1)}" y="${(H - 14).toFixed(1)}" text-anchor="middle" font-size="10" fill="#64748b">${dia}</text>`;
    }
  });
  out += `<text x="${(L + plotW / 2).toFixed(1)}" y="${H - 2}" text-anchor="middle" font-size="10" fill="#94a3b8">Dia del mes</text>`;
  out += '</svg>';
  return out;
}

/* Cascada del flujo de efectivo: ingresos -> costos -> pago a bancos -> flujo,
   igual que el grafico de la presentacion. */
function fdSvgCascadaFlujo(er, mesTexto = '') {
  const W = 720, H = 250, L = 12, R = 12, T = 30, B = 44;
  const plotW = W - L - R, plotH = H - T - B;
  const costos = er.costosVariables + er.costosFijos;
  const pasos = [
    { etiqueta: 'Ingresos', valor: er.ingresos, base: 0, color: '#1d4ed8' },
    { etiqueta: 'Costos', valor: costos, base: er.ingresos - costos, color: '#b45309', drill: 'costos' },
    { etiqueta: 'Pago a bancos', valor: er.pagoBancos, base: er.ingresos - costos - er.pagoBancos, color: '#b45309' },
    { etiqueta: 'Flujo de efectivo', valor: Math.abs(er.flujoEfectivo), base: Math.min(er.flujoEfectivo, 0), color: er.flujoEfectivo >= 0 ? '#16a34a' : '#dc2626' }
  ];
  const tope = Math.max(er.ingresos, 1) * 1.08;
  const piso = Math.min(er.flujoEfectivo, 0) * 1.6 - tope * 0.02;
  const y = v => T + plotH * (tope - v) / (tope - piso);
  const slot = plotW / pasos.length;
  const ancho = Math.min(slot * 0.5, 96);

  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Cascada del flujo de efectivo" style="width:100%;height:auto;display:block">`;
  out += `<line x1="${L}" y1="${y(0).toFixed(1)}" x2="${W - R}" y2="${y(0).toFixed(1)}" stroke="#94a3b8" stroke-width="1.5"/>`;
  pasos.forEach((p, i) => {
    const cx = L + slot * i + slot / 2;
    const yTop = y(p.base + p.valor);
    const alto = Math.max(Math.abs(y(p.base) - y(p.base + p.valor)), 2);
    const clicable = p.drill && mesTexto;
    const tituloBarra = `${p.etiqueta}: ${formatoDolar(p.valor)}${clicable ? ' - clic para ver en que se fue' : ''}`;
    if (clicable) {
      out += `<g class="fd-drill-zona" data-fd-drill="${p.drill}" data-fd-mes="${fdEscapeXml(mesTexto)}" tabindex="0" role="button" aria-label="${fdEscapeXml(`Ver el desglose de costos de ${mesTexto}`)}">`;
    }
    out += `<rect x="${(cx - ancho / 2).toFixed(1)}" y="${yTop.toFixed(1)}" width="${ancho.toFixed(1)}" height="${alto.toFixed(1)}" rx="3" fill="${p.color}"><title>${fdEscapeXml(tituloBarra)}</title></rect>`;
    if (clicable) out += '</g>';
    const dentro = alto > 26;
    const etiquetaY = dentro ? yTop + alto / 2 + 4 : yTop - 7;
    out += `<text x="${cx.toFixed(1)}" y="${etiquetaY.toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="800" fill="${dentro ? '#ffffff' : '#334155'}"${dentro ? '' : ' stroke="#ffffff" stroke-width="3" style="paint-order:stroke"'} pointer-events="none">${fdDolarCorto(p.etiqueta === 'Flujo de efectivo' ? er.flujoEfectivo : p.valor)}</text>`;
    out += `<text x="${cx.toFixed(1)}" y="${(H - 16).toFixed(1)}" text-anchor="middle" font-size="11" fill="#475569" pointer-events="none">${fdEscapeXml(p.etiqueta)}${clicable ? ' ▾' : ''}</text>`;
  });
  out += '</svg>';
  return out;
}

function fdFilaER(etiqueta, valor, pct, clase = '') {
  const negativo = /costos|gastos|pago/i.test(etiqueta);
  const monto = negativo && valor > 0 ? `(${formatoDolar(valor)})` : formatoDolar(valor);
  return `<tr class="${clase}">
    <td>${etiqueta}</td>
    <td class="num ${valor < 0 ? 'fd-negative' : ''}">${monto}</td>
    <td class="num">${negativo && pct > 0 ? '(' + fdPorcentaje(pct) + ')' : fdPorcentaje(pct)}</td>
  </tr>`;
}

/* ══ Indicadores financieros clave ══
   Los de balance salen de tabla (estados auditados, no se calculan mes a mes).
   Los de paciente y el punto de equilibrio se calculan del periodo activo.
   Convencion de color de la presentacion:
     neutro = informativo | alerta = problema | umbral = meta por cruzar | meta = objetivo */
async function fdCargarIndicadoresBalance() {
  if (!fdSupabaseConfigurado()) return [];
  try {
    const rows = await fdSupabaseGetRows('indicadores_financieros?select=*&order=orden.asc');
    return Array.isArray(rows) ? rows : [];
  } catch (err) {
    console.error('No se pudieron cargar los indicadores de balance:', err);
    return [];
  }
}

function fdFormatoIndicador(valor, formato) {
  const v = parseFloat(valor || 0);
  if (formato === 'pct') return fdPorcentaje(v);
  if (formato === 'usd') return formatoDolar(v);
  return `${v.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
}

function fdTarjetaIndicador(valor, etiqueta, estado = 'neutro', nota = '') {
  return `<div class="fd-ind-card ${estado}">
    <strong>${valor}</strong>
    <span>${etiqueta}</span>
    ${nota ? `<small>${nota}</small>` : ''}
  </div>`;
}

async function fdRenderIndicadores(mensual, er, esAcumulado, mesesPeriodo, sigueVigente = () => true) {
  const card = document.getElementById('fd-indicadores-card');
  if (!card) return;
  const pacientes = parseInt(mensual?.pacientes_atendidos || 0, 10);
  const ingresos = parseFloat(mensual?.facturacion_total || 0);
  if (!pacientes || !ingresos || !er) {
    card.style.display = 'none';
    return;
  }

  const balance = await fdCargarIndicadoresBalance();
  if (!sigueVigente()) return;
  card.style.display = '';
  fdSetText('fd-ind-periodo', esAcumulado ? `— acumulado ${mesesPeriodo} mes(es)` : `— ${mensual.mes}`);

  /* ── Por paciente ── */
  const costoTotal = er.costosVariables + er.costosFijos;
  const porPaciente = [
    [formatoDolar(ingresos / pacientes), 'Ticket promedio ponderado', 'neutro', ''],
    [formatoDolar(costoTotal / pacientes), 'Costo total por paciente', 'neutro', ''],
    [formatoDolar(er.resultadoOperativo / pacientes), 'Margen operativo', er.resultadoOperativo >= 0 ? 'neutro' : 'alerta', fdPorcentaje(er.margenOperativo)],
    [formatoDolar(er.utilidadBruta / pacientes), 'Margen de contribucion unitario', 'neutro', fdPorcentaje(er.margenBruto)]
  ];
  const contPac = document.getElementById('fd-ind-paciente');
  if (contPac) contPac.innerHTML = porPaciente.map(([v, e, s, n]) => fdTarjetaIndicador(v, e, s, n)).join('');

  /* ── Balance (tabla) + cobertura (calculada) ── */
  const cuotaPeriodo = er.pagoBancos;
  const cobertura = cuotaPeriodo > 0 ? er.resultadoOperativo / cuotaPeriodo : null;
  const estadoCob = cobertura === null ? 'neutro' : cobertura < 1 ? 'alerta' : cobertura < 1.2 ? 'umbral' : 'meta';
  const tarjetasBalance = balance.map(b =>
    fdTarjetaIndicador(fdFormatoIndicador(b.valor, b.formato), b.etiqueta, b.estado || 'neutro', b.nota || ''));
  if (cobertura !== null) {
    tarjetasBalance.push(fdTarjetaIndicador(
      `${cobertura.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`,
      'Cobertura del pago a bancos', estadoCob,
      `Por cada $1 de cuota, la operacion genera ${formatoDolar(cobertura)}`));
  }
  const contBal = document.getElementById('fd-ind-balance');
  if (contBal) contBal.innerHTML = tarjetasBalance.join('');
  const fuente = balance.find(b => b.fuente)?.fuente;
  fdSetText('fd-ind-fuente', fuente ? `base: ${fuente}` : '');

  /* ── Punto de equilibrio: actuales -> de caja -> meta ── */
  const mcUnitario = pacientes > 0 ? er.utilidadBruta / pacientes : 0;
  const peCaja = mcUnitario > 0 ? Math.round((er.costosFijos + cuotaPeriodo) / mcUnitario) : null;
  const peOperativo = mcUnitario > 0 ? Math.round(er.costosFijos / mcUnitario) : null;
  const metaOcupacion = Math.round(FD_CAPACIDAD_MENSUAL * 0.4 * Math.max(mesesPeriodo, 1));
  const camino = document.getElementById('fd-ind-equilibrio');
  if (camino) {
    const paso = (valor, etiqueta, estado, detalle) =>
      `<div class="fd-ind-paso ${estado}"><strong>${fdEntero(valor)}</strong><span>${etiqueta}</span>${detalle ? `<small>${detalle}</small>` : ''}</div>`;
    camino.innerHTML =
      paso(pacientes, 'Pacientes atendidos', peCaja && pacientes < peCaja ? 'alerta' : 'meta', '') +
      '<span class="fd-ind-flecha">&rarr;</span>' +
      (peOperativo ? paso(peOperativo, 'Equilibrio operativo', 'neutro', 'solo costos fijos') + '<span class="fd-ind-flecha">&rarr;</span>' : '') +
      (peCaja ? paso(peCaja, 'Equilibrio de caja', 'umbral', 'con la cuota al banco') + '<span class="fd-ind-flecha">&rarr;</span>' : '') +
      paso(metaOcupacion, 'Meta 1 (40% ocupacion)', 'meta', '');
  }

  const conclusion = document.getElementById('fd-ind-conclusion');
  if (conclusion) {
    if (peCaja && pacientes < peCaja) {
      conclusion.className = 'fd-ind-conclusion alerta';
      conclusion.textContent = `CLIDENTE atiende ${fdEntero(pacientes)} pacientes y esta ${fdEntero(peCaja - pacientes)} por debajo del punto de equilibrio de caja de ${fdEntero(peCaja)}.`;
    } else if (peCaja) {
      conclusion.className = 'fd-ind-conclusion ok';
      conclusion.textContent = `CLIDENTE atiende ${fdEntero(pacientes)} pacientes y supera el punto de equilibrio de caja de ${fdEntero(peCaja)} por ${fdEntero(pacientes - peCaja)}.`;
    } else {
      conclusion.textContent = '';
    }
  }
}

/* Reparto de lo cobrado entre operacion y titular, y si el retiro de la
   titular alcanza para la cuota del banco. Responde la pregunta que la caja
   no puede responder, porque la cuota no pasa por la caja de la clinica. */
async function fdRenderReparto(anio, sigueVigente = () => true) {
  const card = document.getElementById('fd-reparto-card');
  const body = document.getElementById('fd-reparto-body');
  if (!card || !body) return;

  let meses = [];
  let cuotas = new Map();
  try {
    meses = await fdCargarSerieAnual(anio);
    (await fdCargarSerieER(anio)).forEach(r => cuotas.set(r.mes, parseFloat(r.pago_bancos || 0)));
  } catch (err) {
    console.error('No se pudo cargar el reparto de fondos:', err);
  }
  if (!sigueVigente()) return;

  const conReparto = meses.filter(m => m.retiro_titular != null && parseFloat(m.retiro_titular) > 0);
  if (!conReparto.length) {
    card.style.display = 'none';
    body.innerHTML = '';
    return;
  }
  card.style.display = '';
  fdSetText('fd-reparto-anio', String(anio));

  /* Un mes SIN reparto pero dentro del periodo que si lo tiene no es un mes que
     falte capturar: es un mes cuyo reparto sabemos que esta mal (mayo 2026, ver
     PENDIENTE-MAYO-2026.md). Mostrarlo vacio y marcado es mas honesto que
     esconder la fila, que dejaria pensar que el mes no existe. */
  const indices = conReparto.map(m => fdMesIndice(m.mes));
  const desde = Math.min(...indices);
  const hasta = Math.max(...indices);
  const pendientes = meses.filter(m =>
    (m.retiro_titular == null || !parseFloat(m.retiro_titular)) &&
    parseFloat(m.facturacion_total || 0) > 0 &&
    fdMesIndice(m.mes) >= desde && fdMesIndice(m.mes) <= hasta);
  const filas = conReparto.concat(pendientes).sort((a, b) => fdMesIndice(a.mes) - fdMesIndice(b.mes));

  const ajustados = [];
  const descuadrados = [];
  body.innerHTML = filas.map(m => {
    if (m.retiro_titular == null || !parseFloat(m.retiro_titular)) {
      return `<tr class="fd-reparto-pendiente">
        <td>${fdParseMesActivo(m.mes).mes}</td>
        <td class="num">${formatoDolar(parseFloat(m.facturacion_total || 0))}</td>
        <td colspan="4"><em class="fd-descuadre">Pendiente de correccion: falta la hoja de administracion de fondos corregida.</em></td>
      </tr>`;
    }
    const cobrado = parseFloat(m.facturacion_total || 0);
    const admin = parseFloat(m.admin_operacion || 0);
    const titular = parseFloat(m.retiro_titular || 0);
    const cuota = cuotas.get(m.mes) || 0;
    const margen = titular - cuota;
    const nombreMes = fdParseMesActivo(m.mes).mes;
    /* El reparto del Excel debe sumar lo cobrado. Si no cuadra, la cifra de
       facturacion viene de otra fuente y hay que resolverlo antes de usarla. */
    const descuadre = cobrado - (admin + titular);
    if (Math.abs(descuadre) > 1) descuadrados.push({ mes: nombreMes, descuadre, reparto: admin + titular, cobrado });
    /* Menos de mil dolares de margen sobre la cuota = mes apretado. */
    const clase = cuota <= 0 ? '' : margen < 0 ? 'bad' : margen < 1000 ? 'warn' : 'ok';
    if (clase === 'warn' || clase === 'bad') ajustados.push({ mes: nombreMes, margen });
    const avisoDescuadre = Math.abs(descuadre) > 1
      ? ` <em class="fd-descuadre" title="El reparto del Excel suma ${formatoDolar(admin + titular)}">no cuadra: ${formatoDolar(Math.abs(descuadre))}</em>`
      : '';
    return `<tr class="fd-reparto-${clase}">
      <td>${nombreMes}</td>
      <td class="num">${formatoDolar(cobrado)}${avisoDescuadre}</td>
      <td class="num">${formatoDolar(admin)}</td>
      <td class="num"><strong>${formatoDolar(titular)}</strong></td>
      <td class="num">${cuota > 0 ? '(' + formatoDolar(cuota) + ')' : '&mdash;'}</td>
      <td class="num"><strong class="${margen < 0 ? 'fd-negative' : 'fd-positive'}">${cuota > 0 ? formatoDolar(margen) : '&mdash;'}</strong></td>
    </tr>`;
  }).join('');

  const nota = document.getElementById('fd-reparto-nota');
  if (nota) {
    const partes = [];
    if (ajustados.length) {
      const detalle = ajustados.map(a => `${a.mes} (${formatoDolar(a.margen)})`).join(' y ');
      partes.push(`<strong class="fd-negative">${ajustados.length} de ${conReparto.length} meses cerraron con menos de $1,000 de margen sobre la cuota: ${detalle}.</strong> Cualquier imprevisto en esos meses deja la cuota sin cubrir.`);
    } else {
      partes.push(`Los ${conReparto.length} meses cubrieron la cuota con holgura.`);
    }
    descuadrados.forEach(d => {
      partes.push(`<strong class="fd-negative">En ${d.mes} el reparto del Excel suma ${formatoDolar(d.reparto)} y la facturacion registrada es ${formatoDolar(d.cobrado)}: faltan ${formatoDolar(Math.abs(d.descuadre))} por explicar.</strong> Los demas meses cuadran al centavo, asi que conviene revisar de donde sale esa cifra antes de usarla.`);
    });
    if (pendientes.length) {
      const sinDato = pendientes.map(m => fdParseMesActivo(m.mes).mes).join(' y ');
      partes.push(`<strong class="fd-negative">${sinDato} queda fuera del cuadro: su reparto salia de una hoja que la clinica corrigio despues, y las dos lecturas posibles del dato corregido dan conclusiones opuestas.</strong> Se deja en blanco a proposito hasta tener la hoja corregida; poner cualquiera de las dos seria inventar.`);
    }
    nota.innerHTML = partes.join(' ');
  }
}

async function fdRenderEstadoResultados(mesTexto, sigueVigente = () => true) {
  const card = document.getElementById('fd-er-card');
  const body = document.getElementById('fd-er-body');
  if (!card || !body) return;
  let row = null;
  try {
    const data = await fdCargarER(mesTexto);
    row = data.row;
  } catch (err) {
    console.error('No se pudo cargar el estado de resultados:', err);
  }
  if (!sigueVigente()) return;
  if (!row || !parseFloat(row.ingresos || 0)) {
    card.style.display = 'none';
    body.innerHTML = '';
    return;
  }
  card.style.display = '';
  fdSetText('fd-er-mes', mesTexto);
  const er = fdCalcularER(row);

  body.innerHTML =
    `<tr class="fd-er-seccion"><td colspan="3">ESTADO DE RESULTADOS</td></tr>` +
    fdFilaER('Ingresos', er.ingresos, 100) +
    fdFilaER('Costos variables', er.costosVariables, er.pctVariables) +
    fdFilaER('Utilidad bruta', er.utilidadBruta, er.margenBruto, 'fd-er-subtotal') +
    fdFilaER('Costos fijos', er.costosFijos, er.pctFijos) +
    fdFilaER('Resultado operativo', er.resultadoOperativo, er.margenOperativo, 'fd-er-subtotal') +
    fdFilaER('Gastos financieros', er.gastosFinancieros, er.pctFinancieros) +
    fdFilaER('Utilidad neta', er.utilidadNeta, er.margenNeto, 'fd-er-total') +
    `<tr class="fd-er-seccion"><td colspan="3">FLUJO DE EFECTIVO &middot; movimiento de caja del mes</td></tr>` +
    fdFilaER('Ingresos', er.ingresos, 100) +
    fdFilaER('Costos variables', er.costosVariables, er.pctVariables) +
    fdFilaER('Costos fijos', er.costosFijos, er.pctFijos) +
    fdFilaER('Pago mensual a los bancos', er.pagoBancos, er.pctBancos) +
    fdFilaER('Flujo de efectivo', er.flujoEfectivo, er.pctFlujo, 'fd-er-total');

  const cascada = document.getElementById('fd-er-cascada');
  if (cascada) cascada.innerHTML = `<p class="fd-chart-subtitle">Cascada del flujo de efectivo &middot; <em>clic en Costos para ver en que se fue</em></p>` + fdSvgCascadaFlujo(er, mesTexto);

  const conclusion = document.getElementById('fd-er-conclusion');
  if (conclusion) {
    if (er.resultadoOperativo > 0 && er.flujoEfectivo < 0) {
      conclusion.className = 'fd-er-conclusion alerta';
      conclusion.textContent = `CLIDENTE genera utilidades operativas (${formatoDolar(er.resultadoOperativo)}), pero tiene flujo de caja negativo (${formatoDolar(er.flujoEfectivo)}): la cuota de ${formatoDolar(er.pagoBancos)} al banco se lleva mas de lo que produce la operacion.`;
    } else if (er.flujoEfectivo >= 0) {
      conclusion.className = 'fd-er-conclusion ok';
      conclusion.textContent = `El mes cubre su operacion y la cuota al banco, y deja ${formatoDolar(er.flujoEfectivo)} de flujo de efectivo.`;
    } else {
      conclusion.className = 'fd-er-conclusion alerta';
      conclusion.textContent = `El mes cierra con resultado operativo de ${formatoDolar(er.resultadoOperativo)} y flujo de efectivo de ${formatoDolar(er.flujoEfectivo)}.`;
    }
  }
}

async function fdRenderCajaDiariaDashboard(mesTexto, sigueVigente = () => true, mensual = null) {
  const card = document.getElementById('fd-caja-diaria-card');
  const cont = document.getElementById('fd-caja-diaria-chart');
  if (!card || !cont) return;
  let rows = [];
  try {
    const data = await fdCargarCajaDiaria(mesTexto);
    rows = data.rows;
  } catch (err) {
    console.error('No se pudo cargar la caja diaria del dashboard:', err);
  }
  if (!sigueVigente()) return;
  const conMovimiento = rows.filter(r => parseFloat(r.ingreso || 0) || parseFloat(r.egreso || 0) || parseFloat(r.pago_banco || 0));
  if (!conMovimiento.length) {
    card.style.display = 'none';
    cont.innerHTML = '';
    return;
  }
  card.style.display = '';
  fdSetText('fd-caja-diaria-mes', mesTexto);
  const res = fdResumenCajaDiaria(conMovimiento);
  cont.innerHTML = fdSvgCajaDiaria(res.detalle, mesTexto);

  fdSetText('fd-cd-ingresos', formatoDolar(res.ingresos));
  fdSetText('fd-cd-egresos', formatoDolar(res.egresos));
  fdSetText('fd-cd-banco', formatoDolar(res.banco));
  fdSetText('fd-cd-saldo', formatoDolar(res.saldoFinal));
  const elSaldo = document.getElementById('fd-cd-saldo');
  elSaldo?.classList.toggle('fd-positive', res.saldoFinal >= 0);
  elSaldo?.classList.toggle('fd-negative', res.saldoFinal < 0);

  /* Dia de mayor y menor ingreso: el patron que el cierre mensual esconde. */
  const ordenados = res.detalle.slice().sort((a, b) => b.ingreso - a.ingreso);
  const mejor = ordenados[0];
  const peor = ordenados[ordenados.length - 1];
  const nota = document.getElementById('fd-cd-nota');
  if (nota) {
    const partes = [];
    const diasMes = fdDiasDelMes(mesTexto);
    if (res.diasConDatos < diasMes) {
      partes.push(`<em>Acumulado con ${res.diasConDatos} de ${diasMes} dias capturados.</em>`);
    }
    /* Los dias tienen que sumar lo que factura el mes. Cuando no cuadra, uno de
       los dos lados quedo desactualizado (le paso a mayo 2026: la clinica
       corrigio el resumen del mes y nunca reemitio el detalle diario). Solo se
       revisa en meses ya cerrados; en el mes en curso faltan dias por captura. */
    const brecha = fdBrechaCajaDiaria(mesTexto, res.ingresos, mensual);
    if (brecha) {
      partes.push(`<strong class="fd-negative">Los dias capturados suman ${formatoDolar(brecha.diario)} y el mes cerro en ${formatoDolar(brecha.mensual)}: ${formatoDolar(Math.abs(brecha.diferencia))} de diferencia.</strong> El detalle diario y el cierre del mes no vienen de la misma version del archivo; el bueno es el cierre, asi que el grafico de abajo se queda corto.`);
    }
    if (res.primerNegativo) {
      partes.push(`<strong class="fd-negative">A partir del ${res.primerNegativo} el mes consume mas efectivo del que genera; toca fondo el ${res.peorSaldo.fecha} en ${formatoDolar(res.peorSaldo.valor)}.</strong>`);
    } else {
      partes.push(`El acumulado nunca baja de cero: el periodo genera ${formatoDolar(res.saldoFinal)} de efectivo neto.`);
    }
    if (mejor && peor && mejor.fecha !== peor.fecha) {
      partes.push(`Mejor dia: ${mejor.fecha} (${fdDiaSemana(mejor.fecha)}) con ${formatoDolar(mejor.ingreso)}; el mas flojo: ${peor.fecha} (${fdDiaSemana(peor.fecha)}) con ${formatoDolar(peor.ingreso)}.`);
    }
    nota.innerHTML = partes.join(' ');
  }
}

function fdRenderMixCobro(rows, anio) {
  const card = document.getElementById('fd-mix-card');
  const cont = document.getElementById('fd-mix-rows');
  if (!card || !cont) return;
  fdSetText('fd-mix-anio', String(anio));
  const conMix = (Array.isArray(rows) ? rows : []).filter(row =>
    ['efectivo', 'tarjeta', 'transferencia'].some(k => parseFloat(row[k] || 0) > 0));
  if (!conMix.length) {
    card.style.display = 'none';
    cont.innerHTML = '';
    return;
  }
  card.style.display = '';
  cont.innerHTML = conMix.map(row => {
    const ef = parseFloat(row.efectivo || 0);
    const ta = parseFloat(row.tarjeta || 0);
    const tr = parseFloat(row.transferencia || 0);
    const fact = parseFloat(row.facturacion_total || 0);
    const cobrado = ef + ta + tr;
    const total = Math.max(fact, cobrado);
    const otros = Math.max(total - cobrado, 0);
    const partes = [[ef, 'efectivo', 'Efectivo'], [ta, 'tarjeta', 'POS / tarjeta'], [tr, 'transferencia', 'Transferencia'], [otros, 'otros', 'Otros / ajustes']];
    const seg = ([valor, clase, etiqueta]) => {
      if (valor <= 0 || total <= 0) return '';
      const pct = (valor / total) * 100;
      const detalle = `${etiqueta}: ${formatoDolar(valor)} (${fdPorcentaje(pct)})`;
      const texto = pct >= 12 ? `<span class="fd-mix-pct">${fdPorcentaje(pct)}</span>` : '';
      return `<div class="fd-mix-seg ${clase}" style="width:${pct.toFixed(2)}%" role="img" aria-label="${fdEscapeXml(detalle)}" title="${fdEscapeXml(detalle)}">${texto}</div>`;
    };
    const desglose = partes.filter(p => p[0] > 0)
      .map(([valor, , etiqueta]) => `${etiqueta} ${formatoDolar(valor)}`).join(' &middot; ');
    const nombreMes = fdParseMesActivo(row.mes).mes;
    return `<div class="fd-mix-row">
      <span class="fd-mix-mes">${nombreMes.slice(0, 3)}</span>
      <div class="fd-mix-bar" title="${fdEscapeXml(`${nombreMes}: ${desglose.replace(/&middot;/g, '-')}`)}">${partes.map(seg).join('')}</div>
      <span class="fd-mix-total">${fdDolarCorto(total)}</span>
    </div>
    <p class="fd-mix-detalle">${desglose}</p>`;
  }).join('');
}

function fdRenderTendencia(rows, anio) {
  fdSetText('fd-tendencia-anio', String(anio));
  const contFact = document.getElementById('fd-chart-facturacion');
  const contFlujo = document.getElementById('fd-chart-flujo');
  if (!contFact || !contFlujo) return;
  fdRenderMixCobro(rows, anio);
  if (!Array.isArray(rows) || !rows.length) {
    contFact.innerHTML = `<p class="fd-note">Aun no hay meses registrados en ${anio}.</p>`;
    contFlujo.innerHTML = '';
    return;
  }
  contFact.innerHTML = `<p class="fd-chart-subtitle">Facturacion mensual vs punto de equilibrio real &middot; <em>clic en un mes para ver su facturacion diaria</em></p>` + fdSvgFacturacionVsPE(rows);
  contFlujo.innerHTML = `<p class="fd-chart-subtitle">Resultado operativo mensual (antes de la cuota al banco) &middot; <em>clic en un mes para ver como se formo</em></p>` + fdSvgFlujoMensual(rows);
}

function renderDashboardFinanciero() {
  return `
  <div id="dashboard-financiero-root" class="fd-shell">
    <div class="fd-hero card">
      <div>
        <h1 class="section-title" style="margin-bottom:.35rem">Dashboard de gestion financiera - Clinica Dental Clidente</h1>
        <label class="fd-month-control">Mes activo <span class="fd-month-pair"><select id="fd-dashboard-mes">${fdMesOptions()}</select><select id="fd-dashboard-anio">${fdAnioOptions()}</select></span></label>
        <div class="fd-view-toggle" role="group" aria-label="Vista del dashboard">
          <button type="button" id="fd-vista-mensual" class="active">Mensual</button>
          <button type="button" id="fd-vista-acumulado">Acumulado anual</button>
        </div>
        <p id="fd-periodo-summary" class="fd-periodo-summary">Vista mensual: Mayo 2026</p>
        <div class="fd-source-row">
          <span class="fd-source blue">FG Dental</span>
          <span class="fd-source green">Excel caja</span>
          <span class="fd-source amber">Contador externo</span>
          <span class="fd-arrow">&rarr;</span>
          <span class="fd-source unified">Dashboard unificado</span>
        </div>
      </div>
      <div class="fd-hero-acciones">
        <button class="fd-save fd-btn-informe" id="fd-btn-informe" type="button"><i class="fab fa-whatsapp"></i> Informe ejecutivo PDF</button>
        <button class="fd-secondary" id="fd-btn-ingresar" onclick="navigate('formulario-henry')">Ingresar datos del mes &rarr;</button>
      </div>
    </div>

    <div id="fd-config-warning" class="fd-warning" style="display:none">
      Atencion: se estan mostrando datos guardados solo en este navegador o la base de Mayo 2026.
      Verifica la conexion con Supabase para ver los datos compartidos del equipo.
    </div>

    <div class="fd-kpi-grid">
      <div class="fd-kpi-card"><span id="fd-label-facturacion">Facturacion total</span><strong id="fd-kpi-facturacion">$0.00</strong><small id="fd-delta-facturacion" class="fd-delta"></small></div>
      <div class="fd-kpi-card"><span id="fd-label-pacientes">Pacientes atendidos</span><strong id="fd-kpi-pacientes">0</strong><small id="fd-delta-pacientes" class="fd-delta"></small></div>
      <div class="fd-kpi-card"><span>Ticket promedio</span><strong id="fd-kpi-ticket">$0.00</strong><small id="fd-delta-ticket" class="fd-delta"></small></div>
      <div class="fd-kpi-card"><span id="fd-label-flujo">Resultado operativo</span><strong id="fd-kpi-flujo">$0.00</strong><small id="fd-delta-flujo" class="fd-delta"></small></div>
    </div>

    <div class="fd-insight-grid">
      <div class="fd-insight"><span>Ocupacion</span><strong id="fd-extra-ocupacion">0.0%</strong><small id="fd-extra-capacidad">0 de 0 capacidad</small></div>
      <div class="fd-insight"><span>Punto de equilibrio real</span><strong id="fd-extra-equilibrio">0 px</strong><small id="fd-extra-equilibrio-note">Calculado con los costos del periodo</small></div>
      <div class="fd-insight"><span>Meta de pacientes</span><strong id="fd-extra-meta">0 px</strong><small id="fd-extra-meta-note">878 pacientes/mes</small></div>
      <div class="fd-insight"><span>Meses registrados</span><strong id="fd-extra-meses">1</strong><small id="fd-extra-periodo">Mes activo</small></div>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title"><i class="fas fa-chart-column" style="margin-right:.5rem"></i>Evolucion mensual <span id="fd-tendencia-anio"></span></div>
      <div id="fd-chart-facturacion" class="fd-chart-wrap"></div>
      <p class="fd-note">Barra verde: mes sobre su punto de equilibrio real. Barra roja: por debajo. Linea punteada ambar: punto de equilibrio real de cada mes (costos fijos entre margen de contribucion observado).</p>
      <div id="fd-chart-flujo" class="fd-chart-wrap" style="margin-top:1.1rem"></div>
    </div>

    <div class="card fd-card-tight" id="fd-er-card" style="display:none">
      <div class="card-title"><i class="fas fa-file-invoice-dollar" style="margin-right:.5rem"></i>Estado de Resultados y flujo de efectivo &mdash; <span id="fd-er-mes"></span></div>
      <div class="fd-table-wrap">
        <table class="fd-table fd-er-tabla">
          <thead><tr><th>PARTIDA</th><th class="num">MONTO</th><th class="num">% DE INGRESOS</th></tr></thead>
          <tbody id="fd-er-body"></tbody>
        </table>
      </div>
      <div id="fd-er-cascada" class="fd-chart-wrap" style="margin-top:1.1rem"></div>
      <p id="fd-er-conclusion" class="fd-er-conclusion"></p>
      <p class="fd-note">El Estado de Resultados incluye solo los intereses; el flujo registra la cuota completa a los bancos (capital + intereses). El flujo mide la operacion de la clinica: excluye el pago a cuenta de renta, el IVA neto y los retiros de la titular.</p>
    </div>

    <div class="card fd-card-tight" id="fd-indicadores-card" style="display:none">
      <div class="card-title"><i class="fas fa-gauge" style="margin-right:.5rem"></i>Indicadores financieros clave <span id="fd-ind-periodo"></span></div>

      <p class="fd-ind-titulo">Por paciente</p>
      <div class="fd-ind-grid" id="fd-ind-paciente"></div>

      <p class="fd-ind-titulo">Indicadores de balance <em id="fd-ind-fuente" class="fd-ind-fuente"></em></p>
      <div class="fd-ind-grid" id="fd-ind-balance"></div>

      <p class="fd-ind-titulo">Punto de equilibrio</p>
      <div class="fd-ind-camino" id="fd-ind-equilibrio"></div>
      <p id="fd-ind-conclusion" class="fd-ind-conclusion"></p>
      <p class="fd-note">El punto de equilibrio de caja incluye la cuota al banco; el operativo solo cubre los costos fijos. Son dos umbrales distintos: el primero es el que la clinica necesita para no depender de otras fuentes.</p>
    </div>

    <div class="card fd-card-tight" id="fd-reparto-card" style="display:none">
      <div class="card-title"><i class="fas fa-code-branch" style="margin-right:.5rem"></i>Reparto de lo cobrado y cobertura de la cuota <span id="fd-reparto-anio"></span></div>
      <p class="fd-chart-subtitle">Lo cobrado cada mes se reparte entre la operacion de la clinica y la titular. La cuota al banco se atiende desde el retiro de la titular, por eso no aparece en la caja.</p>
      <div class="fd-table-wrap">
        <table class="fd-table fd-reparto-tabla">
          <thead><tr>
            <th>Mes</th><th class="num">Cobrado</th><th class="num">A la operacion</th><th class="num">A la titular</th><th class="num">Cuota banco</th><th class="num">Margen</th>
          </tr></thead>
          <tbody id="fd-reparto-body"></tbody>
        </table>
      </div>
      <p id="fd-reparto-nota" class="fd-note"></p>
      <p class="fd-note"><strong>Pendiente de confirmar con Henry:</strong> que la cuota al banco salga efectivamente de ese retiro. Es una inferencia consistente con los numeros, no un dato declarado por la clinica.</p>
    </div>

    <div class="card fd-card-tight" id="fd-caja-diaria-card" style="display:none">
      <div class="card-title"><i class="fas fa-chart-line" style="margin-right:.5rem"></i>Caja diaria &mdash; <span id="fd-caja-diaria-mes"></span></div>
      <p class="fd-chart-subtitle">Efectivo acumulado dia a dia. Las lineas ambar marcan los pagos al banco.</p>
      <div class="fd-kpi-grid compact">
        <div class="fd-kpi-card"><span>Efectivo cobrado</span><strong id="fd-cd-ingresos">$0.00</strong></div>
        <div class="fd-kpi-card"><span>Efectivo pagado</span><strong id="fd-cd-egresos">$0.00</strong></div>
        <div class="fd-kpi-card"><span>Pagos al banco</span><strong id="fd-cd-banco">$0.00</strong></div>
        <div class="fd-kpi-card"><span>Efectivo neto</span><strong id="fd-cd-saldo">$0.00</strong></div>
      </div>
      <div id="fd-caja-diaria-chart" class="fd-chart-wrap"></div>
      <p id="fd-cd-nota" class="fd-note"></p>
      <p class="fd-note">Base caja: solo movimientos de efectivo, incluye el pago al banco y arranca en cero cada mes. El "flujo neto" de las tarjetas de arriba es el resultado operativo (ingresos menos costos variables y fijos), sin el pago al banco: son dos medidas distintas.</p>
    </div>

    <div class="card fd-card-tight" id="fd-mix-card" style="display:none">
      <div class="card-title"><i class="fas fa-wallet" style="margin-right:.5rem"></i>Mix de cobro <span id="fd-mix-anio"></span></div>
      <div class="fd-mix-legend">
        <span class="fd-mix-chip efectivo">Efectivo</span>
        <span class="fd-mix-chip tarjeta">POS / tarjeta</span>
        <span class="fd-mix-chip transferencia">Transferencia</span>
        <span class="fd-mix-chip otros">Otros / ajustes</span>
      </div>
      <div id="fd-mix-rows"></div>
      <p class="fd-note">Composicion de los cobros de cada mes segun el control de caja. "Otros / ajustes" es la diferencia entre la facturacion oficial del mes y lo cobrado registrado en caja.</p>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title"><i class="fas fa-user-doctor" style="margin-right:.5rem"></i>Produccion por dentista</div>
      <div class="fd-table-wrap">
        <table class="fd-table">
          <thead><tr><th>Nombre</th><th>Facturacion</th><th id="fd-th-tendencia">vs mes anterior</th><th>Barra de progreso</th><th>Estado</th></tr></thead>
          <tbody id="fd-dentistas-body"><tr><td colspan="5">Cargando datos...</td></tr></tbody>
        </table>
      </div>
    </div>

    <div class="fd-grid2">
      <div class="card fd-card-tight">
        <div class="card-title"><i class="fas fa-chair" style="margin-right:.5rem"></i>Analisis por silla</div>
        <div class="fd-metric-row"><span>Costo fijo por silla<em id="fd-silla-costo-nota" class="fd-metric-nota"></em></span><strong id="fd-silla-costo">&mdash;</strong></div>
        <div class="fd-metric-row"><span>Piso de rentabilidad<em id="fd-silla-piso-nota" class="fd-metric-nota"></em></span><strong id="fd-silla-piso">&mdash;</strong></div>
        <div class="fd-metric-row"><span>Media aritmetica del grupo<em id="fd-silla-grupo" class="fd-metric-nota"></em></span><strong id="fd-silla-media">$0/mes</strong></div>
        <div class="fd-metric-row"><span>Meta Cero</span><strong id="fd-silla-meta">&mdash;</strong></div>
        <div class="fd-metric-row danger"><span id="fd-silla-neg-label">Sillas bajo piso</span><strong id="fd-silla-neg-valor">$0.00</strong></div>
        <p id="fd-silla-neg-nota" class="fd-note" style="margin-top:.4rem"></p>
      </div>

      <div class="card fd-card-tight">
        <div class="card-title" id="fd-caja-title"><i class="fas fa-cash-register" style="margin-right:.5rem"></i>Del ingreso al resultado operativo</div>
        <div class="fd-metric-row"><span>Facturacion bruta</span><strong id="fd-caja-facturacion">$0.00</strong></div>
        <div class="fd-metric-row danger"><span>Comisiones <em id="fd-caja-comisiones-pct" class="fd-pct"></em></span><strong id="fd-caja-comisiones">$0.00</strong></div>
        <div class="fd-metric-row danger"><span>Insumos <em id="fd-caja-insumos-pct" class="fd-pct"></em></span><strong id="fd-caja-insumos">$0.00</strong></div>
        <div class="fd-metric-row"><span>Margen de contribucion <em id="fd-caja-margen-pct" class="fd-pct"></em></span><strong id="fd-caja-margen">$0.00</strong></div>
        <div class="fd-metric-row danger"><span>Costos fijos <em id="fd-caja-costos-pct" class="fd-pct"></em></span><strong id="fd-caja-costos">$0.00</strong></div>
        <div class="fd-metric-row total"><span>Resultado operativo</span><strong id="fd-caja-flujo">$0.00</strong></div>
        <p class="fd-note" style="margin-top:.5rem">Aqui termina la operacion. Para llegar al <strong>flujo de efectivo</strong> falta restar la cuota al banco, y para la <strong>utilidad neta</strong> los gastos financieros: ambos estan en la tarjeta de Estado de Resultados.</p>
      </div>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title"><i class="fas fa-gauge-high" style="margin-right:.5rem"></i>Meta de pacientes</div>
      <div class="fd-progress-label"><span id="fd-equilibrio-texto">0 de 878 pacientes - meta mensual</span><strong id="fd-equilibrio-pct">0.0%</strong></div>
      <div class="fd-big-track"><div id="fd-equilibrio-bar" class="fd-big-fill danger" style="width:0%"></div></div>
      <p id="fd-equilibrio-note" class="fd-note">Calculando punto de equilibrio del periodo...</p>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title"><i class="fas fa-triangle-exclamation" style="margin-right:.5rem"></i>Alertas de gestion</div>
      <div id="fd-alertas" class="fd-alert-grid"></div>
    </div>

    <div class="fd-footer">
      Fuentes: FG Dental &middot; Excel caja &middot; Contador externo &middot; Informe estrategico enero-abril 2026 &middot; Confidencial - uso exclusivo Clinica Dental Clidente
    </div>
  </div>`;
}

function fdSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function fdRenderDashboard(mensual, dentistas, fallback, vista = fdVistaDashboard, prevMensual = null, prevLabel = '', prevDentistas = null) {
  const isAcumulado = vista === 'acumulado';
  /* En acumulado el periodo puede tener 0 meses; las metas por dentista usan
     al menos 1 mes para no degenerar en meta cero. */
  const mesesRegistrados = isAcumulado ? (parseInt(mensual.meses_registrados, 10) || 0) : 1;
  const mesesMetas = Math.max(mesesRegistrados, 1);
  const facturacion = parseFloat(mensual.facturacion_total || 0);
  const pacientes = parseInt(mensual.pacientes_atendidos || 0, 10);
  const ticket = pacientes > 0 ? facturacion / pacientes : 0;
  const flujo = parseFloat(mensual.flujo_neto || 0);
  const metaPacientes = isAcumulado ? (parseInt(mensual.meta_pacientes, 10) || FD_META_PACIENTES * mesesRegistrados) : FD_META_PACIENTES;
  const pe = fdPuntoEquilibrioReal(mensual);
  const pePxPlan = FD_PLAN_PPT.punto_equilibrio_px * mesesMetas;
  const peUsdPlan = FD_PLAN_PPT.punto_equilibrio_usd * mesesMetas;
  const capacidad = FD_CAPACIDAD_MENSUAL * mesesMetas;
  const metaPct = metaPacientes > 0 ? (pacientes / metaPacientes) * 100 : 0;
  const ocupacionPct = capacidad > 0 ? (pacientes / capacidad) * 100 : 0;
  const metaDentista = FD_META_DENTISTA * mesesMetas;
  const pisoDentista = FD_PISO_RENTABILIDAD * mesesMetas;
  const maxBarra = FD_MAX_BARRA * mesesMetas;
  const periodoVacio = isAcumulado && mesesRegistrados === 0;

  fdMesActivoSeleccionado = mensual.mes_activo || mensual.mes || fdMesActivoSeleccionado;
  fdSetMesControls('fd-dashboard', fdMesActivoSeleccionado);
  fdSetText('fd-periodo-summary', isAcumulado ? (mensual.periodo_titulo || `Acumulado anual`) : `Vista mensual: ${fdMesActivoSeleccionado}`);
  fdSetText('fd-label-facturacion', isAcumulado ? 'Facturacion acumulada' : 'Facturacion total');
  fdSetText('fd-label-pacientes', isAcumulado ? 'Pacientes acumulados' : 'Pacientes atendidos');
  fdSetText('fd-label-flujo', isAcumulado ? 'Resultado operativo acumulado' : 'Resultado operativo');
  fdSetText('fd-kpi-facturacion', formatoDolar(facturacion));
  fdSetText('fd-kpi-pacientes', fdEntero(pacientes));
  fdSetText('fd-kpi-ticket', formatoDolar(ticket));
  fdSetText('fd-kpi-flujo', formatoDolar(flujo));
  fdSetText('fd-extra-ocupacion', fdPorcentaje(ocupacionPct));
  fdSetText('fd-extra-capacidad', `${fdEntero(pacientes)} de ${fdEntero(capacidad)} capacidad`);
  if (periodoVacio) {
    fdSetText('fd-extra-equilibrio', '-');
    fdSetText('fd-extra-equilibrio-note', 'Sin meses registrados en el periodo');
  } else if (pe.valido && pe.px) {
    fdSetText('fd-extra-equilibrio', `${fdEntero(pe.px)} px`);
    fdSetText('fd-extra-equilibrio-note', `aprox. ${formatoDolar(pe.usd)} con margen de contribucion de ${fdPorcentaje(pe.margenContribucion * 100)} - Plan PPT: ${fdEntero(pePxPlan)} px (${fdDolarCorto(peUsdPlan)})`);
  } else if (pe.valido && !pe.px) {
    fdSetText('fd-extra-equilibrio', fdDolarCorto(pe.usd));
    fdSetText('fd-extra-equilibrio-note', `PE real en dolares (margen de contribucion ${fdPorcentaje(pe.margenContribucion * 100)}); falta el dato de pacientes para expresarlo en px - Plan PPT: ${fdEntero(pePxPlan)} px`);
  } else if (pe.motivo === 'margen_negativo') {
    fdSetText('fd-extra-equilibrio', 'No alcanzable');
    fdSetText('fd-extra-equilibrio-note', `Los costos variables superan la facturacion (margen de contribucion ${fdPorcentaje((pe.margenContribucion || 0) * 100)}); no existe punto de equilibrio este periodo - Plan PPT: ${fdEntero(pePxPlan)} px`);
  } else {
    fdSetText('fd-extra-equilibrio', `${fdEntero(pePxPlan)} px`);
    fdSetText('fd-extra-equilibrio-note', `Valor del plan PPT (${fdDolarCorto(peUsdPlan)}); sin datos suficientes del periodo para calcular el real`);
  }
  fdSetText('fd-extra-meta', `${fdEntero(metaPacientes)} px`);
  fdSetText('fd-extra-meta-note', isAcumulado ? `${mesesRegistrados} x 878 pacientes/mes` : '878 pacientes/mes');
  fdSetText('fd-extra-meses', isAcumulado ? fdEntero(mensual.meses_registrados || 0) : '1');
  fdSetText('fd-extra-periodo', isAcumulado ? (mensual.periodo_detalle || 'Meses del periodo con datos') : 'Mes activo');

  const cmp = !isAcumulado && prevMensual && fdTieneDatos(prevMensual) ? prevMensual : null;
  const pintarDelta = (id, actual, previo, esDinero) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!cmp || previo === null) {
      el.textContent = '';
      el.classList.remove('up', 'down');
      return;
    }
    const diff = actual - previo;
    if (diff === 0) {
      el.textContent = `= sin cambio vs ${prevLabel}`;
      el.classList.remove('up', 'down');
      return;
    }
    const flecha = diff > 0 ? '▲' : '▼';
    let texto;
    if (esDinero === 'monto') {
      texto = `${flecha} ${diff > 0 ? '+' : '-'}${formatoDolar(Math.abs(diff))} vs ${prevLabel}`;
    } else {
      if (!previo) { el.textContent = ''; el.classList.remove('up', 'down'); return; }
      const pct = (diff / Math.abs(previo)) * 100;
      texto = `${flecha} ${pct > 0 ? '+' : '-'}${fdPorcentaje(Math.abs(pct))} vs ${prevLabel}`;
    }
    el.textContent = texto;
    el.classList.toggle('up', diff > 0);
    el.classList.toggle('down', diff < 0);
  };
  const prevFact = cmp ? parseFloat(cmp.facturacion_total || 0) : null;
  const prevPac = cmp ? parseInt(cmp.pacientes_atendidos || 0, 10) : null;
  const prevTicket = cmp && prevPac > 0 ? prevFact / prevPac : null;
  const prevFlujo = cmp ? parseFloat(cmp.flujo_neto || 0) : null;
  pintarDelta('fd-delta-facturacion', facturacion, prevFact, 'pct');
  pintarDelta('fd-delta-pacientes', pacientes, prevPac, 'pct');
  pintarDelta('fd-delta-ticket', ticket, prevTicket, 'pct');
  pintarDelta('fd-delta-flujo', flujo, prevFlujo, 'monto');

  document.getElementById('fd-vista-mensual')?.classList.toggle('active', !isAcumulado);
  document.getElementById('fd-vista-acumulado')?.classList.toggle('active', isAcumulado);
  document.getElementById('fd-kpi-flujo')?.classList.toggle('fd-positive', flujo >= 0);
  document.getElementById('fd-kpi-flujo')?.classList.toggle('fd-negative', flujo < 0);
  const configWarning = document.getElementById('fd-config-warning');
  if (configWarning) configWarning.style.display = fallback ? 'block' : 'none';

  const tbody = document.getElementById('fd-dentistas-body');
  const dentistasOrdenados = (Array.isArray(dentistas) ? dentistas : [])
    .slice()
    .sort((a, b) => parseFloat(b.facturacion || 0) - parseFloat(a.facturacion || 0));
  const prevPorNombre = new Map((Array.isArray(prevDentistas) ? prevDentistas : [])
    .map(d => [d.nombre, parseFloat(d.facturacion || 0)]));
  const hayComparativo = !isAcumulado && prevPorNombre.size > 0;
  fdSetText('fd-th-tendencia', hayComparativo ? `vs ${prevLabel || 'mes anterior'}` : 'vs mes anterior');
  if (tbody) {
    tbody.innerHTML = dentistasOrdenados.map(d => {
      const valor = parseFloat(d.facturacion || 0);
      const estado = fdEstadoDentista(valor, metaDentista, pisoDentista);
      const width = Math.min((valor / maxBarra) * 100, 100);
      const suffix = estado.key === 'advertencia' ? ' &#9888;' : estado.key === 'critico' ? ' &times;' : '';
      let celdaTend = '<span class="fd-trend flat">&mdash;</span>';
      if (hayComparativo && prevPorNombre.has(d.nombre)) {
        const previo = prevPorNombre.get(d.nombre);
        const diff = valor - previo;
        if (Math.abs(diff) < 0.01) {
          celdaTend = '<span class="fd-trend flat">= igual</span>';
        } else {
          const clase = diff > 0 ? 'up' : 'down';
          const flecha = diff > 0 ? '&#9650;' : '&#9660;';
          const pct = previo > 0 ? ` (${diff > 0 ? '+' : '-'}${fdPorcentaje(Math.abs(diff / previo) * 100)})` : '';
          celdaTend = `<span class="fd-trend ${clase}">${flecha} ${diff > 0 ? '+' : '-'}${formatoDolar(Math.abs(diff))}${pct}</span>`;
        }
      }
      /* Fuera de la comparativa de sillas (laboratorio, especialista, quien ya
         no esta): su facturacion es ingreso real y se muestra, pero sin
         semaforo, para que no se lea como una silla en rojo. */
      const attrsDrill = `class="%CLASE%" data-fd-drill="dentista" data-fd-nombre="${fdEscapeXml(d.nombre)}" tabindex="0" role="button" title="Clic para ver la evolucion de ${fdEscapeXml(d.nombre)} en el anio"`;
      if (d.comparable === false) {
        return `<tr ${attrsDrill.replace('%CLASE%', 'fd-fila-no-comparable fd-drill-fila')}>
          <td>${d.nombre}</td>
          <td><strong>${formatoDolar(valor)}</strong></td>
          <td>${celdaTend}</td>
          <td><div class="fd-mini-track"><div class="fd-mini-fill neutro" style="width:${width}%"></div></div></td>
          <td><span class="fd-status neutro">Fuera de comparativa</span></td>
        </tr>`;
      }
      return `<tr ${attrsDrill.replace('%CLASE%', 'fd-drill-fila')}>
        <td>${d.nombre}</td>
        <td><strong>${formatoDolar(valor)}</strong></td>
        <td>${celdaTend}</td>
        <td><div class="fd-mini-track"><div class="fd-mini-fill ${estado.css}" style="width:${width}%"></div></div></td>
        <td><span class="fd-status ${estado.css}">${estado.label}${suffix}</span></td>
      </tr>`;
    }).join('');
  }

  /* El analisis de silla compara SOLO a quienes ocupan una silla como
     odontologo general ese mes (laboratorio, especialistas y quienes ya no
     estan quedan fuera). El ingreso no se toca: ese dinero se cobro igual. */
  const comparables = dentistasOrdenados.filter(d => d.comparable !== false);
  const baseComparacion = comparables.length ? comparables : dentistasOrdenados;
  const promedioDentista = baseComparacion.length ? baseComparacion.reduce((sum, d) => sum + parseFloat(d.facturacion || 0), 0) / baseComparacion.length : 0;
  const negativos = baseComparacion.filter(d => parseFloat(d.facturacion || 0) < pisoDentista);
  /* La brecha se expresa en dinero de la CLINICA: lo que falta de produccion
     por el 75% que la clinica retiene. Es el criterio del informe. */
  const brechaProduccion = negativos.reduce((sum, d) => sum + Math.max(pisoDentista - parseFloat(d.facturacion || 0), 0), 0);
  const brechaPiso = brechaProduccion * FD_RETENCION_CLINICA;
  const costoSilla = FD_COSTO_POR_SILLA * mesesMetas;
  fdSetText('fd-silla-costo', isAcumulado ? `${formatoDolar(costoSilla)} acumulado` : `${formatoDolar(FD_COSTO_POR_SILLA)}/mes`);
  fdSetText('fd-silla-costo-nota', `${formatoDolar(FD_COSTOS_FIJOS_MES)} de costos fijos entre ${FD_SILLAS_OPERATIVAS} sillas operativas`);
  fdSetText('fd-silla-piso', isAcumulado ? `${formatoDolar(pisoDentista)} acumulado` : `${formatoDolar(FD_PISO_RENTABILIDAD)}/mes`);
  fdSetText('fd-silla-piso-nota', `${formatoDolar(FD_COSTO_POR_SILLA)} entre ${fdPorcentaje(FD_RETENCION_CLINICA * 100)} de retencion`);
  fdSetText('fd-silla-media', isAcumulado ? `${formatoDolar(promedioDentista)} acumulado` : `${formatoDolar(promedioDentista)}/mes`);
  fdSetText('fd-silla-meta', isAcumulado ? `${formatoDolar(metaDentista)} acumulado` : `${formatoDolar(FD_META_DENTISTA)}/mes`);
  fdSetText('fd-silla-grupo', comparables.length && comparables.length !== dentistasOrdenados.length
    ? `${comparables.length} comparables de ${dentistasOrdenados.length} registrados`
    : `${baseComparacion.length} profesional(es)`);
  fdSetText('fd-silla-neg-label', `${negativos.length} silla(s) bajo piso`);
  fdSetText('fd-silla-neg-valor', brechaPiso ? '-' + formatoDolar(brechaPiso) : formatoDolar(0));
  fdSetText('fd-silla-neg-nota', brechaPiso ? `${formatoDolar(brechaProduccion)} de produccion faltante, al ${fdPorcentaje(FD_RETENCION_CLINICA * 100)} que retiene la clinica` : '');

  const comisionesVal = parseFloat(mensual.comisiones || 0);
  const insumosVal = parseFloat(mensual.insumos || 0);
  const costosVal = parseFloat(mensual.costos_fijos || 0);
  const margenContribucionUsd = facturacion - comisionesVal - insumosVal;
  const pctDe = valor => facturacion > 0 ? `(${fdPorcentaje((valor / facturacion) * 100)})` : '';
  fdSetText('fd-caja-title', isAcumulado ? 'Del ingreso al resultado operativo (acumulado)' : 'Del ingreso al resultado operativo');
  fdSetText('fd-caja-facturacion', formatoDolar(facturacion));
  fdSetText('fd-caja-comisiones', '-' + formatoDolar(comisionesVal));
  fdSetText('fd-caja-comisiones-pct', pctDe(comisionesVal));
  fdSetText('fd-caja-insumos', '-' + formatoDolar(insumosVal));
  fdSetText('fd-caja-insumos-pct', pctDe(insumosVal));
  fdSetText('fd-caja-margen', formatoDolar(margenContribucionUsd));
  fdSetText('fd-caja-margen-pct', pctDe(margenContribucionUsd));
  fdSetText('fd-caja-costos', '-' + formatoDolar(costosVal));
  fdSetText('fd-caja-costos-pct', pctDe(costosVal));
  fdSetText('fd-caja-flujo', formatoDolar(flujo));
  document.getElementById('fd-caja-margen')?.classList.toggle('fd-positive', margenContribucionUsd >= 0);
  document.getElementById('fd-caja-margen')?.classList.toggle('fd-negative', margenContribucionUsd < 0);
  document.getElementById('fd-caja-flujo')?.classList.toggle('fd-positive', flujo >= 0);
  document.getElementById('fd-caja-flujo')?.classList.toggle('fd-negative', flujo < 0);

  fdSetText('fd-equilibrio-texto', `${fdEntero(pacientes)} de ${fdEntero(metaPacientes)} pacientes - ${isAcumulado ? 'meta acumulada' : 'meta mensual'}`);
  fdSetText('fd-equilibrio-pct', fdPorcentaje(metaPct));
  fdSetText('fd-equilibrio-note', pe.valido && pe.px
    ? `Punto de equilibrio real: ${fdEntero(pe.px)} pacientes${isAcumulado ? ' acumulados' : '/mes'} (${formatoDolar(pe.usd)}); plan PPT: ${fdEntero(pePxPlan)} px; meta comercial: ${fdEntero(metaPacientes)} pacientes.`
    : (pe.motivo === 'margen_negativo'
      ? `Los costos variables superan la facturacion: no hay punto de equilibrio alcanzable este periodo; plan PPT: ${fdEntero(pePxPlan)} px; meta comercial: ${fdEntero(metaPacientes)} pacientes.`
      : `Punto de equilibrio (plan PPT): ${fdEntero(pePxPlan)} pacientes${isAcumulado ? ' acumulados' : '/mes'}; meta comercial: ${fdEntero(metaPacientes)} pacientes.`));
  const bar = document.getElementById('fd-equilibrio-bar');
  if (bar) {
    bar.style.width = Math.min(metaPct, 100) + '%';
    bar.classList.toggle('success', pacientes >= metaPacientes);
    bar.classList.toggle('danger', pacientes < metaPacientes);
  }

  const bajoMeta = baseComparacion.filter(d => parseFloat(d.facturacion || 0) < metaDentista);
  const brechaMeta = bajoMeta.reduce((sum, d) => sum + Math.max(metaDentista - parseFloat(d.facturacion || 0), 0), 0);
  const nombresNegativos = negativos.slice(0, 4).map(d => d.nombre.replace(/^Dr\.\s+|^Dra\.\s+/, '')).join(', ');
  const alertas = document.getElementById('fd-alertas');
  if (alertas) {
    const alertaEquilibrio = pe.valido && pe.px
      ? `<div class="fd-alert ${pacientes < pe.px ? 'red' : 'green'}">${fdEntero(pacientes)} pacientes vs punto de equilibrio real de ${fdEntero(pe.px)} px (${formatoDolar(pe.usd)}) - ${pacientes < pe.px ? 'faltan ' + fdEntero(pe.px - pacientes) + ' px para cubrir costos' : 'equilibrio cubierto'}</div>`
      : (pe.motivo === 'margen_negativo'
        ? `<div class="fd-alert red">Los costos variables (${formatoDolar(parseFloat(mensual.comisiones || 0) + parseFloat(mensual.insumos || 0))}) superan la facturacion (${formatoDolar(facturacion)}): no hay punto de equilibrio alcanzable</div>`
        : (pe.valido && !pe.px
          ? `<div class="fd-alert yellow">PE real: ${formatoDolar(pe.usd)}; falta registrar pacientes del periodo para expresarlo en px</div>`
          : `<div class="fd-alert yellow">Punto de equilibrio real no calculable: faltan datos de facturacion o costos del periodo</div>`));
    alertas.innerHTML = `
      <div class="fd-alert ${negativos.length ? 'red' : 'green'}">${negativos.length} silla(s) bajo piso de rentabilidad${nombresNegativos ? ` - ${nombresNegativos}` : ''}: ${brechaPiso ? '-' + formatoDolar(brechaPiso) : formatoDolar(0)}</div>
      <div class="fd-alert ${flujo < 0 ? 'red' : 'green'}">Flujo ${flujo < 0 ? 'negativo' : 'positivo'} - ${isAcumulado ? 'el periodo cerro en' : 'el mes cerro en'} ${formatoDolar(flujo)}</div>
      ${alertaEquilibrio}
      <div class="fd-alert ${bajoMeta.length ? 'yellow' : 'green'}">${bajoMeta.length} dentista(s) bajo meta ${formatoDolar(metaDentista)} - brecha total: ${formatoDolar(brechaMeta)}</div>`;
  }
}

async function initDashboardFinanciero() {
  const root = document.getElementById('dashboard-financiero-root');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const monthSelect = document.getElementById('fd-dashboard-mes');
  const yearSelect = document.getElementById('fd-dashboard-anio');
  const btnMensual = document.getElementById('fd-vista-mensual');
  const btnAcumulado = document.getElementById('fd-vista-acumulado');
  /* Antes de cualquier await: solo engancha listeners al DOM, no consulta nada,
     asi que no le afecta que la sesion de Supabase todavia no exista. */
  fdDrillInit();
  fdCargarRolPropio().then(rol => {
    if (rol === 'viewer') {
      const btnIngresar = document.getElementById('fd-btn-ingresar');
      if (btnIngresar) btnIngresar.style.display = 'none';
    }
  });
  const { anios, ultimoConDatos } = await fdCargarAniosDisponibles();
  /* Si el mes corriente aun no tiene cifras, se abre en el ultimo mes con datos
     para que el dashboard nunca reciba al usuario con todo en cero. */
  if (ultimoConDatos && !fdMesElegidoPorUsuario) fdMesActivoSeleccionado = ultimoConDatos;
  fdSetMesControls('fd-dashboard', fdMesActivoSeleccionado, anios);
  /* Este init puede correr antes de que la sesion de Supabase este lista, en
     cuyo caso la consulta de arriba falla y no hay mes al que saltar. El salto
     se reintenta una vez desde cargarVista, cuando ya hay token. */
  let saltoMesAplicado = !!ultimoConDatos;

  /* Token de secuencia: si el usuario cambia mes/anio/vista mientras una carga
     anterior sigue en vuelo, solo la carga mas reciente puede pintar el DOM. */
  let cargaToken = 0;
  const cargarVista = async () => {
    const token = ++cargaToken;
    fdMesActivoSeleccionado = fdReadMesControls('fd-dashboard');
    const mesSolicitado = fdMesActivoSeleccionado;
    const parsed = fdParseMesActivo(mesSolicitado);
    const esAcumulado = fdVistaDashboard === 'acumulado';
    const data = esAcumulado
      ? await fdCargarDatosAcumulados(mesSolicitado)
      : await fdCargarDatosDashboard(mesSolicitado);
    if (token !== cargaToken) return;

    /* Salto al ultimo mes con datos. La bandera solo se marca cuando la
       consulta REALMENTE respondio: si la sesion de Supabase aun no estaba
       lista (401), se vuelve a intentar en la siguiente carga en vez de
       quedar desactivado para siempre. */
    if (!esAcumulado && !fdMesElegidoPorUsuario && !saltoMesAplicado && !fdTieneDatos(data.mensual)) {
      const { ultimoConDatos: ultimo } = await fdCargarAniosDisponibles();
      if (ultimo) {
        saltoMesAplicado = true;
        if (ultimo !== mesSolicitado) {
          fdMesActivoSeleccionado = ultimo;
          fdSetMesControls('fd-dashboard', ultimo);
          return cargarVista();
        }
      }
    }

    let prev = null;
    let prevLabel = '';
    let prevDentistas = null;
    if (!esAcumulado) {
      try {
        const mesPrev = fdMesAnteriorTexto(mesSolicitado);
        const dataPrev = await fdCargarDatosDashboard(mesPrev);
        if (fdTieneDatos(dataPrev.mensual)) {
          prev = dataPrev.mensual;
          prevDentistas = dataPrev.dentistas;
        }
        prevLabel = fdParseMesActivo(mesPrev).mes;
      } catch (err) {
        console.error('No se pudo cargar el mes anterior:', err);
      }
    }
    if (token !== cargaToken) return;
    fdRenderDashboard(data.mensual, data.dentistas, data.fallback, data.vista || fdVistaDashboard, prev, prevLabel, prevDentistas);
    const serie = await fdCargarSerieAnual(parsed.anio);
    if (token !== cargaToken) return;
    fdRenderTendencia(serie, parsed.anio);
    /* La caja diaria se muestra solo en vista mensual: el saldo acumulado
       de varios meses encadenados no seria legible. */
    const cardDiaria = document.getElementById('fd-caja-diaria-card');
    const cardER = document.getElementById('fd-er-card');
    if (esAcumulado) {
      if (cardDiaria) cardDiaria.style.display = 'none';
      if (cardER) cardER.style.display = 'none';
    } else {
      await fdRenderEstadoResultados(mesSolicitado, () => token === cargaToken);
      await fdRenderCajaDiariaDashboard(mesSolicitado, () => token === cargaToken, data.mensual);
    }

    /* Indicadores: en mensual toman el ER del mes; en acumulado suman el
       periodo para que ticket, margenes y equilibrio sean del conjunto. */
    try {
      const mesesPeriodo = esAcumulado ? Math.max(parseInt(data.mensual?.meses_registrados, 10) || 0, 1) : 1;
      let erPeriodo = null;
      if (esAcumulado) {
        const serie = (await fdCargarSerieER(parsed.anio))
          .filter(r => fdMesIndice(r.mes) <= fdMesIndice(mesSolicitado));
        if (serie.length) {
          erPeriodo = fdCalcularER(serie.reduce((acc, r) => {
            FD_ER_LINEAS.forEach(k => { acc[k] = (acc[k] || 0) + parseFloat(r[k] || 0); });
            return acc;
          }, {}));
        }
      } else {
        const { row } = await fdCargarER(mesSolicitado);
        if (row) erPeriodo = fdCalcularER(row);
      }
      if (token !== cargaToken) return;
      await fdRenderIndicadores(data.mensual, erPeriodo, esAcumulado, mesesPeriodo, () => token === cargaToken);
    } catch (err) {
      console.error('No se pudieron construir los indicadores:', err);
    }
    /* El reparto es anual: se muestra igual en vista mensual y acumulada. */
    await fdRenderReparto(parsed.anio, () => token === cargaToken);
  };

  document.getElementById('fd-btn-informe')?.addEventListener('click', fdCompartirInformeEjecutivo);
  monthSelect?.addEventListener('change', () => { fdMesElegidoPorUsuario = true; cargarVista(); });
  yearSelect?.addEventListener('change', () => { fdMesElegidoPorUsuario = true; cargarVista(); });
  btnMensual?.addEventListener('click', () => { fdVistaDashboard = 'mensual'; cargarVista(); });
  btnAcumulado?.addEventListener('click', () => { fdVistaDashboard = 'acumulado'; cargarVista(); });

  await cargarVista();
  /* Red de seguridad: si en la primera carga la sesion aun no estaba lista, el
     mes pudo quedar en uno vacio. Se reintenta una vez pasado un momento. */
  if (!saltoMesAplicado && !fdMesElegidoPorUsuario) {
    setTimeout(() => { if (!saltoMesAplicado && !fdMesElegidoPorUsuario) cargarVista(); }, 1500);
  }
}
/* ══════════════════════════════════════════════════════════════════════
   CAJA DIARIA (propuesta 1 de la consultoria)
   La clinica ya registra dia a dia en sus Excel; aqui ese detalle vive en
   el portal. El cierre mensual puede calcularse desde estos dias.
   ══════════════════════════════════════════════════════════════════════ */
const FD_LOCAL_CAJA_DIARIA_KEY = 'clidente_fd_caja_diaria';
const FD_DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const FD_SHEETJS_URL = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';

function fdDiasDelMes(mesTexto) {
  const { mes, anio } = fdParseMesActivo(mesTexto);
  return new Date(anio, FD_MESES.indexOf(mes) + 1, 0).getDate();
}

/* 'Junio 2026' + dia 7 -> '2026-06-07' (fecha local, sin saltos de zona horaria) */
function fdFechaISO(mesTexto, dia) {
  const { mes, anio } = fdParseMesActivo(mesTexto);
  const m = String(FD_MESES.indexOf(mes) + 1).padStart(2, '0');
  return `${anio}-${m}-${String(dia).padStart(2, '0')}`;
}

function fdDiaSemana(fechaISO) {
  const [a, m, d] = String(fechaISO).split('-').map(Number);
  return FD_DIAS_SEMANA[new Date(a, m - 1, d).getDay()];
}

function fdRangoMes(mesTexto) {
  return { desde: fdFechaISO(mesTexto, 1), hasta: fdFechaISO(mesTexto, fdDiasDelMes(mesTexto)) };
}

function fdCajaDiariaLocal(mesTexto) {
  const { desde, hasta } = fdRangoMes(mesTexto);
  return fdGetLocalJson(FD_LOCAL_CAJA_DIARIA_KEY).filter(r => r.fecha >= desde && r.fecha <= hasta);
}

/* Elimina el respaldo local ya cubierto por una fila remota igual de reciente o
   mas nueva, para que una copia offline no siga suplantando a una correccion
   hecha en Supabase. Mismo criterio que fdDepurarLocalesSincronizados. */
function fdDepurarCajaDiariaSincronizada(remotas) {
  const remoto = new Map((Array.isArray(remotas) ? remotas : []).map(r => [String(r.fecha), fdFechaRow(r)]));
  const local = fdGetLocalJson(FD_LOCAL_CAJA_DIARIA_KEY);
  const vivos = local.filter(r => !(remoto.has(String(r.fecha)) && remoto.get(String(r.fecha)) >= fdFechaRow(r)));
  if (vivos.length !== local.length) fdSetLocalJson(FD_LOCAL_CAJA_DIARIA_KEY, vivos);
}

async function fdCargarCajaDiaria(mesTexto) {
  const { desde, hasta } = fdRangoMes(mesTexto);
  let remotas = [];
  let fallback = !fdSupabaseConfigurado();
  /* lecturaOk distingue "no hay datos" de "no se pudieron leer": sin esta
     diferencia, un GET fallido deja la grilla vacia y el guardado borraria
     el historico que nunca llego a cargarse. */
  let lecturaOk = false;
  if (fdSupabaseConfigurado()) {
    try {
      remotas = await fdSupabaseGetRows(`caja_diaria?select=*&fecha=gte.${desde}&fecha=lte.${hasta}&order=fecha.asc`);
      fdDepurarCajaDiariaSincronizada(remotas);
      lecturaOk = true;
    } catch (err) {
      console.error('No se pudo cargar la caja diaria:', err);
      fallback = true;
    }
  }
  /* Igual criterio que el resto del portal: gana el registro mas reciente. */
  const map = new Map();
  (Array.isArray(remotas) ? remotas : []).forEach(r => map.set(String(r.fecha), r));
  fdCajaDiariaLocal(mesTexto).forEach(r => {
    const remoto = map.get(String(r.fecha));
    if (!remoto || fdFechaRow(r) > fdFechaRow(remoto)) map.set(String(r.fecha), r);
  });
  const rows = [...map.values()].sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  return { rows, fallback: fallback || rows.some(r => r.local_only), lecturaOk };
}

function fdGuardarCajaDiariaLocal(rows, mesTexto) {
  const { desde, hasta } = fdRangoMes(mesTexto);
  const otros = fdGetLocalJson(FD_LOCAL_CAJA_DIARIA_KEY).filter(r => r.fecha < desde || r.fecha > hasta);
  const ahora = new Date().toISOString();
  fdSetLocalJson(FD_LOCAL_CAJA_DIARIA_KEY, otros.concat(rows.map(r => ({ ...r, local_only: true, created_at: ahora }))));
}

function fdDepurarCajaDiariaLocal(mesTexto) {
  const { desde, hasta } = fdRangoMes(mesTexto);
  fdSetLocalJson(FD_LOCAL_CAJA_DIARIA_KEY,
    fdGetLocalJson(FD_LOCAL_CAJA_DIARIA_KEY).filter(r => r.fecha < desde || r.fecha > hasta));
}

/* Snapshot de lo que la grilla realmente cargo: el guardado solo puede borrar
   dias que estaban presentes y el usuario dejo en cero. Sin esto, una lectura
   fallida (grilla vacia) borraria el mes entero al guardar. */
let fdCajaDiariaSnapshot = { mes: null, fechasConDatos: new Set(), lecturaOk: false };

/* Flujo de efectivo acumulado del mes. OJO: arranca en cero cada mes, asi que
   NO es el saldo bancario de la clinica sino cuanto efectivo genera o consume
   la operacion en el periodo. */
function fdResumenCajaDiaria(rows) {
  let saldo = 0;
  let peorSaldo = { valor: 0, fecha: null };
  let primerNegativo = null;
  const detalle = (Array.isArray(rows) ? rows : [])
    .slice()
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
    .map(r => {
      const ing = parseFloat(r.ingreso || 0);
      const egr = parseFloat(r.egreso || 0);
      const banco = parseFloat(r.pago_banco || 0);
      const neto = ing - egr - banco;
      saldo += neto;
      if (saldo < 0 && !primerNegativo) primerNegativo = r.fecha;
      if (saldo < peorSaldo.valor) peorSaldo = { valor: saldo, fecha: r.fecha };
      return { ...r, ingreso: ing, egreso: egr, pago_banco: banco, neto, saldo };
    });
  const suma = k => detalle.reduce((s, r) => s + (parseFloat(r[k]) || 0), 0);
  return {
    detalle,
    ingresos: suma('ingreso'),
    egresos: suma('egreso'),
    banco: suma('pago_banco'),
    pacientes: detalle.reduce((s, r) => s + (parseInt(r.pacientes, 10) || 0), 0),
    saldoFinal: saldo,
    peorSaldo,
    primerNegativo,
    diasConDatos: detalle.filter(r => r.ingreso || r.egreso || r.pago_banco).length
  };
}

/* Diferencia entre lo que suman los dias capturados y lo que dice el cierre del
   mes. Devuelve null cuando no hay nada que reportar: mes aun en curso (faltan
   dias por capturar por definicion), mes sin facturacion registrada, o cuadre
   dentro de un dolar (redondeos del Excel). */
function fdBrechaCajaDiaria(mesTexto, ingresosDiarios, mensual) {
  const mensualVal = parseFloat(mensual?.facturacion_total || 0);
  if (!mensualVal) return null;
  const ultimoDia = fdFechaISO(mesTexto, fdDiasDelMes(mesTexto));
  const hoy = new Date();
  const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  if (ultimoDia >= hoyISO) return null;
  const diferencia = ingresosDiarios - mensualVal;
  if (Math.abs(diferencia) <= 1) return null;
  return { diario: ingresosDiarios, mensual: mensualVal, diferencia };
}

function fdSlug(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderFormularioHenry() {
  return `
  <div id="formulario-henry-root" class="fd-shell fd-form-shell">
    <div class="fd-hero card">
      <div>
        <h1 class="section-title" style="margin-bottom:.35rem">Registro de datos &mdash; Dashboard Clidente</h1>
        <p class="fd-subtitle">Registra la caja dia a dia, o cierra el mes completo. Los dos alimentan el mismo dashboard.</p>
      </div>
      <label class="fd-month-badge">Mes activo <span class="fd-month-pair"><select id="henry-mes">${fdMesOptions()}</select><select id="henry-anio">${fdAnioOptions()}</select></span></label>
    </div>

    <div class="fd-view-toggle fd-tabs" role="group" aria-label="Modo de registro">
      <button type="button" id="henry-tab-diario" class="active">Caja diaria</button>
      <button type="button" id="henry-tab-mensual">Cierre mensual</button>
      <button type="button" id="henry-tab-er">Estado de Resultados</button>
    </div>

    <div id="henry-config-warning" class="fd-warning" style="display:none">
      Para guardar, revisa que la conexion Supabase del portal este disponible.
    </div>

    <!-- ══ PESTANA 1: CAJA DIARIA ══════════════════════════════════ -->
    <div id="henry-panel-diario">
      <div class="card fd-card-tight">
        <div class="card-title"><i class="fas fa-calendar-day" style="margin-right:.5rem"></i>Caja diaria <span class="fd-source green">Excel caja</span></div>
        <p class="fd-subtitle">Anota lo que entra y sale cada dia. El acumulado muestra cuanto efectivo genera o consume la operacion a lo largo del mes &mdash; y en que dia el mes empieza a consumir mas de lo que produce. Arranca en cero cada mes: es flujo del periodo, no el saldo bancario.</p>

        <div class="fd-import-row">
          <button type="button" id="henry-btn-import" class="fd-secondary"><i class="fas fa-file-import"></i> Importar Excel de caja del mes</button>
          <input type="file" id="henry-file-excel" accept=".xlsx,.xlsm" style="display:none">
          <span id="henry-import-estado" class="fd-import-estado"></span>
        </div>

        <div class="fd-kpi-grid compact" style="margin-top:1rem">
          <div class="fd-kpi-card"><span>Efectivo cobrado</span><strong id="cd-kpi-ingresos">$0.00</strong><small id="cd-kpi-dias" class="fd-delta"></small></div>
          <div class="fd-kpi-card"><span>Efectivo pagado</span><strong id="cd-kpi-egresos">$0.00</strong></div>
          <div class="fd-kpi-card"><span>Pagos al banco</span><strong id="cd-kpi-banco">$0.00</strong></div>
          <div class="fd-kpi-card"><span>Efectivo neto del mes</span><strong id="cd-kpi-saldo">$0.00</strong><small id="cd-kpi-peor" class="fd-delta"></small></div>
        </div>

        <div id="cd-aviso-lectura" class="fd-warning" style="display:none"></div>
        <div id="cd-alerta" class="fd-cuadre" style="display:none"></div>

        <div class="fd-table-wrap fd-tabla-wrap-alto" style="margin-top:1rem">
          <table class="fd-table fd-input-table fd-tabla-diaria">
            <thead><tr>
              <th>Dia</th><th>Ingreso ($)</th><th>Egreso ($)</th><th>Pago banco ($)</th><th>Pacientes</th><th class="cd-col-neto">Neto</th><th>Acumulado</th>
            </tr></thead>
            <tbody id="cd-body"><tr><td colspan="7">Cargando dias...</td></tr></tbody>
          </table>
        </div>
      </div>

      <div class="fd-actions">
        <button id="cd-guardar" class="fd-save">Guardar caja diaria</button>
        <button type="button" id="cd-usar-en-mes" class="fd-secondary"><i class="fas fa-arrow-right"></i> Pasar totales al cierre mensual</button>
        <button class="fd-secondary" onclick="navigate('dashboard-financiero')">Volver al dashboard</button>
      </div>
    </div>

    <!-- ══ PESTANA 2: CIERRE MENSUAL ═══════════════════════════════ -->
    <div id="henry-panel-mensual" style="display:none">
    <div class="card fd-card-tight">
      <div class="card-title">Paso 1 &mdash; Datos generales <span class="fd-source green">Excel caja</span></div>
      <div class="fd-form-grid">
        <label>Facturacion total del mes ($)<input id="henry-facturacion" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Pacientes atendidos<input id="henry-pacientes" type="number" min="0" step="1" placeholder="0"></label>
        <label>Total comisiones pagadas ($)<input id="henry-comisiones" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Total insumos del mes ($)<input id="henry-insumos" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Costos fijos del mes ($)<input id="henry-costos" type="number" min="0" step="0.01" value="10800"></label>
        <label>Cobrado en efectivo ($)<input id="henry-efectivo" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Cobrado con POS / tarjeta ($)<input id="henry-tarjeta" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Cobrado por transferencia ($)<input id="henry-transferencia" type="number" min="0" step="0.01" placeholder="0.00"></label>
      </div>
      <div id="henry-cuadre-cobros" class="fd-cuadre" style="display:none"></div>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title">Paso 2 &mdash; Facturacion por dentista <span class="fd-source blue">FG Dental</span></div>
      <div class="fd-table-wrap">
        <table class="fd-table fd-input-table">
          <thead><tr><th>Nombre</th><th>Campo de facturacion ($)</th><th>Badge de estado</th></tr></thead>
          <tbody>
            ${FD_DENTISTAS_NOMBRES.map(nombre => {
              const id = fdSlug(nombre);
              return `<tr>
                <td>${nombre}</td>
                <td><input class="fd-dentista-input" data-name="${nombre}" data-badge="badge-${id}" type="number" min="0" step="0.01" placeholder="0.00"></td>
                <td><span id="badge-${id}" class="fd-status no">Critico</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div id="henry-cuadre" class="fd-cuadre" style="display:none"></div>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title">Paso 3 &mdash; Vista previa antes de guardar</div>
      <div class="fd-kpi-grid compact">
        <div class="fd-kpi-card"><span>Facturacion</span><strong id="prev-facturacion">$0.00</strong></div>
        <div class="fd-kpi-card"><span>Pacientes</span><strong id="prev-pacientes">0</strong></div>
        <div class="fd-kpi-card"><span>Ticket promedio</span><strong id="prev-ticket">$0.00</strong></div>
        <div class="fd-kpi-card"><span>Resultado operativo</span><strong id="prev-flujo">$0.00</strong></div>
      </div>
      <div class="fd-progress-label"><span id="prev-equilibrio-texto">0 de 878 pacientes - meta mensual</span><strong id="prev-equilibrio-pct">0.0%</strong></div>
      <div class="fd-big-track"><div id="prev-equilibrio-bar" class="fd-big-fill danger" style="width:0%"></div></div>
      <div id="prev-alertas" class="fd-alert-grid" style="margin-top:1rem"></div>
      <div id="prev-mejoras" class="fd-improvement" style="display:none"></div>
    </div>

    <div class="fd-actions">
      <button id="henry-guardar" class="fd-save">Guardar datos de Mayo 2026</button>
      <button class="fd-secondary" onclick="navigate('dashboard-financiero')">Volver al dashboard</button>
    </div>
    </div><!-- /panel mensual -->

    <!-- ══ PESTANA 3: ESTADO DE RESULTADOS ═════════════════════════ -->
    <div id="henry-panel-er" style="display:none">
      <div class="card fd-card-tight">
        <div class="card-title"><i class="fas fa-file-invoice-dollar" style="margin-right:.5rem"></i>Estado de Resultados del mes</div>
        <p class="fd-subtitle">Escribe las cinco lineas de entrada; el portal calcula utilidad bruta, resultado operativo, utilidad neta y flujo de efectivo. Tambien puedes traerlas del Excel de caja: el archivo no trae un Estado de Resultados, pero si el detalle de egresos por categoria, y el portal lo clasifica.</p>

        <div class="fd-import-row">
          <button type="button" id="er-btn-import" class="fd-secondary"><i class="fas fa-file-import"></i> Traer del Excel de caja</button>
          <input type="file" id="er-file-excel" accept=".xlsx,.xlsm" style="display:none">
          <button type="button" id="er-btn-desde-caja" class="fd-secondary"><i class="fas fa-calendar-day"></i> Ingresos desde caja diaria</button>
          <span id="er-import-estado" class="fd-import-estado"></span>
        </div>

        <div class="fd-form-grid" style="margin-top:1rem">
          <label>Ingresos del mes ($)<input id="er-ingresos" type="number" min="0" step="0.01" placeholder="0.00"></label>
          <label>Costos variables ($)<input id="er-costos-variables" type="number" min="0" step="0.01" placeholder="0.00"></label>
          <label>Costos fijos ($)<input id="er-costos-fijos" type="number" min="0" step="0.01" value="10800"></label>
          <label>Gastos financieros ($)<input id="er-gastos-financieros" type="number" min="0" step="0.01" value="210.72"></label>
          <label>Pago mensual a los bancos ($)<input id="er-pago-bancos" type="number" min="0" step="0.01" value="12000"></label>
        </div>
      </div>

      <div class="card fd-card-tight" id="er-clasificador-card" style="display:none">
        <div class="card-title"><i class="fas fa-tags" style="margin-right:.5rem"></i>Clasificacion de los egresos del Excel</div>
        <p class="fd-subtitle">Cada categoria del Excel va a una linea del Estado de Resultados. Es criterio contable, no dato: revisalo con Ricardo. Las remesas son traslados de efectivo, no gasto.</p>
        <div class="fd-table-wrap">
          <table class="fd-table fd-input-table">
            <thead><tr><th>Categoria del Excel</th><th class="num">Monto del mes</th><th>Va a</th></tr></thead>
            <tbody id="er-clasificador-body"></tbody>
          </table>
        </div>
        <div class="fd-actions" style="margin-top:.8rem">
          <button type="button" id="er-aplicar-clasificacion" class="fd-secondary">Aplicar a las lineas de arriba</button>
        </div>
      </div>

      <div class="card fd-card-tight">
        <div class="card-title">Vista previa</div>
        <div class="fd-table-wrap">
          <table class="fd-table fd-er-tabla">
            <thead><tr><th>PARTIDA</th><th class="num">MONTO</th><th class="num">% DE INGRESOS</th></tr></thead>
            <tbody id="er-preview-body"></tbody>
          </table>
        </div>
        <p id="er-preview-conclusion" class="fd-er-conclusion"></p>
      </div>

      <div class="fd-actions">
        <button id="er-guardar" class="fd-save">Guardar Estado de Resultados</button>
        <button class="fd-secondary" onclick="navigate('dashboard-financiero')">Volver al dashboard</button>
      </div>
    </div>
  </div>`;
}

/* ══ Captura del Estado de Resultados ══ */
let fdErEgresosImportados = null;   /* { categoria: monto } del ultimo Excel leido */
let fdErClasificacion = {};         /* { CATEGORIA: 'variable'|'fijo'|'financiero'|'excluido' } */

function fdLeerER() {
  return {
    mes: fdReadMesControls('henry'),
    ingresos: fdNumber('er-ingresos'),
    costos_variables: fdNumber('er-costos-variables'),
    costos_fijos: fdNumber('er-costos-fijos'),
    gastos_financieros: fdNumber('er-gastos-financieros'),
    pago_bancos: fdNumber('er-pago-bancos')
  };
}

function fdActualizarPreviewER() {
  const row = fdLeerER();
  const er = fdCalcularER(row);
  const body = document.getElementById('er-preview-body');
  if (body) {
    body.innerHTML =
      `<tr class="fd-er-seccion"><td colspan="3">ESTADO DE RESULTADOS</td></tr>` +
      fdFilaER('Ingresos', er.ingresos, 100) +
      fdFilaER('Costos variables', er.costosVariables, er.pctVariables) +
      fdFilaER('Utilidad bruta', er.utilidadBruta, er.margenBruto, 'fd-er-subtotal') +
      fdFilaER('Costos fijos', er.costosFijos, er.pctFijos) +
      fdFilaER('Resultado operativo', er.resultadoOperativo, er.margenOperativo, 'fd-er-subtotal') +
      fdFilaER('Gastos financieros', er.gastosFinancieros, er.pctFinancieros) +
      fdFilaER('Utilidad neta', er.utilidadNeta, er.margenNeto, 'fd-er-total') +
      `<tr class="fd-er-seccion"><td colspan="3">FLUJO DE EFECTIVO</td></tr>` +
      fdFilaER('Pago mensual a los bancos', er.pagoBancos, er.pctBancos) +
      fdFilaER('Flujo de efectivo', er.flujoEfectivo, er.pctFlujo, 'fd-er-total');
  }
  const c = document.getElementById('er-preview-conclusion');
  if (c) {
    if (!er.ingresos) { c.textContent = ''; c.className = 'fd-er-conclusion'; return er; }
    const utilidadYFlujoOpuestos = er.resultadoOperativo > 0 && er.flujoEfectivo < 0;
    c.className = `fd-er-conclusion ${er.flujoEfectivo >= 0 ? 'ok' : 'alerta'}`;
    c.textContent = utilidadYFlujoOpuestos
      ? `Utilidad operativa de ${formatoDolar(er.resultadoOperativo)} pero flujo de efectivo de ${formatoDolar(er.flujoEfectivo)}: la cuota al banco se lleva mas de lo que produce la operacion.`
      : `Resultado operativo ${formatoDolar(er.resultadoOperativo)} - flujo de efectivo ${formatoDolar(er.flujoEfectivo)}.`;
  }
  const btn = document.getElementById('er-guardar');
  if (btn && !btn.disabled) btn.textContent = `Guardar Estado de Resultados de ${row.mes}`;
  return er;
}

function fdRenderClasificador() {
  const card = document.getElementById('er-clasificador-card');
  const body = document.getElementById('er-clasificador-body');
  if (!card || !body) return;
  if (!fdErEgresosImportados) { card.style.display = 'none'; return; }
  const cats = Object.keys(fdErEgresosImportados).filter(c => fdErEgresosImportados[c] > 0).sort();
  if (!cats.length) { card.style.display = 'none'; return; }
  card.style.display = '';
  const opciones = [['variable', 'Costos variables'], ['fijo', 'Costos fijos'], ['financiero', 'Gastos financieros'], ['excluido', 'No es gasto (excluir)']];
  body.innerHTML = cats.map(cat => {
    const tipo = fdErClasificacion[cat] || 'fijo';
    return `<tr>
      <td>${fdEscapeXml(cat)}</td>
      <td class="num"><strong>${formatoDolar(fdErEgresosImportados[cat])}</strong></td>
      <td><select class="er-clas" data-cat="${fdEscapeXml(cat)}">${opciones.map(([v, t]) => `<option value="${v}" ${v === tipo ? 'selected' : ''}>${t}</option>`).join('')}</select></td>
    </tr>`;
  }).join('');
}

function fdAplicarClasificacion() {
  if (!fdErEgresosImportados) return;
  document.querySelectorAll('.er-clas').forEach(sel => { fdErClasificacion[sel.dataset.cat] = sel.value; });
  const suma = tipo => Object.entries(fdErEgresosImportados)
    .filter(([cat]) => (fdErClasificacion[cat] || 'fijo') === tipo)
    .reduce((s, [, v]) => s + v, 0);
  const poner = (id, valor) => {
    const el = document.getElementById(id);
    if (el) { el.value = valor.toFixed(2); el.dispatchEvent(new Event('input', { bubbles: true })); }
  };
  poner('er-costos-variables', suma('variable'));
  poner('er-costos-fijos', suma('fijo'));
  const excluido = suma('excluido');
  const estado = document.getElementById('er-import-estado');
  if (estado) {
    estado.className = 'fd-import-estado ok';
    estado.textContent = `Aplicado: variables ${formatoDolar(suma('variable'))}, fijos ${formatoDolar(suma('fijo'))}, financieros ${formatoDolar(suma('financiero'))}. Excluido del resultado: ${formatoDolar(excluido)} (traslados e inversion).`;
  }
}

async function fdImportarEgresosExcel(archivo) {
  const estado = document.getElementById('er-import-estado');
  const mesTexto = fdReadMesControls('henry');
  const poner = (txt, clase = '') => { if (estado) { estado.textContent = txt; estado.className = `fd-import-estado ${clase}`; } };
  try {
    poner('Leyendo el archivo...', 'cargando');
    const mesArchivo = fdMesDesdeNombreArchivo(archivo?.name);
    if (mesArchivo && mesArchivo !== mesTexto) {
      poner(`El archivo parece de ${mesArchivo} y tienes seleccionado ${mesTexto}. Cambia el mes activo antes de importar.`, 'error');
      return;
    }
    const XLSX = await fdCargarSheetJS();
    const libro = XLSX.read(await archivo.arrayBuffer(), { type: 'array' });
    const hoja = libro.Sheets['EGRESOS'];
    if (!hoja) throw new Error('El archivo no tiene la hoja EGRESOS.');
    const rango = XLSX.utils.decode_range(hoja['!ref'] || 'A1');
    /* Bloque resumen: col E = 'GLOBAL', debajo categoria (col B) y total (col E). */
    let ini = -1;
    for (let r = rango.s.r; r <= Math.min(rango.e.r, 80); r++) {
      if (fdCeldaTexto(hoja, XLSX, r, 4).trim().toUpperCase() === 'GLOBAL') { ini = r + 1; break; }
    }
    if (ini < 0) throw new Error('No se encontro el bloque de totales por categoria (columna GLOBAL).');
    const egresos = {};
    for (let r = ini; r <= Math.min(ini + 30, rango.e.r); r++) {
      const cat = fdCeldaTexto(hoja, XLSX, r, 1).trim().toUpperCase();
      if (!cat) continue;
      if (cat.startsWith('TOTAL')) break;
      egresos[cat] = Math.round(fdCeldaNumero(hoja, XLSX, r, 4) * 100) / 100;
    }
    if (!Object.keys(egresos).length) throw new Error('No se leyo ninguna categoria de egreso.');

    fdErEgresosImportados = egresos;
    const remota = await fdCargarClasificacionEgresos();
    fdErClasificacion = { ...remota, ...fdErClasificacion };
    fdRenderClasificador();
    const total = Object.values(egresos).reduce((s, v) => s + v, 0);
    poner(`${Object.keys(egresos).filter(c => egresos[c] > 0).length} categorias leidas de ${mesTexto} (${formatoDolar(total)} en egresos de efectivo). Revisa la clasificacion y pulsa "Aplicar".`, 'ok');
  } catch (err) {
    console.error(err);
    poner(`No se pudo leer el archivo: ${err?.message || 'error desconocido'}`, 'error');
  }
}

async function fdIngresosDesdeCaja() {
  const mesTexto = fdReadMesControls('henry');
  const estado = document.getElementById('er-import-estado');
  try {
    const { rows } = await fdCargarCajaDiaria(mesTexto);
    const res = fdResumenCajaDiaria(rows);
    if (!res.diasConDatos) {
      if (estado) { estado.className = 'fd-import-estado error'; estado.textContent = `No hay caja diaria capturada para ${mesTexto}.`; }
      return;
    }
    const el = document.getElementById('er-ingresos');
    if (el) { el.value = res.ingresos.toFixed(2); el.dispatchEvent(new Event('input', { bubbles: true })); }
    if (estado) {
      estado.className = 'fd-import-estado ok';
      estado.textContent = `Ingresos ${formatoDolar(res.ingresos)} tomados de ${res.diasConDatos} dia(s) de caja. Ojo: la caja registra COBROS, que pueden diferir de lo facturado.`;
    }
  } catch (err) {
    console.error(err);
    if (estado) { estado.className = 'fd-import-estado error'; estado.textContent = 'No se pudo leer la caja diaria.'; }
  }
}

async function fdGuardarER() {
  if (fdRolPropio === 'viewer') {
    alert('Tu usuario es de solo lectura: el guardado esta reservado a los editores del equipo.');
    return;
  }
  const row = fdLeerER();
  if (FD_ER_LINEAS.some(k => row[k] < 0)) {
    alert('Hay valores negativos. Las lineas se capturan en positivo; el portal aplica el signo.');
    return;
  }
  if (row.ingresos <= 0) {
    alert('Escribe los ingresos del mes antes de guardar.');
    return;
  }
  const er = fdCalcularER(row);
  if (er.resultadoOperativo < 0 && !confirm(`El resultado operativo de ${row.mes} sale negativo (${formatoDolar(er.resultadoOperativo)}). Guardar de todos modos?`)) return;

  if (!fdSupabaseConfigurado()) {
    const otros = fdGetLocalJson(FD_LOCAL_ER_KEY).filter(r => r.mes !== row.mes);
    fdSetLocalJson(FD_LOCAL_ER_KEY, otros.concat([{ ...row, local_only: true, created_at: new Date().toISOString() }]));
    alert(`Sin conexion a Supabase: el Estado de Resultados de ${row.mes} quedo guardado solo en este navegador.`);
    return;
  }
  try {
    await fdSupabaseUpsert('estado_resultados', { ...row, origen: 'manual', created_at: new Date().toISOString() }, 'mes');
    fdSetLocalJson(FD_LOCAL_ER_KEY, fdGetLocalJson(FD_LOCAL_ER_KEY).filter(r => r.mes !== row.mes));
    alert(`Estado de Resultados de ${row.mes} guardado.`);
    navigate('dashboard-financiero');
  } catch (err) {
    console.error(err);
    if (fdErrorDePermisos(err)) {
      alert('Supabase rechazo el guardado por permisos. Si tu usuario es de solo lectura, pide a un editor del equipo que lo registre.');
      return;
    }
    if (/estado_resultados/i.test(err?.message || '') && /does not exist|PGRST205|42P01/i.test(err?.message || '')) {
      alert('La tabla estado_resultados todavia no existe en la base. Ejecutar supabase-estado-resultados.sql en Supabase.');
      return;
    }
    const otros = fdGetLocalJson(FD_LOCAL_ER_KEY).filter(r => r.mes !== row.mes);
    fdSetLocalJson(FD_LOCAL_ER_KEY, otros.concat([{ ...row, local_only: true, created_at: new Date().toISOString() }]));
    alert(`No se pudo conectar con Supabase (${err?.message || 'error'}). El Estado de Resultados quedo guardado en este navegador.`);
  }
}

async function fdCargarERenFormulario() {
  const mesTexto = fdReadMesControls('henry');
  try {
    const { row } = await fdCargarER(mesTexto);
    if (row) {
      const poner = (id, v) => { const el = document.getElementById(id); if (el) el.value = parseFloat(v || 0).toFixed(2); };
      poner('er-ingresos', row.ingresos);
      poner('er-costos-variables', row.costos_variables);
      poner('er-costos-fijos', row.costos_fijos);
      poner('er-gastos-financieros', row.gastos_financieros);
      poner('er-pago-bancos', row.pago_bancos);
    }
  } catch (err) {
    console.error('No se pudo precargar el estado de resultados:', err);
  }
  fdActualizarPreviewER();
}

/* ══ Grilla de caja diaria ══ */
function fdRenderTablaDiaria(mesTexto, rows) {
  const tbody = document.getElementById('cd-body');
  if (!tbody) return;
  const porFecha = new Map((Array.isArray(rows) ? rows : []).map(r => [String(r.fecha), r]));
  const dias = fdDiasDelMes(mesTexto);
  let html = '';
  for (let d = 1; d <= dias; d++) {
    const fecha = fdFechaISO(mesTexto, d);
    const r = porFecha.get(fecha) || {};
    const dow = fdDiaSemana(fecha);
    const finde = dow === 'Dom';
    html += `<tr class="${finde ? 'fd-fila-domingo' : ''}" data-fecha="${fecha}">
      <td class="fd-dia-celda"><strong>${d}</strong> <span class="fd-dow">${dow}</span></td>
      <td><input class="cd-in" data-campo="ingreso" type="number" min="0" step="0.01" placeholder="0.00" value="${r.ingreso != null ? r.ingreso : ''}"></td>
      <td><input class="cd-in" data-campo="egreso" type="number" min="0" step="0.01" placeholder="0.00" value="${r.egreso != null ? r.egreso : ''}"></td>
      <td><input class="cd-in" data-campo="pago_banco" type="number" min="0" step="0.01" placeholder="0.00" value="${r.pago_banco ? r.pago_banco : ''}"></td>
      <td><input class="cd-in" data-campo="pacientes" type="number" min="0" step="1" placeholder="0" value="${r.pacientes ? r.pacientes : ''}"></td>
      <td class="cd-neto">&mdash;</td>
      <td class="cd-saldo">&mdash;</td>
    </tr>`;
  }
  tbody.innerHTML = html;
}

function fdLeerTablaDiaria(mesTexto) {
  return Array.from(document.querySelectorAll('#cd-body tr')).map(tr => {
    const val = campo => {
      const el = tr.querySelector(`.cd-in[data-campo="${campo}"]`);
      /* Un monto pegado como "1,842.61" o "$1,842.61" llega vacio a un input
         number; se normaliza para no perderlo en silencio. */
      let bruto = el?.value ?? '';
      if (bruto === '' && el?.validity?.badInput) bruto = '';
      const limpio = String(bruto).replace(/[$\s]/g, '').replace(/,/g, '');
      const v = parseFloat(limpio);
      return Number.isFinite(v) ? v : 0;
    };
    return {
      fecha: tr.dataset.fecha,
      ingreso: val('ingreso'),
      egreso: val('egreso'),
      pago_banco: val('pago_banco'),
      pacientes: Math.trunc(val('pacientes'))
    };
  });
}

function fdActualizarTablaDiaria() {
  const mesTexto = fdReadMesControls('henry');
  const filas = fdLeerTablaDiaria(mesTexto);
  const res = fdResumenCajaDiaria(filas);
  const porFecha = new Map(res.detalle.map(r => [r.fecha, r]));

  document.querySelectorAll('#cd-body tr').forEach(tr => {
    const r = porFecha.get(tr.dataset.fecha);
    if (!r) return;
    const celdaNeto = tr.querySelector('.cd-neto');
    const celdaSaldo = tr.querySelector('.cd-saldo');
    const vacio = !r.ingreso && !r.egreso && !r.pago_banco;
    if (celdaNeto) {
      celdaNeto.textContent = vacio ? '—' : formatoDolar(r.neto);
      celdaNeto.className = `cd-neto ${vacio ? '' : (r.neto >= 0 ? 'fd-positive' : 'fd-negative')}`;
    }
    if (celdaSaldo) {
      celdaSaldo.textContent = formatoDolar(r.saldo);
      celdaSaldo.className = `cd-saldo ${r.saldo < 0 ? 'fd-negative' : 'fd-positive'}`;
    }
    tr.classList.toggle('fd-fila-alerta', r.saldo < 0);
  });

  fdSetText('cd-kpi-ingresos', formatoDolar(res.ingresos));
  fdSetText('cd-kpi-egresos', formatoDolar(res.egresos));
  fdSetText('cd-kpi-banco', formatoDolar(res.banco));
  fdSetText('cd-kpi-saldo', formatoDolar(res.saldoFinal));
  fdSetText('cd-kpi-dias', res.diasConDatos ? `${res.diasConDatos} dia(s) con movimiento` : 'sin movimientos aun');
  const kpiSaldo = document.getElementById('cd-kpi-saldo');
  kpiSaldo?.classList.toggle('fd-positive', res.saldoFinal >= 0);
  kpiSaldo?.classList.toggle('fd-negative', res.saldoFinal < 0);
  fdSetText('cd-kpi-peor', res.peorSaldo.fecha
    ? `punto mas bajo ${formatoDolar(res.peorSaldo.valor)} el ${res.peorSaldo.fecha}`
    : '');

  const alerta = document.getElementById('cd-alerta');
  if (alerta) {
    if (!res.diasConDatos) {
      alerta.style.display = 'none';
    } else if (res.primerNegativo) {
      alerta.className = 'fd-cuadre bad';
      alerta.style.display = 'block';
      alerta.textContent = `Alerta de caja: a partir del ${res.primerNegativo} el mes consume mas efectivo del que genera, y toca fondo el ${res.peorSaldo.fecha} en ${formatoDolar(res.peorSaldo.valor)}. Desde ese dia la operacion depende del efectivo con que se haya empezado el mes.`;
    } else if (res.banco > 0 && res.saldoFinal < res.banco * 0.15) {
      alerta.className = 'fd-cuadre warn';
      alerta.style.display = 'block';
      alerta.textContent = `El mes genera ${formatoDolar(res.saldoFinal)} de efectivo neto despues de pagar ${formatoDolar(res.banco)} al banco: margen muy justo para imprevistos.`;
    } else {
      alerta.className = 'fd-cuadre ok';
      alerta.style.display = 'block';
      alerta.textContent = `El acumulado nunca baja de cero: el mes genera ${formatoDolar(res.saldoFinal)} de efectivo neto.`;
    }
  }
  return res;
}

async function fdGuardarCajaDiaria() {
  if (fdRolPropio === 'viewer') {
    alert('Tu usuario es de solo lectura: el guardado esta reservado a los editores del equipo.');
    return;
  }
  const mesTexto = fdReadMesControls('henry');
  const filas = fdLeerTablaDiaria(mesTexto);
  if (filas.some(r => r.ingreso < 0 || r.egreso < 0 || r.pago_banco < 0 || r.pacientes < 0)) {
    alert('Hay valores negativos en la tabla. Corrige los montos antes de guardar.');
    return;
  }
  /* Solo se guardan los dias con algun movimiento: un mes a medio capturar
     no debe llenar la base de filas en cero. */
  const conDatos = filas.filter(r => r.ingreso || r.egreso || r.pago_banco || r.pacientes);
  if (!conDatos.length) {
    alert('No hay ningun dia con movimientos para guardar.');
    return;
  }

  if (!fdSupabaseConfigurado()) {
    fdGuardarCajaDiariaLocal(conDatos, mesTexto);
    alert(`Sin conexion a Supabase: los ${conDatos.length} dia(s) quedaron guardados solo en este navegador.`);
    return;
  }

  /* Solo se pueden borrar dias que la grilla LEYO con datos y el usuario dejo
     en cero. Si la lectura remota fallo (o es de otro mes), no se borra nada:
     una grilla vacia por error de red no debe arrasar el historico. */
  const snapshotVigente = fdCajaDiariaSnapshot.mes === mesTexto && fdCajaDiariaSnapshot.lecturaOk;
  const conDatosAhora = new Set(conDatos.map(r => r.fecha));
  const aBorrar = snapshotVigente
    ? [...fdCajaDiariaSnapshot.fechasConDatos].filter(f => !conDatosAhora.has(f))
    : [];
  if (aBorrar.length > 3 && !confirm(`Vas a borrar ${aBorrar.length} dia(s) que tenian movimientos registrados (${aBorrar.slice(0, 3).join(', ')}...). Continuar?`)) return;

  const ahora = new Date().toISOString();
  const payload = conDatos.map(r => ({ ...r, origen: 'manual', created_at: ahora }));
  try {
    await fdSupabaseUpsert('caja_diaria', payload, 'fecha');
    if (aBorrar.length) {
      await fdSupabaseDelete('caja_diaria', `?fecha=in.(${aBorrar.join(',')})`);
    }
    fdDepurarCajaDiariaLocal(mesTexto);
    fdCajaDiariaSnapshot = { mes: mesTexto, fechasConDatos: new Set(conDatosAhora), lecturaOk: true };
    alert(`Caja diaria de ${mesTexto} guardada: ${conDatos.length} dia(s) con movimiento.${aBorrar.length ? ` Se borraron ${aBorrar.length} dia(s) que quedaron en cero.` : ''}`);
  } catch (err) {
    console.error(err);
    if (fdErrorDePermisos(err)) {
      alert('Supabase rechazo el guardado por permisos. Si tu usuario es de solo lectura, pide a un editor del equipo que registre la caja.');
      return;
    }
    if (/caja_diaria/i.test(err?.message || '') && /does not exist|PGRST205|42P01/i.test(err?.message || '')) {
      alert('La tabla de caja diaria todavia no existe en la base. Ejecutar supabase-caja-diaria.sql en Supabase.\n\nMientras tanto, los dias quedaron guardados en este navegador.');
      fdGuardarCajaDiariaLocal(conDatos, mesTexto);
      return;
    }
    fdGuardarCajaDiariaLocal(conDatos, mesTexto);
    alert(`No se pudo conectar con Supabase (${err?.message || 'error desconocido'}). Los dias quedaron guardados temporalmente en este navegador.`);
  }
}

/* ══ Importador del Excel de caja ══
   Lee las hojas diarias 1..31 (fila "TOTALES BRUTOS" = ingreso del dia,
   filas de pacientes con cobro = conteo) y la matriz categoria x dia de la
   hoja EGRESOS (fila "TOTAL EGRESO EN EFECTIVO"). */
function fdCargarSheetJS() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = FD_SHEETJS_URL;
    s.onload = () => window.XLSX ? resolve(window.XLSX) : reject(new Error('SheetJS no quedo disponible'));
    s.onerror = () => reject(new Error('No se pudo descargar el lector de Excel (revisa la conexion)'));
    document.head.appendChild(s);
  });
}

/* "CAJA MAYO 2026.xlsx" -> "Mayo 2026". Devuelve null si el nombre no lo dice. */
function fdMesDesdeNombreArchivo(nombre) {
  if (!nombre) return null;
  const limpio = String(nombre).toUpperCase();
  const mes = FD_MESES.find(m => limpio.includes(m.toUpperCase()));
  if (!mes) return null;
  const anio = (limpio.match(/(20\d{2})/) || [])[1];
  return anio ? `${mes} ${anio}` : null;
}

function fdCeldaTexto(hoja, XLSX, fila, col) {
  const ref = XLSX.utils.encode_cell({ r: fila, c: col });
  const celda = hoja[ref];
  return celda ? String(celda.v ?? '') : '';
}

function fdCeldaNumero(hoja, XLSX, fila, col) {
  const ref = XLSX.utils.encode_cell({ r: fila, c: col });
  const celda = hoja[ref];
  return celda && typeof celda.v === 'number' ? celda.v : 0;
}

function fdParsearLibroCaja(libro, XLSX) {
  const porDia = {};
  for (let d = 1; d <= 31; d++) {
    const hoja = libro.Sheets[String(d)];
    if (!hoja) continue;
    const rango = XLSX.utils.decode_range(hoja['!ref'] || 'A1');
    let ingreso = 0;
    let pacientes = 0;
    let filaTotales = -1;
    for (let r = rango.s.r; r <= rango.e.r; r++) {
      if (fdCeldaTexto(hoja, XLSX, r, 0).trim().toUpperCase().startsWith('TOTALES BRUTOS')) { filaTotales = r; break; }
    }
    if (filaTotales >= 0) {
      for (let c = 2; c <= Math.min(rango.e.c, 49); c++) ingreso += fdCeldaNumero(hoja, XLSX, filaTotales, c);
    }
    /* Pacientes = filas con nombre completo (2+ palabras) antes de TOTALES BRUTOS.
       Contrastado contra las cifras oficiales del informe: coincide dentro de
       +-2% en 5 de los 6 meses. Si no aparece TOTALES BRUTOS no se cuenta nada,
       porque debajo de esa fila empieza la estructura contable y el conteo se
       dispararia. */
    if (filaTotales >= 0) {
      for (let r = 2; r < filaTotales; r++) {
        const nombre = fdCeldaTexto(hoja, XLSX, r, 1).trim();
        if (nombre.split(/\s+/).filter(Boolean).length < 2) continue;
        pacientes++;
      }
    }
    porDia[d] = { ingreso: Math.round(ingreso * 100) / 100, egreso: 0, pacientes, sinTotales: filaTotales < 0 };
  }

  const egresos = libro.Sheets['EGRESOS'];
  if (egresos) {
    const rango = XLSX.utils.decode_range(egresos['!ref'] || 'A1');
    for (let r = rango.s.r; r <= Math.min(rango.e.r, 60); r++) {
      if (fdCeldaTexto(egresos, XLSX, r, 1).trim().toUpperCase().startsWith('TOTAL EGRESO')) {
        for (let d = 1; d <= 31; d++) {
          const v = fdCeldaNumero(egresos, XLSX, r, 3 + d); // col E (indice 4) = dia 1
          if (porDia[d]) porDia[d].egreso = Math.round(v * 100) / 100;
        }
        break;
      }
    }
  }
  return porDia;
}

async function fdImportarExcelCaja(archivo) {
  const estado = document.getElementById('henry-import-estado');
  const mesTexto = fdReadMesControls('henry');
  const poner = (txt, clase = '') => { if (estado) { estado.textContent = txt; estado.className = `fd-import-estado ${clase}`; } };
  try {
    poner('Leyendo el archivo...', 'cargando');
    const XLSX = await fdCargarSheetJS();
    const buffer = await archivo.arrayBuffer();
    const libro = XLSX.read(buffer, { type: 'array' });
    const hojasDia = Array.from({ length: 31 }, (_, i) => String(i + 1)).filter(n => libro.Sheets[n]).length;
    if (!hojasDia) throw new Error('El archivo no tiene hojas diarias (1..31). Verifica que sea un CAJA <MES> 2026.xlsx.');
    const porDia = fdParsearLibroCaja(libro, XLSX);

    const diasMes = fdDiasDelMes(mesTexto);
    const conMov = Object.keys(porDia).map(Number)
      .filter(d => porDia[d].ingreso || porDia[d].egreso)
      .sort((a, b) => a - b);
    if (!conMov.length) throw new Error('El archivo no tiene movimientos en sus hojas diarias.');

    /* El Excel no dice de que mes es (las hojas se llaman 1..31), asi que se
       valida contra la forma del mes elegido antes de tocar la grilla: volcar
       un mes sobre otro corrompe los datos en silencio. */
    const mesArchivo = fdMesDesdeNombreArchivo(archivo?.name);
    if (mesArchivo && mesArchivo !== mesTexto) {
      poner(`El archivo parece de ${mesArchivo} y tienes seleccionado ${mesTexto}. Cambia el mes activo antes de importar.`, 'error');
      return;
    }
    const fuera = conMov.filter(d => d > diasMes);
    if (fuera.length) {
      poner(`El archivo tiene movimientos el dia ${fuera.join(', ')}, pero ${mesTexto} tiene ${diasMes} dias. Es de otro mes: cambia el mes activo antes de importar.`, 'error');
      return;
    }
    if (diasMes === 31 && !conMov.some(d => d >= 29)) {
      if (!confirm(`El archivo no trae movimientos del 29 al 31, pero ${mesTexto} tiene 31 dias. Parece de otro mes. Continuar de todos modos?`)) {
        poner('Importacion cancelada.', '');
        return;
      }
    }
    if (!confirm(`Se cargaran ${conMov.length} dia(s) sobre ${mesTexto}, reemplazando lo que haya en la grilla. Continuar?`)) {
      poner('Importacion cancelada.', '');
      return;
    }

    let cargados = 0;
    let totalIngreso = 0;
    document.querySelectorAll('#cd-body tr').forEach(tr => {
      const dia = parseInt(String(tr.dataset.fecha).slice(-2), 10);
      const info = porDia[dia];
      /* Siempre se escribe (aunque sea vacio) para no dejar residuos del mes
         anterior en las celdas que el archivo no cubre. */
      const set = (campo, valor) => {
        const el = tr.querySelector(`.cd-in[data-campo="${campo}"]`);
        if (el) el.value = valor || '';
      };
      set('ingreso', info?.ingreso);
      set('egreso', info?.egreso);
      set('pacientes', info?.pacientes);
      if (info && (info.ingreso || info.egreso)) cargados++;
      totalIngreso += info?.ingreso || 0;
    });
    fdActualizarTablaDiaria();
    poner(`Listo: ${cargados} dia(s) cargados sobre ${mesTexto}, ${formatoDolar(totalIngreso)} de ingresos. El pago al banco no viene en el Excel: anotalo antes de guardar.`, 'ok');
  } catch (err) {
    console.error(err);
    poner(`No se pudo leer el archivo: ${err?.message || 'error desconocido'}`, 'error');
  }
}

/* Pasa los totales de la caja diaria al formulario de cierre mensual. */
function fdPasarDiarioAMensual() {
  const res = fdActualizarTablaDiaria();
  if (!res.diasConDatos) {
    alert('Todavia no hay dias con movimientos en la caja diaria.');
    return;
  }
  const poner = (id, valor) => {
    const el = document.getElementById(id);
    if (el) { el.value = valor; el.dispatchEvent(new Event('input', { bubbles: true })); }
  };
  /* Lo cobrado en caja NO es lo mismo que la facturacion del mes (en mayo 2026
     difieren en ~$3,700), asi que se advierte antes de pisar el dato oficial. */
  const factActual = fdNumber('henry-facturacion');
  const aviso = factActual > 0
    ? `Vas a reemplazar la facturacion registrada (${formatoDolar(factActual)}) por lo COBRADO en caja (${formatoDolar(res.ingresos)}). Son bases distintas: la caja registra cobros, la facturacion registra lo producido. Continuar?`
    : `Se pasara al cierre mensual lo COBRADO en caja (${formatoDolar(res.ingresos)}) como facturacion del mes. Ojo: cobrado y facturado pueden diferir. Continuar?`;
  if (!confirm(aviso)) return;

  poner('henry-facturacion', res.ingresos.toFixed(2));
  poner('henry-pacientes', res.pacientes);
  fdMostrarPanelHenry('mensual');
  alert(`Listo: facturacion ${formatoDolar(res.ingresos)} y ${fdEntero(res.pacientes)} pacientes, calculados desde ${res.diasConDatos} dia(s) de caja.\n\nFALTA completar comisiones, insumos y la produccion por dentista: sin ellos el flujo neto y el punto de equilibrio salen inflados.`);
}

function fdMostrarPanelHenry(cual) {
  [['diario', 'henry-panel-diario', 'henry-tab-diario'],
   ['mensual', 'henry-panel-mensual', 'henry-tab-mensual'],
   ['er', 'henry-panel-er', 'henry-tab-er']].forEach(([clave, panelId, tabId]) => {
    const panel = document.getElementById(panelId);
    const tab = document.getElementById(tabId);
    if (panel) panel.style.display = cual === clave ? '' : 'none';
    tab?.classList.toggle('active', cual === clave);
  });
}

function fdNumber(id) {
  const el = document.getElementById(id);
  return parseFloat(el?.value || 0) || 0;
}

/* Mes anterior al seleccionado en el formulario, para comparar mejoras. */
let fdHenryPrev = null;
let fdHenryPrevLabel = '';

function fdCollectHenryData() {
  const mes = fdReadMesControls('henry');
  const facturacion = fdNumber('henry-facturacion');
  const pacientes = parseInt(document.getElementById('henry-pacientes')?.value || 0, 10) || 0;
  const comisiones = fdNumber('henry-comisiones');
  const insumos = fdNumber('henry-insumos');
  const costos = fdNumber('henry-costos') || 10800;
  const efectivo = fdNumber('henry-efectivo');
  const tarjeta = fdNumber('henry-tarjeta');
  const transferencia = fdNumber('henry-transferencia');
  const flujo = facturacion - comisiones - costos - insumos;
  const ticket = pacientes > 0 ? facturacion / pacientes : 0;
  const dentistas = Array.from(document.querySelectorAll('.fd-dentista-input')).map(input => {
    const valor = parseFloat(input.value || 0) || 0;
    const estado = fdEstadoDentista(valor);
    return { mes, nombre: input.dataset.name, facturacion: valor, meta: FD_META_DENTISTA, estado: estado.key };
  });
  return { mes, facturacion, pacientes, comisiones, insumos, costos, flujo, ticket, efectivo, tarjeta, transferencia, dentistas };
}

function fdUpdateHenryPreview() {
  const data = fdCollectHenryData();
  const equilibrioPct = (data.pacientes / FD_META_PACIENTES) * 100;

  fdSetText('prev-facturacion', formatoDolar(data.facturacion));
  fdSetText('prev-pacientes', fdEntero(data.pacientes));
  fdSetText('prev-ticket', formatoDolar(data.ticket));
  fdSetText('prev-flujo', formatoDolar(data.flujo));
  fdSetText('prev-equilibrio-texto', `${fdEntero(data.pacientes)} de ${FD_META_PACIENTES} pacientes - meta mensual`);
  fdSetText('prev-equilibrio-pct', fdPorcentaje(equilibrioPct));
  const btnGuardarPrev = document.getElementById('henry-guardar');
  if (btnGuardarPrev && !btnGuardarPrev.disabled) btnGuardarPrev.textContent = `Guardar datos de ${data.mes}`;

  document.getElementById('prev-flujo')?.classList.toggle('fd-positive', data.flujo >= 0);
  document.getElementById('prev-flujo')?.classList.toggle('fd-negative', data.flujo < 0);
  const bar = document.getElementById('prev-equilibrio-bar');
  if (bar) {
    bar.style.width = Math.min(equilibrioPct, 100) + '%';
    bar.classList.toggle('success', data.pacientes >= FD_META_PACIENTES);
    bar.classList.toggle('danger', data.pacientes < FD_META_PACIENTES);
  }

  document.querySelectorAll('.fd-dentista-input').forEach(input => {
    const estado = fdEstadoDentista(parseFloat(input.value || 0) || 0);
    const badge = document.getElementById(input.dataset.badge);
    if (badge) {
      badge.className = `fd-status ${estado.css}`;
      badge.textContent = estado.label;
    }
  });

  const sumaDentistas = data.dentistas.reduce((sum, d) => sum + d.facturacion, 0);
  const cuadre = document.getElementById('henry-cuadre');
  if (cuadre) {
    if (data.facturacion <= 0 && sumaDentistas <= 0) {
      cuadre.style.display = 'none';
    } else {
      const diff = sumaDentistas - data.facturacion;
      const baseCuadre = Math.max(data.facturacion, sumaDentistas);
      const pctDiff = baseCuadre > 0 ? (Math.abs(diff) / baseCuadre) * 100 : 0;
      const nivel = pctDiff <= 1 ? 'ok' : pctDiff <= 5 ? 'warn' : 'bad';
      const veredicto = nivel === 'ok' ? 'Las dos fuentes cuadran.' : nivel === 'warn' ? 'Diferencia leve: revisar antes de guardar.' : 'No cuadra: revisar FG Dental y Excel caja.';
      cuadre.className = `fd-cuadre ${nivel}`;
      cuadre.style.display = 'block';
      cuadre.textContent = `Cuadre de fuentes - suma por dentista (FG Dental): ${formatoDolar(sumaDentistas)} vs facturacion total (Excel caja): ${formatoDolar(data.facturacion)} - diferencia ${formatoDolar(Math.abs(diff))} (${fdPorcentaje(pctDiff)}). ${veredicto}`;
    }
  }

  const sumaCobros = data.efectivo + data.tarjeta + data.transferencia;
  const cuadreCobros = document.getElementById('henry-cuadre-cobros');
  if (cuadreCobros) {
    if (sumaCobros <= 0) {
      cuadreCobros.style.display = 'none';
    } else {
      const baseCobros = Math.max(data.facturacion, sumaCobros);
      const pctCobros = baseCobros > 0 ? (Math.abs(sumaCobros - data.facturacion) / baseCobros) * 100 : 0;
      const nivelCobros = pctCobros <= 1 ? 'ok' : pctCobros <= 5 ? 'warn' : 'bad';
      cuadreCobros.className = `fd-cuadre ${nivelCobros}`;
      cuadreCobros.style.display = 'block';
      cuadreCobros.textContent = `Mix de cobro: efectivo ${formatoDolar(data.efectivo)} + POS ${formatoDolar(data.tarjeta)} + transferencia ${formatoDolar(data.transferencia)} = ${formatoDolar(sumaCobros)} vs facturacion total ${formatoDolar(data.facturacion)} (diferencia ${fdPorcentaje(pctCobros)}).`;
    }
  }

  const pe = fdPuntoEquilibrioReal({
    facturacion_total: data.facturacion,
    comisiones: data.comisiones,
    insumos: data.insumos,
    costos_fijos: data.costos,
    pacientes_atendidos: data.pacientes
  });
  const bajoMeta = data.dentistas.filter(d => d.facturacion < FD_META_DENTISTA);
  const brecha = bajoMeta.reduce((sum, d) => sum + Math.max(FD_META_DENTISTA - d.facturacion, 0), 0);
  const alertas = document.getElementById('prev-alertas');
  if (alertas) {
    const alertaEquilibrio = pe.valido && pe.px
      ? `<div class="fd-alert ${data.pacientes < pe.px ? 'red' : 'green'}">${fdEntero(data.pacientes)} pacientes vs punto de equilibrio real de ${fdEntero(pe.px)} px (${formatoDolar(pe.usd)})</div>`
      : (pe.motivo === 'margen_negativo'
        ? `<div class="fd-alert red">Los costos variables (${formatoDolar(data.comisiones + data.insumos)}) superan la facturacion (${formatoDolar(data.facturacion)}): no hay punto de equilibrio alcanzable</div>`
        : `<div class="fd-alert ${data.pacientes < FD_PUNTO_EQUILIBRIO ? 'red' : 'green'}">${fdEntero(data.pacientes)} pacientes vs punto de equilibrio del plan PPT de ${FD_PUNTO_EQUILIBRIO}</div>`);
    alertas.innerHTML = `
      <div class="fd-alert ${data.flujo < 0 ? 'red' : 'green'}">Flujo ${data.flujo < 0 ? 'negativo' : 'positivo'} - ${formatoDolar(data.flujo)}</div>
      ${alertaEquilibrio}
      <div class="fd-alert ${data.pacientes < FD_META_PACIENTES ? 'yellow' : 'green'}">${fdEntero(data.pacientes)} pacientes vs meta mensual de ${FD_META_PACIENTES}</div>
      <div class="fd-alert ${bajoMeta.length ? 'yellow' : 'green'}">${bajoMeta.length} dentistas bajo meta $2,500 - brecha total: ${formatoDolar(brecha)}</div>`;
  }

  const base = fdHenryPrev && fdTieneDatos(fdHenryPrev) ? fdHenryPrev : null;
  const mejorasBox = document.getElementById('prev-mejoras');
  if (mejorasBox) {
    if (!base) {
      mejorasBox.style.display = 'none';
      mejorasBox.innerHTML = '';
    } else {
      const baseFact = parseFloat(base.facturacion_total || 0);
      const basePac = parseInt(base.pacientes_atendidos || 0, 10);
      const baseTicket = basePac > 0 ? baseFact / basePac : 0;
      const baseFlujo = parseFloat(base.flujo_neto || 0);
      const mejoras = [];
      if (data.facturacion > baseFact) mejoras.push(`Facturacion +${formatoDolar(data.facturacion - baseFact)}`);
      if (data.pacientes > basePac) mejoras.push(`Pacientes +${fdEntero(data.pacientes - basePac)}`);
      if (data.ticket > baseTicket) mejoras.push(`Ticket promedio +${formatoDolar(data.ticket - baseTicket)}`);
      if (data.flujo > baseFlujo) mejoras.push(`Resultado operativo mejora ${formatoDolar(data.flujo - baseFlujo)}`);
      mejorasBox.style.display = mejoras.length ? 'block' : 'none';
      mejorasBox.innerHTML = mejoras.length ? `<strong>Mejoras frente a ${fdHenryPrevLabel}:</strong> ${mejoras.join(' &middot; ')}` : '';
    }
  }
}


/* Errores de permisos (RLS/sesion): NO deben caer al respaldo local, porque una
   copia local con created_at nuevo suplantaria a los datos compartidos en este
   navegador de forma permanente. */
function fdErrorDePermisos(err) {
  return /42501|row-level security|permission denied|Supabase 40[13]/i.test(err?.message || '');
}

async function fdSupabaseUpsert(tabla, datos, onConflict) {
  if (typeof supabaseRequest !== 'function') throw new Error('No hay cliente Supabase disponible');
  await supabaseRequest(`${tabla}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(datos)
  });
  return true;
}

function fdErrorSinConstraint(err) {
  return /no unique|exclusion constraint|42P10/i.test(err?.message || '');
}

/* Guardado sin ventana de perdida: upsert por mes. Si las tablas aun no tienen
   la restriccion UNIQUE (falta ejecutar supabase-migracion-20260811.sql), cae
   al esquema anterior de borrado + insercion. */
/* Si la tabla aun no tiene las columnas del mix de cobro (falta la migracion),
   PostgREST responde PGRST204 nombrando la columna: se reintenta sin esos campos
   y se avisa al usuario, porque esos montos NO quedan guardados. */
function fdErrorColumnaMix(err) {
  const msg = err?.message || '';
  return /PGRST204/.test(msg) && /'(efectivo|tarjeta|transferencia)'/.test(msg);
}

function fdSinColumnasMix(row) {
  const { efectivo, tarjeta, transferencia, ...resto } = row;
  return resto;
}

/* Bandera del guardado en curso: la escritura cayo al modo sin columnas de mix. */
let fdUltimoGuardadoSinMix = false;

async function fdEscribirMensual(mensualRow, escribir) {
  try {
    return await escribir(mensualRow);
  } catch (err) {
    if (!fdErrorColumnaMix(err)) throw err;
    console.warn('Tabla sin columnas de mix de cobro; guardando sin ellas. Ejecutar supabase-migracion-20260811.sql.', err);
    fdUltimoGuardadoSinMix = true;
    return escribir(fdSinColumnasMix(mensualRow));
  }
}

async function fdGuardarMesSupabase(data, mensual) {
  const filtro = fdFiltroMes(data.mes);
  /* created_at viene del reloj del cliente para que el merge local-vs-remoto
     pueda comparar recencia. Riesgo aceptado: un desfase de reloj entre equipos
     solo importaria si dos usuarios guardan el MISMO mes dentro de esa ventana. */
  const ahora = new Date().toISOString();
  const mensualRow = { ...mensual, created_at: ahora };
  const dentistasRows = data.dentistas.map(d => ({ ...d, created_at: ahora }));
  try {
    /* Dentistas primero y el registro mensual al final como "commit": si algo
       falla a mitad, el mes no aparece actualizado a medias para el resto. */
    await fdSupabaseUpsert('produccion_dentistas', dentistasRows, 'mes,nombre');
    const lista = data.dentistas.map(d => `"${d.nombre}"`).join(',');
    await fdSupabaseDelete('produccion_dentistas', `${filtro}&nombre=not.in.(${encodeURIComponent(lista)})`);
    await fdEscribirMensual(mensualRow, row => fdSupabaseUpsert('dashboard_mensual', row, 'mes'));
    return;
  } catch (err) {
    if (!fdErrorSinConstraint(err)) throw err;
    console.warn('Tablas sin restriccion UNIQUE; usando borrado + insercion. Ejecutar supabase-migracion-20260811.sql para el guardado seguro.', err);
  }
  await fdSupabaseDelete('dashboard_mensual', filtro);
  await fdSupabaseDelete('produccion_dentistas', filtro);
  const okMensual = await fdEscribirMensual(mensualRow, row => fdSupabaseInsert('dashboard_mensual', row));
  const okDentistas = await fdSupabaseInsert('produccion_dentistas', dentistasRows);
  if (!okMensual || !okDentistas) throw new Error('Supabase rechazo el guardado');
}

async function fdGuardarHenry() {
  if (!fdSupabaseConfigurado()) {
    document.getElementById('henry-config-warning').style.display = 'block';
    alert('Primero revisa que la conexion Supabase del portal este disponible.');
    return;
  }
  if (fdRolPropio === 'viewer') {
    alert('Tu usuario es de solo lectura: el guardado esta reservado a los editores del equipo.');
    return;
  }

  const data = fdCollectHenryData();
  if (!data.mes) {
    alert('Escribe el mes activo antes de guardar.');
    return;
  }

  const negativos = [data.facturacion, data.pacientes, data.comisiones, data.insumos, data.costos, data.efectivo, data.tarjeta, data.transferencia]
    .concat(data.dentistas.map(d => d.facturacion))
    .some(v => v < 0);
  if (negativos) {
    alert('Hay valores negativos en el formulario. Corrige los montos antes de guardar.');
    return;
  }

  const sumaDentistas = data.dentistas.reduce((sum, d) => sum + d.facturacion, 0);
  if (data.facturacion <= 0 && data.pacientes <= 0 && sumaDentistas <= 0) {
    if (!confirm(`Todos los valores de ${data.mes} estan en cero. Deseas guardarlo asi?`)) return;
  }
  const baseCuadre = Math.max(data.facturacion, sumaDentistas);
  if (baseCuadre > 0) {
    const pctDiff = (Math.abs(sumaDentistas - data.facturacion) / baseCuadre) * 100;
    if (pctDiff > 5 && !confirm(`La suma por dentista (${formatoDolar(sumaDentistas)}) difiere de la facturacion total (${formatoDolar(data.facturacion)}) en ${fdPorcentaje(pctDiff)}. Deseas guardar de todos modos?`)) return;
  }
  /* Sin costos variables el flujo neto y el punto de equilibrio quedan inflados
     y el dashboard mostraria un mes falsamente sano. */
  if (data.facturacion > 0 && (data.comisiones <= 0 || data.insumos <= 0)) {
    const faltan = [data.comisiones <= 0 ? 'comisiones' : null, data.insumos <= 0 ? 'insumos' : null].filter(Boolean).join(' y ');
    if (!confirm(`Vas a guardar ${data.mes} sin ${faltan}. El flujo neto y el punto de equilibrio saldran inflados (el dashboard mostrara el mes mas sano de lo que es). Guardar de todos modos?`)) return;
  }

  try {
    await seedMayo2026();
    const filtro = fdFiltroMes(data.mes);
    const existentes = await fdSupabaseGetRows(`dashboard_mensual${filtro}&select=id&limit=1`);
    if (Array.isArray(existentes) && existentes.length > 0) {
      const okOverwrite = confirm(`Ya existen datos para ${data.mes}. Deseas sobreescribirlos?`);
      if (!okOverwrite) return;
    }

    const pe = fdPuntoEquilibrioReal({
      facturacion_total: data.facturacion,
      comisiones: data.comisiones,
      insumos: data.insumos,
      costos_fijos: data.costos,
      pacientes_atendidos: data.pacientes
    });
    const mensual = {
      mes: data.mes,
      facturacion_total: data.facturacion,
      pacientes_atendidos: data.pacientes,
      ticket_promedio: data.ticket,
      flujo_neto: data.flujo,
      costos_fijos: data.costos,
      comisiones: data.comisiones,
      insumos: data.insumos,
      punto_equilibrio: pe.valido && pe.px ? pe.px : FD_PUNTO_EQUILIBRIO,
      efectivo: data.efectivo,
      tarjeta: data.tarjeta,
      transferencia: data.transferencia
    };

    fdUltimoGuardadoSinMix = false;
    await fdGuardarMesSupabase(data, mensual);

    fdMesActivoSeleccionado = data.mes;
    const hayMix = (data.efectivo + data.tarjeta + data.transferencia) > 0;
    if (fdUltimoGuardadoSinMix && hayMix) {
      /* Los montos del mix no llegaron a Supabase: se conservan en este navegador
         para no perderlos y se avisa que falta ejecutar la migracion. */
      fdGuardarLocal(data);
      alert(`Las cifras de ${data.mes} se guardaron, PERO el desglose de cobros (efectivo, POS y transferencia) NO se pudo guardar porque a la base todavia le faltan esas columnas.\n\nQuedaron respaldados en este navegador. Para guardarlos de verdad: ejecutar supabase-migracion-20260811.sql en Supabase y volver a guardar el mes.`);
    } else {
      fdDepurarLocalMes(data.mes);
      alert(`Datos de ${data.mes} guardados correctamente.`);
    }
    navigate('dashboard-financiero');
  } catch (err) {
    console.error(err);
    if (fdErrorDePermisos(err)) {
      alert('Supabase rechazo el guardado por permisos. Si tu usuario es de solo lectura (Vanessa o Roberto), pide a un editor del equipo (Jaime, Cecilia, Ricardo o Elias) que registre estas cifras. Si eres editor, recarga la pagina e inicia sesion de nuevo.');
      return;
    }
    fdGuardarLocal(data);
    fdMesActivoSeleccionado = data.mes;
    alert(`No se pudo conectar con Supabase (${err?.message || 'error desconocido'}). Los datos de ${data.mes} quedaron guardados temporalmente en este navegador. Para que se compartan con otros equipos, hay que corregir la conexion Supabase.`);
    navigate('dashboard-financiero');
  }
}

function initFormularioHenry() {
  const root = document.getElementById('formulario-henry-root');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';
  document.getElementById('henry-config-warning').style.display = fdSupabaseConfigurado() ? 'none' : 'block';
  fdSetMesControls('henry', fdMesActivoSeleccionado);

  fdCargarRolPropio().then(rol => {
    if (rol !== 'viewer') return;
    ['henry-guardar', 'cd-guardar'].forEach(id => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.disabled = true;
      btn.style.opacity = '.5';
      btn.style.cursor = 'not-allowed';
      btn.textContent = 'Solo lectura - no puedes guardar';
    });
    const btnImport = document.getElementById('henry-btn-import');
    if (btnImport) btnImport.style.display = 'none';
    const warning = document.getElementById('henry-config-warning');
    if (warning) {
      warning.style.display = 'block';
      warning.textContent = 'Tu usuario es de solo lectura: puedes revisar los datos, pero el guardado esta reservado a los editores del equipo (Jaime, Cecilia, Ricardo y Elias).';
    }
  });

  let prevToken = 0;
  const cargarMesAnterior = async () => {
    const token = ++prevToken;
    const mesPrev = fdMesAnteriorTexto(fdReadMesControls('henry'));
    let prevRow = null;
    try {
      const dataPrev = await fdCargarDatosDashboard(mesPrev);
      prevRow = fdTieneDatos(dataPrev.mensual) ? dataPrev.mensual : null;
    } catch (err) {
      console.error('No se pudo cargar el mes anterior:', err);
    }
    if (token !== prevToken) return;
    fdHenryPrevLabel = mesPrev;
    fdHenryPrev = prevRow;
    fdUpdateHenryPreview();
  };

  /* La grilla diaria se re-arma con cada cambio de mes (dias distintos y datos
     distintos); el token evita que una carga lenta pise a una mas reciente. */
  let diarioToken = 0;
  const cargarDiario = async () => {
    const token = ++diarioToken;
    const mesTexto = fdReadMesControls('henry');
    /* Mientras carga, el snapshot queda invalidado: guardar en ese momento
       no puede borrar nada. */
    fdCajaDiariaSnapshot = { mes: null, fechasConDatos: new Set(), lecturaOk: false };
    const estadoImport = document.getElementById('henry-import-estado');
    if (estadoImport) { estadoImport.textContent = ''; estadoImport.className = 'fd-import-estado'; }
    fdRenderTablaDiaria(mesTexto, []);
    fdActualizarTablaDiaria();
    let rows = [];
    let lecturaOk = false;
    try {
      const data = await fdCargarCajaDiaria(mesTexto);
      rows = data.rows;
      lecturaOk = !!data.lecturaOk;
    } catch (err) {
      console.error('No se pudo cargar la caja diaria:', err);
    }
    if (token !== diarioToken) return;
    fdCajaDiariaSnapshot = {
      mes: mesTexto,
      lecturaOk,
      fechasConDatos: new Set(rows
        .filter(r => parseFloat(r.ingreso || 0) || parseFloat(r.egreso || 0) || parseFloat(r.pago_banco || 0) || parseInt(r.pacientes || 0, 10))
        .map(r => String(r.fecha)))
    };
    fdRenderTablaDiaria(mesTexto, rows);
    fdActualizarTablaDiaria();
    const aviso = document.getElementById('cd-aviso-lectura');
    if (aviso) {
      const hayProblema = fdSupabaseConfigurado() && !lecturaOk;
      aviso.style.display = hayProblema ? 'block' : 'none';
      if (hayProblema) {
        aviso.textContent = 'No se pudieron leer los datos guardados de este mes (problema de conexion o permisos). Lo que escribas se guardara, pero para evitar perdidas no se borrara ningun dia existente. Recarga la pagina antes de hacer correcciones.';
      }
    }
  };

  root.querySelectorAll('input, select').forEach(input => input.addEventListener('input', fdUpdateHenryPreview));
  root.querySelectorAll('select').forEach(input => input.addEventListener('change', fdUpdateHenryPreview));
  document.getElementById('henry-mes')?.addEventListener('change', () => { cargarMesAnterior(); cargarDiario(); });
  document.getElementById('henry-anio')?.addEventListener('change', () => { cargarMesAnterior(); cargarDiario(); });
  document.getElementById('henry-guardar')?.addEventListener('click', fdGuardarHenry);

  /* Pestanas */
  document.getElementById('henry-tab-diario')?.addEventListener('click', () => fdMostrarPanelHenry('diario'));
  document.getElementById('henry-tab-mensual')?.addEventListener('click', () => fdMostrarPanelHenry('mensual'));
  document.getElementById('henry-tab-er')?.addEventListener('click', () => fdMostrarPanelHenry('er'));

  /* Estado de Resultados */
  FD_ER_LINEAS.forEach(k => {
    const id = 'er-' + k.replace(/_/g, '-');
    document.getElementById(id)?.addEventListener('input', fdActualizarPreviewER);
  });
  document.getElementById('er-guardar')?.addEventListener('click', fdGuardarER);
  document.getElementById('er-btn-desde-caja')?.addEventListener('click', fdIngresosDesdeCaja);
  document.getElementById('er-aplicar-clasificacion')?.addEventListener('click', fdAplicarClasificacion);
  const erFile = document.getElementById('er-file-excel');
  document.getElementById('er-btn-import')?.addEventListener('click', () => erFile?.click());
  erFile?.addEventListener('change', ev => {
    const archivo = ev.target.files?.[0];
    if (archivo) fdImportarEgresosExcel(archivo);
    ev.target.value = '';
  });

  /* Caja diaria: recalculo en vivo, guardado, importador y puente al cierre */
  document.getElementById('cd-body')?.addEventListener('input', ev => {
    if (!ev.target.classList.contains('cd-in')) return;
    /* Marca en rojo lo que el navegador no pudo leer como numero (p. ej. texto
       o un monto con separador que quedo invalido), en vez de tratarlo como 0. */
    ev.target.classList.toggle('cd-in-malo', !!ev.target.validity?.badInput);
    fdActualizarTablaDiaria();
  });
  document.getElementById('cd-guardar')?.addEventListener('click', fdGuardarCajaDiaria);
  document.getElementById('cd-usar-en-mes')?.addEventListener('click', fdPasarDiarioAMensual);
  const fileInput = document.getElementById('henry-file-excel');
  document.getElementById('henry-btn-import')?.addEventListener('click', () => fileInput?.click());
  fileInput?.addEventListener('change', ev => {
    const archivo = ev.target.files?.[0];
    if (archivo) fdImportarExcelCaja(archivo);
    ev.target.value = '';
  });

  document.getElementById('henry-mes')?.addEventListener('change', fdCargarERenFormulario);
  document.getElementById('henry-anio')?.addEventListener('change', fdCargarERenFormulario);

  fdUpdateHenryPreview();
  cargarMesAnterior();
  cargarDiario();
  fdCargarERenFormulario();
}

