import "server-only";

/**
 * Outbound delivery for form submissions.
 *
 * Preferred path: Resend (`RESEND_API_KEY` + `LEAD_INBOX`).
 * Fallback: JSON POST to `LEAD_WEBHOOK_URL` (Zapier/Make/custom), with `inbox`
 * from `LEAD_INBOX`. The inbox address is never rendered in markup (§9.10).
 *
 * Unconfigured behaviour:
 *   development — log and succeed
 *   production  — throw (never silently drop a lead)
 */

export type LeadAttachment = {
  filename: string;
  contentType: string;
  contentBase64: string;
};

export type Lead = {
  kind: "contact" | "whitepaper" | "subscribe" | "careers";
  submittedAt: string;
  fields: Record<string, string>;
  attachments?: LeadAttachment[];
};

export class DeliveryNotConfiguredError extends Error {
  constructor() {
    super(
      "No delivery path configured. Set RESEND_API_KEY + LEAD_INBOX, or LEAD_WEBHOOK_URL.",
    );
    this.name = "DeliveryNotConfiguredError";
  }
}

function subjectFor(lead: Lead): string {
  switch (lead.kind) {
    case "contact":
      return `IST contact — ${lead.fields.interest || "enquiry"}`;
    case "subscribe":
      return "IST insights subscribe";
    case "whitepaper":
      return `IST paper download — ${lead.fields.slug || "paper"}`;
    case "careers":
      return `IST application — ${lead.fields.roleTitle || lead.fields.subject || "role"}`;
    default:
      return "IST website lead";
  }
}

function bodyText(lead: Lead): string {
  const lines = [
    `Kind: ${lead.kind}`,
    `Submitted: ${lead.submittedAt}`,
    "",
    ...Object.entries(lead.fields).map(([key, value]) => `${key}: ${value}`),
  ];
  if (lead.attachments?.length) {
    lines.push("", `Attachments: ${lead.attachments.map((a) => a.filename).join(", ")}`);
  }
  return lines.join("\n");
}

async function deliverViaResend(lead: Lead, inbox: string, apiKey: string): Promise<void> {
  const from =
    process.env.RESEND_FROM?.trim() || "IST Website <onboarding@resend.dev>";

  const payload: Record<string, unknown> = {
    from,
    to: [inbox],
    subject: subjectFor(lead),
    text: bodyText(lead),
    reply_to: lead.fields.workEmail || lead.fields.email || undefined,
  };

  if (lead.attachments?.length) {
    payload.attachments = lead.attachments.map((a) => ({
      filename: a.filename,
      content: a.contentBase64,
      content_type: a.contentType,
    }));
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}${detail ? `: ${detail}` : ""}`);
  }
}

async function deliverViaWebhook(lead: Lead, endpoint: string): Promise<void> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...lead,
      inbox: process.env.LEAD_INBOX ?? null,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Lead webhook responded ${response.status}`);
  }
}

export async function deliverLead(lead: Lead): Promise<void> {
  const inbox = process.env.LEAD_INBOX?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const webhook = process.env.LEAD_WEBHOOK_URL?.trim();

  if (resendKey && inbox) {
    await deliverViaResend(lead, inbox, resendKey);
    return;
  }

  if (webhook) {
    await deliverViaWebhook(lead, webhook);
    return;
  }

  if (process.env.NODE_ENV === "production") throw new DeliveryNotConfiguredError();
  console.info("[lead] delivery not configured — payload was:", {
    ...lead,
    attachments: lead.attachments?.map((a) => ({
      filename: a.filename,
      contentType: a.contentType,
      bytes: Math.ceil((a.contentBase64.length * 3) / 4),
    })),
  });
}
