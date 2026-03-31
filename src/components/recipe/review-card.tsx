"use client";

import { useState, useEffect, useTransition } from "react";
import { Star, Pencil, Trash2, Loader2, Check, X, ShieldCheck } from "lucide-react";
import { updateReview, deleteOwnReview } from "@/app/tarifler/actions";

const AGE_OPTIONS = [
  { value: 5, label: "4–6 ay" }, { value: 7, label: "6–9 ay" },
  { value: 10, label: "9–12 ay" }, { value: 15, label: "12–18 ay" },
  { value: 21, label: "18–24 ay" }, { value: 30, label: "24–36 ay" },
];

function formatAge(months: number) {
  if (months < 12) return `Bebeğim ${months} aylık`;
  const y = Math.floor(months / 12), m = months % 12;
  return m > 0 ? `Bebeğim ${y} yaş ${m} aylık` : `Bebeğim ${y} yaşında`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
}
function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-6 h-6" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} className={`${cls} ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />)}
    </div>
  );
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  baby_age_at_review: number | null;
  created_at: string;
  reviewer_name: string | null;
  admin_reply: string | null;
}

export function ReviewCard({ review }: { review: ReviewData }) {
  const [mode, setMode] = useState<"view" | "edit" | "confirmDelete">("view");
  const [rating, setRating] = useState(review.rating);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(review.comment ?? "");
  const [babyAge, setBabyAge] = useState<number | "">(review.baby_age_at_review ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);
  const [isOwn, setIsOwn] = useState(false);
  const [editToken, setEditToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem(`review_token_${review.id}`);
      if (t) { setIsOwn(true); setEditToken(t); }
    } catch { /* ignore */ }
  }, [review.id]);

  if (deleted) return null;

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editToken) return;
    const fd = new FormData();
    fd.set("rating", String(rating));
    fd.set("comment", comment);
    if (babyAge !== "") fd.set("babyAge", String(babyAge));
    startTransition(async () => {
      const res = await updateReview(review.id, editToken, fd);
      if (res?.error) { setMsg(res.error); return; }
      setMsg("Güncellendi — admin onayından sonra yayınlanacak.");
      setTimeout(() => { setMode("view"); setMsg(null); }, 2000);
    });
  }

  function handleDelete() {
    if (!editToken) return;
    startTransition(async () => {
      await deleteOwnReview(review.id, editToken);
      try { localStorage.removeItem(`review_token_${review.id}`); } catch { /* ignore */ }
      setDeleted(true);
    });
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      {mode === "view" && (
        <>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{review.reviewer_name ?? "Misafir"}</p>
              {review.baby_age_at_review && (
                <p className="text-xs text-muted-foreground">{formatAge(review.baby_age_at_review)}</p>
              )}
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <div className="text-right">
                <Stars rating={review.rating} />
                <p className="text-[10px] text-muted-foreground mt-1">{formatDate(review.created_at)}</p>
              </div>
              {isOwn && (
                <div className="flex gap-1">
                  <button onClick={() => setMode("edit")}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Düzenle">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setMode("confirmDelete")}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Sil">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          {review.comment && <p className="text-sm text-foreground/80 leading-relaxed mt-2">{review.comment}</p>}
          {review.admin_reply && (
            <div className="mt-3 rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">Tok Bebek</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{review.admin_reply}</p>
            </div>
          )}
        </>
      )}

      {mode === "confirmDelete" && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Bu yorumu silmek istediğinize emin misiniz?</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={handleDelete} disabled={isPending}
              className="flex items-center gap-1.5 rounded-xl bg-destructive text-white px-3 py-1.5 text-xs font-semibold hover:bg-destructive/90 disabled:opacity-50 transition-all">
              {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
              Evet, Sil
            </button>
            <button onClick={() => setMode("view")} className="rounded-xl border border-border px-3 py-1.5 text-xs hover:bg-muted transition-colors">
              İptal
            </button>
          </div>
        </div>
      )}

      {mode === "edit" && (
        <form onSubmit={handleUpdate} className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold">Yorumu Düzenle</p>
            <button type="button" onClick={() => setMode("view")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Yıldız */}
          <div className="flex gap-1">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(s)}
                className="transition-transform hover:scale-110">
                <Star className={`w-7 h-7 ${s <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
              </button>
            ))}
          </div>
          {/* Bebek yaşı */}
          <select value={babyAge} onChange={e => setBabyAge(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">Yaş seçin (isteğe bağlı)</option>
            {AGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {/* Yorum */}
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} maxLength={500}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
          {msg && <p className="text-xs text-primary bg-primary/10 rounded-lg px-3 py-2">{msg}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={isPending}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white py-2 text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-all">
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Güncelle
            </button>
            <button type="button" onClick={() => setMode("view")}
              className="px-4 rounded-xl border border-border text-sm hover:bg-muted transition-colors">
              İptal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
