// onboarding.js — first-run flow (value prop + trust promise + autonomy pick)
import { el, toast } from "./ui.js";

export function maybeOnboard(ctx) { if (!ctx.settings.onboarded) runOnboarding(ctx); }

export function runOnboarding(ctx) {
  const overlay = document.getElementById("onboarding");
  overlay.hidden = false;
  let step = 0;
  let name = ctx.settings.name || "";
  let autonomy = ctx.settings.autonomy || "confirm";

  const cards = [
    () => card({ emoji: "✓", title: `Meet <span class="grad">Recourse</span>`,
      body: "Your AI chief of staff. It kills the life-admin you hate and fights the companies that waste your time and money — bills, subscriptions, refunds, disputes, fees.",
      extra: el("p", { class: "muted small", text: "Assign, don't ask. Your recourse — on your device." }) }),
    () => {
      const input = el("input", { class: "field", value: name, placeholder: "Your name", onInput: (e) => { name = e.target.value; } });
      return card({ emoji: "🤝", title: "The promise",
        body: "",
        extra: el("div", {},
          el("div", { class: "onb-note" },
            el("div", {}, el("b", { text: "You're in control. " }), "Nothing is sent without your go-ahead. No silent success fees, ever."),
            el("div", { style: "margin-top:8px" }, el("b", { text: "Not a lawyer. " }), "It drafts and organizes — no legal advice, no guarantees."),
            el("div", { style: "margin-top:8px" }, el("b", { text: "Local-first. " }), "Everything stays on this device.")),
          el("div", { class: "field-row", style: "text-align:left;margin-top:6px" }, el("label", { text: "Your name (signs your letters)" }), input)) });
    },
    () => {
      const seg = el("div", { class: "seg" });
      const btns = {};
      for (const [v, l] of [["ask", "Ask first"], ["confirm", "Draft & confirm"], ["auto", "Full auto"]]) {
        const b = el("button", { class: v === autonomy ? "on" : "", text: l, onClick: () => { autonomy = v; Object.values(btns).forEach((x) => x.classList.remove("on")); b.classList.add("on"); } });
        btns[v] = b; seg.append(b);
      }
      return card({ emoji: "🎚️", title: "How much autonomy?",
        body: "You can change this anytime in Settings.",
        extra: el("div", { style: "margin-top:8px" }, seg) });
    },
  ];

  render();
  function render() {
    overlay.innerHTML = "";
    const content = cards[step]();
    const dots = el("div", { class: "onb-dots" }, cards.map((_, i) => el("span", { class: i === step ? "on" : "" })));
    const back = el("button", { class: "btn ghost", text: "Back", onClick: () => { step = Math.max(0, step - 1); render(); } });
    const next = el("button", { class: "btn primary", style: "flex:1", text: step === cards.length - 1 ? "Start clearing my pile" : "Next",
      onClick: () => { if (step < cards.length - 1) { step++; render(); } else finish(); } });
    content.append(dots, el("div", { class: "onb-actions" }, step > 0 ? back : el("span", { style: "flex:1" }), next));
    overlay.append(content);
  }
  function finish() {
    ctx.applySettings({ onboarded: true, name, autonomy });
    overlay.hidden = true; overlay.innerHTML = "";
    toast("Welcome — hand over your first errand ✓", "ok", 3200);
  }
}

function card({ emoji, title, body, extra }) {
  return el("div", { class: "onb-card" },
    el("div", { class: "onb-emoji", text: emoji }),
    el("h1", { html: title }),
    body ? el("p", { text: body }) : null, extra || null);
}
