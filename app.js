/* ═══════════════════════════════════════════════════════════
   CLIDENTE · Portal TDG MBA · ISEADE FEPADE  –  app.js
   ═══════════════════════════════════════════════════════════ */

/* ── SECTION RENDERERS ─────────────────────────────────────── */

function getLocalDateOnly(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDaysUntil(dateValue) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const diff = target - getLocalDateOnly();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function getCountdownLabel(days) {
  if (days === 0) return 'Hoy';
  if (days === 1) return '1';
  return String(days);
}

function renderCartelera() {
  const days   = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const now    = new Date();
  const dateStr = `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
  const diagnosticoDashboard = getIndiceDashboardSummary();
  const daysToIseade = getDaysUntil('2026-06-01');
  const daysToTutor = getDaysUntil('2026-05-26');

  return `
  <h1 class="section-title">Cartelera</h1>

  <!-- Avisos rápidos -->
  <div class="cartelera-grid" style="margin-bottom:1.5rem">
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
        <p>📅 <strong>Visita de Campo 3</strong> – realizada el sábado 23 de mayo de 2026.<br>
        📅 <strong>Visita de Campo 4</strong> – realizada por Elías el sábado 23 de mayo de 2026.<br>
        📅 <strong>Reunión con Tutor #2</strong> – 26 de mayo de 2026.<br>
        📅 <strong>Diagnóstico ambiental</strong> – Henry ya envió la información base.<br>
        📅 <strong>Entrega ISEADE</strong> – 1 de junio de 2026.</p>
      </div>
    </div>
  </div>

  <!-- ══ MAPA ACTUAL DEL PROYECTO ════════════════════════════ -->
  <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem">
    <div style="width:36px;height:36px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <i class="fas fa-map" style="color:white;font-size:.9rem"></i>
    </div>
    <h2 style="font-size:1.2rem;font-weight:700;color:var(--text);margin:0">Mapa Actual del Proyecto</h2>
    <span style="margin-left:auto;font-size:11px;color:var(--text-muted);background:white;border:1px solid var(--border);padding:4px 10px;border-radius:20px">${dateStr}</span>
  </div>

  <!-- Alertas -->
  <div class="mp-alert">
    <span style="font-size:16px;flex-shrink:0">⚠️</span>
    <div><strong>Sin pendientes críticos sin comenzar:</strong> Referencias APA 7 y Anexo Metodológico de IA con URLs de prompts ya están trabajados. El diagnóstico ambiental ya cuenta con métricas e insumo base para integrarse al informe.</div>
  </div>
  <div class="mp-info">
    <span style="font-size:16px;flex-shrink:0">💡</span>
    <div><strong>Nuevo esta semana:</strong> Henry entregó estados financieros formales y el diagnóstico ambiental base. Ricardo ya puede cerrar §VI.1 Finanzas y Elías puede integrar el diagnóstico ambiental.</div>
  </div>

  <!-- KPIs -->
  <div class="mp-kpi-row">
    <div class="mp-kpi green"><div class="mp-kpi-label">Avance global</div><div class="mp-kpi-value">${diagnosticoDashboard.global}%</div><div class="mp-kpi-sub">${diagnosticoDashboard.completed}/${diagnosticoDashboard.total} actividades al 100%</div></div>
    <div class="mp-kpi red"><div class="mp-kpi-label">Días a entrega ISEADE</div><div class="mp-kpi-value">${getCountdownLabel(daysToIseade)}</div><div class="mp-kpi-sub">Lun 1 junio · anillado</div></div>
    <div class="mp-kpi amber"><div class="mp-kpi-label">Días al tutor Roberto</div><div class="mp-kpi-value">${getCountdownLabel(daysToTutor)}</div><div class="mp-kpi-sub">Mar 26 mayo · online</div></div>
    <div class="mp-kpi blue"><div class="mp-kpi-label">Visitas realizadas</div><div class="mp-kpi-value">4/5</div><div class="mp-kpi-sub">Últimas: sáb 23 mayo</div></div>
  </div>

  <!-- Fila 1: Progreso + Cronograma -->
  <div class="mp-grid2">
    <div class="card">
      <div class="card-header" style="display:flex;align-items:center">
        <div class="card-title"><i class="fas fa-chart-bar" style="margin-right:.5rem"></i>Avance por Sección del Diagnóstico</div>
        <span class="mp-chip ${diagnosticoDashboard.global >= 80 ? 'mp-chip-ok' : diagnosticoDashboard.global >= 50 ? 'mp-chip-warn' : 'mp-chip-no'}" style="margin-left:auto;flex-shrink:0">${diagnosticoDashboard.global >= 80 ? 'Avanzado' : diagnosticoDashboard.global >= 50 ? 'En proceso' : 'Requiere impulso'}</span>
      </div>
      <div style="padding:1rem 1.1rem">
        <p class="mp-dashboard-note">Vista gerencial calculada automaticamente desde el Indice Oficial ISEADE y Responsables.</p>
        ${diagnosticoDashboard.sections.map(section => [section.label, section.percent, section.color]).map(([lbl,pct,color]) => `
        <div class="mp-prog-row">
          <div class="mp-prog-lbl">${lbl}</div>
          <div class="mp-prog-track"><div class="mp-prog-fill mp-f-${color}" data-w="${pct}%" style="width:0%"></div></div>
          <div class="mp-prog-pct"${color==='red'?' style="color:#C13030"':''}>${pct}%</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header" style="display:flex;align-items:center">
        <div class="card-title"><i class="fas fa-clock" style="margin-right:.5rem"></i>Cronograma Crítico</div>
        <span class="mp-chip mp-chip-no" style="margin-left:auto;flex-shrink:0">${daysToIseade === 0 ? 'Hoy' : `${daysToIseade} días`}</span>
      </div>
      <div style="padding:1rem 1.1rem">
        <ul class="mp-tl">
          ${[
            ['#3B9EE0','MIÉ–VIE · 20–22 MAY','Redacción individual','Jaime → §III · Ricardo → §VI.1 Finanzas · Cecilia → §VI.1 Mercadeo · Elías → Diag. ambiental §1-2'],
            ['#0D8A6E','SÁB · 23 MAY','Visita 3 — sin aviso realizada','Observación real efectuada para conteo de pacientes, ticket promedio, journey y cierre de brechas.'],
            ['#0D8A6E','SÁB · 23 MAY','Visita 4 — Diagnóstico ambiental realizada por Elías','Henry ya envió la información base del diagnóstico ambiental para integrar al informe.'],
            ['#C13030','MAR · 26 MAY — LÍMITE 1','Presentación al Tutor Roberto Castro','2-3 slides por consultor · Firma Carta de Aprobación del Tutor · Guardar URLs Claude para Anexo IA.'],
            ['#677089','MIÉ–VIE · 28–30 MAY','Integración final','§VII completa · Revisión cruzada · Control de horas · Integración final de anexos.'],
            ['#C13030','LUN · 1 JUN — LÍMITE 2','Entrega ISEADE (Jaime)','Físico anillado 9:30–18:30 + digital a vbeltran@iseade.edu.sv + sobre manila con 4 cartas sin perforar.'],
          ].map(([col,d,t,s]) => `
          <li class="mp-tl-item">
            <div class="mp-tl-left"><div class="mp-tl-dot" style="background:${col}"></div><div class="mp-tl-line"></div></div>
            <div><div class="mp-tl-d">${d}</div><div class="mp-tl-t">${t}</div><div class="mp-tl-s">${s}</div></div>
          </li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <!-- Fila 2: Pendientes + Checklist entrega -->
  <div class="mp-grid2">
    <div class="card">
      <div class="card-header" style="display:flex;align-items:center">
        <div class="card-title"><i class="fas fa-exclamation-triangle" style="margin-right:.5rem;color:#C13030"></i>Pendientes Críticos</div>
        <span class="mp-chip mp-chip-no" style="margin-left:auto;flex-shrink:0">5 por cerrar</span>
      </div>
      <div style="padding:1rem 1.1rem">
        ${[
          ['warn','Elías',  'Diagnóstico Ambiental — integrar insumo de Henry',          'Henry ya envió la información base. Falta convertirla en texto del informe y recomendaciones.'],
          ['no','Todo',   'Referencias bibliográficas APA 7',                            'Sección completamente vacía. Mínimo 5-8 fuentes académicas.'],
          ['no','Jaime',  'Anexo IA — con URLs de cada conversación Claude',             'ISEADE exige el URL del prompt específico. Guardar links desde ahora.'],
          ['no','Jaime',  '§VII: Alcances + Limitaciones + Metodología + Cronograma',   '4 subsecciones obligatorias no redactadas aún.'],
          ['warn','Ricardo','§VI.1 Finanzas — cerrar con estados financieros',          'Ahora hay base documental (CPA + Auditor). Aclarar brecha ingresos formales vs operativos.'],
          ['warn','Cecilia','Journey del paciente + mapa visual de procesos',           'Usar la observación real levantada en la Visita 3 del sábado 23.'],
        ].map(([icon,who,title,sub]) => `
        <div class="mp-chk-item">
          <div class="mp-chk-icon mp-chk-${icon}">${icon==='no'?'✗':'!'}</div>
          <div><span class="mp-who">${who}</span><strong>${title}</strong><div class="mp-chk-sub">${sub}</div></div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header" style="display:flex;align-items:center">
        <div class="card-title"><i class="fas fa-list-check" style="margin-right:.5rem"></i>Checklist de Entrega — 1 Junio</div>
        <span class="mp-chip mp-chip-no" style="margin-left:auto;flex-shrink:0">1 de 7 listo</span>
      </div>
      <div style="padding:1rem 1.1rem">
        ${[
          ['ok',  'Carta de Confidencialidad',                  'Firmada por Dra. Vigil el 6 de mayo ✅'],
          ['warn','Carta Aceptación Diagnóstico (Dra. Vigil)',  'Generada ✅ — llevar impresa el sáb 23 en 2 originales para firma'],
          ['no',  'Carta Aprobación Tutor (Roberto Castro)',    'Obtener firma en reunión del martes 26'],
          ['no',  'Control de Horas Efectivas (4 integrantes)','Completar antes del 30 de mayo'],
          ['no',  'Informe anillado (impreso B/N doble cara)',  'Después del 30 mayo cuando el documento esté cerrado'],
          ['no',  'Sobre manila con cartas — SIN PERFORAR',    'Las 4 cartas van aparte del anillado'],
          ['no',  'PDF digital a vbeltran@iseade.edu.sv',      'Horario 9:30–18:30 del 1 de junio'],
        ].map(([icon,title,sub]) => `
        <div class="mp-chk-item">
          <div class="mp-chk-icon mp-chk-${icon}">${icon==='ok'?'✓':icon==='warn'?'!':'✗'}</div>
          <div><strong>${title}</strong><div class="mp-chk-sub">${sub}</div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Responsabilidades por consultor -->
  <div class="card">
    <div class="card-header">
      <div class="card-title"><i class="fas fa-users" style="margin-right:.5rem"></i>Responsabilidades por Consultor — Esta Semana</div>
    </div>
    <div style="padding:.85rem 1.1rem">
      <div class="mp-person-grid">
        ${[
          ['#1A5FA8','Jaime O. López · Líder',        [['done','Carta Aceptación generada'],['todo','Redactar §III completa'],['todo','§VII: Alcances, Limitaciones, Metodología'],['done','Visita 3 realizada · sáb 23'],['crit','Anexo IA — guardar URLs Claude desde hoy']]],
          ['#8B44C4','Cecilia B. Chicas · Consultora', [['done','§VI.1 Mercadeo CRM — diagnóstico listo'],['todo','Completar análisis canales digitales'],['done','Visita 3 realizada · métricas + journey'],['crit','Diagrama visual mapa de procesos']]],
          ['#C47A15','Ricardo A. Palacios · Consultor',[['done','Datos financieros recibidos (EERR + Balance)'],['todo','Redactar §VI.1 Finanzas con estados formales'],['todo','Aclarar brecha ingresos formales vs operativos']]],
          ['#0D8A6E','Elías J. Núñez · Consultor',    [['done','Análisis de insumos documentado'],['done','Visita 4 ambiental realizada · sáb 23'],['done','Henry envió diagnóstico ambiental base'],['todo','Integrar diagnóstico ambiental al informe']]],
        ].map(([color,name,tasks]) => `
        <div class="mp-person-card" style="border-top-color:${color}">
          <div class="mp-p-name" style="color:${color}">${name}</div>
          ${tasks.map(([d,t]) => `<div class="mp-p-task"><span class="mp-p-dot mp-p-${d}"></span>${t}</div>`).join('')}
        </div>`).join('')}
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
      <p>Consultoría empresarial gratuita + Diagnóstico Organizacional Integral con propuesta de mejora. Tres unidades de negocio: clínica dental, Laboratorio Dental y Oxicam.</p>
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
  <div class="card guide-access-card">
    <div class="guide-access-copy">
      <div class="card-title"><i class="fas fa-person-chalkboard" style="margin-right:.5rem"></i>PPT Guía e Instrucciones de Vanessa</div>
      <p class="card-subtitle">Presentación base de ISEADE para el inicio del Trabajo de Graduación MAE 58. Resume la definición del trabajo, etapas de la consultoría, entregables, lineamientos generales, fechas importantes y la estructura esperada para el informe final.</p>
    </div>
    <a href="https://drive.google.com/file/d/1_INSK4S69XBQg5D1Qwq8X6MF5RNXyf_X/view?usp=sharing" target="_blank" rel="noopener" class="btn-resource guide-access-btn">
      <i class="fas fa-file-powerpoint"></i> Abrir PPT Guía de Vanessa
    </a>
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
  const visitasGerenciales = [
    {
      n: 1,
      title: 'Presentación inicial y firma de confidencialidad',
      date: '6 de mayo de 2026', duration: '90 minutos',
      attendees: 'Dra. Olga Vigil, Tec. Henry Corcio (Gte. Adm.), Jaime López, Cecilia Chicas',
      summary: 'Primera visita oficial a Clínica Dental Clidente. Presentación del equipo a la propietaria Dra. Vigil y firma de cartas de confidencialidad. Reconocimiento de instalaciones (4 locales integrados, 8 sillas de atención). Entrega del cuestionario de diagnóstico ambiental (escala 0–4) para que la Dra. lo complete. Hora de llegada: 5:15 PM · 2ª Calle Pte. y 2ª Av. Sur, Local 21, 2° Nivel, Santa Tecla.',
      estado: 'done',
      resources: [
        { label: 'Agenda Visita #1',  icon: 'fa-calendar-day', href: 'https://drive.google.com/file/d/1z3L2xGB8PeOP5bsfk_8WNV7tRRPO4LEz/view?usp=sharing' },
        { label: 'Resumen Ejecutivo', icon: 'fa-file-alt',     href: 'https://drive.google.com/file/d/1Bxv_TgA_ZtLPcue5Bo4yK4-CIvYiX2kD/view?usp=sharing' },
        { label: 'Plan de Visitas',   icon: 'fa-file-lines',   href: 'Plan_Visitas_Campo_Clidente_2026.pdf' },
      ]
    },
  ];

  const visitasCampo = [
    {
      n: 1,
      title: 'Organización y Área Comercial',
      date: '16 de mayo de 2026 (Pareja B)', duration: '4 horas',
      attendees: 'Jaime Omar López + Cecilia Beatriz Chicas · Contacto: Henry Corcio',
      summary: 'Pareja B (Organización y Área Comercial). Objetivos: validar organigrama vigente e identificar vacante de Dirección Clínica; entrevistar a Tatiana/Diego (Mercadeo) sobre redes sociales; diagnosticar sistema CRM/base de pacientes; verificar escala salarial y comisiones; obtener descriptores de puesto del manual (carpeta negra). Solicitar copia digital del organigrama a Henry.',
      estado: 'done',
      resources: [
        { label: 'Resumen Ejecutivo', icon: 'fa-file-alt', href: 'https://drive.google.com/file/d/1WCOQYWOum-Bed_satcTWYhUrBK2joPLq/view?usp=sharing' },
      ]
    },
    {
      n: 2,
      title: 'Operaciones y Finanzas',
      date: '19–23 de mayo de 2026 (Pareja A)', duration: '4 horas',
      attendees: 'Ricardo Palacios + Elías Núñez · Contacto: Henry Corcio',
      summary: 'Pareja A (Finanzas e Inventarios). Objetivos: levantar inventario físico de insumos (codificación y sistema de requisición); mapear journey del paciente desde ingreso hasta cobro; evaluar protocolos de inocuidad y esterilización; recopilar KPIs de contabilidad y estado de P&G por unidad de negocio (clínica, depósito, bodegas); aplicar encuesta de Diagnóstico de Desempeño Ambiental.',
      estado: 'done',
      resources: [
        { label: 'Resumen Ejecutivo', icon: 'fa-file-alt',  href: 'https://drive.google.com/file/d/1k7Q4h0QR7ytd2-GOpYy__qIDZkVMBKK9/view?usp=sharing' },
      ]
    },
    {
      n: 3,
      title: 'Observación sin previo aviso (Operación Real)',
      date: '23 de mayo de 2026', duration: '2–3 horas',
      attendees: 'Jaime López + Cecilia Chicas',
      summary: 'Visita sin previo aviso realizada el sábado 23 de mayo para observar la operación en condiciones reales. Objetivo: conteo real de pacientes, ticket promedio por procedimiento, análisis de métricas de redes sociales, journey del paciente y cierre de brechas de información pendiente.',
      estado: 'done',
      resources: [
        { label: 'Resumen Ejecutivo Visita 3', icon: 'fa-file-alt', href: 'https://drive.google.com/file/d/1iNiWJ2VyZTt8A-xMywIfSirZYt22rmx7/view?usp=sharing' },
      ]
    },
    {
      n: 4,
      title: 'Diagnóstico Ambiental',
      date: '23 de mayo de 2026', duration: 'Trabajo de campo',
      attendees: 'Elías Núñez · Contacto: Henry Corcio',
      summary: 'Visita ambiental realizada por Elías el sábado 23 de mayo. Henry ya envió la información base del diagnóstico ambiental, pendiente de integrar al informe y convertir en recomendaciones ambientales.',
      estado: 'done',
      resources: [
        { label: 'Encuesta Ambiental', icon: 'fa-leaf', href: 'https://drive.google.com/file/d/1bJKvFu_RPuOFINvk8oZm7LLF0pDcDMdh/preview', embed: true },
      ]
    },
  ];

  const estadoColor = { done: '#166534', wip: '#1a56a4', pending: '#6b7280' };
  const estadoBg   = { done: '#dcfce7',  wip: '#dbeafe',  pending: '#f3f4f6' };
  const estadoLabel= { done: 'Realizada', wip: 'En Progreso', pending: 'Pendiente' };

  return `
  <h1 class="section-title">Visitas a CLIDENTE</h1>

  <!-- SUBSECCIÓN: VISITAS GERENCIALES -->
  <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem;margin-top:.5rem">
    <div style="width:36px;height:36px;border-radius:50%;background:#0d8a6e;display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <i class="fas fa-user-tie" style="color:white;font-size:.9rem"></i>
    </div>
    <h2 style="font-size:1.2rem;font-weight:700;color:var(--text);margin:0">Visitas Gerenciales</h2>
    <span style="background:#e6f4ee;color:#0f4a2e;font-size:.75rem;font-weight:600;padding:.2rem .7rem;border-radius:50px">${visitasGerenciales.length} visita</span>
  </div>

  <div class="timeline" style="margin-bottom:2rem">
    ${visitasGerenciales.map(v => `
    <div class="tl-item">
      <div class="tl-header">
        <span class="tl-title">Visita Ejecutiva #${v.n} – ${v.title}</span>
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
        <a href="${r.embed ? `#visita-campo-${v.n}-pdf` : r.href}" ${r.embed ? '' : 'target="_blank"'} class="btn-resource">
          <i class="fas ${r.icon}"></i> ${r.label}
        </a>`).join('')}
      </div>
      ${v.resources.filter(r => r.embed).map(r => `
      <div class="visit-pdf-viewer" id="visita-campo-${v.n}-pdf">
        <iframe src="${r.href}" title="${r.label}" loading="lazy" allow="fullscreen"></iframe>
      </div>`).join('')}
    </div>`).join('')}
  </div>

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
        { label: 'Resumen Reunión', icon: 'fa-file-lines', href: 'https://drive.google.com/file/d/1yK0z0IGVcKAlE-67BSxwSRwtg7Ry6NQr/view?usp=sharing' },
        { label: 'Roles del Equipo', icon: 'fa-list-check', href: 'https://drive.google.com/file/d/12kjVnrkxJh525AASAo9dcXz4Z8gOPH00/view?usp=sharing' },
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
      resources: [
        { label: 'Presentación Canva', icon: 'fa-palette', href: 'https://www.canva.com/design/DAHKbs9dEYE/Q-sYw1vxJaPpyXdgxGU-Wg/edit?ui=eyJBIjp7fX0' },
      ]
    },
    {
      n: 3, title: 'Revisión de Avances y Recomendaciones de Gestión',
      date: '9 de junio de 2026',
      tutor: 'Lic. Roberto Arturo Castro Castañeda',
      topics: [
        'Laboratorio Dental: se confirmó que no forma parte de CLIDENTE; debe manejarse como empresa separada y formalizar cobros por renta, salarios y servicios.',
        'Finanzas: la operación es rentable, con margen bruto aproximado del 66%; la principal presión está en la liquidez por la deuda bancaria.',
        'Punto de equilibrio: aproximadamente 451 pacientes mensuales y $16,400 en ingresos.',
        'Ocupación: se identificó alta capacidad ociosa; se recomendó elevar la ocupación al menos al 30% y revisar los horarios de operación.',
        'Odontólogos: establecer una meta mínima de facturación de $2,500 y evaluar un esquema escalonado de comisiones.',
        'Compras e inventarios: crear archivo maestro, política de compras, precontratos anuales y mejores condiciones de crédito con proveedores.',
        'Gestión del cambio: presentar avances a la propietaria antes del informe final e involucrar a las personas responsables de implementar las mejoras.',
        'Seguimiento: continuar las reuniones con el tutor cada 15 días y avanzar en paralelo con las recomendaciones solicitadas.',
      ],
      resources: [
        { label: 'Transcripción Reunión 3', icon: 'fa-file-word', href: 'docs/Reunion-3-con-Tutor-9-Junio-2026.docx' },
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
  const collaborativeDocUrl = 'https://onedrive.live.com/:w:/g/personal/a9679c2cee16b8af/IQAenJTbznDFRb-nAXcoc66kAV5xTd_HZZ0zH57s4epiDco';
  const collaborativePdfUrl = 'https://graph.microsoft.com/v1.0/shares/u!aHR0cHM6Ly9vbmVkcml2ZS5saXZlLmNvbS86dzovZy9wZXJzb25hbC9hOTY3OWMyY2VlMTZiOGFmL0lRQWVuSlRiem5ERlJiLW5BWGNvYzY2a0FWNXhUZF9IWlowekg1N3M0ZXBpRGNv/driveItem/content?format=pdf';

  return `
  <h1 class="section-title">Diagnóstico Organizacional</h1>

  <div class="resource-group card collaborative-doc-card diagnostic-workspace-card">
    <div class="collaborative-doc-header">
      <div>
        <div class="card-title"><i class="fas fa-file-signature" style="margin-right:.5rem"></i>Informe de Diagnóstico Organizacional</div>
        <p class="resource-group-subtitle">Borrador oficial y documento colaborativo del informe final para ISEADE FEPADE. Incluye: Antecedentes, Filosofía Corporativa, Estructura Organizacional, Descripción del Funcionamiento, Mapa de Procesos, Diagnóstico FODA, Análisis 5 Fuerzas de Porter, Factores Críticos de Éxito, Orientación de la Consultoría y Conclusiones. <strong>Fecha límite de entrega: 1 de junio de 2026.</strong></p>
      </div>
      <div class="collaborative-doc-actions">
        <a href="${collaborativeDocUrl}" target="_blank" rel="noopener" class="btn-resource collaborative-doc-open">
          <i class="fas fa-pen-to-square"></i> Abrir y editar en Word Online
        </a>
        <button type="button" class="btn-resource collaborative-doc-pdf" data-pdf-url="${collaborativePdfUrl}" title="Genera el PDF desde la version actual guardada en Microsoft OneDrive">
          <i class="fas fa-file-pdf"></i> Generar PDF actualizado
        </button>
      </div>
    </div>

    <div class="collaborative-doc-note">
      <i class="fas fa-circle-info"></i>
      El botón de PDF solicita a Microsoft la conversión de la versión actual guardada en OneDrive. Si la descarga no inicia, Microsoft está pidiendo autorización del propietario o una sesión activa.
    </div>
    <div class="pdf-generation-status" id="pdfGenerationStatus" aria-live="polite"></div>

  </div>

  <div class="resource-group card journey-map-card">
    <div class="card-title"><i class="fas fa-route" style="margin-right:.5rem"></i>Jornada del Cliente / Journey del Paciente</div>
    <p class="resource-group-subtitle">
      Mapa visual del recorrido actual del paciente en CLIDENTE, desde el primer contacto hasta la atencion, pago, seguimiento y oportunidades de mejora identificadas durante la etapa de diagnostico.
    </p>
    <div class="resource-buttons">
      <a href="docs/clidente-journey-map.html" target="_blank" rel="noopener" class="btn-resource">
        <i class="fas fa-route"></i> Ver Journey Map del Cliente
      </a>
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
      🟡 Tres unidades de negocio: clínica dental, Laboratorio Dental y Oxicam (sin estados financieros separados).
    </p>
  </div>

  <div class="resource-group card">
    <div class="card-title"><i class="fas fa-network-wired" style="margin-right:.5rem"></i>Estructura Organizacional</div>
    <p class="resource-group-subtitle">Clínica con 8 sillas de atención, 10 horas diarias de operación, 24 personas en planilla ISSS (incluye otras empresas de la propietaria). Vacante identificada: <strong>Dirección Clínica</strong>. Contacto operativo: Tec. Henry Corcio – Gerente Administrativo.</p>
    <div class="resource-buttons">
      <button type="button" class="btn-resource" id="btnOrgPdf"><i class="fas fa-file-pdf"></i> Generar PDF Organigrama</button>
    </div>
    <div class="org-chart" id="organigrama-clidente">
      <div class="org-node org-top">
        <span>Direccion General / Propietaria</span>
        <strong>Dra. Olga Dinora Vigil Romero</strong>
        <small>Gobierno general, decisiones estrategicas y continuidad del negocio</small>
      </div>
      <div class="org-line"></div>
      <div class="org-node org-admin">
        <span>Gerencia Administrativa</span>
        <strong>Tec. Henry Corcio</strong>
        <small>Operacion diaria, soporte administrativo, informacion base y coordinacion interna</small>
      </div>
      <div class="org-branches">
        <div class="org-node">
          <span>Unidad de Negocio</span>
          <strong>Clinica Dental</strong>
          <small>8 sillas de atencion, servicios odontologicos y experiencia del paciente</small>
        </div>
        <div class="org-node org-vacant">
          <span>Vacante Identificada</span>
          <strong>Direccion Clinica</strong>
          <small>Coordinacion tecnica odontologica, supervision clinica y estandarizacion de protocolos</small>
        </div>
        <div class="org-node">
          <span>Unidad de Negocio</span>
          <strong>Laboratorio Dental</strong>
          <small>Soporte tecnico dental, produccion de trabajos y coordinacion con clinica</small>
        </div>
        <div class="org-node">
          <span>Unidad de Negocio</span>
          <strong>Oxicam</strong>
          <small>Servicio complementario y gestion operativa asociada</small>
        </div>
      </div>
      <div class="org-detail-grid">
        <div>
          <strong>Datos operativos</strong>
          <span>10 horas diarias de operacion · 24 personas en planilla ISSS · contacto operativo centralizado en Gerencia Administrativa.</span>
        </div>
        <div>
          <strong>Hallazgo organizacional</strong>
          <span>La estructura requiere formalizar Direccion Clinica, responsabilidades por unidad y control financiero separado por negocio.</span>
        </div>
      </div>
    </div>
  </div>

  ${renderDiagnosticoEntregables()}
  ${renderIndiceResponsables()}`;
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

const INDICE_RESPONSABLES_STORAGE_KEY = 'clidente_indice_responsables_v1';
const SUPABASE_URL = 'https://lgoevspmiuyvlttmuyuz.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Wk0gGB0ks4HiqHyJ-AvTqw_-LoL4oZg';
const SUPABASE_INDICE_TABLE = 'indice_responsables';
const SUPABASE_CRONOGRAMA_TABLE = 'cronograma_actividades';
const SUPABASE_DIAGNOSTICO_ENTREGABLES_TABLE = 'diagnostico_entregables';
const DIAGNOSTICO_ENTREGABLES_STORAGE_KEY = 'clidente_diagnostico_entregables_v1';
const DIAGNOSTICO_ENTREGABLES = [
  { id: 'informe-diagnostico', item: 'Informe de Diagnostico', avance: 0 },
  { id: 'carta-confidencialidad', item: 'Carta de Confidencialidad (firmada)', avance: 100 },
  { id: 'carta-aceptacion', item: 'Carta de Aceptacion del Diagnostico emitida por la organizacion', avance: 0 },
  { id: 'carta-tutor', item: 'Carta del Tutor avalando el Diagnostico', avance: 0 },
  { id: 'reporte-horas', item: 'Reporte de horas efectivas dedicadas por cada integrante del equipo', avance: 100 },
];
const INDICE_RESPONSABLE_OPTIONS = ['JAIME', 'CECILIA', 'RICARDO', 'ELIAS', 'TODOS'];
const INDICE_RESPONSABLES_ROWS = [
  { type: 'section', title: 'DOCUMENTOS DE PRESENTACION' },
  { code: '--', item: 'Portada', responsible: 'JAIME' },
  { code: '--', item: 'Indice general', responsible: 'JAIME' },
  { type: 'section', title: 'I. ANTECEDENTES DE LA ORGANIZACION' },
  { code: 'I', item: 'Origenes, tiempo de operacion y sector en que opera', responsible: 'JAIME' },
  { code: 'I', item: 'Localizacion, instalaciones y unidades de negocio', responsible: 'JAIME' },
  { type: 'section', title: 'II. VISION, MISION, PRINCIPIOS Y VALORES' },
  { code: 'II', item: 'Mision institucional', responsible: 'RICARDO' },
  { code: 'II', item: 'Vision institucional', responsible: 'RICARDO' },
  { code: 'II', item: 'Principios y valores organizacionales', responsible: 'RICARDO' },
  { type: 'section', title: 'III. ESTRUCTURA ORGANIZACIONAL' },
  { code: 'III', item: 'Organigrama y responsabilidades principales por area', responsible: 'JAIME' },
  { code: 'III', item: 'Descriptores de puestos (9 roles documentados)', responsible: 'JAIME' },
  { code: 'III', item: 'Escala salarial y esquema de comisiones', responsible: 'JAIME' },
  { code: 'III', item: 'Marco regulatorio laboral (Reglamento Interno 2021)', responsible: 'JAIME' },
  { type: 'section', title: 'IV. DESCRIPCION DEL FUNCIONAMIENTO DE LA ORGANIZACION' },
  { code: 'IV', item: 'Principales productos y/o servicios', responsible: 'RICARDO' },
  { code: 'IV', item: 'Principales proveedores (locales y extranjeros)', responsible: 'ELIAS' },
  { code: 'IV', item: 'Principales clientes', responsible: 'CECILIA' },
  { code: 'IV', item: 'Caracterizacion de clientes y participacion de mercado', responsible: 'CECILIA' },
  { code: 'IV', item: 'Canales de distribucion', responsible: 'CECILIA' },
  { code: 'IV', item: 'Descripcion de principales procesos operacionales', responsible: 'ELIAS' },
  { type: 'section', title: 'V. MAPA DE PROCESOS' },
  { code: 'V', item: 'Clasificacion: procesos estrategicos, misionales y de apoyo', responsible: 'ELIAS' },
  { code: 'V', item: 'Diagrama visual del mapa de procesos', responsible: 'ELIAS' },
  { type: 'section', title: 'VI. DIAGNOSTICO DE LA SITUACION ACTUAL' },
  { code: 'VI', item: 'Evaluacion general del area de Finanzas', responsible: 'RICARDO' },
  { code: 'VI', item: 'Evaluacion general del area de Mercadeo y Ventas', responsible: 'CECILIA' },
  { code: 'VI', item: 'Evaluacion general del area de Produccion/Operaciones', responsible: 'ELIAS' },
  { code: 'VI', item: 'Identificacion de Factores Criticos de Exito (FCE)', responsible: 'RICARDO' },
  { code: 'VI', item: 'Analisis FODA (con implicaciones de los aspectos identificados)', responsible: 'RICARDO' },
  { code: 'VI', item: 'Analisis de las 5 Fuerzas de Porter', responsible: 'CECILIA' },
  { type: 'section', title: 'VII. ORIENTACION DE LA CONSULTORIA A DESARROLLAR' },
  { code: 'VII', item: 'Objetivo General y Objetivos Especificos a lograr', responsible: 'JAIME' },
  { code: 'VII', item: 'Alcances de la consultoria (delimitacion)', responsible: 'JAIME' },
  { code: 'VII', item: 'Limitaciones', responsible: 'JAIME' },
  { code: 'VII', item: 'Metodologia a utilizar y principales actividades a realizar', responsible: 'JAIME' },
  { code: 'VII', item: 'Plan de Trabajo a desarrollar (cronograma 1-2 paginas)', responsible: 'JAIME' },
  { code: 'VII', item: 'CONCLUSIONES Y RECOMENDACIONES', responsible: 'JAIME' },
  { type: 'section', title: 'ANEXOS Y DOCUMENTOS COMPLEMENTARIOS' },
  { code: 'Anx', item: 'Diagnostico de Desempeno Ambiental (4 secciones)', responsible: 'ELIAS' },
  { code: 'Anx', item: 'Referencias bibliograficas en formato APA 7', responsible: 'TODOS' },
  { code: 'Anx', item: 'Anexo metodologico de uso de Inteligencia Artificial (con URLs)', responsible: 'JAIME' },
  { code: 'Anx', item: 'Control de Horas Efectivas por integrante', responsible: 'TODOS' },
];

const INDICE_RESPONSABLES_BY_ID = Object.fromEntries(
  INDICE_RESPONSABLES_ROWS
    .filter(row => row.type !== 'section')
    .map(row => [`${row.code}|${row.item}`, row])
);

const INDICE_JUSTIFICACIONES = [
  {
    name: 'JAIME',
    className: 'jaime',
    text: 'Lider del equipo - 22 anos en sector dental (StarDent) - Asume vision estrategica total: antecedentes, estructura y toda la Orientacion (VII). Es quien mejor conoce el sector y quien integra el documento final.'
  },
  {
    name: 'CECILIA',
    className: 'cecilia',
    text: 'Ing. Industrial - Walmart - Todo lo comercial y competitivo: clientes, mercado, canales y 5 Fuerzas. Walmart vive analizando exactamente esas dinamicas. Ya tiene el diagnostico CRM de campo.'
  },
  {
    name: 'RICARDO',
    className: 'ricardo',
    text: 'Arq. Interiores - Alcaldia SS - Filosofia corporativa (M/V/V), area financiera, FODA y Factores Criticos de Exito. Tiene los estados financieros (EERR + Balance + costos por servicio 2024). Seccion con mas documentacion disponible.'
  },
  {
    name: 'ELIAS',
    className: 'elias',
    text: 'Ing. Industrial - CSJ - Todo lo operativo: proveedores (levanto inventario con Delmy), procesos, mapa, journey del paciente y Diagnostico Ambiental. Mapear procesos y diseniar sistemas es su metodologia natural.'
  },
];

function getIndiceResponsablesSaved() {
  try {
    return JSON.parse(localStorage.getItem(INDICE_RESPONSABLES_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveIndiceResponsablesLocal(saved) {
  if (Object.keys(saved).length) {
    localStorage.setItem(INDICE_RESPONSABLES_STORAGE_KEY, JSON.stringify(saved));
  } else {
    localStorage.removeItem(INDICE_RESPONSABLES_STORAGE_KEY);
  }
}

function getIndiceDataRows() {
  return INDICE_RESPONSABLES_ROWS.filter(row => row.type !== 'section');
}

function getIndiceRowId(row) {
  return `${row.code}|${row.item}`;
}

function getIndiceRowById(rowId) {
  return INDICE_RESPONSABLES_BY_ID[rowId];
}

function getSupabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

async function supabaseRequest(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const headers = getSupabaseHeaders(options.headers || {});

  if (typeof fetch !== 'function') {
    if (typeof XMLHttpRequest !== 'function') {
      throw new Error('El navegador no expone fetch ni XMLHttpRequest para conectar con Supabase');
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', url);
      Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(`Supabase ${xhr.status}: ${xhr.responseText || ''}`));
          return;
        }
        if (xhr.status === 204 || !xhr.responseText) {
          resolve(null);
          return;
        }
        resolve(JSON.parse(xhr.responseText));
      };
      xhr.onerror = () => reject(new Error('No se pudo conectar con Supabase'));
      xhr.send(options.body || null);
    });
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Supabase ${response.status}: ${detail}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function getDiagnosticoEntregablesSaved() {
  try {
    return JSON.parse(localStorage.getItem(DIAGNOSTICO_ENTREGABLES_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveDiagnosticoEntregablesLocal(saved) {
  localStorage.setItem(DIAGNOSTICO_ENTREGABLES_STORAGE_KEY, JSON.stringify(saved || {}));
}

function getDiagnosticoEntregableData() {
  const saved = getDiagnosticoEntregablesSaved();
  return DIAGNOSTICO_ENTREGABLES.map((item, index) => ({
    ...item,
    sort_order: index,
    avance: Math.max(0, Math.min(100, Number(saved[item.id] ?? item.avance) || 0)),
  }));
}

async function seedDiagnosticoEntregablesIfEmpty() {
  const existing = await supabaseRequest(`${SUPABASE_DIAGNOSTICO_ENTREGABLES_TABLE}?select=id&limit=1`);
  if (Array.isArray(existing) && existing.length) return;
  const payload = getDiagnosticoEntregableData().map(item => ({
    id: item.id,
    sort_order: item.sort_order,
    item_text: item.item,
    avance: item.avance,
    updated_at: new Date().toISOString(),
  }));
  await supabaseRequest(`${SUPABASE_DIAGNOSTICO_ENTREGABLES_TABLE}?on_conflict=id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(payload),
  });
}

async function loadDiagnosticoEntregablesFromSupabase() {
  await seedDiagnosticoEntregablesIfEmpty();
  const rows = await supabaseRequest(`${SUPABASE_DIAGNOSTICO_ENTREGABLES_TABLE}?select=id,avance&order=sort_order.asc`);
  const saved = {};
  (rows || []).forEach(row => {
    if (DIAGNOSTICO_ENTREGABLES.some(item => item.id === row.id)) {
      saved[row.id] = Math.max(0, Math.min(100, Number(row.avance) || 0));
    }
  });
  saveDiagnosticoEntregablesLocal(saved);
  return saved;
}

async function saveDiagnosticoEntregableToSupabase(id, avance) {
  const item = DIAGNOSTICO_ENTREGABLES.find(entry => entry.id === id);
  if (!item) return;
  const payload = {
    id,
    sort_order: DIAGNOSTICO_ENTREGABLES.findIndex(entry => entry.id === id),
    item_text: item.item,
    avance: Math.max(0, Math.min(100, Number(avance) || 0)),
    updated_at: new Date().toISOString(),
  };
  await supabaseRequest(`${SUPABASE_DIAGNOSTICO_ENTREGABLES_TABLE}?on_conflict=id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(payload),
  });
}

function renderDiagnosticoEntregables() {
  const items = getDiagnosticoEntregableData();
  return `
  <div class="resource-group card diagnostico-entregables-card">
    <div class="indice-header">
      <div>
        <div class="card-title"><i class="fas fa-file-circle-check" style="margin-right:.5rem;color:#166534"></i>Documentos a Entregar al Finalizar el Diagnostico</div>
        <p class="resource-group-subtitle" style="margin-bottom:0">Segun lineamientos ISEADE. <strong>Fecha de entrega: 1 de junio de 2026.</strong></p>
      </div>
      <span class="project-save-status" id="diagnosticoEntregablesStatus"><i class="fas fa-circle-check"></i> Cargando entregables desde Supabase</span>
    </div>
    <div style="margin-top:1rem;overflow-x:auto">
      <table class="indice-table" style="min-width:680px">
        <thead>
          <tr>
            <th style="width:70%">Documento</th>
            <th style="width:30%">Avance</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
          <tr class="${item.avance >= 100 ? 'is-complete' : ''}">
            <td>
              <span style="display:inline-flex;align-items:center;gap:.55rem">
                <i class="fas ${item.avance >= 100 ? 'fa-circle-check' : 'fa-circle'}" style="color:${item.avance >= 100 ? '#166534' : '#94a3b8'}"></i>
                <span style="${item.avance >= 100 ? 'text-decoration:line-through;color:#7a8799' : ''}">${escapeHtml(item.item)}</span>
              </span>
            </td>
            <td>
              <label class="indice-avance-control">
                <input class="diagnostico-entregable-avance" data-id="${item.id}" type="number" min="0" max="100" step="1" value="${item.avance}">
                <span>%</span>
              </label>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function getIndicePayload(rowId, saved = getIndiceResponsablesSaved()) {
  const row = getIndiceRowById(rowId);
  if (!row) return null;
  return {
    row_id: rowId,
    section_code: row.code,
    item_text: row.item,
    responsable: saved[rowId] || row.responsible,
    avance: Math.max(0, Math.min(100, Number(saved[`avance|${rowId}`]) || 0)),
    updated_at: new Date().toISOString(),
  };
}

async function saveIndiceRowToSupabase(rowId) {
  const payload = getIndicePayload(rowId);
  if (!payload) return;
  await supabaseRequest(`${SUPABASE_INDICE_TABLE}?on_conflict=row_id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(payload),
  });
}

async function seedIndiceSupabaseIfEmpty() {
  const existing = await supabaseRequest(`${SUPABASE_INDICE_TABLE}?select=row_id&limit=1`);
  if (Array.isArray(existing) && existing.length) return;
  const saved = getIndiceResponsablesSaved();
  const payload = getIndiceDataRows().map(row => getIndicePayload(getIndiceRowId(row), saved)).filter(Boolean);
  if (!payload.length) return;
  await supabaseRequest(`${SUPABASE_INDICE_TABLE}?on_conflict=row_id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(payload),
  });
}

async function loadIndiceFromSupabase() {
  await seedIndiceSupabaseIfEmpty();
  const rows = await supabaseRequest(`${SUPABASE_INDICE_TABLE}?select=row_id,responsable,avance`);
  const saved = {};
  (rows || []).forEach(row => {
    const official = getIndiceRowById(row.row_id);
    if (!official) return;
    if (row.responsable && !sameResponsibleList(row.responsable, official.responsible)) {
      saved[row.row_id] = row.responsable;
    }
    const avance = Math.max(0, Math.min(100, Number(row.avance) || 0));
    if (avance > 0) saved[`avance|${row.row_id}`] = avance;
  });
  saveIndiceResponsablesLocal(saved);
  return saved;
}

function getIndiceDashboardSummary() {
  const saved = getIndiceResponsablesSaved();
  const sectionLabels = {
    'DOCUMENTOS DE PRESENTACION': 'Documentos de presentacion',
    'I. ANTECEDENTES DE LA ORGANIZACION': 'I. Antecedentes',
    'II. VISION, MISION, PRINCIPIOS Y VALORES': 'II. Filosofia corporativa',
    'III. ESTRUCTURA ORGANIZACIONAL': 'III. Estructura organizacional',
    'IV. DESCRIPCION DEL FUNCIONAMIENTO DE LA ORGANIZACION': 'IV. Funcionamiento',
    'V. MAPA DE PROCESOS': 'V. Mapa de procesos',
    'VI. DIAGNOSTICO DE LA SITUACION ACTUAL': 'VI. Diagnostico',
    'VII. ORIENTACION DE LA CONSULTORIA A DESARROLLAR': 'VII. Orientacion',
    'ANEXOS Y DOCUMENTOS COMPLEMENTARIOS': 'Anexos complementarios',
  };
  const sections = [];
  let current = null;

  INDICE_RESPONSABLES_ROWS.forEach(row => {
    if (row.type === 'section') {
      current = {
        key: row.title,
        label: sectionLabels[row.title] || row.title,
        total: 0,
        done: 0,
        sum: 0,
      };
      sections.push(current);
      return;
    }

    if (!current) return;
    const rowId = `${row.code}|${row.item}`;
    const avance = Math.max(0, Math.min(100, Number(saved[`avance|${rowId}`]) || 0));
    current.total += 1;
    current.done += avance >= 100 ? 1 : 0;
    current.sum += avance;
  });

  const preparedSections = sections
    .filter(section => section.total > 0)
    .map(section => {
      const percent = Math.round(section.sum / section.total);
      const color = percent >= 75 ? 'green' : percent >= 40 ? 'amber' : 'red';
      return {
        ...section,
        label: `${section.label} (${section.done}/${section.total})`,
        percent,
        color,
      };
    });

  const totals = preparedSections.reduce((acc, section) => {
    acc.total += section.total;
    acc.done += section.done;
    acc.sum += section.sum;
    return acc;
  }, { total: 0, done: 0, sum: 0 });

  return {
    global: totals.total ? Math.round(totals.sum / totals.total) : 0,
    completed: totals.done,
    total: totals.total,
    sections: preparedSections,
  };
}

function normalizeResponsibleList(value) {
  const raw = Array.isArray(value) ? value : String(value || '').split(',');
  const list = raw
    .map(item => item.trim())
    .filter(item => INDICE_RESPONSABLE_OPTIONS.includes(item));
  return list.length ? [...new Set(list)] : ['TODOS'];
}

function sameResponsibleList(a, b) {
  const left = normalizeResponsibleList(a).sort().join('|');
  const right = normalizeResponsibleList(b).sort().join('|');
  return left === right;
}

function renderResponsableSelect(row, saved) {
  const rowId = `${row.code}|${row.item}`;
  const current = normalizeResponsibleList(saved[rowId] || row.responsible)[0];
  return `
    <select class="indice-responsable-select" data-row-id="${rowId}" aria-label="Responsable para ${row.item}">
      ${INDICE_RESPONSABLE_OPTIONS.map(option => `
        <option value="${option}"${option === current ? ' selected' : ''}>${option}</option>
      `).join('')}
    </select>`;
}

function renderAvanceInput(row, saved) {
  const rowId = `${row.code}|${row.item}`;
  const savedValue = saved[`avance|${rowId}`];
  const current = Number.isFinite(Number(savedValue)) ? Number(savedValue) : 0;
  return `
    <label class="indice-avance-control" aria-label="Avance para ${row.item}">
      <input class="indice-avance-input" data-row-id="${rowId}" type="number" min="0" max="100" step="1" value="${current}">
      <span>%</span>
    </label>`;
}

function renderIndiceResponsables() {
  const saved = getIndiceResponsablesSaved();

  return `
  <section class="indice-card">
    <div class="indice-header">
      <div>
        <div class="card-title"><i class="fas fa-table-list" style="margin-right:.5rem"></i>Índice Oficial ISEADE y Responsables</div>
        <p class="card-subtitle">Asignación editable de responsables por sección del informe oficial ISEADE.</p>
      </div>
      <div class="indice-actions">
        <button class="btn-resource indice-reset-btn" id="indiceResetResponsables" type="button">
          <i class="fas fa-rotate-left"></i> Restaurar responsables oficiales
        </button>
      </div>
    </div>

    <div class="indice-legend">
      ${INDICE_RESPONSABLE_OPTIONS.map(option => `<span>${option}</span>`).join('')}
    </div>

    <div class="indice-save-status" id="indiceSaveStatus">
      <i class="fas fa-spinner fa-spin"></i> Conectando con Supabase...
    </div>

    <div class="indice-sync-note">
      <i class="fas fa-circle-info"></i>
      <div>
        <strong>Sincronizacion del equipo:</strong> cada cambio en Avance o Responsable se guarda en Supabase. Si Jaime, Ricardo, Cecilia o Elias abren esta seccion, veran la ultima version registrada por el equipo.
      </div>
    </div>

    <div class="indice-table-wrap">
      <table class="indice-table">
        <thead>
          <tr>
            <th>N</th>
            <th>Sección / contenido oficial ISEADE 2026</th>
            <th>Avance</th>
            <th>Responsable</th>
          </tr>
        </thead>
        <tbody>
          ${INDICE_RESPONSABLES_ROWS.map(row => row.type === 'section' ? `
            <tr class="indice-section-row"><td colspan="4">${row.title}</td></tr>
          ` : `
            <tr>
              <td>${row.code}</td>
              <td>${row.item}</td>
              <td>${renderAvanceInput(row, saved)}</td>
              <td>${renderResponsableSelect(row, saved)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="indice-mobile-list">
      ${INDICE_RESPONSABLES_ROWS.map(row => row.type === 'section' ? `
        <div class="indice-mobile-section">${row.title}</div>
      ` : `
        <article class="indice-mobile-item">
          <div class="indice-mobile-code">${row.code}</div>
          <div class="indice-mobile-content">
            <p>${row.item}</p>
            <div class="indice-mobile-field">
              <span>Avance</span>
              ${renderAvanceInput(row, saved)}
            </div>
            <div class="indice-mobile-field">
              <span>Responsable</span>
              ${renderResponsableSelect(row, saved)}
            </div>
          </div>
        </article>
      `).join('')}
    </div>

    <div class="indice-justificacion">
      <h3>Justificacion de las asignaciones</h3>
      <div class="indice-justificacion-grid">
        ${INDICE_JUSTIFICACIONES.map(item => `
          <div class="indice-justificacion-name ${item.className}">${item.name}</div>
          <div class="indice-justificacion-text">${item.text}</div>
        `).join('')}
      </div>
      <p class="indice-note"><strong>Nota:</strong> Las secciones TODOS requieren insumos de cada consultor; Jaime integra y consolida el documento final. Mision y vision (Ricardo, Secc. II) ya tienen texto redactado — citar como: Vigil Romero, O. D., comunicacion personal, 6 de mayo de 2026.</p>
    </div>
  </section>`;
}

function renderEquipo() {
  const team = [
    { name: 'Cecilia Beatriz Chicas de Escalante', initials: 'CC', role: 'Ing. Industrial · Walmart',                    color: '#1a56a4', email: 'cecilia_cbcg@hotmail.com', tel: '6031-0312' },
    { name: 'Ricardo Alberto Palacios Valladares', initials: 'RP', role: 'Arq. de Interiores · Alcaldía de San Salvador', color: '#0e7490', email: 'ricardoa7@hotmail.com',      tel: '7922-7891' },
    { name: 'Elías José Núñez Menjívar',           initials: 'EN', role: 'Ing. Industrial · Corte Suprema de Justicia',   color: '#7c3aed', email: 'jm.josemenjivar@gmail.com', tel: '7740-3029' },
    { name: 'Jaime Omar López Monge',              initials: 'JL', role: 'Adm. de Empresas · StarDent',                   color: '#b45309', email: 'jolopezsalsv@gmail.com',    tel: '7627-3314', photo: 'jaime-lopez.jpeg' },
  ];
  return `
  <h1 class="section-title">Equipo de Investigación</h1>
  <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:.9rem">
    Equipo Consultor MAE LVIII – ISEADE FEPADE
  </p>
  <div class="team-grid">
    ${team.map(m => `
    <div class="team-card">
      <div class="team-avatar${m.photo ? ' has-photo' : ''}" style="background:${m.color}">
        ${m.photo ? `<img src="${m.photo}" alt="${m.name}" loading="lazy" onerror="this.remove();this.parentElement.classList.remove('has-photo')">` : m.initials}
        ${m.photo ? `<span>${m.initials}</span>` : ''}
      </div>
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
      titulo: 'Etapa I: Diagnostico',
      icon: 'fa-search',
      color: '#1a56a4',
      descripcion: 'Diagnostico inicial de CLIDENTE durante 5 semanas habiles. Incluye comunicacion oficial con la empresa y tutor, levantamiento de informacion, visitas de campo, entrevistas, FODA, Fuerzas de Porter y diagnostico organizacional integral. Entrega oficial: 1 de junio de 2026.',
      entregables: ['Comunicacion oficial a empresa y tutor: 22, 23 y 24 de abril', 'Informe de Diagnostico', 'Analisis FODA y 5 Fuerzas de Porter', 'Diagnostico de Desempeno Ambiental'],
      estado: 'wip'
    },
    {
      n: 2,
      titulo: 'Etapa II: Desarrollo del Trabajo Final',
      icon: 'fa-tasks',
      color: '#0e7490',
      descripcion: 'Desarrollo del trabajo final en un periodo de 10 semanas habiles. Se disena la propuesta de mejora con base en el diagnostico, se definen objetivos, alcances, estrategias, responsables y acciones por area de intervencion. Periodo finaliza: 16 de agosto de 2026.',
      entregables: ['Plan de Trabajo a desarrollar', 'Propuesta de mejora por area', 'Matriz de priorizacion de acciones', 'Cierre de etapa: 16 de agosto de 2026'],
      estado: 'pending'
    },
    {
      n: 3,
      titulo: 'Etapa III: Trabajo de Escritorio',
      icon: 'fa-file-alt',
      color: '#7c3aed',
      descripcion: 'Etapa de escritorio de 2 semanas habiles para integrar, revisar y cerrar el informe final de consultoria. Consolida hallazgos, analisis, recomendaciones, anexos y version final para entrega formal. Entrega: 31 de agosto de 2026.',
      entregables: ['Informe Final de Consultoria', 'Documento final revisado', 'Anexos y soportes consolidados', 'Entrega oficial: 31 de agosto de 2026'],
      estado: 'pending'
    },
    {
      n: 4,
      titulo: 'Presentacion, Evaluacion y Correcciones',
      icon: 'fa-chalkboard-teacher',
      color: '#b45309',
      descripcion: 'Presentacion ante jurado evaluador del 7 al 18 de septiembre de 2026. Posteriormente se entrega el informe final ajustado y empastado en un periodo de 2 semanas despues del envio de correcciones.',
      entregables: ['Presentacion ante jurado evaluador: 7 al 18 de septiembre', 'Correcciones finales', 'Informe final ajustado', 'Entrega empastada posterior a correcciones'],
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

function renderAmbiental() {
  const ambientalPdfUrl = 'https://drive.google.com/file/d/1bJKvFu_RPuOFINvk8oZm7LLF0pDcDMdh/view?usp=sharing';
  const areas = [
    { name: 'Planificacion Ambiental', value: 23, status: 'Cumplimiento No Satisfactorio', detail: '2 respuestas al 100%, 1 al 25% y 7 sin implementar.', color: '#c47a15' },
    { name: 'Cumplimiento de Requisitos', value: 40, status: 'Cumplimiento No Satisfactorio', detail: '2 respuestas al 100% y 3 sin implementar.', color: '#c47a15' },
    { name: 'Operacion y Uso de Recursos', value: 0, status: 'Cumplimiento Nada Satisfactorio', detail: '6 respuestas sin implementar.', color: '#c13030' },
    { name: 'Gestion de Efluentes y Residuos', value: 43, status: 'Cumplimiento No Satisfactorio', detail: '3 respuestas al 100% y 4 sin implementar.', color: '#c47a15' },
  ];
  const gaps = [
    'Definir objetivos, metas, indicadores y politica ambiental formal.',
    'Documentar cumplimiento legal ambiental y compromisos aplicables.',
    'Establecer requisitos ambientales para compras, proveedores y respuesta a emergencias.',
    'Crear programa de gestion de aguas residuales, residuos solidos y emisiones GEI.',
  ];

  return `
  <h1 class="section-title">Diagnostico Ambiental</h1>
  <div class="ambiental-hero">
    <div>
      <div class="ambiental-kicker">Resultado del diagnostico ambiental</div>
      <h2>Desempeno ambiental general: 26%</h2>
      <p>El reporte clasifica a CLIDENTE con <strong>Cumplimiento No Satisfactorio</strong>. La brecha principal esta en operacion, uso de recursos, indicadores, politica ambiental y documentacion del cumplimiento legal.</p>
    </div>
    <a href="${ambientalPdfUrl}" target="_blank" rel="noopener" class="btn-resource ambiental-open">
      <i class="fas fa-file-pdf"></i> Ver PDF fuente
    </a>
  </div>

  <div class="ambiental-summary">
    <div class="ambiental-stat">
      <span class="ambiental-stat-icon"><i class="fas fa-leaf"></i></span>
      <div>
        <div class="ambiental-stat-value">26%</div>
        <div class="ambiental-stat-label">Promedio general de desempeno ambiental</div>
      </div>
    </div>
    <div class="ambiental-stat">
      <span class="ambiental-stat-icon amber"><i class="fas fa-list-check"></i></span>
      <div>
        <div class="ambiental-stat-value">28 preguntas</div>
        <div class="ambiental-stat-label">Escala de cumplimiento de 0% a 100%</div>
      </div>
    </div>
    <div class="ambiental-stat">
      <span class="ambiental-stat-icon blue"><i class="fas fa-chart-radar"></i></span>
      <div>
        <div class="ambiental-stat-value">4 areas</div>
        <div class="ambiental-stat-label">Planificacion, requisitos, recursos y residuos</div>
      </div>
    </div>
  </div>

  <div class="ambiental-metrics-card">
    <div class="card-title"><i class="fas fa-chart-simple" style="margin-right:.5rem"></i>Balance de Desempeno por Area Evaluada</div>
    <div class="ambiental-bars">
      ${areas.map(area => `
      <div class="ambiental-bar-row">
        <div class="ambiental-bar-head">
          <div>
            <strong>${area.name}</strong>
            <span>${area.status}</span>
          </div>
          <b style="color:${area.color}">${area.value}%</b>
        </div>
        <div class="ambiental-bar-track"><span style="width:${area.value}%;background:${area.color}"></span></div>
        <p>${area.detail}</p>
      </div>`).join('')}
    </div>
  </div>

  <div class="ambiental-dashboard-grid">
    <div class="ambiental-metrics-card">
      <div class="card-title"><i class="fas fa-clipboard-check" style="margin-right:.5rem"></i>Lectura Ejecutiva</div>
      <div class="ambiental-score-box">
        <span>26%</span>
        <div>
          <strong>Cumplimiento No Satisfactorio</strong>
          <p>Promedio general del nivel de desempeno ambiental de la organizacion.</p>
        </div>
      </div>
      <ul class="ambiental-clean-list">
        <li><strong>5</strong> respuestas en operacion continua.</li>
        <li><strong>1</strong> respuesta en analisis o diseno.</li>
        <li><strong>22</strong> respuestas sin implementar.</li>
      </ul>
    </div>
    <div class="ambiental-metrics-card">
      <div class="card-title"><i class="fas fa-triangle-exclamation" style="margin-right:.5rem"></i>Brechas Prioritarias</div>
      <ul class="ambiental-clean-list">
        ${gaps.map(gap => `<li>${gap}</li>`).join('')}
      </ul>
    </div>
  </div>`;
}

function renderDesarrolloPlan() {
  const reportItems = [
    'Control de seguimiento quincenal usando el modelo proporcionado por ISEADE.',
    'Plan de trabajo con actividades desglosadas.',
    'Porcentaje de avance en relación con la programación de actividades.',
  ];

  return `
  <h1 class="section-title">Desarrollo Plan de Trabajo</h1>

  <div class="guide-stage-hero">
    <div>
      <div class="guide-stage-kicker">Etapa II · Desarrollo en 10 semanas</div>
      <h2>Realización de actividades</h2>
      <p>Según la guía de Vanessa para MAE 58, esta etapa analiza las posibles alternativas y define las acciones a realizar con base en los objetivos generales y específicos de la consultoría.</p>
    </div>
    <span class="guide-stage-badge"><i class="fas fa-calendar-days"></i> Finaliza: 16 de agosto de 2026</span>
  </div>

  <div class="guide-stage-grid">
    <div class="card">
      <div class="card-title"><i class="fas fa-bullseye" style="margin-right:.5rem"></i>Enfoque de la etapa</div>
      <p class="guide-stage-text">El enfoque principal es fortalecer las capacidades de la empresa mediante el perfeccionamiento de sus estrategias, políticas y procesos.</p>
      <p class="guide-stage-text">Las acciones a realizar deberán ser acordadas con la empresa y, en la medida de lo posible, implementadas durante el proceso de consultoría.</p>
    </div>

    <div class="card">
      <div class="card-title"><i class="fas fa-file-lines" style="margin-right:.5rem"></i>Informes quincenales</div>
      <p class="guide-stage-text">En esta etapa se entregan informes quincenales con evidencia de seguimiento y avance.</p>
      <ul class="guide-stage-list">
        ${reportItems.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><i class="fas fa-clipboard-check" style="margin-right:.5rem"></i>Aplicación para CLIDENTE</div>
    <div class="guide-action-grid">
      <div><span>1</span><strong>Priorizar alternativas</strong><p>Convertir hallazgos del diagnóstico en líneas de acción concretas.</p></div>
      <div><span>2</span><strong>Acordar acciones</strong><p>Validar con CLIDENTE qué acciones son factibles durante la consultoría.</p></div>
      <div><span>3</span><strong>Medir avance</strong><p>Reportar cada quince días actividades, responsables y porcentaje de cumplimiento.</p></div>
    </div>
  </div>`;
}

function renderInformeFinal() {
  const guideItems = [
    'Portada',
    'Índice',
    'Introducción',
    'Resumen Ejecutivo',
    'Elementos relevantes del Diagnóstico y objetivos del trabajo',
    'Metodología a utilizar',
    'Actividades realizadas con enfoque gerencial',
    'Contenido de los productos entregados de la consultoría',
    'Conclusiones',
    'Recomendaciones, incluyendo la recomendación ambiental del diagnóstico',
    'Anexos',
  ];

  return `
  <h1 class="section-title">Elaboración del Informe Final</h1>

  <div class="guide-stage-hero guide-stage-hero-purple">
    <div>
      <div class="guide-stage-kicker">Etapa III · Trabajo de escritorio</div>
      <h2>Guía oficial del informe</h2>
      <p>Contenido tomado de la presentación de instrucciones de Vanessa para MAE 58. Esta estructura ordena el documento final que se entregará a ISEADE.</p>
    </div>
    <span class="guide-stage-badge"><i class="fas fa-calendar-check"></i> Entrega: 31 de agosto de 2026</span>
  </div>

  <div class="card">
    <div class="card-title"><i class="fas fa-list-ol" style="margin-right:.5rem"></i>Estructura requerida</div>
    <div class="final-report-grid">
      ${guideItems.map((item, index) => `
      <div class="final-report-item">
        <span>${index + 1}</span>
        <p>${item}</p>
      </div>`).join('')}
    </div>
    <p class="guide-note"><i class="fas fa-circle-info"></i> La guía indica que se enviará una presentación oficial del informe final con la documentación que se debe presentar.</p>
  </div>

  <div class="guide-stage-grid">
    <div class="card">
      <div class="card-title"><i class="fas fa-compass" style="margin-right:.5rem"></i>Criterio de redacción</div>
      <p class="guide-stage-text">El informe debe conservar enfoque gerencial: diagnóstico, actividades realizadas, productos de consultoría, conclusiones y recomendaciones accionables para la empresa.</p>
    </div>
    <div class="card">
      <div class="card-title"><i class="fas fa-leaf" style="margin-right:.5rem"></i>Recomendación ambiental</div>
      <p class="guide-stage-text">ISEADE solicita incluir dentro de las recomendaciones la recomendación ambiental derivada del diagnóstico ambiental.</p>
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
  const icons = { done:'fa-check-circle', wip:'fa-spinner', pending:'fa-clock' };
  return `
  <h1 class="section-title">Cronograma de la Consultoría</h1>
  <p class="cronograma-intro">Vista general de los hitos principales de la consultoria, desde el inicio formal hasta la entrega final ajustada.</p>

  <div class="cronograma-table-card">
    <div class="cronograma-scroll">
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
    </div>
  </div>

  <div class="cronograma-mobile-list">
    ${rows.map(([period, activity, status], index) => `
      <article class="cronograma-mobile-card status-${status}">
        <div class="cronograma-mobile-marker">
          <span>${index + 1}</span>
          <i class="fas ${icons[status]}"></i>
        </div>
        <div class="cronograma-mobile-body">
          <div class="cronograma-mobile-top">
            <span class="cronograma-period">${period}</span>
            <span class="status-badge status-${status}">${labels[status]}</span>
          </div>
          <p>${activity}</p>
        </div>
      </article>`).join('')}
  </div>`;
}

const CRONOGRAMA_STORAGE_KEY = 'clidente_cronograma_project_v1';
const CRONOGRAMA_START = new Date('2026-04-22T00:00:00');
const CRONOGRAMA_END = new Date('2026-09-18T00:00:00');
const CRONOGRAMA_RESPONSABLES = ['JAIME', 'CECILIA', 'RICARDO', 'ELIAS', 'TODOS'];
const CRONOGRAMA_REPORT_PERIOD = { start: '2026-06-15', end: '2026-06-29' };
const CRONOGRAMA_GRUPOS = ['Fase 0 - Inicio del Trabajo de Graduacion', 'Fase 1 - Diagnostico', 'Fase 2 - Desarrollo Plan de Trabajo', 'Fase 3 - Elaboracion Informe Final', 'Fase 4 - Presentacion y Evaluacion', 'Post-correcciones'];

const CRONOGRAMA_PLAN_TRABAJO_20260615_TASKS = [
  { id: 'cr-f2-20260615-001', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Revisar lineamientos del articulo y comenzar redaccion', descripcion: 'Lineamientos del articulo enviados por Vanessa. Accionable del Plan de trabajo 1de4.', responsable: 'JAIME', avance: 50, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-19' },
  { id: 'cr-f2-20260615-002', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Gestionar firma original del tutor', descripcion: 'Firma original del tutor, sin perforar, en sobre manila. Enviar digital separado del informe.', responsable: 'JAIME', avance: 0, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-19' },
  { id: 'cr-f2-20260615-003', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Completar ficha MINEDUCYT', descripcion: 'Gestionar y completar la ficha del MINEDUCYT en formato Word de Vanessa.', responsable: 'JAIME', avance: 0, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-19' },
  { id: 'cr-f2-20260615-004', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Redactar politica formal de meta minima de produccion por odontologa', descripcion: 'Politica de meta minima de produccion de $2,500 mensuales. Si no se alcanza en 3 meses consecutivos, activar no renovacion de espacio. Compartir a Ricardo listado de odontologos y niveles de produccion para cuantificar costo de silla subutilizada.', responsable: 'JAIME', avance: 50, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-005', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Agendar dos reuniones intermedias con la Dra. Vigil', descripcion: 'Compartir avances antes de la presentacion final.', responsable: 'JAIME', avance: 20, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-006', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Fortalecer analisis de comision escalonada', descripcion: 'Construir el cruce entre costo de silla e ingreso por odontologa.', responsable: 'RICARDO', avance: 50, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-007', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Proyectar impacto financiero de tacticas comerciales y operativas', descripcion: 'Usar datos de Elias (+8% seguimiento post consulta), Cecilia (+15% programa de referidos) y listado de produccion por odontologa de Jaime para cuantificar ingresos mensuales adicionales y costo real de sillas subutilizadas. Presentar proyeccion integrada para reunion del 23 de junio.', responsable: 'RICARDO', avance: 60, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-008', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Agregar media aritmetica en tabla de facturacion', descripcion: 'Desarrollar politica de meta minima de produccion de $2,500 mensuales.', responsable: 'RICARDO', avance: 60, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-009', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Activar campana de referidos', descripcion: 'Contactar por WhatsApp o llamada directa desde telefono de la clinica a los 103 pacientes referidos identificados, con oferta del 10% de descuento por cada nuevo referido.', responsable: 'CECILIA', avance: 50, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-010', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Estimar pacientes adicionales por programa de referidos', descripcion: 'Roberto sugiere incremento del 15% de ocupacion como referencia. Compartir dato con Ricardo para proyectarlo como ingresos mensuales adicionales.', responsable: 'CECILIA', avance: 60, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-011', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Corregir modelo de gestion comercial', descripcion: 'Agregar objetivo medible en dinero o utilidad y responsable nombrado.', responsable: 'CECILIA', avance: 50, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-012', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Estimar pacientes adicionales por seguimiento post atencion', descripcion: 'Reactivar protocolo de seguimiento post atencion. Roberto indica que puede traducirse facilmente en +8% de ocupacion. Compartir dato con Ricardo para proyeccion de ingresos mensuales adicionales.', responsable: 'ELIAS', avance: 50, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-013', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Construir grafica de ingreso real vs potencial perdido', descripcion: 'Grafica de ingreso real contra potencial perdido por capacidad ociosa, expresado en valores mensuales.', responsable: 'ELIAS', avance: 50, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-014', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Cuantificar ahorro por precontratos anuales con proveedores', descripcion: 'Evaluar ahorro estimado de precontratos anuales y reduccion de horas de apertura en horarios de baja demanda.', responsable: 'ELIAS', avance: 50, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-06-23' },
  { id: 'cr-f2-20260615-015', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Registrar horas efectivas de la fase 2', descripcion: 'Comenzar a registrar horas efectivas de esta fase desde ya. No incluir horas del diagnostico.', responsable: 'TODOS', avance: 10, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-08-31' },
  { id: 'cr-f2-20260615-016', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Registrar uso de inteligencia artificial', descripcion: 'Cada vez que se use IA, registrar herramienta, proposito y URL del prompt en el cuadro de la seccion 4.', responsable: 'TODOS', avance: 20, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-08-31' },
  { id: 'cr-f2-20260615-017', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', semana: '15-29 jun', actividad: 'Incluir recomendacion ambiental en informe final', descripcion: 'Al menos una recomendacion ambiental incluida dentro de las recomendaciones del informe final. No es documento aparte.', responsable: 'JAIME, ELIAS', avance: 30, horas: 8, fechaInicio: '2026-06-15', fechaFin: '2026-08-31' },
];

const CRONOGRAMA_DEFAULT_TASKS = [
  { id: 'cr-000', grupo: 'Fase 0 - Inicio del Trabajo de Graduacion', actividad: 'Induccion de reglas del Trabajo de Graduacion', descripcion: 'Sesion inicial con Vanessa e ISEADE para explicar reglas, etapas, entregables, fechas importantes y lineamientos generales del proceso MAE LVIII.', responsable: 'TODOS', avance: 100, fechaMeta: '2026-04-22', fechaRealizada: '2026-04-22' },
  { id: 'cr-001', grupo: 'Fase 0 - Inicio del Trabajo de Graduacion', actividad: 'Comunicacion oficial a empresa y tutor', descripcion: 'Inicio formal del proceso MAE LVIII.', responsable: 'TODOS', avance: 100, fechaMeta: '2026-04-24', fechaRealizada: '2026-04-24' },
  { id: 'cr-002', grupo: 'Fase 0 - Inicio del Trabajo de Graduacion', actividad: 'Asignacion ISEADE a CLIDENTE', descripcion: 'Inicio oficial de la consultoria.', responsable: 'JAIME', avance: 100, fechaMeta: '2026-04-25', fechaRealizada: '2026-04-25' },
  { id: 'cr-003', grupo: 'Fase 1 - Diagnostico', actividad: 'Visita inicial y confidencialidad', descripcion: 'Presentacion con Clidente, reconocimiento de instalaciones y firma de carta de confidencialidad.', responsable: 'JAIME', avance: 100, fechaMeta: '2026-04-30', fechaRealizada: '2026-05-06' },
  { id: 'cr-004', grupo: 'Fase 1 - Diagnostico', actividad: 'Reunion 1 con Tutor Roberto', descripcion: 'Asignacion de roles por area y lineamientos de trabajo.', responsable: 'TODOS', avance: 100, fechaMeta: '2026-05-12', fechaRealizada: '2026-05-12' },
  { id: 'cr-005', grupo: 'Fase 1 - Diagnostico', actividad: 'Visita de campo: organizacion y area comercial', descripcion: 'Validar organigrama, CRM, clientes, canales y area comercial.', responsable: 'CECILIA', avance: 90, fechaMeta: '2026-05-17', fechaRealizada: '2026-05-16' },
  { id: 'cr-006', grupo: 'Fase 1 - Diagnostico', actividad: 'Visita de campo: operaciones y finanzas', descripcion: 'Inventarios, procesos, journey del paciente y documentacion financiera.', responsable: 'RICARDO', avance: 80, fechaMeta: '2026-05-23', fechaRealizada: '2026-05-21' },
  { id: 'cr-006b', grupo: 'Fase 1 - Diagnostico', actividad: 'Visita de campo 3: observacion sin aviso', descripcion: 'Visita realizada el sabado 23 de mayo para observar operacion real, conteo de pacientes, ticket promedio y journey del paciente.', responsable: 'JAIME, CECILIA', avance: 100, fechaMeta: '2026-05-23', fechaRealizada: '2026-05-23' },
  { id: 'cr-006c', grupo: 'Fase 1 - Diagnostico', actividad: 'Visita de campo 4: diagnostico ambiental', descripcion: 'Visita realizada por Elias el sabado 23 de mayo. Henry envio la informacion base del diagnostico ambiental.', responsable: 'ELIAS', avance: 100, fechaMeta: '2026-05-23', fechaRealizada: '2026-05-23' },
  { id: 'cr-007', grupo: 'Fase 1 - Diagnostico', actividad: 'Entrega interna del diagnostico al tutor', descripcion: 'Version consolidada para revision del tutor, al menos 8 dias antes de la entrega ISEADE.', responsable: 'JAIME', avance: 65, fechaMeta: '2026-05-24', fechaRealizada: '' },
  { id: 'cr-008', grupo: 'Fase 1 - Diagnostico', actividad: 'Reunion 2 con Tutor Roberto', descripcion: 'Presentacion consolidada de elementos solicitados por integrante y revision de soportes.', responsable: 'TODOS', avance: 0, fechaMeta: '2026-05-26', fechaRealizada: '' },
  { id: 'cr-009', grupo: 'Fase 1 - Diagnostico', actividad: 'Entrega ISEADE: diagnostico', descripcion: 'Entrega fisica anillada y digital del informe de diagnostico.', responsable: 'JAIME', avance: 0, fechaMeta: '2026-06-01', fechaRealizada: '' },
  { id: 'cr-010', grupo: 'Fase 2 - Desarrollo Plan de Trabajo', actividad: 'Desarrollo del plan de trabajo', descripcion: 'Ejecucion de acciones acordadas, seguimiento quincenal y medicion de avances.', responsable: 'TODOS', avance: 0, fechaMeta: '2026-08-16', fechaRealizada: '' },
  ...CRONOGRAMA_PLAN_TRABAJO_20260615_TASKS,
  { id: 'cr-011', grupo: 'Fase 3 - Elaboracion Informe Final', actividad: 'Entrega interna informe final al tutor', descripcion: 'Documento final para revision del tutor, 8 dias antes de ISEADE.', responsable: 'JAIME', avance: 0, fechaMeta: '2026-08-23', fechaRealizada: '' },
  { id: 'cr-012', grupo: 'Fase 3 - Elaboracion Informe Final', actividad: 'Entrega ISEADE: informe final', descripcion: 'Trabajo de escritorio final y documentacion completa.', responsable: 'TODOS', avance: 0, fechaMeta: '2026-08-31', fechaRealizada: '' },
  { id: 'cr-013', grupo: 'Fase 4 - Presentacion y Evaluacion', actividad: 'Presentacion ante jurado evaluador', descripcion: 'Exposicion ejecutiva del informe final de consultoria.', responsable: 'TODOS', avance: 0, fechaMeta: '2026-09-07', fechaRealizada: '' },
  { id: 'cr-014', grupo: 'Post-correcciones', actividad: 'Informe final ajustado y empastado', descripcion: 'Entrega posterior a correcciones del jurado.', responsable: 'JAIME', avance: 0, fechaMeta: '2026-09-18', fechaRealizada: '' },
];

let cronogramaRemoteLoadSignature = '';
let cronogramaRemoteLoadPending = false;
let cronogramaJustSaved = false;

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addCronogramaDays(dateValue, days) {
  if (!dateValue) return '';
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + Math.max(0, (Number(days) || 1) - 1));
  return date.toISOString().slice(0, 10);
}

function getCronogramaDaysFromHours(hours) {
  return Math.max(1, Math.ceil((Number(hours) || 0) / 8));
}

function diffCronogramaDays(startValue, endValue) {
  if (!startValue || !endValue) return 1;
  const start = new Date(`${startValue}T00:00:00`);
  const end = new Date(`${endValue}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

function normalizeCronogramaTask(task = {}, index = 0) {
  const fechaInicio = task.fechaInicio || task.fecha_inicio || task.fechaMeta || task.fecha_meta || '';
  const fechaFinOriginal = task.fechaFin || task.fecha_fin || task.fechaRealizada || task.fecha_realizada || '';
  const legacyDays = Math.max(1, Number(task.dias) || diffCronogramaDays(fechaInicio, fechaFinOriginal));
  const horasValue = task.horas ?? task.hours;
  const horas = Math.max(0, horasValue === undefined || horasValue === null || horasValue === '' ? (legacyDays * 8) : Number(horasValue));
  const dias = getCronogramaDaysFromHours(horas);
  const fechaFin = fechaFinOriginal;
  return {
    id: task.id || `cr-${Date.now()}-${index}`,
    grupo: task.grupo || 'Fase 1 - Diagnostico',
    semana: task.semana || task.week || '',
    actividad: task.actividad || 'Nueva actividad',
    descripcion: task.descripcion || '',
    responsable: task.responsable || 'TODOS',
    avance: Math.max(0, Math.min(100, Number(task.avance) || 0)),
    horas,
    dias,
    fechaInicio,
    fechaFin,
    fechaMeta: fechaInicio,
    fechaRealizada: fechaFin,
    documentos: task.documentos || '',
  };
}

function normalizeCronogramaTasks(tasks) {
  return (Array.isArray(tasks) ? tasks : CRONOGRAMA_DEFAULT_TASKS).map(normalizeCronogramaTask);
}


function normalizeCronogramaComparableText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function isCronogramaImportedTaskPresent(tasks, importedTask) {
  const importedActivity = normalizeCronogramaComparableText(importedTask.actividad);
  const importedCombined = normalizeCronogramaComparableText(`${importedTask.actividad} ${importedTask.descripcion}`);
  const importedWords = importedActivity.split(' ').filter(word => word.length > 4);
  return tasks.some(task => {
    if (task.id === importedTask.id) return true;
    const activity = normalizeCronogramaComparableText(task.actividad);
    const combined = normalizeCronogramaComparableText(`${task.actividad} ${task.descripcion}`);
    if (activity && importedActivity && (activity.includes(importedActivity) || importedActivity.includes(activity))) return true;
    if (combined && importedCombined && (combined.includes(importedActivity) || importedCombined.includes(activity))) return true;
    const matches = importedWords.filter(word => combined.includes(word)).length;
    return importedWords.length >= 3 && matches >= Math.min(3, importedWords.length);
  });
}

function mergeCronogramaImportedTasks(tasks) {
  const normalized = normalizeCronogramaTasks(tasks);
  const imported = normalizeCronogramaTasks(CRONOGRAMA_PLAN_TRABAJO_20260615_TASKS);
  const missing = imported.filter(task => !isCronogramaImportedTaskPresent(normalized, task));
  return missing.length ? [...normalized, ...missing] : normalized;
}

function getCronogramaTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(CRONOGRAMA_STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? normalizeCronogramaTasks(saved) : normalizeCronogramaTasks(CRONOGRAMA_DEFAULT_TASKS);
  } catch {
    return normalizeCronogramaTasks(CRONOGRAMA_DEFAULT_TASKS);
  }
}

function saveCronogramaTasksLocal(tasks) {
  localStorage.setItem(CRONOGRAMA_STORAGE_KEY, JSON.stringify(normalizeCronogramaTasks(tasks)));
}

function setCronogramaStatus(text, icon = 'circle-check', state = 'ok') {
  const status = document.getElementById('cronogramaSaveStatus');
  if (!status) return;
  status.classList.toggle('is-working', state === 'working');
  status.classList.toggle('is-error', state === 'error');
  status.innerHTML = `<i class="fas fa-${icon}"></i> ${text}`;
}

function getCronogramaPayload(tasks) {
  return normalizeCronogramaTasks(tasks).map((task, index) => ({
    id: task.id,
    sort_order: index,
    grupo: task.grupo,
    semana: task.semana || '',
    actividad: task.actividad,
    descripcion: task.descripcion,
    responsable: task.responsable,
    avance: task.avance,
    horas: task.horas,
    dias: task.dias,
    fecha_inicio: task.fechaInicio || null,
    fecha_fin: task.fechaFin || null,
    fecha_meta: task.fechaMeta || null,
    fecha_realizada: task.fechaRealizada || null,
    documentos: task.documentos || '',
    updated_at: new Date().toISOString(),
  }));
}

function getCronogramaTasksFromSupabaseRows(rows = []) {
  return rows
    .slice()
    .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0))
    .map((row, index) => normalizeCronogramaTask({
      id: row.id,
      grupo: row.grupo,
      semana: row.semana,
      actividad: row.actividad,
      descripcion: row.descripcion,
      responsable: row.responsable,
      avance: row.avance,
      horas: row.horas,
      dias: row.dias,
      fechaInicio: row.fecha_inicio,
      fechaFin: row.fecha_fin,
      fechaMeta: row.fecha_meta,
      fechaRealizada: row.fecha_realizada,
      documentos: row.documentos,
    }, index));
}

async function seedCronogramaSupabaseIfEmpty() {
  const existing = await supabaseRequest(`${SUPABASE_CRONOGRAMA_TABLE}?select=id&limit=1`);
  if (Array.isArray(existing) && existing.length) return;
  await supabaseRequest(`${SUPABASE_CRONOGRAMA_TABLE}?on_conflict=id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(getCronogramaPayload(getCronogramaTasks())),
  });
}

async function loadCronogramaFromSupabase() {
  await seedCronogramaSupabaseIfEmpty();
  const rows = await supabaseRequest(`${SUPABASE_CRONOGRAMA_TABLE}?select=*&order=sort_order.asc`);
  const tasks = getCronogramaTasksFromSupabaseRows(rows || []);
  const baseTasks = tasks.length ? tasks : normalizeCronogramaTasks(CRONOGRAMA_DEFAULT_TASKS);
  const mergedTasks = mergeCronogramaImportedTasks(baseTasks);
  saveCronogramaTasksLocal(mergedTasks);
  if (mergedTasks.length !== baseTasks.length) {
    await saveCronogramaToSupabase(mergedTasks);
  }
  return mergedTasks;
}

async function deleteCronogramaRemoteIds(ids) {
  await Promise.all(ids.map(id => supabaseRequest(`${SUPABASE_CRONOGRAMA_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
  })));
}

async function saveCronogramaToSupabase(tasks) {
  const normalized = normalizeCronogramaTasks(tasks);
  const payload = getCronogramaPayload(normalized);
  try {
    await supabaseRequest(`${SUPABASE_CRONOGRAMA_TABLE}?on_conflict=id`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (!String(error.message || '').includes('semana') && !String(error.message || '').includes('horas') && !String(error.message || '').includes('dias') && !String(error.message || '').includes('fecha_inicio') && !String(error.message || '').includes('fecha_fin')) {
      throw error;
    }
    const legacyPayload = payload.map(({ semana, horas, dias, fecha_inicio, fecha_fin, ...row }) => row);
    await supabaseRequest(`${SUPABASE_CRONOGRAMA_TABLE}?on_conflict=id`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(legacyPayload),
    });
  }

  const existing = await supabaseRequest(`${SUPABASE_CRONOGRAMA_TABLE}?select=id`);
  const currentIds = new Set(normalized.map(task => task.id));
  const staleIds = (existing || []).map(row => row.id).filter(id => !currentIds.has(id));
  if (staleIds.length) await deleteCronogramaRemoteIds(staleIds);
}

function getCronogramaStatus(task) {
  if (Number(task.avance) >= 100 && task.fechaRealizada) return ['done', 'Completado'];
  if (Number(task.avance) > 0) return ['wip', 'En progreso'];
  return ['pending', 'Pendiente'];
}

function getCronogramaProgressClass(avance, prefix = 'project') {
  const value = Math.max(0, Math.min(100, Number(avance) || 0));
  if (value >= 80) return `${prefix}-progress-green`;
  if (value >= 40) return `${prefix}-progress-yellow`;
  return `${prefix}-progress-red`;
}

function getCronogramaProgressColors(avance) {
  const value = Math.max(0, Math.min(100, Number(avance) || 0));
  if (value >= 80) return { fill: '#ecfdf5', border: '#bbf7d0', accent: '#059669' };
  if (value >= 40) return { fill: '#fffbeb', border: '#fde68a', accent: '#d97706' };
  return { fill: '#fff1f2', border: '#fecdd3', accent: '#dc2626' };
}

function getCronogramaWordCellStyle(avance, firstCell = false) {
  const colors = getCronogramaProgressColors(avance);
  return `background:${colors.fill};background-color:${colors.fill};border-color:${colors.border};${firstCell ? `border-left:4pt solid ${colors.accent};` : ''}`;
}

function getGanttLeft(dateValue) {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : CRONOGRAMA_START;
  const total = CRONOGRAMA_END - CRONOGRAMA_START;
  const current = Math.max(0, Math.min(total, date - CRONOGRAMA_START));
  return Math.round((current / total) * 100);
}

function renderCronograma() {
  const tasks = getCronogramaTasks();

  return `
  <h1 class="section-title">Cronograma de la Consultoria</h1>
  <p class="cronograma-intro">Cronograma editable tipo Microsoft Project para registrar actividades, responsables, avance, horas, fechas y documentos de soporte. La fecha fin se registra manualmente para reflejar el compromiso real de entrega.</p>

  <div class="project-toolbar">
    <button class="btn-resource" id="cronogramaExportExcel" type="button"><i class="fas fa-file-excel"></i> Exportar Excel ejecutivo</button>
    <button class="btn-resource" id="cronogramaExportWord" type="button"><i class="fas fa-file-word"></i> Exportar a Word</button>
    <button class="btn-resource project-reset-btn" id="cronogramaReset" type="button"><i class="fas fa-rotate-left"></i> Restaurar base</button>
    <span class="project-save-status" id="cronogramaSaveStatus"><i class="fas fa-circle-check"></i> Cargando cronograma desde Supabase</span>
  </div>

  <div class="project-top-scroll" id="projectTopScroll" aria-hidden="true">
    <div></div>
  </div>
  <div class="project-card">
    <div class="project-grid project-grid-header">
      <div>#</div>
      <div>Fase</div>
      <div>Actividad</div>
      <div>Entregable / Hito</div>
      <div>Responsable</div>
      <div>Avance</div>
      <div>Semana</div>
      <div>Fecha inicio</div>
      <div>Horas</div>
      <div>Fecha fin</div>
      <div>Documentos</div>
      <div>Estado</div>
      <div>Gantt</div>
      <div>Acción</div>
    </div>
    ${tasks.map((task, index) => {
      const [status, label] = getCronogramaStatus(task);
      const left = getGanttLeft(task.fechaInicio);
      const width = Math.max(3, Math.min(100 - left, Number(task.avance) || 3));
      const showGroup = index === 0 || task.grupo !== tasks[index - 1]?.grupo;
      return `
      ${showGroup ? `<div class="project-group-row">${escapeHtml(task.grupo || 'Sin fase')}</div>` : ''}
      <div class="project-grid project-grid-row ${getCronogramaProgressClass(task.avance)}" data-task-id="${task.id}">
        <div class="project-index">${index + 1}</div>
        <select data-field="grupo">
          ${CRONOGRAMA_GRUPOS.map(name => `<option value="${name}"${(task.grupo || 'Fase 1 - Diagnostico') === name ? ' selected' : ''}>${name}</option>`).join('')}
        </select>
        <textarea data-field="actividad" rows="2">${escapeHtml(task.actividad)}</textarea>
        <textarea data-field="descripcion" rows="2">${escapeHtml(task.descripcion)}</textarea>
        <select data-field="responsable" multiple size="5" class="project-responsable-multiple" aria-label="Responsables de ${escapeHtml(task.actividad)}">
          ${CRONOGRAMA_RESPONSABLES.map(name => `<option value="${name}"${normalizeResponsibleList(task.responsable).includes(name) ? ' selected' : ''}>${name}</option>`).join('')}
        </select>
        <label class="project-percent"><input data-field="avance" type="number" min="0" max="100" step="1" value="${Number(task.avance) || 0}"><span>%</span></label>
        <input data-field="semana" type="text" value="${escapeHtml(task.semana || '')}" placeholder="1-2">
        <input data-field="fechaInicio" type="date" value="${task.fechaInicio || ''}">
        <input data-field="horas" type="number" min="0" step="1" value="${Number(task.horas) || 0}">
        <input data-field="fechaFin" type="date" value="${task.fechaFin || ''}">
        <textarea data-field="documentos" rows="2" placeholder="Pega links de Drive, PDFs o notas de soporte">${escapeHtml(task.documentos || '')}</textarea>
        <span class="status-badge status-${status}">${label}</span>
        <div class="project-gantt-cell">
          <div class="project-gantt-track"><span style="left:${left}%;width:${width}%"></span></div>
        </div>
        <div class="project-actions">
          <button class="project-row-action project-move-up" type="button" title="Subir actividad"><i class="fas fa-arrow-up"></i></button>
          <button class="project-row-action project-move-down" type="button" title="Bajar actividad"><i class="fas fa-arrow-down"></i></button>
          <button class="project-row-action project-insert-after" type="button" title="Insertar actividad debajo"><i class="fas fa-plus"></i></button>
          <button class="project-row-action project-delete" type="button" title="Eliminar actividad"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

/* ── SECTION MAP ───────────────────────────────────────────── */
const SECTIONS = {
  'cartelera':      { label: 'Cartelera',            render: renderCartelera },
  'equipo':         { label: 'Equipo',               render: renderEquipo },
  'fases':          { label: 'Fases del Proyecto',   render: renderFases },
  'ambiental':      { label: 'Diagnóstico Ambiental', render: renderAmbiental },
  'sobre-proyecto': { label: 'Sobre el Proyecto',    render: renderSobreProyecto },
  'visitas':        { label: 'Visitas a CLIDENTE',   render: renderVisitas },
  'reuniones':      { label: 'Reuniones con Tutor',  render: renderReuniones },
  'diagnostico':    { label: 'Diagnóstico',          render: renderDiagnostico },
  'desarrollo-plan': { label: 'Desarrollo Plan de Trabajo', render: renderDesarrolloPlan },
  'informe-final':  { label: 'Elaboración del Informe Final', render: renderInformeFinal },
  'cronograma':     { label: 'Cronograma',           render: renderCronograma },
};

/* ── NAVIGATION ────────────────────────────────────────────── */
function navigate(sectionId) {
  const section = SECTIONS[sectionId];
  if (!section) return;
  closeSidebar();

  // Render content
  const area = document.getElementById('contentArea');
  area.classList.toggle('content-area-wide', sectionId === 'cronograma');
  area.innerHTML = `<div class="fade-in">${section.render()}</div>`;

  // Update breadcrumb
  document.getElementById('breadcrumb').textContent = `Portal › ${section.label}`;

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionId);
  });

  // Init tabs if present
  initTabs();
  initIndiceResponsables();
  initOrganigramaPdfButton();
  initDiagnosticPdfButton();
  initDiagnosticoEntregables();
  initCronogramaProject();

  // Animate progress bars
  requestAnimationFrame(() => {
    document.querySelectorAll('.progress-bar-fill[style]').forEach(el => {
      const w = el.style.width;
      el.style.width = '0';
      requestAnimationFrame(() => { el.style.width = w; });
    });
    document.querySelectorAll('.mp-prog-fill[data-w]').forEach(el => {
      el.style.width = '0%';
      requestAnimationFrame(() => { el.style.width = el.dataset.w; });
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

function initIndiceResponsables() {
  const selects = document.querySelectorAll('.indice-responsable-select');
  const avances = document.querySelectorAll('.indice-avance-input');
  if (!selects.length && !avances.length) return;

  const status = document.getElementById('indiceSaveStatus');
  const updateStatus = (text, icon = 'circle-check') => {
    if (status) status.innerHTML = `<i class="fas fa-${icon}"></i> ${text}`;
  };
  const updateStatusError = text => {
    if (status) status.innerHTML = `<i class="fas fa-triangle-exclamation"></i> ${text}`;
  };

  const applySavedToDom = saved => {
    getIndiceDataRows().forEach(row => {
      const rowId = getIndiceRowId(row);
      document.querySelectorAll(`.indice-responsable-select[data-row-id="${CSS.escape(rowId)}"]`).forEach(select => {
        select.value = saved[rowId] || row.responsible;
      });
      const avance = Number(saved[`avance|${rowId}`]) || 0;
      document.querySelectorAll(`.indice-avance-input[data-row-id="${CSS.escape(rowId)}"]`).forEach(input => {
        input.value = avance;
      });
    });
  };

  const saveLocalAndRemote = async rowId => {
    updateStatus('Guardando en Supabase...', 'spinner fa-spin');
    try {
      await saveIndiceRowToSupabase(rowId);
      updateStatus('Cambios sincronizados en Supabase');
    } catch (error) {
      console.error(error);
      updateStatusError('Guardado local. Revisa que la tabla de Supabase exista y tenga politicas RLS.');
    }
  };

  loadIndiceFromSupabase()
    .then(saved => {
      applySavedToDom(saved);
      updateStatus('Datos cargados desde Supabase');
    })
    .catch(error => {
      console.error(error);
      updateStatusError('Sin conexion a Supabase. Usando respaldo local del navegador.');
    });

  selects.forEach(select => {
    select.addEventListener('change', () => {
      const rowId = select.dataset.rowId;
      const official = INDICE_RESPONSABLES_BY_ID[rowId]?.responsible;
      const saved = getIndiceResponsablesSaved();

      if (sameResponsibleList(select.value, official)) {
        delete saved[rowId];
      } else {
        saved[rowId] = select.value;
      }

      saveIndiceResponsablesLocal(saved);
      document.querySelectorAll(`.indice-responsable-select[data-row-id="${CSS.escape(rowId)}"]`).forEach(peer => {
        if (peer !== select) peer.value = select.value;
      });
      saveLocalAndRemote(rowId);
    });
  });

  avances.forEach(input => {
    input.addEventListener('change', () => {
      const rowId = input.dataset.rowId;
      const saved = getIndiceResponsablesSaved();
      const value = Math.max(0, Math.min(100, Number(input.value) || 0));
      input.value = value;

      if (value === 0) {
        delete saved[`avance|${rowId}`];
      } else {
        saved[`avance|${rowId}`] = value;
      }

      saveIndiceResponsablesLocal(saved);
      document.querySelectorAll(`.indice-avance-input[data-row-id="${CSS.escape(rowId)}"]`).forEach(peer => {
        if (peer !== input) peer.value = value;
      });
      saveLocalAndRemote(rowId);
    });
  });

  const reset = document.getElementById('indiceResetResponsables');
  if (reset) {
    reset.addEventListener('click', async () => {
      localStorage.removeItem(INDICE_RESPONSABLES_STORAGE_KEY);
      updateStatus('Restaurando valores oficiales...', 'spinner fa-spin');
      try {
        const payload = getIndiceDataRows().map(row => ({
          row_id: getIndiceRowId(row),
          section_code: row.code,
          item_text: row.item,
          responsable: row.responsible,
          avance: 0,
          updated_at: new Date().toISOString(),
        }));
        await supabaseRequest(`${SUPABASE_INDICE_TABLE}?on_conflict=row_id`, {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error(error);
      }
      navigate('equipo');
    });
  }
}

function readCronogramaFromDom() {
  return Array.from(document.querySelectorAll('.project-grid-row')).map(row => {
    const field = name => row.querySelector(`[data-field="${name}"]`);
    const responsables = Array.from(field('responsable')?.selectedOptions || []).map(option => option.value);
    const fechaInicio = field('fechaInicio')?.value || '';
    const horas = Math.max(0, Number(field('horas')?.value) || 0);
    const dias = getCronogramaDaysFromHours(horas);
    const fechaFin = field('fechaFin')?.value || '';
    return {
      id: row.dataset.taskId,
      grupo: field('grupo')?.value || 'Fase 1 - Diagnostico',
      actividad: field('actividad')?.value.trim() || 'Nueva actividad',
      descripcion: field('descripcion')?.value.trim() || '',
      responsable: (responsables.length ? responsables : ['TODOS']).join(', '),
      avance: Math.max(0, Math.min(100, Number(field('avance')?.value) || 0)),
      semana: field('semana')?.value.trim() || '',
      horas,
      dias,
      fechaInicio,
      fechaFin,
      fechaMeta: fechaInicio,
      fechaRealizada: fechaFin,
      documentos: field('documentos')?.value.trim() || '',
    };
  });
}

function saveCronogramaTasks(tasks) {
  const normalized = normalizeCronogramaTasks(tasks);
  saveCronogramaTasksLocal(normalized);
  setCronogramaStatus('Guardando cronograma en Supabase...', 'spinner fa-spin', 'working');
  return saveCronogramaToSupabase(normalized)
    .then(() => {
      cronogramaRemoteLoadSignature = JSON.stringify(normalized);
      cronogramaJustSaved = true;
      setCronogramaStatus('Cambios sincronizados en Supabase');
      return normalized;
    })
    .catch(error => {
      console.error(error);
      setCronogramaStatus('Guardado local. Revisa que la tabla cronograma_actividades exista y tenga politicas RLS.', 'triangle-exclamation', 'error');
      return normalized;
    });
}

function createBlankCronogramaTask() {
  return {
    id: `cr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    grupo: 'Fase 1 - Diagnostico',
    actividad: 'Nueva actividad',
    descripcion: '',
    responsable: 'TODOS',
    avance: 0,
    semana: '',
    horas: 8,
    dias: 1,
    fechaInicio: '',
    fechaFin: '',
    fechaMeta: '',
    fechaRealizada: '',
    documentos: '',
  };
}

function exportCronogramaExcel(tasks) {
  const generatedAt = new Date().toLocaleDateString('es-SV', { day: '2-digit', month: 'long', year: 'numeric' });
  const summary = getCronogramaSummary(tasks);
  const groups = groupCronogramaTasks(tasks);
  const phaseRows = Object.entries(groups).map(([phase, phaseTasks]) => {
    const phaseSummary = getCronogramaSummary(phaseTasks);
    const nextDate = phaseTasks
      .map(task => task.fechaInicio)
      .filter(Boolean)
      .sort()[0] || '';
    return `
      <tr>
        <td>${escapeHtml(phase)}</td>
        <td class="center">${phaseSummary.total}</td>
        <td class="center">${phaseSummary.average}%</td>
        <td class="center">${phaseSummary.done}</td>
        <td class="center">${phaseSummary.wip}</td>
        <td class="center">${phaseSummary.pending}</td>
        <td>${formatCronogramaDate(nextDate)}</td>
      </tr>`;
  }).join('');

  const upcomingRows = tasks
    .filter(task => getCronogramaStatus(task)[0] !== 'done')
    .slice()
    .sort((a, b) => String(a.fechaInicio || '9999-12-31').localeCompare(String(b.fechaInicio || '9999-12-31')))
    .slice(0, 8)
    .map(task => {
      const [, status] = getCronogramaStatus(task);
      return `
      <tr>
        <td>${formatCronogramaDate(task.fechaInicio)}</td>
        <td>${escapeHtml(task.grupo || '')}</td>
        <td>${escapeHtml(task.actividad || '')}</td>
        <td class="center">${escapeHtml(task.responsable || '')}</td>
        <td class="center">${Number(task.avance) || 0}%</td>
        <td class="status-${status.toLowerCase().replace(/\s+/g, '-')}">${status}</td>
      </tr>`;
    }).join('');

  const detailRows = tasks.map((task, index) => {
    const [, status] = getCronogramaStatus(task);
    const statusClass = status === 'Completado' ? 'status-completado' : status === 'En progreso' ? 'status-en-progreso' : 'status-pendiente';
    return `
      <tr>
        <td class="center">${index + 1}</td>
        <td>${escapeHtml(task.grupo || '')}</td>
        <td>${escapeHtml(task.actividad || '')}</td>
        <td>${escapeHtml(task.descripcion || '')}</td>
        <td class="center">${escapeHtml(task.responsable || '')}</td>
        <td class="center">${Number(task.avance) || 0}%</td>
        <td class="center">${escapeHtml(task.semana || '')}</td>
        <td>${formatCronogramaDate(task.fechaInicio)}</td>
        <td class="center">${Number(task.horas) || 0}</td>
        <td>${formatCronogramaDate(task.fechaFin)}</td>
        <td class="${statusClass}">${status}</td>
        <td>${escapeHtml(task.documentos || 'Sin documentos registrados')}</td>
      </tr>`;
  }).join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="UTF-8">
    <!--[if gte mso 9]><xml>
      <x:ExcelWorkbook>
        <x:ExcelWorksheets>
          <x:ExcelWorksheet><x:Name>Resumen Ejecutivo</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          <x:ExcelWorksheet><x:Name>Detalle Cronograma</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets>
      </x:ExcelWorkbook>
    </xml><![endif]-->
    <style>
      body { font-family: Arial, sans-serif; color: #1f2937; }
      table { border-collapse: collapse; width: 100%; }
      th { background: #1a56a4; border: 1px solid #123d73; color: #fff; font-size: 12px; padding: 8px; text-align: left; text-transform: uppercase; }
      td { border: 1px solid #cfd9e6; font-size: 12px; padding: 7px; vertical-align: top; }
      .title { background: #123d73; color: #fff; font-size: 22px; font-weight: 700; padding: 14px; }
      .subtitle { background: #e8f0fb; color: #123d73; font-size: 13px; font-weight: 700; padding: 9px; }
      .section { background: #dbeafe; color: #123d73; font-size: 14px; font-weight: 700; padding: 9px; }
      .kpi { background: #edf4ff; color: #123d73; font-size: 20px; font-weight: 700; text-align: center; }
      .kpi-label { background: #f8fafc; color: #5d6f89; font-size: 11px; font-weight: 700; text-align: center; text-transform: uppercase; }
      .center { text-align: center; }
      .status-completado { background: #dcfce7; color: #166534; font-weight: 700; text-align: center; }
      .status-en-progreso { background: #fef3c7; color: #854d0e; font-weight: 700; text-align: center; }
      .status-pendiente { background: #dbeafe; color: #1a56a4; font-weight: 700; text-align: center; }
      .note { color: #5d6f89; font-size: 11px; }
    </style>
  </head>
  <body>
    <table>
      <tr><td class="title" colspan="7">Cronograma de la Consultoria - CLIDENTE</td></tr>
      <tr><td class="subtitle" colspan="7">Resumen ejecutivo generado desde el Portal TDG - ${generatedAt}</td></tr>
      <tr><td class="note" colspan="7">Criterio de seguimiento: entregas internas al tutor al menos 8 dias antes de las fechas oficiales solicitadas por ISEADE.</td></tr>
      <tr><td colspan="7"></td></tr>
      <tr>
        <td class="kpi">${summary.total}</td>
        <td class="kpi">${summary.average}%</td>
        <td class="kpi">${summary.done}</td>
        <td class="kpi">${summary.wip}</td>
        <td class="kpi">${summary.pending}</td>
        <td class="kpi" colspan="2">${Object.keys(groups).length}</td>
      </tr>
      <tr>
        <td class="kpi-label">Actividades</td>
        <td class="kpi-label">Avance promedio</td>
        <td class="kpi-label">Completadas</td>
        <td class="kpi-label">En progreso</td>
        <td class="kpi-label">Pendientes</td>
        <td class="kpi-label" colspan="2">Fases</td>
      </tr>
      <tr><td colspan="7"></td></tr>
      <tr><td class="section" colspan="7">Avance por fase</td></tr>
      <tr>
        <th>Fase</th><th>Actividades</th><th>Avance promedio</th><th>Completadas</th><th>En progreso</th><th>Pendientes</th><th>Primera fecha inicio</th>
      </tr>
      ${phaseRows}
      <tr><td colspan="7"></td></tr>
      <tr><td class="section" colspan="7">Proximos hitos pendientes</td></tr>
      <tr>
        <th>Fecha inicio</th><th>Fase</th><th>Actividad</th><th>Responsable</th><th>Avance</th><th colspan="2">Estado</th>
      </tr>
      ${upcomingRows || '<tr><td colspan="7" class="center">No hay hitos pendientes registrados.</td></tr>'}
    </table>

    <br style="mso-special-character:line-break;page-break-before:always">

    <table>
      <tr><td class="title" colspan="12">Detalle del Cronograma</td></tr>
      <tr>
        <th>N</th><th>Fase</th><th>Actividad</th><th>Entregable / Hito</th><th>Responsable</th><th>Avance</th><th>Semana</th><th>Fecha inicio</th><th>Horas</th><th>Fecha fin</th><th>Estado</th><th>Documentos</th>
      </tr>
      ${detailRows}
    </table>
  </body>
  </html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'cronograma-ejecutivo-clidente.xls';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function formatCronogramaDate(dateValue) {
  if (!dateValue) return 'Pendiente';
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString('es-SV', { day: '2-digit', month: 'long', year: 'numeric' });
}

function getAssetDataUri(assetPath) {
  return fetch(assetPath, { cache: 'force-cache' })
    .then(response => {
      if (!response.ok) throw new Error(`No se pudo cargar ${assetPath}`);
      return response.blob();
    })
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }))
    .catch(() => assetPath);
}

function getCronogramaSummary(tasks) {
  const total = tasks.length;
  const done = tasks.filter(task => getCronogramaStatus(task)[0] === 'done').length;
  const wip = tasks.filter(task => getCronogramaStatus(task)[0] === 'wip').length;
  const pending = Math.max(0, total - done - wip);
  const average = total ? Math.round(tasks.reduce((sum, task) => sum + (Number(task.avance) || 0), 0) / total) : 0;
  return { total, done, wip, pending, average };
}

function groupCronogramaTasks(tasks) {
  return tasks.reduce((groups, task) => {
    const name = task.grupo || 'Sin fase';
    if (!groups[name]) groups[name] = [];
    groups[name].push(task);
    return groups;
  }, {});
}

function getCronogramaPhaseWeekLabel(task, phaseTasks = []) {
  if (task.semana) return task.semana;
  const dateValue = task.fechaInicio || task.fechaFin || task.fechaMeta || task.fechaRealizada;
  if (!dateValue) return '-';
  const phaseDates = phaseTasks
    .map(item => item.fechaInicio || item.fechaFin || item.fechaMeta || item.fechaRealizada)
    .filter(Boolean)
    .sort();
  const startValue = phaseDates[0] || dateValue;
  const start = new Date(`${startValue}T00:00:00`);
  const current = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(current.getTime())) return '-';
  return String(Math.max(1, Math.floor((current - start) / 604800000) + 1));
}

async function exportCronogramaWord(tasks) {
  const generatedAt = new Date().toLocaleDateString('es-SV', { day: '2-digit', month: 'long', year: 'numeric' });
  const summary = getCronogramaSummary(tasks);
  const groups = groupCronogramaTasks(tasks);
  const totalHours = tasks.reduce((sum, task) => sum + (Number(task.horas) || 0), 0);
  const startDate = CRONOGRAMA_REPORT_PERIOD.start;
  const endDate = CRONOGRAMA_REPORT_PERIOD.end;
  const phasesCount = Object.keys(groups).length;
  const [clidenteLogo, iseadeLogo] = await Promise.all([
    getAssetDataUri('LOGO CLIDENTE.jpeg'),
    getAssetDataUri('Nuevo Logo ISEADE-04.png'),
  ]);

  const getRange = (phaseTasks) => {
    const dates = phaseTasks
      .flatMap(task => [task.fechaInicio, task.fechaFin])
      .filter(Boolean)
      .sort();
    if (!dates.length) return 'Pendiente';
    return `${formatCronogramaDate(dates[0])} - ${formatCronogramaDate(dates[dates.length - 1])}`;
  };

  const phaseSummaryRows = Object.entries(groups).map(([group, groupTasks]) => {
    const phaseSummary = getCronogramaSummary(groupTasks);
    const phaseHours = groupTasks.reduce((sum, task) => sum + (Number(task.horas) || 0), 0);
    return `
      <tr>
        <td><strong>${escapeHtml(group)}</strong></td>
        <td class="center">${phaseSummary.total}</td>
        <td class="center"><strong>${phaseSummary.average}%</strong></td>
        <td class="center">${phaseHours}</td>
        <td class="center">${phaseSummary.done}</td>
        <td class="center">${phaseSummary.wip}</td>
        <td class="center">${phaseSummary.pending}</td>
        <td>${getRange(groupTasks)}</td>
      </tr>`;
  }).join('');

  const pendingRows = tasks
    .filter(task => getCronogramaStatus(task)[0] !== 'done')
    .slice()
    .sort((a, b) => String(a.fechaFin || a.fechaInicio || '9999-12-31').localeCompare(String(b.fechaFin || b.fechaInicio || '9999-12-31')))
    .slice(0, 6)
    .map((task) => {
      const [state, status] = getCronogramaStatus(task);
      return `
        <tr class="${getCronogramaProgressClass(task.avance, 'word')}">
          <td>${formatCronogramaDate(task.fechaFin || task.fechaInicio)}</td>
          <td><strong>${escapeHtml(task.actividad || '')}</strong><br><span>${escapeHtml(task.descripcion || '')}</span></td>
          <td>${escapeHtml(task.grupo || '')}</td>
          <td class="center">${escapeHtml(task.responsable || '')}</td>
          <td class="center"><strong>${Number(task.avance) || 0}%</strong></td>
          <td class="center status-pill status-${state}">${status}</td>
        </tr>`;
    }).join('');

  const phaseSections = Object.entries(groups).map(([group, groupTasks]) => {
    const phaseAverage = groupTasks.length
      ? Math.round(groupTasks.reduce((sum, task) => sum + (Number(task.avance) || 0), 0) / groupTasks.length)
      : 0;
    const phaseHours = groupTasks.reduce((sum, task) => sum + (Number(task.horas) || 0), 0);
    const rows = groupTasks.map((task, index) => {
      const [state, status] = getCronogramaStatus(task);
      const weekLabel = getCronogramaPhaseWeekLabel(task, groupTasks);
      const cellStyle = getCronogramaWordCellStyle(task.avance);
      const firstCellStyle = getCronogramaWordCellStyle(task.avance, true);
      return `
        <tr class="detail-row ${getCronogramaProgressClass(task.avance, 'word')}">
          <td style="${firstCellStyle}" class="center">${index + 1}</td>
          <td style="${cellStyle}"><strong>${escapeHtml(task.actividad)}</strong><br><span>${escapeHtml(task.descripcion || '')}</span></td>
          <td style="${cellStyle}" class="center">${escapeHtml(task.responsable || '')}</td>
          <td style="${cellStyle}" class="center"><strong>${Number(task.avance) || 0}%</strong></td>
          <td style="${cellStyle}" class="center">${escapeHtml(weekLabel)}</td>
          <td style="${cellStyle}" class="center">${formatCronogramaDate(task.fechaInicio)}</td>
          <td style="${cellStyle}" class="center">${Number(task.horas) || 0}</td>
          <td style="${cellStyle}" class="center">${formatCronogramaDate(task.fechaFin)}</td>
          <td style="${cellStyle}" class="center status-pill status-${state}">${status}</td>
        </tr>`;
    }).join('');

    return `
      <h2>${escapeHtml(group)}</h2>
      <p class="phase-note">Actividades: <strong>${groupTasks.length}</strong> | Avance promedio: <strong>${phaseAverage}%</strong> | Horas planificadas: <strong>${phaseHours}</strong> | Periodo: <strong>${getRange(groupTasks)}</strong></p>
      <table class="detail-table">
        <thead>
          <tr>
            <th style="width:5%">N</th>
            <th style="width:31%">Actividad y entregable / hito</th>
            <th style="width:12%">Responsable</th>
            <th style="width:8%">Avance</th>
            <th style="width:8%">Semana</th>
            <th style="width:12%">Fecha inicio</th>
            <th style="width:6%">Horas</th>
            <th style="width:12%">Fecha fin</th>
            <th style="width:6%">Estado</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }).join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="UTF-8">
    <title>Cronograma de la Consultoria CLIDENTE</title>
    <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->
    <style>
      @page WordSection1 { size: 11in 8.5in; margin: .55in .45in .55in .45in; }
      div.WordSection1 { page: WordSection1; }
      body { color: #1f2937; font-family: Arial, sans-serif; font-size: 9.5pt; line-height: 1.35; }
      h1 { color: #123d73; font-size: 24pt; letter-spacing: .2pt; margin: 0 0 5pt; }
      h2 { background: #1a56a4; color: #fff; font-size: 11.5pt; margin: 16pt 0 0; padding: 7pt 9pt; text-transform: uppercase; }
      .subtitle { color: #5d6f89; font-size: 11pt; margin: 0 0 10pt; }
      .top-rule { background: #123d73; height: 4pt; line-height: 4pt; margin: 0 0 14pt; }
      .cover { border-bottom: 1pt solid #c8d8ef; margin-bottom: 12pt; padding-bottom: 10pt; }
      .brand-table { border-collapse: collapse; margin: 0 0 12pt; width: 100%; }
      .brand-table td { border: 0; padding: 0; vertical-align: middle; }
      .brand-left { text-align: left; width: 42%; }
      .brand-center { color: #123d73; font-size: 15pt; font-weight: bold; letter-spacing: .6pt; text-align: center; text-transform: uppercase; width: 16%; }
      .brand-right { text-align: right; width: 42%; }
      .client-logo { height: 52pt; width: 54pt; }
      .school-logo { height: 45pt; width: 45pt; vertical-align: middle; }
      .school-wordmark { color: #071933; display: inline-block; font-size: 10pt; font-weight: bold; letter-spacing: .4pt; line-height: 1.05; margin-left: 6pt; text-align: left; text-transform: uppercase; vertical-align: middle; }
      .school-wordmark strong { color: #071933; font-size: 17pt; letter-spacing: 1pt; }
      .meta-line { color: #1f2937; font-size: 9pt; margin: 0; }
      .meta-line strong { color: #123d73; }
      .kpi-table { border-collapse: separate; border-spacing: 4pt; margin: 10pt 0 12pt; width: 100%; }
      .kpi-table td { background: #edf4ff; border: 1pt solid #c8d8ef; color: #123d73; font-size: 17pt; font-weight: bold; padding: 8pt 7pt; text-align: center; vertical-align: middle; }
      .kpi-table span { color: #5d6f89; display: block; font-size: 7.5pt; font-weight: bold; letter-spacing: .7pt; margin-top: 2pt; text-transform: uppercase; }
      .executive-note { background: #f8fafc; border-left: 5pt solid #1a56a4; color: #30415c; font-size: 9pt; margin: 8pt 0 13pt; padding: 8pt 10pt; }
      .section-label { color: #123d73; font-size: 12pt; font-weight: bold; margin: 12pt 0 6pt; text-transform: uppercase; }
      .phase-note { color: #5d6f89; font-size: 8.5pt; margin: 5pt 0 7pt; }
      table { border-collapse: collapse; margin-bottom: 12pt; width: 100%; }
      th { background: #dbeafe; border: 1pt solid #9fb8dc; color: #123d73; font-size: 7.6pt; padding: 6pt 5pt; text-transform: uppercase; }
      td { border: 1pt solid #cfd9e6; font-size: 8pt; padding: 6pt 5pt; vertical-align: top; }
      td span { color: #5d6f89; font-size: 7.6pt; }
      .phase-summary th { background: #123d73; color: #fff; }
      .detail-table tbody tr:nth-child(even) td { background: #f8fafc; }
      .word-progress-red td { background: #fff1f2; border-color: #fecdd3; }
      .word-progress-yellow td { background: #fffbeb; border-color: #fde68a; }
      .word-progress-green td { background: #ecfdf5; border-color: #bbf7d0; }
      .word-progress-red td:first-child { border-left: 4pt solid #dc2626; }
      .word-progress-yellow td:first-child { border-left: 4pt solid #d97706; }
      .word-progress-green td:first-child { border-left: 4pt solid #059669; }
      .center { text-align: center; }
      .status-pill { font-weight: bold; }
      .status-done { background: #dcfce7; color: #166534; }
      .status-wip { background: #fef3c7; color: #854d0e; }
      .status-pending { background: #dbeafe; color: #1a56a4; }
      .page-break { page-break-before: always; }
      .footer { border-top: 1pt solid #cfd9e6; color: #5d6f89; font-size: 8pt; margin-top: 16pt; padding-top: 7pt; }
    </style>
  </head>
  <body>
    <div class="WordSection1">
      <div class="top-rule">&nbsp;</div>
      <div class="cover">
        <table class="brand-table">
          <tr>
            <td class="brand-left"><img class="client-logo" src="${clidenteLogo}" alt="CLIDENTE"></td>
            <td class="brand-center">Seguimiento<br>a consultor&iacute;a</td>
            <td class="brand-right">
              <img class="school-logo" src="${iseadeLogo}" alt="ISEADE FEPADE">
              <span class="school-wordmark"><strong>ISEADE</strong><br>Business School<br>FEPADE</span>
            </td>
          </tr>
        </table>
        <h1>Cronograma de la Consultor&iacute;a</h1>
        <p class="subtitle">Trabajo de Graduaci&oacute;n MBA ISEADE FEPADE - Cl&iacute;nica Dental CLIDENTE</p>
        <p class="meta-line"><strong>Documento generado:</strong> ${generatedAt}</p>
        <p class="meta-line"><strong>Criterio de seguimiento:</strong> entregas internas al tutor al menos 8 d&iacute;as antes de las fechas oficiales solicitadas por ISEADE.</p>
        <p class="meta-line"><strong>Periodo cubierto:</strong> ${formatCronogramaDate(startDate)} - ${formatCronogramaDate(endDate)}</p>
      </div>
      <table class="kpi-table">
        <tr>
          <td>${summary.total}<span>Actividades</span></td>
          <td>${summary.average}%<span>Avance promedio</span></td>
          <td>${summary.done}<span>Completadas</span></td>
          <td>${summary.wip}<span>En progreso</span></td>
          <td>${summary.pending}<span>Pendientes</span></td>
          <td>${totalHours}<span>Horas planificadas</span></td>
        </tr>
      </table>
      <p class="executive-note"><strong>Lectura gerencial:</strong> el cronograma consolida ${summary.total} actividades distribuidas en ${phasesCount} fases de trabajo. El avance promedio actual es ${summary.average}%, con ${summary.done} actividades completadas, ${summary.wip} en progreso y ${summary.pending} pendientes. Este documento prioriza la lectura ejecutiva para tutor y equipo, manteniendo el detalle operativo por fase en las p&aacute;ginas siguientes.</p>
      <p class="section-label">Resumen por fase</p>
      <table class="phase-summary">
        <thead>
          <tr>
            <th style="width:29%">Fase</th>
            <th style="width:8%">Acts.</th>
            <th style="width:9%">Avance</th>
            <th style="width:8%">Horas</th>
            <th style="width:9%">Comp.</th>
            <th style="width:9%">Prog.</th>
            <th style="width:9%">Pend.</th>
            <th style="width:19%">Rango de fechas</th>
          </tr>
        </thead>
        <tbody>${phaseSummaryRows}</tbody>
      </table>
      <p class="section-label">Pr&oacute;ximos hitos de atenci&oacute;n</p>
      <table>
        <thead>
          <tr>
            <th style="width:12%">Fecha</th>
            <th style="width:36%">Actividad / hito</th>
            <th style="width:18%">Fase</th>
            <th style="width:12%">Responsable</th>
            <th style="width:8%">Avance</th>
            <th style="width:14%">Estado</th>
          </tr>
        </thead>
        <tbody>${pendingRows || '<tr><td colspan="6" class="center">No hay hitos pendientes registrados.</td></tr>'}</tbody>
      </table>
      <div class="page-break"></div>
      <p class="section-label">Detalle operativo por fase</p>
      ${phaseSections}
      <p class="footer">Fuente: Portal TDG - CLIDENTE. Este cronograma se genera con la version editable sincronizada en Supabase.</p>
    </div>
  </body>
  </html>`;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'cronograma-profesional-clidente.doc';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

function initCronogramaProject() {
  const card = document.querySelector('.project-card');
  if (!card) return;
  const topScroll = document.getElementById('projectTopScroll');
  const grid = card.querySelector('.project-grid');
  if (topScroll && grid) {
    topScroll.querySelector('div').style.width = `${grid.scrollWidth}px`;
    topScroll.addEventListener('scroll', () => { card.scrollLeft = topScroll.scrollLeft; });
    card.addEventListener('scroll', () => { topScroll.scrollLeft = card.scrollLeft; });
  }

  const loadRemoteCronograma = async () => {
    const currentSignature = JSON.stringify(normalizeCronogramaTasks(readCronogramaFromDom()));
    if (currentSignature && currentSignature === cronogramaRemoteLoadSignature) {
      setCronogramaStatus(cronogramaJustSaved ? 'Cambios sincronizados en Supabase' : 'Datos del cronograma cargados desde Supabase');
      cronogramaJustSaved = false;
      return;
    }
    if (cronogramaRemoteLoadPending) return;
    cronogramaRemoteLoadPending = true;
    try {
      setCronogramaStatus('Cargando cronograma desde Supabase...', 'spinner fa-spin', 'working');
      const remoteTasks = await loadCronogramaFromSupabase();
      const remoteSignature = JSON.stringify(remoteTasks);
      cronogramaRemoteLoadSignature = remoteSignature;
      if (remoteSignature !== currentSignature) {
        navigate('cronograma');
        return;
      }
      setCronogramaStatus(cronogramaJustSaved ? 'Cambios sincronizados en Supabase' : 'Datos del cronograma cargados desde Supabase');
      cronogramaJustSaved = false;
    } catch (error) {
      console.error(error);
      setCronogramaStatus('Guardado local. Revisa que la tabla cronograma_actividades exista y tenga politicas RLS.', 'triangle-exclamation', 'error');
    } finally {
      cronogramaRemoteLoadPending = false;
    }
  };

  loadRemoteCronograma();

  const rerender = tasks => {
    saveCronogramaTasks(tasks).then(() => navigate('cronograma'));
  };

  card.addEventListener('change', event => {
    if (!event.target.matches('[data-field]')) return;
    const tasks = readCronogramaFromDom();
    saveCronogramaTasks(tasks).then(() => navigate('cronograma'));
  });

  card.addEventListener('input', event => {
    if (!event.target.matches('textarea')) return;
    saveCronogramaTasksLocal(readCronogramaFromDom());
    setCronogramaStatus('Edicion local temporal. Al salir del campo se sincroniza en Supabase.', 'pen-to-square', 'working');
  });

  card.addEventListener('click', event => {
    const button = event.target.closest('.project-row-action');
    if (!button) return;
    const row = button.closest('.project-grid-row');
    const taskId = row?.dataset.taskId;
    const tasks = readCronogramaFromDom();
    const index = tasks.findIndex(task => task.id === taskId);
    if (index < 0) return;

    if (button.classList.contains('project-insert-after')) {
      tasks.splice(index + 1, 0, createBlankCronogramaTask());
      rerender(tasks);
      return;
    }

    if (button.classList.contains('project-move-up')) {
      if (index === 0) return;
      [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
      rerender(tasks);
      return;
    }

    if (button.classList.contains('project-move-down')) {
      if (index === tasks.length - 1) return;
      [tasks[index + 1], tasks[index]] = [tasks[index], tasks[index + 1]];
      rerender(tasks);
      return;
    }

    if (!button.classList.contains('project-delete')) return;
    const activity = row?.querySelector('[data-field="actividad"]')?.value || 'esta actividad';
    if (!window.confirm(`¿Seguro que deseas eliminar "${activity}" del cronograma?`)) return;
    const filtered = tasks.filter(task => task.id !== taskId);
    rerender(filtered.length ? filtered : CRONOGRAMA_DEFAULT_TASKS);
  });

  const reset = document.getElementById('cronogramaReset');
  if (reset) {
    reset.addEventListener('click', () => {
      if (!window.confirm('Seguro que deseas restaurar el cronograma base para todo el equipo?')) return;
      localStorage.removeItem(CRONOGRAMA_STORAGE_KEY);
      saveCronogramaTasks(CRONOGRAMA_DEFAULT_TASKS).then(() => navigate('cronograma'));
    });
  }

  const exportBtn = document.getElementById('cronogramaExportExcel');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => exportCronogramaExcel(readCronogramaFromDom()));
  }

  const exportWordBtn = document.getElementById('cronogramaExportWord');
  if (exportWordBtn) {
    exportWordBtn.addEventListener('click', () => exportCronogramaWord(readCronogramaFromDom()));
  }
}

function buildOrganigramaPdfHtml() {
  const generatedAt = new Date().toLocaleDateString('es-SV', { day: '2-digit', month: 'long', year: 'numeric' });
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Organigrama CLIDENTE</title>
  <style>
    @page { size: letter landscape; margin: 14mm; }
    * { box-sizing: border-box; }
    body { color: #1f2a3d; font-family: Arial, Helvetica, sans-serif; margin: 0; }
    .page { min-height: 100vh; padding: 8px; }
    .header { align-items: center; border-bottom: 3px solid #1a56a4; display: flex; gap: 18px; justify-content: space-between; padding-bottom: 14px; }
    .brand { align-items: center; display: flex; gap: 12px; }
    .brand img { height: 54px; object-fit: contain; }
    h1 { color: #0f3d73; font-size: 24px; margin: 0; }
    .subtitle { color: #5f718d; font-size: 12px; margin-top: 5px; }
    .meta { color: #5f718d; font-size: 11px; text-align: right; }
    .summary { background: #eef6ff; border: 1px solid #b7d5f6; border-radius: 8px; color: #173b69; font-size: 12px; line-height: 1.45; margin: 16px 0; padding: 12px 14px; }
    .chart { margin: 18px auto 10px; max-width: 980px; text-align: center; }
    .node { background: #fff; border: 1.5px solid #c6d5e8; border-radius: 8px; box-shadow: 0 5px 12px rgba(15, 23, 42, .08); display: inline-block; min-height: 84px; padding: 10px 12px; vertical-align: top; width: 220px; }
    .node span { color: #5f718d; display: block; font-size: 10px; font-weight: 800; letter-spacing: .04em; margin-bottom: 7px; text-transform: uppercase; }
    .node strong { color: #0f3d73; display: block; font-size: 15px; line-height: 1.2; }
    .node small { color: #5f718d; display: block; font-size: 10.5px; line-height: 1.35; margin-top: 7px; }
    .top { background: #0f3d73; border-color: #0f3d73; width: 330px; }
    .top span, .top strong, .top small { color: #fff; }
    .admin { background: #eef6ff; border-color: #9fc5f0; margin-top: 28px; width: 330px; }
    .line { background: #9fb4d1; height: 28px; margin: 0 auto; width: 2px; }
    .branch-line { background: #9fb4d1; height: 2px; margin: 18px auto 14px; width: 82%; }
    .branches { display: grid; gap: 12px; grid-template-columns: repeat(4, 1fr); }
    .branches .node { width: 100%; }
    .vacant { background: #fff7ed; border-color: #fed7aa; }
    .details { display: grid; gap: 12px; grid-template-columns: repeat(3, 1fr); margin-top: 18px; }
    .detail { border: 1px solid #d9e2ef; border-radius: 8px; padding: 10px; }
    .detail h3 { color: #0f3d73; font-size: 12px; margin: 0 0 6px; }
    .detail p { color: #5f718d; font-size: 10.5px; line-height: 1.4; margin: 0; }
    .footer { border-top: 1px solid #d9e2ef; color: #5f718d; font-size: 10px; margin-top: 16px; padding-top: 8px; }
  </style>
</head>
<body>
  <main class="page">
    <section class="header">
      <div class="brand">
        <img src="LOGO CLIDENTE.jpeg" alt="CLIDENTE">
        <div>
          <h1>Organigrama Detallado CLIDENTE</h1>
          <div class="subtitle">Diagnostico Organizacional - Trabajo de Graduacion MBA ISEADE FEPADE</div>
        </div>
      </div>
      <div class="meta">Generado desde Portal TDG<br>${generatedAt}</div>
    </section>
    <section class="summary">
      Clinica con 8 sillas de atencion, 10 horas diarias de operacion y 24 personas en planilla ISSS. La estructura refleja las unidades de negocio identificadas: Clinica Dental, Laboratorio Dental y Oxicam. Se registra vacante critica de Direccion Clinica.
    </section>
    <section class="chart">
      <div class="node top">
        <span>Direccion General / Propietaria</span>
        <strong>Dra. Olga Dinora Vigil Romero</strong>
        <small>Gobierno general, decisiones estrategicas y continuidad del negocio</small>
      </div>
      <div class="line"></div>
      <div class="node admin">
        <span>Gerencia Administrativa</span>
        <strong>Tec. Henry Corcio</strong>
        <small>Operacion diaria, soporte administrativo, informacion base y coordinacion interna</small>
      </div>
      <div class="branch-line"></div>
      <div class="branches">
        <div class="node">
          <span>Unidad de Negocio</span>
          <strong>Clinica Dental</strong>
          <small>Servicios odontologicos, atencion al paciente, agenda, recepcion y experiencia del paciente.</small>
        </div>
        <div class="node vacant">
          <span>Vacante Identificada</span>
          <strong>Direccion Clinica</strong>
          <small>Coordinacion tecnica odontologica, protocolos clinicos, supervision profesional y calidad asistencial.</small>
        </div>
        <div class="node">
          <span>Unidad de Negocio</span>
          <strong>Laboratorio Dental</strong>
          <small>Soporte tecnico dental, produccion de trabajos, coordinacion con clinica y control de entregas.</small>
        </div>
        <div class="node">
          <span>Unidad de Negocio</span>
          <strong>Oxicam</strong>
          <small>Servicio complementario, gestion operativa asociada y control administrativo separado.</small>
        </div>
      </div>
    </section>
    <section class="details">
      <div class="detail"><h3>Hallazgo de control</h3><p>Se recomienda separar indicadores financieros y operativos por unidad de negocio para mejorar trazabilidad, rentabilidad y toma de decisiones.</p></div>
      <div class="detail"><h3>Riesgo organizacional</h3><p>La falta de Direccion Clinica formal limita la estandarizacion de protocolos, supervision tecnica y seguimiento preventivo.</p></div>
      <div class="detail"><h3>Accion sugerida</h3><p>Formalizar perfiles, responsabilidades, autoridad de decision y flujos de reporte por area y unidad de negocio.</p></div>
    </section>
    <div class="footer">Fuente: levantamiento de campo del equipo consultor CLIDENTE - ISEADE FEPADE.</div>
  </main>
</body>
</html>`;
}

function initOrganigramaPdfButton() {
  const button = document.getElementById('btnOrgPdf');
  if (!button) return;

  button.addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.alert('El navegador bloqueo la ventana para generar el PDF. Permite ventanas emergentes para este portal.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildOrganigramaPdfHtml());
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => {
      printWindow.print();
    }, 450);
  });
}

function initDiagnosticPdfButton() {
  const button = document.querySelector('.collaborative-doc-pdf[data-pdf-url]');
  if (!button) return;

  const status = document.getElementById('pdfGenerationStatus');
  button.addEventListener('click', () => {
    const pdfUrl = button.dataset.pdfUrl;
    if (!pdfUrl) return;

    button.disabled = true;
    if (status) {
      status.className = 'pdf-generation-status is-working';
      status.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF actualizado desde Microsoft OneDrive...';
    }

    const oldFrame = document.getElementById('pdfDownloadFrame');
    if (oldFrame) oldFrame.remove();

    const frame = document.createElement('iframe');
    frame.id = 'pdfDownloadFrame';
    frame.name = 'pdfDownloadFrame';
    frame.hidden = true;
    frame.src = pdfUrl;
    document.body.appendChild(frame);

    window.setTimeout(() => {
      button.disabled = false;
      if (status) {
        status.className = 'pdf-generation-status is-info';
        status.innerHTML = '<i class="fas fa-circle-info"></i> Si la descarga no inició, Microsoft no autorizó la conversión directa desde este portal. El documento sigue seguro en OneDrive.';
      }
    }, 4500);
  });
}

function initDiagnosticoEntregables() {
  const inputs = document.querySelectorAll('.diagnostico-entregable-avance');
  if (!inputs.length) return;

  const status = document.getElementById('diagnosticoEntregablesStatus');
  const setStatus = (text, icon = 'circle-check', state = '') => {
    if (!status) return;
    status.classList.toggle('is-error', state === 'error');
    status.classList.toggle('is-working', state === 'working');
    status.innerHTML = `<i class="fas fa-${icon}"></i> ${text}`;
  };

  const refreshFromSupabase = async () => {
    try {
      setStatus('Cargando entregables desde Supabase...', 'spinner fa-spin', 'working');
      await loadDiagnosticoEntregablesFromSupabase();
      setStatus('Datos cargados desde Supabase');
      document.body.dataset.diagnosticoEntregablesLoaded = '1';
      navigate('diagnostico');
    } catch (error) {
      console.error(error);
      setStatus('Guardado local. Revisa que la tabla diagnostico_entregables exista y tenga politicas RLS.', 'triangle-exclamation', 'error');
    }
  };

  if (!document.body.dataset.diagnosticoEntregablesLoaded) {
    refreshFromSupabase();
  } else {
    const savedText = document.body.dataset.diagnosticoEntregablesSaved === '1' ? 'Cambios sincronizados en Supabase' : 'Datos cargados desde Supabase';
    document.body.dataset.diagnosticoEntregablesSaved = '';
    setStatus(savedText);
  }

  inputs.forEach(input => {
    input.addEventListener('change', async () => {
      const id = input.dataset.id;
      const value = Math.max(0, Math.min(100, Number(input.value) || 0));
      input.value = value;
      const saved = getDiagnosticoEntregablesSaved();
      saved[id] = value;
      saveDiagnosticoEntregablesLocal(saved);
      setStatus('Guardando avance en Supabase...', 'spinner fa-spin', 'working');
      try {
        await saveDiagnosticoEntregableToSupabase(id, value);
        setStatus('Cambios sincronizados en Supabase');
        document.body.dataset.diagnosticoEntregablesSaved = '1';
        navigate('diagnostico');
      } catch (error) {
        console.error(error);
        setStatus('Guardado local. Revisa que la tabla diagnostico_entregables exista y tenga politicas RLS.', 'triangle-exclamation', 'error');
      }
    });
  });
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const toggle = document.getElementById('menuToggle');
  if (!sidebar || !backdrop || !toggle) return;

  sidebar.classList.remove('open');
  backdrop.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}

function initMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const toggle = document.getElementById('menuToggle');
  if (!sidebar || !backdrop || !toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    backdrop.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  backdrop.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSidebar();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebar();
  });
}

/* ── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileSidebar();

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
