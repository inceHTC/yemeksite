import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchContent } from "@/components/search/search-content";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const metadata: Metadata = {
  title: "Tarif Ara",
  description: "Bebek tarifi arayın. Malzemeye, yaş grubuna veya duruma göre arama yapın.",
  robots: { index: false, follow: false },
};

export default function AraPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <Breadcrumb items={[{ label: "Tarif Ara" }]} />
          <Suspense>
            <SearchContent />
          </Suspense>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
