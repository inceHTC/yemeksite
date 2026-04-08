import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient, createBuildClient } from "@/lib/supabase/server";
import type { Article } from "@/types/supabase";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { BackButton } from "@/components/shared/back-button";
import {
  Clock,
  BookOpen,
  ExternalLink,
  ArrowRight,
  Calendar,
} from "lucide-react";

const CATEGORY_LABEL: Record<string, string> = {
  nutrition: "Beslenme",
  development: "Gelişim",
  health: "Sağlık",
  safety: "Güvenlik",
};

const CATEGORY_BG: Record<string, string> = {
  nutrition: "from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20",
  development: "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
  health: "from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20",
  safety: "from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20",
};

const CATEGORY_ACCENT: Record<string, string> = {
  nutrition: "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50",
  development: "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50",
  health: "text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50",
  safety: "text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50",
};

export async function generateStaticParams() {
  const supabase = createBuildClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("articles")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map(({ slug }: { slug: string }) => ({ slug }));
}

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data ?? null;
}

async function getRelatedArticles(category: string, excludeId: string): Promise<Article[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("articles")
    .select("id, slug, title, excerpt, category, reading_time_min, image_url")
    .eq("is_published", true)
    .eq("category", category)
    .neq("id", excludeId)
    .limit(3);
  return data ?? [];
}

async function getNextArticle(createdAt: string): Promise<Article | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("articles")
    .select("id, slug, title, category, reading_time_min, image_url")
    .eq("is_published", true)
    .lt("created_at", createdAt)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  nutrition: ["bebek beslenmesi", "bebek yemekleri", "tamamlayıcı beslenme", "bebek diyeti"],
  development: ["bebek gelişimi", "bebek büyümesi", "motor gelişim", "bilişsel gelişim"],
  health: ["bebek sağlığı", "bebek hastalıkları", "çocuk sağlığı", "pediatri"],
  safety: ["bebek güvenliği", "bebek kazası önleme", "güvenli bebek"],
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tokbebek.com.tr";
  const url = `${baseUrl}/akademi/${slug}`;
  const categoryKeywords = CATEGORY_KEYWORDS[article.category] ?? [];

  return {
    title: `${article.title} — Tok Bebek Dergisi`,
    description: article.excerpt,
    keywords: [...categoryKeywords, "tok bebek", "anne bebek", "bebek rehberi"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      locale: "tr_TR",
      siteName: "Tok Bebek",
      publishedTime: article.created_at,
      authors: ["Tok Bebek Dergisi"],
      ...(article.image_url ? { images: [{ url: article.image_url, width: 1200, height: 630, alt: article.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      ...(article.image_url ? { images: [article.image_url] } : {}),
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const [related, nextArticle] = await Promise.all([
    getRelatedArticles(article.category, article.id),
    getNextArticle(article.created_at),
  ]);

  const sources = Array.isArray(article.sources) ? (article.sources as string[]) : [];
  const categoryBg = CATEGORY_BG[article.category] ?? "from-muted to-muted/50";
  const categoryAccent = CATEGORY_ACCENT[article.category] ?? "text-muted-foreground bg-muted";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://tokbebek.com.tr";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Organization", name: "Tok Bebek Dergisi", url: baseUrl },
    publisher: {
      "@type": "Organization",
      name: "Tok Bebek",
      url: baseUrl,
      logo: { "@type": "ImageObject", url: `${baseUrl}/icon-192.png` },
    },
    datePublished: article.created_at,
    dateModified: article.updated_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/akademi/${article.slug}` },
    ...(article.image_url ? { image: { "@type": "ImageObject", url: article.image_url } } : {}),
    articleSection: CATEGORY_LABEL[article.category] ?? article.category,
    timeRequired: `PT${article.reading_time_min}M`,
    inLanguage: "tr",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Reading progress — fixed top bar */}
      <ReadingProgress />

      {/* Floating top nav */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="max-w-3xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          <BackButton fallbackHref="/akademi" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground truncate max-w-[160px] sm:max-w-xs">
              {article.title}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="w-3 h-3" />
            {article.reading_time_min} dk
          </div>
        </div>
      </div>

      <main className="pb-24 sm:pb-12">

        {/* Hero: gradient bg + cover image */}
        <div className={`bg-gradient-to-b ${categoryBg} pt-10 pb-0`}>
          <div className="max-w-3xl mx-auto px-4">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryAccent}`}>
                {CATEGORY_LABEL[article.category] ?? article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formatDate(article.created_at)}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {article.reading_time_min} dakika okuma
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold leading-snug mb-4 text-foreground">
              {article.title}
            </h1>

            {/* Excerpt lead */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-8">
              {article.excerpt}
            </p>
          </div>

          {/* Cover image — full bleed within max-width */}
          {article.image_url && (
            <div className="max-w-3xl mx-auto px-4 pb-0">
              <div className="relative w-full aspect-[16/9] rounded-t-2xl overflow-hidden shadow-lg">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-4">
          {/* White reading card */}
          <div className={`bg-card rounded-b-2xl ${article.image_url ? "" : "rounded-t-2xl mt-6"} px-6 sm:px-10 py-10 shadow-sm border border-border/50 border-t-0`}>
            <div
              className={
                "prose-article " +
                "text-foreground leading-[1.85] text-[15px] sm:text-base " +
                "[&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-foreground [&_h1]:leading-snug " +
                "[&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-foreground [&_h2]:leading-snug [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:pb-2 " +
                "[&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-foreground " +
                "[&_p]:my-4 [&_p]:text-foreground " +
                "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 " +
                "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 " +
                "[&_li]:my-1.5 [&_li]:text-foreground [&_li]:leading-relaxed " +
                "[&_blockquote]:relative [&_blockquote]:my-8 [&_blockquote]:pl-6 [&_blockquote]:pr-4 [&_blockquote]:py-4 [&_blockquote]:rounded-r-2xl [&_blockquote]:bg-primary/5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/60 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:text-base " +
                "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_code]:text-foreground " +
                "[&_pre]:bg-muted [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:my-5 [&_pre_code]:bg-transparent [&_pre_code]:text-sm " +
                "[&_hr]:border-border/50 [&_hr]:my-10 " +
                "[&_strong]:font-semibold [&_strong]:text-foreground " +
                "[&_em]:italic " +
                "[&_s]:line-through [&_s]:text-muted-foreground " +
                "[&_mark]:bg-yellow-200/80 [&_mark]:dark:bg-yellow-900/50 [&_mark]:px-1 [&_mark]:rounded " +
                "[&_a]:text-primary [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-3 [&_a]:decoration-primary/40 [&_a]:hover:decoration-primary [&_a]:transition-all " +
                "[&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-8 [&_img]:mx-auto [&_img]:block [&_img]:shadow-md"
              }
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Sources */}
          {sources.length > 0 && (
            <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border/50">
              <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" />
                Kaynaklar
              </h3>
              <ol className="space-y-2">
                {sources.map((src, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {src.startsWith("http") ? (
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline flex items-start gap-1 break-all"
                      >
                        {src}
                        <ExternalLink className="w-3 h-3 shrink-0 mt-0.5" />
                      </a>
                    ) : (
                      <span>{src}</span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Next article teaser */}
          {nextArticle && (
            <Link href={`/akademi/${nextArticle.slug}`} className="group block mt-8">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all p-6 flex items-center gap-4">
                {nextArticle.image_url && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <Image src={nextArticle.image_url} alt={nextArticle.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Sonraki Makale</p>
                  <p className="font-heading font-bold text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {nextArticle.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {nextArticle.reading_time_min} dk okuma
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </Link>
          )}

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-xl">Benzer Makaleler</h3>
                <Link
                  href={`/akademi?kategori=${article.category}`}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  Tümünü gör <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/akademi/${rel.slug}`} className="group block">
                    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-soft hover:-translate-y-0.5 transition-all">
                      <div className="relative aspect-[16/9] bg-muted">
                        {rel.image_url ? (
                          <Image
                            src={rel.image_url}
                            alt={rel.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-primary/20" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {rel.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rel.reading_time_min} dk
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to magazine */}
          <div className="mt-12 text-center">
            <BackButton fallbackHref="/akademi" />
          </div>
        </div>
      </main>

      <MobileNav />
    </>
  );
}
