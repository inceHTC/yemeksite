import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export const metadata: Metadata = {
  title: "Hakkımızda — Tok Bebek",
  description: "Tok Bebek, Türkiye'nin bebek beslenmesi platformudur. WHO ve AAP verilerine dayalı, bilimsel ve lezzetli bebek tarifleri.",
};

const TEAM_VALUES = [
  {
    emoji: "🔬",
    title: "Bilimsel Temel",
    desc: "Tüm tariflerimizin WHO Pediatri araştırmalarına göre uyumlu olmasına dikkat ediyoruz.",
  },
  {
    emoji: "🥕",
    title: "Gerçek Malzemeler",
    desc: "Sadece taze, doğal ve erişilebilir malzemeler kullanıyoruz. Hazır gıda veya şeker içermeyen, ev yapımı tarifler.",
  },
  {
    emoji: "👶",
    title: "Bebeği Merkezde Tutmak",
    desc: "Her tarif bebeğin gelişim evresine, sindirim sistemine ve tat alma duyusuna göre tasarlanmıştır.",
  },
  {
    emoji: "👩‍👩‍👦",
    title: "Ebeveyn Deneyimi",
    desc: "Mutfakta bebek ağlarken bile kullanılabilecek basit, adım adım tarifler. Stressiz pişirme deneyimi.",
  },
];

const STATS = [
  { value: "100+", label: "Tarif" },
  { value: "4-36", label: "Aylık Bebek" },
  { value: "WHO/AAP", label: "Bilimsel Kaynak" },
  { value: "0", label: "Şeker/Katkı" },
];

export default function HakkimizdaPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-3xl space-y-12">

          {/* Hero */}
          <section className="text-center space-y-4">
            <div className="text-6xl">🌱</div>
            <h1 className="font-heading text-4xl font-bold">Tok Bebek Hakkında</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Türkiye'nin en kapsamlı bebek beslenmesi platformu olma yolunda, bilim ve sevgiyle hazırlanmış tarifler sunuyoruz.
            </p>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-3xl p-4 text-center shadow-soft">
                <p className="font-heading text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Hikaye */}
          <section className="space-y-4">
            <h2 className="font-heading text-2xl font-bold">Hikayemiz</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            
              <p>
                 <strong>Tok Bebek</strong> olarak, WHO (Dünya Sağlık Örgütü) ve AAP (Amerikan Pediatri Akademisi) rehberlerini inceledik,
                onlarca araştırma okuduk ve sonunda Türk ailelerin mutfak kültürüne uygun,
                bilimsel temelli tarifler hazırladık.
              </p>
              <p>
                Hedefimiz basit: Her Türk bebeği, yaşına uygun, besleyici ve lezzetli yemekler yiyebilsin.
                Her ebeveyn, "acaba zararlı mı?" kaygısı olmadan güvenle pişirebilsin.
              </p>
            </div>
          </section>

          {/* Değerler */}
          <section>
            <h2 className="font-heading text-2xl font-bold mb-6">Değerlerimiz</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEAM_VALUES.map((v) => (
                <div key={v.title} className="bg-card border border-border rounded-3xl p-5 shadow-soft">
                  <span className="text-3xl">{v.emoji}</span>
                  <h3 className="font-heading font-bold mt-3 mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-5">
            <h3 className="font-heading font-bold mb-2">⚠️ Tıbbi Uyarı</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tok Bebek, tıbbi tavsiye vermez. Paylaşılan içerikler bilgilendirme amaçlıdır ve doktor
              tavsiyesinin yerini tutmaz. Bebeğinizin beslenmesiyle ilgili tüm kararlar için pediatristinize
              danışmanızı öneririz.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center space-y-4">
            <p className="font-heading font-bold text-lg">Bebeğiniz için en iyi tarifi bulun</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/tarifler"
                className="rounded-full bg-primary text-white px-8 py-3 font-semibold hover:bg-primary/90 transition-colors"
              >
                Tarifleri Gözat
              </Link>
              <Link
                href="/destek"
                className="rounded-full border border-border bg-card px-8 py-3 font-semibold hover:bg-muted transition-colors"
              >
                Çözüm Merkezi
              </Link>
            </div>
          </section>

        </div>
      </main>
      <MobileNav />
    </>
  );
}
