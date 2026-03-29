import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      status: "ok",
      supabase: "connected",
      recipes: count ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: String(err) }, { status: 500 });
  }
}
