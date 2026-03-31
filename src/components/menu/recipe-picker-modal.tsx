"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Search, X, Clock, Check } from "lucide-react";

interface PickerRecipe {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  prep_time_min: number;
  cook_time_min: number;
  meal_type: string;
  age_min_months: number;
  age_max_months: number;
}

interface Props {
  onSelect: (recipe: PickerRecipe) => void;
  onClose: () => void;
  preferredMealType?: string;
}

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Kahvaltı", lunch: "Öğle", dinner: "Akşam",
  snack: "Ara Öğün", puree: "Püre",
};

export function RecipePickerModal({ onSelect, onClose, preferredMealType }: Props) {
  const [query, setQuery] = useState("");
  const [mealFilter, setMealFilter] = useState(preferredMealType ?? "");
  const [recipes, setRecipes] = useState<PickerRecipe[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const controller = new AbortController();
    startTransition(async () => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (mealFilter) params.set("meal", mealFilter);
      params.set("limit", "20");
      try {
        const res = await fetch(`/api/recipes/picker?${params}`, { signal: controller.signal });
        if (res.ok) setRecipes(await res.json());
      } catch { /* aborted */ }
    });
    return () => controller.abort();
  }, [query, mealFilter]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-background rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85dvh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border shrink-0">
          <h2 className="font-heading font-bold text-lg">Tarif Seç</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 space-y-2.5 shrink-0 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tarif ara…"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {["", "breakfast", "lunch", "dinner", "snack", "puree"].map((m) => (
              <button
                key={m}
                onClick={() => setMealFilter(m)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  mealFilter === m
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {m === "" ? "Tümü" : MEAL_LABELS[m] ?? m}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-3 py-3 space-y-1.5">
          {isPending && (
            <div className="space-y-2 px-2">
              {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />)}
            </div>
          )}
          {!isPending && recipes.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">Tarif bulunamadı.</p>
          )}
          {!isPending && recipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => { onSelect(recipe); onClose(); }}
              className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-muted/60 transition-colors text-left group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                {recipe.image_url ? (
                  <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">🥣</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold line-clamp-1">{recipe.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span>{MEAL_LABELS[recipe.meal_type] ?? recipe.meal_type}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {recipe.prep_time_min + recipe.cook_time_min} dk
                  </span>
                  <span>·</span>
                  <span>{recipe.age_min_months}–{recipe.age_max_months} ay</span>
                </p>
              </div>
              <Check className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
