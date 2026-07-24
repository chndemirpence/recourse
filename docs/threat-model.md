# Recourse — threat model & data flows

A short, honest account of what data exists, where it lives, and what Recourse does and does not
protect against. Recourse is a privacy tool, so this is a first-class document.

## Assets (what is sensitive)

- Your errands and the facts in them (companies, amounts, references).
- The **Vault**: accounts, policies, bills, personal facts you add.
- Draft artifacts (letters/scripts) and any evidence you note.

## Where data lives

**On your device, in your browser only** — IndexedDB for errands/vault/wins, localStorage for
settings, with a localStorage fallback. **There is no Recourse server and no account.** We
collect nothing; there is no telemetry and no analytics.

## Data flows

- **By default: nothing leaves the device.** The app makes no third-party network requests; the
  offline templates fill entirely locally.
- **Optional AI (opt-in):** if *you* enable a cloud provider and paste *your* key, only the
  **draft text** of the artifact you are working on is sent to the **endpoint you chose**, to
  tailor it. It is labelled, off by default, and **Milestone 2 (on-device drafting) removes this
  dependency** so tailoring runs locally too.
- **Sending the final letter** leaves the device — but *you* do that yourself, in your own email
  client, after reviewing it. That is by design: you stay in control.

## Adversaries considered

| Adversary | Exposure |
|-----------|----------|
| A Recourse backend / operator | None — there is no backend. |
| Network eavesdropper | No app data in transit by default. |
| The AI provider | Sees a draft's text **only if you opt in** and only what you send. |
| Other websites / apps | Browser origin isolation; no shared storage. |
| Malware / a fully compromised device or browser | **Out of scope** — nothing running inside a compromised OS can be fully protected. |
| Shoulder-surfing | Standard device-lock hygiene applies. |

## Auditability

Recourse is AGPL-3.0 and zero-dependency vanilla JS with no build step, so the entire data path
is readable in the repository. Contributions run through CI (tests + the standard's validator).

## Out of scope (honestly)

A compromised OS/browser; your own decision to send an artifact; and the correctness of any cloud
AI provider you choose to enable. Recourse gives information about consumer rights, not legal
advice.
