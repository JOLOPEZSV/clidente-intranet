/* ═══════════════════════════════════════════════════════════
   CLIDENTE · Portal TDG MBA · ISEADE FEPADE  –  app.js
   ═══════════════════════════════════════════════════════════ */

/* ── SECTION RENDERERS ─────────────────────────────────────── */

function renderCartelera() {
  return `
  <h1 class="section-title">Cartelera</h1>
  <div class="cartelera-grid">

    <div class="bulletin-card">
      <div class="bulletin-card-header"><i class="fas fa-bullhorn"></i> Aviso del Equipo</div>
      <div class="bulletin-card-body">
        <p>📌 <strong>Próxima entrega:</strong> Borrador del Capítulo II – Marco Teórico.<br>
        Fecha límite acordada con el tutor: <strong>30 de mayo de 2025</strong>.<br>
        Recuerden subir sus secciones asignadas a la carpeta compartida.</p>
      </div>
    </div>

    <div class="bulletin-card">
      <div class="bulletin-card-header"><i class="fas fa-calendar-check"></i> Próximas Actividades</div>
      <div class="bulletin-card-body">
        <p>📅 <strong>Visita 03 a CLIDENTE</strong> – pendiente de confirmar fecha.<br>
        📅 <strong>Reunión con Tutor #3</strong> – junio 2025.<br>
        📅 <strong>Entrega Capítulo III</strong> – julio 2025.</p>
      </div>
    </div>

    <div class="bulletin-card">
      <div class="bulletin-card-header"><i class="fas fa-chart-line"></i> Avance del TDG</div>
      <div class="bulletin-card-body">
        <ul class="progress-list">
          ${[
            ['Propuesta de Investigación', 100],
            ['Marco Teórico', 75],
            ['Marco Metodológico', 60],
            ['Diagnóstico Organizacional', 50],
            ['Análisis de Resultados', 15],
            ['Propuesta de Mejora', 0],
          ].map(([label, pct]) => `
          <li>
            <div class="progress-label"><span>${label}</span><span class="progress-pct">${pct}%</span></div>
            <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
          </li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="bulletin-card">
      <div class="bulletin-card-header"><i class="fas fa-info-circle"></i> Sobre este Portal</div>
      <div class="bulletin-card-body">
        <p>Bienvenidos al portal interno del <strong>Trabajo de Graduación MBA</strong> en ISEADE FEPADE.
        Aquí encontrarán de forma centralizada: transcripciones de visitas, actas de reunión con el tutor,
        borradores del diagnóstico y toda la documentación del proyecto <strong>CLIDENTE</strong>.</p>
      </div>
    </div>

  </div>`;
}

function renderSobreProyecto() {
  return `
  <h1 class="section-title">Sobre el Proyecto</h1>
  <div class="info-grid">
    <div class="info-box">
      <div class="info-box-icon blue"><i class="fas fa-university" style="color:var(--blue)"></i></div>
      <h4>Institución</h4>
      <p>ISEADE FEPADE – MBA en Administración de Empresas, promoción 2024–2025.</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon green"><i class="fas fa-building" style="color:#166534"></i></div>
      <h4>Empresa Objeto de Estudio</h4>
      <p><strong>CLIDENTE</strong> – Clínica dental objeto del diagnóstico organizacional.</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon gold"><i class="fas fa-graduation-cap" style="color:#854d0e"></i></div>
      <h4>Tipo de Trabajo</h4>
      <p>Diagnóstico Organizacional con propuesta de mejora. Investigación cualitativa con enfoque mixto.</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon blue"><i class="fas fa-bullseye" style="color:var(--blue)"></i></div>
      <h4>Objetivo General</h4>
      <p>Elaborar un diagnóstico organizacional de CLIDENTE que permita identificar oportunidades de mejora en su gestión administrativa y operativa.</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon green"><i class="fas fa-search" style="color:#166534"></i></div>
      <h4>Metodología</h4>
      <p>Investigación cualitativa. Técnicas: entrevista a profundidad, observación directa y análisis documental.</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon gold"><i class="fas fa-user-tie" style="color:#854d0e"></i></div>
      <h4>Tutor Académico</h4>
      <p>Lic. Roberto Arturo Castro Castañeda – ISEADE FEPADE.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-title"><i class="fas fa-file-alt" style="margin-right:.5rem"></i>Propuesta de Investigación – Aprobada</div>
    <p class="card-subtitle">Documento oficial aprobado por ISEADE FEPADE. Contiene título, justificación, objetivos y alcance del TDG.</p>
    <div class="resource-buttons">
      <a href="docs/propuesta-investigacion.pdf" target="_blank" class="btn-resource"><i class="fas fa-file-pdf"></i> Ver Propuesta</a>
    </div>
  </div>`;
}

function renderVisitas() {
  const visitas = [
    {
      n: 1, title: 'Visita 01 – Presentación e inducción',
      date: '15 de marzo de 2025', duration: '3 horas',
      attendees: 'Gerente General, Coordinador de Operaciones, Equipo TDG',
      summary: 'Primera visita formal a CLIDENTE. Presentación del equipo al personal directivo, recorrido por instalaciones y entrevista inicial con la Gerencia General.',
      resources: [
        { label: 'Transcripción', icon: 'fa-file-lines', href: 'docs/transcripcion-visita-01.pdf' },
        { label: 'Resumen Ejecutivo', icon: 'fa-file-alt', href: 'docs/resumen-visita-01.pdf' },
        { label: 'Notas de Campo', icon: 'fa-sticky-note', href: 'docs/notas-visita-01.pdf' },
      ]
    },
    {
      n: 2, title: 'Visita 02 – Área operativa y RRHH',
      date: '10 de abril de 2025', duration: '4 horas',
      attendees: 'Jefe de RRHH, 5 empleados, Equipo TDG',
      summary: 'Enfoque en procesos operativos y gestión del talento humano. Entrevistas estructuradas a empleados de línea y recopilación de documentos internos.',
      resources: [
        { label: 'Transcripción', icon: 'fa-file-lines', href: 'docs/transcripcion-visita-02.pdf' },
        { label: 'Resumen Ejecutivo', icon: 'fa-file-alt', href: 'docs/resumen-visita-02.pdf' },
        { label: 'Fotos de Visita', icon: 'fa-images', href: 'docs/fotos-visita-02.pdf', cls: 'btn-img' },
      ]
    },
  ];

  return `
  <h1 class="section-title">Visitas a CLIDENTE</h1>
  <div class="timeline">
    ${visitas.map(v => `
    <div class="tl-item">
      <div class="tl-header">
        <span class="tl-title">Visita #${v.n} – ${v.title.split('–')[1].trim()}</span>
        <span class="tl-date">${v.date}</span>
      </div>
      <p class="tl-summary">${v.summary}</p>
      <p class="tl-meta">
        <span><i class="fas fa-clock"></i>${v.duration}</span>
        <span><i class="fas fa-users"></i>${v.attendees}</span>
      </p>
      <div class="resource-buttons">
        ${v.resources.map(r => `
        <a href="${r.href}" target="_blank" class="btn-resource ${r.cls||''}">
          <i class="fas ${r.icon}"></i> ${r.label}
        </a>`).join('')}
      </div>
    </div>`).join('')}
  </div>
  <div class="card" style="border:2px dashed var(--border); box-shadow:none; text-align:center; color:var(--text-muted); font-size:.9rem; padding:2rem;">
    <i class="fas fa-plus-circle" style="font-size:1.5rem; color:var(--blue); margin-bottom:.5rem; display:block;"></i>
    Agrega nuevas visitas editando el arreglo <code>visitas</code> en <strong>app.js</strong>
  </div>`;
}

function renderReuniones() {
  const meetings = [
    {
      n: 1, title: 'Sesión de Arranque',
      date: '5 de febrero de 2025',
      tutor: 'Lic. Roberto Arturo Castro Castañeda',
      topics: ['Definición del tema y empresa objeto de estudio', 'Alcance y delimitación del TDG', 'Metodología general recomendada', 'Cronograma de entregas y evaluaciones'],
      resources: [
        { label: 'Acta de Reunión', icon: 'fa-file-lines', href: 'docs/acta-reunion-01.pdf' },
        { label: 'Compromisos', icon: 'fa-list-check', href: 'docs/compromisos-01.pdf' },
      ]
    },
    {
      n: 2, title: 'Revisión Marco Teórico',
      date: '20 de marzo de 2025',
      tutor: 'Lic. Roberto Arturo Castro Castañeda',
      topics: ['Retroalimentación sobre fuentes bibliográficas', 'Ajuste al planteamiento del problema', 'Observaciones al marco referencial', 'Próximos pasos: recolección de datos'],
      resources: [
        { label: 'Acta de Reunión', icon: 'fa-file-lines', href: 'docs/acta-reunion-02.pdf' },
      ]
    },
  ];

  return `
  <h1 class="section-title">Reuniones con el Tutor</h1>
  <div class="timeline">
    ${meetings.map(m => `
    <div class="tl-item">
      <div class="tl-header">
        <span class="tl-title">Reunión #${m.n} – ${m.title}</span>
        <span class="tl-date">${m.date}</span>
      </div>
      <p class="tl-meta"><span><i class="fas fa-user-tie"></i>Tutor: ${m.tutor}</span></p>
      <p style="font-size:.85rem;font-weight:600;color:var(--text);margin:.5rem 0 .4rem">Temas tratados:</p>
      <ul style="padding-left:1.25rem; margin-bottom:1rem;">
        ${m.topics.map(t => `<li style="font-size:.85rem;color:var(--text-muted);padding:.2rem 0">${t}</li>`).join('')}
      </ul>
      <div class="resource-buttons">
        ${m.resources.map(r => `
        <a href="${r.href}" target="_blank" class="btn-resource">
          <i class="fas ${r.icon}"></i> ${r.label}
        </a>`).join('')}
      </div>
    </div>`).join('')}
  </div>`;
}

function renderDiagnostico() {
  return `
  <h1 class="section-title">Diagnóstico Organizacional</h1>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-file-word" style="margin-right:.5rem"></i>Borrador – Diagnóstico v1</div>
    <p class="resource-group-subtitle">Primer borrador del diagnóstico organizacional de CLIDENTE. Incluye análisis FODA, estructura organizacional y hallazgos preliminares de las visitas.</p>
    <div class="resource-buttons">
      <a href="docs/diagnostico-borrador-v1.pdf" target="_blank" class="btn-resource"><i class="fas fa-file-pdf"></i> Ver Borrador PDF</a>
      <a href="docs/diagnostico-borrador-v1.docx" target="_blank" class="btn-resource"><i class="fas fa-file-word"></i> Ver Borrador DOCX</a>
    </div>
  </div>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-sitemap" style="margin-right:.5rem"></i>Análisis FODA</div>
    <p class="resource-group-subtitle">Matriz de Fortalezas, Oportunidades, Debilidades y Amenazas elaborada a partir de las entrevistas y observación directa.</p>
    <div class="resource-buttons">
      <a href="docs/foda-clidente.pdf" target="_blank" class="btn-resource"><i class="fas fa-table"></i> Ver Matriz FODA</a>
      <a href="docs/foda-clidente.xlsx" target="_blank" class="btn-resource"><i class="fas fa-file-excel"></i> Excel FODA</a>
    </div>
  </div>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-network-wired" style="margin-right:.5rem"></i>Organigrama</div>
    <p class="resource-group-subtitle">Estructura organizacional actual de CLIDENTE elaborada durante la primera visita.</p>
    <div class="resource-buttons">
      <a href="docs/organigrama-clidente.pdf" target="_blank" class="btn-resource"><i class="fas fa-project-diagram"></i> Ver Organigrama</a>
    </div>
  </div>`;
}

function renderMarcoTeorico() {
  return `
  <h1 class="section-title">Marco Teórico</h1>

  <div class="tabs">
    <button class="tab-btn active" data-tab="mt1">Gestión Organizacional</button>
    <button class="tab-btn" data-tab="mt2">Diagnóstico Empresarial</button>
    <button class="tab-btn" data-tab="mt3">Bibliografía</button>
  </div>

  <div id="mt1" class="tab-panel active">
    <div class="card">
      <div class="card-title">Teorías de Gestión Organizacional</div>
      <p class="resource-group-subtitle">Fundamentos teóricos sobre estructura, cultura y gestión organizacional aplicados al diagnóstico de CLIDENTE.</p>
      <div class="resource-buttons">
        <a href="docs/marco-gestion-organizacional.pdf" target="_blank" class="btn-resource"><i class="fas fa-file-pdf"></i> Marco teórico v1</a>
        <a href="docs/notas-gestion.pdf" target="_blank" class="btn-resource"><i class="fas fa-sticky-note"></i> Notas de lectura</a>
      </div>
    </div>
  </div>

  <div id="mt2" class="tab-panel">
    <div class="card">
      <div class="card-title">Metodologías de Diagnóstico Empresarial</div>
      <p class="resource-group-subtitle">Revisión de metodologías aplicadas al diagnóstico organizacional: McKinsey 7S, análisis de cadena de valor, FODA dinámico.</p>
      <div class="resource-buttons">
        <a href="docs/marco-diagnostico.pdf" target="_blank" class="btn-resource"><i class="fas fa-file-pdf"></i> Revisión metodológica</a>
      </div>
    </div>
  </div>

  <div id="mt3" class="tab-panel">
    <div class="card">
      <div class="card-title">Referencias Bibliográficas</div>
      <p class="resource-group-subtitle">Listado de fuentes APA utilizadas en el Trabajo de Graduación.</p>
      <div class="resource-buttons">
        <a href="docs/bibliografia-apa.pdf" target="_blank" class="btn-resource"><i class="fas fa-book"></i> Bibliografía APA</a>
        <a href="docs/bibliografia.bib" target="_blank" class="btn-resource"><i class="fas fa-code"></i> Archivo .bib</a>
      </div>
    </div>
  </div>`;
}

function renderMetodologia() {
  return `
  <h1 class="section-title">Marco Metodológico</h1>
  <div class="card">
    <div class="card-title">Enfoque y Diseño de Investigación</div>
    <p class="resource-group-subtitle">Investigación cualitativa con elementos cuantitativos. Diseño descriptivo-exploratorio basado en estudio de caso único.</p>
    <div class="resource-buttons">
      <a href="docs/marco-metodologico-v1.pdf" target="_blank" class="btn-resource"><i class="fas fa-file-pdf"></i> Marco Metodológico v1</a>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Instrumentos de Recolección</div>
    <p class="resource-group-subtitle">Guías de entrevista, fichas de observación y listas de cotejo utilizadas en las visitas a CLIDENTE.</p>
    <div class="resource-buttons">
      <a href="docs/guia-entrevista.pdf" target="_blank" class="btn-resource"><i class="fas fa-clipboard-list"></i> Guía de Entrevista</a>
      <a href="docs/ficha-observacion.pdf" target="_blank" class="btn-resource"><i class="fas fa-eye"></i> Ficha de Observación</a>
      <a href="docs/lista-cotejo.pdf" target="_blank" class="btn-resource"><i class="fas fa-list-check"></i> Lista de Cotejo</a>
    </div>
  </div>
  <div class="card">
    <div class="card-title">Población y Muestra</div>
    <p class="resource-group-subtitle">Definición de la unidad de análisis, criterios de selección de informantes clave y justificación de la muestra.</p>
    <div class="resource-buttons">
      <a href="docs/poblacion-muestra.pdf" target="_blank" class="btn-resource"><i class="fas fa-users"></i> Población y Muestra</a>
    </div>
  </div>`;
}

function renderEquipo() {
  const team = [
    { name: 'Cecilia Beatriz Chicas de Escalante', initials: 'CC', role: 'Ing. Industrial · Walmart', color: '#1a56a4' },
    { name: 'Ricardo Alberto Palacios Valladares', initials: 'RP', role: 'Arq. de Interiores · Alcaldía de San Salvador', color: '#0e7490' },
    { name: 'Elías José Núñez Menjívar', initials: 'EN', role: 'Ing. Industrial · Corte Suprema de Justicia', color: '#7c3aed' },
    { name: 'Jaime Omar López Monge', initials: 'JL', role: 'Adm. de Empresas · StarDent', color: '#b45309' },
  ];
  return `
  <h1 class="section-title">Equipo de Investigación</h1>
  <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:.9rem">
    Equipo Consultor MAE LVIII – ISEADE FEPADE
  </p>
  <div class="team-grid">
    ${team.map(m => `
    <div class="team-card">
      <div class="team-avatar" style="background:${m.color}">${m.initials}</div>
      <div class="team-name">${m.name}</div>
      <div class="team-role">${m.role}</div>
    </div>`).join('')}
  </div>
  <div class="card" style="margin-top:1.5rem">
    <div class="card-title"><i class="fas fa-user-graduate" style="margin-right:.5rem"></i>Tutor Académico</div>
    <p style="font-size:.9rem;color:var(--text-muted)">Lic. Roberto Arturo Castro Castañeda – ISEADE FEPADE</p>
  </div>`;
}

function renderCronograma() {
  const rows = [
    ['Enero 2025',    'Definición de tema y propuesta',          'done'],
    ['Febrero 2025',  'Aprobación de propuesta / Reunión #1',    'done'],
    ['Marzo 2025',    'Marco Teórico – Visita #1 a CLIDENTE',    'done'],
    ['Abril 2025',    'Marco Metodológico – Visita #2',          'done'],
    ['Mayo 2025',     'Diagnóstico – Capítulo II',               'wip'],
    ['Junio 2025',    'Análisis de resultados – Visita #3',      'pending'],
    ['Julio 2025',    'Propuesta de mejora',                     'pending'],
    ['Agosto 2025',   'Informe final y revisión',                'pending'],
    ['Septiembre 2025','Defensa del TDG',                        'pending'],
  ];
  const labels = { done:'Completado', wip:'En Progreso', pending:'Pendiente' };
  return `
  <h1 class="section-title">Cronograma del TDG</h1>
  <div class="card" style="padding:0;overflow:hidden">
    <table class="cronograma-table">
      <thead>
        <tr>
          <th>Período</th>
          <th>Actividad Principal</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(([period, activity, status]) => `
        <tr>
          <td>${period}</td>
          <td>${activity}</td>
          <td><span class="status-badge status-${status}">${labels[status]}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ── SECTION MAP ───────────────────────────────────────────── */
const SECTIONS = {
  'cartelera':      { label: 'Cartelera',            render: renderCartelera },
  'sobre-proyecto': { label: 'Sobre el Proyecto',    render: renderSobreProyecto },
  'visitas':        { label: 'Visitas a CLIDENTE',   render: renderVisitas },
  'reuniones':      { label: 'Reuniones con Tutor',  render: renderReuniones },
  'diagnostico':    { label: 'Diagnóstico',          render: renderDiagnostico },
  'marco-teorico':  { label: 'Marco Teórico',        render: renderMarcoTeorico },
  'metodologia':    { label: 'Metodología',          render: renderMetodologia },
  'equipo':         { label: 'Equipo',               render: renderEquipo },
  'cronograma':     { label: 'Cronograma',           render: renderCronograma },
};

/* ── NAVIGATION ────────────────────────────────────────────── */
function navigate(sectionId) {
  const section = SECTIONS[sectionId];
  if (!section) return;

  // Render content
  const area = document.getElementById('contentArea');
  area.innerHTML = `<div class="fade-in">${section.render()}</div>`;

  // Update breadcrumb
  document.getElementById('breadcrumb').textContent = `Portal › ${section.label}`;

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  // Init tabs if present
  initTabs();

  // Animate progress bars
  requestAnimationFrame(() => {
    document.querySelectorAll('.progress-bar-fill[style]').forEach(el => {
      const w = el.style.width;
      el.style.width = '0';
      requestAnimationFrame(() => { el.style.width = w; });
    });
  });

  // Scroll top
  document.querySelector('.content-area').scrollTop = 0;
}

/* ── TABS ──────────────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      const container = btn.closest('.content-area') || document;
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(tabId);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Welcome modal
  const backdrop = document.getElementById('welcomeBackdrop');
  document.getElementById('btnEnter').addEventListener('click', () => {
    backdrop.classList.add('hidden');
    navigate('cartelera');
  });

  // Sidebar navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.section));
  });

  // Pre-render cartelera behind modal
  navigate('cartelera');
});
