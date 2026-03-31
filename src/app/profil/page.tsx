import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ProfilContent } from "./profil-content";

export const metadata: Metadata = {
  title: "Bebek Profili — Tok Bebek",
};

export default function ProfilPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pb-24 sm:pb-12">
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <ProfilContent />
        </div>
      </main>
      <MobileNav />
    </>
  );
}
