import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { UtensilsCrossed, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Seçici Yeme Nedir? Çocuğum Neden Yemiyor? — Tok Bebek",
  description: "Neofobia ve seçici yeme davranışı olan çocuklar için beslenme rehberi. Bilimsel destekli stratejiler ve aile dostu tarifler.",
  keywords: ["seçici yeme", "çocuk yemek yemiyor", "bebek iştahsızlığı", "neofobia bebek"],
  alternates: { canonical: "https://tokbebek.com.tr/destek/secici-yeme" },
};

async function SeciciYemeRecipes() {
  const { recipes } = await getRecipes({ sort: "newest" }, 1, 8);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const REASONS = [
  {
    title: "Neofobia (Yeni Besin Korkusu)",
    desc: "Yeni ve tanımadık besinlere karşı duyulan doğal korku. Evrimsel bir savunma mekanizmasıdır; atalarımızın zehirli bitkilerden korunmasına yardımcı olmuştur.",
  },
  {
    title: "Duyu Hassasiyeti",
    desc: "Yiyeceğin dokusu, kokusu, rengi veya sesi bazı çocuklarda aşırı duyusal uyarıma neden olabilir. Bu çocuklar için yemek gerçekten stresli bir deneyim olabilir.",
  },
  {
    title: "Kontrol İhtiyacı",
    desc: "Toddler döneminde (1-3 yaş) çocuklar özerkliklerini keşfeder. Yemeyi reddetmek, kontrol edebildikleri az sayıda alandan biridir — bu gelişimsel açıdan normaldir.",
  },
  {
    title: "Baskı Etkisi",
    desc: "Zorlandıkça direnç artar. Araştırmalar, baskıcı beslenme ortamlarının uzun vadede yemek yeme sorunlarını artırdığını göstermektedir.",
  },
];

const STRATEGIES = [
  "Aynı yemeği 10-15 kez farklı şekillerde (buharda, fırında, çiğ, püreli) sunun — tekrar maruziyet kabul oranını artırır.",
  "Yeni besini çocuğun tabağına zorla koymak yerine, yanına veya aynı masaya koyun — baskısız tanışma fırsatı verin.",
  "Yeni besini tanıdık ve sevilen bir besinle eşleştirin. Sevdiği peynirle yan yana gelen brokoli daha az tehdit edici görünür.",
  "Çocuğu mutfağa dahil edin — malzemeleri yıkayan, karıştıran çocukların o yemeği yeme olasılığı çok daha yüksektir.",
  "Sofrayı stressiz tutun; yememesi için ne ceza verin ne de ödül kullanın. Ödül sistemi bile yemekle olumsuz ilişki kurabilir.",
];

export default function SeciciYemePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-rose-200/80 dark:border-rose-800/30 bg-gradient-to-b from-rose-50 to-transparent dark:from-rose-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "Seçici Yeme" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <UtensilsCrossed className="w-7 h-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Seçici Yeme</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  Neofobia (yeni besinlerden korku) 2-6 yaş arası çocukların %50'sinde görülür.
                  Bu gelişimsel açıdan normaldir; doğru yaklaşımla zamanla aşılabilir.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* Neden olur? */}
          <section>
            <SectionTitle label="Nedenler" title="Neden Olur?" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {REASONS.map((r) => (
                <div key={r.title} className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-rose-400 mt-2" />
                  <div>
                    <p className="font-semibold text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ne yapmalı? */}
          <section>
            <SectionTitle label="Stratejiler" title="Ne Yapmalı? — 5 Bilimsel İpucu" />
            <div className="mt-5 space-y-3">
              {STRATEGIES.map((s, i) => (
                <div key={i} className="flex gap-4 bg-card rounded-2xl border border-border p-5">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed self-center">{s}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bilimsel not */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 flex gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Bilimsel Dayanak: </span>
              Neofobia (yeni besinlerden korkma) gelişimin normal bir parçasıdır. Araştırmalar,
              bir besini 15-20'ye kadar maruziyet sonrasında çocukların %75'inin o besini
              kabul ettiğini göstermektedir.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="Çocuk Dostu Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <SeciciYemeRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/secici-yeme" />

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
