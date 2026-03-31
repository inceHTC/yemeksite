import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export interface PlannedMeal {
  recipeId: string;
  recipeSlug: string;
  recipeTitle: string;
  recipeImage: string | null;
  servings: number;
}

export type WeekPlan = {
  [day: number]: {        // 0 = Pazartesi … 6 = Pazar
    [slot in MealSlot]?: PlannedMeal;
  };
};

interface MenuStore {
  plan: WeekPlan;
  addMeal: (day: number, slot: MealSlot, meal: PlannedMeal) => void;
  removeMeal: (day: number, slot: MealSlot) => void;
  clearPlan: () => void;
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      plan: {},

      addMeal: (day, slot, meal) =>
        set((state) => ({
          plan: {
            ...state.plan,
            [day]: { ...state.plan[day], [slot]: meal },
          },
        })),

      removeMeal: (day, slot) =>
        set((state) => {
          const dayPlan = { ...state.plan[day] };
          delete dayPlan[slot];
          return { plan: { ...state.plan, [day]: dayPlan } };
        }),

      clearPlan: () => set({ plan: {} }),
    }),
    { name: "tok-bebek-menu-plan" }
  )
);
