const http = require('http');
const path = require('path');
const fs = require('fs/promises');

const PORT = Number(process.env.PORT) || 8787;
const PUBLIC_DIR = path.resolve(__dirname);
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

async function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.socket.destroy();
        reject(new Error('Request body too large.'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

async function verifyTurnstile(token, remoteIp) {
  if (!TURNSTILE_SECRET) {
    throw new Error('TURNSTILE_SECRET_KEY is not set on the server.');
  }

  const formBody = new URLSearchParams({
    secret: TURNSTILE_SECRET,
    response: token
  });

  if (remoteIp) formBody.set('remoteip', remoteIp);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody
  });

  if (!response.ok) {
    throw new Error(`Turnstile siteverify failed with status ${response.status}.`);
  }

  return response.json();
}

async function handleSupportSubmission(req, res) {
  try {
    const body = await readRequestBody(req);
    const params = new URLSearchParams(body);
    const token = params.get('cf-turnstile-response');

    if (!token) {
      sendJson(res, 400, { ok: false, error: 'Missing Turnstile token.' });
      return;
    }

    const name = params.get('name') || '';
    const email = params.get('email') || '';
    const discordUserId = params.get('discord_user_id') || '';
    const message = params.get('message') || '';

    if (!name.trim() || !email.trim() || !discordUserId.trim() || !message.trim()) {
      sendJson(res, 400, { ok: false, error: 'Please complete all required fields.' });
      return;
    }

    const ip = req.socket.remoteAddress || '';
    const verification = await verifyTurnstile(token, ip);

    if (!verification.success) {
      sendJson(res, 403, { ok: false, error: 'Turnstile verification failed.' });
      return;
    }

    // TODO: Store, email, or forward the support request to your preferred system.
    sendJson(res, 200, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error.';
    sendJson(res, 500, { ok: false, error: message });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';

  const safePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const data = await fs.readFile(safePath);
    const ext = path.extname(safePath).toLowerCase();
    const type = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/support') {
    await handleSupportSubmission(req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
    return;
  }

  if (req.method === 'HEAD') {
    res.writeHead(204);
    res.end();
    return;
  }

  await serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Codunot site running at http://localhost:${PORT}`);
});
