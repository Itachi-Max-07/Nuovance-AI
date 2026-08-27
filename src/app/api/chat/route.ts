import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
// content/ sits at the repo root, outside the `@/*` -> `./src/*` alias.
import knowledge from "../../../../content/knowledge";

export const runtime = "edge";
export const maxDuration = 30;

/* ---------- Rate limiting ----------
   Per-IP fixed window held in module scope. On the edge runtime this map lives
   inside a single isolate: isolates are created and discarded constantly, each
   cold-starts empty, and requests from one IP are spread across whichever
   isolates are warm. So the per-IP counter does not actually enforce a ceiling
   — it is advisory. It will stop one browser tab hammering the Groq free tier,
   and that is all it does. A caller who wants past it gets past it. Replace
   this with Upstash Redis (or Vercel KV) for a counter shared across isolates
   before any paid traffic reaches the site. */
const WINDOW_MS = 60_000;
const LIMIT = 10;

interface RateEntry {
  count: number;
  resetAt: number;
}

const hits = new Map<string, RateEntry>();

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now >= entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });

    // Opportunistic sweep so the map can't grow without bound on a
    // long-lived instance.
    if (hits.size > 500) {
      hits.forEach((value, key) => {
        if (now >= value.resetAt) hits.delete(key);
      });
    }

    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  return {
    ok: entry.count <= LIMIT,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  };
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/* ---------- Prompt ---------- */

// Only the last few turns are sent — the knowledge base is the bulk of the
// prompt and there's no reason to pay for a long tail of chat history.
const MAX_MESSAGES = 8;

const SYSTEM_PROMPT = `You are the assistant on the Nuovance AI website. Nuovance AI is an AI, automation, and software engineering company.

Everything you know about the company is inside the <site_content> tags below. It is extracted from the live site, one section per route.

<site_content>
${knowledge}
</site_content>

Rules:
- Answer ONLY from the content above. It is your single source of truth.
- If the content does not cover the question, say so plainly and point the visitor to the contact section of the site to speak with the team.
- NEVER invent pricing, timelines, delivery estimates, team details, client names, or capabilities. If a number or commitment is not written above, you do not know it.
- Never answer questions about privacy, personal data, data handling, cookies, or terms of service from memory, and never summarize them. Say the details are published on the relevant page and give the path — /privacy covers the privacy policy, data handling, and cookies. This holds even when fragments of that content appear above. If no published page covers the question, say so and point to the contact section.
- Keep answers to two or three sentences.
- If a question is unrelated to Nuovance AI, its services, or its published articles, politely decline and steer back to what the agency does.
- Write in plain prose. No markdown headings, no bullet lists.`;

interface ChatRequestBody {
  messages?: UIMessage[];
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "The assistant is not configured yet." },
      { status: 500 },
    );
  }

  const { ok, retryAfter } = rateLimit(clientIp(request));
  if (!ok) {
    return Response.json(
      { error: "Too many messages. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  // Async in ai v7 (it was synchronous in v5).
  const modelMessages = await convertToModelMessages(messages.slice(-MAX_MESSAGES));

  const result = streamText({
    model: groq("openai/gpt-oss-20b"),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    maxOutputTokens: 400,
    temperature: 0.3,
  });

  return result.toUIMessageStreamResponse();
}
