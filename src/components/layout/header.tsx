"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, BookOpen, CalendarDays, LifeBuoy, Baby, UserCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BabyChip } from "./baby-chip";
import { UserMenu } from "@/components/auth/user-menu";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const AGE_GROUPS = [
  { href: "/4-6-ay",   label: "4–6 Ay",   desc: "İlk kaşık deneyimleri",  emoji: "🌱", color: "text-emerald-600 dark:text-emerald-400" },
  { href: "/6-9-ay",   label: "6–9 Ay",   desc: "Püreli & ezme tarifler", emoji: "🥕", color: "text-orange-500 dark:text-orange-400" },
  { href: "/9-12-ay",  label: "9–12 Ay",  desc: "Parçalı yemeklere geçiş", emoji: "🍲", color: "text-amber-600 dark:text-amber-400" },
  { href: "/12-24-ay", label: "12–24 Ay", desc: "Aile sofrası uyarlamaları", emoji: "🍽️", color: "text-sky-600 dark:text-sky-400" },
  { href: "/24-36-ay", label: "24–36 Ay", desc: "Bağımsız yeme becerileri", emoji: "🧑‍🍳", color: "text-violet-600 dark:text-violet-400" },
];

const MAIN_LINKS = [
  { href: "/menu",    label: "HAFTALIK MENÜ",   icon: CalendarDays,  variant: "amber" as const },
  { href: "/destek",  label: "ÇÖZÜM MERKEZİ",   icon: LifeBuoy,      variant: "default" as const },
  { href: "/akademi", label: "DERGİ - Makaleler", icon: BookOpen,     variant: "primary" as const },
  { href: "/profil",  label: "BEBEK PROFİLİ",   icon: UserCircle,    variant: "default" as const },
];

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Tok Bebek - Ana Sayfa">
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
      <div className="flex items-baseline leading-none">
        <span className="font-heading font-extrabold text-[1.7rem] tracking-tight"
          style={{ color: "#007a3f", textShadow: "0 1px 0 #006535, 0 2px 0 #00502a, 0 3px 0 #003d20, 0 4px 8px rgba(0,0,0,0.25)" }}>Tok</span>
        <span className="font-heading font-extrabold text-[1.7rem] tracking-tight"
          style={{ color: "#1c1c1c", textShadow: "0 1px 0 #666, 0 2px 0 #555, 0 3px 8px rgba(0,0,0,0.2)" }}>Bebek</span>
      </div>
    </Link>
  );
}

function AgeDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all",
          open
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:text-foreground hover:bg-muted"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Baby className="w-4 h-4" />
        YAŞ GRUPLARI
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            onMouseLeave={() => setOpen(false)}
            className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-border bg-card shadow-lg shadow-black/8 overflow-hidden z-50"
          >
            <div className="p-1.5">
              {AGE_GROUPS.map((group) => (
                <Link
                  key={group.href}
                  href={group.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors group"
                >
                  <span className="text-xl leading-none">{group.emoji}</span>
                  <div className="flex flex-col min-w-0">
                    <span className={cn("text-sm font-semibold leading-tight", group.color)}>{group.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 leading-tight">{group.desc}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t border-border px-3 py-2.5 bg-muted/30">
              <Link
                href="/tarifler"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Tüm tariflere göz at →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileAgeOpen, setMobileAgeOpen] = useState(false);
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
      {/* Marquee banner */}
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

      {/* Main header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md shadow-soft">
        <div className="w-full px-4 xl:px-8">
          <div className="flex h-[66px] items-center gap-4">

            {/* Logo */}
            <BrandLogo />

            {/* Divider */}
            <div className="hidden lg:block w-px h-7 bg-border mx-1" />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              <AgeDropdown />

              <div className="w-px h-5 bg-border mx-1" />

              {MAIN_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                      link.variant === "primary"
                        ? "text-primary hover:bg-primary/10"
                        : link.variant === "amber"
                        ? "text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search — desktop */}
              <Link
                href="/ara"
                className="hidden lg:flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 hover:bg-muted hover:border-primary/30 transition-all px-3.5 py-2 text-sm text-foreground/40 hover:text-foreground/70 w-44"
              >
                <Search className="w-4 h-4 shrink-0 text-primary/60" />
                <span>Tarif ara…</span>
              </Link>

              <BabyChip />

              {/* User menu — desktop */}
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

              {/* Hamburger */}
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

        {/* Mobile menu */}
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
              <div className="px-4 py-3 space-y-1">

                {/* Yaş grupları — accordion */}
                <div>
                  <button
                    onClick={() => setMobileAgeOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Baby className="w-4 h-4 text-primary" />
                      Yaş Grupları
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", mobileAgeOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {mobileAgeOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pr-2 pb-1 space-y-0.5">
                          {AGE_GROUPS.map((group) => (
                            <Link
                              key={group.href}
                              href={group.href}
                              onClick={() => { setMenuOpen(false); setMobileAgeOpen(false); }}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
                            >
                              <span className="text-lg leading-none">{group.emoji}</span>
                              <div>
                                <div className={cn("text-sm font-semibold leading-tight", group.color)}>{group.label}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{group.desc}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="h-px bg-border mx-2 my-1" />

                {/* Diğer linkler */}
                {MAIN_LINKS.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 + 0.05, duration: 0.16 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                          link.variant === "primary"
                            ? "text-primary hover:bg-primary/8"
                            : link.variant === "amber"
                            ? "text-amber-700 dark:text-amber-400 hover:bg-amber-500/8"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
