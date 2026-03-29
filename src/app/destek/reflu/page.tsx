import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { Activity, ChevronRight, BookOpen, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Bebek Reflüsü: Normal Tükürme mi, GÖR mu? Beslenme Rehberi",
  description: "Bebeklerde reflü ve gastroözofajeal reflü hastalığı (GÖRH) ayrımı. Reflüyü azaltan beslenme stratejileri ve yumuşak tarifler.",
  keywords: ["bebek reflüsü", "bebek geri kaçırma", "GÖR bebek beslenme", "bebek tükürme normal mi"],
};

async function RefluRecipes() {
  const { recipes } = await getRecipes({ texture: "smooth", sort: "newest" }, 1, 8);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {recipes.map((r: RecipeRow) => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}

const REFLUX_TYPES = [
  {
    type: "Normal Reflü",
    label: "Endişelenmeyin",
    points: [
      "Yemekten sonra tükürme veya hafif geri kaçırma",
      "Bebek mutlu ve huzurlu, kilo alımı normal",
      "Günde birkaç kez olabilir, özellikle emzirmeden sonra",
      "12-18 aylarda alt özofagus sfinkteri güçlendikçe kendiliğinden geçer",
    ],
    borderColor: "border-pink-200/60 dark:border-pink-800/40",
    labelColor: "text-pink-600 dark:text-pink-400",
  },
  {
    type: "GÖRH (Uzman Görüşü Gerekli)",
    label: "Doktora Başvurun",
    points: [
      "Ağırlık kaybı veya kilo almakta güçlük",
      "Sürekli ağlama ve açıklanamayan huzursuzluk",
      "Yemek reddi veya beslenme sırasında ağlama",
      "Tekrarlayan öksürük, hırıltı veya nefes güçlüğü",
    ],
    borderColor: "border-rose-200/60 dark:border-rose-800/40",
    labelColor: "text-rose-600 dark:text-rose-400",
  },
];

const STRATEGIES = [
  {
    tip: "Küçük ve Sık Öğünler",
    desc: "Mideyi aşırı doldurmayın — büyük hacimli öğünler reflüyü tetikler. Daha sık, daha az miktarda besleyin.",
  },
  {
    tip: "Yemekten Sonra Dik Tutun",
    desc: "Beslenmeden sonra 20-30 dakika dik pozisyonda tutun. Yerçekimi içeriklerin aşağıda kalmasını sağlar.",
  },
  {
    tip: "Kıvamlı Püreler Tercih Edin",
    desc: "Sıvı besinler daha kolay geri kaçar. Tamamlayıcı besinde kıvamlı ve püreli yiyecekler daha uygun seçimdir.",
  },
  {
    tip: "Asitli Besinleri Azaltın",
    desc: "Domates, turunçgil suları ve ekşi meyveler özofagusu tahriş edebilir. Bu dönemde daha az asitli alternatifleri tercih edin.",
  },
  {
    tip: "Anne Sütüne Devam Edin",
    desc: "Anne sütü en kolay sindirilen besindir. Mideyi daha az yükler ve reflü belirtilerini azaltmaya yardımcı olur.",
  },
];

export default function RefluPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-pink-200/80 dark:border-pink-800/30 bg-gradient-to-b from-pink-50 to-transparent dark:from-pink-950/20">
          <div className="container mx-auto px-4 pt-8 pb-10 max-w-4xl">
            <Breadcrumb items={[
              { label: "Çözüm Merkezi", href: "/destek" },
              { label: "Reflü" },
            ]} />
            <div className="flex items-start gap-4 mt-6">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center">
                <Activity className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-1">Çözüm Merkezi</p>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight">Bebek Reflüsü</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
                  Bebeklerin %50'sinde görülen tükürme çoğunlukla normaldir. Ancak ağırlık kaybı,
                  ağlama ve uyku sorunuyla birleşince Gastroözofajeal Reflü Hastalığı (GÖRH)
                  olabilir.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl space-y-12">

          {/* Normal mi, GÖRH mı? */}
          <section>
            <SectionTitle label="Ayırt Etme Rehberi" title="Normal Reflü mü, GÖRH mi?" />
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {REFLUX_TYPES.map((rt) => (
                <div key={rt.type} className={`bg-card border ${rt.borderColor} rounded-2xl p-5`}>
                  <p className={`text-xs font-bold uppercase tracking-widest ${rt.labelColor} mb-1`}>{rt.label}</p>
                  <p className="font-semibold text-sm mb-4">{rt.type}</p>
                  <ul className="space-y-2">
                    {rt.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-pink-400 mt-2" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Beslenme stratejileri */}
          <section>
            <SectionTitle label="Beslenme Stratejileri" title="Reflüyü Azaltan 5 Yöntem" />
            <div className="mt-5 space-y-3">
              {STRATEGIES.map((s, i) => (
                <div key={s.tip} className="flex gap-4 bg-card rounded-2xl border border-border p-5">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{s.tip}</p>
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
              <span className="font-semibold text-foreground">Doğal Seyir: </span>
              Çoğu bebek reflüsü 12-18. aylarda alt özofagus sfinkteri güçlendikçe kendiliğinden
              düzelir. İlaç tedavisi yalnızca GÖRH tanısı konulmuş vakalarda gereklidir;
              rutin tükürme için ilaç kullanımı önerilmez.
            </p>
          </div>

          {/* Tarifler */}
          <section>
            <SectionTitle label="Tarifler" title="Reflüye Uygun Yumuşak Tarifler" />
            <div className="mt-5">
              <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <RefluRecipes />
              </Suspense>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer />

          {/* Diğer çözümler */}
          <OtherSolutions current="/destek/reflu" />

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
