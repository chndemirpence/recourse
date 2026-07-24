// templates.js — the fight/errand template library (the real value).
// Each render() returns a ready-to-send artifact. Truthful, no legal claims.

const sign = (name) => name ? `\n\nSincerely,\n${name}` : "\n\nSincerely,\n[Your name]";
const acct = (account) => account ? ` (account: ${account})` : "";

export const TEMPLATES = [
  {
    id: "cancel_sub", label: "Cancel a subscription", emoji: "🚫", category: "subscriptions",
    unit: "money", estValueHint: 180, channel: "Email / in-app + written record",
    goalDefault: "Cancel effective immediately and confirm no further charges",
    plan: ["Confirm cancellation rights & current billing date", "Draft written cancellation request", "Send via the required channel + keep the confirmation", "If billed after: escalate to a chargeback"],
    ladder: ["Support / in-app cancel", "Written cancellation to billing@", "Card issuer chargeback if charged after confirmed cancel", "State AG / FTC complaint for dark-pattern cancel walls"],
    leverage: ["Charges after a confirmed cancellation are routinely reversed by card issuers.", "Cancellation flows requiring calls or hidden steps are dark patterns under FTC scrutiny.", "Keep the confirmation number and a screenshot as proof."],
    render: ({ name, target, goal, account }) =>
`To: ${target || "[Company]"} Billing/Support
Subject: Cancellation of my subscription${acct(account)} — written notice

Hello,

I am writing to cancel my subscription${acct(account)}, effective immediately. ${goal || "Please stop all future billing and confirm the cancellation in writing with a confirmation number and effective date."}

Please treat this email as formal written notice. I am not requesting a retention offer. If any charge is applied after this notice, I will dispute it with my card issuer as a cancelled service.

Please reply within 5 business days with written confirmation.${sign(name)}`,
  },
  {
    id: "dispute_charge", label: "Dispute an unauthorized charge", emoji: "⚠️", category: "billing",
    unit: "money", estValueHint: 60, channel: "Card issuer dispute + merchant email",
    goalDefault: "Reverse an unauthorized or duplicate charge",
    plan: ["Gather the charge date, amount & descriptor", "Draft merchant notice", "File issuer dispute in parallel", "Track the provisional credit"],
    ladder: ["Merchant refund request", "Card issuer dispute / chargeback", "Regulator complaint if pattern of unauthorized billing"],
    leverage: ["You generally have chargeback rights for unauthorized or duplicate charges.", "Filing with the merchant AND the issuer in parallel speeds resolution.", "Note the exact statement descriptor and date."],
    render: ({ name, target, goal, amount, date }) =>
`To: ${target || "[Merchant]"} Support
Subject: Unauthorized charge — refund requested

Hello,

I identified a charge${amount ? ` of ${amount}` : ""}${date ? ` dated ${date}` : ""} that I did not authorize. ${goal || "Please reverse this charge and confirm in writing."}

If I do not receive a resolution within 7 business days, I will file a formal dispute with my card issuer. Please provide a case number for this request.${sign(name)}`,
  },
  {
    id: "charged_after_cancel", label: "Charges after cancellation", emoji: "🔁", category: "subscriptions",
    unit: "money", estValueHint: 90, channel: "Email + chargeback",
    goalDefault: "Refund charges billed after I cancelled",
    plan: ["Attach cancellation confirmation", "Demand refund of post-cancel charges", "Escalate to chargeback with proof"],
    ladder: ["Refund demand w/ confirmation attached", "Chargeback (banks accept these routinely)", "Regulator complaint"],
    leverage: ["With a cancellation confirmation, banks routinely issue chargebacks for continued billing.", "Reference your confirmation number and cancellation date explicitly."],
    render: ({ name, target, goal, account, date }) =>
`To: ${target || "[Company]"} Billing
Subject: Refund — charged after confirmed cancellation${acct(account)}

Hello,

I cancelled${date ? ` on ${date}` : " previously"} and hold a cancellation confirmation, yet I continued to be billed. ${goal || "Please refund all charges applied after my cancellation date and confirm in writing."}

If unresolved within 7 business days I will present my cancellation confirmation to my card issuer for a chargeback.${sign(name)}`,
  },
  {
    id: "trial_refund", label: "Free-trial auto-renewal refund", emoji: "⏳", category: "subscriptions",
    unit: "money", estValueHint: 70, channel: "Email / in-app",
    goalDefault: "Refund a trial that auto-converted without clear consent",
    plan: ["State the trial dates & lack of clear consent", "Request full refund + cancellation", "Escalate if refused"],
    ladder: ["Refund request", "Chargeback for undisclosed auto-renewal", "FTC complaint (deceptive conversion)"],
    leverage: ["Unclear trial-to-paid conversions have been found deceptive by regulators.", "Ask them to cite where consent to auto-renew was clearly obtained."],
    render: ({ name, target, goal }) =>
`To: ${target || "[Company]"} Support
Subject: Refund — free trial auto-converted without clear consent

Hello,

My free trial converted to a paid plan without clear, conspicuous consent. ${goal || "Please refund the charge in full and cancel the plan."}

Please point to where explicit auto-renewal consent was obtained; otherwise I consider this a deceptive conversion and will seek a chargeback.${sign(name)}`,
  },
  {
    id: "negotiate_bill", label: "Negotiate a bill down", emoji: "📉", category: "bills",
    unit: "money", estValueHint: 240, channel: "Retention line / chat (script)",
    goalDefault: "Lower my monthly bill or match a competitor offer",
    plan: ["Pull your current rate & a competitor price", "Open with the loyalty-penalty ask", "Request retention/loyalty desk", "Lock the new rate in writing"],
    ladder: ["Front-line retention offer", "Ask for the loyalty/retention department", "Cite competitor price + threaten to switch", "Confirm new rate + duration in writing"],
    leverage: ["Long-term customers often pay a 'loyalty penalty' — new-customer rates are the anchor.", "Retention desks have discounts front-line agents don't.", "Always get the new rate + how long it's locked, in writing."],
    render: ({ name, target, goal }) =>
`CALL / CHAT SCRIPT — ${target || "[Provider]"} retention

Opening:
"Hi, I've been a customer for a while and my rate has crept up. I'm comparing providers today. ${goal || "I'd like to lower my monthly bill to stay."}"

If offered a small discount:
"I appreciate that — but new customers are paying less than me. Can you connect me to the loyalty/retention team?"

Close:
"Great. Please confirm the new monthly rate and how many months it's locked, in writing to ${name || "[your email]"}."

Notes: stay friendly, be ready to name a competitor price, and be willing to schedule a callback.`,
  },
  {
    id: "medical_bill", label: "Medical bill: itemize + reduce", emoji: "🏥", category: "bills",
    unit: "money", estValueHint: 300, channel: "Written request to billing office",
    goalDefault: "Get an itemized bill and reduce/settle the balance",
    plan: ["Request a fully itemized bill", "Check for errors & duplicate codes", "Ask about financial assistance / cash rate", "Propose a settlement or payment plan"],
    ladder: ["Itemized bill request", "Error review + insurance re-file", "Financial assistance / charity care application", "Negotiated settlement or 0% payment plan"],
    leverage: ["You can request a fully itemized bill; errors and duplicate codes are common.", "Many hospitals have financial-assistance/charity-care programs that are under-advertised.", "A prompt-pay cash discount is often available if you ask."],
    render: ({ name, target, goal, account }) =>
`To: ${target || "[Provider]"} Billing Office
Subject: Request for itemized bill and financial review${acct(account)}

Hello,

Please send a fully itemized bill listing each charge and billing code${acct(account)}. I want to review for errors before payment.

${goal || "I am also requesting information on financial-assistance / charity-care programs and any prompt-pay discount, and I would like to discuss a reasonable settlement or a 0% payment plan."}

Please pause collection activity while this review is in progress.${sign(name)}`,
  },
  {
    id: "waive_fee", label: "Waive a late / overdraft fee", emoji: "💳", category: "billing",
    unit: "money", estValueHint: 35, channel: "Phone / secure message (script)",
    goalDefault: "Get a one-time fee waived as a courtesy",
    plan: ["State your good history", "Request a one-time courtesy waiver", "Set up a safeguard so it won't recur"],
    ladder: ["Front-line courtesy waiver", "Ask for a supervisor", "Mention closing/switching if long-time customer"],
    leverage: ["First-time or rare fees are frequently waived as a one-time courtesy for customers in good standing.", "Ask to set up alerts/autopay so it doesn't happen again."],
    render: ({ name, target, goal }) =>
`MESSAGE / SCRIPT — ${target || "[Bank/Provider]"}

"Hi, I've been a customer in good standing and just noticed a fee. ${goal || "I'd like to request a one-time courtesy waiver of this fee."} I've already taken steps so it won't happen again. Could you waive it as a goodwill gesture?"

If declined: "I understand — could you check with a supervisor? I'd really like to keep my account in good standing."${name ? `\n\n— ${name}` : ""}`,
  },
  {
    id: "refund_defective", label: "Refund a defective purchase", emoji: "📦", category: "purchases",
    unit: "money", estValueHint: 80, channel: "Email + return portal",
    goalDefault: "Full refund or replacement for a defective / not-as-described item",
    plan: ["Document the defect (photos)", "Cite refund/return policy or consumer rights", "Request refund or replacement + return label"],
    ladder: ["Merchant refund/replacement", "Card chargeback (not as described)", "Marketplace A-to-Z / buyer protection claim"],
    leverage: ["Items not as described or defective are commonly covered by return policy or buyer protection.", "A card chargeback for 'not as described' is a strong fallback."],
    render: ({ name, target, goal, amount }) =>
`To: ${target || "[Seller]"} Support
Subject: Defective / not-as-described item — refund requested

Hello,

The item I received is defective / not as described. ${goal || `Please issue a full refund${amount ? ` of ${amount}` : ""} or send a replacement, along with a prepaid return label.`}

I have photos documenting the issue and can provide them. If unresolved within 7 business days, I'll open a buyer-protection claim and a card dispute.${sign(name)}`,
  },
  {
    id: "warranty_claim", label: "Warranty / repair claim", emoji: "🔧", category: "purchases",
    unit: "money", estValueHint: 120, channel: "Email to warranty dept",
    goalDefault: "Repair or replace an item under warranty",
    plan: ["Confirm warranty terms & dates", "Describe the fault + proof of purchase", "Request repair/replacement + timeline"],
    ladder: ["Warranty claim", "Manufacturer escalation", "Consumer-protection complaint"],
    leverage: ["Keep proof of purchase and the warranty period handy.", "Statutory rights may extend beyond the stated warranty in some regions."],
    render: ({ name, target, goal, date }) =>
`To: ${target || "[Manufacturer]"} Warranty Department
Subject: Warranty claim — repair or replacement

Hello,

My product developed a fault${date ? ` (purchased ${date})` : ""} within its warranty period. ${goal || "Please arrange a repair or replacement under warranty and confirm the process and timeline."}

I can provide proof of purchase and photos/video of the fault on request.${sign(name)}`,
  },
  {
    id: "delete_data", label: "Delete my data (GDPR/CCPA)", emoji: "🛡️", category: "privacy",
    unit: "time", estValueHint: 1, channel: "Privacy / DPO email",
    goalDefault: "Delete my personal data and confirm",
    plan: ["Identify the data controller / privacy contact", "Send a deletion (erasure) request", "Require written confirmation + timeline"],
    ladder: ["Privacy request to DPO", "Regulator complaint (DPA / state AG)"],
    leverage: ["Many jurisdictions grant a right to erasure/deletion of personal data.", "Controllers typically must respond within a set statutory window."],
    render: ({ name, target, goal, email }) =>
`To: ${target || "[Company]"} Privacy Team / DPO
Subject: Request to delete my personal data

Hello,

I am exercising my right to request deletion of my personal data associated with ${email || "[my account/email]"}. ${goal || "Please erase my personal data, stop processing it, and confirm completion in writing."}

Please confirm receipt and the expected completion date within the timeframe required by applicable law.${sign(name)}`,
  },
  {
    id: "escalate_complaint", label: "Escalate a complaint", emoji: "📣", category: "disputes",
    unit: "time", estValueHint: 2, channel: "Executive email + regulator",
    goalDefault: "Escalate an unresolved issue to someone who can fix it",
    plan: ["Summarize the issue + prior attempts", "Address the executive/complaints team", "State the specific resolution wanted + deadline", "Name the regulator/BBB fallback"],
    ladder: ["Formal complaint to executive/complaints team", "Regulator / BBB / ombudsman filing", "Public review + social escalation"],
    leverage: ["Executive/complaints teams resolve what front-line can't.", "A clear, dated summary of prior attempts strengthens escalation.", "Name the specific regulator to signal you're serious."],
    render: ({ name, target, goal }) =>
`To: ${target || "[Company]"} — Office of the President / Complaints
Subject: Formal complaint — request for resolution

Hello,

Despite prior attempts, my issue remains unresolved. Summary: [what happened, dates, reference numbers].

${goal || "The resolution I am seeking is: [state it clearly]."} Please respond within 7 business days. If unresolved, I will file with the relevant regulator/ombudsman and share my experience publicly.${sign(name)}`,
  },
  {
    id: "price_match", label: "Price-match / better offer", emoji: "🏷️", category: "purchases",
    unit: "money", estValueHint: 40, channel: "Chat / email (script)",
    goalDefault: "Match a lower price or get a partial refund of the difference",
    plan: ["Find the qualifying lower price + proof", "Cite the price-match policy", "Request match or difference refund"],
    ladder: ["Price-match request", "Post-purchase price adjustment", "Return + rebuy at lower price"],
    leverage: ["Many retailers offer price matching or post-purchase price adjustments within a window.", "A screenshot of the competing price usually suffices."],
    render: ({ name, target, goal, amount }) =>
`To: ${target || "[Retailer]"} Support
Subject: Price match / price adjustment request

Hello,

I found this item at a lower price and would like to request a ${goal || `price match or a refund of the difference${amount ? ` (${amount})` : ""}`}, per your price-match policy.

I can provide a screenshot/link to the qualifying offer. Please advise how to proceed.${sign(name)}`,
  },
];

export const templateById = (id) => TEMPLATES.find((t) => t.id === id) || null;
export const templatesByCategory = () => {
  const map = {};
  for (const t of TEMPLATES) (map[t.category] ||= []).push(t);
  return map;
};
