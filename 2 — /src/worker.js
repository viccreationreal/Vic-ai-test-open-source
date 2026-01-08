// src/worker.js
// VicAI — Secure Cloudflare Worker AI Backend
// Open-source friendly, abuse-resistant, fast.

export default {
  async fetch(request, env, ctx) {
    // --- CORS (so any frontend can use your API) ---
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    // --- Reject all non-POST methods ---
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST only" }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    // --- Parse user input ---
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const userMessage = (body?.message || "").trim();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "Message required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // --- VERY IMPORTANT: Basic Abuse / Jailbreak Protection ---
    if (userMessage.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message too long. Max 2000 chars." }),
        { status: 413, headers: corsHeaders }
      );
    }

    // --- Rate Limit (1 request per 3 seconds per IP) ---
    const ip = request.headers.get("CF-Connecting-IP") || "anon";
    const key = `rate:${ip}`;
    const last = await env.RATE_LIMIT.get(key);

    if (last) {
      return new Response(
        JSON.stringify({
          error: "Slow down! You can do 1 request per 3 seconds.",
        }),
        { status: 429, headers: corsHeaders }
      );
    }

    // Store TTL=3s
    await env.RATE_LIMIT.put(key, "1", { expirationTtl: 3 });

    // --- Construct the AI prompt ---
    const systemPrompt = `
You are VicAI — friendly, helpful, safe, and supportive.
Never generate harmful, illegal, or unsafe instructions.
Always stay positive and respectful.
    `.trim();

    // --- Call Cloudflare AI (Llama-3.1-8B-Instruct) ---
    try {
      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }
      );

      return new Response(
        JSON.stringify({
          success: true,
          output: aiResponse?.response || "",
        }),
        { status: 200, headers: corsHeaders }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "AI error",
          detail: err.message || "Unknown",
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
