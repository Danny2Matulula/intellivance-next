import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 12_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.replace(/\0/g, "").trim().slice(0, maxLength) : "";
}

export async function POST(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const website = cleanText(body.website, 200);
  if (website) return NextResponse.json({ success: true });

  const fullName = cleanText(body.fullName, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const company = cleanText(body.company, 160);
  const project = cleanText(body.project, 4000);

  if (fullName.length < 2 || !EMAIL_PATTERN.test(email) || project.length < 20) {
    return NextResponse.json({ error: "Please complete the required fields" }, { status: 400 });
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("Project inquiry delivery is not configured");
    return NextResponse.json({ error: "Delivery is temporarily unavailable" }, { status: 503 });
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "project_inquiry",
        source: "Intellivance Website",
        tags: ["website-operating-partner-inquiry"],
        fullName,
        email,
        company,
        project,
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!webhookResponse.ok) {
      console.error("Project inquiry webhook failed", webhookResponse.status);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Project inquiry webhook exception", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }
}
