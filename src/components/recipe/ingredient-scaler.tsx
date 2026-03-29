"use client";

import { useState } from "react";
import type { RecipeIngredient } from "@/lib/supabase/recipes";

interface IngredientScalerProps {
  ingredients: RecipeIngredient[];
}

const MULTIPLIERS = [1, 2] as const;

function formatAmount(amount: number): string {
  const rounded = Math.round(amount * 10) / 10;
  if (rounded === Math.floor(rounded)) return String(rounded);
  return rounded.toString();
}

export function IngredientScaler({ ingredients }: IngredientScalerProps) {
  const [multiplier, setMultiplier] = useState<1 | 2>(1);

  return (
    <div>
      {/* Başlık satırı */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-base font-bold text-foreground">
          Malzemeler
        </h2>
        <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
          {MULTIPLIERS.map((m) => (
            <button
              key={m}
              onClick={() => setMultiplier(m)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                multiplier === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}x
            </button>
          ))}
        </div>
      </div>

      {/* Malzeme listesi */}
      <div className="px-5 pb-5 space-y-0">
        {ingredients.map((ing, i) => (
          <div
            key={ing.id}
            className={`flex items-center justify-between py-2.5 ${
              i < ingredients.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            <span className="text-sm">
              {ing.name}
              {ing.is_optional && (
                <span className="ml-1.5 text-[0.68rem] text-muted-foreground">opsiyonel</span>
              )}
            </span>
            <span className="text-sm text-muted-foreground tabular-nums ml-4 shrink-0">
              {ing.amount ? `${formatAmount(ing.amount * multiplier)} ` : ""}{ing.unit || ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
