// AUTO-GENERATED — do not edit by hand.
// Source of truth: standard/templates/*.json (Open Dispute-Template Standard, ODTS).
// The app's fight list is derived from the open standard. Regenerate with:
//   node standard/build-app-templates.mjs
import { render as odtsRender } from "../standard/adapter.mjs";

const EMOJI = { subscriptions: "🚫", billing: "⚠️", bills: "📉", purchases: "📦", privacy: "🛡️", disputes: "📣" };

const ODTS = [
  {
    "odts_version": "0.1",
    "id": "cancel-subscription-uk",
    "version": "1.0.0",
    "title": "Cancel a subscription (UK)",
    "category": "subscriptions",
    "summary": "UK variant: cancel a distance-contract subscription, citing the 14-day cancellation right and the UK's strengthened subscription rules.",
    "unit": "money",
    "est_value_hint": 180,
    "jurisdictions": [
      "UK"
    ],
    "channel": "Email / in-app + written record",
    "goal_default": "Please cancel my subscription, stop all future billing, and confirm in writing with an effective date.",
    "fields": [
      {
        "name": "target",
        "label": "Company / provider",
        "required": true
      },
      {
        "name": "account",
        "label": "Account or reference",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "For a distance contract, you generally have a 14-day right to cancel from the day it was entered into.",
        "basis": "The Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013.",
        "jurisdiction": "UK"
      },
      {
        "claim": "UK law is strengthening subscription rules — clearer information, cancellation reminders, and an easy exit.",
        "basis": "Digital Markets, Competition and Consumers Act 2024 (subscription contracts provisions).",
        "jurisdiction": "UK"
      },
      {
        "claim": "If you are billed after a confirmed cancellation, your card issuer can reverse it via chargeback.",
        "basis": "Card-scheme chargeback rules; Section 75 protection may also apply for credit-card purchases.",
        "jurisdiction": "UK"
      }
    ],
    "ladder": [
      "In-app / written cancellation to the provider",
      "Formal complaint citing the 2013 Regulations",
      "Card-issuer chargeback if billed after cancellation",
      "Trading Standards / Citizens Advice consumer service"
    ],
    "artifact": {
      "type": "email",
      "subject": "Cancellation of my subscription{{account_suffix}} — written notice (UK)",
      "body": "To: {{target}} Billing / Support\n\nHello,\n\nI am writing to cancel my subscription{{account_suffix}}. {{goal}}\n\nPlease treat this as formal written notice. Where a 14-day cancellation right under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 applies, I am exercising it. If any charge is taken after this notice, I will ask my card issuer to reverse it.\n\nPlease reply within 5 business days with written confirmation and the effective date.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information about your rights, not legal advice, and guarantees no outcome. Whether the 14-day right applies depends on the contract and timing.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Email / in-app + written record",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "cancel-subscription",
    "version": "1.0.0",
    "title": "Cancel a subscription",
    "category": "subscriptions",
    "summary": "Written cancellation with a paper trail; chargeback fallback if billed after.",
    "unit": "money",
    "est_value_hint": 180,
    "jurisdictions": [
      "*",
      "US",
      "EU",
      "UK"
    ],
    "channel": "Email / in-app + written record",
    "goal_default": "Please stop all future billing and confirm the cancellation in writing with a confirmation number and effective date.",
    "fields": [
      {
        "name": "target",
        "label": "Company / provider",
        "required": true,
        "placeholder": "e.g. Acme"
      },
      {
        "name": "account",
        "label": "Account or reference",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "Charges applied after a confirmed cancellation are routinely reversed by card issuers.",
        "basis": "Card-scheme chargeback rules covering cancelled or unauthorised recurring services.",
        "jurisdiction": "*"
      },
      {
        "claim": "Cancellation flows that require phone calls or hide the cancel option are dark patterns under regulatory scrutiny.",
        "basis": "FTC negative-option / 'click to cancel' rulemaking.",
        "jurisdiction": "US"
      },
      {
        "claim": "Keep the confirmation number and a screenshot as proof of the cancellation.",
        "basis": "Evidentiary best practice for a later dispute.",
        "jurisdiction": "*"
      }
    ],
    "ladder": [
      "Support / in-app cancel",
      "Written cancellation to billing@",
      "Card-issuer chargeback if charged after a confirmed cancel",
      "State AG / FTC (or national consumer regulator) complaint for dark-pattern cancel walls"
    ],
    "artifact": {
      "type": "email",
      "subject": "Cancellation of my subscription{{account_suffix}} — written notice",
      "body": "To: {{target}} Billing/Support\n\nHello,\n\nI am writing to cancel my subscription{{account_suffix}}, effective immediately. {{goal}}\n\nPlease treat this email as formal written notice. I am not requesting a retention offer. If any charge is applied after this notice, I will dispute it with my card issuer as a cancelled service.\n\nPlease reply within 5 business days with written confirmation.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Email / in-app + written record",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "charged-after-cancellation",
    "version": "1.0.0",
    "title": "Refund charges billed after cancellation",
    "category": "subscriptions",
    "summary": "You cancelled and hold a confirmation, yet were billed — demand a refund, escalate to chargeback with proof.",
    "unit": "money",
    "est_value_hint": 90,
    "jurisdictions": [
      "*"
    ],
    "channel": "Email + chargeback",
    "goal_default": "Please refund all charges applied after my cancellation date and confirm in writing.",
    "fields": [
      {
        "name": "target",
        "label": "Company",
        "required": true
      },
      {
        "name": "account",
        "label": "Account or reference",
        "required": false
      },
      {
        "name": "date",
        "label": "Cancellation date",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "With a cancellation confirmation, card issuers routinely issue chargebacks for continued billing.",
        "basis": "Card-scheme chargeback rules for cancelled recurring services.",
        "jurisdiction": "*"
      },
      {
        "claim": "Reference your confirmation number and cancellation date explicitly to speed the reversal.",
        "basis": "Evidentiary best practice.",
        "jurisdiction": "*"
      }
    ],
    "ladder": [
      "Refund demand with the cancellation confirmation attached",
      "Card-issuer chargeback (banks accept these routinely)",
      "Consumer regulator complaint"
    ],
    "artifact": {
      "type": "email",
      "subject": "Refund — charged after a confirmed cancellation{{account_suffix}}",
      "body": "To: {{target}} Billing\n\nHello,\n\nI cancelled{{date_on}} and hold a cancellation confirmation, yet I continued to be billed. {{goal}}\n\nIf this is unresolved within 7 business days I will present my cancellation confirmation to my card issuer for a chargeback.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Email + chargeback",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "delete-personal-data",
    "version": "1.0.0",
    "title": "Delete my personal data (GDPR / CCPA)",
    "category": "privacy",
    "summary": "Exercise the right to erasure: ask a controller to delete your personal data and confirm.",
    "unit": "time",
    "est_value_hint": 1,
    "jurisdictions": [
      "EU",
      "UK",
      "US-CA"
    ],
    "channel": "Privacy / DPO email",
    "goal_default": "Please erase my personal data, stop processing it, and confirm completion in writing.",
    "fields": [
      {
        "name": "target",
        "label": "Company / controller",
        "required": true
      },
      {
        "name": "data_ref",
        "label": "Account email or identifier the data is under",
        "required": true,
        "placeholder": "e.g. jane@example.com"
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "You have a right to erasure of your personal data ('right to be forgotten').",
        "basis": "GDPR Article 17 (EU/UK).",
        "jurisdiction": "EU"
      },
      {
        "claim": "You can request deletion of personal information a business has collected about you.",
        "basis": "California Consumer Privacy Act (CCPA), right to delete.",
        "jurisdiction": "US-CA"
      },
      {
        "claim": "The controller must respond within the statutory window (e.g. one month under GDPR).",
        "basis": "GDPR Article 12(3).",
        "jurisdiction": "EU"
      }
    ],
    "ladder": [
      "Privacy request to the DPO / privacy team",
      "Supervisory authority (DPA) or state Attorney General complaint if ignored"
    ],
    "artifact": {
      "type": "email",
      "subject": "Request to delete my personal data",
      "body": "To: {{target}} Privacy Team / DPO\n\nHello,\n\nI am exercising my right to request deletion of the personal data associated with {{data_ref}}. {{goal}}\n\nPlease confirm receipt and the expected completion date within the timeframe required by applicable law.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Privacy / DPO email",
      "Send it and keep a record"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "dispute-unauthorized-charge-eu",
    "version": "1.0.0",
    "title": "Dispute an unauthorised charge (EU — PSD2)",
    "category": "billing",
    "summary": "EU variant: ask your own bank / payment service provider to refund an unauthorised transaction under PSD2.",
    "unit": "money",
    "est_value_hint": 80,
    "jurisdictions": [
      "EU"
    ],
    "channel": "Your bank / payment service provider (written)",
    "goal_default": "Please refund this unauthorised payment transaction and confirm in writing.",
    "fields": [
      {
        "name": "target",
        "label": "Your bank / payment provider",
        "required": true
      },
      {
        "name": "amount",
        "label": "Transaction amount",
        "required": false
      },
      {
        "name": "date",
        "label": "Transaction date",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "If you notify your provider of an unauthorised transaction without undue delay, it must refund the amount — in principle by the end of the following business day.",
        "basis": "Payment Services Directive 2 (Directive (EU) 2015/2366), Article 73.",
        "jurisdiction": "EU"
      },
      {
        "claim": "Your liability for unauthorised transactions is limited, and nil once you have reported the loss or unauthorised use.",
        "basis": "PSD2 (Directive (EU) 2015/2366), Article 74.",
        "jurisdiction": "EU"
      }
    ],
    "ladder": [
      "Written notification to your bank / payment provider (cite PSD2)",
      "Formal complaint to the provider",
      "National financial ombudsman / competent authority under PSD2"
    ],
    "artifact": {
      "type": "email",
      "subject": "Unauthorised payment transaction{{amount_clause}} — refund requested (PSD2)",
      "body": "To: {{target}} — Disputes / Payment Services\n\nHello,\n\nI am reporting an unauthorised payment transaction{{amount_clause}}{{date_clause}} on my account. I did not authorise it and am notifying you without undue delay.\n\nUnder Article 73 of the revised Payment Services Directive (Directive (EU) 2015/2366), please refund this transaction, in principle by the end of the following business day, and restore my account to the state it would have been in. {{goal}}\n\nPlease provide a reference for this report.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information about your rights, not legal advice, and guarantees no outcome. Exact handling can depend on your provider and circumstances.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Your bank / payment service provider (written)",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "dispute-unauthorized-charge",
    "version": "1.0.0",
    "title": "Dispute an unauthorised charge",
    "category": "billing",
    "summary": "Notify the merchant and file an issuer dispute in parallel for a duplicate or unauthorised charge.",
    "unit": "money",
    "est_value_hint": 60,
    "jurisdictions": [
      "*",
      "US",
      "EU",
      "UK"
    ],
    "channel": "Card issuer dispute + merchant email",
    "goal_default": "Please reverse this charge and confirm in writing.",
    "fields": [
      {
        "name": "target",
        "label": "Merchant",
        "required": true
      },
      {
        "name": "amount",
        "label": "Charge amount",
        "required": false,
        "placeholder": "e.g. $49.00"
      },
      {
        "name": "date",
        "label": "Charge date",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "You generally have chargeback rights for unauthorised or duplicate card charges.",
        "basis": "Card-scheme chargeback rules; US Fair Credit Billing Act for credit cards.",
        "jurisdiction": "US"
      },
      {
        "claim": "Filing with the merchant and the card issuer in parallel speeds resolution.",
        "basis": "Standard dispute-handling practice across issuers.",
        "jurisdiction": "*"
      }
    ],
    "ladder": [
      "Merchant refund request",
      "Card-issuer dispute / chargeback",
      "Consumer regulator complaint if there is a pattern of unauthorised billing"
    ],
    "artifact": {
      "type": "email",
      "subject": "Unauthorised charge{{account_suffix}} — refund requested",
      "body": "To: {{target}} Support\n\nHello,\n\nI identified a charge{{amount_clause}}{{date_clause}} that I did not authorise. {{goal}}\n\nIf I do not receive a resolution within 7 business days, I will file a formal dispute with my card issuer. Please provide a case number for this request.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Card issuer dispute + merchant email",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "escalate-complaint",
    "version": "1.0.0",
    "title": "Escalate an unresolved complaint",
    "category": "disputes",
    "summary": "Take an unresolved issue to the executive/complaints team with a clear resolution and a regulator fallback.",
    "unit": "time",
    "est_value_hint": 2,
    "jurisdictions": [
      "*"
    ],
    "channel": "Executive email + regulator",
    "goal_default": "The resolution I am seeking is: [state it clearly].",
    "fields": [
      {
        "name": "target",
        "label": "Company",
        "required": true
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "Executive / complaints teams resolve what front-line staff cannot.",
        "basis": "Common corporate escalation structure (office of the president / executive relations).",
        "jurisdiction": "*"
      },
      {
        "claim": "A clear, dated summary of prior attempts strengthens the escalation.",
        "basis": "Complaint-handling best practice.",
        "jurisdiction": "*"
      },
      {
        "claim": "Naming the specific regulator or ombudsman signals you are serious.",
        "basis": "Availability of sector regulators / ombudsman schemes.",
        "jurisdiction": "*"
      }
    ],
    "ladder": [
      "Formal complaint to the executive / complaints team",
      "Regulator / ombudsman / BBB filing",
      "Public review + social escalation"
    ],
    "artifact": {
      "type": "email",
      "subject": "Formal complaint — request for resolution",
      "body": "To: {{target}} — Office of the President / Complaints\n\nHello,\n\nDespite prior attempts, my issue remains unresolved. Summary: [what happened, dates, reference numbers].\n\n{{goal}} Please respond within 7 business days. If it remains unresolved, I will file with the relevant regulator / ombudsman and share my experience publicly.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Executive email + regulator",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "free-trial-refund-eu",
    "version": "1.0.0",
    "title": "Free-trial auto-renewal refund (EU)",
    "category": "subscriptions",
    "summary": "EU variant: a free trial converted to paid without the clear, express consent EU law requires — request a full refund.",
    "unit": "money",
    "est_value_hint": 70,
    "jurisdictions": [
      "EU"
    ],
    "channel": "Email / in-app",
    "goal_default": "Please refund the charge in full and cancel the plan.",
    "fields": [
      {
        "name": "target",
        "label": "Company",
        "required": true
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "For a distance contract by electronic means, the trader must make the obligation to pay clear and obtain your express acknowledgement; without it you are not bound by the contract or charge.",
        "basis": "Consumer Rights Directive (Directive 2011/83/EU), Article 8(2).",
        "jurisdiction": "EU"
      },
      {
        "claim": "Hiding or obscuring that a trial converts to a paid plan can be a misleading commercial practice.",
        "basis": "Unfair Commercial Practices Directive (Directive 2005/29/EC).",
        "jurisdiction": "EU"
      }
    ],
    "ladder": [
      "Refund request citing the Consumer Rights Directive",
      "Chargeback for an undisclosed auto-renewal",
      "National consumer authority / European Consumer Centre"
    ],
    "artifact": {
      "type": "email",
      "subject": "Refund — free trial converted without clear, express consent (EU)",
      "body": "To: {{target}} Support\n\nHello,\n\nMy free trial converted to a paid plan without the clear, conspicuous information and express consent required for a distance contract by electronic means under Article 8(2) of the Consumer Rights Directive (2011/83/EU). {{goal}}\n\nPlease point to where explicit consent to be charged was obtained; otherwise I consider that I am not bound by this charge and will seek a chargeback and, if needed, contact the relevant consumer authority.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information about your rights, not legal advice, and guarantees no outcome. Application depends on the trader's disclosures and your circumstances.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Email / in-app",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "free-trial-refund",
    "version": "1.0.0",
    "title": "Free-trial auto-renewal refund",
    "category": "subscriptions",
    "summary": "A free trial converted to paid without clear consent — request a full refund and cancellation.",
    "unit": "money",
    "est_value_hint": 70,
    "jurisdictions": [
      "*",
      "US",
      "EU"
    ],
    "channel": "Email / in-app",
    "goal_default": "Please refund the charge in full and cancel the plan.",
    "fields": [
      {
        "name": "target",
        "label": "Company",
        "required": true
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "Unclear trial-to-paid conversions have been found deceptive by regulators.",
        "basis": "FTC actions on negative-option / auto-renewal disclosures; EU unfair commercial practices.",
        "jurisdiction": "US"
      },
      {
        "claim": "You can ask them to point to where explicit auto-renewal consent was obtained.",
        "basis": "Consent/disclosure requirements for auto-renewals.",
        "jurisdiction": "EU"
      }
    ],
    "ladder": [
      "Refund request",
      "Chargeback for an undisclosed auto-renewal",
      "Consumer regulator complaint (deceptive conversion)"
    ],
    "artifact": {
      "type": "email",
      "subject": "Refund — free trial auto-converted without clear consent",
      "body": "To: {{target}} Support\n\nHello,\n\nMy free trial converted to a paid plan without clear, conspicuous consent. {{goal}}\n\nPlease point to where explicit auto-renewal consent was obtained; otherwise I consider this a deceptive conversion and will seek a chargeback.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Email / in-app",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "medical-bill",
    "version": "1.0.0",
    "title": "Medical bill: itemise + reduce",
    "category": "bills",
    "summary": "Request a fully itemised bill, check for errors, and ask about financial assistance or a settlement.",
    "unit": "money",
    "est_value_hint": 300,
    "jurisdictions": [
      "US"
    ],
    "channel": "Written request to the billing office",
    "goal_default": "I am also requesting information on financial-assistance / charity-care programs and any prompt-pay discount, and I would like to discuss a reasonable settlement or a 0% payment plan.",
    "fields": [
      {
        "name": "target",
        "label": "Provider / hospital",
        "required": true
      },
      {
        "name": "account",
        "label": "Account or reference",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "You can request a fully itemised bill; errors and duplicate billing codes are common.",
        "basis": "Standard medical-billing practice; itemised statements available on request.",
        "jurisdiction": "US"
      },
      {
        "claim": "Many hospitals have financial-assistance / charity-care programs that are under-advertised.",
        "basis": "Non-profit hospital financial-assistance obligations (e.g. IRS 501(r)).",
        "jurisdiction": "US"
      },
      {
        "claim": "A prompt-pay cash discount is often available if you ask.",
        "basis": "Common provider prompt-pay discount practice.",
        "jurisdiction": "US"
      }
    ],
    "ladder": [
      "Itemised-bill request",
      "Error review + insurance re-file",
      "Financial-assistance / charity-care application",
      "Negotiated settlement or 0% payment plan"
    ],
    "artifact": {
      "type": "letter",
      "subject": "Request for itemised bill and financial review{{account_suffix}}",
      "body": "To: {{target}} Billing Office\n\nHello,\n\nPlease send a fully itemised bill listing each charge and billing code{{account_suffix}}. I want to review it for errors before payment.\n\n{{goal}}\n\nPlease pause any collection activity while this review is in progress.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal or financial advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Written request to the billing office",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "negotiate-a-bill",
    "version": "1.0.0",
    "title": "Negotiate a bill down",
    "category": "bills",
    "summary": "Retention-line call/chat script using the loyalty-penalty angle; lock the new rate in writing.",
    "unit": "money",
    "est_value_hint": 240,
    "jurisdictions": [
      "*"
    ],
    "channel": "Retention line / chat (script)",
    "goal_default": "I'd like to lower my monthly bill to stay.",
    "fields": [
      {
        "name": "target",
        "label": "Provider",
        "required": true
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "Long-term customers often pay a 'loyalty penalty' — new-customer rates are the anchor to ask for.",
        "basis": "Regulator findings on loyalty penalties (e.g. UK CMA super-complaint on loyalty pricing).",
        "jurisdiction": "UK"
      },
      {
        "claim": "Retention desks hold discounts that front-line agents cannot offer.",
        "basis": "Common industry retention practice.",
        "jurisdiction": "*"
      },
      {
        "claim": "Always get the new rate and how long it is locked, in writing.",
        "basis": "Evidentiary best practice for enforcing the agreed price.",
        "jurisdiction": "*"
      }
    ],
    "ladder": [
      "Front-line retention offer",
      "Ask for the loyalty / retention department",
      "Cite a competitor price and be ready to switch",
      "Confirm the new rate + duration in writing"
    ],
    "artifact": {
      "type": "script",
      "body": "CALL / CHAT SCRIPT — {{target}} retention\n\nOpening:\n\"Hi, I've been a customer for a while and my rate has crept up. I'm comparing providers today. {{goal}}\"\n\nIf offered a small discount:\n\"I appreciate that — but new customers are paying less than me. Can you connect me to the loyalty / retention team?\"\n\nClose:\n\"Great. Please confirm the new monthly rate and how many months it's locked, in writing to my email.\"\n\nNotes: stay friendly, be ready to name a competitor price, and be willing to schedule a callback.\n\n— {{name}}"
    },
    "disclaimer": "This is information to help you prepare your own call. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Prepare the script",
      "Use the channel: Retention line / chat (script)",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "price-match",
    "version": "1.0.0",
    "title": "Price-match / better-offer request",
    "category": "purchases",
    "summary": "Ask a retailer to match a lower price or refund the difference under its price-match policy.",
    "unit": "money",
    "est_value_hint": 40,
    "jurisdictions": [
      "*"
    ],
    "channel": "Chat / email",
    "goal_default": "price match or a refund of the difference",
    "fields": [
      {
        "name": "target",
        "label": "Retailer",
        "required": true
      },
      {
        "name": "amount",
        "label": "Price difference",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "Many retailers offer price matching or a post-purchase price adjustment within a set window.",
        "basis": "Common retailer price-match / price-adjustment policies.",
        "jurisdiction": "*"
      },
      {
        "claim": "A screenshot or link to the qualifying lower price usually suffices.",
        "basis": "Standard evidence a price-match desk accepts.",
        "jurisdiction": "*"
      }
    ],
    "ladder": [
      "Price-match request",
      "Post-purchase price adjustment",
      "Return + rebuy at the lower price"
    ],
    "artifact": {
      "type": "email",
      "subject": "Price match / price adjustment request",
      "body": "To: {{target}} Support\n\nHello,\n\nI found this item at a lower price and would like to request a {{goal}}{{amount_clause}}, per your price-match policy.\n\nI can provide a screenshot / link to the qualifying offer. Please advise how to proceed.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Chat / email",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "refund-defective-purchase",
    "version": "1.0.0",
    "title": "Refund a defective / not-as-described purchase",
    "category": "purchases",
    "summary": "Full refund or replacement for a defective or not-as-described item, with a chargeback fallback.",
    "unit": "money",
    "est_value_hint": 80,
    "jurisdictions": [
      "*",
      "EU",
      "UK"
    ],
    "channel": "Email + return portal",
    "goal_default": "Please issue a full refund or send a replacement, along with a prepaid return label.",
    "fields": [
      {
        "name": "target",
        "label": "Seller",
        "required": true
      },
      {
        "name": "amount",
        "label": "Amount paid",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "Items that are faulty or not as described are commonly covered by statutory rights or buyer protection.",
        "basis": "EU/UK consumer sales rights for non-conforming goods (e.g. UK Consumer Rights Act 2015).",
        "jurisdiction": "UK"
      },
      {
        "claim": "A card chargeback for 'not as described' is a strong fallback if the seller refuses.",
        "basis": "Card-scheme chargeback rules; marketplace buyer-protection programs.",
        "jurisdiction": "*"
      }
    ],
    "ladder": [
      "Merchant refund / replacement",
      "Card chargeback (not as described)",
      "Marketplace buyer-protection claim"
    ],
    "artifact": {
      "type": "email",
      "subject": "Defective / not-as-described item — refund requested",
      "body": "To: {{target}} Support\n\nHello,\n\nThe item I received is defective / not as described. {{goal}}\n\nI have photos documenting the issue and can provide them. If this is unresolved within 7 business days, I'll open a buyer-protection claim and a card dispute.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Email + return portal",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "waive-a-fee",
    "version": "1.0.0",
    "title": "Waive a late / overdraft fee",
    "category": "billing",
    "summary": "Ask for a one-time courtesy waiver as a customer in good standing; set up a safeguard so it won't recur.",
    "unit": "money",
    "est_value_hint": 35,
    "jurisdictions": [
      "*"
    ],
    "channel": "Phone / secure message (script)",
    "goal_default": "I'd like to request a one-time courtesy waiver of this fee.",
    "fields": [
      {
        "name": "target",
        "label": "Bank / provider",
        "required": true
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "First-time or rare fees are frequently waived as a one-time courtesy for customers in good standing.",
        "basis": "Standard goodwill-adjustment practice at banks and providers.",
        "jurisdiction": "*"
      },
      {
        "claim": "Setting up alerts or autopay while you ask shows good faith and prevents a repeat.",
        "basis": "Practical safeguard that strengthens the request.",
        "jurisdiction": "*"
      }
    ],
    "ladder": [
      "Front-line courtesy waiver",
      "Ask for a supervisor",
      "Mention switching if you are a long-time customer"
    ],
    "artifact": {
      "type": "script",
      "body": "MESSAGE / SCRIPT — {{target}}\n\n\"Hi, I've been a customer in good standing and just noticed a fee. {{goal}} I've already taken steps so it won't happen again — could you waive it as a goodwill gesture?\"\n\nIf declined:\n\"I understand — could you check with a supervisor? I'd really like to keep my account in good standing.\"\n\n— {{name}}"
    },
    "disclaimer": "This is information to help you prepare your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Prepare the script",
      "Use the channel: Phone / secure message (script)",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  },
  {
    "odts_version": "0.1",
    "id": "warranty-claim",
    "version": "1.0.0",
    "title": "Warranty / repair claim",
    "category": "purchases",
    "summary": "Claim a repair or replacement for a product that failed within its warranty period.",
    "unit": "money",
    "est_value_hint": 120,
    "jurisdictions": [
      "*",
      "EU",
      "UK"
    ],
    "channel": "Email to the warranty department",
    "goal_default": "Please arrange a repair or replacement under warranty and confirm the process and timeline.",
    "fields": [
      {
        "name": "target",
        "label": "Manufacturer / seller",
        "required": true
      },
      {
        "name": "date",
        "label": "Purchase date",
        "required": false
      },
      {
        "name": "name",
        "label": "Your name",
        "required": false
      }
    ],
    "rights": [
      {
        "claim": "Keep your proof of purchase and note the warranty period.",
        "basis": "Evidentiary best practice for a warranty claim.",
        "jurisdiction": "*"
      },
      {
        "claim": "Statutory rights for faulty goods may extend beyond the stated manufacturer warranty.",
        "basis": "EU/UK consumer sales law (e.g. UK Consumer Rights Act 2015; EU Directive 2019/771).",
        "jurisdiction": "EU"
      }
    ],
    "ladder": [
      "Warranty claim to the manufacturer / seller",
      "Manufacturer escalation",
      "Consumer-protection complaint"
    ],
    "artifact": {
      "type": "email",
      "subject": "Warranty claim — repair or replacement",
      "body": "To: {{target}} Warranty Department\n\nHello,\n\nMy product developed a fault{{date_clause}} within its warranty period. {{goal}}\n\nI can provide proof of purchase and photos/video of the fault on request.\n\nSincerely,\n{{name}}"
    },
    "disclaimer": "This is information to help you write your own request. It is not legal advice and guarantees no outcome.",
    "__plan": [
      "Confirm the facts and your goal",
      "Draft the letter",
      "Use the channel: Email to the warranty department",
      "Send it and keep a record",
      "Escalate up the ladder if there's no reply"
    ]
  }
];

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
      return (o.subject ? "Subject: " + o.subject + "\n\n" : "") + o.body;
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
