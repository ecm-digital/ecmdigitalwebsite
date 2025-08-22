import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  // Non-fatal: we keep runtime from crashing, but callers will fail queries cleanly
  // eslint-disable-next-line no-console
  console.warn("Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local");
}

export const supabase: SupabaseClient | null = url && anon ? createClient(url, anon) : null;
