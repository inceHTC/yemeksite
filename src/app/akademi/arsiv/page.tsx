import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types/supabase";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Clock, BookOpen, ChevronLeft, Archive } from "lucide-react";

export const metadata: Metadata = {
  title: "Makale Arşivi — Tok Bebek Dergisi",
  description: "Tok Bebek Dergisi tüm bebek beslenmesi ve gelişim makaleleri. Beslenme, sağlık, güvenlik ve gelişim kategorilerinde yüzlerce makale.",
  keywords: ["bebek beslenmesi makaleler", "bebek gelişimi rehber", "anne bebek dergi arşivi"],
  alternates: { canonical: "https://tokbebek.com.tr/akademi/arsiv" },
};

const CATEGORY_LABEL: Record<string, string> = {
  nutrition: "Beslenme",
  development: "Gelişim",
  health: "Sağlık",
  safety: "Güvenlik",
};

const CATEGORY_ACCENT: Record<string, string> = {
  nutrition: "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50",
  development: "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50",
  health: "text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/50",
  safety: "text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/50",
};

const TR_MONTHS: Record<number, string> = {
  1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan",
  5: "Mayıs", 6: "Haziran", 7: "Temmuz", 8: "Ağustos",
  9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık",
};

type GroupedArticles = Record<number, Record<number, Article[]>>;

async function getAllArticles(): Promise<Article[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("articles")
    .select("id, slug, title, excerpt, category, reading_time_min, image_url, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Article[];
}

function groupByYearMonth(articles: Article[]): GroupedArticles {
  const grouped: GroupedArticles = {};
  for (const article of articles) {
    const d = new Date(article.created_at);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(article);
  }
  return grouped;
}

export default async function ArsivPage() {
  const articles = await getAllArticles();
  const grouped = groupByYearMonth(articles);
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb
            items={[
              { label: "Dergi", href: "/akademi" },
              { label: "Arşiv" },
            ]}
          />

          {/* Page Header */}
          <div className="flex items-start justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Archive className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Tok Bebek Dergisi</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold">Arşiv</h1>
              <p className="text-muted-foreground mt-2 text-sm max-w-lg">
                Yayınlanan tüm makaleler — yıl ve ay bazında düzenlenmiş.
              </p>
            </div>
            <Link
              href="/akademi"
              className="shrink-0 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Dergi
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 mb-10 p-4 bg-card border border-border rounded-2xl">
            <div className="text-center">
              <p className="font-heading text-2xl font-extrabold text-primary">{articles.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Makale</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-heading text-2xl font-extrabold text-primary">{years.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Yıl</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="font-heading text-2xl font-extrabold text-primary">
                {Object.values(grouped).reduce((acc, months) => acc + Object.keys(months).length, 0)}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Ay</p>
            </div>
            <div className="ml-auto flex gap-2 flex-wrap justify-end">
              {["nutrition", "development", "health", "safety"].map((cat) => {
                const count = articles.filter((a) => a.category === cat).length;
                if (count === 0) return null;
                return (
                  <Link
                    key={cat}
                    href={`/akademi?kategori=${cat}`}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${CATEGORY_ACCENT[cat]}`}
                  >
                    {CATEGORY_LABEL[cat]} ({count})
                  </Link>
                );
              })}
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20">
              <Archive className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Henüz yayınlanmış makale yok.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {years.map((year) => {
                const months = Object.keys(grouped[year]).map(Number).sort((a, b) => b - a);
                const yearCount = Object.values(grouped[year]).reduce((s, arr) => s + arr.length, 0);

                return (
                  <div key={year}>
                    {/* Year heading */}
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="font-heading text-2xl font-extrabold text-foreground">{year}</h2>
                      <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
                        {yearCount} makale
                      </span>
                      <div className="flex-1 border-t border-border" />
                    </div>

                    {/* Months */}
                    <div className="space-y-8 pl-0 sm:pl-4 border-l-2 border-border/50 ml-0 sm:ml-4">
                      {months.map((month) => {
                        const monthArticles = grouped[year][month];

                        return (
                          <div key={month} className="relative pl-6 sm:pl-8">
                            {/* Month dot on timeline */}
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            </div>

                            {/* Month label */}
                            <div className="flex items-center gap-3 mb-4">
                              <h3 className="font-heading font-bold text-base">
                                {TR_MONTHS[month]} {year}
                              </h3>
                              <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {monthArticles.length} makale
                              </span>
                            </div>

                            {/* Articles in this month */}
                            <div className="space-y-3">
                              {monthArticles.map((article) => (
                                <ArchiveArticleRow key={article.id} article={article} />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </>
  );
}

function ArchiveArticleRow({ article }: { article: Article }) {
  const accent = CATEGORY_ACCENT[article.category] ?? "text-muted-foreground bg-muted";

  return (
    <Link href={`/akademi/${article.slug}`} className="group block">
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/30 hover:shadow-soft hover:-translate-y-px transition-all">
        {/* Thumbnail */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted shrink-0">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary/20" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-heading font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1 leading-snug">
            {article.title}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Right meta */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent}`}>
            {CATEGORY_LABEL[article.category] ?? article.category}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <Clock className="w-2.5 h-2.5" />
            {article.reading_time_min} dk
          </span>
        </div>
      </div>
    </Link>
  );
}
