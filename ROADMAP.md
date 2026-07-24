# Roadmap

Recourse mirrors the milestones in [`docs/nlnet-proposal.md`](docs/nlnet-proposal.md). This file
is the honest, public status of that plan.

## Done so far (unfunded, to prove the direction)

- Working PWA: The Pile, The Fight, Wins, The Vault; zero backend; IndexedDB storage; 24 tests.
- **ODTS — the Open Dispute-Template Standard** (`standard/`): documented schema, JSON-Schema,
  zero-dependency reference adapter + validator.
- **15 cited templates** in the standard, including **EU/UK jurisdiction variants** citing real
  law (PSD2, Consumer Rights Directive, UK Consumer Contracts Regs 2013, DMCC Act 2024).
- **The app's fight list is generated from the standard** (`standard/build-app-templates.mjs`) —
  the open ODTS is the single source of truth, and CI fails on any drift. The standard is the
  engine, not a side artifact.
- Human contribution guide; CI running tests + the validator on every push.

## Milestone 1 — Open dispute-template standard + commons  *(grant)*

Harden ODTS to a stable v1: finalise the schema, grow to a broad, well-cited, multi-jurisdiction
library, add the contribution/review workflow, and make the app consume the standard directly so
the commons is the single source of truth.

## Milestone 2 — On-device drafting  *(grant)*

Replace the optional bring-your-own cloud key with a **bundled quantised local model
(WebGPU/wasm)** that tailors drafts fully offline. Cloud providers become a clearly-labelled
optional fallback. Ship the drafting component as a reusable module.

## Milestone 3 — Hardening & release  *(grant)*

Reproducible build, WCAG basics, threat model (see [`docs/threat-model.md`](docs/threat-model.md)),
self-hosting guide, security review, community launch.

## Beyond the grant

Real send rails that keep artifacts local; outcome tracking (local-only); more jurisdictions and
translations contributed by the community.
