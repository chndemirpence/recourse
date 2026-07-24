// settings.js — provider/key, autonomy, identity, privacy, data, install
import { el, toast, confirmModal } from "./ui.js";
import { draftArtifact } from "./providers.js";
import { allErrands, allVaultItems, allWins, clearAll } from "./store.js";

let deferredInstall = null;
if (typeof window !== "undefined") window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; });

export function openSettings(ctx) {
  const s = ctx.settings;
  const sheet = document.getElementById("settingsSheet");
  sheet.hidden = false;

  const providerSel = el("select", { class: "field" },
    el("option", { value: "offline", text: "Offline (templates, no key)" }),
    el("option", { value: "openai", text: "AI provider (OpenAI-compatible)" }));
  providerSel.value = s.provider;
  const apiBase = el("input", { class: "field", value: s.apiBase, placeholder: "https://api.openai.com/v1" });
  const apiKey = el("input", { class: "field", type: "password", value: s.apiKey, placeholder: "sk-…  (stored only on this device)" });
  const model = el("input", { class: "field", value: s.model, placeholder: "gpt-4o-mini" });
  const providerBox = el("div", { class: "settings-group" },
    el("div", { class: "field-row" }, el("label", { text: "API base URL" }), apiBase),
    el("div", { class: "field-row" }, el("label", { text: "API key" }), apiKey),
    el("div", { class: "field-row" }, el("label", { text: "Model" }), model),
    el("button", { class: "btn ghost sm", text: "Test connection", onClick: () => testConn() }));
  const syncProv = () => { providerBox.style.display = providerSel.value === "openai" ? "flex" : "none"; };
  providerSel.addEventListener("change", syncProv);

  // autonomy segmented
  let autonomy = s.autonomy;
  const seg = el("div", { class: "seg" });
  const segBtns = {};
  for (const [val, label] of [["ask", "Ask first"], ["confirm", "Draft & confirm"], ["auto", "Full auto"]]) {
    const b = el("button", { class: val === autonomy ? "on" : "", text: label, onClick: () => { autonomy = val; Object.values(segBtns).forEach((x) => x.classList.remove("on")); b.classList.add("on"); } });
    segBtns[val] = b; seg.append(b);
  }

  const name = el("input", { class: "field", value: s.name, placeholder: "Your name (used to sign letters)" });
  const email = el("input", { class: "field", value: s.email, placeholder: "Your email (optional)" });

  const installBtn = el("button", { class: "btn ghost full", text: "Install Recourse as an app",
    onClick: async () => { if (deferredInstall) { deferredInstall.prompt(); const r = await deferredInstall.userChoice; deferredInstall = null; toast(r.outcome === "accepted" ? "Installing…" : "Dismissed"); } else toast("Use your browser menu → Install / Add to Home Screen", "", 3600); } });

  const card = el("div", { class: "sheet-card" },
    el("h2", { text: "Settings" }),

    el("div", { class: "settings-group" }, el("h3", { text: "Intelligence" }),
      el("div", { class: "field-row" }, el("label", { text: "Provider" }), providerSel)),
    providerBox,

    el("hr", { class: "hr" }),
    el("div", { class: "settings-group" }, el("h3", { text: "Autonomy" }), seg,
      el("p", { class: "muted small", text: "Ask first = you approve every step · Draft & confirm = agent drafts, you send · Full auto = agent advances on its own (sends are simulated in this prototype)." })),

    el("div", { class: "settings-group" }, el("h3", { text: "Your identity" }),
      el("div", { class: "field-row" }, el("label", { text: "Name" }), name),
      el("div", { class: "field-row" }, el("label", { text: "Email" }), email)),

    el("hr", { class: "hr" }),
    el("div", { class: "settings-group" }, el("h3", { text: "Promise" }),
      el("div", { class: "onb-note" },
        el("div", {}, el("b", { text: "You're in control. " }), "Nothing is sent without your say-so at your chosen autonomy level. No silent success fees, ever."),
        el("div", { style: "margin-top:8px" }, el("b", { text: "Not a lawyer. " }), "Recourse drafts and organizes; it doesn't give legal advice or guarantee outcomes."),
        el("div", { style: "margin-top:8px" }, el("b", { text: "Local-first. " }), "Your pile, vault and wins live on this device."))),

    el("div", { class: "settings-group" }, el("h3", { text: "App & data" }),
      installBtn,
      el("button", { class: "btn ghost full", text: "Export my data (JSON)", onClick: () => exportAll() }),
      el("button", { class: "btn danger full", text: "Wipe all data", onClick: () => wipe(ctx, sheet) })),

    el("div", { class: "modal-actions" },
      el("button", { class: "btn ghost", text: "Close", onClick: () => close() }),
      el("button", { class: "btn primary", text: "Save", onClick: () => save() })));

  sheet.innerHTML = ""; sheet.append(card); syncProv();
  sheet.addEventListener("click", (e) => { if (e.target === sheet) close(); }, { once: true });

  async function testConn() {
    const probe = { ...s, provider: "openai", apiBase: apiBase.value.trim(), apiKey: apiKey.value.trim(), model: model.value.trim() };
    if (!probe.apiKey) { toast("Enter an API key first", "err"); return; }
    toast("Testing…");
    const res = await draftArtifact({ templateId: "cancel_sub", fields: { name: "Test", target: "Test Co", goal: "" }, settings: probe });
    res.source === "llm" ? toast("✓ Connected — AI drafting is live", "ok", 3000) : toast(`✗ Failed: ${res.error || "check key/base/model"}`, "err", 3600);
  }
  function save() {
    ctx.applySettings({ provider: providerSel.value, apiBase: apiBase.value.trim() || "https://api.openai.com/v1", apiKey: apiKey.value.trim(), model: model.value.trim() || "gpt-4o-mini", autonomy, name: name.value.trim(), email: email.value.trim() });
    toast("Settings saved", "ok"); close();
  }
  function close() { sheet.hidden = true; sheet.innerHTML = ""; }
}

async function exportAll() {
  const data = { errands: await allErrands(), vault: await allVaultItems(), wins: await allWins(), exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: `recourse-export-${new Date().toISOString().slice(0, 10)}.json` }); a.click();
  URL.revokeObjectURL(url);
  toast("Data exported", "ok");
}

async function wipe(ctx, sheet) {
  const ok = await confirmModal({ title: "Wipe all data?", message: "Deletes every errand, vault item, win, and resets settings on this device. Cannot be undone.", okText: "Wipe everything", danger: true });
  if (!ok) return;
  await clearAll();
  try { localStorage.removeItem("recourse.settings.v1"); ["errands", "vault", "wins"].forEach((s) => localStorage.removeItem(`recourse.${s}.fallback.v1`)); } catch {}
  toast("All data wiped — reloading…", "ok");
  setTimeout(() => location.reload(), 900);
}
