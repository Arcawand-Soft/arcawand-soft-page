const UCP_EMAIL_FORM_CONFIG = {
  senderFormAction: "",
  method: "POST",
  usePlaceholderMode: false,
  emailFieldName: "email",
  hiddenFields: [],
  useSenderEmbed: true,
  senderAccountId: "3c436811c35406",
  senderFormId: "erkr86",
  senderUniversalScript: "https://cdn.sender.net/accounts_resources/universal.js",
  senderHostedFormUrl: "https://stats.sender.net/forms/erkr86/view"
};

(() => {
  const STORAGE_KEYS = {
    dismissed: "ucp_email_float_dismissed",
    submitted: "ucp_email_float_submitted",
    soonClosed: "ucp_soon_modal_closed"
  };

  const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
  const SCROLL_THRESHOLD = 0.3;
  const SOON_MODAL_DELAY_MS = 700;

  const translations = {
    en: {
      badge: "Coming soon",
      title: "Ultimate Clipboard Pro is coming soon",
      text: "Leave your email to be notified when the extension launches.",
      placeholder: "you@email.com",
      button: "Notify me",
      note: "No spam. Only the launch announcement.",
      placeholderSuccess: "Thanks! Sign-up will be enabled very soon.",
      realSuccess: "Thanks! We will notify you when Ultimate Clipboard Pro launches.",
      loadError: "The signup form could not be loaded. Open it here.",
      emailError: "Enter a valid email address.",
      closeLabel: "Close signup window",
      emailLabel: "Email address"
    },
    fr: {
      badge: "Bientôt disponible",
      title: "Ultimate Clipboard Pro arrive bientôt",
      text: "Laisse ton email pour être prévenu dès la sortie de l’extension.",
      placeholder: "ton@email.com",
      button: "Me prévenir",
      note: "Pas de spam. Uniquement l’annonce de sortie.",
      placeholderSuccess: "Merci ! L’inscription sera activée très bientôt.",
      realSuccess: "Merci ! Tu seras prévenu dès la sortie d’Ultimate Clipboard Pro.",
      loadError: "Le formulaire d’inscription n’a pas pu se charger. Ouvre-le ici.",
      emailError: "Entre une adresse email valide.",
      closeLabel: "Fermer la fenêtre d’inscription",
      emailLabel: "Adresse email"
    },
    es: {
      badge: "Muy pronto",
      title: "Ultimate Clipboard Pro llegará pronto",
      text: "Deja tu email para recibir un aviso cuando se lance la extensión.",
      placeholder: "tu@email.com",
      button: "Avisarme",
      note: "Sin spam. Solo el anuncio del lanzamiento.",
      placeholderSuccess: "¡Gracias! El registro se activará muy pronto.",
      realSuccess: "¡Gracias! Te avisaremos cuando se lance Ultimate Clipboard Pro.",
      loadError: "No se pudo cargar el formulario de registro. Ábrelo aquí.",
      emailError: "Introduce un email válido.",
      closeLabel: "Cerrar la ventana de registro",
      emailLabel: "Email"
    },
    it: {
      badge: "Prossimamente",
      title: "Ultimate Clipboard Pro arriverà presto",
      text: "Lascia la tua email per ricevere un avviso quando l’estensione sarà disponibile.",
      placeholder: "tua@email.com",
      button: "Avvisami",
      note: "Niente spam. Solo l’annuncio del lancio.",
      placeholderSuccess: "Grazie! L’iscrizione sarà attivata molto presto.",
      realSuccess: "Grazie! Ti avviseremo quando Ultimate Clipboard Pro sarà disponibile.",
      loadError: "Impossibile caricare il modulo di iscrizione. Aprilo qui.",
      emailError: "Inserisci un indirizzo email valido.",
      closeLabel: "Chiudi la finestra di iscrizione",
      emailLabel: "Email"
    },
    de: {
      badge: "Bald verfügbar",
      title: "Ultimate Clipboard Pro kommt bald",
      text: "Hinterlasse deine E-Mail, um benachrichtigt zu werden, sobald die Erweiterung erscheint.",
      placeholder: "du@email.com",
      button: "Benachrichtigen",
      note: "Kein Spam. Nur die Ankündigung zum Start.",
      placeholderSuccess: "Danke! Die Anmeldung wird sehr bald aktiviert.",
      realSuccess: "Danke! Wir benachrichtigen dich, sobald Ultimate Clipboard Pro erscheint.",
      loadError: "Das Anmeldeformular konnte nicht geladen werden. Öffne es hier.",
      emailError: "Gib eine gültige E-Mail-Adresse ein.",
      closeLabel: "Anmeldefenster schließen",
      emailLabel: "E-Mail-Adresse"
    }
  };

  const soonModalCloseWords = ["fermer", "close", "cerrar", "chiudi", "schließen", "schliessen"];

  let root;
  let form;
  let emailInput;
  let message;
  let senderEmbed;
  let senderScriptPromise;
  let hasShown = false;
  let hideTimer = 0;
  let scrollTicking = false;

  const isProductPage = () => window.location.pathname.includes("/ultimate-clipboard-pro");

  const getLanguage = () => {
    const pathLang = window.location.pathname.split("/").filter(Boolean)[0];
    if (translations[pathLang]) return pathLang;
    const htmlLang = document.documentElement.lang?.slice(0, 2).toLowerCase();
    return translations[htmlLang] ? htmlLang : "en";
  };

  const getCopy = () => translations[getLanguage()] || translations.en;

  const getStoredNumber = (key) => {
    const value = Number.parseInt(localStorage.getItem(key) || "", 10);
    return Number.isFinite(value) ? value : 0;
  };

  const hasSubmitted = () => localStorage.getItem(STORAGE_KEYS.submitted) === "true";

  const isDismissedRecently = () => {
    const dismissedAt = getStoredNumber(STORAGE_KEYS.dismissed);
    return dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_DURATION_MS;
  };

  const canShow = ({ ignoreDismissed = false } = {}) => {
    if (hasSubmitted()) return false;
    if (!ignoreDismissed && isDismissedRecently()) return false;
    return true;
  };

  const shouldUseSenderEmbed = () =>
    Boolean(
      UCP_EMAIL_FORM_CONFIG.useSenderEmbed &&
      UCP_EMAIL_FORM_CONFIG.senderAccountId &&
      UCP_EMAIL_FORM_CONFIG.senderFormId &&
      UCP_EMAIL_FORM_CONFIG.senderUniversalScript
    );

  const markSubmitted = () => {
    localStorage.setItem(STORAGE_KEYS.submitted, "true");
    window.setTimeout(() => hide({ persistDismissal: false }), 900);
  };

  const setMessage = (text, tone) => {
    if (!message) return;
    message.textContent = text || "";
    if (tone) {
      message.dataset.tone = tone;
    } else {
      message.removeAttribute("data-tone");
    }
  };

  const createHiddenFields = () => {
    const fragment = document.createDocumentFragment();
    const fields = Array.isArray(UCP_EMAIL_FORM_CONFIG.hiddenFields)
      ? UCP_EMAIL_FORM_CONFIG.hiddenFields
      : [];

    fields.forEach((field) => {
      if (!field || !field.name) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = String(field.name);
      input.value = field.value == null ? "" : String(field.value);
      fragment.appendChild(input);
    });

    return fragment;
  };

  const ensureSenderStub = () => {
    const senderName = "sender";
    window.Sender = senderName;
    window[senderName] = window[senderName] || function senderQueue() {
      (window[senderName].q = window[senderName].q || []).push(arguments);
    };
    window[senderName].l = window[senderName].l || 1 * new Date();
    window[senderName].on = window[senderName].on || function senderOn(event, callback) {
      window[senderName].listeners = window[senderName].listeners || {};
      (window[senderName].listeners[event] = window[senderName].listeners[event] || []).push(callback);
    };
    return window[senderName];
  };

  const registerSenderSubmissionListeners = () => {
    const sender = window.sender;
    if (typeof sender !== "function" || sender.__ucpEmailListenersAttached) return;
    sender.__ucpEmailListenersAttached = true;
    [
      "success",
      "submitted",
      "submit",
      "form_submit",
      "form_submitted",
      "subscription_success",
      "subscriber_created"
    ].forEach((eventName) => {
      try {
        sender.on(eventName, markSubmitted);
      } catch (_) {
        // Sender event names are public-widget dependent; unsupported names are harmless.
      }
    });
  };

  const loadSenderScript = () => {
    if (!shouldUseSenderEmbed()) return Promise.reject(new Error("Sender embed is not configured."));
    if (senderScriptPromise) return senderScriptPromise;

    const sender = ensureSenderStub();
    registerSenderSubmissionListeners();
    sender(UCP_EMAIL_FORM_CONFIG.senderAccountId);

    senderScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-ucp-sender-universal="true"]');
      if (existing) {
        if (existing.dataset.loaded === "true") {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Sender script failed to load.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = UCP_EMAIL_FORM_CONFIG.senderUniversalScript;
      script.dataset.ucpSenderUniversal = "true";
      script.addEventListener("load", () => {
        script.dataset.loaded = "true";
        registerSenderSubmissionListeners();
        resolve();
      }, { once: true });
      script.addEventListener("error", () => reject(new Error("Sender script failed to load.")), { once: true });
      document.head.appendChild(script);
    });

    return senderScriptPromise;
  };

  const renderSenderEmbed = () => {
    if (!senderEmbed || senderEmbed.dataset.senderLoading === "true") return;
    senderEmbed.dataset.senderLoading = "true";
    loadSenderScript()
      .then(() => {
        registerSenderSubmissionListeners();
        const sender = window.sender;
        if (typeof sender === "function") {
          try {
            sender("render");
          } catch (_) {
            // The universal script usually renders matching nodes automatically.
          }
        }
      })
      .catch(() => {
        const copy = getCopy();
        senderEmbed.replaceChildren();
        const fallback = document.createElement("a");
        fallback.className = "ucp-email-float__fallback-link";
        fallback.href = UCP_EMAIL_FORM_CONFIG.senderHostedFormUrl || "#";
        fallback.target = "_blank";
        fallback.rel = "noopener noreferrer";
        fallback.textContent = copy.loadError;
        senderEmbed.appendChild(fallback);
      });
  };

  const buildComponent = () => {
    if (root) return root;

    const copy = getCopy();
    root = document.createElement("aside");
    root.className = "ucp-email-float";
    root.setAttribute("aria-live", "polite");
    root.setAttribute("aria-hidden", "true");

    const panel = document.createElement("div");
    panel.className = "ucp-email-float__panel";

    const content = document.createElement("div");
    content.className = "ucp-email-float__content";

    const top = document.createElement("div");
    top.className = "ucp-email-float__top";

    const badge = document.createElement("span");
    badge.className = "ucp-email-float__badge";
    badge.textContent = copy.badge;

    const close = document.createElement("button");
    close.className = "ucp-email-float__close";
    close.type = "button";
    close.setAttribute("aria-label", copy.closeLabel);
    close.textContent = "×";

    const title = document.createElement("h2");
    title.className = "ucp-email-float__title";
    title.textContent = copy.title;

    const text = document.createElement("p");
    text.className = "ucp-email-float__text";
    text.textContent = copy.text;

    const note = document.createElement("p");
    note.className = "ucp-email-float__note";
    note.textContent = copy.note;

    message = document.createElement("p");
    message.className = "ucp-email-float__message";
    message.setAttribute("role", "status");

    top.append(badge, close);
    content.append(top, title, text);

    if (shouldUseSenderEmbed()) {
      senderEmbed = document.createElement("div");
      senderEmbed.className = "ucp-email-float__sender sender-form-field";
      senderEmbed.dataset.senderFormId = UCP_EMAIL_FORM_CONFIG.senderFormId;
      content.append(senderEmbed);
    } else {
      form = document.createElement("form");
      form.className = "ucp-email-float__form";
      form.method = UCP_EMAIL_FORM_CONFIG.method || "POST";
      form.noValidate = false;
      if (UCP_EMAIL_FORM_CONFIG.senderFormAction) {
        form.action = UCP_EMAIL_FORM_CONFIG.senderFormAction;
      }

      const label = document.createElement("label");
      label.className = "ucp-email-float__label";
      label.htmlFor = "ucp-email-float-email";
      label.textContent = copy.emailLabel;

      emailInput = document.createElement("input");
      emailInput.id = "ucp-email-float-email";
      emailInput.className = "ucp-email-float__input";
      emailInput.type = "email";
      emailInput.required = true;
      emailInput.autocomplete = "email";
      emailInput.inputMode = "email";
      emailInput.name = UCP_EMAIL_FORM_CONFIG.emailFieldName || "email";
      emailInput.placeholder = copy.placeholder;

      const submit = document.createElement("button");
      submit.className = "ucp-email-float__button";
      submit.type = "submit";
      submit.textContent = copy.button;

      form.append(label, emailInput, submit, createHiddenFields());
      content.append(form);
    }

    content.append(note, message);
    panel.append(content);
    root.append(panel);
    document.body.appendChild(root);

    close.addEventListener("click", () => hide({ persistDismissal: true }));
    form?.addEventListener("submit", handleSubmit);
    emailInput?.addEventListener("input", () => setMessage(""));

    return root;
  };

  const show = ({ focus = false, ignoreDismissed = false } = {}) => {
    if (!canShow({ ignoreDismissed })) return;
    buildComponent();
    window.clearTimeout(hideTimer);
    root.classList.add("is-visible");
    root.setAttribute("aria-hidden", "false");
    hasShown = true;
    if (shouldUseSenderEmbed()) {
      renderSenderEmbed();
    }
    if (focus) {
      requestAnimationFrame(() => {
        if (emailInput) {
          emailInput.focus({ preventScroll: true });
        } else {
          root.querySelector(".ucp-email-float__close")?.focus({ preventScroll: true });
        }
      });
    }
  };

  const hide = ({ persistDismissal = false } = {}) => {
    if (!root) return;
    root.classList.remove("is-visible");
    root.setAttribute("aria-hidden", "true");
    if (persistDismissal) {
      localStorage.setItem(STORAGE_KEYS.dismissed, String(Date.now()));
    }
  };

  const handleSubmit = (event) => {
    const copy = getCopy();
    if (!emailInput?.checkValidity()) {
      event.preventDefault();
      setMessage(copy.emailError, "error");
      emailInput?.focus({ preventScroll: true });
      return;
    }

    if (!UCP_EMAIL_FORM_CONFIG.senderFormAction || UCP_EMAIL_FORM_CONFIG.usePlaceholderMode) {
      event.preventDefault();
      setMessage(copy.placeholderSuccess, "success");
      return;
    }

    localStorage.setItem(STORAGE_KEYS.submitted, "true");
    setMessage(copy.realSuccess, "success");
  };

  const getScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollable = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight
    );
    return scrollTop / scrollable;
  };

  const handleScroll = () => {
    if (scrollTicking || hasShown || !canShow()) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      scrollTicking = false;
      if (!hasShown && getScrollProgress() >= SCROLL_THRESHOLD) {
        show();
      }
    });
  };

  const normalize = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const isSoonModalCloseTrigger = (target) => {
    const button = target?.closest?.("button, a");
    if (!button) return false;
    if (button.closest(".ucp-email-float")) return false;
    if (
      button.matches(".arcawand-install-modal-close, .arcawand-install-modal-ok") ||
      button.closest(".arcawand-install-modal-close, .arcawand-install-modal-ok")
    ) {
      return true;
    }
    const text = normalize(button.textContent || button.getAttribute("aria-label"));
    return soonModalCloseWords.some((word) => text === normalize(word));
  };

  const scheduleAfterSoonModalClose = ({ ignoreDismissed = false } = {}) => {
    if (hasSubmitted()) return;
    localStorage.setItem(STORAGE_KEYS.soonClosed, String(Date.now()));
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      show({ focus: false, ignoreDismissed });
    }, SOON_MODAL_DELAY_MS);
  };

  const bindSoonModalCloseDetection = () => {
    document.addEventListener(
      "click",
      (event) => {
        if (!isSoonModalCloseTrigger(event.target)) return;
        scheduleAfterSoonModalClose();
      },
      true
    );

    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") return;
        if (!document.querySelector(".arcawand-install-modal-overlay.is-open")) return;
        scheduleAfterSoonModalClose();
      },
      true
    );
  };

  const init = () => {
    if (!isProductPage() || hasSubmitted()) return;
    buildComponent();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && root?.classList.contains("is-visible")) {
        hide({ persistDismissal: true });
      }
    });
    bindSoonModalCloseDetection();
  };

  window.addEventListener("message", (event) => {
    const origin = String(event.origin || "");
    if (!origin.includes("sender.net")) return;
    const payload = typeof event.data === "string" ? event.data : JSON.stringify(event.data || {});
    if (/success|submitted|subscribed|subscriber/i.test(payload)) {
      markSubmitted();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
