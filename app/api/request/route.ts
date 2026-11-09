import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";

const required = ["name", "email", "projectType", "genre", "brief"] as const;
const MAX_BODY_BYTES = 32 * 1024;

function clean(value: unknown, max = 5000): string {
  return String(value ?? "").trim().slice(0, max);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "JSON content type is required." }, { status: 415 });
  }
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    // Enforce the size limit while reading, even when Content-Length is absent
    // (streaming/chunked requests). Never parse an unlimited client payload.
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ error: "Empty request." }, { status: 400 });
    const decoder = new TextDecoder();
    let receivedBytes = 0;
    let json = "";
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      receivedBytes += chunk.value.byteLength;
      if (receivedBytes > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return NextResponse.json({ error: "Request is too large." }, { status: 413 });
      }
      json += decoder.decode(chunk.value, { stream: true });
    }
    json += decoder.decode();
    const parsed: unknown = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request" }, { status: 400 });
  }

  // Spam honeypot. Legitimate visitors never fill the hidden website field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  for (const key of required) {
    if (!clean(body[key])) {
      return NextResponse.json({ error: "Missing " + key }, { status: 400 });
    }
  }

  const email = clean(body.email, 320);
  const name = clean(body.name, 150);
  const brief = clean(body.brief, 5000);

  if (!isEmail(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  if (brief.length < 30) {
    return NextResponse.json({ error: "Please provide at least 30 characters about your project." }, { status: 400 });
  }
  if (body.consent !== "yes") {
    return NextResponse.json({ error: "Privacy agreement is required." }, { status: 400 });
  }

  const reference = "BOS-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" + crypto.randomUUID().slice(0, 8).toUpperCase();

  const stored = {
    name,
    email,
    company: clean(body.company, 200),
    country: clean(body.country, 120),
    projectType: clean(body.projectType, 180),
    genre: clean(body.genre, 300),
    language: clean(body.language, 120),
    vocals: clean(body.vocals, 120),
    brief,
    references: clean(body.references, 3000),
    deadline: clean(body.deadline, 80),
    budget: clean(body.budget, 120),
    extra: clean(body.extra, 3000),
    commercialUse: body.commercialUse === true,
    consentAt: new Date().toISOString(),
  };

  // Always persist before notifying. Never acknowledge a request that has not been saved.
  try {
    const db = await getDb();
    if (!db) {
      console.error("project request: D1 binding unavailable");
      return NextResponse.json(
        { error: "Project requests are temporarily unavailable. Please try again later." },
        { status: 503 },
      );
    }
    await db.prepare(
      "INSERT INTO project_requests (id, status, payload, email, name) VALUES (?, 'REQUESTED', ?, ?, ?)",
    ).bind(reference, JSON.stringify(stored), email, name).run();
  } catch (error) {
    console.error("project request storage failed", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "We could not save your request. Please retry." },
      { status: 503 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.REQUEST_TO_EMAIL;
  const from = process.env.REQUEST_FROM_EMAIL || "Bossie Requests <onboarding@resend.dev>";
  const subject = ["Bossie project request", reference, stored.projectType, name].join(" — ");
  const text = [
    "NEW BOSSIE PROJECT REQUEST",
    "Reference: " + reference,
    "Saved in D1. Status: REQUESTED",
    "",
    "Name: " + name,
    "Email: " + email,
    "Company / artist: " + (stored.company || "—"),
    "Country: " + (stored.country || "—"),
    "Project type: " + stored.projectType,
    "Genre / direction: " + stored.genre,
    "Language: " + (stored.language || "—"),
    "Vocals: " + (stored.vocals || "—"),
    "Deadline: " + (stored.deadline || "—"),
    "Budget: " + (stored.budget || "—"),
    "Rights / use: " + (stored.commercialUse ? "Commercial requested" : "Personal"),
    "",
    "IDEA / BRIEF",
    stored.brief,
    "",
    "REFERENCES",
    stored.references || "—",
    "",
    "EXTRA NOTES",
    stored.extra || "—",
  ].join("\n");

  let notificationSent = false;
  if (apiKey && to) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to: [to], reply_to: email, subject, text }),
      });
      notificationSent = response.ok;
      if (!response.ok) console.error("project request notification failed", response.status, reference);
    } catch (error) {
      console.error("project request notification error", error instanceof Error ? error.message : String(error), reference);
    }
  } else {
    console.error("project request notification credentials are unavailable", reference);
  }

  // Email failure must not erase or invalidate a request already stored in D1.
  return NextResponse.json({ ok: true, reference, notificationSent }, {
    status: 201,
    headers: { "Cache-Control": "no-store" },
  });
}
