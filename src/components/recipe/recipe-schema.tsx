import type { RecipeWithDetails } from "@/lib/supabase/recipes";

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch { /* ignore */ }
  return null;
}

interface RecipeSchemaProps {
  recipe: RecipeWithDetails;
  url: string;
  ratingData?: { avg: number; count: number } | null;
}

export function RecipeSchema({ recipe, url, ratingData }: RecipeSchemaProps) {
  const nutrition = recipe.nutritional_info as Record<string, number> | null;
  const videoUrl = (recipe as any).video_url as string | null;
  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null;

  // recipeInstructions: her satır veya numaralı adım bir HowToStep olur
  const instructions = recipe.instructions ?? "";
  const steps = instructions
    .split(/\n+/)
    .map((s) => s.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter(Boolean)
    .map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    }));

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.image_url ? [recipe.image_url] : [],
    url,
    author: {
      "@type": "Organization",
      name: "Tok Bebek",
      url: "https://tokbebek.com.tr",
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
    // ── Eksik olan 3 alan ──────────────────────────────────────────────────────
    recipeInstructions: steps.length > 0 ? steps : [
      { "@type": "HowToStep", position: 1, text: instructions || "Tarif adımları için sayfayı ziyaret edin." }
    ],
    ...(ratingData ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: ratingData.avg.toFixed(1),
        reviewCount: ratingData.count,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
    ...(youtubeId ? {
      video: {
        "@type": "VideoObject",
        name: `${recipe.title} — Tarif Videosu`,
        description: recipe.description,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
        contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
        uploadDate: recipe.created_at,
      },
    } : {}),
    // ──────────────────────────────────────────────────────────────────────────
    ...(nutrition?.calories ? {
      nutrition: {
        "@type": "NutritionInformation",
        calories: `${nutrition.calories} kalori`,
        ...(nutrition.protein ? { proteinContent: `${nutrition.protein}g` } : {}),
        ...(nutrition.carbs ? { carbohydrateContent: `${nutrition.carbs}g` } : {}),
        ...(nutrition.fat ? { fatContent: `${nutrition.fat}g` } : {}),
        ...(nutrition.fiber ? { fiberContent: `${nutrition.fiber}g` } : {}),
      },
    } : {}),
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
