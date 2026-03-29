import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { createClient } from "@/lib/supabase/server";
import {
  PlusCircle,
  BookOpen,
  Eye,
  EyeOff,
  UtensilsCrossed,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { AdminLoginForm } from "./admin-login-form";

type Profile = { role: string };

async function getStats() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;

  const [{ count: total }, { count: published }, { count: draft }, recentData] =
    await Promise.all([
      db.from("recipes").select("*", { count: "exact", head: true }),
      db.from("recipes").select("*", { count: "exact", head: true }).eq("is_published", true),
      db.from("recipes").select("*", { count: "exact", head: true }).eq("is_published", false),
      db
        .from("recipes")
        .select("id, title, is_published, meal_type, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return {
    total: total ?? 0,
    published: published ?? 0,
    draft: draft ?? 0,
    recent: (recentData.data ?? []) as {
      id: string;
      title: string;
      is_published: boolean;
      meal_type: string;
      created_at: string;
    }[],
  };
}

const MEAL_LABEL: Record<string, string> = {
  breakfast: "Kahvaltı",
  lunch: "Öğle",
  dinner: "Akşam",
  snack: "Ara Öğün",
  puree: "Püre",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    profile = data as Profile | null;
  }

  const isAdmin = profile?.role === "admin";
  if (!isAdmin) return <AdminLoginForm />;

  const stats = await getStats();
  const publishRate = stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Tok Bebek yönetim paneline hoş geldin.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background rounded-2xl border border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Toplam
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground mt-0.5">Tarif</p>
          </div>
        </div>

        <div className="bg-background rounded-2xl border border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Eye className="w-4.5 h-4.5 text-green-600" />
            </div>
            <span className="text-xs text-green-600 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full">
              Yayında
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            <p className="text-sm text-muted-foreground mt-0.5">Aktif tarif</p>
          </div>
        </div>

        <div className="bg-background rounded-2xl border border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <EyeOff className="w-4.5 h-4.5 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Taslak
            </span>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.draft}</p>
            <p className="text-sm text-muted-foreground mt-0.5">Beklemede</p>
          </div>
        </div>
      </div>

      {/* Publish Rate */}
      {stats.total > 0 && (
        <div className="bg-background rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Yayınlanma Oranı</span>
            </div>
            <span className="text-sm font-bold text-primary">{publishRate}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${publishRate}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="bg-background rounded-2xl border border-border p-5 space-y-3">
          <h2 className="text-sm font-semibold">Hızlı İşlemler</h2>
          <div className="space-y-2">
            <Link
              href="/admin/tarifler/yeni"
              className="flex items-center gap-2.5 w-full rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Yeni Tarif Ekle
            </Link>
            <Link
              href="/admin/tarifler"
              className="flex items-center gap-2.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4" />
              Tarifleri Yönet
            </Link>
          </div>
        </div>

        {/* Recent Recipes */}
        <div className="col-span-2 bg-background rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Son Eklenen Tarifler</h2>
            <Link
              href="/admin/tarifler"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Tümünü gör <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Henüz tarif yok.
            </p>
          ) : (
            <div className="space-y-2">
              {stats.recent.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary/40" />
                    <span className="text-sm font-medium truncate">{r.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {MEAL_LABEL[r.meal_type] ?? r.meal_type}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      r.is_published
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {r.is_published ? "Yayında" : "Taslak"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
