import type { Metadata } from "next";
import { AgeLandingPage } from "@/components/recipe/age-landing";

export const metadata: Metadata = {
  title: "9-12 Aylık Bebek Yemekleri — Parmak Yiyecekler ve Pütürlü Dokular",
  description: "9, 10 ve 11 aylık bebekler için tarif önerileri. Parmak yiyecekler, pütürlü dokuya geçiş, aile sofrasına hazırlık.",
  keywords: ["9 aylık bebek yemekleri", "10 aylık bebek ne yer", "11 aylık bebek yemekleri", "bebek parmak yiyecek", "BLW tarifleri", "9 ay bebek beslenmesi", "bebek kendi kendine yemek", "bebek led weaning türkçe", "bebek peynir verilir mi", "bebek yoğurt ne zaman"],
  alternates: { canonical: "https://tokbebek.com.tr/9-12-ay" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://tokbebek.com.tr" },
    { "@type": "ListItem", position: 2, name: "Tarifler", item: "https://tokbebek.com.tr/tarifler" },
    { "@type": "ListItem", position: 3, name: "9-12 Aylık Bebek Yemekleri", item: "https://tokbebek.com.tr/9-12-ay" },
  ],
};

export default function NineToTwelvePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <AgeLandingPage
      ageMin={9}
      ageMax={12}
      emoji="🍲"
      title="9–12 Ay Bebek Yemekleri"
      subtitle="Parmak yiyecekler, pütürlü dokular ve aile sofrasına geçiş"
      description="Büyük adımlar zamanı! Bebeğiniz artık küçük parçaları parmağıyla tutabilir. Pütürlü ve parçalı dokular menüye girmelidir. Bu dönem BLW (Baby Led Weaning) için de ideal bir başlangıçtır."
      milestones={[
        "Pincer grasp (baş-işaret parmağı tutma) gelişir",
        "Kendi kendine yemek isteme isteği artar",
        "Küçük yumuşak parçaları diş eti ile ezebilir",
        "Aile sofrasına ilgi duymaya başlar",
        "Bardaktan su içmeyi öğrenebilir",
      ]}
      tips={[
        "Yumuşak pişirilmiş sebze ve meyve parmaklıkları sunun",
        "Pişmiş makarna, pirinç ve mercimek artık verilebilinir",
        "Tam yağlı yoğurt ve peynir (tuzsuz) mönüye girer",
        "Balık hâlâ önemli — haftada 2 kez önerin",
        "Parçalar yutulabilir olmalı ama çiğnemeyi teşvik etmeli",
        "Alerjen besinler (yumurta, fıstık ezmesi) dikkatli tanıtın",
      ]}
    />
    </>
  );
}
