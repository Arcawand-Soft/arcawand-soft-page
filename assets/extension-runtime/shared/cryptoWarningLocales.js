(function initCryptoWarningLocales(global) {
  const messages = {
    en: ["Sensitive crypto data detected", "Before you continue", "This content may contain a cryptocurrency private key, recovery phrase, or other secret. Even though Ultimate Clipboard Pro is designed to store data securely, saving this type of information is not recommended.", "This content may contain a cryptocurrency wallet address or related identifier. Detection can produce false positives, so confirm that you intentionally want to save it.", "Never share a private key or recovery phrase. Anyone who obtains it may be able to control the associated assets.", "Do not capture", "Capture anyway"],
    fr: ["Données crypto sensibles détectées", "Avant de continuer", "Ce contenu semble pouvoir contenir une clé privée, une phrase de récupération ou un autre secret lié aux cryptomonnaies. Même si Ultimate Clipboard Pro est conçu pour stocker vos données de façon sécurisée, il est déconseillé d’enregistrer ce type d’information.", "Ce contenu semble pouvoir contenir une adresse de portefeuille crypto ou un identifiant associé. La détection peut produire un faux positif : confirmez que vous souhaitez réellement l’enregistrer.", "Ne partagez jamais une clé privée ou une phrase de récupération. Toute personne qui l’obtient peut potentiellement contrôler les actifs associés.", "Ne pas capturer", "Capturer quand même"],
    de: ["Sensible Kryptodaten erkannt", "Bevor Sie fortfahren", "Dieser Inhalt könnte einen privaten Kryptoschlüssel, eine Wiederherstellungsphrase oder ein anderes Geheimnis enthalten. Obwohl Ultimate Clipboard Pro für eine sichere Speicherung entwickelt wurde, wird das Speichern solcher Daten nicht empfohlen.", "Dieser Inhalt könnte eine Krypto-Wallet-Adresse oder eine zugehörige Kennung enthalten. Die Erkennung kann falsch positiv sein; bestätigen Sie daher die beabsichtigte Speicherung.", "Teilen Sie niemals einen privaten Schlüssel oder eine Wiederherstellungsphrase. Wer sie besitzt, kann möglicherweise über die zugehörigen Vermögenswerte verfügen.", "Nicht erfassen", "Trotzdem erfassen"],
    es: ["Datos criptográficos sensibles detectados", "Antes de continuar", "Este contenido podría incluir una clave privada, frase de recuperación u otro secreto de criptomonedas. Aunque Ultimate Clipboard Pro está diseñado para almacenar datos de forma segura, no se recomienda guardar este tipo de información.", "Este contenido podría incluir una dirección de cartera de criptomonedas o un identificador relacionado. La detección puede generar falsos positivos; confirma que realmente deseas guardarlo.", "Nunca compartas una clave privada ni una frase de recuperación. Quien la obtenga podría controlar los activos asociados.", "No capturar", "Capturar de todos modos"],
    it: ["Dati crypto sensibili rilevati", "Prima di continuare", "Questo contenuto potrebbe includere una chiave privata, una frase di recupero o un altro segreto legato alle criptovalute. Anche se Ultimate Clipboard Pro è progettato per archiviare i dati in sicurezza, il salvataggio di queste informazioni è sconsigliato.", "Questo contenuto potrebbe includere un indirizzo di portafoglio crypto o un identificatore correlato. Il rilevamento può produrre falsi positivi: conferma di volerlo salvare.", "Non condividere mai una chiave privata o una frase di recupero. Chiunque la ottenga potrebbe controllare gli asset associati.", "Non acquisire", "Acquisisci comunque"],
    ro: ["Date cripto sensibile detectate", "Înainte de a continua", "Acest conținut poate include o cheie privată, o frază de recuperare sau un alt secret cripto. Deși Ultimate Clipboard Pro este conceput pentru stocare sigură, salvarea acestui tip de informații nu este recomandată.", "Acest conținut poate include o adresă de portofel cripto sau un identificator asociat. Detectarea poate da rezultate fals pozitive; confirmați că doriți să îl salvați.", "Nu partajați niciodată o cheie privată sau o frază de recuperare. Oricine o obține poate controla activele asociate.", "Nu captura", "Capturează oricum"],
    pt: ["Dados cripto sensíveis detetados", "Antes de continuar", "Este conteúdo pode incluir uma chave privada, frase de recuperação ou outro segredo de criptomoeda. Embora o Ultimate Clipboard Pro tenha sido concebido para armazenamento seguro, não é recomendado guardar este tipo de informação.", "Este conteúdo pode incluir um endereço de carteira cripto ou identificador relacionado. A deteção pode produzir falsos positivos; confirme que pretende guardá-lo.", "Nunca partilhe uma chave privada ou frase de recuperação. Quem a obtiver poderá controlar os ativos associados.", "Não capturar", "Capturar mesmo assim"],
    ar: ["تم اكتشاف بيانات عملات رقمية حساسة", "قبل المتابعة", "قد يتضمن هذا المحتوى مفتاحًا خاصًا أو عبارة استرداد أو سرًا آخر متعلقًا بالعملات الرقمية. رغم أن Ultimate Clipboard Pro مصمم للتخزين الآمن، لا يُنصح بحفظ هذا النوع من المعلومات.", "قد يتضمن هذا المحتوى عنوان محفظة عملات رقمية أو معرّفًا مرتبطًا بها. قد ينتج عن الاكتشاف إنذار خاطئ، لذا أكّد أنك تريد حفظه فعلًا.", "لا تشارك مطلقًا مفتاحًا خاصًا أو عبارة استرداد. قد يتمكن من يحصل عليها من التحكم في الأصول المرتبطة.", "عدم الالتقاط", "الالتقاط رغم ذلك"],
    zh: ["检测到敏感的加密货币数据", "继续之前", "此内容可能包含加密货币私钥、助记词或其他机密信息。虽然 Ultimate Clipboard Pro 旨在安全存储数据，但不建议保存此类信息。", "此内容可能包含加密货币钱包地址或相关标识符。检测可能出现误报，请确认您确实希望保存。", "切勿分享私钥或助记词。获得它的人可能能够控制相关资产。", "不捕获", "仍然捕获"],
    ja: ["機密性の高い暗号資産データを検出", "続行する前に", "この内容には暗号資産の秘密鍵、復元フレーズ、またはその他の機密情報が含まれている可能性があります。Ultimate Clipboard Pro は安全な保存を目的としていますが、この種の情報の保存は推奨されません。", "この内容には暗号資産ウォレットのアドレスまたは関連識別子が含まれている可能性があります。誤検知の可能性があるため、意図して保存することを確認してください。", "秘密鍵や復元フレーズは絶対に共有しないでください。入手した人が関連資産を管理できる可能性があります。", "キャプチャしない", "それでもキャプチャ"],
    ru: ["Обнаружены конфиденциальные криптоданные", "Перед продолжением", "Этот материал может содержать закрытый ключ, фразу восстановления или другой криптовалютный секрет. Хотя Ultimate Clipboard Pro предназначен для безопасного хранения, сохранять такие данные не рекомендуется.", "Этот материал может содержать адрес криптокошелька или связанный идентификатор. Возможны ложные срабатывания; подтвердите, что действительно хотите сохранить его.", "Никогда не передавайте закрытый ключ или фразу восстановления. Получивший их человек может управлять связанными активами.", "Не сохранять", "Всё равно сохранить"],
    nl: ["Gevoelige cryptogegevens gedetecteerd", "Voordat u doorgaat", "Deze inhoud kan een privésleutel, herstelzin of ander cryptogeheim bevatten. Hoewel Ultimate Clipboard Pro is ontworpen voor veilige opslag, wordt het opslaan van dit soort informatie afgeraden.", "Deze inhoud kan een cryptowalletadres of gerelateerde identificatie bevatten. Detectie kan een fout-positief resultaat geven; bevestig dat u dit bewust wilt opslaan.", "Deel nooit een privésleutel of herstelzin. Wie deze verkrijgt, kan mogelijk de gekoppelde activa beheren.", "Niet vastleggen", "Toch vastleggen"],
    pl: ["Wykryto wrażliwe dane kryptowalutowe", "Przed kontynuowaniem", "Ta treść może zawierać klucz prywatny, frazę odzyskiwania lub inny sekret kryptowalutowy. Chociaż Ultimate Clipboard Pro zapewnia bezpieczne przechowywanie, zapisywanie takich informacji nie jest zalecane.", "Ta treść może zawierać adres portfela kryptowalutowego lub powiązany identyfikator. Wykrywanie może dać wynik fałszywie dodatni; potwierdź zamiar zapisania.", "Nigdy nie udostępniaj klucza prywatnego ani frazy odzyskiwania. Osoba, która je uzyska, może przejąć kontrolę nad powiązanymi aktywami.", "Nie przechwytuj", "Przechwyć mimo to"],
    tr: ["Hassas kripto verileri algılandı", "Devam etmeden önce", "Bu içerik bir özel anahtar, kurtarma ifadesi veya başka bir kripto para sırrı içerebilir. Ultimate Clipboard Pro güvenli depolama için tasarlanmış olsa da bu tür bilgileri kaydetmeniz önerilmez.", "Bu içerik bir kripto cüzdan adresi veya ilgili tanımlayıcı içerebilir. Algılama yanlış pozitif üretebilir; kaydetmek istediğinizi doğrulayın.", "Özel anahtarı veya kurtarma ifadesini asla paylaşmayın. Bunları alan kişi ilişkili varlıkları kontrol edebilir.", "Yakalama", "Yine de yakala"],
    ko: ["민감한 암호화폐 데이터 감지", "계속하기 전에", "이 콘텐츠에는 암호화폐 개인 키, 복구 문구 또는 기타 비밀 정보가 포함될 수 있습니다. Ultimate Clipboard Pro는 안전한 저장을 위해 설계되었지만 이러한 정보의 저장은 권장되지 않습니다.", "이 콘텐츠에는 암호화폐 지갑 주소 또는 관련 식별자가 포함될 수 있습니다. 오탐일 수 있으므로 저장 의도를 확인하세요.", "개인 키나 복구 문구를 절대 공유하지 마세요. 이를 얻은 사람이 관련 자산을 제어할 수 있습니다.", "캡처하지 않기", "그래도 캡처"],
    hi: ["संवेदनशील क्रिप्टो डेटा मिला", "आगे बढ़ने से पहले", "इस सामग्री में क्रिप्टोकरेंसी निजी कुंजी, रिकवरी वाक्यांश या अन्य गोपनीय जानकारी हो सकती है। Ultimate Clipboard Pro सुरक्षित संग्रहण के लिए बनाया गया है, फिर भी ऐसी जानकारी सहेजने की सलाह नहीं दी जाती।", "इस सामग्री में क्रिप्टो वॉलेट पता या संबंधित पहचानकर्ता हो सकता है। पहचान में गलत सकारात्मक परिणाम संभव है; पुष्टि करें कि आप इसे जानबूझकर सहेजना चाहते हैं।", "निजी कुंजी या रिकवरी वाक्यांश कभी साझा न करें। इसे पाने वाला व्यक्ति संबंधित संपत्तियों को नियंत्रित कर सकता है।", "कैप्चर न करें", "फिर भी कैप्चर करें"]
  };
  const riskTitles = {
    en: ["Critical warning — highly sensitive crypto data detected", "Warning — crypto data detected"],
    fr: ["Avertissement critique — donnée crypto hautement sensible détectée", "Attention — donnée crypto détectée"],
    de: ["Kritische Warnung — hochsensible Kryptodaten erkannt", "Warnung — Kryptodaten erkannt"],
    es: ["Advertencia crítica: datos criptográficos muy sensibles detectados", "Atención: datos criptográficos detectados"],
    it: ["Avviso critico — rilevati dati crypto altamente sensibili", "Attenzione — rilevati dati crypto"],
    ro: ["Avertisment critic — date cripto extrem de sensibile detectate", "Atenție — date cripto detectate"],
    pt: ["Aviso crítico — dados cripto altamente sensíveis detetados", "Atenção — dados cripto detetados"],
    ar: ["تحذير حرج — تم اكتشاف بيانات عملات رقمية شديدة الحساسية", "تنبيه — تم اكتشاف بيانات عملات رقمية"],
    zh: ["严重警告——检测到高度敏感的加密货币数据", "注意——检测到加密货币数据"],
    ja: ["重大な警告 — 機密性の高い暗号資産データを検出", "注意 — 暗号資産データを検出"],
    ru: ["Критическое предупреждение — обнаружены особо конфиденциальные криптоданные", "Внимание — обнаружены криптоданные"],
    nl: ["Kritieke waarschuwing — zeer gevoelige cryptogegevens gedetecteerd", "Let op — cryptogegevens gedetecteerd"],
    pl: ["Ostrzeżenie krytyczne — wykryto wysoce wrażliwe dane kryptowalutowe", "Uwaga — wykryto dane kryptowalutowe"],
    tr: ["Kritik uyarı — son derece hassas kripto verileri algılandı", "Dikkat — kripto verileri algılandı"],
    ko: ["중요 경고 — 매우 민감한 암호화폐 데이터 감지", "주의 — 암호화폐 데이터 감지"],
    hi: ["गंभीर चेतावनी — अत्यधिक संवेदनशील क्रिप्टो डेटा मिला", "चेतावनी — क्रिप्टो डेटा मिला"]
  };
  const addressAdvice = {
    en: "A public address is not normally secret, but a substitution or incorrect destination can cause an irreversible loss of funds. Verify every character before using it.",
    fr: "Une adresse publique n’est normalement pas confidentielle, mais une substitution ou une mauvaise destination peut entraîner une perte irréversible de fonds. Vérifiez chaque caractère avant de l’utiliser.",
    de: "Eine öffentliche Adresse ist normalerweise nicht geheim, doch ein Austausch oder ein falsches Ziel kann zu einem unwiderruflichen Verlust führen. Prüfen Sie vor der Verwendung jedes Zeichen.",
    es: "Una dirección pública normalmente no es secreta, pero una sustitución o un destino incorrecto puede causar una pérdida irreversible. Comprueba cada carácter antes de usarla.",
    it: "Un indirizzo pubblico normalmente non è segreto, ma una sostituzione o una destinazione errata può causare una perdita irreversibile. Verifica ogni carattere prima di usarlo.",
    ro: "O adresă publică nu este în mod normal secretă, dar o înlocuire sau o destinație greșită poate provoca pierderi ireversibile. Verificați fiecare caracter înainte de utilizare.",
    pt: "Um endereço público normalmente não é secreto, mas uma substituição ou destino incorreto pode causar uma perda irreversível. Verifique todos os caracteres antes de o utilizar.",
    ar: "العنوان العام ليس سريًا عادةً، لكن استبداله أو استخدام وجهة خاطئة قد يؤدي إلى خسارة أموال لا يمكن عكسها. تحقّق من كل حرف قبل الاستخدام.",
    zh: "公开地址通常并非机密，但地址被替换或目标错误可能导致资金永久损失。使用前请核对每个字符。",
    ja: "公開アドレスは通常秘密情報ではありませんが、置換や送付先の誤りは資産の回復不能な損失につながります。使用前にすべての文字を確認してください。",
    ru: "Публичный адрес обычно не является секретом, но подмена или неверный получатель могут привести к необратимой потере средств. Перед использованием проверьте каждый символ.",
    nl: "Een openbaar adres is normaal niet geheim, maar vervanging of een verkeerde bestemming kan onherstelbaar verlies veroorzaken. Controleer elk teken vóór gebruik.",
    pl: "Adres publiczny zwykle nie jest tajny, ale podmiana lub błędny cel mogą spowodować nieodwracalną utratę środków. Przed użyciem sprawdź każdy znak.",
    tr: "Herkese açık bir adres normalde gizli değildir; ancak değiştirilmesi veya yanlış hedef kullanılması geri döndürülemez kayba yol açabilir. Kullanmadan önce her karakteri doğrulayın.",
    ko: "공개 주소는 일반적으로 비밀 정보가 아니지만 주소 바꿔치기나 잘못된 대상은 되돌릴 수 없는 자산 손실을 일으킬 수 있습니다. 사용 전에 모든 문자를 확인하세요.",
    hi: "सार्वजनिक पता सामान्यतः गोपनीय नहीं होता, लेकिन पता बदलने या गलत गंतव्य से धन की अपरिवर्तनीय हानि हो सकती है। उपयोग से पहले हर अक्षर जाँचें।"
  };
  function applyCryptoWarningLocales() {
    Object.entries(messages).forEach(([language, values]) => {
      const locale = global.MCP_LOCALES?.[language];
      if (!locale) return;
      ["title", "eyebrow", "criticalMessage", "addressMessage", "advice", "decline", "confirm"].forEach((key, index) => {
        locale[`cryptoWarning.${key}`] = values[index];
      });
      locale["cryptoWarning.criticalTitle"] = riskTitles[language][0];
      locale["cryptoWarning.addressTitle"] = riskTitles[language][1];
      locale["cryptoWarning.addressAdvice"] = addressAdvice[language];
    });
  }
  global.MCP = global.MCP || {};
  global.MCP.applyCryptoWarningLocales = applyCryptoWarningLocales;
  applyCryptoWarningLocales();
})(globalThis);
