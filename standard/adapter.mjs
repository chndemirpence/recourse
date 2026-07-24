// adapter.mjs — reference consumer for the Open Dispute-Template Standard (ODTS) v0.1.
// Zero dependencies. Fills a template's artifact entirely locally; no network, no state.
//
//   import { render } from "./adapter.mjs";
//   const { subject, body } = render(template, { target: "Acme", name: "A. Doe" });

/** Computed tokens the standard guarantees, on top of a template's declared fields. */
export function context(template, fields = {}) {
  const f = { ...fields };
  const account = f.account ? String(f.account) : "";
  const amount = f.amount ? String(f.amount) : "";
  const date = f.date ? String(f.date) : "";
  const ctx = {
    name: f.name || "[Your name]",
    target: f.target || "[Company]",
    account,
    account_suffix: account ? ` (account: ${account})` : "",
    amount,
    // computed convenience clauses that read cleanly whether or not the field is given
    amount_clause: amount ? ` of ${amount}` : "",
    date,
    date_clause: date ? ` dated ${date}` : "",
    goal: f.goal || template.goal_default || "",
  };
  // declared fields override/extend the defaults above
  for (const spec of template.fields || []) {
    if (spec.name in f) ctx[spec.name] = f[spec.name];
    else if (!(spec.name in ctx)) ctx[spec.name] = "";
  }
  return ctx;
}

const TOKEN = /\{\{(\w+)\}\}/g;

/** Every token used anywhere in the artifact. */
export function tokensUsed(template) {
  const seen = new Set();
  for (const part of [template.artifact?.subject || "", template.artifact?.body || ""]) {
    for (const m of part.matchAll(TOKEN)) seen.add(m[1]);
  }
  return [...seen];
}

/** The set of tokens the standard can resolve for a template. */
export function resolvableTokens(template) {
  return new Set([
    "name", "target", "account", "account_suffix",
    "amount", "amount_clause", "date", "date_clause", "goal",
    ...(template.fields || []).map((x) => x.name),
  ]);
}

/** Render the ready-to-send artifact, filled locally. Unknown tokens degrade to [token]. */
export function render(template, fields = {}) {
  const ctx = context(template, fields);
  const fill = (s) => String(s || "").replace(TOKEN, (_, k) => (k in ctx ? ctx[k] : `[${k}]`));
  return {
    type: template.artifact?.type || "email",
    subject: fill(template.artifact?.subject || ""),
    body: fill(template.artifact?.body || ""),
  };
}
