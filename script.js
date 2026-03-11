const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const COMMUNITY_FALLBACK_ICON = 'https://cdn.top.gg/icons/799571124189618176/041c2d0d7f2919cb19e56f2e1f8a0d79e7dc9940f870adf07feab99dd3ce0a04.webp';
const DISCORD_CLIENT_ID = '1435987186502733878';
const SITE_BASE = document.currentScript
  ? new URL('./', document.currentScript.src).href
  : new URL('./', window.location.href).href;

function setPageData() {
  if (!document.body) return;

  const parts = window.location.pathname.split('/').filter(Boolean);
  let page = parts.length ? parts[parts.length - 1].toLowerCase() : 'home';

  if (page === 'index.html') {
    page = parts.length > 1 ? parts[parts.length - 2].toLowerCase() : 'home';
  }

  document.body.dataset.page = page || 'home';
}

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

function initRevealAnimations() {
  const targets = document.querySelectorAll('main > .section, .section > .tile, .feature-row, .hero-card, .community-card');
  if (!targets.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

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

function loadCommunities() {
  const track = document.getElementById('community-track');
  if (!track) return;

  fetch('communities.json')
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

  const phrases = [
    'Channel-based model control, image generation, music tools, moderation, and more...',
    'Seven AI models, text-to-speech, image search, smart replies, and more...',
    'Video generation, image editing, automation, community tools, and more...'
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
    return;
  }

  if (window.__heroTypeTimer) window.clearTimeout(window.__heroTypeTimer);
  const runId = String(Date.now());
  el.dataset.typeRun = runId;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    if (el.dataset.typeRun !== runId) return;

    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex += 1;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        deleting = true;
        window.__heroTypeTimer = window.setTimeout(tick, 1400);
        return;
      }

      window.__heroTypeTimer = window.setTimeout(tick, 36);
      return;
    }

    charIndex -= 1;
    el.textContent = current.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      window.__heroTypeTimer = window.setTimeout(tick, 260);
      return;
    }

    window.__heroTypeTimer = window.setTimeout(tick, 18);
  }

  tick();
}

function initAmbientModeControl() {
  const body = document.body;
  if (!body) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const legacySnow = window.localStorage.getItem('codunot_snow_enabled');
  const stored = window.localStorage.getItem('codunot_background_mode');
  const mode = stored || (legacySnow === 'true' ? 'snow' : (prefersReduced ? 'off' : 'snow'));

  const scene = document.createElement('div');
  scene.className = 'snow-scene';
  scene.setAttribute('aria-hidden', 'true');
  body.prepend(scene);

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function renderParticles(nextMode) {
    scene.innerHTML = '';

    if (nextMode === 'off') {
      scene.classList.add('is-hidden');
      scene.dataset.mode = 'off';
      return;
    }

    scene.classList.remove('is-hidden');
    scene.dataset.mode = nextMode;

    const configs = {
      snow: {
        total: 108,
        glyphs: ['❄', '❅', '✻'],
        sizeMin: 0.64,
        sizeRange: 0.82,
        alphaMin: 0.45,
        alphaRange: 0.45,
        durationMin: 11,
        durationRange: 10,
        driftMin: -18,
        driftRange: 36,
        jitterPattern: 7,
        jitterStep: 0.65,
        className: ''
      },
      embers: {
        total: 72,
        glyphs: ['✦', '•', '✧'],
        sizeMin: 0.5,
        sizeRange: 0.62,
        alphaMin: 0.62,
        alphaRange: 0.32,
        durationMin: 8,
        durationRange: 6,
        driftMin: -16,
        driftRange: 32,
        jitterPattern: 6,
        jitterStep: 0.55,
        className: 'ember'
      },
      stardust: {
        total: 84,
        glyphs: ['✦', '·', '•'],
        sizeMin: 0.36,
        sizeRange: 0.36,
        alphaMin: 0.32,
        alphaRange: 0.28,
        durationMin: 14,
        durationRange: 12,
        driftMin: -10,
        driftRange: 20,
        jitterPattern: 8,
        jitterStep: 0.42,
        className: 'stardust'
      },
      rain: {
        total: 92,
        glyphs: ['|', '|', '│'],
        sizeMin: 0.78,
        sizeRange: 0.5,
        alphaMin: 0.24,
        alphaRange: 0.2,
        durationMin: 5,
        durationRange: 4,
        driftMin: -6,
        driftRange: 12,
        jitterPattern: 9,
        jitterStep: 0.3,
        className: 'rain'
      }
    };
    const config = configs[nextMode] || configs.snow;

    for (let index = 0; index < config.total; index += 1) {
      const particle = document.createElement('span');
      const baseLeft = ((index + 0.5) / config.total) * 100;
      const jitter = ((index % config.jitterPattern) - ((config.jitterPattern - 1) / 2)) * config.jitterStep;

      particle.className = `snowflake ${config.className}`.trim();
      particle.textContent = config.glyphs[index % config.glyphs.length];
      particle.style.setProperty('--left', `${clamp(baseLeft + jitter, 1, 99)}%`);
      particle.style.setProperty('--size', `${config.sizeMin + (Math.random() * config.sizeRange)}rem`);
      particle.style.setProperty('--alpha', `${config.alphaMin + (Math.random() * config.alphaRange)}`);
      particle.style.setProperty('--duration', `${config.durationMin + (Math.random() * config.durationRange)}s`);
      particle.style.setProperty('--delay', `${Math.random() * -18}s`);
      particle.style.setProperty('--drift', `${config.driftMin + (Math.random() * config.driftRange)}px`);
      scene.appendChild(particle);
    }
  }

  const wrapper = document.createElement('label');
  wrapper.className = 'ambient-control';
  wrapper.innerHTML = '<span>Background</span>';

  const select = document.createElement('select');
  select.className = 'ambient-select';
  select.setAttribute('aria-label', 'Background animation');

  [
    ['snow', 'Snow'],
    ['embers', 'Embers'],
    ['stardust', 'Stardust'],
    ['rain', 'Rain'],
    ['off', 'Off']
  ].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });

  wrapper.appendChild(select);

  const navLinks = document.querySelector('.links');
  if (navLinks) navLinks.appendChild(wrapper);
  else body.appendChild(wrapper);

  function setMode(nextMode) {
    select.value = nextMode;
    renderParticles(nextMode);
    window.localStorage.setItem('codunot_background_mode', nextMode);
    window.localStorage.setItem('codunot_snow_enabled', String(nextMode === 'snow'));
  }

  select.addEventListener('change', () => {
    setMode(select.value);
  });

  setMode(mode);
}

function initHamburgerMenu() {
  const nav = document.querySelector('.nav');
  const links = document.querySelector('.links');
  if (!nav || !links) return;

  const existing = nav.querySelector('.hamburger');
  if (existing) return;

  const btn = document.createElement('button');
  btn.className = 'hamburger';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle navigation');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '☰';

  nav.insertBefore(btn, links);

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? '✕' : '☰';
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    });
  });
}

setPageData();
initHamburgerMenu();
initAuthButtons();
loadCommunities();
initBotClicker();
initHeroTypedLine();
initAmbientModeControl();
initRevealAnimations();
