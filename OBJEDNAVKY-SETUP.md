# Systém objednávok → GitHub issue #4 (Pizza Island)

## Stav: AUTOMATICKY — 1 klik = komentár v issue #4 ✅

Stránka po kliknutí na **Potvrdiť objednávku** sama POSTne objednávku
(meno, KDE, KEDY, položky, suma) na `/api/order`. Backend ju pridá ako
**komentár do `https://github.com/9psgsdv86v-code/kkk-kool-kids-klub/issues/4`**.
Žiadne ďalšie klikanie.

Podmienka: backend musí bežať (raz ho nasadíš, potom už navždy).

## Nasadenie za 5 minút (Vercel, zadarmo)

1. V repe nechaj súbory `api/order.js` + `vercel.json` (už sú).
2. Vytvor token: GitHub → Settings → Developer settings →
   Personal access tokens → **Fine-grained** → repo
   `kkk-kool-kids-klub` → povolenie **Issues: Read & write** → Generate.
3. Choď na `vercel.com` → Add New → Project → vyber repo
   `kkk-kool-kids-klub` → Deploy.
4. Vercel → Project → Settings → Environment Variables doplň:
   - `GITHUB_TOKEN` = token z kroku 2
   - `GH_OWNER` = `9psgsdv86v-code`
   - `GH_REPO` = `kkk-kool-kids-klub`
   - `GH_ISSUE_NUMBER` = `4`
   → Redeploy.
5. Hotovo. V sekcii **Prevádzka** na stránke klikni **Otestovať** —
   musí svietiť `● AKTÍVNE`. Odvtedy ide každá objednávka sama do issue #4.

Alternatíva bez Vercela: `node api/order-server.js` s `GITHUB_TOKEN`
(plus `GH_ISSUE_NUMBER=4`) na vlastnom serveri/VPS a do políčka Endpoint
v sekcii Prevádzka vpíš `https://tvoj-server/api/order` → Uložiť.

## Kde objednávky nájdeš

- `https://github.com/9psgsdv86v-code/kkk-kool-kids-klub/issues/4`
  — každá objednávka = 1 komentár s ID, menom, **KDE (adresa)**,
  **KEDY (čas)**, položkami, sumou a poznámkou.
- Notifikácie: v issue #4 klikni **Subscribe** — nové komentáre ti prídu
  e-mailom + do GitHub appky.
- Bonus: backend spustí aj Action `orders.yml` → riadky v `orders/orders.jsonl`.

## Núdzový režim (backend nebeží)

Ak API neodpovedá, stránka objednávku uloží lokálne, text skopíruje do
schránky a otvorí issue #4 — text tam vložíš ako komentár ručne.
V Prevádzke vtedy svieti `● VYPNUTÉ`.
