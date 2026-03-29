import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, name, babyBirthDate } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    const supabase = await createClient();

    // Upsert: same email won't duplicate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("newsletter_subscribers") as any).upsert(
      {
        email: email.toLowerCase().trim(),
        name: name?.trim() ?? null,
        baby_birth_date: babyBirthDate ?? null,
        is_active: true,
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Newsletter upsert error:", error);
      return NextResponse.json({ error: "Kayıt sırasında hata oluştu." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
