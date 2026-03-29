import type { Metadata } from "next";
import { AgeLandingPage } from "@/components/recipe/age-landing";

export const metadata: Metadata = {
  title: "24-36 Aylık Bebek Yemekleri — Küçük Çocuk Beslenmesi",
  description: "2 ve 3 yaş çocuklar için tarif önerileri. Bağımsız yeme, sağlıklı atıştırmalıklar ve dengeli beslenme alışkanlıkları.",
  keywords: ["2 yaş çocuk yemekleri", "3 yaş çocuk ne yer", "küçük çocuk beslenmesi", "24 aylık bebek yemekleri", "36 aylık çocuk yemekleri"],
  alternates: { canonical: "https://tokbebek.com.tr/24-36-ay" },
};

export default function TwentyFourToThirtySixPage() {
  return (
    <AgeLandingPage
      ageMin={24}
      ageMax={36}
      emoji="🧑‍🍳"
      title="24–36 Ay Çocuk Yemekleri"
      subtitle="Bağımsız yeme, sağlıklı alışkanlıklar ve mutfak keşfi"
      description="Artık gerçek bir küçük çocuk! Bu dönemde beslenme alışkanlıklarının temeli atılır. Aile ile aynı yemekleri yiyebilir, yemek hazırlamaya küçük görevlerle dahil edilebilir. Çeşitlilik ve düzenlilik bu yaşın anahtarıdır."
      milestones={[
        "Kaşık ve çatalı bağımsız kullanabilir",
        "Günde 3 ana öğün + 2 ara öğün idealdir",
        "Besin gruplarının tamamından yiyebilir",
        "Yemek tercihlerini ifade edebilir",
        "Mutfakta basit görevlere yardım etmek ister",
      ]}
      tips={[
        "Yemekleri birlikte hazırlamak iştahı artırır",
        "Tabakta 3 farklı renk hedefleyin",
        "Tatlı isteğini meyve ile karşılayın",
        "Düzenli öğün saatleri güvenlik hissi verir",
        "Yeni besinleri 10–15 kez sunmak gerekebilir — sabırlı olun",
        "Fazla meyve suyu yerine su ve süt tercih edin",
      ]}
    />
  );
}
