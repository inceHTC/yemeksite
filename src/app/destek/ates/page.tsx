import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Flame, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Ateşli Bebekte Beslenme: Ne Yedireyim, Ne İçireyim?",
  description: "Ateşli bebekte sıvı kaybını önleme ve bağışıklığı destekleyen beslenme rehberi. Komposto, çorba ve yumuşak tarifler.",
  keywords: ["ateşli bebek ne yedireyim", "bebek ateş beslenme", "çocuk ateş ne iyi gelir", "bebek ateş sıvı"],
  alternates: { canonical: "https://tokbebek.com.tr/destek/ates" },
};

async function AtesRecipes() {
  const { recipes } = await getRecipes({ sort: "newest" }, 1, 8);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const FLUID_SOURCES = [
  {
    title: "Anne Sütü",
    desc: "Ateş döneminde en değerli sıvı kaynağıdır. Antikorlar içerir ve enfeksiyonla doğrudan savaşır. Emzirme sıklığını artırın.",
  },
  {
    title: "Su (6 ay+)",
    desc: "Küçük yudumlarla ve sık sık verin. Büyük miktarlar mideyi rahatsız edebilir — kaşık kaşık da olsa sürekli sıvı almak önemlidir.",
  },
  {
    title: "Komposto (Şekersiz)",
    desc: "Elma veya armut kompostosu hem sıvı hem elektrolit desteği sağlar. Şeker eklenmeden, hafifçe pişirilerek hazırlanmalı.",
  },
  {
    title: "Çorba Suyu",
    desc: "Sebze veya tavuk suyu mineral ve sıvı takviyesi sağlar. Tuz içermemeli veya çok az tuz olmalı. Ilık servis edin.",
  },
];

const TIPS = [
  "Yemeyi reddederse zorlamayın — ateş döneminde iştahsızlık normaldir ve geçicidir.",
  "Favori ve bilinen besinleri sunun; ateşliyken yeni besinler denemeyin.",
  "Soğuk püreler ve serin yoğurt hem rahatlık hem besin sağlar.",
  "Küçük porsiyonlar, sık aralıklarla sunun — büyük öğünler mideyi yorar.",
  "Ateş düşünce iştah kendiliğinden açılır; acele etmeyin.",
];

export default function AtesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-red-200/80 dark:border-red-800/30 bg-gradient-to-b from-red-50 to-transparent dark:from-red-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "Ateş" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <Flame className="w-7 h-7 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Ateşli Bebekte Beslenme</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  Ateş bağışıklık sisteminin enfeksiyonla savaştığının işaretidir. Bu dönemde
                  beslenme hedefi: sıvı kaybını önlemek, enerji sağlamak ve bağışıklığı
                  desteklemektir.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* Öncelik: Sıvı */}
          <section>
            <SectionTitle label="Öncelik" title="Sıvı Kaynakları — 4 Temel Seçenek" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {FLUID_SOURCES.map((f) => (
                <div key={f.title} className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-red-400 mt-2" />
                  <div>
                    <p className="font-semibold text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Yemeyi reddederse */}
          <section>
            <SectionTitle label="Pratik Rehber" title="Yemeyi Reddederse Ne Yapmalı?" />
            <div className="mt-5 bg-card border border-border rounded-2xl p-5">
              <ul className="space-y-3">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="shrink-0 w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed self-center">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Acil uyarı */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 flex gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Acil Durum Sınırları: </span>
              3 aydan küçük bebekte 38°C ve üzeri, 3-6 ay arasında 39°C ve üzeri ateş acil tıbbi
              durumudur. Hemen doktora başvurun. Bu sayfa genel beslenme rehberi olup tıbbi
              tavsiye değildir.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="Ateş Döneminde Uygun Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <AtesRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/ates" />

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
