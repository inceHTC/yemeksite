"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { redirect } from "next/navigation";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/admin");
}

export async function approveReview(id: string) {
  await assertAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (createAdminClient() as any)
    .from("recipe_reviews")
    .update({ is_approved: true })
    .eq("id", id);
  revalidatePath("/admin/yorumlar");
}

export async function deleteReview(id: string) {
  await assertAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (createAdminClient() as any).from("recipe_reviews").delete().eq("id", id);
  revalidatePath("/admin/yorumlar");
}

export async function getAdminReviews() {
  await assertAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (createAdminClient() as any)
    .from("recipe_reviews")
    .select(`
      id, rating, comment, baby_age_at_review, created_at, is_approved,
      reviewer_name, reviewer_email, admin_reply, replied_at,
      recipes ( id, title, slug )
    `)
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function replyToReview(id: string, reply: string) {
  await assertAdmin();
  const trimmed = reply.trim();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (createAdminClient() as any)
    .from("recipe_reviews")
    .update({
      admin_reply: trimmed || null,
      replied_at: trimmed ? new Date().toISOString() : null,
    })
    .eq("id", id);
  revalidatePath("/admin/yorumlar");
}
