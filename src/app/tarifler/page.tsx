import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RecipeFilters } from "@/components/recipe/recipe-filters";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { RecipeGridSkeleton } from "@/components/recipe/recipe-card-skeleton";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { AllergyFilterBanner } from "@/components/recipe/allergy-filter-banner";

export const metadata: Metadata = {
  title: "Bebek Yemekleri Tarifleri",
  description: "Bebeğinizin yaşına, alerjilerine ve ihtiyacına göre filtrelenmiş yüzlerce tarif. Bilimsel, lezzetli, güvenli.",
  alternates: { canonical: "https://tokbebek.com.tr/tarifler" },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function TariflerPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="mb-6">
            <Breadcrumb items={[{ label: "Tarifler" }]} />
            <h1 className="font-heading text-3xl font-bold">Tarifler</h1>
            <p className="text-muted-foreground mt-1">
              Bebeğinizin yaşına ve ihtiyacına göre tarif bulun
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filtreler — yan panel (desktop) veya üstte (mobil) */}
            <aside className="lg:w-52 shrink-0">
              <div className="lg:sticky lg:top-[78px]">
                <Suspense fallback={null}>
                  <RecipeFilters />
                </Suspense>
              </div>
            </aside>

            {/* Tarif Grid */}
            <div className="flex-1 min-w-0">
              <Suspense fallback={null}>
                <AllergyFilterBanner />
              </Suspense>
              <Suspense fallback={<RecipeGridSkeleton count={6} />}>
                <RecipeGrid searchParams={params} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}

