Část A - Úvod do MEV a arbitráží
================================

Co je MEV
+++++++++

- MEV je Maximal Extractable Value.
- MEV je zisk z přerovnání transakcí v bloku


Jak poznat arbitráž na etherscanu
+++++++++++++++++++++++++++++++++

- Přílad: Swap na Uniswap v2: 2. tx v https://etherscan.io/block/13036863
- Jinak:  Kouknu na začátek bloku a třeba neco najdu...


Jak vybrat nejlepší DEXes pro arbitráž
+++++++++++++++++++++++++++++++++++++

- High level průzkum: https://defillama.com/protocols/dexes, https://dune.xyz/hagaetc/dex-metrics
- zisk = neefektivita * objem * (1 - fees)
- neefektivita ~ fees / objem


Jak posbírat všechny arbitráže, které proběhly
++++++++++++++++++++++++++++++++++++++++++++++

- Stáhneme všechny arbitráže mezi Uniswap V2 a Uniswap V3 v bloku 13036863
- Uměl by to někdo efektivněji?


Ziskovost arbitráží
+++++++++++++++++++

- Identifikujeme arbitráže mezi blokem X a Z
- Rozparsujeme jejich events, spočítáme profit a uložíme k transakcím do souboru
- Pak použijeme `jq` a uděláme si základní přehled


Viz také
========

- https://yvonnickfrin.dev/seven-libraries-to-build-nodejs-cli
