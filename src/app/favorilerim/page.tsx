import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { FavorilerContent } from "./favoriler-content";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const metadata: Metadata = {
  title: "Favori Tariflerim",
  description: "Kaydettiğiniz bebek yemekleri tarifleri.",
  robots: { index: false, follow: false },
};

export default function FavorilerimPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb items={[{ label: "Favori Tariflerim" }]} />
          <h1 className="font-heading text-2xl font-bold mb-6">Favori Tariflerim</h1>
          <FavorilerContent />
        </div>
      </main>
      <MobileNav />
    </>
  );
}
