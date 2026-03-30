/**
 * Life OS — Cloudflare Worker (secure GitHub Gist proxy)
 * ═══════════════════════════════════════════════════════
 * Deploy this to Cloudflare Workers. Set one environment variable:
 *
 *   GITHUB_PAT  =  ghp_xxxxxxxxxxxxxxxxxxxx   (your GitHub Personal Access Token)
 *                                               Scope required: gist only
 *
 * The PAT never touches the browser — it lives here, server-side.
 *
 * Routes handled:
 *   GET  /gist?id=<gistId>   → find-or-create the gist, return { id, content }
 *   PUT  /gist               → body { id, content } — save data to the gist
 *
 * Deploy steps (free plan, takes ~2 minutes):
 *   1. Go to https://dash.cloudflare.com → Workers & Pages → Create application → Create Worker
 *   2. Paste this entire file into the editor, click Save & Deploy
 *   3. Go to Settings → Variables → add:  GITHUB_PAT = your_token_here  (mark as Encrypted)
 *   4. Copy the Worker URL (e.g. https://life-os-sync.yourname.workers.dev)
 *   5. Paste that URL into WORKER_URL inside index.html (the one constant to set)
 */

const GIST_DESC     = 'life-os-data-v2';
const GIST_FILENAME = 'life-os.json';
const GITHUB_API    = 'https://api.github.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url  = new URL(request.url);
    const path = url.pathname;

    try {
      // ── GET /gist  →  find-or-create, return { id, content } ──────────────
      if (request.method === 'GET' && path === '/gist') {
        const knownId = url.searchParams.get('id') || '';
        const { id, content } = await findOrCreateGist(env, knownId);
        return json({ id, content });
      }

      // ── PUT /gist  →  save { id, content } to the gist ───────────────────
      if (request.method === 'PUT' && path === '/gist') {
        const body    = await request.json();
        const gistId  = body.id;
        const content = body.content;
        if (!gistId || !content) return error('Missing id or content', 400);
        await patchGist(env, gistId, content);
        return json({ ok: true });
      }

      return error('Not found', 404);
    } catch (e) {
      return error(e.message || 'Internal error', 500);
    }
  }
};

// ── GitHub API helpers ────────────────────────────────────────────────────────

function ghHeaders(env) {
  return {
    Authorization:  `token ${env.GITHUB_PAT}`,
    Accept:         'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent':   'life-os-worker/1.0',
  };
}

async function ghFetch(env, path, opts = {}) {
  const r = await fetch(GITHUB_API + path, {
    ...opts,
    headers: { ...ghHeaders(env), ...(opts.headers || {}) },
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`GitHub ${opts.method || 'GET'} ${path} → ${r.status}: ${body}`);
  }
  return r.json();
}

async function findOrCreateGist(env, knownId) {
  // If we already know the ID, just fetch it
  if (knownId) {
    try {
      const g = await ghFetch(env, `/gists/${knownId}`);
      return { id: g.id, content: g.files[GIST_FILENAME]?.content || '{}' };
    } catch (_) {
      // ID might be stale — fall through to search
    }
  }

  // Search through user's gists for one with our description
  const list = await ghFetch(env, '/gists?per_page=100');
  const existing = list.find(g => g.description === GIST_DESC);
  if (existing) {
    // Fetch full content (list endpoint truncates large gists)
    const g = await ghFetch(env, `/gists/${existing.id}`);
    return { id: g.id, content: g.files[GIST_FILENAME]?.content || '{}' };
  }

  // Create a brand-new gist
  const created = await ghFetch(env, '/gists', {
    method: 'POST',
    body: JSON.stringify({
      description: GIST_DESC,
      public:      false,
      files:       { [GIST_FILENAME]: { content: '{}' } },
    }),
  });
  return { id: created.id, content: '{}' };
}

async function patchGist(env, id, content) {
  await ghFetch(env, `/gists/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify({ files: { [GIST_FILENAME]: { content } } }),
  });
}

// ── Response helpers ──────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function error(msg, status = 500) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
