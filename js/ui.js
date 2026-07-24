// ui.js — DOM helpers, icons, toasts, modal/prompt, drawer
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

export function el(tag, attrs = {}, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k === "text") n.textContent = v;
    else if (k === "dataset") Object.assign(n.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") n.addEventListener(k.slice(2).toLowerCase(), v);
    else n.setAttribute(k, v);
  }
  for (const c of children.flat()) { if (c == null) continue; n.append(c.nodeType ? c : document.createTextNode(String(c))); }
  return n;
}

const P = (d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
export const ICONS = {
  gear: P("M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z") + P("M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9Z"),
  pile: P("M4 7h16M4 12h16M4 17h10") ,
  fight: P("M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z") + P("M9.5 12l1.8 1.8L15 10"),
  trophy: P("M7 4h10v4a5 5 0 0 1-10 0V4Z") + P("M7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3M9 20h6M12 13v4"),
  vault: P("M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z") + P("M13 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM12 14v2M7 19v2M17 19v2"),
  plus: P("M12 5v14M5 12h14"),
  copy: P("M9 9h10v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9Z") + P("M6 15H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1"),
  share: P("M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"),
  trash: P("M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"),
  bolt: P("M13 3L4 14h6l-1 7 9-11h-6l1-7Z"),
  check: P("M5 12l5 5L20 6"),
  clock: P("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2"),
  edit: P("M4 20h4L20 8l-4-4L4 16v4Z"),
  dollar: P("M12 3v18M8 8a3 3 0 0 1 3-3h2a3 3 0 0 1 0 6h-2a3 3 0 0 0 0 6h2a3 3 0 0 0 3-3"),
};
export const icon = (name, size = 22) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${ICONS[name] || ""}</svg>`;
export function hydrateIcons(root = document) {
  $$("[data-icon]", root).forEach((s) => { if (s.dataset.h) return; s.innerHTML = icon(s.getAttribute("data-icon")); s.dataset.h = "1"; });
}

export function toast(message, type = "", ms = 2600) {
  const host = $("#toastHost"); if (!host) return;
  const t = el("div", { class: `toast ${type}`, text: message });
  host.append(t);
  setTimeout(() => { t.style.transition = "opacity .3s, transform .3s"; t.style.opacity = "0"; t.style.transform = "translateY(8px)"; setTimeout(() => t.remove(), 300); }, ms);
}

export function confirmModal({ title, message, okText = "Confirm", cancelText = "Cancel", danger = false }) {
  return new Promise((resolve) => {
    const back = el("div", { class: "modal-back" });
    back.append(el("div", { class: "modal-card" },
      el("h3", { text: title }), message ? el("p", { text: message }) : null,
      el("div", { class: "modal-actions" },
        el("button", { class: "btn ghost", text: cancelText, onClick: () => done(false) }),
        el("button", { class: `btn ${danger ? "danger" : "primary"}`, text: okText, onClick: () => done(true) }))));
    back.addEventListener("click", (e) => { if (e.target === back) done(false); });
    $("#modalHost").append(back);
    function done(v) { back.remove(); resolve(v); }
  });
}

export function promptModal({ title, message, placeholder = "", value = "", okText = "Save", multiline = false }) {
  return new Promise((resolve) => {
    const input = multiline ? el("textarea", { class: "field", placeholder, rows: "4" }) : el("input", { class: "field", placeholder, value });
    if (multiline) input.value = value;
    const back = el("div", { class: "modal-back" });
    back.append(el("div", { class: "modal-card" },
      el("h3", { text: title }), message ? el("p", { text: message }) : null,
      el("div", { style: "margin-top:14px" }, input),
      el("div", { class: "modal-actions" },
        el("button", { class: "btn ghost", text: "Cancel", onClick: () => done(null) }),
        el("button", { class: "btn primary", text: okText, onClick: () => done(input.value.trim()) }))));
    back.addEventListener("click", (e) => { if (e.target === back) done(null); });
    $("#modalHost").append(back); input.focus();
    if (!multiline) input.addEventListener("keydown", (e) => { if (e.key === "Enter") done(input.value.trim()); });
    function done(v) { back.remove(); resolve(v); }
  });
}

export function openDrawer(buildContent) {
  const back = el("div", { class: "drawer-back" });
  const drawer = el("div", { class: "drawer" });
  back.append(drawer);
  back.addEventListener("click", (e) => { if (e.target === back) close(); });
  $("#drawerHost").append(back);
  function close() { back.remove(); }
  buildContent(drawer, close);
  return { close };
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { try { const ta = el("textarea", {}, text); document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); return true; } catch { return false; } }
}

export function relativeTime(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
export const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
