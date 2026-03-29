"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Clock, ChefHat, Snowflake } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRecipeStore } from "@/store/recipe-store";
import { useHaptic } from "@/hooks/use-haptic";
import type { RecipeRow } from "@/lib/supabase/recipes";

const DIFFICULTY_LABEL = { easy: "Kolay", medium: "Orta", hard: "Zor" };
const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: "Kahvaltı", lunch: "Öğle", dinner: "Akşam",
  snack: "Ara Öğün", puree: "Püre",
};

// Tarif kategorisine göre placeholder emoji
function getRecipeEmoji(recipe: RecipeRow): string {
  if (recipe.meal_type === "puree") {
    const slug = recipe.slug ?? "";
    if (slug.includes("elma") || slug.includes("armut") || slug.includes("kiraz") || slug.includes("seftali") || slug.includes("kivi") || slug.includes("mango") || slug.includes("cilek") || slug.includes("muz") || slug.includes("karpuz")) return "🍎";
    if (slug.includes("havuc") || slug.includes("patates") || slug.includes("kabak") || slug.includes("bezelye") || slug.includes("ispanak") || slug.includes("brokoli") || slug.includes("karnabahar") || slug.includes("patlican")) return "🥕";
    if (slug.includes("avokado")) return "🥑";
    return "🥣";
  }
  if (recipe.meal_type === "breakfast") return "🌅";
  if (recipe.meal_type === "snack") return "🍌";
  if (recipe.meal_type === "lunch" || recipe.meal_type === "dinner") {
    const slug = recipe.slug ?? "";
    if (slug.includes("tavuk") || slug.includes("et") || slug.includes("kiyma")) return "🍗";
    if (slug.includes("balik") || slug.includes("somon") || slug.includes("ton")) return "🐟";
    if (slug.includes("corba")) return "🍲";
    return "🍽️";
  }
  return "🥣";
}

interface RecipeCardProps {
  recipe: RecipeRow;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { savedRecipeIds, toggleSaved } = useRecipeStore();
  const haptic = useHaptic();
  const isSaved = savedRecipeIds.includes(recipe.id);
  const totalTime = recipe.prep_time_min + recipe.cook_time_min;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-card rounded-2xl border border-border shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
    >
      {/* Favori butonu — görsel üzerinde */}
      <button
        onClick={() => { haptic.success(); toggleSaved(recipe.id); }}
        aria-label={isSaved ? "Favoriden çıkar" : "Favoriye ekle"}
        className={cn(
          "absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm transition-all duration-200",
          isSaved
            ? "bg-primary text-white shadow-sm"
            : "bg-white/80 dark:bg-black/50 text-muted-foreground hover:text-primary"
        )}
      >
        <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
      </button>

      <Link href={`/tarifler/${recipe.slug}`} className="block">
        {/* Görsel */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-honey/35 via-secondary/40 to-primary/10">
              {getRecipeEmoji(recipe)}
            </div>
          )}

          {/* Alt gradyan + yaş */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2.5 left-3 flex items-center gap-2">
            <span className="text-white text-xs font-semibold drop-shadow">
              {recipe.age_min_months}–{recipe.age_max_months} ay
            </span>
            {recipe.is_freezable && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm">
                <Snowflake className="w-3 h-3 text-white" />
              </span>
            )}
          </div>
        </div>

        {/* İçerik */}
        <div className="p-4 space-y-2.5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
            {MEAL_TYPE_LABEL[recipe.meal_type] ?? recipe.meal_type}
          </p>

          <h3 className="font-heading font-bold text-[0.925rem] leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {recipe.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {totalTime} dk
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5" />
              {DIFFICULTY_LABEL[recipe.difficulty]}
            </span>
          </div>

          {/* Diyet etiketleri */}
          {(recipe.is_dairy_free || recipe.is_gluten_free || recipe.is_sugar_free) && (
            <div className="flex flex-wrap gap-1 pt-1">
              {recipe.is_dairy_free && (
                <span className="rounded-full bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-[0.65rem] font-medium text-blue-600 dark:text-blue-400">
                  🥛 Sütsüz
                </span>
              )}
              {recipe.is_gluten_free && (
                <span className="rounded-full bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[0.65rem] font-medium text-amber-600 dark:text-amber-400">
                  🌾 Glutensiz
                </span>
              )}
              {recipe.is_sugar_free && (
                <span className="rounded-full bg-green-50 dark:bg-green-950/30 px-2 py-0.5 text-[0.65rem] font-medium text-green-600 dark:text-green-400">
                  🍬 Şekersiz
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
