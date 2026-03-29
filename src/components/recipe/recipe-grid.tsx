import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { RecipeCard } from "./recipe-card";
import { RecipePagination } from "./recipe-pagination";
import { EmptyState } from "@/components/shared/empty-state";
import type { RecipeFilters } from "@/store/recipe-store";
import { Suspense } from "react";

const PAGE_SIZE = 12;

interface RecipeGridProps {
  searchParams: Record<string, string | string[]>;
}

function parseFilters(params: Record<string, string | string[]>): Partial<RecipeFilters> {
  const get = (key: string) => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const getAll = (key: string): string[] => {
    const v = params[key];
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  // ageGroup: "4-6", "6-9", "9-12", "12-24" kısa format
  const ageGroup = get("ageGroup");
  let ageMin = get("ageMin") ? Number(get("ageMin")) : null;
  let ageMax = get("ageMax") ? Number(get("ageMax")) : null;
  if (ageGroup) {
    const [min, max] = ageGroup.split("-").map(Number);
    ageMin = min;
    ageMax = max;
  }

  return {
    ageMin,
    ageMax,
    mealType: (get("meal") as RecipeFilters["mealType"]) ?? null,
    texture: (get("texture") as RecipeFilters["texture"]) ?? null,
    freezable: get("freezable") === "true" ? true : null,
    diet: getAll("diet") as RecipeFilters["diet"],
    healthTags: getAll("health") as RecipeFilters["healthTags"],
    sort: (get("sort") as RecipeFilters["sort"]) ?? "newest",
  };
}

export async function RecipeGrid({ searchParams }: RecipeGridProps) {
  const filters = parseFilters(searchParams);
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const { recipes, total } = await getRecipes(filters, page, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  if (recipes.length === 0) {
    return <EmptyState variant="no-recipes" />;
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        <strong>{total}</strong> tarif bulundu
        {totalPages > 1 && <span> — Sayfa {page}/{totalPages}</span>}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe: RecipeRow) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <Suspense>
        <RecipePagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
