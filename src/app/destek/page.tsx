import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ArrowRight, Wind, Snowflake, Leaf, UtensilsCrossed, Shield, Droplets, Thermometer, Flame, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Bebek Çözüm Merkezi — Gaz, Diş, Kabızlık, Seçici Yeme ve Daha Fazlası",
  description: "Bebeğinizin gaz sancısı, diş çıkarma, kabızlık, seçici yeme, reflü ve demir eksikliği sorunlarına doğal ve bilimsel çözümler.",
};

const SOLUTIONS = [
  {
    href: "/destek/gaz-sancisi",
    icon: Wind,
    label: "Gaz Sancısı",
    description: "Kolik, şişkinlik ve gaz kramplarını azaltan rezene, kimyon içerikli tarifler ile masaj teknikleri.",
    tags: ["Kolik", "Şişkinlik", "Masaj"],
  },
  {
    href: "/destek/dis-cikarma",
    icon: Snowflake,
    label: "Diş Çıkarma",
    description: "Hassas diş etlerini rahatlatan soğuk püreler, dondurulmuş meyve parmakları ve yumuşak tarifler.",
    tags: ["Soğuk Püreler", "Meyve Bezi", "Yumuşak Dokular"],
  },
  {
    href: "/destek/kabizlik",
    icon: Leaf,
    label: "Kabızlık",
    description: "\"P meyveleri\", yüksek lifli tahıllar ve probiyotiklerle düzenli sindirim için doğal çözümler.",
    tags: ["Erik & Armut", "Yüksek Lif", "Probiyotik"],
  },
  {
    href: "/destek/secici-yeme",
    icon: UtensilsCrossed,
    label: "Seçici Yeme",
    description: "Yeni yiyeceklerden kaçınan, sofradan kalkan çocuklar için baskısız, oyunlu sunum stratejileri.",
    tags: ["Neofobia", "Baskısız Sunum", "Sofra Düzeni"],
  },
  {
    href: "/destek/bagisiklik",
    icon: Shield,
    label: "Bağışıklık Güçlendirme",
    description: "Çinko, C vitamini ve probiyotik açısından zengin, bağışıklık sistemini destekleyen tarifler.",
    tags: ["Çinko", "C Vitamini", "Probiyotik"],
  },
  {
    href: "/destek/demir-eksikligi",
    icon: Droplets,
    label: "Demir Eksikliği",
    description: "Bebeklik anemisini önleyen demir açısından zengin tarifler ve emilimi artıran C vitamini kombinasyonları.",
    tags: ["Kırmızı Et", "Mercimek", "C Vitamini ile"],
  },
  {
    href: "/destek/ishal",
    icon: Thermometer,
    label: "İshal",
    description: "Sindirim sistemini yatıştıran BRAT diyeti temelli tarifler ve sıvı-elektrolit dengesini koruyan çözümler.",
    tags: ["BRAT Diyeti", "Elektrolit Dengesi", "Yumuşak Besinler"],
  },
  {
    href: "/destek/reflu",
    icon: ArrowRight,
    label: "Reflü",
    description: "Gastroözofajeal reflüyü hafifleten küçük porsiyonlu, kıvamlı tarifler ve doğru besleme pozisyonları.",
    tags: ["Küçük Porsiyon", "Kıvamlı Püreler", "Beslenme Pozisyonu"],
  },
  {
    href: "/destek/ates",
    icon: Flame,
    label: "Ateş",
    description: "Ateşli dönemde iştahı açık tutan, bağışıklığı destekleyen sıvı ağırlıklı tarifler ve beslenme önerileri.",
    tags: ["Sıvı Takviyesi", "Hafif Besinler", "Bağışıklık Desteği"],
  },
];

export default function DestekPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Çözüm Merkezi</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Bebeğinizin zor anlarında<br />
              <span className="text-primary">doğru tarif, hemen yanınızda.</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed">
              Gaz sancısından seçici yemeye, demir eksikliğinden reflüye — her soruna özel,
              bilimsel temelli tarifler ve pratik ipuçları.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-4xl">

          <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-card">
            {SOLUTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="group flex items-center gap-5 px-6 py-5 hover:bg-muted/40 transition-colors"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary w-[18px] h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-sm text-foreground mb-0.5">{s.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">{s.description}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                    {s.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="shrink-0 w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-2" />
                </Link>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-2xl border border-border p-5 mt-6">
            <ShieldCheck className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Önemli not: </span>
              Bu sayfadaki bilgiler genel beslenme rehberi niteliğinde olup tıbbi tavsiye değildir.
              Bebeğinizin sağlık sorunları için mutlaka çocuk doktorunuza danışın.
            </p>
          </div>

        </div>
      </main>
      <MobileNav />
    </>
  );
}
