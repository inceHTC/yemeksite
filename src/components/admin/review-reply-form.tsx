"use client";

import { useState, useTransition } from "react";
import { MessageSquareReply, Loader2, Check, X } from "lucide-react";
import { replyToReview } from "@/app/admin/yorumlar/actions";

export function ReviewReplyForm({ reviewId, existingReply }: { reviewId: string; existingReply: string | null }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(existingReply ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await replyToReview(reviewId, text);
      setSaved(true);
      setOpen(false);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await replyToReview(reviewId, "");
      setText("");
      setSaved(true);
      setOpen(false);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title={existingReply ? "Yanıtı düzenle" : "Yanıtla"}
        className={`p-1.5 rounded-lg transition-colors ${
          existingReply
            ? "text-primary bg-primary/10 hover:bg-primary/20"
            : "text-muted-foreground hover:text-primary hover:bg-primary/10"
        } ${saved ? "text-primary" : ""}`}
      >
        {saved ? <Check className="w-3.5 h-3.5" /> : <MessageSquareReply className="w-3.5 h-3.5" />}
      </button>
    );
  }

  return (
    <div className="col-span-full px-4 pb-4 pt-2 bg-primary/5 border-t border-primary/10">
      <p className="text-xs font-semibold text-primary mb-2">Admin Yanıtı</p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        maxLength={600}
        placeholder="Kullanıcının sorusuna yanıt yazın..."
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
        autoFocus
      />
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleSave}
          disabled={isPending || !text.trim()}
          className="flex items-center gap-1.5 rounded-xl bg-primary text-white px-3 py-1.5 text-xs font-semibold disabled:opacity-50 hover:bg-primary/90 transition-all"
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          Kaydet
        </button>
        {existingReply && (
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-xl border border-destructive/30 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10 transition-all"
          >
            Yanıtı Kaldır
          </button>
        )}
        <button
          onClick={() => { setOpen(false); setText(existingReply ?? ""); }}
          className="ml-auto p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
