# Open Dispute-Template Standard (ODTS) v0.1

A small, documented, machine-readable format for **consumer-dispute templates** — the kind of
ready-to-send letters and scripts people use to cancel a subscription, dispute a charge,
negotiate a bill, or request data erasure. Each template carries the **consumer right it relies
on** (as *information*, with a cited basis), so the knowledge is auditable and reusable.

ODTS exists so that this knowledge becomes **open infrastructure**, not a private asset locked
inside one app. Any application — Recourse or otherwise — can load an ODTS template, fill it
with the user's details **on-device**, and render a ready-to-send artifact. Templates are plain
JSON, human-readable and diff-friendly, so a community can contribute and translate them.

- **Licence:** the templates and this spec are released under AGPL-3.0-or-later with the rest of
  the repository. Content may additionally be shared as an open knowledge commons.
- **Status:** v0.1, draft. This is the first slice of the standard proposed to NLnet/NGI; the
  format will be versioned (`odts_version`) and evolved with contributors.

## A template at a glance

```json
{
  "odts_version": "0.1",
  "id": "cancel-subscription",
  "version": "1.0.0",
  "title": "Cancel a subscription",
  "category": "subscriptions",
  "unit": "money",
  "jurisdictions": ["*", "US", "EU"],
  "channel": "Email / in-app + written record",
  "goal_default": "Cancel effective immediately and confirm no further charges",
  "fields": [ { "name": "target", "label": "Company / provider", "required": true } ],
  "rights": [
    { "claim": "Charges after a confirmed cancellation are routinely reversed by card issuers.",
      "basis": "Card-scheme chargeback rules for cancelled/unauthorised services.",
      "jurisdiction": "*" }
  ],
  "ladder": ["Support / in-app cancel", "Written notice to billing@", "Card-issuer chargeback"],
  "artifact": {
    "type": "email",
    "subject": "Cancellation of my subscription{{account_suffix}} — written notice",
    "body": "To: {{target}} Billing/Support\n\nHello,\n\n..."
  },
  "disclaimer": "Information, not legal advice."
}
```

## Fields

| field | type | required | meaning |
|-------|------|----------|---------|
| `odts_version` | string | ✓ | format version this file targets (currently `"0.1"`) |
| `id` | string (kebab-case) | ✓ | stable unique identifier |
| `version` | semver string | ✓ | the template's own content version |
| `title` | string | ✓ | short human title |
| `category` | string | ✓ | grouping, e.g. `subscriptions`, `billing`, `privacy` |
| `unit` | `money`\|`time`\|`task` | ✓ | what a successful outcome recovers |
| `est_value_hint` | number | – | rough recoverable value, for prioritisation only |
| `jurisdictions` | string[] | ✓ | ISO-ish codes the template suits; `"*"` = general |
| `channel` | string | ✓ | recommended channel |
| `goal_default` | string | – | default goal if the user gives none |
| `fields` | Field[] | ✓ | user inputs the artifact can reference |
| `rights` | Right[] | ✓ | leverage points, each with a cited basis (information) |
| `ladder` | string[] | ✓ | escalation ladder, least → most forceful |
| `artifact` | Artifact | ✓ | the ready-to-send content with `{{placeholders}}` |
| `disclaimer` | string | ✓ | must make clear this is information, not legal advice |

**Field** = `{ name, label, required?, placeholder? }`.
**Right** = `{ claim, basis, jurisdiction }` — `basis` cites the underlying rule; this is
information, never a guarantee.
**Artifact** = `{ type: "email"|"letter"|"script", subject?, body }`.

## Placeholders

The artifact uses `{{token}}`. A consumer fills the declared `fields` (by `name`) plus these
computed tokens the reference adapter provides:

`{{goal}}` (user goal or `goal_default`), `{{account_suffix}}` (`" (account: …)"` when an
`account` field is given, else empty), `{{amount}}`, `{{date}}`, and two convenience clauses
that read cleanly whether or not the value is present: `{{amount_clause}}` (`" of …"`),
`{{date_clause}}` (`" dated …"`) and `{{date_on}}` (`" on …"`).

Any token in an artifact **must** resolve to a declared field or a computed token — the
validator enforces this so templates never ship with dangling placeholders.

## Consume it (reference adapter)

```js
import { render } from "./adapter.mjs";
import cancel from "./templates/cancel-subscription.json" assert { type: "json" };

const { subject, body } = render(cancel, { target: "Acme", name: "A. Doe" });
// → ready-to-send email, filled entirely on-device
```

## Validate contributions

```bash
node standard/validate.mjs      # checks every templates/*.json against the format
```

The validator (zero-dependency) checks required keys and types, the `unit`/`artifact.type`
enums, unique `id`s, that every `right` has a cited `basis` + `jurisdiction`, and that every
`{{placeholder}}` resolves. `dispute-template.schema.json` is the formal JSON-Schema for editors
and CI that prefer a schema library (e.g. ajv).

## Contributing a template

Add a `templates/<id>.json`, cite the real consumer right in `rights[].basis`, keep the tone
truthful and non-deceptive, keep the `disclaimer`, run the validator, open a PR. Translations of
an existing template are just as welcome as new ones.
