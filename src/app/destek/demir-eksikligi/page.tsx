import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Droplets, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Bebekte Demir Eksikliği: Belirtiler ve Demir Zengini Tarifler",
  description: "6-24 ay arası bebekler için demir eksikliği belirtileri ve demir açısından zengin tarifler. Hem ve non-hem demir kaynakları rehberi.",
  keywords: ["bebekte demir eksikliği", "bebek anemi", "demir zengini bebek yemeği", "bebek demir takviyesi"],
};

async function DemirRecipes() {
  const { recipes } = await getRecipes({ sort: "newest" }, 1, 8);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const SYMPTOMS = [
  {
    title: "Soluk Cilt ve Yorgunluk",
    desc: "Hemoglobin düşüklüğü nedeniyle cilt, dudaklar ve göz içleri normalden daha soluk görünür. Bebek çabuk yorulur, isteksiz olur.",
  },
  {
    title: "İştahsızlık ve Büyüme Yavaşlaması",
    desc: "Demir eksikliği iştahı doğrudan etkiler. Uzun süren eksiklik boy ve kilo artışını olumsuz etkileyebilir.",
  },
  {
    title: "Huzursuzluk ve Uyku Sorunları",
    desc: "Beyne yeterli oksijen taşınamaması irritabiliteye (aşırı sinirlilik) ve uyku düzensizliğine yol açabilir.",
  },
  {
    title: "Enfeksiyonlara Yatkınlık",
    desc: "Demir, bağışıklık hücrelerinin işlevi için gereklidir. Eksikliğinde çocuk daha sık hastalanabilir.",
  },
  {
    title: "Dikkat ve Öğrenme Güçlüğü",
    desc: "Erken dönem demir eksikliğinin bilişsel gelişimi ve dikkat kapasitesini olumsuz etkilediği araştırmalarla gösterilmiştir.",
  },
];

const HEM_IRON = [
  "Kırmızı et (dana, kuzu) — en yüksek biyoyararlanım",
  "Tavuk eti, özellikle koyu et",
  "Balık (ton, somon, sardalya)",
  "Yumurta sarısı (6 ay+)",
];

const NON_HEM_IRON = [
  "Mercimek — bebek çorbası ve püresi için ideal",
  "Ispanak ve koyu yeşil yapraklılar",
  "Brokoli — C vitaminiyle birlikte verin",
  "Baklagiller: nohut, fasulye, bezelye",
];

export default function DemirEksikligiPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-orange-200/80 dark:border-orange-800/30 bg-gradient-to-b from-orange-50 to-transparent dark:from-orange-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "Demir Eksikliği" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <Droplets className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Demir Eksikliği</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  6-24 ay arası bebekler demir eksikliği anemisi açısından en riskli gruptur.
                  Anne sütü demir içerse de emilimi düşük olduğundan tamamlayıcı besine geçişte
                  demir önceliği kritiktir.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* Belirtiler */}
          <section>
            <SectionTitle label="Tanıma Rehberi" title="Belirtiler — 5 Uyarı İşareti" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {SYMPTOMS.map((s) => (
                <div key={s.title} className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4">
                  <span className="shrink-0 w-2 h-2 rounded-full bg-orange-400 mt-2" />
                  <div>
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hem ve Non-Hem Demir */}
          <section>
            <SectionTitle label="Besin Rehberi" title="Hem ve Non-Hem Demir Kaynakları" />
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="bg-card border border-orange-200/60 dark:border-orange-800/40 rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-4">
                  Hem Demir — Hayvansal (Daha Kolay Emilir)
                </p>
                <ul className="space-y-2">
                  {HEM_IRON.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-orange-200/60 dark:border-orange-800/40 rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-4">
                  Non-Hem Demir — Bitkisel (C Vitamini ile Birlikte)
                </p>
                <ul className="space-y-2">
                  {NON_HEM_IRON.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Bilimsel not */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 flex gap-3">
            <BookOpen className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Emilimi Artırmanın Sırrı: </span>
              C vitamini non-hem demirin emilimini 3 kat artırır. Mercimek çorbasına limon sıkın,
              ıspanak püresiyle birlikte portakal suyu verin. Çay, kahve ve fazla miktarda inek
              sütü ise demir emilimini engeller — öğün sırasında kaçının.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="Demir Zengini Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <DemirRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/demir-eksikligi" />

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
