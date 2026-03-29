import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { ArticleForm } from "@/components/admin/article-form";
import { updateArticle } from "@/app/admin/actions";
import type { Article } from "@/types/supabase";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DuzenleArticlePage({ params }: PageProps) {
  const { id } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createAdminClient() as any;

  const { data: article } = await db
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (!article) notFound();

  const boundAction = updateArticle.bind(null, id);

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
          <h1 className="font-heading text-2xl font-bold">Makaleyi Düzenle</h1>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{article.title}</p>
        </div>
      </div>

      <ArticleForm initial={article as Article} action={boundAction} />
    </div>
  );
}
