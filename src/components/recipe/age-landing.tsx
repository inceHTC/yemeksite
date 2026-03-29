import { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Breadcrumb } from "@/components/shared/breadcrumb";

interface AgeLandingProps {
  ageMin: number;
  ageMax: number;
  title: string;
  subtitle: string;
  description: string;
  milestones: string[];
  tips: string[];
  emoji: string;
}

async function AgeRecipeGrid({ ageMin, ageMax }: { ageMin: number; ageMax: number }) {
  const { recipes, total } = await getRecipes({ ageMin, ageMax, sort: "newest" }, 1, 24);
  if (!recipes.length) return <p className="text-muted-foreground">Henüz tarif eklenmedi.</p>;
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4"><strong>{total}</strong> tarif bulundu</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe: RecipeRow) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export function AgeLandingPage({
  ageMin, ageMax, title, subtitle, description, milestones, tips, emoji,
}: AgeLandingProps) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-5xl space-y-10">

          <Breadcrumb items={[{ label: "Tarifler", href: "/tarifler" }, { label: title }]} />

          {/* Hero */}
          <section className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-3xl p-8">
            <div className="flex items-start gap-4">
              <span className="text-6xl">{emoji}</span>
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold">{title}</h1>
                <p className="text-lg text-muted-foreground mt-1">{subtitle}</p>
                <p className="text-sm mt-3 max-w-2xl">{description}</p>
              </div>
            </div>
          </section>

          {/* Gelişim Kilometre Taşları */}
          <section className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-3xl border border-border p-6">
              <h2 className="font-heading font-bold text-lg mb-3">🌟 Bu Dönemin Gelişim Taşları</h2>
              <ul className="space-y-2">
                {milestones.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold shrink-0">✓</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-3xl border border-border p-6">
              <h2 className="font-heading font-bold text-lg mb-3">💡 Beslenme İpuçları</h2>
              <ul className="space-y-2">
                {tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-accent-foreground shrink-0">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Tarifler */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-4">{ageMin}–{ageMax} Ay İçin Tarifler</h2>
            <Suspense fallback={
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-3xl bg-muted animate-pulse aspect-[3/4]" />
                ))}
              </div>
            }>
              <AgeRecipeGrid ageMin={ageMin} ageMax={ageMax} />
            </Suspense>
          </section>

          {/* İlgili Kategoriler */}
          <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { href: "/tarifler?health=gas_friendly", label: "💨 Gaz Dostu" },
              { href: "/tarifler?health=constipation", label: "🌿 Kabızlık Önleyici" },
              { href: "/tarifler?freezable=true", label: "❄️ Dondurulabilir" },
              { href: "/tarifler?diet=dairy_free", label: "🥛 Sütsüz" },
              { href: "/tarifler?meal=breakfast", label: "☀️ Kahvaltılar" },
              { href: "/tarifler?meal=puree", label: "🥣 Püreler" },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-center hover:border-primary/40 hover:shadow-soft transition-all"
              >
                {cat.label}
              </Link>
            ))}
          </section>

        </div>
      </main>
      <MobileNav />
    </>
  );
}
