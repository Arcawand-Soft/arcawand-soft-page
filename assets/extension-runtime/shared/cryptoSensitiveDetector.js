(function initCryptoSensitiveDetector(global) {
  const CONTEXT_RE = /(?:crypto|cryptocurrency|wallet|bitcoin|ethereum|solana|blockchain|metamask|ledger|trezor|portefeuille|cryptomonnaie|cartera|monedero|schl[üu]ssel|wiederherstellungsphrase|портфел|助记词|私钥|ウォレット|秘密鍵|지갑|개인\s*키|محفظ|مفتاح\s*خاص)/iu;
  const SEED_LABEL_RE = /(?:seed(?:\s*phrase)?|recovery\s*(?:phrase|words?)|mnemonic|backup\s*phrase|phrase\s*de\s*r[ée]cup[ée]ration|phrase\s*secr[èe]te|frase\s*semilla|frase\s*de\s*recuperaci[oó]n|frase\s*di\s*recupero|wiederherstellungsphrase|fraza\s*odzyskiwania|助记词|復元フレーズ|복구\s*문구|عبارة\s*الاسترداد)/iu;
  const PRIVATE_LABEL_RE = /(?:private[_\s-]*key|secret[_\s-]*key|signing[_\s-]*key|wallet-private-key|cl[ée]\s*priv[ée]e|clave\s*privada|chiave\s*privata|privater\s*schl[üu]ssel|chave\s*privada|cheie\s*privat[ăa]|закрыт.{0,4}ключ|私钥|秘密鍵|개인\s*키|مفتاح\s*خاص)/iu;
  const ADDRESS_LABEL_RE = /(?:wallet[_\s-]*address|deposit[_\s-]*address|receive[_\s-]*address|adresse\s*(?:du\s*)?portefeuille|adresse\s*de\s*d[ée]p[oô]t|direcci[oó]n\s*(?:de\s*)?(?:cartera|dep[oó]sito)|indirizzo\s*(?:del\s*)?portafoglio|wallet[- ]adresse|адрес\s*кошелька|钱包地址|ウォレットアドレス|지갑\s*주소|عنوان\s*المحفظة)/iu;
  const BIP39_HINTS = new Set("abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress address adjust admit adult advance advice aerobic affair afford afraid again age agent agree ahead aim air airport aisle alarm album alcohol alert alien all alley allow almost alone alpha alter always amateur amazing among amount amused analyst anchor ancient anger angle angry animal ankle announce annual another answer antenna antique anxiety any apart apology appear apple approve april arch arctic area arena argue arm armed armor army around arrange arrest arrive arrow art artefact artist artwork ask aspect assault asset assist assume asthma athlete atom attack attend august aunt author auto autumn avocado avoid awake aware away awesome awful awkward axis baby bachelor bacon badge bag balance balcony ball bamboo banana banner bar barely bargain barrel base basic basket battle beach bean beauty because become beef before begin behave behind believe below belt bench benefit best betray better between beyond bicycle bid bike bind biology bird birth bitter black blade blame blanket blast bleak bless blind blood blossom blouse blue blur blush board boat body boil bomb bone bonus book boost border boring borrow boss bottom bounce box boy bracket brain brand brass brave bread breeze brick bridge brief bright bring brisk broccoli broken bronze broom brother brown brush bubble buddy budget buffalo build bulb bulk bullet bundle bunker burden burger burst bus business busy butter buyer buzz cable cactus cage cake call calm camera camp can canal cancel candy cannon canoe canvas canyon capable capital captain car carbon card cargo carpet carry cart case cash casino castle casual cat catalog catch category cattle caught cause caution cave ceiling celery cement census century cereal certain chair chalk champion change chaos chapter charge chase chat cheap check cheese chef cherry chest chicken chief child chimney choice choose chronic chuckle chunk churn cigar cinnamon circle citizen city civil claim clap clarify claw clay clean clerk clever click client cliff climb clinic clip clock clog close cloth cloud clown club clump cluster clutch coach coast coconut code coffee coil coin collect color column combine come comfort comic common company concert conduct confirm congress connect consider control convince cook cool copper copy coral core corn correct cost cotton couch country couple course cousin cover coyote crack cradle craft cram crane crash crater crawl crazy cream credit creek crew cricket crime crisp critic crop cross crouch crowd crucial cruel cruise crumble crunch crush cry crystal cube culture cup cupboard curious current curtain curve cushion custom cute cycle".split(" "));

  const PATTERNS = [
    ["pem_private_key", "critical", /-----BEGIN (?:EC |RSA |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----[\s\S]+?-----END (?:EC |RSA |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/u],
    ["extended_private_key", "critical", /\b(?:xprv|yprv|zprv|tprv|uprv|vprv)[1-9A-HJ-NP-Za-km-zX]{60,130}\b/u],
    ["extended_public_key", "address", /\b(?:xpub|ypub|zpub|tpub|upub|vpub)[1-9A-HJ-NP-Za-km-zX]{60,130}\b/u],
    ["wallet_keystore", "critical", /["'](?:crypto|Crypto)["']\s*:\s*\{[\s\S]{0,4000}?["']cipher["'][\s\S]{0,1500}?["'](?:ciphertext|kdf)["']/u],
    ["cardano_signing_key", "critical", /["']type["']\s*:\s*["'][^"']*SigningKey[^"']*["'][\s\S]{0,1000}?["']cborHex["']/u],
    ["bitcoin_wif", "critical", /\b(?:5[1-9A-HJ-NP-Za-km-zX]{47,58}|[KL][1-9A-HJ-NP-Za-km-zX]{47,58})\b/u],
    ["crypto_uri", "address", /\b(?:bitcoin|ethereum|litecoin|dogecoin|solana|monero|tron):[^\s<>'"]{20,220}/iu],
    ["ens_name", "address", /\b[a-z0-9][a-z0-9.-]{0,62}\.eth\b/iu],
    ["ethereum_address", "address", /\b0x[a-fA-F0-9]{40}\b/u],
    ["bitcoin_address", "address", /\b(?:bc1|tb1)[ac-hj-np-z02-9x]{11,87}\b|\b[13][1-9A-HJ-NP-Za-km-z]{25,34}\b/u],
    ["cardano_address", "address", /\b(?:addr|stake)(?:_test)?1[ac-hj-np-z02-9]{20,120}\b/u],
    ["monero_address", "address", /\b[48][1-9A-HJ-NP-Za-km-z]{94}(?:[1-9A-HJ-NP-Za-km-z]{11})?\b/u],
    ["tron_address", "address", /\bT[1-9A-HJ-NP-Za-km-z]{33}\b/u],
    ["xrp_address", "address", /\br[1-9A-HJ-NP-Za-km-z]{24,34}\b/u],
    ["stellar_address", "address", /\bG[A-Z2-7]{55}\b/u],
    ["litecoin_address", "address", /\b(?:ltc1[ac-hj-np-z02-9]{20,87}|[LM3][1-9A-HJ-NP-Za-km-z]{25,34})\b/u],
    ["dogecoin_address", "address", /\bD[1-9A-HJ-NP-Za-km-z]{25,34}\b/u],
    ["bitcoin_cash_address", "address", /\b(?:bitcoincash:)?[qp][a-z0-9]{41}\b/iu]
  ];

  function normalizedSeedWords(text) {
    const afterLabel = String(text).replace(/[\s\S]*?(?:seed(?:\s*phrase)?|recovery\s*(?:phrase|words?)|mnemonic|phrase\s*de\s*r[ée]cup[ée]ration|frase\s*semilla|wiederherstellungsphrase)\s*(?:is|es|lautet|:|=)?/iu, " ");
    return afterLabel.replace(/^\s*\d+[.)]\s*/gmu, " ").match(/[\p{L}]{3,}/gu) || [];
  }

  function hasProbableSeedPhrase(text) {
    const words = normalizedSeedWords(text);
    for (const size of [24, 21, 18, 15, 12]) {
      for (let start = 0; start + size <= words.length; start += 1) {
        const candidate = words.slice(start, start + size);
        const known = candidate.filter((word) => BIP39_HINTS.has(word.toLowerCase())).length;
        if (known >= size - 2 && (SEED_LABEL_RE.test(text) || known >= size - 1)) return true;
      }
    }
    return false;
  }

  function compactPrivateCandidates(text) {
    const results = [];
    const labelled = PRIVATE_LABEL_RE.test(text);
    if (labelled) {
      const tail = String(text).slice(String(text).search(PRIVATE_LABEL_RE)).replace(PRIVATE_LABEL_RE, "");
      const compactTail = tail.slice(0, 180).replace(/^\s*(?:=|:|\/\/)?\s*(?:0x)?/iu, "").replace(/[^a-fA-F0-9]/gu, "");
      if (compactTail.length >= 48 && compactTail.length <= 80) results.push(compactTail);
    }
    const candidates = String(text).match(/(?:0x)?[a-fA-F0-9](?:[a-fA-F0-9\s|:-]{62,140})[a-fA-F0-9]/gu) || [];
    for (const candidate of candidates) {
      const compact = candidate.replace(/^0x/u, "").replace(/[^a-fA-F0-9]/gu, "");
      if ((compact.length === 64 || (labelled && compact.length >= 48 && compact.length <= 80))) results.push(compact);
    }
    return results;
  }

  function hasContextualBase58Address(text) {
    if (!ADDRESS_LABEL_RE.test(text) && !CONTEXT_RE.test(text)) return false;
    return /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/u.test(text);
  }

  function detectCryptoSensitiveData(value) {
    const text = String(value || "").trim();
    if (!text || text.length < 7) return { shouldWarn: false, risk: "none", signalCodes: [] };
    const hits = [];
    for (const [code, risk, regex] of PATTERNS) if (regex.test(text)) hits.push({ code, risk });
    if (hasProbableSeedPhrase(text)) hits.push({ code: "seed_phrase", risk: "critical" });
    if (compactPrivateCandidates(text).length) hits.push({ code: "hex_private_key", risk: "critical" });
    if (PRIVATE_LABEL_RE.test(text) && /\b[1-9A-HJ-NP-Za-km-z]{43,100}\b/u.test(text)) hits.push({ code: "labelled_private_key", risk: "critical" });
    if (hasContextualBase58Address(text)) hits.push({ code: "contextual_wallet_address", risk: "address" });
    if (/\bwallet-private-key:\/\//iu.test(text)) hits.push({ code: "private_key_uri", risk: "critical" });
    const signalCodes = [...new Set(hits.map((hit) => hit.code))];
    const risk = hits.some((hit) => hit.risk === "critical") ? "critical" : hits.length ? "address" : "none";
    return { shouldWarn: hits.length > 0, risk, signalCodes };
  }

  global.MCP = global.MCP || {};
  global.MCP.detectCryptoSensitiveData = detectCryptoSensitiveData;
})(globalThis);
