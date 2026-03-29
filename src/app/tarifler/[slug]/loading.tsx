import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function RecipeDetailLoading() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-24 sm:pb-0">
        <article className="container mx-auto px-4 max-w-xl">
          {/* Breadcrumb bar */}
          <div className="flex items-center justify-between py-4">
            <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Hero görsel */}
          <div className="aspect-square sm:aspect-[4/3] rounded-3xl bg-muted animate-pulse mb-7" />

          {/* Başlık */}
          <div className="space-y-2 mb-2">
            <div className="h-7 w-4/5 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Açıklama */}
          <div className="space-y-1.5 mb-5">
            <div className="h-3.5 w-full rounded-full bg-muted animate-pulse" />
            <div className="h-3.5 w-5/6 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Meta bilgiler */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-3.5 w-14 rounded-full bg-muted animate-pulse" />
            <div className="h-3.5 w-14 rounded-full bg-muted animate-pulse" />
            <div className="h-3.5 w-14 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Ana kart */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-6 p-5 space-y-4">
            {/* Malzemeler başlık */}
            <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="h-3 w-32 rounded-full bg-muted animate-pulse" />
                </div>
              ))}
            </div>

            <div className="border-t border-border" />

            {/* Yapılış başlık */}
            <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3.5 rounded-xl px-3 py-3">
                  <div className="w-6 h-6 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <div className="h-3 w-full rounded-full bg-muted animate-pulse" />
                    <div className="h-3 w-4/5 rounded-full bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </main>
      <MobileNav />
    </>
  );
}
