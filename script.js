const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const COMMUNITY_FALLBACK_ICON = 'https://cdn.top.gg/icons/799571124189618176/041c2d0d7f2919cb19e56f2e1f8a0d79e7dc9940f870adf07feab99dd3ce0a04.webp';
const DISCORD_CLIENT_ID = '1435987186502733878';
const SITE_BASE = document.currentScript
  ? new URL('./', document.currentScript.src).href
  : new URL('./', window.location.href).href;

function buildDiscordAuthorizeUrl() {
  const redirectUrl = new URL(SITE_BASE);
  const url = new URL('https://discord.com/oauth2/authorize');
  url.searchParams.set('client_id', DISCORD_CLIENT_ID);
  url.searchParams.set('integration_type', '1');
  url.searchParams.set('scope', 'applications.commands');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', redirectUrl.toString());
  return url.toString();
}

function buildDiscordIcon() {
  return [
    '<svg class="discord-logo" viewBox="0 0 127.14 96.36" aria-hidden="true" focusable="false">',
    '<path fill="currentColor" d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.26 8.07C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.25 68.42 68.42 0 0 1-10.84-5.18c.91-.67 1.79-1.37 2.64-2.1a75.92 75.92 0 0 0 64.32 0c.86.73 1.74 1.43 2.64 2.1a68.68 68.68 0 0 1-10.86 5.19 77 77 0 0 0 6.89 11.24A105.25 105.25 0 0 0 126.6 80.2c2.64-27.38-4.5-51.05-18.9-72.13ZM42.45 65.69C35.14 65.69 29.18 59 29.18 50.92c0-8.05 5.83-14.77 13.27-14.77 7.5 0 13.37 6.78 13.27 14.77 0 8.06-5.83 14.77-13.27 14.77Zm42.24 0c-7.31 0-13.27-6.67-13.27-14.77 0-8.05 5.83-14.77 13.27-14.77 7.5 0 13.37 6.78 13.27 14.77 0 8.06-5.77 14.77-13.27 14.77Z"/>',
    '</svg>'
  ].join('');
}

function initAuthButtons() {
  const params = new URLSearchParams(window.location.search);
  const authorizedNow = params.has('code') && !params.has('error');

  if (authorizedNow) {
    const authLinks = document.querySelectorAll("a[href*='integration_type=1'][href*='applications.commands']");
    authLinks.forEach((link) => {
      link.style.display = 'none';
    });
    history.replaceState({}, '', window.location.pathname + window.location.hash);
    return;
  }

  const buttons = document.querySelectorAll('.login-btn');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.target = '_self';
    btn.rel = 'noopener';
    btn.innerHTML = `${buildDiscordIcon()}<span>Authorize App</span>`;
    btn.href = buildDiscordAuthorizeUrl();
  });
}

function initCursorEffects() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(cursor, ring);

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener('mousemove', (event) => {
    mx = event.clientX;
    my = event.clientY;
    cursor.style.left = `${mx}px`;
    cursor.style.top = `${my}px`;
  });

  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    window.requestAnimationFrame(animateRing);
  }

  window.requestAnimationFrame(animateRing);

  const interactiveSelector = 'a, button, .btn, .tile, .card, .hero-card, .feature-row, .community-card';
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hover');
      ring.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    });
  });

  document.addEventListener('click', (event) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 560);
  });
}

function initRevealAnimations() {
  const targets = document.querySelectorAll('.section, .tile, .feature-row, .hero-card, .community-card');
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach((el) => observer.observe(el));
}

function initCardSpotlight() {
  document.querySelectorAll('.tile, .card, .hero-card, .feature-row').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
}

function loadCommunities() {
  const track = document.getElementById('community-track');
  if (!track) return;

  fetch('communities.json', { cache: 'no-store' })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to load communities.json');
      return res.json();
    })
    .then((communities) => {
      const cards = communities.map((c) => `
      <a class="community-card" href="${c.invite}" target="_blank" rel="noopener">
        <img src="${c.icon}" alt="${c.name} icon" onerror="this.onerror=null;this.src='${COMMUNITY_FALLBACK_ICON}';" />
        <div>
          <div class="community-name">${c.name}</div>
          <div class="community-row">
            <div class="community-members">Community Online</div>
            <span class="community-join-btn">Join</span>
          </div>
        </div>
      </a>
    `);

      track.innerHTML = [...cards, ...cards].join('');
      initRevealAnimations();
    })
    .catch(() => {
      track.innerHTML = `
      <a class="community-card" href="https://discord.gg/GVuFk5gxtW" target="_blank" rel="noopener">
        <img src="${COMMUNITY_FALLBACK_ICON}" alt="Codunot" />
        <div>
          <div class="community-name">Official Codunot Server</div>
          <div class="community-row">
            <div class="community-members">Community Online</div>
            <span class="community-join-btn">Join</span>
          </div>
        </div>
      </a>
    `;
      initRevealAnimations();
    });
}

function initBotClicker() {
  const clicker = document.getElementById('bot-clicker');
  const countEl = document.getElementById('click-count');
  const messageEl = document.getElementById('click-message');
  if (!clicker || !countEl || !messageEl) return;

  let clicks = 0;
  const messages = [
    "i'm a bot, not a button, but okay! 🤖",
    'yo those clicks are clean, keep cooking 🔥',
    'bro is farming clicks like xp 😂',
    'that click combo was legendary 🏆',
    'click department says W user 📈🎉'
  ];

  let shownMessage = '';
  messageEl.textContent = '';

  function randomMessage() {
    const options = messages.filter((message) => message !== shownMessage);
    shownMessage = options[Math.floor(Math.random() * options.length)];
    messageEl.textContent = shownMessage;
  }

  clicker.addEventListener('click', () => {
    clicks += 1;
    countEl.textContent = String(clicks);
    if (clicks >= 10 && clicks % 10 === 0) randomMessage();

    clicker.classList.add('is-clicked');
    window.setTimeout(() => clicker.classList.remove('is-clicked'), 170);
  });
}

function initHeroTypedLine() {
  const el = document.getElementById('hero-typed');
  if (!el) return;

  const text = 'Personality modes · image generation · moderation suite · video generation · text-to-speech · transcription';
  let index = 0;
  let deleting = false;

  function tick() {
    if (!deleting) {
      index += 1;
      el.textContent = text.slice(0, index);
      if (index === text.length) {
        deleting = true;
        window.setTimeout(tick, 1200);
        return;
      }
      window.setTimeout(tick, 24);
      return;
    }

    index -= 1;
    el.textContent = text.slice(0, index);
    if (index === 0) deleting = false;
    window.setTimeout(tick, deleting ? 12 : 500);
  }

  tick();
}

function initLocalizationSwitcher() {
  const navLinks = document.querySelector('.links');
  if (!navLinks) return;

  const localization = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ja', label: '日本語' }
  ];

  const translations = {
    es: {
      'Home': 'Inicio',
      'Features': 'Funciones',
      'Command Center': 'Centro de comandos',
      'Stats': 'Estadísticas',
      'Reviews': 'Reseñas',
      'Support': 'Soporte',
      'Privacy Policy': 'Política de privacidad',
      'Authorize App': 'Autorizar app',
      'A discord chatbot with all your needs': 'Un chatbot de Discord para todo lo que necesitas',
      'Add to Discord': 'Agregar a Discord',
      'Authorize App Login': 'Autorizar inicio de app',
      'Vote on top.gg': 'Votar en top.gg'
    },
    fr: {
      'Home': 'Accueil',
      'Features': 'Fonctionnalités',
      'Command Center': 'Centre de commandes',
      'Stats': 'Statistiques',
      'Reviews': 'Avis',
      'Support': 'Support',
      'Privacy Policy': 'Politique de confidentialité',
      'Authorize App': 'Autoriser l’app',
      'A discord chatbot with all your needs': 'Un chatbot Discord pour tous vos besoins',
      'Add to Discord': 'Ajouter à Discord',
      'Authorize App Login': 'Autoriser la connexion',
      'Vote on top.gg': 'Voter sur top.gg'
    },
    de: {
      'Home': 'Startseite',
      'Features': 'Funktionen',
      'Command Center': 'Befehlszentrale',
      'Stats': 'Statistiken',
      'Reviews': 'Bewertungen',
      'Support': 'Support',
      'Privacy Policy': 'Datenschutz',
      'Authorize App': 'App autorisieren',
      'A discord chatbot with all your needs': 'Ein Discord-Chatbot für alles, was du brauchst',
      'Add to Discord': 'Zu Discord hinzufügen',
      'Authorize App Login': 'App-Login autorisieren',
      'Vote on top.gg': 'Auf top.gg abstimmen'
    },
    pt: {
      'Home': 'Início',
      'Features': 'Recursos',
      'Command Center': 'Central de comandos',
      'Stats': 'Estatísticas',
      'Reviews': 'Avaliações',
      'Support': 'Suporte',
      'Privacy Policy': 'Política de privacidade',
      'Authorize App': 'Autorizar app',
      'A discord chatbot with all your needs': 'Um chatbot do Discord para tudo que você precisa',
      'Add to Discord': 'Adicionar ao Discord',
      'Authorize App Login': 'Autorizar login do app',
      'Vote on top.gg': 'Votar no top.gg'
    },
    hi: {
      'Home': 'होम',
      'Features': 'फ़ीचर्स',
      'Command Center': 'कमांड सेंटर',
      'Stats': 'आँकड़े',
      'Reviews': 'रिव्यू',
      'Support': 'सपोर्ट',
      'Privacy Policy': 'प्राइवेसी पॉलिसी',
      'Authorize App': 'ऐप अधिकृत करें',
      'A discord chatbot with all your needs': 'आपकी सभी ज़रूरतों के लिए एक Discord चैटबॉट',
      'Add to Discord': 'Discord में जोड़ें',
      'Authorize App Login': 'ऐप लॉगिन अधिकृत करें',
      'Vote on top.gg': 'top.gg पर वोट करें'
    },
    ja: {
      'Home': 'ホーム',
      'Features': '機能',
      'Command Center': 'コマンドセンター',
      'Stats': '統計',
      'Reviews': 'レビュー',
      'Support': 'サポート',
      'Privacy Policy': 'プライバシーポリシー',
      'Authorize App': 'アプリを認証',
      'A discord chatbot with all your needs': '必要な機能を備えたDiscordチャットボット',
      'Add to Discord': 'Discordに追加',
      'Authorize App Login': 'アプリログインを認証',
      'Vote on top.gg': 'top.ggで投票'
    }
  };

  const select = document.createElement('select');
  select.className = 'language-switcher';
  select.setAttribute('aria-label', 'Website language');
  select.innerHTML = localization.map((lang) => `<option value="${lang.code}">${lang.label}</option>`).join('');

  const storedLang = window.localStorage.getItem('codunot_lang') || 'en';
  select.value = localization.some((lang) => lang.code === storedLang) ? storedLang : 'en';

  const translateDocument = (lang) => {
    const dictionary = translations[lang] || {};
    document.querySelectorAll('a, button, .subhead').forEach((el) => {
      const base = el.dataset.i18nBase || el.textContent.trim();
      if (!el.dataset.i18nBase) el.dataset.i18nBase = base;
      el.textContent = dictionary[base] || base;
    });

    document.documentElement.lang = lang;
  };

  select.addEventListener('change', (event) => {
    const selectedLang = event.target.value;
    window.localStorage.setItem('codunot_lang', selectedLang);
    translateDocument(selectedLang);
  });

  navLinks.appendChild(select);
  translateDocument(select.value);
}

function initSnowToggle() {
  const body = document.body;
  if (!body) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stored = window.localStorage.getItem('codunot_snow_enabled');
  const enabled = stored === null ? !prefersReduced : stored === 'true';

  const canvas = document.createElement('canvas');
  canvas.className = 'snow-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  body.prepend(canvas);

  const toggle = document.createElement('button');
  toggle.className = 'snow-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-pressed', String(enabled));

  const label = (state) => (state ? '❄️ Snow: On' : '❄️ Snow: Off');
  toggle.textContent = label(enabled);

  const navLinks = document.querySelector('.links');
  if (navLinks) navLinks.appendChild(toggle);
  else body.appendChild(toggle);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const flakes = [];
  const density = () => Math.max(24, Math.floor(window.innerWidth / 28));

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawnFlakes() {
    flakes.length = 0;
    for (let i = 0; i < density(); i += 1) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1 + Math.random() * 3,
        s: 0.4 + Math.random() * 1.6,
        w: (Math.random() * 0.8) - 0.4
      });
    }
  }

  let snowEnabled = enabled;
  let rafId = null;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!snowEnabled) return;

    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (const f of flakes) {
      f.y += f.s;
      f.x += Math.sin(f.y * 0.01) * 0.5 + f.w;
      if (f.y > canvas.height + 5) {
        f.y = -8;
        f.x = Math.random() * canvas.width;
      }
      if (f.x > canvas.width + 5) f.x = -5;
      if (f.x < -5) f.x = canvas.width + 5;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = window.requestAnimationFrame(render);
  }

  function setState(state) {
    snowEnabled = state;
    canvas.style.display = state ? 'block' : 'none';
    toggle.setAttribute('aria-pressed', String(state));
    toggle.textContent = label(state);
    window.localStorage.setItem('codunot_snow_enabled', String(state));

    if (!state && rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (state && !rafId) render();
  }

  window.addEventListener('resize', () => {
    resize();
    spawnFlakes();
  });

  toggle.addEventListener('click', () => {
    setState(!snowEnabled);
  });

  resize();
  spawnFlakes();
  setState(snowEnabled);
}

initAuthButtons();
loadCommunities();
initBotClicker();
initHeroTypedLine();
initLocalizationSwitcher();
initSnowToggle();
initCursorEffects();
initRevealAnimations();
initCardSpotlight();
