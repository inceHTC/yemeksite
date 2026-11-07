"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Page Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <span className="text-5xl mb-4">😔</span>
      <h1 className="font-heading text-2xl font-bold mb-2">Bir şeyler ters gitti</h1>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Bu sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          Tekrar Dene
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted transition-all"
        >
          Ana Sayfa
        </Link>
      </div>
      {error.digest && (
        <p className="text-xs text-muted-foreground/50 mt-4">Hata kodu: {error.digest}</p>
      )}
    </div>
  );
}
