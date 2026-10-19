(() => {
  const site = document.currentScript?.dataset.site;
  if (!site || ![site, `www.${site}`].includes(location.hostname)) return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl) return;
  if (document.querySelector('meta[name="robots"][content*="noindex"]')) return;
  let referrer = "";
  try { referrer = new URL(document.referrer).hostname.toLowerCase(); } catch {}
  function send(event) {
    try {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      const id = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
      const body = JSON.stringify({ id, event, path: location.pathname, referrer });
      fetch("/metrics/collect.php", { method: "POST", body, credentials: "omit", keepalive: true,
        headers: { "Content-Type": "application/json" }, referrerPolicy: "no-referrer" }).catch(() => {});
    } catch {}
  }
  let viewed = false;
  function view() { if (!viewed && document.visibilityState === "visible") { viewed = true; send("pageview"); } }
  view(); document.addEventListener("visibilitychange", view);
  document.addEventListener("click", e => {
    const link = e.target instanceof Element ? e.target.closest("a[data-analytics-event]") : null;
    if (link) send(link.dataset.analyticsEvent);
  }, { passive: true });
})();
