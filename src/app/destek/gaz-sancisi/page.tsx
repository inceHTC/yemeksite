import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Wind, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Bebek Gaz Sancısına Ne İyi Gelir? — Gaz Dostu Tarifler",
  description: "Bebek gaz sancısını azaltan rezene, kimyon ve papatya içerikli tarifler. Gaz masajı adımları ve doğal çözümler.",
  keywords: ["bebek gaz sancısı", "bebek gazı nasıl geçer", "gaz dostu bebek yemekleri", "rezene bebek", "bebek gaz masajı"],
  alternates: { canonical: "https://tokbebek.com.tr/destek/gaz-sancisi" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Bebek gaz sancısına ne iyi gelir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bebek gaz sancısına rezene, kimyon ve papatya içerikli besinler iyi gelir. Bunların yanı sıra bisiklet hareketi ve saat yönünde karın masajı da etkili yöntemler arasındadır.",
      },
    },
    {
      "@type": "Question",
      name: "Bebek gazı nasıl çıkarılır?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bebek gazı için göbek çevresinden saat yönünde daireler çizerek 2-3 dakika karın masajı yapabilir, ardından bebeğin bacaklarını bisiklet çevirir gibi döngüsel hareket yaptırabilirsiniz.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi yaştan itibaren rezene bebeklere verilebilir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rezene 6. aydan itibaren az miktarda bebek yemeklerine eklenebilir. Antispazmodik özellikleriyle gaz kramplarını azaltmaya yardımcı olur.",
      },
    },
  ],
};

async function GazRecipes() {
  const { recipes } = await getRecipes({ healthTags: ["gas_friendly"], sort: "newest" }, 1, 12);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const MASSAGE_STEPS = [
  { step: 1, title: "Bisiklet Hareketi", desc: "Bebeğinizi sırt üstü yatırın. Bacaklarını nazikçe kavrayıp bisiklet çevirir gibi döngüsel hareket yaptırın. 10 tekrar." },
  { step: 2, title: "Karın Masajı", desc: "Göbek çevresinden saat yönünde daireler çizin. Baskı hafif olmalı. 2–3 dakika sürdürün." },
  { step: 3, title: "Diz-Karın Pozisyonu", desc: "Bebeğin dizlerini büküp karnına doğru bastırın, 10 saniye tutun, bırakın. 5–6 tekrar." },
  { step: 4, title: "Yüz Üstü Zaman", desc: "Bebeğin karnına hafif baskı yaparak yüzüstü pozisyonda tutun — her zaman gözetim altında. Doğal baskı gazı harekete geçirir." },
];

const KEY_FOODS = [
  { name: "Rezene", note: "Antispazmodik etki, gaz kramplarını azaltır" },
  { name: "Kimyon", note: "Bağırsak kaslarını gevşetir, şişkinliği önler" },
  { name: "Papatya", note: "Yatıştırıcı etki, sindirim sistemini sakinleştirir" },
  { name: "Zencefil", note: "Mide bulantısı ve gaz için (8 ay+, az miktarda)" },
];

export default function GazSancisiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-amber-200/60 dark:border-amber-800/30 bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "Gaz Sancısı" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Wind className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Bebek Gaz Sancısı</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  Rezene, kimyon ve papatya doğanın en güçlü gaz gidericileri arasında yer alır.
                  Masaj teknikleri ve doğru tariflerle bu zorlu anları hafifletebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* Anahtar besinler */}
          <section>
            <SectionTitle label="Etkili Besinler" title="Gaz Sancısını Azaltan 4 Besin" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {KEY_FOODS.map((f) => (
                <div key={f.name} className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-amber-400 mt-2" />
                  <div>
                    <p className="font-semibold text-sm">{f.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Masaj */}
          <section>
            <SectionTitle label="Masaj Rehberi" title="Gaz Masajı — 4 Adım" />
            <div className="mt-5 space-y-3">
              {MASSAGE_STEPS.map((s) => (
                <div key={s.step} className="flex gap-4 bg-card rounded-2xl border border-border p-5">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bilimsel not */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 flex gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Bilimsel Dayanak: </span>
              Rezene (Foeniculum vulgare) tohumları, antispazmodik ve karminatif özellikleriyle
              bebek kolik ve gaz şikayetlerinde geleneksel tıp ve bazı klinik çalışmalarda
              etkili bulunmuştur (Alexandrovich et al., 2003). Önerilen dozları aşmamaya dikkat edin.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="Gaz Dostu Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <GazRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/gaz-sancisi" />

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
