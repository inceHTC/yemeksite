export function RecipeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card">
      {/* Görsel alanı */}
      <div className="relative aspect-[4/3] bg-muted animate-pulse" />

      {/* İçerik */}
      <div className="p-4 space-y-2.5">
        {/* Öğün tipi */}
        <div className="h-2.5 w-14 rounded-full bg-muted animate-pulse" />

        {/* Başlık — 2 satır */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded-full bg-muted animate-pulse" />
          <div className="h-3.5 w-3/4 rounded-full bg-muted animate-pulse" />
        </div>

        {/* Süre + Zorluk */}
        <div className="flex items-center gap-3 pt-0.5">
          <div className="h-3 w-12 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-1 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-10 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}
