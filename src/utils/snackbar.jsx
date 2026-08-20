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

let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes ec-toast-in {
      0%   { opacity: 0; transform: translateX(36px) scale(.92); }
      60%  { opacity: 1; transform: translateX(-4px) scale(1.015); }
      100% { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes ec-toast-out {
      to { opacity: 0; transform: translateX(28px) scale(.96); }
    }
    .ec-toast { animation: ec-toast-in .5s cubic-bezier(.22,1.2,.36,1) both; }
    .ec-toast.ec-toast-leaving { animation: ec-toast-out .28s ease forwards; }
    .ec-toast:hover { box-shadow: 0 14px 36px rgba(15,23,42,0.22); transform: translateY(-2px); }
    .ec-toast-close {
      background: none; border: 1px solid #dce2e8; color: #9aa5b1; border-radius: 50%;
      width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0; font-size: 14px; line-height: 1; padding: 0;
      transition: background .15s ease, color .15s ease, border-color .15s ease, transform .15s ease;
    }
    .ec-toast-close:hover { background: #f1f3f5; color: #42505e; border-color: #c7cfd6; transform: rotate(90deg); }
    .ec-toast-ring circle.ec-ring-track { opacity: .18; }
    .ec-toast-ring circle.ec-ring-progress { transition: stroke-dashoffset linear; }
  `;
  document.head.appendChild(style);
};

const THEME = {
  success: { accent: "#27AE60", accent2: "#1E8449", title: "Success!", icon: "check" },
  error: { accent: "#EB5757", accent2: "#C0392B", title: "Error!", icon: "cross" },
  info: { accent: "#2F80ED", accent2: "#1B5FC1", title: "Information!", icon: "info" },
  warning: { accent: "#E0A800", accent2: "#B8860B", title: "Warning!", icon: "bang" }
};

// Trusted, hard-coded markup only — never interpolate caller-supplied text into this.
const ICON_MARKUP = {
  check:
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cross:
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></svg>',
  info: '<span style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:14px;color:#fff;">i</span>',
  bang: '<span style="font-weight:800;font-size:15px;color:#fff;">!</span>'
};

const RING_R = 16;
const RING_CIRC = 2 * Math.PI * RING_R;

export const showSnackbar = (type = "info", message = "", duration = 4500) => {
  injectStyles();

  const theme = THEME[type] || THEME.info;
  const host = getContainer();

  const toast = document.createElement("div");
  toast.className = "ec-toast";
  Object.assign(toast.style, {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "linear-gradient(180deg, #ffffff, #fbfcfe)",
    borderLeft: `4px solid ${theme.accent}`,
    borderRadius: "12px",
    boxShadow: "0 10px 28px rgba(15,23,42,0.16), 0 2px 6px rgba(15,23,42,0.06)",
    padding: "13px 14px",
    width: "352px",
    maxWidth: "90vw",
    pointerEvents: "auto",
    transition: "box-shadow .2s ease, transform .2s ease",
  });

  // Icon + circular countdown ring
  const ringSize = 38;
  const iconWrap = document.createElement("div");
  iconWrap.style.cssText = `position:relative;width:${ringSize}px;height:${ringSize}px;flex-shrink:0;margin-top:1px;`;

  const ringSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ringSvg.setAttribute("class", "ec-toast-ring");
  ringSvg.setAttribute("width", String(ringSize));
  ringSvg.setAttribute("height", String(ringSize));
  ringSvg.setAttribute("viewBox", "0 0 40 40");
  ringSvg.style.cssText = "position:absolute;inset:0;transform:rotate(-90deg);";

  const trackCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  trackCircle.setAttribute("class", "ec-ring-track");
  trackCircle.setAttribute("cx", "20");
  trackCircle.setAttribute("cy", "20");
  trackCircle.setAttribute("r", String(RING_R));
  trackCircle.setAttribute("fill", "none");
  trackCircle.setAttribute("stroke", theme.accent);
  trackCircle.setAttribute("stroke-width", "2.5");

  const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  progressCircle.setAttribute("class", "ec-ring-progress");
  progressCircle.setAttribute("cx", "20");
  progressCircle.setAttribute("cy", "20");
  progressCircle.setAttribute("r", String(RING_R));
  progressCircle.setAttribute("fill", "none");
  progressCircle.setAttribute("stroke", theme.accent);
  progressCircle.setAttribute("stroke-width", "2.5");
  progressCircle.setAttribute("stroke-linecap", "round");
  progressCircle.setAttribute("stroke-dasharray", String(RING_CIRC));
  progressCircle.style.strokeDashoffset = "0";

  ringSvg.appendChild(trackCircle);
  ringSvg.appendChild(progressCircle);

  const iconDisk = document.createElement("div");
  iconDisk.style.cssText =
    `position:absolute;inset:5px;border-radius:50%;` +
    `background:linear-gradient(135deg, ${theme.accent}, ${theme.accent2});` +
    "display:flex;align-items:center;justify-content:center;" +
    "box-shadow:0 2px 6px rgba(0,0,0,.18);";
  iconDisk.innerHTML = ICON_MARKUP[theme.icon];

  iconWrap.appendChild(ringSvg);
  iconWrap.appendChild(iconDisk);

  const textWrap = document.createElement("div");
  textWrap.style.cssText = "flex:1;min-width:0;padding-top:1px;";

  const titleEl = document.createElement("div");
  titleEl.textContent = theme.title;
  titleEl.style.cssText = `font-weight:700;font-size:13.5px;color:${theme.accent2};margin-bottom:2px;letter-spacing:.01em;`;

  const msgEl = document.createElement("div");
  msgEl.textContent = message;
  msgEl.style.cssText = "font-size:12.5px;color:#42505e;line-height:1.45;word-break:break-word;";

  textWrap.appendChild(titleEl);
  textWrap.appendChild(msgEl);

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "ec-toast-close";
  closeBtn.setAttribute("aria-label", "Dismiss");
  closeBtn.textContent = "×";

  toast.appendChild(iconWrap);
  toast.appendChild(textWrap);
  toast.appendChild(closeBtn);
  host.appendChild(toast);

  let remaining = duration;
  let startedAt = Date.now();
  let dismissTimer = null;
  let dismissed = false;
  let pausedOffset = 0;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    clearTimeout(dismissTimer);
    toast.classList.add("ec-toast-leaving");
    setTimeout(() => toast.remove(), 280);
  };

  // Jumps the ring to `fromOffset` with no transition, then animates it on to full
  // (RING_CIRC, i.e. empty) over `ms` — resuming from a paused offset instead of
  // always restarting the sweep from a full ring.
  const runTimer = (ms, fromOffset = 0) => {
    startedAt = Date.now();

    progressCircle.style.transition = "none";
    progressCircle.style.strokeDashoffset = String(fromOffset);
    // Force reflow so the jump above is committed before the transition is attached below.
    void progressCircle.getBoundingClientRect();
    progressCircle.style.transition = `stroke-dashoffset ${ms}ms linear`;
    // A short timeout (not rAF) so the kick-off still fires even if the tab is
    // backgrounded or otherwise not compositing frames right when the toast opens.
    setTimeout(() => {
      progressCircle.style.strokeDashoffset = String(RING_CIRC);
    }, 20);

    dismissTimer = setTimeout(dismiss, ms);
  };

  const pauseTimer = () => {
    clearTimeout(dismissTimer);
    const elapsed = Date.now() - startedAt;
    remaining = Math.max(0, remaining - elapsed);
    pausedOffset = parseFloat(getComputedStyle(progressCircle).strokeDashoffset) || 0;
    progressCircle.style.transition = "none";
    progressCircle.style.strokeDashoffset = String(pausedOffset);
  };

  const resumeTimer = () => {
    if (remaining <= 0) { dismiss(); return; }
    runTimer(remaining, pausedOffset);
  };

  closeBtn.addEventListener("click", dismiss);
  toast.addEventListener("mouseenter", pauseTimer);
  toast.addEventListener("mouseleave", resumeTimer);

  runTimer(duration);
};
