import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Allergen =
  | "dairy"
  | "egg"
  | "gluten"
  | "nuts"
  | "fish"
  | "soy"
  | "sesame";

export type HealthMode = "normal" | "teething" | "gassy" | "picky";
export type FeedingType = "breast" | "formula" | "mixed" | null;

export interface BabyProfile {
  name: string;
  birthDate: string | null;
  gender: "girl" | "boy";
  allergies: Allergen[];
  notes: string;
  feedingType: FeedingType;
  parentName: string;
}

interface BabyStore {
  baby: BabyProfile;
  healthMode: HealthMode;
  onboardingCompleted: boolean;

  setBaby: (profile: Partial<BabyProfile>) => void;
  setHealthMode: (mode: HealthMode) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

const defaultBaby: BabyProfile = {
  name: "",
  birthDate: null,
  gender: "girl",
  allergies: [],
  notes: "",
  feedingType: null,
  parentName: "",
};

export const useBabyStore = create<BabyStore>()(
  persist(
    (set) => ({
      baby: defaultBaby,
      healthMode: "normal",
      onboardingCompleted: false,

      setBaby: (profile) =>
        set((state) => ({ baby: { ...state.baby, ...profile } })),

      setHealthMode: (mode) => set({ healthMode: mode }),

      completeOnboarding: () => set({ onboardingCompleted: true }),

      resetProfile: () =>
        set({
          baby: defaultBaby,
          healthMode: "normal",
          onboardingCompleted: false,
        }),
    }),
    {
      name: "bebi-baby-profile",
    }
  )
);