const SUPPORT_PATH = '/api/support';
const VERIFY_PATH = '/__turnstile/verify';
const LOGOUT_PATH = '/__turnstile/logout';
const GATE_COOKIE = 'codunot_gate';
const DISCORD_FIELD_LIMIT = 1024;
const GATE_COOKIE_OPTIONS = 'Path=/; Secure; HttpOnly; SameSite=Lax';

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const [name, ...rest] = entry.split('=');
      acc[name] = rest.join('=');
      return acc;
    }, {});
}

function buildGatePage(siteKey, redirectTo, errorMessage = '') {
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/';
  const errorBlock = errorMessage ? `<p class="error">${errorMessage}</p>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Codunot | Verify</title>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    :root {
      color-scheme: dark;
      font-family: "Sora", "Segoe UI", sans-serif;
      background: #0b1118;
      color: #eef4ff;
    }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background:
        radial-gradient(50rem 20rem at 10% -10%, rgba(255, 138, 31, 0.2), transparent 55%),
        radial-gradient(40rem 18rem at 90% 0%, rgba(100, 160, 255, 0.18), transparent 50%),
        #0b1118;
    }
    .gate-card {
      width: min(460px, 92vw);
      background: rgba(12, 18, 28, 0.92);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 2rem;
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
      text-align: center;
    }
    h1 { margin: 0 0 0.4rem; font-size: 1.6rem; }
    p { margin: 0 0 1.2rem; color: #a9b7cc; }
    .error { color: #ffb3b8; margin-bottom: 1rem; font-weight: 600; }
    .btn {
      margin-top: 1rem;
      background: linear-gradient(135deg, #ff8a1f, #ff6200);
      color: #180b05;
      border: none;
      border-radius: 12px;
      padding: 0.75rem 1.1rem;
      font-weight: 700;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="gate-card">
    <h1>Verify to Continue</h1>
    <p>Codunot uses a quick challenge to protect the site from spam and abuse.</p>
    ${errorBlock}
    <form action="${VERIFY_PATH}" method="POST">
      <input type="hidden" name="redirect" value="${safeRedirect}" />
      <div class="cf-turnstile" data-sitekey="${siteKey}"></div>
      <button class="btn" type="submit">Enter Codunot</button>
    </form>
  </div>
</body>
</html>`;
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...extraHeaders
    }
  });
}

function truncate(value, maxLength = DISCORD_FIELD_LIMIT) {
  if (typeof value !== 'string') return '';
  if (value.length <= maxLength) return value;
  const suffix = '...';
  return `${value.slice(0, Math.max(0, maxLength - suffix.length))}${suffix}`;
}

async function sendDiscordWebhook(env, payload) {
  if (!env.DISCORD_WEBHOOK_URL) throw new Error('DISCORD_WEBHOOK_URL is not set.');
  const response = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Discord webhook failed: ${response.status}. ${text.slice(0, 200)}`);
  }
}

async function verifyTurnstileToken(env, token, remoteIp) {
  if (!env.TURNSTILE_SECRET_KEY) throw new Error('TURNSTILE_SECRET_KEY is not set.');
  const verifyBody = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token
  });
  if (remoteIp) verifyBody.set('remoteip', remoteIp);
  const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: verifyBody
  });
  return verifyResponse.json();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Keep the public website crawlable by default. Turnstile still protects the
    // support endpoint below; the full-site gate must be explicitly enabled.
    const siteGateEnabled = env.ENABLE_SITE_GATE === 'true';

    // 1. BYPASS LOGIC (SEO & Sitemaps)
    const isVerifiedBot = request.cf?.verifiedBot;
    const isCrawlerFile = url.pathname === '/robots.txt' || url.pathname === '/sitemap.xml';
    
    if (isVerifiedBot || isCrawlerFile) {
      return fetch(request);
    }

    const cookies = parseCookies(request.headers.get('Cookie') || '');
    const siteKey = env.TURNSTILE_SITE_KEY || '0x4AAAAAACrej254Ib5zTeox';
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = (env.ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean);
    const allowOrigin = allowedOrigins.length ? (allowedOrigins.includes(origin) ? origin : '') : '*';

    // 2. LOGOUT HANDLER
    if (url.pathname === LOGOUT_PATH) {
      return new Response(null, {
        status: 204,
        headers: { 'Set-Cookie': `${GATE_COOKIE}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax` }
      });
    }

    // 3. TURNSTILE VERIFICATION HANDLER (GATE)
    if (siteGateEnabled && url.pathname === VERIFY_PATH && request.method === 'POST') {
      try {
        const bodyText = await request.text();
        const params = new URLSearchParams(bodyText);
        const token = params.get('cf-turnstile-response');
        const redirectTo = params.get('redirect') || '/';

        if (!token) {
          return new Response(buildGatePage(siteKey, redirectTo, 'Please complete the challenge.'), {
            status: 400, headers: { 'Content-Type': 'text/html' }
          });
        }

        const verification = await verifyTurnstileToken(env, token, request.headers.get('CF-Connecting-IP'));
        if (!verification.success) {
          return new Response(buildGatePage(siteKey, redirectTo, 'Verification failed. Try again.'), {
            status: 403, headers: { 'Content-Type': 'text/html' }
          });
        }

        const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/';
        return new Response(null, {
          status: 302,
          headers: {
            'Location': safeRedirect,
            'Set-Cookie': `${GATE_COOKIE}=1; ${GATE_COOKIE_OPTIONS}`
          }
        });
      } catch (e) {
        return new Response(buildGatePage(siteKey, '/', e.message), { status: 500, headers: { 'Content-Type': 'text/html' } });
      }
    }

    // 4. SUPPORT API HANDLER
    if (url.pathname === SUPPORT_PATH) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': allowOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        });
      }

      if (request.method !== 'POST') {
        return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, { 'Access-Control-Allow-Origin': allowOrigin });
      }

      try {
        const bodyText = await request.text();
        const params = new URLSearchParams(bodyText);
        const token = params.get('cf-turnstile-response');

        if (!token) return jsonResponse({ ok: false, error: 'Missing Turnstile token.' }, 400, { 'Access-Control-Allow-Origin': allowOrigin });

        const verification = await verifyTurnstileToken(env, token, request.headers.get('CF-Connecting-IP'));
        if (!verification.success) return jsonResponse({ ok: false, error: 'Turnstile verification failed.' }, 403, { 'Access-Control-Allow-Origin': allowOrigin });

        const name = (params.get('name') || '').trim();
        const email = (params.get('email') || '').trim();
        const topic = (params.get('topic') || '').trim();
        const serverId = (params.get('server_id') || '').trim();
        const discordUsername = (params.get('discord_username') || '').trim();
        const discordUserId = (params.get('discord_user_id') || '').trim();
        const message = (params.get('message') || '').trim();

        if (!name || !email || !message) {
          return jsonResponse({ ok: false, error: 'Please complete all required fields.' }, 400, { 'Access-Control-Allow-Origin': allowOrigin });
        }

        await sendDiscordWebhook(env, {
          username: 'Codunot Support',
          embeds: [{
            title: 'New Support Request',
            color: 0xff8a1f,
            fields: [
              { name: 'Name', value: truncate(name), inline: true },
              { name: 'Email', value: truncate(email), inline: true },
              { name: 'Topic', value: truncate(topic || '-'), inline: true },
              { name: 'Server ID', value: truncate(serverId || '-'), inline: true },
              { name: 'Discord Username', value: truncate(discordUsername || '-'), inline: true },
              { name: 'Discord User ID', value: truncate(discordUserId || 'N/A'), inline: true },
              { name: 'Message', value: truncate(message, 1800), inline: false }
            ],
            timestamp: new Date().toISOString()
          }]
        });

        return jsonResponse({ ok: true }, 200, { 'Access-Control-Allow-Origin': allowOrigin });
      } catch (e) {
        return jsonResponse({ ok: false, error: e.message }, 500, { 'Access-Control-Allow-Origin': allowOrigin });
      }
    }

    // 5. THE GATEKEEPER
    if (siteGateEnabled && !cookies[GATE_COOKIE]) {
      const redirectTo = `${url.pathname}${url.search}`;
      return new Response(buildGatePage(siteKey, redirectTo), {
        status: 401,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return fetch(request);
  }
};
