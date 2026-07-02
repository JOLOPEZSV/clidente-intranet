/* Dashboard Financiero CLIDENTE - Supabase + SPA */

const FD_META_DENTISTA = 2500;
const FD_PISO_RENTABILIDAD = 1800;
const FD_MAX_BARRA = 6500;
const FD_PUNTO_EQUILIBRIO = 878;

const FD_MAYO_2026 = {
  mes: 'Mayo 2026',
  facturacion_total: 30443.34,
  pacientes_atendidos: 783,
  ticket_promedio: 38.87,
  flujo_neto: -965,
  costos_fijos: 10800,
  comisiones: 7611,
  insumos: 12997,
  punto_equilibrio: 878
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
let fdMesActivoSeleccionado = 'Mayo 2026';

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

function fdEstadoDentista(valor) {
  const n = parseFloat(valor || 0);
  if (n >= FD_META_DENTISTA) return { key: 'sobre_meta', label: 'Sobre meta', css: 'ok' };
  if (n >= FD_PISO_RENTABILIDAD) return { key: 'advertencia', label: 'Advertencia', css: 'warn' };
  return { key: 'critico', label: 'Critico', css: 'no' };
}

function fdFiltroMes(mes) {
  return `?mes=eq.${encodeURIComponent(mes)}`;
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

async function fdCargarAniosDisponibles() {
  if (!fdSupabaseConfigurado()) return FD_ANIOS_BASE;
  try {
    await seedMayo2026();
    const rows = await fdSupabaseGetRows('dashboard_mensual?select=mes,created_at&order=created_at.desc');
    const anios = (Array.isArray(rows) ? rows : [])
      .map(row => fdParseMesActivo(row.mes).anio)
      .filter(Boolean);
    return [...new Set([...FD_ANIOS_BASE, ...anios])].sort((a, b) => a - b);
  } catch (err) {
    console.error('No se pudieron cargar los años:', err);
    return FD_ANIOS_BASE;
  }
}
async function fdCargarDatosDashboard(mesActivo = fdMesActivoSeleccionado) {
  if (!fdSupabaseConfigurado()) {
    return { mensual: FD_MAYO_2026, dentistas: FD_DENTISTAS_MAYO_2026, fallback: true };
  }

  try {
    await seedMayo2026();
    const mensualRows = await fdSupabaseGetRows(`dashboard_mensual?select=*&mes=eq.${encodeURIComponent(mesActivo)}&limit=1`);
    const mensual = Array.isArray(mensualRows) && mensualRows.length ? mensualRows[0] : { ...FD_MAYO_2026, mes: mesActivo, facturacion_total: 0, pacientes_atendidos: 0, ticket_promedio: 0, flujo_neto: 0, comisiones: 0, insumos: 0, costos_fijos: 10800 };
    const dentistasRows = await fdSupabaseGetRows(`produccion_dentistas?select=*&mes=eq.${encodeURIComponent(mensual.mes)}&order=facturacion.desc`);
    const dentistas = Array.isArray(dentistasRows) && dentistasRows.length ? dentistasRows : FD_DENTISTAS_NOMBRES.map(nombre => ({ nombre, facturacion: 0, meta: FD_META_DENTISTA, estado: 'critico' }));
    return { mensual, dentistas, fallback: false };
  } catch (err) {
    console.error('No se pudo cargar Supabase:', err);
    return { mensual: FD_MAYO_2026, dentistas: FD_DENTISTAS_MAYO_2026, fallback: true };
  }
}
function renderDashboardFinanciero() {
  return `
  <div id="dashboard-financiero-root" class="fd-shell">
    <div class="fd-hero card">
      <div>
        <h1 class="section-title" style="margin-bottom:.35rem">Dashboard de gestion mensual — Clinica Dental Clidente</h1>
        <label class="fd-month-control">Mes activo <span class="fd-month-pair"><select id="fd-dashboard-mes">${fdMesOptions()}</select><select id="fd-dashboard-anio">${fdAnioOptions()}</select></span></label>
        <div class="fd-source-row">
          <span class="fd-source blue">FG Dental</span>
          <span class="fd-source green">Excel caja</span>
          <span class="fd-source amber">Contador externo</span>
          <span class="fd-arrow">&rarr;</span>
          <span class="fd-source unified">Dashboard unificado</span>
        </div>
      </div>
      <button class="fd-secondary" onclick="navigate('formulario-henry')">Ingresar datos del mes &rarr;</button>
    </div>

    <div id="fd-config-warning" class="fd-warning" style="display:none">
      Supabase aun no esta disponible. El dashboard muestra Mayo 2026 como datos de arranque hasta revisar la conexion del portal.
    </div>

    <div class="fd-kpi-grid">
      <div class="fd-kpi-card"><span>Facturacion total</span><strong id="fd-kpi-facturacion">$0.00</strong></div>
      <div class="fd-kpi-card"><span>Pacientes atendidos</span><strong id="fd-kpi-pacientes">0</strong></div>
      <div class="fd-kpi-card"><span>Ticket promedio</span><strong id="fd-kpi-ticket">$0.00</strong></div>
      <div class="fd-kpi-card"><span>Flujo neto</span><strong id="fd-kpi-flujo">$0.00</strong></div>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title"><i class="fas fa-user-doctor" style="margin-right:.5rem"></i>Produccion por dentista</div>
      <div class="fd-table-wrap">
        <table class="fd-table">
          <thead><tr><th>Nombre</th><th>Facturacion</th><th>Barra de progreso</th><th>Estado</th></tr></thead>
          <tbody id="fd-dentistas-body"><tr><td colspan="4">Cargando datos...</td></tr></tbody>
        </table>
      </div>
    </div>

    <div class="fd-grid2">
      <div class="card fd-card-tight">
        <div class="card-title"><i class="fas fa-chair" style="margin-right:.5rem"></i>Analisis por silla</div>
        <div class="fd-metric-row"><span>Costo fijo por silla</span><strong>$1,350/mes</strong></div>
        <div class="fd-metric-row"><span>Piso de rentabilidad</span><strong>$1,800/mes</strong></div>
        <div class="fd-metric-row"><span>Media aritmetica del grupo</span><strong>$3,044/mes</strong></div>
        <div class="fd-metric-row"><span>Meta politica</span><strong>$2,500/mes</strong></div>
        <div class="fd-metric-row danger"><span>3 sillas en contribucion negativa</span><strong>-$1,587/mes</strong></div>
      </div>

      <div class="card fd-card-tight">
        <div class="card-title"><i class="fas fa-cash-register" style="margin-right:.5rem"></i>Flujo de caja del mes</div>
        <div class="fd-metric-row"><span>Facturacion bruta</span><strong id="fd-caja-facturacion">$0.00</strong></div>
        <div class="fd-metric-row danger"><span>Comisiones</span><strong id="fd-caja-comisiones">$0.00</strong></div>
        <div class="fd-metric-row danger"><span>Costos fijos</span><strong id="fd-caja-costos">$0.00</strong></div>
        <div class="fd-metric-row danger"><span>Insumos</span><strong id="fd-caja-insumos">$0.00</strong></div>
        <div class="fd-metric-row total"><span>Flujo neto</span><strong id="fd-caja-flujo">$0.00</strong></div>
      </div>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title"><i class="fas fa-gauge-high" style="margin-right:.5rem"></i>Punto de equilibrio</div>
      <div class="fd-progress-label"><span id="fd-equilibrio-texto">0 de 878 pacientes — punto de equilibrio</span><strong id="fd-equilibrio-pct">0.0%</strong></div>
      <div class="fd-big-track"><div id="fd-equilibrio-bar" class="fd-big-fill danger" style="width:0%"></div></div>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title"><i class="fas fa-triangle-exclamation" style="margin-right:.5rem"></i>Alertas de gestion</div>
      <div id="fd-alertas" class="fd-alert-grid"></div>
    </div>

    <div class="fd-footer">
      Fuentes: FG Dental · Excel caja · Contador externo · Informe estrategico enero-abril 2026 · Confidencial — uso exclusivo Clinica Dental Clidente
    </div>
  </div>`;
}

function fdSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function fdRenderDashboard(mensual, dentistas, fallback) {
  const facturacion = parseFloat(mensual.facturacion_total || 0);
  const pacientes = parseInt(mensual.pacientes_atendidos || 0, 10);
  const ticket = pacientes > 0 ? facturacion / pacientes : 0;
  const flujo = parseFloat(mensual.flujo_neto || 0);
  const punto = parseInt(mensual.punto_equilibrio || FD_PUNTO_EQUILIBRIO, 10);
  const equilibrioPct = punto > 0 ? (pacientes / punto) * 100 : 0;

  fdMesActivoSeleccionado = mensual.mes || fdMesActivoSeleccionado;
  fdSetMesControls('fd-dashboard', fdMesActivoSeleccionado);
  fdSetText('fd-kpi-facturacion', formatoDolar(facturacion));
  fdSetText('fd-kpi-pacientes', fdEntero(pacientes));
  fdSetText('fd-kpi-ticket', formatoDolar(ticket));
  fdSetText('fd-kpi-flujo', formatoDolar(flujo));

  document.getElementById('fd-kpi-flujo')?.classList.toggle('fd-positive', flujo >= 0);
  document.getElementById('fd-kpi-flujo')?.classList.toggle('fd-negative', flujo < 0);
  document.getElementById('fd-config-warning').style.display = fallback ? 'block' : 'none';

  const tbody = document.getElementById('fd-dentistas-body');
  if (tbody) {
    tbody.innerHTML = dentistas
      .slice()
      .sort((a, b) => parseFloat(b.facturacion || 0) - parseFloat(a.facturacion || 0))
      .map(d => {
        const valor = parseFloat(d.facturacion || 0);
        const estado = fdEstadoDentista(valor);
        const width = Math.min((valor / FD_MAX_BARRA) * 100, 100);
        const suffix = estado.key === 'advertencia' ? ' &#9888;' : estado.key === 'critico' ? ' &times;' : '';
        return `<tr>
          <td>${d.nombre}</td>
          <td><strong>${formatoDolar(valor)}</strong></td>
          <td><div class="fd-mini-track"><div class="fd-mini-fill ${estado.css}" style="width:${width}%"></div></div></td>
          <td><span class="fd-status ${estado.css}">${estado.label}${suffix}</span></td>
        </tr>`;
      }).join('');
  }

  fdSetText('fd-caja-facturacion', formatoDolar(facturacion));
  fdSetText('fd-caja-comisiones', '-' + formatoDolar(mensual.comisiones || 0));
  fdSetText('fd-caja-costos', '-' + formatoDolar(mensual.costos_fijos || 0));
  fdSetText('fd-caja-insumos', '-' + formatoDolar(mensual.insumos || 0));
  fdSetText('fd-caja-flujo', formatoDolar(flujo));
  document.getElementById('fd-caja-flujo')?.classList.toggle('fd-positive', flujo >= 0);
  document.getElementById('fd-caja-flujo')?.classList.toggle('fd-negative', flujo < 0);

  fdSetText('fd-equilibrio-texto', `${fdEntero(pacientes)} de ${fdEntero(punto)} pacientes — punto de equilibrio`);
  fdSetText('fd-equilibrio-pct', fdPorcentaje(equilibrioPct));
  const bar = document.getElementById('fd-equilibrio-bar');
  if (bar) {
    bar.style.width = Math.min(equilibrioPct, 100) + '%';
    bar.classList.toggle('success', pacientes >= punto);
    bar.classList.toggle('danger', pacientes < punto);
  }

  const alertas = document.getElementById('fd-alertas');
  if (alertas) {
    alertas.innerHTML = `
      <div class="fd-alert red">3 sillas con contribucion negativa — Mendez, Arriaza, Guardado: -$1,587/mes</div>
      <div class="fd-alert red">Flujo negativo — el mes cerro en ${formatoDolar(flujo)}</div>
      <div class="fd-alert yellow">5 dentistas bajo meta $2,500 — brecha total: $5,088/mes</div>
      <div class="fd-alert green">Potencial referidos + reactivacion — +$4,904/mes proyectado</div>`;
  }
}

async function initDashboardFinanciero() {
  const root = document.getElementById('dashboard-financiero-root');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const monthSelect = document.getElementById('fd-dashboard-mes');
  const yearSelect = document.getElementById('fd-dashboard-anio');
  const anios = await fdCargarAniosDisponibles();
  fdSetMesControls('fd-dashboard', fdMesActivoSeleccionado, anios);

  const cargarMesActivo = async () => {
    fdMesActivoSeleccionado = fdReadMesControls('fd-dashboard');
    const { mensual, dentistas, fallback } = await fdCargarDatosDashboard(fdMesActivoSeleccionado);
    fdRenderDashboard(mensual, dentistas, fallback);
  };

  monthSelect?.addEventListener('change', cargarMesActivo);
  yearSelect?.addEventListener('change', cargarMesActivo);

  const { mensual, dentistas, fallback } = await fdCargarDatosDashboard(fdMesActivoSeleccionado);
  fdRenderDashboard(mensual, dentistas, fallback);
}
function fdSlug(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderFormularioHenry() {
  return `
  <div id="formulario-henry-root" class="fd-shell fd-form-shell">
    <div class="fd-hero card">
      <div>
        <h1 class="section-title" style="margin-bottom:.35rem">Ingreso mensual de datos — Dashboard Clidente</h1>
        <p class="fd-subtitle">Completa los 3 pasos una vez al mes. Tiempo estimado: 15 minutos.</p>
      </div>
      <label class="fd-month-badge">Mes activo <span class="fd-month-pair"><select id="henry-mes">${fdMesOptions()}</select><select id="henry-anio">${fdAnioOptions()}</select></span></label>
    </div>

    <div id="henry-config-warning" class="fd-warning" style="display:none">
      Para guardar, revisa que la conexion Supabase del portal este disponible.
    </div>

    <div class="card fd-card-tight">
      <div class="card-title">Paso 1 — Datos generales <span class="fd-source green">Excel caja</span></div>
      <div class="fd-form-grid">
        <label>Facturacion total del mes ($)<input id="henry-facturacion" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Pacientes atendidos<input id="henry-pacientes" type="number" min="0" step="1" placeholder="0"></label>
        <label>Total comisiones pagadas ($)<input id="henry-comisiones" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Total insumos del mes ($)<input id="henry-insumos" type="number" min="0" step="0.01" placeholder="0.00"></label>
        <label>Costos fijos del mes ($)<input id="henry-costos" type="number" min="0" step="0.01" value="10800"></label>
      </div>
    </div>

    <div class="card fd-card-tight">
      <div class="card-title">Paso 2 — Facturacion por dentista <span class="fd-source blue">FG Dental</span></div>
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
    </div>

    <div class="card fd-card-tight">
      <div class="card-title">Paso 3 — Vista previa antes de guardar</div>
      <div class="fd-kpi-grid compact">
        <div class="fd-kpi-card"><span>Facturacion</span><strong id="prev-facturacion">$0.00</strong></div>
        <div class="fd-kpi-card"><span>Pacientes</span><strong id="prev-pacientes">0</strong></div>
        <div class="fd-kpi-card"><span>Ticket promedio</span><strong id="prev-ticket">$0.00</strong></div>
        <div class="fd-kpi-card"><span>Flujo neto</span><strong id="prev-flujo">$0.00</strong></div>
      </div>
      <div class="fd-progress-label"><span id="prev-equilibrio-texto">0 de 878 pacientes — punto de equilibrio</span><strong id="prev-equilibrio-pct">0.0%</strong></div>
      <div class="fd-big-track"><div id="prev-equilibrio-bar" class="fd-big-fill danger" style="width:0%"></div></div>
      <div id="prev-alertas" class="fd-alert-grid" style="margin-top:1rem"></div>
      <div id="prev-mejoras" class="fd-improvement" style="display:none"></div>
    </div>

    <div class="fd-actions">
      <button id="henry-guardar" class="fd-save">Guardar datos de Mayo 2026</button>
      <button class="fd-secondary" onclick="navigate('dashboard-financiero')">Volver al dashboard</button>
    </div>
  </div>`;
}

function fdNumber(id) {
  const el = document.getElementById(id);
  return parseFloat(el?.value || 0) || 0;
}

function fdCollectHenryData() {
  const mes = fdReadMesControls('henry');
  const facturacion = fdNumber('henry-facturacion');
  const pacientes = parseInt(document.getElementById('henry-pacientes')?.value || 0, 10) || 0;
  const comisiones = fdNumber('henry-comisiones');
  const insumos = fdNumber('henry-insumos');
  const costos = fdNumber('henry-costos') || 10800;
  const flujo = facturacion - comisiones - costos - insumos;
  const ticket = pacientes > 0 ? facturacion / pacientes : 0;
  const dentistas = Array.from(document.querySelectorAll('.fd-dentista-input')).map(input => {
    const valor = parseFloat(input.value || 0) || 0;
    const estado = fdEstadoDentista(valor);
    return { mes, nombre: input.dataset.name, facturacion: valor, meta: FD_META_DENTISTA, estado: estado.key };
  });
  return { mes, facturacion, pacientes, comisiones, insumos, costos, flujo, ticket, dentistas };
}

function fdUpdateHenryPreview() {
  const data = fdCollectHenryData();
  const equilibrioPct = (data.pacientes / FD_PUNTO_EQUILIBRIO) * 100;

  fdSetText('prev-facturacion', formatoDolar(data.facturacion));
  fdSetText('prev-pacientes', fdEntero(data.pacientes));
  fdSetText('prev-ticket', formatoDolar(data.ticket));
  fdSetText('prev-flujo', formatoDolar(data.flujo));
  fdSetText('prev-equilibrio-texto', `${fdEntero(data.pacientes)} de ${FD_PUNTO_EQUILIBRIO} pacientes — punto de equilibrio`);
  fdSetText('prev-equilibrio-pct', fdPorcentaje(equilibrioPct));
  fdSetText('henry-guardar', `Guardar datos de ${data.mes}`);

  document.getElementById('prev-flujo')?.classList.toggle('fd-positive', data.flujo >= 0);
  document.getElementById('prev-flujo')?.classList.toggle('fd-negative', data.flujo < 0);
  const bar = document.getElementById('prev-equilibrio-bar');
  if (bar) {
    bar.style.width = Math.min(equilibrioPct, 100) + '%';
    bar.classList.toggle('success', data.pacientes >= FD_PUNTO_EQUILIBRIO);
    bar.classList.toggle('danger', data.pacientes < FD_PUNTO_EQUILIBRIO);
  }

  document.querySelectorAll('.fd-dentista-input').forEach(input => {
    const estado = fdEstadoDentista(parseFloat(input.value || 0) || 0);
    const badge = document.getElementById(input.dataset.badge);
    if (badge) {
      badge.className = `fd-status ${estado.css}`;
      badge.textContent = estado.label;
    }
  });

  const bajoMeta = data.dentistas.filter(d => d.facturacion < FD_META_DENTISTA);
  const brecha = bajoMeta.reduce((sum, d) => sum + Math.max(FD_META_DENTISTA - d.facturacion, 0), 0);
  const alertas = document.getElementById('prev-alertas');
  if (alertas) {
    alertas.innerHTML = `
      <div class="fd-alert ${data.flujo < 0 ? 'red' : 'green'}">Flujo ${data.flujo < 0 ? 'negativo' : 'positivo'} — ${formatoDolar(data.flujo)}</div>
      <div class="fd-alert ${data.pacientes < FD_PUNTO_EQUILIBRIO ? 'red' : 'green'}">${fdEntero(data.pacientes)} pacientes vs punto de equilibrio de ${FD_PUNTO_EQUILIBRIO}</div>
      <div class="fd-alert ${bajoMeta.length ? 'yellow' : 'green'}">${bajoMeta.length} dentistas bajo meta $2,500 — brecha total: ${formatoDolar(brecha)}</div>`;
  }

  const mejoras = [];
  if (data.facturacion > FD_MAYO_2026.facturacion_total) mejoras.push(`Facturacion +${formatoDolar(data.facturacion - FD_MAYO_2026.facturacion_total)}`);
  if (data.pacientes > FD_MAYO_2026.pacientes_atendidos) mejoras.push(`Pacientes +${fdEntero(data.pacientes - FD_MAYO_2026.pacientes_atendidos)}`);
  if (data.ticket > FD_MAYO_2026.ticket_promedio) mejoras.push(`Ticket promedio +${formatoDolar(data.ticket - FD_MAYO_2026.ticket_promedio)}`);
  if (data.flujo > FD_MAYO_2026.flujo_neto) mejoras.push(`Flujo neto mejora ${formatoDolar(data.flujo - FD_MAYO_2026.flujo_neto)}`);
  const mejorasBox = document.getElementById('prev-mejoras');
  if (mejorasBox) {
    mejorasBox.style.display = mejoras.length ? 'block' : 'none';
    mejorasBox.innerHTML = mejoras.length ? `<strong>Mejoras frente a Mayo 2026:</strong> ${mejoras.join(' · ')}` : '';
  }
}

async function fdGuardarHenry() {
  if (!fdSupabaseConfigurado()) {
    document.getElementById('henry-config-warning').style.display = 'block';
    alert('Primero revisa que la conexion Supabase del portal este disponible.');
    return;
  }

  const data = fdCollectHenryData();
  if (!data.mes) {
    alert('Escribe el mes activo antes de guardar.');
    return;
  }

  try {
    await seedMayo2026();
    const filtro = fdFiltroMes(data.mes);
    const existentes = await fdSupabaseGetRows(`dashboard_mensual${filtro}&select=id&limit=1`);
    if (Array.isArray(existentes) && existentes.length > 0) {
      const okOverwrite = confirm(`Ya existen datos para ${data.mes}. Deseas sobreescribirlos?`);
      if (!okOverwrite) return;
      await fdSupabaseDelete('dashboard_mensual', filtro);
      await fdSupabaseDelete('produccion_dentistas', filtro);
    }

    const mensual = {
      mes: data.mes,
      facturacion_total: data.facturacion,
      pacientes_atendidos: data.pacientes,
      ticket_promedio: data.ticket,
      flujo_neto: data.flujo,
      costos_fijos: data.costos,
      comisiones: data.comisiones,
      insumos: data.insumos,
      punto_equilibrio: FD_PUNTO_EQUILIBRIO
    };

    const okMensual = await fdSupabaseInsert('dashboard_mensual', mensual);
    const okDentistas = await fdSupabaseInsert('produccion_dentistas', data.dentistas);
    if (!okMensual || !okDentistas) throw new Error('Supabase rechazo el guardado');

    fdMesActivoSeleccionado = data.mes;
    alert(`Datos de ${data.mes} guardados correctamente.`);
    navigate('dashboard-financiero');
  } catch (err) {
    console.error(err);
    alert('No se pudieron guardar los datos. Revisa credenciales, tablas y permisos RLS en Supabase.');
  }
}

function initFormularioHenry() {
  const root = document.getElementById('formulario-henry-root');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';
  document.getElementById('henry-config-warning').style.display = fdSupabaseConfigurado() ? 'none' : 'block';
  fdSetMesControls('henry', fdMesActivoSeleccionado);
  root.querySelectorAll('input, select').forEach(input => input.addEventListener('input', fdUpdateHenryPreview));
  root.querySelectorAll('select').forEach(input => input.addEventListener('change', fdUpdateHenryPreview));
  document.getElementById('henry-guardar')?.addEventListener('click', fdGuardarHenry);
  fdUpdateHenryPreview();
}
