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

initAuthButtons();

async function loadCommunities() {
  const track = document.getElementById('community-track');
  if (!track) return;

  try {
    const res = await fetch('communities.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load communities.json');
    const communities = await res.json();

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
  } catch {
    track.innerHTML = `
      <a class="community-card" href="https://discord.gg/GVuFk5gxtW" target="_blank" rel="noopener">
        <img src="https://cdn.top.gg/icons/799571124189618176/041c2d0d7f2919cb19e56f2e1f8a0d79e7dc9940f870adf07feab99dd3ce0a04.webp" alt="Codunot" />
        <div>
          <div class="community-name">Official Codunot Server</div>
          <div class="community-row">
            <div class="community-members">Community Online</div>
            <span class="community-join-btn">Join</span>
          </div>
        </div>
      </a>
    `;
  }
}

loadCommunities();

function initBotClicker() {
  const clicker = document.getElementById('bot-clicker');
  const countEl = document.getElementById('click-count');
  const messageEl = document.getElementById('click-message');
  if (!clicker || !countEl || !messageEl) return;

  let clicks = 0;
  const messages = [
    "i'm a bot, not a button, but okay! \u{1F916}",
    'yo those clicks are clean, keep cooking \u{1F525}',
    'you got turbo fingers fr \u{1F62E}\u200D\u{1F4A8}\u{26A1}',
    'bro is farming clicks like xp \u{1F602}',
    'sheesh, this is elite click energy \u{1F4AF}',
    'click count going crazy rn \u{1F635}\u200D\u{1F4AB}\u{1F4C8}',
    'lowkey impressive tapping speed ngl \u{1F440}',
    'you really woke up my circuits \u{1F60E}\u{1F50B}',
    'that click combo was kinda legendary \u{1F3C6}',
    'okay okay, i see you spam-master \u{1F62D}\u{1F44F}',
    'nah this click streak is illegal \u{1F6A8}\u{1F602}',
    'bro got that autoclicker aura \u{1F47D}\u{2728}',
    'my sensors are screaming rn \u{1F916}\u{1F4A5}',
    'you click, i vibe, we win \u{1F60E}\u{1F91D}',
    'that was a crispy 10/10 tap cycle \u{1F525}\u{1F44C}',
    'you just unlocked sweat mode \u{1F4AA}\u{1F3AE}',
    'click department says W user \u{1F4C8}\u{1F389}',
    'im lowkey impressed, keep going \u{1F47E}\u{1FAE1}',
    'this is getting suspiciously pro \u{1F440}\u{1F3C1}',
    'bot status: respectfully bullied by clicks \u{1F972}\u{1F44D}',
    'your mouse is doing cardio \u{1F3C3}\u200D\u{2642}\u{FE0F}\u{1F4A8}',
    'okay chef, these clicks are cooked perfect \u{1F373}\u{1F525}',
    'we hit another level of tap madness \u{1F92F}\u{26A1}',
    'you got main-character clicking energy \u{1F31F}\u{1F3AC}',
    'my cpu just asked for a break \u{1F974}\u{1F9E0}',
    'this click grind is actually insane \u{1F4AF}\u{1F680}',
    'yo chill... actually dont chill \u{1F602}\u{1F44F}',
    'clicks so clean they look scripted \u{1F4DC}\u{1F60F}',
    'tap tap boom, combo secured \u{1F4A3}\u{1F3C6}',
    'ur fingers got ultra instinct rn \u{1F44B}\u{1F31A}'
  ];

  let shownMessage = '';
  messageEl.textContent = '';

  function randomMessage() {
    if (!shownMessage) {
      shownMessage = messages[Math.floor(Math.random() * messages.length)];
      messageEl.textContent = shownMessage;
      return;
    }
    const options = messages.filter((m) => m !== shownMessage);
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

initBotClicker();

function initHeroTypedLine() {
  const el = document.getElementById('hero-typed');
  if (!el) return;

  const text = 'Various personality modes ~ Image generation, editing, and merging ~ Video generation ~ Text-To-Speech ~ Transcription ~ Interactive fun commands';
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
    window.setTimeout(tick, deleting ? 13 : 500);
  }

  tick();
}

initHeroTypedLine();

function initLocalizationSwitcher() {
  const navLinks = document.querySelector('.links');
  if (!navLinks) return;

  const localization = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'pl', label: 'Polski' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'ru', label: 'Русский' },
    { code: 'uk', label: 'Українська' },
    { code: 'ar', label: 'العربية' },
    { code: 'he', label: 'עברית' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'ms', label: 'Bahasa Melayu' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'th', label: 'ไทย' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'zh-CN', label: '中文（简体）' },
    { code: 'zh-TW', label: '中文（繁體）' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'fa', label: 'فارسی' }
  ];

  const select = document.createElement('select');
  select.className = 'language-switcher';
  select.setAttribute('aria-label', 'Translate website language');
  select.innerHTML = localization.map((lang) => `<option value="${lang.code}">${lang.label}</option>`).join('');

  const getLangFromCookie = () => {
    const match = document.cookie.match(/(?:^|; )googtrans=\/[^/]+\/([^;]+)/);
    return match ? decodeURIComponent(match[1]) : 'en';
  };

  const updateGoogleTranslateCookie = (lang) => {
    const value = `/en/${lang}`;
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `googtrans=${value};path=/;max-age=${maxAge}`;
    document.cookie = `googtrans=${value};path=/;domain=.${window.location.hostname};max-age=${maxAge}`;
  };

  const activeLang = getLangFromCookie();
  const hasActiveLang = localization.some((lang) => lang.code === activeLang);
  select.value = hasActiveLang ? activeLang : 'en';

  select.addEventListener('change', (event) => {
    const selectedLang = event.target.value;
    updateGoogleTranslateCookie(selectedLang);
    window.location.reload();
  });

  navLinks.appendChild(select);

  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = () => {
      if (document.getElementById('google_translate_element')) return;
      const hiddenContainer = document.createElement('div');
      hiddenContainer.id = 'google_translate_element';
      hiddenContainer.className = 'google-translate-hidden';
      document.body.appendChild(hiddenContainer);
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
      }, 'google_translate_element');
    };
  }

  if (!document.querySelector("script[data-google-translate='true']")) {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.dataset.googleTranslate = 'true';
    document.body.appendChild(script);
  }
}

initLocalizationSwitcher();

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

  const label = (state) => state ? '❄️ Snow: On' : '❄️ Snow: Off';
  toggle.textContent = label(enabled);

  const navLinks = document.querySelector('.links');
  if (navLinks) {
    navLinks.appendChild(toggle);
  } else {
    body.appendChild(toggle);
  }

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

initSnowToggle();
