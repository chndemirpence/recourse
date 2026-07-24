# Recourse — NLnet / NGI proposal (draft)

> Working draft for submission via https://nlnet.nl/propose when the general
> NGI Zero / "Open Internet Stack" call reopens (the thematic-only pause was in
> effect as of July 2026). Mapped to NLnet's proposal form fields. Requested
> amount and milestones are a starting point to refine together.

---

**Project name:** Recourse

**Website / repository:** <public git URL — to be created (Codeberg/GitHub/GitLab)>

**Requested amount:** €44,000 (equity-free; milestone-based)

---

## Abstract

Recourse is a free, local-first assistant that helps ordinary people exercise their
consumer rights — disputing unfair charges, cancelling subscription dark patterns,
negotiating bills, reclaiming refused refunds, requesting data erasure. It drafts the
letter, plans the escalation, and surfaces the user's real leverage as information,
entirely on the user's own device: no server, no account, no success fee. Its core is an
**open, versioned "fight commons"** — a library of research-grounded dispute templates
anyone can read, improve, translate, and reuse. The grant funds the step that makes the
tool honestly private: replacing the current optional bring-your-own-key cloud model with
a **bundled on-device AI**, so drafting and strategy run with **zero data egress**.
Released under AGPL-3.0.

## Can you explain the whole project and its expected outcome(s)?

The power asymmetry between a person and an institution is largely an asymmetry of time,
knowledge, and persistence — which is exactly what cancellation mazes and hold-music
attrition are engineered to exploit. Recourse rebalances that asymmetry with software the
user fully controls and that never sees their data.

Today Recourse already works as an installable PWA with four surfaces (an errand inbox, a
strategy/"fight" builder, a local wins ledger with shareable cards, and a private context
vault) and **12 research-grounded templates** that each render a genuinely usable letter or
call-script offline, with an escalation ladder and leverage points. Storage is entirely
local (IndexedDB); there is no backend.

The one honesty gap is that *optional* AI tailoring currently calls a user-supplied cloud
model, so enabling it lets draft text leave the device. The project closes that gap and
turns the template set into a true commons. Expected outcomes:

1. **On-device AI**: a bundled, quantised local model (text) plus local speech-to-text, so
   tailoring/strategy run fully offline — no key, no cloud, no egress. Cloud providers
   become a strictly optional, clearly-labelled fallback.
2. **An open "fight commons"**: a community-curated, multi-jurisdiction, versioned template
   library with citations to the underlying rights (chargeback rules, auto-renewal law,
   right-to-erasure), contributable by anyone and reusable by any application.
3. **Local, verifiable evidence handling**: artifacts and their proof stay on-device with
   a portable, inspectable export.
4. **Accessibility & i18n**: usable by the people who most need recourse, in multiple
   languages, meeting WCAG basics.

Outcome: a maintained, self-hostable, fully offline consumer-empowerment tool and an
open commons of consumer-rights knowledge that other projects can build on.

## Have you been involved with projects/organisations relevant to this project before?

Recourse is built and maintained by an independent solo engineer. The existing codebase —
a zero-dependency vanilla-JS PWA with a pure, tested agent/template/provider architecture,
IndexedDB persistence with graceful fallback, and a 24-check headless test suite — is
entirely my own work and demonstrates the ability to deliver the proposed milestones. (I
have shipped several other self-built local-first web applications.) I am the sole author
and hold the copyright, released here under AGPL-3.0.

## Explain what the requested budget will be used for

Equity-free, paid against completed, publicly-verifiable milestones:

| # | Milestone | Deliverable | € |
|---|-----------|-------------|---|
| 1 | On-device text model | Bundled quantised local LLM (llama.cpp/WebGPU) drafting fights fully offline; cloud key becomes optional fallback | 12,000 |
| 2 | On-device speech | Local speech-to-text for intake; no audio leaves the device | 6,000 |
| 3 | Fight commons v1 | Versioned, cited, multi-jurisdiction template format + contribution workflow + 25 new researched templates | 9,000 |
| 4 | Local evidence & export | Inspectable, portable on-device evidence bundle for each fight | 6,000 |
| 5 | Accessibility & i18n | WCAG pass + full localisation framework + 3 languages | 6,000 |
| 6 | Docs, packaging, security review, community launch | Self-hosting guide, threat model, reproducible build | 5,000 |
| | **Total** | | **44,000** |

## Does the project have other funding sources, past or present?

No. Recourse has no external funding, no investors, and no revenue; it is non-commercial
and takes no fees from users. This grant would be its first and only funding.

## Compare your project with existing or historical efforts

Venture-backed consumer-advocacy apps (e.g. bill-negotiation and dispute services) share
the goal but not the design: they typically take a **35–60% success-fee cut**, act opaquely
on the user's behalf, and centralise highly sensitive financial data on their own servers;
one prominent effort drew an FTC order for overclaiming. Recourse inverts every one of
those: **no fee, full transparency, user approves every action, and data never leaves the
device.** Unlike closed products, the knowledge itself (the templates + cited rights) is an
open commons under copyleft, so it compounds publicly instead of being enclosed. Generic
local LLM chat tools can draft a letter, but they carry no structured, cited,
jurisdiction-aware strategy or escalation ladder, and most still route through the cloud.

## Significant technical challenges you expect to solve

- Running a **useful** quantised LLM fully in-browser/on-device (WebGPU/wasm) within
  acceptable memory and latency, with graceful degradation on low-end hardware.
- On-device speech-to-text with reasonable accuracy and zero egress.
- A template format that is simultaneously **machine-fillable, human-readable, citable, and
  multi-jurisdiction**, with a contribution/review workflow that keeps legal-information
  quality high without ever crossing into legal advice.
- Portable, verifiable local evidence bundles without a server or account.

## Ecosystem and community engagement

Recourse is designed to be a shared substrate, not a walled product. Engagement plan:
publish under AGPL-3.0 on a public forge with an open contribution guide focused on new,
cited fight templates and translations; collaborate with consumer-rights and digital-rights
communities and the self-hosting/privacy communities (who are natural contributors and
users); publish the on-device-AI components as reusable modules; and document everything so
other NGI/local-first projects can adopt the fight-commons format. Success is measured by
money/time recovered for users (recorded locally, never collected), template coverage and
translations contributed, and downstream reuse of the commons.

---

### Notes for us (not for submission)
- Confirm the **exact open call** and its transversal requirements when the general fund
  reopens; adjust framing to that call's wording.
- Decide final **name** (working name: Recourse) and confirm **AGPL-3.0** vs EUPL-1.2.
- Create the **public repo** first — NLnet expects a reachable code URL.
- The proposal deliberately makes **no mention** of any commercial/closed version; the open
  project stands entirely on its own.
