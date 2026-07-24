# Recourse — NLnet / NGI proposal (draft v2)

> For submission via https://nlnet.nl/propose when the general NGI Zero / "Open Internet
> Stack" call reopens (thematic-only pause in effect as of July 2026). Mapped to NLnet's
> form fields. Tuned to what NLnet rewards: real FOSS + an **open standard**, a **reusable
> component** others can adopt, a **narrow concrete scope**, **on-device / no-server**
> privacy, and a small **results-based** budget.

---

**Project name:** Recourse

**Website / repository:** https://github.com/chndemirpence/recourse

**Requested amount:** €22,000 (equity-free; paid per completed, publicly-verifiable milestone)

**Licence:** AGPL-3.0-or-later. **Uses generative-AI tooling:** yes (disclosed; used as a
coding aid).

---

## Abstract

Recourse helps people exercise their consumer rights — disputing unfair charges, cancelling
subscription dark patterns, negotiating bills, reclaiming refused refunds, requesting data
erasure — with a tool that runs **entirely on their own device**: no server, no account, no
fee. Its heart is an **open, machine-readable standard for "dispute templates"** (a
documented schema linking each template to the underlying consumer right) plus a reference
**commons library** any application can consume. The grant funds two concrete things: (1) an
**open template standard + library** so consumer-rights knowledge becomes reusable open
infrastructure rather than a private asset, and (2) a **bundled on-device model** so drafting
runs with **zero data egress**. Released under AGPL-3.0.

## Can you explain the whole project and its expected outcome(s)?

The imbalance between a person and an institution is mostly an imbalance of time, knowledge
and persistence — exactly what cancellation mazes and hold-music attrition exploit. Recourse
rebalances it with software the user fully controls and that never sees their data.

A working prototype already exists (installable PWA, zero backend, IndexedDB storage, 24-check
test suite) with an errand inbox, a strategy/"fight" builder, a local wins ledger, a private
vault, and 12 research-grounded templates that each render a usable letter/script offline with
an escalation ladder.

This project turns that into **reusable open infrastructure** with two deliverables:

1. **An open "consumer-dispute template" standard + commons.** A documented, versioned,
   machine-readable schema for dispute/cancellation/refund templates, each citing the
   consumer right it relies on (chargeback rules, auto-renewal law, right-to-erasure), with a
   validator and a contribution workflow — so **any** local-first app, not just Recourse, can
   consume the same commons. Knowledge compounds in the open instead of being enclosed.
2. **On-device drafting.** Replace the current optional bring-your-own cloud key with a
   **bundled quantised local model (WebGPU/wasm)** that tailors drafts fully offline. Cloud
   providers become a clearly-labelled optional fallback. Released as a reusable module.

Expected outcome: a maintained, self-hostable, fully offline consumer-empowerment tool **and**
an open standard + commons of consumer-rights knowledge that the wider ecosystem can reuse.

## Have you been involved with projects/organisations relevant to this project before?

Recourse is built and maintained by an independent solo engineer. The existing repository — a
zero-dependency vanilla-JS PWA with a pure, tested agent/template/provider architecture,
IndexedDB persistence with graceful fallback, and a 24-check headless test suite — is entirely
my own work and demonstrates the ability to deliver the milestones. I am the sole author and
copyright holder; it is published here under AGPL-3.0.

## Explain what the requested budget will be used for

Equity-free, results-based, paid per completed and publicly-verifiable milestone:

| # | Milestone | Deliverable | € |
|---|-----------|-------------|---|
| 1 | Open dispute-template standard + commons | Documented machine-readable schema + validator + contribution workflow + ≥20 cited templates, reusable by any app | 8,000 |
| 2 | On-device drafting | Bundled quantised local model (WebGPU/wasm) drafting fully offline; released as a reusable module; cloud key becomes optional | 9,000 |
| 3 | Hardening, docs & release | Reproducible build, WCAG basics, threat model, self-hosting guide, security review, community launch | 5,000 |
| | **Total** | | **22,000** |

## Does the project have other funding sources, past or present?

No. Recourse has no external funding, investors, or revenue; it is non-commercial and takes no
fees from users. This grant would be its first and only funding.

## Compare your project with existing or historical efforts

Venture-backed consumer-advocacy apps share the goal but not the design: they typically take a
**35–60% success-fee cut**, act opaquely on the user's behalf, and centralise sensitive
financial data on their own servers; one prominent effort drew an FTC order for overclaiming.
Recourse inverts all of that — no fee, full transparency, user approves every action, data
never leaves the device — and, crucially, publishes the **knowledge itself as an open standard
+ commons** rather than a proprietary asset, so it is auditable and reusable. Generic local
LLM chat can draft a letter but carries no cited, jurisdiction-aware, machine-readable strategy
and mostly routes through the cloud.

## Significant technical challenges you expect to solve

- A template schema that is simultaneously **machine-fillable, human-readable, citable and
  multi-jurisdiction**, with a review workflow that keeps legal-information quality high
  without ever crossing into legal advice.
- Running a **useful** quantised model fully in-browser/on-device (WebGPU/wasm) within
  acceptable memory and latency, degrading gracefully on low-end hardware.
- Keeping all evidence and drafts local and portable without a server or account.

## Ecosystem and community engagement

Recourse is designed as shared substrate, not a walled product. Plan: publish under AGPL-3.0 on
a public forge with a contribution guide focused on new cited templates and translations to the
open standard; release the on-device drafting component as a reusable module; engage
consumer-rights, digital-rights, and self-hosting/privacy communities (natural contributors and
users); and document the schema so other NGI/local-first projects adopt it. Success = template
coverage and translations contributed, downstream reuse of the standard, and money/time
recovered for users (recorded locally, never collected).

---

### Notes for us (not for submission)
- **Budget €22k / 3 milestones** — sits in NLnet's small-grant sweet spot (~€5k–€50k,
  results-based). Fits their preference for narrow, concrete, reusable work.
- **Reframed around an OPEN STANDARD + reusable component + commons** (what NLnet funds most
  easily) rather than "an app".
- Confirm exact call + transversal requirements when the general fund reopens.
- No mention anywhere of any commercial/closed version.
