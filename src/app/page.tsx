import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, Leaf, ShieldCheck, FlaskConical } from "lucide-react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";


export const metadata: Metadata = {
  title: "Tok Bebek — Bebek Yemekleri Tarifleri",
  description:
    "4–36 aylık bebekler için bilimsel ve lezzetli yemek tarifleri. Püre, çorba, kahvaltı ve daha fazlası. WHO & AAP verilerine dayalı güvenli tarifler.",
};

const SPECIAL_CATEGORIES = [
  { href: "/tarifler?health=gas_friendly", label: "Gaz Dostu", desc: "Kolik ve gaz sorunlarında", emoji: "💨", color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40 hover:border-amber-300 dark:hover:border-amber-700" },
  { href: "/tarifler?health=constipation", label: "Kabızlık Önleyici", desc: "Lifli ve yumuşatıcı", emoji: "🌿", color: "bg-green-50 dark:bg-green-950/30 border-green-200/60 dark:border-green-800/40 hover:border-green-300 dark:hover:border-green-700" },
  { href: "/tarifler?freezable=true", label: "Dondurun & Saklayın", desc: "Toplu pişirme tarifleri", emoji: "❄️", color: "bg-sky-50 dark:bg-sky-950/30 border-sky-200/60 dark:border-sky-800/40 hover:border-sky-300 dark:hover:border-sky-700" },
  { href: "/tarifler?meal=breakfast", label: "Bebek Kahvaltıları", desc: "Güne güzel başlayın", emoji: "☀️", color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200/60 dark:border-orange-800/40 hover:border-orange-300 dark:hover:border-orange-700" },
  { href: "/tarifler?diet=gluten_free", label: "Glutensiz Tarifler", desc: "Buğday ve gluten yok", emoji: "🌾", color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200/60 dark:border-yellow-800/40 hover:border-yellow-300 dark:hover:border-yellow-700" },
  { href: "/tarifler?diet=dairy_free", label: "Sütsüz Tarifler", desc: "Süt alerjisi olanlar için", emoji: "🥛", color: "bg-violet-50 dark:bg-violet-950/30 border-violet-200/60 dark:border-violet-800/40 hover:border-violet-300 dark:hover:border-violet-700" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "WHO & AAP Onaylı", desc: "Beslenme rehberlerine uygun" },
  { icon: FlaskConical, label: "Bilimsel Temelli", desc: "Harvard araştırmalarına dayalı" },
  { icon: Leaf, label: "Doğal İçerikler", desc: "İşlenmiş gıda, şeker, tuz yok" },
];

async function FeaturedRecipes() {
  const { recipes } = await getRecipes({ sort: "newest" }, 1, 6);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {recipes.map((recipe: RecipeRow) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

async function MealSection({ mealType }: { mealType: string }) {
  const { recipes } = await getRecipes({ mealType } as Parameters<typeof getRecipes>[0], 1, 4);
  if (!recipes.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {recipes.map((recipe: RecipeRow) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* ═══ HERO ═══ */}
        <section className="relative w-full overflow-hidden" style={{ aspectRatio: "16/7", minHeight: 320, maxHeight: 600 }}>
          {/* Placeholder arka plan — hero.png gelene kadar */}
          <div className="absolute inset-0 bg-gradient-to-br from-honey/50 via-secondary/50 to-primary/20 flex items-center justify-center">
            <span className="text-8xl opacity-25">🥣</span>
          </div>

          {/* Görsel */}
          <Image
            src="/hero.png"
            alt="Tok Bebek — Sağlıklı bebek yemekleri"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          {/* Ortadan karartma — bebeklerin arasındaki alana odaklı */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/60 sm:bg-gradient-to-r sm:from-transparent sm:via-black/55 sm:to-transparent" />

          {/* Başlık — üst orta */}
          <div className="absolute inset-x-0 top-0 flex justify-center pt-14 sm:pt-16 px-4">
            <div className="text-center max-w-md space-y-2 sm:space-y-3">
              <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Türkiye&apos;nin bebek beslenmesi platformu
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
                Bebeğiniz için{" "}
                <span className="text-honey">mükemmel tarifler</span>
                <br />
                her zaman hazır
              </h1>
              <p className="text-white/80 text-sm leading-relaxed hidden sm:block drop-shadow">
                4–36 aylık bebekler için bilimsel temelli, lezzetli ve kolay tarifler.
              </p>
            </div>
          </div>

          {/* Butonlar — alt orta */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6 sm:pb-10 px-4">
            <div className="flex flex-wrap justify-center gap-2.5">
              <Link
                href="/tarifler"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-foreground px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold hover:bg-white/90 transition-all active:scale-95 shadow-lg"
              >
                Tarifleri Keşfet
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/basla"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold hover:bg-white/25 transition-all active:scale-95"
              >
                Bebeğime Özel
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-6xl space-y-16 py-10">

          {/* ═══ SON EKLENEN TARİFLER ═══ */}
          <section>
            <SectionHeader
              title="Son Eklenen Tarifler"
              subtitle="Bu hafta eklendi"
              href="/tarifler"
            />
            <div className="mt-6">
              <Suspense fallback={<GridSkeleton count={6} cols={3} />}>
                <FeaturedRecipes />
              </Suspense>
            </div>
          </section>

          {/* ═══ ÖZEL KOLEKSİYONLAR ═══ */}
          <section className="section-warm px-6 py-8 sm:px-8">
            <SectionHeader
              title="Özel Koleksiyonlar"
              subtitle="İhtiyaca göre düzenlenmiş"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
              {SPECIAL_CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`group flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200 shadow-soft hover:shadow-card hover:-translate-y-0.5 ${cat.color}`}
                >
                  <span className="text-2xl leading-none mt-0.5 shrink-0">{cat.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground leading-snug">{cat.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </section>

          {/* ═══ ÖĞÜN SEKSİYONLARI ═══ */}
          {[
            { mealType: "puree",     title: "Püre Tarifleri",    subtitle: "İlk ek gıdadan başlayın",      emoji: "🥣" },
            { mealType: "breakfast", title: "Kahvaltılar",       subtitle: "Güne güzel bir başlangıç",     emoji: "☀️" },
            { mealType: "lunch",     title: "Öğle Yemekleri",    subtitle: "Doyurucu ve besleyici",        emoji: "🍲" },
            { mealType: "snack",     title: "Ara Öğünler",       subtitle: "Küçük ama besleyici atıştırmalıklar", emoji: "🍎" },
            { mealType: "dinner",    title: "Akşam Yemekleri",   subtitle: "Günü tamamlayan hafif tarifler", emoji: "🌙" },
          ].map(({ mealType, title, subtitle, emoji }) => (
            <section key={mealType}>
              <SectionHeader
                title={`${emoji} ${title}`}
                subtitle={subtitle}
                href={`/tarifler?meal=${mealType}`}
              />
              <div className="mt-6">
                <Suspense fallback={<GridSkeleton count={4} cols={4} />}>
                  <MealSection mealType={mealType} />
                </Suspense>
              </div>
            </section>
          ))}

        

          {/* ═══ NEDEN TOK BEBEK ═══ */}
          <section className="relative overflow-hidden rounded-3xl bg-foreground text-background px-8 py-14 sm:py-20">
            {/* Dekoratif arka plan lekeleri */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-honey/15 blur-3xl" />

            <div className="relative max-w-4xl mx-auto">
              {/* Üst etiket */}
              <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-background/80">
                  Neden Tok Bebek?
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Tarif kitabından fazlası —<br />
                <span className="text-primary">bir anne rehberi.</span>
              </h2>
              <p className="text-background/60 text-sm sm:text-base max-w-xl mb-12 leading-relaxed">
                Bebeğiniz için ne pişireceğinizi öğrenir, neden pişirdiğinizi de anlarsınız.
                Yaşa göre tarifler ve bilimsel makaleler, tek platformda.
              </p>

              {/* İstatistikler */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                {[
                  { value: "100+", label: "Tarif" },
                  { value: "46",   label: "Dergi Makalesi" },
                  { value: "5",    label: "Yaş Grubu" },
                  { value: "≤30",  label: "Dakikada Hazır" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-heading text-4xl sm:text-5xl font-extrabold text-background leading-none">{stat.value}</p>
                    <p className="text-background/50 text-xs sm:text-sm mt-1 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Özellikler listesi */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: "🍽️", title: "Yaşa Göre Tarifler", desc: "4 aydan 3 yaşa kadar her döneme özel, bebeğinin hazır olduğu tarifler." },
                  { icon: "⏱️", title: "Hızlı & Kolay", desc: "Meşgul anneler için sade malzemeli, kısa sürede hazırlanan tarifler." },
                  { icon: "🥦", title: "Doğal Malzemeler", desc: "Tuz, şeker ve katkı maddesi olmadan, evdeki taze malzemelerle." },
                  { icon: "📖", title: "Tok Bebek Dergisi", desc: "Beslenme, gelişim, sağlık ve güvenlik üzerine WHO & AAP destekli makaleler." },
                ].map((f) => (
                  <div key={f.title} className="bg-background/8 rounded-2xl border border-background/10 p-5">
                    <span className="text-2xl mb-3 block">{f.icon}</span>
                    <p className="font-semibold text-sm text-background mb-1">{f.title}</p>
                    <p className="text-background/50 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tarifler"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-7 py-3 text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/30"
                >
                  Tarifleri Keşfet
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/akademi"
                  className="inline-flex items-center gap-2 rounded-full bg-background/10 border border-background/20 text-background px-7 py-3 text-sm font-semibold hover:bg-background/20 transition-all active:scale-95"
                >
                  Dergiye Git
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

       
        </div>
      </main>
      <MobileNav />
    </>
  );
}

/* ─── Yardımcı bileşenler ─── */

function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-2xl font-bold leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
        >
          Tümü <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

function GridSkeleton({ count, cols }: { count: number; cols: number }) {
  return (
    <div className={`grid grid-cols-2 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4"} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[3/4]" />
      ))}
    </div>
  );
}
