"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronRight, BookOpen, CalendarDays } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BabyChip } from "./baby-chip";
import { UserMenu } from "@/components/auth/user-menu";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/4-6-ay", label: "🌱 4–6 Ay" },
  { href: "/6-9-ay", label: "🥕 6–9 Ay" },
  { href: "/9-12-ay", label: "🍲 9–12 Ay" },
  { href: "/12-24-ay", label: "🍽️ 12–24 Ay" },
  { href: "/24-36-ay", label: "🧑‍🍳 24–36 Ay" },
  { href: "/menu", label: "Haftalık Menü" },
  { href: "/akademi", label: "DERGİ" },
  { href: "/destek", label: "Çözüm Merkezi" },
];

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Tok Bebek - Ana Sayfa">

      {/* Mark — orijinal */}
      <svg viewBox="0 0 44 44" fill="none" className="w-9 h-9 shrink-0" aria-hidden="true">
        <circle cx="22" cy="22" r="22" fill="#007a3f" />
        <circle cx="20" cy="22" r="13" fill="white" />
        <circle cx="14.5" cy="19" r="2" className="fill-primary" />
        <circle cx="23.5" cy="19" r="2" className="fill-primary" />
        <path d="M 14 24.5 Q 19 30 25 24.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" className="stroke-primary" />
        <ellipse cx="26" cy="27.5" rx="5.5" ry="3.2" className="fill-primary" />
        <ellipse cx="26" cy="27.5" rx="3.5" ry="1.8" fill="white" opacity="0.35" />
        <line x1="31" y1="26.5" x2="41" y2="22" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>

      {/* Wordmark — 3D kabartma */}
      <div className="flex items-baseline leading-none">
        <span
          className="font-heading font-extrabold text-4xl tracking-tight"
          style={{
            color: "#007a3f",
            textShadow: "0 1px 0 #006535, 0 2px 0 #00502a, 0 3px 0 #003d20, 0 4px 0 #002b16, 0 5px 0 #001a0d, 0 5px 12px rgba(0,0,0,0.35)",
          }}
        >Tok</span>
        <span
          className="font-heading font-extrabold text-4xl tracking-tight"
          style={{
            color: "#1c1c1c",
            textShadow: "0 1px 0 #666, 0 2px 0 #555, 0 3px 0 #444, 0 4px 0 #333, 0 4px 10px rgba(0,0,0,0.3)",
          }}
        >Bebek</span>
      </div>
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase as any)
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) setIsAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <div className="w-full overflow-hidden py-2" style={{ background: "linear-gradient(90deg, oklch(0.22 0.065 155) 0%, oklch(0.30 0.090 153) 45%, oklch(0.37 0.110 152) 100%)", color: "oklch(0.937 0.016 88)" }}>
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
                <span key={text} className="inline-flex items-center gap-2 mx-6 text-xs font-medium opacity-85 tracking-wide">
                  <span>{icon}</span>
                  <span>{text}</span>
                  <span className="ml-6 w-1 h-1 rounded-full bg-current opacity-30 inline-block" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md shadow-soft">
        <div className="w-full px-4 xl:px-8">
          <div className="relative flex h-[62px] items-center">
            {/* Sol — Logo */}
            <BrandLogo />

            {/* Orta — Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 mx-auto">
              {NAV_LINKS.map((link) =>
                link.href === "/akademi" ? (
                  <Link key={link.href} href={link.href}
                    className="ml-1 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 hover:border-primary/40 transition-all whitespace-nowrap">
                    <BookOpen className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                ) : link.href === "/menu" ? (
                  <Link key={link.href} href={link.href}
                    className="ml-1 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 transition-all whitespace-nowrap">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                ) : (
                  <Link key={link.href} href={link.href}
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-foreground/75 hover:text-foreground hover:bg-primary/8 transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Sağ — Arama + Bebek + Kullanıcı */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search bar — desktop */}
              <Link
                href="/ara"
                className="hidden lg:flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 hover:border-primary/30 active:bg-muted/20 active:scale-95 active:border-primary/20 transition-all px-3.5 py-2 text-sm text-foreground/40 hover:text-foreground/60 w-44"
              >
                <Search className="w-4 h-4 shrink-0 text-primary/70" />
                <span>Tarif ara…</span>
              </Link>

              <BabyChip />

              {/* User menu — desktop (sadece admin için) */}
              <div className="hidden lg:block">
                <UserMenu isAdmin={isAdmin} />
              </div>

              {/* Search icon — tablet */}
              <Link
                href="/ara"
                className="hidden md:flex lg:hidden items-center justify-center w-9 h-9 rounded-xl border border-border bg-muted/60 hover:bg-muted transition-colors"
                aria-label="Ara"
              >
                <Search className="w-4 h-4 text-primary/70" />
              </Link>

              {/* Search icon — mobile */}
              <Link
                href="/ara"
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-muted transition-colors"
                aria-label="Ara"
              >
                <Search className="w-[17px] h-[17px]" />
              </Link>

              {/* Hamburger — below lg */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={menuOpen}
                className={cn(
                  "lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-colors",
                  menuOpen ? "bg-muted" : "hover:bg-muted"
                )}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-[17px] h-[17px]" />
                    </motion.span>
                  ) : (
                    <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu className="w-[17px] h-[17px]" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden overflow-hidden border-t border-border bg-card/98 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 max-w-7xl py-3 space-y-0.5">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.18 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors",
                        link.href === "/akademi"
                          ? "bg-primary/8 text-primary font-bold hover:bg-primary/15 border border-primary/15"
                          : link.href === "/menu"
                          ? "bg-amber-500/8 text-amber-700 dark:text-amber-400 font-bold hover:bg-amber-500/15 border border-amber-500/15"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {link.href === "/akademi" && <BookOpen className="w-4 h-4" />}
                        {link.href === "/menu" && <CalendarDays className="w-4 h-4" />}
                        {link.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </motion.div>
                ))}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
