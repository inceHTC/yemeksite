"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const { error: dbError } = await (supabase as any)
    .from("contact_messages")
    .insert({ name, email, subject, message });

  if (dbError) return { error: "Mesaj gönderilemedi, lütfen tekrar deneyin." };

  // Mail bildirimi gönder
  const { error: mailError } = await resend.emails.send({
    from: "Tok Bebek <bildirim@tokbebek.com.tr>",
    to: "tokbebekiletisim@gmail.com",
    replyTo: email,
    subject: `İletişim Formu: ${subject || "Yeni Mesaj"} — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #007a3f;">Yeni İletişim Mesajı</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 8px 0; color: #666; width: 100px;"><strong>Ad Soyad:</strong></td><td>${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;"><strong>E-posta:</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${subject ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Konu:</strong></td><td>${subject}</td></tr>` : ""}
        </table>
        <div style="background: #f5f5f5; border-left: 4px solid #007a3f; padding: 16px; border-radius: 4px;">
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">Bu mesaj tokbebek.com.tr iletişim formundan gönderildi. Yanıtlamak için "Yanıtla" butonuna basabilirsin.</p>
      </div>
    `,
  });

  if (mailError) {
    console.error("Resend mail hatası:", mailError);
  }

  return { success: true };
}
