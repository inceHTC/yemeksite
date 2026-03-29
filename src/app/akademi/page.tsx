import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types/supabase";
import { Clock, BookOpen, Archive } from "lucide-react";
import { CategoryFilter } from "./category-filter";
import { MagazineCover } from "./magazine-cover";

export const metadata: Metadata = {
  title: "Tok Bebek Dergisi — Anne & Bebek",
  description:
    "WHO ve AAP'a dayalı bebek beslenmesi rehberleri. Tamamlayıcı beslenmeye başlangıç, alerjen giriş, porsiyon rehberi ve daha fazlası.",
  keywords: ["bebek beslenmesi rehber", "tamamlayıcı besin", "bebek alerji", "bebek porsiyon", "bebek gelişim"],
};

const CATEGORY_LABEL: Record<string, string> = {
  nutrition: "Beslenme",
  development: "Gelişim",
  health: "Sağlık",
  safety: "Güvenlik",
};

const CATEGORY_COLOR: Record<string, string> = {
  nutrition: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  development: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  health: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  safety: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
};

async function getArticles(category?: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data } = await query;
  return (data ?? []) as Article[];
}

interface PageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function AkademiPage({ searchParams }: PageProps) {
  const { kategori } = await searchParams;
  const articles = await getArticles(kategori);
  const allArticles = kategori ? await getArticles() : articles;

  const featured = allArticles[0] ?? null;
  const teasers = allArticles.slice(1, 6);
  const gridArticles = kategori ? articles : allArticles.slice(1);

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Magazine Cover — full bleed, no container constraint */}
        {featured && !kategori && (
          <div className="px-4 pt-6 pb-0 max-w-5xl mx-auto">
            <MagazineCover
              featured={featured}
              teasers={teasers}
              totalCount={allArticles.length}
            />
          </div>
        )}

        <div className="container mx-auto px-4 py-8 max-w-5xl">

          {/* Section title when filtered */}
          {kategori && (
            <div className="mb-6">
              <h1 className="font-heading text-2xl font-bold">
                {CATEGORY_LABEL[kategori] ?? kategori} Makaleleri
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {articles.length} makale bulundu
              </p>
            </div>
          )}

          {/* Category Filter + Archive link */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Suspense fallback={<div className="h-9 flex-1" />}>
              <CategoryFilter />
            </Suspense>
            <Link
              href="/akademi/arsiv"
              className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              Arşiv
            </Link>
          </div>

          {/* Articles */}
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">Bu kategoride henüz makale yok.</p>
              <Link href="/akademi" className="text-sm text-primary hover:underline mt-2 inline-block">
                Tüm makalelere dön
              </Link>
            </div>
          ) : (
            <div className="mt-6">
              {/* Section header when not filtered */}
              {!kategori && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 border-t border-border" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    Tüm Makaleler
                  </span>
                  <div className="flex-1 border-t border-border" />
                </div>
              )}

              {/* Article grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gridArticles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} priority={i < 3} />
                ))}
              </div>
            </div>
          )}

          {/* Recipes CTA */}
          <div className="mt-14 rounded-3xl border border-border bg-muted/30 p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Tarifler</p>
                <h3 className="font-heading text-xl sm:text-2xl font-bold mb-1">
                 Bebeğinize Özel Tarifler
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Bebeğinizin yaşına göre filtrelenmiş, evde kolayca hazırlayabileceğiniz tarifler.
                </p>
              </div>
              <Link
                href="/tarifler"
                className="shrink-0 inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-2.5 text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-md"
              >
                Tarifleri Keşfet
                <BookOpen className="w-4 h-4" />
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { href: "/4-6-ay", label: "🌱 4–6 Ay" },
                { href: "/6-9-ay", label: "🥕 6–9 Ay" },
                { href: "/9-12-ay", label: "🍲 9–12 Ay" },
                { href: "/12-24-ay", label: "🍽️ 12–24 Ay" },
                { href: "/24-36-ay", label: "🧑‍🍳 24–36 Ay" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      <MobileNav />
    </>
  );
}

function ArticleCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  return (
    <Link href={`/akademi/${article.slug}`} className="group block h-full">
      <article className="h-full bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
        {/* Cover */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/5 to-muted overflow-hidden flex-shrink-0">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={priority}
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary/20" />
            </div>
          )}
          {/* Category pill on image */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${CATEGORY_COLOR[article.category] ?? "bg-muted text-muted-foreground"}`}>
              {CATEGORY_LABEL[article.category] ?? article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="font-heading font-bold text-base mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2 flex-1">
            {article.title}
          </h2>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {article.reading_time_min} dk okuma
            </span>
            <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Oku →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
