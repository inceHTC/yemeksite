import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Leaf, ChevronRight, BookOpen, AlertCircle, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Bebek Kabızlığına Ne İyi Gelir? — Kabızlık Önleyici Tarifler",
  description: '"P meyveleri", yüksek lifli tahıllar ve yoğurt ile bebek kabızlığına doğal çözümler. Erik, armut, şeftali tarifleri.',
  keywords: ["bebek kabızlığı", "bebek kabızlığına ne iyi gelir", "bebek kabızlık tarifi", "bebek erik püresi", "bebek bağırsak"],
};

async function KabizlikRecipes() {
  const { recipes } = await getRecipes({ healthTags: ["constipation"], sort: "newest" }, 1, 12);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const GOOD_FOODS = [
  "Erik ve kuru erik püresi",
  "Armut püresi",
  "Şeftali püresi",
  "Kivi püresi (12 ay+)",
  "Yulaf ezmesi",
  "Brokoli ve bezelye",
  "Tam tahıllı bebek tahılı",
  "Yoğurt (probiyotik)",
];

const BAD_FOODS = [
  "Olgunlaşmamış muz",
  "Pirinç bazlı tahıl (fazla)",
  "Peynir (fazla miktarda)",
  "Pişmiş havuç (fazla)",
  "Elma sosu (az lifli)",
  "Rafine un ürünleri",
];

export default function KabizlikPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-emerald-200/60 dark:border-emerald-800/30 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "Kabızlık" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Bebek Kabızlığı</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  Tamamlayıcı besine geçişte sık görülen kabızlık için "P meyveleri" olarak bilinen
                  erik, armut ve şeftali doğal laksatif etkisiyle bağırsak hareketlerini düzenler.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* İyi / Kötü besinler */}
          <section>
            <SectionTitle label="Besin Rehberi" title="Ne Yedireli, Ne Yedirmeyelim?" />
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {/* İyi */}
              <div className="bg-card border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">Kabızlığa İyi Gelen</p>
                <ul className="space-y-2">
                  {GOOD_FOODS.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kötü */}
              <div className="bg-card border border-rose-200/60 dark:border-rose-800/40 rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-4">Kabızlığı Artırabilecek</p>
                <ul className="space-y-2">
                  {BAD_FOODS.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                        <X className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Sıvı notu */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 flex gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Sıvı Alımı: </span>
              Bebeğinizin yeterli sıvı alması kabızlık için kritiktir. 6 aydan büyük bebeklere
              öğün aralarında az miktarda su verilebilir. 3 günden uzun süren kabızlıkta
              mutlaka çocuk doktoruna başvurun.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="Kabızlık Önleyici Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <KabizlikRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/kabizlik" />

        </div>
      </main>
      <MobileNav />
    </>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-0.5">{label}</p>
        <h2 className="font-heading text-xl font-bold">{title}</h2>
      </div>
      <div className="flex-1 border-t border-border/50" />
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
      <AlertCircle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">Önemli not: </span>
        Bu sayfadaki bilgiler genel beslenme rehberi niteliğinde olup tıbbi tavsiye değildir.
        Bebeğinizin sağlık sorunları için mutlaka çocuk doktorunuza danışın.
      </p>
    </div>
  );
}

const ALL_SOLUTIONS = [
  { href: "/destek/gaz-sancisi", label: "Gaz Sancısı" },
  { href: "/destek/dis-cikarma", label: "Diş Çıkarma" },
  { href: "/destek/kabizlik", label: "Kabızlık" },
  { href: "/destek/secici-yeme", label: "Seçici Yeme" },
  { href: "/destek/bagisiklik", label: "Bağışıklık" },
  { href: "/destek/demir-eksikligi", label: "Demir Eksikliği" },
  { href: "/destek/ishal", label: "İshal" },
  { href: "/destek/reflu", label: "Reflü" },
  { href: "/destek/ates", label: "Ateş" },
];

function OtherSolutions({ current }: { current: string }) {
  const others = ALL_SOLUTIONS.filter((s) => s.href !== current);
  return (
    <div className="border-t border-border pt-8">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 mb-4">Diğer Çözümler</p>
      <div className="flex flex-wrap gap-3">
        {others.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-2 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all px-4 py-2.5 text-sm font-medium text-foreground/70"
          >
            {s.label}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
