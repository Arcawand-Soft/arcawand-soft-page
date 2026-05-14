(function initTools(global) {
  const TOOL_IDS = [
    "imageText",
    "snippetLibrary",
    "promptTemplateManager",
    "emojiPicker",
    "informationExtractor",
    "duplicateDetector",
    "longTextSplitter",
    "textCleaner",
    "typographyNormalizer",
    "caseConverter",
    "advancedCounter",
    "universalEncoder",
    "colorPicker",
    "listTransformer",
    "localAnonymizer",
    "variableInjector",
    "loremGenerator",
    "jsonFormatter",
    "markdownToolkit",
    "textComparator"
  ];

  const PRIORITY_TOOL_IDS = [
    "imageText",
    "snippetLibrary",
    "promptTemplateManager",
    "emojiPicker",
    "informationExtractor",
    "duplicateDetector",
    "longTextSplitter",
    "caseConverter",
    "advancedCounter",
    "variableInjector"
  ];

  const TOOL_ICON_FILES = {
    textCleaner: "nettoyeur.png",
    typographyNormalizer: "normalisateur.png",
    caseConverter: "casse.png",
    advancedCounter: "compteurs.png",
    longTextSplitter: "assets/icons/special-characters.png",
    duplicateDetector: "doublons.png",
    promptTemplateManager: "archi-prompt.png",
    variableInjector: "assets/icons/replace-word.png",
    snippetLibrary: "prompt-images.png",
    listTransformer: "listes.png",
    informationExtractor: "extracteur.png",
    localAnonymizer: "anonymiseur.png",
    emojiPicker: "emojis.png",
    colorPicker: "assets/icons/color.png",
    universalEncoder: "encodeur-decodeur.png",
    jsonFormatter: "json.png",
    loremGenerator: "lorem-ipsum.png",
    markdownToolkit: "markdown.png",
    textComparator: "comparateur.png",
    imageText: "assets/icons/screen-to-text.png"
  };

  function normalizeToolOrder(order = []) {
    const requested = Array.isArray(order) ? order : [];
    const known = new Set(TOOL_IDS);
    const migrated = requested.map((id) => id === "urlAnalyzer" ? "colorPicker" : id === "regexTester" ? "imageText" : id);
    const ordered = PRIORITY_TOOL_IDS.filter((id) => known.has(id));
    migrated.forEach((id) => {
      if (known.has(id) && !ordered.includes(id)) ordered.push(id);
    });
    TOOL_IDS.forEach((id) => {
      if (!ordered.includes(id)) ordered.push(id);
    });
    moveToolAfter(ordered, "colorPicker", "universalEncoder");
    return ordered;
  }

  function moveToolAfter(order, toolId, anchorId) {
    const currentIndex = order.indexOf(toolId);
    const anchorIndex = order.indexOf(anchorId);
    if (currentIndex < 0 || anchorIndex < 0) return order;
    const [tool] = order.splice(currentIndex, 1);
    const nextAnchorIndex = order.indexOf(anchorId);
    order.splice(nextAnchorIndex + 1, 0, tool);
    return order;
  }

  function getTools(t = (key) => key, order = []) {
    return normalizeToolOrder(order).map((id) => ({
      id,
      title: titleCaseToolTitle(t(`tools.${id}.title`)),
      description: t(`tools.${id}.description`),
      icon: toolIconPath(id),
      layout: toolLayout(id)
    }));
  }

  function titleCaseToolTitle(value) {
    return String(value || "").replace(/(^|[\s/|–—-])([^\s/|–—-])/g, (match, separator, char) => {
      return `${separator}${String(char).toLocaleUpperCase()}`;
    });
  }

  function toolLayout(id) {
    if (["advancedCounter", "duplicateDetector", "informationExtractor", "colorPicker", "imageText", "jsonFormatter", "textComparator"].includes(id)) return "analytics";
    if (id === "longTextSplitter") return "emoji";
    if (["promptTemplateManager"].includes(id)) return "template";
    if (["universalEncoder", "markdownToolkit"].includes(id)) return "developer";
    if (id === "emojiPicker") return "emoji";
    if (["loremGenerator"].includes(id)) return "generator";
    return "editor";
  }

  function toolIconPath(id) {
    const file = TOOL_ICON_FILES[id];
    if (!file) return "";
    return file.includes("/") ? file : `assets/icons/tools-icons/${file}`;
  }

  const EMOJI_ROWS = `
😀|grinning face|visage souriant|grinsendes gesicht|cara sonriente|viso sorridente|smile happy joy face
😃|big smile|grand sourire|grosses laecheln|gran sonrisa|grande sorriso|smile happy joy face
😄|laughing face|visage qui rit|lachendes gesicht|cara riendo|viso che ride|laugh happy joy
😁|beaming face|sourire radieux|strahlendes gesicht|sonrisa radiante|sorriso raggiante|smile grin
😆|squinting laugh|rire yeux plisses|lachen mit zugekniffenen augen|risa con ojos cerrados|risata occhi stretti|laugh lol
😅|sweat smile|sourire gene|schweiss laecheln|sonrisa nerviosa|sorriso sudato|relief nervous
😂|tears of joy|larmes de joie|freudentraenen|lagrimas de alegria|lacrime di gioia|laugh lol funny
🤣|rolling laughing|mort de rire|vor lachen rollen|morirse de risa|ridere a crepapelle|rofl lol
😊|smiling eyes|yeux souriants|laechelnde augen|ojos sonrientes|occhi sorridenti|kind happy
😇|halo face|ange|heiligenschein|angel|angelo|innocent halo
🙂|slight smile|petit sourire|leichtes laecheln|leve sonrisa|sorriso leggero|smile
🙃|upside down face|visage renverse|umgedrehtes gesicht|cara al reves|viso capovolto|irony silly
😉|wink|clin d oeil|zwinkern|guino|occhiolino|wink joke
😌|relieved face|soulage|erleichtert|aliviado|sollevato|calm relief
😍|heart eyes|yeux coeur|herzaugen|ojos de corazon|occhi a cuore|love heart
🥰|smiling hearts|coeurs autour|herzen laecheln|corazones|cuori|love affection
😘|kiss face|bisou|kuss|beso|bacio|kiss love
😗|kissing face|visage baiser|kussgesicht|cara beso|viso bacio|kiss
😙|kissing smiling eyes|bisou yeux souriants|kuss laechelnde augen|beso ojos sonrientes|bacio occhi sorridenti|kiss
😚|kissing closed eyes|bisou yeux fermes|kuss geschlossene augen|beso ojos cerrados|bacio occhi chiusi|kiss
😋|yummy face|miam|lecker|rico|buono|food tasty
😛|tongue face|langue|zunge|lengua|lingua|funny tongue
😜|wink tongue|clin d oeil langue|zwinkern zunge|guino lengua|occhiolino lingua|funny joke
🤪|zany face|visage fou|verruecktes gesicht|cara loca|faccia pazza|crazy silly
😝|squinting tongue|langue yeux plisses|zunge augen zu|lengua ojos cerrados|lingua occhi stretti|funny
🤑|money mouth|bouche argent|geldmund|boca dinero|bocca soldi|money rich
🤗|hugging face|calin|umarmung|abrazo|abbraccio|hug thanks
🤭|hand over mouth|main sur bouche|hand vor mund|mano en boca|mano sulla bocca|oops secret
🤫|shushing face|chut|psst|silencio|silenzio|quiet secret
🤔|thinking face|reflexion|nachdenken|pensando|pensiero|think question
🤐|zipper mouth|bouche fermee|reissverschlussmund|boca cerrada|bocca chiusa|secret silent
🤨|raised eyebrow|sourcil leve|augenbraue hoch|ceja levantada|sopracciglio alzato|doubt skeptical
😐|neutral face|neutre|neutral|neutral|neutro|neutral
😑|expressionless|sans expression|ausdruckslos|sin expresion|senza espressione|blank
😶|no mouth|sans bouche|ohne mund|sin boca|senza bocca|silent
😏|smirk|sourire en coin|grinsen|sonrisa picara|sorrisetto|smirk
😒|unamused|pas amuse|unbeeindruckt|no divertido|non divertito|annoyed
🙄|rolling eyes|yeux au ciel|augen rollen|ojos en blanco|occhi al cielo|eyeroll
😬|grimacing|grimace|grimasse|mueca|smorfia|awkward
🤥|lying face|menteur|luegner|mentiroso|bugiardo|lie pinocchio
😔|pensive|triste pensif|nachdenklich traurig|pensativo|pensieroso|sad
😪|sleepy|somnolent|schlaefrig|somnoliento|assonnato|sleep tired
🤤|drooling|bave|sabbern|baba|sbavare|drool desire
😴|sleeping|dormir|schlafen|dormido|dormire|sleep
😷|medical mask|masque medical|medizinische maske|mascarilla|mascherina|sick health
🤒|thermometer face|thermometre|thermometer|termometro|termometro|sick fever
🤕|bandaged head|tete bandee|verband|vendaje|bendaggio|hurt injury
🤢|nauseated|nausee|uebel|nausea|nausea|sick vomit
🤮|vomiting|vomir|erbrechen|vomitar|vomitare|sick
🥵|hot face|chaud|heiss|calor|caldo|heat
🥶|cold face|froid|kalt|frio|freddo|cold ice
🥳|party face|fete|party|fiesta|festa|party celebrate
😎|sunglasses|lunettes soleil|sonnenbrille|gafas de sol|occhiali da sole|cool
🤓|nerd face|intello|nerd|nerd|nerd|geek glasses
😕|confused|confus|verwirrt|confundido|confuso|question
🙁|slightly frowning|un peu triste|leicht traurig|algo triste|un po triste|sad
☹️|frowning face|triste|traurig|triste|triste|sad
😮|surprised|surpris|ueberrascht|sorprendido|sorpreso|wow
😯|hushed|stupefait|erstaunt|asombrado|stupito|surprise
😲|astonished|etonne|verbluefft|asombrado|sbalordito|shock
😳|flushed|rougit|errötet|sonrojado|arrossito|blush shame
🥺|pleading|suppliant|flehend|suplicante|supplichevole|please cute
😦|frown open mouth|bouche ouverte triste|traurig offener mund|boca abierta triste|bocca aperta triste|sad worry
😧|anguished|angoisse|angstvoll|angustiado|angosciato|worry
😨|fearful|peur|aengstlich|miedo|paura|fear
😰|anxious sweat|anxieux|aengstlich schwitzend|ansioso|ansioso|stress
😥|sad relieved|triste soulage|traurig erleichtert|triste aliviado|triste sollevato|sad relief
😢|crying|pleure|weinen|llorando|pianto|sad tears
😭|loud crying|gros pleurs|laut weinen|llanto fuerte|pianto forte|sad tears
😱|scream|cri|schrei|grito|urlo|shock fear
😖|confounded|contrarie|verwirrt|contrariado|contrariato|frustrated
😣|persevering|perseverant|durchhalten|perseverante|perseverante|effort
😞|disappointed|decu|enttaeuscht|decepcionado|deluso|sad
😓|downcast sweat|abattu sueur|niedergeschlagen|abatido|abbattuto|stress
😩|weary|epuise|erschoepft|agotado|esausto|tired
😫|tired face|fatigue|muede|cansado|stanco|tired
🥱|yawning|baille|gaehnen|bostezo|sbadiglio|tired bored
😤|triumph|souffle nez|schnauben|resoplar|sbuffo|angry proud
😡|angry|colere|wuetend|enfadado|arrabbiato|mad
😠|angry face|fache|wuetend|enojado|arrabbiato|mad
🤬|symbols mouth|gros mot|fluchen|insultos|parolacce|angry curse
😈|devil smile|diable sourire|teufel laecheln|diablo sonrisa|diavolo sorriso|devil
👿|angry devil|diable fache|boeser teufel|diablo enojado|diavolo arrabbiato|devil angry
💀|skull|crane|schaedel|calavera|teschio|dead skull
☠️|skull bones|tete de mort|totenkopf|calavera huesos|teschio ossa|danger pirate
💩|poop|caca|kacke|caca|cacca|poop funny
🤡|clown|clown|clown|payaso|pagliaccio|clown
👻|ghost|fantome|geist|fantasma|fantasma|ghost
👽|alien|alien|alien|alienigena|alieno|alien
🤖|robot|robot|roboter|robot|robot|bot ai
🎃|pumpkin|citrouille|kuerbis|calabaza|zucca|halloween
😺|cat smile|chat sourire|katze laecheln|gato sonrisa|gatto sorriso|cat
😸|cat grin|chat rit|katze grinsen|gato rie|gatto ride|cat happy
😹|cat tears joy|chat larmes joie|katze freudentraenen|gato alegria|gatto gioia|cat laugh
😻|cat heart eyes|chat yeux coeur|katze herzaugen|gato corazon|gatto cuore|cat love
😼|cat smirk|chat sourire coin|katze grinsen|gato picaro|gatto furbo|cat
😽|cat kiss|chat bisou|katze kuss|gato beso|gatto bacio|cat kiss
🙀|cat scream|chat cri|katze schrei|gato grito|gatto urlo|cat shock
😿|cat crying|chat pleure|katze weint|gato llora|gatto piange|cat sad
😾|cat angry|chat fache|katze wuetend|gato enfadado|gatto arrabbiato|cat angry
👋|waving hand|main qui salue|winkende hand|mano saludando|mano che saluta|hello bye
🤚|raised back hand|dos main leve|handruecken|dorso mano|dorso mano|hand
🖐️|hand fingers splayed|main ouverte|offene hand|mano abierta|mano aperta|hand
✋|raised hand|main levee|hand hoch|mano levantada|mano alzata|stop hand
🖖|vulcan salute|salut vulcain|vulkan gruss|saludo vulcano|saluto vulcaniano|spock
👌|ok hand|signe ok|ok hand|mano ok|mano ok|ok perfect
🤌|pinched fingers|doigts pinces|finger zusammen|dedos juntos|dita unite|italian gesture
🤏|pinching hand|pincer|kneifen|pellizcar|pizzicare|small
✌️|victory hand|victoire|sieg|victoria|vittoria|peace
🤞|crossed fingers|doigts croises|finger gekreuzt|dedos cruzados|dita incrociate|luck
🤟|love you gesture|je t aime|ich liebe dich geste|te quiero|ti amo|love hand
🤘|rock hand|cornes rock|rock hand|rock|rock|rock metal
🤙|call me hand|appelle moi|ruf mich an|llamame|chiamami|phone
👈|point left|pointe gauche|nach links zeigen|apuntar izquierda|indica sinistra|left
👉|point right|pointe droite|nach rechts zeigen|apuntar derecha|indica destra|right
👆|point up|pointe haut|nach oben zeigen|apuntar arriba|indica su|up
👇|point down|pointe bas|nach unten zeigen|apuntar abajo|indica giu|down
☝️|index up|index leve|zeigefinger hoch|indice arriba|indice su|point
👍|thumbs up|pouce haut|daumen hoch|pulgar arriba|pollice su|like yes
👎|thumbs down|pouce bas|daumen runter|pulgar abajo|pollice giu|dislike no
✊|raised fist|poing leve|faust hoch|puno alzado|pugno alzato|fist
👊|fist bump|poing|faust|puno|pugno|fist punch
👏|clapping|applaudissements|klatschen|aplausos|applausi|clap bravo
🙌|raised hands|mains levees|haende hoch|manos arriba|mani alzate|celebrate
👐|open hands|mains ouvertes|offene haende|manos abiertas|mani aperte|open
🤲|palms up|paumes levees|handflaechen oben|palmas arriba|palmi su|prayer receive
🙏|folded hands|priere merci|gefaltete haende|rezar gracias|preghiera grazie|thanks please prayer
✍️|writing hand|main qui ecrit|schreibhand|mano escribiendo|mano che scrive|write
💅|nail polish|vernis ongles|nagellack|esmalte unas|smalto unghie|beauty
🤳|selfie|selfie|selfie|selfie|selfie|camera
💪|flexed biceps|muscle|muskel|musculo|muscolo|strong
🦾|mechanical arm|bras mecanique|mechanischer arm|brazo mecanico|braccio meccanico|robot prosthetic
🦿|mechanical leg|jambe mecanique|mechanisches bein|pierna mecanica|gamba meccanica|robot prosthetic
🦵|leg|jambe|bein|pierna|gamba|body
🦶|foot|pied|fuss|pie|piede|body
👂|ear|oreille|ohr|oreja|orecchio|listen
🦻|ear hearing aid|oreille appareil auditif|ohr hoergeraet|oreja audifono|orecchio apparecchio|hearing
👃|nose|nez|nase|nariz|naso|smell
🧠|brain|cerveau|gehirn|cerebro|cervello|mind ai smart
🫀|heart organ|coeur organe|herz organ|corazon organo|cuore organo|heart health
🫁|lungs|poumons|lungen|pulmones|polmoni|health breath
👀|eyes|yeux|augen|ojos|occhi|look
👁️|eye|oeil|auge|ojo|occhio|look
👅|tongue|langue|zunge|lengua|lingua|taste
👄|mouth|bouche|mund|boca|bocca|lips
👶|baby|bebe|baby|bebe|bebe|child
🧒|child|enfant|kind|nino|bambino|kid
👦|boy|garcon|junge|nino|ragazzo|child
👧|girl|fille|maedchen|nina|ragazza|child
🧑|person|personne|person|persona|persona|user
👨|man|homme|mann|hombre|uomo|person
👩|woman|femme|frau|mujer|donna|person
🧓|older person|personne agee|aeltere person|persona mayor|persona anziana|old
👴|old man|homme age|alter mann|anciano|anziano|old
👵|old woman|femme agee|alte frau|anciana|anziana|old
👮|police officer|policier|polizei|policia|polizia|job
👷|construction worker|ouvrier|bauarbeiter|obrero|operaio|job
💂|guard|garde|waechter|guardia|guardia|job
🕵️|detective|detective|detektiv|detective|detective|spy
👩‍⚕️|health worker woman|soignante|gesundheitsarbeiterin|sanitaria|sanitaria|doctor nurse
👨‍⚕️|health worker man|soignant|gesundheitsarbeiter|sanitario|sanitario|doctor nurse
👩‍💻|woman technologist|developpeuse|entwicklerin|desarrolladora|sviluppatrice|code dev
👨‍💻|man technologist|developpeur|entwickler|desarrollador|sviluppatore|code dev
🧑‍💻|technologist|informaticien|techniker|tecnologo|tecnologo|code dev
👩‍🎨|woman artist|artiste femme|kuenstlerin|artista mujer|artista donna|art
👨‍🎨|man artist|artiste homme|kuenstler|artista hombre|artista uomo|art
👩‍🚀|woman astronaut|astronaute femme|astronautin|astronauta mujer|astronauta donna|space
👨‍🚀|man astronaut|astronaute homme|astronaut|astronauta hombre|astronauta uomo|space
🧑‍🚀|astronaut|astronaute|astronaut|astronauta|astronauta|space
👑|crown|couronne|krone|corona|corona|king queen premium
💍|ring|bague|ring|anillo|anello|wedding
💼|briefcase|mallette|aktentasche|maletin|valigetta|business work
🎒|backpack|sac a dos|rucksack|mochila|zaino|school
🐶|dog face|chien|hund|perro|cane|animal pet
🐱|cat face|chat|katze|gato|gatto|animal pet
🐭|mouse face|souris|maus|raton|topo|animal
🐹|hamster|hamster|hamster|hamster|criceto|animal
🐰|rabbit|lapin|kaninchen|conejo|coniglio|animal
🦊|fox|renard|fuchs|zorro|volpe|animal
🐻|bear|ours|baer|oso|orso|animal
🐼|panda|panda|panda|panda|panda|animal
🐨|koala|koala|koala|koala|koala|animal
🐯|tiger|tigre|tiger|tigre|tigre|animal
🦁|lion|lion|loewe|leon|leone|animal
🐮|cow|vache|kuh|vaca|mucca|animal farm
🐷|pig|cochon|schwein|cerdo|maiale|animal
🐸|frog|grenouille|frosch|rana|rana|animal
🐵|monkey|singe|affe|mono|scimmia|animal
🐔|chicken|poule|huhn|pollo|pollo|animal
🐧|penguin|manchot|pinguin|pinguino|pinguino|animal
🐦|bird|oiseau|vogel|pajaro|uccello|animal
🐤|baby chick|poussin|kueken|pollito|pulcino|animal
🦆|duck|canard|ente|pato|anatra|animal
🦅|eagle|aigle|adler|aguila|aquila|animal
🦉|owl|hibou|eule|buho|gufo|animal
🦇|bat|chauve souris|fledermaus|murcielago|pipistrello|animal
🐺|wolf|loup|wolf|lobo|lupo|animal
🐗|boar|sanglier|wildschwein|jabali|cinghiale|animal
🐴|horse|cheval|pferd|caballo|cavallo|animal
🦄|unicorn|licorne|einhorn|unicornio|unicorno|fantasy
🐝|bee|abeille|biene|abeja|ape|insect
🦋|butterfly|papillon|schmetterling|mariposa|farfalla|insect
🐌|snail|escargot|schnecke|caracol|lumaca|animal
🐞|lady beetle|coccinelle|marienkaefer|mariquita|coccinella|insect
🐜|ant|fourmi|ameise|hormiga|formica|insect
🕷️|spider|araignee|spinne|arana|ragno|insect
🦂|scorpion|scorpion|skorpion|escorpion|scorpione|animal
🐢|turtle|tortue|schildkroete|tortuga|tartaruga|animal
🐍|snake|serpent|schlange|serpiente|serpente|animal
🦎|lizard|lezard|echse|lagarto|lucertola|animal
🦖|t rex|t rex|t rex|t rex|t rex|dinosaur
🦕|sauropod|dinosaure|dinosaurier|dinosaurio|dinosauro|dinosaur
🐙|octopus|pieuvre|oktopus|pulpo|polpo|sea
🦑|squid|calmar|tintenfisch|calamar|calamaro|sea
🦐|shrimp|crevette|garnele|camaron|gambero|sea food
🦞|lobster|homard|hummer|langosta|aragosta|sea food
🦀|crab|crabe|krabbe|cangrejo|granchio|sea food
🐠|tropical fish|poisson tropical|tropenfisch|pez tropical|pesce tropicale|fish
🐟|fish|poisson|fisch|pez|pesce|animal
🐬|dolphin|dauphin|delfin|delfin|delfino|animal
🐳|whale|baleine|wal|ballena|balena|animal
🌵|cactus|cactus|kaktus|cactus|cactus|plant
🎄|christmas tree|sapin noel|weihnachtsbaum|arbol navidad|albero natale|christmas
🌲|evergreen tree|sapin|nadelbaum|pino|abete|tree
🌳|deciduous tree|arbre|baum|arbol|albero|tree
🌴|palm tree|palmier|palme|palmera|palma|tree beach
🌱|seedling|pousse|keimling|brote|germoglio|plant
🌿|herb|herbe|kraut|hierba|erba|plant
☘️|shamrock|trefle|kleeblatt|trebol|trifoglio|luck
🍀|four leaf clover|trefle quatre feuilles|vierblaettriges kleeblatt|trebol cuatro hojas|quadrifoglio|luck
🌹|rose|rose|rose|rosa|rosa|flower love
🌺|hibiscus|hibiscus|hibiskus|hibisco|ibisco|flower
🌻|sunflower|tournesol|sonnenblume|girasol|girasole|flower
🌼|blossom|fleur|bluete|flor|fiore|flower
🌷|tulip|tulipe|tulpe|tulipan|tulipano|flower
🍎|red apple|pomme rouge|apfel rot|manzana roja|mela rossa|fruit food
🍐|pear|poire|birne|pera|pera|fruit food
🍊|tangerine|mandarine|mandarine|mandarina|mandarino|fruit food
🍋|lemon|citron|zitrone|limon|limone|fruit food
🍌|banana|banane|banane|platano|banana|fruit food
🍉|watermelon|pasteque|wassermelone|sandia|anguria|fruit food
🍇|grapes|raisins|trauben|uvas|uva|fruit food
🍓|strawberry|fraise|erdbeere|fresa|fragola|fruit food
🫐|blueberries|myrtilles|blaubeeren|arandanos|mirtilli|fruit food
🍈|melon|melon|melone|melon|melone|fruit food
🍒|cherries|cerises|kirschen|cerezas|ciliegie|fruit food
🍑|peach|peche|pfirsich|melocoton|pesca|fruit food
🥭|mango|mangue|mango|mango|mango|fruit food
🍍|pineapple|ananas|ananas|pina|ananas|fruit food
🥥|coconut|noix coco|kokosnuss|coco|cocco|fruit food
🥝|kiwi|kiwi|kiwi|kiwi|kiwi|fruit food
🍅|tomato|tomate|tomate|tomate|pomodoro|vegetable food
🥑|avocado|avocat|avocado|aguacate|avocado|food
🍆|eggplant|aubergine|aubergine|berenjena|melanzana|vegetable food
🥔|potato|pomme de terre|kartoffel|patata|patata|vegetable food
🥕|carrot|carotte|karotte|zanahoria|carota|vegetable food
🌽|corn|mais|mais|maiz|mais|vegetable food
🌶️|hot pepper|piment|chili|chile|peperoncino|spicy food
🥒|cucumber|concombre|gurke|pepino|cetriolo|vegetable food
🥬|leafy green|salade|blattgemuese|verdura hoja|verdura foglia|vegetable food
🥦|broccoli|brocoli|brokkoli|brocoli|broccolo|vegetable food
🧄|garlic|ail|knoblauch|ajo|aglio|food
🧅|onion|oignon|zwiebel|cebolla|cipolla|food
🍄|mushroom|champignon|pilz|seta|fungo|food
🥜|peanuts|cacahuetes|erdnuesse|cacahuetes|arachidi|food
🍞|bread|pain|brot|pan|pane|food
🥐|croissant|croissant|croissant|cruasan|cornetto|food france
🥖|baguette|baguette|baguette|baguette|baguette|food france
🥨|pretzel|bretzel|brezel|pretzel|pretzel|food
🧀|cheese|fromage|kaese|queso|formaggio|food
🥚|egg|oeuf|ei|huevo|uovo|food
🍳|cooking|cuisson|kochen|cocinar|cucinare|food
🥞|pancakes|pancakes|pfannkuchen|panqueques|pancake|food
🧇|waffle|gaufre|waffel|gofre|waffle|food
🥓|bacon|bacon|speck|tocino|bacon|food
🍔|burger|burger|burger|hamburguesa|hamburger|food
🍟|fries|frites|pommes|patatas fritas|patatine|food
🍕|pizza|pizza|pizza|pizza|pizza|food
🌭|hot dog|hot dog|hotdog|perrito caliente|hot dog|food
🥪|sandwich|sandwich|sandwich|sandwich|panino|food
🌮|taco|taco|taco|taco|taco|food
🌯|burrito|burrito|burrito|burrito|burrito|food
🥗|salad|salade|salat|ensalada|insalata|food
🍝|spaghetti|spaghetti|spaghetti|espaguetis|spaghetti|food pasta
🍣|sushi|sushi|sushi|sushi|sushi|food japan
🍩|doughnut|donut|donut|dona|ciambella|food sweet
🍪|cookie|cookie|keks|galleta|biscotto|food sweet
🎂|birthday cake|gateau anniversaire|geburtstagskuchen|tarta cumpleanos|torta compleanno|birthday cake
🍰|cake|gateau|kuchen|pastel|torta|sweet
🧁|cupcake|cupcake|cupcake|magdalena|cupcake|sweet
🍫|chocolate|chocolat|schokolade|chocolate|cioccolato|sweet
🍬|candy|bonbon|bonbon|caramelo|caramella|sweet
🍭|lollipop|sucette|lutscher|piruleta|lecca lecca|sweet
☕|coffee|cafe|kaffee|cafe|caffe|drink
🍵|tea|the|tee|te|te|drink
🥤|cup with straw|boisson paille|becher strohhalm|vaso pajita|bicchiere cannuccia|drink
🍺|beer|biere|bier|cerveza|birra|drink
🍷|wine|vin|wein|vino|vino|drink
🍸|cocktail|cocktail|cocktail|coctel|cocktail|drink
🌍|globe europe africa|globe europe afrique|globus europa afrika|globo europa africa|globo europa africa|earth world
🌎|globe americas|globe amerique|globus amerika|globo americas|globo americhe|earth world
🌏|globe asia australia|globe asie australie|globus asien australien|globo asia australia|globo asia australia|earth world
🌐|globe meridians|globe meridiens|globus meridiane|globo meridianos|globo meridiani|internet web
🗺️|world map|carte monde|weltkarte|mapa mundo|mappa mondo|map
🧭|compass|boussole|kompass|brujula|bussola|navigation
🏔️|snow mountain|montagne neige|schneeberg|montana nieve|montagna neve|nature
⛰️|mountain|montagne|berg|montana|montagna|nature
🌋|volcano|volcan|vulkan|volcan|vulcano|nature
🏕️|camping|camping|camping|camping|campeggio|travel
🏖️|beach|plage|strand|playa|spiaggia|travel
🏜️|desert|desert|wueste|desierto|deserto|nature
🏝️|island|ile|insel|isla|isola|travel
🏟️|stadium|stade|stadion|estadio|stadio|sport
🏛️|classical building|batiment classique|klassisches gebaeude|edificio clasico|edificio classico|museum
🏗️|construction|chantier|baustelle|construccion|costruzione|work
🏠|house|maison|haus|casa|casa|home
🏡|house garden|maison jardin|haus garten|casa jardin|casa giardino|home
🏢|office building|immeuble bureaux|buerohaus|oficinas|uffici|work
🏥|hospital|hopital|krankenhaus|hospital|ospedale|health
🏦|bank|banque|bank|banco|banca|money
🏨|hotel|hotel|hotel|hotel|hotel|travel
🏫|school|ecole|schule|escuela|scuola|education
🏭|factory|usine|fabrik|fabrica|fabbrica|industry
⛪|church|eglise|kirche|iglesia|chiesa|religion
🕌|mosque|mosquee|moschee|mezquita|moschea|religion
🕍|synagogue|synagogue|synagoge|sinagoga|sinagoga|religion
🛕|hindu temple|temple hindou|hindu tempel|templo hindu|tempio indu|religion
🗽|statue liberty|statue liberte|freiheitsstatue|estatua libertad|statua liberta|new york
🗼|tokyo tower|tour tokyo|tokio turm|torre tokio|torre tokyo|japan
🚗|car|voiture|auto|coche|auto|vehicle
🚕|taxi|taxi|taxi|taxi|taxi|vehicle
🚌|bus|bus|bus|autobus|autobus|vehicle
🚎|trolleybus|trolleybus|oberleitungsbus|trolebus|filobus|vehicle
🏎️|racing car|voiture course|rennwagen|coche carreras|auto corsa|sport vehicle
🚓|police car|voiture police|polizeiauto|coche policia|auto polizia|vehicle
🚑|ambulance|ambulance|krankenwagen|ambulancia|ambulanza|health vehicle
🚒|fire engine|camion pompier|feuerwehr|bomberos|vigili fuoco|vehicle
🚚|delivery truck|camion livraison|lieferwagen|camion reparto|camion consegne|delivery
🚲|bicycle|velo|fahrrad|bicicleta|bicicletta|bike
🛴|kick scooter|trottinette|roller|patinete|monopattino|scooter
✈️|airplane|avion|flugzeug|avion|aereo|travel
🚀|rocket|fusee|rakete|cohete|razzo|space launch
🛸|flying saucer|soucoupe volante|ufo|ovni|ufo|alien
⛵|sailboat|voilier|segelboot|velero|barca vela|boat
🚢|ship|navire|schiff|barco|nave|boat
⚓|anchor|ancre|anker|ancla|ancora|boat
⌛|hourglass done|sablier termine|sanduhren ende|reloj arena fin|clessidra fine|time
⏳|hourglass running|sablier|sanduhren laeuft|reloj arena|clessidra|time
⌚|watch|montre|uhr|reloj|orologio|time
⏰|alarm clock|reveil|wecker|despertador|sveglia|time
⏱️|stopwatch|chronometre|stoppuhr|cronometro|cronometro|time
⏲️|timer clock|minuteur|timer|temporizador|timer|time
🕰️|mantelpiece clock|horloge|uhr|reloj mesa|orologio|time
🌙|crescent moon|lune croissant|mondsichel|luna creciente|luna crescente|night
☀️|sun|soleil|sonne|sol|sole|weather
⭐|star|etoile|stern|estrella|stella|favorite
🌟|glowing star|etoile brillante|leuchtender stern|estrella brillante|stella luminosa|sparkle
✨|sparkles|etincelles|funkeln|destellos|scintille|magic
⚡|lightning|eclair|blitz|rayo|fulmine|energy
🔥|fire|feu|feuer|fuego|fuoco|hot trend
💥|collision|explosion|kollision|explosion|esplosione|boom
❄️|snowflake|flocon neige|schneeflocke|copo nieve|fiocco neve|cold
☔|umbrella rain|parapluie pluie|regenschirm|paraguas lluvia|ombrello pioggia|rain
💧|droplet|goutte|tropfen|gota|goccia|water
🌊|water wave|vague|welle|ola|onda|sea
🎉|party popper|confettis|party knaller|confeti|coriandoli|celebrate party
🎊|confetti ball|boule confettis|konfetti kugel|bola confeti|palla coriandoli|party
🎈|balloon|ballon|ballon|globo|palloncino|party
🎁|wrapped gift|cadeau|geschenk|regalo|regalo|gift
🏆|trophy|trophee|pokal|trofeo|trofeo|winner
🥇|gold medal|medaille or|goldmedaille|medalla oro|medaglia oro|winner
🥈|silver medal|medaille argent|silbermedaille|medalla plata|medaglia argento|second
🥉|bronze medal|medaille bronze|bronzemedaille|medalla bronce|medaglia bronzo|third
⚽|soccer ball|football|fussball|futbol|calcio|sport
🏀|basketball|basketball|basketball|baloncesto|basket|sport
🏈|american football|football americain|american football|futbol americano|football americano|sport
⚾|baseball|baseball|baseball|beisbol|baseball|sport
🎾|tennis|tennis|tennis|tenis|tennis|sport
🏐|volleyball|volley|volleyball|voleibol|pallavolo|sport
🎮|video game|jeu video|videospiel|videojuego|videogioco|game
🕹️|joystick|joystick|joystick|joystick|joystick|game
🎲|game die|de|wuerfel|dado|dado|game random
♟️|chess pawn|pion echec|schachbauer|peon ajedrez|pedone scacchi|game
🎨|artist palette|palette artiste|malerpalette|paleta artista|tavolozza|art
🎬|clapper board|clap cinema|filmklappe|claqueta|ciak|movie video
🎤|microphone|micro|mikrofon|microfono|microfono|music
🎧|headphones|casque audio|kopfhoerer|auriculares|cuffie|music audio
🎼|musical score|partition|notenblatt|partitura|spartito|music
🎹|piano|piano|klavier|piano|pianoforte|music
🥁|drum|tambour|trommel|tambor|tamburo|music
📱|mobile phone|telephone mobile|handy|movil|cellulare|phone
💻|laptop|ordinateur portable|laptop|portatil|laptop|computer
🖥️|desktop computer|ordinateur bureau|desktop computer|ordenador sobremesa|computer fisso|computer
⌨️|keyboard|clavier|tastatur|teclado|tastiera|computer
🖱️|computer mouse|souris ordinateur|computermaus|raton ordenador|mouse computer|computer
🖨️|printer|imprimante|drucker|impresora|stampante|office
📷|camera|appareil photo|kamera|camara|fotocamera|photo
📸|camera flash|photo flash|kamera blitz|camara flash|fotocamera flash|photo
📹|video camera|camera video|videokamera|camara video|videocamera|video
🎥|movie camera|camera cinema|filmkamera|camara cine|cinepresa|movie
📺|television|television|fernseher|television|televisione|tv
📻|radio|radio|radio|radio|radio|audio
☎️|telephone|telephone|telefon|telefono|telefono|phone
💡|light bulb|ampoule|gluehbirne|bombilla|lampadina|idea
🔦|flashlight|lampe torche|taschenlampe|linterna|torcia|light
🕯️|candle|bougie|kerze|vela|candela|light
🧯|fire extinguisher|extincteur|feuerloescher|extintor|estintore|safety
🛢️|oil drum|baril petrole|oelfass|barril aceite|barile petrolio|industry
💸|money with wings|argent ailes|geld fluegel|dinero alas|soldi ali|money
💵|dollar banknote|billet dollar|dollarschein|billete dolar|banconota dollaro|money
💶|euro banknote|billet euro|euroschein|billete euro|banconota euro|money
💷|pound banknote|billet livre|pfundschein|billete libra|banconota sterlina|money
💰|money bag|sac argent|geldsack|bolsa dinero|sacco soldi|money
💳|credit card|carte bancaire|kreditkarte|tarjeta credito|carta credito|money payment
🧾|receipt|recu|beleg|recibo|ricevuta|invoice
💎|gem stone|diamant|edelstein|gema|gemma|premium
⚖️|balance scale|balance justice|waage|balanza|bilancia|law justice
🔧|wrench|cle outil|schraubenschluessel|llave inglesa|chiave inglese|tool
🔨|hammer|marteau|hammer|martillo|martello|tool
⚒️|hammer pick|marteau pioche|hammer pickel|martillo pico|martello piccone|tool
🛠️|tools|outils|werkzeuge|herramientas|strumenti|tool
⛏️|pick|pioche|spitzhacke|pico|piccone|tool
🔩|nut bolt|ecrou boulon|mutter schraube|tuerca tornillo|dado bullone|tool
⚙️|gear|engrenage|zahnrad|engranaje|ingranaggio|settings
🧰|toolbox|boite outils|werkzeugkasten|caja herramientas|cassetta attrezzi|tool
🧲|magnet|aimant|magnet|iman|magnete|science
🧪|test tube|tube essai|reagenzglas|tubo ensayo|provetta|science
🧫|petri dish|boite petri|petrischale|placa petri|piastra petri|science
🧬|dna|adn|dna|adn|dna|science
🔬|microscope|microscope|mikroskop|microscopio|microscopio|science
🔭|telescope|telescope|teleskop|telescopio|telescopio|science space
📡|satellite antenna|antenne satellite|satellitenschuessel|antena satelite|antenna satellite|tech
💉|syringe|seringue|spritze|jeringa|siringa|health
💊|pill|pilule|pille|pastilla|pillola|health
🩺|stethoscope|stethoscope|stethoskop|estetoscopio|stetoscopio|health
🩹|bandage|pansement|pflaster|tirita|cerotto|health
🚪|door|porte|tuer|puerta|porta|home
🪑|chair|chaise|stuhl|silla|sedia|furniture
🛏️|bed|lit|bett|cama|letto|home
🛋️|couch lamp|canape lampe|sofa lampe|sofa lampara|divano lampada|home
🚽|toilet|toilettes|toilette|inodoro|wc|bathroom
🚿|shower|douche|dusche|ducha|doccia|bathroom
🛁|bathtub|baignoire|badewanne|banera|vasca|bathroom
🧴|lotion bottle|flacon lotion|lotion flasche|botella locion|flacone lozione|bathroom
🧷|safety pin|epingle nourrice|sicherheitsnadel|imperdible|spilla sicurezza|object
🧹|broom|balai|besen|escoba|scopa|clean
🧺|basket|panier|korb|cesta|cesto|object
🧻|roll paper|papier toilette|papierrolle|papel rollo|rotolo carta|paper
🪣|bucket|seau|eimer|cubo|secchio|object
🧼|soap|savon|seife|jabon|sapone|clean
🪥|toothbrush|brosse dents|zahnbuerste|cepillo dientes|spazzolino|bathroom
🧽|sponge|eponge|schwamm|esponja|spugna|clean
🛒|shopping cart|chariot courses|einkaufswagen|carrito compra|carrello spesa|shopping
🚬|cigarette|cigarette|zigarette|cigarrillo|sigaretta|smoking
⚰️|coffin|cercueil|sarg|ataud|bara|death
⚱️|funeral urn|urne funeraire|urne|urna funeraria|urna funeraria|death
🗿|moai|moai|moai|moai|moai|statue
🏧|atm sign|distributeur|geldautomat|cajero|bancomat|money
🚮|litter bin|poubelle|muelleimer|papelera|cestino|trash
🚰|potable water|eau potable|trinkwasser|agua potable|acqua potabile|water
♿|wheelchair symbol|fauteuil roulant|rollstuhl|silla ruedas|sedia rotelle|accessibility
🚹|men room|toilettes hommes|herren wc|bano hombres|bagno uomini|toilet
🚺|women room|toilettes femmes|damen wc|bano mujeres|bagno donne|toilet
🚻|restroom|toilettes|toilette|servicios|bagni|toilet
🚼|baby symbol|symbole bebe|baby symbol|simbolo bebe|simbolo bebe|baby
🚾|water closet|wc|wc|wc|wc|toilet
⚠️|warning|attention|warnung|advertencia|attenzione|alert danger
🚸|children crossing|passage enfants|kinder ueberweg|cruce ninos|attraversamento bambini|warning
⛔|no entry|sens interdit|einfahrt verboten|prohibido entrar|divieto accesso|ban
🚫|prohibited|interdit|verboten|prohibido|vietato|ban
✅|check mark button|valide|haken|marca verificacion|spunta|ok done
☑️|check box|case cochee|checkbox|casilla marcada|casella spuntata|done
✔️|check mark|coche|haekchen|marca|spunta|ok
❌|cross mark|croix|kreuz|cruz|croce|no error
❎|cross button|bouton croix|kreuz taste|boton cruz|pulsante croce|no
➕|plus|plus|plus|mas|piu|add
➖|minus|moins|minus|menos|meno|remove
➗|divide|diviser|teilen|dividir|dividere|math
✖️|multiply|multiplier|multiplizieren|multiplicar|moltiplicare|math
💯|hundred points|cent points|hundert punkte|cien puntos|cento punti|perfect
🔴|red circle|cercle rouge|roter kreis|circulo rojo|cerchio rosso|color
🟠|orange circle|cercle orange|orange kreis|circulo naranja|cerchio arancione|color
🟡|yellow circle|cercle jaune|gelber kreis|circulo amarillo|cerchio giallo|color
🟢|green circle|cercle vert|gruener kreis|circulo verde|cerchio verde|color
🔵|blue circle|cercle bleu|blauer kreis|circulo azul|cerchio blu|color
🟣|purple circle|cercle violet|lila kreis|circulo morado|cerchio viola|color
⚫|black circle|cercle noir|schwarzer kreis|circulo negro|cerchio nero|color
⚪|white circle|cercle blanc|weisser kreis|circulo blanco|cerchio bianco|color
🟥|red square|carre rouge|rotes quadrat|cuadrado rojo|quadrato rosso|color
🟧|orange square|carre orange|orange quadrat|cuadrado naranja|quadrato arancione|color
🟨|yellow square|carre jaune|gelbes quadrat|cuadrado amarillo|quadrato giallo|color
🟩|green square|carre vert|gruenes quadrat|cuadrado verde|quadrato verde|color
🟦|blue square|carre bleu|blaues quadrat|cuadrado azul|quadrato blu|color
🟪|purple square|carre violet|lila quadrat|cuadrado morado|quadrato viola|color
⬛|black large square|grand carre noir|grosses schwarzes quadrat|cuadrado negro grande|grande quadrato nero|color
⬜|white large square|grand carre blanc|grosses weisses quadrat|cuadrado blanco grande|grande quadrato bianco|color
❤️|red heart|coeur rouge|rotes herz|corazon rojo|cuore rosso|love
🧡|orange heart|coeur orange|oranges herz|corazon naranja|cuore arancione|love
💛|yellow heart|coeur jaune|gelbes herz|corazon amarillo|cuore giallo|love
💚|green heart|coeur vert|gruenes herz|corazon verde|cuore verde|love
💙|blue heart|coeur bleu|blaues herz|corazon azul|cuore blu|love
💜|purple heart|coeur violet|lila herz|corazon morado|cuore viola|love
🖤|black heart|coeur noir|schwarzes herz|corazon negro|cuore nero|love
🤍|white heart|coeur blanc|weisses herz|corazon blanco|cuore bianco|love
🤎|brown heart|coeur marron|braunes herz|corazon marron|cuore marrone|love
💔|broken heart|coeur brise|gebrochenes herz|corazon roto|cuore spezzato|sad love
❣️|heart exclamation|coeur exclamation|herz ausrufezeichen|corazon exclamacion|cuore esclamativo|love
💕|two hearts|deux coeurs|zwei herzen|dos corazones|due cuori|love
💞|revolving hearts|coeurs tournants|kreisende herzen|corazones girando|cuori rotanti|love
💓|beating heart|coeur battant|schlagendes herz|corazon latiendo|cuore battente|love
💗|growing heart|coeur grandissant|wachsendes herz|corazon creciendo|cuore crescente|love
💖|sparkling heart|coeur scintillant|funkelndes herz|corazon brillante|cuore scintillante|love
💘|heart arrow|coeur fleche|herz pfeil|corazon flecha|cuore freccia|love
💝|heart ribbon|coeur ruban|herz band|corazon cinta|cuore nastro|love gift
💟|heart decoration|decoration coeur|herz dekoration|decoracion corazon|decorazione cuore|love
☮️|peace symbol|paix|frieden|paz|pace|peace
✝️|latin cross|croix latine|lateinisches kreuz|cruz latina|croce latina|religion
☪️|star crescent|etoile croissant|stern halbmond|estrella media luna|stella mezzaluna|religion
🕉️|om|om|om|om|om|religion
☸️|wheel dharma|roue dharma|dharma rad|rueda dharma|ruota dharma|religion
✡️|star of david|etoile david|davidstern|estrella david|stella david|religion
🔯|dotted star|etoile points|punkt stern|estrella puntos|stella puntini|religion
♈|aries|belier|widder|aries|ariete|zodiac
♉|taurus|taureau|stier|tauro|toro|zodiac
♊|gemini|gemeaux|zwillinge|geminis|gemelli|zodiac
♋|cancer|cancer|krebs|cancer|cancro|zodiac
♌|leo|lion zodiac|loewe zodiac|leo|leone|zodiac
♍|virgo|vierge|jungfrau|virgo|vergine|zodiac
♎|libra|balance|waage|libra|bilancia|zodiac
♏|scorpio|scorpion zodiac|skorpion zodiac|escorpio|scorpione|zodiac
♐|sagittarius|sagittaire|schuetze|sagitario|sagittario|zodiac
♑|capricorn|capricorne|steinbock|capricornio|capricorno|zodiac
♒|aquarius|verseau|wassermann|acuario|acquario|zodiac
♓|pisces|poissons|fische|piscis|pesci|zodiac
🫠|melting face|visage qui fond|schmelzendes gesicht|cara derritiendose|faccia che si scioglie|hot awkward
🫢|face with open eyes hand mouth|main sur bouche yeux ouverts|hand vor mund augen offen|mano en boca ojos abiertos|mano sulla bocca occhi aperti|oops surprise
🫣|face peeking|visage qui regarde|spaeht hervor|mirando entre dedos|sbircia|peek shy
🫡|saluting face|salut militaire|salutierendes gesicht|saludo militar|saluto militare|respect
🫥|dotted line face|visage pointille|gesicht gestrichelt|cara punteada|faccia tratteggiata|invisible
🫨|shaking face|visage qui tremble|zitterndes gesicht|cara temblando|faccia tremante|shock
🥹|holding back tears|larmes retenues|traenen zurueckhalten|lagrimas contenidas|lacrime trattenute|emotion
🥲|smiling tear|sourire larme|laecheln mit traene|sonrisa con lagrima|sorriso con lacrima|emotion
🫶|heart hands|mains coeur|herz haende|manos corazon|mani cuore|love
🫰|hand with index thumb crossed|doigts coeur|fingerherz|dedos corazon|cuore dita|love kpop
🫵|index pointing at viewer|doigt vers toi|finger zeigt auf dich|dedo hacia ti|dito verso te|you
🫱|rightwards hand|main vers droite|hand nach rechts|mano derecha|mano destra|hand
🫲|leftwards hand|main vers gauche|hand nach links|mano izquierda|mano sinistra|hand
🫳|palm down hand|paume vers bas|handflaeche unten|palma abajo|palmo giu|hand
🫴|palm up hand|paume vers haut|handflaeche oben|palma arriba|palmo su|hand offer
🫷|leftwards pushing hand|main pousse gauche|schiebende hand links|mano empuja izquierda|mano spinge sinistra|push stop
🫸|rightwards pushing hand|main pousse droite|schiebende hand rechts|mano empuja derecha|mano spinge destra|push stop
🧑‍🎓|student|etudiant|student|estudiante|studente|school
👩‍🎓|woman student|etudiante|studentin|estudiante mujer|studentessa|school
👨‍🎓|man student|etudiant homme|student|estudiante hombre|studente|school
🧑‍🏫|teacher|enseignant|lehrer|profesor|insegnante|school
👩‍🏫|woman teacher|enseignante|lehrerin|profesora|insegnante donna|school
👨‍🏫|man teacher|enseignant homme|lehrer|profesor|insegnante uomo|school
🧑‍⚖️|judge|juge|richter|juez|giudice|law
👩‍⚖️|woman judge|juge femme|richterin|jueza|giudice donna|law
👨‍⚖️|man judge|juge homme|richter|juez|giudice uomo|law
🧑‍🌾|farmer|agriculteur|bauer|agricultor|agricoltore|farm
🧑‍🍳|cook|cuisinier|koch|cocinero|cuoco|food job
👩‍🍳|woman cook|cuisiniere|koechin|cocinera|cuoca|food job
👨‍🍳|man cook|cuisinier homme|koch|cocinero|cuoco|food job
🧑‍🔧|mechanic|mecanicien|mechaniker|mecanico|meccanico|repair
🧑‍🏭|factory worker|ouvrier usine|fabrikarbeiter|trabajador fabrica|operaio fabbrica|industry
🧑‍💼|office worker|employe bureau|bueroangestellter|oficinista|impiegato|business
🧑‍🔬|scientist|scientifique|wissenschaftler|cientifico|scienziato|science
🧑‍🚒|firefighter|pompier|feuerwehrmann|bombero|pompiere|emergency
🧑‍✈️|pilot|pilote|pilot|piloto|pilota|travel
🧑‍⚕️|health worker|soignant|gesundheitskraft|sanitario|sanitario|health
🧑‍🎤|singer|chanteur|saenger|cantante|cantante|music
🧑‍🎨|artist|artiste|kuenstler|artista|artista|art
🧑‍🔭|astronomer|astronome|astronom|astronomo|astronomo|space
🧑‍🦰|person red hair|personne cheveux roux|person rote haare|persona pelirroja|persona capelli rossi|hair
🧑‍🦱|person curly hair|personne cheveux boucles|person locken|persona pelo rizado|persona capelli ricci|hair
🧑‍🦳|person white hair|personne cheveux blancs|person weisse haare|persona pelo blanco|persona capelli bianchi|hair
🧑‍🦲|person bald|personne chauve|person glatze|persona calva|persona calva|hair
🦮|guide dog|chien guide|fuehrhund|perro guia|cane guida|accessibility
🐕‍🦺|service dog|chien assistance|assistenzhund|perro asistencia|cane assistenza|accessibility
🦧|orangutan|orang outan|orang utan|orangutan|orangotango|animal
🦍|gorilla|gorille|gorilla|gorila|gorilla|animal
🦣|mammoth|mammouth|mammut|mamut|mammut|animal
🦬|bison|bison|bison|bisonte|bisonte|animal
🦙|llama|lama|lama|llama|lama|animal
🦘|kangaroo|kangourou|kaenguru|canguro|canguro|animal
🦥|sloth|paresseux|faultier|perezoso|bradipo|animal
🦦|otter|loutre|otter|nutria|lontra|animal
🦨|skunk|moufette|stinktier|mofeta|puzzola|animal
🦡|badger|blaireau|dachs|tejon|tasso|animal
🦫|beaver|castor|biber|castor|castoro|animal
🦤|dodo|dodo|dodo|dodo|dodo|animal
🪶|feather|plume|feder|pluma|piuma|bird
🦩|flamingo|flamant rose|flamingo|flamenco|fenicottero|animal
🦚|peacock|paon|pfau|pavo real|pavone|animal
🦜|parrot|perroquet|papagei|loro|pappagallo|animal
🪽|wing|aile|fluegel|ala|ala|fly
🪿|goose|oie|gans|ganso|oca|animal
🪼|jellyfish|meduse|qualle|medusa|medusa|sea
🪸|coral|corail|koralle|coral|corallo|sea
🪷|lotus|lotus|lotus|loto|loto|flower
🪻|hyacinth|jacinthe|hyazinthe|jacinto|giacinto|flower
🫚|ginger root|gingembre|ingwer|jengibre|zenzero|food
🫛|pea pod|cosse pois|erbsenschote|vaina guisantes|baccello piselli|food
🫒|olive|olive|olive|aceituna|oliva|food
🫓|flatbread|pain plat|fladenbrot|pan plano|pane piatto|food
🫔|tamale|tamale|tamale|tamal|tamale|food
🫕|fondue|fondue|fondue|fondue|fonduta|food
🧋|bubble tea|bubble tea|bubble tea|te burbujas|bubble tea|drink
🧃|beverage box|brique boisson|getraenkekarton|caja bebida|brick bevanda|drink
🧉|mate|mate|mate|mate|mate|drink
🧊|ice cube|glacon|eiswuerfel|cubo hielo|cubetto ghiaccio|cold drink
🛝|playground slide|toboggan|rutsche|tobogan|scivolo|play
🛟|ring buoy|bouee sauvetage|rettungsring|salvavidas|salvagente|safety
🪬|hamsa|main hamsa|hamsa|hamsa|hamsa|symbol
🪩|mirror ball|boule disco|discokugel|bola disco|palla disco|party
🪭|folding fan|eventail|faecher|abanico|ventaglio|object
🪮|hair pick|peigne afro|afrokamm|peine afro|pettine afro|hair
🪇|maracas|maracas|maracas|maracas|maracas|music
🪈|flute|flute|floete|flauta|flauto|music
🪔|diya lamp|lampe diya|diya lampe|lampara diya|lampada diya|light
🪅|pinata|pinata|pinata|pinata|pignatta|party
🪆|nesting dolls|poupees russes|matroschka|munecas rusas|matrioska|toy
🪡|sewing needle|aiguille couture|naehnadel|aguja coser|ago cucito|sewing
🧵|thread|fil|faden|hilo|filo|sewing
🪢|knot|noeud|knoten|nudo|nodo|rope
🪙|coin|piece monnaie|muenze|moneda|moneta|money
🪪|identification card|carte identite|ausweis|tarjeta identificacion|carta identita|id
🛗|elevator|ascenseur|aufzug|ascensor|ascensore|building
🪜|ladder|echelle|leiter|escalera|scala|tool
🪠|plunger|ventouse|pömpel|desatascador|sturalavandino|tool
🪤|mouse trap|piege souris|mausefalle|trampa raton|trappola topo|object
🪞|mirror|miroir|spiegel|espejo|specchio|object
🪟|window|fenetre|fenster|ventana|finestra|home
🪧|placard|pancarte|schild|cartel|cartello|sign
🪫|low battery|batterie faible|akku schwach|bateria baja|batteria scarica|battery
🔋|battery|batterie|akku|bateria|batteria|energy
🪔|oil lamp|lampe huile|oellampe|lampara aceite|lampada olio|light
🪚|saw|scie|saege|sierra|sega|tool
🪛|screwdriver|tournevis|schraubendreher|destornillador|cacciavite|tool
🪝|hook|crochet|haken|gancho|gancio|tool
🧱|brick|brique|ziegel|ladrillo|mattone|construction
🪨|rock|rocher|stein|roca|roccia|nature
🪵|wood|bois|holz|madera|legno|nature
🛖|hut|cabane|huette|cabana|capanna|home
🛻|pickup truck|pick up|pickup|camioneta|pickup|vehicle
🛺|auto rickshaw|rickshaw auto|autorikscha|motocarro|risciò|vehicle
🛼|roller skate|patin roulette|rollschuh|patin|pattino|sport
🪂|parachute|parachute|fallschirm|paracaidas|paracadute|sport
🥎|softball|softball|softball|softbol|softball|sport
🥏|flying disc|frisbee|frisbee|frisbee|frisbee|sport
🥍|lacrosse|lacrosse|lacrosse|lacrosse|lacrosse|sport
🛹|skateboard|skateboard|skateboard|monopatin|skateboard|sport
🥌|curling stone|pierre curling|curlingstein|piedra curling|pietra curling|sport
🤿|diving mask|masque plongee|tauchermaske|mascara buceo|maschera sub|sport sea
🥊|boxing glove|gant boxe|boxhandschuh|guante boxeo|guantone boxe|sport
🥋|martial arts uniform|kimono arts martiaux|kampfanzug|kimono artes marciales|kimono arti marziali|sport
🎯|bullseye|cible|zielscheibe|diana|bersaglio|target
🪀|yo yo|yo yo|jojo|yo yo|yo yo|toy
🪁|kite|cerf volant|drachen|cometa|aquilone|toy
🔮|crystal ball|boule cristal|kristallkugel|bola cristal|sfera cristallo|magic
🪄|magic wand|baguette magique|zauberstab|varita magica|bacchetta magica|magic
🧿|nazar amulet|amulette nazar|nazar amulett|amuleto nazar|amuleto nazar|protection
📿|prayer beads|chapelet|gebetskette|rosario|rosario|religion
🪦|headstone|pierre tombale|grabstein|lapida|lapide|death
🪧|sign|panneau|schild|senal|cartello|sign
🧸|teddy bear|ours peluche|teddybaer|oso peluche|orsacchiotto|toy
🪖|military helmet|casque militaire|militaerhelm|casco militar|elmetto militare|army
🎟️|admission tickets|billets entree|eintrittskarten|entradas|biglietti|ticket
🎫|ticket|ticket|ticket|ticket|biglietto|ticket
🏷️|label|etiquette|etikett|etiqueta|etichetta|tag
📌|pushpin|punaise|pin|chincheta|puntina|pin
📍|round pushpin|epingle localisation|standort pin|pin ubicacion|puntina posizione|location
📎|paperclip|trombone|bueroklammer|clip|graffetta|office
🖇️|linked paperclips|trombones lies|verbundene klammern|clips unidos|graffette unite|office
📏|straight ruler|regle|lineal|regla|righello|measure
📐|triangular ruler|equerre|geodreieck|escuadra|squadra|measure
✂️|scissors|ciseaux|schere|tijeras|forbici|cut
🗃️|card file box|boite fiches|karteikasten|caja fichas|scatola schede|office
🗄️|file cabinet|classeur metal|aktenschrank|archivador|schedario|office
🗑️|wastebasket|corbeille|papierkorb|papelera|cestino|trash
🔒|locked|verrouille|gesperrt|bloqueado|bloccato|lock security
🔓|unlocked|deverrouille|entsperrt|desbloqueado|sbloccato|lock security
🔐|locked key|cadenas cle|schloss schluessel|candado llave|lucchetto chiave|security
🔑|key|cle|schluessel|llave|chiave|security
🗝️|old key|ancienne cle|alter schluessel|llave antigua|chiave antica|security
🪧|notice sign|panneau annonce|hinweisschild|senal aviso|cartello avviso|notice
🇫🇷|flag france|drapeau france|flagge frankreich|bandera francia|bandiera francia|country
🇺🇸|flag united states|drapeau etats unis|flagge usa|bandera estados unidos|bandiera stati uniti|country
🇬🇧|flag united kingdom|drapeau royaume uni|flagge grossbritannien|bandera reino unido|bandiera regno unito|country
🇩🇪|flag germany|drapeau allemagne|flagge deutschland|bandera alemania|bandiera germania|country
🇪🇸|flag spain|drapeau espagne|flagge spanien|bandera espana|bandiera spagna|country
🇮🇹|flag italy|drapeau italie|flagge italien|bandera italia|bandiera italia|country
🇨🇦|flag canada|drapeau canada|flagge kanada|bandera canada|bandiera canada|country
🇧🇪|flag belgium|drapeau belgique|flagge belgien|bandera belgica|bandiera belgio|country
🇨🇭|flag switzerland|drapeau suisse|flagge schweiz|bandera suiza|bandiera svizzera|country
🇪🇺|flag european union|drapeau union europeenne|flagge europaeische union|bandera union europea|bandiera unione europea|country europe
🇯🇵|flag japan|drapeau japon|flagge japan|bandera japon|bandiera giappone|country
🇨🇳|flag china|drapeau chine|flagge china|bandera china|bandiera cina|country
🇰🇷|flag south korea|drapeau coree sud|flagge suedkorea|bandera corea sur|bandiera corea sud|country
🇮🇳|flag india|drapeau inde|flagge indien|bandera india|bandiera india|country
🇧🇷|flag brazil|drapeau bresil|flagge brasilien|bandera brasil|bandiera brasile|country
🇲🇽|flag mexico|drapeau mexique|flagge mexiko|bandera mexico|bandiera messico|country
🇦🇺|flag australia|drapeau australie|flagge australien|bandera australia|bandiera australia|country
🇲🇦|flag morocco|drapeau maroc|flagge marokko|bandera marruecos|bandiera marocco|country
🇩🇿|flag algeria|drapeau algerie|flagge algerien|bandera argelia|bandiera algeria|country
🇹🇳|flag tunisia|drapeau tunisie|flagge tunesien|bandera tunez|bandiera tunisia|country
🇵🇹|flag portugal|drapeau portugal|flagge portugal|bandera portugal|bandiera portogallo|country
🇳🇱|flag netherlands|drapeau pays bas|flagge niederlande|bandera paises bajos|bandiera paesi bassi|country
🇸🇪|flag sweden|drapeau suede|flagge schweden|bandera suecia|bandiera svezia|country
🇳🇴|flag norway|drapeau norvege|flagge norwegen|bandera noruega|bandiera norvegia|country
🇩🇰|flag denmark|drapeau danemark|flagge daenemark|bandera dinamarca|bandiera danimarca|country
🇫🇮|flag finland|drapeau finlande|flagge finnland|bandera finlandia|bandiera finlandia|country
🇵🇱|flag poland|drapeau pologne|flagge polen|bandera polonia|bandiera polonia|country
🇺🇦|flag ukraine|drapeau ukraine|flagge ukraine|bandera ucrania|bandiera ucraina|country
🏳️|white flag|drapeau blanc|weisse flagge|bandera blanca|bandiera bianca|flag
🏴|black flag|drapeau noir|schwarze flagge|bandera negra|bandiera nera|flag
🏁|chequered flag|drapeau damier|zielflagge|bandera cuadros|bandiera scacchi|race
🚩|triangular flag|drapeau triangulaire|dreiecksflagge|bandera triangular|bandiera triangolare|flag
`.trim();

  function getEmojiLibrary() {
    return EMOJI_ROWS.split(/\n+/).map((row, index) => {
      const [emoji, en, fr, de, es, it, tags = ""] = row.split("|");
      return {
        id: `emoji-${index}`,
        emoji,
        names: { en, fr, de, es, it },
        tags,
        search: normalizeEmojiSearch([emoji, en, fr, de, es, it, tags].join(" "))
      };
    });
  }

  function normalizeEmojiSearch(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  const SPECIAL_CHARACTER_ROWS = `
É|capital E acute|E majuscule accent aigu|grosses E mit Akut|E mayuscula con acento agudo|E maiuscola con accento acuto|fr|accent uppercase letter
È|capital E grave|E majuscule accent grave|grosses E mit Gravis|E mayuscula con acento grave|E maiuscola con accento grave|fr|accent uppercase letter
À|capital A grave|A majuscule accent grave|grosses A mit Gravis|A mayuscula con acento grave|A maiuscola con accento grave|fr|accent uppercase letter
Ç|capital C cedilla|C majuscule cedille|grosses C mit Cedille|C mayuscula cedilla|C maiuscola cediglia|fr|accent uppercase letter
Ù|capital U grave|U majuscule accent grave|grosses U mit Gravis|U mayuscula con acento grave|U maiuscola con accento grave|fr|accent uppercase letter
Œ|capital OE ligature|OE majuscule lie|grosses OE Ligatur|ligadura OE mayuscula|legatura OE maiuscola|fr|ligature uppercase
Æ|capital AE ligature|AE majuscule lie|grosses AE Ligatur|ligadura AE mayuscula|legatura AE maiuscola|fr|ligature uppercase
Ê|capital E circumflex|E majuscule accent circonflexe|grosses E mit Zirkumflex|E mayuscula con circunflejo|E maiuscola con circonflesso|fr|accent uppercase letter
Â|capital A circumflex|A majuscule accent circonflexe|grosses A mit Zirkumflex|A mayuscula con circunflejo|A maiuscola con circonflesso|fr|accent uppercase letter
Î|capital I circumflex|I majuscule accent circonflexe|grosses I mit Zirkumflex|I mayuscula con circunflejo|I maiuscola con circonflesso|fr|accent uppercase letter
Ô|capital O circumflex|O majuscule accent circonflexe|grosses O mit Zirkumflex|O mayuscula con circunflejo|O maiuscola con circonflesso|fr|accent uppercase letter
Û|capital U circumflex|U majuscule accent circonflexe|grosses U mit Zirkumflex|U mayuscula con circunflejo|U maiuscola con circonflesso|fr|accent uppercase letter
Ë|capital E diaeresis|E majuscule trema|grosses E mit Trema|E mayuscula con dieresis|E maiuscola con dieresi|fr|accent uppercase letter
Ï|capital I diaeresis|I majuscule trema|grosses I mit Trema|I mayuscula con dieresis|I maiuscola con dieresi|fr|accent uppercase letter
Ü|capital U diaeresis|U majuscule trema|grosses U mit Umlaut|U mayuscula con dieresis|U maiuscola con dieresi|fr,de,es|accent uppercase letter
Ñ|capital N tilde|N majuscule tilde|grosses N mit Tilde|N mayuscula con tilde|N maiuscola con tilde|es|spanish accent uppercase
Á|capital A acute|A majuscule accent aigu|grosses A mit Akut|A mayuscula con acento agudo|A maiuscola con accento acuto|es|spanish accent uppercase
Í|capital I acute|I majuscule accent aigu|grosses I mit Akut|I mayuscula con acento agudo|I maiuscola con accento acuto|es|spanish accent uppercase
Ó|capital O acute|O majuscule accent aigu|grosses O mit Akut|O mayuscula con acento agudo|O maiuscola con accento acuto|es,it|spanish italian accent uppercase
Ú|capital U acute|U majuscule accent aigu|grosses U mit Akut|U mayuscula con acento agudo|U maiuscola con accento acuto|es|spanish accent uppercase
Ä|capital A umlaut|A majuscule trema|grosses A mit Umlaut|A mayuscula con dieresis|A maiuscola con dieresi|de|german uppercase umlaut
Ö|capital O umlaut|O majuscule trema|grosses O mit Umlaut|O mayuscula con dieresis|O maiuscola con dieresi|de|german uppercase umlaut
ẞ|capital sharp S|eszett majuscule|grosses Eszett|eszett mayuscula|eszett maiuscola|de|german uppercase sharp s
Ì|capital I grave|I majuscule accent grave|grosses I mit Gravis|I mayuscula con acento grave|I maiuscola con accento grave|it|italian uppercase accent
Ò|capital O grave|O majuscule accent grave|grosses O mit Gravis|O mayuscula con acento grave|O maiuscola con accento grave|it|italian uppercase accent
«|left guillemet|guillemet ouvrant|linkes Guillemets|comilla angular izquierda|virgolette basse sinistra||quote punctuation
»|right guillemet|guillemet fermant|rechtes Guillemets|comilla angular derecha|virgolette basse destra||quote punctuation
“|left double quote|guillemet anglais ouvrant|doppeltes Anfuehrungszeichen links|comilla doble izquierda|virgolette doppie sinistra||quote punctuation
”|right double quote|guillemet anglais fermant|doppeltes Anfuehrungszeichen rechts|comilla doble derecha|virgolette doppie destra||quote punctuation
‘|left single quote|apostrophe ouvrante|einfaches Anfuehrungszeichen links|comilla simple izquierda|virgoletta singola sinistra||quote punctuation
’|right apostrophe|apostrophe typographique|typografischer Apostroph|apostrofo tipografico|apostrofo tipografico||quote apostrophe punctuation
…|ellipsis|points de suspension|Auslassungspunkte|puntos suspensivos|puntini di sospensione||punctuation dots
—|em dash|tiret cadratin|Geviertstrich|raya larga|trattino lungo||dash punctuation
–|en dash|tiret demi-cadratin|Halbgeviertstrich|guion medio|trattino medio||dash punctuation
•|bullet|puce|Aufzaehlungspunkt|vineta|punto elenco||bullet list
·|middle dot|point median|Mittelpunkt|punto medio|punto medio||dot punctuation
©|copyright|copyright|Copyright|copyright|copyright||legal symbol
®|registered trademark|marque deposee|eingetragene Marke|marca registrada|marchio registrato||legal symbol
™|trademark|marque commerciale|Trademark|marca comercial|marchio commerciale||legal symbol
§|section sign|paragraphe juridique|Paragrafenzeichen|signo de seccion|simbolo di sezione||legal paragraph
¶|pilcrow|pied-de-mouche|Absatzmarke|calderon|segno di paragrafo||paragraph legal
†|dagger|obele|Kreuz|obelisco|obelo||reference symbol
‡|double dagger|double obele|Doppelkreuz|doble obelisco|doppio obelo||reference symbol
€|euro sign|symbole euro|Eurozeichen|simbolo euro|simbolo euro||currency money
$|dollar sign|symbole dollar|Dollarzeichen|simbolo dolar|simbolo dollaro||currency money
£|pound sign|symbole livre|Pfundzeichen|simbolo libra|simbolo sterlina||currency money
¥|yen sign|symbole yen|Yen-Zeichen|simbolo yen|simbolo yen||currency money
¢|cent sign|symbole centime|Cent-Zeichen|simbolo centavo|simbolo centesimo||currency money
→|right arrow|fleche droite|Pfeil rechts|flecha derecha|freccia destra||arrow direction
←|left arrow|fleche gauche|Pfeil links|flecha izquierda|freccia sinistra||arrow direction
↑|up arrow|fleche haut|Pfeil hoch|flecha arriba|freccia su||arrow direction
↓|down arrow|fleche bas|Pfeil runter|flecha abajo|freccia giu||arrow direction
↔|left right arrow|fleche gauche droite|Pfeil links rechts|flecha izquierda derecha|freccia sinistra destra||arrow direction
⇒|double right arrow|double fleche droite|Doppelpfeil rechts|doble flecha derecha|doppia freccia destra||arrow implication
⇔|double left right arrow|double fleche gauche droite|Doppelpfeil links rechts|doble flecha izquierda derecha|doppia freccia sinistra destra||arrow equivalence
✓|check mark|coche validation|Haken|marca de verificacion|segno di spunta||check validation
✕|cross mark|croix|Kreuz|cruz|croce||cross validation
★|black star|etoile pleine|schwarzer Stern|estrella negra|stella piena||star rating
☆|white star|etoile vide|weisser Stern|estrella vacia|stella vuota||star rating
♥|heart|coeur|Herz|corazon|cuore||heart love
♦|diamond|carreau|Karo|diamante|quadri||card suit
♣|club|trefle|Kreuz|trebol|fiori||card suit
♠|spade|pique|Pik|pica|picche||card suit
°|degree|degre|Gradzeichen|grado|grado||degree temperature
±|plus minus|plus ou moins|plus minus|mas menos|piu meno||math
×|multiplication sign|multiplication|Malzeichen|multiplicacion|moltiplicazione||math
÷|division sign|division|Divisionszeichen|division|divisione||math
≈|approximately equal|environ egal|ungefaehr gleich|aproximadamente igual|circa uguale||math
≠|not equal|different de|ungleich|distinto de|diverso da||math
≤|less than or equal|inferieur ou egal|kleiner gleich|menor o igual|minore o uguale||math
≥|greater than or equal|superieur ou egal|groesser gleich|mayor o igual|maggiore o uguale||math
∞|infinity|infini|Unendlich|infinito|infinito||math
√|square root|racine carree|Quadratwurzel|raiz cuadrada|radice quadrata||math
∑|sum symbol|somme|Summe|sumatorio|sommatoria||math
∏|product symbol|produit|Produkt|productorio|produttoria||math
π|pi|pi|Pi|pi|pi||math greek
µ|micro sign|micro|Mikrozeichen|micro|micro||science unit
Ω|omega|omega|Omega|omega|omega||greek science
Δ|delta|delta|Delta|delta|delta||greek science
λ|lambda|lambda|Lambda|lambda|lambda||greek science
α|alpha|alpha|Alpha|alfa|alfa||greek science
β|beta|beta|Beta|beta|beta||greek science
γ|gamma|gamma|Gamma|gamma|gamma||greek science
@|at sign|arobase|At-Zeichen|arroba|chiocciola||internet email
#|hash sign|diese hashtag|Raute|almohadilla|cancelletto||internet hashtag
&|ampersand|esperluette|Und-Zeichen|et comercial|e commerciale||typography
‰|per mille|pour mille|Promille|por mil|per mille||number percent
′|prime|prime minutes|Prime Minuten|prima minutos|primo minuti||measurement
″|double prime|double prime secondes|Doppelprime Sekunden|doble prima segundos|doppio primo secondi||measurement
¿|inverted question mark|point interrogation inverse|umgekehrtes Fragezeichen|signo de interrogacion invertido|punto interrogativo inverso|es|spanish punctuation
¡|inverted exclamation mark|point exclamation inverse|umgekehrtes Ausrufezeichen|signo de exclamacion invertido|punto esclamativo inverso|es|spanish punctuation
ñ|n tilde|n tilde|n mit Tilde|ene|n con tilde|es|spanish lowercase
á|a acute|a accent aigu|a mit Akut|a con acento agudo|a con accento acuto|es|spanish lowercase accent
é|e acute|e accent aigu|e mit Akut|e con acento agudo|e con accento acuto|es,fr|accent lowercase
í|i acute|i accent aigu|i mit Akut|i con acento agudo|i con accento acuto|es|spanish lowercase accent
ó|o acute|o accent aigu|o mit Akut|o con acento agudo|o con accento acuto|es,it|accent lowercase
ú|u acute|u accent aigu|u mit Akut|u con acento agudo|u con accento acuto|es|spanish lowercase accent
à|a grave|a accent grave|a mit Gravis|a con acento grave|a con accento grave|fr,it|accent lowercase
è|e grave|e accent grave|e mit Gravis|e con acento grave|e con accento grave|fr,it|accent lowercase
ù|u grave|u accent grave|u mit Gravis|u con acento grave|u con accento grave|fr,it|accent lowercase
ç|c cedilla|c cedille|c mit Cedille|c cedilla|c cediglia|fr|french lowercase
œ|oe ligature|oe lie|oe Ligatur|ligadura oe|legatura oe|fr|french ligature
æ|ae ligature|ae lie|ae Ligatur|ligadura ae|legatura ae|fr|french ligature
ä|a umlaut|a trema|a Umlaut|a dieresis|a dieresi|de|german lowercase
ö|o umlaut|o trema|o Umlaut|o dieresis|o dieresi|de|german lowercase
ü|u umlaut|u trema|u Umlaut|u dieresis|u dieresi|de|german lowercase
ß|sharp s|eszett minuscule|Eszett|eszett|eszett|de|german lowercase
`.trim();

  function getSpecialCharacterLibrary(locale = "en") {
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    return SPECIAL_CHARACTER_ROWS.split(/\n+/)
      .map((row, index) => {
        const [symbol, en, fr, de, es, it, languages = "", tags = ""] = row.split("|");
        const languageList = languages ? languages.split(",").map((value) => value.trim()).filter(Boolean) : [];
        return {
          id: `special-${index}`,
          symbol,
          names: { en, fr, de, es, it },
          languages: languageList,
          tags,
          priority: index,
          search: normalizeEmojiSearch([symbol, en, fr, de, es, it, tags].join(" "))
        };
      })
      .sort((left, right) => {
        const leftLocal = left.languages.includes(lang) ? 0 : left.languages.length ? 2 : 1;
        const rightLocal = right.languages.includes(lang) ? 0 : right.languages.length ? 2 : 1;
        return leftLocal - rightLocal || left.priority - right.priority;
      });
  }

  function runTool(id, input = "", options = {}) {
    const text = String(input || "");
    const locale = options.locale || "en";
    switch (id) {
      case "textCleaner":
        return cleanText(text);
      case "typographyNormalizer":
        return normalizeTypography(text, options.locale || "fr");
      case "caseConverter":
        return convertCase(text, options.caseMode || "upper");
      case "advancedCounter":
        return countAdvanced(text, locale);
      case "longTextSplitter":
        return "";
      case "duplicateDetector":
        return detectDuplicateText(text, locale).cleanedText;
      case "promptTemplateManager":
        return buildPromptArchitect(text, locale, options);
      case "variableInjector":
        return replaceWords(text, options.replaceFind || "", options.replaceWith || "");
      case "snippetLibrary":
        return buildImagePrompt(text, locale, options);
      case "listTransformer":
        return transformList(text, options.listMode || "bullets");
      case "informationExtractor":
        return extractInformation(text, locale);
      case "localAnonymizer":
        return anonymizeLocal(text);
      case "emojiPicker":
        return "";
      case "colorPicker":
        return colorPickerReport(options.colorText || options.colorHex || text || "#e50914", locale);
      case "imageText":
        return normalizeExtractedImageText(text);
      case "universalEncoder":
        return universalEncodeDecode(text, options.encodeMode || "urlEncode", locale);
      case "jsonFormatter":
        return formatJson(text, options.jsonMode || "pretty", locale);
      case "loremGenerator":
        return lorem(Number(options.wordCount || 120));
      case "markdownToolkit":
        return markdownTool(text, options.markdownMode || "checklist", locale);
      case "textComparator":
        return compareTexts(text, options.compareText || "", locale);
      default:
        return text;
    }
  }

  function normalizeExtractedImageText(text) {
    return stripImageAltTextPrefix(String(text || ""))
      .replace(/\u00a0/g, " ")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function stripImageAltTextPrefix(text) {
    return String(text || "")
      .replace(/^\s*(?:peut\s+être|peut-être)\s+une\s+image\s+(?:de\s+texte\s+)?qui\s+dit\s*['"“”‘’«»]?\s*/i, "")
      .replace(/^\s*may\s+be\s+an?\s+image\s+(?:of\s+text\s+)?(?:that\s+says|saying)\s*['"“”‘’]?\s*/i, "")
      .replace(/^\s*puede\s+ser\s+una\s+imagen\s+(?:de\s+texto\s+)?que\s+dice\s*['"“”‘’]?\s*/i, "")
      .replace(/^\s*potrebbe\s+essere\s+un['’]?\s*immagine\s+(?:di\s+testo\s+)?che\s+dice\s*['"“”‘’]?\s*/i, "")
      .replace(/^\s*kann\s+ein\s+bild\s+(?:mit\s+text\s+)?sein,\s*das\s+sagt\s*['"“”‘’]?\s*/i, "");
  }

  const OUTPUT_LABELS = {
    en: {
      words: "Words", characters: "Characters", charsNoSpaces: "Characters without spaces", spaces: "Spaces", lines: "Lines", paragraphs: "Paragraphs", sentences: "Sentences", avgWordsPerSentence: "Average words per sentence", avgCharsPerWord: "Average characters per word", readingTime: "Estimated reading time", tokens: "Estimated AI tokens", min: "min",
      block: "Block", part: "Part", waitPrompt: "Do not answer yet. Wait until all parts have been sent.", lastPart: "This is the last part. You can now answer.",
      protocol: "Protocol", domain: "Domain", port: "Port", path: "Path", query: "Query", hash: "Hash", parameters: "Parameters", invalidUrl: "Invalid URL",
      error: "Error", jsonError: "JSON error", regexError: "Regex error", noMatch: "No match", group: "group",
      emails: "Emails", urls: "URLs", phones: "Phones", dates: "Dates", times: "Times", hashtags: "Hashtags", mentions: "Mentions", amounts: "Amounts", ips: "IPs", domains: "Domains", hexColors: "Colors"
    },
    fr: {
      words: "Mots", characters: "Caractères", charsNoSpaces: "Caractères sans espaces", spaces: "Espaces", lines: "Lignes", paragraphs: "Paragraphes", sentences: "Phrases", avgWordsPerSentence: "Mots par phrase", avgCharsPerWord: "Caractères par mot", readingTime: "Temps de lecture estimé", tokens: "Tokens IA estimés", min: "min",
      block: "Bloc", part: "Partie", waitPrompt: "Ne réponds pas encore. Attends que toutes les parties aient été envoyées.", lastPart: "Ceci est la dernière partie. Tu peux maintenant répondre.",
      protocol: "Protocole", domain: "Domaine", port: "Port", path: "Chemin", query: "Paramètres", hash: "Ancre", parameters: "Paramètres", invalidUrl: "URL invalide",
      error: "Erreur", jsonError: "Erreur JSON", regexError: "Erreur Regex", noMatch: "Aucune correspondance", group: "groupe",
      emails: "Emails", urls: "URLs", phones: "Téléphones", dates: "Dates", times: "Heures", hashtags: "Hashtags", mentions: "Mentions", amounts: "Montants", ips: "IPs", domains: "Domaines", hexColors: "Couleurs"
    },
    de: {
      words: "Wörter", characters: "Zeichen", charsNoSpaces: "Zeichen ohne Leerzeichen", spaces: "Leerzeichen", lines: "Zeilen", paragraphs: "Absätze", sentences: "Sätze", avgWordsPerSentence: "Wörter pro Satz", avgCharsPerWord: "Zeichen pro Wort", readingTime: "Geschätzte Lesezeit", tokens: "Geschätzte KI-Tokens", min: "Min.",
      block: "Block", part: "Teil", waitPrompt: "Noch nicht antworten. Warte, bis alle Teile gesendet wurden.", lastPart: "Dies ist der letzte Teil. Du kannst jetzt antworten.",
      protocol: "Protokoll", domain: "Domain", port: "Port", path: "Pfad", query: "Query", hash: "Anker", parameters: "Parameter", invalidUrl: "Ungültige URL",
      error: "Fehler", jsonError: "JSON-Fehler", regexError: "Regex-Fehler", noMatch: "Kein Treffer", group: "Gruppe",
      emails: "E-Mails", urls: "URLs", phones: "Telefone", dates: "Daten", times: "Uhrzeiten", hashtags: "Hashtags", mentions: "Erwähnungen", amounts: "Beträge", ips: "IPs", domains: "Domains", hexColors: "Farben"
    },
    es: {
      words: "Palabras", characters: "Caracteres", charsNoSpaces: "Caracteres sin espacios", spaces: "Espacios", lines: "Líneas", paragraphs: "Párrafos", sentences: "Frases", avgWordsPerSentence: "Palabras por frase", avgCharsPerWord: "Caracteres por palabra", readingTime: "Tiempo de lectura estimado", tokens: "Tokens IA estimados", min: "min",
      block: "Bloque", part: "Parte", waitPrompt: "No respondas todavía. Espera hasta recibir todas las partes.", lastPart: "Esta es la última parte. Ya puedes responder.",
      protocol: "Protocolo", domain: "Dominio", port: "Puerto", path: "Ruta", query: "Consulta", hash: "Ancla", parameters: "Parámetros", invalidUrl: "URL no válida",
      error: "Error", jsonError: "Error JSON", regexError: "Error Regex", noMatch: "Sin coincidencias", group: "grupo",
      emails: "Emails", urls: "URLs", phones: "Teléfonos", dates: "Fechas", times: "Horas", hashtags: "Hashtags", mentions: "Menciones", amounts: "Importes", ips: "IPs", domains: "Dominios", hexColors: "Colores"
    },
    it: {
      words: "Parole", characters: "Caratteri", charsNoSpaces: "Caratteri senza spazi", spaces: "Spazi", lines: "Righe", paragraphs: "Paragrafi", sentences: "Frasi", avgWordsPerSentence: "Parole per frase", avgCharsPerWord: "Caratteri per parola", readingTime: "Tempo di lettura stimato", tokens: "Token IA stimati", min: "min",
      block: "Blocco", part: "Parte", waitPrompt: "Non rispondere ancora. Attendi che tutte le parti siano state inviate.", lastPart: "Questa è l'ultima parte. Ora puoi rispondere.",
      protocol: "Protocollo", domain: "Dominio", port: "Porta", path: "Percorso", query: "Query", hash: "Ancora", parameters: "Parametri", invalidUrl: "URL non valido",
      error: "Errore", jsonError: "Errore JSON", regexError: "Errore Regex", noMatch: "Nessuna corrispondenza", group: "gruppo",
      emails: "Email", urls: "URL", phones: "Telefoni", dates: "Date", times: "Orari", hashtags: "Hashtag", mentions: "Menzioni", amounts: "Importi", ips: "IP", domains: "Domini", hexColors: "Colori"
    }
  };

  function out(locale, key) {
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    return (OUTPUT_LABELS[lang] || OUTPUT_LABELS.en)[key] || OUTPUT_LABELS.en[key] || key;
  }

  const PROMPT_ARCHITECT_LABELS = {
    en: {
      role: "Role",
      mission: "Mission",
      context: "Context",
      constraints: "Constraints",
      method: "Method",
      output: "Expected output",
      checklist: "Quality checklist",
      preset: "Expert preset",
      expertModules: "Expert modules",
      roleText: "Act as a senior expert able to reason clearly, ask for missing context when needed, and produce a directly usable answer.",
      missionText: "Transform the request below into the best possible result, with precision, structure and practical value.",
      contextIntro: "Source request",
      constraintsText: "Respect the user's language, avoid vague filler, make assumptions explicit, and prefer concrete deliverables.",
      methodText: "Analyze the intent, identify constraints, propose the strongest structure, then produce the final answer.",
      outputText: "Return a polished, ready-to-use result with clear sections and no unnecessary explanation.",
      checklistText: "Verify accuracy, completeness, formatting, tone, and whether the result can be used immediately.",
      missingInfo: "If information is missing, state the missing assumptions clearly before producing the answer.",
      separateLogic: "Separate facts, inferences, recommendations and uncertainties when relevant.",
      valueDecisions: "Build the response around the highest-value decisions, not around generic explanation.",
      ambiguityCheck: "Check for ambiguity, hidden constraints, edge cases, audience, risks and expected deliverable.",
      finalNoMeta: "Produce the final answer in the requested format without meta commentary.",
      usableCheck: "Is the answer immediately usable?",
      vagueCheck: "Is anything important missing, duplicated, vague or risky?",
      expertCheck: "Could a domain expert criticize the result? If yes, improve it before final output."
    },
    fr: {
      role: "Role",
      mission: "Mission",
      context: "Contexte",
      constraints: "Contraintes",
      method: "Methode",
      output: "Sortie attendue",
      checklist: "Checklist qualite",
      preset: "Preset expert",
      expertModules: "Modules experts",
      roleText: "Agis comme un expert senior capable de raisonner clairement, de demander le contexte manquant si necessaire, et de produire une reponse directement exploitable.",
      missionText: "Transforme la demande ci-dessous en meilleur resultat possible, avec precision, structure et valeur pratique.",
      contextIntro: "Demande source",
      constraintsText: "Respecte la langue de l'utilisateur, evite le remplissage vague, rends les hypotheses explicites et privilegie les livrables concrets.",
      methodText: "Analyse l'intention, identifie les contraintes, propose la structure la plus solide, puis produis la reponse finale.",
      outputText: "Retourne un resultat soigne, pret a utiliser, avec des sections claires et sans explication inutile.",
      checklistText: "Verifie exactitude, completude, mise en forme, ton, et capacite a utiliser le resultat immediatement.",
      missingInfo: "Si des informations manquent, indique clairement les hypotheses avant de produire la reponse.",
      separateLogic: "Separe les faits, deductions, recommandations et incertitudes quand c'est pertinent.",
      valueDecisions: "Construis la reponse autour des decisions a forte valeur, pas autour d'explications generiques.",
      ambiguityCheck: "Controle ambiguite, contraintes cachees, cas limites, audience, risques et livrable attendu.",
      finalNoMeta: "Produis la reponse finale dans le format demande, sans meta-commentaire.",
      usableCheck: "La reponse est-elle immediatement exploitable ?",
      vagueCheck: "Manque-t-il quelque chose d'important, y a-t-il du flou, des doublons ou un risque ?",
      expertCheck: "Un expert du domaine pourrait-il critiquer le resultat ? Si oui, ameliore-le avant la sortie finale."
    },
    de: {
      role: "Rolle",
      mission: "Mission",
      context: "Kontext",
      constraints: "Einschraenkungen",
      method: "Methode",
      output: "Erwartete Ausgabe",
      checklist: "Qualitaetscheck",
      preset: "Experten-Preset",
      expertModules: "Expertenmodule",
      roleText: "Handle als Senior-Experte, der klar denkt, fehlenden Kontext bei Bedarf erfragt und eine direkt nutzbare Antwort liefert.",
      missionText: "Wandle die folgende Anfrage in das bestmoegliche Ergebnis um, praezise, strukturiert und praktisch.",
      contextIntro: "Ausgangsanfrage",
      constraintsText: "Respektiere die Sprache des Nutzers, vermeide Fuelltext, mache Annahmen sichtbar und liefere konkrete Ergebnisse.",
      methodText: "Analysiere die Absicht, erkenne Einschraenkungen, waehle die staerkste Struktur und erstelle dann die finale Antwort.",
      outputText: "Gib ein ausgearbeitetes, sofort nutzbares Ergebnis mit klaren Abschnitten zurueck.",
      checklistText: "Pruefe Genauigkeit, Vollstaendigkeit, Formatierung, Ton und direkte Nutzbarkeit.",
      missingInfo: "Wenn Informationen fehlen, nenne die Annahmen klar, bevor du antwortest.",
      separateLogic: "Trenne Fakten, Schlussfolgerungen, Empfehlungen und Unsicherheiten, wenn relevant.",
      valueDecisions: "Strukturiere die Antwort um Entscheidungen mit hohem Wert, nicht um generische Erklaerung.",
      ambiguityCheck: "Pruefe Mehrdeutigkeit, versteckte Grenzen, Sonderfaelle, Zielgruppe, Risiken und Ergebnis.",
      finalNoMeta: "Erstelle die finale Antwort im gewuenschten Format ohne Meta-Kommentar.",
      usableCheck: "Ist die Antwort sofort nutzbar?",
      vagueCheck: "Fehlt etwas Wichtiges, ist etwas doppelt, vage oder riskant?",
      expertCheck: "Koennte ein Fachexperte das Ergebnis kritisieren? Wenn ja, verbessere es vor der Ausgabe."
    },
    es: {
      role: "Rol",
      mission: "Mision",
      context: "Contexto",
      constraints: "Restricciones",
      method: "Metodo",
      output: "Salida esperada",
      checklist: "Checklist de calidad",
      preset: "Preset experto",
      expertModules: "Modulos expertos",
      roleText: "Actua como un experto senior capaz de razonar con claridad, pedir contexto si falta y producir una respuesta directamente utilizable.",
      missionText: "Transforma la solicitud de abajo en el mejor resultado posible, con precision, estructura y valor practico.",
      contextIntro: "Solicitud fuente",
      constraintsText: "Respeta el idioma del usuario, evita relleno vago, explicita las suposiciones y prioriza entregables concretos.",
      methodText: "Analiza la intencion, identifica restricciones, propone la estructura mas solida y produce la respuesta final.",
      outputText: "Devuelve un resultado pulido, listo para usar, con secciones claras y sin explicacion innecesaria.",
      checklistText: "Verifica exactitud, completitud, formato, tono y utilidad inmediata.",
      missingInfo: "Si falta informacion, indica claramente las suposiciones antes de responder.",
      separateLogic: "Separa hechos, inferencias, recomendaciones e incertidumbres cuando sea relevante.",
      valueDecisions: "Construye la respuesta alrededor de decisiones de alto valor, no de explicacion generica.",
      ambiguityCheck: "Revisa ambiguedad, restricciones ocultas, casos limite, audiencia, riesgos y entregable esperado.",
      finalNoMeta: "Produce la respuesta final en el formato solicitado sin metacomentarios.",
      usableCheck: "La respuesta se puede usar inmediatamente?",
      vagueCheck: "Falta algo importante, hay duplicados, vaguedad o riesgo?",
      expertCheck: "Un experto del dominio podria criticar el resultado? Si es asi, mejoralo antes de la salida final."
    },
    it: {
      role: "Ruolo",
      mission: "Missione",
      context: "Contesto",
      constraints: "Vincoli",
      method: "Metodo",
      output: "Output atteso",
      checklist: "Checklist qualita",
      preset: "Preset esperto",
      expertModules: "Moduli esperti",
      roleText: "Agisci come un esperto senior capace di ragionare chiaramente, chiedere contesto se manca e produrre una risposta subito utilizzabile.",
      missionText: "Trasforma la richiesta qui sotto nel miglior risultato possibile, con precisione, struttura e valore pratico.",
      contextIntro: "Richiesta sorgente",
      constraintsText: "Rispetta la lingua dell'utente, evita riempitivi vaghi, rendi esplicite le ipotesi e privilegia risultati concreti.",
      methodText: "Analizza l'intento, identifica i vincoli, proponi la struttura piu solida e produci la risposta finale.",
      outputText: "Restituisci un risultato curato, pronto all'uso, con sezioni chiare e senza spiegazioni inutili.",
      checklistText: "Verifica accuratezza, completezza, formattazione, tono e utilita immediata.",
      missingInfo: "Se mancano informazioni, indica chiaramente le ipotesi prima di rispondere.",
      separateLogic: "Separa fatti, inferenze, raccomandazioni e incertezze quando serve.",
      valueDecisions: "Costruisci la risposta attorno alle decisioni di maggior valore, non a spiegazioni generiche.",
      ambiguityCheck: "Controlla ambiguita, vincoli nascosti, casi limite, pubblico, rischi e risultato atteso.",
      finalNoMeta: "Produci la risposta finale nel formato richiesto senza meta-commenti.",
      usableCheck: "La risposta e subito utilizzabile?",
      vagueCheck: "Manca qualcosa di importante, c'e duplicazione, vaghezza o rischio?",
      expertCheck: "Un esperto del dominio potrebbe criticare il risultato? Se si, miglioralo prima dell'output finale."
    }
  };

  function promptLabels(locale) {
    return PROMPT_ARCHITECT_LABELS[String(locale || "en").slice(0, 2).toLowerCase()] || PROMPT_ARCHITECT_LABELS.en;
  }

  function inspectTool(id, input = "", output = "", options = {}, t = (key) => key) {
    const text = String(input || "");
    const result = String(output || "");
    const label = (key, fallback) => {
      const translated = t(`tools.insight.${key}`);
      return translated && translated !== `tools.insight.${key}` ? translated : fallback;
    };
    const metrics = baseMetrics(text);
    const resultMetrics = baseMetrics(result);
    const insight = {
      layout: toolLayout(id),
      cards: [],
      chips: [],
      sections: [],
      highlights: [],
      status: []
    };

    const addCard = (name, value, tone = "") => insight.cards.push({ name, value: String(value), tone });
    const addChip = (textValue, tone = "") => {
      if (textValue) insight.chips.push({ text: String(textValue), tone });
    };
    const addSection = (title, lines, tone = "") => {
      const values = Array.isArray(lines) ? lines.filter(Boolean) : [];
      if (values.length) insight.sections.push({ title, lines: values.slice(0, 60), tone });
    };

    if (id === "textCleaner") {
      addCard(label("before", "Before"), metrics.chars);
      addCard(label("after", "After"), resultMetrics.chars);
      addCard(label("removed", "Removed"), Math.max(0, metrics.chars - resultMetrics.chars), "accent");
      addChip(label("cleanWhitespace", "Whitespace cleaned"), "accent");
      addChip(label("invisibleChars", "Invisible characters removed"));
    } else if (id === "typographyNormalizer") {
      addCard(label("characters", "Characters"), resultMetrics.chars);
      addCard(label("paragraphs", "Paragraphs"), resultMetrics.paragraphs);
      addChip(label("quotes", "Quotes"));
      addChip(label("punctuation", "Punctuation"));
      addChip(label("dashes", "Dashes"));
    } else if (id === "caseConverter") {
      addCard(label("words", "Words"), resultMetrics.words);
      addCard(label("characters", "Characters"), resultMetrics.chars);
      addChip(options.caseMode || "upper", "accent");
    } else if (id === "advancedCounter") {
      Object.entries(metrics).filter(([key]) => key !== "chars").forEach(([key, value]) => addCard(label(key, key), value, key === "tokens" ? "accent" : ""));
    } else if (id === "longTextSplitter") {
      addCard(label("characters", "Characters"), getSpecialCharacterLibrary(options.locale || "en").length, "accent");
      addChip(label("local", "Local"), "accent");
    } else if (id === "duplicateDetector") {
      const report = detectDuplicateText(text, options.locale || "en");
      addCard(label("duplicates", "Duplicates"), report.duplicateCount, report.duplicateCount ? "danger" : "");
      addCard(label("duplicateGroups", "Duplicate groups"), report.groupCount, report.groupCount ? "accent" : "");
      addCard(label("kept", "Kept"), report.keptCount, "accent");
      addCard(label("removed", "Removed"), report.removedCount, report.removedCount ? "danger" : "");
    } else if (id === "promptTemplateManager") {
      addCard(label("characters", "Characters"), resultMetrics.chars);
      addCard(label("paragraphs", "Paragraphs"), resultMetrics.paragraphs);
      addCard(label("tokens", "AI tokens"), resultMetrics.tokens, "accent");
      addChip("Prompt", "accent");
      addChip(label("instantStats", "Instant statistics"));
    } else if (id === "variableInjector") {
      const matchCount = countWordReplacerMatches(text, options.replaceFind || "");
      addCard(label("matches", "Matches"), matchCount, matchCount ? "accent" : "");
      addCard(label("replaced", "Replaced"), matchCount, matchCount ? "accent" : "");
      addCard(label("characters", "Characters"), resultMetrics.chars);
    } else if (id === "snippetLibrary") {
      addCard(label("characters", "Characters"), resultMetrics.chars);
      addCard(label("words", "Words"), resultMetrics.words, "accent");
      addCard(label("tokens", "AI tokens"), resultMetrics.tokens, "accent");
      addChip(label("imagePrompt", "Image prompt"), "accent");
      addChip(options.imagePromptEngine || "midjourney");
      addChip(options.imagePromptAspect || "16:9");
    } else if (id === "listTransformer") {
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      const outputLines = result.split(/\r?\n/).filter((line) => line.trim());
      addCard(label("before", "Before"), lines.length);
      addCard(label("after", "After"), outputLines.length, "accent");
      addChip(options.listMode || "bullets", "accent");
    } else if (id === "informationExtractor") {
      const groups = extractInformationGroups(text);
      Object.entries(groups).forEach(([name, values]) => addCard(name, values.length, values.length ? "accent" : ""));
      Object.entries(groups).forEach(([name, values]) => addSection(name, values));
    } else if (id === "localAnonymizer") {
      const groups = extractInformationGroups(text);
      addCard(label("replaced", "Replaced"), Object.values(groups).reduce((sum, values) => sum + values.length, 0), "accent");
      addCard(label("characters", "Characters"), resultMetrics.chars);
      Object.entries(groups).filter(([, values]) => values.length).forEach(([name]) => addChip(name));
    } else if (id === "emojiPicker") {
      addCard(label("emojis", "Emojis"), getEmojiLibrary().length, "accent");
    } else if (id === "colorPicker") {
      const color = parseColorSafe(options.colorText || options.colorHex || text || "#e50914");
      if (color) {
        const formats = colorFormats(color, options.locale || "en");
        addCard(colorLabel(options.locale, "hex"), formats.hex, "accent");
        addCard(colorLabel(options.locale, "rgb"), formats.rgb);
        addCard(colorLabel(options.locale, "hsl"), formats.hsl);
        addCard(colorLabel(options.locale, "contrast"), formats.contrast, "accent");
        addSection(colorLabel(options.locale, "palette"), buildColorPalette(color).map((hex) => `${hex}  ${colorFormats(parseColorSafe(hex), options.locale).rgb}`));
      }
    } else if (id === "universalEncoder") {
      addCard(label("before", "Before"), metrics.chars);
      addCard(label("after", "After"), resultMetrics.chars, "accent");
      addChip(options.encodeMode || "urlEncode", "accent");
    } else if (id === "jsonFormatter") {
      const parsed = parseJsonSafe(text);
      addCard(label("status", "Status"), parsed.ok ? label("valid", "Valid") : label("invalid", "Invalid"), parsed.ok ? "accent" : "danger");
      if (parsed.ok) {
        addCard(label("keys", "Keys"), countJsonKeys(parsed.value), "accent");
        addCard(label("depth", "Depth"), jsonDepth(parsed.value));
      } else addSection(label("error", "Error"), [parsed.error]);
    } else if (id === "loremGenerator") {
      addCard(label("words", "Words"), resultMetrics.words, "accent");
      addCard(label("characters", "Characters"), resultMetrics.chars);
      addChip(label("generated", "Generated"));
    } else if (id === "markdownToolkit") {
      addCard(label("headings", "Headings"), (text.match(/^#{1,6}\s+/gm) || []).length, "accent");
      addCard(label("lines", "Lines"), metrics.lines);
      addCard(label("links", "Links"), (text.match(/\[[^\]]+\]\([^)]+\)/g) || []).length);
      addCard(label("codeBlocks", "Code blocks"), (text.match(/```[\s\S]*?```/g) || []).length);
      addChip(options.markdownMode || "checklist", "accent");
      addSection(label("actions", "Actions"), [
        "Checklist smart conversion",
        "Markdown to structured HTML",
        "Code fence with language detection",
        "Heading normalization + TOC"
      ]);
    } else if (id === "textComparator") {
      const diff = diffLines(text, options.compareText || "");
      addCard(label("added", "Added"), diff.filter((line) => line.type === "added").length, "accent");
      addCard(label("removed", "Removed"), diff.filter((line) => line.type === "removed").length, "danger");
      addCard(label("changed", "Changed lines"), countChangedLinePairs(diff), "accent");
      addCard(label("same", "Unchanged lines"), diff.filter((line) => line.type === "same").length);
    } else if (id === "imageText") {
      addCard(label("characters", "Characters"), resultMetrics.chars, resultMetrics.chars ? "accent" : "");
      addCard(label("words", "Words"), resultMetrics.words, resultMetrics.words ? "accent" : "");
      addCard(label("lines", "Lines"), resultMetrics.lines);
      addCard(label("local", "Local"), "OCR", "accent");
    }
    if (!insight.cards.length) {
      addCard(label("words", "Words"), metrics.words);
      addCard(label("characters", "Characters"), metrics.chars);
      addCard(label("lines", "Lines"), metrics.lines);
    }
    return insight;
  }

  function baseMetrics(text) {
    const value = String(text || "");
    const trimmed = value.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = value.length;
    const lines = value ? value.split(/\r?\n/).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed]).length : 0;
    const charsNoSpaces = value.replace(/\s/g, "").length;
    const spaces = (value.match(/[ \t\u00a0]/g) || []).length;
    return {
      words,
      characters: chars,
      chars,
      charsNoSpaces,
      spaces,
      lines,
      paragraphs,
      sentences,
      avgWordsPerSentence: sentences ? Math.round(words / sentences) : 0,
      avgCharsPerWord: words ? Math.round(charsNoSpaces / words) : 0,
      readingMinutes: Math.max(1, Math.ceil(words / 220)),
      tokens: Math.ceil(chars / 4)
    };
  }

  function countWordsTool(text, locale) {
    const metrics = baseMetrics(text);
    return [
      `${out(locale, "words")}: ${metrics.words}`,
      `${out(locale, "characters")}: ${metrics.chars}`,
      `${out(locale, "charsNoSpaces")}: ${metrics.charsNoSpaces}`,
      `${out(locale, "spaces")}: ${metrics.spaces}`,
      `${out(locale, "lines")}: ${metrics.lines}`,
      `${out(locale, "paragraphs")}: ${metrics.paragraphs}`,
      `${out(locale, "sentences")}: ${metrics.sentences}`,
      `${out(locale, "tokens")}: ${metrics.tokens}`
    ].join("\n");
  }

  function buildImagePrompt(text, locale = "en", options = {}) {
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    const labels = imagePromptLabels(lang);
    const pick = (name, fallback = "none") => String(options[name] || fallback);
    const value = (group, key) => imagePromptValue(lang, group, key);
    const subject = String(text || "").trim() || labels.subjectFallback;
    const engine = pick("imagePromptEngine", "midjourney");
    const aspect = pick("imagePromptAspect", "16:9");
    const version = pick("imagePromptVersion", "v7");
    const quality = pick("imagePromptQuality", "high");
    const stylize = pick("imagePromptStylize", "balanced");
    const negatives = [
      value("negative", pick("imagePromptNegative", "standard")),
      labels.negativeBase
    ].filter(Boolean).join(", ");
    const core = [
      subject,
      value("subject", pick("imagePromptSubject", "premiumScene")),
      value("style", pick("imagePromptStyle", "cinematic")),
      value("composition", pick("imagePromptComposition", "ruleOfThirds")),
      value("shot", pick("imagePromptShot", "mediumWide")),
      value("lens", pick("imagePromptLens", "cinemaLens")),
      value("lighting", pick("imagePromptLighting", "softCinematic")),
      value("mood", pick("imagePromptMood", "premium")),
      value("color", pick("imagePromptColor", "richContrast")),
      value("detail", pick("imagePromptDetail", "ultraDetailed")),
      value("quality", quality)
    ].filter(Boolean);
    const prompt = core.join(", ");
    const params = imagePromptParams(engine, aspect, version, quality, stylize, negatives, labels);
    return [
      `${labels.finalPrompt}`,
      `${prompt}${params ? ` ${params}` : ""}`,
      "",
      `${labels.negativePrompt}`,
      negatives || "-",
      "",
      `${labels.usage}`,
      `- ${labels.engine}: ${value("engine", engine)}`,
      `- ${labels.aspect}: ${aspect}`,
      `- ${labels.tip}`
    ].join("\n");
  }

  function imagePromptLabels(locale) {
    const maps = {
      en: {
        finalPrompt: "Final image prompt",
        negativePrompt: "Negative prompt",
        usage: "Settings",
        engine: "Engine",
        aspect: "Aspect ratio",
        subjectFallback: "A premium, highly detailed visual concept",
        negativeBase: "no low quality, no blur, no artifacts, no deformed anatomy, no unreadable text, no watermark",
        tip: "Adjust the first sentence manually, then regenerate variants by changing style, lens, light and aspect ratio."
      },
      fr: {
        finalPrompt: "Prompt image final",
        negativePrompt: "Prompt negatif",
        usage: "Reglages",
        engine: "Moteur",
        aspect: "Format",
        subjectFallback: "Un concept visuel premium, tres detaille",
        negativeBase: "pas de basse qualite, pas de flou, pas d'artefacts, pas d'anatomie deformee, pas de texte illisible, pas de watermark",
        tip: "Ajuste la premiere phrase a la main, puis genere des variantes en changeant style, optique, lumiere et format."
      },
      de: {
        finalPrompt: "Finaler Bild-Prompt",
        negativePrompt: "Negativer Prompt",
        usage: "Einstellungen",
        engine: "Engine",
        aspect: "Seitenverhaeltnis",
        subjectFallback: "Ein hochwertiges, sehr detailliertes visuelles Konzept",
        negativeBase: "keine niedrige Qualitaet, keine Unschaerfe, keine Artefakte, keine deformierte Anatomie, kein unlesbarer Text, kein Wasserzeichen",
        tip: "Passe den ersten Satz manuell an und erstelle Varianten ueber Stil, Objektiv, Licht und Format."
      },
      es: {
        finalPrompt: "Prompt de imagen final",
        negativePrompt: "Prompt negativo",
        usage: "Ajustes",
        engine: "Motor",
        aspect: "Formato",
        subjectFallback: "Un concepto visual premium muy detallado",
        negativeBase: "sin baja calidad, sin desenfoque, sin artefactos, sin anatomia deformada, sin texto ilegible, sin marca de agua",
        tip: "Ajusta la primera frase a mano y crea variantes cambiando estilo, lente, luz y formato."
      },
      it: {
        finalPrompt: "Prompt immagine finale",
        negativePrompt: "Prompt negativo",
        usage: "Impostazioni",
        engine: "Motore",
        aspect: "Formato",
        subjectFallback: "Un concept visivo premium molto dettagliato",
        negativeBase: "no bassa qualita, no sfocatura, no artefatti, no anatomia deformata, no testo illeggibile, no watermark",
        tip: "Regola manualmente la prima frase, poi crea varianti cambiando stile, lente, luce e formato."
      }
    };
    return maps[locale] || maps.en;
  }

  function imagePromptValue(locale, group, key) {
    const base = {
      engine: {
        midjourney: "Midjourney", stableDiffusion: "Stable Diffusion / SDXL", dalle: "DALL-E", firefly: "Adobe Firefly", leonardo: "Leonardo AI"
      },
      subject: {
        premiumScene: "premium editorial scene", productHero: "hero product shot", characterPortrait: "expressive character portrait", architecture: "high-end architectural visual", fashion: "luxury fashion campaign", food: "premium food photography", tech: "futuristic technology visual", nature: "epic natural landscape", abstract: "abstract visual metaphor", uiMockup: "polished digital interface mockup"
      },
      style: {
        cinematic: "cinematic, film still, high production value", photoreal: "photorealistic, natural texture, realistic depth", editorial: "editorial magazine style, refined art direction", luxury: "luxury advertising, minimal and expensive", documentary: "documentary realism, authentic atmosphere", anime: "premium anime style, clean linework", conceptArt: "AAA concept art, dramatic visual development", surreal: "surreal dreamlike composition", isometric: "clean isometric illustration", watercolor: "delicate watercolor illustration", vector: "modern vector illustration", clay: "soft 3D clay render"
      },
      composition: {
        ruleOfThirds: "rule of thirds, balanced negative space", centered: "centered composition, strong symmetry", closeCrop: "tight crop, intimate framing", wideEpic: "wide epic composition, cinematic scale", diagonal: "dynamic diagonal composition", layeredDepth: "foreground midground background depth", minimal: "minimal composition, precise spacing", poster: "poster composition, bold hierarchy", grid: "clean grid layout", leadingLines: "strong leading lines"
      },
      shot: {
        macro: "macro shot", closeUp: "close-up shot", portrait: "portrait shot", mediumWide: "medium wide shot", wideAngle: "wide-angle shot", aerial: "aerial view", lowAngle: "low angle view", topDown: "top-down view", overShoulder: "over-the-shoulder view", panoramic: "panoramic frame"
      },
      lens: {
        cinemaLens: "shot on cinema lens, 35mm, shallow depth of field", telephoto: "telephoto compression, 85mm lens", wideLens: "24mm wide lens, immersive perspective", macroLens: "100mm macro lens, crisp micro details", anamorphic: "anamorphic lens, subtle cinematic distortion", tiltShift: "tilt-shift lens, miniature depth feel", cleanDigital: "clean digital render, sharp edges"
      },
      lighting: {
        softCinematic: "soft cinematic lighting", goldenHour: "golden hour light", neon: "neon light, colored reflections", studio: "professional studio lighting", rimLight: "dramatic rim light", chiaroscuro: "chiaroscuro contrast", overcast: "soft overcast natural light", volumetric: "volumetric light beams", backlit: "elegant backlight", highKey: "high-key lighting"
      },
      mood: {
        premium: "premium, refined, confident mood", calm: "calm, serene, elegant mood", dramatic: "dramatic, intense, high-stakes mood", futuristic: "futuristic, innovative, aspirational mood", warm: "warm, human, reassuring mood", mysterious: "mysterious, cinematic, immersive mood", playful: "playful, colorful, energetic mood", dark: "dark, moody, sophisticated mood"
      },
      color: {
        richContrast: "rich contrast, controlled color grading", monochrome: "monochrome palette, strong tonal range", pastel: "soft pastel palette", vibrant: "vibrant colors, high saturation", muted: "muted elegant palette", tealOrange: "cinematic teal and orange grade", blackGold: "black and gold luxury palette", natural: "natural color science", cyberpunk: "cyberpunk magenta cyan palette"
      },
      detail: {
        clean: "clean details, uncluttered", detailed: "highly detailed, precise texture", ultraDetailed: "ultra detailed, intricate micro texture", hyperreal: "hyperreal detail, tactile surfaces", minimalDetail: "minimal detail, strong silhouette", ornate: "ornate details, rich materiality"
      },
      quality: {
        draft: "clear composition, usable draft quality", high: "high quality, sharp focus, professional finish", ultra: "ultra high quality, award-winning finish", commercial: "commercial campaign quality, premium retouching"
      },
      negative: {
        standard: "bad hands, extra fingers, distorted face, oversaturated, noisy, cropped subject", product: "warped logo, unreadable label, wrong reflections, plastic texture", portrait: "asymmetrical eyes, bad skin texture, uncanny face, extra limbs", text: "misspelled words, unreadable typography, random letters", none: ""
      }
    };
    const localized = {
      fr: {
        subject: { premiumScene: "scene editoriale premium", productHero: "photo hero produit", characterPortrait: "portrait de personnage expressif", architecture: "visuel architectural haut de gamme", fashion: "campagne mode luxe", food: "photographie culinaire premium", tech: "visuel technologique futuriste", nature: "paysage naturel epique", abstract: "metaphore visuelle abstraite", uiMockup: "mockup d'interface digitale soigne" },
        style: { cinematic: "cinematique, film still, forte valeur de production", photoreal: "photorealiste, textures naturelles, profondeur realiste", editorial: "style magazine editorial, direction artistique soignee", luxury: "publicite luxe, minimaliste et haut de gamme", documentary: "realisme documentaire, atmosphere authentique", anime: "anime premium, linework propre", conceptArt: "concept art AAA, developpement visuel dramatique", surreal: "composition surrealiste et onirique", isometric: "illustration isometrique propre", watercolor: "illustration aquarelle delicate", vector: "illustration vectorielle moderne", clay: "rendu 3D clay doux" },
        composition: { ruleOfThirds: "regle des tiers, espace negatif equilibre", centered: "composition centree, symetrie forte", closeCrop: "cadrage serre, framing intime", wideEpic: "composition large epique, echelle cinematographique", diagonal: "composition diagonale dynamique", layeredDepth: "profondeur premier plan, milieu, arriere-plan", minimal: "composition minimale, espacements precis", poster: "composition affiche, hierarchie forte", grid: "mise en page grille propre", leadingLines: "lignes directrices fortes" },
        shot: { macro: "plan macro", closeUp: "gros plan", portrait: "plan portrait", mediumWide: "plan moyen large", wideAngle: "grand angle", aerial: "vue aerienne", lowAngle: "contre-plongee", topDown: "vue du dessus", overShoulder: "vue par-dessus l'epaule", panoramic: "cadre panoramique" },
        lens: { cinemaLens: "objectif cinema 35mm, faible profondeur de champ", telephoto: "compression teleobjectif, objectif 85mm", wideLens: "objectif grand angle 24mm, perspective immersive", macroLens: "objectif macro 100mm, micro-details nets", anamorphic: "objectif anamorphique, distortion cinematographique subtile", tiltShift: "objectif tilt-shift, profondeur miniature", cleanDigital: "rendu digital propre, bords nets" },
        lighting: { softCinematic: "lumiere cinematographique douce", goldenHour: "lumiere golden hour", neon: "lumiere neon, reflets colores", studio: "eclairage studio professionnel", rimLight: "rim light dramatique", chiaroscuro: "contraste clair-obscur", overcast: "lumiere naturelle ciel couvert", volumetric: "rayons de lumiere volumetriques", backlit: "contre-jour elegant", highKey: "eclairage high-key" },
        mood: { premium: "ambiance premium, raffinee et assuree", calm: "ambiance calme, sereine et elegante", dramatic: "ambiance dramatique, intense et a fort enjeu", futuristic: "ambiance futuriste, innovante et aspirationnelle", warm: "ambiance chaleureuse, humaine et rassurante", mysterious: "ambiance mysterieuse, cinematographique et immersive", playful: "ambiance ludique, coloree et energique", dark: "ambiance sombre, moody et sophistiquee" },
        color: { richContrast: "contraste riche, color grading maitrise", monochrome: "palette monochrome, forte gamme tonale", pastel: "palette pastel douce", vibrant: "couleurs vibrantes, saturation elevee", muted: "palette muted elegante", tealOrange: "color grade cinematographique teal and orange", blackGold: "palette luxe noir et or", natural: "science couleur naturelle", cyberpunk: "palette cyberpunk magenta cyan" },
        detail: { clean: "details propres, sans surcharge", detailed: "tres detaille, texture precise", ultraDetailed: "ultra detaille, micro-textures complexes", hyperreal: "detail hyperrealiste, surfaces tactiles", minimalDetail: "details minimaux, silhouette forte", ornate: "details ornementaux, matieres riches" },
        quality: { draft: "composition claire, qualite brouillon exploitable", high: "haute qualite, focus net, finition professionnelle", ultra: "ultra haute qualite, finition award-winning", commercial: "qualite campagne commerciale, retouche premium" },
        negative: { standard: "mauvaises mains, doigts supplementaires, visage deforme, sursaturation, bruit, sujet coupe", product: "logo deforme, etiquette illisible, reflets faux, texture plastique", portrait: "yeux asymetriques, mauvaise texture de peau, visage uncanny, membres supplementaires", text: "mots mal orthographies, typographie illisible, lettres aleatoires", none: "" }
      },
      de: {
        subject: { premiumScene: "hochwertige Editorial-Szene", productHero: "Hero-Produktfotografie", characterPortrait: "ausdrucksstarkes Charakterportraet", architecture: "hochwertige Architekturvisualisierung", fashion: "Luxusmode-Kampagne", food: "Premium-Food-Fotografie", tech: "futuristische Technologievisualisierung", nature: "epische Naturlandschaft", abstract: "abstrakte visuelle Metapher", uiMockup: "poliertes digitales Interface-Mockup" },
        style: { cinematic: "cinematisch, Filmstill, hoher Produktionswert", photoreal: "fotorealistisch, natuerliche Texturen, realistische Tiefe", editorial: "Editorial-Magazin-Stil, verfeinerte Art Direction", luxury: "Luxuswerbung, minimal und teuer", documentary: "dokumentarischer Realismus, authentische Atmosphaere", anime: "Premium-Anime-Stil, sauberes Linework", conceptArt: "AAA Concept Art, dramatische visuelle Entwicklung", surreal: "surreale traumartige Komposition", isometric: "saubere isometrische Illustration", watercolor: "zarte Aquarellillustration", vector: "moderne Vektorillustration", clay: "weiches 3D-Clay-Rendering" },
        composition: { ruleOfThirds: "Drittelregel, ausgewogener Negativraum", centered: "zentrierte Komposition, starke Symmetrie", closeCrop: "enger Crop, intimes Framing", wideEpic: "weite epische Komposition, cineastischer Massstab", diagonal: "dynamische diagonale Komposition", layeredDepth: "Vordergrund, Mittelgrund, Hintergrund-Tiefe", minimal: "minimale Komposition, praezise Abstaende", poster: "Poster-Komposition, starke Hierarchie", grid: "sauberes Rasterlayout", leadingLines: "starke Fuehrungslinien" },
        shot: { macro: "Makroaufnahme", closeUp: "Nahaufnahme", portrait: "Portraetaufnahme", mediumWide: "mittlere Weitaufnahme", wideAngle: "Weitwinkelaufnahme", aerial: "Luftaufnahme", lowAngle: "Untersicht", topDown: "Draufsicht", overShoulder: "Over-the-shoulder-Ansicht", panoramic: "Panoramaformat" },
        lens: { cinemaLens: "Cinema-Objektiv 35mm, geringe Tiefenschaerfe", telephoto: "Telekompression, 85mm Objektiv", wideLens: "24mm Weitwinkel, immersive Perspektive", macroLens: "100mm Makroobjektiv, scharfe Mikrodetails", anamorphic: "anamorphes Objektiv, subtile cineastische Verzerrung", tiltShift: "Tilt-shift Objektiv, Miniatur-Tiefenwirkung", cleanDigital: "sauberes digitales Rendering, scharfe Kanten" },
        lighting: { softCinematic: "weiches cineastisches Licht", goldenHour: "Golden-Hour-Licht", neon: "Neonlicht, farbige Reflexionen", studio: "professionelles Studiolicht", rimLight: "dramatisches Rim Light", chiaroscuro: "Chiaroscuro-Kontrast", overcast: "weiches natuerliches Licht bei Bewoelkung", volumetric: "volumetrische Lichtstrahlen", backlit: "elegantes Gegenlicht", highKey: "High-key-Beleuchtung" },
        mood: { premium: "hochwertige, raffinierte, selbstbewusste Stimmung", calm: "ruhige, gelassene, elegante Stimmung", dramatic: "dramatische, intensive Stimmung mit hohem Einsatz", futuristic: "futuristische, innovative, aspirationale Stimmung", warm: "warme, menschliche, beruhigende Stimmung", mysterious: "mysterioese, cineastische, immersive Stimmung", playful: "spielerische, farbenfrohe, energiegeladene Stimmung", dark: "dunkle, moody, anspruchsvolle Stimmung" },
        color: { richContrast: "reicher Kontrast, kontrolliertes Color Grading", monochrome: "monochrome Palette, starker Tonwertumfang", pastel: "weiche Pastellpalette", vibrant: "vibrante Farben, hohe Saettigung", muted: "gedeckte elegante Palette", tealOrange: "cineastisches Teal-and-Orange-Grading", blackGold: "Luxuspalette Schwarz und Gold", natural: "natuerliche Farbwissenschaft", cyberpunk: "Cyberpunk-Palette Magenta Cyan" },
        detail: { clean: "saubere Details, aufgeraeumt", detailed: "hochdetailliert, praezise Textur", ultraDetailed: "ultra detailliert, komplexe Mikrotexturen", hyperreal: "hyperrealistische Details, taktile Oberflaechen", minimalDetail: "minimale Details, starke Silhouette", ornate: "ornamentale Details, reiche Materialitaet" },
        quality: { draft: "klare Komposition, brauchbare Entwurfsqualitaet", high: "hohe Qualitaet, scharfer Fokus, professionelles Finish", ultra: "ultrahohe Qualitaet, preiswuerdiges Finish", commercial: "Qualitaet einer Werbekampagne, Premium-Retusche" },
        negative: { standard: "schlechte Haende, zusaetzliche Finger, verzerrtes Gesicht, Uebersaettigung, Rauschen, abgeschnittenes Motiv", product: "verzerrtes Logo, unlesbares Etikett, falsche Reflexionen, Plastiktextur", portrait: "asymmetrische Augen, schlechte Hauttextur, uncanny Gesicht, zusaetzliche Gliedmassen", text: "falsch geschriebene Woerter, unlesbare Typografie, zufaellige Buchstaben", none: "" }
      },
      es: {
        subject: { premiumScene: "escena editorial premium", productHero: "foto hero de producto", characterPortrait: "retrato expresivo de personaje", architecture: "visual arquitectonico de alta gama", fashion: "campana de moda de lujo", food: "fotografia gastronomica premium", tech: "visual tecnologico futurista", nature: "paisaje natural epico", abstract: "metafora visual abstracta", uiMockup: "mockup de interfaz digital pulido" },
        style: { cinematic: "cinematico, fotograma de pelicula, alto valor de produccion", photoreal: "fotorrealista, textura natural, profundidad realista", editorial: "estilo revista editorial, direccion artistica refinada", luxury: "publicidad de lujo, minimalista y exclusiva", documentary: "realismo documental, atmosfera autentica", anime: "anime premium, linework limpio", conceptArt: "concept art AAA, desarrollo visual dramatico", surreal: "composicion surrealista y onirica", isometric: "ilustracion isometrica limpia", watercolor: "ilustracion acuarela delicada", vector: "ilustracion vectorial moderna", clay: "render 3D clay suave" },
        composition: { ruleOfThirds: "regla de tercios, espacio negativo equilibrado", centered: "composicion centrada, simetria fuerte", closeCrop: "recorte cerrado, encuadre intimo", wideEpic: "composicion amplia epica, escala cinematica", diagonal: "composicion diagonal dinamica", layeredDepth: "profundidad primer plano, medio y fondo", minimal: "composicion minimal, espaciado preciso", poster: "composicion de poster, jerarquia fuerte", grid: "layout de cuadricula limpio", leadingLines: "lineas guia fuertes" },
        shot: { macro: "plano macro", closeUp: "primer plano", portrait: "plano retrato", mediumWide: "plano medio amplio", wideAngle: "plano gran angular", aerial: "vista aerea", lowAngle: "vista en contrapicado", topDown: "vista cenital", overShoulder: "vista sobre el hombro", panoramic: "encuadre panoramico" },
        lens: { cinemaLens: "lente de cine 35mm, poca profundidad de campo", telephoto: "compresion teleobjetivo, lente 85mm", wideLens: "gran angular 24mm, perspectiva inmersiva", macroLens: "lente macro 100mm, microdetalles nitidos", anamorphic: "lente anamorfica, distorsion cinematica sutil", tiltShift: "lente tilt-shift, sensacion miniatura", cleanDigital: "render digital limpio, bordes nitidos" },
        lighting: { softCinematic: "iluminacion cinematica suave", goldenHour: "luz de golden hour", neon: "luz neon, reflejos coloreados", studio: "iluminacion profesional de estudio", rimLight: "rim light dramatico", chiaroscuro: "contraste claroscuro", overcast: "luz natural suave nublada", volumetric: "rayos de luz volumetricos", backlit: "contraluz elegante", highKey: "iluminacion high-key" },
        mood: { premium: "ambiente premium, refinado y seguro", calm: "ambiente calmo, sereno y elegante", dramatic: "ambiente dramatico, intenso y de alto impacto", futuristic: "ambiente futurista, innovador y aspiracional", warm: "ambiente calido, humano y tranquilizador", mysterious: "ambiente misterioso, cinematografico e inmersivo", playful: "ambiente ludico, colorido y energico", dark: "ambiente oscuro, moody y sofisticado" },
        color: { richContrast: "contraste rico, color grading controlado", monochrome: "paleta monocroma, rango tonal fuerte", pastel: "paleta pastel suave", vibrant: "colores vibrantes, alta saturacion", muted: "paleta apagada elegante", tealOrange: "grado cinematografico teal and orange", blackGold: "paleta lujo negro y oro", natural: "ciencia de color natural", cyberpunk: "paleta cyberpunk magenta cian" },
        detail: { clean: "detalles limpios, sin saturacion visual", detailed: "muy detallado, textura precisa", ultraDetailed: "ultra detallado, microtexturas complejas", hyperreal: "detalle hiperrealista, superficies tactiles", minimalDetail: "detalle minimo, silueta fuerte", ornate: "detalles ornamentales, materialidad rica" },
        quality: { draft: "composicion clara, calidad borrador utilizable", high: "alta calidad, enfoque nitido, acabado profesional", ultra: "ultra alta calidad, acabado premiado", commercial: "calidad campana comercial, retoque premium" },
        negative: { standard: "manos malas, dedos extra, rostro distorsionado, sobresaturado, ruido, sujeto recortado", product: "logo deformado, etiqueta ilegible, reflejos incorrectos, textura plastica", portrait: "ojos asimetricos, mala textura de piel, rostro uncanny, extremidades extra", text: "palabras mal escritas, tipografia ilegible, letras aleatorias", none: "" }
      },
      it: {
        subject: { premiumScene: "scena editoriale premium", productHero: "scatto hero prodotto", characterPortrait: "ritratto espressivo di personaggio", architecture: "visual architettonico di alta gamma", fashion: "campagna moda lusso", food: "fotografia food premium", tech: "visual tecnologico futuristico", nature: "paesaggio naturale epico", abstract: "metafora visiva astratta", uiMockup: "mockup interfaccia digitale curato" },
        style: { cinematic: "cinematico, film still, alto valore produttivo", photoreal: "fotorealistico, texture naturali, profondita realistica", editorial: "stile magazine editoriale, art direction raffinata", luxury: "pubblicita lusso, minimal e costosa", documentary: "realismo documentario, atmosfera autentica", anime: "anime premium, linework pulito", conceptArt: "concept art AAA, sviluppo visivo drammatico", surreal: "composizione surreale e onirica", isometric: "illustrazione isometrica pulita", watercolor: "illustrazione acquerello delicata", vector: "illustrazione vettoriale moderna", clay: "render 3D clay morbido" },
        composition: { ruleOfThirds: "regola dei terzi, spazio negativo bilanciato", centered: "composizione centrata, forte simmetria", closeCrop: "crop stretto, framing intimo", wideEpic: "composizione ampia epica, scala cinematica", diagonal: "composizione diagonale dinamica", layeredDepth: "profondita primo piano, mezzo, sfondo", minimal: "composizione minimal, spaziatura precisa", poster: "composizione poster, gerarchia forte", grid: "layout a griglia pulito", leadingLines: "linee guida forti" },
        shot: { macro: "scatto macro", closeUp: "primo piano", portrait: "scatto ritratto", mediumWide: "campo medio largo", wideAngle: "grandangolo", aerial: "vista aerea", lowAngle: "vista dal basso", topDown: "vista dall'alto", overShoulder: "vista sopra la spalla", panoramic: "inquadratura panoramica" },
        lens: { cinemaLens: "lente cinema 35mm, bassa profondita di campo", telephoto: "compressione teleobiettivo, lente 85mm", wideLens: "grandangolo 24mm, prospettiva immersiva", macroLens: "lente macro 100mm, microdettagli nitidi", anamorphic: "lente anamorfica, distorsione cinematica sottile", tiltShift: "lente tilt-shift, profondita miniatura", cleanDigital: "render digitale pulito, bordi netti" },
        lighting: { softCinematic: "luce cinematica morbida", goldenHour: "luce golden hour", neon: "luce neon, riflessi colorati", studio: "illuminazione studio professionale", rimLight: "rim light drammatico", chiaroscuro: "contrasto chiaroscuro", overcast: "luce naturale morbida nuvolosa", volumetric: "raggi di luce volumetrici", backlit: "controluce elegante", highKey: "illuminazione high-key" },
        mood: { premium: "atmosfera premium, raffinata e sicura", calm: "atmosfera calma, serena ed elegante", dramatic: "atmosfera drammatica, intensa e ad alto impatto", futuristic: "atmosfera futuristica, innovativa e aspirazionale", warm: "atmosfera calda, umana e rassicurante", mysterious: "atmosfera misteriosa, cinematica e immersiva", playful: "atmosfera giocosa, colorata ed energica", dark: "atmosfera scura, moody e sofisticata" },
        color: { richContrast: "contrasto ricco, color grading controllato", monochrome: "palette monocromatica, forte gamma tonale", pastel: "palette pastello morbida", vibrant: "colori vibranti, alta saturazione", muted: "palette tenue elegante", tealOrange: "color grading cinematico teal and orange", blackGold: "palette lusso nero e oro", natural: "scienza colore naturale", cyberpunk: "palette cyberpunk magenta ciano" },
        detail: { clean: "dettagli puliti, senza disordine", detailed: "molto dettagliato, texture precisa", ultraDetailed: "ultra dettagliato, microtexture complesse", hyperreal: "dettaglio iperrealistico, superfici tattili", minimalDetail: "dettaglio minimo, silhouette forte", ornate: "dettagli ornamentali, materiali ricchi" },
        quality: { draft: "composizione chiara, qualita bozza utilizzabile", high: "alta qualita, focus nitido, finitura professionale", ultra: "ultra alta qualita, finitura award-winning", commercial: "qualita campagna commerciale, ritocco premium" },
        negative: { standard: "mani sbagliate, dita extra, volto distorto, sovrasaturato, rumore, soggetto tagliato", product: "logo deformato, etichetta illeggibile, riflessi errati, texture plastica", portrait: "occhi asimmetrici, cattiva texture pelle, volto uncanny, arti extra", text: "parole errate, tipografia illeggibile, lettere casuali", none: "" }
      }
    };
    return localized[locale]?.[group]?.[key] || base[group]?.[key] || "";
  }

  function imagePromptParams(engine, aspect, version, quality, stylize, negatives, labels = imagePromptLabels("en")) {
    if (engine === "midjourney") {
      const qualityMap = { draft: "0.5", high: "1", ultra: "2", commercial: "2" };
      const stylizeMap = { low: "80", balanced: "250", high: "600", extreme: "1000" };
      const v = version === "v6" ? "6.1" : version === "niji" ? "niji 6" : "7";
      return `--ar ${aspect} --v ${v} --style raw --s ${stylizeMap[stylize] || "250"} --q ${qualityMap[quality] || "1"}${negatives ? ` --no ${negatives}` : ""}`;
    }
    if (engine === "stableDiffusion") return `${labels.negativePrompt}: ${negatives}`;
    return "";
  }

  function splitOutputBlocks(text) {
    return String(text || "").split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean);
  }

  function extractInformationGroups(text) {
    const patterns = {
      emails: /[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,
      urls: /https?:\/\/[^\s<>"']+/gi,
      phones: /(?:\+?\d[\d\s().-]{7,}\d)/g,
      dates: /\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/g,
      times: /\b\d{1,2}[:h]\d{2}\b/gi,
      hashtags: /#[\p{L}\p{N}_-]+/gu,
      mentions: /@[\p{L}\p{N}_-]+/gu,
      amounts: /\b\d+(?:[.,]\d{2})?\s?(?:€|\$|£|EUR|USD|GBP)\b/gi,
      ips: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      domains: /\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi,
      hexColors: /#[0-9a-f]{3,8}\b/gi
    };
    return Object.fromEntries(Object.entries(patterns).map(([name, regex]) => [name, [...new Set(String(text || "").match(regex) || [])]]));
  }

  function parseJsonSafe(text) {
    try {
      return { ok: true, value: JSON.parse(String(text || "")) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  function countJsonKeys(value) {
    if (!value || typeof value !== "object") return 0;
    if (Array.isArray(value)) return value.reduce((sum, item) => sum + countJsonKeys(item), 0);
    return Object.keys(value).length + Object.values(value).reduce((sum, item) => sum + countJsonKeys(item), 0);
  }

  function jsonDepth(value) {
    if (!value || typeof value !== "object") return 0;
    const children = Array.isArray(value) ? value : Object.values(value);
    return children.length ? 1 + Math.max(...children.map(jsonDepth)) : 1;
  }

  function diffLines(leftText, rightText) {
    const left = String(leftText || "").split(/\r?\n/);
    const right = String(rightText || "").split(/\r?\n/);
    const max = Math.max(left.length, right.length);
    const result = [];
    for (let index = 0; index < max; index += 1) {
      if (left[index] === right[index]) result.push({ type: "same", text: left[index] || "" });
      else {
        if (left[index]) result.push({ type: "removed", text: left[index] });
        if (right[index]) result.push({ type: "added", text: right[index] });
      }
    }
    return result;
  }

  function countChangedLinePairs(diff) {
    let count = 0;
    for (let index = 0; index < diff.length; index += 1) {
      if (diff[index].type === "removed" || diff[index].type === "added") count += 1;
    }
    return count;
  }

  function regexMatches(text, pattern, flags) {
    if (!pattern) return { items: [] };
    try {
      const regex = new RegExp(pattern, flags || "g");
      return { items: [...String(text || "").matchAll(regex)].map((match) => ({ value: match[0], groups: match.slice(1).filter((group) => group !== undefined) })) };
    } catch (error) {
      return { error: error.message, items: [] };
    }
  }

  function cleanText(text) {
    return text
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\t/g, " ")
      .replace(/[ \u00a0]{2,}/g, " ")
      .replace(/[ \t]*([,.;:?!])[ \t]*/g, "$1 ")
      .replace(/\s+([.)\]])/g, "$1")
      .replace(/([([\{])\s+/g, "$1")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function normalizeTypography(text, locale) {
    let next = cleanText(text)
      .replace(/'/g, "’")
      .replace(/"([^"]+)"/g, "“$1”")
      .replace(/\s*--\s*/g, " — ")
      .replace(/\s*-\s*/g, " – ")
      .replace(/\s+([,.)\]])/g, "$1")
      .replace(/([([\{])\s+/g, "$1");
    if (String(locale).startsWith("fr")) {
      next = next.replace(/\s*([:;?!])\s*/g, "\u00a0$1 ");
    } else {
      next = next.replace(/\s+([:;?!])/g, "$1 ");
    }
    return next.trim();
  }

  function convertCase(text, mode) {
    const words = text.trim().split(/[\s_-]+/).filter(Boolean);
    const lower = words.map((word) => word.toLowerCase());
    const cap = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    if (mode === "lower") return text.toLowerCase();
    if (mode === "title") return lower.map(cap).join(" ");
    if (mode === "sentence") return text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase());
    if (mode === "camel") return lower.map((word, index) => index ? cap(word) : word).join("");
    if (mode === "snake") return lower.join("_");
    if (mode === "kebab") return lower.join("-");
    if (mode === "pascal") return lower.map(cap).join("");
    return text.toUpperCase();
  }

  function countAdvanced(text, locale) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
    const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || [text]).length : 0;
    const readMinutes = Math.max(1, Math.ceil(words / 220));
    const tokens = Math.ceil(chars / 4);
    const avgWordsPerSentence = sentences ? Math.round(words / sentences) : 0;
    const avgCharsPerWord = words ? Math.round(charsNoSpaces / words) : 0;
    return [
      `${out(locale, "words")}: ${words}`,
      `${out(locale, "characters")}: ${chars}`,
      `${out(locale, "charsNoSpaces")}: ${charsNoSpaces}`,
      `${out(locale, "lines")}: ${lines}`,
      `${out(locale, "paragraphs")}: ${paragraphs}`,
      `${out(locale, "sentences")}: ${sentences}`,
      `${out(locale, "avgWordsPerSentence")}: ${avgWordsPerSentence}`,
      `${out(locale, "avgCharsPerWord")}: ${avgCharsPerWord}`,
      `${out(locale, "readingTime")}: ${readMinutes} ${out(locale, "min")}`,
      `${out(locale, "tokens")}: ${tokens}`
    ].join("\n");
  }

  function splitLongText(text, size, mode, locale = "en") {
    const safeSize = Math.max(200, size || 5000);
    const chunks = [];
    if (mode === "words") {
      const words = text.split(/\s+/);
      for (let index = 0; index < words.length; index += safeSize) chunks.push(words.slice(index, index + safeSize).join(" "));
    } else {
      for (let index = 0; index < text.length; index += safeSize) chunks.push(text.slice(index, index + safeSize));
    }
    return chunks.map((chunk, index) => `--- ${out(locale, "block")} ${index + 1}/${chunks.length} ---\n${chunk.trim()}`).join("\n\n");
  }

  function detectDuplicateText(text, locale = "en") {
    const source = String(text || "");
    const segments = segmentDuplicateText(source);
    const seen = new Map();
    const groups = new Map();
    const cleaned = [];
    let duplicateCount = 0;
    segments.forEach((segment) => {
      const key = normalizeDuplicateSegment(segment.value);
      if (!key) {
        cleaned.push(segment.raw);
        return;
      }
      if (!seen.has(key)) {
        seen.set(key, segment);
        cleaned.push(segment.raw);
        return;
      }
      duplicateCount += 1;
      const first = seen.get(key);
      const group = groups.get(key) || { key, text: first.value, count: 1, segments: [first] };
      group.count += 1;
      group.segments.push(segment);
      groups.set(key, group);
    });
    const cleanedText = normalizeCleanedDuplicateOutput(cleaned.join(""));
    const duplicateGroups = [...groups.values()].sort((left, right) => right.count - left.count || right.text.length - left.text.length);
    return {
      cleanedText,
      duplicateCount,
      groupCount: duplicateGroups.length,
      keptCount: seen.size,
      removedCount: duplicateCount,
      segmentType: duplicateSegmentTypeLabel(segments, locale),
      groups: duplicateGroups,
      segments
    };
  }

  function segmentDuplicateText(text) {
    if (!text.trim()) return [];
    const paragraphs = text.split(/(\n\s*\n+)/);
    const paragraphSegments = [];
    for (let index = 0; index < paragraphs.length; index += 2) {
      const value = paragraphs[index] || "";
      const separator = paragraphs[index + 1] || "";
      if (value.trim()) paragraphSegments.push({ raw: value + separator, value, type: "paragraph" });
    }
    if (paragraphSegments.length >= 2 && paragraphSegments.some((segment) => segment.value.length > 80) && hasDuplicateSegments(paragraphSegments)) return paragraphSegments;
    const phraseSegments = segmentDuplicatePhrases(text);
    const meaningfulPhrases = phraseSegments.filter((segment) => segment.type === "sentence");
    if (meaningfulPhrases.length >= 2 && hasDuplicateSegments(meaningfulPhrases)) return phraseSegments;
    const lines = text.split(/(\r?\n)/);
    const lineSegments = [];
    for (let index = 0; index < lines.length; index += 2) {
      const value = lines[index] || "";
      const separator = lines[index + 1] || "";
      if (value.trim()) lineSegments.push({ raw: value + separator, value, type: "line" });
      else lineSegments.push({ raw: value + separator, value: "", type: "empty" });
    }
    const meaningfulLines = lineSegments.filter((segment) => segment.type === "line");
    if (meaningfulLines.length >= 2 && hasDuplicateSegments(meaningfulLines)) return lineSegments;
    if (meaningfulLines.length >= 2) return lineSegments;
    if (meaningfulPhrases.length >= 2) return phraseSegments;
    return text.split(/(\s+)/).filter((value) => value).map((value) => ({ raw: value, value, type: /\s+/.test(value) ? "empty" : "word" }));
  }

  function hasDuplicateSegments(segments) {
    const seen = new Set();
    return segments.some((segment) => {
      const key = normalizeDuplicateSegment(segment.value);
      if (!key) return false;
      if (seen.has(key)) return true;
      seen.add(key);
      return false;
    });
  }

  function segmentDuplicatePhrases(text) {
    const segments = [];
    const regex = /(\s*)([^.!?\n]+)([.!?]+)?/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text))) {
      if (match.index > lastIndex) {
        const raw = text.slice(lastIndex, match.index);
        if (raw) segments.push({ raw, value: "", type: "empty" });
      }
      const raw = `${match[1] || ""}${match[2] || ""}${match[3] || ""}`;
      segments.push({ raw, value: match[2] || "", type: "sentence" });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) segments.push({ raw: text.slice(lastIndex), value: "", type: "empty" });
    return segments;
  }

  function normalizeDuplicateSegment(value) {
    return String(value || "")
      .normalize("NFKC")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[“”]/g, "\"")
      .replace(/[‘’]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^[\s"'“”‘’([{]+|[\s"'“”‘’)\]}.,;:!?]+$/g, "")
      .toLocaleLowerCase();
  }

  function normalizeCleanedDuplicateOutput(text) {
    return String(text || "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function duplicateSegmentTypeLabel(segments, locale) {
    const type = segments.find((segment) => segment.type && segment.type !== "empty")?.type || "line";
    const labels = {
      en: { paragraph: "paragraphs", line: "lines", sentence: "sentences", word: "words" },
      fr: { paragraph: "paragraphes", line: "lignes", sentence: "phrases", word: "mots" },
      de: { paragraph: "Absätze", line: "Zeilen", sentence: "Sätze", word: "Wörter" },
      es: { paragraph: "párrafos", line: "líneas", sentence: "frases", word: "palabras" },
      it: { paragraph: "paragrafi", line: "righe", sentence: "frasi", word: "parole" }
    };
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    return (labels[lang] || labels.en)[type] || type;
  }

  function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function countWordReplacerMatches(text, needle) {
    const source = String(text || "");
    const search = String(needle || "");
    if (!source || !search) return 0;
    return (source.match(new RegExp(escapeRegExp(search), "gi")) || []).length;
  }

  function replaceWords(text, needle, replacement) {
    const source = String(text || "");
    const search = String(needle || "");
    if (!source || !search) return source;
    return source.replace(new RegExp(escapeRegExp(search), "gi"), String(replacement || ""));
  }

  function buildPromptArchitect(text, locale = "en", options = {}) {
    const labels = promptLabels(locale);
    const preset = promptPreset(locale, options.promptPreset || "general");
    const tone = promptTone(locale, options.promptTone || "expert");
    const format = promptFormat(locale, options.promptFormat || "structured");
    const depth = promptDepth(locale, options.promptDepth || "deep");
    const source = String(text || "").trim() || "-";
    return [
      `# ${labels.role}`,
      preset.role || labels.roleText,
      "",
      `# ${labels.mission}`,
      preset.mission || labels.missionText,
      "",
      `# ${labels.context}`,
      `${labels.contextIntro}:`,
      source,
      "",
      `# ${labels.preset}`,
      `- ${preset.name}`,
      `- ${preset.focus}`,
      "",
      `# ${labels.constraints}`,
      `- ${labels.constraintsText}`,
      `- ${tone}`,
      `- ${depth}`,
      `- ${labels.missingInfo}`,
      `- ${labels.separateLogic}`,
      "",
      `# ${labels.expertModules}`,
      ...preset.modules.map((item) => `- ${item}`),
      "",
      `# ${labels.method}`,
      `1. ${labels.methodText}`,
      `2. ${labels.valueDecisions}`,
      `3. ${labels.ambiguityCheck}`,
      `4. ${labels.finalNoMeta}`,
      "",
      `# ${labels.output}`,
      labels.outputText,
      `- ${format}`,
      "",
      `# ${labels.checklist}`,
      `- ${labels.checklistText}`,
      `- ${labels.usableCheck}`,
      `- ${labels.vagueCheck}`,
      `- ${labels.expertCheck}`
    ].join("\n");
  }

  function promptPreset(locale, value) {
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    const modules = {
      en: {
      general: ["Clarify the goal", "Choose the most useful structure", "Return a practical final result"],
      strategy: ["Diagnose context and constraints", "Compare options", "Prioritize actions by impact and effort", "Expose risks and trade-offs"],
      marketing: ["Define audience and promise", "Create hooks and angles", "Strengthen differentiation", "Include CTA and objections"],
      seo: ["Infer search intent", "Structure H1/H2/H3", "Suggest semantic entities", "Optimize snippets and internal linking"],
      social: ["Adapt to platform behavior", "Create hooks", "Offer variants", "Optimize rhythm and engagement"],
      email: ["Clarify recipient and objective", "Create subject lines", "Structure message for action", "Reduce friction"],
      sales: ["Qualify pain and desire", "Build value argument", "Handle objections", "Close with next step"],
      support: ["Diagnose issue", "Ask only necessary questions", "Give step-by-step resolution", "Keep tone calm"],
      product: ["Identify user need", "Define features and constraints", "Prioritize roadmap", "Describe acceptance criteria"],
      ux: ["Map user flow", "Reduce cognitive load", "Spot friction", "Propose interface states"],
      code: ["Clarify language and environment", "Prefer robust implementation", "Mention edge cases", "Include tests when useful"],
      debug: ["Reproduce symptoms", "List probable causes", "Design checks", "Patch root cause"],
      data: ["Clarify data source", "Define metrics", "Find patterns", "Explain limits"],
      research: ["Separate known facts and assumptions", "Structure sources needed", "Compare interpretations", "Return synthesis"],
      summary: ["Extract essentials", "Preserve nuance", "Group by theme", "Return action points"],
      translation: ["Preserve meaning and tone", "Adapt idioms", "Avoid literal awkwardness", "Flag ambiguity"],
      teaching: ["Assess learner level", "Explain progressively", "Use examples", "Add exercises or checks"],
      recruiting: ["Define role and profile", "Clarify criteria", "Write attractive copy", "Avoid bias"],
      project: ["Define scope", "Break down milestones", "Assign priorities", "Identify risks"],
      automation: ["Map manual workflow", "Find triggers and actions", "Design robust automation", "Include failure handling"],
      imagePrompt: ["Describe subject and composition", "Specify style and lighting", "Control camera/framing", "Add negative constraints"]
      },
      fr: {
        general: ["Clarifier l'objectif", "Choisir la structure la plus utile", "Retourner un resultat concret"],
        strategy: ["Diagnostiquer contexte et contraintes", "Comparer les options", "Prioriser impact et effort", "Exposer risques et arbitrages"],
        marketing: ["Definir audience et promesse", "Creer hooks et angles", "Renforcer la differenciation", "Inclure CTA et objections"],
        seo: ["Inferer l'intention de recherche", "Structurer H1/H2/H3", "Suggerer les entites semantiques", "Optimiser snippets et maillage"],
        social: ["Adapter a la plateforme", "Creer des accroches", "Proposer des variantes", "Optimiser rythme et engagement"],
        email: ["Clarifier destinataire et objectif", "Creer des objets", "Structurer pour l'action", "Reduire les frictions"],
        sales: ["Qualifier douleur et desir", "Construire l'argumentaire", "Traiter les objections", "Conclure par l'etape suivante"],
        support: ["Diagnostiquer le probleme", "Poser seulement les questions utiles", "Donner une resolution pas a pas", "Garder un ton calme"],
        product: ["Identifier le besoin utilisateur", "Definir fonctions et contraintes", "Prioriser la roadmap", "Decrire les criteres d'acceptation"],
        ux: ["Cartographier le parcours", "Reduire la charge cognitive", "Detecter les frictions", "Proposer les etats d'interface"],
        code: ["Clarifier langage et environnement", "Privilegier une implementation robuste", "Mentionner les cas limites", "Inclure des tests si utile"],
        debug: ["Reproduire les symptomes", "Lister les causes probables", "Concevoir les verifications", "Corriger la cause racine"],
        data: ["Clarifier la source des donnees", "Definir les metriques", "Identifier les tendances", "Expliquer les limites"],
        research: ["Separer faits connus et hypotheses", "Structurer les sources utiles", "Comparer les interpretations", "Retourner une synthese"],
        summary: ["Extraire l'essentiel", "Preserver les nuances", "Regrouper par theme", "Retourner les actions"],
        translation: ["Preserver sens et ton", "Adapter les idiomes", "Eviter le litteral maladroit", "Signaler les ambiguites"],
        teaching: ["Evaluer le niveau", "Expliquer progressivement", "Utiliser des exemples", "Ajouter exercices ou controles"],
        recruiting: ["Definir role et profil", "Clarifier les criteres", "Rediger une annonce attractive", "Eviter les biais"],
        project: ["Definir le perimetre", "Decouper en jalons", "Attribuer les priorites", "Identifier les risques"],
        automation: ["Mapper le workflow manuel", "Trouver declencheurs et actions", "Concevoir une automation robuste", "Prevoir les echecs"],
        imagePrompt: ["Decrire sujet et composition", "Specifier style et lumiere", "Controler cadrage et camera", "Ajouter contraintes negatives"]
      }
    };
    modules.de = {
      general: ["Ziel klaeren", "Beste Struktur waehlen", "Praktisches Endergebnis liefern"],
      strategy: ["Kontext und Grenzen diagnostizieren", "Optionen vergleichen", "Nach Wirkung und Aufwand priorisieren", "Risiken und Trade-offs zeigen"],
      marketing: ["Zielgruppe und Versprechen definieren", "Hooks und Blickwinkel erstellen", "Differenzierung staerken", "CTA und Einwaende einbauen"],
      seo: ["Suchintention ableiten", "H1/H2/H3 strukturieren", "Semantische Entitaeten vorschlagen", "Snippets und interne Links optimieren"],
      social: ["An Plattformlogik anpassen", "Hooks erstellen", "Varianten anbieten", "Rhythmus und Engagement optimieren"],
      email: ["Empfaenger und Ziel klaeren", "Betreffzeilen erstellen", "Nach Aktion strukturieren", "Reibung reduzieren"],
      sales: ["Pain und Wunsch qualifizieren", "Wertargument aufbauen", "Einwaende behandeln", "Mit naechstem Schritt schliessen"],
      support: ["Problem diagnostizieren", "Nur noetige Fragen stellen", "Schrittweise Loesung geben", "Ruhigen Ton halten"],
      product: ["Nutzerbedarf identifizieren", "Features und Grenzen definieren", "Roadmap priorisieren", "Akzeptanzkriterien beschreiben"],
      ux: ["User Flow abbilden", "Kognitive Last reduzieren", "Reibung erkennen", "Interface-Zustaende vorschlagen"],
      code: ["Sprache und Umgebung klaeren", "Robuste Implementierung bevorzugen", "Randfaelle nennen", "Tests ergaenzen wenn sinnvoll"],
      debug: ["Symptome reproduzieren", "Wahrscheinliche Ursachen listen", "Checks planen", "Ursache beheben"],
      data: ["Datenquelle klaeren", "Metriken definieren", "Muster finden", "Grenzen erklaeren"],
      research: ["Fakten und Annahmen trennen", "Noetige Quellen strukturieren", "Interpretationen vergleichen", "Synthese liefern"],
      summary: ["Essentials extrahieren", "Nuancen bewahren", "Nach Themen gruppieren", "Aktionspunkte liefern"],
      translation: ["Sinn und Ton bewahren", "Idiome anpassen", "Holprige Woertlichkeit vermeiden", "Mehrdeutigkeit markieren"],
      teaching: ["Lernniveau einschaetzen", "Progressiv erklaeren", "Beispiele nutzen", "Uebungen oder Checks ergaenzen"],
      recruiting: ["Rolle und Profil definieren", "Kriterien klaeren", "Attraktive Copy schreiben", "Bias vermeiden"],
      project: ["Umfang definieren", "Meilensteine zerlegen", "Prioritaeten zuweisen", "Risiken identifizieren"],
      automation: ["Manuellen Ablauf abbilden", "Trigger und Aktionen finden", "Robuste Automation entwerfen", "Fehlerbehandlung einplanen"],
      imagePrompt: ["Motiv und Komposition beschreiben", "Stil und Licht definieren", "Kamera und Framing steuern", "Negative Constraints hinzufuegen"]
    };
    modules.es = {
      general: ["Aclarar el objetivo", "Elegir la estructura mas util", "Entregar un resultado practico"],
      strategy: ["Diagnosticar contexto y restricciones", "Comparar opciones", "Priorizar por impacto y esfuerzo", "Exponer riesgos y trade-offs"],
      marketing: ["Definir audiencia y promesa", "Crear hooks y angulos", "Reforzar diferenciacion", "Incluir CTA y objeciones"],
      seo: ["Inferir intencion de busqueda", "Estructurar H1/H2/H3", "Sugerir entidades semanticas", "Optimizar snippets y enlazado interno"],
      social: ["Adaptar a la plataforma", "Crear ganchos", "Ofrecer variantes", "Optimizar ritmo y engagement"],
      email: ["Aclarar destinatario y objetivo", "Crear asuntos", "Estructurar para la accion", "Reducir friccion"],
      sales: ["Calificar dolor y deseo", "Construir argumento de valor", "Responder objeciones", "Cerrar con siguiente paso"],
      support: ["Diagnosticar problema", "Preguntar solo lo necesario", "Dar resolucion paso a paso", "Mantener tono calmado"],
      product: ["Identificar necesidad de usuario", "Definir funciones y restricciones", "Priorizar roadmap", "Describir criterios de aceptacion"],
      ux: ["Mapear flujo de usuario", "Reducir carga cognitiva", "Detectar fricciones", "Proponer estados de interfaz"],
      code: ["Aclarar lenguaje y entorno", "Preferir implementacion robusta", "Mencionar casos limite", "Incluir pruebas si conviene"],
      debug: ["Reproducir sintomas", "Listar causas probables", "Disenar verificaciones", "Corregir causa raiz"],
      data: ["Aclarar fuente de datos", "Definir metricas", "Encontrar patrones", "Explicar limites"],
      research: ["Separar hechos y suposiciones", "Estructurar fuentes necesarias", "Comparar interpretaciones", "Entregar sintesis"],
      summary: ["Extraer lo esencial", "Preservar matices", "Agrupar por tema", "Entregar acciones"],
      translation: ["Preservar sentido y tono", "Adaptar modismos", "Evitar literalidad torpe", "Marcar ambiguedad"],
      teaching: ["Evaluar nivel", "Explicar progresivamente", "Usar ejemplos", "Agregar ejercicios o controles"],
      recruiting: ["Definir rol y perfil", "Aclarar criterios", "Redactar copy atractivo", "Evitar sesgos"],
      project: ["Definir alcance", "Dividir en hitos", "Asignar prioridades", "Identificar riesgos"],
      automation: ["Mapear flujo manual", "Encontrar disparadores y acciones", "Disenar automatizacion robusta", "Incluir manejo de fallos"],
      imagePrompt: ["Describir sujeto y composicion", "Especificar estilo e iluminacion", "Controlar camara y encuadre", "Agregar restricciones negativas"]
    };
    modules.it = {
      general: ["Chiarire l'obiettivo", "Scegliere la struttura piu utile", "Restituire un risultato pratico"],
      strategy: ["Diagnosticare contesto e vincoli", "Confrontare opzioni", "Prioritizzare per impatto e sforzo", "Mostrare rischi e trade-off"],
      marketing: ["Definire pubblico e promessa", "Creare hook e angoli", "Rafforzare differenziazione", "Includere CTA e obiezioni"],
      seo: ["Inferire intento di ricerca", "Strutturare H1/H2/H3", "Suggerire entita semantiche", "Ottimizzare snippet e link interni"],
      social: ["Adattare alla piattaforma", "Creare hook", "Offrire varianti", "Ottimizzare ritmo ed engagement"],
      email: ["Chiarire destinatario e obiettivo", "Creare oggetti email", "Strutturare per l'azione", "Ridurre attrito"],
      sales: ["Qualificare dolore e desiderio", "Costruire argomento di valore", "Gestire obiezioni", "Chiudere con prossimo passo"],
      support: ["Diagnosticare problema", "Fare solo domande necessarie", "Dare soluzione passo passo", "Mantenere tono calmo"],
      product: ["Identificare bisogno utente", "Definire funzioni e vincoli", "Prioritizzare roadmap", "Descrivere criteri di accettazione"],
      ux: ["Mappare user flow", "Ridurre carico cognitivo", "Trovare frizioni", "Proporre stati interfaccia"],
      code: ["Chiarire linguaggio e ambiente", "Preferire implementazione robusta", "Citare casi limite", "Includere test se utile"],
      debug: ["Riprodurre sintomi", "Elencare cause probabili", "Progettare controlli", "Correggere causa radice"],
      data: ["Chiarire fonte dati", "Definire metriche", "Trovare pattern", "Spiegare limiti"],
      research: ["Separare fatti e ipotesi", "Strutturare fonti necessarie", "Confrontare interpretazioni", "Restituire sintesi"],
      summary: ["Estrarre essenziale", "Preservare sfumature", "Raggruppare per tema", "Restituire azioni"],
      translation: ["Preservare senso e tono", "Adattare modi di dire", "Evitare letteralita goffa", "Segnalare ambiguita"],
      teaching: ["Valutare livello", "Spiegare progressivamente", "Usare esempi", "Aggiungere esercizi o controlli"],
      recruiting: ["Definire ruolo e profilo", "Chiarire criteri", "Scrivere copy attraente", "Evitare bias"],
      project: ["Definire perimetro", "Scomporre milestone", "Assegnare priorita", "Identificare rischi"],
      automation: ["Mappare workflow manuale", "Trovare trigger e azioni", "Progettare automazione robusta", "Includere gestione errori"],
      imagePrompt: ["Descrivere soggetto e composizione", "Specificare stile e luce", "Controllare camera e inquadratura", "Aggiungere vincoli negativi"]
    };
    const names = {
      fr: { general: "General expert", strategy: "Strategie", marketing: "Marketing", seo: "SEO", social: "Reseaux sociaux", email: "Email", sales: "Vente", support: "Support client", product: "Produit", ux: "UX/UI", code: "Code", debug: "Debug", data: "Analyse data", research: "Recherche", summary: "Synthese", translation: "Traduction", teaching: "Pedagogie", recruiting: "Recrutement", project: "Gestion de projet", automation: "Automatisation", imagePrompt: "Prompt image" },
      en: { general: "General expert", strategy: "Strategy", marketing: "Marketing", seo: "SEO", social: "Social media", email: "Email", sales: "Sales", support: "Customer support", product: "Product", ux: "UX/UI", code: "Code", debug: "Debugging", data: "Data analysis", research: "Research", summary: "Summary", translation: "Translation", teaching: "Teaching", recruiting: "Recruiting", project: "Project management", automation: "Automation", imagePrompt: "Image prompt" },
      de: { general: "Allgemeiner Experte", strategy: "Strategie", marketing: "Marketing", seo: "SEO", social: "Social Media", email: "E-Mail", sales: "Vertrieb", support: "Kundensupport", product: "Produkt", ux: "UX/UI", code: "Code", debug: "Debugging", data: "Datenanalyse", research: "Recherche", summary: "Zusammenfassung", translation: "Uebersetzung", teaching: "Lehre", recruiting: "Recruiting", project: "Projektmanagement", automation: "Automatisierung", imagePrompt: "Bild-Prompt" },
      es: { general: "Experto general", strategy: "Estrategia", marketing: "Marketing", seo: "SEO", social: "Redes sociales", email: "Email", sales: "Ventas", support: "Soporte cliente", product: "Producto", ux: "UX/UI", code: "Codigo", debug: "Debug", data: "Analisis de datos", research: "Investigacion", summary: "Sintesis", translation: "Traduccion", teaching: "Ensenanza", recruiting: "Reclutamiento", project: "Gestion de proyecto", automation: "Automatizacion", imagePrompt: "Prompt imagen" },
      it: { general: "Esperto generale", strategy: "Strategia", marketing: "Marketing", seo: "SEO", social: "Social media", email: "Email", sales: "Vendite", support: "Supporto clienti", product: "Prodotto", ux: "UX/UI", code: "Codice", debug: "Debug", data: "Analisi dati", research: "Ricerca", summary: "Sintesi", translation: "Traduzione", teaching: "Didattica", recruiting: "Recruiting", project: "Project management", automation: "Automazione", imagePrompt: "Prompt immagine" }
    };
    const sourceModules = modules[lang] || modules.en;
    const key = sourceModules[value] ? value : "general";
    const labels = promptLabels(lang);
    return {
      name: (names[lang] || names.en)[key] || names.en[key],
      role: labels.roleText,
      mission: `${labels.missionText} Preset: ${((names[lang] || names.en)[key] || key)}.`,
      focus: sourceModules[key][0],
      modules: sourceModules[key]
    };
  }

  function promptTone(locale, value) {
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    const maps = {
      en: {
        neutral: "Use a neutral, precise and professional tone.",
        expert: "Use an expert, confident and decision-oriented tone.",
        concise: "Be concise, dense and direct. Remove anything decorative.",
        premium: "Use a premium, polished, high-end tone with strong structure.",
        persuasive: "Use a persuasive tone focused on clarity, objections and action.",
        friendly: "Use a warm, simple and reassuring tone.",
        formal: "Use a formal, rigorous and institutional tone."
      },
      fr: {
        neutral: "Utilise un ton neutre, precis et professionnel.",
        expert: "Utilise un ton expert, assure et oriente decision.",
        concise: "Sois concis, dense et direct. Supprime tout decoratif.",
        premium: "Utilise un ton premium, soigne, haut de gamme et tres structure.",
        persuasive: "Utilise un ton persuasif, centre sur clarte, objections et action.",
        friendly: "Utilise un ton chaleureux, simple et rassurant.",
        formal: "Utilise un ton formel, rigoureux et institutionnel."
      },
      de: {
        neutral: "Nutze einen neutralen, praezisen und professionellen Ton.",
        expert: "Nutze einen expertenhaften, sicheren und entscheidungsorientierten Ton.",
        concise: "Sei knapp, dicht und direkt. Entferne alles Dekorative.",
        premium: "Nutze einen hochwertigen, polierten Ton mit starker Struktur.",
        persuasive: "Nutze einen ueberzeugenden Ton mit Fokus auf Klarheit, Einwaende und Aktion.",
        friendly: "Nutze einen warmen, einfachen und beruhigenden Ton.",
        formal: "Nutze einen formellen, rigorosen und institutionellen Ton."
      },
      es: {
        neutral: "Usa un tono neutral, preciso y profesional.",
        expert: "Usa un tono experto, seguro y orientado a decisiones.",
        concise: "Se conciso, denso y directo. Elimina lo decorativo.",
        premium: "Usa un tono premium, pulido, de alto nivel y muy estructurado.",
        persuasive: "Usa un tono persuasivo centrado en claridad, objeciones y accion.",
        friendly: "Usa un tono cercano, simple y tranquilizador.",
        formal: "Usa un tono formal, riguroso e institucional."
      },
      it: {
        neutral: "Usa un tono neutro, preciso e professionale.",
        expert: "Usa un tono esperto, sicuro e orientato alle decisioni.",
        concise: "Sii conciso, denso e diretto. Rimuovi cio che e decorativo.",
        premium: "Usa un tono premium, curato, di alto livello e ben strutturato.",
        persuasive: "Usa un tono persuasivo centrato su chiarezza, obiezioni e azione.",
        friendly: "Usa un tono caldo, semplice e rassicurante.",
        formal: "Usa un tono formale, rigoroso e istituzionale."
      }
    };
    const map = maps[lang] || maps.en;
    return map[value] || map.expert;
  }

  function promptFormat(locale, value) {
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    const maps = {
      en: {
        structured: "Use clear sections with short headings.",
        table: "Use tables where comparison or prioritization helps.",
        checklist: "Return a practical checklist with validation points.",
        json: "Return valid JSON when the task is compatible with structured data.",
        markdown: "Use clean Markdown with headings, bullets and code blocks if needed.",
        stepByStep: "Return a step-by-step procedure with decisions and checkpoints."
      },
      fr: {
        structured: "Utilise des sections claires avec titres courts.",
        table: "Utilise des tableaux quand la comparaison ou la priorisation aide.",
        checklist: "Retourne une checklist pratique avec points de validation.",
        json: "Retourne du JSON valide quand la tache se prete aux donnees structurees.",
        markdown: "Utilise un Markdown propre avec titres, puces et blocs de code si utile.",
        stepByStep: "Retourne une procedure pas a pas avec decisions et points de controle."
      },
      de: {
        structured: "Nutze klare Abschnitte mit kurzen Ueberschriften.",
        table: "Nutze Tabellen, wenn Vergleich oder Priorisierung hilft.",
        checklist: "Gib eine praktische Checkliste mit Pruefpunkten zurueck.",
        json: "Gib valides JSON zurueck, wenn die Aufgabe strukturierte Daten erlaubt.",
        markdown: "Nutze sauberes Markdown mit Ueberschriften, Listen und Codeblöcken wenn sinnvoll.",
        stepByStep: "Gib eine Schritt-fuer-Schritt-Anleitung mit Entscheidungen und Checks zurueck."
      },
      es: {
        structured: "Usa secciones claras con titulos cortos.",
        table: "Usa tablas cuando ayuden a comparar o priorizar.",
        checklist: "Devuelve una checklist practica con puntos de validacion.",
        json: "Devuelve JSON valido cuando la tarea sea compatible con datos estructurados.",
        markdown: "Usa Markdown limpio con titulos, listas y bloques de codigo si conviene.",
        stepByStep: "Devuelve un procedimiento paso a paso con decisiones y puntos de control."
      },
      it: {
        structured: "Usa sezioni chiare con titoli brevi.",
        table: "Usa tabelle quando aiutano confronto o priorita.",
        checklist: "Restituisci una checklist pratica con punti di verifica.",
        json: "Restituisci JSON valido quando il compito supporta dati strutturati.",
        markdown: "Usa Markdown pulito con titoli, elenchi e blocchi di codice se utile.",
        stepByStep: "Restituisci una procedura passo passo con decisioni e controlli."
      }
    };
    const map = maps[lang] || maps.en;
    return map[value] || map.structured;
  }

  function promptDepth(locale, value) {
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    const maps = {
      en: {
        fast: "Depth: fast. Prioritize speed and a compact result.",
        standard: "Depth: standard. Balance clarity, completeness and brevity.",
        deep: "Depth: deep. Include hidden constraints, edge cases and expert recommendations.",
        exhaustive: "Depth: exhaustive. Push analysis, alternatives, risks, checks and final polish."
      },
      fr: {
        fast: "Profondeur : rapide. Priorise la vitesse et un resultat compact.",
        standard: "Profondeur : standard. Equilibre clarte, completude et concision.",
        deep: "Profondeur : approfondie. Inclus contraintes cachees, cas limites et recommandations expertes.",
        exhaustive: "Profondeur : exhaustive. Pousse analyse, alternatives, risques, controles et finition."
      },
      de: {
        fast: "Tiefe: schnell. Priorisiere Tempo und ein kompaktes Ergebnis.",
        standard: "Tiefe: standard. Balanciere Klarheit, Vollstaendigkeit und Kuerze.",
        deep: "Tiefe: tief. Beruecksichtige versteckte Grenzen, Sonderfaelle und Expertenempfehlungen.",
        exhaustive: "Tiefe: umfassend. Vertiefe Analyse, Alternativen, Risiken, Kontrollen und Feinschliff."
      },
      es: {
        fast: "Profundidad: rapida. Prioriza velocidad y resultado compacto.",
        standard: "Profundidad: estandar. Equilibra claridad, completitud y brevedad.",
        deep: "Profundidad: profunda. Incluye restricciones ocultas, casos limite y recomendaciones expertas.",
        exhaustive: "Profundidad: exhaustiva. Profundiza analisis, alternativas, riesgos, controles y acabado final."
      },
      it: {
        fast: "Profondita: rapida. Dai priorita a velocita e risultato compatto.",
        standard: "Profondita: standard. Bilancia chiarezza, completezza e sintesi.",
        deep: "Profondita: profonda. Include vincoli nascosti, casi limite e raccomandazioni esperte.",
        exhaustive: "Profondita: esaustiva. Approfondisce analisi, alternative, rischi, controlli e rifinitura."
      }
    };
    const map = maps[lang] || maps.en;
    return map[value] || map.deep;
  }

  function parseVariables(value) {
    return String(value || "").split(/\r?\n/).reduce((map, line) => {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) map[key.trim()] = rest.join("=").trim();
      return map;
    }, {});
  }

  function transformList(text, mode) {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (mode === "numbered") return lines.map((line, index) => `${index + 1}. ${line}`).join("\n");
    if (mode === "csv") return lines.map((line) => `"${line.replace(/"/g, '""')}"`).join(",");
    if (mode === "markdownTable") return ["| Item |", "| --- |", ...lines.map((line) => `| ${line.replace(/\|/g, "\\|")} |`)].join("\n");
    if (mode === "sort") return [...lines].sort((a, b) => a.localeCompare(b)).join("\n");
    if (mode === "unique") return [...new Set(lines)].join("\n");
    if (mode === "reverse") return [...lines].reverse().join("\n");
    return lines.map((line) => `- ${line}`).join("\n");
  }

  function extractInformation(text, locale = "en") {
    const patterns = {
      emails: /[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi,
      urls: /https?:\/\/[^\s<>"']+/gi,
      phones: /(?:\+?\d[\d\s().-]{7,}\d)/g,
      dates: /\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/g,
      hashtags: /#[\p{L}\p{N}_-]+/gu,
      mentions: /@[\p{L}\p{N}_-]+/gu,
      amounts: /\b\d+(?:[.,]\d{2})?\s?(?:€|\$|£|EUR|USD|GBP)\b/gi,
      ips: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      domains: /\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi
    };
    return Object.entries(patterns).map(([label, regex]) => {
      const matches = [...new Set(text.match(regex) || [])];
      return `${out(locale, label).toUpperCase()}\n${matches.length ? matches.join("\n") : "-"}`;
    }).join("\n\n");
  }

  function anonymizeLocal(text) {
    return text
      .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[EMAIL]")
      .replace(/https?:\/\/[^\s<>"']+/gi, "[URL]")
      .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[IP]")
      .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, "[PHONE]");
  }

  const COLOR_LABELS = {
    en: {
      hex: "HEX", rgb: "RGB", hsl: "HSL", hsv: "HSV", cmyk: "CMYK", luminance: "Luminance",
      contrast: "Best text", white: "white", black: "black", palette: "Smart palette", tints: "Tints",
      shades: "Shades", cssVariable: "CSS variable", copied: "Color copied"
    },
    fr: {
      hex: "HEX", rgb: "RGB", hsl: "HSL", hsv: "HSV", cmyk: "CMYK", luminance: "Luminance",
      contrast: "Texte ideal", white: "blanc", black: "noir", palette: "Palette intelligente", tints: "Teintes claires",
      shades: "Teintes foncees", cssVariable: "Variable CSS", copied: "Couleur copiee"
    },
    de: {
      hex: "HEX", rgb: "RGB", hsl: "HSL", hsv: "HSV", cmyk: "CMYK", luminance: "Luminanz",
      contrast: "Bester Text", white: "weiss", black: "schwarz", palette: "Smarte Palette", tints: "Helle Toene",
      shades: "Dunkle Toene", cssVariable: "CSS-Variable", copied: "Farbe kopiert"
    },
    es: {
      hex: "HEX", rgb: "RGB", hsl: "HSL", hsv: "HSV", cmyk: "CMYK", luminance: "Luminancia",
      contrast: "Mejor texto", white: "blanco", black: "negro", palette: "Paleta inteligente", tints: "Tonos claros",
      shades: "Tonos oscuros", cssVariable: "Variable CSS", copied: "Color copiado"
    },
    it: {
      hex: "HEX", rgb: "RGB", hsl: "HSL", hsv: "HSV", cmyk: "CMYK", luminance: "Luminanza",
      contrast: "Testo ideale", white: "bianco", black: "nero", palette: "Palette intelligente", tints: "Toni chiari",
      shades: "Toni scuri", cssVariable: "Variabile CSS", copied: "Colore copiato"
    }
  };

  function colorLabel(locale, key) {
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    return (COLOR_LABELS[lang] || COLOR_LABELS.en)[key] || COLOR_LABELS.en[key] || key;
  }

  function parseColorSafe(value) {
    const raw = String(value || "").trim();
    const hexMatch = raw.match(/#?([0-9a-f]{3}|[0-9a-f]{6})\b/i);
    if (hexMatch) return hexToRgb(`#${hexMatch[1]}`);
    const rgbMatch = raw.match(/rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i);
    if (rgbMatch) return clampRgb({ r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) });
    return null;
  }

  function hexToRgb(hex) {
    let value = String(hex || "").replace("#", "").trim();
    if (value.length === 3) value = value.split("").map((char) => char + char).join("");
    if (!/^[0-9a-f]{6}$/i.test(value)) return null;
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function clampRgb(color) {
    return {
      r: Math.max(0, Math.min(255, Math.round(color.r || 0))),
      g: Math.max(0, Math.min(255, Math.round(color.g || 0))),
      b: Math.max(0, Math.min(255, Math.round(color.b || 0)))
    };
  }

  function rgbToHex(color) {
    const safe = clampRgb(color);
    return `#${[safe.r, safe.g, safe.b].map((part) => part.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
  }

  function rgbToHsl(color) {
    const { r, g, b } = clampRgb(color);
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
      else if (max === gn) h = (bn - rn) / d + 2;
      else h = (rn - gn) / d + 4;
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function rgbToHsv(color) {
    const { r, g, b } = clampRgb(color);
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const d = max - min;
    let h = 0;
    if (d) {
      if (max === rn) h = ((gn - bn) / d) % 6;
      else if (max === gn) h = (bn - rn) / d + 2;
      else h = (rn - gn) / d + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }
    return { h, s: Math.round((max ? d / max : 0) * 100), v: Math.round(max * 100) };
  }

  function rgbToCmyk(color) {
    const { r, g, b } = clampRgb(color);
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const k = 1 - Math.max(rn, gn, bn);
    if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
    return {
      c: Math.round(((1 - rn - k) / (1 - k)) * 100),
      m: Math.round(((1 - gn - k) / (1 - k)) * 100),
      y: Math.round(((1 - bn - k) / (1 - k)) * 100),
      k: Math.round(k * 100)
    };
  }

  function relativeLuminance(color) {
    const convert = (part) => {
      const value = part / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    const { r, g, b } = clampRgb(color);
    return 0.2126 * convert(r) + 0.7152 * convert(g) + 0.0722 * convert(b);
  }

  function mixColor(color, target, amount) {
    const safe = clampRgb(color);
    const goal = clampRgb(target);
    return {
      r: safe.r + (goal.r - safe.r) * amount,
      g: safe.g + (goal.g - safe.g) * amount,
      b: safe.b + (goal.b - safe.b) * amount
    };
  }

  function buildColorPalette(color) {
    const safe = clampRgb(color);
    return [
      rgbToHex(mixColor(safe, { r: 255, g: 255, b: 255 }, 0.72)),
      rgbToHex(mixColor(safe, { r: 255, g: 255, b: 255 }, 0.42)),
      rgbToHex(safe),
      rgbToHex(mixColor(safe, { r: 0, g: 0, b: 0 }, 0.28)),
      rgbToHex(mixColor(safe, { r: 0, g: 0, b: 0 }, 0.52))
    ];
  }

  function colorFormats(color, locale = "en") {
    const safe = clampRgb(color);
    const hsl = rgbToHsl(safe);
    const hsv = rgbToHsv(safe);
    const cmyk = rgbToCmyk(safe);
    const luminance = relativeLuminance(safe);
    const hex = rgbToHex(safe);
    return {
      hex,
      rgb: `rgb(${safe.r}, ${safe.g}, ${safe.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `${hsv.h}, ${hsv.s}%, ${hsv.v}%`,
      cmyk: `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`,
      luminance: `${Math.round(luminance * 1000) / 1000}`,
      contrast: luminance > 0.52 ? colorLabel(locale, "black") : colorLabel(locale, "white"),
      cssVariable: `--ucp-color: ${hex};`
    };
  }

  function colorPickerReport(value, locale = "en") {
    const color = parseColorSafe(value) || hexToRgb("#e50914");
    const formats = colorFormats(color, locale);
    const palette = buildColorPalette(color);
    return [
      `${colorLabel(locale, "hex")}: ${formats.hex}`,
      `${colorLabel(locale, "rgb")}: ${formats.rgb}`,
      `${colorLabel(locale, "hsl")}: ${formats.hsl}`,
      `${colorLabel(locale, "hsv")}: ${formats.hsv}`,
      `${colorLabel(locale, "cmyk")}: ${formats.cmyk}`,
      `${colorLabel(locale, "luminance")}: ${formats.luminance}`,
      `${colorLabel(locale, "contrast")}: ${formats.contrast}`,
      "",
      `${colorLabel(locale, "palette")}:`,
      palette.join("  "),
      "",
      `${colorLabel(locale, "cssVariable")}:`,
      formats.cssVariable
    ].join("\n");
  }

  function universalEncodeDecode(text, mode, locale = "en") {
    try {
      if (mode === "urlDecode") return decodeURIComponent(text);
      if (mode === "base64Encode") return btoa(unescape(encodeURIComponent(text)));
      if (mode === "base64Decode") return decodeURIComponent(escape(atob(text)));
      if (mode === "htmlEncode") return text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
      if (mode === "htmlDecode") {
        const area = document.createElement("textarea");
        area.innerHTML = text;
        return area.value;
      }
      if (mode === "jwtDecode") return text.split(".").slice(0, 2).map((part) => JSON.stringify(JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))), null, 2)).join("\n\n");
      return encodeURIComponent(text);
    } catch (error) {
      return `${out(locale, "error")}: ${error.message}`;
    }
  }

  function formatJson(text, mode, locale = "en") {
    try {
      const data = JSON.parse(text);
      if (mode === "minify") return JSON.stringify(data);
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return `${out(locale, "jsonError")}: ${error.message}`;
    }
  }

  function lorem(count) {
    const base = [
      "lorem ipsum dolor sit amet consectetur adipiscing elit sed non risus suspendisse lectus tortor dignissim sit amet adipiscing nec ultricies sed dolor",
      "cras elementum ultrices diam maecenas ligula massa varius a semper congue euismod non mi proin porttitor orci nec nonummy molestie enim est eleifend mi",
      "non fermentum diam nisl sit amet erat duis semper duis arcu massa scelerisque vitae consequat in pretium a enim pellentesque congue",
      "ut in risus volutpat libero pharetra tempor cras vestibulum bibendum augue praesent egestas leo in pede praesent blandit odio eu enim",
      "pellentesque sed dui ut augue blandit sodales vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae",
      "aliquam nibh mauris sagittis et euismod vitae suscipit at neque curabitur ullamcorper ultricies nisi nam eget dui etiam rhoncus",
      "maecenas tempus tellus eget condimentum rhoncus sem quam semper libero sit amet adipiscing sem neque sed ipsum nam quam nunc blandit vel luctus pulvinar",
      "hendrerit id lorem maecenas nec odio et ante tincidunt tempus donec vitae sapien ut libero venenatis faucibus nullam quis ante",
      "etiam sit amet orci eget eros faucibus tincidunt duis leo sed fringilla mauris sit amet nibh donec sodales sagittis magna",
      "sed consequat leo eget bibendum sodales augue velit cursus nunc quis gravida magna mi a libero fusce vulputate eleifend sapien",
      "vestibulum purus quam scelerisque ut mollis sed nonummy id metus nullam accumsan lorem in dui cras ultricies mi eu turpis hendrerit fringilla",
      "vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae in ac dui quis mi consectetuer lacinia",
      "nam pretium turpis et arcu duis arcu tortor suscipit eget imperdiet nec imperdiet iaculis ipsum sed aliquam ultrices mauris",
      "integer ante arcu accumsan a consectetuer eget posuere ut mauris praesent adipiscing phasellus ullamcorper ipsum rutrum nunc nunc nonummy metus",
      "vestibulum volutpat pretium libero cras id dui aenean ut eros et nisl sagittis vestibulum nullam nulla eros ultricies sit amet nonummy id imperdiet feugiat pede",
      "sed lectus donec mollis hendrerit risus phasellus nec sem in justo pellentesque facilisis etiam imperdiet imperdiet orci nunc nec neque",
      "phasellus leo dolor tempus non auctor et hendrerit quis nisi curabitur ligula sapien tincidunt non euismod vitae posuere imperdiet leo",
      "maecenas malesuada praesent congue erat at massa sed cursus turpis vitae tortor donec posuere vulputate arcu phasellus accumsan cursus velit",
      "vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae sed aliquam nisi quis porttitor congue",
      "elit erat euismod orci ac placerat dolor lectus quis orci phasellus consectetuer vestibulum elit aenean tellus metus bibendum sed posuere ac mattis non nunc"
    ].join(" ").split(/\s+/);
    const total = Math.max(1, count || 120);
    const offset = total % base.length;
    const words = Array.from({ length: total }, (_, index) => base[(index + offset) % base.length]);
    return words.reduce((paragraphs, word, index) => {
      const sentenceIndex = index % 18;
      const value = sentenceIndex === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
      paragraphs.push(value + (sentenceIndex === 17 || index === words.length - 1 ? "." : ""));
      if ((index + 1) % 126 === 0 && index < words.length - 1) paragraphs.push("\n\n");
      return paragraphs;
    }, []).join(" ").replace(/\s+\n/g, "\n").trim();
  }

  function markdownTool(text, mode, locale = "en") {
    const input = normalizeLineEndings(text);
    if (!input.trim()) return "";
    if (mode === "html") return markdownToHtml(input);
    if (mode === "code") return wrapCodeFence(input);
    if (mode === "headings") return normalizeMarkdownHeadings(input, locale);
    return markdownToChecklist(input);
  }

  function normalizeLineEndings(text) {
    return String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }

  function markdownToChecklist(text) {
    const lines = text.split("\n");
    const items = [];
    lines.forEach((raw) => {
      const line = raw.trim();
      if (!line) return;
      const checked = /^\s*[-*]\s+\[(x|X)\]\s+/.test(raw);
      const unchecked = /^\s*[-*]\s+\[\s\]\s+/.test(raw);
      const bullet = /^\s*[-*+]\s+/.test(raw);
      const numbered = /^\s*\d+[.)]\s+/.test(raw);
      const heading = /^#{1,6}\s+/.test(line);
      if (heading) {
        items.push(`- [ ] ${line.replace(/^#{1,6}\s+/, "").trim()}`);
        return;
      }
      const value = line
        .replace(/^\s*[-*+]\s+/, "")
        .replace(/^\s*\d+[.)]\s+/, "")
        .replace(/^\s*[-*]\s+\[(x|X|\s)\]\s+/, "")
        .trim();
      if (!value) return;
      if (checked || unchecked || bullet || numbered) {
        items.push(`- [${checked ? "x" : " "}] ${value}`);
      } else {
        splitSentences(value).forEach((sentence) => items.push(`- [ ] ${sentence}`));
      }
    });
    return items.join("\n");
  }

  function splitSentences(text) {
    const chunks = String(text || "").split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
    const cleaned = chunks.map((chunk) => chunk.trim()).filter(Boolean);
    return cleaned.length ? cleaned : [String(text || "").trim()].filter(Boolean);
  }

  function wrapCodeFence(text) {
    const clean = String(text || "").trim();
    if (/^```[\w-]*\n[\s\S]*\n```$/.test(clean)) return clean;
    const lang = detectCodeLanguage(clean);
    return `\`\`\`${lang}\n${clean}\n\`\`\``;
  }

  function detectCodeLanguage(text) {
    const sample = String(text || "");
    if (!sample.trim()) return "text";
    if (/<[a-z][\s\S]*?>/i.test(sample) && /<\/[a-z]+>/i.test(sample)) return "html";
    if (/^\s*[{[]/.test(sample) && /"\w+"\s*:/.test(sample)) return "json";
    if (/^\s*query\s+\w+|^\s*mutation\s+\w+|^\s*fragment\s+\w+/m.test(sample)) return "graphql";
    if (/^\s*import\s+.+from\s+['"]/m.test(sample) || /\b(const|let|var)\s+\w+\s*=/.test(sample)) return "javascript";
    if (/\binterface\s+\w+|\btype\s+\w+\s*=/.test(sample)) return "typescript";
    if (/^\s*def\s+\w+\(/m.test(sample) || /\bprint\(.+\)/.test(sample)) return "python";
    if (/^\s*SELECT\s+.+\s+FROM\s+/im.test(sample)) return "sql";
    if (/^\s*<?php/m.test(sample) || /\$\w+\s*=/.test(sample)) return "php";
    if (/^\s*using\s+System;/m.test(sample) || /\bConsole\.Write(Line)?\(/.test(sample)) return "csharp";
    if (/^\s*package\s+\w+/m.test(sample) && /\bfunc\s+\w+\(/.test(sample)) return "go";
    if (/^\s*fn\s+\w+\(/m.test(sample) || /\blet\s+mut\s+\w+/.test(sample)) return "rust";
    if (/^\s*<VirtualHost\b/m.test(sample) || /^\s*RewriteRule\b/m.test(sample)) return "apache";
    if (/^\s*[.-]{3}\s*$/m.test(sample) || /^\s*\w+:\s+\S+/m.test(sample)) return "yaml";
    return "text";
  }

  function normalizeMarkdownHeadings(text, locale = "en") {
    const labels = {
      en: { toc: "Table of contents", section: "Section" },
      fr: { toc: "Sommaire", section: "Section" },
      de: { toc: "Inhaltsverzeichnis", section: "Abschnitt" },
      es: { toc: "Indice", section: "Seccion" },
      it: { toc: "Indice", section: "Sezione" }
    };
    const lang = String(locale || "en").slice(0, 2).toLowerCase();
    const dict = labels[lang] || labels.en;
    const lines = normalizeLineEndings(text).split("\n");
    const normalized = [];
    let autoCount = 1;
    let previousLevel = 1;
    const seen = new Map();
    lines.forEach((raw) => {
      const line = raw.trim();
      if (!line) {
        normalized.push("");
        return;
      }
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = Math.min(6, Math.max(1, headingMatch[1].length));
        const clampedLevel = Math.min(previousLevel + 1, level);
        previousLevel = clampedLevel;
        const cleaned = cleanHeadingText(headingMatch[2]);
        const deduped = dedupeHeading(cleaned, seen);
        normalized.push(`${"#".repeat(clampedLevel)} ${deduped}`);
        return;
      }
      if (/^[-*+]\s+/.test(line) || /^\d+[.)]\s+/.test(line) || /^>/.test(line) || /^```/.test(line)) {
        normalized.push(raw);
        return;
      }
      const generated = dedupeHeading(`${dict.section} ${autoCount}`, seen);
      autoCount += 1;
      previousLevel = 2;
      normalized.push(`## ${generated}`);
      normalized.push(line);
    });
    const headings = normalized
      .map((line) => line.match(/^(#{1,6})\s+(.+)$/))
      .filter(Boolean)
      .map((match) => ({ level: match[1].length, text: match[2] }));
    if (!headings.length) return normalized.join("\n").trim();
    const toc = [
      `## ${dict.toc}`,
      ...headings.map((entry) => `${"  ".repeat(Math.max(0, entry.level - 1))}- [${entry.text}](#${slugifyHeading(entry.text)})`),
      ""
    ];
    return [...toc, ...normalized].join("\n").trim();
  }

  function cleanHeadingText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .replace(/[.:;!?]+$/g, "")
      .trim();
  }

  function dedupeHeading(text, seen) {
    const key = String(text || "").toLowerCase();
    const count = (seen.get(key) || 0) + 1;
    seen.set(key, count);
    return count > 1 ? `${text} (${count})` : text;
  }

  function slugifyHeading(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function markdownToHtml(text) {
    const source = normalizeLineEndings(text);
    const fenceMap = new Map();
    let fenceIndex = 0;
    const withPlaceholders = source.replace(/```(\w+)?\n([\s\S]*?)```/g, (full, language, code) => {
      const key = `__MCP_FENCE_${fenceIndex}__`;
      fenceIndex += 1;
      fenceMap.set(key, `<pre><code class="language-${escapeHtml(language || "text")}">${escapeHtml(code.replace(/\n$/, ""))}</code></pre>`);
      return key;
    });
    const lines = withPlaceholders.split("\n");
    const html = [];
    let index = 0;
    while (index < lines.length) {
      const line = lines[index];
      const trim = line.trim();
      if (!trim) {
        index += 1;
        continue;
      }
      if (fenceMap.has(trim)) {
        html.push(fenceMap.get(trim));
        index += 1;
        continue;
      }
      if (/^#{1,6}\s+/.test(trim)) {
        const level = Math.min(6, trim.match(/^#+/)[0].length);
        const content = trim.replace(/^#{1,6}\s+/, "");
        html.push(`<h${level}>${inlineMarkdownToHtml(content)}</h${level}>`);
        index += 1;
        continue;
      }
      if (/^>\s+/.test(trim)) {
        const quoteLines = [];
        while (index < lines.length && /^>\s+/.test(lines[index].trim())) {
          quoteLines.push(lines[index].trim().replace(/^>\s+/, ""));
          index += 1;
        }
        html.push(`<blockquote><p>${inlineMarkdownToHtml(quoteLines.join("<br>"))}</p></blockquote>`);
        continue;
      }
      if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
        const ordered = /^\s*\d+[.)]\s+/.test(line);
        const tag = ordered ? "ol" : "ul";
        const items = [];
        while (index < lines.length) {
          const current = lines[index];
          const candidate = current.trim();
          if (ordered && /^\d+[.)]\s+/.test(candidate)) {
            items.push(candidate.replace(/^\d+[.)]\s+/, ""));
            index += 1;
            continue;
          }
          if (!ordered && /^[-*+]\s+/.test(candidate)) {
            items.push(candidate.replace(/^[-*+]\s+/, ""));
            index += 1;
            continue;
          }
          break;
        }
        html.push(`<${tag}>${items.map((item) => `<li>${inlineMarkdownToHtml(item)}</li>`).join("")}</${tag}>`);
        continue;
      }
      if (line.includes("|") && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])) {
        const header = splitMarkdownTableRow(line);
        const align = splitMarkdownTableRow(lines[index + 1]).map((cell) => {
          const left = cell.startsWith(":");
          const right = cell.endsWith(":");
          if (left && right) return "center";
          if (right) return "right";
          if (left) return "left";
          return "";
        });
        index += 2;
        const bodyRows = [];
        while (index < lines.length && lines[index].includes("|")) {
          bodyRows.push(splitMarkdownTableRow(lines[index]));
          index += 1;
        }
        html.push(
          `<table><thead><tr>${header.map((cell, col) => `<th${align[col] ? ` style="text-align:${align[col]}"` : ""}>${inlineMarkdownToHtml(cell)}</th>`).join("")}</tr></thead>` +
          `<tbody>${bodyRows.map((row) => `<tr>${row.map((cell, col) => `<td${align[col] ? ` style="text-align:${align[col]}"` : ""}>${inlineMarkdownToHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`
        );
        continue;
      }
      if (/^---+$/.test(trim) || /^\*\*\*+$/.test(trim) || /^___+$/.test(trim)) {
        html.push("<hr>");
        index += 1;
        continue;
      }
      const paragraph = [];
      while (index < lines.length && lines[index].trim() && !/^#{1,6}\s+/.test(lines[index].trim()) && !/^>\s+/.test(lines[index].trim()) && !/^\s*[-*+]\s+/.test(lines[index]) && !/^\s*\d+[.)]\s+/.test(lines[index]) && !fenceMap.has(lines[index].trim())) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      html.push(`<p>${inlineMarkdownToHtml(paragraph.join(" "))}</p>`);
    }
    return html.join("\n");
  }

  function splitMarkdownTableRow(line) {
    return String(line || "")
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());
  }

  function inlineMarkdownToHtml(text) {
    const escaped = escapeHtml(String(text || ""));
    return escaped
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/~~([^~]+)~~/g, "<del>$1</del>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function compareTexts(text, other, locale = "en") {
    const left = text.split(/\r?\n/);
    const right = String(other || "").split(/\r?\n/);
    const max = Math.max(left.length, right.length);
    const result = [];
    for (let index = 0; index < max; index += 1) {
      if (left[index] === right[index]) result.push(`  ${left[index] || ""}`);
      else {
        if (left[index]) result.push(`- ${left[index]}`);
        if (right[index]) result.push(`+ ${right[index]}`);
      }
    }
    return result.join("\n");
  }

  function testRegex(text, pattern, flags, locale = "en") {
    if (!pattern) return "";
    try {
      const regex = new RegExp(pattern, flags || "g");
      const matches = [...text.matchAll(regex)];
      return matches.length ? matches.map((match, index) => [`#${index + 1}: ${match[0]}`, ...match.slice(1).map((group, groupIndex) => `  ${out(locale, "group")} ${groupIndex + 1}: ${group}`)].join("\n")).join("\n\n") : out(locale, "noMatch");
    } catch (error) {
      return `${out(locale, "regexError")}: ${error.message}`;
    }
  }

  global.MCP = Object.assign(global.MCP || {}, {
      TOOL_IDS,
      PRIORITY_TOOL_IDS,
      TOOL_ICON_FILES,
      normalizeToolOrder,
      getEmojiLibrary,
      getSpecialCharacterLibrary,
      getTools,
    runTool,
    countWordReplacerMatches,
    detectDuplicateText,
    parseColorSafe,
    colorFormats,
    buildColorPalette,
    inspectTool
  });
})(globalThis);
