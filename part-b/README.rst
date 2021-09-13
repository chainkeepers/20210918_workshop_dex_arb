Část B - Posílání arbitrážních transakcí
========================================

Z čeho se skládá zisková arbitráž
+++++++++++++++++++++++++++++++++

- správné načasování, periodické vyhledávání příležitosti
- místo, pár, objem -> <- jiné místo, (obrácený )pár, týž objem.

Jak se zorientovat v dokumentaci DEXů a Solidity
++++++++++++++++++++++++++++++++++++++++++++++++

- Google "<DEX name> solidity" např. https://www.google.com/search?q=uniswap+v3+solidity 
- trh jako konkrétní místo směny vs. router
- pozorumění sample kódu, druhy proměnných, globální proměnné

arbitrážovací solidity contract
++++++++++++++++++++++++++++++++++++++++++++++

- vytvoření obslužného kódu pomocí `hardhat`
- napsat funkci, jež umožní provést obě směny v 1 transakci
- začínáme s co nejjednodušší funkčností

provedení arbitráže na testnetu
+++++++++++++++++++++++++++++++

- nastavení připojení na uzel testovací sítě
- nalezení a výměna adres DEXů
- získání test-ETH
- nasazení našeho kontraktu
- vyvolání směn v našem kontraktu

Navíc
=====

- https://www.chainkeepers.io/cs/hiring/
