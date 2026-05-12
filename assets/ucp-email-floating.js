const UCP_EMAIL_FORM_CONFIG = {
  senderFormAction: "",
  method: "POST",
  usePlaceholderMode: true,
  emailFieldName: "email",
  hiddenFields: []
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

    const note = document.createElement("p");
    note.className = "ucp-email-float__note";
    note.textContent = copy.note;

    message = document.createElement("p");
    message.className = "ucp-email-float__message";
    message.setAttribute("role", "status");

    top.append(badge, close);
    form.append(label, emailInput, submit, createHiddenFields());
    content.append(top, title, text, form, note, message);
    panel.append(content);
    root.append(panel);
    document.body.appendChild(root);

    close.addEventListener("click", () => hide({ persistDismissal: true }));
    form.addEventListener("submit", handleSubmit);
    emailInput.addEventListener("input", () => setMessage(""));

    return root;
  };

  const show = ({ focus = false, ignoreDismissed = false } = {}) => {
    if (!canShow({ ignoreDismissed })) return;
    buildComponent();
    window.clearTimeout(hideTimer);
    root.classList.add("is-visible");
    root.setAttribute("aria-hidden", "false");
    hasShown = true;
    if (focus) {
      requestAnimationFrame(() => emailInput?.focus({ preventScroll: true }));
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
