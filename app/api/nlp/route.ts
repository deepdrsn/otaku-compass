import { NextRequest, NextResponse } from "next/server";
import { ALL_TAGS } from "@/lib/data/tagList";

// Optional server-side AI enhancement for natural-language search.
// If OPENAI_API_KEY (or GEMINI_API_KEY) is present in the environment,
// this route asks the model to map free text to our fixed tag taxonomy.
// If no key is configured, it returns 501 so the client falls back to
// the local, offline parser (lib/nlp/parseQuery.ts -> parseQueryLocal).
// This means the app works perfectly with ZERO external AI dependency.

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return NextResponse.json(
      { error: "AI NLP not configured", tags: [] },
      { status: 501 }
    );
  }

  try {
    const prompt = `You are a tag extraction engine for an anime recommendation app.
Given a user's natural language request, return ONLY a JSON array of matching tags
from this exact list (use exact casing, no invented tags): ${ALL_TAGS.join(", ")}.
User request: "${query}"
Respond with ONLY the JSON array, nothing else.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 200,
      }),
    });

    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content ?? "[]";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const tags = JSON.parse(cleaned);

    const valid = Array.isArray(tags)
      ? tags.filter((t: string) => ALL_TAGS.includes(t))
      : [];

    return NextResponse.json({ tags: valid });
  } catch (err) {
    return NextResponse.json({ error: "AI parse failed", tags: [] }, { status: 500 });
  }
}
