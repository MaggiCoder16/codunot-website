const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const COMMUNITY_FALLBACK_ICON = 'https://cdn.top.gg/icons/799571124189618176/041c2d0d7f2919cb19e56f2e1f8a0d79e7dc9940f870adf07feab99dd3ce0a04.webp';
const COMMUNITY_MIN_MEMBERS = 25;
const COMMUNITY_MAX_VISIBLE = 18;
const DISCORD_CLIENT_ID = '1435987186502733878';
const SITE_BASE = document.currentScript
  ? new URL('./', document.currentScript.src).href
  : new URL('./', window.location.href).href;
const GENERATION_PAGES = [
  ['Generation Hub', 'generation/'],
  ['Image Generation', 'generation/image-generation'],
  ['Video Generation', 'generation/video-generation'],
  ['Text-to-speech', 'generation/text-to-speech'],
  ['Video Transcription', 'generation/video-transcription'],
  ['Image Editing', 'generation/image-editing'],
  ['Image Merging', 'generation/image-merging'],
  ['Music Playback', 'generation/music-playback']
];
const SECONDARY_NAV_LINKS = [
  'faq/',
  'premium/',
  'support/',
  'terms/',
  'privacy/'
];
const AUTH_STORAGE_KEY = 'codunot_app_authorized';
const CLICKER_ACHIEVEMENTS = [
  { threshold: 1, icon: '⚡', title: 'First Tap', subtitle: '1 click' },
  { threshold: 5, icon: '🌟', title: 'Getting Started', subtitle: '5 clicks' },
  { threshold: 10, icon: '✨', title: 'Warmup', subtitle: '10 clicks' },
  { threshold: 25, icon: '🎯', title: 'Sharpshooter', subtitle: '25 clicks' },
  { threshold: 50, icon: '🔥', title: 'Click Streak', subtitle: '50 clicks' },
  { threshold: 100, icon: '💫', title: 'Centurion', subtitle: '100 clicks' },
  { threshold: 150, icon: '🤖', title: 'Bot Friend', subtitle: '150 clicks' },
  { threshold: 225, icon: '🚀', title: 'Velocity', subtitle: '225 clicks' },
  { threshold: 300, icon: '👑', title: 'Codunot Legend', subtitle: '300 clicks' },
  { threshold: 500, icon: '🏅', title: 'Half K', subtitle: '500 clicks' },
  { threshold: 1000, icon: '💎', title: 'One Thousand', subtitle: '1,000 clicks' },
  { threshold: 2000, icon: '🌠', title: 'Double Orbit', subtitle: '2,000 clicks' },
  { threshold: 3000, icon: '🛸', title: 'Triple Orbit', subtitle: '3,000 clicks' },
  { threshold: 4000, icon: '🏆', title: 'Crown Circuit', subtitle: '4,000 clicks' },
  { threshold: 5000, icon: '🔥', title: 'Five K Flame', subtitle: '5,000 clicks' },
  { threshold: 10000, icon: '🌌', title: 'Mythic Ten K', subtitle: '10,000 clicks' }
];

function buildSiteUrl(path) {
  return new URL(path, SITE_BASE).href;
}

function normalizePath(path) {
  const url = new URL(path, SITE_BASE);
  const normalized = url.pathname.toLowerCase().replace(/index\.html$/, '');
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

function createNavDropdown(label, extraClass = '') {
  const dropdown = document.createElement('div');
  dropdown.className = `nav-dropdown ${extraClass}`.trim();

  const trigger = document.createElement('button');
  trigger.className = 'nav-dropdown-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = `${label} <span class="nav-chevron" aria-hidden="true">▾</span>`;

  const menu = document.createElement('div');
  menu.className = 'nav-submenu';

  dropdown.appendChild(trigger);
  dropdown.appendChild(menu);

  return { dropdown, trigger, menu };
}

function attachNavDropdownBehavior(dropdown) {
  const trigger = dropdown.querySelector('.nav-dropdown-trigger');
  const menu = dropdown.querySelector('.nav-submenu');
  if (!trigger || !menu) return;

  const isCompact = () => window.matchMedia('(max-width: 980px)').matches;
  const closeMenu = () => {
    dropdown.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    dropdown.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  };

  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    if (dropdown.classList.contains('open')) closeMenu();
    else openMenu();
  });

  trigger.addEventListener('focus', () => openMenu());

  dropdown.addEventListener('mouseenter', () => {
    if (!isCompact()) openMenu();
  });

  dropdown.addEventListener('mouseleave', () => {
    if (!isCompact()) closeMenu();
  });

  menu.addEventListener('mouseenter', () => {
    if (!isCompact()) openMenu();
  });

  menu.addEventListener('focusin', () => openMenu());

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) closeMenu();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });
}

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
  const isAuthorized = authorizedNow || window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';

  if (authorizedNow) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  }

  if (isAuthorized) {
    const authLinks = document.querySelectorAll("a[href*='integration_type=1'][href*='applications.commands']");
    authLinks.forEach((link) => {
      link.style.display = 'none';
    });
    if (authorizedNow) history.replaceState({}, '', window.location.pathname + window.location.hash);
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

function initGenerationNav() {
  const links = document.querySelector('.links');
  if (!links || links.querySelector('.nav-dropdown')) return;

  const commandLink = Array.from(links.children).find((node) => (
    node instanceof HTMLAnchorElement && /commands\/?$/.test(node.getAttribute('href') || '')
  ));

  const { dropdown, menu } = createNavDropdown('Generation');

  const currentPath = normalizePath(window.location.pathname);
  if (currentPath.startsWith(normalizePath('generation/'))) dropdown.classList.add('is-current');

  GENERATION_PAGES.forEach(([label, path]) => {
    const link = document.createElement('a');
    link.href = buildSiteUrl(path);
    if (label === 'Generation Hub') {
      link.classList.add('is-hub-link');
      link.innerHTML = '<span class="nav-link-pill">Generation Hub</span>';
    } else {
      link.textContent = label;
    }
    if (currentPath === normalizePath(path)) link.classList.add('active');
    menu.appendChild(link);
  });

  if (commandLink) links.insertBefore(dropdown, commandLink);
  else links.appendChild(dropdown);

  attachNavDropdownBehavior(dropdown);
}

function initSecondaryNav() {
  const links = document.querySelector('.links');
  if (!links || links.querySelector('.nav-more')) return;

  const movedLinks = Array.from(links.querySelectorAll(':scope > a')).filter((link) => {
    const href = link.getAttribute('href') || '';
    return SECONDARY_NAV_LINKS.some((path) => href === path || href.endsWith(path));
  });

  if (!movedLinks.length) return;

  const { dropdown, menu } = createNavDropdown('More', 'nav-more');
  const currentPath = normalizePath(window.location.pathname);

  movedLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (currentPath === normalizePath(href)) {
      link.classList.add('active');
      dropdown.classList.add('is-current');
    }
    menu.appendChild(link);
  });

  const loginBtn = links.querySelector('.login-btn');
  if (loginBtn) links.insertBefore(dropdown, loginBtn);
  else links.appendChild(dropdown);

  attachNavDropdownBehavior(dropdown);
}

function initNavLayout() {
  const links = document.querySelector('.links');
  if (!links || links.querySelector('.links-main')) return;

  const mainGroup = document.createElement('div');
  mainGroup.className = 'links-main';

  const utilityGroup = document.createElement('div');
  utilityGroup.className = 'links-utility';

  Array.from(links.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) return;
    if (child.classList.contains('login-btn') || child.classList.contains('ambient-control')) {
      utilityGroup.appendChild(child);
      return;
    }
    mainGroup.appendChild(child);
  });

  links.appendChild(mainGroup);
  links.appendChild(utilityGroup);
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

function formatCommunityMembers(value) {
  const memberCount = Number(value);
  if (!Number.isFinite(memberCount) || memberCount <= 0) return 'Community Online';

  const formattedCount = new Intl.NumberFormat('en-US').format(memberCount);
  return `${formattedCount} member${memberCount === 1 ? '' : 's'}`;
}

function shouldDisplayCommunity(community) {
  const memberCount = Number(community?.members);
  return Boolean(
    community
    && community.icon
    && community.icon !== COMMUNITY_FALLBACK_ICON
    && Number.isFinite(memberCount)
    && memberCount >= COMMUNITY_MIN_MEMBERS
  );
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
      const featuredCommunities = communities
        .filter(shouldDisplayCommunity)
        .slice(0, COMMUNITY_MAX_VISIBLE);

      const sourceCommunities = featuredCommunities.length ? featuredCommunities : communities;
      const cards = sourceCommunities.map((c) => `
      <a class="community-card" href="${c.invite}" target="_blank" rel="noopener">
        <img src="${c.icon}" alt="${c.name} icon" onerror="this.onerror=null;this.src='${COMMUNITY_FALLBACK_ICON}';" />
        <div>
          <div class="community-name">${c.name}</div>
          <div class="community-row">
            <div class="community-members">${formatCommunityMembers(c.members)}</div>
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
  const achievementListEl = document.getElementById('achievement-list');
  if (!clicker || !countEl || !messageEl || !achievementListEl) return;

  const storedClicks = Number.parseInt(window.localStorage.getItem('codunot_click_count') || '0', 10);
  let clicks = Number.isNaN(storedClicks) ? 0 : storedClicks;
  const messages = [
    "i'm a bot, not a button, but okay! 🤖",
    'yo those clicks are clean, keep cooking 🔥',
    'bro is farming clicks like xp 😂',
    'that click combo was legendary 🏆',
    'click department says W user 📈🎉'
  ];

  let shownMessage = '';

  function renderAchievements() {
    achievementListEl.innerHTML = CLICKER_ACHIEVEMENTS.map((achievement) => {
      const unlocked = clicks >= achievement.threshold;
      return [
        `<article class="achievement-badge${unlocked ? ' is-unlocked' : ''}">`,
        `<span class="achievement-icon" aria-hidden="true">${achievement.icon}</span>`,
        '<div>',
        `<strong>${achievement.title}</strong>`,
        `<span>${achievement.subtitle}</span>`,
        '</div>',
        '</article>'
      ].join('');
    }).join('');
  }

  countEl.textContent = String(clicks);
  messageEl.textContent = clicks > 0 ? `saved clicks: ${clicks}` : '';
  renderAchievements();

  function randomMessage() {
    const options = messages.filter((message) => message !== shownMessage);
    shownMessage = options[Math.floor(Math.random() * options.length)];
    messageEl.textContent = shownMessage;
  }

  clicker.addEventListener('click', () => {
    clicks += 1;
    countEl.textContent = String(clicks);
    window.localStorage.setItem('codunot_click_count', String(clicks));
    renderAchievements();
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

  function renderParticles(config) {
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

  function renderAurora() {
    const shell = document.createElement('div');
    shell.className = 'ambient-shell ambient-aurora';
    for (let index = 0; index < 3; index += 1) {
      const band = document.createElement('span');
      band.className = 'ambient-band';
      band.style.setProperty('--x', `${10 + (index * 26)}%`);
      band.style.setProperty('--y', `${8 + (index * 12)}%`);
      band.style.setProperty('--delay', `${index * -3.4}s`);
      shell.appendChild(band);
    }
    scene.appendChild(shell);
  }

  function renderConstellation() {
    const shell = document.createElement('div');
    shell.className = 'ambient-shell ambient-constellation';

    for (let index = 0; index < 22; index += 1) {
      const star = document.createElement('span');
      star.className = 'ambient-star';
      star.style.left = `${6 + ((index * 91) % 88)}%`;
      star.style.top = `${8 + ((index * 37) % 74)}%`;
      star.style.setProperty('--delay', `${(index % 5) * -1.2}s`);
      shell.appendChild(star);
    }

    for (let index = 0; index < 10; index += 1) {
      const line = document.createElement('span');
      line.className = 'ambient-line';
      line.style.left = `${8 + ((index * 13) % 72)}%`;
      line.style.top = `${14 + ((index * 17) % 64)}%`;
      line.style.width = `${90 + ((index * 19) % 70)}px`;
      line.style.transform = `rotate(${18 + (index * 17)}deg)`;
      shell.appendChild(line);
    }

    scene.appendChild(shell);
  }

  function renderGrid() {
    const shell = document.createElement('div');
    shell.className = 'ambient-shell ambient-grid-mode';
    shell.innerHTML = '<span class="ambient-grid-layer"></span><span class="ambient-grid-glow"></span>';
    scene.appendChild(shell);
  }

  function renderOrbit() {
    const shell = document.createElement('div');
    shell.className = 'ambient-shell ambient-orbit';

    for (let index = 0; index < 3; index += 1) {
      const ring = document.createElement('span');
      ring.className = 'ambient-ring';
      ring.style.setProperty('--scale', `${1 + (index * 0.22)}`);
      ring.style.setProperty('--delay', `${index * -3.2}s`);
      shell.appendChild(ring);
    }

    for (let index = 0; index < 3; index += 1) {
      const orb = document.createElement('span');
      orb.className = 'ambient-orbiter';
      orb.style.setProperty('--delay', `${index * -2.4}s`);
      orb.style.setProperty('--radius', `${94 + (index * 34)}px`);
      shell.appendChild(orb);
    }

    scene.appendChild(shell);
  }

  function renderAmbient(nextMode) {
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
        type: 'particles',
        total: 108,
        glyphs: ['❄', '❅', '✻'],
        sizeMin: 0.92,
        sizeRange: 1.18,
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
        type: 'particles',
        total: 72,
        glyphs: ['✦', '•', '✧'],
        sizeMin: 0.74,
        sizeRange: 0.84,
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
        type: 'particles',
        total: 84,
        glyphs: ['✦', '·', '•'],
        sizeMin: 1.08,
        sizeRange: 0.96,
        alphaMin: 0.44,
        alphaRange: 0.3,
        durationMin: 14,
        durationRange: 12,
        driftMin: -10,
        driftRange: 20,
        jitterPattern: 8,
        jitterStep: 0.42,
        className: 'stardust'
      },
      rain: {
        type: 'particles',
        total: 92,
        glyphs: ['|', '|', '│'],
        sizeMin: 1,
        sizeRange: 0.66,
        alphaMin: 0.24,
        alphaRange: 0.2,
        durationMin: 5,
        durationRange: 4,
        driftMin: -6,
        driftRange: 12,
        jitterPattern: 9,
        jitterStep: 0.3,
        className: 'rain'
      },
      aurora: {
        type: 'aurora'
      },
      constellation: {
        type: 'constellation'
      },
      grid: {
        type: 'grid'
      },
      orbit: {
        type: 'orbit'
      }
    };
    const config = configs[nextMode] || configs.snow;

    if (config.type === 'aurora') {
      renderAurora();
      return;
    }

    if (config.type === 'constellation') {
      renderConstellation();
      return;
    }

    if (config.type === 'grid') {
      renderGrid();
      return;
    }

    if (config.type === 'orbit') {
      renderOrbit();
      return;
    }

    renderParticles(config);
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
    ['aurora', 'Aurora'],
    ['constellation', 'Constellation'],
    ['grid', 'Grid'],
    ['orbit', 'Orbit'],
    ['off', 'Off']
  ].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });

  wrapper.appendChild(select);

  const navUtility = document.querySelector('.links-utility');
  const navLinks = document.querySelector('.links');
  if (navUtility) navUtility.appendChild(wrapper);
  else if (navLinks) navLinks.appendChild(wrapper);
  else body.appendChild(wrapper);

  function setMode(nextMode) {
    select.value = nextMode;
    renderAmbient(nextMode);
    window.localStorage.setItem('codunot_background_mode', nextMode);
    window.localStorage.setItem('codunot_snow_enabled', String(nextMode === 'snow'));
  }

  select.addEventListener('change', () => {
    setMode(select.value);
  });

  setMode(mode);
}

function initGlowCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor-glow';
  document.body.appendChild(cursor);

  const interactiveSelector = 'a, button, .btn, .badge, summary, .community-card, .bot-clicker';

  document.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add('is-visible');
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
    cursor.classList.remove('is-active');
  });

  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
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
initGenerationNav();
initSecondaryNav();
initNavLayout();
initHamburgerMenu();
initAuthButtons();
loadCommunities();
initBotClicker();
initHeroTypedLine();
initAmbientModeControl();
initGlowCursor();
initRevealAnimations();
