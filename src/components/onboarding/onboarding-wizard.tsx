"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { computeAge } from "@/lib/age";
import { motion, AnimatePresence } from "framer-motion";
import { useBabyStore, type Allergen } from "@/store/baby-store";
import { StepName } from "./step-name";
import { StepBirthDate } from "./step-birthdate";
import { StepAllergies } from "./step-allergies";
import { StepComplete } from "./step-complete";

export type OnboardingData = {
  name: string;
  birthDate: string;
  gender: "girl" | "boy";
  allergies: Allergen[];
};

const TOTAL_STEPS = 3;

export function OnboardingWizard() {
  const router = useRouter();
  const { setBaby, completeOnboarding } = useBabyStore();

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    birthDate: "",
    gender: "girl", // default değişti
    allergies: [],
  });

  function updateData(partial: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function finish() {
    setBaby({
      name: data.name,
      birthDate: data.birthDate,
      gender: data.gender,
      allergies: data.allergies,
    });
    setDone(true);

    const stageRoutes: Record<string, string> = {
      "newborn":     "/tarifler",
      "first-foods": "/4-6-ay",
      "explorer":    "/6-9-ay",
      "adventurer":  "/9-12-ay",
      "toddler-1":   "/12-24-ay",
      "toddler-2":   "/12-24-ay",
      "toddler-3":   "/24-36-ay",
    };
    const age = computeAge(data.birthDate);
    const dest = age ? (stageRoutes[age.stage] ?? "/tarifler") : "/tarifler";
    setTimeout(() => {
      completeOnboarding();
      router.push(dest);
    }, 2500);
  }

  if (done) {
    return <StepComplete name={data.name} birthDate={data.birthDate} />;
  }

  return (
    <div className="w-full max-w-lg">
      {/* Başlık */}
      <div className="text-center mb-8">
        <a href="/" className="inline-block font-heading text-3xl font-bold text-primary mb-2">
          Bebek<span className="text-foreground">Tok</span>
        </a>
        <p className="text-muted-foreground text-sm">Kişisel bebek profili oluştur</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full overflow-hidden bg-border"
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: step > i ? "100%" : step === i + 1 ? "50%" : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>

      {/* Adım içeriği */}
      <div className="bg-card rounded-3xl border border-border shadow-card p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <StepName
                value={data.name}
                gender={data.gender}
                onChange={(name, gender) => updateData({ name, gender })}
                onNext={next}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <StepBirthDate
                value={data.birthDate}
                onChange={(birthDate) => updateData({ birthDate })}
                onNext={next}
                onBack={back}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <StepAllergies
                value={data.allergies}
                onChange={(allergies) => updateData({ allergies })}
                onFinish={finish}
                onBack={back}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Adım göstergesi */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Adım {step} / {TOTAL_STEPS}
      </p>
    </div>
  );
}