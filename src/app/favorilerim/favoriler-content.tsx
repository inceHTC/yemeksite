"use client";

import { useEffect, useState } from "react";
import { useRecipeStore } from "@/store/recipe-store";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { RecipeRow } from "@/lib/supabase/recipes";

export function FavorilerContent() {
  const savedRecipeIds = useRecipeStore((s) => s.savedRecipeIds);
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!savedRecipeIds.length) {
      setLoading(false);
      return;
    }

    async function fetchFavorites() {
      try {
        const res = await fetch(
          `/api/recipes/batch?ids=${savedRecipeIds.join(",")}`
        );
        if (res.ok) {
          const data = await res.json();
          setRecipes(data.recipes ?? []);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, [savedRecipeIds]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-muted rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!savedRecipeIds.length || !recipes.length) {
    return <EmptyState variant="no-favorites" />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
