import { NextRequest, NextResponse } from "next/server";

// POST /api/recommend-services - DISABLED for now
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brief, services } = body as {
      brief?: string;
      services?: Array<{ id: number | string; title: string; description?: string; features?: string[] }>;
    };

    // Simple fallback - return first 3 services
    const recommendations = (services || [])
      .slice(0, 3)
      .map((s, index) => ({
        id: s.id,
        title: s.title,
        reason: `Podstawowa rekomendacja usługi ${index + 1}`,
        score: 0.8 - (index * 0.1)
      }));

    return NextResponse.json({ recommendations });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
