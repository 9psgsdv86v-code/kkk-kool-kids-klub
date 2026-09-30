# Systém objednávok → GitHub (Pizza Island)

## Stav: AUTOMATICKY — 1 klik = hneď na GitHube ✅

Stránka po kliknutí na **Potvrdiť objednávku** sama POSTne objednávku
(meno, KDE, KEDY, položky, suma) na `/api/order`. Backend ju zapíše na GitHub
ako Issue s labelom `objednavka`. Žiadne ďalšie klikanie.

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
   → Redeploy.
5. Hotovo. V sekcii **Prevádzka** na stránke klikni **Otestovať** —
   musí svietiť `● AKTÍVNE`. Odvtedy ide každá objednávka sama na GitHub.

Alternatíva bez Vercela: `node api/order-server.js` s `GITHUB_TOKEN`
na vlastnom serveri/VPS a do políčka Endpoint v sekcii Prevádzka vpíš
`https://tvoj-server/api/order` → Uložiť.

## Kde objednávky nájdeš

- `https://github.com/9psgsdv86v-code/kkk-kool-kids-klub/issues?q=is%3Aissue+label%3Aobjednavka`
- Každé Issue obsahuje: ID, meno, **KDE (adresa)**, **KEDY (čas)**,
  položky, sumu, poznámku.
- Notifikácie: v repe `Watch → Custom → Issues` (chodia e-mailom + do appky).
- Bonus: backend spustí aj Action `orders.yml` → riadky v `orders/orders.jsonl`.

## Núdzový režim (backend nebeží)

Ak API neodpovedá, stránka objednávku uloží lokálne a otvorí
predvyplnené GitHub Issue na 1-klik potvrdenie. V Prevádzke vtedy svieti
`● VYPNUTÉ`.
