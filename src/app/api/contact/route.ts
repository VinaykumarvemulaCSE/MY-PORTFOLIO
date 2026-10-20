import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || "kumarvinay072007@gmail.com";
    const senderEmail = process.env.RESEND_SENDER_EMAIL || "contact@vinaykumar.eu.cc";

    // If Resend API key is provided, send email via Resend REST API
    if (resendApiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: senderEmail,
          to: [recipientEmail],
          reply_to: email,
          subject: subject ? `[Portfolio] ${subject}` : `[Portfolio Inquiry] from ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa;">
              <h2 style="color: #0f172a; margin-top: 0;">New Message from Portfolio Website</h2>
              <p style="font-size: 14px; color: #475569;">You received a new inquiry from your website <strong>vinaykumar.eu.cc</strong>:</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
              <p><strong>Message:</strong></p>
              <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #cbd5e1; white-space: pre-wrap; color: #1e293b;">${message}</div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
              <p style="font-size: 12px; color: #94a3b8;">Sent via Portfolio API • vinaykumar.eu.cc</p>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Resend API error:", errorData);
        // Fallback response with helpful debug info
        return NextResponse.json(
          { error: errorData.message || "Failed to dispatch email via Resend." },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, message: "Email sent successfully via Resend!" });
    }

    // Fallback if no API key is yet configured in local env
    console.log("Contact form submission received (No RESEND_API_KEY set):", {
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Message received! (Add RESEND_API_KEY in .env.local to deliver to inbox)",
    });
  } catch (error: any) {
    console.error("Contact API exception:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
