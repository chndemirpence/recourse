// providers.js — agent strategy & drafting. Offline (templates + keyword routing)
// upgrades to a real LLM with a BYO OpenAI-compatible key.
import { TEMPLATES, templateById } from "./templates.js";

/* Route a freeform errand description to the best template (offline). */
const ROUTES = [
  [/\b(cancel|unsubscribe|end (my )?membership|stop (my )?subscription|quit)\b/i, "cancel_sub"],
  [/\b(charged after|still billing|after (i )?cancel|kept charging)\b/i, "charged_after_cancel"],
  [/\b(unauthori|fraud|didn'?t authorize|double charge|charged twice|duplicate charge)\b/i, "dispute_charge"],
  [/\b(free trial|trial (ended|converted|auto)|auto-?renew)\b/i, "trial_refund"],
  [/\b(negotiate|lower (my )?bill|too expensive|internet bill|phone bill|cable|reduce (my )?bill|loyalty)\b/i, "negotiate_bill"],
  [/\b(medical|hospital|doctor|clinic|itemi[sz]ed) (bill|charge)?\b/i, "medical_bill"],
  [/\b(late fee|overdraft|waive|service fee|penalty fee)\b/i, "waive_fee"],
  [/\b(refund|defective|broken|not as described|return|faulty)\b/i, "refund_defective"],
  [/\b(warranty|repair|replace under)\b/i, "warranty_claim"],
  [/\b(delete (my )?data|privacy|gdpr|ccpa|erasure|opt out)\b/i, "delete_data"],
  [/\b(complaint|escalate|manager|ombudsman|supervisor|unresolved)\b/i, "escalate_complaint"],
  [/\b(price match|cheaper|price adjustment|better offer)\b/i, "price_match"],
];

export function classifyErrand(text) {
  const t = String(text || "");
  for (const [re, id] of ROUTES) if (re.test(t)) return id;
  return "escalate_complaint";
}

/* Guess a target (company) from the text: capitalized token(s). */
export function guessTarget(text) {
  const m = String(text || "").match(/\b([A-Z][a-zA-Z0-9&.]+(?:\s[A-Z][a-zA-Z0-9&.]+)?)\b/);
  return m ? m[1] : "";
}

/* Strategy = template metadata (channel, ladder, leverage, plan). */
export function strategyFor(templateId) {
  const t = templateById(templateId) || TEMPLATES[0];
  return { templateId: t.id, label: t.label, channel: t.channel, ladder: t.ladder, leverage: t.leverage, plan: t.plan, unit: t.unit, estValueHint: t.estValueHint };
}

/* Build the artifact (letter/script). Offline: template.render. LLM: tailored. */
export async function draftArtifact({ templateId, fields, settings, vaultContext }) {
  const t = templateById(templateId) || TEMPLATES[0];
  const offline = t.render({ ...fields });
  if (settings?.provider === "openai" && settings?.apiKey) {
    try {
      const sys = `You are Recourse, a chief-of-staff agent that drafts firm, polite, factual consumer letters/scripts as the USER (never claim to be a lawyer, never fabricate facts, no guarantees). Improve and personalize the draft below using the context. Keep it concise and ready to send. Output ONLY the final letter/script text.`;
      const usr = `Goal: ${fields.goal || t.goalDefault}\nTarget: ${fields.target || "[Company]"}\nUser name: ${fields.name || "[Your name]"}\nContext: ${vaultContext || "none"}\n\nDraft to improve:\n${offline}`;
      const out = await chat([{ role: "system", content: sys }, { role: "user", content: usr }], settings, 0.4);
      return { text: out.trim(), source: "llm" };
    } catch (e) {
      return { text: offline, source: "offline-fallback", error: String(e.message || e) };
    }
  }
  return { text: offline, source: "offline" };
}

async function chat(messages, settings, temperature = 0.4) {
  const base = (settings.apiBase || "https://api.openai.com/v1").replace(/\/$/, "");
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${settings.apiKey}` },
    body: JSON.stringify({ model: settings.model || "gpt-4o-mini", messages, temperature }),
  });
  if (!res.ok) throw new Error(`Provider ${res.status}`);
  const data = await res.json();
  const c = data?.choices?.[0]?.message?.content;
  if (!c) throw new Error("Empty response");
  return c;
}
