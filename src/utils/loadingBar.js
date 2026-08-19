let bar = null;
let activeRequests = 0;
let trickleTimer = null;
let hideTimer = null;

const getBar = () => {
  if (!bar || !document.body.contains(bar)) {
    bar = document.createElement("div");

    Object.assign(bar.style, {
      position: "fixed",
      top: 0,
      left: 0,
      height: "3px",
      width: "0%",
      background: "linear-gradient(90deg, #0F52BA, #2F80ED)",
      boxShadow: "0 0 8px rgba(24,95,165,0.6)",
      zIndex: 10000,
      opacity: 0,
      transition: "width 0.25s ease, opacity 0.3s ease"
    });

    document.body.appendChild(bar);
  }

  return bar;
};

const setWidth = (pct) => {
  const el = getBar();
  el.style.opacity = 1;
  el.style.width = `${pct}%`;
};

export const startLoading = () => {
  activeRequests += 1;

  if (activeRequests > 1) return;

  clearTimeout(hideTimer);
  clearInterval(trickleTimer);

  setWidth(0);
  requestAnimationFrame(() => setWidth(25));

  let pct = 25;
  trickleTimer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 8, 90);
    setWidth(pct);
  }, 300);
};

export const stopLoading = () => {
  activeRequests = Math.max(0, activeRequests - 1);

  if (activeRequests > 0) return;

  clearInterval(trickleTimer);
  setWidth(100);

  hideTimer = setTimeout(() => {
    const el = getBar();
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.width = "0%";
    }, 300);
  }, 200);
};
