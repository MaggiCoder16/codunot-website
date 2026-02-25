const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
const COMMUNITY_FALLBACK_ICON = 'https://cdn.top.gg/icons/799571124189618176/041c2d0d7f2919cb19e56f2e1f8a0d79e7dc9940f870adf07feab99dd3ce0a04.webp';

const DISCORD_CLIENT_ID = '1435987186502733878';

function buildDiscordAuthorizeUrl() {
  const redirectUrl = new URL('index.html', window.location.href);
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
