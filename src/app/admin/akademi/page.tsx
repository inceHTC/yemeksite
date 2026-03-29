import Link from "next/link";
import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { PlusCircle, Pencil, Eye, EyeOff } from "lucide-react";
import { toggleArticlePublish, deleteArticle } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";

const CATEGORY_LABEL: Record<string, string> = {
  nutrition: "Beslenme",
  development: "Gelişim",
  health: "Sağlık",
  safety: "Güvenlik",
};

const CATEGORY_COLOR: Record<string, string> = {
  nutrition: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  development: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  health: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  safety: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getArticles(q?: string) {
  const db = createAdminClient() as any;
  let query = db
    .from("articles")
    .select("id, slug, title, category, reading_time_min, is_published, created_at")
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);

  const { data } = await query;
  return (data ?? []) as {
    id: string;
    slug: string;
    title: string;
    category: string;
    reading_time_min: number;
    is_published: boolean;
    created_at: string;
  }[];
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminAkademiPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const articles = await getArticles(q);

  const published = articles.filter((a) => a.is_published).length;
  const draft = articles.filter((a) => !a.is_published).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dergi Makaleleri</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-muted-foreground">{articles.length} makale</span>
            {articles.length > 0 && (
              <>
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                  {published} yayında
                </span>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                  {draft} taslak
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <ArticleSearch defaultValue={q ?? ""} />
          </Suspense>
          <Link
            href="/admin/akademi/yeni"
            className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Yeni Makale
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">Makale</th>
              <th className="text-left px-4 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">Kategori</th>
              <th className="text-left px-4 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">Okuma</th>
              <th className="text-left px-4 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">Durum</th>
              <th className="px-4 py-3.5 w-24" />
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr
                key={a.id}
                className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors group"
              >
                <td className="px-5 py-3.5">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {a.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">/akademi/{a.slug}</div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${CATEGORY_COLOR[a.category] ?? "bg-muted text-muted-foreground"}`}>
                    {CATEGORY_LABEL[a.category] ?? a.category}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs text-muted-foreground">{a.reading_time_min} dk</span>
                </td>
                <td className="px-4 py-3.5">
                  <form action={toggleArticlePublish.bind(null, a.id, !a.is_published)}>
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105 ${
                        a.is_published
                          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {a.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {a.is_published ? "Yayında" : "Taslak"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Link
                      href={`/admin/akademi/${a.id}/duzenle`}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <DeleteButton id={a.id} action={deleteArticle} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="text-center py-16">
            {q ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  &quot;<span className="font-medium text-foreground">{q}</span>&quot; için sonuç bulunamadı.
                </p>
                <Link href="/admin/akademi" className="text-xs text-primary hover:underline">
                  Aramayı temizle
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Henüz makale yok.</p>
                <Link href="/admin/akademi/yeni" className="text-sm text-primary hover:underline">
                  İlk makaleyi ekle →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline search component
function ArticleSearch({ defaultValue }: { defaultValue: string }) {
  // Server component — using a plain form with GET
  return (
    <form method="GET" className="relative">
      <input
        name="q"
        defaultValue={defaultValue}
        placeholder="Makale ara…"
        className="rounded-xl border border-border bg-background pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all w-48"
      />
    </form>
  );
}
