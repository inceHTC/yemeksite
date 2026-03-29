import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — Tok Bebek",
  description: "Tok Bebek platformu kullanım koşulları.",
};

export default function KullanimKosullariPage() {
  const lastUpdated = "2026-03-25";

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="font-heading text-3xl font-bold mb-2">Kullanım Koşulları</h1>
          <p className="text-muted-foreground text-sm mb-8">Son güncelleme: {lastUpdated}</p>

          <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">1. Kabul</h2>
              <p>
                Tok Bebek (tokbebek.com.tr) web sitesini kullanarak bu kullanım koşullarını
                kabul etmiş olursunuz.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">2. Hizmet Tanımı</h2>
              <p>
                Tok Bebek, 4–36 aylık bebekler için yemek tarifleri ve beslenme bilgisi sunan
                bir içerik platformudur. Sunulan içerikler bilgilendirme amaçlıdır.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">3. Tıbbi Uyarı</h2>
              <p>
                <strong className="text-foreground">Bu site tıbbi tavsiye vermez.</strong>{" "}
                Paylaşılan tarif ve beslenme bilgileri genel rehber niteliğindedir.
                Bebeğinizin sağlığına ilişkin tüm kararlar için bir pediatrist veya
                sağlık profesyoneliyle görüşünüz. Bebeğinizde herhangi bir alerji,
                gelişim endişesi veya sağlık sorunu varsa özellikle uzman görüşü alınız.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">4. Fikri Mülkiyet</h2>
              <p>
                Sitedeki tüm içerik (tarifler, görseller, metinler) Tok Bebek'a aittir ve
                telif hakkıyla korunmaktadır. Ticari amaçla kopyalanamaz, dağıtılamaz.
                Kişisel kullanım ve paylaşım amacıyla kaynak göstererek kullanılabilir.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">5. Sorumluluk Sınırlaması</h2>
              <p>
                Tok Bebek, sitedeki bilgilerin doğruluğu konusunda makul çaba göstermekle birlikte
                içeriklerin eksiksizliğini veya tamlığını garanti etmez. Site içeriğinin
                kullanımından doğan herhangi bir zarardan sorumlu tutulamaz.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">6. Değişiklikler</h2>
              <p>
                Bu koşulları önceden bildirimde bulunmaksızın güncelleme hakkını saklı tutarız.
                Güncel versiyon her zaman bu sayfada yayınlanır.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">7. İletişim</h2>
              <p>
                Sorularınız için:{" "}
                <a href="mailto:tokbebek.com.tr" className="text-primary hover:underline">
                  tokbebekiletisim@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
