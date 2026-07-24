// vault.js — The Vault: local-first context the agent uses.
import { el, toast, confirmModal, relativeTime } from "./ui.js";
import { addVaultItem, allVaultItems, deleteVaultItem } from "./store.js";

export const vaultModule = {
  id: "vault",

  mount(ctx) {
    const r = ctx.refs;
    r.vaultAdd.addEventListener("click", () => this.add(ctx));
    r.vaultValue.addEventListener("keydown", (e) => { if (e.key === "Enter") this.add(ctx); });
    r.vaultList.addEventListener("click", async (e) => {
      const del = e.target.closest("[data-del]");
      if (!del) return;
      const ok = await confirmModal({ title: "Delete vault item?", okText: "Delete", danger: true });
      if (ok) { await deleteVaultItem(del.getAttribute("data-del")); this.render(ctx); toast("Removed"); }
    });
  },

  activate(ctx) { this.render(ctx); },
  deactivate() {},

  async add(ctx) {
    const label = ctx.refs.vaultLabel.value.trim();
    const value = ctx.refs.vaultValue.value.trim();
    if (!label || !value) { toast("Add both a label and a value"); return; }
    const kind = guessKind(label);
    await addVaultItem({ label, value, kind });
    ctx.refs.vaultLabel.value = ""; ctx.refs.vaultValue.value = "";
    this.render(ctx);
    toast("Saved to your Vault", "ok");
  },

  async render(ctx) {
    const r = ctx.refs;
    const items = await allVaultItems();
    r.vaultList.innerHTML = "";
    r.vaultEmpty.hidden = items.length > 0;
    for (const v of items) {
      r.vaultList.append(el("div", { class: "card", style: "cursor:default" },
        el("div", { class: "c-top" },
          el("span", { text: kindEmoji(v.kind), style: "font-size:16px" }),
          el("span", { class: "c-title", text: v.label }),
          el("button", { class: "btn danger sm", dataset: { del: v.id }, text: "Delete", style: "margin-left:auto" }),
        ),
        el("div", { class: "c-goal", text: v.value }),
        el("div", { class: "muted small", text: `${v.kind} · ${relativeTime(v.ts)}` }),
      ));
    }
  },
};

function guessKind(label) {
  const l = label.toLowerCase();
  if (/account|email|login|member|id\b/.test(l)) return "account";
  if (/policy|number|plan|contract/.test(l)) return "policy";
  if (/bill|charge|\$|amount|rate/.test(l)) return "bill";
  return "fact";
}
const kindEmoji = (k) => ({ account: "👤", policy: "📄", bill: "🧾", fact: "•" }[k] || "•");
