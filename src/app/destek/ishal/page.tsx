import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Thermometer, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Bebekte İshal: Ne Yedireyim? BRAT Diyeti Rehberi",
  description: "Bebekte ishal döneminde BRAT diyeti ve beslenme önerileri. Sıvı kaybını önleme ve sindirim sistemini yatıştıran tarifler.",
  keywords: ["bebekte ishal ne yedireyim", "bebek ishal tarifi", "BRAT diyeti bebek", "bebek ishal beslenme"],
};

async function IshalRecipes() {
  const { recipes } = await getRecipes({ texture: "smooth", sort: "newest" }, 1, 8);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const BRAT_DIET = [
  {
    letter: "B",
    food: "Muz (Banana)",
    desc: "Pektini bağırsakları yatıştırır ve stool kıvamını normalleştirir. Potasyum kaybını da karşılar — ishalin en büyük elektrolit riski.",
  },
  {
    letter: "R",
    food: "Pirinç (Rice)",
    desc: "Bağlayıcı etkisiyle bağırsak hareketlerini yavaşlatır, sindirim sistemini tahriş etmez. Püresi veya suyu verilebilir.",
  },
  {
    letter: "A",
    food: "Elma Sosu (Applesauce)",
    desc: "Pişirilmiş elmanın pektini stool kıvamını sertleştirir. Taze elma suyu değil, pişmiş püre tercih edilmeli.",
  },
  {
    letter: "T",
    food: "Tost (Toast, 10 ay+)",
    desc: "Yumuşak karbonhidrat kaynağı olarak mideyi rahatlatır. Tereyağı ve katkısız, sade olmalı.",
  },
];

const AVOID_FOODS = [
  "Yağlı ve kızartılmış besinler — sindirim sistemini zorlar",
  "Süt ürünleri — laktoz geçici intoleransı kötüleştirebilir",
  "Yüksek lifli sebzeler (bezelye, brokoli) — bağırsak hareketini artırır",
  "Meyve suları — yüksek şeker içeriği ishali kötüleştirir",
  "Bal — 1 yaş altı kesinlikle verilmez",
  "Baharatlı yiyecekler — bağırsak mukozasını tahriş eder",
];

export default function IshalPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-teal-200/80 dark:border-teal-800/30 bg-gradient-to-b from-teal-50 to-transparent dark:from-teal-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "İshal" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                <Thermometer className="w-7 h-7 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Bebekte İshal</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  İshalde öncelik sıvı kaybını önlemek ve sindirim sistemini yatıştırmaktır.
                  BRAT diyeti (Muz, Pirinç, Elma, Tost) bu dönemde altın standarttır.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* BRAT diyeti */}
          <section>
            <SectionTitle label="Beslenme Protokolü" title="BRAT Diyeti — 4 Temel Besin" />
            <div className="mt-5 space-y-3">
              {BRAT_DIET.map((item) => (
                <div key={item.letter} className="flex gap-4 bg-card rounded-2xl border border-border p-5">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-sm">
                    {item.letter}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.food}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Kaçınılacaklar */}
          <section>
            <SectionTitle label="Kaçınılacaklar" title="İshalde Verilmemesi Gereken Besinler" />
            <div className="mt-5 bg-card border border-border rounded-2xl p-5">
              <ul className="space-y-3">
                {AVOID_FOODS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Uyarı notu */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 flex gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Acil Durum Uyarısı: </span>
              24 saatten fazla süren, kanlı veya çok sık (günde 8+) ishal durumunda veya
              bebeğinizde dehidrasyon belirtileri varsa (ağlayamama, kuru ağız, 8 saatten uzun
              bez kurumu) acil doktora başvurun.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="İshalde Uygun Yumuşak Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <IshalRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/ishal" />

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
