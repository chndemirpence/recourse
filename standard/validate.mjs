// validate.mjs — zero-dependency validator for the Open Dispute-Template Standard (ODTS).
// Checks every standard/templates/*.json for structural validity, cited rights, unique ids,
// and placeholder integrity (no dangling {{tokens}}). Exit code 1 on any failure.
//
//   node standard/validate.mjs
//
// dispute-template.schema.json is the formal JSON-Schema for editors/CI that prefer ajv;
// this checker keeps the repo dependency-free.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tokensUsed, resolvableTokens, render } from "./adapter.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, "templates");

const UNITS = new Set(["money", "time", "task"]);
const ARTIFACT_TYPES = new Set(["email", "letter", "script"]);
const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER_RE = /^[0-9]+\.[0-9]+\.[0-9]+$/;
const FIELD_NAME_RE = /^[a-z][a-z0-9_]*$/;

function checkTemplate(t, errs) {
  const need = (k, cond) => { if (!cond) errs.push(`missing/invalid: ${k}`); };
  need("odts_version === '0.1'", t.odts_version === "0.1");
  need("id (kebab-case)", typeof t.id === "string" && ID_RE.test(t.id));
  need("version (semver)", typeof t.version === "string" && SEMVER_RE.test(t.version));
  need("title", typeof t.title === "string" && t.title.length > 0);
  need("category", typeof t.category === "string" && t.category.length > 0);
  need("unit", UNITS.has(t.unit));
  need("jurisdictions[]", Array.isArray(t.jurisdictions) && t.jurisdictions.length > 0);
  need("channel", typeof t.channel === "string" && t.channel.length > 0);
  need("fields[]", Array.isArray(t.fields));
  for (const f of t.fields || []) {
    need(`field.name '${f?.name}'`, f && FIELD_NAME_RE.test(f.name || ""));
    need(`field.label for '${f?.name}'`, f && typeof f.label === "string" && f.label.length > 0);
  }
  need("rights[] (>=1)", Array.isArray(t.rights) && t.rights.length > 0);
  for (const [i, r] of (t.rights || []).entries()) {
    need(`right[${i}].claim`, r && r.claim);
    need(`right[${i}].basis (citation)`, r && r.basis);
    need(`right[${i}].jurisdiction`, r && r.jurisdiction);
  }
  need("ladder[] (>=1)", Array.isArray(t.ladder) && t.ladder.length > 0);
  need("artifact.type", t.artifact && ARTIFACT_TYPES.has(t.artifact.type));
  need("artifact.body", t.artifact && typeof t.artifact.body === "string" && t.artifact.body.length > 0);
  need("disclaimer", typeof t.disclaimer === "string" && t.disclaimer.length > 0);

  // placeholder integrity: every {{token}} must be resolvable by the standard
  if (t.artifact) {
    const allowed = resolvableTokens(t);
    for (const tok of tokensUsed(t)) {
      if (!allowed.has(tok)) errs.push(`unresolvable placeholder {{${tok}}} (declare a field or use a computed token)`);
    }
    // and a rendered artifact must never ship literal {{ }}
    const sample = {};
    for (const f of t.fields || []) sample[f.name] = f.placeholder || "Sample";
    const out = render(t, sample);
    if (/\{\{|\}\}/.test(out.subject + out.body)) errs.push("rendered artifact still contains {{ }}");
  }
}

function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json"));
  if (!files.length) { console.error("no templates found in " + DIR); process.exit(1); }
  const ids = new Map();
  let failed = 0;
  for (const file of files.sort()) {
    const errs = [];
    let t;
    try { t = JSON.parse(readFileSync(join(DIR, file), "utf8")); }
    catch (e) { console.log(`✗ ${file}\n    invalid JSON: ${e.message}`); failed++; continue; }
    checkTemplate(t, errs);
    if (t.id) {
      if (ids.has(t.id)) errs.push(`duplicate id '${t.id}' (also in ${ids.get(t.id)})`);
      else ids.set(t.id, file);
    }
    if (errs.length) { console.log(`✗ ${file}`); for (const e of errs) console.log(`    ${e}`); failed++; }
    else console.log(`✓ ${file}  (${tokensUsed(t).length} placeholders, ${t.rights.length} cited rights)`);
  }
  console.log("");
  if (failed) { console.log(`FAIL — ${failed}/${files.length} template(s) invalid`); process.exit(1); }
  console.log(`ALL VALID — ${files.length} template(s) conform to ODTS v0.1`);
}

main();
