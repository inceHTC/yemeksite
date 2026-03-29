"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { createClient } from "@/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDB = any;

export interface IngredientInput {
  name: string;
  amount: number | null;
  unit: string;
  is_optional: boolean;
  substitute: string | null;
  order: number;
}

export interface RecipeInput {
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  age_min_months: number;
  age_max_months: number;
  prep_time_min: number;
  cook_time_min: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  meal_type: "breakfast" | "lunch" | "dinner" | "snack" | "puree";
  texture: "smooth" | "lumpy" | "chunky" | "finger";
  is_freezable: boolean;
  freeze_notes: string | null;
  is_dairy_free: boolean;
  is_gluten_free: boolean;
  is_sugar_free: boolean;
  health_tags: string[];
  nutritional_info: Record<string, number>;
  instructions: string | null;
  is_published: boolean;
  ingredients: IngredientInput[];
}

// ─── Otomatik Etiket Tespiti ─────────────────────────────────────────────────

const GLUTEN_INGREDIENTS = [
  "un", "buğday", "arpa", "çavdar", "yulaf", "irmik", "bulgur", "ekmek",
  "makarna", "erişte", "şehriye", "bisküvi", "kraker", "galeta", "puf",
  "waffle", "pancake", "gofret",
];

const GAS_CAUSING_INGREDIENTS = [
  "lahana", "brokoli", "karnabahar", "brüksel", "fasulye", "nohut",
  "mercimek", "bezelye", "soğan", "sarımsak", "pırasa", "turp", "şalgam",
  "mısır",
];

const GAS_FRIENDLY_INGREDIENTS = [
  "rezene", "zencefil", "anason", "kimyon", "dereotu", "nane",
  "havuç", "patates", "muz", "armut", "elma", "pirinç", "yoğurt",
];

const FIBER_INGREDIENTS = [
  "erik", "kuru erik", "armut", "incir", "kuru incir", "bezelye",
  "brokoli", "ıspanak", "mercimek", "nohut", "fasulye", "avokado",
  "kahverengi pirinç", "keten tohumu", "chia", "şeftali", "kayısı",
  "kuru kayısı", "mango", "kiraz", "mürdüm eriği",
];

function normalizeText(text: string) {
  return text.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c");
}

function hasAny(names: string[], list: string[]) {
  return list.some((item) =>
    names.some((name) => normalizeText(name).includes(normalizeText(item)))
  );
}

function autoTag(data: RecipeInput): Pick<RecipeInput, "is_gluten_free" | "health_tags"> {
  const names = data.ingredients.map((i) => i.name);

  const isGlutenFree = !hasAny(names, GLUTEN_INGREDIENTS);

  const hasFriendly = hasAny(names, GAS_FRIENDLY_INGREDIENTS);
  const hasCausing = hasAny(names, GAS_CAUSING_INGREDIENTS);
  const isGasFriendly = hasFriendly && !hasCausing;

  const hasConstipation = hasAny(names, FIBER_INGREDIENTS);

  // Admin'in elle eklediği diğer etiketleri koru (immunity, teething)
  const preserved = data.health_tags.filter(
    (t) => t !== "gas_friendly" && t !== "constipation"
  );
  const newTags = [
    ...preserved,
    ...(isGasFriendly ? ["gas_friendly"] : []),
    ...(hasConstipation ? ["constipation"] : []),
  ];

  return { is_gluten_free: isGlutenFree, health_tags: newTags };
}

// ─────────────────────────────────────────────────────────────────────────────

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");
}

export async function createRecipe(data: RecipeInput) {
  await assertAdmin();
  const db = createAdminClient() as AnyDB;

  const { ingredients, ...recipeData } = { ...data, ...autoTag(data) };

  const { data: recipe, error } = await db
    .from("recipes")
    .insert(recipeData)
    .select()
    .single();

  if (error) return { error: error.message };

  if (ingredients.length > 0) {
    await db.from("recipe_ingredients").insert(
      ingredients.map((ing) => ({ ...ing, recipe_id: recipe.id }))
    );
  }

  revalidatePath("/tarifler");
  revalidatePath("/admin/tarifler");
  redirect("/admin/tarifler");
}

export async function updateRecipe(id: string, data: RecipeInput) {
  await assertAdmin();
  const db = createAdminClient() as AnyDB;

  const { ingredients, ...recipeData } = { ...data, ...autoTag(data) };

  const { error } = await db.from("recipes").update(recipeData).eq("id", id);
  if (error) return { error: error.message };

  await db.from("recipe_ingredients").delete().eq("recipe_id", id);

  if (ingredients.length > 0) {
    await db.from("recipe_ingredients").insert(
      ingredients.map((ing) => ({ ...ing, recipe_id: id }))
    );
  }

  revalidatePath("/tarifler");
  revalidatePath(`/tarifler/${data.slug}`);
  revalidatePath("/admin/tarifler");
  redirect("/admin/tarifler");
}

export async function deleteRecipe(id: string) {
  await assertAdmin();
  const db = createAdminClient() as AnyDB;
  await db.from("recipe_ingredients").delete().eq("recipe_id", id);
  await db.from("recipes").delete().eq("id", id);
  revalidatePath("/tarifler");
  revalidatePath("/admin/tarifler");
}

export async function togglePublish(id: string, published: boolean) {
  await assertAdmin();
  const db = createAdminClient() as AnyDB;
  await db.from("recipes").update({ is_published: published }).eq("id", id);
  revalidatePath("/tarifler");
  revalidatePath("/admin/tarifler");
}

export async function uploadRecipeImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Dosya seçilmedi" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp", "avif"];
  if (!allowed.includes(ext)) return { error: "Desteklenmeyen dosya formatı" };

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const db = createAdminClient() as AnyDB;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await db.storage
    .from("recipes")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data: publicData } = db.storage
    .from("recipes")
    .getPublicUrl(data.path);

  return { url: publicData.publicUrl };
}

// ─── Akademi / Makale Actions ───────────────────────────────────────────────

export interface ArticleInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "nutrition" | "development" | "health" | "safety";
  image_url: string | null;
  reading_time_min: number;
  sources: string[];
  is_published: boolean;
}

export async function createArticle(data: ArticleInput) {
  await assertAdmin();
  const db = createAdminClient() as AnyDB;

  const { error } = await db.from("articles").insert({
    ...data,
    sources: data.sources,
  });

  if (error) return { error: error.message };

  revalidatePath("/akademi");
  revalidatePath("/admin/akademi");
  redirect("/admin/akademi");
}

export async function updateArticle(id: string, data: ArticleInput) {
  await assertAdmin();
  const db = createAdminClient() as AnyDB;

  const { error } = await db.from("articles").update({
    ...data,
    sources: data.sources,
  }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/akademi");
  revalidatePath(`/akademi/${data.slug}`);
  revalidatePath("/admin/akademi");
  redirect("/admin/akademi");
}

export async function deleteArticle(id: string) {
  await assertAdmin();
  const db = createAdminClient() as AnyDB;
  await db.from("articles").delete().eq("id", id);
  revalidatePath("/akademi");
  revalidatePath("/admin/akademi");
}

export async function toggleArticlePublish(id: string, published: boolean) {
  await assertAdmin();
  const db = createAdminClient() as AnyDB;
  await db.from("articles").update({ is_published: published }).eq("id", id);
  revalidatePath("/akademi");
  revalidatePath("/admin/akademi");
}

export async function uploadArticleImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Dosya seçilmedi" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp", "avif"];
  if (!allowed.includes(ext)) return { error: "Desteklenmeyen dosya formatı" };

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const db = createAdminClient() as AnyDB;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await db.storage
    .from("articles")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (error) return { error: error.message };

  const { data: publicData } = db.storage
    .from("articles")
    .getPublicUrl(data.path);

  return { url: publicData.publicUrl };
}
