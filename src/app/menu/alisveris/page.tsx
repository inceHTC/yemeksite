import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ShoppingListLoader } from "./shopping-list-loader";

export const metadata: Metadata = {
  title: "Alışveriş Listesi — Tok Bebek",
  description: "Haftalık menüden otomatik oluşturulan alışveriş listesi.",
};

export default function AlisverisPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-24 sm:pb-12">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold">🛒 Alışveriş Listesi</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Haftalık menüdeki tüm tariflerin malzemeleri birleştirildi.
            </p>
          </div>
          <ShoppingListLoader />
        </div>
      </main>
      <MobileNav />
    </>
  );
}
