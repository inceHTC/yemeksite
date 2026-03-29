"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useBabyStore } from "@/store/baby-store";
import { BabyWelcomeCard } from "./baby-welcome-card";
import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/tarifler?meal=breakfast", label: "☀️ Kahvaltı", color: "bg-honey/30 hover:bg-honey/50 text-foreground" },
  { href: "/tarifler?meal=lunch", label: "🥣 Öğle", color: "bg-teal/20 hover:bg-teal/30 text-foreground" },
  { href: "/tarifler?freezable=true", label: "❄️ Dondurulabilir", color: "bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-foreground" },
  { href: "/destek", label: "🚨 Acil Çözüm", color: "bg-coral/10 hover:bg-coral/20 text-foreground" },
];

const features = [
  { emoji: "🎯", title: "Yaşa Özel Tarifler", description: "Bebeğinizin tam ayına göre filtrelenmiş, gelişim evresine uygun tarifler." },
  { emoji: "🔬", title: "Bilimsel Altyapı", description: "WHO, AAP ve Harvard beslenme araştırmalarına dayalı içerikler." },
  { emoji: "🚨", title: "Kriz Modu", description: "Gaz, diş, kabızlık anlarında anında yardımcı çözümler." },
  { emoji: "❄️", title: "Dondurulabilir Tarifler", description: "Haftalık toplu pişirme ve dondurma rehberleri." },
  { emoji: "👩‍🍳", title: "Mutfak Modu", description: "Ellerin kirli olduğu anlarda büyük yazı ve adım adım takip." },
  { emoji: "📅", title: "Menü Planlayıcı", description: "Haftalık menü oluşturun, alışveriş listesi otomatik hazır." },
];

export function HomeContent() {
  const { onboardingCompleted } = useBabyStore();

  if (onboardingCompleted) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
        {/* Kişiselleştirilmiş karşılama */}
        <BabyWelcomeCard />

        {/* Hızlı linkler */}
        <div>
          <h3 className="font-heading font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
            Hızlı Erişim
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-semibold transition-all",
                  link.color
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Tariflere git */}
        <Link
          href="/tarifler"
          className={cn(
            buttonVariants({ size: "lg" }),
            "w-full rounded-2xl text-base"
          )}
        >
          Tüm Tarifleri Gözat 🥣
        </Link>
      </div>
    );
  }

  // Onboarding yapılmamış — Landing page
  return (
    <div className="container mx-auto px-4">
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <span>🌱</span>
            <span>Türkiye&apos;nin en kapsamlı bebek beslenmesi platformu</span>
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Bebeğiniz için{" "}
            <span className="text-primary">mükemmel tarifler</span>
            {" "}her zaman hazır
          </h1>

          <p className="text-lg text-muted-foreground">
            Bebeğinizin tam yaşına, alerjilerine ve o anki ihtiyacına göre
            kişiselleştirilmiş, bilimsel temelli yemek tarifleri.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/basla"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full text-base")}
            >
              Bebeğimi Tanıt 👶
            </Link>
            <Link
              href="/tarifler"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full text-base")}
            >
              Tarifleri Gözat
            </Link>
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-3"
            >
              <span className="text-4xl">{feature.emoji}</span>
              <h3 className="font-heading text-lg font-bold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
