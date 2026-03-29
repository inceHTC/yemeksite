"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function adminSignIn(
  _prev: { error?: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Geçersiz e-posta veya şifre." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "Bu hesap admin yetkisine sahip değil." };
  }

  redirect("/admin");
}
