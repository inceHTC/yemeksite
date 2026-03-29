import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Bebeğini Tanıt",
  description: "Bebeğinizin profilini oluşturun, yaşına özel tarifler keşfedin.",
};

export default function BaslaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4">
      <OnboardingWizard />
    </main>
  );
}
