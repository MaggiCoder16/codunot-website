# codunot-website
website for my bot

## Turnstile support form
This repo now includes a lightweight Node server to handle the support form and Turnstile validation.

Required environment variables:
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret key for your site.
 - `DISCORD_WEBHOOK_URL`: Discord webhook URL for support form submissions.

Optional environment variables:
- `PORT`: Port to run the local server (defaults to `8787`).

Run locally (Node 18+ so `fetch` is available):
1. `set TURNSTILE_SECRET_KEY=your-secret-key` (Windows PowerShell: `$env:TURNSTILE_SECRET_KEY="your-secret-key"`)
2. `node server.js`
3. Open `http://localhost:8787/support/`

Notes:
- The support form posts to `/api/support` which verifies Turnstile server-side.
- Replace the TODO in `server.js` with your preferred ticketing or email workflow.

## Cloudflare Workers (always-on, free)
If you cannot keep a PC running, use a Cloudflare Worker to validate Turnstile 24/7.

1. Create a Worker (Dashboard or Wrangler).
2. Add a secret: `TURNSTILE_SECRET_KEY` (Workers -> Settings -> Variables -> Secrets).
3. Optional: add `ALLOWED_ORIGINS` as a comma-separated list, e.g. `https://yourdomain.com,https://yourname.github.io`.
4. Deploy `workers/turnstile-worker.js`.
5. Update `support/index.html` with your Worker URL in `data-endpoint`:
   `https://YOUR-WORKER-URL.workers.dev/api/support`

The support form will use the Worker endpoint automatically when `data-endpoint` is set.

## Gate the whole site with Turnstile (required challenge on every page)
If you want every page to require a Turnstile challenge, use the same Worker as an edge gate.

1. In Cloudflare Workers, add a **Route** that covers the whole site:
   - `codunot.app/*`
   - (optional) `www.codunot.app/*`
2. Keep `TURNSTILE_SECRET_KEY` set in Worker secrets.
3. Optional: set `TURNSTILE_SITE_KEY` as a text variable (defaults to `0x4AAAAAACrej254Ib5zTeox`).
4. The Worker will show a gate page until the user completes Turnstile, then it sets a cookie.

Notes:
- This blocks bots but also blocks crawlers/SEO unless you add exceptions.
- The gate cookie lasts 7 days by default (see `GATE_TTL_SECONDS` in the Worker).
