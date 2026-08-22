(function initToolUpgradeLocales(global) {
  const keys = [
    "tools.workbench.live", "tools.workbench.local", "tools.workbench.paste", "tools.workbench.example", "tools.workbench.smart",
    "tools.workbench.swap", "tools.workbench.reset", "tools.workbench.undo", "tools.workbench.redo", "tools.workbench.useResult",
    "tools.workbench.export", "tools.workbench.clipboardEmpty", "tools.workbench.exampleAddition", "tools.workbench.smartApplied",
    "tools.workbench.emptyResult", "tools.workbench.on", "tools.workbench.off", "tools.workbench.targetProgress",
    "tools.options.cleanLevel", "tools.options.typographyMode", "tools.options.readingSpeed", "tools.options.targetLimit",
    "tools.options.duplicateSensitivity", "tools.options.extractFormat", "tools.options.anonymizeMode", "tools.options.sortJsonKeys",
    "tools.options.paragraphCount", "tools.options.ignoreWhitespace", "tools.options.compareCaseSensitive",
    "tools.options.replaceCaseSensitive", "tools.options.replaceWholeWord", "tools.options.replaceRegex",
    "tools.clean.gentle", "tools.clean.standard", "tools.clean.deep", "tools.typography.editorial", "tools.typography.web",
    "tools.typography.codeSafe", "tools.duplicate.exact", "tools.duplicate.balanced", "tools.duplicate.fuzzy",
    "tools.list.jsonArray", "tools.list.queryParams", "tools.extract.report", "tools.extract.json", "tools.extract.csv",
    "tools.anonymize.labels", "tools.anonymize.pseudonyms", "tools.anonymize.mask", "tools.encode.hexEncode",
    "tools.encode.hexDecode", "tools.encode.unicodeEscape", "tools.encode.unicodeUnescape", "tools.encode.jsonString", "tools.encode.jsonUnstring",
    "tools.workbench.itemCopied"
  ];

  const values = {
    en: [
      "Live preview", "100% local", "Paste", "Try an example", "Smart settings", "Swap", "Reset", "Undo", "Redo", "Reuse result",
      "Export .txt", "The clipboard is empty or unavailable.", "Additional line for comparison.", "Smart settings applied.", "There is no result to export.", "On", "Off", "Target",
      "Cleaning intensity", "Typography profile", "Reading speed (words/min)", "Character target", "Duplicate sensitivity", "Output format", "Anonymization mode", "Sort keys",
      "Paragraphs", "Ignore whitespace", "Case-sensitive comparison", "Case-sensitive search", "Whole words only", "Regular expression",
      "Gentle · preserve layout", "Standard · clean and safe", "Deep · remove noise", "Editorial", "Web-ready", "Code-safe", "Exact only", "Balanced normalization", "Fuzzy similarity",
      "JSON array", "Query parameters", "Readable report", "Structured JSON", "CSV table", "Generic labels", "Stable pseudonyms", "Partial masking", "Text → HEX", "HEX → text",
      "Text → Unicode escapes", "Unicode escapes → text", "Text → JSON string", "JSON string → text", "Item copied"
    ],
    fr: [
      "Aperçu en direct", "100 % local", "Coller", "Essayer un exemple", "Réglages intelligents", "Permuter", "Réinitialiser", "Annuler", "Rétablir", "Réutiliser le résultat",
      "Exporter en .txt", "Le presse-papiers est vide ou indisponible.", "Ligne supplémentaire pour la comparaison.", "Réglages intelligents appliqués.", "Il n’y a aucun résultat à exporter.", "Activé", "Désactivé", "Objectif",
      "Intensité du nettoyage", "Profil typographique", "Vitesse de lecture (mots/min)", "Objectif de caractères", "Sensibilité aux doublons", "Format de sortie", "Mode d’anonymisation", "Trier les clés",
      "Paragraphes", "Ignorer les espaces", "Comparaison sensible à la casse", "Recherche sensible à la casse", "Mots entiers uniquement", "Expression régulière",
      "Doux · préserver la mise en page", "Standard · propre et sûr", "Profond · retirer le bruit", "Éditorial", "Optimisé pour le web", "Sûr pour le code", "Strictement identiques", "Normalisation équilibrée", "Similarité approximative",
      "Tableau JSON", "Paramètres de requête", "Rapport lisible", "JSON structuré", "Tableau CSV", "Libellés génériques", "Pseudonymes stables", "Masquage partiel", "Texte → HEX", "HEX → texte",
      "Texte → échappements Unicode", "Échappements Unicode → texte", "Texte → chaîne JSON", "Chaîne JSON → texte", "Élément copié"
    ],
    de: [
      "Live-Vorschau", "100 % lokal", "Einfügen", "Beispiel testen", "Intelligente Einstellungen", "Tauschen", "Zurücksetzen", "Rückgängig", "Wiederholen", "Ergebnis weiterverwenden",
      "Als .txt exportieren", "Die Zwischenablage ist leer oder nicht verfügbar.", "Zusätzliche Vergleichszeile.", "Intelligente Einstellungen angewendet.", "Kein Ergebnis zum Exportieren.", "Ein", "Aus", "Ziel",
      "Bereinigungsstärke", "Typografieprofil", "Lesegeschwindigkeit (Wörter/Min.)", "Zeichenziel", "Duplikat-Empfindlichkeit", "Ausgabeformat", "Anonymisierungsmodus", "Schlüssel sortieren",
      "Absätze", "Leerraum ignorieren", "Groß-/Kleinschreibung vergleichen", "Groß-/Kleinschreibung beachten", "Nur ganze Wörter", "Regulärer Ausdruck",
      "Sanft · Layout erhalten", "Standard · sauber und sicher", "Tief · Störungen entfernen", "Redaktionell", "Weboptimiert", "Codesicher", "Nur exakt", "Ausgewogene Normalisierung", "Unscharfe Ähnlichkeit",
      "JSON-Array", "Abfrageparameter", "Lesbarer Bericht", "Strukturiertes JSON", "CSV-Tabelle", "Allgemeine Bezeichner", "Stabile Pseudonyme", "Teilweise Maskierung", "Text → HEX", "HEX → Text",
      "Text → Unicode-Escapes", "Unicode-Escapes → Text", "Text → JSON-Zeichenfolge", "JSON-Zeichenfolge → Text", "Element kopiert"
    ],
    es: [
      "Vista previa en directo", "100 % local", "Pegar", "Probar un ejemplo", "Ajustes inteligentes", "Intercambiar", "Restablecer", "Deshacer", "Rehacer", "Reutilizar resultado",
      "Exportar .txt", "El portapapeles está vacío o no disponible.", "Línea adicional para comparar.", "Ajustes inteligentes aplicados.", "No hay ningún resultado que exportar.", "Activado", "Desactivado", "Objetivo",
      "Intensidad de limpieza", "Perfil tipográfico", "Velocidad de lectura (palabras/min)", "Objetivo de caracteres", "Sensibilidad de duplicados", "Formato de salida", "Modo de anonimización", "Ordenar claves",
      "Párrafos", "Ignorar espacios", "Comparación sensible a mayúsculas", "Búsqueda sensible a mayúsculas", "Solo palabras completas", "Expresión regular",
      "Suave · conservar diseño", "Estándar · limpio y seguro", "Profundo · eliminar ruido", "Editorial", "Optimizado para web", "Seguro para código", "Solo exactos", "Normalización equilibrada", "Similitud aproximada",
      "Matriz JSON", "Parámetros de consulta", "Informe legible", "JSON estructurado", "Tabla CSV", "Etiquetas genéricas", "Seudónimos estables", "Enmascarado parcial", "Texto → HEX", "HEX → texto",
      "Texto → escapes Unicode", "Escapes Unicode → texto", "Texto → cadena JSON", "Cadena JSON → texto", "Elemento copiado"
    ],
    it: [
      "Anteprima dal vivo", "100% locale", "Incolla", "Prova un esempio", "Impostazioni intelligenti", "Scambia", "Reimposta", "Annulla", "Ripristina", "Riutilizza risultato",
      "Esporta .txt", "Gli appunti sono vuoti o non disponibili.", "Riga aggiuntiva per il confronto.", "Impostazioni intelligenti applicate.", "Nessun risultato da esportare.", "Attivo", "Disattivo", "Obiettivo",
      "Intensità pulizia", "Profilo tipografico", "Velocità di lettura (parole/min)", "Obiettivo caratteri", "Sensibilità duplicati", "Formato di output", "Modalità anonimizzazione", "Ordina chiavi",
      "Paragrafi", "Ignora spazi", "Confronto sensibile alle maiuscole", "Ricerca sensibile alle maiuscole", "Solo parole intere", "Espressione regolare",
      "Delicato · conserva il layout", "Standard · pulito e sicuro", "Profondo · rimuovi rumore", "Editoriale", "Ottimizzato per il web", "Sicuro per il codice", "Solo esatti", "Normalizzazione bilanciata", "Somiglianza approssimativa",
      "Array JSON", "Parametri query", "Report leggibile", "JSON strutturato", "Tabella CSV", "Etichette generiche", "Pseudonimi stabili", "Mascheramento parziale", "Testo → HEX", "HEX → testo",
      "Testo → escape Unicode", "Escape Unicode → testo", "Testo → stringa JSON", "Stringa JSON → testo", "Elemento copiato"
    ],
    ro: [
      "Previzualizare live", "100% local", "Lipește", "Încearcă un exemplu", "Setări inteligente", "Inversează", "Resetează", "Anulează", "Refă", "Reutilizează rezultatul",
      "Exportă .txt", "Clipboardul este gol sau indisponibil.", "Linie suplimentară pentru comparație.", "Setările inteligente au fost aplicate.", "Nu există rezultat de exportat.", "Activat", "Dezactivat", "Obiectiv",
      "Intensitatea curățării", "Profil tipografic", "Viteză de citire (cuvinte/min)", "Țintă de caractere", "Sensibilitate duplicate", "Format rezultat", "Mod de anonimizare", "Sortează cheile",
      "Paragrafe", "Ignoră spațiile", "Comparare sensibilă la majuscule", "Căutare sensibilă la majuscule", "Doar cuvinte întregi", "Expresie regulată",
      "Blând · păstrează aspectul", "Standard · curat și sigur", "Profund · elimină zgomotul", "Editorial", "Optimizat pentru web", "Sigur pentru cod", "Doar exacte", "Normalizare echilibrată", "Similaritate aproximativă",
      "Matrice JSON", "Parametri de interogare", "Raport lizibil", "JSON structurat", "Tabel CSV", "Etichete generice", "Pseudonime stabile", "Mascare parțială", "Text → HEX", "HEX → text",
      "Text → escape-uri Unicode", "Escape-uri Unicode → text", "Text → șir JSON", "Șir JSON → text", "Element copiat"
    ],
    pt: [
      "Pré-visualização ao vivo", "100% local", "Colar", "Testar um exemplo", "Definições inteligentes", "Trocar", "Repor", "Anular", "Refazer", "Reutilizar resultado",
      "Exportar .txt", "A área de transferência está vazia ou indisponível.", "Linha adicional para comparação.", "Definições inteligentes aplicadas.", "Não existe resultado para exportar.", "Ativado", "Desativado", "Objetivo",
      "Intensidade da limpeza", "Perfil tipográfico", "Velocidade de leitura (palavras/min)", "Objetivo de caracteres", "Sensibilidade a duplicados", "Formato de saída", "Modo de anonimização", "Ordenar chaves",
      "Parágrafos", "Ignorar espaços", "Comparação sensível a maiúsculas", "Pesquisa sensível a maiúsculas", "Apenas palavras inteiras", "Expressão regular",
      "Suave · preservar disposição", "Padrão · limpo e seguro", "Profundo · remover ruído", "Editorial", "Otimizado para web", "Seguro para código", "Apenas exatos", "Normalização equilibrada", "Semelhança aproximada",
      "Matriz JSON", "Parâmetros de consulta", "Relatório legível", "JSON estruturado", "Tabela CSV", "Etiquetas genéricas", "Pseudónimos estáveis", "Ocultação parcial", "Texto → HEX", "HEX → texto",
      "Texto → escapes Unicode", "Escapes Unicode → texto", "Texto → cadeia JSON", "Cadeia JSON → texto", "Item copiado"
    ],
    ar: [
      "معاينة مباشرة", "محلي 100٪", "لصق", "تجربة مثال", "إعدادات ذكية", "تبديل", "إعادة ضبط", "تراجع", "إعادة", "إعادة استخدام النتيجة",
      "تصدير .txt", "الحافظة فارغة أو غير متاحة.", "سطر إضافي للمقارنة.", "تم تطبيق الإعدادات الذكية.", "لا توجد نتيجة لتصديرها.", "مفعّل", "معطّل", "الهدف",
      "شدة التنظيف", "ملف الطباعة", "سرعة القراءة (كلمة/دقيقة)", "هدف الأحرف", "حساسية التكرار", "تنسيق الإخراج", "وضع إخفاء الهوية", "ترتيب المفاتيح",
      "الفقرات", "تجاهل المسافات", "مقارنة حساسة لحالة الأحرف", "بحث حساس لحالة الأحرف", "الكلمات الكاملة فقط", "تعبير نمطي",
      "لطيف · يحافظ على التخطيط", "قياسي · نظيف وآمن", "عميق · يزيل الضوضاء", "تحريري", "محسن للويب", "آمن للكود", "متطابق فقط", "تطبيع متوازن", "تشابه تقريبي",
      "مصفوفة JSON", "معلمات الاستعلام", "تقرير مقروء", "JSON منظم", "جدول CSV", "تسميات عامة", "أسماء مستعارة ثابتة", "إخفاء جزئي", "نص ← HEX", "HEX ← نص",
      "نص ← رموز Unicode", "رموز Unicode ← نص", "نص ← سلسلة JSON", "سلسلة JSON ← نص", "تم نسخ العنصر"
    ],
    zh: [
      "实时预览", "100% 本地", "粘贴", "试用示例", "智能设置", "交换", "重置", "撤销", "重做", "复用结果",
      "导出 .txt", "剪贴板为空或不可用。", "用于比较的附加行。", "已应用智能设置。", "没有可导出的结果。", "开启", "关闭", "目标",
      "清理强度", "排版配置", "阅读速度（词/分钟）", "字符目标", "重复项灵敏度", "输出格式", "匿名化模式", "键排序",
      "段落", "忽略空白", "区分大小写比较", "区分大小写搜索", "仅完整单词", "正则表达式",
      "轻度 · 保留布局", "标准 · 干净安全", "深度 · 移除噪声", "编辑排版", "网页优化", "代码安全", "仅完全相同", "平衡标准化", "模糊相似度",
      "JSON 数组", "查询参数", "可读报告", "结构化 JSON", "CSV 表格", "通用标签", "稳定化名", "部分遮罩", "文本 → HEX", "HEX → 文本",
      "文本 → Unicode 转义", "Unicode 转义 → 文本", "文本 → JSON 字符串", "JSON 字符串 → 文本", "项目已复制"
    ],
    ja: [
      "ライブプレビュー", "100% ローカル", "貼り付け", "例を試す", "スマート設定", "入れ替え", "リセット", "元に戻す", "やり直す", "結果を再利用",
      ".txt を書き出す", "クリップボードが空か利用できません。", "比較用の追加行です。", "スマート設定を適用しました。", "書き出す結果がありません。", "オン", "オフ", "目標",
      "クリーニング強度", "組版プロファイル", "読書速度（語/分）", "文字数目標", "重複感度", "出力形式", "匿名化モード", "キーを並べ替え",
      "段落", "空白を無視", "大文字小文字を区別して比較", "大文字小文字を区別して検索", "単語全体のみ", "正規表現",
      "軽度・レイアウト維持", "標準・安全に整形", "強力・ノイズ除去", "編集向け", "Web 向け", "コード安全", "完全一致のみ", "バランス正規化", "あいまい類似",
      "JSON 配列", "クエリパラメータ", "読みやすいレポート", "構造化 JSON", "CSV 表", "汎用ラベル", "安定した仮名", "部分マスク", "テキスト → HEX", "HEX → テキスト",
      "テキスト → Unicode エスケープ", "Unicode エスケープ → テキスト", "テキスト → JSON 文字列", "JSON 文字列 → テキスト", "項目をコピーしました"
    ],
    ru: [
      "Предпросмотр", "100% локально", "Вставить", "Попробовать пример", "Умные настройки", "Поменять", "Сбросить", "Отменить", "Повторить", "Использовать результат",
      "Экспорт .txt", "Буфер обмена пуст или недоступен.", "Дополнительная строка для сравнения.", "Умные настройки применены.", "Нет результата для экспорта.", "Вкл.", "Выкл.", "Цель",
      "Интенсивность очистки", "Профиль типографики", "Скорость чтения (слов/мин)", "Цель по символам", "Чувствительность дубликатов", "Формат вывода", "Режим анонимизации", "Сортировать ключи",
      "Абзацы", "Игнорировать пробелы", "Сравнение с учётом регистра", "Поиск с учётом регистра", "Только целые слова", "Регулярное выражение",
      "Мягко · сохранить макет", "Стандартно · чисто и безопасно", "Глубоко · убрать шум", "Редакционный", "Для веба", "Безопасно для кода", "Только точные", "Сбалансированная нормализация", "Нечёткое сходство",
      "Массив JSON", "Параметры запроса", "Читаемый отчёт", "Структурированный JSON", "Таблица CSV", "Общие метки", "Стабильные псевдонимы", "Частичная маска", "Текст → HEX", "HEX → текст",
      "Текст → Unicode-экранирование", "Unicode-экранирование → текст", "Текст → строка JSON", "Строка JSON → текст", "Элемент скопирован"
    ],
    nl: [
      "Live voorbeeld", "100% lokaal", "Plakken", "Voorbeeld proberen", "Slimme instellingen", "Wisselen", "Resetten", "Ongedaan maken", "Opnieuw", "Resultaat hergebruiken",
      ".txt exporteren", "Het klembord is leeg of niet beschikbaar.", "Extra regel voor vergelijking.", "Slimme instellingen toegepast.", "Er is geen resultaat om te exporteren.", "Aan", "Uit", "Doel",
      "Reinigingsniveau", "Typografieprofiel", "Leessnelheid (woorden/min)", "Tekendoel", "Dubbelgevoeligheid", "Uitvoerformaat", "Anonimiseringsmodus", "Sleutels sorteren",
      "Alinea’s", "Witruimte negeren", "Hoofdlettergevoelig vergelijken", "Hoofdlettergevoelig zoeken", "Alleen hele woorden", "Reguliere expressie",
      "Zacht · lay-out behouden", "Standaard · schoon en veilig", "Grondig · ruis verwijderen", "Redactioneel", "Webklaar", "Codeveilig", "Alleen exact", "Gebalanceerde normalisatie", "Vage gelijkenis",
      "JSON-array", "Queryparameters", "Leesbaar rapport", "Gestructureerde JSON", "CSV-tabel", "Algemene labels", "Stabiele pseudoniemen", "Gedeeltelijke maskering", "Tekst → HEX", "HEX → tekst",
      "Tekst → Unicode-escapes", "Unicode-escapes → tekst", "Tekst → JSON-tekenreeks", "JSON-tekenreeks → tekst", "Item gekopieerd"
    ],
    pl: [
      "Podgląd na żywo", "100% lokalnie", "Wklej", "Wypróbuj przykład", "Inteligentne ustawienia", "Zamień", "Resetuj", "Cofnij", "Ponów", "Użyj wyniku ponownie",
      "Eksportuj .txt", "Schowek jest pusty lub niedostępny.", "Dodatkowy wiersz do porównania.", "Zastosowano inteligentne ustawienia.", "Brak wyniku do eksportu.", "Wł.", "Wył.", "Cel",
      "Intensywność czyszczenia", "Profil typografii", "Szybkość czytania (słów/min)", "Docelowa liczba znaków", "Czułość duplikatów", "Format wyjściowy", "Tryb anonimizacji", "Sortuj klucze",
      "Akapity", "Ignoruj odstępy", "Porównanie z uwzględnieniem wielkości liter", "Wyszukiwanie z uwzględnieniem wielkości liter", "Tylko całe słowa", "Wyrażenie regularne",
      "Łagodne · zachowaj układ", "Standardowe · czyste i bezpieczne", "Głębokie · usuń szum", "Redakcyjny", "Do internetu", "Bezpieczny dla kodu", "Tylko dokładne", "Zrównoważona normalizacja", "Podobieństwo rozmyte",
      "Tablica JSON", "Parametry zapytania", "Czytelny raport", "Strukturalny JSON", "Tabela CSV", "Etykiety ogólne", "Stałe pseudonimy", "Maskowanie częściowe", "Tekst → HEX", "HEX → tekst",
      "Tekst → sekwencje Unicode", "Sekwencje Unicode → tekst", "Tekst → ciąg JSON", "Ciąg JSON → tekst", "Element skopiowany"
    ],
    tr: [
      "Canlı önizleme", "%100 yerel", "Yapıştır", "Örnek dene", "Akıllı ayarlar", "Değiştir", "Sıfırla", "Geri al", "Yinele", "Sonucu yeniden kullan",
      ".txt dışa aktar", "Pano boş veya kullanılamıyor.", "Karşılaştırma için ek satır.", "Akıllı ayarlar uygulandı.", "Dışa aktarılacak sonuç yok.", "Açık", "Kapalı", "Hedef",
      "Temizleme yoğunluğu", "Tipografi profili", "Okuma hızı (kelime/dk)", "Karakter hedefi", "Yinelenen hassasiyeti", "Çıktı biçimi", "Anonimleştirme modu", "Anahtarları sırala",
      "Paragraflar", "Boşlukları yok say", "Büyük/küçük harfe duyarlı karşılaştır", "Büyük/küçük harfe duyarlı ara", "Yalnızca tam kelimeler", "Düzenli ifade",
      "Hafif · düzeni koru", "Standart · temiz ve güvenli", "Derin · gürültüyü kaldır", "Editoryal", "Web için hazır", "Kod için güvenli", "Yalnızca tam", "Dengeli normalleştirme", "Bulanık benzerlik",
      "JSON dizisi", "Sorgu parametreleri", "Okunabilir rapor", "Yapılandırılmış JSON", "CSV tablosu", "Genel etiketler", "Kararlı takma adlar", "Kısmi maskeleme", "Metin → HEX", "HEX → metin",
      "Metin → Unicode kaçışları", "Unicode kaçışları → metin", "Metin → JSON dizesi", "JSON dizesi → metin", "Öğe kopyalandı"
    ],
    ko: [
      "실시간 미리보기", "100% 로컬", "붙여넣기", "예제 사용", "스마트 설정", "바꾸기", "초기화", "실행 취소", "다시 실행", "결과 재사용",
      ".txt 내보내기", "클립보드가 비었거나 사용할 수 없습니다.", "비교를 위한 추가 줄입니다.", "스마트 설정을 적용했습니다.", "내보낼 결과가 없습니다.", "켜기", "끄기", "목표",
      "정리 강도", "타이포그래피 프로필", "읽기 속도(단어/분)", "문자 목표", "중복 민감도", "출력 형식", "익명화 모드", "키 정렬",
      "문단", "공백 무시", "대소문자 구분 비교", "대소문자 구분 검색", "전체 단어만", "정규식",
      "약하게 · 레이아웃 유지", "표준 · 안전하게 정리", "강하게 · 노이즈 제거", "편집용", "웹 최적화", "코드 안전", "완전 일치만", "균형 정규화", "유사 일치",
      "JSON 배열", "쿼리 매개변수", "읽기 쉬운 보고서", "구조화된 JSON", "CSV 표", "일반 레이블", "일관된 가명", "부분 마스킹", "텍스트 → HEX", "HEX → 텍스트",
      "텍스트 → Unicode 이스케이프", "Unicode 이스케이프 → 텍스트", "텍스트 → JSON 문자열", "JSON 문자열 → 텍스트", "항목이 복사되었습니다"
    ],
    hi: [
      "लाइव पूर्वावलोकन", "100% स्थानीय", "चिपकाएँ", "उदाहरण आज़माएँ", "स्मार्ट सेटिंग", "अदला-बदली", "रीसेट", "पूर्ववत", "फिर करें", "परिणाम फिर उपयोग करें",
      ".txt निर्यात", "क्लिपबोर्ड खाली या अनुपलब्ध है।", "तुलना के लिए अतिरिक्त पंक्ति।", "स्मार्ट सेटिंग लागू हुई।", "निर्यात करने के लिए कोई परिणाम नहीं है।", "चालू", "बंद", "लक्ष्य",
      "सफाई की तीव्रता", "टाइपोग्राफी प्रोफ़ाइल", "पढ़ने की गति (शब्द/मिनट)", "अक्षर लक्ष्य", "डुप्लिकेट संवेदनशीलता", "आउटपुट प्रारूप", "गुमनामी मोड", "कुंजियाँ क्रमबद्ध करें",
      "अनुच्छेद", "रिक्त स्थान अनदेखा करें", "केस-संवेदी तुलना", "केस-संवेदी खोज", "केवल पूरे शब्द", "रेगुलर एक्सप्रेशन",
      "हल्का · लेआउट सुरक्षित", "मानक · साफ और सुरक्षित", "गहरा · शोर हटाएँ", "संपादकीय", "वेब-अनुकूल", "कोड-सुरक्षित", "केवल सटीक", "संतुलित सामान्यीकरण", "अनुमानित समानता",
      "JSON सरणी", "क्वेरी पैरामीटर", "पठनीय रिपोर्ट", "संरचित JSON", "CSV तालिका", "सामान्य लेबल", "स्थिर छद्मनाम", "आंशिक मास्क", "टेक्स्ट → HEX", "HEX → टेक्स्ट",
      "टेक्स्ट → Unicode एस्केप", "Unicode एस्केप → टेक्स्ट", "टेक्स्ट → JSON स्ट्रिंग", "JSON स्ट्रिंग → टेक्स्ट", "आइटम कॉपी किया गया"
    ]
  };

  const suiteValues = {
    en: { search: "Search tools", empty: "No tool matches this search.", settings: "Settings", ready: "Result ready", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL slug", swap: "Swap uppercase/lowercase" },
    fr: { search: "Rechercher un outil", empty: "Aucun outil ne correspond à cette recherche.", settings: "Réglages", ready: "Résultat prêt", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "Slug d’URL", swap: "Inverser majuscules/minuscules" },
    de: { search: "Tools durchsuchen", empty: "Kein Tool entspricht dieser Suche.", settings: "Einstellungen", ready: "Ergebnis bereit", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL-Slug", swap: "Groß-/Kleinschreibung umkehren" },
    es: { search: "Buscar herramientas", empty: "Ninguna herramienta coincide con esta búsqueda.", settings: "Ajustes", ready: "Resultado listo", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "Slug de URL", swap: "Invertir mayúsculas/minúsculas" },
    it: { search: "Cerca strumenti", empty: "Nessuno strumento corrisponde alla ricerca.", settings: "Impostazioni", ready: "Risultato pronto", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "Slug URL", swap: "Inverti maiuscole/minuscole" },
    ro: { search: "Caută instrumente", empty: "Niciun instrument nu corespunde căutării.", settings: "Setări", ready: "Rezultat pregătit", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "Slug URL", swap: "Inversează majuscule/minuscule" },
    pt: { search: "Pesquisar ferramentas", empty: "Nenhuma ferramenta corresponde à pesquisa.", settings: "Definições", ready: "Resultado pronto", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "Slug de URL", swap: "Inverter maiúsculas/minúsculas" },
    ar: { search: "البحث في الأدوات", empty: "لا توجد أداة مطابقة لهذا البحث.", settings: "الإعدادات", ready: "النتيجة جاهزة", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "رابط مختصر", swap: "عكس حالة الأحرف" },
    zh: { search: "搜索工具", empty: "没有与此搜索匹配的工具。", settings: "设置", ready: "结果已就绪", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL 别名", swap: "切换大小写" },
    ja: { search: "ツールを検索", empty: "検索に一致するツールはありません。", settings: "設定", ready: "結果の準備完了", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL スラッグ", swap: "大文字/小文字を反転" },
    ru: { search: "Поиск инструментов", empty: "По этому запросу инструменты не найдены.", settings: "Настройки", ready: "Результат готов", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL-слаг", swap: "Поменять регистр" },
    nl: { search: "Tools zoeken", empty: "Geen tool komt overeen met deze zoekopdracht.", settings: "Instellingen", ready: "Resultaat gereed", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL-slug", swap: "Hoofd-/kleine letters omwisselen" },
    pl: { search: "Szukaj narzędzi", empty: "Żadne narzędzie nie pasuje do wyszukiwania.", settings: "Ustawienia", ready: "Wynik gotowy", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "Slug URL", swap: "Odwróć wielkość liter" },
    tr: { search: "Araçlarda ara", empty: "Bu aramayla eşleşen araç yok.", settings: "Ayarlar", ready: "Sonuç hazır", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL kısa adı", swap: "Büyük/küçük harfi ters çevir" },
    ko: { search: "도구 검색", empty: "검색과 일치하는 도구가 없습니다.", settings: "설정", ready: "결과 준비됨", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL 슬러그", swap: "대/소문자 전환" },
    hi: { search: "टूल खोजें", empty: "इस खोज से मेल खाने वाला कोई टूल नहीं है।", settings: "सेटिंग", ready: "परिणाम तैयार", constant: "CONSTANT_CASE", dot: "dot.case", path: "path/case", slug: "URL स्लग", swap: "बड़े/छोटे अक्षर उलटें" }
  };

  const suiteKeys = {
    search: "tools.catalog.search",
    empty: "tools.catalog.noResults",
    settings: "tools.workbench.settings",
    ready: "tools.workbench.resultReady",
    constant: "tools.case.constant",
    dot: "tools.case.dot",
    path: "tools.case.path",
    slug: "tools.case.slug",
    swap: "tools.case.swap"
  };

  const suiteDescriptionValues = {
    en: ["Converts text into thirteen useful formats, including CONSTANT_CASE, dot.case, paths and URL-safe slugs, or swaps letter case.", "Locally masks emails, phones, URLs, IP addresses, passwords, API keys and bearer tokens without sending anything online."],
    fr: ["Convertit le texte dans treize formats utiles, dont CONSTANT_CASE, dot.case, les chemins et les slugs d’URL, ou inverse la casse.", "Masque localement les e-mails, téléphones, URL, adresses IP, mots de passe, clés API et jetons bearer, sans aucun envoi en ligne."],
    de: ["Konvertiert Text in dreizehn nützliche Formate, darunter CONSTANT_CASE, dot.case, Pfade und URL-Slugs, oder kehrt die Groß-/Kleinschreibung um.", "Maskiert E-Mails, Telefonnummern, URLs, IP-Adressen, Passwörter, API-Schlüssel und Bearer-Token vollständig lokal."],
    es: ["Convierte texto a trece formatos útiles, incluidos CONSTANT_CASE, dot.case, rutas y slugs de URL, o invierte mayúsculas y minúsculas.", "Oculta localmente correos, teléfonos, URL, IP, contraseñas, claves API y tokens bearer sin enviar datos a Internet."],
    it: ["Converte il testo in tredici formati utili, inclusi CONSTANT_CASE, dot.case, percorsi e slug URL, oppure inverte maiuscole e minuscole.", "Maschera localmente e-mail, telefoni, URL, IP, password, chiavi API e token bearer senza inviare dati online."],
    ro: ["Convertește textul în treisprezece formate utile, inclusiv CONSTANT_CASE, dot.case, căi și sluguri URL, sau inversează literele mari și mici.", "Maschează local e-mailuri, telefoane, URL-uri, IP-uri, parole, chei API și tokenuri bearer, fără trimitere online."],
    pt: ["Converte texto em treze formatos úteis, incluindo CONSTANT_CASE, dot.case, caminhos e slugs de URL, ou inverte maiúsculas e minúsculas.", "Mascara localmente e-mails, telefones, URLs, IPs, palavras-passe, chaves API e tokens bearer sem enviar dados online."],
    ar: ["يحوّل النص إلى ثلاثة عشر تنسيقًا مفيدًا، منها CONSTANT_CASE وdot.case والمسارات وروابط URL المختصرة، أو يعكس حالة الأحرف.", "يخفي محليًا البريد الإلكتروني والهواتف والروابط وعناوين IP وكلمات المرور ومفاتيح API ورموز bearer دون إرسال أي بيانات."],
    zh: ["将文本转换为十三种实用格式，包括 CONSTANT_CASE、dot.case、路径和 URL 别名，也可反转字母大小写。", "完全在本地遮蔽电子邮件、电话、URL、IP、密码、API 密钥和 bearer 令牌，不会上传数据。"],
    ja: ["テキストを CONSTANT_CASE、dot.case、パス、URL スラッグなど13種類の実用形式に変換し、大文字と小文字の反転もできます。", "メール、電話、URL、IP、パスワード、APIキー、Bearerトークンをオンライン送信せずローカルでマスクします。"],
    ru: ["Преобразует текст в тринадцать полезных форматов, включая CONSTANT_CASE, dot.case, пути и URL-слаги, или меняет регистр букв.", "Локально скрывает e-mail, телефоны, URL, IP, пароли, API-ключи и bearer-токены без отправки данных в сеть."],
    nl: ["Zet tekst om naar dertien bruikbare formaten, waaronder CONSTANT_CASE, dot.case, paden en URL-slugs, of wisselt hoofd- en kleine letters.", "Maskeert lokaal e-mails, telefoons, URL's, IP-adressen, wachtwoorden, API-sleutels en bearer-tokens zonder gegevens te versturen."],
    pl: ["Konwertuje tekst do trzynastu przydatnych formatów, w tym CONSTANT_CASE, dot.case, ścieżek i slugów URL, lub odwraca wielkość liter.", "Lokalnie maskuje e-maile, telefony, adresy URL i IP, hasła, klucze API oraz tokeny bearer bez wysyłania danych."],
    tr: ["Metni CONSTANT_CASE, dot.case, yollar ve URL kısa adları dahil on üç kullanışlı biçime dönüştürür veya harf boyutunu ters çevirir.", "E-posta, telefon, URL, IP, parola, API anahtarı ve bearer tokenlarını hiçbir veriyi çevrimiçi göndermeden yerel olarak maskeler."],
    ko: ["텍스트를 CONSTANT_CASE, dot.case, 경로, URL 슬러그 등 13가지 실용 형식으로 변환하거나 대소문자를 반전합니다.", "이메일, 전화번호, URL, IP, 비밀번호, API 키, bearer 토큰을 온라인 전송 없이 로컬에서 마스킹합니다."],
    hi: ["टेक्स्ट को CONSTANT_CASE, dot.case, पाथ और URL स्लग सहित तेरह उपयोगी फ़ॉर्मेट में बदलता है या अक्षरों का केस उलटता है।", "ईमेल, फ़ोन, URL, IP, पासवर्ड, API कुंजी और bearer टोकन को बिना ऑनलाइन भेजे स्थानीय रूप से छिपाता है।"]
  };

  const applyToolUpgradeLocales = () => {
    global.MCP_LOCALES = global.MCP_LOCALES || {};
    Object.entries(values).forEach(([language, translations]) => {
      if (translations.length !== keys.length) throw new Error(`Invalid tool upgrade locale: ${language}`);
      const dictionary = global.MCP_LOCALES[language] || (global.MCP_LOCALES[language] = {});
      keys.forEach((key, index) => { dictionary[key] = translations[index]; });
      Object.entries(suiteValues[language] || suiteValues.en).forEach(([name, value]) => {
        dictionary[suiteKeys[name]] = value;
      });
      const descriptions = suiteDescriptionValues[language] || suiteDescriptionValues.en;
      dictionary["tools.caseConverter.description"] = descriptions[0];
      dictionary["tools.localAnonymizer.description"] = descriptions[1];
    });
  };
  global.MCP = Object.assign(global.MCP || {}, { applyToolUpgradeLocales });
  applyToolUpgradeLocales();
})(globalThis);
