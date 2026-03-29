import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { RecipeForm } from "@/components/admin/recipe-form";
import { updateRecipe } from "@/app/admin/actions";
import type { RecipeWithDetails } from "@/lib/supabase/recipes";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getRecipe(id: string): Promise<RecipeWithDetails | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;
  const { data } = await db
    .from("recipes")
    .select("*, recipe_ingredients(*)")
    .eq("id", id)
    .single();
  return (data as RecipeWithDetails) ?? null;
}

export default async function DuzenlePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipe(id);
  if (!recipe) notFound();

  const action = updateRecipe.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tarifi Düzenle</h1>
        <p className="text-muted-foreground text-sm mt-1">{recipe.title}</p>
      </div>
      <RecipeForm initial={recipe} action={action} />
    </div>
  );
}
