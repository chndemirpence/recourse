// agent.js — the run engine. Turns an errand into a plan + artifact + projection.
import { templateById } from "./templates.js";
import { draftArtifact, strategyFor } from "./providers.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function planFor(errand, template) {
  const steps = (template?.plan || ["Assess the situation", "Draft the message", "Choose the channel", "Prepare follow-up"]);
  return steps.map((s) => ({ step: s, done: false }));
}

export function projection(errand, template) {
  const unit = template?.unit || "money";
  const est = Number(errand.estValue) || Number(template?.estValueHint) || 0;
  // simple confidence: known template + has target → higher
  let conf = 0.55;
  if (errand.target) conf += 0.15;
  if (template?.ladder?.length > 2) conf += 0.1;
  conf = Math.min(0.9, conf);
  return { estValue: est, unit, confidence: conf };
}

/**
 * Run the agent on an errand.
 * ctx: { settings, vaultContext, onLog(msg, ok), onStep(index), fast }
 */
export async function run(errand, ctx = {}) {
  const t = templateById(errand.templateId);
  const strat = strategyFor(errand.templateId);
  const wait = ctx.fast ? 0 : 380;
  const log = (msg, ok = false) => { errand.log.push({ ts: Date.now(), msg, ok }); ctx.onLog?.(msg, ok); };

  errand.plan = planFor(errand, t);
  errand.channel = strat.channel;
  errand.unit = strat.unit;
  if (!errand.estValue) errand.estValue = strat.estValueHint || 0;
  errand.status = "drafting";
  log(`Planning: ${t ? t.label : "errand"} → ${errand.target || "target"}`);
  await sleep(wait);

  for (let i = 0; i < errand.plan.length; i++) {
    errand.plan[i].done = true;
    log(`✓ ${errand.plan[i].step}`, true);
    ctx.onStep?.(i);
    await sleep(wait);
  }

  log("Drafting your artifact…");
  const draft = await draftArtifact({
    templateId: errand.templateId,
    fields: {
      name: ctx.settings?.name || "",
      email: ctx.settings?.email || "",
      target: errand.target,
      goal: errand.goal || t?.goalDefault || "",
      account: ctx.accountRef || "",
      amount: ctx.amountRef || "",
      date: ctx.dateRef || "",
    },
    settings: ctx.settings,
    vaultContext: ctx.vaultContext,
  });
  errand.artifact = draft.text;
  log(draft.source === "llm" ? "✓ Tailored draft ready (AI)" : "✓ Draft ready (offline template)", true);

  const proj = projection(errand, t);
  errand.estValue = proj.estValue;
  log(`Projected outcome: ${fmtValue(proj.estValue, proj.unit)} · confidence ${(proj.confidence * 100) | 0}%`, true);

  // autonomy governs the finish state
  const autonomy = ctx.settings?.autonomy || "confirm";
  if (autonomy === "auto") {
    errand.status = "sent";
    errand.needsApproval = false;
    log(`Sent (simulated) via ${errand.channel}. Watching for a reply.`, true);
  } else {
    errand.status = "ready";
    errand.needsApproval = true;
    log(autonomy === "ask" ? "Ready — waiting for your go-ahead." : "Ready — review and confirm to send.");
  }
  return { errand, draft, projection: proj };
}

export function fmtValue(v, unit) {
  if (unit === "time") return `~${v}h saved`;
  if (unit === "task") return "1 task cleared";
  return `~$${Math.round(v)}`;
}
