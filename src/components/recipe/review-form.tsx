"use client";

import { useState, useTransition } from "react";
import { Star, Loader2 } from "lucide-react";
import { submitReview } from "@/app/tarifler/actions";

const AGE_OPTIONS = [
  { value: 5,  label: "4–6 ay" },
  { value: 7,  label: "6–9 ay" },
  { value: 10, label: "9–12 ay" },
  { value: 15, label: "12–18 ay" },
  { value: 21, label: "18–24 ay" },
  { value: 30, label: "24–36 ay" },
];

export function ReviewForm({ recipeId, onSuccess }: { recipeId: string; onSuccess?: () => void }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [babyAge, setBabyAge] = useState<number | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setResult({ error: "Lütfen bir puan verin." }); return; }

    const fd = new FormData();
    fd.set("recipeId", recipeId);
    fd.set("rating", String(rating));
    fd.set("comment", comment);
    fd.set("reviewerName", name);
    fd.set("reviewerEmail", email);
    if (babyAge !== "") fd.set("babyAge", String(babyAge));

    startTransition(async () => {
      const res = await submitReview(fd);
      if (!res) return;
      setResult(res.error ? res : { success: true });
      if (res.success && res.reviewId && res.token) {
        try {
          localStorage.setItem(`review_token_${res.reviewId}`, res.token);
        } catch { /* ignore */ }
        setRating(0); setComment(""); setBabyAge(""); setName(""); setEmail("");
        setTimeout(() => onSuccess?.(), 1500);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Ad + E-posta */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold mb-1.5 block">
            Adınız <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Ayşe K."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
          />
        </div>
        <div>
          <label className="text-sm font-semibold mb-1.5 block">
            E-posta <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="ornek@mail.com"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground/60 -mt-2">
        E-posta adresiniz yalnızca yorum yönetimi için kullanılır, yayınlanmaz.
      </p>

      {/* Yıldız seçici */}
      <div>
        <p className="text-sm font-semibold mb-2">
          Puanınız <span className="text-destructive">*</span>
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
              className="p-0.5 transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  s <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Bebek yaşı */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Bebeğinizin yaşı</label>
        <select
          value={babyAge}
          onChange={(e) => setBabyAge(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Seçin (isteğe bağlı)</option>
          {AGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Yorum */}
      <div>
        <label className="text-sm font-semibold mb-2 block">
          Yorumunuz <span className="text-muted-foreground font-normal">(isteğe bağlı)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bebeğiniz bu tarifi nasıl buldu? Değişiklik yaptınız mı?"
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
        />
        <p className="text-xs text-muted-foreground/50 text-right mt-1">{comment.length}/500</p>
      </div>

      {result?.error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{result.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white py-2.5 text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-all active:scale-98"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Yorumu Gönder
      </button>
    </form>
  );
}
