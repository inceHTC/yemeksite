import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? "";
  const meal = searchParams.get("meal") ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from("recipes")
    .select("id, slug, title, image_url, prep_time_min, cook_time_min, meal_type, age_min_months, age_max_months")
    .eq("is_published", true)
    .order("view_count", { ascending: false })
    .limit(limit);

  if (q) query = query.ilike("title", `%${q}%`);
  if (meal) query = query.eq("meal_type", meal);

  const { data } = await query;
  return NextResponse.json(data ?? []);
}
