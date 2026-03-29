import { ArticleForm } from "@/components/admin/article-form";
import { createArticle } from "@/app/admin/actions";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function YeniMakalePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/akademi"
          className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold">Yeni Makale</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Akademi için yeni bir makale oluşturun</p>
        </div>
      </div>

      <ArticleForm action={createArticle} />
    </div>
  );
}
