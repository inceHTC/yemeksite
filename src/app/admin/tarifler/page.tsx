import Link from "next/link";
import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { PlusCircle, Pencil, Eye, EyeOff } from "lucide-react";
import { togglePublish, deleteRecipe } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { RecipeSearch } from "@/components/admin/recipe-search";

const MEAL_LABEL: Record<string, string> = {
  breakfast: "Kahvaltı",
  lunch: "Öğle",
  dinner: "Akşam",
  snack: "Ara Öğün",
  puree: "Püre",
};

const MEAL_COLOR: Record<string, string> = {
  breakfast: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  lunch: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  dinner: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  snack: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  puree: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
};

async function getRecipes(q?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;
  let query = db
    .from("recipes")
    .select("id, slug, title, age_min_months, age_max_months, meal_type, is_published, created_at")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data } = await query;
  return (data ?? []) as {
    id: string;
    slug: string;
    title: string;
    age_min_months: number;
    age_max_months: number;
    meal_type: string;
    is_published: boolean;
    created_at: string;
  }[];
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminTariflerPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const recipes = await getRecipes(q);

  const published = recipes.filter((r) => r.is_published).length;
  const draft = recipes.filter((r) => !r.is_published).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Tarifler</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-muted-foreground">{recipes.length} sonuç</span>
            {recipes.length > 0 && (
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
            <RecipeSearch defaultValue={q ?? ""} />
          </Suspense>
          <Link
            href="/admin/tarifler/yeni"
            className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Yeni Tarif
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Tarif
              </th>
              <th className="text-left px-4 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Yaş
              </th>
              <th className="text-left px-4 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Öğün
              </th>
              <th className="text-left px-4 py-3.5 font-medium text-muted-foreground text-xs uppercase tracking-wide">
                Durum
              </th>
              <th className="px-4 py-3.5 w-24" />
            </tr>
          </thead>
          <tbody>
            {recipes.map((r) => (
              <tr
                key={r.id}
                className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors group"
              >
                <td className="px-5 py-3.5">
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {r.title}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg font-medium">
                    {r.age_min_months}–{r.age_max_months} ay
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`text-xs px-2 py-1 rounded-lg font-medium ${
                      MEAL_COLOR[r.meal_type] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {MEAL_LABEL[r.meal_type] ?? r.meal_type}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <form action={togglePublish.bind(null, r.id, !r.is_published)}>
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105 ${
                        r.is_published
                          ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-300"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {r.is_published ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {r.is_published ? "Yayında" : "Taslak"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Link
                      href={`/admin/tarifler/${r.id}/duzenle`}
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Düzenle"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <DeleteButton id={r.id} action={deleteRecipe} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recipes.length === 0 && (
          <div className="text-center py-16">
            {q ? (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  &quot;<span className="font-medium text-foreground">{q}</span>&quot; için sonuç bulunamadı.
                </p>
                <Link href="/admin/tarifler" className="text-xs text-primary hover:underline">
                  Aramayı temizle
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Henüz tarif yok.</p>
                <Link href="/admin/tarifler/yeni" className="text-sm text-primary hover:underline">
                  İlk tarifi ekle →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
