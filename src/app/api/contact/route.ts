import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { readProfile } from "@/lib/firebase/store";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(255),
  message: z.string().trim().min(10).max(5000),
  company: z.string().optional(),
});

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  // Prefer headers set by the hosting proxy. A raw x-forwarded-for value can be
  // supplied by the client and would let an attacker rotate fake IPs.
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    // Trust the proxy-appended hop, not the client-supplied first value.
    forwarded?.split(",").at(-1)?.trim() ||
    "unknown";

  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your name, email and message." },
      { status: 400 }
    );
  }

  const { name, email, message, company } = parsed.data;
  // Honeypot — pretend everything went fine so bots don't retry.
  if (company) return NextResponse.json({ ok: true });

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;
  const port = Number(process.env.SMTP_PORT ?? 587);

  if (!host || !user || !pass || !from) {
    console.error("[contact] SMTP is not configured");
    return NextResponse.json(
      { error: "Email isn't configured yet. Please use the email link instead." },
      { status: 503 }
    );
  }

  const profile = await readProfile();
  const to = process.env.CONTACT_TO ?? profile?.contact.email ?? from;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    // Keep visitor-supplied text out of raw header formatting (header injection).
    const displayName = name.replace(/[\r\n"<>]/g, " ").trim() || "Website visitor";

    await transporter.sendMail({
      from: `"Portfolio Contact" <${from}>`,
      to,
      replyTo: { name: displayName, address: email },
      subject: `Portfolio inquiry from ${displayName}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:system-ui,sans-serif;line-height:1.6">
          <h2 style="margin:0 0 12px">New portfolio message</h2>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
          <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] send failed", error);
    return NextResponse.json(
      { error: "Could not send the message right now. Please email me directly." },
      { status: 502 }
    );
  }
}
