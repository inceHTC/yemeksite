import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Calendar, Heart, LogOut, ChevronRight, Baby } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export const metadata: Metadata = { title: "Profilim" };

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris?redirect=/profil");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Kullanıcı";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedAt = new Date(user.created_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="flex-1 pb-24 sm:pb-10">
        <div className="container mx-auto px-4 max-w-xl py-8 space-y-4">

          {/* Avatar + isim kartı */}
          <div className="bg-card rounded-3xl border border-border shadow-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/12 text-primary font-extrabold text-xl font-heading shrink-0 shadow-warm">
                {initials}
              </div>
              <div className="min-w-0">
                <h1 className="font-heading text-lg font-bold truncate">{displayName}</h1>
                <p className="text-muted-foreground text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Hesap bilgileri */}
          <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
            <div className="px-5 py-3 border-b border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hesap Bilgileri</p>
            </div>
            <div className="divide-y divide-border/60">
              <div className="flex items-center gap-3 px-5 py-4">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">Ad Soyad</span>
                <span className="ml-auto text-sm font-medium truncate max-w-[160px]">{displayName}</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">E-posta</span>
                <span className="ml-auto text-sm font-medium truncate max-w-[160px]">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">Üyelik Tarihi</span>
                <span className="ml-auto text-sm font-medium">{joinedAt}</span>
              </div>
            </div>
          </div>

          {/* Hızlı linkler */}
          <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
            <div className="px-5 py-3 border-b border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hesabım</p>
            </div>
            <div className="divide-y divide-border/60">
              <Link
                href="/favorilerim"
                className="flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors"
              >
                <Heart className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium">Favori Tariflerim</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </Link>
              <Link
                href="/basla"
                className="flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors"
              >
                <Baby className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium">Bebek Profilim</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
              </Link>
            </div>
          </div>

          {/* Çıkış yap */}
          <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-5 py-4 text-destructive hover:bg-destructive/6 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Çıkış Yap</span>
              </button>
            </form>
          </div>

        </div>
      </main>
      <MobileNav />
    </>
  );
}
