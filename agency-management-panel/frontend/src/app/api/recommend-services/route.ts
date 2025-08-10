import { NextRequest, NextResponse } from "next/server";

// POST /api/recommend-services
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brief, services } = body as {
      brief?: string;
      services?: Array<{ id: number | string; title: string; description?: string; features?: string[] }>;
    };

    const apiKey = process.env.OPENAI_API_KEY;

    const system = `Jesteś asystentem sprzedaży w agencji digital. Wybierasz rekomendacje WYŁĄCZNIE z podanej listy usług (nie wymyślaj nowych). Zwracasz 3-6 pozycji w JSON: [{id, title, reason, score}] gdzie score to liczba 0.0-1.0 (pewność). Odpowiadasz po polsku. title musi być dokładnie jak w liście, id dokładnie jak w liście.`;

    const user = `Opis klienta/projektu: ${brief || "(brak)"}\n\nDostępne usługi (używaj tylko ich):\n${(services || [])
      .map(
        (s) => `- id: ${s.id} | title: ${s.title}${s.description ? ` | desc: ${s.description}` : ""}${
          s.features && s.features.length ? ` | features: ${s.features.join(", ")}` : ""
        }`
      )
      .join("\n")}`;

    // Helper: local keyword-based fallback
    function localFallback() {
      const text = `${brief || ""}`.toLowerCase();
      const tokens = Array.from(new Set(text.split(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9]+/).filter(Boolean)));
      const svc = (services || []);
      const scored = svc.map((s) => {
        const corpus = `${s.title || ""} ${s.description || ""} ${(s.features || []).join(" ")}`.toLowerCase();
        const hits = tokens.reduce((acc, t) => acc + (corpus.includes(t) ? 1 : 0), 0);
        const denom = Math.max(1, tokens.length);
        const score = Math.min(1, hits / denom);
        const reason = tokens.length
          ? `Dopasowanie słów kluczowych: ${hits}/${denom}`
          : `Brak opisu – ranking na podstawie tytułu i funkcji`;
        return { id: s.id, title: s.title, reason, score };
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, Math.min(6, Math.max(3, Math.floor((services?.length || 0) / 2) || 3)));
      return scored;
    }

    // If no API key, use local fallback
    if (!apiKey) {
      const out = localFallback();
      return NextResponse.json({ recommendations: out });
    }

    // Try OpenAI; if it fails, fallback to local
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.4,
      }),
    });

    if (!resp.ok) {
      // Attempt to detect quota error and gracefully fallback
      let errText = await resp.text();
      try {
        const parsed = JSON.parse(errText);
        errText = parsed?.error?.message || errText;
      } catch {}
      const out = localFallback();
      return NextResponse.json({ recommendations: out, note: `OpenAI error: ${errText}` });
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content?.trim?.();

    let json;
    try {
      json = content ? JSON.parse(content) : [];
    } catch {
      // Fallback: try to extract JSON block
      const match = content?.match(/\[([\s\S]*)\]/);
      json = match ? JSON.parse(match[0]) : [];
    }

    // Ensure shape {id,title,reason,score}
    const out = (Array.isArray(json) ? json : []).map((r: any) => ({
      id: r?.id,
      title: r?.title,
      reason: r?.reason,
      score: typeof r?.score === "number" ? r.score : undefined,
    }));

    return NextResponse.json({ recommendations: out });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
