import { createClient, createBuildClient } from "./server";
import type { Database } from "@/types/supabase";
import type { RecipeFilters } from "@/store/recipe-store";

export type RecipeRow = Database["public"]["Tables"]["recipes"]["Row"];
export type RecipeIngredient = Database["public"]["Tables"]["recipe_ingredients"]["Row"];
export type RecipeWithDetails = RecipeRow & {
  recipe_ingredients: RecipeIngredient[];
};

export async function getRecipes(
  filters: Partial<RecipeFilters> = {},
  page = 1,
  pageSize = 12
) {
  const supabase = await createClient();

  let query = supabase
    .from("recipes")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  if (filters.ageMin != null) query = query.gte("age_max_months", filters.ageMin);
  if (filters.ageMax != null) query = query.lte("age_min_months", filters.ageMax);
  if (filters.mealType) query = query.eq("meal_type", filters.mealType);
  if (filters.texture) query = query.eq("texture", filters.texture);
  if (filters.freezable != null) query = query.eq("is_freezable", filters.freezable);

  if (filters.diet?.includes("dairy_free")) query = query.eq("is_dairy_free", true);
  if (filters.diet?.includes("gluten_free")) query = query.eq("is_gluten_free", true);
  if (filters.diet?.includes("sugar_free")) query = query.eq("is_sugar_free", true);

  if (filters.healthTags?.length) {
    query = query.overlaps("health_tags", filters.healthTags);
  }

  if (filters.maxMinutes != null) {
    // prep + cook toplam süre filtresi — view yoksa basit yaklaşım
    query = query.lte("prep_time_min", filters.maxMinutes);
  }

  switch (filters.sort) {
    case "popular": query = query.order("view_count", { ascending: false }); break;
    case "most_saved": query = query.order("save_count", { ascending: false }); break;
    case "quickest": query = query.order("prep_time_min", { ascending: true }); break;
    default: query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);
  return { recipes: data ?? [], total: count ?? 0 };
}

export async function getRecipeBySlug(slug: string): Promise<RecipeWithDetails | null> {
  const supabase = await createClient();

  // Next.js bazen slug'ı encode edilmiş geçirebilir, normalize et
  const normalizedSlug = decodeURIComponent(slug);

  const { data, error } = await supabase
    .from("recipes")
    .select(`
      *,
      recipe_ingredients ( * )
    `)
    .eq("slug", normalizedSlug)
    .eq("is_published", true)
    .single();

  if (error || !data) return null;

  const result = data as unknown as RecipeWithDetails;

  result.recipe_ingredients?.sort((a, b) => a.order - b.order);

  return result;
}

export async function getRelatedRecipes(
  recipeId: string,
  ageMin: number,
  ageMax: number,
  limit = 4
): Promise<RecipeRow[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("recipes")
    .select("*")
    .eq("is_published", true)
    .neq("id", recipeId)
    .gte("age_max_months", ageMin)
    .lte("age_min_months", ageMax)
    .limit(limit);

  return data ?? [];
}

export async function getAllSlugs(): Promise<{ slug: string }[]> {
  const supabase = createBuildClient();
  const { data } = await supabase
    .from("recipes")
    .select("slug")
    .eq("is_published", true);
  return data ?? [];
}

export async function incrementViewCount(slug: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)("increment_view_count", { recipe_slug: slug });
}
