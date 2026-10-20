import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_NAME = 100;
const MAX_EMAIL = 200;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

/**
 * Best-effort in-memory rate limit. Serverless instances each keep their own
 * map, so this deters casual spam rather than guaranteeing a global quota.
 */
const submissions = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(key, recent);
    return true;
  }

  recent.push(now);
  submissions.set(key, recent);

  // Keep the map from growing without bound in long-lived processes.
  if (submissions.size > 1000) {
    for (const [entryKey, timestamps] of submissions) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        submissions.delete(entryKey);
      }
    }
  }

  return false;
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    // Honeypot: real users never see or fill this field.
    if (clean((body as Record<string, unknown>).website, 100).length > 0) {
      return NextResponse.json({ success: true });
    }

    const name = clean((body as Record<string, unknown>).name, MAX_NAME);
    const email = clean((body as Record<string, unknown>).email, MAX_EMAIL);
    const subject = clean((body as Record<string, unknown>).subject, MAX_SUBJECT);
    const message = clean((body as Record<string, unknown>).message, MAX_MESSAGE);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Your message is a little too short." },
        { status: 400 },
      );
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientKey =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(clientKey)) {
      return NextResponse.json(
        { error: "Too many messages. Please try again in a few minutes." },
        { status: 429 },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail =
      process.env.CONTACT_RECIPIENT_EMAIL || "kumarvinay072007@gmail.com";
    const senderEmail =
      process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev";

    if (!resendApiKey) {
      // Never report a false success: the visitor deserves to know the message
      // was not delivered. The client surfaces this text to the user.
      console.error(
        "[contact] RESEND_API_KEY is not configured; message was not delivered.",
      );
      return NextResponse.json(
        {
          error:
            "Email delivery is not configured right now. Please reach me directly at " +
            recipientEmail +
            ".",
        },
        { status: 503 },
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          from: senderEmail,
          to: [recipientEmail],
          reply_to: email,
          subject: subject
            ? `[Portfolio] ${subject}`.slice(0, 200)
            : `[Portfolio Inquiry] from ${name}`.slice(0, 200),
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
              <h2 style="color: #0f172a; margin-top: 0;">New message from your portfolio</h2>
              <p style="font-size: 14px; color: #475569;">A visitor submitted the contact form on <strong>vinaykumar.eu.cc</strong>.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p><strong>Name:</strong> ${safeName}</p>
              <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              ${safeSubject ? `<p><strong>Subject:</strong> ${safeSubject}</p>` : ""}
              <p><strong>Message:</strong></p>
              <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #cbd5e1; white-space: pre-wrap; color: #1e293b;">${safeMessage}</div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p style="font-size: 12px; color: #94a3b8;">Reply directly to this email to answer ${safeName}.</p>
            </div>
          `,
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("[contact] Resend API error:", errorData);
      return NextResponse.json(
        { error: "The email service could not deliver your message. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("[contact] Unexpected failure:", error);
    return NextResponse.json(
      { error: "Something went wrong while sending your message." },
      { status: 500 },
    );
  }
}
