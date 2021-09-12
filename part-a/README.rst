Část A - Úvod do MEV a arbitráží
================================

Co je MEV
+++++++++

- MEV je Maximal Extractable Value.
- MEV je zisk z přerovnání transakcí v bloku
- Přílad: Swap na Uniswap v2: 2. tx v https://etherscan.io/block/13036863

Jak poznat arbitráž na etherscanu
+++++++++++++++++++++++++++++++++

- Kouknu na začátek bloku a učím se...


Jak posbírat všechny arbitráže, které probehly
++++++++++++++++++++++++++++++++++++++++++++++

- Pokusíme se stáhnout všechny arbitráže mezi Uniswap V2 a Uniswap V3
- Uměl by to někdo efektivněji?


Jak vybrat nejleší DEXes pro arbitráž
+++++++++++++++++++++++++++++++++++++

- High level průzkum: https://defillama.com/protocols/dexes
- zisk = neefektivita * objem * (1 - fees)
- neefektivita ~ fees / objem


Ziskovost arbitráží
+++++++++++++++++++

- Identifikujeme arbitráže mezi blokem X a Z
- Rozparsujeme jejich events, spočítáme profit a uložíme k transakcím do souboru
- Pak použijeme `jq` a uděláme si základní přehled


See also
========

- https://yvonnickfrin.dev/seven-libraries-to-build-nodejs-cli
