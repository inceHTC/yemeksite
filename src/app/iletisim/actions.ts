"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendContactMessage(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { error: "Ad, e-posta ve mesaj alanları zorunludur." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Geçerli bir e-posta adresi girin." };
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("contact_messages")
    .insert({ name, email, subject, message });

  if (error) return { error: "Mesaj gönderilemedi, lütfen tekrar deneyin." };

  return { success: true };
}
