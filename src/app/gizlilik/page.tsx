import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Tok Bebek",
  description: "Tok Bebek gizlilik politikası ve KVKK aydınlatma metni.",
};

export default function GizlilikPage() {
  const lastUpdated = "2026-03-25";

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <h1 className="font-heading text-3xl font-bold mb-2">Gizlilik Politikası</h1>
          <p className="text-muted-foreground text-sm mb-8">Son güncelleme: {lastUpdated}</p>

          <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">1. Toplanan Veriler</h2>
              <p>
                Tok Bebek olarak yalnızca hizmetlerimizi sunmak için gerekli olan verileri topluyoruz:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>E-posta adresi (bülten aboneliği için, gönüllü)</li>
                <li>Bebek profili bilgileri (isim, doğum tarihi — yalnızca tarayıcınızda saklanır, sunucumuza gönderilmez)</li>
                <li>Favori tarifler (yalnızca tarayıcınızda saklanır)</li>
                <li>Anonim kullanım istatistikleri (sayfa görüntülenme sayısı)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">2. Verilerin Kullanımı</h2>
              <p>Toplanan veriler şu amaçlarla kullanılır:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Haftalık tarif bültenini göndermek (yalnızca e-posta aboneleri için)</li>
                <li>Siteyi geliştirmek için anonim istatistikler</li>
                <li>Teknik destek sağlamak</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">3. Verilerin Paylaşımı</h2>
              <p>
                Kişisel verilerinizi üçüncü taraflarla satmıyoruz, kiralamıyoruz veya
                ticari amaçla paylaşmıyoruz. Yalnızca aşağıdaki durumlarda paylaşım yapılabilir:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Yasal zorunluluk (mahkeme kararı vb.)</li>
                <li>E-posta gönderimi için Resend (e-posta altyapı sağlayıcısı)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">4. Çerezler (Cookies)</h2>
              <p>
                Tok Bebek yalnızca zorunlu teknik çerezler kullanmaktadır. Kullanıcı tercihlerini
                tarayıcının yerel depolamasında (localStorage) tutuyoruz; bu veriler sunucumuza iletilmez.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">5. KVKK Hakları</h2>
              <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında şu haklara sahipsiniz:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Kişisel verilerinize erişim hakkı</li>
                <li>Düzeltme ve silme hakkı</li>
                <li>İşlemenin kısıtlanmasını talep etme hakkı</li>
                <li>Bülten aboneliğinden çıkma hakkı (her e-postada "abonelikten çık" bağlantısı)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-foreground text-lg mb-2">6. İletişim</h2>
              <p>
                Gizlilik ile ilgili sorularınız için:{" "}
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
