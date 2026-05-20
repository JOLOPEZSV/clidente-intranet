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
        <p>📌 <strong>Entrega final ISEADE:</strong> 1 de junio de 2026 (físico anillado + digital a vbeltran@iseade.edu.sv).<br>
        📌 <strong>Presentación al tutor:</strong> martes 26 de mayo de 2026 – Lic. Roberto Castro Castañeda.<br>
        Cada consultor preparará 2–3 diapositivas con hallazgos por área.</p>
      </div>
    </div>

    <div class="bulletin-card">
      <div class="bulletin-card-header"><i class="fas fa-calendar-check"></i> Próximas Actividades</div>
      <div class="bulletin-card-body">
        <p>📅 <strong>Visitas de Campo 2 y 3</strong> – semana del 19 al 23 de mayo de 2026.<br>
        📅 <strong>Reunión con Tutor #2</strong> – 26 de mayo de 2026.<br>
        📅 <strong>Visita de cierre de brechas</strong> – semana del 26 al 30 de mayo.<br>
        📅 <strong>Entrega ISEADE</strong> – 1 de junio de 2026.</p>
      </div>
    </div>

    <div class="bulletin-card">
      <div class="bulletin-card-header"><i class="fas fa-chart-line"></i> Avance del Diagnóstico</div>
      <div class="bulletin-card-body">
        <ul class="progress-list">
          ${[
            ['Antecedentes e Identificación', 100],
            ['Filosofía Corporativa', 100],
            ['Estructura Organizacional', 70],
            ['Descripción del Funcionamiento', 60],
            ['Mapa de Procesos', 50],
            ['Diagnóstico Situación Actual (FODA/Porter)', 35],
            ['Orientación de la Consultoría', 20],
            ['Conclusiones y Recomendaciones', 10],
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
        <p>Portal interno de la consultoría empresarial <strong>MAE LVIII</strong> – ISEADE FEPADE.<br>
        Empresa: <strong>Clínica Dental Clidente</strong> · Santa Tecla, La Libertad.<br>
        Propietaria: <strong>Dra. Olga Dinora Vigil Romero</strong> · Fundada: noviembre 1998.<br>
        Contacto en clínica: <strong>Tec. Henry Corcio</strong> – Gerente Administrativo.</p>
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
      <p>ISEADE BUSINESS SCHOOL | FEPADE – Maestría en Administración de Empresas, Generación LVIII (2026).</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon green"><i class="fas fa-tooth" style="color:#166534"></i></div>
      <h4>Empresa Objeto de Estudio</h4>
      <p><strong>Clínica Dental Clidente</strong> – fundada en noviembre de 1998 por la Dra. Olga Dinora Vigil Romero.<br>
      2ª Calle Pte. y 2ª Av. Sur, Local 21, 2° Nivel, Santa Tecla, La Libertad.<br>
      Eslogan: <em>"Con Clidente siempre sonriente"</em></p>
    </div>
    <div class="info-box">
      <div class="info-box-icon gold"><i class="fas fa-graduation-cap" style="color:#854d0e"></i></div>
      <h4>Tipo de Trabajo</h4>
      <p>Consultoría empresarial gratuita + Diagnóstico Organizacional Integral con propuesta de mejora. Tres unidades de negocio: clínica dental, depósito dental y alquiler de bodegas.</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon blue"><i class="fas fa-bullseye" style="color:var(--blue)"></i></div>
      <h4>Misión de Clidente</h4>
      <p>"Brindar un servicio integral de salud dental a través de servicios odontológicos de alta calidad, ética y vocación, ofreciendo precios competitivos y superando la expectativa de nuestros clientes."</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon green"><i class="fas fa-eye" style="color:#166534"></i></div>
      <h4>Visión de Clidente</h4>
      <p>"Ser una empresa innovadora, sólidamente constituida y reconocida por su calidad de servicio, creciendo a nivel nacional con la mejor tecnología e innovando continuamente en cuidado de salud bucal."</p>
    </div>
    <div class="info-box">
      <div class="info-box-icon gold"><i class="fas fa-user-tie" style="color:#854d0e"></i></div>
      <h4>Tutor Académico</h4>
      <p>Lic. Roberto Arturo Castro Castañeda – ISEADE FEPADE.<br>
      Presentación al tutor: <strong>26 de mayo de 2026</strong>.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-title"><i class="fas fa-file-alt" style="margin-right:.5rem"></i>Asignación Oficial de Consultoría – ISEADE</div>
    <p class="card-subtitle">Carta oficial de ISEADE FEPADE asignando al Equipo MAE LVIII a la Clínica Dental Clidente. Firmada el 25 de abril de 2026 por Vanessa Beltrán (ISEADE).</p>
    <div class="resource-buttons">
      <a href="ASIGNACION DE CONSULTORIA.pdf" target="_blank" class="btn-resource"><i class="fas fa-file-pdf"></i> Ver Asignación</a>
      <a href="SOLICITUD CLIDENTE.pdf" target="_blank" class="btn-resource"><i class="fas fa-file-pdf"></i> Ver Solicitud</a>
    </div>
  </div>`;
}

function renderVisitas() {
  const visitasCampo = [
    {
      n: 1,
      title: 'Presentación inicial y firma de confidencialidad',
      date: '30 de abril de 2026', duration: '90 minutos',
      attendees: 'Dra. Olga Vigil, Tec. Henry Corcio (Gte. Adm.), Jaime López, Cecilia Chicas',
      summary: 'Primera visita oficial a Clínica Dental Clidente. Presentación del equipo a la propietaria Dra. Vigil y firma de cartas de confidencialidad. Reconocimiento de instalaciones (4 locales integrados, 8 sillas de atención). Entrega del cuestionario de diagnóstico ambiental (escala 0–4) para que la Dra. lo complete. Hora de llegada: 5:15 PM · 2ª Calle Pte. y 2ª Av. Sur, Local 21, 2° Nivel, Santa Tecla.',
      estado: 'done',
      resources: [
        { label: 'Agenda Visita #1',  icon: 'fa-calendar-day', href: 'https://drive.google.com/file/d/1z3L2xGB8PeOP5bsfk_8WNV7tRRPO4LEz/view?usp=sharing' },
        { label: 'Resumen Ejecutivo', icon: 'fa-file-alt',     href: 'https://drive.google.com/file/d/1Bxv_TgA_ZtLPcue5Bo4yK4-CIvYiX2kD/view?usp=sharing' },
        { label: 'Plan de Visitas',   icon: 'fa-file-lines',   href: 'Plan_Visitas_Campo_Clidente_2026.pdf' },
        { label: 'Roles del Equipo',  icon: 'fa-users',        href: 'Roles_Equipo_Consultor_Clidente.pdf' },
      ]
    },
    {
      n: 2,
      title: 'Organización y Área Comercial',
      date: '16–17 de mayo de 2026 (Pareja B)', duration: '4 horas',
      attendees: 'Jaime Omar López + Cecilia Beatriz Chicas · Contacto: Henry Corcio',
      summary: 'Pareja B (Organización y Área Comercial). Objetivos: validar organigrama vigente e identificar vacante de Dirección Clínica; entrevistar a Tatiana/Diego (Mercadeo) sobre redes sociales; diagnosticar sistema CRM/base de pacientes; verificar escala salarial y comisiones; obtener descriptores de puesto del manual (carpeta negra). Solicitar copia digital del organigrama a Henry.',
      estado: 'done',
      resources: [
        { label: 'Plan de Visitas', icon: 'fa-file-lines', href: 'Plan_Visitas_Campo_Clidente_2026.pdf' },
        { label: 'Roles del Equipo', icon: 'fa-users', href: 'Roles_Equipo_Consultor_Clidente.pdf' },
      ]
    },
    {
      n: 3,
      title: 'Operaciones y Finanzas',
      date: '19–23 de mayo de 2026 (Pareja A)', duration: '4 horas',
      attendees: 'Ricardo Palacios + Elías Núñez · Contacto: Henry Corcio',
      summary: 'Pareja A (Finanzas e Inventarios). Objetivos: levantar inventario físico de insumos (codificación y sistema de requisición); mapear journey del paciente desde ingreso hasta cobro; evaluar protocolos de inocuidad y esterilización; recopilar KPIs de contabilidad y estado de P&G por unidad de negocio (clínica, depósito, bodegas); aplicar encuesta de Diagnóstico de Desempeño Ambiental.',
      estado: 'done',
      resources: [
        { label: 'Plan de Visitas', icon: 'fa-file-lines', href: 'Plan_Visitas_Campo_Clidente_2026.pdf' },
      ]
    },
    {
      n: 4,
      title: 'Observación sin previo aviso (Operación Real)',
      date: 'Semana del 26–30 de mayo de 2026', duration: '2–3 horas',
      attendees: 'Cecilia Chicas + Ricardo Palacios',
      summary: 'Visita sin previo aviso, conforme al acuerdo con la propietaria, para observar la operación en condiciones reales. Objetivo: conteo real de pacientes y ticket promedio por procedimiento, análisis de métricas de redes sociales, y cierre de brechas de información pendiente.',
      estado: 'pending',
      resources: []
    },
    {
      n: 5,
      title: 'Por programar',
      date: 'Por definir', duration: 'Por definir',
      attendees: 'Por definir',
      summary: 'Visita de campo pendiente de programación. Actualiza los detalles conforme se coordine con la empresa.',
      estado: 'pending',
      resources: []
    },
  ];

  const estadoColor = { done: '#166534', wip: '#1a56a4', pending: '#6b7280' };
  const estadoBg   = { done: '#dcfce7',  wip: '#dbeafe',  pending: '#f3f4f6' };
  const estadoLabel= { done: 'Realizada', wip: 'En Progreso', pending: 'Pendiente' };

  return `
  <h1 class="section-title">Visitas a CLIDENTE</h1>

  <!-- SUBSECCIÓN: VISITAS DE CAMPO -->
  <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem;margin-top:.5rem">
    <div style="width:36px;height:36px;border-radius:50%;background:#1a56a4;display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <i class="fas fa-map-marker-alt" style="color:white;font-size:.9rem"></i>
    </div>
    <h2 style="font-size:1.2rem;font-weight:700;color:var(--text);margin:0">Visitas de Campo</h2>
    <span style="background:#dbeafe;color:#1a56a4;font-size:.75rem;font-weight:600;padding:.2rem .7rem;border-radius:50px">${visitasCampo.length} visitas</span>
  </div>

  <div class="timeline">
    ${visitasCampo.map(v => `
    <div class="tl-item">
      <div class="tl-header">
        <span class="tl-title">Visita de Campo #${v.n} – ${v.title}</span>
        <div style="display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;justify-content:flex-end">
          <span style="background:${estadoBg[v.estado]};color:${estadoColor[v.estado]};font-size:.75rem;font-weight:600;padding:.2rem .65rem;border-radius:50px;white-space:nowrap">${estadoLabel[v.estado]}</span>
          <span class="tl-date">${v.date}</span>
        </div>
      </div>
      <p class="tl-summary">${v.summary}</p>
      <p class="tl-meta">
        <span><i class="fas fa-clock"></i>${v.duration}</span>
        <span><i class="fas fa-users"></i>${v.attendees}</span>
      </p>
      <div class="resource-buttons">
        ${v.resources.map(r => `
        <a href="${r.href}" target="_blank" class="btn-resource">
          <i class="fas ${r.icon}"></i> ${r.label}
        </a>`).join('')}
      </div>
    </div>`).join('')}
  </div>`;
}

function renderReuniones() {
  const meetings = [
    {
      n: 1, title: 'Reunión de Coordinación con el Tutor',
      date: '12 de mayo de 2026',
      tutor: 'Lic. Roberto Arturo Castro Castañeda',
      topics: [
        'Asignación de roles por área de especialización a cada consultor',
        'Cecilia: área comercial, CRM y marketing (recuperación de +1,300 clientes perdidos)',
        'Ricardo: área financiera, línea base y estado de P&G por unidad de negocio',
        'Elías: operaciones, inventarios, journey del paciente y diagnóstico ambiental',
        'Jaime: liderazgo, estructura organizacional, gobernanza y modelo de continuidad',
        'Designación de Jaime como líder único para centralizar comunicación con tutor',
        'Opciones CRM gratuitas: HubSpot, Bitrix (a customizar según necesidades)',
        'Metodología: trabajo en parejas (Pareja A: Ricardo + Elías · Pareja B: Jaime + Cecilia)',
      ],
      resources: [
        { label: 'Resumen Reunión', icon: 'fa-file-lines', href: '05-12 Prometa Reunión de Coordinación con el Tutor-Adaptive Summary.pdf' },
        { label: 'Roles del Equipo', icon: 'fa-list-check', href: 'Roles_Equipo_Consultor_Clidente.pdf' },
      ]
    },
    {
      n: 2, title: 'Presentación de Avances al Tutor',
      date: '26 de mayo de 2026',
      tutor: 'Lic. Roberto Arturo Castro Castañeda',
      topics: [
        'Cada consultor presenta 2–3 diapositivas con hallazgos de su área',
        'Avances: estructura organizacional (Jaime), diagnóstico CRM/comercial (Cecilia)',
        'Avances: inventarios y procesos (Elías), línea base financiera (Ricardo)',
        'Revisión del Informe de Diagnóstico borrador para ISEADE',
        'Firma de Carta de Aprobación del Diagnóstico por el tutor',
      ],
      resources: []
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
    <div class="card-title"><i class="fas fa-file-pdf" style="margin-right:.5rem"></i>Informe de Diagnóstico V1 – Clínica Dental Clidente</div>
    <p class="resource-group-subtitle">Borrador del informe oficial para ISEADE FEPADE. Incluye: Antecedentes, Filosofía Corporativa, Estructura Organizacional, Descripción del Funcionamiento, Mapa de Procesos, Diagnóstico FODA, Análisis 5 Fuerzas de Porter, Factores Críticos de Éxito, Orientación de la Consultoría y Conclusiones. <strong>Fecha límite de entrega: 1 de junio de 2026.</strong></p>
    <div class="resource-buttons">
      <a href="Diagnostico_Clidente_2026_V1.pdf" target="_blank" class="btn-resource"><i class="fas fa-file-pdf"></i> Ver Diagnóstico V1</a>
    </div>
  </div>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-sitemap" style="margin-right:.5rem"></i>Filosofía Corporativa de Clidente</div>
    <p class="resource-group-subtitle">
      <strong>Misión:</strong> Brindar servicios odontológicos de alta calidad, ética y vocación con precios competitivos.<br>
      <strong>Visión:</strong> Ser una empresa innovadora reconocida por su calidad, creciendo a nivel nacional.<br>
      <strong>Eslogan:</strong> "Con Clidente siempre sonriente"<br>
      <strong>Valores inferidos:</strong> Ética profesional, vocación de servicio, honestidad y responsabilidad.<br>
      <strong>Norma explícita:</strong> Tres conductas de desvinculación inmediata: mentir, ser mañoso, ser malcriado.
    </p>
  </div>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-exclamation-triangle" style="margin-right:.5rem;color:#dc2626"></i>Hallazgos Críticos Identificados</div>
    <p class="resource-group-subtitle">
      🔴 Pérdida de más de <strong>1,300 clientes</strong> al cierre de abril de 2026.<br>
      🔴 <strong>Ausencia de sistema CRM</strong> – sin seguimiento estructurado de pacientes activos/inactivos.<br>
      🔴 <strong>Falta de profesionalización empresarial</strong> – modelo familiar sin controles formales.<br>
      🔴 <strong>Desconocimiento de indicadores financieros</strong> por unidad de negocio.<br>
      🔴 <strong>Modelo reactivo</strong> de atención (no preventivo).<br>
      🟡 Tres unidades de negocio: clínica dental, depósito dental y alquiler de bodegas (sin estados financieros separados).
    </p>
  </div>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-network-wired" style="margin-right:.5rem"></i>Estructura Organizacional</div>
    <p class="resource-group-subtitle">Clínica con 8 sillas de atención, 10 horas diarias de operación, 24 personas en planilla ISSS (incluye otras empresas de la propietaria). Vacante identificada: <strong>Dirección Clínica</strong>. Contacto operativo: Tec. Henry Corcio – Gerente Administrativo.</p>
    <div class="resource-buttons">
      <a href="Roles_Equipo_Consultor_Clidente.pdf" target="_blank" class="btn-resource"><i class="fas fa-users"></i> Roles del Equipo</a>
      <a href="Plan_Visitas_Campo_Clidente_2026.pdf" target="_blank" class="btn-resource"><i class="fas fa-map"></i> Plan de Visitas</a>
    </div>
  </div>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-list-check" style="margin-right:.5rem;color:#1a56a4"></i>Guía del Informe Final — Estructura Oficial ISEADE</div>
    <p class="resource-group-subtitle" style="margin-bottom:1.25rem">Estructura requerida por ISEADE FEPADE para el informe final de consultoría. Marca cada sección conforme se vaya completando. <strong>Fecha límite: 31 de agosto de 2026.</strong></p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem .5rem">
      ${[
        ['Portada',                                                              false],
        ['Índice',                                                               false],
        ['Introducción',                                                         false],
        ['Resumen Ejecutivo',                                                    false],
        ['Elementos relevantes del Diagnóstico y objetivos del trabajo',         false],
        ['Metodología a utilizar',                                               false],
        ['Actividades realizadas (con enfoque gerencial)',                        false],
        ['Contenido de los productos entregados de la consultoría',              false],
        ['Conclusiones',                                                         false],
        ['Recomendaciones (incluir recomendación ambiental del diagnóstico)',    false],
        ['Anexos',                                                               false],
      ].map(([item], i) => `
      <label style="display:flex;align-items:flex-start;gap:.6rem;padding:.6rem .75rem;border-radius:8px;border:1px solid var(--border);background:#f8fafc;cursor:pointer;font-size:.85rem;color:var(--text);line-height:1.4;transition:background .15s"
             onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='#f8fafc'">
        <input type="checkbox" id="inf-item-${i}" style="margin-top:.1rem;accent-color:#1a56a4;flex-shrink:0;width:16px;height:16px"
               onchange="document.getElementById('inf-label-${i}').style.textDecoration=this.checked?'line-through':'none';document.getElementById('inf-label-${i}').style.color=this.checked?'#9ca3af':'var(--text)'">
        <span id="inf-label-${i}">${item}</span>
      </label>`).join('')}
    </div>
    <p style="font-size:.78rem;color:var(--text-muted);margin-top:.75rem;font-style:italic">
      <i class="fas fa-info-circle"></i> Las marcas se guardan mientras no recargues la página. Se envía guía de presentación oficial del informe final por ISEADE.
    </p>
  </div>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-file-circle-check" style="margin-right:.5rem;color:#166534"></i>Documentos a Entregar al Finalizar el Diagnóstico</div>
    <p class="resource-group-subtitle" style="margin-bottom:1.25rem">Según lineamientos ISEADE. <strong>Fecha de entrega: 1 de junio de 2026.</strong></p>
    <div style="display:flex;flex-direction:column;gap:.5rem">
      ${[
        'Informe de Diagnóstico',
        'Carta de Confidencialidad (firmada)',
        'Carta de Aceptación del Diagnóstico emitida por la organización',
        'Carta del Tutor avalando el Diagnóstico',
        'Reporte de horas efectivas dedicadas por cada integrante del equipo',
      ].map((item, i) => `
      <label style="display:flex;align-items:flex-start;gap:.6rem;padding:.65rem .75rem;border-radius:8px;border:1px solid var(--border);background:#f0fdf4;cursor:pointer;font-size:.85rem;color:var(--text);line-height:1.4;transition:background .15s"
             onmouseover="this.style.background='#dcfce7'" onmouseout="this.style.background='#f0fdf4'">
        <input type="checkbox" id="ent-item-${i}" style="margin-top:.1rem;accent-color:#166534;flex-shrink:0;width:16px;height:16px"
               onchange="document.getElementById('ent-label-${i}').style.textDecoration=this.checked?'line-through':'none';document.getElementById('ent-label-${i}').style.color=this.checked?'#9ca3af':'var(--text)'">
        <span id="ent-label-${i}">${item}</span>
      </label>`).join('')}
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
    { name: 'Cecilia Beatriz Chicas de Escalante', initials: 'CC', role: 'Ing. Industrial · Walmart',                    color: '#1a56a4', email: 'cecilia_cbcg@hotmail.com', tel: '6031-0312' },
    { name: 'Ricardo Alberto Palacios Valladares', initials: 'RP', role: 'Arq. de Interiores · Alcaldía de San Salvador', color: '#0e7490', email: 'ricardoa7@hotmail.com',      tel: '7922-7891' },
    { name: 'Elías José Núñez Menjívar',           initials: 'EN', role: 'Ing. Industrial · Corte Suprema de Justicia',   color: '#7c3aed', email: 'jm.josemenjivar@gmail.com', tel: '7740-3029' },
    { name: 'Jaime Omar López Monge',              initials: 'JL', role: 'Adm. de Empresas · StarDent',                   color: '#b45309', email: 'jolopezsalsv@gmail.com',    tel: '7627-3314' },
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
      <div style="margin-top:.75rem;display:flex;flex-direction:column;gap:.35rem">
        <a href="tel:${m.tel.replace('-','')}" style="display:flex;align-items:center;justify-content:center;gap:.4rem;font-size:.82rem;color:var(--blue);text-decoration:none">
          <i class="fas fa-phone" style="font-size:.75rem"></i>${m.tel}
        </a>
        <a href="mailto:${m.email}" style="display:flex;align-items:center;justify-content:center;gap:.4rem;font-size:.82rem;color:var(--blue);text-decoration:none;word-break:break-all">
          <i class="fas fa-envelope" style="font-size:.75rem;flex-shrink:0"></i>${m.email}
        </a>
      </div>
    </div>`).join('')}
  </div>
  <div class="card" style="margin-top:1.5rem">
    <div class="card-title"><i class="fas fa-user-graduate" style="margin-right:.5rem"></i>Tutor Académico</div>
    <div style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;margin-top:.5rem">
      <div style="width:48px;height:48px;border-radius:50%;background:#166534;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:1rem;flex-shrink:0">RC</div>
      <div>
        <div style="font-size:.95rem;font-weight:600;color:var(--text)">Lic. Roberto Arturo Castro Castañeda</div>
        <div style="font-size:.85rem;color:var(--text-muted);margin-bottom:.4rem">ISEADE FEPADE</div>
        <div style="display:flex;gap:1.25rem;flex-wrap:wrap">
          <a href="tel:+13464906451" style="display:flex;align-items:center;gap:.4rem;font-size:.85rem;color:var(--blue);text-decoration:none">
            <i class="fas fa-phone" style="font-size:.75rem"></i>+1 (346) 490-6451
          </a>
          <a href="mailto:roca2608@gmail.com" style="display:flex;align-items:center;gap:.4rem;font-size:.85rem;color:var(--blue);text-decoration:none">
            <i class="fas fa-envelope" style="font-size:.75rem"></i>roca2608@gmail.com
          </a>
        </div>
      </div>
    </div>
  </div>`;
}

function renderFases() {
  const fases = [
    {
      n: 1,
      titulo: 'Diagnóstico',
      icon: 'fa-search',
      color: '#1a56a4',
      descripcion: 'Levantamiento de información y análisis de la situación actual de CLIDENTE. Incluye visitas de campo, entrevistas, análisis FODA, Fuerzas de Porter y diagnóstico organizacional integral.',
      entregables: ['Informe de Diagnóstico V1', 'Análisis FODA', 'Análisis 5 Fuerzas de Porter', 'Diagnóstico de Desempeño Ambiental'],
      estado: 'wip'
    },
    {
      n: 2,
      titulo: 'Desarrollo del Plan de Trabajo',
      icon: 'fa-tasks',
      color: '#0e7490',
      descripcion: 'Diseño de la propuesta de mejora basada en los hallazgos del diagnóstico. Definición de objetivos, estrategias y plan de acción por área de intervención.',
      entregables: ['Plan de Trabajo Estratégico', 'Propuesta de mejora por área', 'Matriz de priorización de acciones'],
      estado: 'pending'
    },
    {
      n: 3,
      titulo: 'Elaboración del Informe',
      icon: 'fa-file-alt',
      color: '#7c3aed',
      descripcion: 'Redacción del informe final de consultoría con todos los hallazgos, análisis y recomendaciones. Documento físico anillado y versión digital para entrega a ISEADE FEPADE.',
      entregables: ['Informe Final de Consultoría', 'Documento anillado para ISEADE', 'Versión digital (vbeltran@iseade.edu.sv)'],
      estado: 'pending'
    },
    {
      n: 4,
      titulo: 'Presentación y Evaluación',
      icon: 'fa-chalkboard-teacher',
      color: '#b45309',
      descripcion: 'Presentación de los resultados ante el tutor académico y evaluación final del Trabajo de Graduación. Cada consultor expone 2–3 diapositivas con hallazgos de su área.',
      entregables: ['Presentación al tutor (26 may 2026)', 'Entrega final ISEADE (1 jun 2026)', 'Carta de Aprobación del tutor'],
      estado: 'pending'
    },
  ];

  const estadoLabel = { done: 'Completada', wip: 'En Progreso', pending: 'Pendiente' };
  const estadoColor = { done: '#166534', wip: '#1a56a4', pending: '#6b7280' };
  const estadoBg    = { done: '#dcfce7',  wip: '#dbeafe',  pending: '#f3f4f6' };

  return `
  <h1 class="section-title">Fases del Proyecto</h1>
  <p style="color:var(--text-muted);margin-bottom:2rem;font-size:.9rem">
    Consultoría empresarial MAE LVIII – ISEADE FEPADE · Empresa: Clínica Dental CLIDENTE
  </p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin-bottom:2rem">
    ${fases.map(f => `
    <div style="background:white;border-radius:12px;border:1px solid var(--border);overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);display:flex;flex-direction:column">
      <div style="background:${f.color};padding:1.5rem;color:white;display:flex;align-items:center;gap:1rem">
        <div style="width:48px;height:48px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <i class="fas ${f.icon}" style="font-size:1.3rem"></i>
        </div>
        <div>
          <div style="font-size:.75rem;opacity:.8;text-transform:uppercase;letter-spacing:.05em">Fase ${f.n}</div>
          <div style="font-size:1.05rem;font-weight:700;line-height:1.3">${f.titulo}</div>
        </div>
      </div>
      <div style="padding:1.25rem;flex:1;display:flex;flex-direction:column;gap:1rem">
        <span style="display:inline-block;padding:.25rem .75rem;border-radius:50px;font-size:.75rem;font-weight:600;background:${estadoBg[f.estado]};color:${estadoColor[f.estado]}">
          ${estadoLabel[f.estado]}
        </span>
        <p style="font-size:.85rem;color:var(--text-muted);line-height:1.6;margin:0">${f.descripcion}</p>
        <div>
          <div style="font-size:.75rem;font-weight:700;color:var(--text);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.5rem">Entregables</div>
          <ul style="padding-left:1.1rem;margin:0">
            ${f.entregables.map(e => `<li style="font-size:.82rem;color:var(--text-muted);padding:.2rem 0">${e}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <div class="card">
    <div class="card-title"><i class="fas fa-map-signs" style="margin-right:.5rem"></i>Resumen del Proceso</div>
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;padding:.5rem 0">
      ${fases.map((f, i) => `
        <div style="display:flex;align-items:center;gap:.5rem">
          <div style="background:${f.color};color:white;padding:.4rem 1rem;border-radius:50px;font-size:.82rem;font-weight:600;white-space:nowrap">
            ${f.n}. ${f.titulo}
          </div>
          ${i < fases.length - 1 ? '<i class="fas fa-arrow-right" style="color:var(--text-muted);font-size:.8rem"></i>' : ''}
        </div>`).join('')}
    </div>
  </div>`;
}

function renderCronograma() {
  const rows = [
    ['22–24 abr 2026',  'Comunicación oficial a empresa y tutor – inicio formal MAE LVIII',                           'done'],
    ['25 abr 2026',     'Asignación ISEADE – inicio oficial de la consultoría',                                       'done'],
    ['30 abr 2026',     'Visita #1 a Clidente – presentación y firma de confidencialidad',                            'done'],
    ['12 may 2026',     'Reunión #1 con Tutor – asignación de roles por área',                                        'done'],
    ['16–17 may 2026',  'Visita #2 – Pareja B (Organización y Área Comercial)',                                       'wip'],
    ['19–23 may 2026',  'Visita #3 – Pareja A (Finanzas e Inventarios)',                                              'wip'],
    ['26 may 2026',     'Reunión #2 con Tutor – presentación de avances por área',                                    'pending'],
    ['26–30 may 2026',  'Visita #4 – Observación sin previo aviso (cierre de brechas)',                               'pending'],
    ['1 jun 2026',      '⭐ CIERRE ETAPA I – Entrega Diagnóstico (físico anillado + digital a vbeltran@iseade.edu.sv)', 'pending'],
    ['16 ago 2026',     '⭐ CIERRE ETAPA II – Fin Desarrollo del Plan de Trabajo (10 semanas hábiles)',                'pending'],
    ['31 ago 2026',     '⭐ CIERRE ETAPA III – Entrega Informe Final (trabajo de escritorio, 2 semanas hábiles)',      'pending'],
    ['7–18 sep 2026',   '⭐ PRESENTACIÓN ANTE JURADO EVALUADOR – Evento final de consultoría',                        'pending'],
    ['Post-correcciones','Entrega informe final ajustado y empastado (2 semanas tras envío de correcciones)',          'pending'],
  ];
  const labels = { done:'Completado', wip:'En Progreso', pending:'Pendiente' };
  return `
  <h1 class="section-title">Cronograma de la Consultoría</h1>
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
  'equipo':         { label: 'Equipo',               render: renderEquipo },
  'fases':          { label: 'Fases del Proyecto',   render: renderFases },
  'sobre-proyecto': { label: 'Sobre el Proyecto',    render: renderSobreProyecto },
  'visitas':        { label: 'Visitas a CLIDENTE',   render: renderVisitas },
  'reuniones':      { label: 'Reuniones con Tutor',  render: renderReuniones },
  'diagnostico':    { label: 'Diagnóstico',          render: renderDiagnostico },
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
