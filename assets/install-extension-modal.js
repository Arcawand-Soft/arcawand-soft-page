(() => {
  const translations = {
    en: {
      title: "Coming soon",
      message: "The extension will be available soon. It is currently in beta testing with volunteer users. Thank you for your patience.",
      close: "Close",
      labels: ["install extension"]
    },
    fr: {
      title: "Bientôt disponible",
      message: "L'extension sera disponible prochainement. Elle est actuellement en cours de bêta test auprès d'utilisateurs volontaires. Merci de votre patience.",
      close: "Fermer",
      labels: ["installer l'extension"]
    },
    es: {
      title: "Disponible próximamente",
      message: "La extensión estará disponible próximamente. Actualmente está en beta con usuarios voluntarios. Gracias por tu paciencia.",
      close: "Cerrar",
      labels: ["instalar extension", "instalar extensión"]
    },
    it: {
      title: "Disponibile a breve",
      message: "L'estensione sarà disponibile prossimamente. Al momento è in beta test con utenti volontari. Grazie per la pazienza.",
      close: "Chiudi",
      labels: ["installa estensione"]
    },
    de: {
      title: "Bald verfügbar",
      message: "Die Erweiterung wird bald verfügbar sein. Sie befindet sich derzeit im Betatest mit freiwilligen Nutzern. Vielen Dank für Ihre Geduld.",
      close: "Schließen",
      labels: ["extension installieren", "erweiterung installieren"]
    },
    ro: {
      title: "În curând",
      message: "Extensia va fi disponibilă în curând. În prezent este testată în versiune beta de utilizatori voluntari. Îți mulțumim pentru răbdare.",
      close: "Închide",
      labels: ["instalează extensia"]
    },
    pt: {
      title: "Em breve",
      message: "A extensão estará disponível em breve. Neste momento, está em teste beta com utilizadores voluntários. Agradecemos a sua paciência.",
      close: "Fechar",
      labels: ["instalar extensão"]
    },
    ar: {
      title: "قريبًا",
      message: "سيصبح الامتداد متاحًا قريبًا. وهو حاليًا في مرحلة الاختبار التجريبي مع مستخدمين متطوعين. شكرًا لصبرك.",
      close: "إغلاق",
      labels: ["تثبيت الامتداد"]
    },
    zh: {
      title: "即将推出",
      message: "该扩展程序即将上线，目前正由志愿用户进行测试。感谢您的耐心等待。",
      close: "关闭",
      labels: ["安装扩展程序"]
    },
    ja: {
      title: "近日公開",
      message: "この拡張機能は近日公開予定です。現在、ボランティアユーザーによるベータテストを実施しています。しばらくお待ちください。",
      close: "閉じる",
      labels: ["拡張機能をインストール"]
    },
    ru: {
      title: "Скоро",
      message: "Расширение скоро станет доступно. Сейчас оно проходит бета-тестирование с участием добровольцев. Спасибо за терпение.",
      close: "Закрыть",
      labels: ["установить расширение"]
    },
    nl: {
      title: "Binnenkort beschikbaar",
      message: "De extensie is binnenkort beschikbaar en wordt momenteel getest door vrijwillige bètagebruikers. Bedankt voor je geduld.",
      close: "Sluiten",
      labels: ["extensie installeren"]
    },
    pl: {
      title: "Już wkrótce",
      message: "Rozszerzenie będzie dostępne już wkrótce. Obecnie jest testowane przez użytkowników wersji beta. Dziękujemy za cierpliwość.",
      close: "Zamknij",
      labels: ["zainstaluj rozszerzenie"]
    },
    tr: {
      title: "Yakında",
      message: "Uzantı yakında kullanıma sunulacak. Şu anda gönüllü kullanıcılarla beta testinde. Sabrınız için teşekkür ederiz.",
      close: "Kapat",
      labels: ["uzantıyı yükle"]
    },
    ko: {
      title: "곧 출시됩니다",
      message: "확장 프로그램이 곧 공개됩니다. 현재 자원 사용자들과 베타 테스트를 진행하고 있습니다. 기다려 주셔서 감사합니다.",
      close: "닫기",
      labels: ["확장 프로그램 설치"]
    },
    hi: {
      title: "जल्द उपलब्ध",
      message: "एक्सटेंशन जल्द उपलब्ध होगा। अभी स्वयंसेवी उपयोगकर्ताओं के साथ इसका बीटा परीक्षण चल रहा है। आपके धैर्य के लिए धन्यवाद।",
      close: "बंद करें",
      labels: ["एक्सटेंशन इंस्टॉल करें"]
    }
  };

  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const getLang = () => {
    const injected = window.__ARCAWAND_LANG__;
    if (translations[injected]) return injected;
    const pathLang = window.location.pathname.split("/").filter(Boolean)[0];
    if (translations[pathLang]) return pathLang;
    const htmlLang = document.documentElement.lang?.slice(0, 2);
    return translations[htmlLang] ? htmlLang : "en";
  };

  const getCopy = () => translations[getLang()] || translations.en;

  const injectStyle = () => {
    if (document.getElementById("arcawand-install-modal-style")) return;
    const style = document.createElement("style");
    style.id = "arcawand-install-modal-style";
    style.textContent = `
      .arcawand-install-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 1.25rem;
        background:
          radial-gradient(circle at 20% 10%, hsl(var(--primary, 262 83% 58%) / .22), transparent 34%),
          rgba(5, 7, 14, .68);
        backdrop-filter: blur(18px);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease;
      }
      .arcawand-install-modal-overlay.is-open {
        opacity: 1;
        pointer-events: auto;
      }
      .arcawand-install-modal {
        width: min(100%, 31rem);
        border: 1px solid rgba(255, 255, 255, .14);
        border-radius: 1.4rem;
        background:
          linear-gradient(145deg, rgba(18, 20, 34, .96), rgba(38, 27, 74, .94)),
          rgba(14, 16, 27, .96);
        box-shadow: 0 34px 90px rgba(0, 0, 0, .45), 0 0 0 1px hsl(var(--primary, 262 83% 58%) / .12) inset;
        color: #fff;
        transform: translateY(.55rem) scale(.98);
        transition: transform .22s cubic-bezier(.22, .9, .18, 1);
        overflow: hidden;
      }
      .arcawand-install-modal-overlay.is-open .arcawand-install-modal {
        transform: translateY(0) scale(1);
      }
      .arcawand-install-modal::before {
        content: "";
        display: block;
        height: .22rem;
        background: linear-gradient(90deg, hsl(var(--primary, 262 83% 58%)), hsl(var(--accent, 191 91% 56%)), hsl(var(--primary, 262 83% 58%)));
        background-size: 220% 100%;
        animation: arcawandInstallShine 2.8s linear infinite;
      }
      .arcawand-install-modal-content {
        padding: 1.55rem;
      }
      .arcawand-install-modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
      }
      .arcawand-install-modal-title {
        margin: 0;
        font: 950 1.45rem/1.12 Geist, Inter, system-ui, sans-serif;
        letter-spacing: 0;
      }
      .arcawand-install-modal-message {
        margin: .75rem 0 0;
        color: rgba(255, 255, 255, .76);
        font: 650 1rem/1.65 Geist, Inter, system-ui, sans-serif;
      }
      .arcawand-install-modal-close {
        display: inline-grid;
        place-items: center;
        width: 2.35rem;
        height: 2.35rem;
        border: 1px solid rgba(255, 255, 255, .16);
        border-radius: 999px;
        background: rgba(255, 255, 255, .08);
        color: #fff;
        font: 950 1.25rem/1 Geist, Inter, system-ui, sans-serif;
        cursor: pointer;
        transition: transform .16s ease, background .16s ease, border-color .16s ease;
      }
      .arcawand-install-modal-close:hover {
        transform: translateY(-1px);
        border-color: hsl(var(--primary, 262 83% 58%) / .75);
        background: hsl(var(--primary, 262 83% 58%) / .28);
      }
      .arcawand-install-modal-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.4rem;
      }
      .arcawand-install-modal-ok {
        min-height: 2.85rem;
        padding: 0 1.25rem;
        border: 0;
        border-radius: .9rem;
        background: hsl(var(--primary, 262 83% 58%));
        color: #fff;
        font: 900 .95rem/1 Geist, Inter, system-ui, sans-serif;
        cursor: pointer;
        box-shadow: 0 16px 34px hsl(var(--primary, 262 83% 58%) / .32);
        transition: transform .16s ease, filter .16s ease;
      }
      .arcawand-install-modal-ok:hover {
        transform: translateY(-1px);
        filter: brightness(1.06);
      }
      @keyframes arcawandInstallShine {
        from { background-position: 0% 50%; }
        to { background-position: 220% 50%; }
      }
      @media (prefers-reduced-motion: reduce) {
        .arcawand-install-modal-overlay,
        .arcawand-install-modal,
        .arcawand-install-modal::before,
        .arcawand-install-modal-close,
        .arcawand-install-modal-ok {
          animation: none;
          transition: none;
        }
      }
    `;
    document.head.appendChild(style);
  };

  let overlay;
  let lastFocused;

  const ensureModal = () => {
    injectStyle();
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "arcawand-install-modal-overlay";
    overlay.setAttribute("role", "presentation");
    overlay.innerHTML = `
      <section class="arcawand-install-modal" role="dialog" aria-modal="true" aria-labelledby="arcawand-install-modal-title" aria-describedby="arcawand-install-modal-message">
        <div class="arcawand-install-modal-content">
          <div class="arcawand-install-modal-header">
            <div>
              <h2 id="arcawand-install-modal-title" class="arcawand-install-modal-title"></h2>
              <p id="arcawand-install-modal-message" class="arcawand-install-modal-message"></p>
            </div>
            <button class="arcawand-install-modal-close" type="button" aria-label="Close">×</button>
          </div>
          <div class="arcawand-install-modal-actions">
            <button class="arcawand-install-modal-ok" type="button"></button>
          </div>
        </div>
      </section>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest(".arcawand-install-modal-close") || event.target.closest(".arcawand-install-modal-ok")) {
        closeModal();
      }
    });

    return overlay;
  };

  const openModal = () => {
    const copy = getCopy();
    const modal = ensureModal();
    lastFocused = document.activeElement;
    modal.querySelector(".arcawand-install-modal-title").textContent = copy.title;
    modal.querySelector(".arcawand-install-modal-message").textContent = copy.message;
    modal.querySelector(".arcawand-install-modal-ok").textContent = copy.close;
    modal.querySelector(".arcawand-install-modal-close").setAttribute("aria-label", copy.close);
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => modal.querySelector(".arcawand-install-modal-close")?.focus({ preventScroll: true }));
  };

  const closeModal = () => {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  };

  window.ArcawandInstallExtensionModal = {
    open: openModal,
    close: closeModal
  };

  const isInstallTrigger = (element) => {
    if (element.matches?.("[data-install-extension-trigger='true']")) return true;
    const text = normalize(element.textContent);
    if (!text) return false;
    return Object.values(translations)
      .flatMap((entry) => entry.labels)
      .map(normalize)
      .some((label) => text === label || text.includes(label));
  };

  document.addEventListener(
    "click",
    (event) => {
      const trigger = event.target.closest("a, button");
      if (!trigger || !isInstallTrigger(trigger)) return;
      event.preventDefault();
      event.stopPropagation();
      openModal();
    },
    true
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay?.classList.contains("is-open")) {
      event.preventDefault();
      closeModal();
    }
  });
})();
