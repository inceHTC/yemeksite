import type { MetadataRoute } from "next";
import { createBuildClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bebi.life";

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
    url: `${baseUrl}/tarifler/${recipe.slug}`,
    lastModified: new Date(recipe.updated_at),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const articleUrls: MetadataRoute.Sitemap = (articles ?? []).map((article) => ({
    url: `${baseUrl}/akademi/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/tarifler`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    // Age group landing pages
    { url: `${baseUrl}/4-6-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/6-9-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/9-12-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/12-24-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/24-36-ay`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    // Filter pages (SEO)
    { url: `${baseUrl}/tarifler?ageGroup=4-6`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tarifler?ageGroup=6-9`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/tarifler?ageGroup=9-12`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    // Çözüm Merkezi
    { url: `${baseUrl}/destek`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/destek/gaz-sancisi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/destek/dis-cikarma`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/destek/kabizlik`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  return [...staticPages, ...recipeUrls, ...articleUrls];
}
