# Objednávky

Zložka pre automatické ukladanie objednávok (cez GitHub Action `orders.yml`).

- Každá objednávka = 1 riadok JSON v `orders.jsonl`
- Obsahuje: `id`, `meno`, `kde` (adresa doručenia), `kedy` + `kedy_sk` (čas), `polozky`, `suma`, `poznamka`
- Bez backendu chodia objednávky ako **GitHub Issues** s labelom `objednavka` — pozri stránku, sekcia Prevádzka.
