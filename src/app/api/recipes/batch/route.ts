import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json({ recipes: [] });

  const idList = ids
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (!idList.length) return NextResponse.json({ recipes: [] });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .in("id", idList)
    .eq("is_published", true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ recipes: data ?? [] });
}

// Alışveriş listesi için: tarif id'lerinden malzemeleri toplu döndür
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const ids: string[] = Array.isArray(body.ids) ? body.ids.slice(0, 50) : [];
  if (!ids.length) return NextResponse.json([]);

  const supabase = await createClient();
  const { data } = await supabase
    .from("recipe_ingredients")
    .select("recipe_id, name, amount, unit")
    .in("recipe_id", ids);

  return NextResponse.json(data ?? []);
}
