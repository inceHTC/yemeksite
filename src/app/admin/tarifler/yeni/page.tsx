import { RecipeForm } from "@/components/admin/recipe-form";
import { createRecipe } from "@/app/admin/actions";

export default function YeniTarifPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Yeni Tarif</h1>
        <p className="text-muted-foreground text-sm mt-1">Yeni bir tarif oluşturun</p>
      </div>
      <RecipeForm action={createRecipe} />
    </div>
  );
}
