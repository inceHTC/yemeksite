"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, X, ShoppingCart } from "lucide-react";
import { useMenuStore, type MealSlot, type PlannedMeal } from "@/store/menu-store";
import { RecipePickerModal } from "./recipe-picker-modal";

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const FULL_DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

const SLOTS: { key: MealSlot; label: string; emoji: string }[] = [
  { key: "breakfast", label: "Kahvaltı", emoji: "☀️" },
  { key: "lunch",     label: "Öğle",    emoji: "🍲" },
  { key: "dinner",    label: "Akşam",   emoji: "🌙" },
  { key: "snack",     label: "Ara",     emoji: "🍎" },
];

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

export function MenuPlannerGrid() {
  const { plan, addMeal, removeMeal, clearPlan } = useMenuStore();
  const [picker, setPicker] = useState<{ day: number; slot: MealSlot } | null>(null);

  const totalMeals = Object.values(plan).reduce(
    (sum, day) => sum + Object.keys(day).length, 0
  );

  function handleSelect(recipe: PickerRecipe) {
    if (!picker) return;
    const meal: PlannedMeal = {
      recipeId: recipe.id,
      recipeSlug: recipe.slug,
      recipeTitle: recipe.title,
      recipeImage: recipe.image_url,
      servings: 1,
    };
    addMeal(picker.day, picker.slot, meal);
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          {totalMeals > 0 ? `${totalMeals} öğün planlandı` : "Boş günlere tıklayarak tarif ekleyin"}
        </p>
        <div className="flex items-center gap-2">
          {totalMeals > 0 && (
            <Link
              href="/menu/alisveris"
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/40 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Alışveriş Listesi
            </Link>
          )}
          {totalMeals > 0 && (
            <button
              onClick={clearPlan}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Temizle
            </button>
          )}
        </div>
      </div>

      {/* Grid — masaüstü: 7 sütun, mobil: dikey liste */}
      <div className="hidden sm:grid grid-cols-7 gap-2">
        {/* Header */}
        {FULL_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
        ))}
        {/* Slots */}
        {SLOTS.map((slot) =>
          Array.from({ length: 7 }, (_, day) => {
            const meal = plan[day]?.[slot.key];
            return (
              <MealCell
                key={`${slot.key}-${day}`}
                meal={meal ?? null}
                slotLabel={slot.label}
                slotEmoji={slot.emoji}
                onAdd={() => setPicker({ day, slot: slot.key })}
                onRemove={() => removeMeal(day, slot.key)}
              />
            );
          })
        )}
      </div>

      {/* Mobil: gün bazlı dikey liste */}
      <div className="sm:hidden space-y-4">
        {DAYS.map((dayShort, day) => (
          <div key={day} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
              <p className="text-sm font-semibold">{FULL_DAYS[day]}</p>
            </div>
            <div className="divide-y divide-border">
              {SLOTS.map((slot) => {
                const meal = plan[day]?.[slot.key];
                return (
                  <div key={slot.key} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-base w-6 text-center shrink-0">{slot.emoji}</span>
                    <span className="text-xs text-muted-foreground w-12 shrink-0">{slot.label}</span>
                    {meal ? (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-muted shrink-0">
                          {meal.recipeImage ? (
                            <Image src={meal.recipeImage} alt={meal.recipeTitle} fill className="object-cover" unoptimized />
                          ) : <div className="absolute inset-0 flex items-center justify-center text-sm">🥣</div>}
                        </div>
                        <Link href={`/tarifler/${meal.recipeSlug}`} className="text-xs font-medium line-clamp-1 flex-1 hover:text-primary transition-colors">
                          {meal.recipeTitle}
                        </Link>
                        <button onClick={() => removeMeal(day, slot.key)} className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setPicker({ day, slot: slot.key })}
                        className="flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-primary transition-colors flex-1"
                      >
                        <Plus className="w-3.5 h-3.5" />Ekle
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {picker && (
        <RecipePickerModal
          preferredMealType={picker.slot}
          onSelect={handleSelect}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

function MealCell({
  meal,
  slotLabel,
  slotEmoji,
  onAdd,
  onRemove,
}: {
  meal: PlannedMeal | null;
  slotLabel: string;
  slotEmoji: string;
  onAdd: () => void;
  onRemove: () => void;
}) {
  if (meal) {
    return (
      <div className="group relative rounded-xl border border-border bg-card p-1.5 min-h-[72px] flex flex-col">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-1">
          {meal.recipeImage ? (
            <Image src={meal.recipeImage} alt={meal.recipeTitle} fill className="object-cover" unoptimized />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-lg">🥣</div>
          )}
        </div>
        <p className="text-[10px] font-medium line-clamp-2 leading-tight px-0.5">{meal.recipeTitle}</p>
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onAdd}
      className="w-full rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[72px] flex flex-col items-center justify-center gap-1 group"
    >
      <span className="text-base opacity-40 group-hover:opacity-70 transition-opacity">{slotEmoji}</span>
      <span className="text-[9px] text-muted-foreground/50 group-hover:text-primary/60 transition-colors">{slotLabel}</span>
    </button>
  );
}
