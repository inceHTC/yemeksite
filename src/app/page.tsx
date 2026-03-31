import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, Leaf, ShieldCheck, FlaskConical, BookOpen, Clock } from "lucide-react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipes, type RecipeRow } from "@/lib/supabase/recipes";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types/supabase";


export const metadata: Metadata = {
  title: "Tok Bebek — Bebek Yemekleri Tarifleri",
  description:
    "4–36 aylık bebekler için bilimsel ve lezzetli yemek tarifleri. Püre, çorba, kahvaltı ve daha fazlası. WHO & AAP verilerine dayalı güvenli tarifler.",
  alternates: { canonical: "https://tokbebek.com.tr" },
  openGraph: {
    title: "Tok Bebek — Bebek Yemekleri Tarifleri",
    description: "4–36 aylık bebekler için bilimsel ve lezzetli yemek tarifleri. Püre, çorba, kahvaltı ve daha fazlası.",
    url: "https://tokbebek.com.tr",
    type: "website",
    locale: "tr_TR",
    siteName: "Tok Bebek",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Tok Bebek — Bebek Yemekleri Tarifleri" }],
  },
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

async function FeaturedArticles() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(4);
  const articles: Article[] = data ?? [];
  if (!articles.length) return null;

  const CATEGORY_LABEL: Record<string, string> = {
    nutrition: "Beslenme",
    development: "Gelişim",
    health: "Sağlık",
    safety: "Güvenlik",
  };
  // Koyu zemine uyumlu, yeşilsiz renkler
  const CATEGORY_COLOR: Record<string, string> = {
    nutrition: "bg-sky-400/20 text-sky-300",
    development: "bg-violet-400/20 text-violet-300",
    health: "bg-rose-400/20 text-rose-300",
    safety: "bg-amber-400/20 text-amber-300",
  };

  const [featured, ...rest] = articles;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Featured — büyük kart */}
      <Link href={`/akademi/${featured.slug}`} className="group lg:col-span-3 block">
        <article className="h-full rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-400/40 hover:-translate-y-0.5 transition-all duration-200 bg-white/5 flex flex-col">
          <div className="relative aspect-[16/9] bg-white/10 overflow-hidden flex-shrink-0">
            {featured.image_url ? (
              <Image src={featured.image_url} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="w-10 h-10 text-white/20" /></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1524]/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLOR[featured.category] ?? "bg-white/15 text-white/80"}`}>
                {CATEGORY_LABEL[featured.category] ?? featured.category}
              </span>
            </div>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-heading font-bold text-base sm:text-lg mb-2 text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">{featured.title}</h3>
            <p className="text-sm text-white/65 line-clamp-2 leading-relaxed flex-1">{featured.excerpt}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <Clock className="w-3 h-3" />{featured.reading_time_min} dk okuma
              </span>
              <span className="text-xs text-indigo-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Oku →</span>
            </div>
          </div>
        </article>
      </Link>

      {/* Yan kartlar */}
      <div className="lg:col-span-2 flex flex-col gap-3">
        {rest.map((article) => (
          <Link key={article.id} href={`/akademi/${article.slug}`} className="group block flex-1">
            <article className="h-full rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-400/40 hover:-translate-y-0.5 transition-all duration-200 bg-white/5 flex gap-3 p-3">
              <div className="relative w-20 sm:w-24 flex-shrink-0 rounded-xl overflow-hidden bg-white/10">
                {article.image_url ? (
                  <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="w-5 h-5 text-white/20" /></div>
                )}
              </div>
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full w-fit mb-1.5 ${CATEGORY_COLOR[article.category] ?? "bg-white/10 text-white/70"}`}>
                  {CATEGORY_LABEL[article.category] ?? article.category}
                </span>
                <h3 className="font-heading font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">{article.title}</h3>
                <div className="flex items-center gap-1 mt-1.5 text-xs text-white/50">
                  <Clock className="w-3 h-3" />{article.reading_time_min} dk
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
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

          {/* Alt karartma — sadece butonlar için */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

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

        {/* ═══ KAYAN ŞERİT ═══ */}
        <div className="bg-foreground/90 py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center shrink-0">
                {[
                  { icon: "🌿", text: "Allerji dostu tarifler" },
                  { icon: "👶", text: "4–36 ay bebek beslenmesi" },
                  { icon: "🥗", text: "Sağlıklı & güvenli tarifler" },
                  { icon: "💛", text: "Anne & bebek dostu" },
                  { icon: "❄️", text: "Dondurulabilir tarifler" },
                  { icon: "🌾", text: "Glutensiz seçenekler" },
                  { icon: "📅", text: "Haftalık menü planlayıcı" },
                  { icon: "📖", text: "Tok Bebek Dergisi" },
                  { icon: "✨", text: "Uzman onaylı içerikler" },
                  { icon: "🍼", text: "Bebeğine özel öneriler" },
                  { icon: "🚨", text: "Çözüm Merkezi — Gaz, kabızlık, seçici yeme" },
                  { icon: "🧠", text: "Beslenme rehberleri & uzman içerikler" },
                  { icon: "📸", text: "Instagram'da takip et — @tok_bebek" },
                ].map(({ icon, text }) => (
                  <span key={text} className="inline-flex items-center gap-2 mx-6 text-xs font-medium text-background/75 tracking-wide">
                    <span>{icon}</span>
                    <span>{text}</span>
                    <span className="ml-6 w-1 h-1 rounded-full bg-background/25 inline-block" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

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

        

          {/* ═══ DERGİ & MAKALELER ═══ */}
          <section className="relative overflow-hidden rounded-3xl bg-[#0f1524] px-6 py-10 sm:px-10 sm:py-12">
            {/* Dekoratif blur lekeleri */}
            <div className="pointer-events-none absolute -top-20 -left-10 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl" />

            {/* Masthead */}
            <div className="relative flex items-start justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
                  </div>
                 
                </div>
                <h2 className="font-heading text-white text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
                  Anne &amp; Bebek <span className="text-indigo-300">Akademisi</span>
                </h2>
                <p className="text-white/55 text-sm mt-1.5">
                  WHO &amp; AAP destekli bilimsel rehber makaleler
                </p>
              </div>
              <Link
                href="/akademi"
                className="shrink-0 flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-all px-4 py-2 text-xs font-semibold text-indigo-300/80 hover:text-indigo-200"
              >
                Tümünü Gör <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Makaleler */}
            <div className="relative">
              <Suspense fallback={
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-3 rounded-2xl bg-white/5 animate-pulse aspect-video" />
                  <div className="lg:col-span-2 flex flex-col gap-4">
                    {[0,1,2].map(i => <div key={i} className="rounded-2xl bg-white/5 animate-pulse h-24" />)}
                  </div>
                </div>
              }>
                <FeaturedArticles />
              </Suspense>
            </div>
          </section>

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

          {/* ═══ INSTAGRAM CTA ═══ */}
          <section className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-px">
            <div className="rounded-3xl bg-background px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-lg leading-tight">Instagram&apos;da bizi takip edin</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Yeni tarifler, bebek beslenmesi ipuçları ve daha fazlası</p>
                </div>
              </div>
              <a
                href="https://www.instagram.com/tok_bebek"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all active:scale-95 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @tok_bebek
              </a>
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
