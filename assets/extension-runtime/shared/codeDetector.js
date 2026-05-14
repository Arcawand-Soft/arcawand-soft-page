(function initCodeDetector(global) {
  const LANGUAGE_RULES = [
    ["dev-typescript", "TypeScript", [/:\s*(string|number|boolean|unknown|any|void)\b/g, /\binterface\s+\w+/g, /\btype\s+\w+\s*=/g, /\bimplements\s+\w+/g, /\bnamespace\s+\w+/g], ["import", "export", "const", "let"]],
    ["dev-react", "React / JSX", [/<[A-Z][\w.]*[\s>]/g, /\buse(State|Effect|Memo|Callback|Ref)\s*\(/g, /\bReact\./g, /\bclassName=/g, /\bjsx\b/g], ["props", "return", "component"]],
    ["dev-javascript", "JavaScript", [/\b(function|const|let|var)\s+\w+/g, /=>/g, /\bconsole\.log\s*\(/g, /\bPromise\b/g, /\bmodule\.exports\b/g, /\brequire\s*\(/g], ["async", "await", "return"]],
    ["dev-python", "Python", [/^\s*def\s+\w+\s*\(/gm, /^\s*class\s+\w+[:(]/gm, /^\s*from\s+\w+.*\s+import\s+/gm, /^\s*import\s+\w+/gm, /\bself\./g, /\bprint\s*\(/g], ["elif", "lambda", "None", "True", "False"]],
    ["dev-php", "PHP", [/<\?php/g, /\$\w+/g, /\bfunction\s+\w+\s*\(/g, /->\w+/g, /\bnamespace\s+[\w\\]+/g], ["echo", "array", "public", "private"]],
    ["dev-html", "HTML", [/<!doctype\s+html/i, /<\/?(html|head|body|div|span|section|article|a|img|script|style)\b/gi, /\s(class|id|href|src)=["']/g], []],
    ["dev-css", "CSS", [/[.#][\w-]+\s*\{/g, /\b(display|position|grid|flex|color|background|margin|padding|border)\s*:/g, /@media\s*\(/g, /:\s*(hover|focus|root)\b/g], []],
    ["dev-scss", "SCSS / Sass", [/\$[\w-]+\s*:/g, /@mixin\s+/g, /@include\s+/g, /&:(hover|focus|active)/g], []],
    ["dev-json", "JSON", [/^\s*\{[\s\S]*\}\s*$/g, /"[\w.-]+"\s*:/g, /^\s*\[[\s\S]*\]\s*$/g], []],
    ["dev-yaml", "YAML", [/^\s*[\w.-]+:\s+.+$/gm, /^\s*-\s+[\w"{[]/gm, /^\s{2,}[\w.-]+:/gm], ["version", "services", "name"]],
    ["dev-markdown", "Markdown", [/^\s{0,3}#{1,6}\s+\S+/gm, /^\s{0,3}[-*+]\s+\[[ xX]\]\s+\S+/gm, /^\s*\|[^|\r\n]+(?:\|[^|\r\n]+)+\|\s*$/gm, /^\s*\[[^\]]+\]:\s+\S+/gm, /\[[^\]]+\]\([^)]+\)/g], []],
    ["dev-xml", "XML", [/<\?xml/g, /<\/[A-Za-z][\w:-]*>/g, /<[A-Za-z][\w:-]*\s+[^>]*\/>/g], []],
    ["dev-sql", "SQL", [/\bSELECT\s+[\s\S]*\bFROM\b/gi, /\b(INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\b/gi, /\bJOIN\b|\bWHERE\b|\bGROUP\s+BY\b/gi], []],
    ["dev-shell", "Shell / Bash", [/^#!\/(usr\/bin\/env\s+)?(bash|sh|zsh)/gm, /\b(echo|grep|awk|sed|curl|chmod|sudo)\b/g, /\$\{?\w+\}?/g, /\|\s*\w+/g], []],
    ["dev-powershell", "PowerShell", [/\b(Get|Set|New|Remove|Start|Stop)-[A-Z]\w+/g, /\$\w+\s*=/g, /\|\s*Where-Object\b/g, /\bparam\s*\(/g], []],
    ["dev-java", "Java", [/\bpublic\s+(class|interface|enum)\s+\w+/g, /\bSystem\.out\.println\s*\(/g, /\bimport\s+java\./g, /\bnew\s+\w+\s*\(/g], ["static", "void"]],
    ["dev-kotlin", "Kotlin", [/\bfun\s+\w+\s*\(/g, /\bval\s+\w+/g, /\bvar\s+\w+/g, /\bdata\s+class\b/g, /\bobject\s+\w+/g], []],
    ["dev-swift", "Swift", [/\bfunc\s+\w+\s*\(/g, /\b(let|var)\s+\w+\s*:/g, /\bimport\s+SwiftUI\b/g, /\bstruct\s+\w+:\s*View\b/g], []],
    ["dev-objectivec", "Objective-C", [/#import\s+<.*\.h>/g, /@\s*(interface|implementation|property|end)\b/g, /\[[A-Za-z_]\w*\s+\w+/g], []],
    ["dev-cpp", "C++", [/#include\s+<iostream>/g, /\bstd::\w+/g, /\btemplate\s*</g, /\bcout\s*<</g, /\bclass\s+\w+\s*\{/g], []],
    ["dev-c", "C", [/#include\s+<stdio\.h>/g, /\bprintf\s*\(/g, /\bmalloc\s*\(/g, /\bstruct\s+\w+\s*\{/g, /\bint\s+main\s*\(/g], []],
    ["dev-csharp", "C#", [/\busing\s+System\b/g, /\bnamespace\s+\w+/g, /\bpublic\s+(class|record|interface)\s+\w+/g, /\bConsole\.Write(Line)?\s*\(/g], []],
    ["dev-go", "Go", [/\bpackage\s+main\b/g, /\bfunc\s+\w+\s*\(/g, /\bimport\s+\(/g, /\bfmt\.Print/g, /:=/g], []],
    ["dev-rust", "Rust", [/\bfn\s+\w+\s*\(/g, /\blet\s+mut\s+\w+/g, /\bimpl\s+\w+/g, /\bprintln!\s*\(/g, /\buse\s+std::/g], []],
    ["dev-ruby", "Ruby", [/^\s*def\s+\w+/gm, /^\s*class\s+\w+/gm, /\bputs\s+/g, /\bend\s*$/gm, /(?:^|[^\w.+-])@[A-Za-z_]\w*/g], []],
    ["dev-dockerfile", "Dockerfile", [/^\s*FROM\s+[\w./:-]+/gim, /^\s*(RUN|COPY|ADD|CMD|ENTRYPOINT|ENV|WORKDIR)\s+/gim], []],
    ["dev-nginx", "Nginx", [/\bserver\s*\{/g, /\blocation\s+\/.*\{/g, /\bproxy_pass\s+/g, /\blisten\s+\d+/g], []],
    ["dev-apache", "Apache", [/<VirtualHost\b/gi, /\bRewriteRule\b/g, /\bDocumentRoot\b/g, /\bAllowOverride\b/g], []],
    ["dev-terraform", "Terraform / HCL", [/\bresource\s+"[^"]+"\s+"[^"]+"\s*\{/g, /\bprovider\s+"[^"]+"\s*\{/g, /\bvariable\s+"[^"]+"/g], []],
    ["dev-graphql", "GraphQL", [/\b(query|mutation|subscription)\s+\w*/g, /\bfragment\s+\w+\s+on\s+\w+/g, /\btype\s+\w+\s*\{/g], []],
    ["dev-regex", "Regex", [/^\/.+\/[gimsuy]*$/g, /\(\?:|\(\?=|\(\?!|\\[dwsb]/g, /\[[^\]]+\][+*?]?/g], []],
    ["dev-vue", "Vue", [/<template>[\s\S]*<\/template>/g, /<script\s+setup/g, /\bdefineProps\s*\(/g, /\bv-model=/g], []],
    ["dev-svelte", "Svelte", [/<script>[\s\S]*<\/script>/g, /\{#(if|each|await)\b/g, /\bon:click=/g], []],
    ["dev-lua", "Lua", [/\blocal\s+\w+\s*=/g, /\bfunction\s+\w+\s*\(/g, /\bend\s*$/gm, /\bthen\s*$/gm], []],
    ["dev-r", "R", [/<-\s*/g, /\blibrary\s*\(/g, /\bdata\.frame\s*\(/g, /\bggplot\s*\(/g], []],
    ["dev-matlab", "MATLAB", [/^\s*%[^\r\n]*/gm, /\bfunction\s+\[?.*?\]?\s*=\s*\w+\(/g, /\bend\s*$/gm, /\bdisp\s*\(/g], []],
    ["dev-dart", "Dart", [/\bvoid\s+main\s*\(/g, /\bclass\s+\w+\s+extends\s+StatelessWidget/g, /\bWidget\s+build\s*\(/g, /\bFuture<.*>/g], []],
    ["dev-elixir", "Elixir", [/\bdefmodule\s+\w+/g, /\bdef\s+\w+\s+do/g, /\|>/g, /\bend\s*$/gm], []],
    ["dev-erlang", "Erlang", [/-module\(/g, /-export\(/g, /\w+\([^)]*\)\s*->/g], []],
    ["dev-scala", "Scala", [/\bobject\s+\w+/g, /\bdef\s+\w+\s*\(/g, /\bval\s+\w+/g, /\bcase\s+class\b/g], []],
    ["dev-perl", "Perl", [/use\s+strict;/g, /my\s+\$\w+/g, /\bsub\s+\w+/g, /\$\w+\s*=~/g], []],
    ["dev-groovy", "Groovy", [/\bdef\s+\w+\s*=/g, /\bprintln\s+/g, /\bplugins\s*\{/g, /\bdependencies\s*\{/g], []],
    ["dev-vba", "VBA", [/\bSub\s+\w+\s*\(/gi, /\bEnd\s+Sub\b/gi, /\bDim\s+\w+\s+As\b/gi, /\bRange\("/g], []],
    ["dev-julia", "Julia", [/\bfunction\s+\w+\s*\(/g, /\bend\s*$/gm, /\bprintln\s*\(/g, /\busing\s+\w+/g], []],
    ["dev-assembly", "Assembly", [/^\s*(mov|push|pop|jmp|cmp|lea|call)\s+/gim, /^\s*[A-Za-z_]\w*:\s*$/gm], []],
    ["dev-toml", "INI / TOML", [/^\s*\[[\w.-]+\]\s*$/gm, /^\s*[\w.-]+\s*=\s*["\w.-]+/gm], []]
  ];

  function detectCodeLanguage(input) {
    const content = String(input || "");
    const trimmed = content.trim();
    if (trimmed.length < 12) return emptyResult();
    const fenced = detectFencedCode(trimmed);
    if (fenced.isCode) return fenced;
    const structural = detectStructuralLanguage(trimmed);
    if (structural.isCode) return structural;
    if (looksLikePlainTextContactMessage(trimmed)) return emptyResult();
    if (looksLikeProseNotCode(trimmed)) return emptyResult();
    const codeDensity = codeSymbolDensity(trimmed);
    const lineCount = trimmed.split(/\r?\n/).length;
    const scores = LANGUAGE_RULES.map(([id, name, patterns, words]) => {
      const regexScore = patterns.reduce((score, pattern) => score + countMatches(trimmed, pattern) * 8, 0);
      const wordScore = words.reduce((score, word) => score + (new RegExp(`\\b${escapeRegex(word)}\\b`, "i").test(trimmed) ? 3 : 0), 0);
      return { id, name, score: regexScore + wordScore };
    }).sort((a, b) => b.score - a.score);
    const best = resolveBestScore(trimmed, scores);
    const structureScore = codeDensity * 35 + Math.min(lineCount, 12);
    const isCode = best.score >= 8 || (best.score >= 4 && structureScore >= 15) || (structureScore >= 22 && /[{}();=<>\[\]$]/.test(trimmed));
    return {
      isCode,
      languageId: isCode ? best.id : "dev-general",
      languageName: isCode ? best.name : "General",
      confidence: Math.min(0.99, (best.score + structureScore) / 70),
      scores
    };
  }

  function detectFencedCode(text) {
    const blocks = [...String(text || "").matchAll(/```([a-z0-9+#._-]*)\s*\n([\s\S]*?)```/gi)]
      .map((match) => ({
        hint: normalizeLanguageHint(match[1]),
        code: String(match[2] || "").trim()
      }))
      .filter((block) => block.code.length >= 12);
    if (!blocks.length) return emptyResult();
    const hinted = blocks.find((block) => block.hint && languageIdFromHint(block.hint));
    if (hinted) {
      const id = languageIdFromHint(hinted.hint);
      const name = languageNameFromId(id);
      return {
        isCode: true,
        languageId: id,
        languageName: name,
        confidence: 0.96,
        scores: [{ id, name, score: 80 }]
      };
    }
    const best = blocks
      .map((block) => detectCodeLanguageWithoutFences(block.code))
      .sort((left, right) => right.confidence - left.confidence)[0];
    if (best?.isCode) return Object.assign({}, best, { confidence: Math.max(best.confidence, 0.88) });
    return emptyResult();
  }

  function detectCodeLanguageWithoutFences(trimmed) {
    const structural = detectStructuralLanguage(trimmed);
    if (structural.isCode) return structural;
    if (looksLikePlainTextContactMessage(trimmed)) return emptyResult();
    if (looksLikeProseNotCode(trimmed)) return emptyResult();
    const codeDensity = codeSymbolDensity(trimmed);
    const lineCount = trimmed.split(/\r?\n/).length;
    const scores = LANGUAGE_RULES.map(([id, name, patterns, words]) => {
      const regexScore = patterns.reduce((score, pattern) => score + countMatches(trimmed, pattern) * 8, 0);
      const wordScore = words.reduce((score, word) => score + (new RegExp(`\\b${escapeRegex(word)}\\b`, "i").test(trimmed) ? 3 : 0), 0);
      return { id, name, score: regexScore + wordScore };
    }).sort((a, b) => b.score - a.score);
    const best = resolveBestScore(trimmed, scores);
    const structureScore = codeDensity * 35 + Math.min(lineCount, 12);
    const isCode = best.score >= 8 || (best.score >= 4 && structureScore >= 15) || (structureScore >= 22 && /[{}();=<>\[\]$]/.test(trimmed));
    return {
      isCode,
      languageId: isCode ? best.id : "dev-general",
      languageName: isCode ? best.name : "General",
      confidence: Math.min(0.99, (best.score + structureScore) / 70),
      scores
    };
  }

  function resolveBestScore(text, scores) {
    const best = scores[0] || { id: "dev-general", name: "General", score: 0 };
    const signature = detectSignatureLanguage(text);
    if (signature.isCode) return { id: signature.languageId, name: signature.languageName, score: Math.max(best.score, signature.scores[0]?.score || 100) };
    if (best.id === "dev-markdown" && !looksLikeMarkdownDocument(text)) {
      return scores.find((score) => score.id !== "dev-markdown" && score.id !== "dev-yaml") || { id: "dev-general", name: "General", score: 0 };
    }
    if (best.id === "dev-yaml" && !looksLikeStrictYaml(text)) {
      return scores.find((score) => score.id !== "dev-yaml" && (score.id !== "dev-markdown" || looksLikeMarkdownDocument(text))) || { id: "dev-general", name: "General", score: 0 };
    }
    if (best.id === "dev-css" && looksLikeHtmlDocument(text)) {
      return { id: "dev-html", name: "HTML", score: best.score + 80 };
    }
    if (best.id === "dev-css" && !looksLikeCssStylesheet(text)) {
      return scores.find((score) => score.id !== "dev-css" && score.id !== "dev-yaml") || { id: "dev-general", name: "General", score: 0 };
    }
    if (best.id === "dev-php" && !looksLikePhpScript(text)) {
      return scores.find((score) => score.id !== "dev-php" && score.id !== "dev-yaml" && score.id !== "dev-toml") || { id: "dev-general", name: "General", score: 0 };
    }
    if (best.id === "dev-matlab" && !looksLikeMatlabScript(text)) {
      return scores.find((score) => score.id !== "dev-matlab" && score.id !== "dev-yaml" && score.id !== "dev-toml") || { id: "dev-general", name: "General", score: 0 };
    }
    if (best.id === "dev-toml" && !looksLikeTomlDocument(text)) {
      return scores.find((score) => score.id !== "dev-toml" && score.id !== "dev-yaml") || { id: "dev-general", name: "General", score: 0 };
    }
    if (best.id === "dev-ruby" && !looksLikeRubyScript(text)) {
      return scores.find((score) => score.id !== "dev-ruby" && score.id !== "dev-yaml") || { id: "dev-general", name: "General", score: 0 };
    }
    if (best.id !== "dev-yaml" || looksLikeStrictYaml(text)) return best;
    return scores.find((score) => score.id !== "dev-yaml" && (score.id !== "dev-markdown" || looksLikeMarkdownDocument(text))) || { id: "dev-general", name: "General", score: 0 };
  }

  function detectStructuralLanguage(text) {
    if (looksLikeJsonDocument(text)) return languageResult("dev-json", "JSON", 0.97, 120);
    const signature = detectSignatureLanguage(text);
    if (signature.isCode) return signature;
    if (looksLikeHtmlDocument(text)) return languageResult("dev-html", "HTML", 0.98, 118);
    if (looksLikeXmlDocument(text)) return languageResult("dev-xml", "XML", 0.95, 100);
    if (looksLikePythonScript(text)) return languageResult("dev-python", "Python", 0.96, 115);
    if (looksLikeCssStylesheet(text)) return languageResult("dev-css", "CSS", 0.94, 95);
    if (/^\s*FROM\s+[\w./:-]+/im.test(text) && /^\s*(RUN|COPY|ADD|CMD|ENTRYPOINT|ENV|WORKDIR)\s+/im.test(text)) {
      return languageResult("dev-dockerfile", "Dockerfile", 0.94, 95);
    }
    if (/^\s*#!\/(usr\/bin\/env\s+)?(bash|sh|zsh)\b/m.test(text)) return languageResult("dev-shell", "Shell / Bash", 0.94, 95);
    if (/^\s*#!\/(usr\/bin\/env\s+)?python\b/m.test(text)) return languageResult("dev-python", "Python", 0.94, 95);
    if (/\bSELECT\s+[\s\S]{1,120}\bFROM\b/i.test(text) || /\b(INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE)\b/i.test(text)) {
      return languageResult("dev-sql", "SQL", 0.92, 90);
    }
    if (looksLikeStrictYaml(text)) return languageResult("dev-yaml", "YAML", 0.9, 88);
    return emptyResult();
  }

  function detectSignatureLanguage(text) {
    const value = String(text || "");
    const trimmed = value.trim();
    if (!trimmed) return emptyResult();
    if (looksLikePlainTextContactMessage(trimmed) || looksLikeProseNotCode(trimmed)) return emptyResult();
    if (looksLikePythonScript(value)) return languageResult("dev-python", "Python", 0.96, 119);
    if (looksLikeMarkdownDocument(value)) return languageResult("dev-markdown", "Markdown", 0.94, 118);
    if (looksLikeApacheConfig(value)) return languageResult("dev-apache", "Apache", 0.97, 124);
    if (looksLikeGraphqlDocument(value)) return languageResult("dev-graphql", "GraphQL", 0.97, 124);
    if (looksLikePowerShellScript(value)) return languageResult("dev-powershell", "PowerShell", 0.97, 123);
    if (looksLikeCSharpScript(value)) return languageResult("dev-csharp", "C#", 0.97, 123);
    if (looksLikeSwiftScript(value)) return languageResult("dev-swift", "Swift", 0.96, 121);
    if (looksLikeDartScript(value)) return languageResult("dev-dart", "Dart", 0.96, 121);
    if (looksLikeElixirScript(value)) return languageResult("dev-elixir", "Elixir", 0.96, 121);
    if (looksLikeScalaScript(value)) return languageResult("dev-scala", "Scala", 0.96, 121);
    if (looksLikePerlScript(value)) return languageResult("dev-perl", "Perl", 0.96, 121);
    if (looksLikeGroovyScript(value)) return languageResult("dev-groovy", "Groovy", 0.95, 119);
    if (looksLikeJuliaScript(value)) return languageResult("dev-julia", "Julia", 0.96, 121);
    if (looksLikeMatlabScript(value)) return languageResult("dev-matlab", "MATLAB", 0.93, 108);
    if (looksLikeScssStylesheet(value)) return languageResult("dev-scss", "SCSS / Sass", 0.96, 117);
    const cssLike = looksLikeCssStylesheet(value);
    if (/<\?(?:php|=)/.test(value)) return languageResult("dev-php", "PHP", 0.97, 124);
    if (!cssLike && /\bnamespace\s+[\w\\]+;|\buse\s+[\w\\]+;|\$[A-Za-z_]\w*\s*=|\bfunction\s+\w+\s*\([^)]*\)\s*\{/m.test(value)) {
      const phpSignals = regexCount(value, /\$\w+\s*=|->\w+|::\w+|\becho\b|\barray\s*\(|\bpublic\s+function\b|\bprivate\s+function\b|\bprotected\s+function\b/g);
      if (phpSignals >= 3) return languageResult("dev-php", "PHP", 0.94, 112);
    }
    if (/<template[\s>][\s\S]*<\/template>/i.test(value) && (/<script[\s>]|<script\s+setup|v-model=|v-if=|v-for=|\bdefineProps\s*\(/i.test(value))) {
      return languageResult("dev-vue", "Vue", 0.96, 121);
    }
    if (/<script[\s>][\s\S]*<\/script>/i.test(value) && /\{#(?:if|each|await)\b|on:\w+=|\bexport\s+let\b/.test(value)) {
      return languageResult("dev-svelte", "Svelte", 0.95, 120);
    }
    const tsSignals = regexCount(value, /\binterface\s+\w+|\btype\s+\w+\s*=|:\s*(?:string|number|boolean|unknown|any|void|Record<|Array<)|\benum\s+\w+|\bimplements\s+\w+/g);
    const reactSignals = regexCount(value, /<[A-Z][\w.]*[\s/>]|\buse(?:State|Effect|Memo|Callback|Ref|Context)\s*\(|\bReact\.|\bclassName=|\btsx\b/g);
    if (reactSignals >= 2 && /\b(?:return|const|function|export|import)\b/.test(value)) return languageResult("dev-react", "React / JSX", 0.95, 118);
    if (tsSignals >= 1 && /\b(?:import|export|const|let|function|class|interface|type)\b/.test(value)) return languageResult("dev-typescript", "TypeScript", 0.95, 118);
    const jsSignals = regexCount(value, /\b(?:const|let|var|function|import|export|require|module\.exports|async|await|Promise)\b|=>|\bconsole\.\w+\s*\(/g);
    if (jsSignals >= 3 && !looksLikeJsonDocument(value)) return languageResult("dev-javascript", "JavaScript", 0.91, 104);
    if (cssLike) {
      return languageResult("dev-css", "CSS", 0.94, 110);
    }
    if (looksLikeHtmlDocument(value)) return languageResult("dev-html", "HTML", 0.98, 118);
    if (looksLikeXmlDocument(value)) return languageResult("dev-xml", "XML", 0.95, 100);
    if (/^\s*FROM\s+[\w./:-]+/im.test(value) && /^\s*(RUN|COPY|ADD|CMD|ENTRYPOINT|ENV|WORKDIR|EXPOSE|USER|VOLUME)\s+/im.test(value)) return languageResult("dev-dockerfile", "Dockerfile", 0.95, 114);
    if (/^\s*#!\/(usr\/bin\/env\s+)?(?:bash|sh|zsh)\b/m.test(value) || regexCount(value, /^\s*(?:echo|grep|awk|sed|curl|chmod|sudo|export|source|cd|cp|mv|rm|mkdir)\b/gm) >= 3) {
      return languageResult("dev-shell", "Shell / Bash", 0.93, 106);
    }
    if (regexCount(value, /\b(?:Get|Set|New|Remove|Start|Stop|Invoke|Where|ForEach)-[A-Z]\w+|\|\s*(?:Where-Object|ForEach-Object)|\bparam\s*\(/g) >= 2) {
      return languageResult("dev-powershell", "PowerShell", 0.94, 108);
    }
    if (/\bSELECT\s+[\s\S]{1,160}\bFROM\b/i.test(value) || /\b(?:INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|WITH\s+\w+\s+AS)\b/i.test(value)) {
      return languageResult("dev-sql", "SQL", 0.93, 108);
    }
    if (/\bpackage\s+main\b|\bfunc\s+\w+\s*\([^)]*\)\s*(?:\([^)]*\)\s*)?\{|\bimport\s+\(/.test(value)) return languageResult("dev-go", "Go", 0.94, 112);
    if (/\bfn\s+\w+\s*\([^)]*\)\s*(?:->\s*[\w:<>]+)?\s*\{|\blet\s+mut\s+\w+|\bimpl\s+\w+|\buse\s+std::|\bprintln!\s*\(/.test(value)) return languageResult("dev-rust", "Rust", 0.94, 112);
    if (/#include\s+<iostream>|\bstd::\w+|\btemplate\s*<|\bcout\s*<<|\busing\s+namespace\s+std\b/.test(value)) return languageResult("dev-cpp", "C++", 0.94, 112);
    if (/#include\s+<stdio\.h>|\bint\s+main\s*\(|\bprintf\s*\(|\bmalloc\s*\(|\bstruct\s+\w+\s*\{/.test(value)) return languageResult("dev-c", "C", 0.93, 108);
    if (/\busing\s+System\b|\bnamespace\s+\w+|\bpublic\s+(?:class|record|interface)\s+\w+|\bConsole\.Write(?:Line)?\s*\(/.test(value)) return languageResult("dev-csharp", "C#", 0.94, 112);
    if (/\bpublic\s+(?:class|interface|enum)\s+\w+|\bimport\s+java\.|\bSystem\.out\.println\s*\(|\bstatic\s+void\s+main\s*\(/.test(value)) return languageResult("dev-java", "Java", 0.94, 112);
    if (/\bfun\s+\w+\s*\(|\bval\s+\w+|\bvar\s+\w+|\bdata\s+class\b|\bobject\s+\w+/.test(value) && !/\bfunction\b/.test(value)) return languageResult("dev-kotlin", "Kotlin", 0.91, 103);
    if (/@(?:interface|implementation|property|end)\b|#import\s+<.*\.h>|\[[A-Za-z_]\w*\s+\w+/.test(value)) return languageResult("dev-objectivec", "Objective-C", 0.93, 108);
    if (looksLikeRubyScript(value)) return languageResult("dev-ruby", "Ruby", 0.9, 102);
    if (/\bresource\s+"[^"]+"\s+"[^"]+"\s*\{|\bprovider\s+"[^"]+"\s*\{|\bvariable\s+"[^"]+"/.test(value)) return languageResult("dev-terraform", "Terraform / HCL", 0.94, 112);
    if (/\b(?:query|mutation|subscription)\s+\w*|\bfragment\s+\w+\s+on\s+\w+|\btype\s+\w+\s*\{/.test(value)) return languageResult("dev-graphql", "GraphQL", 0.92, 106);
    if (looksLikeTomlDocument(value)) return languageResult("dev-toml", "INI / TOML", 0.9, 96);
    if (looksLikeMatlabScript(value)) return languageResult("dev-matlab", "MATLAB", 0.9, 96);
    return emptyResult();
  }

  function languageResult(id, name, confidence, score) {
    return {
      isCode: true,
      languageId: id,
      languageName: name,
      confidence,
      scores: [{ id, name, score }]
    };
  }

  function looksLikeHtmlDocument(text) {
    const value = String(text || "");
    const tags = [...value.matchAll(/<\/?[a-z][\w:-]*(?:\s+[^<>]*?)?>/gi)];
    if (!tags.length) return false;
    const tagNames = tags
      .map((match) => (match[0].match(/^<\/?\s*([a-z][\w:-]*)/i) || [])[1]?.toLowerCase())
      .filter(Boolean);
    const htmlTags = tagNames.filter((name) => /^(html|head|body|main|section|article|aside|header|footer|nav|div|span|p|a|img|picture|source|table|thead|tbody|tfoot|tr|td|th|ul|ol|li|strong|em|b|i|br|hr|form|input|button|label|script|style|template|figure|figcaption|h[1-6])$/.test(name));
    const closingTags = (value.match(/<\/[a-z][\w:-]*\s*>/gi) || []).length;
    const attributes = (value.match(/\s(?:class|id|href|src|alt|title|style|role|width|height|align|target|rel|data-[\w-]+|aria-[\w-]+)=["'][\s\S]*?["']/gi) || []).length;
    const emailTableTags = (value.match(/<\/?(table|tbody|thead|tfoot|tr|td|th)\b/gi) || []).length;
    const comments = (value.match(/<!--[\s\S]*?-->/g) || []).length;
    const inlineStyles = (value.match(/\sstyle=["'][\s\S]*?["']/gi) || []).length;
    const hasDoctype = /<!doctype\s+html/i.test(value);
    const hasHtmlContainer = /<\/?(html|body|head)\b/i.test(value);
    const hasRealMarkup = htmlTags.length >= 3 && (closingTags >= 2 || attributes >= 2);
    const hasEmailMarkup = emailTableTags >= 3 && attributes >= 4;
    const hasInlineHtml = tags.length >= 4 && inlineStyles >= 2 && attributes >= 4;
    return hasDoctype || hasHtmlContainer || hasRealMarkup || hasEmailMarkup || hasInlineHtml || comments >= 2 && tags.length >= 3;
  }

  function looksLikeXmlDocument(text) {
    const value = String(text || "");
    if (looksLikeHtmlDocument(value)) return false;
    const tags = value.match(/<\/?[A-Za-z_][\w:.-]*(?:\s+[^<>]*?)?>/g) || [];
    const closingTags = value.match(/<\/[A-Za-z_][\w:.-]*\s*>/g) || [];
    const selfClosingTags = value.match(/<[A-Za-z_][\w:.-]*(?:\s+[^<>]*?)?\/>/g) || [];
    return /<\?xml\b/i.test(value) || (tags.length >= 4 && closingTags.length + selfClosingTags.length >= 2 && /xmlns[:=]|\b[A-Za-z_][\w:.-]*=["']/.test(value));
  }

  function looksLikeJsonDocument(text) {
    const value = String(text || "").trim();
    if (!/^[{[][\s\S]*[}\]]$/.test(value)) return false;
    try {
      const parsed = JSON.parse(value);
      return parsed !== null && (Array.isArray(parsed) || Object.prototype.toString.call(parsed) === "[object Object]");
    } catch (error) {
      return false;
    }
  }

  function looksLikePythonScript(text) {
    const value = String(text || "");
    const lines = value.split(/\r?\n/).filter((line) => line.trim());
    const importLines = (value.match(/^\s*(?:from\s+[\w.]+\s+import\s+[\w.*, ]+|import\s+[\w., ]+)$/gm) || []).length;
    const pythonCalls = (value.match(/\b(?:Path|open|print|len|range|enumerate|str|int|dict|list|set)\s*\(/g) || []).length;
    const pythonMethods = (value.match(/\.(?:read_text|write_text|replace|split|strip|append|extend|items|keys|values|get)\s*\(/g) || []).length;
    const assignments = (value.match(/^\s*[A-Za-z_]\w*\s*=\s*.+$/gm) || []).length;
    const comments = (value.match(/^\s*#[^\r\n]*/gm) || []).length;
    const hasDefOrClass = /^\s*def\s+\w+\s*\([^)]*\)\s*:/m.test(value) || /^\s*class\s+\w+(?:\([^)]*\))?\s*:/m.test(value);
    const hasPhpOrHtmlInsideStrings = /<\?php|<\/?[a-z][\w:-]*(?:\s+[^<>]*?)?>/i.test(value) && /"""|'''|["']/.test(value);
    const strongPython = importLines >= 1 && (pythonCalls + pythonMethods + assignments >= 3);
    const scriptShape = lines.length >= 5 && assignments >= 2 && pythonMethods >= 2 && comments >= 1;
    return hasDefOrClass || strongPython || scriptShape || (hasPhpOrHtmlInsideStrings && importLines >= 1 && pythonMethods >= 1);
  }

  function looksLikeMarkdownDocument(text) {
    const value = String(text || "");
    if (looksLikeHtmlDocument(value) || looksLikeJsonDocument(value)) return false;
    if (/^\s*(?:from\s+\w+|import\s+\w+|def\s+\w+|class\s+\w+|\w+\s*=|const\s+\w+|let\s+\w+|var\s+\w+|function\s+\w+)/m.test(value)) return false;
    const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const headingCount = regexCount(value, /^\s{0,3}#{1,6}\s+\S+/gm);
    const bulletCount = regexCount(value, /^\s{0,3}[-*+]\s+\S+/gm);
    const numberedCount = regexCount(value, /^\s{0,3}\d+\.\s+\S+/gm);
    const linkCount = regexCount(value, /\[[^\]]+\]\([^)]+\)/g);
    const quoteCount = regexCount(value, /^\s{0,3}>\s+\S+/gm);
    const taskCount = regexCount(value, /^\s{0,3}[-*+]\s+\[[ xX]\]\s+\S+/gm);
    const tableRowCount = regexCount(value, /^\s*\|[^|\r\n]+(?:\|[^|\r\n]+)+\|\s*$/gm);
    const frontMatter = /^---\s*\n[\s\S]{1,800}?\n---\s*(?:\n|$)/.test(value);
    const referenceDefs = regexCount(value, /^\s*\[[^\]]+\]:\s+\S+/gm);
    const proseLines = lines.filter((line) => {
      if (/^\s{0,3}(?:#{1,6}|[-*+]|\d+\.|>)\s+/.test(line)) return false;
      const words = line.match(/\b[\p{L}]{3,}\b/gu) || [];
      return words.length >= 7 || (line.length >= 45 && /[.!?…:]$/.test(line));
    }).length;
    const proseRatio = proseLines / Math.max(1, lines.length);
    const structuralMarkdown = frontMatter
      || taskCount >= 2
      || tableRowCount >= 2
      || referenceDefs >= 1
      || headingCount >= 2 && (linkCount >= 2 || quoteCount >= 2)
      || headingCount >= 3 && bulletCount + numberedCount >= 3;
    const lightweightFormattingOnly = headingCount <= 1
      && tableRowCount === 0
      && taskCount === 0
      && referenceDefs === 0
      && linkCount <= 1
      && quoteCount <= 1
      && proseRatio >= 0.18;
    if (lightweightFormattingOnly) return false;
    return structuralMarkdown;
  }

  function looksLikeApacheConfig(text) {
    const value = String(text || "");
    return /<VirtualHost\b[\s\S]*<\/VirtualHost>/i.test(value)
      || /<\/?(?:Directory|Location|Files|IfModule)\b/i.test(value)
      || regexCount(value, /^\s*(?:ServerName|DocumentRoot|AllowOverride|RewriteRule|RewriteCond|ProxyPass|ErrorLog|CustomLog)\b/gim) >= 2;
  }

  function looksLikeGraphqlDocument(text) {
    const value = String(text || "");
    const operations = regexCount(value, /^\s*(?:query|mutation|subscription)\s+\w*/gm);
    const fragments = regexCount(value, /^\s*fragment\s+\w+\s+on\s+\w+\s*\{/gm);
    const fields = regexCount(value, /^\s{2,}[A-Za-z_]\w*(?:\([^)]*\))?(?:\s+@[\w(])?\s*$/gm);
    const variables = regexCount(value, /\$[A-Za-z_]\w*\s*:\s*(?:\[?[\w!]+\]?)/g);
    return operations + fragments >= 1 && (fields >= 3 || variables >= 1);
  }

  function looksLikePowerShellScript(text) {
    const value = String(text || "");
    const variables = regexCount(value, /\$[A-Za-z_]\w+\s*=/g);
    const cmdlets = regexCount(value, /\b(?:Get|Set|New|Remove|Start|Stop|Invoke|Where|ForEach|Select|Write|Read|ConvertTo|ConvertFrom)-[A-Z]\w+/g);
    const psSyntax = regexCount(value, /\bparam\s*\(|\|\s*(?:Where-Object|ForEach-Object|Select-Object)|@\(|\$_\.|\s-eq\s|\s-ne\s|\s-gt\s|\s-lt\s|\s-like\s/g);
    return cmdlets >= 1 && variables + psSyntax >= 2;
  }

  function looksLikeCSharpScript(text) {
    const value = String(text || "");
    return /\busing\s+System\b/.test(value)
      || /\bConsole\.Write(?:Line)?\s*\(/.test(value)
      || /\bstatic\s+void\s+Main\s*\(/.test(value)
      || /\bnamespace\s+\w+/.test(value) && /\b(?:class|record|interface)\s+\w+/.test(value);
  }

  function looksLikeSwiftScript(text) {
    const value = String(text || "");
    const swiftSignals = regexCount(value, /^\s*import\s+(?:Foundation|SwiftUI|UIKit)\b/gm)
      + regexCount(value, /\bstruct\s+\w+\s*:\s*[\w,\s]+(?:\{)?/g)
      + regexCount(value, /\benum\s+\w+\s*\{/g)
      + regexCount(value, /\bfinal\s+class\s+\w+\s*\{/g)
      + regexCount(value, /\bfunc\s+\w+\s*\([^)]*\)\s*(?:->\s*[\[\]\w:]+)?\s*\{/g)
      + regexCount(value, /\blet\s+\w+\s*=\s*\w+\(/g)
      + regexCount(value, /\bvar\s+\w+\s*:\s*[\[\]\w:]+/g);
    return swiftSignals >= 3 && !/\bfun\s+\w+\s*\(/.test(value);
  }

  function looksLikeDartScript(text) {
    const value = String(text || "");
    const dartSignals = regexCount(value, /\bFuture<[^>]+>\s+\w+\s*\(/g)
      + regexCount(value, /\bfinal\s+\w+\s*=/g)
      + regexCount(value, /\bconst\s+\w+\s*\(/g)
      + regexCount(value, /\brequired\s+this\.\w+/g)
      + regexCount(value, /\bString\s+get\s+\w+\s*=>/g)
      + regexCount(value, /<\w+>\[/g);
    return dartSignals >= 2 || /\bvoid\s+main\s*\(\)\s*(?:async\s*)?\{/.test(value) && /\bfinal\b|\bconst\b/.test(value);
  }

  function looksLikeElixirScript(text) {
    const value = String(text || "");
    return /\bdefmodule\s+[A-Z]\w*(?:\.[A-Z]\w*)*\s+do/.test(value)
      || regexCount(value, /\bdefp?\s+\w+(?:\([^)]*\))?\s+do|\|>|@\w+|\bIO\.\w+\s*\(/g) >= 4;
  }

  function looksLikeScalaScript(text) {
    const value = String(text || "");
    const scalaSignals = regexCount(value, /\bcase\s+class\s+\w+|\bobject\s+\w+(?:\s+extends\s+\w+)?\s*\{|\bval\s+\w+|\bEither\[[^\]]+\]|\bRight\s*\(|\bLeft\s*\(|\bList\s*\(|=>|_\.\w+/g);
    return scalaSignals >= 4 && !/\bfun\s+\w+\s*\(/.test(value);
  }

  function looksLikePerlScript(text) {
    const value = String(text || "");
    const perlSignals = regexCount(value, /\buse\s+(?:strict|warnings)\s*;|\bmy\s+[$@%]\w+|\bsub\s+\w+\s*\{|foreach\s+my\s+\$\w+|=>|\$\w+\{[^}]+\}/g);
    return perlSignals >= 4;
  }

  function looksLikeGroovyScript(text) {
    const value = String(text || "");
    const groovySignals = regexCount(value, /\bdef\s+\w+\s*=|\bprintln\s+["']|\bnew\s+\w+\([^)]*:\s*|\.findAll\s*\{|\.(?:collect|each)\s*\{|\$\{[^}]+\}/g);
    return groovySignals >= 3 && !/^\s*def\s+\w+\s*\([^)]*\)\s*:/m.test(value);
  }

  function looksLikeJuliaScript(text) {
    const value = String(text || "");
    const juliaSignals = regexCount(value, /\bstruct\s+\w+|::\w+|\bend\s*$/gm)
      + regexCount(value, /\bfunction\s+\w+\([^)]*\)|\bprintln\s*\(|\bfilter\s*\(|->|\$\([^)]+\)/g);
    return juliaSignals >= 5 && /::\w+/.test(value);
  }

  function looksLikeCssStylesheet(text) {
    const value = String(text || "");
    if (looksLikeHtmlDocument(value)) return false;
    const selectorBlocks = value.match(/(?:^|[}\n])\s*(?:[#.][\w-]+|[a-z][\w-]*(?:[#.][\w-]+)?|\[[^\]]+\]|:[\w-]+|[*>+~][\s\w.#:[\]-]+|[\w.#:[\]-]+\s+[\w.#:[\]-]+)\s*(?:,[^{]+)?\{[^{}]*\b[\w-]+\s*:[^{};]+;?[^{}]*\}/gi) || [];
    const atRules = value.match(/@(media|supports|container|keyframes|font-face|page|layer)\b[\s\S]*?\{/gi) || [];
    const rootVars = value.match(/:root\s*\{[^{}]*--[\w-]+\s*:/gi) || [];
    return selectorBlocks.length >= 1 || atRules.length >= 1 || rootVars.length >= 1;
  }

  function looksLikeScssStylesheet(text) {
    const value = String(text || "");
    if (looksLikeHtmlDocument(value) || /<\?(?:php|=)/.test(value)) return false;
    const scssSignals = regexCount(value, /\$[\w-]+\s*:|@mixin\b|@include\b|@use\b|@forward\b|&:(?:hover|focus|active)|#{[^}]+}/g);
    const hasStyleBlock = /[#.a-z][\w.#:[\]\s-]*\{[\s\S]*\b[\w-]+\s*:/.test(value);
    return scssSignals >= 1 && hasStyleBlock;
  }

  function looksLikePhpScript(text) {
    const value = String(text || "");
    if (/<\?(?:php|=)/.test(value)) return true;
    if (/\$[\w-]+\s*:/.test(value) && /[#.a-z][\w.#:[\]\s-]*\{[\s\S]*\b[\w-]+\s*:/.test(value)) return false;
    const phpSignals = regexCount(value, /\$\w+\s*=|->\w+|::\w+|\becho\b|\barray\s*\(|\bpublic\s+function\b|\bprivate\s+function\b|\bprotected\s+function\b|\bnamespace\s+[\w\\]+;|\buse\s+[\w\\]+;/g);
    const hasPhpFunctionShape = /\bfunction\s+\w+\s*\([^)]*\)\s*\{/.test(value) && /\$\w+/.test(value);
    return phpSignals >= 3 || hasPhpFunctionShape;
  }

  function looksLikeMatlabScript(text) {
    const value = String(text || "");
    const lines = value.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) return false;
    const commentLines = (value.match(/^\s*%[^\r\n]*/gm) || []).length;
    const functionLines = (value.match(/^\s*function\s+(?:\[[^\]]+\]\s*=\s*)?\w+\s*\(/gm) || []).length;
    const matlabBuiltins = regexCount(value, /\b(?:disp|fprintf|plot|subplot|figure|linspace|zeros|ones|size|length|numel|meshgrid)\s*\(/g);
    const matrixOps = regexCount(value, /(?:\.\*|\.\/|\.\\|\.\^)|\[[\d\s,;.-]+\]/g);
    const endLines = (value.match(/^\s*end\s*$/gm) || []).length;
    const pythonLike = /^\s*(?:from\s+\w+|import\s+\w+|def\s+\w+|class\s+\w+)/m.test(value) || /\bprint\s*\(|\bPath\s*\(|\.replace\s*\(/.test(value);
    if (pythonLike) return false;
    const simpleMatlab = /^\s*[A-Za-z_]\w*\s*=\s*[^;\r\n]+;\s*$/m.test(value) && /\b(?:disp|fprintf|plot)\s*\(/.test(value);
    return functionLines >= 1 && (endLines >= 1 || matlabBuiltins >= 1 || matrixOps >= 1)
      || matlabBuiltins >= 2
      || simpleMatlab
      || (commentLines >= 2 && matrixOps >= 1 && endLines >= 1);
  }

  function looksLikeTomlDocument(text) {
    const value = String(text || "");
    if (looksLikeJsonDocument(value) || looksLikeHtmlDocument(value)) return false;
    const lines = value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && !line.startsWith(";"));
    if (lines.length < 3) return false;
    const sectionLines = lines.filter((line) => /^\[[A-Za-z0-9_.-]+\]$/.test(line));
    const assignmentLines = lines.filter((line) => /^[A-Za-z0-9_.-]+\s*=\s*(?:"[^"]*"|'[^']*'|\d+(?:\.\d+)?|true|false|\[[^\]]*\]|\{[^}]*\})\s*$/.test(line));
    const yamlLike = lines.filter((line) => /^[A-Za-z0-9_.-]+:\s+/.test(line));
    return assignmentLines.length >= 2 && yamlLike.length === 0 && (sectionLines.length >= 1 || assignmentLines.length / Math.max(1, lines.length) >= 0.65);
  }

  function looksLikeRubyScript(text) {
    const value = String(text || "");
    const rubyInstanceVariables = regexCount(value, /(?:^|[^\w.+-])@[A-Za-z_]\w*/g);
    const rubyDefinitions = regexCount(value, /^\s*(?:def|class|module)\s+\w+/gm);
    const rubyBlocks = regexCount(value, /\bdo\s*(?:\|[^|]*\|)?\s*$|^\s*end\s*$/gm);
    const rubyCalls = regexCount(value, /\b(?:puts|require|attr_reader|attr_accessor|attr_writer)\b/g);
    const rubyHashes = regexCount(value, /(?:^|[,{]\s*)[A-Za-z_]\w*:\s*[^,\n}]+/g) + regexCount(value, /=>/g);
    return (rubyDefinitions >= 1 && (rubyBlocks >= 1 || rubyCalls >= 1 || rubyInstanceVariables >= 1))
      || (rubyInstanceVariables >= 1 && rubyCalls + rubyHashes + rubyBlocks >= 2);
  }

  function looksLikeStrictYaml(text) {
    const lines = String(text || "")
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter((line) => line.trim() && !line.trim().startsWith("#"));
    if (lines.length < 4) return false;
    const keyLines = lines.filter((line) => /^\s{0,8}[A-Za-z_][\w.-]*:\s*(?:$|["'[{]|\d|true\b|false\b|null\b|[A-Za-z0-9_.\/-]+\s*$)/i.test(line));
    const listLines = lines.filter((line) => /^\s*-\s+(?:[\w"{[]|$)/.test(line));
    const indentedKeyLines = lines.filter((line) => /^\s{2,}[A-Za-z_][\w.-]*:\s*/.test(line));
    const proseLines = lines.filter((line) => line.length > 48 && /[.!?…]\s*$/.test(line.trim()));
    const yamlRatio = (keyLines.length + listLines.length) / Math.max(1, lines.length);
    const hasYamlSignal = indentedKeyLines.length > 0
      || listLines.length > 1
      || /\b(version|services|apiVersion|kind|metadata|spec|name|steps|jobs|script|image|ports|volumes):/i.test(text);
    return keyLines.length >= 3
      && yamlRatio >= 0.45
      && hasYamlSignal
      && proseLines.length <= Math.max(1, Math.floor(lines.length * 0.2));
  }

  function looksLikeProseNotCode(text) {
    const lines = String(text || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length < 2) return false;
    if (hasStrongCodeSignal(text)) return false;
    const longSentenceLines = lines.filter((line) => line.length >= 45 && /[.!?…]$/.test(line));
    const proseWordLines = lines.filter((line) => {
      const words = line.match(/\b[\p{L}]{3,}\b/gu) || [];
      return words.length >= 8 && !/[{}[\];]|=>|:=|<\/?\w+/.test(line);
    });
    const colonOnlyHeadings = lines.filter((line) => /^[\p{L}\d '"â€™().,-]{3,80}:\s*$/u.test(line));
    const proseRatio = (longSentenceLines.length + proseWordLines.length + colonOnlyHeadings.length) / Math.max(1, lines.length);
    const symbolDensity = codeSymbolDensity(text);
    return proseRatio >= 0.42 && symbolDensity < 0.045;
  }

  function looksLikePlainTextContactMessage(text) {
    const value = String(text || "").trim();
    if (!value || !/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(value)) return false;
    if (hasStrongCodeSignal(value)) return false;
    const withoutEmails = value.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, " ");
    if (/[{}[\];=<>$`|\\]/.test(withoutEmails)) return false;
    if (/=>|:=|::|^\s*[-+*/]|(?:^|\s)(?:def|class|module|function|const|let|var|import|export|return)\b/m.test(withoutEmails)) return false;
    const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const words = withoutEmails.match(/\b[\p{L}]{2,}\b/gu) || [];
    const naturalPunctuation = /(?:^|[\p{L}\d)"'â€™])\s*:\s+/u.test(withoutEmails)
      || /[.!?…]\s*$/.test(value)
      || words.length >= 7;
    return lines.length <= 3 && words.length >= 4 && naturalPunctuation && codeSymbolDensity(withoutEmails) < 0.055;
  }

  function hasStrongCodeSignal(text) {
    return /```[\s\S]*```/.test(text)
      || /^\s*(def|class|function|const|let|var|import|export|from|package|func|public|private|protected|interface|type|SELECT|INSERT|UPDATE|DELETE|CREATE|FROM)\b/m.test(text)
      || /[{};]\s*$/.test(text)
      || /=>|:=|==={0,1}|!=|<=|>=|\breturn\b|\bconsole\.log\s*\(|\bself\./.test(text)
      || /<\/?(html|body|div|span|section|script|style|template|[A-Z][A-Za-z0-9]*)\b/.test(text)
      || /^\s*[{[][\s\S]*[}\]]\s*$/.test(text)
      || /^#!\/(usr\/bin\/env\s+)?(bash|sh|zsh|python)/m.test(text);
  }

  function normalizeLanguageHint(hint) {
    return String(hint || "").trim().toLowerCase().replace(/^\./, "");
  }

  function languageIdFromHint(hint) {
    const aliases = {
      js: "dev-javascript",
      javascript: "dev-javascript",
      jsx: "dev-react",
      react: "dev-react",
      ts: "dev-typescript",
      typescript: "dev-typescript",
      tsx: "dev-react",
      py: "dev-python",
      python: "dev-python",
      html: "dev-html",
      css: "dev-css",
      scss: "dev-scss",
      sass: "dev-scss",
      json: "dev-json",
      md: "dev-markdown",
      markdown: "dev-markdown",
      yaml: "dev-yaml",
      yml: "dev-yaml",
      xml: "dev-xml",
      sql: "dev-sql",
      sh: "dev-shell",
      bash: "dev-shell",
      shell: "dev-shell",
      zsh: "dev-shell",
      ps1: "dev-powershell",
      powershell: "dev-powershell",
      java: "dev-java",
      kt: "dev-kotlin",
      kotlin: "dev-kotlin",
      swift: "dev-swift",
      objc: "dev-objectivec",
      "objective-c": "dev-objectivec",
      cpp: "dev-cpp",
      "c++": "dev-cpp",
      c: "dev-c",
      cs: "dev-csharp",
      csharp: "dev-csharp",
      php: "dev-php",
      go: "dev-go",
      golang: "dev-go",
      rs: "dev-rust",
      rust: "dev-rust",
      rb: "dev-ruby",
      ruby: "dev-ruby",
      dockerfile: "dev-dockerfile",
      docker: "dev-dockerfile",
      nginx: "dev-nginx",
      apache: "dev-apache",
      terraform: "dev-terraform",
      hcl: "dev-terraform",
      graphql: "dev-graphql",
      regex: "dev-regex",
      vue: "dev-vue",
      svelte: "dev-svelte",
      lua: "dev-lua",
      r: "dev-r",
      matlab: "dev-matlab",
      dart: "dev-dart",
      elixir: "dev-elixir",
      erlang: "dev-erlang",
      scala: "dev-scala",
      perl: "dev-perl",
      groovy: "dev-groovy",
      vba: "dev-vba",
      julia: "dev-julia",
      asm: "dev-assembly",
      assembly: "dev-assembly",
      toml: "dev-toml",
      ini: "dev-toml"
    };
    return aliases[normalizeLanguageHint(hint)] || "";
  }

  function languageNameFromId(id) {
    const rule = LANGUAGE_RULES.find(([currentId]) => currentId === id);
    return rule?.[1] || "General";
  }

  function countMatches(text, pattern) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const matcher = new RegExp(pattern.source, flags);
    return [...text.matchAll(matcher)].length;
  }

  function regexCount(text, pattern) {
    return countMatches(String(text || ""), pattern);
  }

  function codeSymbolDensity(text) {
    const symbols = (text.match(/[{}()[\];=<>$#@:`|\\]/g) || []).length;
    return Math.min(1, symbols / Math.max(1, text.length));
  }

  function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function emptyResult() {
    return { isCode: false, languageId: "dev-general", languageName: "General", confidence: 0, scores: [] };
  }

  global.MCP = Object.assign(global.MCP || {}, {
    detectCodeLanguage,
    isLikelyCode: (value) => detectCodeLanguage(value).isCode
  });
})(globalThis);
