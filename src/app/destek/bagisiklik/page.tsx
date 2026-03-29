import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Shield, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Bebeğin Bağışıklığını Güçlendiren Tarifler — Tok Bebek",
  description: "İlk 3 yılda bağışıklık sistemini destekleyen besinler ve tarifler. Çinko, C vitamini, D vitamini ve probiyotik açısından zengin öneriler.",
  keywords: ["bebek bağışıklık güçlendirme", "çocuk bağışıklık tarifleri", "bebek probiyotik", "çocuk D vitamini"],
};

async function BagisiklikRecipes() {
  const { recipes } = await getRecipes({ healthTags: ["immunity"], sort: "newest" }, 1, 12);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const KEY_NUTRIENTS = [
  {
    name: "Çinko",
    note: "Bağışıklık hücrelerinin üretimi ve işlevi için kritik. En iyi kaynaklar: et, baklagiller, kabak çekirdeği.",
  },
  {
    name: "C Vitamini",
    note: "Antioksidan savunma ve beyaz kan hücresi üretimini destekler. En iyi kaynaklar: kivi, biber, brokoli.",
  },
  {
    name: "D Vitamini",
    note: "Bağışıklık düzenleyici etki. En iyi kaynaklar: yağlı balık, yumurta sarısı, güneş ışığı (kısa süreli).",
  },
  {
    name: "Probiyotik",
    note: "Bağırsak mikrobiyomunu dengeler; bağışıklığın %70'i bağırsakta üretilir. Kaynaklar: yoğurt, kefir, fermente besinler.",
  },
  {
    name: "Beta-Glukan",
    note: "Bağışıklık hücrelerini aktive eden polisakkarit. En iyi kaynaklar: yulaf, mantar (şitake, istiridye).",
  },
  {
    name: "Omega-3",
    note: "İltihaplanmayı düzenler, bağışıklık yanıtını dengeler. En iyi kaynaklar: somon, chia tohumu, ceviz.",
  },
];

const SEASONAL = [
  {
    season: "Kış Öncelikleri",
    note: "D vitamini ve çinko desteğine odaklanın. Kırmızı et, yumurta ve baklagil tüketimini artırın. Güneş ışığından yararlanma süresi azaldığından D vitamini takviyesi için pediatristinize danışın.",
    color: "violet",
  },
  {
    season: "İlkbahar / Yaz",
    note: "C vitamini ve fermente besinleri ön plana alın. Taze sebze ve meyvelerin bolluğundan yararlanın. Yoğurt ve kefir tüketimi için ideal mevsim.",
    color: "violet",
  },
];

export default function BagisiklikPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-violet-200/80 dark:border-violet-800/30 bg-gradient-to-b from-violet-50 to-transparent dark:from-violet-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "Bağışıklık" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Shield className="w-7 h-7 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Bağışıklık Desteği</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  İlk 3 yıl bağışıklık sisteminin şekillendiği kritik dönemdir. Çinko, C vitamini,
                  D vitamini ve probiyotikler bu süreçte anahtar rol oynar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* Anahtar besinler */}
          <section>
            <SectionTitle label="Besin Rehberi" title="Anahtar Besinler — 6 Kalkan" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {KEY_NUTRIENTS.map((n) => (
                <div key={n.name} className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-violet-400 mt-2" />
                  <div>
                    <p className="font-semibold text-sm">{n.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mevsimsel öneriler */}
          <section>
            <SectionTitle label="Mevsimsel Rehber" title="Mevsimsel Öneriler" />
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {SEASONAL.map((s) => (
                <div key={s.season} className="bg-card border border-violet-200/60 dark:border-violet-800/40 rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">{s.season}</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{s.note}</p>
                </div>
              ))}
            </div>
          </section>

          {/* WHO notu */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 flex gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">WHO Önerisi: </span>
              6 ay boyunca sadece anne sütü, ardından tamamlayıcı besinlerle desteklenen emzirme
              bağışıklık sistemini en güçlü şekilde destekler. Anne sütündeki antikorlar ve
              büyüme faktörleri bebeğin savunma mekanizmalarını aktive eder.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="Bağışıklık Destekleyici Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <BagisiklikRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/bagisiklik" />

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
