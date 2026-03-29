import type { Metadata } from "next";
import { AgeLandingPage } from "@/components/recipe/age-landing";

export const metadata: Metadata = {
  title: "12-24 Aylık Bebek Yemekleri — Aile Sofrasına Geçiş",
  description: "12, 15, 18 ve 24 aylık bebekler için tarif önerileri. Aile yemeğine uyarlama, renkli tabaklar ve sağlıklı atıştırmalıklar.",
  keywords: ["12 aylık bebek yemekleri", "1 yaş bebek ne yer", "18 aylık bebek yemekleri", "2 yaş bebek yemekleri", "aile sofrasına geçiş"],
};

export default function TwelveToTwentyFourPage() {
  return (
    <AgeLandingPage
      ageMin={12}
      ageMax={24}
      emoji="🍽️"
      title="12–24 Ay Bebek Yemekleri"
      subtitle="Aile sofrasına geçiş, renkli tabaklar ve bağımsız yeme"
      description="Bebeğiniz artık bir yaşında! Bu dönemde aile yemeklerini tuz ve şeker eklemeden uyarlayabilirsiniz. Bağımsız yeme isteği güçlenir, parmak yiyecekler ve kaşık kullanımı desteklenmelidir."
      milestones={[
        "Aile sofrasında oturarak yemek yiyebilir",
        "Kaşık kullanmayı öğrenmeye başlar",
        "200–250 ml inek sütü günlük tüketime eklenebilir",
        "Çiğneme becerileri gelişmiştir",
        "Besin seçiciliği (picky eating) bu dönemde başlayabilir",
      ]}
      tips={[
        "Aile yemeklerini pişirmeden önce bebeğin payını ayırın, sonra tuzlayın",
        "Renkli sebze ve meyvelerle tabağı görsel açıdan çekici yapın",
        "Küçük atıştırmalıklar (meyve dilimleri, peynir küpleri) sunun",
        "Yemek reddetme normaldir — zorlamayın, tekrar sunun",
        "Su içmeyi alışkanlık haline getirin",
        "Çorba, sebzeli pilav, makarna artık serbestçe verilebilir",
      ]}
    />
  );
}
