"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RecipeCard } from "@/components/recipe/recipe-card";
import type { RecipeRow } from "@/lib/supabase/recipes";

const AGE_GROUPS = [
  { id: "4-6",  label: "4–6 ay",  sub: "İlk ek gıda",      href: "/4-6-ay"   },
  { id: "6-9",  label: "6–9 ay",  sub: "Keşfetme dönemi",   href: "/6-9-ay"   },
  { id: "9-12", label: "9–12 ay", sub: "Parmak yemekleri",  href: "/9-12-ay"  },
  { id: "12+",  label: "12+ ay",  sub: "Aile sofrasına",    href: "/12-24-ay" },
];

const PROBLEM_SHORTCUTS = [
  { label: "Gaz Sancısı", emoji: "🫧", href: "/destek/gaz-sancisi" },
  { label: "Kabızlık",    emoji: "🌿", href: "/destek/kabizlik"    },
  { label: "Diş Çıkarma", emoji: "🦷", href: "/destek/dis-cikarma" },
  { label: "Seçici Yeme", emoji: "🥦", href: "/destek/secici-yeme" },
];

export function AgeSelectorSection({
  ageRecipes,
}: {
  ageRecipes: Record<string, RecipeRow[]>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedGroup = AGE_GROUPS.find((g) => g.id === selectedId);
  const recipes = selectedId ? (ageRecipes[selectedId] ?? []) : [];

  return (
    <section className="bg-secondary/20 border-b border-border">
      <div className="container mx-auto px-4 max-w-3xl py-8 sm:py-10">
        <div className="text-center mb-5">
          <h1 className="font-heading font-extrabold leading-tight inline-flex flex-wrap justify-center gap-x-3">
            <span className="text-2xl sm:text-4xl" style={{ color: "#2D1810" }}>Bebekler Tok,</span>
            <span className="text-2xl sm:text-4xl" style={{ color: "#EA353B" }}>Anneler Mutlu.</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-4">
            🍼 Bebeğin kaç aylık?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AGE_GROUPS.map((group) => {
            const active = selectedId === group.id;
            return (
              <button
                key={group.id}
                onClick={() => setSelectedId(active ? null : group.id)}
                className={[
                  "rounded-2xl px-3 py-4 text-center transition-all duration-200 active:scale-95 border-2 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  active
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-card border-border hover:border-primary/60 hover:shadow-md",
                ].join(" ")}
              >
                <span className="font-heading font-extrabold text-base sm:text-lg block leading-none">
                  {group.label}
                </span>
                <span
                  className={[
                    "text-[0.7rem] mt-1.5 block leading-none",
                    active ? "text-white/70" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {group.sub}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {PROBLEM_SHORTCUTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {s.emoji} {s.label}
            </Link>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedId && recipes.length > 0 && (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="container mx-auto px-4 max-w-6xl pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-lg">
                  {selectedGroup?.label} tarifleri
                </h2>
                {selectedGroup && (
                  <Link
                    href={selectedGroup.href}
                    className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Tümünü gör <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
