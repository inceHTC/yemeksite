import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, Users, Snowflake } from "lucide-react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { RecipeSchema } from "@/components/recipe/recipe-schema";
import { ShareButton } from "@/components/recipe/share-button";
import { IngredientScaler } from "@/components/recipe/ingredient-scaler";
import { CookingSteps } from "@/components/recipe/cooking-steps";
import { NutritionVisual } from "@/components/recipe/nutrition-visual";
import { getRecipeBySlug, getRelatedRecipes, getAllSlugs, incrementViewCount } from "@/lib/supabase/recipes";
import { getReviews } from "@/app/tarifler/actions";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BackButton } from "@/components/shared/back-button";
import { ReviewsList } from "@/components/recipe/reviews-list";
import { ReviewFormToggle } from "@/components/recipe/review-form-toggle";
import { RecipeVideo } from "@/components/recipe/recipe-video";
import { Suspense } from "react";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) return {};

  const title = `${recipe.title} (${recipe.age_min_months}-${recipe.age_max_months} Aylık Bebek)`;
  const description = `${recipe.description} ${recipe.prep_time_min + recipe.cook_time_min} dakikada hazır. ${recipe.age_min_months}-${recipe.age_max_months} aylık bebekler için uygun.`;
  const canonicalUrl = `https://tokbebek.com.tr/tarifler/${slug}`;
  const ogImage = `/api/og?title=${encodeURIComponent(recipe.title)}&age=${recipe.age_min_months}-${recipe.age_max_months}&image=${encodeURIComponent(recipe.image_url ?? "")}`;

  return {
    title,
    description,
    keywords: [
      recipe.title,
      `${recipe.age_min_months} aylık bebek yemeği`,
      `${recipe.age_min_months}-${recipe.age_max_months} ay bebek tarifi`,
      "bebek tarifi",
      "bebek püresi",
      "bebek beslenmesi",
      "tamamlayıcı besin",
      recipe.is_dairy_free ? "sütsüz bebek tarifi" : "",
      recipe.is_gluten_free ? "glutensiz bebek tarifi" : "",
    ].filter(Boolean),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      locale: "tr_TR",
      siteName: "Tok Bebek",
      images: [{ url: ogImage, width: 1200, height: 630, alt: recipe.title }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: "Kahvaltı", lunch: "Öğle", dinner: "Akşam",
  snack: "Ara Öğün", puree: "Püre",
};
const HEALTH_TAG_LABEL: Record<string, string> = {
  gas_friendly: "💨 Gaz Dostu",
  constipation: "🌿 Kabızlık Önleyici",
  immunity: "🛡️ Bağışıklık",
  teething: "🧊 Diş Rahatlatıcı",
};

export default async function RecipeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) notFound();

  void incrementViewCount(slug);

  const recipeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tarifler/${slug}`;

  const related = await getRelatedRecipes(
    recipe.id,
    recipe.age_min_months,
    recipe.age_max_months,
    recipe.meal_type,
    9
  );

  const nutrition = recipe.nutritional_info as Record<string, number> | null;
  const totalTime = recipe.prep_time_min + recipe.cook_time_min;

  // Onaylı yorumlardan rating verisi
  const reviews = await getReviews(recipe.id);
  const ratingData = reviews.length > 0
    ? { avg: reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length, count: reviews.length }
    : null;

  const tags = [
    MEAL_TYPE_LABEL[recipe.meal_type],
    ...(recipe.health_tags?.map((t) => HEALTH_TAG_LABEL[t] ?? t) ?? []),
    recipe.is_dairy_free ? "🥛 Sütsüz" : null,
    recipe.is_gluten_free ? "🌾 Glutensiz" : null,
    recipe.is_sugar_free ? "🍬 Şekersiz" : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <RecipeSchema recipe={recipe} url={recipeUrl} ratingData={ratingData} />
      <Header />
      <main className="flex-1 pb-24 sm:pb-0">
        <article className="container mx-auto px-4 max-w-xl">

          {/* Geri + Share */}
          <div className="flex items-center justify-between py-4">
            <BackButton fallbackHref="/tarifler" />
            <ShareButton title={recipe.title} url={recipeUrl} />
          </div>

          {/* Hero */}
          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-muted mb-7">
            {recipe.image_url ? (
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, 576px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-8xl bg-gradient-to-br from-primary/10 to-accent/20">
                🥣
              </div>
            )}
            {/* Yaş badge — hero üzerinde */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-2xl px-3 py-1.5">
              <span className="text-sm font-bold text-primary">{recipe.age_min_months}–{recipe.age_max_months} ay</span>
            </div>
          </div>

          {/* Başlık */}
          <h1 className="font-heading text-2xl font-bold leading-snug mb-2">{recipe.title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">{recipe.description}</p>

          {/* Meta + Etiketler */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/70">
              <Clock className="w-3.5 h-3.5 text-primary/60" />{totalTime} dk
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/70">
              <Users className="w-3.5 h-3.5 text-primary/60" />{recipe.servings} porsiyon
            </span>
            <span className="text-border">·</span>
            <span className="text-xs font-medium text-foreground/70">
              {recipe.difficulty === "easy" ? "Kolay" : recipe.difficulty === "medium" ? "Orta" : "Zor"}
            </span>
            {recipe.is_freezable && (
              <>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1 text-xs font-medium text-blue-500">
                  <Snowflake className="w-3.5 h-3.5" />Dondurulabilir
                </span>
              </>
            )}
            {tags.length > 0 && (
              <>
                <span className="text-border">·</span>
                {tags.map((tag) => (
                  <span key={tag} className="text-xs font-medium text-accent">{tag}</span>
                ))}
              </>
            )}
          </div>

          {/* Ana kart — Malzemeler + Yapılış */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-6">

            {/* Malzemeler */}
            <IngredientScaler ingredients={recipe.recipe_ingredients} />

            {/* Ayırıcı */}
            <div className="mx-5 border-t border-border" />

            {/* Yapılış */}
            <div className="px-5 pt-4 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Yapılışı
                </h2>
                <span className="text-xs text-muted-foreground/50">
                  Adıma tıklayarak tamamla
                </span>
              </div>
              {recipe.instructions ? (
                <CookingSteps instructions={recipe.instructions} />
              ) : (
                <p className="text-sm text-muted-foreground italic">Henüz eklenmedi.</p>
              )}
            </div>

            {/* Besin Değerleri — görsel */}
            {nutrition && Object.keys(nutrition).length > 0 && (
              <>
                <div className="mx-5 border-t border-border" />
                <div className="px-5 pt-4 pb-5">
                  <h2 className="text-base font-bold text-foreground mb-4">
                    Besin Değerleri
                  </h2>
                  <NutritionVisual nutrition={nutrition} />
                </div>
              </>
            )}

            {/* Dondurulabilir notu */}
            {recipe.is_freezable && (recipe as any).freeze_notes && (
              <div className="mx-5 mb-5 rounded-xl bg-blue-50 dark:bg-blue-950/20 px-4 py-2.5 flex items-center gap-2">
                <Snowflake className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">{(recipe as any).freeze_notes}</p>
              </div>
            )}
          </div>

          {/* Video */}
          {(recipe as any).video_url && (
            <section className="mb-6">
              <h2 className="font-heading text-lg font-bold mb-3">Hazırlanışı İzle</h2>
              <RecipeVideo url={(recipe as any).video_url} />
            </section>
          )}

          {/* Yorumlar */}
          <section className="mb-6">
            <h2 className="font-heading text-lg font-bold mb-4">Yorumlar</h2>
            <div className="space-y-5">
              <Suspense fallback={<div className="h-24 rounded-2xl bg-muted animate-pulse" />}>
                <ReviewsList recipeId={recipe.id} />
              </Suspense>
              <ReviewFormToggle recipeId={recipe.id} />
            </div>
          </section>

          {/* Benzer Tarifler */}
          {related.length > 0 && (
            <section className="mb-6">
              <h2 className="font-heading text-lg font-bold mb-4">Benzer Tarifler</h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4">
                {related.map((r) => (
                  <RecipeCard key={r.id} recipe={r} compact />
                ))}
              </div>
            </section>
          )}

        </article>
      </main>
      <MobileNav />
    </>
  );
}
