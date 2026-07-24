# Contributing to Recourse

Hi — thanks for being here.

I started Recourse because I got tired of losing. Not losing arguments — losing *time*, and
small amounts of money I was owed, to companies that count on people giving up. The most useful
thing this project can become is not the app; it's the **open library of "fights"** — the
templates and the consumer rights behind them — that anyone can read, improve, translate, and
reuse. That library only gets good if people who know a domain or a jurisdiction help build it.

So the contribution I value most is a **template**.

## Add or improve a fight template

Templates live in `standard/templates/` as plain JSON, in the Open Dispute-Template Standard
(ODTS) — see [`standard/README.md`](standard/README.md). To add one:

1. Copy an existing file in `standard/templates/` as a starting point.
2. Fill it in. The parts that matter most:
   - **`rights`** — each leverage point needs a real `basis` (cite the rule it rests on). This
     is *information*, never a promise. If you can't cite it, leave it out.
   - **`artifact.body`** — write it the way a real person would, firm and polite. Use
     `{{placeholders}}`; the validator lists which ones are allowed.
   - Keep the **`disclaimer`**. Recourse is not a lawyer and never claims to be.
3. Run the validator:
   ```bash
   node standard/validate.mjs
   ```
   It checks structure, that every right is cited, and that no placeholder is left dangling.
4. Open a pull request. Tell me, in your own words, who this fight is for.

**Translating an existing template into another language or jurisdiction is just as valuable
as writing a new one.** Consumer rights differ by country; a template that works in the US may
need different `rights` and `jurisdictions` for the EU or UK. Those variants are exactly what
the commons is for.

## Code

The app is vanilla HTML + CSS + ES modules, zero dependencies, no build step — on purpose, so
anyone can read the whole thing. Please keep it that way. `node test/node_smoke.mjs` and
`node standard/validate.mjs` should both stay green.

## Ground rules

Templates speak truthfully, as the user. No fabricated facts, no forged documents, no coaching
anyone to deceive, and no legal advice — only publicly-known rights, framed as information.
That line is the whole point of Recourse; please hold it.

## A note

I'm one person maintaining this in the open. If a reply takes a while, that's why — not lack of
interest. If Recourse ever helps you get something back that you'd given up on, that's the whole
reason it exists. Tell me about it.
