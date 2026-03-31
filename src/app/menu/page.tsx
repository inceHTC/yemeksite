import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MenuPlannerGrid } from "@/components/menu/menu-planner-grid";

export const metadata: Metadata = {
  title: "Haftalık Menü Planlayıcı — Tok Bebek",
  description: "Bebeğiniz için haftalık yemek menüsü oluşturun, alışveriş listesi otomatik hazırlansın.",
};

export default function MenuPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-24 sm:pb-12">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold">📅 Haftalık Menü</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Hücreye tıklayarak tarif ekleyin, alışveriş listesi otomatik oluşsun.
            </p>
          </div>
          <MenuPlannerGrid />
        </div>
      </main>
      <MobileNav />
    </>
  );
}
