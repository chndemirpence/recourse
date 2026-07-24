// build-app-templates.mjs — generate js/templates.js from the ODTS standard.
// The app's fight list is DERIVED from standard/templates/*.json, so the open
// Open Dispute-Template Standard is the single source of truth for the app.
// Regenerate: node standard/build-app-templates.mjs
// CI checks there is no drift (see .github/workflows/ci.yml).

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const TPL_DIR = join(HERE, "templates");
const OUT = join(HERE, "..", "js", "templates.js");

function plan(t) {
  const p = [
    "Confirm the facts and your goal",
    t.artifact.type === "script" ? "Prepare the script" : "Draft the letter",
    "Use the channel: " + t.channel,
    "Send it and keep a record",
  ];
  if ((t.ladder || []).length > 2) p.push("Escalate up the ladder if there's no reply");
  return p;
}

const files = readdirSync(TPL_DIR).filter((f) => f.endsWith(".json")).sort();
const ODTS = files.map((f) => {
  const t = JSON.parse(readFileSync(join(TPL_DIR, f), "utf8"));
  t.__plan = plan(t);
  return t;
});

const out = `// AUTO-GENERATED — do not edit by hand.
// Source of truth: standard/templates/*.json (Open Dispute-Template Standard, ODTS).
// The app's fight list is derived from the open standard. Regenerate with:
//   node standard/build-app-templates.mjs
import { render as odtsRender } from "../standard/adapter.mjs";

const EMOJI = { subscriptions: "🚫", billing: "⚠️", bills: "📉", purchases: "📦", privacy: "🛡️", disputes: "📣" };

const ODTS = ${JSON.stringify(ODTS, null, 2)};

function toApp(t) {
  return {
    id: t.id,
    label: t.title,
    emoji: EMOJI[t.category] || "📄",
    category: t.category,
    unit: t.unit,
    estValueHint: t.est_value_hint || 0,
    channel: t.channel,
    goalDefault: t.goal_default || "",
    plan: t.__plan,
    ladder: t.ladder,
    leverage: (t.rights || []).map((r) => r.claim),
    render: (fields = {}) => {
      const o = odtsRender(t, fields);
      return (o.subject ? "Subject: " + o.subject + "\\n\\n" : "") + o.body;
    },
  };
}

export const TEMPLATES = ODTS.map(toApp);
export const templateById = (id) => TEMPLATES.find((t) => t.id === id) || null;
export const templatesByCategory = () => {
  const map = {};
  for (const t of TEMPLATES) (map[t.category] ||= []).push(t);
  return map;
};
`;

writeFileSync(OUT, out.replace(/\r\n/g, "\n"), "utf8");
console.log(`generated js/templates.js from ${files.length} ODTS templates`);
