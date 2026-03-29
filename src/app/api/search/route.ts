import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const supabase = await createClient();

  // Full-text search + başlık ilike araması (Türkçe uyumlu)
  const { data, count } = await supabase
    .from("recipes")
    .select("id, slug, title, description, age_min_months, age_max_months, prep_time_min, cook_time_min, meal_type, image_url", { count: "exact" })
    .eq("is_published", true)
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    .order("view_count", { ascending: false })
    .limit(12);

  return NextResponse.json({ results: data ?? [], total: count ?? 0 });
}
