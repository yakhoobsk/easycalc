let container = null;

const getContainer = () => {
  if (!container || !document.body.contains(container)) {
    container = document.createElement("div");

    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column-reverse",
      gap: "12px",
      pointerEvents: "none"
    });

    document.body.appendChild(container);
  }

  return container;
};

const THEME = {
  success: { accent: "#27AE60", title: "Success!", icon: "check" },
  error: { accent: "#EB5757", title: "Error!", icon: "cross" },
  info: { accent: "#2F80ED", title: "Information!", icon: "info" },
  warning: { accent: "#E0A800", title: "Warning!", icon: "bang" }
};

// Trusted, hard-coded markup only — never interpolate caller-supplied text into this.
const ICON_MARKUP = {
  check:
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross:
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
  info: '<span style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:16px;color:#fff;">i</span>',
  bang: '<span style="font-weight:800;font-size:17px;color:#fff;">!</span>'
};

export const showSnackbar = (type = "info", message = "") => {
  const theme = THEME[type] || THEME.info;
  const host = getContainer();

  const toast = document.createElement("div");
  Object.assign(toast.style, {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "#fff",
    borderLeft: `4px solid ${theme.accent}`,
    borderRadius: "10px",
    boxShadow: "0 10px 28px rgba(15,23,42,0.18)",
    padding: "14px 16px",
    width: "340px",
    maxWidth: "90vw",
    opacity: 0,
    transform: "translateX(24px)",
    transition: "all 0.3s ease",
    pointerEvents: "auto"
  });

  const iconEl = document.createElement("div");
  iconEl.style.cssText =
    `width:34px;height:34px;border-radius:50%;background:${theme.accent};` +
    "display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;";
  iconEl.innerHTML = ICON_MARKUP[theme.icon];

  const textWrap = document.createElement("div");
  textWrap.style.cssText = "flex:1;min-width:0;";

  const titleEl = document.createElement("div");
  titleEl.textContent = theme.title;
  titleEl.style.cssText = `font-weight:700;font-size:14px;color:${theme.accent};margin-bottom:2px;`;

  const msgEl = document.createElement("div");
  msgEl.textContent = message;
  msgEl.style.cssText = "font-size:13px;color:#42505e;line-height:1.4;word-break:break-word;";

  textWrap.appendChild(titleEl);
  textWrap.appendChild(msgEl);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Dismiss");
  closeBtn.textContent = "×";
  closeBtn.style.cssText =
    "background:none;border:1px solid #d8dee5;color:#9aa5b1;border-radius:50%;" +
    "width:22px;height:22px;display:flex;align-items:center;justify-content:center;" +
    "cursor:pointer;flex-shrink:0;font-size:14px;line-height:1;padding:0;";

  toast.appendChild(iconEl);
  toast.appendChild(textWrap);
  toast.appendChild(closeBtn);
  host.appendChild(toast);

  let dismissTimer = null;

  const dismiss = () => {
    clearTimeout(dismissTimer);
    toast.style.opacity = 0;
    toast.style.transform = "translateX(24px)";
    setTimeout(() => toast.remove(), 300);
  };

  closeBtn.addEventListener("click", dismiss);

  requestAnimationFrame(() => {
    toast.style.opacity = 1;
    toast.style.transform = "translateX(0)";
  });

  dismissTimer = setTimeout(dismiss, 4500);
};
