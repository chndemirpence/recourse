# Recourse

**Know your recourse. Keep your data.**

Recourse is a free, local-first assistant that helps ordinary people push back on the
institutions that waste their time and money — unfair bills, silent auto-renewals,
refused refunds, junk fees, wrongful charges, data-deletion requests. It drafts the
letter, plans the escalation ladder, and surfaces your real leverage as *information* —
and it does all of this **on your own device**. There is no server in the middle, no
account, and no success fee.

Recourse is a **digital commons**: the value lives in an open, growing library of
research-grounded "fights" (dispute/cancel/negotiate/refund templates) that anyone can
read, improve, translate, and reuse. It is licensed under the **GNU AGPL-3.0** so it can
never be quietly enclosed and resold as a black box.

> Recourse is an independent, non-commercial project. It drafts and organises consumer
> letters and scripts and surfaces publicly-known leverage points. **It is not a law firm
> and provides no legal advice or guarantee of outcome.** You review and send everything
> yourself, and you approve every action.

---

## Why this exists

The power asymmetry between a person and an institution is mostly an asymmetry of *time,
knowledge, and persistence*. Companies design cancellation mazes, dark patterns, and
attrition-by-hold-music precisely because most people give up. A handful of venture-backed
apps promised to fix this — and then took a **35–60% cut** of whatever they recovered,
acted opaquely on people's behalf, and centralised deeply sensitive financial data on their
own servers. One of them drew a regulator's line for the whole category by overclaiming.

Recourse takes the opposite design stance:

- **You are always in control.** Nothing is "sent" without your explicit say-so. **No
  success fees, ever.**
- **Local-first & private.** Your errands, your evidence, your bills and personal facts
  (the *Vault*) live in your browser (IndexedDB), never uploaded. There is no Recourse
  backend.
- **Not a lawyer, no deception.** Templates speak truthfully as you; leverage points are
  framed as information, never legal advice. It never fabricates facts or forges documents.
- **A commons, not a product.** The template library is open and community-extensible under
  a copyleft licence.

---

## What it does today

Four surfaces, one calm control room, zero build step (vanilla HTML + CSS + ES modules):

1. **The Pile** — an inbox for the errands you keep putting off. Describe one in a line;
   Recourse classifies it, drafts a ready-to-send artifact, and lays out the plan.
2. **The Fight** — pick a target + goal; it builds a strategy: the channel, a ready letter/
   script, an escalation ladder (support → retention → chargeback → regulator/ombudsman),
   and your leverage points.
3. **Wins** — the receipts: money recovered, hours of hold-time avoided, tasks cleared,
   plus a shareable win card (rendered locally on an HTML5 canvas).
4. **The Vault** — local context memory the agent uses to personalise every artifact.

It ships with **12 research-grounded fights** (cancel a subscription, dispute an
unauthorised charge, stop post-cancellation billing, free-trial refund, negotiate a bill,
medical-bill itemisation, waive a fee, defective-purchase refund, warranty claim,
GDPR/CCPA erasure, escalate a complaint, price-match). Each renders a genuinely usable
letter offline; with an optional AI provider it tailors the draft to your exact case.

Installable as a PWA (manifest + service worker); works fully offline.

---

## The direction (what grant-funded R&D would build)

Recourse is honest that today its *optional* AI tailoring uses a bring-your-own-key cloud
model — which means when AI is enabled, draft text leaves the device. Closing that gap is
the core of the roadmap:

- **On-device AI.** Integrate a local model (e.g. llama.cpp / a small quantised LLM, plus
  local speech-to-text) so tailoring and strategy run **entirely on the device** — no cloud,
  no key, no data egress. True local-first, not just local-storage.
- **An open "fight commons".** A community-curated, versioned, multi-jurisdiction library
  of fight templates with citations to the underlying consumer rights, that anyone can
  contribute to and any app can reuse.
- **Local, verifiable evidence & send rails** that keep artifacts and their proof on the
  user's device.
- **Accessibility & internationalisation** so the tool serves the people who need recourse
  most.

See [`docs/`](docs/) for the funding proposal and roadmap detail.

---

## Run it

No dependencies, no build.

```bash
git clone <this-repo> recourse && cd recourse
python3 -m http.server 8098      # then open http://localhost:8098
```

Or just open `index.html`. Best in Chrome/Edge; "Add to Home Screen" for the full-screen
installable app.

**Enable optional AI:** Settings → Provider → paste an OpenAI-compatible base + key. Keys
live only in your browser. (Replacing this with a bundled on-device model is the roadmap's
first milestone.)

## Test

```bash
node test/node_smoke.mjs          # → ALL PASS — 24 passed, 0 failed
for f in js/*.js sw.js; do node --check "$f"; done
```
Open `test/selftest.html` in a browser for device + logic diagnostics.

## Architecture

```
index.html            shell + 4 views
css/styles.css        calm control-room design system
js/
  app.js              orchestrator: routing, state, wins tally
  templates.js        the fight library — the commons, the real value
  agent.js            run engine: plan → steps → artifact → projection
  providers.js        routing + drafting (offline templates + pluggable model)
  store.js            errands + vault + wins (IndexedDB + localStorage fallback)
  pile.js · fight.js · wins.js · vault.js · settings.js · onboarding.js · ui.js
manifest.webmanifest, sw.js     installable PWA + offline shell
test/                 node_smoke.mjs + selftest.html
```

## Licence

**GNU AGPL-3.0-or-later** — see [`LICENSE`](LICENSE). Copyleft, including over a network:
anyone may use, study, run, and improve Recourse, but derivatives and hosted versions must
stay open under the same terms. This keeps Recourse a commons.

## Contributing

The most valuable contribution is a new, well-researched **fight template** with citations
to the relevant consumer rights, or a translation of an existing one. See `js/templates.js`
for the shape. Issues and pull requests welcome.
