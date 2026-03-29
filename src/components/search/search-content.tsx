"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  description: string;
  age_min_months: number;
  age_max_months: number;
  prep_time_min: number;
  cook_time_min: number;
  meal_type: string;
  image_url: string | null;
}

const POPULAR_SEARCHES = [
  "elma püresi", "havuç püresi", "avokado", "mercimek çorbası",
  "yulaf lapası", "somon", "kabızlık", "gaz dostu", "dondurulabilir",
];

const RECENT_KEY = "bebi_recent_searches";

function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecent(JSON.parse(stored));
    } catch { /* noop */ }
  }, []);

  const add = (query: string) => {
    setRecent((prev) => {
      const next = [query, ...prev.filter((q) => q !== query)].slice(0, 6);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clear = () => {
    localStorage.removeItem(RECENT_KEY);
    setRecent([]);
  };

  return { recent, add, clear };
}

export function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { recent, add, clear } = useRecentSearches();

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data.results ?? []);
            setTotal(data.total ?? 0);
          }
        } catch { /* noop */ }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleSelect(result: SearchResult) {
    add(result.title);
    router.push(`/tarifler/${result.slug}`);
  }

  function handleChip(chip: string) {
    setQuery(chip);
    add(chip);
  }

  const showEmpty = query.length >= 2 && !isPending && results.length === 0;

  return (
    <div className="space-y-6">
      {/* Arama kutusu */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tarif veya malzeme ara… (elma, havuç, somon…)"
          autoFocus
          className="w-full rounded-2xl border border-border bg-background pl-12 pr-4 py-4 text-base outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sonuçlar */}
      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm text-muted-foreground mb-3">
              <strong>{total}</strong> tarif bulundu
            </p>
            <div className="space-y-2">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r)}
                  className="w-full flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left hover:border-primary/40 hover:shadow-soft transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                    🥣
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{r.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{r.age_min_months}–{r.age_max_months} ay</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {r.prep_time_min + r.cook_time_min} dk
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {showEmpty && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState
              variant="no-search"
              title={`"${query}" için sonuç bulunamadı`}
              description="Farklı bir kelime ya da malzeme adı deneyin."
            />
          </motion.div>
        )}

        {!query && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Son aramalar */}
            {recent.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Son Aramalar</p>
                  <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive">Temizle</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleChip(q)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm hover:bg-muted/70 transition-colors"
                    >
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popüler aramalar */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Popüler Aramalar</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleChip(q)}
                    className="rounded-full bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium hover:bg-primary/20 transition-colors capitalize"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Kategorilere göz at */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Kategorilere Göz At</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/tarifler?ageGroup=4-6", label: "🌱 4–6 Ay Tarifleri" },
                  { href: "/tarifler?ageGroup=6-9", label: "🥣 6–9 Ay Tarifleri" },
                  { href: "/tarifler?ageGroup=9-12", label: "🍲 9–12 Ay Tarifleri" },
                  { href: "/tarifler?freezable=true", label: "❄️ Dondurulabilir" },
                ].map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={cn(
                      "rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium",
                      "hover:border-primary/40 hover:shadow-soft transition-all text-center"
                    )}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
