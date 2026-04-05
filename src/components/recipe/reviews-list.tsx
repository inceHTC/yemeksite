import { Star, MessageSquare } from "lucide-react";
import { getReviews } from "@/app/tarifler/actions";
import { ReviewCard } from "./review-card";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
      ))}
    </div>
  );
}

export async function ReviewsList({ recipeId }: { recipeId: string }) {
  const reviews = await getReviews(recipeId);

  if (!reviews.length) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-8 h-8 text-muted-foreground/25 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Henüz yorum yok. İlk yorumu siz yapın!</p>
      </div>
    );
  }

  const avg = reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      {/* Özet */}
      <div className="flex items-center gap-3 py-3 px-4 bg-muted/50 rounded-2xl">
        <span className="font-heading text-3xl font-extrabold">{avg.toFixed(1)}</span>
        <div>
          <StarRating rating={Math.round(avg)} />
          <p className="text-xs text-muted-foreground mt-0.5">{reviews.length} değerlendirme</p>
        </div>
      </div>

      {/* Yorumlar */}
      <div className="space-y-3">
        {reviews.map((r: {
          id: string;
          rating: number;
          comment: string | null;
          baby_age_at_review: number | null;
          created_at: string;
          reviewer_name: string | null;
          admin_reply: string | null;
        }) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </div>
  );
}
