"use client";

import { useEffect, useState } from "react";
import { useMenuStore } from "@/store/menu-store";
import { ShoppingList } from "@/components/menu/shopping-list";

interface Ingredient {
  recipe_id: string;
  name: string;
  amount: number;
  unit: string;
}

export function ShoppingListLoader() {
  const { plan } = useMenuStore();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recipeIds = Object.values(plan)
      .flatMap((day) => Object.values(day))
      .map((meal) => meal.recipeId);

    const uniqueIds = [...new Set(recipeIds)];
    if (!uniqueIds.length) { setLoading(false); return; }

    fetch("/api/recipes/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: uniqueIds }),
    })
      .then((r) => r.json())
      .then((data) => setIngredients(data ?? []))
      .finally(() => setLoading(false));
  }, [plan]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-12 rounded-2xl bg-muted animate-pulse" />)}
      </div>
    );
  }

  return <ShoppingList ingredients={ingredients} />;
}
