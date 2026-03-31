"use client";

import { useState } from "react";
import { Pencil, CheckCircle2 } from "lucide-react";
import { ReviewForm } from "./review-form";

export function ReviewFormToggle({ recipeId }: { recipeId: string }) {
  const [state, setState] = useState<"closed" | "open" | "submitted">("closed");

  if (state === "submitted") {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
        <CheckCircle2 className="w-10 h-10 text-primary" strokeWidth={1.5} />
        <div>
          <p className="font-semibold text-foreground mb-1">Yorumunuz alındı!</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Admin onayından sonra bu sayfada yayınlanacak.
            Teşekkür ederiz.
          </p>
        </div>
        <button
          onClick={() => setState("closed")}
          className="mt-1 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Kapat
        </button>
      </div>
    );
  }

  if (state === "closed") {
    return (
      <button
        onClick={() => setState("open")}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 py-3 text-sm text-muted-foreground hover:text-primary transition-all"
      >
        <Pencil className="w-4 h-4" />
        Yorum Yaz
      </button>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold">Yorum Yaz</p>
        <button
          onClick={() => setState("closed")}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          İptal
        </button>
      </div>
      <ReviewForm recipeId={recipeId} onSuccess={() => setState("submitted")} />
    </div>
  );
}
