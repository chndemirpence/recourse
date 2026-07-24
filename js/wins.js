// wins.js — the viral engine: tally + shareable win card.
import { el, toast, relativeTime, copyText } from "./ui.js";
import { allWins, winTotals } from "./store.js";
import { fmtValue } from "./agent.js";

export const winsModule = {
  id: "wins",

  mount(ctx) {
    ctx.refs.shareWins.addEventListener("click", () => this.shareCard(ctx));
  },

  async activate(ctx) { await this.render(ctx); },
  deactivate() {},

  async render(ctx) {
    const r = ctx.refs;
    const totals = await winTotals();
    const wins = await allWins();
    const biggest = wins.filter((w) => w.unit === "money").sort((a, b) => b.amount - a.amount)[0];

    r.winsStats.innerHTML = "";
    r.winsStats.append(
      stat(`$${Math.round(totals.money).toLocaleString()}`, "money", "Money recovered"),
      stat(`${round1(totals.hours)}h`, "time", "Hours saved"),
      stat(String(totals.count), "", "Wins logged"),
      stat(biggest ? `$${Math.round(biggest.amount)}` : "—", "money", "Biggest single win"),
    );

    r.winsList.innerHTML = "";
    r.winsEmpty.hidden = wins.length > 0;
    for (const w of wins) {
      r.winsList.append(el("div", { class: "card win-card-item" },
        el("span", { class: "w-emoji", text: w.unit === "money" ? "💰" : w.unit === "time" ? "⏱️" : "✅" }),
        el("div", {}, el("div", { class: "c-title", text: w.title || "Win" }), el("div", { class: "muted small", text: relativeTime(w.ts) })),
        el("span", { class: "w-val", text: fmtValue(w.amount, w.unit) }),
      ));
    }
    ctx.refreshWins?.();
  },

  async shareCard(ctx) {
    const totals = await winTotals();
    if (totals.count === 0) { toast("No wins yet — resolve an errand first"); return; }
    const url = drawCard(totals, ctx.settings);
    // download
    const a = el("a", { href: url, download: "recourse-wins.png" }); a.click();
    // copy caption
    const caption = `My AI chief of staff (Recourse) has recovered $${Math.round(totals.money).toLocaleString()} and saved me ${round1(totals.hours)} hours across ${totals.count} fights. Your recourse — on your device. ✓`;
    (await copyText(caption)) ? toast("Win card downloaded + caption copied", "ok", 3200) : toast("Win card downloaded", "ok");
  },
};

function stat(val, cls, label) {
  return el("div", { class: "stat" }, el("div", { class: `s-val ${cls}`, text: val }), el("div", { class: "s-label", text: label }));
}
const round1 = (n) => Math.round(n * 10) / 10;

function drawCard(totals, settings) {
  const W = 1080, H = 1080;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  // bg
  g.fillStyle = "#0b0f14"; g.fillRect(0, 0, W, H);
  const grad = g.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "rgba(52,211,153,0.16)"); grad.addColorStop(1, "rgba(245,196,81,0.10)");
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  // brand
  g.fillStyle = "#34d399"; g.font = "700 44px -apple-system, Segoe UI, sans-serif";
  g.fillText("✓ Recourse", 80, 130);
  g.fillStyle = "#647285"; g.font = "400 28px -apple-system, Segoe UI, sans-serif";
  g.fillText("Your recourse — on your device.", 80, 176);
  // headline
  g.fillStyle = "#e9eef5"; g.font = "800 60px -apple-system, Segoe UI, sans-serif";
  g.fillText("My AI chief of staff", 80, 340);
  g.fillText("got results:", 80, 412);
  // big number
  g.fillStyle = "#34d399"; g.font = "900 150px -apple-system, Segoe UI, sans-serif";
  g.fillText(`$${Math.round(totals.money).toLocaleString()}`, 80, 600);
  g.fillStyle = "#9aa8ba"; g.font = "500 34px -apple-system, Segoe UI, sans-serif";
  g.fillText("recovered", 88, 648);
  // secondary
  g.fillStyle = "#f5c451"; g.font = "800 72px -apple-system, Segoe UI, sans-serif";
  g.fillText(`${round1(totals.hours)}h`, 80, 800);
  g.fillStyle = "#9aa8ba"; g.font = "500 30px -apple-system, Segoe UI, sans-serif";
  g.fillText("of hold-time & admin saved", 88, 844);
  g.fillStyle = "#e9eef5"; g.font = "700 40px -apple-system, Segoe UI, sans-serif";
  g.fillText(`${totals.count} fights won`, 80, 940);
  return c.toDataURL("image/png");
}
