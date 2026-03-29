import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "puree";
export type Texture = "smooth" | "lumpy" | "chunky" | "finger";
export type DietFilter = "dairy_free" | "gluten_free" | "sugar_free" | "vegan";
export type HealthTag = "gas_friendly" | "teething" | "constipation" | "immunity";
export type SortOption = "newest" | "popular" | "most_saved" | "quickest";

export interface RecipeFilters {
  ageMin: number | null;
  ageMax: number | null;
  mealType: MealType | null;
  texture: Texture | null;
  diet: DietFilter[];
  healthTags: HealthTag[];
  maxMinutes: number | null;
  freezable: boolean | null;
  sort: SortOption;
}

interface RecipeStore {
  filters: RecipeFilters;
  savedRecipeIds: string[];
  recentlyViewedIds: string[];

  setFilter: <K extends keyof RecipeFilters>(key: K, value: RecipeFilters[K]) => void;
  resetFilters: () => void;
  toggleSaved: (id: string) => void;
  addRecentlyViewed: (id: string) => void;
}

const defaultFilters: RecipeFilters = {
  ageMin: null,
  ageMax: null,
  mealType: null,
  texture: null,
  diet: [],
  healthTags: [],
  maxMinutes: null,
  freezable: null,
  sort: "newest",
};

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      savedRecipeIds: [],
      recentlyViewedIds: [],

      setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),

      resetFilters: () => set({ filters: defaultFilters }),

      toggleSaved: (id) =>
        set((state) => ({
          savedRecipeIds: state.savedRecipeIds.includes(id)
            ? state.savedRecipeIds.filter((r) => r !== id)
            : [...state.savedRecipeIds, id],
        })),

      addRecentlyViewed: (id) =>
        set((state) => ({
          recentlyViewedIds: [
            id,
            ...state.recentlyViewedIds.filter((r) => r !== id),
          ].slice(0, 20),
        })),
    }),
    {
      name: "bebi-recipes",
    }
  )
);
