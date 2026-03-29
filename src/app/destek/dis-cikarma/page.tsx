import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Snowflake, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Diş Çıkaran Bebek İçin Tarifler — Serinletici ve Yumuşak Yemekler",
  description: "Diş çıkarma döneminde bebeğinizin rahatsızlığını azaltacak soğuk ve yumuşak tarifler. Dondurulmuş meyve bezi ve serinletici püreler.",
  keywords: ["diş çıkaran bebek yemekleri", "diş çıkarma beslenmesi", "bebek diş ağrısı ne iyi gelir", "serinletici bebek yemeği"],
};

async function DisRecipes() {
  const { recipes } = await getRecipes({ healthTags: ["teething"], sort: "newest" }, 1, 8);
  const { recipes: softRecipes } = await getRecipes({ texture: "smooth", sort: "newest" }, 1, 8);
  const recipeIds = new Set(recipes.map((r: RecipeRow) => r.id));
  const all = [...recipes, ...softRecipes.filter((r: RecipeRow) => !recipeIds.has(r.id))].slice(0, 12);
  if (!all.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {all.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const TECHNIQUES = [
  {
    title: "Soğut",
    desc: "Püresi veya meyveyi 15 dk dondurucuda soğutun. Soğuk diş etini uyuşturarak acıyı geçici olarak azaltır.",
  },
  {
    title: "Yumuşat",
    desc: "Daha uzun pişirme süreleriyle tamamen yumuşak doku elde edin. Sert yiyecekler hassas diş etlerini tahriş eder.",
  },
  {
    title: "Ağ Beze Koy",
    desc: "Meyveyi bebek ağ bezine koyarak hem beslenme hem ısırma fırsatı sağlayın. 6 ay+ ve her zaman gözetim altında.",
  },
];

const BEST_FOODS = [
  { name: "Soğutulmuş muz püresi", note: "Hızlı hazırlanır, yumuşak doku" },
  { name: "Soğuk avokado püresi", note: "Kremsi yapı, diş eti dostu" },
  { name: "Dondurulmuş meyve bezi", note: "Çilek, muz, kavun kombinasyonu" },
  { name: "Soğuk yoğurt (8 ay+)", note: "Serin, yatıştırıcı, probiyotik" },
  { name: "Serinletici karpuz püresi", note: "Yüksek su içeriği, hafif soğutulmuş" },
  { name: "Soğuk elma-armut püresi", note: "Hafif kıvam, serinletici etki" },
];

export default function DisCikarmaPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-blue-200/60 dark:border-blue-800/30 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "Diş Çıkarma" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Snowflake className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Diş Çıkarma Dönemi</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  Soğuk yiyecekler diş etini geçici olarak uyuşturur, yumuşak dokular hassasiyeti en aza indirir.
                  Doğru tariflerle bu dönemi daha az ağrılı geçirebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* 3 teknik */}
          <section>
            <SectionTitle label="Temel Yöntemler" title="3 Altın Kural" />
            <div className="mt-5 grid sm:grid-cols-3 gap-4">
              {TECHNIQUES.map((t, i) => (
                <div key={t.title} className="bg-card border border-border rounded-2xl p-5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm mb-3">
                    {i + 1}
                  </div>
                  <p className="font-semibold text-sm mb-1.5">{t.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* En iyi besinler */}
          <section>
            <SectionTitle label="Besin Rehberi" title="Diş Çıkarma Döneminde En İyi 6 Besin" />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BEST_FOODS.map((f) => (
                <div key={f.name} className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2" />
                  <div>
                    <p className="font-semibold text-sm">{f.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pratik ipucu */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 flex gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Pratik İpucu — Dondurulmuş Meyve Bezi: </span>
              Taze meyve parçalarını (muz, çilek, kavun) bebek ağ bezine koyun ve dondurucuda soğutun.
              Bebeğiniz hem meyvenin tadını çıkarır hem de soğuğun rahatlığını hisseder.
              6 ay ve üzeri, her zaman gözetim altında kullanın.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="Diş Çıkarma Dönemine Uygun Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <DisRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/dis-cikarma" />

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
