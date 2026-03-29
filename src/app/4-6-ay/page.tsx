import type { Metadata } from "next";
import { AgeLandingPage } from "@/components/recipe/age-landing";

export const metadata: Metadata = {
  title: "4-6 Aylık Bebek Yemekleri — İlk Tamamlayıcı Besin Tarifleri",
  description: "4, 5 ve 6 aylık bebekler için ilk tamamlayıcı besin tarifleri. Tek malzemeli, pürüzsüz püreler. Elma, havuç, tatlı patates ve daha fazlası.",
  keywords: ["4 aylık bebek ne yer", "5 aylık bebek yemekleri", "6 aylık bebek yemekleri", "ilk tamamlayıcı besin", "bebek püresi tarifleri"],
  alternates: { canonical: "https://tokbebek.com.tr/4-6-ay" },
};

export default function FourToSixPage() {
  return (
    <AgeLandingPage
      ageMin={4}
      ageMax={6}
      emoji="🌱"
      title="4–6 Ay Bebek Yemekleri"
      subtitle="İlk tamamlayıcı besine adım: Tek malzemeli, pürüzsüz püreler"
      description="4. ay ile birlikte anne sütü veya formülaya ek olarak tamamlayıcı besine başlayabilirsiniz. Bu dönemde amaç bebeğin yeni tatlarla tanışması. Her yeni besin 3-5 gün aralıkla verilmeli, alerji belirtileri takip edilmelidir."
      milestones={[
        "Baş tutma kontrolü gelişmiştir",
        "Dil-itme refleksi azalmıştır",
        "Kaşıkla beslenmeye hazırdır",
        "Yeni tatları merakla karşılar",
        "Oturur pozisyonda destekle durabilir",
      ]}
      tips={[
        "İlk püreler oda sıcaklığında veya hafif ılık verilmeli",
        "Günde 1-2 kaşık ile başlayın, yavaşça artırın",
        "Her yeni besini 3-5 günde bir ekleyin (alerji takibi)",
        "Bal, tuz, şeker, inek sütü bu dönemde kesinlikle yasak",
        "Buharda pişirme besin değerlerini en iyi koruyan yöntemdir",
        "Kalan püreler buz kalıbına koyularak 1 ay dondurulabilir",
      ]}
    />
  );
}
