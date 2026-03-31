"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function notifyAdminNewReview({
  recipeName,
  reviewerName,
  reviewerEmail,
  rating,
  comment,
}: {
  recipeName: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
}) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim()).filter(Boolean);
  if (!adminEmails.length) return;

  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  await resend.emails.send({
    from: "Tok Bebek <bildirim@tokbebek.com.tr>",
    to: adminEmails,
    subject: `⭐ Yeni yorum onay bekliyor — ${recipeName}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 16px">Yeni Yorum Onay Bekliyor</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#666;width:120px">Tarif</td><td style="padding:6px 0;font-weight:600">${recipeName}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Kullanıcı</td><td style="padding:6px 0">${reviewerName}</td></tr>
          <tr><td style="padding:6px 0;color:#666">E-posta</td><td style="padding:6px 0">${reviewerEmail}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Puan</td><td style="padding:6px 0">${stars} (${rating}/5)</td></tr>
          ${comment ? `<tr><td style="padding:6px 0;color:#666;vertical-align:top">Yorum</td><td style="padding:6px 0">${comment}</td></tr>` : ""}
        </table>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/yorumlar"
           style="display:inline-block;margin-top:20px;padding:10px 20px;background:#0e5731;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Yorumları Yönet →
        </a>
      </div>
    `,
  });
}

export async function submitReview(formData: FormData) {
  const adminDb = createAdminClient();

  const recipeId = formData.get("recipeId") as string;
  const rating = Number(formData.get("rating"));
  const comment = (formData.get("comment") as string | null ?? "").trim();
  const babyAge = formData.get("babyAge") ? Number(formData.get("babyAge")) : null;
  const reviewerName = (formData.get("reviewerName") as string | null ?? "").trim();
  const reviewerEmail = (formData.get("reviewerEmail") as string | null ?? "").trim().toLowerCase();

  if (!recipeId || rating < 1 || rating > 5) return { error: "Geçersiz yorum verisi." };
  if (!reviewerName) return { error: "Lütfen adınızı girin." };
  if (!reviewerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewerEmail)) {
    return { error: "Geçerli bir e-posta adresi girin." };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (adminDb as any)
    .from("recipe_reviews")
    .select("id, edit_token")
    .eq("recipe_id", recipeId)
    .eq("reviewer_email", reviewerEmail)
    .maybeSingle();

  let reviewId: string;
  let token: string;

  if (existing) {
    // Same email already reviewed this recipe — update it
    reviewId = existing.id;
    token = existing.edit_token ?? crypto.randomUUID();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (adminDb as any)
      .from("recipe_reviews")
      .update({ reviewer_name: reviewerName, rating, comment: comment || null, baby_age_at_review: babyAge, is_approved: false, edit_token: token })
      .eq("id", reviewId);
    if (error) return { error: "Yorum kaydedilemedi." };
  } else {
    // New review
    token = crypto.randomUUID();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminDb as any)
      .from("recipe_reviews")
      .insert({
        recipe_id: recipeId,
        reviewer_name: reviewerName,
        reviewer_email: reviewerEmail,
        rating,
        comment: comment || null,
        baby_age_at_review: babyAge,
        is_approved: false,
        edit_token: token,
      })
      .select("id")
      .single();
    if (error) return { error: "Yorum kaydedilemedi." };
    reviewId = data.id;
  }

  revalidatePath("/tarifler");

  // Admin'e e-posta bildirimi gönder
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: recipe } = await (adminDb as any)
      .from("recipes").select("title").eq("id", recipeId).single();
    await notifyAdminNewReview({
      recipeName: recipe?.title ?? "Bilinmiyor",
      reviewerName,
      reviewerEmail,
      rating,
      comment,
    });
  } catch { /* bildirim hatası ana akışı engellemesin */ }

  return { success: true, reviewId, token };
}

export async function updateReview(reviewId: string, token: string, formData: FormData) {
  const adminDb = createAdminClient();

  const rating = Number(formData.get("rating"));
  const comment = (formData.get("comment") as string | null ?? "").trim();
  const babyAge = formData.get("babyAge") ? Number(formData.get("babyAge")) : null;

  if (rating < 1 || rating > 5) return { error: "Geçersiz puan." };
  if (!token) return { error: "Yetki bilgisi eksik." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (adminDb as any)
    .from("recipe_reviews")
    .update({ rating, comment: comment || null, baby_age_at_review: babyAge, is_approved: false })
    .eq("id", reviewId)
    .eq("edit_token", token);

  if (error) return { error: "Güncelleme başarısız." };
  revalidatePath("/tarifler");
  return { success: true };
}

export async function deleteOwnReview(reviewId: string, token: string) {
  const adminDb = createAdminClient();
  if (!token) return { error: "Yetki bilgisi eksik." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminDb as any)
    .from("recipe_reviews")
    .delete()
    .eq("id", reviewId)
    .eq("edit_token", token);

  revalidatePath("/tarifler");
  return { success: true };
}

export async function getReviews(recipeId: string) {
  const adminDb = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (adminDb as any)
    .from("recipe_reviews")
    .select("id, rating, comment, baby_age_at_review, created_at, reviewer_name, admin_reply")
    .eq("recipe_id", recipeId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}
