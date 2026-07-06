(() => {
  const AUTH_SUPABASE_URL = 'https://lgoevspmiuyvlttmuyuz.supabase.co';
  const AUTH_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Wk0gGB0ks4HiqHyJ-AvTqw_-LoL4oZg';
  const config = window.CLIDENTE_AUTH_CONFIG || {};
  const normalizeEmail = value => String(value || '').trim().toLowerCase();
  const makeEmailSet = values => new Set((values || []).map(normalizeEmail).filter(Boolean));
  const allowedEmails = makeEmailSet(config.allowedEmails);
  const blockedEmails = makeEmailSet(config.blockedEmails);
  let authClient = null;
  let currentSession = null;
  let currentUser = null;

  function emailIsAllowed(email) {
    const normalized = normalizeEmail(email);
    return Boolean(normalized) && !blockedEmails.has(normalized) && allowedEmails.has(normalized);
  }

  function redirectUrl() {
    return config.redirectTo || `${window.location.origin}${window.location.pathname}`;
  }

  function setMessage(text, state = 'info') {
    const message = document.getElementById('authMessage');
    if (!message) return;
    message.textContent = text || '';
    message.className = `auth-message ${state} ${text ? 'is-visible' : ''}`;
  }

  function createGate() {
    if (document.getElementById('authGate')) return;
    const gate = document.createElement('div');
    gate.id = 'authGate';
    gate.className = 'auth-gate';
    gate.innerHTML = `
      <section class="auth-card" aria-label="Acceso al Portal CLIDENTE">
        <div class="auth-card-logo">
          <img src="LOGO CLIDENTE.jpeg" alt="CLIDENTE">
          <div>
            <h1>Acceso al Portal CLIDENTE</h1>
            <p>Ingresa con un correo autorizado del equipo. Te enviaremos un enlace seguro de acceso.</p>
          </div>
        </div>
        <form class="auth-form" id="authForm">
          <label>Correo autorizado
            <input id="authEmail" type="email" autocomplete="email" placeholder="tu-correo@dominio.com" required>
          </label>
          <button id="authSubmit" class="auth-submit" type="submit">Enviar enlace de acceso</button>
        </form>
        <div id="authMessage" class="auth-message"></div>
        <div class="auth-footnote">Si tu correo no esta en la lista autorizada, el portal no abrira aunque tengas el enlace.</div>
      </section>`;
    document.body.appendChild(gate);
    document.getElementById('authForm')?.addEventListener('submit', handleLoginSubmit);
  }

  function lockPortal(message, state = 'info') {
    createGate();
    document.body.classList.remove('auth-checking', 'auth-ready');
    document.body.classList.add('auth-locked');
    document.getElementById('authGate')?.removeAttribute('hidden');
    setMessage(message, state);
  }

  function ensureUserPill(email) {
    const header = document.querySelector('.top-header');
    if (!header || document.getElementById('authUserPill')) return;
    const pill = document.createElement('div');
    pill.id = 'authUserPill';
    pill.className = 'auth-user-pill';
    pill.innerHTML = `<span>${email}</span><button type="button">Salir</button>`;
    pill.querySelector('button')?.addEventListener('click', async () => {
      await signOut();
      lockPortal('Sesion cerrada. Ingresa de nuevo para abrir el portal.', 'info');
    });
    header.appendChild(pill);
  }

  function unlockPortal(session, user) {
    currentSession = session;
    currentUser = user;
    document.body.classList.remove('auth-checking', 'auth-locked');
    document.body.classList.add('auth-ready');
    const gate = document.getElementById('authGate');
    if (gate) gate.setAttribute('hidden', '');
    ensureUserPill(user.email);
  }

  async function signOut() {
    currentSession = null;
    currentUser = null;
    await authClient?.auth.signOut();
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = normalizeEmail(document.getElementById('authEmail')?.value);
    const button = document.getElementById('authSubmit');
    if (!emailIsAllowed(email)) {
      setMessage('Este correo no esta autorizado para entrar al portal.', 'error');
      return;
    }

    button.disabled = true;
    setMessage('Enviando enlace de acceso...', 'info');
    const { error } = await authClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl(),
      },
    });
    button.disabled = false;

    if (error) {
      setMessage(`No se pudo enviar el enlace: ${error.message}`, 'error');
      return;
    }
    setMessage('Listo. Revisa tu correo y abre el enlace de acceso.', 'success');
  }

  async function validateSession(session) {
    if (!session) {
      lockPortal('', 'info');
      return;
    }

    const { data, error } = await authClient.auth.getUser();
    if (error || !data?.user?.email) {
      await signOut();
      lockPortal('No se pudo verificar la sesion. Ingresa de nuevo.', 'error');
      return;
    }

    if (!emailIsAllowed(data.user.email)) {
      await signOut();
      lockPortal('Este correo no esta autorizado para entrar al portal.', 'error');
      return;
    }

    unlockPortal(session, data.user);
  }

  async function initAuthGate() {
    if (config.enabled === false) {
      document.body.classList.remove('auth-checking');
      document.body.classList.add('auth-ready');
      return;
    }

    createGate();
    if (!window.supabase?.createClient) {
      lockPortal('No se cargo la libreria de autenticacion de Supabase. Revisa la conexion a internet.', 'error');
      return;
    }

    authClient = window.supabase.createClient(AUTH_SUPABASE_URL, AUTH_SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });

    window.clidenteAuth = {
      getAccessToken: () => currentSession?.access_token || '',
      getUser: () => currentUser,
      isAllowedEmail: emailIsAllowed,
      signOut,
    };

    const { data } = await authClient.auth.getSession();
    await validateSession(data?.session || null);

    authClient.auth.onAuthStateChange((_event, session) => {
      validateSession(session || null);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthGate);
  } else {
    initAuthGate();
  }
})();
