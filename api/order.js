// Vercel serverless funkcia: POST /api/order → pridá KOMENTÁR do issue #4 automaticky.
// Token NIE JE v stránke, len tu na serveri (Vercel → Settings → Environment Variables).
// Env: GITHUB_TOKEN (Fine-grained, repo: Issues Read&Write), GH_OWNER, GH_REPO, GH_ISSUE_NUMBER (predvolené 4).

function eur(v) { return Number(v).toFixed(2).replace('.', ',') + ' €'; }

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method === 'GET') return res.status(200).json({ ok: true, usage: 'POST /api/order {id,meno,kde,kedy,...}' });
  if (req.method !== 'POST') return res.status(404).json({ ok: false });

  const OWNER = process.env.GH_OWNER || '9psgsdv86v-code';
  const REPO = process.env.GH_REPO || 'kkk-kool-kids-klub';
  const ISSUE = process.env.GH_ISSUE_NUMBER || '4';
  const TOKEN = process.env.GITHUB_TOKEN || '';
  if (!TOKEN) return res.status(500).json({ ok: false, error: 'Chýba GITHUB_TOKEN na serveri (Vercel env).' });

  const o = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  if (!o.meno || !o.kde) return res.status(400).json({ ok: false, error: 'Chýba meno / kde.' });

  const body = [
    `🍕 **Nová objednávka ${o.id}**`, '',
    `**Meno:** ${o.meno}`, '',
    `**KDE doručiť (adresa / telefón):** ${o.kde}`, '',
    `**KEDY objednané:** ${o.kedy_sk} (${o.kedy})`, '',
    `**Položky:**`,
    ...((o.polozky || []).map((x) => `- ${x.kusov}× ${x.pizza} — ${eur(x.spolu)}`)),
    '', `**Suma spolu:** ${eur(o.suma)}`,
    o.poznamka ? '' : '', o.poznamka ? `**Poznámka:** ${o.poznamka}` : '',
    '', `**Stránka:** ${o.odkial || ''}`,
  ].join('\n');

  const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${ISSUE}/comments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  });
  if (!r.ok) return res.status(502).json({ ok: false, error: 'GitHub API: ' + r.status + ' ' + (await r.text()) });
  const comment = await r.json();
  // bonus: spusti Action na zápis do orders/orders.jsonl
  try {
    await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' },
      body: JSON.stringify({ event_type: 'new-order', client_payload: o }),
    });
  } catch {}
  return res.status(200).json({ ok: true, issue: `https://github.com/${OWNER}/${REPO}/issues/${ISSUE}`, comment: comment.html_url });
};
