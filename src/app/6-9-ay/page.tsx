import type { Metadata } from "next";
import { AgeLandingPage } from "@/components/recipe/age-landing";

export const metadata: Metadata = {
  title: "6-9 Aylık Bebek Yemekleri — Karışık Püreler ve Tahıllar",
  description: "6, 7 ve 8 aylık bebekler için tarif önerileri. Karışık püreler, yulaf lapası, protein kaynakları. WHO rehberine uygun beslenme.",
  keywords: ["6 aylık bebek yemekleri", "7 aylık bebek ne yer", "8 aylık bebek yemekleri", "bebek yulaf lapası", "bebek karışık püre"],
};

export default function SixToNinePage() {
  return (
    <AgeLandingPage
      ageMin={6}
      ageMax={9}
      emoji="🥕"
      title="6–9 Ay Bebek Yemekleri"
      subtitle="Karışık tatlar, tahıllar ve ilk protein kaynakları"
      description="Bu dönemde bebeğiniz artık birden fazla malzemeyi bir arada deneyebilir. Yulaf, mercimek ve hafif pişirilmiş etler menüye girebilir. Dokular hâlâ pürüzsüz olmalı, ancak yavaşça hafif pütürlüye geçiş başlayabilir."
      milestones={[
        "Desteksiz oturmaya başlar",
        "Parmak avucuyla tutma gelişir",
        "Yiyecekleri ağzında çiğneme hareketi yapar",
        "Farklı tatları ayırt etmeye başlar",
        "Kaşığı görünce heyecanlanır",
      ]}
      tips={[
        "Mercimek, nohut, bezelye gibi baklagillere başlayabilirsiniz",
        "Yulaf ezmesi mükemmel demir kaynağı — sabah kahvaltısı için ideal",
        "İyi pişirilmiş yumurta sarısı 6. aydan itibaren verilebilir",
        "Balık (somon, levrek) 7. aydan itibaren denenebilir",
        "Püreler tamamen pürüzsüz olmalı, parça kalmamalı",
        "Günde 2-3 öğün katı gıda + anne sütü/formula devam",
      ]}
    />
  );
}
