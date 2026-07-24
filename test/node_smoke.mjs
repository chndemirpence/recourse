// node_smoke.mjs — headless logic tests for Recourse
// run: node test/node_smoke.mjs
import { TEMPLATES, templateById } from "../js/templates.js";
import { classifyErrand, guessTarget, strategyFor, draftArtifact } from "../js/providers.js";
import { newErrand, searchErrands } from "../js/store.js";
import { planFor, projection, run, fmtValue } from "../js/agent.js";

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? "✓" : "✗"} ${m}`); };
const eq = (a, b, m) => ok(a === b, `${m}${a === b ? "" : `  (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`}`);

console.log("— templates —");
eq(TEMPLATES.length, 15, "15 templates (generated from ODTS)");
let leftover = 0, empty = 0;
for (const t of TEMPLATES) {
  const out = t.render({ name: "Cihan", target: "Acme", goal: "", account: "a@b.com", amount: "$10", date: "May 1" });
  if (/\{\{|\}\}/.test(out)) leftover++;
  if (!out || out.length < 40) empty++;
}
eq(leftover, 0, "no unfilled placeholders in any template");
eq(empty, 0, "every template renders a real artifact");

console.log("— routing —");
eq(classifyErrand("cancel my Netflix membership"), "cancel-subscription", "cancel routes");
eq(classifyErrand("I was charged twice"), "dispute-unauthorized-charge", "double-charge routes");
eq(classifyErrand("lower my internet bill"), "negotiate-a-bill", "negotiate routes");
eq(classifyErrand("waive my late fee"), "waive-a-fee", "fee routes");
eq(classifyErrand("delete my data please"), "delete-personal-data", "gdpr routes");
eq(classifyErrand("something totally random"), "escalate-complaint", "fallback routes");
eq(guessTarget("cancel my Netflix membership"), "Netflix", "guessTarget");

console.log("— strategy & projection —");
const strat = strategyFor("negotiate-a-bill");
ok(strat.ladder.length >= 2 && !!strat.channel, "strategy has ladder + channel");
const e0 = newErrand({ templateId: "cancel-subscription", target: "Netflix", estValue: 180, unit: "money" });
eq(planFor(e0, templateById("cancel-subscription")).length, templateById("cancel-subscription").plan.length, "plan length matches template");
const proj = projection(e0, templateById("cancel-subscription"));
ok(proj.estValue === 180 && proj.confidence > 0.5, "projection returns value + confidence");
eq(fmtValue(180, "money"), "~$180", "fmtValue money");
eq(fmtValue(2, "time"), "~2h saved", "fmtValue time");

console.log("— search —");
const list = [newErrand({ title: "cancel gym", target: "GymCo" }), newErrand({ title: "dispute charge", target: "Uber" })];
eq(searchErrands(list, "gym").length, 1, "search by title");
eq(searchErrands(list, "uber").length, 1, "search by target");
eq(searchErrands(list, "").length, 2, "empty query returns all");

console.log("— agent run (offline, fast) —");
const e = newErrand({ templateId: "waive-a-fee", target: "MyBank", goal: "", unit: "money", estValue: 35 });
const res = await run(e, { settings: { provider: "offline", name: "Cihan", autonomy: "confirm" }, fast: true, onLog: () => {} });
ok(!!res.errand.artifact && res.errand.artifact.length > 40, "agent produced an artifact");
ok(res.errand.plan.every((s) => s.done), "agent completed all plan steps");
eq(res.errand.status, "ready", "confirm autonomy → status ready");
ok(res.errand.log.length >= 4, "agent produced a run log");
const eAuto = newErrand({ templateId: "cancel-subscription", target: "X", unit: "money" });
const rAuto = await run(eAuto, { settings: { provider: "offline", autonomy: "auto" }, fast: true, onLog: () => {} });
eq(rAuto.errand.status, "sent", "auto autonomy → status sent");

console.log("— offline draft via provider —");
const d = await draftArtifact({ templateId: "cancel-subscription", fields: { name: "Cihan", target: "Netflix", goal: "" }, settings: { provider: "offline" } });
ok(d.source === "offline" && d.text.includes("Netflix"), "draftArtifact offline fills target");

console.log(`\n${fail === 0 ? "ALL PASS" : "SOME FAILED"} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
