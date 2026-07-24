// fight.js — The Fight: deliberate composer → strategy + artifact.
import { el, toast, copyText, icon } from "./ui.js";
import { addErrand, saveErrand, allVaultItems } from "./store.js";
import { TEMPLATES, templateById } from "./templates.js";
import { run as runAgent, fmtValue } from "./agent.js";

export const fightModule = {
  id: "fight",
  _built: false,

  mount(ctx) {
    if (this._built) return;
    const c = ctx.refs.fightComposer;
    const tSel = el("select", { class: "field" }, TEMPLATES.map((t) => el("option", { value: t.id, text: `${t.emoji}  ${t.label}` })));
    const target = el("input", { class: "field", placeholder: "Target — e.g. Comcast, City Hospital, Amazon" });
    const goal = el("textarea", { class: "field", placeholder: "What outcome do you want? (leave blank to use the smart default)" });
    const runBtn = el("button", { class: "btn primary full", html: `${icon("bolt",18)} Build my strategy` });

    c.append(
      el("div", { class: "field-row" }, el("label", { text: "The fight" }), tSel),
      el("div", { class: "field-row" }, el("label", { text: "Target" }), target),
      el("div", { class: "field-row" }, el("label", { text: "Goal (optional)" }), goal),
      runBtn,
    );
    runBtn.addEventListener("click", async () => {
      if (!target.value.trim()) { toast("Name a target to fight"); return; }
      runBtn.disabled = true; runBtn.textContent = "Working…";
      const t = templateById(tSel.value);
      const errand = await addErrand({ title: t.label, templateId: t.id, target: target.value.trim(), goal: goal.value.trim() || t.goalDefault, status: "intake", unit: t.unit, estValue: t.estValueHint, createdFrom: "fight" });
      await this.renderResult(ctx, errand);
      runBtn.disabled = false; runBtn.innerHTML = `${icon("bolt",18)} Build my strategy`;
      ctx.pileRender?.();
    });
    this._built = true;
  },

  activate(ctx) { this.mount(ctx); },
  deactivate() {},

  async renderResult(ctx, errand) {
    const box = ctx.refs.fightResult;
    box.hidden = false;
    box.innerHTML = "";
    const t = templateById(errand.templateId);

    const logBox = el("div", { class: "ar-log" });
    const artifact = el("pre", { class: "artifact", text: "" });
    box.append(
      el("div", { class: "agent-run" }, el("div", { class: "ar-head" }, el("span", { class: "ar-dot" }), el("span", { text: "Agent activity" })), logBox),
      el("div", { class: "result-card" },
        el("h3", { html: `${icon("bolt",16)} Strategy · ${t.channel}` }),
        el("div", { class: "ladder" }, t.ladder.map((s, i) => el("div", { class: "ladder-step" }, el("span", { class: "ls-num", text: String(i + 1) }), s))),
        el("p", { class: "muted small", style: "margin-top:10px", text: "Leverage: " + (t.leverage[0] || "") }),
      ),
      el("div", { class: "result-card" }, el("h3", { text: "Ready-to-send artifact" }), artifact,
        el("div", { class: "artifact-actions" },
          el("button", { class: "btn ghost sm", html: `${icon("copy",16)} Copy`, onClick: async () => { (await copyText(errand.artifact)) ? toast("Copied", "ok") : toast("Copy failed", "err"); } }),
          el("button", { class: "btn primary sm", text: "Send to my Pile", onClick: () => { toast("Saved to your Pile ✦", "ok"); ctx.goto?.("pile"); } }),
        )),
    );
    const draw = () => { logBox.innerHTML = ""; for (const l of errand.log) logBox.append(el("div", { class: "ar-line" }, el("span", { class: l.ok ? "ok" : "", text: l.ok ? "✓" : "›" }), l.msg)); if (errand.artifact) artifact.textContent = errand.artifact; };

    const vaultItems = await allVaultItems();
    const vaultContext = vaultItems.map((v) => `${v.label}: ${v.value}`).join("; ");
    await runAgent(errand, { settings: ctx.settings, vaultContext, onLog: draw });
    await saveErrand(errand);
    draw();
  },
};
