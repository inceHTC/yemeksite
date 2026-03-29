import type { RecipeWithDetails } from "@/lib/supabase/recipes";

interface RecipeSchemaProps {
  recipe: RecipeWithDetails;
  url: string;
}

export function RecipeSchema({ recipe, url }: RecipeSchemaProps) {
  const nutrition = recipe.nutritional_info as Record<string, number> | null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.image_url ? [recipe.image_url] : [],
    url,
    author: {
      "@type": "Organization",
      name: "Tok Bebek",
      url: "https://bebi.life",
    },
    datePublished: recipe.created_at,
    dateModified: recipe.updated_at,
    prepTime: `PT${recipe.prep_time_min}M`,
    cookTime: `PT${recipe.cook_time_min}M`,
    totalTime: `PT${recipe.prep_time_min + recipe.cook_time_min}M`,
    recipeYield: `${recipe.servings} porsiyon`,
    recipeCategory: recipe.meal_type,
    recipeCuisine: "Türk",
    keywords: [
      `${recipe.age_min_months}-${recipe.age_max_months} aylık bebek yemeği`,
      "bebek tarifi",
      "bebek beslenmesi",
      recipe.is_dairy_free ? "sütsüz bebek yemeği" : null,
      recipe.is_gluten_free ? "glutensiz bebek yemeği" : null,
      ...(recipe.health_tags ?? []).map((t) =>
        t === "gas_friendly" ? "gaz dostu bebek yemeği" :
          t === "constipation" ? "kabızlık önleyici bebek yemeği" :
            t === "teething" ? "diş çıkaran bebek yemeği" : t
      ),
    ].filter(Boolean),
    recipeIngredient: recipe.recipe_ingredients.map(
      (ing) => `${ing.amount} ${ing.unit} ${ing.name}${ing.is_optional ? " (opsiyonel)" : ""}`
    ),
    ...(nutrition?.calories
      ? {
        nutrition: {
          "@type": "NutritionInformation",
          calories: `${nutrition.calories} kalori`,
          ...(nutrition.protein ? { proteinContent: `${nutrition.protein}g` } : {}),
          ...(nutrition.carbs ? { carbohydrateContent: `${nutrition.carbs}g` } : {}),
          ...(nutrition.fat ? { fatContent: `${nutrition.fat}g` } : {}),
          ...(nutrition.fiber ? { fiberContent: `${nutrition.fiber}g` } : {}),
        },
      }
      : {}),
    suitableForDiet: [
      recipe.is_dairy_free ? "https://schema.org/DairyFreeDiet" : null,
      recipe.is_gluten_free ? "https://schema.org/GlutenFreeDiet" : null,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
