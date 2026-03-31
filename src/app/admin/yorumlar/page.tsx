import Link from "next/link";
import { Star, Check, ExternalLink, Clock } from "lucide-react";
import { getAdminReviews, approveReview, deleteReview } from "./actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReviewReplyForm } from "@/components/admin/review-reply-form";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatAge(months: number | null) {
  if (!months) return "—";
  if (months < 12) return `${months} ay`;
  return `${Math.floor(months / 12)} y ${months % 12 > 0 ? `${months % 12} ay` : ""}`.trim();
}

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  baby_age_at_review: number | null;
  created_at: string;
  is_approved: boolean;
  reviewer_name: string | null;
  reviewer_email: string | null;
  admin_reply: string | null;
  replied_at: string | null;
  recipes: { id: string; title: string; slug: string } | null;
};

export default async function AdminYorumlarPage() {
  const reviews = await getAdminReviews();
  const pending  = reviews.filter((r: Review) => !r.is_approved);
  const approved = reviews.filter((r: Review) => r.is_approved);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Yorum Moderasyonu</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {pending.length} onay bekliyor · {approved.length} yayında
        </p>
      </div>

      {/* Onay Bekleyenler */}
      {pending.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Onay Bekleyenler ({pending.length})
            </h2>
          </div>
          <ReviewTable reviews={pending} approveAction={approveReview} deleteAction={deleteReview} showApprove />
        </section>
      )}

      {/* Yayındaki yorumlar */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Check className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Yayındaki Yorumlar ({approved.length})</h2>
        </div>
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Henüz yayınlanan yorum yok.</p>
        ) : (
          <ReviewTable reviews={approved} approveAction={approveReview} deleteAction={deleteReview} showApprove={false} />
        )}
      </section>
    </div>
  );
}

function ReviewTable({
  reviews,
  approveAction,
  deleteAction,
  showApprove,
}: {
  reviews: Review[];
  approveAction: (id: string) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
  showApprove: boolean;
}) {
  return (
    <div className="bg-background rounded-2xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground">
            <th className="text-left px-4 py-2.5">Ad / E-posta</th>
            <th className="text-left px-4 py-2.5">Tarif</th>
            <th className="text-left px-4 py-2.5">Puan</th>
            <th className="text-left px-4 py-2.5">Yorum</th>
            <th className="text-left px-4 py-2.5">Bebek</th>
            <th className="text-left px-4 py-2.5">Tarih</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {reviews.map((r) => (
            <tr key={r.id} className="hover:bg-muted/20 transition-colors align-top">
              <td className="px-4 py-3">
                <p className="font-medium text-xs">{r.reviewer_name ?? "—"}</p>
                <p className="text-[10px] text-muted-foreground/70 truncate max-w-[140px]">
                  {r.reviewer_email ?? ""}
                </p>
              </td>
              <td className="px-4 py-3">
                {r.recipes ? (
                  <Link href={`/tarifler/${r.recipes.slug}`} target="_blank"
                    className="text-xs text-primary hover:underline flex items-center gap-1 max-w-[140px]">
                    <span className="truncate">{r.recipes.title}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </Link>
                ) : "—"}
              </td>
              <td className="px-4 py-3"><Stars rating={r.rating} /></td>
              <td className="px-4 py-3 max-w-[200px]">
                {r.comment
                  ? <p className="text-xs text-foreground/80 line-clamp-3">{r.comment}</p>
                  : <span className="text-xs text-muted-foreground/40 italic">Yorum yok</span>}
                {r.admin_reply && (
                  <p className="text-[10px] text-primary/70 mt-1 line-clamp-2">
                    ↳ {r.admin_reply}
                  </p>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                {formatAge(r.baby_age_at_review)}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                {formatDate(r.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {showApprove && (
                    <form action={approveAction.bind(null, r.id)}>
                      <button type="submit"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Onayla">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                  <ReviewReplyForm reviewId={r.id} existingReply={r.admin_reply} />
                  <DeleteButton id={r.id} action={deleteAction} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
