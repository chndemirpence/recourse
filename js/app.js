// app.js — Recourse orchestrator: routing, state, wiring
import { $, hydrateIcons, toast, el } from "./ui.js";
import { loadSettings, saveSettings, winTotals } from "./store.js";
import { pileModule } from "./pile.js";
import { fightModule } from "./fight.js";
import { winsModule } from "./wins.js";
import { vaultModule } from "./vault.js";
import { openSettings } from "./settings.js";
import { maybeOnboard } from "./onboarding.js";

const MODULES = { pile: pileModule, fight: fightModule, wins: winsModule, vault: vaultModule };

const app = { settings: loadSettings(), refs: {}, view: "pile" };

function cacheRefs() {
  const ids = [
    "awMoney", "awTime", "settingsBtn",
    "quickInput", "quickAdd", "templateChips", "approvalBar", "pileList", "pileEmpty",
    "fightComposer", "fightResult",
    "winsStats", "shareWins", "winsList", "winsEmpty",
    "vaultLabel", "vaultValue", "vaultAdd", "vaultList", "vaultEmpty",
    "onboarding", "settingsSheet",
  ];
  for (const id of ids) app.refs[id] = document.getElementById(id);
}

function makeCtx() {
  return {
    settings: app.settings,
    refs: app.refs,
    goto: setView,
    pileRender: () => pileModule.render(makeCtx()),
    refreshWins,
    applySettings,
    openSettings: () => openSettings(makeCtx()),
  };
}

function setView(view) {
  if (!MODULES[view]) return;
  app.view = view;
  document.body.dataset.view = view;
  document.querySelectorAll(".view").forEach((v) => { v.hidden = v.dataset.view !== view; });
  document.querySelectorAll(".dock-tab").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
  MODULES[view].activate?.(makeCtx());
}

async function refreshWins() {
  try {
    const t = await winTotals();
    app.refs.awMoney.textContent = `$${Math.round(t.money).toLocaleString()}`;
    app.refs.awTime.textContent = `${Math.round(t.hours * 10) / 10}h`;
  } catch { /* ignore */ }
}

function applySettings(next) {
  Object.assign(app.settings, next);
  saveSettings(app.settings);
}

function wireEvents() {
  document.querySelectorAll(".dock-tab").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  app.refs.settingsBtn.addEventListener("click", () => openSettings(makeCtx()));
  document.addEventListener("keydown", (e) => {
    if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.key === "1") setView("pile");
    else if (e.key === "2") setView("fight");
    else if (e.key === "3") setView("wins");
    else if (e.key === "4") setView("vault");
    else if (e.key === "s") openSettings(makeCtx());
  });
}

function registerSW() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function boot() {
  hydrateIcons();
  cacheRefs();
  const ctx = makeCtx();
  for (const m of Object.values(MODULES)) m.mount?.(ctx);
  wireEvents();
  setView("pile");
  refreshWins();
  registerSW();
  maybeOnboard(ctx);
  window.__RECOURSE__ = { app, setView, makeCtx };
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
