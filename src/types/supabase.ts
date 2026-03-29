// Supabase type tanımları (clean version)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    PostgrestVersion: "12";
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["profiles"]["Insert"]
        >;
      };

      babies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          birth_date: string;
          gender: "girl" | "boy"; // 🔥 temizlendi
          allergies: string[];
          health_notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["babies"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["babies"]["Insert"]
        >;
      };

      recipes: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          image_url: string | null;
          age_min_months: number;
          age_max_months: number;
          prep_time_min: number;
          cook_time_min: number;
          servings: number;
          difficulty: "easy" | "medium" | "hard";
          meal_type:
            | "breakfast"
            | "lunch"
            | "dinner"
            | "snack"
            | "puree";
          texture: "smooth" | "lumpy" | "chunky" | "finger";
          is_freezable: boolean;
          is_dairy_free: boolean;
          is_gluten_free: boolean;
          is_sugar_free: boolean;
          health_tags: string[];
          nutritional_info: Json;
          instructions: string | null;
          is_published: boolean;
          view_count: number;
          save_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["recipes"]["Row"],
          "id" | "view_count" | "save_count" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["recipes"]["Insert"]
        >;
      };

      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          name: string;
          amount: number;
          unit: string;
          is_optional: boolean;
          substitute: string | null;
          order: number;
        };
        Insert: Omit<
          Database["public"]["Tables"]["recipe_ingredients"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["recipe_ingredients"]["Insert"]
        >;
      };

      saved_recipes: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["saved_recipes"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["saved_recipes"]["Insert"]
        >;
      };

      recipe_reviews: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          baby_age_at_review: number | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["recipe_reviews"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["recipe_reviews"]["Insert"]
        >;
      };

      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          category:
            | "nutrition"
            | "development"
            | "health"
            | "safety";
          image_url: string | null;
          reading_time_min: number;
          sources: Json;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["articles"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["articles"]["Insert"]
        >;
      };

      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          baby_birth_date: string | null;
          is_active: boolean;
          subscribed_at: string;
        };
        Insert: {
          email: string;
          name?: string | null;
          baby_birth_date?: string | null;
          is_active?: boolean;
        };
        Update: {
          email?: string;
          name?: string | null;
          baby_birth_date?: string | null;
          is_active?: boolean;
        };
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// 🔥 kısa tipler
export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type RecipeIngredient =
  Database["public"]["Tables"]["recipe_ingredients"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Baby = Database["public"]["Tables"]["babies"]["Row"];