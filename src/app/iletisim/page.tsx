import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ContactForm } from "./contact-form";
import Link from "next/link";
import { Mail, MessageSquare, BookOpen, UtensilsCrossed, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim — Tok Bebek",
  description: "Tok Bebek ile iletişime geçin. Öneri, geri bildirim ve işbirliği için bize ulaşın.",
};

const TOPICS = [
  {
    icon: UtensilsCrossed,
    title: "Tarif Önerisi",
    desc: "Eklemememizi istediğiniz bir tarif mi var? Mutfak denemelerinizi paylaşın.",
  },
  {
    icon: BookOpen,
    title: "İçerik Geri Bildirimi",
    desc: "Bir makalede hata mı gördünüz ya da eklememizi istediğiniz bir konu mu var?",
  },
  {
    icon: MessageSquare,
    title: "Genel Görüş",
    desc: "Uygulama deneyiminiz, tasarım veya kullanılabilirlik hakkında fikrinizi paylaşın.",
  },
  {
    icon: ShieldCheck,
    title: "İşbirliği & Medya",
    desc: "Marka işbirliği, basın veya içerik ortaklığı için iletişime geçin.",
  },
];

export default function IletisimPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">

        {/* Hero */}
        <div className="border-b border-border bg-muted/20">
          <div className="container mx-auto px-4 py-12 max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">İletişim</p>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight mb-3">
              Merhaba, size nasıl<br />
              <span className="text-primary">yardımcı olabiliriz?</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed">
              Her türlü öneri, geri bildirim ve soru için bize ulaşabilirsiniz.
              En kısa sürede dönüş yapmaya çalışıyoruz.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Sol — Form */}
            <div>
              <h2 className="font-heading text-xl font-bold mb-6">Mesaj Gönderin</h2>
              <ContactForm />
            </div>

            {/* Sağ — Konu kartları + e-posta */}
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold mb-4">Ne hakkında yazabilirsiniz?</h2>
                <div className="space-y-3">
                  {TOPICS.map((t) => {
                    const Icon = t.icon;
                    return (
                      <div key={t.title} className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4">
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{t.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{t.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direkt e-posta */}
              <div className="rounded-2xl border border-border bg-muted/30 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">Direkt İletişim</p>
                <a href="mailto:tokbebekiletisim@gmail.com" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm  group-hover:text-primary transition-colors">tokbebekiletisim@gmail.com</p>
                    <p className="text-xs text-muted-foreground">Genellikle 1–2 iş günü içinde yanıt</p>
                  </div>
                </a>
              </div>

              {/* Hızlı linkler */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">Hızlı Erişim</p>
                <div className="space-y-2">
                  {[
                    { href: "/hakkimizda", label: "Hakkımızda" },
                    { href: "/gizlilik", label: "Gizlilik Politikası" },
                    { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
                    { href: "/destek", label: "Çözüm Merkezi" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                    >
                      {link.label}
                      <span className="text-xs">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
