// pile.js — The Pile: create errands, run the agent, review + resolve.
import { el, toast, openDrawer, confirmModal, promptModal, copyText, relativeTime, icon } from "./ui.js";
import { addErrand, saveErrand, allErrands, deleteErrand, addWin, allVaultItems } from "./store.js";
import { TEMPLATES, templateById } from "./templates.js";
import { classifyErrand, guessTarget } from "./providers.js";
import { run as runAgent, fmtValue } from "./agent.js";

const STATUS_LABEL = { intake: "Intake", drafting: "Drafting", ready: "Ready", sent: "Sent", waiting: "Waiting", resolved: "Resolved", dropped: "Dropped" };
const CHIP_IDS = ["cancel_sub", "dispute_charge", "negotiate_bill", "waive_fee", "refund_defective", "medical_bill"];

export const pileModule = {
  id: "pile",

  mount(ctx) {
    const r = ctx.refs;
    r.quickAdd.addEventListener("click", () => this.handleQuickAdd(ctx));
    r.quickInput.addEventListener("keydown", (e) => { if (e.key === "Enter") this.handleQuickAdd(ctx); });
    // template chips
    r.templateChips.innerHTML = "";
    for (const id of CHIP_IDS) {
      const t = templateById(id); if (!t) continue;
      r.templateChips.append(el("button", { class: "chip", onClick: () => this.startTemplate(ctx, id) },
        el("span", { class: "chip-ico", text: t.emoji }), t.label));
    }
    r.pileList.addEventListener("click", (e) => {
      const card = e.target.closest("[data-errand]");
      if (card) this.openErrand(ctx, card.getAttribute("data-errand"));
    });
  },

  activate(ctx) { this.render(ctx); },
  deactivate() {},

  async render(ctx) {
    const r = ctx.refs;
    const list = await allErrands();
    r.pileList.innerHTML = "";
    r.pileEmpty.hidden = list.length > 0;

    const pending = list.filter((e) => e.needsApproval && e.status === "ready");
    r.approvalBar.hidden = pending.length === 0;
    if (pending.length) {
      r.approvalBar.innerHTML = "";
      r.approvalBar.append(
        el("span", { class: "ab-txt", text: `${pending.length} item${pending.length > 1 ? "s" : ""} ready for your go-ahead` }),
        el("button", { class: "btn gold sm", text: "Review", onClick: () => this.openErrand(ctx, pending[0].id) }),
      );
    }

    for (const e of list) r.pileList.append(this.card(e));
    ctx.refreshWins?.();
  },

  card(e) {
    const t = templateById(e.templateId);
    return el("article", { class: "card", dataset: { errand: e.id } },
      el("div", { class: "c-top" },
        el("span", { text: t?.emoji || "•", style: "font-size:18px" }),
        el("span", { class: "c-title", text: e.title || t?.label || "Errand" }),
      ),
      e.target ? el("div", { class: "c-target", text: e.target }) : null,
      el("p", { class: "c-goal", text: e.goal || t?.goalDefault || "" }),
      el("div", { class: "c-foot" },
        el("span", { class: `pill ${e.status}`, text: STATUS_LABEL[e.status] || e.status }),
        el("span", { class: "muted small", text: relativeTime(e.ts) }),
        e.estValue ? el("span", { class: "pill-val", text: fmtValue(e.actualValue ?? e.estValue, e.unit) }) : null,
      ),
    );
  },

  async handleQuickAdd(ctx) {
    const text = ctx.refs.quickInput.value.trim();
    if (!text) { toast("Describe what you want handled"); return; }
    ctx.refs.quickInput.value = "";
    const templateId = classifyErrand(text);
    const target = guessTarget(text);
    await this.createAndRun(ctx, { title: text, templateId, target, createdFrom: "freeform" });
  },

  async startTemplate(ctx, templateId) {
    const t = templateById(templateId);
    const target = await promptModal({ title: t.label, message: "Who is this against? (company / provider)", placeholder: "e.g. Netflix", okText: "Continue" });
    if (target === null) return;
    await this.createAndRun(ctx, { title: t.label, templateId, target: target || "", createdFrom: "template" });
  },

  async createAndRun(ctx, seed) {
    const t = templateById(seed.templateId);
    const errand = await addErrand({ ...seed, goal: t?.goalDefault || "", status: "intake", unit: t?.unit || "money", estValue: t?.estValueHint || 0 });
    await this.render(ctx);
    this.openErrand(ctx, errand.id, { autorun: true });
  },

  async openErrand(ctx, id, opts = {}) {
    let errand = (await allErrands()).find((e) => e.id === id);
    if (!errand) return;
    const t = templateById(errand.templateId);

    openDrawer((drawer, close) => {
      const logBox = el("div", { class: "ar-log" });
      const artifactBox = el("pre", { class: "artifact", text: errand.artifact || "" });
      const actions = el("div", { class: "artifact-actions" });
      const runSection = el("div", { class: "agent-run" },
        el("div", { class: "ar-head" }, el("span", { class: "ar-dot" }), el("span", { text: "Agent activity" })),
        logBox);

      const strategyCard = el("div", { class: "result-card" },
        el("h3", { html: `${icon("bolt", 16)} Strategy · ${t?.channel || ""}` }),
        el("div", { class: "ladder" }, (t?.ladder || []).map((s, i) =>
          el("div", { class: "ladder-step" }, el("span", { class: "ls-num", text: String(i + 1) }), s))),
        t?.leverage?.length ? el("p", { class: "muted small", style: "margin-top:10px", text: "Leverage: " + t.leverage[0] }) : null,
      );

      const rerender = () => {
        logBox.innerHTML = "";
        for (const l of errand.log) logBox.append(el("div", { class: "ar-line" }, el("span", { class: l.ok ? "ok" : "", text: l.ok ? "✓" : "›" }), l.msg));
        artifactBox.textContent = errand.artifact || "(draft will appear here)";
        renderActions();
        statusPill.className = `pill ${errand.status}`;
        statusPill.textContent = STATUS_LABEL[errand.status] || errand.status;
      };

      const renderActions = () => {
        actions.innerHTML = "";
        if (errand.artifact) {
          actions.append(el("button", { class: "btn ghost sm", html: `${icon("copy", 16)} Copy`, onClick: async () => { (await copyText(errand.artifact)) ? toast("Copied — paste into your email/chat", "ok") : toast("Copy failed", "err"); } }));
          actions.append(el("button", { class: "btn ghost sm", text: "Re-run agent", onClick: () => doRun() }));
        }
        if (errand.status === "ready" && errand.needsApproval) {
          actions.append(el("button", { class: "btn primary sm", text: "Approve & mark sent", onClick: () => markSent() }));
        }
        if (["sent", "waiting", "ready"].includes(errand.status)) {
          actions.append(el("button", { class: "btn gold sm", text: "Mark resolved (log win)", onClick: () => resolveWin() }));
        }
        actions.append(el("button", { class: "btn danger sm", text: "Delete", onClick: () => remove() }));
      };

      const statusPill = el("span", { class: `pill ${errand.status}`, text: STATUS_LABEL[errand.status] || errand.status });

      drawer.append(
        el("div", { class: "drawer-head" },
          el("span", { text: t?.emoji || "•", style: "font-size:22px" }),
          el("div", { style: "flex:1" }, el("h2", { text: errand.title || t?.label || "Errand" }), errand.target ? el("div", { class: "c-target", text: errand.target }) : null),
          statusPill,
          el("button", { class: "icon-btn", html: "✕", onClick: close }),
        ),
        el("div", { class: "field-row", style: "margin-bottom:12px" }, el("label", { text: "Goal" }),
          el("input", { class: "field", value: errand.goal || "", onChange: (e) => { errand.goal = e.target.value; saveErrand(errand); } })),
        runSection,
        strategyCard,
        el("div", { class: "result-card" }, el("h3", { text: "Ready-to-send artifact" }), artifactBox, actions),
      );
      rerender();

      async function doRun() {
        errand.log = [];
        rerender();
        const vaultItems = await allVaultItems();
        const vaultContext = vaultItems.map((v) => `${v.label}: ${v.value}`).join("; ");
        await runAgent(errand, {
          settings: ctx.settings, vaultContext,
          onLog: () => rerender(),
        });
        await saveErrand(errand);
        rerender();
        ctx.pileRender?.();
      }
      async function markSent() { errand.status = "sent"; errand.needsApproval = false; errand.log.push({ ts: Date.now(), msg: `You approved — marked sent via ${errand.channel}.`, ok: true }); await saveErrand(errand); rerender(); ctx.pileRender?.(); toast("Marked as sent", "ok"); }
      async function resolveWin() {
        const def = String(Math.round(errand.estValue || 0));
        const val = await promptModal({ title: "Log your win", message: errand.unit === "time" ? "How many hours did this save?" : errand.unit === "money" ? "How much did you recover/save? (number)" : "Confirm this task is cleared.", placeholder: def, value: def, okText: "Log win" });
        if (val === null) return;
        const amount = parseFloat(val) || (errand.unit === "task" ? 1 : 0);
        errand.actualValue = amount; errand.status = "resolved"; errand.needsApproval = false;
        errand.log.push({ ts: Date.now(), msg: `Resolved — logged ${fmtValue(amount, errand.unit)}.`, ok: true });
        await saveErrand(errand);
        await addWin({ errandId: errand.id, kind: errand.unit, amount, unit: errand.unit, title: errand.title || t?.label });
        rerender(); ctx.pileRender?.(); ctx.refreshWins?.();
        toast(`✓ Win logged: ${fmtValue(amount, errand.unit)}`, "ok");
      }
      async function remove() {
        const ok = await confirmModal({ title: "Delete errand?", message: "This removes it from your pile.", okText: "Delete", danger: true });
        if (!ok) return; await deleteErrand(errand.id); close(); ctx.pileRender?.(); toast("Errand deleted");
      }

      if (opts.autorun && !errand.artifact) doRun();
    });
  },
};
