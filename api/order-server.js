// Mini-backend pre objednávky Pizza Island (Node 18+, bez závislostí).
// Čo robí: prijme POST /api/order {id,meno,kde,kedy,...} a pridá KOMENTÁR
// do issue #4 v tvojom repe, takže objednávka pristane na GitHube aj s časom
// a adresou SAMA, bez toho aby zákazník musel čokoľvek potvrdzovať.
//
// Spustenie:
//   set GITHUB_TOKEN=ghp_tvoj_token          (Windows CMD)
//   $env:GITHUB_TOKEN="ghp_tvoj_token"       (PowerShell)
//   set GH_OWNER=9psgsdv86v-code
//   set GH_REPO=kkk-kool-kids-klub
//   set GH_ISSUE_NUMBER=4
//   node api/order-server.js
// Frontend na tej istej doméne potom POSTuje na /api/order automaticky.
//
// Token: GitHub → Settings → Developer settings → Personal access tokens →
// Fine-grained → vyber repo → povolenie Issues: Read & write.

const http = require('node:http');

const OWNER = process.env.GH_OWNER || '9psgsdv86v-code';
const REPO = process.env.GH_REPO || 'kkk-kool-kids-klub';
const TOKEN = process.env.GITHUB_TOKEN || '';
const PORT = process.env.PORT || 3000;

function eur(v) { return Number(v).toFixed(2).replace('.', ',') + ' €'; }

async function createIssue(o) {
  const title = `🍕 Objednávka ${o.id} — ${o.meno}`;
  const body = [
    `🍕 **Nová objednávka ${o.id}**`, '',
    `**Meno:** ${o.meno}`, '',
    `**KDE doručiť (adresa / telefón):** ${o.kde}`, '',
    `**KEDY objednané:** ${o.kedy_sk} (${o.kedy})`, '',
    `**Položky:**`,
    ...(o.polozky || []).map((x) => `- ${x.kusov}× ${x.pizza} — ${eur(x.spolu)}`),
    '', `**Suma spolu:** ${eur(o.suma)}`,
    o.poznamka ? '' : '', o.poznamka ? `**Poznámka:** ${o.poznamka}` : '',
    '', `**Stránka:** ${o.odkial || ''}`,
  ].join('\n');
  const ISSUE = process.env.GH_ISSUE_NUMBER || '4';
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues/${ISSUE}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error('GitHub API: ' + res.status + ' ' + (await res.text()));
  // voliteľne spusti aj Action zápis do orders/orders.jsonl:
  try {
    await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/dispatches`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/vnd.github+json' },
      body: JSON.stringify({ event_type: 'new-order', client_payload: o }),
    });
  } catch {}
  return res.json();
}

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method === 'POST' && req.url === '/api/order') {
    let raw = '';
    for await (const ch of req) raw += ch;
    try {
      const order = JSON.parse(raw);
      if (!TOKEN) throw new Error('Chýba GITHUB_TOKEN');
      const issue = await createIssue(order);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, issue: issue.html_url }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
    }
  }
  res.writeHead(404); res.end('Pizza Island order API — POST /api/order');
}).listen(PORT, () => console.log(`🍕 Order API beží na :${PORT}, repo ${OWNER}/${REPO}`));
