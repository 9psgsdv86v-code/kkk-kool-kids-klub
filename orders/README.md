# Objednávky

Zložka pre automatické ukladanie objednávok (cez GitHub Action `orders.yml`).

- Hlavný kanál: komentáre v **issue #4**
  (`https://github.com/9psgsdv86v-code/kkk-kool-kids-klub/issues/4`)
- Každá objednávka = 1 komentár s `id`, `menom`, `kde` (adresa doručenia),
  `kedy` + `kedy_sk` (čas), `polozkami`, `sumou`, `poznámkou`
- Bonus: riadky JSON v `orders.jsonl` (cez Action `repository_dispatch`)
- Bez backendu: stránka text skopíruje a otvorí issue #4 na ručné vloženie
