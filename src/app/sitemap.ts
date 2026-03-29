import type { MetadataRoute } from "next";
import { createBuildClient } from "@/lib/supabase/server";

const BASE_URL = "https://tokbebek.com.tr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createBuildClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any;

  const [{ data: recipes }, { data: articles }] = await Promise.all([
    supabaseAny.from("recipes").select("slug, updated_at").eq("is_published", true),
    supabaseAny.from("articles").select("slug, created_at").eq("is_published", true),
  ]) as [
    { data: { slug: string; updated_at: string }[] | null },
    { data: { slug: string; created_at: string }[] | null },
  ];

  const recipeUrls: MetadataRoute.Sitemap = (recipes ?? []).map((recipe) => ({
    url: `${BASE_URL}/tarifler/${recipe.slug}`,
    lastModified: new Date(recipe.updated_at),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const articleUrls: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
    url: `${BASE_URL}/akademi/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    // Ana sayfalar
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/tarifler`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE_URL}/akademi`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/akademi/arsiv`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/ara`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    // Yaş grubu açılış sayfaları
    { url: `${BASE_URL}/4-6-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/6-9-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/9-12-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/12-24-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/24-36-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    // Çözüm Merkezi
    { url: `${BASE_URL}/destek`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/gaz-sancisi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/dis-cikarma`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/kabizlik`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/secici-yeme`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/bagisiklik`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/demir-eksikligi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/ishal`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/reflu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/destek/ates`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    // Bilgi sayfaları
    { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/gizlilik`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/kullanim-kosullari`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...staticPages, ...recipeUrls, ...articleUrls];
}
